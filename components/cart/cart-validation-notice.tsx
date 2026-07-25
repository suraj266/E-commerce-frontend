"use client";

/**
 * CartValidationNotice — advisory stock/price re-validation surfaced on the
 * cart + checkout pages. Calls the read-only `validateCart` query (works for
 * both guest and signed-in carts) and renders adjustable inline warnings.
 *
 * This is NOT a hard stop: order placement keeps the Phase-1 authoritative
 * oversell guard. The notice just lets the customer fix drift up front —
 * reduce an over-ordered line, drop an unavailable item, or acknowledge a
 * price change.
 */

import { useEffect } from "react";
import { useQuery } from "@apollo/client/react";
import { AlertTriangle } from "lucide-react";

import { VALIDATE_CART } from "@/lib/graphql/cart";
import type { ValidateCartData, CartWarning } from "@/types/cart.types";
import { useCart } from "@/components/cart/use-cart";
import { formatPrice } from "@/lib/utils/currency";

export function CartValidationNotice({
  /** Bump this (e.g. cart.subtotal / itemCount) to re-run validation. */
  refreshSignal,
}: {
  refreshSignal?: number | string | null;
}) {
  const { updateQty, remove, busy } = useCart();
  const { data, refetch } = useQuery<ValidateCartData>(VALIDATE_CART, {
    fetchPolicy: "cache-and-network",
    errorPolicy: "ignore",
  });

  // Re-validate whenever the cart shape changes.
  useEffect(() => {
    void refetch();
  }, [refreshSignal, refetch]);

  const warnings = data?.validateCart?.warnings ?? [];
  if (warnings.length === 0) return null;

  return (
    <div className="mb-6 rounded-md border border-warning/40 bg-warning/10 px-4 py-3 text-sm">
      <div className="flex items-start gap-3">
        <AlertTriangle className="h-4 w-4 text-warning mt-0.5 shrink-0" />
        <div className="flex-1 space-y-2">
          <strong className="font-semibold text-foreground">
            A few items need a quick review before checkout.
          </strong>
          <ul className="space-y-2">
            {warnings.map((w, i) => (
              <li
                key={`${w.variantId}-${w.code}-${i}`}
                className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between"
              >
                <span className="text-foreground/80">{renderMessage(w)}</span>
                <WarningAction
                  warning={w}
                  busy={busy}
                  onAdjust={(q) => updateQty(w.variantId, q)}
                  onRemove={() => remove(w.variantId)}
                />
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

function renderMessage(w: CartWarning): string {
  if (w.code === "PRICE_CHANGED" && w.oldPrice != null && w.newPrice != null) {
    return `${w.message} (was ${formatPrice(w.oldPrice)}, now ${formatPrice(
      w.newPrice,
    )})`;
  }
  return w.message;
}

function WarningAction({
  warning,
  busy,
  onAdjust,
  onRemove,
}: {
  warning: CartWarning;
  busy: boolean;
  onAdjust: (q: number) => void;
  onRemove: () => void;
}) {
  const btn =
    "inline-flex items-center justify-center rounded-md border px-3 py-1.5 text-xs font-semibold transition disabled:opacity-60 hover:border-foreground/40";

  if (
    warning.code === "REDUCED_QUANTITY" &&
    warning.suggestedQuantity != null &&
    warning.suggestedQuantity > 0
  ) {
    return (
      <button
        type="button"
        disabled={busy}
        onClick={() => onAdjust(warning.suggestedQuantity as number)}
        className={btn}
      >
        Reduce to {warning.suggestedQuantity}
      </button>
    );
  }

  if (warning.code === "OUT_OF_STOCK" || warning.code === "UNAVAILABLE") {
    return (
      <button
        type="button"
        disabled={busy}
        onClick={onRemove}
        className={`${btn} hover:border-destructive hover:text-destructive`}
      >
        Remove
      </button>
    );
  }

  // PRICE_CHANGED is acknowledged implicitly by proceeding — no action button.
  return null;
}
