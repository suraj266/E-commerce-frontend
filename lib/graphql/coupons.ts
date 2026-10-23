/**
 * Coupon GraphQL ops — admin CRUD + customer validateCoupon.
 *
 * Written with the `gql` tag like the rest of this folder, but every document
 * is annotated with the TypedDocumentNode type that graphql-codegen generates
 * for it (codegen picks up `gql` documents too), so call sites still get
 * fully-typed data and variables.
 *
 * Why not the client-preset `graphql()` tag here: without a compiler plugin
 * it is backed by gql/gql.ts, a lookup table that imports EVERY operation in
 * the app (~840 KB raw). This file is imported by the cart + checkout coupon
 * hook, so `graphql()` put that whole table on those pages.
 */

import { gql } from "@apollo/client";
import type { TypedDocumentNode } from "@apollo/client";
import type {
  CreateCouponMutation,
  CreateCouponMutationVariables,
  GetAdminCouponQuery,
  GetAdminCouponQueryVariables,
  GetAdminCouponsQuery,
  GetAdminCouponsQueryVariables,
  RemoveCouponMutation,
  RemoveCouponMutationVariables,
  UpdateCouponMutation,
  UpdateCouponMutationVariables,
  ValidateCouponMutation,
  ValidateCouponMutationVariables,
} from "@/gql/graphql";

// Fragment — consumers reference it via the "...CouponFields" spread inside
// their own operations.
const COUPON_FIELDS = gql`
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
`;

// ---- Admin ----
export const GET_ADMIN_COUPONS: TypedDocumentNode<
  GetAdminCouponsQuery,
  GetAdminCouponsQueryVariables
> = gql`
  query GetAdminCoupons($search: String, $status: String) {
    adminCoupons(search: $search, status: $status) {
      ...CouponFields
    }
  }
  ${COUPON_FIELDS}
`;

export const GET_ADMIN_COUPON: TypedDocumentNode<
  GetAdminCouponQuery,
  GetAdminCouponQueryVariables
> = gql`
  query GetAdminCoupon($id: ID!) {
    adminCoupon(id: $id) {
      ...CouponFields
    }
  }
  ${COUPON_FIELDS}
`;

export const CREATE_COUPON: TypedDocumentNode<
  CreateCouponMutation,
  CreateCouponMutationVariables
> = gql`
  mutation CreateCoupon($input: CreateCouponInput!) {
    createCoupon(input: $input) {
      ...CouponFields
    }
  }
  ${COUPON_FIELDS}
`;

export const UPDATE_COUPON: TypedDocumentNode<
  UpdateCouponMutation,
  UpdateCouponMutationVariables
> = gql`
  mutation UpdateCoupon($input: UpdateCouponInput!) {
    updateCoupon(input: $input) {
      ...CouponFields
    }
  }
  ${COUPON_FIELDS}
`;

export const REMOVE_COUPON: TypedDocumentNode<
  RemoveCouponMutation,
  RemoveCouponMutationVariables
> = gql`
  mutation RemoveCoupon($id: ID!) {
    removeCoupon(id: $id) {
      id
    }
  }
`;

// ---- Customer ----
export const VALIDATE_COUPON: TypedDocumentNode<
  ValidateCouponMutation,
  ValidateCouponMutationVariables
> = gql`
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
  ${COUPON_FIELDS}
`;
