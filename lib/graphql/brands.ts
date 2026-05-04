/**
 * Brand GraphQL operations.
 *
 * - `brands` (public, default ACTIVE) — used by Product create form dropdown
 * - `adminBrands` (admin) — full list incl. INACTIVE for management
 * - `publicBrand(slug)` — for /brand/[slug] page (Sprint 5)
 */

import { gql } from "@apollo/client";

export const BRAND_FIELDS = gql`
  fragment BrandFields on Brand {
    id
    name
    slug
    description
    logoUrl
    bannerUrl
    websiteUrl
    countryCode
    foundedYear
    status
    isFeatured
    createdAt
    updatedAt
  }
`;

// ---------------------------------------------------------------------------
// Queries
// ---------------------------------------------------------------------------
export const GET_ADMIN_BRANDS = gql`
  ${BRAND_FIELDS}
  query GetAdminBrands($status: BrandStatus) {
    adminBrands(status: $status) {
      ...BrandFields
    }
  }
`;

export const GET_BRANDS = gql`
  ${BRAND_FIELDS}
  query GetBrands($status: BrandStatus, $featuredOnly: Boolean) {
    brands(status: $status, featuredOnly: $featuredOnly) {
      ...BrandFields
    }
  }
`;

export const GET_BRAND = gql`
  ${BRAND_FIELDS}
  query GetBrand($id: ID!) {
    brand(id: $id) {
      ...BrandFields
    }
  }
`;

export const GET_PUBLIC_BRAND = gql`
  ${BRAND_FIELDS}
  query GetPublicBrand($slug: String!) {
    publicBrand(slug: $slug) {
      ...BrandFields
    }
  }
`;

// ---------------------------------------------------------------------------
// Mutations
// ---------------------------------------------------------------------------
export const CREATE_BRAND = gql`
  ${BRAND_FIELDS}
  mutation CreateBrand($createBrandInput: CreateBrandInput!) {
    createBrand(createBrandInput: $createBrandInput) {
      ...BrandFields
    }
  }
`;

export const UPDATE_BRAND = gql`
  ${BRAND_FIELDS}
  mutation UpdateBrand($updateBrandInput: UpdateBrandInput!) {
    updateBrand(updateBrandInput: $updateBrandInput) {
      ...BrandFields
    }
  }
`;

export const SET_BRAND_STATUS = gql`
  ${BRAND_FIELDS}
  mutation SetBrandStatus($setBrandStatusInput: SetBrandStatusInput!) {
    setBrandStatus(setBrandStatusInput: $setBrandStatusInput) {
      ...BrandFields
    }
  }
`;

export const REMOVE_BRAND = gql`
  ${BRAND_FIELDS}
  mutation RemoveBrand($id: ID!) {
    removeBrand(id: $id) {
      ...BrandFields
    }
  }
`;
