import { Check, Circle, X } from "lucide-react";
import {
  ORDER_STAGES,
  ORDER_STATUS_LABEL,
  type OrderStatus,
} from "@/types/order.types";

/**
 * Renders the linear progress through the canonical order stages
 * (PENDING → CONFIRMED → PACKED → SHIPPED → DELIVERED). Cancelled and
 * refunded orders short-circuit to a terminal red state since they
 * don't fit on the linear track.
 */
export function OrderStatusTimeline({ status }: { status: OrderStatus }) {
  const isCancelled = status === "CANCELLED" || status === "REFUNDED";

  if (isCancelled) {
    return (
      <div className="rounded-md border border-rose-200 bg-rose-50 px-4 py-3 flex items-center gap-3 text-sm">
        <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-sale text-white">
          <X className="h-4 w-4" />
        </span>
        <span className="font-semibold text-rose-800">
          {ORDER_STATUS_LABEL[status]}
        </span>
      </div>
    );
  }

  const currentIdx = ORDER_STAGES.indexOf(status);
  return (
    <ol className="grid grid-cols-5 gap-2">
      {ORDER_STAGES.map((stage, i) => {
        const done = i < currentIdx;
        const active = i === currentIdx;
        return (
          <li key={stage} className="flex flex-col items-center text-center">
            <span
              className={`inline-flex h-8 w-8 items-center justify-center rounded-full transition ${
                done
                  ? "bg-emerald-500 text-white"
                  : active
                    ? "bg-brand text-white"
                    : "bg-muted text-foreground/40"
              }`}
            >
              {done ? (
                <Check className="h-4 w-4" />
              ) : active ? (
                <Circle className="h-4 w-4 fill-current" />
              ) : (
                <Circle className="h-4 w-4" />
              )}
            </span>
            <span
              className={`mt-1.5 text-[11px] font-semibold uppercase tracking-wide ${
                active
                  ? "text-brand"
                  : done
                    ? "text-foreground/80"
                    : "text-foreground/40"
              }`}
            >
              {ORDER_STATUS_LABEL[stage]}
            </span>
          </li>
        );
      })}
    </ol>
  );
}
