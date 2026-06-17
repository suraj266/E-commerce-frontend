"use client";

/**
 * /collections/[slug] — public collection page.
 *
 * Header (name / description / banner) from `publicCollection`, then a product
 * grid driven by `paginatedPublicProducts(collectionSlug)`. Membership is
 * resolved server-side (manual junction OR smart rule), so this page works for
 * both collection kinds with the same query. Reuses the shop grid + card.
 */

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useQuery } from "@apollo/client/react";

import { GET_PUBLIC_COLLECTION } from "@/lib/graphql/collections";
import { GET_PAGINATED_PUBLIC_PRODUCTS } from "@/lib/graphql/products";
import type { GetPublicCollectionData } from "@/types/collection.types";
import type {
  GetPaginatedPublicProductsData,
  Product,
  ProductSortOrder,
} from "@/types/product.types";

import { ShopProductCard } from "@/app/(public)/shop/_components/shop-product-card";
import { ShopPagination } from "@/app/(public)/shop/_components/shop-pagination";

const PAGE_SIZE = 12;

const SORT_OPTIONS: { value: ProductSortOrder | "RECOMMENDED"; label: string }[] = [
  { value: "RECOMMENDED", label: "Recommended" },
  { value: "NEWEST", label: "Newest" },
  { value: "PRICE_ASC", label: "Price: Low to High" },
  { value: "PRICE_DESC", label: "Price: High to Low" },
];

export default function CollectionPage() {
  const params = useParams<{ slug: string }>();
  const slug = params.slug;

  const [page, setPage] = useState(1);
  const [sort, setSort] = useState<ProductSortOrder | "RECOMMENDED">("RECOMMENDED");

  const { data: colData, loading: colLoading, error } =
    useQuery<GetPublicCollectionData>(GET_PUBLIC_COLLECTION, {
      variables: { slug },
      errorPolicy: "all",
    });
  const collection = colData?.publicCollection;

  const { data: prodData, loading: prodLoading } =
    useQuery<GetPaginatedPublicProductsData>(GET_PAGINATED_PUBLIC_PRODUCTS, {
      variables: {
        collectionSlug: slug,
        sort: sort === "RECOMMENDED" ? null : sort,
        page,
        pageSize: PAGE_SIZE,
      },
      fetchPolicy: "cache-and-network",
    });

  const result = prodData?.paginatedPublicProducts;
  const items: Product[] = result?.items ?? [];
  const totalCount = result?.totalCount ?? 0;
  const totalPages = result?.totalPages ?? 1;

  useEffect(() => {
    if (collection?.name && typeof document !== "undefined") {
      document.title = `${collection.name} | MultiMart`;
    }
  }, [collection?.name]);

  if (colLoading && !collection) {
    return (
      <div className="max-w-7xl mx-auto p-8">
        <div className="h-40 animate-pulse rounded-lg bg-muted" />
      </div>
    );
  }

  if (error || !collection) {
    return (
      <div className="max-w-5xl mx-auto px-4 py-16 text-center space-y-3">
        <h1 className="text-2xl font-bold">Collection not found</h1>
        <p className="text-sm text-muted-foreground">
          &ldquo;{slug}&rdquo; doesn&apos;t exist or is inactive.
        </p>
        <Link href="/shop" className="text-primary hover:underline text-sm">
          Browse the shop
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-10 lg:py-14 space-y-8">
      {/* Header */}
      <header className="space-y-3">
        {collection.bannerUrl && (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={collection.bannerUrl}
            alt={collection.name}
            className="w-full h-44 sm:h-56 object-cover rounded-xl"
          />
        )}
        <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between border-b pb-5">
          <div>
            <h1 className="text-3xl sm:text-4xl font-bold tracking-tight">
              {collection.name}
            </h1>
            {collection.description && (
              <p className="mt-1 text-sm text-foreground/60">
                {collection.description}
              </p>
            )}
            <p className="mt-1 text-xs text-foreground/50">
              {totalCount > 0
                ? `${totalCount} product${totalCount === 1 ? "" : "s"}`
                : prodLoading
                  ? "Loading…"
                  : "No products in this collection yet"}
            </p>
          </div>
          <label className="flex items-center gap-3 text-sm text-foreground/70">
            Sort by:
            <select
              value={sort}
              onChange={(e) => {
                setSort(e.target.value as ProductSortOrder | "RECOMMENDED");
                setPage(1);
              }}
              className="rounded-md border border-input bg-background px-3 py-2 text-sm font-medium outline-none focus:border-brand transition"
            >
              {SORT_OPTIONS.map((o) => (
                <option key={o.value} value={o.value}>
                  {o.label}
                </option>
              ))}
            </select>
          </label>
        </div>
      </header>

      {/* Grid */}
      {prodLoading && items.length === 0 ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-4 sm:gap-x-6 gap-y-8 sm:gap-y-10">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="aspect-[4/5] bg-muted animate-pulse" />
          ))}
        </div>
      ) : items.length === 0 ? (
        <div className="rounded-lg border bg-muted/30 px-6 py-16 text-center">
          <p className="text-base font-semibold">Nothing here yet</p>
          <p className="mt-1 text-sm text-foreground/60">
            Check back soon — this collection updates automatically.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-4 sm:gap-x-6 gap-y-8 sm:gap-y-10">
          {items.map((p) => (
            <ShopProductCard key={p.id} product={p} />
          ))}
        </div>
      )}

      <ShopPagination
        currentPage={page}
        totalPages={totalPages}
        onPageChange={(next) => {
          setPage(next);
          if (typeof window !== "undefined")
            window.scrollTo({ top: 0, behavior: "smooth" });
        }}
      />
    </div>
  );
}
