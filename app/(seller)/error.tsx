"use client";

import { RouteError } from "@/components/shell/route-error";

// Error boundary for the seller portal route group. Renders inside the
// (seller) layout, so the sidebar + header shell stay mounted around it.
export default function SellerError(props: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <RouteError
      {...props}
      description="We hit an issue rendering this page. You can try again, or return to the dashboard."
      homeHref="/seller/dashboard"
      homeLabel="Back to dashboard"
    />
  );
}
