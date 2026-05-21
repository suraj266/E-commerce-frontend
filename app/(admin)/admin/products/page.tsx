/**
 * Admin Products Page — /admin/products
 *
 * Cross-store catalog view. Filters by status / store / brand / category.
 * Click row → detail Sheet (read-only summary + status override + force-archive).
 *
 * Force-archive uses the same SetProductStatusInput mutation but is gated
 * by `product:update` permission and accepts a reason which is captured
 * in metadata.lastStatusAction (audit trail).
 */

"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useMutation, useQuery } from "@apollo/client/react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@/lib/forms/zod-resolver";
import { toast } from "sonner";
import {
  Box,
  Eye,
  ExternalLink,
  Layers,
  Loader2,
  ShieldCheck,
} from "lucide-react";

import {
  ADMIN_SET_PRODUCT_STATUS,
  GET_ADMIN_PRODUCTS,
} from "@/lib/graphql/products";
import { GET_BRANDS } from "@/lib/graphql/brands";
import { GET_CATEGORIES } from "@/lib/graphql/categories";
import { GET_ADMIN_INVENTORY_BY_PRODUCT } from "@/lib/graphql/inventory";
import {
  AdminSetProductStatusData,
  GetAdminProductsData,
  parseSpecifications,
  PRODUCT_STATUSES,
  PRODUCT_STATUS_LABEL,
  Product,
  ProductStatus,
} from "@/types/product.types";
import { GetAdminInventoryByProductData } from "@/types/inventory.types";
import { Brand } from "@/types/brand.types";
import { Category } from "@/types/category.types";
import { discountPercent, formatPrice } from "@/lib/utils/currency";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
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
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  TableEmpty,
  TablePagination,
  TableSkeleton,
  TableToolbar,
  usePagination,
} from "@/components/ui/data-table";

const COL_COUNT = 7;

const STATUS_VARIANT: Record<
  ProductStatus,
  "default" | "secondary" | "destructive" | "outline"
> = {
  DRAFT: "outline",
  ACTIVE: "default",
  INACTIVE: "secondary",
  ARCHIVED: "destructive",
};

const setStatusSchema = z.object({
  status: z.enum(PRODUCT_STATUSES),
  reason: z.string().optional(),
});
type SetStatusValues = z.infer<typeof setStatusSchema>;

export default function AdminProductsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | ProductStatus>("all");
  const [brandFilter, setBrandFilter] = useState<string>("all");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const [openProduct, setOpenProduct] = useState<Product | null>(null);
  const [statusDialog, setStatusDialog] = useState<Product | null>(null);

  const refetchVars = {
    status: statusFilter === "all" ? null : statusFilter,
    brandId: brandFilter === "all" ? null : brandFilter,
    categoryId: categoryFilter === "all" ? null : categoryFilter,
  };

  const { data, loading, error } = useQuery<GetAdminProductsData>(
    GET_ADMIN_PRODUCTS,
    {
      variables: refetchVars,
      fetchPolicy: "cache-and-network",
    },
  );

  const { data: brandsData } = useQuery<{ brands: Brand[] }>(GET_BRANDS, {
    fetchPolicy: "cache-first",
  });
  const { data: categoriesData } = useQuery<{ categories: Category[] }>(
    GET_CATEGORIES,
    { fetchPolicy: "cache-first" },
  );

  const brands = brandsData?.brands ?? [];
  const categories = categoriesData?.categories ?? [];

  useEffect(() => {
    if (error) toast.error(`Failed to load: ${error.message}`);
  }, [error]);

  const [setStatus, { loading: settingStatus }] =
    useMutation<AdminSetProductStatusData>(ADMIN_SET_PRODUCT_STATUS, {
      refetchQueries: [{ query: GET_ADMIN_PRODUCTS, variables: refetchVars }],
      onCompleted: (res) => {
        toast.success(`Status → ${res.adminSetProductStatus.status}`);
        setStatusDialog(null);
        if (openProduct?.id === res.adminSetProductStatus.id) {
          setOpenProduct(res.adminSetProductStatus);
        }
      },
      onError: (err) => toast.error(`Failed: ${err.message}`),
    });

  const statusForm = useForm<SetStatusValues>({
    resolver: zodResolver(setStatusSchema),
    defaultValues: { status: "ARCHIVED", reason: "" },
  });

  function openStatusDialog(product: Product) {
    setStatusDialog(product);
    statusForm.reset({
      status: product.status === "ARCHIVED" ? "ACTIVE" : "ARCHIVED",
      reason: "",
    });
  }

  async function onStatusSubmit(values: SetStatusValues) {
    if (!statusDialog) return;
    await setStatus({
      variables: {
        setProductStatusInput: {
          id: statusDialog.id,
          status: values.status,
          reason: values.reason || undefined,
        },
      },
    });
  }

  // Derived
  const all = data?.adminProducts ?? [];
  const filtered = useMemo(() => {
    const q = searchQuery.toLowerCase();
    if (!q) return all;
    return all.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.slug.toLowerCase().includes(q) ||
        p.sku?.toLowerCase().includes(q),
    );
  }, [all, searchQuery]);

  const pg = usePagination({ totalRows: filtered.length, defaultPageSize: 25 });
  const visible = filtered.slice(pg.start, pg.start + pg.pageSize);

  const activeFilterCount =
    (searchQuery ? 1 : 0) +
    (statusFilter !== "all" ? 1 : 0) +
    (brandFilter !== "all" ? 1 : 0) +
    (categoryFilter !== "all" ? 1 : 0);
  const onSearchChange = (v: string) => {
    setSearchQuery(v);
    pg.resetPage();
  };
  const resetFilters = () => {
    setSearchQuery("");
    setStatusFilter("all");
    setBrandFilter("all");
    setCategoryFilter("all");
    pg.resetPage();
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight flex items-center gap-2">
          <Box className="h-6 w-6 text-primary" />
          Products
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          Cross-store catalog. Filter, inspect, and force-archive any product.
        </p>
      </div>

      <TableToolbar
        search={searchQuery}
        onSearchChange={onSearchChange}
        searchPlaceholder="Search name, slug, SKU..."
        activeFilterCount={activeFilterCount}
        onReset={resetFilters}
        primaryFilters={
          <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center">
            <Select
              value={statusFilter}
              onValueChange={(val) =>
                setStatusFilter(val as "all" | ProductStatus)
              }
            >
              <SelectTrigger className="w-full sm:w-44">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All statuses</SelectItem>
                {PRODUCT_STATUSES.map((s) => (
                  <SelectItem key={s} value={s}>
                    {PRODUCT_STATUS_LABEL[s]}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={brandFilter} onValueChange={setBrandFilter}>
              <SelectTrigger className="w-full sm:w-44">
                <SelectValue placeholder="All brands" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All brands</SelectItem>
                {brands.map((b) => (
                  <SelectItem key={b.id} value={b.id}>
                    {b.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger className="w-full sm:w-44">
                <SelectValue placeholder="All categories" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All categories</SelectItem>
                {categories
                  .filter((c) => c.isActive)
                  .map((c) => (
                    <SelectItem key={c.id} value={c.id}>
                      {c.name}
                    </SelectItem>
                  ))}
              </SelectContent>
            </Select>
          </div>
        }
      />

      <div className="rounded-lg border bg-card shadow-sm overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/40 hover:bg-muted/40">
              <TableHead className="w-12">#</TableHead>
              <TableHead className="w-14">Image</TableHead>
              <TableHead>Name</TableHead>
              <TableHead className="hidden md:table-cell">Brand</TableHead>
              <TableHead className="hidden lg:table-cell text-right">
                Price
              </TableHead>
              <TableHead className="text-center">Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading && all.length === 0 ? (
              <TableSkeleton colSpan={COL_COUNT} />
            ) : visible.length === 0 ? (
              <TableEmpty
                colSpan={COL_COUNT}
                icon={Box}
                hasFilters={activeFilterCount > 0}
                onClearFilters={resetFilters}
              >
                {searchQuery
                  ? `No products found for "${searchQuery}"`
                  : "No products yet."}
              </TableEmpty>
            ) : (
              visible.map((product, idx) => {
                const primary =
                  product.images?.find((i) => i.isPrimary) ??
                  product.images?.[0];
                return (
                  <TableRow key={product.id}>
                    <TableCell className="text-xs text-muted-foreground font-mono">
                      {pg.start + idx + 1}
                    </TableCell>
                    <TableCell>
                      <div className="h-10 w-10 rounded-md bg-muted overflow-hidden flex items-center justify-center">
                        {primary ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img
                            src={primary.imageUrl}
                            alt={primary.altText ?? product.name}
                            className="h-full w-full object-cover"
                          />
                        ) : (
                          <Box className="h-4 w-4 text-muted-foreground" />
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <button
                        type="button"
                        onClick={() => setOpenProduct(product)}
                        className="text-left hover:underline max-w-[320px]"
                      >
                        <div className="font-semibold truncate">
                          {product.name}
                        </div>
                        <div className="text-xs text-muted-foreground font-mono truncate">
                          {product.sku ?? "no-sku"}
                        </div>
                      </button>
                    </TableCell>
                    <TableCell className="hidden md:table-cell text-sm text-muted-foreground truncate max-w-[160px]">
                      {product.brand?.name ?? "—"}
                    </TableCell>
                    <TableCell className="hidden lg:table-cell text-right text-sm">
                      {formatPrice(product.price)}
                    </TableCell>
                    <TableCell className="text-center">
                      <Badge
                        variant={STATUS_VARIANT[product.status]}
                        className="text-xs"
                      >
                        {PRODUCT_STATUS_LABEL[product.status]}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-1">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8"
                          title="View"
                          onClick={() => setOpenProduct(product)}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8"
                          title="Override status"
                          onClick={() => openStatusDialog(product)}
                        >
                          <ShieldCheck className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </div>

      <TablePagination
        page={pg.safePage}
        pageSize={pg.pageSize}
        totalRows={filtered.length}
        totalPages={pg.totalPages}
        onPageChange={pg.setPage}
        onPageSizeChange={(n) => {
          pg.setPageSize(n);
          pg.resetPage();
        }}
      />

      {/* Detail Sheet */}
      <Sheet open={!!openProduct} onOpenChange={(o) => !o && setOpenProduct(null)}>
        <SheetContent className="sm:max-w-xl w-full overflow-y-auto">
          {openProduct && <ProductDetailSheet product={openProduct} onOverride={() => openStatusDialog(openProduct)} />}
        </SheetContent>
      </Sheet>

      {/* Status override dialog */}
      <Dialog
        open={!!statusDialog}
        onOpenChange={(o) => !o && setStatusDialog(null)}
      >
        <DialogContent className="sm:max-w-md focus:ring-0">
          <DialogHeader>
            <DialogTitle>Override Product Status</DialogTitle>
            <DialogDescription>
              {statusDialog && (
                <>
                  Force the status for{" "}
                  <span className="font-semibold text-foreground">
                    {statusDialog.name}
                  </span>
                  . Reason is recorded in audit metadata.
                </>
              )}
            </DialogDescription>
          </DialogHeader>

          <Form {...statusForm}>
            <form
              className="space-y-4 pt-2"
              onSubmit={statusForm.handleSubmit(onStatusSubmit)}
            >
              <FormField
                control={statusForm.control}
                name="status"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>New Status</FormLabel>
                    <Select value={field.value} onValueChange={field.onChange}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {PRODUCT_STATUSES.map((s) => (
                          <SelectItem key={s} value={s}>
                            {PRODUCT_STATUS_LABEL[s]}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={statusForm.control}
                name="reason"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Reason</FormLabel>
                    <FormControl>
                      <Input placeholder="Why this change..." {...field} />
                    </FormControl>
                    <FormDescription className="text-xs">
                      Required for ARCHIVED — visible to seller.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="flex justify-end gap-3 pt-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setStatusDialog(null)}
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={settingStatus}>
                  {settingStatus && (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  )}
                  Apply
                </Button>
              </div>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </div>
  );
}

// ---------------------------------------------------------------------------
function ProductDetailSheet({
  product,
  onOverride,
}: {
  product: Product;
  onOverride: () => void;
}) {
  const primary =
    product.images?.find((i) => i.isPrimary) ?? product.images?.[0];
  const pct = discountPercent(product.price, product.compareAtPrice);
  const specs = parseSpecifications(product.specifications);
  const variants = product.variants ?? [];
  const isVariable = product.productType === "VARIABLE";

  const { data: invData } = useQuery<GetAdminInventoryByProductData>(
    GET_ADMIN_INVENTORY_BY_PRODUCT,
    {
      variables: { productId: product.id },
      fetchPolicy: "cache-and-network",
    },
  );
  const inventory = invData?.adminInventoryByProduct ?? [];
  const stockSummary = useMemo(() => {
    const s = { onHand: 0, available: 0, reserved: 0, low: 0, out: 0 };
    for (const r of inventory) {
      s.onHand += r.quantityOnHand;
      s.available += r.quantityAvailable;
      s.reserved += r.quantityReserved;
      if (r.stockState === "LOW_STOCK") s.low += 1;
      if (r.stockState === "OUT_OF_STOCK") s.out += 1;
    }
    return s;
  }, [inventory]);

  return (
    <>
      <SheetHeader>
        <SheetTitle className="flex items-center gap-2 flex-wrap">
          {product.name}
          <Badge variant={STATUS_VARIANT[product.status]} className="text-xs">
            {PRODUCT_STATUS_LABEL[product.status]}
          </Badge>
          {isVariable && (
            <Badge variant="outline" className="text-xs gap-1">
              <Layers className="h-3 w-3" />
              {variants.length} variant{variants.length === 1 ? "" : "s"}
            </Badge>
          )}
        </SheetTitle>
        <SheetDescription>
          /product/{product.slug} · {product.brand?.name ?? "no brand"}
        </SheetDescription>
      </SheetHeader>

      <div className="space-y-6 mt-6 px-6">
        {primary && (
          <div className="rounded-md overflow-hidden border bg-muted">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={primary.imageUrl}
              alt={primary.altText ?? product.name}
              className="w-full max-h-72 object-contain"
            />
          </div>
        )}

        <div className="flex items-baseline gap-2">
          <span className="text-2xl font-bold">{formatPrice(product.price)}</span>
          {product.compareAtPrice != null && pct != null && (
            <>
              <span className="text-sm text-muted-foreground line-through">
                {formatPrice(product.compareAtPrice)}
              </span>
              <Badge variant="destructive" className="text-xs">
                -{pct}% OFF
              </Badge>
            </>
          )}
        </div>

        <dl className="grid grid-cols-2 gap-x-4 gap-y-3 text-sm">
          <Field label="SKU" value={product.sku ?? "—"} mono />
          <Field label="HSN Code" value={product.hsnCode ?? "—"} mono />
          <Field
            label="Tax"
            value={
              product.tax
                ? `${product.tax.name} (${Number(product.tax.rate).toFixed(2)}%)`
                : "—"
            }
          />
          <Field label="Type" value={product.productType} />
          <Field label="Category" value={product.category?.name ?? "—"} />
          <Field
            label="Tags"
            value={product.tags?.map((t) => t.name).join(", ") || "—"}
          />
          <Field label="Featured" value={product.isFeatured ? "Yes" : "No"} />
          <Field label="Digital" value={product.isDigital ? "Yes" : "No"} />
          <Field
            label="Created"
            value={new Date(product.createdAt).toLocaleDateString()}
          />
          <Field
            label="Images"
            value={String(product.images?.length ?? 0)}
          />
        </dl>

        {product.shortDescription && (
          <>
            <Separator />
            <div>
              <h3 className="font-semibold mb-2 text-sm">Short description</h3>
              <p className="text-sm text-muted-foreground">
                {product.shortDescription}
              </p>
            </div>
          </>
        )}

        {specs.length > 0 && (
          <>
            <Separator />
            <div>
              <h3 className="font-semibold mb-2 text-sm">Specifications</h3>
              <div className="space-y-2">
                {specs.map((g, i) => (
                  <div key={i} className="text-sm">
                    <div className="font-medium">{g.name}</div>
                    <div className="pl-3 text-muted-foreground">
                      {g.items.map((it, j) => (
                        <div key={j}>
                          {it.label}: {it.value}
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}

        {inventory.length > 0 && (
          <>
            <Separator />
            <div>
              <h3 className="font-semibold mb-3 text-sm">Stock summary</h3>
              <div className="grid grid-cols-3 gap-2 text-center">
                <StockStat label="On hand" value={stockSummary.onHand} />
                <StockStat
                  label="Reserved"
                  value={stockSummary.reserved}
                  muted
                />
                <StockStat
                  label="Available"
                  value={stockSummary.available}
                  emphasised
                />
              </div>
              {(stockSummary.low > 0 || stockSummary.out > 0) && (
                <div className="flex gap-2 mt-3 text-xs">
                  {stockSummary.out > 0 && (
                    <Badge variant="destructive" className="text-[10px]">
                      {stockSummary.out} variant
                      {stockSummary.out === 1 ? "" : "s"} out of stock
                    </Badge>
                  )}
                  {stockSummary.low > 0 && (
                    <Badge variant="secondary" className="text-[10px]">
                      {stockSummary.low} low stock
                    </Badge>
                  )}
                </div>
              )}
            </div>
          </>
        )}

        {isVariable && (
          <>
            <Separator />
            <div>
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-semibold text-sm flex items-center gap-2">
                  <Layers className="h-4 w-4" />
                  Variants
                </h3>
                <Button asChild variant="outline" size="sm">
                  <Link
                    href={`/seller/products/${product.id}/variants`}
                    target="_blank"
                  >
                    <ExternalLink className="mr-1 h-3 w-3" />
                    Manage
                  </Link>
                </Button>
              </div>

              {variants.length === 0 ? (
                <p className="text-xs text-muted-foreground">
                  No variants configured yet.
                </p>
              ) : (
                <div className="rounded-md border overflow-hidden">
                  <table className="w-full text-xs">
                    <thead className="bg-muted/50">
                      <tr className="text-left">
                        <th className="px-2 py-1.5 font-medium">SKU</th>
                        <th className="px-2 py-1.5 font-medium">Attributes</th>
                        <th className="px-2 py-1.5 font-medium text-right">
                          Price
                        </th>
                        <th className="px-2 py-1.5 font-medium text-center">
                          Status
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {variants.map((v) => (
                        <tr key={v.id} className="border-t">
                          <td className="px-2 py-1.5 font-mono">{v.sku}</td>
                          <td className="px-2 py-1.5 text-muted-foreground">
                            {v.attributes
                              .map(
                                (a) => `${a.attributeName}: ${a.value}`,
                              )
                              .join(" / ") || "—"}
                          </td>
                          <td className="px-2 py-1.5 text-right">
                            {formatPrice(v.price)}
                          </td>
                          <td className="px-2 py-1.5 text-center">
                            <Badge
                              variant={
                                v.status === "ACTIVE"
                                  ? "default"
                                  : v.status === "OUT_OF_STOCK"
                                    ? "destructive"
                                    : "secondary"
                              }
                              className="text-[10px]"
                            >
                              {v.status}
                            </Badge>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </>
        )}

        <Separator />
        <div className="space-y-3">
          <div className="flex gap-2">
            {product.status === "ACTIVE" && (
              <Button asChild variant="outline" size="sm">
                <Link href={`/product/${product.slug}`} target="_blank">
                  <ExternalLink className="mr-1 h-3 w-3" />
                  View public
                </Link>
              </Button>
            )}
            <Button onClick={onOverride} variant="outline" size="sm">
              <ShieldCheck className="mr-1 h-3 w-3" />
              Override status
            </Button>
          </div>
          <p className="text-xs text-muted-foreground">
            Status overrides are logged in audit metadata on the product.
          </p>
        </div>
      </div>
    </>
  );
}

function Field({
  label,
  value,
  mono,
}: {
  label: string;
  value: string;
  mono?: boolean;
}) {
  return (
    <div>
      <dt className="text-xs text-muted-foreground">{label}</dt>
      <dd
        className={`text-sm ${mono ? "font-mono" : ""} truncate`}
        title={value}
      >
        {value}
      </dd>
    </div>
  );
}

function StockStat({
  label,
  value,
  emphasised,
  muted,
}: {
  label: string;
  value: number;
  emphasised?: boolean;
  muted?: boolean;
}) {
  return (
    <div className="rounded-md border bg-muted/30 py-2">
      <div className="text-[10px] text-muted-foreground uppercase tracking-wide">
        {label}
      </div>
      <div
        className={`font-mono text-lg ${emphasised ? "font-bold" : ""} ${muted ? "text-muted-foreground" : ""}`}
      >
        {value.toLocaleString("en-IN")}
      </div>
    </div>
  );
}
