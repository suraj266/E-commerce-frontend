import { CheckoutSkeleton } from "@/components/shell/route-skeleton";

// Loading fallback for the checkout flow — mirrors the form column + order
// summary rail layout of the real page.
export default function CheckoutLoading() {
  return <CheckoutSkeleton />;
}
