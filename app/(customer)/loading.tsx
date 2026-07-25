import { RouteSkeleton } from "@/components/shell/route-skeleton";

// Loading fallback for the (customer) route group (placeholder group — see
// error.tsx). Kept in place so future segments inherit a consistent fallback.
export default function CustomerLoading() {
  return <RouteSkeleton />;
}
