/** Per-seller slice of a shipping quote. */
export interface SellerShippingQuote {
  sellerId: string;
  storeId: string;
  storeName: string;
  merchandiseSubtotal: number;
  shippingCharge: number;
  freeApplied: boolean;
  freeAbove?: number | null;
  serviceable: boolean;
  codEligible: boolean;
  estimatedDispatchDays?: number | null;
  rateSource: "LIVE" | "IN_HOUSE";
  courierName?: string | null;
}

/** Aggregate shipping quote across all sellers in the cart. */
export interface ShippingQuote {
  sellers: SellerShippingQuote[];
  shippingTotal: number;
  serviceable: boolean;
  codEligible: boolean;
  grandTotal: number;
}

export interface ShippingQuoteInput {
  addressId?: string;
  pincode?: string;
  couponCode?: string;
}

export interface ShippingQuoteData {
  shippingQuote: ShippingQuote;
}
