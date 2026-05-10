/**
 * Page (CMS) GraphQL operations.
 *
 * `publicPage` is publicly readable for the storefront `/[slug]` route.
 * Admin queries/mutations are gated by `page:*` permissions.
 */

import { gql } from "@apollo/client";

export const PAGE_FIELDS = gql`
  fragment PageFields on Page {
    id
    slug
    title
    metaTitle
    metaDesc
    status
    blocks
    isSystem
    publishedAt
    createdAt
    updatedAt
  }
`;

// ---------------------------------------------------------------------------
// Queries
// ---------------------------------------------------------------------------

export const GET_PUBLIC_PAGE = gql`
  ${PAGE_FIELDS}
  query GetPublicPage($slug: String!) {
    publicPage(slug: $slug) {
      ...PageFields
    }
  }
`;

export const GET_ADMIN_PAGES = gql`
  ${PAGE_FIELDS}
  query GetAdminPages($status: PageStatus) {
    adminPages(status: $status) {
      ...PageFields
    }
  }
`;

export const GET_ADMIN_PAGES_PAGINATED = gql`
  ${PAGE_FIELDS}
  query GetAdminPagesPaginated(
    $status: PageStatus
    $page: Int
    $pageSize: Int
    $search: String
  ) {
    adminPagesPaginated(
      status: $status
      page: $page
      pageSize: $pageSize
      search: $search
    ) {
      items {
        ...PageFields
      }
      totalCount
      totalPages
      currentPage
      pageSize
    }
  }
`;

export const GET_PAGE = gql`
  ${PAGE_FIELDS}
  query GetPage($id: ID!) {
    page(id: $id) {
      ...PageFields
    }
  }
`;

// ---------------------------------------------------------------------------
// Mutations
// ---------------------------------------------------------------------------

export const CREATE_PAGE = gql`
  ${PAGE_FIELDS}
  mutation CreatePage($createPageInput: CreatePageInput!) {
    createPage(createPageInput: $createPageInput) {
      ...PageFields
    }
  }
`;

export const UPDATE_PAGE = gql`
  ${PAGE_FIELDS}
  mutation UpdatePage($updatePageInput: UpdatePageInput!) {
    updatePage(updatePageInput: $updatePageInput) {
      ...PageFields
    }
  }
`;

export const SET_PAGE_STATUS = gql`
  ${PAGE_FIELDS}
  mutation SetPageStatus($setPageStatusInput: SetPageStatusInput!) {
    setPageStatus(setPageStatusInput: $setPageStatusInput) {
      ...PageFields
    }
  }
`;

export const REMOVE_PAGE = gql`
  ${PAGE_FIELDS}
  mutation RemovePage($id: ID!) {
    removePage(id: $id) {
      ...PageFields
    }
  }
`;
