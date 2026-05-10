"use client";

/**
 * /category/[slug] — SEO-friendly category landing page.
 *
 * Loads the category by slug, renders a header (image + name + description),
 * lists active sub-categories as chips, and shows products in that category
 * using the same product grid + pagination as /shop. The filter sidebar
 * hides its own Category section since the category is already locked by
 * the URL.
 *
 * SEO posture:
 *   - <h1> uses the category name (real semantic heading, not just a
 *     visual style)
 *   - document.title set client-side to "<Category> | LUXE"
 *   - <meta name="description"> updated client-side
 *   - Breadcrumb nav for both UX and search engines
 *   - Cross-links to sub-categories help search engines discover them
 *
 * For a full SSR/server-metadata pass, lift this into a server component
 * with `generateMetadata` later. The current setup matches the rest of
 * the storefront (Apollo client), so we keep parity here.
 */

import { useEffect, useMemo } from "react";
import Link from "next/link";
import Image from "next/image";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { useQuery } from "@apollo/client/react";
import { ChevronRight, Home } from "lucide-react";

import { GET_PUBLIC_CATEGORY_BY_SLUG } from "@/lib/graphql/categories";
import { GET_PAGINATED_PUBLIC_PRODUCTS } from "@/lib/graphql/products";
import type {
  GetPaginatedPublicProductsData,
  Product,
  ProductSortOrder,
} from "@/types/product.types";
import type { GetPublicCategoryBySlugData } from "@/types/category.types";

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
const SITE_NAME = "LUXE";

const SORT_OPTIONS: { value: ProductSortOrder | "RECOMMENDED"; label: string }[] = [
  { value: "RECOMMENDED", label: "Recommended" },
  { value: "NEWEST", label: "Newest" },
  { value: "PRICE_ASC", label: "Price: Low to High" },
  { value: "PRICE_DESC", label: "Price: High to Low" },
];

export default function CategoryPage() {
  const params = useParams<{ slug: string }>();
  const slug = params.slug;
  const router = useRouter();
  const search = useSearchParams();

  // ---- Load the category ------------------------------------------------
  const catQ = useQuery<GetPublicCategoryBySlugData>(
    GET_PUBLIC_CATEGORY_BY_SLUG,
    {
      variables: { slug },
      fetchPolicy: "cache-and-network",
      errorPolicy: "all",
    },
  );
  const category = catQ.data?.publicCategoryBySlug;

  // ---- Filter state (URL-driven, same pattern as /shop) -----------------
  // Category is fixed by the route; the sidebar's category section is
  // hidden, so categorySlug stays at null in the local filter object.
  const filters: ShopFiltersValue = useMemo(
    () => ({
      categorySlug: null,
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
    router.push(`/category/${slug}?${next.toString()}`, { scroll: false });
  }

  function handleFiltersChange(next: ShopFiltersValue) {
    updateParams({
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

  // ---- Translate filters → query variables ------------------------------
  const bucket = PRICE_BUCKETS.find((b) => b.key === filters.priceBucket);
  const queryVars = {
    categorySlug: slug, // ← LOCKED to this category
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
      // Don't fetch products until we know the category exists — saves
      // a wasted query when the slug 404s.
      skip: !category,
    },
  );

  const result = productsQ.data?.paginatedPublicProducts;
  const items: Product[] = result?.items ?? [];
  const totalCount = result?.totalCount ?? 0;
  const totalPages = result?.totalPages ?? 1;
  const startIdx = totalCount > 0 ? (page - 1) * PAGE_SIZE + 1 : 0;
  const endIdx = Math.min(page * PAGE_SIZE, totalCount);

  // ---- SEO meta (client-side, matches the rest of the storefront) -------
  useEffect(() => {
    if (!category) return;
    document.title = `${category.name} | ${SITE_NAME}`;
    const desc =
      category.description ?? `Shop ${category.name} on ${SITE_NAME}.`;
    const meta =
      document.querySelector('meta[name="description"]') ??
      Object.assign(document.createElement("meta"), { name: "description" });
    meta.setAttribute("content", desc);
    if (!meta.parentElement) document.head.appendChild(meta);
  }, [category]);

  // ---- 404 the page itself if the slug doesn't resolve ------------------
  if (catQ.loading && !category) {
    return <SkeletonView />;
  }
  if (!category) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-20 text-center space-y-3">
        <h1 className="text-3xl font-bold">Category not found</h1>
        <p className="text-muted-foreground">
          This category doesn&apos;t exist or is no longer active.
        </p>
        <Link
          href="/shop"
          className="inline-flex items-center justify-center rounded-md bg-brand text-white px-6 py-3 text-sm font-semibold hover:bg-brand/90 transition"
        >
          Browse all products
        </Link>
      </div>
    );
  }

  const subCats = category.children ?? [];

  return (
    <div className="max-w-7xl mx-auto px-4 py-10 lg:py-14 space-y-8">
      {/* ============================ Header ============================ */}
      <Breadcrumbs categoryName={category.name} />

      <header className="grid gap-6 lg:grid-cols-[1fr_auto] lg:items-end">
        <div className="space-y-3">
          <h1 className="text-4xl sm:text-5xl font-bold tracking-tight">
            {category.name}
          </h1>
          {category.description && (
            <p className="text-base text-foreground/70 max-w-2xl">
              {category.description}
            </p>
          )}
        </div>
        {category.imageUrl && (
          <div className="relative aspect-[16/9] sm:aspect-[5/3] lg:aspect-square lg:w-48 rounded-lg overflow-hidden bg-muted">
            <Image
              src={category.imageUrl}
              alt={category.name}
              fill
              sizes="(max-width: 1024px) 100vw, 200px"
              className="object-cover"
            />
          </div>
        )}
      </header>

      {/* Sub-category chips — both UX (drill down) and SEO (crawl link) */}
      {subCats.length > 0 && (
        <nav aria-label="Sub-categories" className="flex flex-wrap gap-2">
          {subCats.map((sub) => (
            <Link
              key={sub.id}
              href={`/category/${sub.slug}`}
              className="inline-flex items-center rounded-full border bg-card px-4 py-1.5 text-sm font-medium text-foreground/80 hover:border-foreground/40 hover:text-foreground transition"
            >
              {sub.name}
            </Link>
          ))}
        </nav>
      )}

      {/* ============================ Body ============================== */}
      <div className="grid grid-cols-1 lg:grid-cols-[260px_1fr] gap-10">
        <ShopFilters
          value={filters}
          onChange={handleFiltersChange}
          showCategory={false}
        />

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
    </div>
  );
}

/* -------------------------------------------------------------------------- */

function Breadcrumbs({ categoryName }: { categoryName: string }) {
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
      <span className="text-foreground font-medium">{categoryName}</span>
    </nav>
  );
}

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
        Try removing a filter or browsing the parent category.
      </p>
    </div>
  );
}

function SkeletonView() {
  return (
    <div className="max-w-7xl mx-auto px-4 py-10 lg:py-14 space-y-8">
      <div className="h-4 w-48 bg-muted animate-pulse rounded" />
      <div className="h-12 w-2/3 bg-muted animate-pulse rounded" />
      <div className="h-4 w-1/2 bg-muted animate-pulse rounded" />
      <div className="grid grid-cols-1 lg:grid-cols-[260px_1fr] gap-10">
        <div className="h-96 bg-muted animate-pulse rounded-lg" />
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 auto-rows-fr">
          <div className="col-span-2 row-span-2 aspect-[16/14] rounded-lg bg-muted animate-pulse" />
          {Array.from({ length: 4 }).map((_, i) => (
            <div
              key={i}
              className="aspect-square rounded-lg bg-muted animate-pulse"
            />
          ))}
        </div>
      </div>
    </div>
  );
}
