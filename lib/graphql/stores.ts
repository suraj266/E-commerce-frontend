/**
 * Store + Warehouse GraphQL operations.
 *
 * Self-managed (seller): myStores, createMyStore, updateMyStore, ...
 * Admin: stores, setStoreStatus, adminRemoveStore
 * Public: publicStore(slug)
 */

import { gql } from "@apollo/client";

export const WAREHOUSE_FIELDS = gql`
  fragment WarehouseFields on Warehouse {
    id
    storeId
    name
    code
    addressLine1
    addressLine2
    city
    state
    postalCode
    countryCode
    phone
    isDefault
    isActive
    createdAt
    updatedAt
  }
`;

export const STORE_FIELDS = gql`
  ${WAREHOUSE_FIELDS}
  fragment StoreFields on Store {
    id
    sellerId
    name
    slug
    description
    logoUrl
    bannerUrl
    currencyCode
    timezone
    locale
    supportEmail
    supportPhone
    status
    isFeatured
    createdAt
    updatedAt
    warehouses {
      ...WarehouseFields
    }
  }
`;

// ---------------------------------------------------------------------------
// Self (seller)
// ---------------------------------------------------------------------------
export const GET_MY_STORES = gql`
  ${STORE_FIELDS}
  query GetMyStores {
    myStores {
      ...StoreFields
    }
  }
`;

export const GET_MY_STORE = gql`
  ${STORE_FIELDS}
  query GetMyStore($id: ID!) {
    myStore(id: $id) {
      ...StoreFields
    }
  }
`;

export const CREATE_MY_STORE = gql`
  ${STORE_FIELDS}
  mutation CreateMyStore($createStoreInput: CreateStoreInput!) {
    createMyStore(createStoreInput: $createStoreInput) {
      ...StoreFields
    }
  }
`;

export const UPDATE_MY_STORE = gql`
  ${STORE_FIELDS}
  mutation UpdateMyStore($updateStoreInput: UpdateStoreInput!) {
    updateMyStore(updateStoreInput: $updateStoreInput) {
      ...StoreFields
    }
  }
`;

export const SUBMIT_MY_STORE_FOR_REVIEW = gql`
  ${STORE_FIELDS}
  mutation SubmitMyStoreForReview($id: ID!) {
    submitMyStoreForReview(id: $id) {
      ...StoreFields
    }
  }
`;

export const REMOVE_MY_STORE = gql`
  ${STORE_FIELDS}
  mutation RemoveMyStore($id: ID!) {
    removeMyStore(id: $id) {
      ...StoreFields
    }
  }
`;

// ---------------------------------------------------------------------------
// Warehouse — self
// ---------------------------------------------------------------------------
export const CREATE_MY_WAREHOUSE = gql`
  ${WAREHOUSE_FIELDS}
  mutation CreateMyWarehouse($createWarehouseInput: CreateWarehouseInput!) {
    createMyWarehouse(createWarehouseInput: $createWarehouseInput) {
      ...WarehouseFields
    }
  }
`;

export const UPDATE_MY_WAREHOUSE = gql`
  ${WAREHOUSE_FIELDS}
  mutation UpdateMyWarehouse($updateWarehouseInput: UpdateWarehouseInput!) {
    updateMyWarehouse(updateWarehouseInput: $updateWarehouseInput) {
      ...WarehouseFields
    }
  }
`;

export const REMOVE_MY_WAREHOUSE = gql`
  ${WAREHOUSE_FIELDS}
  mutation RemoveMyWarehouse($id: ID!) {
    removeMyWarehouse(id: $id) {
      ...WarehouseFields
    }
  }
`;

// ---------------------------------------------------------------------------
// Admin
// ---------------------------------------------------------------------------
export const GET_STORES = gql`
  ${STORE_FIELDS}
  query GetStores($status: StoreStatus) {
    stores(status: $status) {
      ...StoreFields
    }
  }
`;

export const GET_STORE = gql`
  ${STORE_FIELDS}
  query GetStore($id: ID!) {
    store(id: $id) {
      ...StoreFields
    }
  }
`;

export const SET_STORE_STATUS = gql`
  ${STORE_FIELDS}
  mutation SetStoreStatus($setStoreStatusInput: SetStoreStatusInput!) {
    setStoreStatus(setStoreStatusInput: $setStoreStatusInput) {
      ...StoreFields
    }
  }
`;

/**
 * Admin creates a Store under any seller. The seller must exist and be
 * VERIFIED. Store starts ACTIVE with a default placeholder warehouse.
 */
export const ADMIN_CREATE_STORE = gql`
  ${STORE_FIELDS}
  mutation AdminCreateStore($input: AdminCreateStoreInput!) {
    adminCreateStore(input: $input) {
      ...StoreFields
    }
  }
`;

/**
 * Admin edits any store. Same partial-update shape as the seller self-edit;
 * slug uniqueness + currency immutability rules still apply.
 */
export const ADMIN_UPDATE_STORE = gql`
  ${STORE_FIELDS}
  mutation AdminUpdateStore($input: UpdateStoreInput!) {
    adminUpdateStore(input: $input) {
      ...StoreFields
    }
  }
`;

export const ADMIN_REMOVE_STORE = gql`
  ${STORE_FIELDS}
  mutation AdminRemoveStore($id: ID!) {
    adminRemoveStore(id: $id) {
      ...StoreFields
    }
  }
`;

// ---------------------------------------------------------------------------
// Public storefront
// ---------------------------------------------------------------------------
export const GET_PUBLIC_STORE = gql`
  ${STORE_FIELDS}
  query GetPublicStore($slug: String!) {
    publicStore(slug: $slug) {
      ...StoreFields
    }
  }
`;
