/**
 * Admin payout operations (P3-06) — consumes the existing PayoutAdminResolver:
 *   Query    payoutPreview(sellerId): [PayoutPreview]      (dry run)
 *   Query    adminPayouts(page, pageSize, status, sellerId): PaginatedPayouts
 *   Mutation createPayoutRun(sellerId): [PayoutEntity]     (settle eligible)
 *   Mutation markPayoutPaid(input: { payoutId, utr, providerRef }): PayoutEntity
 *   Mutation markPayoutFailed(payoutId, reason): PayoutEntity
 *
 * Gated server-side by payout:preview / payout:read / payout:run / payout:disburse.
 */
import { gql } from "@apollo/client";

export const PAYOUT_FIELDS = gql`
  fragment PayoutFields on PayoutEntity {
    id
    sellerId
    status
    grossAmount
    refundAdjustment
    netAmount
    currencyCode
    periodStart
    periodEnd
    utr
    providerRef
    failureReason
    accountType
    accountHolderName
    accountNumberMasked
    ifscCode
    upiId
    paidAt
    failedAt
    createdAt
    updatedAt
    items {
      id
      payoutId
      sellerOrderId
      amount
      refundedAmount
      createdAt
    }
  }
`;

export const GET_ADMIN_PAYOUTS = gql`
  ${PAYOUT_FIELDS}
  query GetAdminPayouts(
    $page: Int
    $pageSize: Int
    $status: PayoutStatus
    $sellerId: ID
  ) {
    adminPayouts(
      page: $page
      pageSize: $pageSize
      status: $status
      sellerId: $sellerId
    ) {
      items {
        ...PayoutFields
      }
      totalCount
      totalPages
      currentPage
      pageSize
    }
  }
`;

export const GET_PAYOUT_PREVIEW = gql`
  query GetPayoutPreview($sellerId: ID) {
    payoutPreview(sellerId: $sellerId) {
      sellerId
      sellerName
      itemCount
      grossAmount
      refundAdjustment
      netAmount
      currencyCode
      items {
        sellerOrderId
        orderNumber
        amount
        refundedAmount
      }
    }
  }
`;

export const CREATE_PAYOUT_RUN = gql`
  ${PAYOUT_FIELDS}
  mutation CreatePayoutRun($sellerId: ID) {
    createPayoutRun(sellerId: $sellerId) {
      ...PayoutFields
    }
  }
`;

export const MARK_PAYOUT_PAID = gql`
  ${PAYOUT_FIELDS}
  mutation MarkPayoutPaid($input: MarkPayoutPaidInput!) {
    markPayoutPaid(input: $input) {
      ...PayoutFields
    }
  }
`;

export const MARK_PAYOUT_FAILED = gql`
  ${PAYOUT_FIELDS}
  mutation MarkPayoutFailed($payoutId: ID!, $reason: String!) {
    markPayoutFailed(payoutId: $payoutId, reason: $reason) {
      ...PayoutFields
    }
  }
`;

// PayoutStatus mirrors the Prisma enum (backend order.prisma).
export const PAYOUT_STATUSES = [
  "PENDING",
  "PROCESSING",
  "PAID",
  "FAILED",
] as const;
export type PayoutStatus = (typeof PAYOUT_STATUSES)[number];

export interface PayoutItem {
  id: string;
  payoutId: string;
  sellerOrderId: string;
  amount: number;
  refundedAmount: number;
  createdAt: string;
}

export interface AdminPayout {
  id: string;
  sellerId: string;
  status: PayoutStatus;
  grossAmount: number;
  refundAdjustment: number;
  netAmount: number;
  currencyCode: string;
  periodStart?: string | null;
  periodEnd?: string | null;
  utr?: string | null;
  providerRef?: string | null;
  failureReason?: string | null;
  accountType?: string | null;
  accountHolderName?: string | null;
  accountNumberMasked?: string | null;
  ifscCode?: string | null;
  upiId?: string | null;
  paidAt?: string | null;
  failedAt?: string | null;
  createdAt: string;
  updatedAt: string;
  items?: PayoutItem[];
}

export interface PayoutPreviewItem {
  sellerOrderId: string;
  orderNumber: string;
  amount: number;
  refundedAmount: number;
}

export interface PayoutPreview {
  sellerId: string;
  sellerName: string;
  itemCount: number;
  grossAmount: number;
  refundAdjustment: number;
  netAmount: number;
  currencyCode: string;
  items: PayoutPreviewItem[];
}

export interface PaginatedPayouts {
  items: AdminPayout[];
  totalCount: number;
  totalPages: number;
  currentPage: number;
  pageSize: number;
}

export interface AdminPayoutsData {
  adminPayouts: PaginatedPayouts;
}
export interface PayoutPreviewData {
  payoutPreview: PayoutPreview[];
}
export interface CreatePayoutRunData {
  createPayoutRun: AdminPayout[];
}
export interface MarkPayoutPaidData {
  markPayoutPaid: AdminPayout;
}
export interface MarkPayoutFailedData {
  markPayoutFailed: AdminPayout;
}
