/**
 * Admin returns oversight (P3-02) — consumes ReturnsAdminResolver:
 *   Query adminReturns(page, pageSize, status, sellerId): PaginatedReturns
 *   Query adminReturn(id): ReturnRequestEntity
 *
 * Gated server-side by the returns route permission (currently reuses
 * `refund:read` until a dedicated `return:read` slug is seeded — see the report).
 */
import { gql } from "@apollo/client";
import { RETURN_FIELDS, RETURN_DETAIL_FIELDS } from "./returns";

export {
  RETURN_STATUSES,
  type ReturnStatus,
  type ReturnRequest,
  type PaginatedReturns,
} from "./returns";

export const GET_ADMIN_RETURNS = gql`
  ${RETURN_FIELDS}
  query GetAdminReturns(
    $page: Int
    $pageSize: Int
    $status: ReturnStatus
    $sellerId: ID
  ) {
    adminReturns(
      page: $page
      pageSize: $pageSize
      status: $status
      sellerId: $sellerId
    ) {
      items {
        ...ReturnFields
      }
      totalCount
      totalPages
      currentPage
      pageSize
    }
  }
`;

export const GET_ADMIN_RETURN = gql`
  ${RETURN_DETAIL_FIELDS}
  query GetAdminReturn($id: ID!) {
    adminReturn(id: $id) {
      ...ReturnDetailFields
      manualRefund {
        id
        status
        amount
        isManual
        disbursable
        reference
      }
    }
  }
`;

/**
 * Record an out-of-band (COD / no-gateway) refund disbursement — the manual
 * money loop for COD return refunds. refund:approve gated server-side.
 */
export const DISBURSE_MANUAL_REFUND = gql`
  mutation DisburseManualRefund(
    $refundId: ID!
    $reference: String!
    $note: String
  ) {
    disburseManualRefund(refundId: $refundId, reference: $reference, note: $note) {
      id
      status
    }
  }
`;

export interface AdminReturnsData {
  adminReturns: import("./returns").PaginatedReturns;
}
export interface AdminReturnData {
  adminReturn: import("./returns").ReturnRequest;
}
export interface DisburseManualRefundData {
  disburseManualRefund: { id: string; status: string };
}
