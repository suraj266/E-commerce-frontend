"use client";

import Link from "next/link";
import type { CategoryShowcaseProps } from "./category-showcase.schema";
import { useResolvedCategories } from "./category-showcase-shared";

/**
 * Equal-grid variant — uniform 3-up (mobile) / 6-up (desktop) tile grid.
 * Square thumbnails with the category name overlaid at the bottom.
 */
export function CategoryShowcaseEqualGridView(props: CategoryShowcaseProps) {
  const { tiles, loading } = useResolvedCategories(props);

  if (loading && tiles.length === 0) {
    return (
      <section className={`px-4 py-10 sm:py-14 ${props.width === "full" ? "w-full" : "max-w-6xl mx-auto"}`}>
        {props.title && (
          <h2 className="text-2xl sm:text-3xl font-bold mb-4">{props.title}</h2>
        )}
        <div className="grid grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
          {Array.from({ length: props.maxItems }).map((_, i) => (
            <div
              key={i}
              className="aspect-square rounded-md bg-muted animate-pulse"
            />
          ))}
        </div>
      </section>
    );
  }

  if (tiles.length === 0) return null;

  const tileShapeClass =
    props.tileShape === "circle"
      ? "rounded-full"
      : props.tileShape === "rounded"
        ? "rounded-md"
        : "";

  return (
    <section className={`px-4 py-10 sm:py-14 ${props.width === "full" ? "w-full" : "max-w-6xl mx-auto"}`}>
      {(props.title || props.subtitle) && (
        <header className="mb-6 text-center">
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

      <div className="grid grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
        {tiles.map((t) => (
          <Link
            key={t.id}
            href={`/category/${t.slug}`}
            className={`group relative aspect-square overflow-hidden bg-muted ${tileShapeClass}`}
          >
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
            <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 to-transparent p-2 sm:p-3">
              <span className="text-white text-xs sm:text-sm font-semibold line-clamp-2">
                {t.name}
              </span>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
