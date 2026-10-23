import type { Product, ProductVariant } from "./product.types";

export const CART_STOCK_STATES = [
  "IN_STOCK",
  "LOW_STOCK",
  "OUT_OF_STOCK",
] as const;
export type CartStockState = (typeof CART_STOCK_STATES)[number];

export interface CartItem {
  id: string;
  cartId: string;
  productId: string;
  variantId: string;
  quantity: number;
  unitPriceSnapshot: number;
  unitPriceCurrent: number;
  priceChanged: boolean;
  lineTotal: number;
  /** GST portion for the whole line (unit tax × quantity). Null if no tax. */
  taxAmount?: number | null;
  availableQuantity: number;
  stockState: CartStockState;
  /**
   * Custom-Wall payload (JSON string) for a print-on-demand line:
   * { imageId, imageUrl, fileName, imageWidth, imageHeight, sizeLabel, notes }.
   * Null for ordinary catalog lines. Parse with `parseCartCustomization`.
   */
  customization?: string | null;
  createdAt: string;
  updatedAt: string;
  product?: Product | null;
  variant?: ProductVariant | null;
}

/** Parsed shape of `CartItem.customization` / `OrderItem.customization`. */
export interface LineCustomization {
  imageId: string;
  imageUrl: string;
  fileName?: string | null;
  imageWidth?: number;
  imageHeight?: number;
  sizeLabel?: string;
  notes?: string | null;
  /** Printed crop rectangle, normalized to the original image (0..1). */
  crop?: { x: number; y: number; w: number; h: number } | null;
  /** Printed pixel dimensions (the cropped region). */
  printWidth?: number;
  printHeight?: number;
}

export function parseCartCustomization(
  json: string | null | undefined,
): LineCustomization | null {
  if (!json) return null;
  try {
    const parsed = JSON.parse(json) as LineCustomization;
    return parsed && parsed.imageUrl ? parsed : null;
  } catch {
    return null;
  }
}

export interface Cart {
  id: string;
  /** Null for a guest cart (keyed by the httpOnly guestCartToken cookie). */
  customerId?: string | null;
  createdAt: string;
  updatedAt: string;
  items: CartItem[];
  itemCount: number;
  subtotal: number;
  needsReview: boolean;
}

export interface AddToCartInput {
  variantId: string;
  quantity?: number;
  /** Custom-Wall: the buyer's uploaded artwork (imageId) + optional print note. */
  customization?: {
    imageId: string;
    notes?: string;
    /** Printed crop rectangle, normalized to the original image (0..1). */
    crop?: { x: number; y: number; w: number; h: number };
  };
}

export interface UpdateCartItemQtyInput {
  variantId: string;
  quantity: number;
}

export interface RemoveCartItemInput {
  variantId: string;
}

export interface MyCartData {
  myCart: Cart;
}

export interface MyCartItemCountData {
  myCartItemCount: number;
}

export interface AddToCartData {
  addToCart: Cart;
}

export interface UpdateCartItemQtyData {
  updateCartItemQty: Cart;
}

export interface RemoveFromCartData {
  removeFromCart: Cart;
}

export interface ClearCartData {
  clearCart: Cart;
}

/* ---- Guest cart ---- */

export interface GuestCartData {
  guestCart: Cart | null;
}

export interface AddToGuestCartData {
  addToGuestCart: Cart;
}

export interface UpdateGuestCartItemQtyData {
  updateGuestCartItemQty: Cart;
}

export interface RemoveFromGuestCartData {
  removeFromGuestCart: Cart;
}

export interface MergeGuestCartData {
  mergeGuestCart: Cart;
}

/* ---- Advisory validation ---- */

export const CART_WARNING_CODES = [
  "OUT_OF_STOCK",
  "REDUCED_QUANTITY",
  "PRICE_CHANGED",
  "UNAVAILABLE",
] as const;
export type CartWarningCode = (typeof CART_WARNING_CODES)[number];

export interface CartWarning {
  variantId: string;
  code: CartWarningCode;
  message: string;
  availableQuantity?: number | null;
  suggestedQuantity?: number | null;
  oldPrice?: number | null;
  newPrice?: number | null;
}

export interface CartValidationResult {
  valid: boolean;
  warnings: CartWarning[];
}

export interface ValidateCartData {
  validateCart: CartValidationResult;
}
