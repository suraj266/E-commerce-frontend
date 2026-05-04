/**
 * Tax GraphQL operations.
 *
 * `taxes` is publicly readable (used by the seller product form's radio
 * group). `adminTaxes` / `adminTaxesPaginated` are permission-gated and
 * include inactive rows for the /admin/taxes table. Mutations are gated
 * by the corresponding tax:* permissions.
 */

import { gql } from "@apollo/client";

export const TAX_FIELDS = gql`
  fragment TaxFields on Tax {
    id
    name
    rate
    description
    isActive
    displayOrder
    createdAt
    updatedAt
  }
`;

// ---------------------------------------------------------------------------
// Queries
// ---------------------------------------------------------------------------

/** Active taxes only — for seller product form radio group. */
export const GET_TAXES = gql`
  ${TAX_FIELDS}
  query GetTaxes {
    taxes {
      ...TaxFields
    }
  }
`;

/** All taxes (incl. inactive) — admin list. */
export const GET_ADMIN_TAXES = gql`
  ${TAX_FIELDS}
  query GetAdminTaxes {
    adminTaxes {
      ...TaxFields
    }
  }
`;

/** Paginated + searchable admin feed. */
export const GET_ADMIN_TAXES_PAGINATED = gql`
  ${TAX_FIELDS}
  query GetAdminTaxesPaginated(
    $page: Int
    $pageSize: Int
    $search: String
  ) {
    adminTaxesPaginated(page: $page, pageSize: $pageSize, search: $search) {
      items {
        ...TaxFields
      }
      totalCount
      totalPages
      currentPage
      pageSize
    }
  }
`;

export const GET_TAX = gql`
  ${TAX_FIELDS}
  query GetTax($id: ID!) {
    tax(id: $id) {
      ...TaxFields
    }
  }
`;

// ---------------------------------------------------------------------------
// Mutations
// ---------------------------------------------------------------------------

export const CREATE_TAX = gql`
  ${TAX_FIELDS}
  mutation CreateTax($createTaxInput: CreateTaxInput!) {
    createTax(createTaxInput: $createTaxInput) {
      ...TaxFields
    }
  }
`;

export const UPDATE_TAX = gql`
  ${TAX_FIELDS}
  mutation UpdateTax($updateTaxInput: UpdateTaxInput!) {
    updateTax(updateTaxInput: $updateTaxInput) {
      ...TaxFields
    }
  }
`;

export const REMOVE_TAX = gql`
  ${TAX_FIELDS}
  mutation RemoveTax($id: ID!) {
    removeTax(id: $id) {
      ...TaxFields
    }
  }
`;
