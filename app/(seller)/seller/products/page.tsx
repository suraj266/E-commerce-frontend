/**
 * Seller's products list — /seller/products
 *
 * Lists all products owned by current seller across their stores.
 * Filter by status; click row → edit page; primary image preview in row.
 */

"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useQuery } from "@apollo/client/react";
import { toast } from "sonner";
import {
  Box,
  ChevronRight,
  Plus,
  Search,
} from "lucide-react";

import { GET_MY_PRODUCTS } from "@/lib/graphql/products";
import {
  GetMyProductsData,
  PRODUCT_STATUSES,
  PRODUCT_STATUS_LABEL,
  Product,
  ProductStatus,
} from "@/types/product.types";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const STATUS_VARIANT: Record<
  ProductStatus,
  "default" | "secondary" | "destructive" | "outline"
> = {
  DRAFT: "outline",
  ACTIVE: "default",
  INACTIVE: "secondary",
  ARCHIVED: "destructive",
};

export default function MyProductsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | ProductStatus>("all");

  const { data, loading, error } = useQuery<GetMyProductsData>(
    GET_MY_PRODUCTS,
    {
      variables: { status: statusFilter === "all" ? null : statusFilter },
      fetchPolicy: "cache-and-network",
    },
  );

  useEffect(() => {
    if (error) toast.error(`Failed to load products: ${error.message}`);
  }, [error]);

  const all = data?.myProducts ?? [];
  const filtered = all.filter((p) => {
    const q = searchQuery.toLowerCase();
    if (!q) return true;
    return (
      p.name.toLowerCase().includes(q) ||
      p.slug.toLowerCase().includes(q) ||
      p.sku?.toLowerCase().includes(q)
    );
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight flex items-center gap-2">
            <Box className="h-6 w-6 text-primary" />
            My Products
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Manage all products across your stores. Save as draft, then publish
            when ready.
          </p>
        </div>
        <Button asChild>
          <Link href="/seller/products/new">
            <Plus className="mr-2 h-4 w-4" />
            Add Product
          </Link>
        </Button>
      </div>

      {/* Filters */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative w-full sm:max-w-xs">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search name, slug, SKU..."
            className="pl-9"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <Select
          value={statusFilter}
          onValueChange={(val) => setStatusFilter(val as "all" | ProductStatus)}
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
      </div>

      {/* List */}
      {loading && (
        <div className="space-y-3">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-20 w-full animate-pulse rounded-lg bg-muted" />
          ))}
        </div>
      )}

      {!loading && filtered.length === 0 && (
        <Card>
          <CardContent className="py-12 text-center space-y-4">
            <Box className="h-12 w-12 mx-auto text-muted-foreground/50" />
            <div>
              <h3 className="font-semibold">
                {searchQuery
                  ? `No products match "${searchQuery}"`
                  : "No products yet"}
              </h3>
              <p className="text-sm text-muted-foreground">
                {!searchQuery && "Create your first product to start selling."}
              </p>
            </div>
            {!searchQuery && (
              <Button asChild>
                <Link href="/seller/products/new">
                  <Plus className="mr-2 h-4 w-4" />
                  Create your first product
                </Link>
              </Button>
            )}
          </CardContent>
        </Card>
      )}

      {!loading && filtered.length > 0 && (
        <div className="grid gap-3">
          {filtered.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
}

function ProductCard({ product }: { product: Product }) {
  const primaryImage =
    product.images?.find((i) => i.isPrimary) ?? product.images?.[0];

  return (
    <Link href={`/seller/products/${product.id}`}>
      <Card className="hover:bg-muted/30 transition-colors cursor-pointer">
        <CardContent className="p-4 flex items-center gap-4">
          <div className="h-16 w-16 rounded-md bg-muted flex items-center justify-center overflow-hidden flex-shrink-0">
            {primaryImage ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={primaryImage.imageUrl}
                alt={primaryImage.altText ?? product.name}
                className="h-full w-full object-cover"
              />
            ) : (
              <Box className="h-6 w-6 text-muted-foreground" />
            )}
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <h3 className="font-semibold truncate">{product.name}</h3>
              <Badge variant={STATUS_VARIANT[product.status]} className="text-xs">
                {PRODUCT_STATUS_LABEL[product.status]}
              </Badge>
              {product.brand && (
                <Badge variant="outline" className="text-xs">
                  {product.brand.name}
                </Badge>
              )}
            </div>
            <div className="flex items-center gap-3 mt-1 text-xs text-muted-foreground">
              <span className="font-mono truncate">{product.sku ?? "no-sku"}</span>
              {product.price != null && (
                <span className="font-semibold text-foreground">
                  ₹{product.price.toLocaleString("en-IN")}
                </span>
              )}
              {product.compareAtPrice && product.compareAtPrice > (product.price ?? 0) && (
                <span className="line-through">
                  ₹{product.compareAtPrice.toLocaleString("en-IN")}
                </span>
              )}
              <span>{product.images?.length ?? 0} image{(product.images?.length ?? 0) === 1 ? "" : "s"}</span>
            </div>
          </div>

          <ChevronRight className="h-5 w-5 text-muted-foreground flex-shrink-0" />
        </CardContent>
      </Card>
    </Link>
  );
}
