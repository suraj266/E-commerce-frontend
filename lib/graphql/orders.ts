import { gql } from "@apollo/client";

export const ORDER_ADDRESS_FIELDS = gql`
  fragment OrderAddressFields on OrderAddressSnapshot {
    id
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
`;

export const ORDER_ITEM_FIELDS = gql`
  fragment OrderItemFields on OrderItem {
    id
    orderId
    sellerOrderId
    productId
    variantId
    storeId
    sku
    name
    variantName
    quantity
    unitPrice
    totalPrice
    taxAmount
    discountAmount
    attributesSnapshot {
      attributeName
      value
    }
    imageUrlSnapshot
    createdAt
  }
`;

export const STATUS_HISTORY_FIELDS = gql`
  fragment StatusHistoryFields on OrderStatusHistoryEntry {
    id
    fromStatus
    toStatus
    changedById
    notes
    createdAt
  }
`;

export const SELLER_ORDER_FIELDS = gql`
  ${ORDER_ITEM_FIELDS}
  ${STATUS_HISTORY_FIELDS}
  ${ORDER_ADDRESS_FIELDS}
  fragment SellerOrderFields on SellerOrder {
    id
    orderId
    sellerId
    storeId
    orderNumber
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
    packedAt
    shippedAt
    deliveredAt
    cancelledAt
    createdAt
    updatedAt
    itemCount
    storeName
    items {
      ...OrderItemFields
    }
    statusHistory {
      ...StatusHistoryFields
    }
    parentOrderNumber
    shippingAddress {
      ...OrderAddressFields
    }
    customerName
  }
`;

export const ORDER_FIELDS = gql`
  ${ORDER_ITEM_FIELDS}
  ${STATUS_HISTORY_FIELDS}
  ${ORDER_ADDRESS_FIELDS}
  ${SELLER_ORDER_FIELDS}
  fragment OrderFields on Order {
    id
    orderNumber
    customerId
    status
    paymentStatus
    paymentMethod
    subtotal
    taxAmount
    shippingAmount
    discountAmount
    totalAmount
    currencyCode
    customerNotes
    placedAt
    cancelledAt
    deliveredAt
    createdAt
    updatedAt
    itemCount
    items {
      ...OrderItemFields
    }
    sellerOrders {
      ...SellerOrderFields
    }
    statusHistory {
      ...StatusHistoryFields
    }
    shippingAddress {
      ...OrderAddressFields
    }
    billingAddress {
      ...OrderAddressFields
    }
  }
`;

// ---- Customer-facing ----
export const GET_MY_ORDERS = gql`
  ${ORDER_FIELDS}
  query GetMyOrders($status: OrderStatus, $page: Int, $pageSize: Int) {
    myOrders(status: $status, page: $page, pageSize: $pageSize) {
      items {
        ...OrderFields
      }
      totalCount
      totalPages
      currentPage
      pageSize
    }
  }
`;

export const GET_MY_ORDER = gql`
  ${ORDER_FIELDS}
  query GetMyOrder($id: ID!) {
    myOrder(id: $id) {
      ...OrderFields
    }
  }
`;

export const PLACE_ORDER = gql`
  ${ORDER_FIELDS}
  mutation PlaceOrder($input: PlaceOrderInput!) {
    placeOrder(input: $input) {
      ...OrderFields
    }
  }
`;

export const CANCEL_MY_ORDER = gql`
  ${ORDER_FIELDS}
  mutation CancelMyOrder($id: ID!, $notes: String) {
    cancelMyOrder(id: $id, notes: $notes) {
      ...OrderFields
    }
  }
`;

// ---- Seller-facing ----
export const GET_MY_SELLER_ORDERS = gql`
  ${SELLER_ORDER_FIELDS}
  query GetMySellerOrders($status: OrderStatus, $page: Int, $pageSize: Int) {
    mySellerOrders(status: $status, page: $page, pageSize: $pageSize) {
      items {
        ...SellerOrderFields
      }
      totalCount
      totalPages
      currentPage
      pageSize
    }
  }
`;

export const GET_MY_SELLER_ORDER = gql`
  ${SELLER_ORDER_FIELDS}
  query GetMySellerOrder($id: ID!) {
    mySellerOrder(id: $id) {
      ...SellerOrderFields
    }
  }
`;

export const UPDATE_SELLER_ORDER_STATUS = gql`
  ${SELLER_ORDER_FIELDS}
  mutation UpdateSellerOrderStatus($input: UpdateSellerOrderStatusInput!) {
    updateSellerOrderStatus(input: $input) {
      ...SellerOrderFields
    }
  }
`;
