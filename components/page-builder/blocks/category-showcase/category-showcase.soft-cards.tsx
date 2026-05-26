"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { ArrowLeft, ArrowRight } from "lucide-react";
import type { CategoryShowcaseProps } from "./category-showcase.schema";
import { useResolvedCategories } from "./category-showcase-shared";

/**
 * Pastel rotating background tints. Each tile picks one by `idx % length`
 * so admins get the playful multi-color row without per-tile config.
 */
const PASTEL_BG = [
  "bg-emerald-50",
  "bg-amber-50",
  "bg-rose-50",
  "bg-purple-50",
  "bg-orange-50",
  "bg-sky-50",
  "bg-pink-50",
  "bg-lime-50",
] as const;

/**
 * Soft cards variant — horizontal row of pastel rounded cards with image
 * + name. Section header has title on the left and circular Prev/Next
 * arrows on the right. Arrows disable when there's nothing to scroll in
 * that direction. Scrollbar is hidden; touch-swipe still works.
 *
 * Unlike the `carousel` variant this is NOT auto-scrolling — users drive
 * the motion. Designed for category landing rows like Amazon/Flipkart's
 * "Top Categories" / "Shop by collection" sections.
 */
export function CategoryShowcaseSoftCardsView(props: CategoryShowcaseProps) {
  const { tiles, loading } = useResolvedCategories(props);
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canLeft, setCanLeft] = useState(false);
  const [canRight, setCanRight] = useState(false);

  // Track scroll affordance — disables arrows when at an edge.
  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    function update() {
      if (!el) return;
      setCanLeft(el.scrollLeft > 0);
      setCanRight(el.scrollLeft + el.clientWidth < el.scrollWidth - 1);
    }
    update();
    el.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    return () => {
      el.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, [tiles.length]);

  function scrollByPage(direction: -1 | 1) {
    const el = scrollRef.current;
    if (!el) return;
    el.scrollBy({
      left: direction * el.clientWidth * 0.8,
      behavior: "smooth",
    });
  }

  const sectionClass = `px-4 py-10 sm:py-14 ${props.width === "full" ? "w-full" : "max-w-6xl mx-auto"}`;

  if (loading && tiles.length === 0) {
    return (
      <section className={sectionClass}>
        {props.title && (
          <h2 className="text-2xl sm:text-3xl font-bold mb-6">{props.title}</h2>
        )}
        <div className="flex gap-4 overflow-x-auto pb-3 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
          {Array.from({ length: props.maxItems }).map((_, i) => (
            <div
              key={i}
              className={`w-[110px] sm:w-[125px] h-[145px] sm:h-[160px] flex-shrink-0 rounded-2xl animate-pulse ${PASTEL_BG[i % PASTEL_BG.length]}`}
            />
          ))}
        </div>
      </section>
    );
  }

  if (tiles.length === 0) return null;

  return (
    <section className={sectionClass}>
      {/* Header row — title left, arrow nav right */}
      <div className="flex items-end justify-between gap-4 mb-6">
        <div className="min-w-0">
          {props.title && (
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">
              {props.title}
            </h2>
          )}
          {props.subtitle && (
            <p className="text-sm text-muted-foreground mt-1">
              {props.subtitle}
            </p>
          )}
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <button
            type="button"
            onClick={() => scrollByPage(-1)}
            disabled={!canLeft}
            aria-label="Previous categories"
            className="h-10 w-10 rounded-full bg-muted text-foreground flex items-center justify-center hover:bg-muted/70 disabled:opacity-40 disabled:cursor-not-allowed transition"
          >
            <ArrowLeft className="h-4 w-4" />
          </button>
          <button
            type="button"
            onClick={() => scrollByPage(1)}
            disabled={!canRight}
            aria-label="Next categories"
            className="h-10 w-10 rounded-full bg-muted text-foreground flex items-center justify-center hover:bg-muted/70 disabled:opacity-40 disabled:cursor-not-allowed transition"
          >
            <ArrowRight className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Cards row */}
      <div
        ref={scrollRef}
        className="flex gap-4 overflow-x-auto pb-3 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]"
      >
        {tiles.map((t, idx) => {
          const bg = PASTEL_BG[idx % PASTEL_BG.length];
          return (
            <Link
              key={t.id}
              href={`/category/${t.slug}`}
              className={`group flex-shrink-0 w-[110px] sm:w-[125px] rounded-2xl ${bg} p-2.5 sm:p-3 hover:shadow-md hover:-translate-y-0.5 transition-all duration-200`}
            >
              <div className="aspect-square mb-2 flex items-center justify-center">
                {t.imageUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={t.imageUrl}
                    alt={t.name}
                    className="max-h-full max-w-full object-contain group-hover:scale-105 transition-transform duration-200"
                  />
                ) : (
                  <div className="w-3/4 h-3/4 rounded-full bg-white/50" />
                )}
              </div>
              <div className="text-center text-xs sm:text-sm font-semibold line-clamp-2 text-foreground">
                {t.name}
              </div>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
