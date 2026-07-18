// Sentry initialization for the Node.js server runtime.
// Imported from `register()` in instrumentation.ts.
// No-op when NEXT_PUBLIC_SENTRY_DSN is unset (enabled: false).
import * as Sentry from "@sentry/nextjs";

const dsn = process.env.NEXT_PUBLIC_SENTRY_DSN;

Sentry.init({
  dsn,
  // When the DSN is unset the SDK is fully inert — no network, no overhead.
  enabled: !!dsn,
  environment: process.env.NEXT_PUBLIC_SENTRY_ENVIRONMENT ?? process.env.NODE_ENV,
  tracesSampleRate: Number(process.env.NEXT_PUBLIC_SENTRY_TRACES_SAMPLE_RATE ?? 0),
  // Keep logs quiet unless explicitly debugging.
  debug: false,
});
