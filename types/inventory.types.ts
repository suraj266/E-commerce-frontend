/**
 * Inventory types — mirror backend GraphQL Inventory + InventoryMovement.
 *
 * `stockState` is computed server-side from quantityAvailable + reorderPoint
 * so the UI never has to recompute the threshold.
 */

import type { Product } from "./product.types";

export const STOCK_STATES = ["IN_STOCK", "LOW_STOCK", "OUT_OF_STOCK"] as const;
export type StockState = (typeof STOCK_STATES)[number];

export const STOCK_STATE_LABEL: Record<StockState, string> = {
  IN_STOCK: "In stock",
  LOW_STOCK: "Low stock",
  OUT_OF_STOCK: "Out of stock",
};

/**
 * Wire format = GraphQL enum NAMES (uppercase). NestJS exposes the TS enum
 * keys as the GraphQL enum values, so anything sent on the wire must match
 * these. The DB still stores the lowercase string form (mapped server-side).
 */
export const INVENTORY_MOVEMENT_TYPES = [
  "PURCHASE",
  "SALE",
  "RETURN",
  "ADJUSTMENT",
  "TRANSFER",
  "DAMAGE",
  "EXPIRED",
] as const;
export type InventoryMovementType = (typeof INVENTORY_MOVEMENT_TYPES)[number];

export const MOVEMENT_TYPE_LABEL: Record<InventoryMovementType, string> = {
  PURCHASE: "Stock received",
  SALE: "Sale",
  RETURN: "Return",
  ADJUSTMENT: "Recount / adjustment",
  TRANSFER: "Transfer",
  DAMAGE: "Damaged",
  EXPIRED: "Expired",
};

/**
 * Movement types the seller can use manually. The rest fire automatically
 * from the order pipeline (Sprint 2.8).
 */
export const MANUAL_MOVEMENT_TYPES: InventoryMovementType[] = [
  "PURCHASE",
  "ADJUSTMENT",
  "DAMAGE",
  "EXPIRED",
  "TRANSFER",
];

export interface InventoryWarehouseRef {
  id: string;
  name: string;
  code: string;
  isDefault: boolean;
  storeId: string;
}

export interface InventoryVariantAttribute {
  attributeId: string;
  attributeValueId: string;
  attributeName: string;
  attributeSlug: string;
  value: string;
  valueSlug: string;
}

export interface InventoryVariantRef {
  id: string;
  productId: string;
  sku: string;
  imageUrl?: string | null;
  status: string;
  attributes: InventoryVariantAttribute[];
}

export interface Inventory {
  id: string;
  variantId: string;
  warehouseId: string;
  quantityAvailable: number;
  quantityReserved: number;
  quantityOnHand: number;
  reorderPoint: number;
  reorderQuantity: number;
  lastCountedAt?: string | null;
  createdAt: string;
  updatedAt: string;
  stockState: StockState;
  variant?: InventoryVariantRef | null;
  warehouse?: InventoryWarehouseRef | null;
  product?: Pick<Product, "id" | "name" | "slug" | "storeId"> | null;
}

export interface InventoryMovement {
  id: string;
  inventoryId: string;
  variantId: string;
  warehouseId: string;
  movementType: InventoryMovementType;
  quantityChange: number;
  quantityBefore: number;
  quantityAfter: number;
  referenceType?: string | null;
  referenceId?: string | null;
  notes?: string | null;
  createdById?: string | null;
  createdAt: string;
}

// ---------------------------------------------------------------------------
// GraphQL response shapes
// ---------------------------------------------------------------------------

export interface MyInventoryData {
  myInventory: Inventory[];
}

export interface MyInventoryByVariantData {
  myInventoryByVariant: Inventory | null;
}

export interface GetAdminInventoryByProductData {
  adminInventoryByProduct: Inventory[];
}

export interface MyInventoryMovementsData {
  myInventoryMovements: InventoryMovement[];
}

export interface AdjustMyInventoryData {
  adjustMyInventory: Inventory;
}

export interface SetMyReorderPointData {
  setMyReorderPoint: Inventory;
}
