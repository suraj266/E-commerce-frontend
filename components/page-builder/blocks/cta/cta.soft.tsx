import Link from "next/link";
import type { CtaProps } from "./cta.schema";

/** Soft pastel background with subtle border, primary button. */
export function CtaSoftView(props: CtaProps) {
  return (
    <section className="px-4 py-10 sm:py-14">
      <div className="max-w-5xl mx-auto rounded-2xl overflow-hidden bg-brand/5 border border-brand/20">
        <div className="px-6 py-10 sm:py-14 text-center space-y-4">
          {props.headline && (
            <h2 className="font-heading text-2xl sm:text-4xl font-bold tracking-tight">
              {props.headline}
            </h2>
          )}
          {props.subtext && (
            <p className="max-w-2xl mx-auto text-muted-foreground">
              {props.subtext}
            </p>
          )}
          {props.buttonLabel && props.buttonHref && (
            <Link
              href={props.buttonHref}
              className="inline-flex min-h-11 items-center justify-center rounded-lg bg-brand text-brand-foreground hover:bg-brand/90 px-7 py-3.5 text-sm sm:text-base font-semibold shadow-md transition-all hover:-translate-y-0.5 active:translate-y-0"
            >
              {props.buttonLabel}
            </Link>
          )}
        </div>
      </div>
    </section>
  );
}
