"use client";

import { RouteError } from "@/components/shell/route-error";

// Error boundary for the product-detail segment (/product/[slug]).
export default function ProductError(props: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <RouteError
      {...props}
      eyebrow="Product unavailable"
      title="We couldn't load this product"
      description="Something went wrong loading this product. You can try again, or continue browsing."
      homeHref="/shop"
      homeLabel="Continue shopping"
    />
  );
}
