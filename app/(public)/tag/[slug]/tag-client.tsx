"use client";

/**
 * Tag listing — interactive client island.
 *
 * Owns the tag header, the URL-driven filter / sort / pagination UI, and the
 * product-grid query filtered by this tag. The tag record is server-fetched
 * and passed in as a prop (see the sibling `page.tsx` Server Component, which
 * owns SEO metadata + BreadcrumbList JSON-LD and calls `notFound()` for
 * unknown tags).
 *
 * Mirrors `category-client.tsx`: the catalog comes from the existing paginated
 * products query filtered by `tagSlug`, rendered with the shared
 * `ShopProductCard`. Category stays a usable facet (a tag spans categories).
 */

import { Suspense, useMemo } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useQuery } from "@apollo/client/react";
import { ChevronRight, Hash, Home } from "lucide-react";

import { GET_PAGINATED_PUBLIC_PRODUCTS } from "@/lib/graphql/products";
import type {
  GetPaginatedPublicProductsData,
  Product,
  ProductSortOrder,
} from "@/types/product.types";
import type { Tag } from "@/types/tag.types";

import {
  ShopFilters,
  PRICE_BUCKETS,
  type PriceBucketKey,
  type ShopFiltersValue,
  type SizeOption,
} from "../../shop/_components/shop-filters";
import { ShopProductCard } from "../../shop/_components/shop-product-card";
import { ShopPagination } from "../../shop/_components/shop-pagination";

const PAGE_SIZE = 9;

const SORT_OPTIONS: { value: ProductSortOrder | "RECOMMENDED"; label: string }[] = [
  { value: "RECOMMENDED", label: "Recommended" },
  { value: "NEWEST", label: "Newest" },
  { value: "PRICE_ASC", label: "Price: Low to High" },
  { value: "PRICE_DESC", label: "Price: High to Low" },
];

export function TagClient({ tag, slug }: { tag: Tag; slug: string }) {
  return (
    <Suspense fallback={null}>
      <TagClientInner tag={tag} slug={slug} />
    </Suspense>
  );
}

function TagClientInner({ tag, slug }: { tag: Tag; slug: string }) {
  const router = useRouter();
  const search = useSearchParams();

  const filters: ShopFiltersValue = useMemo(
    () => ({
      categorySlug: search.get("category") || null,
      priceBucket: (search.get("price") as PriceBucketKey) || "all",
      sizes:
        (search.get("sizes")?.split(",").filter(Boolean) ?? []) as SizeOption[],
    }),
    [search],
  );
  const sort =
    (search.get("sort") as ProductSortOrder | "RECOMMENDED") || "RECOMMENDED";
  const page = Math.max(1, Number(search.get("page")) || 1);

  function updateParams(patch: Record<string, string | null>) {
    const next = new URLSearchParams(search.toString());
    for (const [k, v] of Object.entries(patch)) {
      if (v === null || v === "") next.delete(k);
      else next.set(k, v);
    }
    if (!("page" in patch)) next.delete("page");
    router.push(`/tag/${slug}?${next.toString()}`, { scroll: false });
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
    tagSlug: slug, // ← LOCKED to this tag
    categorySlug: filters.categorySlug,
    minPrice: bucket?.min ?? null,
    maxPrice: bucket?.max ?? null,
    sort: sort === "RECOMMENDED" ? null : sort,
    page,
    pageSize: PAGE_SIZE,
  };

  const productsQ = useQuery<GetPaginatedPublicProductsData>(
    GET_PAGINATED_PUBLIC_PRODUCTS,
    {
      variables: queryVars,
      fetchPolicy: "cache-and-network",
    },
  );

  const result = productsQ.data?.paginatedPublicProducts;
  const items: Product[] = result?.items ?? [];
  const totalCount = result?.totalCount ?? 0;
  const totalPages = result?.totalPages ?? 1;
  const startIdx = totalCount > 0 ? (page - 1) * PAGE_SIZE + 1 : 0;
  const endIdx = Math.min(page * PAGE_SIZE, totalCount);

  return (
    <div className="max-w-7xl mx-auto px-4 py-10 lg:py-14 space-y-8">
      {/* ============================ Header ============================ */}
      <Breadcrumbs tagName={tag.name} />

      <header className="flex items-center gap-3">
        <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
          <Hash className="h-6 w-6 text-primary" />
        </div>
        <div className="min-w-0">
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight truncate">
            #{tag.name}
          </h1>
          {tag.description && (
            <p className="text-sm text-foreground/70 mt-1 max-w-2xl">
              {tag.description}
            </p>
          )}
        </div>
      </header>

      {/* ============================ Body ============================== */}
      <div className="grid grid-cols-1 lg:grid-cols-[260px_1fr] gap-10">
        <ShopFilters value={filters} onChange={handleFiltersChange} />

        <main className="space-y-6">
          <header className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between border-b pb-5">
            <p className="text-sm text-foreground/60">
              {productsQ.loading && items.length === 0
                ? "Loading products..."
                : totalCount > 0
                  ? `Showing ${startIdx}-${endIdx} of ${totalCount} products`
                  : "No products match these filters"}
            </p>
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

          {productsQ.loading && items.length === 0 ? (
            <SkeletonGrid />
          ) : items.length === 0 ? (
            <EmptyState tagName={tag.name} />
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
    </div>
  );
}

/* -------------------------------------------------------------------------- */

function Breadcrumbs({ tagName }: { tagName: string }) {
  return (
    <nav
      aria-label="Breadcrumb"
      className="flex items-center gap-1 text-sm text-foreground/60"
    >
      <Link
        href="/"
        className="inline-flex items-center hover:text-foreground transition"
      >
        <Home className="h-3.5 w-3.5 mr-1" />
        Home
      </Link>
      <ChevronRight className="h-3.5 w-3.5" />
      <Link href="/shop" className="hover:text-foreground transition">
        Shop
      </Link>
      <ChevronRight className="h-3.5 w-3.5" />
      <span className="text-foreground font-medium">#{tagName}</span>
    </nav>
  );
}

function ShopGrid({ items }: { items: Product[] }) {
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
        <div key={i} className="aspect-[4/5] bg-muted animate-pulse rounded-xl" />
      ))}
    </div>
  );
}

function EmptyState({ tagName }: { tagName: string }) {
  return (
    <div className="rounded-lg border bg-muted/30 px-6 py-16 text-center">
      <Hash className="mx-auto h-10 w-10 text-foreground/30" />
      <p className="mt-3 text-base font-semibold">
        Nothing tagged #{tagName} yet
      </p>
      <p className="mt-1 text-sm text-foreground/60">
        Try removing a filter, or check back once sellers list more.
      </p>
    </div>
  );
}
