/**
 * Product types — mirror backend GraphQL Product entity.
 *
 * Phase A: SIMPLE products only. Pricing fields (price, sku) are flat on
 * the Product type but actually live on the auto-created default variant
 * under the hood. Frontend treats them as if on Product.
 */

import type { Brand } from "./brand.types";
import type { Category } from "./category.types";
import type { Tag } from "./tag.types";
import type { Tax } from "./tax.types";
import type { ProductAttributeValue } from "./attribute.types";

export const PRODUCT_STATUSES = [
  "DRAFT",
  "ACTIVE",
  "INACTIVE",
  "ARCHIVED",
] as const;
export type ProductStatus = (typeof PRODUCT_STATUSES)[number];

export const PRODUCT_STATUS_LABEL: Record<ProductStatus, string> = {
  DRAFT: "Draft",
  ACTIVE: "Active",
  INACTIVE: "Inactive",
  ARCHIVED: "Archived",
};

export const PRODUCT_TYPES = ["SIMPLE", "VARIABLE"] as const;
export type ProductType = (typeof PRODUCT_TYPES)[number];

export const PRODUCT_SORT_ORDERS = ["NEWEST", "PRICE_ASC", "PRICE_DESC"] as const;
export type ProductSortOrder = (typeof PRODUCT_SORT_ORDERS)[number];

// ---------------------------------------------------------------------------
// Variant types — Phase B
// ---------------------------------------------------------------------------
export const VARIANT_STATUSES = ["ACTIVE", "INACTIVE", "OUT_OF_STOCK"] as const;
export type VariantStatus = (typeof VARIANT_STATUSES)[number];

export const VARIANT_STATUS_LABEL: Record<VariantStatus, string> = {
  ACTIVE: "Active",
  INACTIVE: "Inactive",
  OUT_OF_STOCK: "Out of stock",
};

export interface ProductVariantAttribute {
  attributeId: string;
  attributeValueId: string;
  attributeName: string;
  attributeSlug: string;
  value: string;
  valueSlug: string;
}

export interface ProductVariant {
  id: string;
  productId: string;
  sku: string;
  name?: string | null;
  price: number;
  compareAtPrice?: number | null;
  costPrice?: number | null;
  /** Price including tax (price + price × taxRate/100). Null if no tax assigned. */
  priceWithTax?: number | null;
  barcode?: string | null;
  weight?: number | null;
  length?: number | null;
  width?: number | null;
  height?: number | null;
  imageUrl?: string | null;
  status: VariantStatus;
  createdAt: string;
  updatedAt: string;
  deletedAt?: string | null;
  attributes: ProductVariantAttribute[];
  /** Populated only by public PDP queries (see GET_PUBLIC_PRODUCT). */
  availableQuantity?: number | null;
  /** Populated only by public PDP queries — derived from inventory. */
  stockState?: "IN_STOCK" | "LOW_STOCK" | "OUT_OF_STOCK" | null;
}

export interface VariantAxis {
  attributeId: string;
  attributeName: string;
  attributeSlug: string;
  values: ProductAttributeValue[];
}

export const PRODUCT_SORT_LABEL: Record<ProductSortOrder, string> = {
  NEWEST: "Newest first",
  PRICE_ASC: "Price: low → high",
  PRICE_DESC: "Price: high → low",
};

export interface ProductImage {
  id: string;
  productId: string;
  imageUrl: string;
  altText?: string | null;
  displayOrder: number;
  isPrimary: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Product {
  id: string;
  storeId: string;
  categoryId?: string | null;
  brandId?: string | null;
  taxId?: string | null;
  name: string;
  slug: string;
  description?: string | null;
  shortDescription?: string | null;
  productType: ProductType;
  status: ProductStatus;
  isFeatured: boolean;
  isDigital: boolean;

  // Pricing (computed from default variant)
  price?: number | null;
  compareAtPrice?: number | null;
  costPrice?: number | null;
  /** Price including tax. Computed by backend. */
  priceWithTax?: number | null;
  sku?: string | null;

  // Logistics
  weight?: number | null;
  length?: number | null;
  width?: number | null;
  height?: number | null;

  // Tax / Compliance
  /** HSN code — 4/6/8 digits. Required for GST invoicing. */
  hsnCode?: string | null;

  // SEO
  seoTitle?: string | null;
  seoDescription?: string | null;
  seoKeywords: string[];

  /** JSON-encoded array — frontend parses to render */
  specifications: string;

  createdAt: string;
  updatedAt: string;
  deletedAt?: string | null;

  // Relations
  images?: ProductImage[];
  brand?: Brand | null;
  category?: Category | null;
  tax?: Pick<Tax, "id" | "name" | "rate"> | null;
  tags?: Tag[];
  /** Populated by PDP query; SIMPLE products have 1 default variant. */
  variants?: ProductVariant[];
}

// ---------------------------------------------------------------------------
// Specification value types — parsed shape after JSON.parse(specifications)
// ---------------------------------------------------------------------------
export interface SpecificationItem {
  label: string;
  value: string;
  order: number;
}

export interface SpecificationGroup {
  name: string;
  order: number;
  items: SpecificationItem[];
}

export type Specifications = SpecificationGroup[];

export function parseSpecifications(json: string): Specifications {
  try {
    const parsed = JSON.parse(json);
    if (!Array.isArray(parsed)) return [];
    return parsed;
  } catch {
    return [];
  }
}

export function serializeSpecifications(groups: Specifications): string {
  return JSON.stringify(groups);
}

// ---------------------------------------------------------------------------
// GraphQL response shapes
// ---------------------------------------------------------------------------
export interface GetMyProductsData {
  myProducts: Product[];
}

export interface GetMyProductData {
  myProduct: Product;
}

export interface GetAdminProductsData {
  adminProducts: Product[];
}

export interface GetAdminProductData {
  adminProduct: Product;
}

export interface GetPublicProductData {
  publicProduct: Product;
}

export interface GetPublicProductsData {
  publicProducts: Product[];
}

export interface PaginatedProducts {
  items: Product[];
  totalCount: number;
  totalPages: number;
  currentPage: number;
  pageSize: number;
}

export interface GetPaginatedPublicProductsData {
  paginatedPublicProducts: PaginatedProducts;
}

/** Lightweight product row for header search autocomplete. */
export interface SearchSuggestion {
  id: string;
  name: string;
  slug: string;
  price: number;
  imageUrl: string | null;
  brandName: string | null;
}

/** Category match in the header search dropdown. */
export interface CategorySuggestion {
  id: string;
  name: string;
  slug: string;
  productCount: number;
}

/** Composite payload returned by `searchSuggestions`. */
export interface SearchSuggestionsResult {
  categories: CategorySuggestion[];
  products: SearchSuggestion[];
}

export interface SearchSuggestionsData {
  searchSuggestions: SearchSuggestionsResult;
}

// ---------------------------------------------------------------------------
// Variant GraphQL response shapes
// ---------------------------------------------------------------------------
export interface GetMyProductVariantsData {
  myProductVariants: ProductVariant[];
}

export interface GetMyProductVariantAxesData {
  myProductVariantAxes: VariantAxis[];
}

export interface SetMyProductVariantAxesData {
  setMyProductVariantAxes: VariantAxis[];
}

export interface GenerateMyProductVariantMatrixData {
  generateMyProductVariantMatrix: ProductVariant[];
}

export interface AddMyProductVariantData {
  addMyProductVariant: ProductVariant;
}

export interface UpdateMyProductVariantData {
  updateMyProductVariant: ProductVariant;
}

export interface RemoveMyProductVariantData {
  removeMyProductVariant: ProductVariant;
}

export interface BulkUpdateMyProductVariantsData {
  bulkUpdateMyProductVariants: number;
}

export interface CreateMyProductData {
  createMyProduct: Product;
}

export interface UpdateMyProductData {
  updateMyProduct: Product;
}

export interface SetMyProductStatusData {
  setMyProductStatus: Product;
}

export interface RemoveMyProductData {
  removeMyProduct: Product;
}

export interface AdminSetProductStatusData {
  adminSetProductStatus: Product;
}

export interface AddMyProductImageData {
  addMyProductImage: ProductImage;
}

export interface UpdateMyProductImageData {
  updateMyProductImage: ProductImage;
}

export interface RemoveMyProductImageData {
  removeMyProductImage: ProductImage;
}

export interface ReorderMyProductImagesData {
  reorderMyProductImages: boolean;
}
