"use client";

import Link from "next/link";
import { useFullscreenHeroMarker } from "@/store/fullscreen-hero.store";
import type { HeroProps } from "./hero.schema";

const HEIGHT_CLASS: Record<HeroProps["height"], string> = {
  sm: "min-h-[260px] sm:min-h-[320px]",
  md: "min-h-[360px] sm:min-h-[440px]",
  lg: "min-h-screen",
};

const ALIGN_CLASS: Record<HeroProps["alignment"], string> = {
  left: "items-start text-left",
  center: "items-center text-center",
  right: "items-end text-right",
};

/**
 * Centered hero variant — full-bleed background image with a centered
 * (or aligned) text stack on top, dark overlay for legibility.
 * Default layout for the hero block.
 */
export function HeroCenteredView(props: HeroProps) {
  useFullscreenHeroMarker(props.height === "lg");

  const overlay = Math.max(0, Math.min(100, props.overlayOpacity)) / 100;

  return (
    <section
      className={`relative w-full overflow-hidden ${HEIGHT_CLASS[props.height]}`}
    >
      {props.imageUrl ? (
        <>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={props.imageUrl}
            alt={props.headline ?? ""}
            className="absolute inset-0 h-full w-full object-cover"
          />
          <div
            className="absolute inset-0 bg-black"
            style={{ opacity: overlay }}
          />
        </>
      ) : (
        <div className="absolute inset-0 bg-gradient-to-br from-brand/20 via-accent-brand/10 to-accent-brand/5" />
      )}

      <div
        className={`relative z-10 flex flex-col justify-center gap-4 h-full px-4 sm:px-12 max-w-6xl mx-auto ${ALIGN_CLASS[props.alignment]}`}
      >
        {props.headline && (
          <h1
            className={`font-heading text-4xl sm:text-6xl font-bold tracking-tight leading-[1.05] ${
              props.imageUrl ? "text-white drop-shadow" : "text-foreground"
            }`}
          >
            {props.headline}
          </h1>
        )}
        {props.subtext && (
          <p
            className={`text-base sm:text-lg max-w-2xl ${
              props.imageUrl ? "text-white/90" : "text-muted-foreground"
            }`}
          >
            {props.subtext}
          </p>
        )}
        {props.ctaLabel && props.ctaHref && (
          <div>
            <Link
              href={props.ctaHref}
              className="inline-flex min-h-11 items-center justify-center rounded-lg bg-accent-brand text-accent-brand-foreground px-7 py-3.5 text-sm sm:text-base font-semibold shadow-lg transition-all hover:bg-accent-brand/90 hover:-translate-y-0.5 active:translate-y-0 dark:shadow-none dark:glow-accent"
            >
              {props.ctaLabel}
            </Link>
          </div>
        )}
      </div>
    </section>
  );
}
