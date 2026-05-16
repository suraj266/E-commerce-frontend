"use client";

/**
 * /shop — customer-facing catalog browse.
 *
 * Filter state is mirrored to URL search params so:
 *   - browser back/forward steps through filter changes
 *   - the page is shareable (a /shop link reproduces the same view)
 *   - reloads don't drop the user's selection
 *
 * Server-side: category + price-range + sort + pagination via
 * `paginatedPublicProducts`. Size is rendered for design parity but doesn't
 * filter yet (most products in the catalog don't carry a Size attribute —
 * once they do, plumb the selected sizes through to a variant-attribute
 * filter on the backend query).
 */

import { Suspense, useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useQuery } from "@apollo/client/react";

import { GET_PAGINATED_PUBLIC_PRODUCTS } from "@/lib/graphql/products";
import type {
  GetPaginatedPublicProductsData,
  Product,
  ProductSortOrder,
} from "@/types/product.types";

import {
  ShopFilters,
  PRICE_BUCKETS,
  type PriceBucketKey,
  type ShopFiltersValue,
  type SizeOption,
} from "./_components/shop-filters";
import { ShopProductCard } from "./_components/shop-product-card";
import { ShopPagination } from "./_components/shop-pagination";

const PAGE_SIZE = 9;

const SORT_OPTIONS: { value: ProductSortOrder | "RECOMMENDED"; label: string }[] = [
  { value: "RECOMMENDED", label: "Recommended" },
  { value: "NEWEST", label: "Newest" },
  { value: "PRICE_ASC", label: "Price: Low to High" },
  { value: "PRICE_DESC", label: "Price: High to Low" },
];

export default function ShopPage() {
  // useSearchParams() triggers a CSR bailout during prerender — wrap so the
  // route can still be built without forcing the whole page to be dynamic.
  return (
    <Suspense fallback={null}>
      <ShopPageInner />
    </Suspense>
  );
}

function ShopPageInner() {
  const router = useRouter();
  const params = useSearchParams();

  // ---- Read filter state out of URL (single source of truth) ----
  const filters: ShopFiltersValue = useMemo(
    () => ({
      categorySlug: params.get("category") || null,
      priceBucket: (params.get("price") as PriceBucketKey) || "all",
      sizes: (params.get("sizes")?.split(",").filter(Boolean) ?? []) as SizeOption[],
    }),
    [params],
  );
  const sort = (params.get("sort") as ProductSortOrder | "RECOMMENDED") || "RECOMMENDED";
  const page = Math.max(1, Number(params.get("page")) || 1);

  // ---- Push partial updates back to URL ----
  function updateParams(patch: Record<string, string | null>) {
    const next = new URLSearchParams(params.toString());
    for (const [k, v] of Object.entries(patch)) {
      if (v === null || v === "") next.delete(k);
      else next.set(k, v);
    }
    // Whenever filters/sort change, reset to page 1 unless the patch is
    // explicitly setting a page.
    if (!("page" in patch)) next.delete("page");
    router.push(`/shop?${next.toString()}`, { scroll: false });
  }

  function handleFiltersChange(next: ShopFiltersValue) {
    updateParams({
      category: next.categorySlug,
      price: next.priceBucket === "all" ? null : next.priceBucket,
      sizes: next.sizes.length > 0 ? next.sizes.join(",") : null,
    });
  }
  function handleSortChange(next: string) {
    updateParams({ sort: next === "RECOMMENDED" ? null : next });
  }
  function handlePageChange(next: number) {
    updateParams({ page: String(next) });
    if (typeof window !== "undefined") {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }

  // ---- Translate filters → query variables ----
  const bucket = PRICE_BUCKETS.find((b) => b.key === filters.priceBucket);
  const queryVars = {
    categorySlug: filters.categorySlug,
    minPrice: bucket?.min ?? null,
    maxPrice: bucket?.max ?? null,
    // RECOMMENDED is a frontend-only sort; backend defaults to NEWEST in
    // its absence, which is a reasonable proxy for "Recommended" today.
    sort: sort === "RECOMMENDED" ? null : sort,
    page,
    pageSize: PAGE_SIZE,
  };

  const { data, loading } = useQuery<GetPaginatedPublicProductsData>(
    GET_PAGINATED_PUBLIC_PRODUCTS,
    {
      variables: queryVars,
      fetchPolicy: "cache-and-network",
    },
  );

  const result = data?.paginatedPublicProducts;
  const items: Product[] = result?.items ?? [];
  const totalCount = result?.totalCount ?? 0;
  const totalPages = result?.totalPages ?? 1;
  const startIdx = totalCount > 0 ? (page - 1) * PAGE_SIZE + 1 : 0;
  const endIdx = Math.min(page * PAGE_SIZE, totalCount);

  // ---- Header copy reflects the active category when one is selected ----
  const headerTitle = filters.categorySlug
    ? toTitleFromSlug(filters.categorySlug)
    : "New Arrivals";

  // ---- Reset hover state when filter set changes (debug nicety) ----
  const [stableKey, setStableKey] = useState(0);
  useEffect(() => {
    setStableKey((k) => k + 1);
  }, [filters.categorySlug, filters.priceBucket, sort, page]);

  return (
    <div className="max-w-7xl mx-auto px-4 py-10 lg:py-14 grid grid-cols-1 lg:grid-cols-[260px_1fr] gap-10">
      <ShopFilters value={filters} onChange={handleFiltersChange} />

      <main key={stableKey} className="space-y-6">
        {/* Header strip */}
        <header className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between border-b pb-5">
          <div>
            <h1 className="text-3xl sm:text-4xl font-bold tracking-tight">
              {headerTitle}
            </h1>
            <p className="mt-1 text-sm text-foreground/60">
              {totalCount > 0
                ? `Showing ${startIdx}-${endIdx} of ${totalCount} products`
                : loading
                  ? "Loading products..."
                  : "No products match these filters"}
            </p>
          </div>
          <label className="flex items-center gap-3 text-sm text-foreground/70">
            Sort by:
            <select
              value={sort}
              onChange={(e) => handleSortChange(e.target.value)}
              className="rounded-md border border-input bg-background px-3 py-2 text-sm font-medium outline-none focus:border-brand transition"
            >
              {SORT_OPTIONS.map((o) => (
                <option key={o.value} value={o.value}>
                  {o.label}
                </option>
              ))}
            </select>
          </label>
        </header>

        {/* Grid */}
        {loading && items.length === 0 ? (
          <SkeletonGrid />
        ) : items.length === 0 ? (
          <EmptyState />
        ) : (
          <ShopGrid items={items} />
        )}

        <ShopPagination
          currentPage={page}
          totalPages={totalPages}
          onPageChange={handlePageChange}
        />
      </main>
    </div>
  );
}

/* -------------------------------------------------------------------------- */

function ShopGrid({ items }: { items: Product[] }) {
  // Uniform grid — every card the same size. Density: 2 / 3 / 4 cols.
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-4 sm:gap-x-6 gap-y-8 sm:gap-y-10">
      {items.map((p) => (
        <ShopProductCard key={p.id} product={p} />
      ))}
    </div>
  );
}

function SkeletonGrid() {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-4 sm:gap-x-6 gap-y-8 sm:gap-y-10">
      {Array.from({ length: 8 }).map((_, i) => (
        <div
          key={i}
          className="aspect-[4/5] bg-muted animate-pulse"
        />
      ))}
    </div>
  );
}

function EmptyState() {
  return (
    <div className="rounded-lg border bg-muted/30 px-6 py-16 text-center">
      <p className="text-base font-semibold">No products found</p>
      <p className="mt-1 text-sm text-foreground/60">
        Try removing a filter or picking a different category.
      </p>
    </div>
  );
}

function toTitleFromSlug(slug: string): string {
  return slug
    .split("-")
    .filter((w) => !/^\d+$/.test(w))
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
}
