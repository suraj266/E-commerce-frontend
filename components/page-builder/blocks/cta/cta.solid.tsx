import Link from "next/link";
import type { CtaProps } from "./cta.schema";

/** Solid primary-color background, white button. */
export function CtaSolidView(props: CtaProps) {
  return (
    <section className="px-4 py-10 sm:py-14">
      <div className="max-w-5xl mx-auto rounded-2xl overflow-hidden bg-primary text-primary-foreground">
        <div className="px-6 py-10 sm:py-14 text-center space-y-4">
          {props.headline && (
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">
              {props.headline}
            </h2>
          )}
          {props.subtext && (
            <p className="max-w-2xl mx-auto opacity-90">{props.subtext}</p>
          )}
          {props.buttonLabel && props.buttonHref && (
            <Link
              href={props.buttonHref}
              className="inline-flex items-center justify-center rounded-md bg-background text-foreground hover:bg-background/90 px-6 py-3 text-sm font-semibold transition"
            >
              {props.buttonLabel}
            </Link>
          )}
        </div>
      </div>
    </section>
  );
}
