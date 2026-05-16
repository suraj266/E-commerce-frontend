"use client";

/**
 * useAppliedCoupon — single source of truth for the customer's currently
 * applied coupon.
 *
 * Behaviour:
 *   - Reads the persisted code from `useCouponStore`.
 *   - On mount / when the code or cart changes, fires `validateCoupon`
 *     server-side. The mutation is read-only (doesn't persist anything).
 *   - Exposes `apply(code)` → set + validate, `remove()` → clear, plus the
 *     latest `validation` state for the UI.
 *
 * Why a mutation (not a query)?
 *   `validateCoupon` takes input and produces a derived result based on
 *   the current cart — it's a "compute this for me" call, not a stable
 *   resource lookup. Apollo's normalized cache would do the wrong thing
 *   here (cache key collisions, stale results) so we fire it imperatively.
 */

import { useCallback, useEffect, useState } from "react";
import { useMutation } from "@apollo/client/react";
import { toast } from "sonner";

import { VALIDATE_COUPON } from "@/lib/graphql/coupons";
import { useCouponStore } from "@/store/coupon.store";
import { useAuthStore } from "@/store/auth.store";
import type {
  CouponValidation,
  ValidateCouponData,
} from "@/types/coupon.types";

export interface UseAppliedCouponOptions {
  /** Re-validate whenever this value changes (e.g. cart total). */
  cartSignal?: unknown;
}

export interface UseAppliedCouponReturn {
  code: string | null;
  validation: CouponValidation | null;
  loading: boolean;
  apply: (code: string) => Promise<CouponValidation | null>;
  remove: () => void;
  /** Pre-tax discount; 0 when invalid/unset. */
  discountAmount: number;
  /**
   * Effective discount on the tax-inclusive total (includes the GST savings
   * from the discounted taxable value). Use this for the discount line on
   * the cart/checkout summary when prices are shown tax-inclusive.
   */
  discountInclTax: number;
  /** Server-computed customer-paying total, post-discount + post-GST. */
  customerTotal: number | null;
}

export function useAppliedCoupon(
  opts: UseAppliedCouponOptions = {},
): UseAppliedCouponReturn {
  const code = useCouponStore((s) => s.code);
  const setCode = useCouponStore((s) => s.setCode);
  const clear = useCouponStore((s) => s.clear);
  const accessToken = useAuthStore((s) => s.accessToken);

  const [validation, setValidation] = useState<CouponValidation | null>(null);

  const [runValidate, { loading }] = useMutation<ValidateCouponData>(
    VALIDATE_COUPON,
  );

  // Re-validate when the persisted code or cart contents change.
  useEffect(() => {
    if (!code || !accessToken) {
      setValidation(null);
      return;
    }
    let cancelled = false;
    (async () => {
      try {
        const { data } = await runValidate({ variables: { input: { code } } });
        if (cancelled) return;
        const v = data?.validateCoupon ?? null;
        setValidation(v);
        if (v && !v.isValid) {
          // Don't toast on auto-revalidate — the cart UI shows the reason.
          // Only auto-clear if the coupon is structurally invalid (the
          // server says it doesn't exist or expired) so we don't try
          // forever. Cart-state issues (min purchase) keep the code so
          // the customer can add more items.
          if (
            v.reason &&
            /invalid|expired|no longer active|misconfigured/i.test(v.reason)
          ) {
            clear();
          }
        }
      } catch {
        if (cancelled) return;
        setValidation(null);
      }
    })();
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [code, accessToken, opts.cartSignal]);

  const apply = useCallback(
    async (newCode: string): Promise<CouponValidation | null> => {
      const trimmed = newCode.trim();
      if (!trimmed) {
        toast.error("Enter a coupon code.");
        return null;
      }
      if (!accessToken) {
        toast.error("Please sign in to use a coupon.");
        return null;
      }
      try {
        const { data } = await runValidate({
          variables: { input: { code: trimmed } },
        });
        const v = data?.validateCoupon ?? null;
        setValidation(v);
        if (v?.isValid) {
          setCode(trimmed);
          toast.success(`${v.coupon?.name ?? "Coupon"} applied!`);
        } else if (v) {
          toast.error(v.reason ?? "This coupon code is invalid.");
        }
        return v;
      } catch (err) {
        toast.error(err instanceof Error ? err.message : "Validation failed.");
        return null;
      }
    },
    [accessToken, runValidate, setCode],
  );

  const remove = useCallback(() => {
    clear();
    setValidation(null);
  }, [clear]);

  const discountAmount =
    validation?.isValid && validation.discountAmount > 0
      ? validation.discountAmount
      : 0;
  const discountInclTax =
    validation?.isValid && validation.discountInclTax > 0
      ? validation.discountInclTax
      : 0;
  const customerTotal =
    validation?.isValid ? validation.customerTotal : null;

  return {
    code,
    validation,
    loading,
    apply,
    remove,
    discountAmount,
    discountInclTax,
    customerTotal,
  };
}
