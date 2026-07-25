import { DashboardSkeleton } from "@/components/shell/route-skeleton";

// Loading fallback for the seller portal route group (renders inside the
// sidebar shell provided by the (seller) layout).
export default function SellerLoading() {
  return <DashboardSkeleton />;
}
