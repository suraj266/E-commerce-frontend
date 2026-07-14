import Link from "next/link";
import type { CtaProps } from "./cta.schema";

/** Image background with dark overlay; white text + primary button. */
export function CtaImageView(props: CtaProps) {
  return (
    <section className="px-4 py-10 sm:py-14">
      <div className="relative max-w-5xl mx-auto rounded-2xl overflow-hidden text-white">
        {props.imageUrl ? (
          <>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={props.imageUrl}
              alt=""
              className="absolute inset-0 h-full w-full object-cover"
            />
            <div className="absolute inset-0 bg-black/55" />
          </>
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-brand/70 to-accent-brand/50" />
        )}

        <div className="relative z-10 px-6 py-12 sm:py-16 text-center space-y-4">
          {props.headline && (
            <h2 className="font-heading text-2xl sm:text-4xl font-bold tracking-tight drop-shadow">
              {props.headline}
            </h2>
          )}
          {props.subtext && (
            <p className="max-w-2xl mx-auto text-white/90">{props.subtext}</p>
          )}
          {props.buttonLabel && props.buttonHref && (
            <Link
              href={props.buttonHref}
              className="inline-flex min-h-11 items-center justify-center rounded-lg bg-accent-brand text-accent-brand-foreground hover:bg-accent-brand/90 px-7 py-3.5 text-sm sm:text-base font-semibold shadow-lg transition-all hover:-translate-y-0.5 active:translate-y-0"
            >
              {props.buttonLabel}
            </Link>
          )}
        </div>
      </div>
    </section>
  );
}
