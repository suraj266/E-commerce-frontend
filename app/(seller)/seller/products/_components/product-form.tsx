"use client";

/**
 * Product create/edit form — shared by /new and /[id].
 *
 * 8 sections, each in a Card:
 *   1. Basics       — name, slug, store, category, brand, descriptions
 *   2. Media        — image gallery (drag-drop add via ImageUploader)
 *   3. Pricing      — price, compare price, cost price, SKU
 *   4. Tags         — multi-select chip picker
 *   5. Specifications — dynamic groups + items
 *   6. Logistics    — weight, dims, isDigital
 *   7. SEO          — title, description, keywords
 *   8. Status       — DRAFT / ACTIVE / INACTIVE (+ delete in edit mode)
 *
 * Path A pricing: form has flat `price`/`sku`. Backend creates the implicit
 * variant transparently.
 */

import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useMutation, useQuery } from "@apollo/client/react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import {
  Box,
  ChevronLeft,
  ExternalLink,
  GripVertical,
  Image as ImageIcon,
  Layers,
  Loader2,
  Plus,
  Save,
  Star,
  StarOff,
  Tag as TagIcon,
  Trash2,
  X,
} from "lucide-react";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  useSortable,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

import { GET_BRANDS } from "@/lib/graphql/brands";
import { GET_TAGS } from "@/lib/graphql/tags";
import { GET_MY_STORES } from "@/lib/graphql/stores";
import { GET_TAXES } from "@/lib/graphql/taxes";
import {
  ADD_MY_PRODUCT_IMAGE,
  CREATE_MY_PRODUCT,
  GET_MY_PRODUCTS,
  REMOVE_MY_PRODUCT,
  REMOVE_MY_PRODUCT_IMAGE,
  REORDER_MY_PRODUCT_IMAGES,
  SET_MY_PRODUCT_STATUS,
  UPDATE_MY_PRODUCT,
  UPDATE_MY_PRODUCT_IMAGE,
} from "@/lib/graphql/products";

import {
  AddMyProductImageData,
  CreateMyProductData,
  parseSpecifications,
  Product,
  ProductImage,
  PRODUCT_STATUSES,
  PRODUCT_STATUS_LABEL,
  ProductStatus,
  RemoveMyProductData,
  RemoveMyProductImageData,
  ReorderMyProductImagesData,
  serializeSpecifications,
  SetMyProductStatusData,
  Specifications,
  UpdateMyProductData,
  UpdateMyProductImageData,
} from "@/types/product.types";
import { Brand } from "@/types/brand.types";
import { Tag } from "@/types/tag.types";
import { Store } from "@/types/store.types";
import { Tax, GetTaxesData } from "@/types/tax.types";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { ImageUploader } from "@/components/media/image-uploader";
import { CategoryCascader } from "@/components/category/category-cascader";

// ---------------------------------------------------------------------------
// Schema
// ---------------------------------------------------------------------------
const productSchema = z.object({
  storeId: z.string().uuid("Pick a store"),
  name: z.string().min(2, "At least 2 characters").max(200),
  slug: z
    .string()
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "lowercase, digits, hyphens")
    .optional()
    .or(z.literal("")),
  categoryId: z.string().uuid().optional().or(z.literal("")),
  brandId: z.string().uuid().optional().or(z.literal("")),
  shortDescription: z.string().max(500).optional(),
  description: z.string().optional(),

  productType: z.enum(["SIMPLE", "VARIABLE"]),

  price: z.coerce.number().min(0, "Must be ≥ 0").optional().or(z.literal("")),
  compareAtPrice: z.coerce.number().min(0).optional().or(z.literal("")),
  costPrice: z.coerce.number().min(0).optional().or(z.literal("")),
  sku: z.string().min(2).max(60).optional().or(z.literal("")),

  weight: z.coerce.number().min(0).optional().or(z.literal("")),
  length: z.coerce.number().min(0).optional().or(z.literal("")),
  width: z.coerce.number().min(0).optional().or(z.literal("")),
  height: z.coerce.number().min(0).optional().or(z.literal("")),
  isDigital: z.boolean(),

  /** Tax — pick from admin-managed catalog. UUID or empty (no tax assigned). */
  taxId: z.string().uuid().optional().or(z.literal("")),

  /** HSN code — 4/6/8 digits required for GST. Validated as digits-only. */
  hsnCode: z
    .string()
    .regex(/^(\d{4}|\d{6}|\d{8})$/, "HSN code must be 4, 6, or 8 digits")
    .optional()
    .or(z.literal("")),

  seoTitle: z.string().max(70).optional(),
  seoDescription: z.string().max(200).optional(),
  seoKeywords: z.array(z.string()).default([]),

  tagIds: z.array(z.string().uuid()).default([]),
});
type ProductFormValues = z.infer<typeof productSchema>;

// ===========================================================================
interface ProductFormProps {
  /** Existing product being edited (omit for create). */
  product?: Product;
}

export function ProductForm({ product }: ProductFormProps) {
  const router = useRouter();
  const isEdit = !!product;

  // -- Reference data --
  const { data: storesData } = useQuery<{ myStores: Store[] }>(GET_MY_STORES, {
    fetchPolicy: "cache-and-network",
  });
  const { data: brandsData } = useQuery<{ brands: Brand[] }>(GET_BRANDS, {
    fetchPolicy: "cache-first",
  });
  // Categories are fetched lazily by the CategoryCascader per level; no need
  // for a top-level full-tree query here anymore.
  const { data: tagsData } = useQuery<{ tags: Tag[] }>(GET_TAGS, {
    fetchPolicy: "cache-first",
  });
  const { data: taxesData } = useQuery<GetTaxesData>(GET_TAXES, {
    fetchPolicy: "cache-and-network",
  });

  const stores = storesData?.myStores ?? [];
  const activeStores = stores.filter((s) => s.status === "ACTIVE");
  const brands = brandsData?.brands ?? [];
  const tags = tagsData?.tags ?? [];
  const taxes: Tax[] = taxesData?.taxes ?? [];

  // -- Specifications state (separate from form because dynamic) --
  const [specs, setSpecs] = useState<Specifications>(() =>
    product ? parseSpecifications(product.specifications) : [],
  );

  // -- Image state — for edit mode, shows existing images with reorder/delete --
  const [images, setImages] = useState<ProductImage[]>(product?.images ?? []);

  const [keywordInput, setKeywordInput] = useState("");

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const form = useForm<ProductFormValues>({
    resolver: zodResolver(productSchema as any) as any,
    defaultValues: {
      storeId: product?.storeId ?? "",
      name: product?.name ?? "",
      slug: product?.slug ?? "",
      categoryId: product?.categoryId ?? "",
      brandId: product?.brandId ?? "",
      shortDescription: product?.shortDescription ?? "",
      description: product?.description ?? "",
      productType: (product?.productType as "SIMPLE" | "VARIABLE") ?? "SIMPLE",
      price: product?.price ?? "",
      compareAtPrice: product?.compareAtPrice ?? "",
      costPrice: product?.costPrice ?? "",
      sku: product?.sku ?? "",
      weight: product?.weight ?? "",
      length: product?.length ?? "",
      width: product?.width ?? "",
      height: product?.height ?? "",
      isDigital: product?.isDigital ?? false,
      taxId: product?.taxId ?? "",
      hsnCode: product?.hsnCode ?? "",
      seoTitle: product?.seoTitle ?? "",
      seoDescription: product?.seoDescription ?? "",
      seoKeywords: product?.seoKeywords ?? [],
      tagIds: product?.tags?.map((t) => t.id) ?? [],
    },
  });

  // Default to the first ACTIVE store on create
  useEffect(() => {
    if (!isEdit && !form.getValues("storeId") && activeStores[0]) {
      form.setValue("storeId", activeStores[0].id);
    }
  }, [activeStores, form, isEdit]);

  // -- Mutations --
  const [createMyProduct, { loading: creating }] = useMutation<CreateMyProductData>(
    CREATE_MY_PRODUCT,
    {
      refetchQueries: [{ query: GET_MY_PRODUCTS, variables: { status: null } }],
    },
  );

  const [updateMyProduct, { loading: updating }] = useMutation<UpdateMyProductData>(
    UPDATE_MY_PRODUCT,
    {
      refetchQueries: [{ query: GET_MY_PRODUCTS, variables: { status: null } }],
    },
  );

  const [setStatus, { loading: settingStatus }] =
    useMutation<SetMyProductStatusData>(SET_MY_PRODUCT_STATUS);

  const [removeMyProduct, { loading: removing }] = useMutation<RemoveMyProductData>(
    REMOVE_MY_PRODUCT,
    {
      refetchQueries: [{ query: GET_MY_PRODUCTS, variables: { status: null } }],
    },
  );

  const [deletingDialog, setDeletingDialog] = useState(false);

  // Save action
  async function onSubmit(values: ProductFormValues) {
    const isVariable = values.productType === "VARIABLE";
    const baseInput = {
      name: values.name,
      slug: values.slug || undefined,
      categoryId: values.categoryId || undefined,
      brandId: values.brandId || undefined,
      shortDescription: values.shortDescription || undefined,
      description: values.description || undefined,
      // Pricing only for SIMPLE — VARIABLE products price per variant
      price: isVariable
        ? undefined
        : values.price === "" ? 0 : Number(values.price),
      compareAtPrice:
        isVariable || values.compareAtPrice === ""
          ? undefined
          : Number(values.compareAtPrice),
      costPrice:
        isVariable || values.costPrice === ""
          ? undefined
          : Number(values.costPrice),
      sku: isVariable ? undefined : values.sku || undefined,
      weight: values.weight === "" ? undefined : Number(values.weight),
      length: values.length === "" ? undefined : Number(values.length),
      width: values.width === "" ? undefined : Number(values.width),
      height: values.height === "" ? undefined : Number(values.height),
      isDigital: values.isDigital,
      taxId: values.taxId || undefined,
      hsnCode: values.hsnCode || undefined,
      seoTitle: values.seoTitle || undefined,
      seoDescription: values.seoDescription || undefined,
      seoKeywords: values.seoKeywords,
      specifications: serializeSpecifications(specs),
      tagIds: values.tagIds,
    };

    try {
      if (isEdit && product) {
        await updateMyProduct({
          variables: {
            updateProductInput: { id: product.id, ...baseInput },
          },
        });
        toast.success("Product updated");
      } else {
        const res = await createMyProduct({
          variables: {
            createProductInput: {
              storeId: values.storeId,
              productType: values.productType,
              ...baseInput,
            },
          },
        });
        const newId = res.data?.createMyProduct.id;
        if (newId) {
          if (isVariable) {
            toast.success("Product created — now configure variants");
            router.push(`/seller/products/${newId}/variants`);
          } else {
            toast.success("Product created — now add images and publish");
            router.push(`/seller/products/${newId}`);
          }
        }
      }
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Save failed";
      toast.error(msg);
    }
  }

  async function handleStatusChange(next: ProductStatus) {
    if (!product) return;
    try {
      await setStatus({
        variables: {
          setProductStatusInput: { id: product.id, status: next },
        },
      });
      toast.success(`Status → ${PRODUCT_STATUS_LABEL[next]}`);
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Status change failed";
      toast.error(msg);
    }
  }

  async function handleDelete() {
    if (!product) return;
    try {
      await removeMyProduct({ variables: { id: product.id } });
      toast.success("Product deleted");
      router.push("/seller/products");
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Delete failed";
      toast.error(msg);
    }
  }

  // Keywords as chips
  function addKeyword() {
    const k = keywordInput.trim();
    if (!k) return;
    const current = form.getValues("seoKeywords") ?? [];
    if (current.includes(k)) return;
    form.setValue("seoKeywords", [...current, k]);
    setKeywordInput("");
  }
  function removeKeyword(k: string) {
    const current = form.getValues("seoKeywords") ?? [];
    form.setValue(
      "seoKeywords",
      current.filter((x) => x !== k),
    );
  }

  const isSaving = creating || updating;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <Button variant="ghost" size="sm" asChild>
          <Link href="/seller/products">
            <ChevronLeft className="mr-1 h-4 w-4" />
            All products
          </Link>
        </Button>

        {isEdit && product && (
          <div className="flex items-center gap-2 flex-wrap">
            <Badge variant="outline" className="text-xs">
              {PRODUCT_STATUS_LABEL[product.status]}
            </Badge>
            {product.status === "ACTIVE" && (
              <Button variant="outline" size="sm" asChild>
                <Link href={`/product/${product.slug}`} target="_blank">
                  <ExternalLink className="mr-1 h-3 w-3" />
                  View
                </Link>
              </Button>
            )}
          </div>
        )}
      </div>

      <div>
        <h1 className="text-2xl font-bold tracking-tight flex items-center gap-2">
          <Box className="h-6 w-6 text-primary" />
          {isEdit ? `Edit ${product?.name ?? "Product"}` : "Add Product"}
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          {isEdit
            ? "Update fields. Status and image management at the bottom."
            : "Create as DRAFT first. Add images + publish on the next screen."}
        </p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          {/* -------------------- Section 1: Basics -------------------- */}
          <Card>
            <CardHeader>
              <CardTitle>Basics</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {!isEdit && (
                <FormField
                  control={form.control}
                  name="storeId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Store *</FormLabel>
                      <Select value={field.value} onValueChange={field.onChange}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select an active store" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {activeStores.length === 0 && (
                            <SelectItem value="none" disabled>
                              No active stores — create one first
                            </SelectItem>
                          )}
                          {activeStores.map((s) => (
                            <SelectItem key={s.id} value={s.id}>
                              {s.name} ({s.currencyCode})
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}

              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Product Name *</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g. Wireless Bluetooth Earbuds" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="slug"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Slug</FormLabel>
                    <FormControl>
                      <Input placeholder="auto-generated-if-blank" {...field} />
                    </FormControl>
                    <FormDescription className="text-xs">
                      Public URL: /product/[slug]
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="categoryId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Category</FormLabel>
                      <FormControl>
                        <CategoryCascader
                          value={field.value || null}
                          onChange={(id) => field.onChange(id ?? "")}
                          rootPlaceholder="Pick a category..."
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="brandId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Brand</FormLabel>
                      <Select
                        value={field.value || "none"}
                        onValueChange={(v) =>
                          field.onChange(v === "none" ? "" : v)
                        }
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Pick a brand" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="none">— No brand —</SelectItem>
                          {brands.map((b) => (
                            <SelectItem key={b.id} value={b.id}>
                              {b.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="shortDescription"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Short Description</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="One-line tagline shown on listings"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription className="text-xs">
                      Max 500 characters.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Full Description</FormLabel>
                    <FormControl>
                      <textarea
                        className="flex min-h-[140px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                        placeholder="Detailed description shown on the product page"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>

          {/* -------------------- Section 1.5: Product Type -------------------- */}
          {!isEdit && (
            <Card>
              <CardHeader>
                <CardTitle>Product Type</CardTitle>
              </CardHeader>
              <CardContent>
                <FormField
                  control={form.control}
                  name="productType"
                  render={({ field }) => (
                    <FormItem>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        <button
                          type="button"
                          onClick={() => field.onChange("SIMPLE")}
                          className={`text-left rounded-md border p-4 transition ${
                            field.value === "SIMPLE"
                              ? "border-primary ring-2 ring-primary bg-primary/5"
                              : "border-border hover:border-foreground/40"
                          }`}
                        >
                          <div className="font-semibold">Simple</div>
                          <div className="text-xs text-muted-foreground mt-1">
                            One SKU, one price. Easiest to set up.
                          </div>
                        </button>
                        <button
                          type="button"
                          onClick={() => field.onChange("VARIABLE")}
                          className={`text-left rounded-md border p-4 transition ${
                            field.value === "VARIABLE"
                              ? "border-primary ring-2 ring-primary bg-primary/5"
                              : "border-border hover:border-foreground/40"
                          }`}
                        >
                          <div className="font-semibold">Variable</div>
                          <div className="text-xs text-muted-foreground mt-1">
                            Multiple variants by Color/Size/etc. Configure on
                            the next screen.
                          </div>
                        </button>
                      </div>
                      <FormDescription className="text-xs mt-2">
                        Type is locked once the product is created.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>
          )}
          {isEdit && product && (
            <Card>
              <CardHeader>
                <CardTitle>Product Type</CardTitle>
              </CardHeader>
              <CardContent className="flex items-center justify-between">
                <div>
                  <div className="font-semibold">{product.productType}</div>
                  <div className="text-xs text-muted-foreground mt-0.5">
                    {product.productType === "VARIABLE"
                      ? "Manage variants below"
                      : "Single SKU product"}
                  </div>
                </div>
                {product.productType === "VARIABLE" && (
                  <Button asChild variant="outline" size="sm">
                    <Link href={`/seller/products/${product.id}/variants`}>
                      Manage variants
                    </Link>
                  </Button>
                )}
              </CardContent>
            </Card>
          )}

          {/* -------------------- Section 2: Media -------------------- */}
          {isEdit && product ? (
            <ImagesCard
              product={product}
              images={images}
              onImagesChange={setImages}
            />
          ) : (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <ImageIcon className="h-5 w-5" />
                  Media
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Save the product first, then upload images on the next screen.
                </p>
              </CardContent>
            </Card>
          )}

          {/* -------------------- Section 3: Pricing (SIMPLE only) -------------------- */}
          {form.watch("productType") === "SIMPLE" ? (
          <Card>
            <CardHeader>
              <CardTitle>Pricing</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <FormField
                  control={form.control}
                  name="price"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Price *</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          min={0}
                          step={0.01}
                          placeholder="999"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="compareAtPrice"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Compare-at Price</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          min={0}
                          step={0.01}
                          placeholder="1499"
                          {...field}
                        />
                      </FormControl>
                      <FormDescription className="text-xs">
                        Strike-through MRP for discount perception.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="costPrice"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Cost Price</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          min={0}
                          step={0.01}
                          placeholder="500"
                          {...field}
                        />
                      </FormControl>
                      <FormDescription className="text-xs">
                        Internal cost for margin tracking. Not shown publicly.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="sku"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>SKU</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="auto-generated if blank"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>
          ) : (
            <Card>
              <CardHeader>
                <CardTitle>Pricing</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  This is a variable product — price is set per variant. After
                  saving, configure variants on the management screen.
                </p>
              </CardContent>
            </Card>
          )}

          {/* -------------------- Section 4: Tags -------------------- */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TagIcon className="h-5 w-5" />
                Tags
              </CardTitle>
            </CardHeader>
            <CardContent>
              <FormField
                control={form.control}
                name="tagIds"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Pick from registry</FormLabel>
                    <div className="flex flex-wrap gap-2 pt-2">
                      {tags.length === 0 ? (
                        <p className="text-sm text-muted-foreground italic">
                          No tags available. Ask admin to create some.
                        </p>
                      ) : (
                        tags.map((t) => {
                          const selected = field.value?.includes(t.id);
                          return (
                            <button
                              key={t.id}
                              type="button"
                              onClick={() => {
                                const cur = field.value ?? [];
                                if (selected) {
                                  field.onChange(cur.filter((id) => id !== t.id));
                                } else {
                                  field.onChange([...cur, t.id]);
                                }
                              }}
                              className={`px-3 py-1 rounded-full text-xs border transition ${
                                selected
                                  ? "bg-primary text-primary-foreground border-primary"
                                  : "bg-background text-muted-foreground border-border hover:border-foreground"
                              }`}
                            >
                              #{t.name}
                            </button>
                          );
                        })
                      )}
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>

          {/* -------------------- Section 5: Specifications -------------------- */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Layers className="h-5 w-5" />
                Specifications
              </CardTitle>
            </CardHeader>
            <CardContent>
              <SpecificationsEditor specs={specs} onChange={setSpecs} />
            </CardContent>
          </Card>

          {/* -------------------- Section 6: Logistics -------------------- */}
          <Card>
            <CardHeader>
              <CardTitle>Logistics</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <FormField
                  control={form.control}
                  name="weight"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Weight (kg)</FormLabel>
                      <FormControl>
                        <Input type="number" min={0} step={0.01} {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="length"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Length (cm)</FormLabel>
                      <FormControl>
                        <Input type="number" min={0} step={0.01} {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="width"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Width (cm)</FormLabel>
                      <FormControl>
                        <Input type="number" min={0} step={0.01} {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="height"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Height (cm)</FormLabel>
                      <FormControl>
                        <Input type="number" min={0} step={0.01} {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="isDigital"
                render={({ field }) => (
                  <FormItem className="flex items-center gap-2">
                    <FormControl>
                      <input
                        type="checkbox"
                        checked={field.value}
                        onChange={field.onChange}
                        className="h-4 w-4"
                      />
                    </FormControl>
                    <FormLabel className="!m-0">
                      This is a digital product (no shipping)
                    </FormLabel>
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>

          {/* -------------------- Section 6.5: Tax & Compliance -------------------- */}
          <Card>
            <CardHeader>
              <CardTitle>Tax & Compliance</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <FormField
                control={form.control}
                name="taxId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Applicable Tax</FormLabel>
                    {taxes.length === 0 ? (
                      <p className="text-sm text-muted-foreground italic">
                        No taxes configured yet — admin can add them in
                        /admin/taxes.
                      </p>
                    ) : (
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        {/* "No tax" radio — clears the selection */}
                        <label
                          className={`flex items-center gap-3 rounded-md border px-3 py-2 cursor-pointer transition ${
                            !field.value
                              ? "border-primary bg-primary/5"
                              : "border-border hover:border-foreground/30"
                          }`}
                        >
                          <input
                            type="radio"
                            name="taxId"
                            checked={!field.value}
                            onChange={() => field.onChange("")}
                            className="h-4 w-4"
                          />
                          <span className="text-sm text-muted-foreground italic">
                            None
                          </span>
                        </label>
                        {taxes.map((t) => {
                          const selected = field.value === t.id;
                          return (
                            <label
                              key={t.id}
                              className={`flex items-center gap-3 rounded-md border px-3 py-2 cursor-pointer transition ${
                                selected
                                  ? "border-primary bg-primary/5"
                                  : "border-border hover:border-foreground/30"
                              }`}
                            >
                              <input
                                type="radio"
                                name="taxId"
                                checked={selected}
                                onChange={() => field.onChange(t.id)}
                                className="h-4 w-4"
                              />
                              <span className="flex-1 min-w-0">
                                <span className="block font-medium text-sm truncate">
                                  {t.name}
                                </span>
                                <span className="block text-xs text-muted-foreground font-mono">
                                  {Number(t.rate).toFixed(2)}%
                                </span>
                              </span>
                            </label>
                          );
                        })}
                      </div>
                    )}
                    <FormDescription className="text-xs">
                      Pick the tax rate that applies to this product. Admin
                      manages the catalog at /admin/taxes.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="hsnCode"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>HSN Code</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="e.g. 8517 or 851712 or 85171290"
                        inputMode="numeric"
                        maxLength={8}
                        {...field}
                      />
                    </FormControl>
                    <FormDescription className="text-xs">
                      4, 6, or 8-digit Harmonized System of Nomenclature code.
                      Required on GST invoices.{" "}
                      <a
                        href="https://services.gst.gov.in/services/searchhsnsac"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-primary hover:underline"
                      >
                        Search HSN
                      </a>
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>

          {/* -------------------- Section 7: SEO -------------------- */}
          <Card>
            <CardHeader>
              <CardTitle>SEO</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <FormField
                control={form.control}
                name="seoTitle"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Meta Title</FormLabel>
                    <FormControl>
                      <Input placeholder="Defaults to product name" {...field} />
                    </FormControl>
                    <FormDescription className="text-xs">
                      ≤ 70 characters. Shown as Google search title.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="seoDescription"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Meta Description</FormLabel>
                    <FormControl>
                      <textarea
                        className="flex min-h-[60px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                        placeholder="Defaults to short description"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription className="text-xs">
                      ≤ 200 characters. Shown as Google search snippet.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="seoKeywords"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Keywords</FormLabel>
                    <div className="flex gap-2">
                      <Input
                        value={keywordInput}
                        onChange={(e) => setKeywordInput(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") {
                            e.preventDefault();
                            addKeyword();
                          }
                        }}
                        placeholder="Type and press Enter"
                      />
                      <Button type="button" onClick={addKeyword}>
                        Add
                      </Button>
                    </div>
                    <div className="flex flex-wrap gap-2 pt-2">
                      {(field.value ?? []).map((k) => (
                        <Badge
                          key={k}
                          variant="secondary"
                          className="flex items-center gap-1"
                        >
                          {k}
                          <button
                            type="button"
                            onClick={() => removeKeyword(k)}
                            className="hover:text-destructive"
                          >
                            <X className="h-3 w-3" />
                          </button>
                        </Badge>
                      ))}
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>

          {/* -------------------- Section 8: Status (edit only) -------------------- */}
          {isEdit && product && (
            <Card>
              <CardHeader>
                <CardTitle>Status</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-3 flex-wrap">
                  {(["DRAFT", "ACTIVE", "INACTIVE"] as const).map((s) => (
                    <Button
                      key={s}
                      type="button"
                      variant={product.status === s ? "default" : "outline"}
                      size="sm"
                      onClick={() => handleStatusChange(s)}
                      disabled={settingStatus}
                    >
                      {PRODUCT_STATUS_LABEL[s]}
                    </Button>
                  ))}
                  {product.status === "ARCHIVED" && (
                    <Badge variant="destructive">Archived (admin only)</Badge>
                  )}
                </div>
                <p className="text-xs text-muted-foreground">
                  ACTIVE makes the product visible on your storefront. Requires
                  ≥1 image and price &gt; 0.
                </p>

                {(product.status === "DRAFT" ||
                  product.status === "ARCHIVED") && (
                  <div className="pt-4 border-t">
                    <p className="text-sm font-medium text-destructive mb-2">
                      Danger zone
                    </p>
                    <Button
                      type="button"
                      variant="destructive"
                      size="sm"
                      onClick={() => setDeletingDialog(true)}
                    >
                      <Trash2 className="mr-2 h-4 w-4" />
                      Delete this product
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {/* -------------------- Sticky save bar -------------------- */}
          <div className="sticky bottom-0 -mx-4 sm:-mx-0 bg-background/95 backdrop-blur border-t py-3 px-4 flex justify-end gap-2">
            <Button type="button" variant="outline" asChild>
              <Link href="/seller/products">Cancel</Link>
            </Button>
            <Button type="submit" disabled={isSaving}>
              {isSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              <Save className="mr-2 h-4 w-4" />
              {isEdit ? "Save changes" : "Create as Draft"}
            </Button>
          </div>
        </form>
      </Form>

      {/* Delete confirm dialog */}
      <AlertDialog
        open={deletingDialog}
        onOpenChange={(o) => !o && setDeletingDialog(false)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete product?</AlertDialogTitle>
            <AlertDialogDescription>
              {product && (
                <>
                  Soft-delete &ldquo;{product.name}&rdquo;? The record stays in
                  the database with a deletion timestamp.
                </>
              )}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              onClick={handleDelete}
              disabled={removing}
            >
              {removing && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

// ===========================================================================
// Specifications editor — dynamic groups + items, drag-drop reorder
// ===========================================================================
function SpecificationsEditor({
  specs,
  onChange,
}: {
  specs: Specifications;
  onChange: (s: Specifications) => void;
}) {
  function addGroup() {
    onChange([
      ...specs,
      {
        name: `Group ${specs.length + 1}`,
        order: specs.length,
        items: [],
      },
    ]);
  }

  function updateGroup(idx: number, patch: Partial<Specifications[number]>) {
    const next = [...specs];
    next[idx] = { ...next[idx], ...patch };
    onChange(next);
  }

  function removeGroup(idx: number) {
    onChange(specs.filter((_, i) => i !== idx).map((g, i) => ({ ...g, order: i })));
  }

  function addItem(groupIdx: number) {
    const next = [...specs];
    next[groupIdx] = {
      ...next[groupIdx],
      items: [
        ...next[groupIdx].items,
        { label: "", value: "", order: next[groupIdx].items.length },
      ],
    };
    onChange(next);
  }

  function updateItem(
    groupIdx: number,
    itemIdx: number,
    patch: { label?: string; value?: string },
  ) {
    const next = [...specs];
    const items = [...next[groupIdx].items];
    items[itemIdx] = { ...items[itemIdx], ...patch };
    next[groupIdx] = { ...next[groupIdx], items };
    onChange(next);
  }

  function removeItem(groupIdx: number, itemIdx: number) {
    const next = [...specs];
    next[groupIdx] = {
      ...next[groupIdx],
      items: next[groupIdx].items
        .filter((_, i) => i !== itemIdx)
        .map((it, i) => ({ ...it, order: i })),
    };
    onChange(next);
  }

  return (
    <div className="space-y-4">
      {specs.length === 0 && (
        <p className="text-sm text-muted-foreground italic text-center py-4">
          No specs yet. Click &quot;Add group&quot; to start (e.g. General,
          Display, Battery).
        </p>
      )}

      {specs.map((group, gi) => (
        <div
          key={gi}
          className="border rounded-md p-3 space-y-3 bg-muted/30"
        >
          <div className="flex items-center gap-2">
            <Input
              placeholder="Group name (e.g. Display)"
              value={group.name}
              onChange={(e) => updateGroup(gi, { name: e.target.value })}
              className="font-semibold"
            />
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="text-destructive hover:text-destructive"
              onClick={() => removeGroup(gi)}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>

          <div className="space-y-2 pl-2 border-l-2 border-border">
            {group.items.map((item, ii) => (
              <div key={ii} className="flex items-center gap-2">
                <Input
                  placeholder="Label (e.g. Display Size)"
                  value={item.label}
                  onChange={(e) =>
                    updateItem(gi, ii, { label: e.target.value })
                  }
                  className="flex-1"
                />
                <span className="text-muted-foreground">:</span>
                <Input
                  placeholder='Value (e.g. "6.1 inch OLED")'
                  value={item.value}
                  onChange={(e) =>
                    updateItem(gi, ii, { value: e.target.value })
                  }
                  className="flex-1"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={() => removeItem(gi, ii)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ))}
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => addItem(gi)}
            >
              <Plus className="mr-1 h-3 w-3" />
              Add item
            </Button>
          </div>
        </div>
      ))}

      <Button type="button" variant="outline" onClick={addGroup}>
        <Plus className="mr-2 h-4 w-4" />
        Add group
      </Button>
    </div>
  );
}

// ===========================================================================
// Images card — only in edit mode (need productId for backend mutation)
// ===========================================================================
function ImagesCard({
  product,
  images,
  onImagesChange,
}: {
  product: Product;
  images: ProductImage[];
  onImagesChange: (imgs: ProductImage[]) => void;
}) {
  const [addImage, { loading: adding }] = useMutation<AddMyProductImageData>(
    ADD_MY_PRODUCT_IMAGE,
  );
  const [updateImage] = useMutation<UpdateMyProductImageData>(
    UPDATE_MY_PRODUCT_IMAGE,
  );
  const [removeImage] = useMutation<RemoveMyProductImageData>(
    REMOVE_MY_PRODUCT_IMAGE,
  );
  const [reorderImages] = useMutation<ReorderMyProductImagesData>(
    REORDER_MY_PRODUCT_IMAGES,
  );

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }),
  );

  // Mirror images into a ref so multi-upload's stale closure can still see
  // the latest count between sequential uploads.
  const imagesRef = useRef(images);
  useEffect(() => {
    imagesRef.current = images;
  }, [images]);

  async function handleNewImage(imageUrl: string) {
    try {
      const current = imagesRef.current;
      const res = await addImage({
        variables: {
          addProductImageInput: {
            productId: product.id,
            imageUrl,
            isPrimary: current.length === 0,
          },
        },
      });
      const created = res.data?.addMyProductImage;
      if (created) {
        const next = current.length === 0
          ? [created]
          : [...current.map((i) => ({ ...i, isPrimary: false })), created];
        const sorted = next.sort((a, b) => a.displayOrder - b.displayOrder);
        imagesRef.current = sorted;
        onImagesChange(sorted);
      }
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Add failed";
      toast.error(msg);
    }
  }

  async function handleRemove(imageId: string) {
    try {
      await removeImage({ variables: { id: imageId } });
      onImagesChange(images.filter((i) => i.id !== imageId));
      toast.success("Image removed");
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Remove failed";
      toast.error(msg);
    }
  }

  async function handleSetPrimary(imageId: string) {
    try {
      await updateImage({
        variables: {
          updateProductImageInput: { id: imageId, isPrimary: true },
        },
      });
      onImagesChange(
        images.map((i) => ({ ...i, isPrimary: i.id === imageId })),
      );
      toast.success("Primary image updated");
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Update failed";
      toast.error(msg);
    }
  }

  async function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    if (!over || active.id === over.id) return;
    const oldIndex = images.findIndex((i) => i.id === active.id);
    const newIndex = images.findIndex((i) => i.id === over.id);
    const reordered = arrayMove(images, oldIndex, newIndex);
    onImagesChange(reordered.map((i, idx) => ({ ...i, displayOrder: idx })));

    try {
      await reorderImages({
        variables: {
          reorderProductImagesInput: {
            productId: product.id,
            imageIds: reordered.map((i) => i.id),
          },
        },
      });
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Reorder failed";
      toast.error(msg);
      onImagesChange(images); // revert on error
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <ImageIcon className="h-5 w-5" />
          Media ({images.length}/8)
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {images.length < 8 && (
          <ImageUploader
            purpose="PRODUCT_GALLERY"
            ownerType="PRODUCT"
            ownerId={product.id}
            multiple
            maxFiles={8 - images.length}
            onUploaded={(img) => handleNewImage(img.url)}
            aspectClass="aspect-square h-32"
          />
        )}

        {images.length === 0 ? (
          <p className="text-sm text-muted-foreground italic text-center py-4">
            Upload at least 1 image before publishing.
          </p>
        ) : (
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
          >
            <SortableContext
              items={images.map((i) => i.id)}
              strategy={verticalListSortingStrategy}
            >
              <div className="space-y-2">
                {images.map((img) => (
                  <SortableImageRow
                    key={img.id}
                    image={img}
                    onSetPrimary={() => handleSetPrimary(img.id)}
                    onRemove={() => handleRemove(img.id)}
                  />
                ))}
              </div>
            </SortableContext>
          </DndContext>
        )}
      </CardContent>
    </Card>
  );
}

function SortableImageRow({
  image,
  onSetPrimary,
  onRemove,
}: {
  image: ProductImage;
  onSetPrimary: () => void;
  onRemove: () => void;
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: image.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 10 : 1,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`flex items-center gap-3 p-2 bg-card border rounded-md ${
        isDragging ? "ring-2 ring-primary" : ""
      }`}
    >
      <div
        {...attributes}
        {...listeners}
        className="cursor-grab text-muted-foreground hover:text-foreground"
      >
        <GripVertical className="h-4 w-4" />
      </div>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={image.imageUrl}
        alt={image.altText ?? ""}
        className="h-14 w-14 rounded-md object-cover"
      />
      <div className="flex-1 text-xs text-muted-foreground truncate">
        {image.altText ?? "(no alt text)"}
      </div>
      <Button
        type="button"
        variant="ghost"
        size="icon"
        onClick={onSetPrimary}
        title={image.isPrimary ? "Already primary" : "Set as primary"}
        disabled={image.isPrimary}
      >
        {image.isPrimary ? (
          <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
        ) : (
          <StarOff className="h-4 w-4 text-muted-foreground" />
        )}
      </Button>
      <Button
        type="button"
        variant="ghost"
        size="icon"
        className="text-destructive hover:text-destructive"
        onClick={onRemove}
      >
        <Trash2 className="h-4 w-4" />
      </Button>
    </div>
  );
}
