import { RouteSkeleton } from "@/components/shell/route-skeleton";

// Loading fallback for the customer account area (renders inside the account
// shell provided by the account layout).
export default function AccountLoading() {
  return <RouteSkeleton />;
}
