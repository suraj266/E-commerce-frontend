/**
 * Admin: Edit Product — /admin/products/[id]/edit
 *
 * Edits basics, pricing, category, brand, descriptions, HSN, and status.
 * Images / variants / specs / tags / SEO remain in the seller-panel edit
 * flow — they require multi-step orchestration that's out of scope for the
 * admin shortcut.
 */

"use client";

import { use } from "react";
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
  ADMIN_UPDATE_PRODUCT,
  GET_ADMIN_PRODUCT,
  GET_ADMIN_PRODUCTS,
} from "@/lib/graphql/products";
import { GET_BRANDS } from "@/lib/graphql/brands";
import {
  AdminUpdateProductData,
  GetAdminProductData,
  PRODUCT_STATUSES,
  PRODUCT_STATUS_LABEL,
  ProductStatus,
} from "@/types/product.types";
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

const schema = z.object({
  name: z.string().min(2).max(200),
  slug: z
    .string()
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "lowercase, digits, hyphens"),
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
  status: z.enum(PRODUCT_STATUSES),
});

type FormValues = z.infer<typeof schema>;

export default function AdminEditProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const router = useRouter();

  const { data, loading: loadingProduct, error } = useQuery<GetAdminProductData>(
    GET_ADMIN_PRODUCT,
    { variables: { id }, fetchPolicy: "cache-and-network" },
  );
  const product = data?.adminProduct;

  const { data: brandsData } = useQuery<{ brands: Brand[] }>(GET_BRANDS, {
    fetchPolicy: "cache-first",
  });
  const brands = brandsData?.brands ?? [];

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    values: product
      ? {
          name: product.name,
          slug: product.slug,
          categoryId: product.categoryId ?? "",
          brandId: product.brandId ?? "",
          shortDescription: product.shortDescription ?? "",
          description: product.description ?? "",
          price: product.price ?? 0,
          compareAtPrice: product.compareAtPrice ?? "",
          costPrice: product.costPrice ?? "",
          sku: product.sku ?? "",
          hsnCode: product.hsnCode ?? "",
          status: product.status,
        }
      : undefined,
  });

  const [adminUpdateProduct, { loading: saving }] = useMutation<AdminUpdateProductData>(
    ADMIN_UPDATE_PRODUCT,
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
        { query: GET_ADMIN_PRODUCT, variables: { id } },
      ],
    },
  );

  async function onSubmit(values: FormValues) {
    try {
      await adminUpdateProduct({
        variables: {
          input: {
            id,
            name: values.name,
            slug: values.slug,
            categoryId: values.categoryId || null,
            brandId: values.brandId || null,
            shortDescription: values.shortDescription || undefined,
            description: values.description || undefined,
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
      toast.success("Product updated");
      router.push("/admin/products");
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Save failed";
      toast.error(msg);
    }
  }

  if (loadingProduct && !product) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    );
  }
  if (error || !product) {
    return (
      <div className="space-y-4">
        <Button variant="ghost" size="sm" asChild>
          <Link href="/admin/products">
            <ChevronLeft className="mr-1 h-4 w-4" />
            All products
          </Link>
        </Button>
        <p className="text-sm text-destructive">
          {error?.message ?? "Product not found"}
        </p>
      </div>
    );
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
          Edit {product.name}
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          Quick-edit core fields and status. Images, variants, specs, tags,
          SEO stay in the seller&apos;s panel.
        </p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <Card>
            <CardHeader><CardTitle>Basics</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Product name *</FormLabel>
                    <FormControl><Input {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="slug"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Slug *</FormLabel>
                    <FormControl><Input {...field} /></FormControl>
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
                    <FormControl><Input {...field} /></FormControl>
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
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader><CardTitle>Pricing</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <FormField
                  control={form.control}
                  name="price"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Price *</FormLabel>
                      <FormControl>
                        <Input type="number" min={0} step={0.01} {...field} />
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
                        <Input type="number" min={0} step={0.01} {...field} />
                      </FormControl>
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
                        <Input type="number" min={0} step={0.01} {...field} />
                      </FormControl>
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
                      <FormControl><Input {...field} /></FormControl>
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
                        <Input maxLength={8} inputMode="numeric" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader><CardTitle>Status</CardTitle></CardHeader>
            <CardContent>
              <FormField
                control={form.control}
                name="status"
                render={({ field }) => (
                  <FormItem>
                    <Select value={field.value} onValueChange={field.onChange}>
                      <FormControl>
                        <SelectTrigger><SelectValue /></SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {PRODUCT_STATUSES.map((s) => (
                          <SelectItem key={s} value={s}>
                            {PRODUCT_STATUS_LABEL[s]}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormDescription className="text-xs">
                      ARCHIVED is admin-only and irreversible from the seller
                      side.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>

          <div className="sticky bottom-0 -mx-4 sm:-mx-0 bg-background/95 backdrop-blur border-t py-3 px-4 flex justify-end gap-2">
            <Button type="button" variant="outline" asChild>
              <Link href="/admin/products">Cancel</Link>
            </Button>
            <Button type="submit" disabled={saving}>
              {saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              <Save className="mr-2 h-4 w-4" />
              Save changes
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
