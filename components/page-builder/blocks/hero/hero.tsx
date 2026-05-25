import Link from "next/link";
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
        <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-primary/5" />
      )}

      <div
        className={`relative z-10 flex flex-col justify-center gap-4 h-full px-4 sm:px-12 max-w-6xl mx-auto ${ALIGN_CLASS[props.alignment]}`}
      >
        {props.headline && (
          <h1
            className={`text-3xl sm:text-5xl font-bold tracking-tight ${
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
              className="inline-flex items-center justify-center rounded-md bg-primary text-primary-foreground px-6 py-3 text-sm font-semibold shadow hover:bg-primary/90 transition"
            >
              {props.ctaLabel}
            </Link>
          </div>
        )}
      </div>
    </section>
  );
}
