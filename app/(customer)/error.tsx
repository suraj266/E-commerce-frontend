"use client";

import { RouteError } from "@/components/shell/route-error";

// Error boundary for the (customer) route group. The group is currently a
// placeholder (customer-facing pages live under (public)/account today), but
// the boundary is in place so any future segment added here is covered.
export default function CustomerError(props: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return <RouteError {...props} />;
}
