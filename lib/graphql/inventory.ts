/**
 * Inventory GraphQL operations.
 *
 * Sprint 2.6 M1 scope: read APIs + manual adjust + reorder point.
 */

import { gql } from "@apollo/client";

export const INVENTORY_FIELDS = gql`
  fragment InventoryFields on Inventory {
    id
    variantId
    warehouseId
    quantityAvailable
    quantityReserved
    quantityOnHand
    reorderPoint
    reorderQuantity
    lastCountedAt
    createdAt
    updatedAt
    stockState
    warehouse {
      id
      name
      code
      isDefault
      storeId
    }
    variant {
      id
      productId
      sku
      imageUrl
      status
      attributes {
        attributeId
        attributeValueId
        attributeName
        attributeSlug
        value
        valueSlug
      }
    }
    product {
      id
      name
      slug
      storeId
    }
  }
`;

export const INVENTORY_MOVEMENT_FIELDS = gql`
  fragment InventoryMovementFields on InventoryMovement {
    id
    inventoryId
    variantId
    warehouseId
    movementType
    quantityChange
    quantityBefore
    quantityAfter
    referenceType
    referenceId
    notes
    createdById
    createdAt
  }
`;

// ---------------------------------------------------------------------------
// Queries
// ---------------------------------------------------------------------------

export const GET_MY_INVENTORY = gql`
  ${INVENTORY_FIELDS}
  query GetMyInventory(
    $storeId: ID
    $warehouseId: ID
    $productId: ID
    $lowStockOnly: Boolean
    $search: String
  ) {
    myInventory(
      storeId: $storeId
      warehouseId: $warehouseId
      productId: $productId
      lowStockOnly: $lowStockOnly
      search: $search
    ) {
      ...InventoryFields
    }
  }
`;

export const GET_MY_INVENTORY_BY_VARIANT = gql`
  ${INVENTORY_FIELDS}
  query GetMyInventoryByVariant($variantId: ID!, $warehouseId: ID) {
    myInventoryByVariant(variantId: $variantId, warehouseId: $warehouseId) {
      ...InventoryFields
    }
  }
`;

export const GET_MY_INVENTORY_MOVEMENTS = gql`
  ${INVENTORY_MOVEMENT_FIELDS}
  query GetMyInventoryMovements(
    $variantId: ID
    $warehouseId: ID
    $limit: Int
  ) {
    myInventoryMovements(
      variantId: $variantId
      warehouseId: $warehouseId
      limit: $limit
    ) {
      ...InventoryMovementFields
    }
  }
`;

// ---------------------------------------------------------------------------
// Admin
// ---------------------------------------------------------------------------

export const GET_ADMIN_INVENTORY_BY_PRODUCT = gql`
  ${INVENTORY_FIELDS}
  query GetAdminInventoryByProduct($productId: ID!) {
    adminInventoryByProduct(productId: $productId) {
      ...InventoryFields
    }
  }
`;

// ---------------------------------------------------------------------------
// Mutations
// ---------------------------------------------------------------------------

export const ADJUST_MY_INVENTORY = gql`
  ${INVENTORY_FIELDS}
  mutation AdjustMyInventory($adjustInventoryInput: AdjustInventoryInput!) {
    adjustMyInventory(adjustInventoryInput: $adjustInventoryInput) {
      ...InventoryFields
    }
  }
`;

export const SET_MY_REORDER_POINT = gql`
  ${INVENTORY_FIELDS}
  mutation SetMyReorderPoint($setReorderPointInput: SetReorderPointInput!) {
    setMyReorderPoint(setReorderPointInput: $setReorderPointInput) {
      ...InventoryFields
    }
  }
`;
