"use client";

/**
 * /seller/orders/[id] — seller's view of a single SellerOrder.
 *
 * Sections:
 *   - Header: order number, status, customer name, total
 *   - Action bar: next-status buttons (only the transitions that are
 *     valid from the current state are enabled — see order.helpers.ts)
 *   - Items list (snapshots of name/sku/variant/qty/price)
 *   - Shipping address (so the seller knows where to ship)
 *   - Status timeline + history log
 *   - Financial breakdown (subtotal/tax/commission/payout)
 */

import { useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useMutation, useQuery } from "@apollo/client/react";
import { toast } from "sonner";
import {
  ArrowLeft,
  Loader2,
  Package,
  Store as StoreIcon,
} from "lucide-react";

import {
  GET_MY_SELLER_ORDER,
  GET_MY_SELLER_ORDERS,
  UPDATE_SELLER_ORDER_STATUS,
} from "@/lib/graphql/orders";
import {
  MySellerOrderData,
  ORDER_STATUS_LABEL,
  UpdateSellerOrderStatusData,
  type OrderItem,
  type OrderStatus,
} from "@/types/order.types";
import { formatPrice } from "@/lib/utils/currency";
import { OrderStatusBadge } from "@/components/orders/order-status-badge";
import { OrderStatusTimeline } from "@/components/orders/order-status-timeline";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

/**
 * Allowed forward transitions per current status. Mirrors the backend
 * isValidTransition rules in order.helpers.ts. Keep in sync if you
 * extend the workflow.
 */
const NEXT_TRANSITIONS: Record<OrderStatus, OrderStatus[]> = {
  PENDING: ["CONFIRMED", "CANCELLED"],
  CONFIRMED: ["PACKED", "CANCELLED"],
  PACKED: ["SHIPPED", "CANCELLED"],
  SHIPPED: ["DELIVERED"],
  DELIVERED: [],
  CANCELLED: [],
  REFUNDED: [],
};

const ACTION_LABEL: Record<OrderStatus, string> = {
  PENDING: "Mark Pending",
  CONFIRMED: "Confirm order",
  PACKED: "Mark as packed",
  SHIPPED: "Mark as shipped",
  DELIVERED: "Mark as delivered",
  CANCELLED: "Cancel",
  REFUNDED: "Refund",
};

export default function SellerOrderDetailPage() {
  const params = useParams<{ id: string }>();
  const id = params.id;

  const [confirmAction, setConfirmAction] = useState<OrderStatus | null>(null);

  const { data, loading, error } = useQuery<MySellerOrderData>(
    GET_MY_SELLER_ORDER,
    {
      variables: { id },
      fetchPolicy: "cache-and-network",
      errorPolicy: "all",
    },
  );

  const [updateStatus, { loading: updating }] =
    useMutation<UpdateSellerOrderStatusData>(UPDATE_SELLER_ORDER_STATUS, {
      refetchQueries: [
        { query: GET_MY_SELLER_ORDER, variables: { id } },
        { query: GET_MY_SELLER_ORDERS, variables: { page: 1, pageSize: 20 } },
      ],
      onCompleted: (res) => {
        toast.success(
          `Marked ${ORDER_STATUS_LABEL[res.updateSellerOrderStatus.status]}`,
        );
        setConfirmAction(null);
      },
      onError: (err) => toast.error(err.message),
    });

  if (loading && !data) {
    return (
      <div className="rounded-lg border bg-card p-8">
        <Loader2 className="mx-auto h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    );
  }
  if (error || !data?.mySellerOrder) {
    return (
      <div className="rounded-lg border bg-card p-8 text-center space-y-3">
        <Package className="mx-auto h-10 w-10 text-foreground/30" />
        <p className="text-base font-semibold">Order not found</p>
        <Link
          href="/seller/orders"
          className="inline-flex items-center text-sm text-primary hover:underline"
        >
          <ArrowLeft className="mr-1.5 h-4 w-4" />
          Back to orders
        </Link>
      </div>
    );
  }

  const so = data.mySellerOrder;
  const allowed = NEXT_TRANSITIONS[so.status] ?? [];
  const requiresConfirm = (s: OrderStatus) => s === "CANCELLED";

  return (
    <div className="space-y-6">
      <Link
        href="/seller/orders"
        className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground transition"
      >
        <ArrowLeft className="mr-1.5 h-4 w-4" />
        Back to orders
      </Link>

      <div className="rounded-lg border bg-card p-5 sm:p-6">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-xs font-mono text-muted-foreground">
                {so.orderNumber}
              </span>
              <OrderStatusBadge status={so.status} />
              {so.parentOrderNumber && (
                <span className="text-xs text-muted-foreground">
                  · part of{" "}
                  <span className="font-mono">{so.parentOrderNumber}</span>
                </span>
              )}
            </div>
            <h1 className="mt-2 text-2xl font-bold tracking-tight flex items-center gap-2">
              <StoreIcon className="h-5 w-5 text-foreground/60" />
              {so.storeName ?? "Order"}
            </h1>
            <p className="mt-1 text-sm text-muted-foreground">
              {so.customerName ?? "Customer"} ·{" "}
              {so.itemCount} {so.itemCount === 1 ? "item" : "items"} ·
              placed {new Date(so.createdAt).toLocaleString()}
            </p>
          </div>

          <div className="text-right">
            <div className="text-xs uppercase tracking-wide text-muted-foreground font-semibold">
              Your payout
            </div>
            <div className="text-2xl font-bold">
              {formatPrice(so.payoutAmount)}
            </div>
            <div className="text-xs text-muted-foreground">
              after {formatPrice(so.commissionAmount)} commission
            </div>
          </div>
        </div>

        <div className="mt-6">
          <OrderStatusTimeline status={so.status} />
        </div>

        {allowed.length > 0 && (
          <div className="mt-6 pt-5 border-t flex flex-wrap items-center gap-2">
            <span className="text-sm font-semibold mr-2">Next step:</span>
            {allowed.map((s) =>
              requiresConfirm(s) ? (
                <button
                  key={s}
                  type="button"
                  onClick={() => setConfirmAction(s)}
                  className="rounded-md border border-destructive text-destructive px-3 py-1.5 text-sm font-semibold hover:bg-destructive hover:text-destructive-foreground transition"
                >
                  {ACTION_LABEL[s]}
                </button>
              ) : (
                <button
                  key={s}
                  type="button"
                  onClick={() =>
                    updateStatus({
                      variables: {
                        input: { sellerOrderId: so.id, status: s },
                      },
                    })
                  }
                  disabled={updating}
                  className="rounded-md bg-primary text-primary-foreground px-3 py-1.5 text-sm font-semibold hover:bg-primary/90 transition disabled:opacity-60"
                >
                  {updating && (
                    <Loader2 className="inline mr-1.5 h-3.5 w-3.5 animate-spin" />
                  )}
                  {ACTION_LABEL[s]}
                </button>
              ),
            )}
          </div>
        )}
      </div>

      <section className="rounded-lg border bg-card overflow-hidden">
        <div className="px-5 py-3 border-b bg-muted/20 text-sm font-semibold">
          Items
        </div>
        <ul className="divide-y">
          {so.items.map((it) => (
            <li key={it.id}>
              <SellerOrderItemRow item={it} />
            </li>
          ))}
        </ul>
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <section className="rounded-lg border bg-card p-5">
          <h2 className="text-base font-semibold mb-3">Ship to</h2>
          {so.shippingAddress ? (
            <address className="not-italic text-sm text-foreground/80 leading-relaxed">
              <div className="font-medium text-foreground">
                {so.shippingAddress.firstName} {so.shippingAddress.lastName}
              </div>
              {so.shippingAddress.phone && (
                <div className="text-foreground/60">
                  {so.shippingAddress.phone}
                </div>
              )}
              <div className="mt-1">
                {so.shippingAddress.addressLine1}
                {so.shippingAddress.addressLine2 && (
                  <>
                    <br />
                    {so.shippingAddress.addressLine2}
                  </>
                )}
                <br />
                {so.shippingAddress.city}, {so.shippingAddress.state}{" "}
                {so.shippingAddress.postalCode}
                <br />
                {so.shippingAddress.countryCode}
              </div>
            </address>
          ) : (
            <p className="text-sm text-muted-foreground">
              No address recorded.
            </p>
          )}
        </section>

        <section className="rounded-lg border bg-card p-5">
          <h2 className="text-base font-semibold mb-3">Financial breakdown</h2>
          <dl className="space-y-2 text-sm">
            <Row label="Subtotal" value={formatPrice(so.subtotal)} />
            {so.taxAmount > 0 && (
              <Row label="Tax" value={formatPrice(so.taxAmount)} />
            )}
            {so.shippingAmount > 0 && (
              <Row label="Shipping" value={formatPrice(so.shippingAmount)} />
            )}
            <Row
              label="Commission"
              value={`- ${formatPrice(so.commissionAmount)}`}
            />
            <div className="border-t pt-2 flex items-baseline justify-between">
              <span className="text-base font-semibold">Your payout</span>
              <span className="text-lg font-bold">
                {formatPrice(so.payoutAmount)}
              </span>
            </div>
            <div className="text-xs text-muted-foreground">
              Payout status:{" "}
              <span className="font-semibold uppercase">
                {so.payoutStatus}
              </span>
            </div>
          </dl>
        </section>
      </div>

      {/* History log */}
      <section className="rounded-lg border bg-card p-5">
        <h2 className="text-base font-semibold mb-3">Status history</h2>
        {so.statusHistory.length === 0 ? (
          <p className="text-sm text-muted-foreground">No transitions yet.</p>
        ) : (
          <ol className="space-y-2 text-sm">
            {so.statusHistory.map((h) => (
              <li
                key={h.id}
                className="flex items-start gap-3 pb-2 border-b last:border-b-0 last:pb-0"
              >
                <span className="text-xs text-muted-foreground whitespace-nowrap pt-0.5">
                  {new Date(h.createdAt).toLocaleString()}
                </span>
                <div>
                  <div className="font-medium">
                    {h.fromStatus
                      ? `${ORDER_STATUS_LABEL[h.fromStatus]} → ${ORDER_STATUS_LABEL[h.toStatus]}`
                      : `Set to ${ORDER_STATUS_LABEL[h.toStatus]}`}
                  </div>
                  {h.notes && (
                    <div className="text-xs text-muted-foreground mt-0.5">
                      {h.notes}
                    </div>
                  )}
                </div>
              </li>
            ))}
          </ol>
        )}
      </section>

      <AlertDialog
        open={confirmAction !== null}
        onOpenChange={(o) => !o && setConfirmAction(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Cancel this order?</AlertDialogTitle>
            <AlertDialogDescription>
              Cancelling will release reserved inventory back to your warehouse
              and notify the customer. This can&apos;t be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Keep order</AlertDialogCancel>
            <AlertDialogAction
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              onClick={() => {
                if (confirmAction) {
                  updateStatus({
                    variables: {
                      input: { sellerOrderId: so.id, status: confirmAction },
                    },
                  });
                }
              }}
              disabled={updating}
            >
              {updating && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Cancel order
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

/* -------------------------------------------------------------------------- */

function SellerOrderItemRow({ item }: { item: OrderItem }) {
  return (
    <div className="flex gap-4 p-4">
      <div className="relative h-16 w-16 shrink-0 rounded-md overflow-hidden bg-muted">
        {item.imageUrlSnapshot ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={item.imageUrlSnapshot}
            alt={item.name}
            className="absolute inset-0 h-full w-full object-cover"
          />
        ) : null}
      </div>
      <div className="flex-1 min-w-0">
        <div className="text-sm font-semibold line-clamp-2">{item.name}</div>
        {item.variantName && (
          <div className="text-xs text-muted-foreground mt-0.5">
            {item.variantName}
          </div>
        )}
        <div className="text-xs text-muted-foreground mt-0.5">
          SKU {item.sku}
        </div>
      </div>
      <div className="text-right">
        <div className="text-sm font-semibold">
          {formatPrice(item.totalPrice)}
        </div>
        <div className="text-xs text-muted-foreground">
          {item.quantity} × {formatPrice(item.unitPrice)}
        </div>
      </div>
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between text-foreground/70">
      <span>{label}</span>
      <span className="text-foreground">{value}</span>
    </div>
  );
}
