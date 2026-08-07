/**
 * Seller-initiated cancellation refunds — consumes RefundSellerResolver:
 *   Query    mySellerOrderRefundPreview(sellerOrderId): SellerRefundPreview
 *   Mutation createSellerRefund(input): RefundEntity
 *
 * Ownership is enforced server-side against the caller's Seller record, and the
 * amount is capped at the seller's own sub-order total — a seller can never
 * refund another seller's share of a shared captured payment.
 *
 * `createSellerRefund` EXECUTES: it creates the refund and drives the gateway in
 * the same call. There is no admin approval step.
 */
import { gql } from "@apollo/client";

export const SELLER_REFUND_PREVIEW = gql`
  query MySellerOrderRefundPreview($sellerOrderId: ID!) {
    mySellerOrderRefundPreview(sellerOrderId: $sellerOrderId) {
      sellerOrderId
      orderNumber
      currencyCode
      subtotal
      taxAmount
      shippingAmount
      discountAmount
      sliceTotal
      alreadyRefunded
      maxRefundable
      refundable
      blockedReason
      paymentGateway
      refunds {
        id
        amount
        status
        reason
        failureReason
        createdAt
      }
    }
  }
`;

export const CREATE_SELLER_REFUND = gql`
  mutation CreateSellerRefund($input: CreateSellerRefundInput!) {
    createSellerRefund(input: $input) {
      id
      amount
      status
      failureReason
      gatewayRefundId
      createdAt
    }
  }
`;

export type SellerRefundStatus =
  | "REQUESTED"
  | "PROCESSING"
  | "PROCESSED"
  | "REJECTED"
  | "FAILED";

export interface SellerRefundRow {
  id: string;
  amount: number;
  status: SellerRefundStatus;
  reason?: string | null;
  failureReason?: string | null;
  createdAt: string;
}

export interface SellerRefundPreview {
  sellerOrderId: string;
  orderNumber: string;
  currencyCode: string;
  subtotal: number;
  taxAmount: number;
  shippingAmount: number;
  discountAmount: number;
  sliceTotal: number;
  alreadyRefunded: number;
  maxRefundable: number;
  refundable: boolean;
  blockedReason?: string | null;
  paymentGateway?: string | null;
  refunds: SellerRefundRow[];
}

export interface SellerRefundPreviewData {
  mySellerOrderRefundPreview: SellerRefundPreview;
}

export interface CreateSellerRefundData {
  createSellerRefund: {
    id: string;
    amount: number;
    status: SellerRefundStatus;
    failureReason?: string | null;
    gatewayRefundId?: string | null;
    createdAt: string;
  };
}
