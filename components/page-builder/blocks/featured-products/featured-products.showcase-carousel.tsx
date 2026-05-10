"use client";

import Link from "next/link";
import { useRef } from "react";
import { useQuery } from "@apollo/client/react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { GET_PUBLIC_PRODUCTS } from "@/lib/graphql/products";
import type { GetPublicProductsData, Product } from "@/types/product.types";
import { formatPrice } from "@/lib/utils/currency";
import type { FeaturedProductsProps } from "./featured-products.schema";

const NEW_ARRIVAL_DAYS = 30;
const SCROLL_STEP_PX = 240;

/**
 * Showcase carousel — horizontal product scroller with arrow nav and
 * auto-derived badges. Shows "Bestseller" when isFeatured is true and the
 * product is older than the new-arrival window, otherwise "New arrival" for
 * recent listings.
 */
export function FeaturedProductsShowcaseCarouselView(
  props: FeaturedProductsProps,
) {
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
    return { limit: 24 };
  })();

  const { data, loading } = useQuery<GetPublicProductsData>(
    GET_PUBLIC_PRODUCTS,
    {
      variables,
      fetchPolicy: "cache-and-network",
    },
  );

  let items: Product[] = data?.publicProducts ?? [];
  if (props.source === "manual") {
    const wanted = props.productSlugs
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);
    items = wanted.length > 0
      ? items.filter((p) => wanted.includes(p.slug)).slice(0, props.maxItems)
      : [];
  } else {
    items = items.slice(0, props.maxItems);
  }

  const scrollerRef = useRef<HTMLDivElement | null>(null);
  function nudge(dir: -1 | 1) {
    const el = scrollerRef.current;
    if (!el) return;
    el.scrollBy({ left: dir * SCROLL_STEP_PX, behavior: "smooth" });
  }

  if (loading && items.length === 0) {
    return (
      <section className="py-10 sm:py-14 max-w-6xl mx-auto">
        {props.title && (
          <h2 className="px-4 text-2xl sm:text-3xl font-bold mb-4">
            {props.title}
          </h2>
        )}
        <div className="flex gap-4 px-4 overflow-hidden">
          {Array.from({ length: props.maxItems }).map((_, i) => (
            <div
              key={i}
              className="flex-shrink-0 w-[200px] sm:w-[240px] aspect-[3/4] rounded-md bg-muted animate-pulse"
            />
          ))}
        </div>
      </section>
    );
  }

  if (items.length === 0) return null;

  return (
    <section className="py-10 sm:py-14 max-w-6xl mx-auto">
      <header className="px-4 mb-4 flex items-end justify-between gap-4">
        <div>
          {props.title && (
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">
              {props.title}
            </h2>
          )}
          {props.subtitle && (
            <p className="text-muted-foreground mt-1">{props.subtitle}</p>
          )}
        </div>
        <div className="hidden sm:flex items-center gap-2">
          <button
            type="button"
            onClick={() => nudge(-1)}
            aria-label="Scroll left"
            className="rounded-full border bg-background p-2 hover:bg-accent transition"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          <button
            type="button"
            onClick={() => nudge(1)}
            aria-label="Scroll right"
            className="rounded-full border bg-background p-2 hover:bg-accent transition"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </header>

      <div
        ref={scrollerRef}
        className="flex gap-4 px-4 overflow-x-auto pb-3 scroll-smooth snap-x snap-mandatory"
      >
        {items.map((p) => {
          const primary = p.images?.find((i) => i.isPrimary) ?? p.images?.[0];
          const badge = props.showBadges ? deriveBadge(p) : null;
          const hasDiscount =
            p.compareAtPrice != null && Number(p.compareAtPrice) > Number(p.price);

          return (
            <Link
              key={p.id}
              href={`/product/${p.slug}`}
              className="group flex-shrink-0 w-[200px] sm:w-[240px] snap-start rounded-md border bg-card overflow-hidden hover:shadow-md transition"
            >
              <div className="relative aspect-[3/4] bg-muted overflow-hidden">
                {primary ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={primary.imageUrl}
                    alt={primary.altText ?? p.name}
                    className="absolute inset-0 h-full w-full object-cover group-hover:scale-105 transition-transform"
                  />
                ) : null}
                {badge && (
                  <span
                    className={`absolute top-2 left-2 text-[10px] uppercase tracking-wide font-semibold px-2 py-1 rounded-full ${badge.className}`}
                  >
                    {badge.label}
                  </span>
                )}
              </div>
              <div className="p-3 space-y-1">
                <div className="text-sm font-medium line-clamp-2 min-h-[2.5em]">
                  {p.name}
                </div>
                <div className="flex items-baseline gap-2">
                  <span className="text-sm font-semibold">
                    {formatPrice(p.price)}
                  </span>
                  {hasDiscount && (
                    <span className="text-xs text-muted-foreground line-through">
                      {formatPrice(p.compareAtPrice!)}
                    </span>
                  )}
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </section>
  );
}

function deriveBadge(
  p: Product,
): { label: string; className: string } | null {
  const ageDays = ageInDays(p.createdAt);
  const isNew = ageDays != null && ageDays <= NEW_ARRIVAL_DAYS;
  if (p.isFeatured && !isNew) {
    return {
      label: "Bestseller",
      className: "bg-amber-500 text-white",
    };
  }
  if (isNew) {
    return {
      label: "New arrival",
      className: "bg-emerald-500 text-white",
    };
  }
  if (p.isFeatured) {
    return {
      label: "Trending",
      className: "bg-primary text-primary-foreground",
    };
  }
  return null;
}

function ageInDays(iso: string): number | null {
  const t = Date.parse(iso);
  if (Number.isNaN(t)) return null;
  return (Date.now() - t) / 86_400_000;
}
