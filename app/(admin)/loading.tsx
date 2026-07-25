import { DashboardSkeleton } from "@/components/shell/route-skeleton";

// Loading fallback for the admin panel route group (renders inside the
// sidebar shell provided by the (admin) layout).
export default function AdminLoading() {
  return <DashboardSkeleton />;
}
