"use client";

/**
 * <ApplyCouponPanel /> — input + apply + remove UX.
 *
 * Two states:
 *   - No coupon applied / invalid: shows input + Apply button
 *   - Valid coupon applied: shows the code chip + savings line + Remove
 *
 * The parent reads `discountAmount` from `useAppliedCoupon` to update its
 * totals — this component is purely UI.
 */

import { useState } from "react";
import { Loader2, Tag, X } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { formatPrice } from "@/lib/utils/currency";
import { useAppliedCoupon } from "./use-applied-coupon";

export interface ApplyCouponPanelProps {
  /** Pass the cart subtotal so we can revalidate when it changes. */
  cartSignal?: unknown;
  /** When true, render compact (single-row) — used on the checkout summary. */
  compact?: boolean;
}

export function ApplyCouponPanel({ cartSignal, compact }: ApplyCouponPanelProps) {
  const { code, validation, loading, apply, remove } = useAppliedCoupon({
    cartSignal,
  });
  const [draft, setDraft] = useState("");

  const isApplied = !!code && validation?.isValid;
  const error =
    code && validation && !validation.isValid ? validation.reason : null;

  async function handleApply() {
    if (!draft.trim()) return;
    const v = await apply(draft);
    if (v?.isValid) setDraft("");
  }

  if (isApplied && validation) {
    return (
      <div
        className={`rounded-md border bg-emerald-50 border-emerald-200 ${
          compact ? "p-3" : "p-4"
        }`}
      >
        <div className="flex items-start gap-3">
          <Tag className="h-4 w-4 mt-0.5 text-emerald-700 shrink-0" />
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="font-mono text-sm font-semibold text-emerald-900">
                {validation.coupon?.code ?? code}
              </span>
              {validation.coupon?.name && (
                <span className="text-xs text-emerald-800/80 truncate">
                  · {validation.coupon.name}
                </span>
              )}
            </div>
            <div className="text-xs text-emerald-800 mt-0.5">
              You saved{" "}
              <span className="font-semibold">
                {formatPrice(validation.discountAmount)}
              </span>
              .
            </div>
          </div>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="h-7 w-7 text-emerald-800 hover:text-emerald-900 hover:bg-emerald-100"
            onClick={remove}
            aria-label="Remove coupon"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className={compact ? "" : "space-y-2"}>
      {!compact && (
        <label className="text-sm font-medium text-foreground/80">
          Have a coupon?
        </label>
      )}
      <div className="flex gap-2">
        <Input
          type="text"
          placeholder="Enter code"
          value={draft}
          onChange={(e) => setDraft(e.target.value.toUpperCase())}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              void handleApply();
            }
          }}
          className="font-mono"
          maxLength={40}
        />
        <Button
          type="button"
          onClick={handleApply}
          disabled={loading || !draft.trim()}
          variant="outline"
        >
          {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          Apply
        </Button>
      </div>
      {error && (
        <p className="text-xs text-destructive">{error}</p>
      )}
    </div>
  );
}
