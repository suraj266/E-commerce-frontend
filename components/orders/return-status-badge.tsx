import { Badge } from "@/components/ui/badge";
import type { ReturnStatus } from "@/lib/graphql/returns";

const LABEL: Record<ReturnStatus, string> = {
  REQUESTED: "Requested",
  APPROVED: "Approved",
  PICKUP_SCHEDULED: "Pickup scheduled",
  IN_TRANSIT: "In transit",
  RECEIVED: "Received",
  QC_PASSED: "QC passed",
  QC_FAILED: "QC failed",
  REFUNDED: "Refunded",
  REPLACEMENT_APPROVED: "Replacement approved",
  REPLACEMENT_SHIPPED: "Replacement shipped",
  CLOSED: "Closed",
  REJECTED: "Rejected",
};

const VARIANT: Record<
  ReturnStatus,
  "default" | "secondary" | "destructive" | "outline"
> = {
  REQUESTED: "secondary",
  APPROVED: "secondary",
  PICKUP_SCHEDULED: "outline",
  IN_TRANSIT: "outline",
  RECEIVED: "secondary",
  QC_PASSED: "default",
  QC_FAILED: "destructive",
  REFUNDED: "default",
  REPLACEMENT_APPROVED: "secondary",
  REPLACEMENT_SHIPPED: "default",
  CLOSED: "default",
  REJECTED: "destructive",
};

const COLOR: Record<ReturnStatus, string> = {
  REQUESTED: "bg-amber-100 text-amber-800 border-amber-300",
  APPROVED: "bg-blue-100 text-blue-800 border-blue-300",
  PICKUP_SCHEDULED: "bg-indigo-100 text-indigo-800 border-indigo-300",
  IN_TRANSIT: "bg-violet-100 text-violet-800 border-violet-300",
  RECEIVED: "bg-cyan-100 text-cyan-800 border-cyan-300",
  QC_PASSED: "bg-emerald-100 text-emerald-800 border-emerald-300",
  QC_FAILED: "bg-rose-100 text-rose-800 border-rose-300",
  REFUNDED: "bg-emerald-100 text-emerald-800 border-emerald-300",
  REPLACEMENT_APPROVED: "bg-teal-100 text-teal-800 border-teal-300",
  REPLACEMENT_SHIPPED: "bg-emerald-100 text-emerald-800 border-emerald-300",
  CLOSED: "bg-slate-100 text-slate-700 border-slate-300",
  REJECTED: "bg-rose-100 text-rose-800 border-rose-300",
};

export function ReturnStatusBadge({
  status,
  className,
}: {
  status: ReturnStatus;
  className?: string;
}) {
  return (
    <Badge
      variant={VARIANT[status]}
      className={`border ${COLOR[status]} ${className ?? ""}`}
    >
      {LABEL[status]}
    </Badge>
  );
}
