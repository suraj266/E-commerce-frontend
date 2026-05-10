"use client";

/**
 * Spotlight hero variant — split layout with a single product hero on
 * the right inside a peach-colored circle, floating chip labels, and a
 * vertical thumbnail strip. Designed for product-led storefronts where
 * one item is the headliner.
 *
 * Empty-state behavior:
 *   - No image  → circle still renders with a soft gradient (so the
 *                 layout doesn't collapse during admin setup)
 *   - No accents/thumbnails → those areas are simply omitted
 *   - No secondary CTA → bottom-right link is hidden
 */

import Link from "next/link";
import { ArrowRight, ShoppingCart } from "lucide-react";
import type { HeroProps } from "./hero.schema";

const HEIGHT_CLASS: Record<HeroProps["height"], string> = {
  sm: "min-h-[420px]",
  md: "min-h-[520px]",
  lg: "min-h-[620px]",
};

export function HeroSpotlightView(props: HeroProps) {
  const accents = (props.accents ?? []).filter((a) => a.label.trim());
  const thumbnails = (props.thumbnails ?? []).filter((t) => t.imageUrl);
  const hasSecondaryCta =
    !!props.secondaryCtaLabel && !!props.secondaryCtaHref;

  return (
    <section
      className={`relative w-full overflow-hidden bg-background ${HEIGHT_CLASS[props.height]}`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10 py-10 sm:py-14 lg:py-20 grid grid-cols-1 lg:grid-cols-[1.1fr_1fr] gap-10 lg:gap-12 items-center">
        {/* ---------------- Left: Text + CTA ---------------- */}
        <div className="space-y-6 sm:space-y-8 order-2 lg:order-1">
          {props.headline && (
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-pink-600 leading-[1.05]">
              {props.headline}
            </h1>
          )}

          {props.eyebrow && (
            <p className="text-xs sm:text-sm font-semibold tracking-[0.3em] uppercase text-feature/90">
              {props.eyebrow}
            </p>
          )}

          {props.subtext && (
            <p className="text-base sm:text-lg text-foreground/70 max-w-md leading-relaxed">
              {props.subtext}
            </p>
          )}

          {props.ctaLabel && props.ctaHref && (
            <div className="pt-2">
              <Link
                href={props.ctaHref}
                className="inline-flex items-center gap-3 rounded-full bg-feature hover:bg-feature/90 text-white px-6 sm:px-8 py-3 sm:py-3.5 text-sm sm:text-base font-semibold shadow-lg shadow-feature/20 transition"
              >
                <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-white/20">
                  <ShoppingCart className="h-3.5 w-3.5" />
                </span>
                {props.ctaLabel}
              </Link>
            </div>
          )}
        </div>

        {/* ---------------- Right: Image circle + thumbnails ----------------
            Flex sibling layout (NOT absolute) so the thumbnails sit beside
            the circle with real breathing room — not overlapping it. The
            circle keeps its own size; thumbnails are flex-shrink-0 so they
            never squeeze the hero. */}
        <div className="order-1 lg:order-2 flex items-center justify-end gap-6 xl:gap-10">
          <div className="relative flex-1 max-w-md aspect-square">
            {/*
              The circle: image fills it edge-to-edge with object-cover so
              any aspect ratio (square, portrait, landscape) crops cleanly.
              The peach gradient is the fallback when no image is set —
              and also doubles as a soft tint behind transparent PNGs.
            */}
            <div className="absolute inset-0 rounded-full bg-gradient-to-br from-orange-200 via-orange-100 to-rose-100" />

            {props.imageUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={props.imageUrl}
                alt={props.headline ?? "Hero"}
                className="absolute inset-0 z-10 h-full w-full rounded-full object-cover"
              />
            ) : (
              <div className="absolute inset-0 z-10 rounded-full flex items-center justify-center text-foreground/40 text-sm">
                Add a hero image
              </div>
            )}

            {/* Floating accent pills — bigger to match the reference. */}
            {accents[0]?.label && (
              <span className="absolute z-20 top-8 sm:top-12 -right-2 sm:right-0 inline-flex items-center rounded-full bg-white px-6 sm:px-8 py-3 sm:py-4 text-base sm:text-lg font-semibold text-foreground shadow-xl backdrop-blur">
                {accents[0].label}
              </span>
            )}
            {accents[1]?.label && (
              <span className="absolute z-20 bottom-12 sm:bottom-20 -left-2 sm:left-0 lg:-left-8 inline-flex items-center rounded-full bg-white px-6 sm:px-8 py-3 sm:py-4 text-base sm:text-lg font-semibold text-foreground shadow-xl backdrop-blur">
                {accents[1].label}
              </span>
            )}
            {accents[2]?.label && (
              <span className="absolute z-20 top-1/2 -right-2 sm:right-0 -translate-y-1/2 inline-flex items-center rounded-full bg-white px-6 py-3 text-base font-semibold text-foreground shadow-xl backdrop-blur">
                {accents[2].label}
              </span>
            )}
          </div>

          {/* Thumbnail strip — proper flex sibling, no overlap with circle.
              Reference design uses softly-rounded squares (rounded-3xl). */}
          {thumbnails.length > 0 && (
            <ul className="hidden lg:flex flex-col gap-4 flex-shrink-0">
              {thumbnails.slice(0, 4).map((t, i) => (
                <li key={i}>
                  {t.href ? (
                    <Link
                      href={t.href}
                      className="block h-20 w-20 xl:h-24 xl:w-24 rounded-3xl overflow-hidden bg-white shadow-lg ring-1 ring-black/5 hover:ring-amber-500 transition"
                    >
                      <ThumbnailImage url={t.imageUrl} index={i} />
                    </Link>
                  ) : (
                    <div className="h-20 w-20 xl:h-24 xl:w-24 rounded-3xl overflow-hidden bg-white shadow-lg ring-1 ring-black/5">
                      <ThumbnailImage url={t.imageUrl} index={i} />
                    </div>
                  )}
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      {/* Secondary CTA — bottom-right */}
      {hasSecondaryCta && (
        <Link
          href={props.secondaryCtaHref}
          className="absolute bottom-6 sm:bottom-10 right-6 sm:right-10 inline-flex items-center gap-2 text-sm font-semibold text-foreground/80 hover:text-foreground transition group"
        >
          {props.secondaryCtaLabel}
          <span className="inline-flex h-7 w-7 items-center justify-center rounded-full border border-foreground/30 group-hover:border-foreground transition">
            <ArrowRight className="h-3.5 w-3.5" />
          </span>
        </Link>
      )}
    </section>
  );
}

function ThumbnailImage({ url, index }: { url: string; index: number }) {
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={url}
      alt={`Thumbnail ${index + 1}`}
      className="h-full w-full object-cover"
    />
  );
}
