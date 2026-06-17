"use client";

/**
 * /checkout/success/[orderId] — order "thank you" page.
 *
 * Shown after a successful prepaid payment OR after a COD order is placed.
 * Confirms the order, shows the key numbers, and routes the customer onward
 * (view order detail / keep shopping). The authoritative state lives on the
 * order itself — this page just reads it.
 */

import { useParams } from "next/navigation";
import Link from "next/link";
import { useQuery } from "@apollo/client/react";
import { CheckCircle2, Loader2, Package } from "lucide-react";

import { GET_MY_ORDER } from "@/lib/graphql/orders";
import { MyOrderData, PAYMENT_METHOD_LABEL } from "@/types/order.types";
import { formatPrice } from "@/lib/utils/currency";

export default function CheckoutSuccessPage() {
  const params = useParams<{ orderId: string }>();
  const orderId = params.orderId;

  const { data, loading } = useQuery<MyOrderData>(GET_MY_ORDER, {
    variables: { id: orderId },
    fetchPolicy: "cache-and-network",
    errorPolicy: "all",
  });

  const order = data?.myOrder;
  const isCod = order?.paymentMethod === "COD";

  return (
    <div className="mx-auto max-w-xl px-4 py-12">
      <div className="rounded-xl border bg-card p-8 text-center space-y-5">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100 dark:bg-emerald-900/30">
          <CheckCircle2 className="h-9 w-9 text-emerald-600 dark:text-emerald-400" />
        </div>

        <div className="space-y-1">
          <h1 className="text-2xl font-bold">
            {isCod ? "Order placed!" : "Payment successful!"}
          </h1>
          <p className="text-sm text-foreground/60">
            {isCod
              ? "Your order is confirmed. Pay in cash when it's delivered."
              : "Thank you — we've received your payment and your order is confirmed."}
          </p>
        </div>

        {loading && !order ? (
          <Loader2 className="mx-auto h-5 w-5 animate-spin text-muted-foreground" />
        ) : order ? (
          <div className="rounded-lg border bg-muted/30 p-4 text-left text-sm space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-foreground/60">Order number</span>
              <span className="font-mono font-semibold">{order.orderNumber}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-foreground/60">Items</span>
              <span className="font-medium">
                {order.itemCount} {order.itemCount === 1 ? "item" : "items"}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-foreground/60">Payment</span>
              <span className="font-medium">
                {PAYMENT_METHOD_LABEL[order.paymentMethod] ?? order.paymentMethod}
              </span>
            </div>
            <div className="flex items-center justify-between border-t pt-2">
              <span className="font-semibold">Total paid</span>
              <span className="text-lg font-bold">
                {formatPrice(order.totalAmount)}
              </span>
            </div>
          </div>
        ) : (
          <p className="text-sm text-foreground/60">
            Your order has been placed.
          </p>
        )}

        <div className="flex flex-col sm:flex-row gap-3 pt-2">
          <Link
            href={`/account/orders/${orderId}`}
            className="flex-1 inline-flex items-center justify-center gap-2 rounded-md bg-brand text-white px-5 py-2.5 text-sm font-semibold shadow hover:bg-brand/90 transition"
          >
            <Package className="h-4 w-4" />
            View order
          </Link>
          <Link
            href="/shop"
            className="flex-1 inline-flex items-center justify-center rounded-md border px-5 py-2.5 text-sm font-semibold hover:bg-muted transition"
          >
            Continue shopping
          </Link>
        </div>
      </div>
    </div>
  );
}
