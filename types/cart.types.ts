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
  createdAt: string;
  updatedAt: string;
  product?: Product | null;
  variant?: ProductVariant | null;
}

export interface Cart {
  id: string;
  customerId: string;
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
