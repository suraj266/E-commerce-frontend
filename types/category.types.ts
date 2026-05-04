/**
 * =============================================================================
 * Category TypeScript Types
 * =============================================================================
 *
 * Shared types for Category data across the entire application.
 * These mirror the backend GraphQL schema exactly.
 *
 * REUSABILITY:
 * Used in Admin, Seller, and Customer panels wherever categories appear.
 * =============================================================================
 */

// ---------------------------------------------------------------------------
// Core Category type (matches backend Category entity)
// ---------------------------------------------------------------------------
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
