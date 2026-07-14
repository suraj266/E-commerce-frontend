"use client";

import Link from "next/link";
import { useFullscreenHeroMarker } from "@/store/fullscreen-hero.store";
import type { HeroProps } from "./hero.schema";

const HEIGHT_CLASS: Record<HeroProps["height"], string> = {
  sm: "min-h-[260px] sm:min-h-[320px]",
  md: "min-h-[360px] sm:min-h-[440px]",
  lg: "min-h-screen",
};

/**
 * Split hero variant — image on the left, text stack on the right (stacks
 * vertically on mobile). No overlay needed since image and text live in
 * separate columns.
 *
 * Reuses the same HeroProps as the centered variant — switching between
 * variants is lossless. The `alignment` prop is reinterpreted here as
 * which column the image sits in: `left` (default) or `right` swaps the
 * order; `center` stacks them on all viewports.
 */
export function HeroSplitView(props: HeroProps) {
  useFullscreenHeroMarker(props.height === "lg");

  const stackOnly = props.alignment === "center";
  const imageOnRight = props.alignment === "right";

  return (
    <section className="px-4 py-10 sm:py-14">
      <div
        className={`max-w-6xl mx-auto grid ${
          stackOnly
            ? "grid-cols-1"
            : "grid-cols-1 lg:grid-cols-2 items-center"
        } gap-8 ${HEIGHT_CLASS[props.height]}`}
      >
        <div
          className={`relative rounded-2xl overflow-hidden bg-muted ${
            stackOnly ? "aspect-[16/9]" : "h-full min-h-[300px]"
          } ${imageOnRight ? "lg:order-2" : ""}`}
        >
          {props.imageUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={props.imageUrl}
              alt={props.headline ?? ""}
              className="absolute inset-0 h-full w-full object-cover"
            />
          ) : (
            <div className="absolute inset-0 bg-gradient-to-br from-brand/25 via-accent-brand/10 to-accent-brand/5" />
          )}
        </div>

        <div className="flex flex-col justify-center gap-4">
          {props.headline && (
            <h1 className="font-heading text-4xl sm:text-6xl font-bold tracking-tight leading-[1.05]">
              {props.headline}
            </h1>
          )}
          {props.subtext && (
            <p className="text-base sm:text-lg text-muted-foreground max-w-xl">
              {props.subtext}
            </p>
          )}
          {props.ctaLabel && props.ctaHref && (
            <div>
              <Link
                href={props.ctaHref}
                className="inline-flex min-h-11 items-center justify-center rounded-lg bg-accent-brand text-accent-brand-foreground px-7 py-3.5 text-sm sm:text-base font-semibold shadow-lg transition-all hover:bg-accent-brand/90 hover:-translate-y-0.5 active:translate-y-0"
              >
                {props.ctaLabel}
              </Link>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
