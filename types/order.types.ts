/**
 * Order types — mirror backend GraphQL Order/SellerOrder/OrderItem.
 *
 * NOTE: status enums are uppercase to match GraphQL serialization.
 */

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

export const ORDER_STATUS_LABEL: Record<OrderStatus, string> = {
  PENDING: "Pending",
  CONFIRMED: "Confirmed",
  PACKED: "Packed",
  SHIPPED: "Shipped",
  DELIVERED: "Delivered",
  CANCELLED: "Cancelled",
  REFUNDED: "Refunded",
};

/**
 * Stage progression for the timeline UI. Cancelled / refunded fall
 * outside the linear track and get rendered as terminal pills.
 */
export const ORDER_STAGES: OrderStatus[] = [
  "PENDING",
  "CONFIRMED",
  "PACKED",
  "SHIPPED",
  "DELIVERED",
];

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

export const PAYMENT_METHODS = [
  "COD",
  "CARD",
  "UPI",
  "NET_BANKING",
  "WALLET",
] as const;
export type PaymentMethod = (typeof PAYMENT_METHODS)[number];

export const PAYMENT_METHOD_LABEL: Record<PaymentMethod, string> = {
  COD: "Cash on Delivery",
  CARD: "Card",
  UPI: "UPI",
  NET_BANKING: "Net Banking",
  WALLET: "Wallet",
};

export interface OrderItemAttribute {
  attributeName: string;
  value: string;
}

export interface OrderItem {
  id: string;
  orderId: string;
  sellerOrderId: string;
  productId: string;
  variantId: string;
  storeId: string;
  sku: string;
  name: string;
  variantName?: string | null;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  taxAmount: number;
  discountAmount: number;
  attributesSnapshot: OrderItemAttribute[];
  imageUrlSnapshot?: string | null;
  createdAt: string;
}

export interface OrderStatusHistoryEntry {
  id: string;
  fromStatus?: OrderStatus | null;
  toStatus: OrderStatus;
  changedById?: string | null;
  notes?: string | null;
  createdAt: string;
}

export interface OrderAddressSnapshot {
  id: string;
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

export interface SellerOrder {
  id: string;
  orderId: string;
  sellerId: string;
  storeId: string;
  orderNumber: string;
  status: OrderStatus;
  paymentStatus: PaymentStatus;
  payoutStatus: string;
  subtotal: number;
  taxAmount: number;
  shippingAmount: number;
  discountAmount: number;
  commissionAmount: number;
  payoutAmount: number;
  currencyCode: string;
  packedAt?: string | null;
  shippedAt?: string | null;
  deliveredAt?: string | null;
  cancelledAt?: string | null;
  createdAt: string;
  updatedAt: string;
  items: OrderItem[];
  itemCount: number;
  storeName?: string | null;
  statusHistory: OrderStatusHistoryEntry[];
  parentOrderNumber?: string | null;
  shippingAddress?: OrderAddressSnapshot | null;
  customerName?: string | null;
}

export interface Order {
  id: string;
  orderNumber: string;
  customerId: string;
  status: OrderStatus;
  paymentStatus: PaymentStatus;
  paymentMethod: PaymentMethod;
  subtotal: number;
  taxAmount: number;
  shippingAmount: number;
  discountAmount: number;
  totalAmount: number;
  currencyCode: string;
  shippingAddress?: OrderAddressSnapshot | null;
  billingAddress?: OrderAddressSnapshot | null;
  customerNotes?: string | null;
  placedAt: string;
  cancelledAt?: string | null;
  deliveredAt?: string | null;
  createdAt: string;
  updatedAt: string;
  sellerOrders: SellerOrder[];
  items: OrderItem[];
  itemCount: number;
  statusHistory: OrderStatusHistoryEntry[];
}

export interface PaginatedOrders {
  items: Order[];
  totalCount: number;
  totalPages: number;
  currentPage: number;
  pageSize: number;
}

export interface PaginatedSellerOrders {
  items: SellerOrder[];
  totalCount: number;
  totalPages: number;
  currentPage: number;
  pageSize: number;
}

// ---- Inputs ----
export interface PlaceOrderInput {
  shippingAddressId: string;
  billingAddressId?: string;
  paymentMethod: PaymentMethod;
  customerNotes?: string;
}

export interface UpdateSellerOrderStatusInput {
  sellerOrderId: string;
  status: OrderStatus;
  notes?: string;
}

// ---- Apollo response shapes ----
export interface MyOrdersData {
  myOrders: PaginatedOrders;
}
export interface MyOrderData {
  myOrder: Order;
}
export interface PlaceOrderData {
  placeOrder: Order;
}
export interface CancelMyOrderData {
  cancelMyOrder: Order;
}
export interface MySellerOrdersData {
  mySellerOrders: PaginatedSellerOrders;
}
export interface MySellerOrderData {
  mySellerOrder: SellerOrder;
}
export interface UpdateSellerOrderStatusData {
  updateSellerOrderStatus: SellerOrder;
}

// ---- Checkout (two-phase flow) ----
export type PaymentGateway = "COD" | "RAZORPAY" | "STRIPE" | "PHONEPE";

export interface CheckoutResult {
  orderId: string;
  orderNumber: string;
  gateway: PaymentGateway;
  gatewayPayload: string | null; // JSON string
  requiresPayment: boolean;
}

export interface ActiveGateway {
  id: string;
  gateway: PaymentGateway;
  displayName: string;
  description: string | null;
  logoUrl: string | null;
  isDefault: boolean;
  processingFee: number;
  processingFeeType: string;
  paymentType: string;
  supportedMethods: string[];
}

export interface InitiateCheckoutData {
  initiateCheckout: CheckoutResult;
}
export interface VerifyPaymentData {
  verifyPayment: Order;
}
export interface ActivePaymentGatewaysData {
  activePaymentGateways: ActiveGateway[];
}
