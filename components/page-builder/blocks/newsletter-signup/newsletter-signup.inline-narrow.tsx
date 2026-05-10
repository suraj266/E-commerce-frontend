"use client";

import type { NewsletterSignupProps } from "./newsletter-signup.schema";
import { NewsletterSubscribeForm } from "./newsletter-signup-form";

/**
 * Inline narrow — light bordered card, two-column layout (text + form
 * side-by-side). Best for slotting inside a page rather than as a hero band.
 */
export function NewsletterSignupInlineNarrowView(
  props: NewsletterSignupProps,
) {
  return (
    <section className="px-4 py-10 max-w-4xl mx-auto">
      <div className="rounded-lg border bg-card p-6 sm:p-8 grid gap-6 sm:grid-cols-2 sm:items-center">
        <div>
          {props.title && (
            <h2 className="text-xl sm:text-2xl font-bold tracking-tight">
              {props.title}
            </h2>
          )}
          {props.subtext && (
            <p className="text-sm text-muted-foreground mt-1">
              {props.subtext}
            </p>
          )}
        </div>
        <NewsletterSubscribeForm
          layout="inline"
          variant="light"
          buttonLabel={props.buttonLabel}
          placeholder={props.placeholder}
          source={props.source}
        />
      </div>
    </section>
  );
}
