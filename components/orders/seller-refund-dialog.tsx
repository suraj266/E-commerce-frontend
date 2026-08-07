"use client";

/**
 * Seller refund dialog — shown on a CANCELLED sub-order whose payment was
 * captured online.
 *
 * The seller sees exactly what the buyer paid for THEIR slice, a pre-filled
 * amount (the full refundable ceiling) they may lower, and a one-click execute.
 * The refund moves real money the moment they confirm — there is no admin
 * approval step — so the copy says so plainly.
 *
 * Every rule shown here (cancelled-only, gateway-backed, not paid out, ceiling)
 * is enforced again server-side; the preview query returns `blockedReason`
 * rather than throwing so this dialog can explain a block instead of erroring.
 */

import { useState } from "react";
import { useMutation, useQuery } from "@apollo/client/react";
import { toast } from "sonner";
import { AlertTriangle, Loader2, RotateCcw } from "lucide-react";

import {
  CREATE_SELLER_REFUND,
  SELLER_REFUND_PREVIEW,
  type CreateSellerRefundData,
  type SellerRefundPreviewData,
} from "@/lib/graphql/seller-refunds";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

/**
 * Exact money formatting — deliberately NOT the shared `formatPrice`, which
 * rounds to whole units (maximumFractionDigits: 0). A refund amount has to show
 * its paise or the seller can't reconcile what they actually sent back.
 */
function formatExact(amount: number, currency = "INR"): string {
  try {
    return new Intl.NumberFormat(currency === "INR" ? "en-IN" : "en-US", {
      style: "currency",
      currency,
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(amount);
  } catch {
    return `${currency} ${amount.toFixed(2)}`;
  }
}

interface Props {
  sellerOrderId: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  /** Called after a refund is successfully created so the page can refetch. */
  onRefunded?: () => void;
}

export function SellerRefundDialog({
  sellerOrderId,
  open,
  onOpenChange,
  onRefunded,
}: Props) {
  /**
   * `null` = untouched, so the field shows the server's ceiling. Deriving the
   * displayed value instead of syncing it into state via an effect means the
   * pre-fill can never lag behind a refetched preview, and there's no cascading
   * render.
   */
  const [amountOverride, setAmountOverride] = useState<string | null>(null);
  const [reason, setReason] = useState("");

  const { data, loading, error, refetch } = useQuery<SellerRefundPreviewData>(
    SELLER_REFUND_PREVIEW,
    {
      variables: { sellerOrderId },
      skip: !open,
      // Always re-read on open: the ceiling moves when another refund lands or a
      // payout run starts, and a stale cached ceiling would offer an amount the
      // mutation then rejects.
      fetchPolicy: "network-only",
      errorPolicy: "all",
    },
  );

  const preview = data?.mySellerOrderRefundPreview;
  const currency = preview?.currencyCode ?? "INR";

  const touched = amountOverride !== null;
  const amount =
    amountOverride ?? (preview ? preview.maxRefundable.toFixed(2) : "");

  /** Drop local edits on close so the next open starts from a fresh ceiling. */
  const handleOpenChange = (next: boolean) => {
    if (!next) {
      setAmountOverride(null);
      setReason("");
    }
    onOpenChange(next);
  };

  const [createRefund, { loading: submitting }] =
    useMutation<CreateSellerRefundData>(CREATE_SELLER_REFUND, {
      onCompleted: (res) => {
        const r = res.createSellerRefund;
        if (r.status === "PROCESSED") {
          toast.success(
            `Refund of ${formatExact(r.amount, currency)} sent to the customer.`,
          );
        } else if (r.status === "PROCESSING") {
          toast.success(
            `Refund of ${formatExact(r.amount, currency)} submitted — the gateway is still settling it.`,
          );
        } else {
          toast.warning(`Refund is ${r.status.toLowerCase()}.`);
        }
        onRefunded?.();
        handleOpenChange(false);
      },
      onError: (err) => toast.error(err.message),
    });

  const parsed = Number(amount);
  const max = preview?.maxRefundable ?? 0;
  /**
   * True when the ceiling comes from what was actually captured rather than
   * from the slice's own columns. Worth calling out: `sliceTotal` sums
   * shipping tax-inclusive while the charged total counts shipping ex-GST, so
   * on a composite-supply order the two legitimately differ and the seller
   * would otherwise wonder why they can't refund the total shown above.
   */
  const cappedByPayment = preview
    ? preview.maxRefundable < preview.sliceTotal - preview.alreadyRefunded - 0.01
    : false;
  const amountInvalid =
    !amount.trim() ||
    Number.isNaN(parsed) ||
    parsed <= 0 ||
    // Tolerate float noise on the boundary the same way the backend does.
    parsed > max + 0.01;

  const submit = () => {
    if (!preview?.refundable || amountInvalid) return;
    createRefund({
      variables: {
        input: {
          sellerOrderId,
          amount: Number(parsed.toFixed(2)),
          reason: reason.trim() || undefined,
        },
      },
    });
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <RotateCcw className="h-5 w-5 text-primary" />
            Refund the customer
          </DialogTitle>
          <DialogDescription>
            {preview
              ? `Order ${preview.orderNumber} was cancelled. Send the money back to the customer's original payment method.`
              : "Loading the payment breakdown…"}
          </DialogDescription>
        </DialogHeader>

        {loading && !preview ? (
          <div className="py-8 text-center">
            <Loader2 className="mx-auto h-5 w-5 animate-spin text-muted-foreground" />
            <p className="mt-2 text-xs text-muted-foreground">
              Checking what&apos;s refundable…
            </p>
          </div>
        ) : error && !preview ? (
          <div className="space-y-3 py-4">
            <p className="text-sm text-destructive">{error.message}</p>
            <Button variant="outline" size="sm" onClick={() => refetch()}>
              Try again
            </Button>
          </div>
        ) : preview ? (
          <div className="space-y-4">
            {/* ---- What the customer paid for this seller's slice ---- */}
            <div className="rounded-md border bg-muted/30 px-3 py-2.5 text-sm">
              <div className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-2">
                Payment breakdown
              </div>
              <dl className="space-y-1.5">
                <Row
                  label="Items subtotal"
                  value={formatExact(preview.subtotal, currency)}
                />
                <Row label="Tax" value={formatExact(preview.taxAmount, currency)} />
                <Row
                  label="Shipping"
                  value={formatExact(preview.shippingAmount, currency)}
                />
                {preview.discountAmount > 0 && (
                  <Row
                    label="Discount"
                    value={`− ${formatExact(preview.discountAmount, currency)}`}
                  />
                )}
                <div className="border-t pt-1.5">
                  <Row
                    label="Order total"
                    value={formatExact(preview.sliceTotal, currency)}
                    bold
                  />
                </div>
                {preview.alreadyRefunded > 0 && (
                  <Row
                    label="Already refunded"
                    value={`− ${formatExact(preview.alreadyRefunded, currency)}`}
                  />
                )}
                <div className="border-t pt-1.5">
                  <Row
                    label="Refundable now"
                    value={formatExact(preview.maxRefundable, currency)}
                    bold
                  />
                </div>
              </dl>
              {cappedByPayment && (
                <p className="mt-2 text-xs text-muted-foreground">
                  Capped at the amount actually captured from the customer.
                </p>
              )}
            </div>

            {!preview.refundable ? (
              <div className="flex gap-2 rounded-md border border-amber-300/50 bg-amber-50 px-3 py-2.5 text-sm text-amber-900 dark:bg-amber-900/20 dark:text-amber-300">
                <AlertTriangle className="h-4 w-4 shrink-0 mt-0.5" />
                <span>{preview.blockedReason}</span>
              </div>
            ) : (
              <>
                <div className="space-y-1.5">
                  <Label htmlFor="refund-amount">Refund amount</Label>
                  <Input
                    id="refund-amount"
                    type="number"
                    inputMode="decimal"
                    step="0.01"
                    min="0"
                    max={preview.maxRefundable}
                    value={amount}
                    onChange={(e) => {
                      setAmountOverride(e.target.value);
                    }}
                    aria-invalid={touched && amountInvalid}
                  />
                  <p
                    className={`text-xs ${
                      touched && amountInvalid
                        ? "text-destructive"
                        : "text-muted-foreground"
                    }`}
                  >
                    {touched && amountInvalid
                      ? `Enter an amount between 0 and ${formatExact(preview.maxRefundable, currency)}.`
                      : `Pre-filled with the full refundable amount. Lower it for a partial refund.`}
                  </p>
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="refund-reason">
                    Reason{" "}
                    <span className="text-muted-foreground font-normal">
                      (optional)
                    </span>
                  </Label>
                  <Input
                    id="refund-reason"
                    placeholder="e.g. Out of stock after confirmation"
                    value={reason}
                    onChange={(e) => setReason(e.target.value)}
                  />
                </div>

                <p className="text-xs text-muted-foreground">
                  This sends the money back through{" "}
                  {preview.paymentGateway ?? "the original gateway"}{" "}
                  straight away — it can&apos;t be undone. The customer is
                  emailed automatically.
                </p>
              </>
            )}

            {/* ---- Prior attempts on this slice ---- */}
            {preview.refunds.length > 0 && (
              <div className="rounded-md border px-3 py-2">
                <div className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-1.5">
                  Refund history
                </div>
                <ul className="space-y-1">
                  {preview.refunds.map((r) => (
                    <li
                      key={r.id}
                      className="flex items-center justify-between gap-2 text-xs"
                    >
                      <span className="text-muted-foreground">
                        {new Date(r.createdAt).toLocaleDateString()}
                        {r.failureReason ? ` · ${r.failureReason}` : ""}
                      </span>
                      <span className="font-medium whitespace-nowrap">
                        {formatExact(r.amount, currency)} · {r.status}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        ) : null}

        <DialogFooter>
          <Button variant="outline" onClick={() => handleOpenChange(false)}>
            Close
          </Button>
          <Button
            onClick={submit}
            disabled={!preview?.refundable || amountInvalid || submitting}
          >
            {submitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {preview?.refundable
              ? `Refund ${amountInvalid ? "" : formatExact(parsed, currency)}`.trim()
              : "Refund"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function Row({
  label,
  value,
  bold,
}: {
  label: string;
  value: string;
  bold?: boolean;
}) {
  return (
    <div className="flex items-center justify-between gap-3">
      <dt className={bold ? "font-semibold" : "text-muted-foreground"}>
        {label}
      </dt>
      <dd className={bold ? "font-semibold tabular-nums" : "tabular-nums"}>
        {value}
      </dd>
    </div>
  );
}
