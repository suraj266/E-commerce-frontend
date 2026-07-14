"use client";

/**
 * /checkout/failed/[orderId] — payment cancelled / failed page.
 *
 * Reached when the customer dismisses the gateway without paying
 * (?reason=cancelled) or the payment fails at the gateway (?reason=failed).
 * By the time we land here the backend has already CANCELLED the order and
 * released the reserved stock, so we explain that and point the customer to a
 * fresh checkout — a cancelled order can't be re-paid.
 */

import { Suspense } from "react";
import { useParams, useSearchParams } from "next/navigation";
import Link from "next/link";
import { useQuery } from "@apollo/client/react";
import { Loader2, ShoppingCart, XCircle } from "lucide-react";

import { GET_MY_ORDER } from "@/lib/graphql/orders";
import { MyOrderData } from "@/types/order.types";
import { formatPrice } from "@/lib/utils/currency";

function CheckoutFailedContent() {
  const params = useParams<{ orderId: string }>();
  const orderId = params.orderId;
  const searchParams = useSearchParams();
  const reason = searchParams.get("reason") === "failed" ? "failed" : "cancelled";

  const { data, loading } = useQuery<MyOrderData>(GET_MY_ORDER, {
    variables: { id: orderId },
    fetchPolicy: "cache-and-network",
    errorPolicy: "all",
  });

  const order = data?.myOrder;

  const title =
    reason === "failed" ? "Payment failed" : "Payment cancelled";
  const blurb =
    reason === "failed"
      ? "Your payment couldn't be completed at the gateway, so this order was cancelled."
      : "You cancelled the payment, so this order was cancelled.";

  return (
    <div className="mx-auto max-w-xl px-4 py-12">
      <div className="rounded-xl border bg-card p-8 text-center space-y-5">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-red-100 dark:bg-red-900/30">
          <XCircle className="h-9 w-9 text-red-600 dark:text-red-400" />
        </div>

        <div className="space-y-1">
          <h1 className="text-2xl font-bold">{title}</h1>
          <p className="text-sm text-foreground/60">{blurb}</p>
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
              <span className="text-foreground/60">Status</span>
              <span className="font-medium text-red-600 dark:text-red-400">
                {order.status === "CANCELLED" ? "Cancelled" : order.status}
              </span>
            </div>
            <div className="flex items-center justify-between border-t pt-2">
              <span className="text-foreground/60">Order value</span>
              <span className="font-medium">{formatPrice(order.totalAmount)}</span>
            </div>
          </div>
        ) : null}

        <p className="text-xs text-foreground/50">
          Nothing was charged. Your items are still in your cart — place the
          order again whenever you&apos;re ready.
        </p>

        <div className="flex flex-col sm:flex-row gap-3 pt-2">
          <Link
            href="/cart"
            className="flex-1 inline-flex items-center justify-center gap-2 rounded-md bg-brand text-white px-5 py-2.5 text-sm font-semibold shadow hover:bg-brand/90 transition"
          >
            <ShoppingCart className="h-4 w-4" />
            Place order again
          </Link>
          <Link
            href={`/account/orders/${orderId}`}
            className="flex-1 inline-flex items-center justify-center rounded-md border px-5 py-2.5 text-sm font-semibold hover:bg-muted transition"
          >
            View order
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function CheckoutFailedPage() {
  return (
    <Suspense
      fallback={
        <div className="mx-auto max-w-xl px-4 py-12">
          <Loader2 className="mx-auto h-6 w-6 animate-spin text-muted-foreground" />
        </div>
      }
    >
      <CheckoutFailedContent />
    </Suspense>
  );
}
