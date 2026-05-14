/**
 * Coupon GraphQL ops — admin CRUD + customer validateCoupon.
 */

import { gql } from "@apollo/client";

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
export const GET_ADMIN_COUPONS = gql`
  ${COUPON_FIELDS}
  query GetAdminCoupons($search: String, $status: String) {
    adminCoupons(search: $search, status: $status) {
      ...CouponFields
    }
  }
`;

export const GET_ADMIN_COUPON = gql`
  ${COUPON_FIELDS}
  query GetAdminCoupon($id: ID!) {
    adminCoupon(id: $id) {
      ...CouponFields
    }
  }
`;

export const CREATE_COUPON = gql`
  ${COUPON_FIELDS}
  mutation CreateCoupon($input: CreateCouponInput!) {
    createCoupon(input: $input) {
      ...CouponFields
    }
  }
`;

export const UPDATE_COUPON = gql`
  ${COUPON_FIELDS}
  mutation UpdateCoupon($input: UpdateCouponInput!) {
    updateCoupon(input: $input) {
      ...CouponFields
    }
  }
`;

export const REMOVE_COUPON = gql`
  mutation RemoveCoupon($id: ID!) {
    removeCoupon(id: $id) {
      id
    }
  }
`;

// ---- Customer ----
export const VALIDATE_COUPON = gql`
  ${COUPON_FIELDS}
  mutation ValidateCoupon($input: ValidateCouponInput!) {
    validateCoupon(input: $input) {
      isValid
      reason
      discountAmount
      subtotal
      coupon {
        ...CouponFields
      }
    }
  }
`;
