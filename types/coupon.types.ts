/**
 * Coupon types — mirror backend GraphQL.
 */

export const DISCOUNT_TYPES = ["percentage", "fixed_amount"] as const;
export type DiscountType = (typeof DISCOUNT_TYPES)[number];

export const DISCOUNT_TYPE_LABEL: Record<DiscountType, string> = {
  percentage: "Percentage",
  fixed_amount: "Fixed amount",
};

export const COUPON_STATUS_FILTERS = [
  "all",
  "active",
  "inactive",
  "expired",
] as const;
export type CouponStatusFilter = (typeof COUPON_STATUS_FILTERS)[number];

export interface Coupon {
  id: string;
  storeId: string | null;
  code: string;
  name: string;
  description: string | null;
  discountType: DiscountType;
  discountValue: number;
  minimumPurchaseAmount: number | null;
  maximumDiscountAmount: number | null;
  usageLimit: number | null;
  usageLimitPerUser: number | null;
  validFrom: string;
  validUntil: string;
  isActive: boolean;
  redemptionCount: number | null;
  createdAt: string;
  updatedAt: string;
}

export interface CouponValidation {
  isValid: boolean;
  reason: string | null;
  /** Pre-tax discount (e.g. 10% × ₹100 = ₹10). */
  discountAmount: number;
  /** Pre-tax cart subtotal. */
  subtotal: number;
  /** Tax-inclusive subtotal, pre-discount. */
  subtotalInclTax: number;
  /**
   * Effective discount on the tax-inclusive total. Includes GST reduction
   * from the smaller post-discount taxable value (CGST Act §15(3)(a)).
   */
  discountInclTax: number;
  /**
   * Final amount the customer pays at checkout. Use this for the displayed
   * "Total" line so it matches what placement will charge.
   */
  customerTotal: number;
  coupon: Coupon | null;
}

// ---- Inputs ----
export interface CreateCouponInput {
  storeId?: string | null;
  code: string;
  name: string;
  description?: string | null;
  discountType: DiscountType;
  discountValue: number;
  minimumPurchaseAmount?: number | null;
  maximumDiscountAmount?: number | null;
  usageLimit?: number | null;
  usageLimitPerUser?: number | null;
  validFrom: string;
  validUntil: string;
  isActive?: boolean;
}

export interface UpdateCouponInput extends Partial<CreateCouponInput> {
  id: string;
}

export interface ValidateCouponInput {
  code: string;
}

// ---- Apollo responses ----
export interface GetAdminCouponsData {
  adminCoupons: Coupon[];
}
export interface GetAdminCouponData {
  adminCoupon: Coupon;
}
export interface CreateCouponData {
  createCoupon: Coupon;
}
export interface UpdateCouponData {
  updateCoupon: Coupon;
}
export interface ValidateCouponData {
  validateCoupon: CouponValidation;
}

/** Helper — current status pill given a coupon's flags + now(). */
export function getCouponStatus(c: Coupon): "active" | "scheduled" | "expired" | "inactive" {
  if (!c.isActive) return "inactive";
  const now = Date.now();
  const from = new Date(c.validFrom).getTime();
  const until = new Date(c.validUntil).getTime();
  if (now < from) return "scheduled";
  if (now > until) return "expired";
  return "active";
}
