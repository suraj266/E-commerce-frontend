"use client";

/**
 * Shared route-level error boundary UI.
 *
 * Factored out of the root `app/error.tsx` so every route group and deep
 * segment can drop in a thin `error.tsx` wrapper without duplicating the
 * Sentry wiring or the design-system markup. Next.js renders `error.tsx`
 * files as Client Components and hands them `{ error, reset }` — we forward
 * `error` to Sentry (a no-op when the DSN is unset) and wire `reset` to the
 * "Try again" button, which re-renders the crashed segment.
 *
 * Next 16.2 also passes an `unstable_retry` prop that re-fetches + re-renders
 * the segment; `reset` (clear-and-re-render) remains supported and is what the
 * existing boundary uses, so we keep it here for parity across all boundaries.
 *
 * Per-segment wrappers may override the copy (title / description) and the
 * "home" link target so, e.g., an admin error points back to the admin
 * dashboard instead of the storefront home.
 */

import * as Sentry from "@sentry/nextjs";
import { useEffect } from "react";

export type RouteErrorProps = {
  error: Error & { digest?: string };
  reset: () => void;
  /** Small uppercase eyebrow above the heading. */
  eyebrow?: string;
  /** Main heading. */
  title?: string;
  /** Supporting sentence under the heading. */
  description?: string;
  /** Where the secondary "Go home" link points. */
  homeHref?: string;
  /** Label for the secondary link. */
  homeLabel?: string;
};

export function RouteError({
  error,
  reset,
  eyebrow = "Something went wrong",
  title = "Unexpected error",
  description = "We hit an issue rendering this page. You can try again, or head back home.",
  homeHref = "/",
  homeLabel = "Go home",
}: RouteErrorProps) {
  useEffect(() => {
    // Forward to Sentry (no-op when the DSN is unset) and surface to the
    // browser console for local debugging.
    Sentry.captureException(error);
    // eslint-disable-next-line no-console
    console.error(error);
  }, [error]);

  return (
    <main className="flex min-h-[60vh] w-full flex-col items-center justify-center gap-6 px-6 py-16 text-center">
      <div className="space-y-3">
        <p className="text-sm font-medium uppercase tracking-widest text-muted-foreground">
          {eyebrow}
        </p>
        <h1 className="text-3xl font-semibold tracking-tight">{title}</h1>
        <p className="max-w-md text-sm text-muted-foreground">{description}</p>
        {error.digest && (
          <p className="text-xs text-muted-foreground/70">Ref: {error.digest}</p>
        )}
      </div>
      <div className="flex gap-3">
        <button
          onClick={reset}
          className="inline-flex h-10 items-center justify-center rounded-md bg-foreground px-5 text-sm font-medium text-background transition hover:opacity-90"
        >
          Try again
        </button>
        <a
          href={homeHref}
          className="inline-flex h-10 items-center justify-center rounded-md border px-5 text-sm font-medium transition hover:bg-muted"
        >
          {homeLabel}
        </a>
      </div>
    </main>
  );
}

export default RouteError;
