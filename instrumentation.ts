import type { captureRequestError } from "@sentry/nextjs";

// Called once per server instance. Loads the correct Sentry config for the
// active runtime — only when a DSN is configured. Without one the SDK would be
// initialised disabled anyway, so it (and the OpenTelemetry setup its init
// performs even when disabled) is not loaded at all.
export async function register() {
  if (!process.env.NEXT_PUBLIC_SENTRY_DSN) return;

  if (process.env.NEXT_RUNTIME === "nodejs") {
    await import("./sentry.server.config");
  }

  if (process.env.NEXT_RUNTIME === "edge") {
    await import("./sentry.edge.config");
  }
}

// Forwards Next.js server errors (RSC render, route handlers, actions) to
// Sentry. No-op when no DSN is configured.
export async function onRequestError(
  ...args: Parameters<typeof captureRequestError>
) {
  if (!process.env.NEXT_PUBLIC_SENTRY_DSN) return;
  const Sentry = await import("@sentry/nextjs");
  Sentry.captureRequestError(...args);
}
