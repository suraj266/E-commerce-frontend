/**
 * Coupon GraphQL ops — admin CRUD + customer validateCoupon.
 *
 * First file migrated to graphql-codegen `client-preset`. The `graphql()`
 * tag returns a TypedDocumentNode — call sites get fully-typed data and
 * variables without `useQuery<MyData>()` generics.
 *
 * Other files in this folder still use the legacy `gql` import from
 * @apollo/client. Both styles coexist; migrate file-by-file as you touch them.
 */

import { graphql } from "@/gql";

// Fragment — codegen picks it up by name; consumers reference it via the
// "...CouponFields" spread inside their own operations.
graphql(`
  fragment CouponFields on Coupon {
    id
    storeId
    code
    name
    description
    discountType
    discountValue
    minimumPurchaseAmount
    maximumDiscountAmount
    usageLimit
    usageLimitPerUser
    validFrom
    validUntil
    isActive
    redemptionCount
    createdAt
    updatedAt
  }
`);

// ---- Admin ----
export const GET_ADMIN_COUPONS = graphql(`
  query GetAdminCoupons($search: String, $status: String) {
    adminCoupons(search: $search, status: $status) {
      ...CouponFields
    }
  }
`);

export const GET_ADMIN_COUPON = graphql(`
  query GetAdminCoupon($id: ID!) {
    adminCoupon(id: $id) {
      ...CouponFields
    }
  }
`);

export const CREATE_COUPON = graphql(`
  mutation CreateCoupon($input: CreateCouponInput!) {
    createCoupon(input: $input) {
      ...CouponFields
    }
  }
`);

export const UPDATE_COUPON = graphql(`
  mutation UpdateCoupon($input: UpdateCouponInput!) {
    updateCoupon(input: $input) {
      ...CouponFields
    }
  }
`);

export const REMOVE_COUPON = graphql(`
  mutation RemoveCoupon($id: ID!) {
    removeCoupon(id: $id) {
      id
    }
  }
`);

// ---- Customer ----
export const VALIDATE_COUPON = graphql(`
  mutation ValidateCoupon($input: ValidateCouponInput!) {
    validateCoupon(input: $input) {
      isValid
      reason
      discountAmount
      subtotal
      subtotalInclTax
      discountInclTax
      customerTotal
      coupon {
        ...CouponFields
      }
    }
  }
`);
