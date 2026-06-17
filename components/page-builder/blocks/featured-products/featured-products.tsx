"use client";

import { useQuery } from "@apollo/client/react";
import { GET_PUBLIC_PRODUCTS } from "@/lib/graphql/products";
import type { GetPublicProductsData } from "@/types/product.types";
import { ShopProductCard } from "@/app/(public)/shop/_components/shop-product-card";
import type { FeaturedProductsProps } from "./featured-products.schema";

const COLS_CLASS: Record<number, string> = {
  2: "grid-cols-2",
  3: "grid-cols-2 sm:grid-cols-3",
  4: "grid-cols-2 sm:grid-cols-3 lg:grid-cols-4",
  5: "grid-cols-2 sm:grid-cols-3 lg:grid-cols-5",
  6: "grid-cols-2 sm:grid-cols-3 lg:grid-cols-6",
};

export function FeaturedProductsView(props: FeaturedProductsProps) {
  const variables = (() => {
    const limit = props.maxItems;
    if (props.source === "category") {
      return { categorySlug: props.categorySlug || null, limit };
    }
    if (props.source === "brand") {
      return { brandSlug: props.brandSlug || null, limit };
    }
    if (props.source === "tag") {
      return { tagSlug: props.tagSlug || null, limit };
    }
    if (props.source === "collection") {
      return { collectionSlug: props.collectionSlug || null, limit };
    }
    // "manual" — server doesn't yet take an array of slugs; for v1 we fetch
    // all and filter client-side. For long lists, add a `slugs` arg later.
    return { limit: 24 };
  })();

  const { data, loading } = useQuery<GetPublicProductsData>(
    GET_PUBLIC_PRODUCTS,
    {
      variables,
      fetchPolicy: "cache-and-network",
    },
  );

  let items = data?.publicProducts ?? [];
  if (props.source === "manual") {
    const wanted = props.productSlugs
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);
    if (wanted.length > 0) {
      items = items
        .filter((p) => wanted.includes(p.slug))
        .slice(0, props.maxItems);
    } else {
      items = [];
    }
  } else {
    items = items.slice(0, props.maxItems);
  }

  if (loading && items.length === 0) {
    return (
      <section className="px-4 py-10 sm:py-14 max-w-6xl mx-auto">
        {props.title && (
          <h2 className="text-2xl sm:text-3xl font-bold mb-4">
            {props.title}
          </h2>
        )}
        <div className={`grid gap-x-4 sm:gap-x-6 gap-y-8 sm:gap-y-10 ${COLS_CLASS[props.columns] ?? COLS_CLASS[4]}`}>
          {Array.from({ length: props.maxItems }).map((_, i) => (
            <div key={i} className="aspect-[4/5] bg-muted animate-pulse" />
          ))}
        </div>
      </section>
    );
  }

  if (items.length === 0) return null;

  return (
    <section className="px-4 py-10 sm:py-14 max-w-6xl mx-auto">
      {(props.title || props.subtitle) && (
        <header className="mb-6">
          {props.title && (
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">
              {props.title}
            </h2>
          )}
          {props.subtitle && (
            <p className="text-muted-foreground mt-1">{props.subtitle}</p>
          )}
        </header>
      )}

      <div
        className={
          props.layout === "carousel"
            ? "grid grid-flow-col auto-cols-[200px] sm:auto-cols-[240px] gap-x-4 sm:gap-x-6 overflow-x-auto pb-2"
            : `grid gap-x-4 sm:gap-x-6 gap-y-8 sm:gap-y-10 ${COLS_CLASS[props.columns] ?? COLS_CLASS[4]}`
        }
      >
        {items.map((p) => (
          <ShopProductCard key={p.id} product={p} />
        ))}
      </div>
    </section>
  );
}
