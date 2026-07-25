// Category-related GraphQL queries and mutations.

import { gql } from "@apollo/client";

// ---------------------------------------------------------------------------
// Fragment: Shared fields — avoids repeating the same fields in every op
// ---------------------------------------------------------------------------
export const CATEGORY_FIELDS = gql`
  fragment CategoryFields on Category {
    id
    name
    slug
    description
    parentId
    imageUrl
    iconUrl
    displayOrder
    isActive
    createdAt
    updatedAt
  }
`;

// ---------------------------------------------------------------------------
// Query: Get all categories (publicly readable — no auth header needed)
// ---------------------------------------------------------------------------
export const GET_CATEGORIES = gql`
  ${CATEGORY_FIELDS}
  query GetCategories {
    categories {
      ...CategoryFields
    }
  }
`;

// ---------------------------------------------------------------------------
// Query: Shop filter sidebar — only categories with active products + count
// ---------------------------------------------------------------------------
export const GET_SHOP_FILTER_CATEGORIES = gql`
  query GetShopFilterCategories {
    shopFilterCategories {
      id
      name
      slug
      displayOrder
      productCount
    }
  }
`;


// ---------------------------------------------------------------------------
// Query: Paginated + searchable category list (admin table only)
// ---------------------------------------------------------------------------
export const GET_ADMIN_CATEGORIES_PAGINATED = gql`
  ${CATEGORY_FIELDS}
  query GetAdminCategoriesPaginated(
    $page: Int
    $pageSize: Int
    $search: String
  ) {
    adminCategoriesPaginated(page: $page, pageSize: $pageSize, search: $search) {
      items {
        ...CategoryFields
      }
      totalCount
      totalPages
      currentPage
      pageSize
    }
  }
`;

// ---------------------------------------------------------------------------
// Query: Children of a parent (or roots when parentId is null) — powers
// the cascading category picker on the product form.
// ---------------------------------------------------------------------------
export const GET_CATEGORY_CHILDREN = gql`
  query GetCategoryChildren($parentId: ID, $search: String, $limit: Int) {
    categoryChildren(parentId: $parentId, search: $search, limit: $limit) {
      id
      name
      slug
      parentId
      hasChildren
    }
  }
`;

// ---------------------------------------------------------------------------
// Query: Ancestor chain for a category — used to pre-populate the cascading
// picker when editing a product that already has a category set.
// ---------------------------------------------------------------------------
export const GET_CATEGORY_ANCESTORS = gql`
  query GetCategoryAncestors($id: ID!) {
    categoryAncestors(id: $id) {
      id
      name
      slug
      parentId
      hasChildren
    }
  }
`;

export const GET_CATEGORY = gql`
  ${CATEGORY_FIELDS}
  query GetCategory($id: ID!) {
    category(id: $id) {
      ...CategoryFields
    }
  }
`;

// ---------------------------------------------------------------------------
// Query: Public category-by-slug — backs `/category/[slug]` storefront page.
// Returns the category + its immediate active children for sub-category chips.
// ---------------------------------------------------------------------------
export const GET_PUBLIC_CATEGORY_BY_SLUG = gql`
  ${CATEGORY_FIELDS}
  query GetPublicCategoryBySlug($slug: String!) {
    publicCategoryBySlug(slug: $slug) {
      ...CategoryFields
      children {
        ...CategoryFields
      }
    }
  }
`;

// Requires: category:create permission + Authorization header
export const CREATE_CATEGORY = gql`
  ${CATEGORY_FIELDS}
  mutation CreateCategory($createCategoryInput: CreateCategoryInput!) {
    createCategory(createCategoryInput: $createCategoryInput) {
      ...CategoryFields
    }
  }
`;

// Requires: category:update permission + Authorization header
export const UPDATE_CATEGORY = gql`
  ${CATEGORY_FIELDS}
  mutation UpdateCategory($updateCategoryInput: UpdateCategoryInput!) {
    updateCategory(updateCategoryInput: $updateCategoryInput) {
      ...CategoryFields
    }
  }
`;

// Requires: category:delete permission + Authorization header
export const REMOVE_CATEGORY = gql`
  ${CATEGORY_FIELDS}
  mutation RemoveCategory($id: ID!) {
    removeCategory(id: $id) {
      ...CategoryFields
    }
  }
`;

// Requires: category:update permission + Authorization header
export const UPDATE_CATEGORY_TREE = gql`
  mutation UpdateCategoryTree($input: UpdateCategoryTreeInput!) {
    updateCategoryTree(updateCategoryTreeInput: $input)
  }
`;
