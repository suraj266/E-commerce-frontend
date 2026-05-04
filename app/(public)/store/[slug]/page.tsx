/**
 * Public Storefront — /store/[slug]
 *
 * Sprint 2.4d wired in: products grid replaces the previous "coming soon"
 * placeholder. Sort dropdown drives a re-query (newest / price asc / desc).
 * Limit 20 for now — "Load more" will paginate when implemented in Sprint 5.
 */

"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useQuery } from "@apollo/client/react";
import { Mail, Phone, Store as StoreIcon } from "lucide-react";

import { GET_PUBLIC_STORE } from "@/lib/graphql/stores";
import { GET_PUBLIC_PRODUCTS } from "@/lib/graphql/products";
import { Store } from "@/types/store.types";
import {
  GetPublicProductsData,
  PRODUCT_SORT_LABEL,
  PRODUCT_SORT_ORDERS,
  ProductSortOrder,
} from "@/types/product.types";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ProductCard } from "@/components/products/product-card";

interface GetPublicStoreData {
  publicStore: Store;
}

export default function PublicStorePage() {
  const params = useParams<{ slug: string }>();
  const slug = params.slug;
  const [sort, setSort] = useState<ProductSortOrder>("NEWEST");

  const { data, loading, error } = useQuery<GetPublicStoreData>(
    GET_PUBLIC_STORE,
    { variables: { slug }, errorPolicy: "all" },
  );

  const {
    data: productsData,
    loading: productsLoading,
  } = useQuery<GetPublicProductsData>(GET_PUBLIC_PRODUCTS, {
    variables: { storeSlug: slug, sort, limit: 20 },
    fetchPolicy: "cache-and-network",
    skip: !data?.publicStore,
  });

  useEffect(() => {
    if (typeof document !== "undefined" && data?.publicStore) {
      document.title = `${data.publicStore.name} | MultiMart`;
    }
  }, [data?.publicStore]);

  if (loading) {
    return (
      <div className="max-w-5xl mx-auto p-8">
        <div className="h-48 animate-pulse rounded-lg bg-muted" />
      </div>
    );
  }

  if (error || !data?.publicStore) {
    return (
      <div className="max-w-5xl mx-auto p-8">
        <Card>
          <CardContent className="py-12 text-center space-y-3">
            <StoreIcon className="h-12 w-12 mx-auto text-muted-foreground/50" />
            <h1 className="text-xl font-semibold">Store not found</h1>
            <p className="text-sm text-muted-foreground">
              The store &ldquo;{slug}&rdquo; doesn&apos;t exist or has been deactivated.
            </p>
            <Button asChild variant="outline">
              <Link href="/">Back to home</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const store = data.publicStore;
  const products = productsData?.publicProducts ?? [];

  return (
    <div className="min-h-screen bg-muted/20">
      {/* Banner */}
      <div className="relative h-48 sm:h-64 bg-gradient-to-r from-primary/20 to-primary/5">
        {store.bannerUrl && (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={store.bannerUrl}
            alt={`${store.name} banner`}
            className="h-full w-full object-cover"
          />
        )}
      </div>

      {/* Header */}
      <div className="max-w-5xl mx-auto px-4 -mt-12 relative">
        <div className="flex items-end gap-4">
          <div className="h-24 w-24 rounded-lg bg-card border-4 border-background shadow-lg flex items-center justify-center overflow-hidden">
            {store.logoUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={store.logoUrl}
                alt={store.name}
                className="h-full w-full object-cover"
              />
            ) : (
              <StoreIcon className="h-10 w-10 text-muted-foreground" />
            )}
          </div>
          <div className="flex-1 min-w-0 pb-2">
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight truncate">
              {store.name}
            </h1>
            {store.description && (
              <p className="text-sm text-muted-foreground line-clamp-2">
                {store.description}
              </p>
            )}
          </div>
        </div>

        {(store.supportEmail || store.supportPhone) && (
          <div className="mt-6 flex flex-wrap gap-4 text-sm text-muted-foreground">
            {store.supportEmail && (
              <a
                href={`mailto:${store.supportEmail}`}
                className="flex items-center gap-1.5 hover:text-foreground"
              >
                <Mail className="h-4 w-4" />
                {store.supportEmail}
              </a>
            )}
            {store.supportPhone && (
              <a
                href={`tel:${store.supportPhone}`}
                className="flex items-center gap-1.5 hover:text-foreground"
              >
                <Phone className="h-4 w-4" />
                {store.supportPhone}
              </a>
            )}
          </div>
        )}
      </div>

      {/* Products grid */}
      <div className="max-w-5xl mx-auto px-4 py-10 space-y-6">
        <div className="flex items-center justify-between flex-wrap gap-3">
          <h2 className="text-xl font-semibold">
            {productsLoading ? "Loading products..." : `${products.length} products`}
          </h2>
          <div className="flex items-center gap-2 text-sm">
            <span className="text-muted-foreground">Sort by</span>
            <Select
              value={sort}
              onValueChange={(v) => setSort(v as ProductSortOrder)}
            >
              <SelectTrigger className="w-48">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {PRODUCT_SORT_ORDERS.map((s) => (
                  <SelectItem key={s} value={s}>
                    {PRODUCT_SORT_LABEL[s]}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {productsLoading && products.length === 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="aspect-square animate-pulse rounded-lg bg-muted" />
            ))}
          </div>
        ) : products.length === 0 ? (
          <Card>
            <CardContent className="py-16 text-center space-y-3">
              <StoreIcon className="h-10 w-10 mx-auto text-muted-foreground/40" />
              <h2 className="font-semibold">No products yet</h2>
              <p className="text-sm text-muted-foreground">
                This seller is setting up their catalog. Check back shortly.
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {products.map((p) => (
              <ProductCard
                key={p.id}
                product={p}
                currency={store.currencyCode}
              />
            ))}
          </div>
        )}

        {products.length === 20 && (
          <div className="flex justify-center pt-4">
            <Button variant="outline" disabled>
              Load more (pagination coming in Sprint 5)
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
