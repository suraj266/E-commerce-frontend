import * as Sentry from "@sentry/nextjs";

// Called once per server instance. Loads the correct Sentry config for the
// active runtime. Both configs no-op cleanly when the DSN is unset.
export async function register() {
  if (process.env.NEXT_RUNTIME === "nodejs") {
    await import("./sentry.server.config");
  }

  if (process.env.NEXT_RUNTIME === "edge") {
    await import("./sentry.edge.config");
  }
}

// Forwards Next.js server errors (RSC render, route handlers, actions) to
// Sentry. No-op when the SDK is not enabled.
export const onRequestError = Sentry.captureRequestError;
