// Shared Category types, mirroring the backend GraphQL schema.

// Core Category type (matches backend Category entity)
export interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string | null;
  parentId?: string | null;
  imageUrl?: string | null;
  iconUrl?: string | null;
  displayOrder: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  /** Populated only by `categoryChildren` query — undefined elsewhere. */
  hasChildren?: boolean | null;
  /** Populated only by `publicCategoryBySlug` — undefined elsewhere. */
  children?: Category[] | null;
}

export interface GetPublicCategoryBySlugData {
  publicCategoryBySlug: Category;
}

/** Subset returned by categoryChildren / categoryAncestors. */
export interface CategoryNode {
  id: string;
  name: string;
  slug: string;
  parentId?: string | null;
  hasChildren?: boolean | null;
}

export interface GetCategoryChildrenData {
  categoryChildren: CategoryNode[];
}

export interface GetCategoryAncestorsData {
  categoryAncestors: CategoryNode[];
}

// ---------------------------------------------------------------------------
// Form data for Create / Edit (does NOT include auto-generated fields)
// ---------------------------------------------------------------------------
export interface CategoryFormValues {
  name: string;
  description: string;
  parentId: string;   // Empty string means "no parent" (root category)
  imageUrl: string;
  displayOrder: number;
  isActive: boolean;
}

// ---------------------------------------------------------------------------
// GraphQL response shapes
// ---------------------------------------------------------------------------
export interface GetCategoriesData {
  categories: Category[];
}

/** Lightweight shape for the shop filter sidebar. */
export interface ShopFilterCategory {
  id: string;
  name: string;
  slug: string;
  displayOrder: number;
  productCount: number;
}

export interface GetShopFilterCategoriesData {
  shopFilterCategories: ShopFilterCategory[];
}


export interface PaginatedCategories {
  items: Category[];
  totalCount: number;
  totalPages: number;
  currentPage: number;
  pageSize: number;
}

export interface GetAdminCategoriesPaginatedData {
  adminCategoriesPaginated: PaginatedCategories;
}

export interface CreateCategoryData {
  createCategory: Category;
}

export interface UpdateCategoryData {
  updateCategory: Category;
}

export interface RemoveCategoryData {
  removeCategory: Category;
}
