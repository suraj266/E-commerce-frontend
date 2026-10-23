/**
 * Lazy Sentry access for client components.
 *
 * NEXT_PUBLIC_SENTRY_DSN is inlined at build time. Without it the SDK was
 * initialised disabled (every call a no-op) yet still shipped in every route's
 * JS. Guarding on the inlined value means a DSN-less build drops the SDK from
 * the bundles entirely; with a DSN the SDK loads on first use and reports
 * exactly as before.
 */
export function captureException(error: unknown): void {
  if (!process.env.NEXT_PUBLIC_SENTRY_DSN) return;
  void import("@sentry/nextjs").then((Sentry) => {
    Sentry.captureException(error);
  });
}
