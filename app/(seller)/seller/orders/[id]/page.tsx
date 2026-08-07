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
import { useMutation, useQuery, useLazyQuery } from "@apollo/client/react";
import { toast } from "sonner";
import {
  ArrowLeft,
  Loader2,
  Package,
  RotateCcw,
  Store as StoreIcon,
  Truck,
} from "lucide-react";

import {
  GET_MY_SELLER_ORDER,
  GET_MY_SELLER_ORDERS,
  UPDATE_SELLER_ORDER_STATUS,
} from "@/lib/graphql/orders";
import {
  GET_MY_COURIER_ACCOUNTS,
  GET_COURIER_OPTIONS_FOR_ORDER,
  SHIP_VIA_COURIER,
} from "@/lib/graphql/courier";
import type {
  MyCourierAccountsData,
  CourierOptionsForOrderData,
} from "@/types/courier.types";
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
import { InvoiceCard } from "@/components/orders/invoice-card";
import { SellerRefundDialog } from "@/components/orders/seller-refund-dialog";

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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

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
  const [refundOpen, setRefundOpen] = useState(false);
  const [shipOpen, setShipOpen] = useState(false);
  const [ship, setShip] = useState({
    carrier: "",
    trackingNumber: "",
    trackingUrl: "",
    expectedDeliveryAt: "",
  });

  const { data, loading, error, refetch } = useQuery<MySellerOrderData>(
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
        setShipOpen(false);
      },
      onError: (err) => toast.error(err.message),
    });

  const { data: courierData } = useQuery<MyCourierAccountsData>(
    GET_MY_COURIER_ACCOUNTS,
    { fetchPolicy: "cache-and-network" },
  );
  const hasCourier = (courierData?.myCourierAccounts ?? []).some((a) => a.isEnabled);

  const [pickerOpen, setPickerOpen] = useState(false);
  const [chosenCourier, setChosenCourier] = useState<string>("");
  const [loadCourierOptions, { data: optionsData, loading: optionsLoading }] =
    useLazyQuery<CourierOptionsForOrderData>(GET_COURIER_OPTIONS_FOR_ORDER, {
      fetchPolicy: "network-only",
    });
  const options = optionsData?.courierOptionsForOrder;

  const [shipCourier, { loading: shippingCourier }] = useMutation(SHIP_VIA_COURIER, {
    refetchQueries: [{ query: GET_MY_SELLER_ORDER, variables: { id } }],
    onCompleted: () => {
      toast.success("Shipped via courier — AWB generated");
      setPickerOpen(false);
    },
    onError: (err) => toast.error(err.message),
  });

  const openCourierPicker = (sellerOrderId: string) => {
    setChosenCourier("");
    setPickerOpen(true);
    loadCourierOptions({ variables: { sellerOrderId } });
  };

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
  // A prepaid order whose payment hasn't been captured yet (customer is still
  // paying, or abandoned the gateway) must not be fulfilled — the only action
  // we allow is cancellation. The backend enforces this too; this just hides
  // the buttons. COD orders are PENDING (never AWAITING_PAYMENT) so unaffected.
  const awaitingPayment = so.paymentStatus === "AWAITING_PAYMENT";
  const allowedRaw = NEXT_TRANSITIONS[so.status] ?? [];
  const allowed = awaitingPayment
    ? allowedRaw.filter((s) => s === "CANCELLED")
    : allowedRaw;
  const requiresConfirm = (s: OrderStatus) => s === "CANCELLED";
  const requiresShipDetails = (s: OrderStatus) => s === "SHIPPED";

  // Cancelling does NOT return the customer's money — that's a separate,
  // deliberate action. Offer it once the order is cancelled and the buyer still
  // holds a balance with us. PARTIALLY_REFUNDED is included so a seller can
  // top up an earlier partial refund. The dialog re-checks eligibility server-
  // side (COD, payout in flight, already fully refunded) and explains a block.
  const canOfferRefund =
    so.status === "CANCELLED" &&
    (so.paymentStatus === "PAID" || so.paymentStatus === "PARTIALLY_REFUNDED");

  const submitShip = () => {
    if (!ship.trackingNumber.trim()) {
      toast.error("Tracking number is required");
      return;
    }
    updateStatus({
      variables: {
        input: {
          sellerOrderId: so.id,
          status: "SHIPPED",
          trackingNumber: ship.trackingNumber.trim(),
          carrier: ship.carrier.trim() || undefined,
          trackingUrl: ship.trackingUrl.trim() || undefined,
          expectedDeliveryAt: ship.expectedDeliveryAt
            ? new Date(ship.expectedDeliveryAt).toISOString()
            : undefined,
        },
      },
    });
  };

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

        {awaitingPayment && (
          <div className="mt-6 pt-5 border-t">
            <div className="rounded-md border border-amber-300/50 bg-amber-50 dark:bg-amber-900/20 px-3 py-2 text-sm text-amber-900 dark:text-amber-300">
              Awaiting payment — this prepaid order can&apos;t be fulfilled until
              the customer&apos;s payment is confirmed. You can still cancel it.
            </div>
          </div>
        )}

        {canOfferRefund && (
          <div className="mt-6 pt-5 border-t">
            <div className="flex flex-col gap-3 rounded-md border border-amber-300/50 bg-amber-50 px-3 py-3 dark:bg-amber-900/20 sm:flex-row sm:items-center sm:justify-between">
              <div className="text-sm text-amber-900 dark:text-amber-300">
                <p className="font-semibold">Customer is still owed a refund</p>
                <p className="mt-0.5 text-xs">
                  This order was cancelled but the payment is still with us.
                  Refund it to close the loop.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setRefundOpen(true)}
                className="shrink-0 rounded-md bg-primary px-3 py-1.5 text-sm font-semibold text-primary-foreground transition hover:bg-primary/90 inline-flex items-center"
              >
                <RotateCcw className="mr-1.5 h-3.5 w-3.5" />
                Refund customer
              </button>
            </div>
          </div>
        )}

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
              ) : requiresShipDetails(s) ? (
                <div key={s} className="flex items-center gap-2">
                  {hasCourier && (
                    <button
                      type="button"
                      onClick={() => openCourierPicker(so.id)}
                      disabled={shippingCourier}
                      className="rounded-md bg-primary text-primary-foreground px-3 py-1.5 text-sm font-semibold hover:bg-primary/90 transition disabled:opacity-60 inline-flex items-center"
                    >
                      <Truck className="mr-1.5 h-3.5 w-3.5" />
                      Ship with courier
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={() => setShipOpen(true)}
                    disabled={updating}
                    className={`rounded-md px-3 py-1.5 text-sm font-semibold transition disabled:opacity-60 inline-flex items-center ${
                      hasCourier
                        ? "border hover:bg-muted"
                        : "bg-primary text-primary-foreground hover:bg-primary/90"
                    }`}
                  >
                    <Truck className="mr-1.5 h-3.5 w-3.5" />
                    {hasCourier ? "Manual" : ACTION_LABEL[s]}
                  </button>
                </div>
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

      <InvoiceCard
        invoiceNumber={so.invoiceNumber}
        invoiceDate={so.invoiceDate}
        invoiceUrl={so.invoiceUrl}
        placeOfSupplyStateCode={so.placeOfSupplyStateCode}
        placeOfSupplyStateName={so.placeOfSupplyStateName}
        taxKind={so.taxKind}
        hasReachedInvoiceTrigger={so.status !== "PENDING"}
      />

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

          {so.trackingNumber && (
            <div className="mt-4 pt-4 border-t text-sm">
              <div className="flex items-center gap-1.5 font-semibold text-foreground">
                <Truck className="h-4 w-4 text-primary" />
                Tracking
              </div>
              <div className="mt-1 text-foreground/80">
                {so.carrier && <span>{so.carrier} · </span>}
                <span className="font-mono">{so.trackingNumber}</span>
              </div>
              <div className="flex items-center gap-3 mt-0.5">
                {so.trackingUrl && (
                  <a
                    href={so.trackingUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary hover:underline text-xs"
                  >
                    Track shipment ↗
                  </a>
                )}
                {so.labelUrl && (
                  <a
                    href={so.labelUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary hover:underline text-xs"
                  >
                    Download label ↗
                  </a>
                )}
              </div>
              {so.expectedDeliveryAt && (
                <div className="text-xs text-muted-foreground mt-0.5">
                  Est. delivery{" "}
                  {new Date(so.expectedDeliveryAt).toLocaleDateString()}
                </div>
              )}
            </div>
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

      <SellerRefundDialog
        sellerOrderId={so.id}
        open={refundOpen}
        onOpenChange={setRefundOpen}
        onRefunded={() => refetch()}
      />

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

      {/* Courier picker — choose from live Shiprocket serviceability */}
      <Dialog open={pickerOpen} onOpenChange={(o) => !o && setPickerOpen(false)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Truck className="h-5 w-5 text-primary" />
              Choose a courier
            </DialogTitle>
            <DialogDescription>
              Live rates from your courier for this pickup → delivery. Pick one to
              generate the AWB + label and ship.
            </DialogDescription>
          </DialogHeader>

          {optionsLoading ? (
            <div className="py-8 text-center">
              <Loader2 className="mx-auto h-5 w-5 animate-spin text-muted-foreground" />
              <p className="mt-2 text-xs text-muted-foreground">Fetching available couriers…</p>
            </div>
          ) : !options || options.couriers.length === 0 ? (
            <p className="py-6 text-sm text-muted-foreground text-center">
              No couriers available for this route. Try manual shipping.
            </p>
          ) : (
            <div className="max-h-80 overflow-y-auto space-y-2">
              {options.couriers.map((c) => {
                const isChoice = c.courierId === options.selectedCourierId;
                const sel = chosenCourier === c.courierId;
                return (
                  <button
                    key={c.courierId}
                    type="button"
                    onClick={() => setChosenCourier(c.courierId)}
                    className={`w-full text-left rounded-md border px-3 py-2.5 transition ${
                      sel ? "border-primary ring-1 ring-primary bg-primary/5" : "hover:bg-muted/40"
                    }`}
                  >
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-semibold text-sm">{c.courierName}</span>
                        {c.recommended && (
                          <span className="text-[10px] rounded-full bg-green-100 text-green-700 px-2 py-0.5 font-semibold">
                            Recommended
                          </span>
                        )}
                        {isChoice && (
                          <span className="text-[10px] rounded-full bg-blue-100 text-blue-700 px-2 py-0.5 font-semibold">
                            Customer&apos;s choice
                          </span>
                        )}
                      </div>
                      <span className="text-sm font-bold whitespace-nowrap">
                        {formatPrice(c.rate)}
                      </span>
                    </div>
                    <div className="text-xs text-muted-foreground mt-0.5">
                      {c.estimatedDays != null ? `~${c.estimatedDays} days` : "ETA n/a"}
                      {c.codAvailable ? " · COD ok" : " · Prepaid only"}
                    </div>
                  </button>
                );
              })}
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => setPickerOpen(false)}>
              Cancel
            </Button>
            <Button
              onClick={() =>
                shipCourier({ variables: { sellerOrderId: so.id, courierId: chosenCourier } })
              }
              disabled={!chosenCourier || shippingCourier}
            >
              {shippingCourier && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Ship with this courier
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Mark-as-shipped: capture tracking */}
      <Dialog open={shipOpen} onOpenChange={(o) => !o && setShipOpen(false)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Truck className="h-5 w-5 text-primary" />
              Ship this order
            </DialogTitle>
            <DialogDescription>
              Add the courier and tracking number so the customer can follow
              their delivery. Marking shipped also commits inventory.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-3">
            <div className="space-y-1.5">
              <Label>
                Tracking number <span className="text-destructive">*</span>
              </Label>
              <Input
                value={ship.trackingNumber}
                onChange={(e) =>
                  setShip((s) => ({ ...s, trackingNumber: e.target.value }))
                }
                placeholder="e.g. SR1234567890"
              />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label>Courier</Label>
                <Input
                  value={ship.carrier}
                  onChange={(e) =>
                    setShip((s) => ({ ...s, carrier: e.target.value }))
                  }
                  placeholder="e.g. Delhivery"
                />
              </div>
              <div className="space-y-1.5">
                <Label>Expected delivery</Label>
                <Input
                  type="date"
                  value={ship.expectedDeliveryAt}
                  onChange={(e) =>
                    setShip((s) => ({
                      ...s,
                      expectedDeliveryAt: e.target.value,
                    }))
                  }
                />
              </div>
            </div>
            <div className="space-y-1.5">
              <Label>Tracking URL</Label>
              <Input
                value={ship.trackingUrl}
                onChange={(e) =>
                  setShip((s) => ({ ...s, trackingUrl: e.target.value }))
                }
                placeholder="https://…"
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setShipOpen(false)}>
              Cancel
            </Button>
            <Button onClick={submitShip} disabled={updating}>
              {updating && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Mark as shipped
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
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
