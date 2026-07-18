"use client";

import * as Sentry from "@sentry/nextjs";
import { useEffect } from "react";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Forward to Sentry (no-op when the DSN is unset) and surface to the
    // browser console for local debugging.
    Sentry.captureException(error);
    // eslint-disable-next-line no-console
    console.error(error);
  }, [error]);

  return (
    <main className="flex min-h-svh w-full flex-col items-center justify-center gap-6 px-6 text-center">
      <div className="space-y-3">
        <p className="text-sm font-medium uppercase tracking-widest text-muted-foreground">
          Something went wrong
        </p>
        <h1 className="text-3xl font-semibold tracking-tight">
          Unexpected error
        </h1>
        <p className="max-w-md text-sm text-muted-foreground">
          We hit an issue rendering this page. You can try again, or head back
          home.
        </p>
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
          href="/"
          className="inline-flex h-10 items-center justify-center rounded-md border px-5 text-sm font-medium transition hover:bg-muted"
        >
          Go home
        </a>
      </div>
    </main>
  );
}
