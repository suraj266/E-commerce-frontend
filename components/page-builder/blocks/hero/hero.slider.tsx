"use client";

/**
 * Hero — `slider` variant. Pulls slides from the Slider Library by key
 * and renders a responsive carousel with autoplay + arrow nav + dot
 * indicators.
 *
 * Image fallback chain per slide: mobileImageUrl → tabletImageUrl →
 * imageUrl. Implemented via <picture> + media queries so the browser
 * picks the right asset before paint.
 */

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { useQuery } from "@apollo/client/react";
import { ChevronLeft, ChevronRight } from "lucide-react";

import { GET_PUBLIC_SLIDER } from "@/lib/graphql/sliders";
import {
  GetPublicSliderData,
  parseSliderConfig,
  type SlideItem,
} from "@/types/slider.types";
import type { HeroProps } from "./hero.schema";

const HEIGHT_CLASS: Record<HeroProps["height"], string> = {
  sm: "min-h-[260px] sm:min-h-[320px]",
  md: "min-h-[360px] sm:min-h-[440px]",
  lg: "min-h-[480px] sm:min-h-[560px]",
};

function isExternal(url: string): boolean {
  return /^https?:\/\//i.test(url);
}

function SlidePicture({
  slide,
  alt,
  className,
}: {
  slide: SlideItem;
  alt: string;
  className?: string;
}) {
  const desktop = slide.imageUrl;
  const tablet = slide.tabletImageUrl ?? desktop;
  const mobile = slide.mobileImageUrl ?? tablet ?? desktop;
  if (!desktop && !tablet && !mobile) {
    return (
      <div
        className={`absolute inset-0 bg-gradient-to-br from-primary/30 to-primary/5 ${className ?? ""}`}
      />
    );
  }
  return (
    <picture className={className}>
      {mobile && <source media="(max-width: 767px)" srcSet={mobile} />}
      {tablet && <source media="(max-width: 1199px)" srcSet={tablet} />}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={desktop ?? tablet ?? mobile ?? ""}
        alt={alt}
        className="absolute inset-0 h-full w-full object-cover"
      />
    </picture>
  );
}

export function HeroSliderView(props: HeroProps) {
  const sliderKey = props.sliderKey?.trim();
  const { data, loading, error } = useQuery<GetPublicSliderData>(
    GET_PUBLIC_SLIDER,
    {
      variables: { key: sliderKey },
      fetchPolicy: "cache-and-network",
      skip: !sliderKey,
      errorPolicy: "ignore",
    },
  );

  const slides = (data?.publicSlider?.items ?? []).filter((s) => s.isEnabled);

  // Resolve autoplay: per-block override → slider's own config → no autoplay
  const sliderCfg = parseSliderConfig(data?.publicSlider?.config ?? null);
  const autoplayMs =
    typeof props.autoAdvanceMs === "number"
      ? props.autoAdvanceMs
      : sliderCfg.autoplayMs ?? 0;

  const [active, setActive] = useState(0);

  // Reset when slides change (e.g. switching slider key in admin preview)
  useEffect(() => {
    setActive(0);
  }, [sliderKey, slides.length]);

  const next = useCallback(() => {
    setActive((i) => (slides.length > 0 ? (i + 1) % slides.length : 0));
  }, [slides.length]);
  const prev = useCallback(() => {
    setActive((i) =>
      slides.length > 0 ? (i - 1 + slides.length) % slides.length : 0,
    );
  }, [slides.length]);

  // Autoplay
  useEffect(() => {
    if (!autoplayMs || slides.length < 2) return;
    const t = setInterval(next, autoplayMs);
    return () => clearInterval(t);
  }, [autoplayMs, slides.length, next]);

  // Empty / error states — always render a sized container so layout
  // doesn't jump when the data lands.
  if (!sliderKey) {
    return (
      <section
        className={`relative w-full overflow-hidden bg-muted ${HEIGHT_CLASS[props.height]} flex items-center justify-center`}
      >
        <p className="text-sm text-muted-foreground italic">
          No slider selected. Pick one in the block settings.
        </p>
      </section>
    );
  }

  if (loading && !data) {
    return (
      <section
        className={`relative w-full overflow-hidden bg-muted animate-pulse ${HEIGHT_CLASS[props.height]}`}
      />
    );
  }

  if (error || !data?.publicSlider || slides.length === 0) {
    return (
      <section
        className={`relative w-full overflow-hidden bg-muted ${HEIGHT_CLASS[props.height]} flex items-center justify-center`}
      >
        <p className="text-sm text-muted-foreground italic">
          Slider has no slides yet.
        </p>
      </section>
    );
  }

  const current = slides[active];
  const linkTarget = current.link?.trim() ?? "";
  const ext = linkTarget && isExternal(linkTarget);

  return (
    <section
      className={`relative w-full overflow-hidden ${HEIGHT_CLASS[props.height]}`}
      aria-roledescription="carousel"
    >
      {/* Slides — render all, fade between via opacity for smooth crossfade */}
      {slides.map((slide, idx) => (
        <div
          key={slide.id}
          className="absolute inset-0 transition-opacity duration-700"
          style={{ opacity: idx === active ? 1 : 0, pointerEvents: idx === active ? "auto" : "none" }}
          aria-hidden={idx !== active}
        >
          <SlidePicture slide={slide} alt={slide.title ?? ""} />
          <div className="absolute inset-0 bg-black/40" />
          <div className="relative z-10 flex flex-col items-center justify-center text-center h-full px-4 sm:px-12 max-w-6xl mx-auto gap-4">
            {slide.title && (
              <h1 className="text-3xl sm:text-5xl font-bold tracking-tight text-white drop-shadow">
                {slide.title}
              </h1>
            )}
            {slide.description && (
              <p className="text-base sm:text-lg max-w-2xl text-white/90">
                {slide.description}
              </p>
            )}
            {slide.ctaLabel && slide.link && (
              <div>
                {idx === active &&
                  (ext ? (
                    <a
                      href={slide.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center justify-center rounded-md bg-primary text-primary-foreground px-6 py-3 text-sm font-semibold shadow hover:bg-primary/90 transition"
                    >
                      {slide.ctaLabel}
                    </a>
                  ) : (
                    <Link
                      href={slide.link}
                      className="inline-flex items-center justify-center rounded-md bg-primary text-primary-foreground px-6 py-3 text-sm font-semibold shadow hover:bg-primary/90 transition"
                    >
                      {slide.ctaLabel}
                    </Link>
                  ))}
              </div>
            )}
          </div>
        </div>
      ))}

      {/* Arrows */}
      {slides.length > 1 && (
        <>
          <button
            type="button"
            onClick={prev}
            className="absolute left-3 top-1/2 -translate-y-1/2 z-20 h-10 w-10 rounded-full bg-white/80 hover:bg-white text-foreground flex items-center justify-center shadow"
            aria-label="Previous slide"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          <button
            type="button"
            onClick={next}
            className="absolute right-3 top-1/2 -translate-y-1/2 z-20 h-10 w-10 rounded-full bg-white/80 hover:bg-white text-foreground flex items-center justify-center shadow"
            aria-label="Next slide"
          >
            <ChevronRight className="h-5 w-5" />
          </button>
        </>
      )}

      {/* Dot indicators */}
      {slides.length > 1 && (
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 flex items-center gap-1.5">
          {slides.map((s, idx) => (
            <button
              key={s.id}
              type="button"
              onClick={() => setActive(idx)}
              className={`h-2 rounded-full transition-all ${
                idx === active ? "w-6 bg-white" : "w-2 bg-white/50 hover:bg-white/80"
              }`}
              aria-label={`Go to slide ${idx + 1}`}
            />
          ))}
        </div>
      )}
    </section>
  );
}
