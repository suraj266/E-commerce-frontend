"use client";

import { RouteError } from "@/components/shell/route-error";

// Error boundary for the checkout flow (and its success / failed sub-routes).
// A dedicated boundary here means a checkout crash does not tear down the whole
// storefront — the shopper can retry or step back to their cart.
export default function CheckoutError(props: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <RouteError
      {...props}
      eyebrow="Checkout problem"
      title="We couldn't load checkout"
      description="Something went wrong while loading your checkout. Your cart is safe — you can try again or go back to it."
      homeHref="/cart"
      homeLabel="Back to cart"
    />
  );
}
