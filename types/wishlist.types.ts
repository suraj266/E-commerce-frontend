import type { Product } from "./product.types";

export interface WishlistItem {
  id: string;
  wishlistId: string;
  productId: string;
  variantId?: string | null;
  createdAt: string;
  product?: Product | null;
}

export interface Wishlist {
  id: string;
  customerId: string;
  name: string;
  isPublic: boolean;
  isDefault: boolean;
  createdAt: string;
  updatedAt: string;
  items: WishlistItem[];
  itemCount: number;
}

export interface ToggleWishlistInput {
  productId: string;
  variantId?: string | null;
}

export interface MyWishlistData {
  myWishlist: Wishlist;
}

export interface MyWishlistProductIdsData {
  myWishlistProductIds: string[];
}

export interface AddToWishlistData {
  addToWishlist: Wishlist;
}

export interface RemoveFromWishlistData {
  removeFromWishlist: Wishlist;
}

export interface ClearWishlistData {
  clearWishlist: Wishlist;
}
