// Sentry initialization for the Edge runtime (middleware, edge routes).
// Imported from `register()` in instrumentation.ts when NEXT_RUNTIME === "edge".
// No-op when NEXT_PUBLIC_SENTRY_DSN is unset (enabled: false).
import * as Sentry from "@sentry/nextjs";

const dsn = process.env.NEXT_PUBLIC_SENTRY_DSN;

Sentry.init({
  dsn,
  enabled: !!dsn,
  environment: process.env.NEXT_PUBLIC_SENTRY_ENVIRONMENT ?? process.env.NODE_ENV,
  tracesSampleRate: Number(process.env.NEXT_PUBLIC_SENTRY_TRACES_SAMPLE_RATE ?? 0),
  debug: false,
});
