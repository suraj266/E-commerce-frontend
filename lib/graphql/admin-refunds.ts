/**
 * Admin refund operations (P3-06) — consumes the existing RefundAdminResolver:
 *   Query    adminRefunds(page, pageSize, status, orderId): PaginatedRefunds
 *   Mutation approveRefund(refundId): RefundEntity
 *   Mutation rejectRefund(refundId, reason): RefundEntity
 *
 * Gated server-side by refund:read / refund:approve / refund:reject.
 */
import { gql } from "@apollo/client";

export const REFUND_FIELDS = gql`
  fragment RefundFields on RefundEntity {
    id
    orderId
    sellerOrderId
    paymentId
    amount
    reason
    status
    restock
    gatewayRefundId
    requestedById
    approvedById
    failureReason
    createdAt
    updatedAt
  }
`;

export const GET_ADMIN_REFUNDS = gql`
  ${REFUND_FIELDS}
  query GetAdminRefunds(
    $page: Int
    $pageSize: Int
    $status: RefundStatus
    $orderId: ID
  ) {
    adminRefunds(
      page: $page
      pageSize: $pageSize
      status: $status
      orderId: $orderId
    ) {
      items {
        ...RefundFields
      }
      totalCount
      totalPages
      currentPage
      pageSize
    }
  }
`;

export const APPROVE_REFUND = gql`
  ${REFUND_FIELDS}
  mutation ApproveRefund($refundId: ID!) {
    approveRefund(refundId: $refundId) {
      ...RefundFields
    }
  }
`;

export const REJECT_REFUND = gql`
  ${REFUND_FIELDS}
  mutation RejectRefund($refundId: ID!, $reason: String) {
    rejectRefund(refundId: $refundId, reason: $reason) {
      ...RefundFields
    }
  }
`;

// RefundStatus mirrors the Prisma enum (backend refund.prisma).
export const REFUND_STATUSES = [
  "REQUESTED",
  "REJECTED",
  "PROCESSING",
  "PROCESSED",
  "FAILED",
  "CANCELLED",
] as const;
export type RefundStatus = (typeof REFUND_STATUSES)[number];

export interface AdminRefund {
  id: string;
  orderId: string;
  sellerOrderId?: string | null;
  paymentId: string;
  amount: number;
  reason?: string | null;
  status: RefundStatus;
  restock: boolean;
  gatewayRefundId?: string | null;
  requestedById?: string | null;
  approvedById?: string | null;
  failureReason?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface PaginatedRefunds {
  items: AdminRefund[];
  totalCount: number;
  totalPages: number;
  currentPage: number;
  pageSize: number;
}

export interface AdminRefundsData {
  adminRefunds: PaginatedRefunds;
}
export interface ApproveRefundData {
  approveRefund: AdminRefund;
}
export interface RejectRefundData {
  rejectRefund: AdminRefund;
}
