/**
 * Seller store-coupon GraphQL (P4-03) — consumes CouponSellerResolver.
 *
 *   Query    myStoreCoupons(storeId): [Coupon]      (across the caller's stores)
 *   Mutation createMyStoreCoupon(input): Coupon
 *   Mutation updateMyStoreCoupon(input): Coupon
 *   Mutation removeMyStoreCoupon(id): Coupon (null)
 *
 * Ownership is enforced server-side (caller → seller → store), so these carry
 * only the logged-in seller session — no storeId trust. Hand-written gql +
 * the shared Coupon type (mirrors the returns/orders convention).
 */

import { gql } from "@apollo/client";
import type {
  Coupon,
  CreateCouponInput,
  UpdateCouponInput,
} from "@/types/coupon.types";

const SELLER_COUPON_FIELDS = gql`
  fragment SellerCouponFields on Coupon {
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

export const GET_MY_STORE_COUPONS = gql`
  ${SELLER_COUPON_FIELDS}
  query GetMyStoreCoupons($storeId: ID) {
    myStoreCoupons(storeId: $storeId) {
      ...SellerCouponFields
    }
  }
`;

export const CREATE_MY_STORE_COUPON = gql`
  ${SELLER_COUPON_FIELDS}
  mutation CreateMyStoreCoupon($input: CreateCouponInput!) {
    createMyStoreCoupon(input: $input) {
      ...SellerCouponFields
    }
  }
`;

export const UPDATE_MY_STORE_COUPON = gql`
  ${SELLER_COUPON_FIELDS}
  mutation UpdateMyStoreCoupon($input: UpdateCouponInput!) {
    updateMyStoreCoupon(input: $input) {
      ...SellerCouponFields
    }
  }
`;

export const REMOVE_MY_STORE_COUPON = gql`
  mutation RemoveMyStoreCoupon($id: ID!) {
    removeMyStoreCoupon(id: $id) {
      id
    }
  }
`;

// ---- Apollo response shapes ----
export interface MyStoreCouponsData {
  myStoreCoupons: Coupon[];
}
export interface CreateMyStoreCouponData {
  createMyStoreCoupon: Coupon;
}
export interface UpdateMyStoreCouponData {
  updateMyStoreCoupon: Coupon;
}

export type { Coupon, CreateCouponInput, UpdateCouponInput };
