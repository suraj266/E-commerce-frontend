/**
 * Admin: Create Product — /admin/products/new
 *
 * Focused single-page form covering the essentials: store picker, name,
 * pricing, category, brand, descriptions, status. Images, variants, specs,
 * SEO, and tags are deferred — admin can promote/manage status from the
 * /admin/products list afterwards, or the seller can edit via their panel.
 */

"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";
import { useMutation, useQuery } from "@apollo/client/react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@/lib/forms/zod-resolver";
import { toast } from "sonner";
import {
  Box,
  ChevronLeft,
  Loader2,
  Save,
} from "lucide-react";

import {
  ADMIN_CREATE_PRODUCT,
  GET_ADMIN_PRODUCTS,
} from "@/lib/graphql/products";
import { GET_STORES } from "@/lib/graphql/stores";
import { GET_BRANDS } from "@/lib/graphql/brands";
import {
  AdminCreateProductData,
  PRODUCT_STATUSES,
  PRODUCT_STATUS_LABEL,
  ProductStatus,
} from "@/types/product.types";
import { GetStoresData } from "@/types/store.types";
import { Brand } from "@/types/brand.types";

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
import { CategoryCascader } from "@/components/category/category-cascader";

// ---------------------------------------------------------------------------
// Schema
// ---------------------------------------------------------------------------
const schema = z.object({
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
  price: z.coerce.number().min(0, "Must be ≥ 0"),
  compareAtPrice: z.coerce.number().min(0).optional().or(z.literal("")),
  costPrice: z.coerce.number().min(0).optional().or(z.literal("")),
  sku: z.string().min(2).max(60).optional().or(z.literal("")),
  hsnCode: z
    .string()
    .regex(/^(\d{4}|\d{6}|\d{8})$/, "HSN code must be 4, 6, or 8 digits")
    .optional()
    .or(z.literal("")),
  status: z.enum(PRODUCT_STATUSES).default("DRAFT"),
});

type FormValues = z.infer<typeof schema>;

// ===========================================================================
export default function AdminCreateProductPage() {
  const router = useRouter();

  // Active stores only — backend rejects others.
  const { data: storesData, loading: loadingStores } = useQuery<GetStoresData>(
    GET_STORES,
    {
      variables: { status: "ACTIVE" },
      fetchPolicy: "cache-and-network",
    },
  );
  const stores = storesData?.stores ?? [];

  const { data: brandsData } = useQuery<{ brands: Brand[] }>(GET_BRANDS, {
    fetchPolicy: "cache-first",
  });
  const brands = brandsData?.brands ?? [];

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      storeId: "",
      name: "",
      slug: "",
      categoryId: "",
      brandId: "",
      shortDescription: "",
      description: "",
      price: 0,
      compareAtPrice: "",
      costPrice: "",
      sku: "",
      hsnCode: "",
      status: "DRAFT" as ProductStatus,
    },
  });

  const [adminCreateProduct, { loading }] = useMutation<AdminCreateProductData>(
    ADMIN_CREATE_PRODUCT,
    {
      refetchQueries: [
        {
          query: GET_ADMIN_PRODUCTS,
          variables: {
            status: null,
            storeId: null,
            brandId: null,
            categoryId: null,
          },
        },
      ],
    },
  );

  async function onSubmit(values: FormValues) {
    try {
      const res = await adminCreateProduct({
        variables: {
          input: {
            storeId: values.storeId,
            name: values.name,
            slug: values.slug || undefined,
            categoryId: values.categoryId || undefined,
            brandId: values.brandId || undefined,
            shortDescription: values.shortDescription || undefined,
            description: values.description || undefined,
            productType: "SIMPLE",
            price: Number(values.price),
            compareAtPrice:
              values.compareAtPrice === ""
                ? undefined
                : Number(values.compareAtPrice),
            costPrice:
              values.costPrice === "" ? undefined : Number(values.costPrice),
            sku: values.sku || undefined,
            hsnCode: values.hsnCode || undefined,
            status: values.status,
          },
        },
      });
      const created = res.data?.adminCreateProduct;
      toast.success(
        `Product "${created?.name}" created (${PRODUCT_STATUS_LABEL[created?.status ?? "DRAFT"]}).`,
      );
      router.push("/admin/products");
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Create failed";
      toast.error(msg);
    }
  }

  return (
    <div className="space-y-6">
      <Button variant="ghost" size="sm" asChild>
        <Link href="/admin/products">
          <ChevronLeft className="mr-1 h-4 w-4" />
          All products
        </Link>
      </Button>

      <div>
        <h1 className="text-2xl font-bold tracking-tight flex items-center gap-2">
          <Box className="h-6 w-6 text-primary" />
          Create Product
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          Quick-create a SIMPLE product under any active store. For images,
          variants, specs, and SEO, edit it from the store-owner&apos;s seller
          panel after creation.
        </p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          {/* -------- 1. Store -------- */}
          <Card>
            <CardHeader>
              <CardTitle>Store</CardTitle>
            </CardHeader>
            <CardContent>
              <FormField
                control={form.control}
                name="storeId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Store *</FormLabel>
                    <Select
                      value={field.value}
                      onValueChange={field.onChange}
                      disabled={loadingStores}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue
                            placeholder={
                              loadingStores
                                ? "Loading active stores..."
                                : stores.length === 0
                                  ? "No active stores — create one first"
                                  : "Pick an active store"
                            }
                          />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {stores.map((s) => (
                          <SelectItem key={s.id} value={s.id}>
                            {s.name}
                            <span className="text-xs text-muted-foreground ml-2">
                              ({s.currencyCode})
                            </span>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>

          {/* -------- 2. Basics -------- */}
          <Card>
            <CardHeader>
              <CardTitle>Basics</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Product name *</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="e.g. Wireless Bluetooth Earbuds"
                        {...field}
                      />
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
                      <Input
                        placeholder="auto-generated-if-blank"
                        {...field}
                      />
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
                    <FormLabel>Short description</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="One-line tagline shown on listings"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Full description</FormLabel>
                    <FormControl>
                      <textarea
                        className="flex min-h-[120px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
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

          {/* -------- 3. Pricing -------- */}
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
                      <FormLabel>Compare-at price</FormLabel>
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
                        Strike-through MRP for discounts.
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
                      <FormLabel>Cost price</FormLabel>
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
                        Internal margin tracking; not shown publicly.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                <FormField
                  control={form.control}
                  name="hsnCode"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>HSN code</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="e.g. 8517 or 851712"
                          maxLength={8}
                          inputMode="numeric"
                          {...field}
                        />
                      </FormControl>
                      <FormDescription className="text-xs">
                        4/6/8 digits — required on GST invoices.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </CardContent>
          </Card>

          {/* -------- 4. Status -------- */}
          <Card>
            <CardHeader>
              <CardTitle>Status</CardTitle>
            </CardHeader>
            <CardContent>
              <FormField
                control={form.control}
                name="status"
                render={({ field }) => (
                  <FormItem>
                    <Select
                      value={field.value}
                      onValueChange={field.onChange}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {(["DRAFT", "ACTIVE", "INACTIVE"] as const).map((s) => (
                          <SelectItem key={s} value={s}>
                            {PRODUCT_STATUS_LABEL[s]}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormDescription className="text-xs">
                      ACTIVE makes the product visible on the storefront
                      immediately. DRAFT keeps it private until promoted.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>

          {/* Sticky save bar */}
          <div className="sticky bottom-0 -mx-4 sm:-mx-0 bg-background/95 backdrop-blur border-t py-3 px-4 flex justify-end gap-2">
            <Button type="button" variant="outline" asChild>
              <Link href="/admin/products">Cancel</Link>
            </Button>
            <Button type="submit" disabled={loading}>
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              <Save className="mr-2 h-4 w-4" />
              Create product
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
