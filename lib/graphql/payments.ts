import { gql } from "@apollo/client";

// ---------------------------------------------------------------------------
// Admin — Gateway Config CRUD
// ---------------------------------------------------------------------------

export const GET_ADMIN_PAYMENT_GATEWAYS = gql`
  query AdminPaymentGateways {
    adminPaymentGateways {
      id
      gateway
      displayName
      description
      logoUrl
      isEnabled
      isDefault
      displayOrder
      supportedMethods
      sandboxMode
      processingFee
      processingFeeType
      paymentType
      instructions
      webhookUrl
      credentialHints
      hasCredentials
      createdAt
      updatedAt
    }
  }
`;

export const GET_ADMIN_PAYMENT_GATEWAY = gql`
  query AdminPaymentGateway($id: ID!) {
    adminPaymentGateway(id: $id) {
      id
      gateway
      displayName
      description
      logoUrl
      isEnabled
      isDefault
      displayOrder
      supportedMethods
      sandboxMode
      processingFee
      processingFeeType
      paymentType
      instructions
      webhookUrl
      credentialHints
      hasCredentials
      createdAt
      updatedAt
    }
  }
`;

export const CREATE_PAYMENT_GATEWAY_CONFIG = gql`
  mutation CreatePaymentGatewayConfig($input: CreateGatewayConfigInput!) {
    createPaymentGatewayConfig(input: $input) {
      id
      gateway
      displayName
      isEnabled
      isDefault
    }
  }
`;

export const UPDATE_PAYMENT_GATEWAY_CONFIG = gql`
  mutation UpdatePaymentGatewayConfig($input: UpdateGatewayConfigInput!) {
    updatePaymentGatewayConfig(input: $input) {
      id
      gateway
      displayName
      description
      logoUrl
      isEnabled
      isDefault
      displayOrder
      supportedMethods
      sandboxMode
      processingFee
      processingFeeType
      paymentType
      instructions
      webhookUrl
      credentialHints
      hasCredentials
      updatedAt
    }
  }
`;

export const TOGGLE_PAYMENT_GATEWAY = gql`
  mutation TogglePaymentGateway($id: ID!, $enabled: Boolean!) {
    togglePaymentGateway(id: $id, enabled: $enabled) {
      id
      isEnabled
    }
  }
`;

export const SET_DEFAULT_PAYMENT_GATEWAY = gql`
  mutation SetDefaultPaymentGateway($id: ID!) {
    setDefaultPaymentGateway(id: $id) {
      id
      isDefault
    }
  }
`;

// ---------------------------------------------------------------------------
// Admin — Transactions
// ---------------------------------------------------------------------------

export const GET_ADMIN_PAYMENT_TRANSACTIONS = gql`
  query AdminPaymentTransactions(
    $page: Int = 1
    $pageSize: Int = 10
    $gateway: PaymentGateway
    $status: PaymentTransactionStatus
  ) {
    adminPaymentTransactions(
      page: $page
      pageSize: $pageSize
      gateway: $gateway
      status: $status
    ) {
      items {
        id
        orderId
        gateway
        method
        amount
        processingFee
        currency
        status
        gatewayOrderId
        gatewayPaymentId
        capturedAt
        failedAt
        createdAt
      }
      totalCount
      totalPages
      currentPage
      pageSize
    }
  }
`;

// ---------------------------------------------------------------------------
// Customer — Checkout
// ---------------------------------------------------------------------------

export const GET_ACTIVE_PAYMENT_GATEWAYS = gql`
  query ActivePaymentGateways {
    activePaymentGateways {
      id
      gateway
      displayName
      description
      logoUrl
      isDefault
      processingFee
      processingFeeType
      paymentType
      supportedMethods
    }
  }
`;

export const INITIATE_CHECKOUT = gql`
  mutation InitiateCheckout($input: InitiateCheckoutInput!) {
    initiateCheckout(input: $input) {
      orderId
      orderNumber
      gateway
      gatewayPayload
      requiresPayment
    }
  }
`;

export const VERIFY_PAYMENT = gql`
  mutation VerifyPayment($input: VerifyPaymentInput!) {
    verifyPayment(input: $input) {
      id
      orderNumber
      status
      paymentStatus
    }
  }
`;
