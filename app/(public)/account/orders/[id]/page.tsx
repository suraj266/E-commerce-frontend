"use client";

/**
 * /account/orders/[id] — customer order detail.
 *
 * Sections:
 *   - Header strip: order number, status, total, placed date, payment method
 *   - Aggregate timeline (rolled-up parent status)
 *   - Per-seller breakdown: items + per-sub-order status timeline
 *   - Shipping + billing address snapshots
 *   - Customer notes
 *   - Cancel button — only when status is PENDING
 */

import { useParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { useMutation, useQuery } from "@apollo/client/react";
import { toast } from "sonner";
import { ArrowLeft, Loader2, Package, Store, Truck } from "lucide-react";
import { useState } from "react";

import {
  CANCEL_MY_ORDER,
  GET_MY_ORDER,
  GET_MY_ORDERS,
} from "@/lib/graphql/orders";
import {
  CancelMyOrderData,
  MyOrderData,
  PAYMENT_METHOD_LABEL,
  type OrderItem,
  type OrderAddressSnapshot,
  type SellerOrder,
} from "@/types/order.types";
import { formatPrice } from "@/lib/utils/currency";
import { OrderStatusBadge } from "@/components/orders/order-status-badge";
import { OrderStatusTimeline } from "@/components/orders/order-status-timeline";
import { InvoiceCard } from "@/components/orders/invoice-card";
import { WriteReviewDialog } from "@/components/reviews/write-review-dialog";

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

export default function OrderDetailPage() {
  const params = useParams<{ id: string }>();
  const orderId = params.id;
  const [confirmCancel, setConfirmCancel] = useState(false);

  const { data, loading, error } = useQuery<MyOrderData>(GET_MY_ORDER, {
    variables: { id: orderId },
    fetchPolicy: "cache-and-network",
    errorPolicy: "all",
  });

  const [cancelOrder, { loading: cancelling }] =
    useMutation<CancelMyOrderData>(CANCEL_MY_ORDER, {
      refetchQueries: [
        { query: GET_MY_ORDER, variables: { id: orderId } },
        { query: GET_MY_ORDERS, variables: { page: 1, pageSize: 10 } },
      ],
      onCompleted: () => {
        toast.success("Order cancelled");
        setConfirmCancel(false);
      },
      onError: (err) => toast.error(`Cancel failed: ${err.message}`),
    });

  if (loading && !data) {
    return (
      <div className="rounded-lg border bg-card p-8">
        <Loader2 className="mx-auto h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (error || !data?.myOrder) {
    return (
      <div className="rounded-lg border bg-card p-8 text-center space-y-3">
        <Package className="mx-auto h-10 w-10 text-foreground/30" />
        <p className="text-base font-semibold">Order not found</p>
        <p className="text-sm text-foreground/60">
          This order doesn&apos;t exist or you don&apos;t have access to it.
        </p>
        <Link
          href="/account/orders"
          className="inline-flex items-center text-sm text-brand hover:underline"
        >
          <ArrowLeft className="mr-1.5 h-4 w-4" />
          Back to orders
        </Link>
      </div>
    );
  }

  const order = data.myOrder;
  const canCancel = order.status === "PENDING";

  return (
    <div className="space-y-6">
      <Link
        href="/account/orders"
        className="inline-flex items-center text-sm text-foreground/60 hover:text-foreground transition"
      >
        <ArrowLeft className="mr-1.5 h-4 w-4" />
        Back to orders
      </Link>

      {/* ----- Header strip ----- */}
      <div className="rounded-lg border bg-card p-5 sm:p-6">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-xs font-mono text-foreground/60">
                {order.orderNumber}
              </span>
              <OrderStatusBadge status={order.status} />
            </div>
            <h1 className="mt-2 text-2xl font-bold tracking-tight">
              {order.itemCount}{" "}
              {order.itemCount === 1 ? "item" : "items"} from{" "}
              {order.sellerOrders.length}{" "}
              {order.sellerOrders.length === 1 ? "seller" : "sellers"}
            </h1>
            <p className="mt-1 text-sm text-foreground/60">
              Placed on {new Date(order.placedAt).toLocaleString()}
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="text-right">
              <div className="text-xs uppercase tracking-wide text-foreground/50 font-semibold">
                Total
              </div>
              <div className="text-2xl font-bold">
                {formatPrice(order.totalAmount)}
              </div>
              <div className="text-xs text-foreground/60">
                {PAYMENT_METHOD_LABEL[order.paymentMethod] ??
                  order.paymentMethod}
              </div>
            </div>
            {canCancel && (
              <button
                type="button"
                onClick={() => setConfirmCancel(true)}
                className="rounded-md border border-destructive text-destructive px-3 py-1.5 text-xs font-semibold hover:bg-destructive hover:text-destructive-foreground transition"
              >
                Cancel order
              </button>
            )}
          </div>
        </div>

        {/* Aggregate timeline */}
        <div className="mt-6">
          <OrderStatusTimeline status={order.status} />
        </div>
      </div>

      {/* ----- Per-seller breakdown ----- */}
      <section className="space-y-4">
        <h2 className="text-lg font-semibold">Items by seller</h2>
        {order.sellerOrders.map((so) => (
          <SellerOrderCard
            key={so.id}
            sellerOrder={so}
            orderPaymentMethod={order.paymentMethod}
            orderPaymentStatus={order.paymentStatus}
          />
        ))}
      </section>

      {/* ----- Addresses + Notes ----- */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <AddressCard
          title="Shipping address"
          addr={order.shippingAddress}
        />
        <AddressCard
          title="Billing address"
          addr={order.billingAddress}
        />
      </div>

      {order.customerNotes && (
        <section className="rounded-lg border bg-card p-5">
          <h2 className="text-base font-semibold mb-2">Your notes</h2>
          <p className="text-sm text-foreground/70 whitespace-pre-wrap">
            {order.customerNotes}
          </p>
        </section>
      )}

      {/* ----- Totals ----- */}
      {(() => {
        // The stored price is the pre-tax base, so the summary reconciles as
        // Subtotal(base) − Discount + GST + Shipping = Total. The "GST" line is
        // the MERCHANDISE tax only (sum of per-item taxAmount); shipping carries
        // its own GST inside the tax-inclusive shipping charge, so adding
        // order.taxAmount (which also includes the shipping GST) would double-count.
        const merchandiseTax = (order.items ?? []).reduce(
          (sum, it) => sum + (it.taxAmount ?? 0),
          0,
        );
        return (
          <section className="rounded-lg border bg-card p-5 max-w-md ml-auto space-y-2 text-sm">
            <SummaryRow
              label="Subtotal"
              value={formatPrice(order.subtotal)}
            />
            {order.discountAmount > 0 && (
              <SummaryRow
                label="Discount"
                value={`- ${formatPrice(order.discountAmount)}`}
              />
            )}
            {merchandiseTax > 0 && (
              <SummaryRow
                label="Tax (GST)"
                value={formatPrice(Math.round(merchandiseTax * 100) / 100)}
              />
            )}
            {order.shippingAmount > 0 && (
              <SummaryRow
                label="Shipping (incl. GST)"
                value={formatPrice(order.shippingAmount)}
              />
            )}
            <div className="border-t pt-2 flex items-baseline justify-between">
              <span className="text-base font-semibold">Total</span>
              <span className="text-lg font-bold">
                {formatPrice(order.totalAmount)}
              </span>
            </div>
          </section>
        );
      })()}

      <AlertDialog
        open={confirmCancel}
        onOpenChange={(o) => !o && setConfirmCancel(false)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Cancel this order?</AlertDialogTitle>
            <AlertDialogDescription>
              Cancelling will release the reserved stock and notify the
              seller(s). This can&apos;t be undone — you&apos;d need to place
              a new order to buy these items.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Keep order</AlertDialogCancel>
            <AlertDialogAction
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              onClick={() => cancelOrder({ variables: { id: orderId } })}
              disabled={cancelling}
            >
              {cancelling && (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              )}
              Cancel order
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

/* -------------------------------------------------------------------------- */

function SellerOrderCard({
  sellerOrder,
  orderPaymentMethod,
  orderPaymentStatus,
}: {
  sellerOrder: SellerOrder;
  orderPaymentMethod?: string | null;
  orderPaymentStatus?: string | null;
}) {
  // Invoice generation is expected to have fired once payment is captured
  // (online) or seller has confirmed (COD). If we've passed either bar and
  // the URL is still absent, surface the "still generating" copy so the
  // customer isn't left guessing.
  const hasReachedInvoiceTrigger =
    orderPaymentStatus === "PAID" ||
    (orderPaymentMethod === "COD" && sellerOrder.status !== "PENDING");

  return (
    <div className="rounded-lg border bg-card overflow-hidden">
      <div className="p-5 border-b bg-muted/20 flex items-center justify-between gap-3 flex-wrap">
        <div className="flex items-center gap-2">
          <Store className="h-4 w-4 text-foreground/60" />
          <span className="font-semibold text-sm">
            {sellerOrder.storeName ?? "Seller"}
          </span>
          <span className="text-xs font-mono text-foreground/50">
            · {sellerOrder.orderNumber}
          </span>
        </div>
        <OrderStatusBadge status={sellerOrder.status} />
      </div>

      <ul className="divide-y">
        {sellerOrder.items.map((it) => (
          <li key={it.id}>
            <OrderItemRow item={it} sellerOrderStatus={sellerOrder.status} />
          </li>
        ))}
      </ul>

      <div className="border-t bg-muted/10 p-4 space-y-3">
        <OrderStatusTimeline status={sellerOrder.status} />
        {sellerOrder.trackingNumber && (
          <div className="rounded-md border bg-card px-3 py-2 text-sm">
            <div className="flex items-center gap-1.5 font-semibold">
              <Truck className="h-4 w-4 text-primary" />
              Shipment tracking
            </div>
            <div className="mt-1 text-foreground/80">
              {sellerOrder.carrier && <span>{sellerOrder.carrier} · </span>}
              <span className="font-mono">{sellerOrder.trackingNumber}</span>
            </div>
            <div className="flex items-center gap-3 mt-0.5">
              {sellerOrder.trackingUrl && (
                <a
                  href={sellerOrder.trackingUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary hover:underline text-xs"
                >
                  Track shipment ↗
                </a>
              )}
              {sellerOrder.expectedDeliveryAt && (
                <span className="text-xs text-muted-foreground">
                  Est. delivery{" "}
                  {new Date(sellerOrder.expectedDeliveryAt).toLocaleDateString()}
                </span>
              )}
            </div>
          </div>
        )}
        <InvoiceCard
          invoiceNumber={sellerOrder.invoiceNumber}
          invoiceDate={sellerOrder.invoiceDate}
          invoiceUrl={sellerOrder.invoiceUrl}
          placeOfSupplyStateCode={sellerOrder.placeOfSupplyStateCode}
          placeOfSupplyStateName={sellerOrder.placeOfSupplyStateName}
          taxKind={sellerOrder.taxKind}
          paymentMethod={orderPaymentMethod}
          hasReachedInvoiceTrigger={hasReachedInvoiceTrigger}
        />
      </div>
    </div>
  );
}

function OrderItemRow({
  item,
  sellerOrderStatus,
}: {
  item: OrderItem;
  sellerOrderStatus: string;
}) {
  const [reviewOpen, setReviewOpen] = useState(false);
  // Eligibility on the server is the source of truth, but only delivered
  // sub-orders are worth even surfacing the CTA. Saves an API roundtrip
  // for every non-delivered line.
  const canTryReview = sellerOrderStatus === "DELIVERED";

  return (
    <div className="flex gap-4 p-4">
      <div className="relative h-16 w-16 shrink-0 rounded-md overflow-hidden bg-muted">
        {item.imageUrlSnapshot ? (
          <Image
            src={item.imageUrlSnapshot}
            alt={item.name}
            fill
            sizes="80px"
            className="object-cover"
          />
        ) : null}
      </div>
      <div className="flex-1 min-w-0">
        <div className="text-sm font-semibold line-clamp-2">{item.name}</div>
        {item.variantName && (
          <div className="text-xs text-foreground/60 mt-0.5">
            {item.variantName}
          </div>
        )}
        <div className="text-xs text-foreground/50 mt-0.5">SKU {item.sku}</div>
        {canTryReview && (
          <>
            <button
              type="button"
              onClick={() => setReviewOpen(true)}
              className="mt-2 text-xs font-medium text-brand hover:underline"
            >
              Write a review →
            </button>
            <WriteReviewDialog
              productId={item.productId}
              productName={item.name}
              open={reviewOpen}
              onOpenChange={setReviewOpen}
            />
          </>
        )}
      </div>
      <div className="text-right">
        <div className="text-sm font-semibold">
          {formatPrice(item.totalPrice)}
        </div>
        <div className="text-xs text-foreground/60">
          {item.quantity} × {formatPrice(item.unitPrice)}
        </div>
      </div>
    </div>
  );
}

function AddressCard({
  title,
  addr,
}: {
  title: string;
  addr: OrderAddressSnapshot | null | undefined;
}) {
  return (
    <section className="rounded-lg border bg-card p-5">
      <h2 className="text-base font-semibold mb-3">{title}</h2>
      {addr ? (
        <address className="not-italic text-sm text-foreground/80 leading-relaxed">
          <div className="font-medium text-foreground">
            {addr.firstName} {addr.lastName}
          </div>
          {addr.phone && (
            <div className="text-foreground/60">{addr.phone}</div>
          )}
          <div className="mt-1">
            {addr.addressLine1}
            {addr.addressLine2 && (
              <>
                <br />
                {addr.addressLine2}
              </>
            )}
            <br />
            {addr.city}, {addr.state} {addr.postalCode}
            <br />
            {addr.countryCode}
          </div>
        </address>
      ) : (
        <p className="text-sm text-foreground/50">No address recorded.</p>
      )}
    </section>
  );
}

function SummaryRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between text-foreground/70">
      <span>{label}</span>
      <span className="text-foreground">{value}</span>
    </div>
  );
}
