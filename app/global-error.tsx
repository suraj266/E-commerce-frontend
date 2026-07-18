"use client";

import * as Sentry from "@sentry/nextjs";
import { useEffect } from "react";

// global-error replaces the root layout when an error is thrown while
// rendering it, so it must render its own <html> and <body>.
export default function GlobalError({
  error,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    Sentry.captureException(error);
    // eslint-disable-next-line no-console
    console.error(error);
  }, [error]);

  return (
    <html lang="en">
      <body>
        <main className="flex min-h-svh w-full flex-col items-center justify-center gap-6 px-6 text-center">
          <div className="space-y-3">
            <p className="text-sm font-medium uppercase tracking-widest text-muted-foreground">
              Something went wrong
            </p>
            <h1 className="text-3xl font-semibold tracking-tight">
              Unexpected error
            </h1>
            <p className="max-w-md text-sm text-muted-foreground">
              We hit an issue loading the app. Please try again.
            </p>
            {error.digest && (
              <p className="text-xs text-muted-foreground/70">
                Ref: {error.digest}
              </p>
            )}
          </div>
          <a
            href="/"
            className="inline-flex h-10 items-center justify-center rounded-md border px-5 text-sm font-medium transition hover:bg-muted"
          >
            Go home
          </a>
        </main>
      </body>
    </html>
  );
}
