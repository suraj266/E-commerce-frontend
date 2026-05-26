"use client";

import Link from "next/link";
import type { CategoryShowcaseProps } from "./category-showcase.schema";
import {
  useResolvedCategories,
  type ResolvedCategoryTile,
} from "./category-showcase-shared";

/**
 * Mosaic variant — first tile is large (2x2), the next 4 sit alongside in a
 * 2x2 grid. Designed for ~5 categories. Falls back to a flat 3-up grid for
 * counts < 5 to avoid awkward gaps.
 */
export function CategoryShowcaseMosaicView(props: CategoryShowcaseProps) {
  const { tiles, loading } = useResolvedCategories(props);

  if (loading && tiles.length === 0) {
    return (
      <section className={`px-4 py-10 sm:py-14 ${props.width === "full" ? "w-full" : "max-w-6xl mx-auto"}`}>
        {props.title && (
          <h2 className="text-2xl sm:text-3xl font-bold mb-4">{props.title}</h2>
        )}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 lg:h-[480px]">
          {Array.from({ length: 5 }).map((_, i) => (
            <div
              key={i}
              className={`rounded-md bg-muted animate-pulse aspect-square ${
                i === 0 ? "lg:row-span-2 lg:col-span-2 lg:aspect-auto" : ""
              }`}
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

  if (tiles.length < 5) {
    return (
      <section className={`px-4 py-10 sm:py-14 ${props.width === "full" ? "w-full" : "max-w-6xl mx-auto"}`}>
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
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
          {tiles.map((t) => (
            <CategoryTile
              key={t.id}
              tile={t}
              className="aspect-square"
              shapeClass={tileShapeClass}
            />
          ))}
        </div>
      </section>
    );
  }

  const [hero, ...rest] = tiles;
  const restFour = rest.slice(0, 4);

  return (
    <section className={`px-4 py-10 sm:py-14 ${props.width === "full" ? "w-full" : "max-w-6xl mx-auto"}`}>
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

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 lg:h-[480px]">
        <CategoryTile
          tile={hero}
          className="aspect-square lg:aspect-auto lg:row-span-2 lg:col-span-2 col-span-2"
          shapeClass={tileShapeClass}
        />
        {restFour.map((t) => (
          <CategoryTile
            key={t.id}
            tile={t}
            className="aspect-square lg:aspect-auto"
            shapeClass={tileShapeClass}
          />
        ))}
      </div>
    </section>
  );
}

function CategoryTile({
  tile,
  className,
  shapeClass,
}: {
  tile: ResolvedCategoryTile;
  className?: string;
  /** Pre-resolved Tailwind class for tile corner shape (e.g. "rounded-full"). */
  shapeClass?: string;
}) {
  return (
    <Link
      href={`/category/${tile.slug}`}
      className={`group relative overflow-hidden bg-muted ${shapeClass ?? ""} ${className ?? ""}`}
    >
      {tile.imageUrl ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={tile.imageUrl}
          alt={tile.name}
          className="absolute inset-0 h-full w-full object-cover group-hover:scale-105 transition-transform"
        />
      ) : (
        <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-primary/5" />
      )}
      <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 to-transparent p-3 sm:p-4">
        <span className="text-white text-sm sm:text-base font-semibold line-clamp-2">
          {tile.name}
        </span>
      </div>
    </Link>
  );
}
