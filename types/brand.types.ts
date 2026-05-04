/**
 * Brand types — mirror backend GraphQL Brand entity.
 *
 * Brand is a centrally-managed registry. Sellers pick from this list when
 * creating products (Sprint 2.4d). Admin manages the registry.
 */

export const BRAND_STATUSES = ["ACTIVE", "INACTIVE"] as const;
export type BrandStatus = (typeof BRAND_STATUSES)[number];

export const BRAND_STATUS_LABEL: Record<BrandStatus, string> = {
  ACTIVE: "Active",
  INACTIVE: "Inactive",
};

export interface Brand {
  id: string;
  name: string;
  slug: string;
  description?: string | null;
  logoUrl?: string | null;
  bannerUrl?: string | null;
  websiteUrl?: string | null;
  countryCode?: string | null;
  foundedYear?: number | null;
  status: BrandStatus;
  isFeatured: boolean;
  createdAt: string;
  updatedAt: string;
  deletedAt?: string | null;
}

export interface BrandFormValues {
  name: string;
  slug: string;
  description: string;
  logoUrl: string;
  bannerUrl: string;
  websiteUrl: string;
  countryCode: string;
  foundedYear: number | "";
  isFeatured: boolean;
}

// ---------------------------------------------------------------------------
// GraphQL response shapes
// ---------------------------------------------------------------------------
export interface GetAdminBrandsData {
  adminBrands: Brand[];
}

export interface GetBrandsData {
  brands: Brand[];
}

export interface GetBrandData {
  brand: Brand;
}

export interface CreateBrandData {
  createBrand: Brand;
}

export interface UpdateBrandData {
  updateBrand: Brand;
}

export interface SetBrandStatusData {
  setBrandStatus: Brand;
}

export interface RemoveBrandData {
  removeBrand: Brand;
}
