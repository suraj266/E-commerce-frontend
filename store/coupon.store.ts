/**
 * Coupon store — persists the applied coupon code across cart → checkout.
 *
 * v1 keeps state on the client. The code is sent to the server for
 * re-validation on every read (cart) and during placement, so a stale
 * localStorage value is harmless — it'll fail validation and be cleared.
 */

import { create } from "zustand";
import { persist } from "zustand/middleware";

interface CouponState {
  /** The code typed by the customer. UPPERCASE. Null when none applied. */
  code: string | null;
  setCode: (code: string | null) => void;
  clear: () => void;
}

export const useCouponStore = create<CouponState>()(
  persist(
    (set) => ({
      code: null,
      setCode: (code) =>
        set({ code: code ? code.trim().toUpperCase() : null }),
      clear: () => set({ code: null }),
    }),
    { name: "ecommerce-coupon" },
  ),
);
