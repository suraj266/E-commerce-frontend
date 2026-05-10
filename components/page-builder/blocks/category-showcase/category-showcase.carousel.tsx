"use client";

import Link from "next/link";
import type { CategoryShowcaseProps } from "./category-showcase.schema";
import { useResolvedCategories } from "./category-showcase-shared";

/**
 * Carousel variant — single horizontal row that scrolls on touch / overflow.
 * Each tile is a fixed-width card. Best for many categories where the equal
 * grid would feel cramped.
 */
export function CategoryShowcaseCarouselView(props: CategoryShowcaseProps) {
  const { tiles, loading } = useResolvedCategories(props);

  if (loading && tiles.length === 0) {
    return (
      <section className="py-10 sm:py-14 max-w-6xl mx-auto">
        {props.title && (
          <h2 className="px-4 text-2xl sm:text-3xl font-bold mb-4">
            {props.title}
          </h2>
        )}
        <div className="flex gap-3 sm:gap-4 px-4 overflow-x-auto pb-2">
          {Array.from({ length: props.maxItems }).map((_, i) => (
            <div
              key={i}
              className="aspect-square w-[140px] sm:w-[180px] flex-shrink-0 rounded-md bg-muted animate-pulse"
            />
          ))}
        </div>
      </section>
    );
  }

  if (tiles.length === 0) return null;

  return (
    <section className="py-10 sm:py-14 max-w-6xl mx-auto">
      {(props.title || props.subtitle) && (
        <header className="mb-6 px-4">
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

      <div className="flex gap-3 sm:gap-4 px-4 overflow-x-auto pb-3 scroll-smooth snap-x snap-mandatory">
        {tiles.map((t) => (
          <Link
            key={t.id}
            href={`/category/${t.slug}`}
            className="group flex-shrink-0 w-[140px] sm:w-[180px] snap-start"
          >
            <div className="relative aspect-square rounded-full overflow-hidden bg-muted">
              {t.imageUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={t.imageUrl}
                  alt={t.name}
                  className="absolute inset-0 h-full w-full object-cover group-hover:scale-105 transition-transform"
                />
              ) : (
                <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-primary/5" />
              )}
            </div>
            <div className="mt-2 text-center text-sm font-medium line-clamp-2">
              {t.name}
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
