import { Badge } from "@/components/ui/badge";
import { ORDER_STATUS_LABEL, type OrderStatus } from "@/types/order.types";

const VARIANT: Record<
  OrderStatus,
  "default" | "secondary" | "destructive" | "outline"
> = {
  PENDING: "outline",
  CONFIRMED: "secondary",
  PACKED: "secondary",
  SHIPPED: "default",
  DELIVERED: "default",
  CANCELLED: "destructive",
  REFUNDED: "destructive",
};

const COLOR: Record<OrderStatus, string> = {
  PENDING: "bg-amber-100 text-amber-800 border-amber-300",
  CONFIRMED: "bg-blue-100 text-blue-800 border-blue-300",
  PACKED: "bg-indigo-100 text-indigo-800 border-indigo-300",
  SHIPPED: "bg-violet-100 text-violet-800 border-violet-300",
  DELIVERED: "bg-emerald-100 text-cta/90 border-emerald-300",
  CANCELLED: "bg-rose-100 text-rose-800 border-rose-300",
  REFUNDED: "bg-rose-100 text-rose-800 border-rose-300",
};

export function OrderStatusBadge({
  status,
  className,
}: {
  status: OrderStatus;
  className?: string;
}) {
  return (
    <Badge
      variant={VARIANT[status]}
      className={`border ${COLOR[status]} ${className ?? ""}`}
    >
      {ORDER_STATUS_LABEL[status]}
    </Badge>
  );
}
