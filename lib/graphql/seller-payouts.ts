/**
 * Seller payout-run history (P4-03) — consumes PayoutSellerResolver.myPayouts,
 * a JwtAuthGuard-only query that resolves the caller's OWN sellerId server-side
 * (never a client-supplied one) and lists only that seller's settlement runs.
 *
 * Distinct operation + fragment names from admin-payouts.ts (GetMyPayouts /
 * SellerPayoutFields) so the two documents never collide.
 */

import { gql } from "@apollo/client";

const SELLER_PAYOUT_FIELDS = gql`
  fragment SellerPayoutFields on PayoutEntity {
    id
    status
    grossAmount
    refundAdjustment
    netAmount
    currencyCode
    utr
    paidAt
    failedAt
    failureReason
    createdAt
    items {
      id
      sellerOrderId
      amount
      refundedAmount
    }
  }
`;

export const GET_MY_PAYOUTS = gql`
  ${SELLER_PAYOUT_FIELDS}
  query GetMyPayouts($page: Int, $pageSize: Int, $status: PayoutStatus) {
    myPayouts(page: $page, pageSize: $pageSize, status: $status) {
      items {
        ...SellerPayoutFields
      }
      totalCount
      totalPages
      currentPage
      pageSize
    }
  }
`;

export const PAYOUT_STATUSES = [
  "PENDING",
  "PROCESSING",
  "PAID",
  "FAILED",
] as const;
export type PayoutStatus = (typeof PAYOUT_STATUSES)[number];

export interface SellerPayoutItem {
  id: string;
  sellerOrderId: string;
  amount: number;
  refundedAmount: number;
}

export interface SellerPayout {
  id: string;
  status: PayoutStatus;
  grossAmount: number;
  refundAdjustment: number;
  netAmount: number;
  currencyCode: string;
  utr?: string | null;
  paidAt?: string | null;
  failedAt?: string | null;
  failureReason?: string | null;
  createdAt: string;
  items?: SellerPayoutItem[];
}

export interface PaginatedSellerPayouts {
  items: SellerPayout[];
  totalCount: number;
  totalPages: number;
  currentPage: number;
  pageSize: number;
}

export interface MyPayoutsData {
  myPayouts: PaginatedSellerPayouts;
}
