"use client";

/**
 * Request a return (P3-02) — reached from a delivered order. Loads the order,
 * lets the customer pick which items (and how many) to return + a reason, then
 * opens the return and redirects to its tracking page. The backend enforces the
 * real policy gate (delivered + within the return window + quantity bounds).
 */

import { Suspense, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { useQuery, useMutation } from "@apollo/client/react";
import { toast } from "sonner";
import { ArrowLeft, Loader2 } from "lucide-react";

import { GET_MY_ORDER } from "@/lib/graphql/orders";
import {
  REQUEST_RETURN,
  type RequestReturnData,
} from "@/lib/graphql/returns";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

interface OrderItemLite {
  id: string;
  name: string;
  quantity: number;
}
interface SellerOrderLite {
  id: string;
  orderNumber: string;
  status: string;
  storeName?: string | null;
  items: OrderItemLite[];
}
interface MyOrderData {
  myOrder: { id: string; sellerOrders: SellerOrderLite[] } | null;
}

function NewReturnForm() {
  const router = useRouter();
  const params = useSearchParams();
  const orderId = params.get("orderId") ?? "";
  const sellerOrderId = params.get("sellerOrderId") ?? "";

  const [reason, setReason] = useState("");
  const [selected, setSelected] = useState<Record<string, number>>({});
  const [resolutionType, setResolutionType] = useState<
    "REFUND" | "REPLACEMENT"
  >("REFUND");

  const { data, loading, error } = useQuery<MyOrderData>(GET_MY_ORDER, {
    variables: { id: orderId },
    skip: !orderId,
  });

  const sellerOrder = useMemo(
    () => data?.myOrder?.sellerOrders.find((s) => s.id === sellerOrderId),
    [data, sellerOrderId],
  );

  const [requestReturn, { loading: submitting }] =
    useMutation<RequestReturnData>(REQUEST_RETURN, {
      onCompleted: (res) => {
        toast.success("Return requested");
        router.push(`/account/returns/${res.requestReturn.id}`);
      },
      onError: (e) => toast.error(e.message),
    });

  const toggle = (item: OrderItemLite) =>
    setSelected((prev) => {
      const next = { ...prev };
      if (next[item.id]) delete next[item.id];
      else next[item.id] = 1;
      return next;
    });

  const setQty = (item: OrderItemLite, qty: number) =>
    setSelected((prev) => ({
      ...prev,
      [item.id]: Math.max(1, Math.min(item.quantity, qty)),
    }));

  const items = Object.entries(selected).map(([orderItemId, quantity]) => ({
    orderItemId,
    quantity,
  }));

  const submit = () => {
    if (items.length === 0) {
      toast.error("Select at least one item to return.");
      return;
    }
    if (!reason.trim()) {
      toast.error("Please add a reason.");
      return;
    }
    requestReturn({
      variables: {
        input: { sellerOrderId, reason: reason.trim(), resolutionType, items },
      },
    });
  };

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <Link
        href={orderId ? `/account/orders/${orderId}` : "/account/orders"}
        className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="mr-1 h-4 w-4" /> Back to order
      </Link>

      <div>
        <h1 className="text-2xl font-bold tracking-tight">Request a return</h1>
        <p className="text-sm text-muted-foreground">
          Choose the items you&apos;d like to return and tell us why.
        </p>
      </div>

      {loading ? (
        <p className="text-sm text-muted-foreground">Loading order…</p>
      ) : error || !sellerOrder ? (
        <p className="text-sm text-destructive">
          {error?.message ?? "This order can't be found for a return."}
        </p>
      ) : (
        <>
          <div className="rounded-lg border bg-card divide-y">
            {sellerOrder.items.map((it) => {
              const on = it.id in selected;
              return (
                <div
                  key={it.id}
                  className="flex items-center gap-3 p-4 text-sm"
                >
                  <input
                    type="checkbox"
                    checked={on}
                    onChange={() => toggle(it)}
                    className="h-4 w-4"
                    aria-label={`Return ${it.name}`}
                  />
                  <div className="flex-1">
                    <div className="font-medium">{it.name}</div>
                    <div className="text-xs text-muted-foreground">
                      Purchased: {it.quantity}
                    </div>
                  </div>
                  {on && (
                    <input
                      type="number"
                      min={1}
                      max={it.quantity}
                      value={selected[it.id]}
                      onChange={(e) => setQty(it, Number(e.target.value))}
                      className="w-16 rounded-md border bg-background px-2 py-1 text-sm"
                    />
                  )}
                </div>
              );
            })}
          </div>

          <fieldset className="space-y-2">
            <legend className="text-sm font-medium">How should we resolve it?</legend>
            <div className="flex flex-wrap gap-4 text-sm">
              <label className="flex items-center gap-2">
                <input
                  type="radio"
                  name="resolutionType"
                  checked={resolutionType === "REFUND"}
                  onChange={() => setResolutionType("REFUND")}
                  className="h-4 w-4"
                />
                Refund
              </label>
              <label className="flex items-center gap-2">
                <input
                  type="radio"
                  name="resolutionType"
                  checked={resolutionType === "REPLACEMENT"}
                  onChange={() => setResolutionType("REPLACEMENT")}
                  className="h-4 w-4"
                />
                Replacement
              </label>
            </div>
          </fieldset>

          <Textarea
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            placeholder="Reason for the return (e.g. damaged, wrong item, no longer needed)…"
            className="min-h-24"
          />

          <Button onClick={submit} disabled={submitting}>
            {submitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Submit return request
          </Button>
        </>
      )}
    </div>
  );
}

export default function NewReturnPage() {
  return (
    <Suspense
      fallback={<p className="text-sm text-muted-foreground">Loading…</p>}
    >
      <NewReturnForm />
    </Suspense>
  );
}
