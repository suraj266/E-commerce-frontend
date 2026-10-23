// Client-side Sentry initialization. Runs in the browser after the HTML
// document loads and before React hydration.
//
// NEXT_PUBLIC_SENTRY_DSN is inlined at build time. Without it the SDK used to
// be initialised disabled — inert, but still ~50 KB gzipped in every route's
// JS. Now a DSN-less build ships no Sentry code at all; with a DSN the SDK is
// loaded and initialised as soon as this script runs.
import type * as SentrySdk from "@sentry/nextjs";

const dsn = process.env.NEXT_PUBLIC_SENTRY_DSN;

let sentry: typeof SentrySdk | undefined;

if (dsn) {
  void import("@sentry/nextjs").then((Sentry) => {
    Sentry.init({
      dsn,
      enabled: true,
      environment:
        process.env.NEXT_PUBLIC_SENTRY_ENVIRONMENT ?? process.env.NODE_ENV,
      tracesSampleRate: Number(
        process.env.NEXT_PUBLIC_SENTRY_TRACES_SAMPLE_RATE ?? 0,
      ),
      debug: false,
    });
    sentry = Sentry;
  });
}

// Instrument client-side router navigations for tracing.
export function onRouterTransitionStart(
  ...args: Parameters<typeof SentrySdk.captureRouterTransitionStart>
) {
  sentry?.captureRouterTransitionStart(...args);
}
