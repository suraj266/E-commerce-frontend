"use client";

import { RouteError } from "@/components/shell/route-error";

// Error boundary for the public storefront route group. Renders inside the
// (public) layout (site header + footer stay mounted).
export default function PublicError(props: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return <RouteError {...props} />;
}
