"use client";

import { RouteError } from "@/components/shell/route-error";

// Root (app-level) error boundary. Delegates to the shared RouteError so the
// Sentry wiring and design-system markup live in one place; per-segment
// error.tsx files are thin wrappers over the same component.
export default function Error(props: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return <RouteError {...props} />;
}
