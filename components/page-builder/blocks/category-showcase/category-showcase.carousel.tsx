"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import type { CategoryShowcaseProps } from "./category-showcase.schema";
import { useResolvedCategories } from "./category-showcase-shared";

/** Marquee speed in pixels per second. ~40 = gentle, ~80 = lively. */
const SCROLL_SPEED_PX_PER_SEC = 40;

/** Edge-fade width — matches Amazon/Flipkart's gentle vignette feel. */
const FADE_PX = 48;

const FADE_MASK = `linear-gradient(to right, transparent 0, black ${FADE_PX}px, black calc(100% - ${FADE_PX}px), transparent 100%)`;

/**
 * Carousel variant — single horizontal row of categories that auto-scrolls
 * in an infinite loop (always one direction, never reverses) by rendering
 * a hidden duplicate of the tile list and silently resetting scrollLeft
 * each time it crosses the boundary between the two sets.
 *
 * Hovering pauses; mouse-out resumes. User can drag/scroll manually with
 * touch or wheel and the loop continues from there. Honors
 * `prefers-reduced-motion`. Scrollbar hidden; edges gently faded so
 * partial tiles dissolve instead of being hard-cut (Amazon/Flipkart UX).
 */
export function CategoryShowcaseCarouselView(props: CategoryShowcaseProps) {
  const { tiles, loading } = useResolvedCategories(props);
  const scrollRef = useRef<HTMLDivElement>(null);
  const firstTileRef = useRef<HTMLAnchorElement>(null);
  const firstDupTileRef = useRef<HTMLAnchorElement>(null);
  const wrapDistanceRef = useRef(0);

  /** True once the original tile set overflows the viewport — only then do
   *  we render the duplicate set and start auto-scrolling. */
  const [shouldLoop, setShouldLoop] = useState(false);

  // Detect overflow on mount + window resize. Re-evaluates when the
  // resolved tile list changes (data load, settings change).
  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    function check() {
      if (!el) return;
      setShouldLoop(el.scrollWidth > el.clientWidth + 1);
    }
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, [tiles.length]);

  // Measure wrap distance once duplicates are in the DOM. The distance
  // between corresponding tiles in the two sets is the exact offset we
  // subtract from scrollLeft to make the wrap invisible.
  useEffect(() => {
    if (!shouldLoop) {
      wrapDistanceRef.current = 0;
      return;
    }
    const first = firstTileRef.current;
    const dup = firstDupTileRef.current;
    if (!first || !dup) return;
    wrapDistanceRef.current = dup.offsetLeft - first.offsetLeft;
  }, [shouldLoop, tiles.length]);

  // Auto-scroll RAF — always +1 direction; wraps silently at boundary.
  useEffect(() => {
    if (!shouldLoop) return;
    const el = scrollRef.current;
    if (!el) return;
    if (typeof window === "undefined") return;

    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    if (reduceMotion) return;

    let paused = false;
    let lastTime = performance.now();
    let rafId = 0;

    function tick(now: number) {
      if (!el) return;
      const dt = (now - lastTime) / 1000;
      lastTime = now;

      if (!paused) {
        el.scrollLeft += SCROLL_SPEED_PX_PER_SEC * dt;
        const W = wrapDistanceRef.current;
        // Silent wrap: subtract one period. Visible content is unchanged
        // because the duplicate at scrollLeft - W shows identical pixels.
        if (W > 0 && el.scrollLeft >= W) {
          el.scrollLeft -= W;
        }
      }
      rafId = requestAnimationFrame(tick);
    }

    function onEnter() {
      paused = true;
    }
    function onLeave() {
      paused = false;
      lastTime = performance.now();
    }
    el.addEventListener("mouseenter", onEnter);
    el.addEventListener("mouseleave", onLeave);

    rafId = requestAnimationFrame(tick);
    return () => {
      cancelAnimationFrame(rafId);
      el.removeEventListener("mouseenter", onEnter);
      el.removeEventListener("mouseleave", onLeave);
    };
  }, [shouldLoop]);

  if (loading && tiles.length === 0) {
    return (
      <section className={`py-10 sm:py-14 ${props.width === "full" ? "w-full" : "max-w-6xl mx-auto"}`}>
        {props.title && (
          <h2 className="px-4 text-2xl sm:text-3xl font-bold mb-4">
            {props.title}
          </h2>
        )}
        <div className="flex gap-3 sm:gap-4 px-4 overflow-x-auto pb-2 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
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

  const tileShapeClass =
    props.tileShape === "circle"
      ? "rounded-full"
      : props.tileShape === "rounded"
        ? "rounded-md"
        : "";

  return (
    <section className={`py-10 sm:py-14 ${props.width === "full" ? "w-full" : "max-w-6xl mx-auto"}`}>
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

      <div
        ref={scrollRef}
        className="overflow-x-auto pb-3 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]"
        style={
          props.width === "full"
            ? undefined
            : { maskImage: FADE_MASK, WebkitMaskImage: FADE_MASK }
        }
      >
        <div className="flex gap-3 sm:gap-4 px-4 w-max">
          {tiles.map((t, idx) => (
            <Link
              key={t.id}
              ref={idx === 0 ? firstTileRef : undefined}
              href={`/category/${t.slug}`}
              className="group/tile flex-shrink-0 w-[80px] sm:w-[100px]"
            >
              <div className={`relative aspect-square overflow-hidden bg-muted ${tileShapeClass}`}>
                {t.imageUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={t.imageUrl}
                    alt={t.name}
                    className="absolute inset-0 h-full w-full object-cover group-hover/tile:scale-105 transition-transform"
                  />
                ) : (
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-primary/5" />
                )}
              </div>
              <div className="mt-2 text-center text-[11px] sm:text-xs font-medium line-clamp-2">
                {t.name}
              </div>
            </Link>
          ))}
          {shouldLoop &&
            tiles.map((t, idx) => (
              <Link
                key={`dup-${t.id}`}
                ref={idx === 0 ? firstDupTileRef : undefined}
                href={`/category/${t.slug}`}
                aria-hidden="true"
                tabIndex={-1}
                className="group/tile flex-shrink-0 w-[80px] sm:w-[100px]"
              >
                <div className={`relative aspect-square overflow-hidden bg-muted ${tileShapeClass}`}>
                  {t.imageUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={t.imageUrl}
                      alt=""
                      className="absolute inset-0 h-full w-full object-cover group-hover/tile:scale-105 transition-transform"
                    />
                  ) : (
                    <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-primary/5" />
                  )}
                </div>
                <div className="mt-2 text-center text-[11px] sm:text-xs font-medium line-clamp-2">
                  {t.name}
                </div>
              </Link>
            ))}
        </div>
      </div>
    </section>
  );
}
