// Client-side Sentry initialization. Runs in the browser after the HTML
// document loads and before React hydration.
// No-op when NEXT_PUBLIC_SENTRY_DSN is unset (enabled: false).
import * as Sentry from "@sentry/nextjs";

const dsn = process.env.NEXT_PUBLIC_SENTRY_DSN;

Sentry.init({
  dsn,
  // When the DSN is unset the SDK is fully inert — no network, no overhead.
  enabled: !!dsn,
  environment: process.env.NEXT_PUBLIC_SENTRY_ENVIRONMENT ?? process.env.NODE_ENV,
  tracesSampleRate: Number(process.env.NEXT_PUBLIC_SENTRY_TRACES_SAMPLE_RATE ?? 0),
  debug: false,
});

// Instrument client-side router navigations for tracing.
export const onRouterTransitionStart = Sentry.captureRouterTransitionStart;
