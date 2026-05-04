/**
 * =============================================================================
 * Category GraphQL Operations
 * =============================================================================
 *
 * Centralized file for all category-related GraphQL queries and mutations.
 * Import these into any component that needs category data.
 *
 * HOW TO USE:
 * ```tsx
 * import { GET_CATEGORIES, CREATE_CATEGORY } from '@/lib/graphql/categories'
 * const { data } = useQuery(GET_CATEGORIES)
 * const [createCategory] = useMutation(CREATE_CATEGORY)
 * ```
 *
 * REUSABILITY:
 * These operations can be used in Admin, Seller, and Customer panels.
 * =============================================================================
 */

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

// ---------------------------------------------------------------------------
// Query: Get single category by ID
// ---------------------------------------------------------------------------
export const GET_CATEGORY = gql`
  ${CATEGORY_FIELDS}
  query GetCategory($id: ID!) {
    category(id: $id) {
      ...CategoryFields
    }
  }
`;

// ---------------------------------------------------------------------------
// Mutation: Create new category
// Requires: category:create permission + Authorization header
// ---------------------------------------------------------------------------
export const CREATE_CATEGORY = gql`
  ${CATEGORY_FIELDS}
  mutation CreateCategory($createCategoryInput: CreateCategoryInput!) {
    createCategory(createCategoryInput: $createCategoryInput) {
      ...CategoryFields
    }
  }
`;

// ---------------------------------------------------------------------------
// Mutation: Update existing category
// Requires: category:update permission + Authorization header
// ---------------------------------------------------------------------------
export const UPDATE_CATEGORY = gql`
  ${CATEGORY_FIELDS}
  mutation UpdateCategory($updateCategoryInput: UpdateCategoryInput!) {
    updateCategory(updateCategoryInput: $updateCategoryInput) {
      ...CategoryFields
    }
  }
`;

// ---------------------------------------------------------------------------
// Mutation: Soft-delete a category
// Requires: category:delete permission + Authorization header
// ---------------------------------------------------------------------------
export const REMOVE_CATEGORY = gql`
  ${CATEGORY_FIELDS}
  mutation RemoveCategory($id: ID!) {
    removeCategory(id: $id) {
      ...CategoryFields
    }
  }
`;

// ---------------------------------------------------------------------------
// Mutation: Update category tree structure
// Requires: category:update permission + Authorization header
// ---------------------------------------------------------------------------
export const UPDATE_CATEGORY_TREE = gql`
  mutation UpdateCategoryTree($input: UpdateCategoryTreeInput!) {
    updateCategoryTree(updateCategoryTreeInput: $input)
  }
`;
