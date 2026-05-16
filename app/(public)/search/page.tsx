"use client";

/**
 * /search — customer-facing product search.
 *
 * Mirrors /shop's URL-as-state pattern but with a `q` parameter front and
 * centre. Reuses the shop's product card, pagination, filters, and price
 * bucket logic — same look, same filters, term-aware copy.
 *
 * v1 backend uses ILIKE across product name / shortDescription / brand name.
 * Faster, weighted full-text search lands later (see SEARCH.md).
 */

import { Suspense, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useQuery } from "@apollo/client/react";
import { Search as SearchIcon } from "lucide-react";

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
} from "../shop/_components/shop-filters";
import { ShopProductCard } from "../shop/_components/shop-product-card";
import { ShopPagination } from "../shop/_components/shop-pagination";

const PAGE_SIZE = 12;

const SORT_OPTIONS: { value: ProductSortOrder | "RECOMMENDED"; label: string }[] = [
  { value: "RECOMMENDED", label: "Most relevant" },
  { value: "NEWEST", label: "Newest" },
  { value: "PRICE_ASC", label: "Price: Low to High" },
  { value: "PRICE_DESC", label: "Price: High to Low" },
];

export default function SearchPage() {
  // useSearchParams() suspends in App Router; wrap so the page can stream.
  return (
    <Suspense fallback={<PageSkeleton />}>
      <SearchPageInner />
    </Suspense>
  );
}

function SearchPageInner() {
  const router = useRouter();
  const params = useSearchParams();

  const q = params.get("q") ?? "";
  const filters: ShopFiltersValue = useMemo(
    () => ({
      categorySlug: params.get("category") || null,
      priceBucket: (params.get("price") as PriceBucketKey) || "all",
      sizes: (params.get("sizes")?.split(",").filter(Boolean) ?? []) as SizeOption[],
    }),
    [params],
  );
  const sort =
    (params.get("sort") as ProductSortOrder | "RECOMMENDED") || "RECOMMENDED";
  const page = Math.max(1, Number(params.get("page")) || 1);

  // Local controlled input so typing doesn't push to the URL on every key.
  // Commit on submit / debounce.
  const [searchInput, setSearchInput] = useState(q);
  useEffect(() => {
    setSearchInput(q);
  }, [q]);

  function updateParams(patch: Record<string, string | null>) {
    const next = new URLSearchParams(params.toString());
    for (const [k, v] of Object.entries(patch)) {
      if (v === null || v === "") next.delete(k);
      else next.set(k, v);
    }
    // Any filter/sort/search change resets to page 1 unless the patch sets page.
    if (!("page" in patch)) next.delete("page");
    router.push(`/search?${next.toString()}`, { scroll: false });
  }

  function handleSubmitQuery(e: React.FormEvent) {
    e.preventDefault();
    updateParams({ q: searchInput.trim() || null });
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

  const bucket = PRICE_BUCKETS.find((b) => b.key === filters.priceBucket);
  const queryVars = {
    search: q || null,
    categorySlug: filters.categorySlug,
    minPrice: bucket?.min ?? null,
    maxPrice: bucket?.max ?? null,
    sort: sort === "RECOMMENDED" ? null : sort,
    page,
    pageSize: PAGE_SIZE,
  };

  const { data, loading } = useQuery<GetPaginatedPublicProductsData>(
    GET_PAGINATED_PUBLIC_PRODUCTS,
    {
      variables: queryVars,
      // Skip while the user hasn't entered a search — show the empty hero
      // and don't waste a roundtrip listing every product on first load.
      skip: !q,
      fetchPolicy: "cache-and-network",
    },
  );

  const result = data?.paginatedPublicProducts;
  const items: Product[] = result?.items ?? [];
  const totalCount = result?.totalCount ?? 0;
  const totalPages = result?.totalPages ?? 1;
  const startIdx = totalCount > 0 ? (page - 1) * PAGE_SIZE + 1 : 0;
  const endIdx = Math.min(page * PAGE_SIZE, totalCount);

  return (
    <div className="max-w-7xl mx-auto px-4 py-10 lg:py-14 space-y-8">
      {/* Search bar (term in URL drives query) */}
      <form
        onSubmit={handleSubmitQuery}
        className="flex items-center gap-2 max-w-2xl"
      >
        <div className="relative flex-1">
          <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-foreground/50" />
          <input
            type="search"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            placeholder="Search products, brands, descriptions..."
            autoFocus={!q}
            className="w-full rounded-md border border-input bg-background pl-9 pr-3 py-2.5 text-sm outline-none focus:border-brand transition"
          />
        </div>
        <button
          type="submit"
          className="inline-flex items-center justify-center rounded-md bg-brand text-white px-5 py-2.5 text-sm font-semibold hover:bg-brand/90 transition"
        >
          Search
        </button>
      </form>

      {!q ? (
        <SearchHero />
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-[260px_1fr] gap-10">
          <ShopFilters value={filters} onChange={handleFiltersChange} />

          <main className="space-y-6">
            <header className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between border-b pb-5">
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
                  Results for{" "}
                  <span className="text-brand">&ldquo;{q}&rdquo;</span>
                </h1>
                <p className="mt-1 text-sm text-foreground/60">
                  {loading && items.length === 0
                    ? "Searching..."
                    : totalCount > 0
                      ? `Showing ${startIdx}-${endIdx} of ${totalCount} ${
                          totalCount === 1 ? "match" : "matches"
                        }`
                      : "No products match this search"}
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

            {loading && items.length === 0 ? (
              <SkeletonGrid />
            ) : items.length === 0 ? (
              <NoResultsState query={q} />
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
              onPageChange={handlePageChange}
            />
          </main>
        </div>
      )}
    </div>
  );
}

/* -------------------------------------------------------------------------- */

function SearchHero() {
  return (
    <div className="rounded-lg border bg-muted/20 px-6 py-20 text-center max-w-2xl mx-auto">
      <SearchIcon className="mx-auto h-10 w-10 text-foreground/30" />
      <h2 className="mt-4 text-xl font-semibold tracking-tight">
        What are you looking for?
      </h2>
      <p className="mt-2 text-sm text-foreground/60">
        Start typing a product name, brand, or category — we&apos;ll find
        matching listings across the whole catalog.
      </p>
      <div className="mt-6">
        <Link
          href="/shop"
          className="text-sm text-brand hover:underline font-medium"
        >
          Or browse the full shop →
        </Link>
      </div>
    </div>
  );
}

function NoResultsState({ query }: { query: string }) {
  return (
    <div className="rounded-lg border bg-muted/30 px-6 py-16 text-center">
      <p className="text-base font-semibold">
        Nothing matches &ldquo;{query}&rdquo;
      </p>
      <p className="mt-1 text-sm text-foreground/60">
        Try a shorter query, or remove some filters.
      </p>
      <Link
        href="/shop"
        className="mt-4 inline-flex items-center text-sm text-brand hover:underline font-medium"
      >
        Browse the full shop →
      </Link>
    </div>
  );
}

function SkeletonGrid() {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-4 sm:gap-x-6 gap-y-8 sm:gap-y-10">
      {Array.from({ length: 8 }).map((_, i) => (
        <div key={i} className="aspect-[4/5] bg-muted animate-pulse" />
      ))}
    </div>
  );
}

function PageSkeleton() {
  return (
    <div className="max-w-7xl mx-auto px-4 py-10 lg:py-14 space-y-8">
      <div className="h-10 w-full max-w-2xl bg-muted animate-pulse rounded-md" />
      <div className="h-40 w-full max-w-2xl mx-auto bg-muted animate-pulse rounded-lg" />
    </div>
  );
}
