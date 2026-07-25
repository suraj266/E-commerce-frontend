/**
 * Returns / RMA operations (P3-02) — consumes ReturnsResolver.
 *
 * Customer:  requestReturn, myReturns, myReturn
 * Seller:    sellerReturns, sellerReturn, approveReturn, rejectReturn,
 *            scheduleReturnPickup, markReturnReceived, qcReturn
 *
 * Hand-written gql (matches the refunds/orders convention). Ownership is enforced
 * server-side, so these use only the logged-in session.
 */
import { gql } from "@apollo/client";

export const RETURN_FIELDS = gql`
  fragment ReturnFields on ReturnRequestEntity {
    id
    returnNumber
    orderId
    sellerOrderId
    sellerId
    customerId
    status
    resolutionType
    reason
    customerNote
    qcNote
    rejectionReason
    reverseAwb
    reverseLabelUrl
    refundId
    refundAmount
    replacementReference
    replacementApprovedAt
    replacementShippedAt
    requestedAt
    approvedAt
    receivedAt
    refundedAt
    createdAt
    updatedAt
    items {
      id
      orderItemId
      quantity
      condition
    }
  }
`;

export const RETURN_DETAIL_FIELDS = gql`
  ${RETURN_FIELDS}
  fragment ReturnDetailFields on ReturnRequestEntity {
    ...ReturnFields
    events {
      id
      fromStatus
      toStatus
      note
      createdAt
    }
  }
`;

// --------------------------- Customer ---------------------------------------

export const REQUEST_RETURN = gql`
  ${RETURN_FIELDS}
  mutation RequestReturn($input: RequestReturnInput!) {
    requestReturn(input: $input) {
      ...ReturnFields
    }
  }
`;

export const GET_MY_RETURNS = gql`
  ${RETURN_FIELDS}
  query GetMyReturns {
    myReturns {
      ...ReturnFields
    }
  }
`;

export const GET_MY_RETURN = gql`
  ${RETURN_DETAIL_FIELDS}
  query GetMyReturn($id: ID!) {
    myReturn(id: $id) {
      ...ReturnDetailFields
    }
  }
`;

// --------------------------- Seller -----------------------------------------

export const GET_SELLER_RETURNS = gql`
  ${RETURN_FIELDS}
  query GetSellerReturns($page: Int, $pageSize: Int, $status: ReturnStatus) {
    sellerReturns(page: $page, pageSize: $pageSize, status: $status) {
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

export const GET_SELLER_RETURN = gql`
  ${RETURN_DETAIL_FIELDS}
  query GetSellerReturn($id: ID!) {
    sellerReturn(id: $id) {
      ...ReturnDetailFields
    }
  }
`;

export const APPROVE_RETURN = gql`
  ${RETURN_FIELDS}
  mutation ApproveReturn($id: ID!) {
    approveReturn(id: $id) {
      ...ReturnFields
    }
  }
`;

export const REJECT_RETURN = gql`
  ${RETURN_FIELDS}
  mutation RejectReturn($id: ID!, $reason: String) {
    rejectReturn(id: $id, reason: $reason) {
      ...ReturnFields
    }
  }
`;

export const SCHEDULE_RETURN_PICKUP = gql`
  ${RETURN_FIELDS}
  mutation ScheduleReturnPickup($id: ID!) {
    scheduleReturnPickup(id: $id) {
      ...ReturnFields
    }
  }
`;

export const MARK_RETURN_RECEIVED = gql`
  ${RETURN_FIELDS}
  mutation MarkReturnReceived($id: ID!) {
    markReturnReceived(id: $id) {
      ...ReturnFields
    }
  }
`;

export const QC_RETURN = gql`
  ${RETURN_FIELDS}
  mutation QcReturn($id: ID!, $pass: Boolean!, $note: String) {
    qcReturn(id: $id, pass: $pass, note: $note) {
      ...ReturnFields
    }
  }
`;

export const MARK_REPLACEMENT_SHIPPED = gql`
  ${RETURN_FIELDS}
  mutation MarkReplacementShipped($id: ID!, $reference: String, $note: String) {
    markReplacementShipped(id: $id, reference: $reference, note: $note) {
      ...ReturnFields
    }
  }
`;

// --------------------------- Types ------------------------------------------

// Mirrors the Prisma ReturnStatus enum (backend return.prisma).
export const RETURN_STATUSES = [
  "REQUESTED",
  "APPROVED",
  "PICKUP_SCHEDULED",
  "IN_TRANSIT",
  "RECEIVED",
  "QC_PASSED",
  "QC_FAILED",
  "REFUNDED",
  "REPLACEMENT_APPROVED",
  "REPLACEMENT_SHIPPED",
  "CLOSED",
  "REJECTED",
] as const;
export type ReturnStatus = (typeof RETURN_STATUSES)[number];

export type ReturnResolutionType = "REFUND" | "REPLACEMENT";

export interface ReturnItem {
  id: string;
  orderItemId: string;
  quantity: number;
  condition?: string | null;
}

export interface ReturnEvent {
  id: string;
  fromStatus?: ReturnStatus | null;
  toStatus: ReturnStatus;
  note?: string | null;
  createdAt: string;
}

export interface ReturnRequest {
  id: string;
  returnNumber: string;
  orderId: string;
  sellerOrderId: string;
  sellerId: string;
  customerId: string;
  status: ReturnStatus;
  resolutionType: ReturnResolutionType;
  reason: string;
  customerNote?: string | null;
  qcNote?: string | null;
  rejectionReason?: string | null;
  reverseAwb?: string | null;
  reverseLabelUrl?: string | null;
  refundId?: string | null;
  refundAmount?: number | null;
  replacementReference?: string | null;
  replacementApprovedAt?: string | null;
  replacementShippedAt?: string | null;
  requestedAt: string;
  approvedAt?: string | null;
  receivedAt?: string | null;
  refundedAt?: string | null;
  createdAt: string;
  updatedAt: string;
  items?: ReturnItem[];
  events?: ReturnEvent[];
  /** Attached only by the admin detail read (adminReturn). */
  manualRefund?: ManualRefundInfo | null;
}

export interface ManualRefundInfo {
  id: string;
  status: string;
  amount: number;
  isManual: boolean;
  disbursable: boolean;
  reference?: string | null;
}

export interface PaginatedReturns {
  items: ReturnRequest[];
  totalCount: number;
  totalPages: number;
  currentPage: number;
  pageSize: number;
}

export interface MyReturnsData {
  myReturns: ReturnRequest[];
}
export interface MyReturnData {
  myReturn: ReturnRequest;
}
export interface RequestReturnData {
  requestReturn: ReturnRequest;
}
export interface SellerReturnsData {
  sellerReturns: PaginatedReturns;
}
export interface SellerReturnData {
  sellerReturn: ReturnRequest;
}
