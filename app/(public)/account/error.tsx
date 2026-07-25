"use client";

import { RouteError } from "@/components/shell/route-error";

// Error boundary for the customer account area (/account/*). Renders inside the
// account shell provided by the account layout.
export default function AccountError(props: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <RouteError
      {...props}
      description="We hit an issue rendering this page. You can try again, or return to your account."
      homeHref="/account"
      homeLabel="Back to account"
    />
  );
}
