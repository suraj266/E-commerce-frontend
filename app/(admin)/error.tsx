"use client";

import { RouteError } from "@/components/shell/route-error";

// Error boundary for the admin panel route group. Renders inside the (admin)
// layout, so the sidebar + header shell stay mounted around it.
export default function AdminError(props: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <RouteError
      {...props}
      description="We hit an issue rendering this admin page. You can try again, or return to the dashboard."
      homeHref="/admin/dashboard"
      homeLabel="Back to dashboard"
    />
  );
}
