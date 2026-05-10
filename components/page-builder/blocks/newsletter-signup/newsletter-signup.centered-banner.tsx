"use client";

import type { NewsletterSignupProps } from "./newsletter-signup.schema";
import { NewsletterSubscribeForm } from "./newsletter-signup-form";

/**
 * Centered banner — full-width section with optional background image and a
 * dark overlay. Title, subtext, and stacked email field rendered centered.
 */
export function NewsletterSignupCenteredBannerView(
  props: NewsletterSignupProps,
) {
  const hasImage = Boolean(props.backgroundImageUrl);

  return (
    <section className="relative overflow-hidden">
      {hasImage ? (
        <>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={props.backgroundImageUrl}
            alt=""
            className="absolute inset-0 h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-black/60" />
        </>
      ) : (
        <div className="absolute inset-0 bg-gradient-to-br from-primary to-primary/70" />
      )}

      <div className="relative z-10 px-4 py-14 sm:py-20 text-center text-white">
        {props.title && (
          <h2 className="text-2xl sm:text-4xl font-bold tracking-tight">
            {props.title}
          </h2>
        )}
        {props.subtext && (
          <p className="mt-2 text-base sm:text-lg text-white/85 max-w-xl mx-auto">
            {props.subtext}
          </p>
        )}
        <div className="mt-6">
          <NewsletterSubscribeForm
            layout="centered"
            variant="dark"
            buttonLabel={props.buttonLabel}
            placeholder={props.placeholder}
            source={props.source}
          />
        </div>
      </div>
    </section>
  );
}
