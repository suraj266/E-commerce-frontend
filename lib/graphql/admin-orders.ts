/**
 * Admin cross-seller order operations (P3-06) — consumes the existing
 * SellerOrderResolver admin surface (gated by invoice:manage):
 *   Query    adminSellerOrdersWithInvoices(page, pageSize, onlyMissingInvoice)
 *   Query    adminSellerOrder(id): SellerOrder
 *   Mutation regenerateSellerOrderInvoice(sellerOrderId): String (new URL)
 *
 * These are the only admin-scoped order operations that exist today. A richer
 * admin order console (status/payment/seller filters, admin cancel / status
 * override) needs new resolvers in the order module — REPORTED to the
 * orchestrator, not built here (P3-06 does not own the order backend).
 */
import { gql } from "@apollo/client";

export const ADMIN_ORDER_FIELDS = gql`
  fragment AdminOrderFields on SellerOrder {
    id
    orderId
    sellerId
    storeId
    orderNumber
    parentOrderNumber
    status
    paymentStatus
    payoutStatus
    subtotal
    taxAmount
    shippingAmount
    discountAmount
    commissionAmount
    payoutAmount
    currencyCode
    itemCount
    storeName
    customerName
    trackingNumber
    carrier
    awbCode
    shippingProvider
    invoiceNumber
    invoiceDate
    invoiceUrl
    createdAt
    updatedAt
  }
`;

export const ADMIN_ORDER_ITEM_FIELDS = gql`
  fragment AdminOrderItemFields on OrderItem {
    id
    sku
    name
    variantName
    quantity
    unitPrice
    totalPrice
    taxAmount
    discountAmount
  }
`;

export const GET_ADMIN_ORDERS = gql`
  ${ADMIN_ORDER_FIELDS}
  query GetAdminOrders(
    $page: Int
    $pageSize: Int
    $onlyMissingInvoice: Boolean
  ) {
    adminSellerOrdersWithInvoices(
      page: $page
      pageSize: $pageSize
      onlyMissingInvoice: $onlyMissingInvoice
    ) {
      items {
        ...AdminOrderFields
      }
      totalCount
      totalPages
      currentPage
      pageSize
    }
  }
`;

export const GET_ADMIN_ORDER = gql`
  ${ADMIN_ORDER_FIELDS}
  ${ADMIN_ORDER_ITEM_FIELDS}
  query GetAdminOrder($id: ID!) {
    adminSellerOrder(id: $id) {
      ...AdminOrderFields
      items {
        ...AdminOrderItemFields
      }
      shippingAddress {
        firstName
        lastName
        phone
        addressLine1
        addressLine2
        city
        state
        postalCode
        countryCode
      }
      statusHistory {
        id
        fromStatus
        toStatus
        notes
        createdAt
      }
    }
  }
`;

export const REGENERATE_INVOICE = gql`
  mutation RegenerateInvoice($sellerOrderId: ID!) {
    regenerateSellerOrderInvoice(sellerOrderId: $sellerOrderId)
  }
`;

// OrderStatus / PaymentStatus mirror the Prisma enums (backend order.prisma).
export const ORDER_STATUSES = [
  "PENDING",
  "CONFIRMED",
  "PACKED",
  "SHIPPED",
  "DELIVERED",
  "CANCELLED",
  "REFUNDED",
] as const;
export type OrderStatus = (typeof ORDER_STATUSES)[number];

export interface AdminOrderItem {
  id: string;
  sku: string;
  name: string;
  variantName?: string | null;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  taxAmount: number;
  discountAmount: number;
}

export interface AdminOrderAddress {
  firstName: string;
  lastName: string;
  phone?: string | null;
  addressLine1: string;
  addressLine2?: string | null;
  city: string;
  state: string;
  postalCode: string;
  countryCode: string;
}

export interface AdminOrderStatusHistory {
  id: string;
  fromStatus?: string | null;
  toStatus: string;
  notes?: string | null;
  createdAt: string;
}

export interface AdminOrder {
  id: string;
  orderId: string;
  sellerId: string;
  storeId: string;
  orderNumber: string;
  parentOrderNumber?: string | null;
  status: OrderStatus;
  paymentStatus: string;
  payoutStatus: string;
  subtotal: number;
  taxAmount: number;
  shippingAmount: number;
  discountAmount: number;
  commissionAmount: number;
  payoutAmount: number;
  currencyCode: string;
  itemCount: number;
  storeName?: string | null;
  customerName?: string | null;
  trackingNumber?: string | null;
  carrier?: string | null;
  awbCode?: string | null;
  shippingProvider?: string | null;
  invoiceNumber?: string | null;
  invoiceDate?: string | null;
  invoiceUrl?: string | null;
  createdAt: string;
  updatedAt: string;
  // detail-only
  items?: AdminOrderItem[];
  shippingAddress?: AdminOrderAddress | null;
  statusHistory?: AdminOrderStatusHistory[];
}

export interface PaginatedAdminOrders {
  items: AdminOrder[];
  totalCount: number;
  totalPages: number;
  currentPage: number;
  pageSize: number;
}

export interface AdminOrdersData {
  adminSellerOrdersWithInvoices: PaginatedAdminOrders;
}
export interface AdminOrderData {
  adminSellerOrder: AdminOrder;
}
export interface RegenerateInvoiceData {
  regenerateSellerOrderInvoice: string;
}

/* ===========================================================================
 * Cross-seller admin order console (Phase 3 Wave 4)
 * ---------------------------------------------------------------------------
 * Consumes the NEW order-module admin resolvers (OrderAdminResolver):
 *   Query    adminOrders(status, paymentStatus, sellerId, search, dateFrom,
 *                         dateTo, page, pageSize): PaginatedOrders   (order:read)
 *   Query    adminOrder(id): Order                                   (order:read)
 *   Mutation adminCancelOrder(id, reason): Order                     (order:manage)
 *
 * These operate on the PARENT Order (cross-seller), unlike the invoice-audit
 * surface above which is per-SellerOrder.
 * ======================================================================== */

export const PAYMENT_STATUSES = [
  "PENDING",
  "AWAITING_PAYMENT",
  "PAID",
  "PARTIALLY_PAID",
  "REFUNDED",
  "PARTIALLY_REFUNDED",
  "FAILED",
] as const;
export type PaymentStatus = (typeof PAYMENT_STATUSES)[number];

export const GET_ADMIN_PARENT_ORDERS = gql`
  query AdminOrders(
    $status: OrderStatus
    $paymentStatus: PaymentStatus
    $sellerId: ID
    $search: String
    $dateFrom: DateTime
    $dateTo: DateTime
    $page: Int
    $pageSize: Int
  ) {
    adminOrders(
      status: $status
      paymentStatus: $paymentStatus
      sellerId: $sellerId
      search: $search
      dateFrom: $dateFrom
      dateTo: $dateTo
      page: $page
      pageSize: $pageSize
    ) {
      items {
        id
        orderNumber
        status
        paymentStatus
        paymentMethod
        subtotal
        taxAmount
        shippingAmount
        discountAmount
        totalAmount
        currencyCode
        itemCount
        placedAt
        cancelledAt
        sellerOrders {
          id
          orderNumber
          sellerId
          storeName
          status
          paymentStatus
          payoutStatus
        }
      }
      totalCount
      totalPages
      currentPage
      pageSize
    }
  }
`;

export const GET_ADMIN_PARENT_ORDER = gql`
  query AdminOrderDetail($id: ID!) {
    adminOrder(id: $id) {
      id
      orderNumber
      status
      paymentStatus
      paymentMethod
      subtotal
      taxAmount
      shippingAmount
      discountAmount
      totalAmount
      currencyCode
      itemCount
      customerNotes
      buyerGstin
      placedAt
      cancelledAt
      deliveredAt
      createdAt
      shippingAddress {
        firstName
        lastName
        phone
        addressLine1
        addressLine2
        city
        state
        postalCode
        countryCode
      }
      items {
        id
        sku
        name
        variantName
        quantity
        unitPrice
        totalPrice
      }
      sellerOrders {
        id
        orderNumber
        storeName
        customerName
        status
        paymentStatus
        payoutStatus
        subtotal
        taxAmount
        shippingAmount
        commissionAmount
        payoutAmount
        currencyCode
        itemCount
        trackingNumber
        carrier
        invoiceNumber
        invoiceUrl
      }
      statusHistory {
        id
        fromStatus
        toStatus
        notes
        createdAt
      }
    }
  }
`;

export const ADMIN_CANCEL_ORDER = gql`
  mutation AdminCancelOrder($id: ID!, $reason: String) {
    adminCancelOrder(id: $id, reason: $reason) {
      id
      status
      paymentStatus
      cancelledAt
    }
  }
`;

export interface AdminParentSellerOrder {
  id: string;
  orderNumber: string;
  sellerId: string;
  storeName?: string | null;
  customerName?: string | null;
  status: OrderStatus;
  paymentStatus: string;
  payoutStatus: string;
  subtotal?: number;
  taxAmount?: number;
  shippingAmount?: number;
  commissionAmount?: number;
  payoutAmount?: number;
  currencyCode?: string;
  itemCount?: number;
  trackingNumber?: string | null;
  carrier?: string | null;
  invoiceNumber?: string | null;
  invoiceUrl?: string | null;
}

export interface AdminParentOrder {
  id: string;
  orderNumber: string;
  status: OrderStatus;
  paymentStatus: string;
  paymentMethod: string;
  subtotal: number;
  taxAmount: number;
  shippingAmount: number;
  discountAmount: number;
  totalAmount: number;
  currencyCode: string;
  itemCount: number;
  placedAt: string;
  cancelledAt?: string | null;
  deliveredAt?: string | null;
  createdAt?: string;
  customerNotes?: string | null;
  buyerGstin?: string | null;
  shippingAddress?: AdminOrderAddress | null;
  items?: AdminOrderItem[];
  sellerOrders: AdminParentSellerOrder[];
  statusHistory?: AdminOrderStatusHistory[];
}

export interface PaginatedAdminParentOrders {
  items: AdminParentOrder[];
  totalCount: number;
  totalPages: number;
  currentPage: number;
  pageSize: number;
}

export interface AdminParentOrdersData {
  adminOrders: PaginatedAdminParentOrders;
}
export interface AdminParentOrderData {
  adminOrder: AdminParentOrder;
}
export interface AdminCancelOrderData {
  adminCancelOrder: {
    id: string;
    status: OrderStatus;
    paymentStatus: string;
    cancelledAt?: string | null;
  };
}

export const ORDER_STATUS_LABEL: Record<OrderStatus, string> = {
  PENDING: "Pending",
  CONFIRMED: "Confirmed",
  PACKED: "Packed",
  SHIPPED: "Shipped",
  DELIVERED: "Delivered",
  CANCELLED: "Cancelled",
  REFUNDED: "Refunded",
};

export const PAYMENT_STATUS_LABEL: Record<string, string> = {
  PENDING: "Pending",
  AWAITING_PAYMENT: "Awaiting payment",
  PAID: "Paid",
  PARTIALLY_PAID: "Partially paid",
  REFUNDED: "Refunded",
  PARTIALLY_REFUNDED: "Partially refunded",
  FAILED: "Failed",
};
