/**
 * Store + Warehouse TypeScript types — mirror backend GraphQL entities.
 */

export const STORE_STATUSES = [
  "DRAFT",
  "ACTIVE",
  "INACTIVE",
  "SUSPENDED",
  "UNDER_REVIEW",
] as const;
export type StoreStatus = (typeof STORE_STATUSES)[number];

export const STORE_STATUS_LABEL: Record<StoreStatus, string> = {
  DRAFT: "Draft",
  ACTIVE: "Active",
  INACTIVE: "Inactive",
  SUSPENDED: "Suspended",
  UNDER_REVIEW: "Under review",
};

// ---------------------------------------------------------------------------
// Warehouse
// ---------------------------------------------------------------------------
export interface Warehouse {
  id: string;
  storeId: string;
  name: string;
  code: string;
  addressLine1: string;
  addressLine2?: string | null;
  city: string;
  state: string;
  postalCode: string;
  countryCode: string;
  phone?: string | null;
  isDefault: boolean;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  deletedAt?: string | null;
}

export interface WarehouseFormValues {
  name: string;
  code: string;
  addressLine1: string;
  addressLine2: string;
  city: string;
  state: string;
  postalCode: string;
  countryCode: string;
  phone: string;
  isDefault: boolean;
}

// ---------------------------------------------------------------------------
// Store
// ---------------------------------------------------------------------------
export interface Store {
  id: string;
  sellerId: string;
  name: string;
  slug: string;
  description?: string | null;
  logoUrl?: string | null;
  bannerUrl?: string | null;
  customDomain?: string | null;
  subdomain?: string | null;
  currencyCode: string;
  timezone: string;
  locale: string;
  supportEmail?: string | null;
  supportPhone?: string | null;
  status: StoreStatus;
  isFeatured: boolean;
  createdAt: string;
  updatedAt: string;
  deletedAt?: string | null;
  warehouses?: Warehouse[];
}

export interface StoreFormValues {
  name: string;
  slug: string;
  description: string;
  logoUrl: string;
  bannerUrl: string;
  currencyCode: string;
  timezone: string;
  locale: string;
  supportEmail: string;
  supportPhone: string;
}

// ---------------------------------------------------------------------------
// GraphQL response shapes
// ---------------------------------------------------------------------------
export interface GetMyStoresData {
  myStores: Store[];
}

export interface GetMyStoreData {
  myStore: Store | null;
}

export interface CreateMyStoreData {
  createMyStore: Store;
}

export interface UpdateMyStoreData {
  updateMyStore: Store;
}

export interface SubmitMyStoreForReviewData {
  submitMyStoreForReview: Store;
}

export interface RemoveMyStoreData {
  removeMyStore: Store;
}

export interface GetStoresData {
  stores: Store[];
}

export interface SetStoreStatusData {
  setStoreStatus: Store;
}

export interface AdminRemoveStoreData {
  adminRemoveStore: Store;
}

export interface CreateMyWarehouseData {
  createMyWarehouse: Warehouse;
}

export interface UpdateMyWarehouseData {
  updateMyWarehouse: Warehouse;
}

export interface RemoveMyWarehouseData {
  removeMyWarehouse: Warehouse;
}
