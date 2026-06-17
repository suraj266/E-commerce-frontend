/**
 * Courier-account GraphQL operations (per-seller). Credentials are write-only —
 * queries return only masked status fields.
 */

import { gql } from "@apollo/client";
import { SELLER_ORDER_FIELDS } from "./orders";

export const COURIER_ACCOUNT_FIELDS = gql`
  fragment CourierAccountFields on CourierAccountSafe {
    id
    provider
    status
    isEnabled
    hasCredentials
    pickupLocationNickname
    webhookConfigured
    lastError
    lastTestedAt
    createdAt
    updatedAt
  }
`;

export const GET_MY_COURIER_ACCOUNTS = gql`
  ${COURIER_ACCOUNT_FIELDS}
  query MyCourierAccounts {
    myCourierAccounts {
      ...CourierAccountFields
    }
  }
`;

export const GET_COURIER_WEBHOOK_URL = gql`
  query CourierWebhookUrl {
    courierWebhookUrl
  }
`;

export const CONNECT_COURIER_ACCOUNT = gql`
  ${COURIER_ACCOUNT_FIELDS}
  mutation ConnectCourierAccount($input: ConnectCourierAccountInput!) {
    connectCourierAccount(input: $input) {
      ...CourierAccountFields
    }
  }
`;

export const TEST_COURIER_CONNECTION = gql`
  ${COURIER_ACCOUNT_FIELDS}
  mutation TestCourierConnection($provider: CourierProvider!) {
    testCourierConnection(provider: $provider) {
      ...CourierAccountFields
    }
  }
`;

export const SET_COURIER_ACCOUNT_ENABLED = gql`
  ${COURIER_ACCOUNT_FIELDS}
  mutation SetCourierAccountEnabled($provider: CourierProvider!, $enabled: Boolean!) {
    setCourierAccountEnabled(provider: $provider, enabled: $enabled) {
      ...CourierAccountFields
    }
  }
`;

export const GET_COURIER_PICKUP_LOCATIONS = gql`
  query CourierPickupLocations($provider: CourierProvider!) {
    courierPickupLocations(provider: $provider) {
      id
      nickname
      name
      address
      city
      state
      pincode
      phone
    }
  }
`;

export const SET_COURIER_WEBHOOK_TOKEN = gql`
  ${COURIER_ACCOUNT_FIELDS}
  mutation SetCourierWebhookToken($provider: CourierProvider!, $token: String!) {
    setCourierWebhookToken(provider: $provider, token: $token) {
      ...CourierAccountFields
    }
  }
`;

export const SET_COURIER_PICKUP_LOCATION = gql`
  ${COURIER_ACCOUNT_FIELDS}
  mutation SetCourierPickupLocation($provider: CourierProvider!, $nickname: String!) {
    setCourierPickupLocation(provider: $provider, nickname: $nickname) {
      ...CourierAccountFields
    }
  }
`;

export const GET_COURIER_OPTIONS_FOR_ORDER = gql`
  query CourierOptionsForOrder($sellerOrderId: ID!) {
    courierOptionsForOrder(sellerOrderId: $sellerOrderId) {
      selectedCourierId
      selectedCourierName
      couriers {
        courierId
        courierName
        rate
        estimatedDays
        codAvailable
        recommended
      }
    }
  }
`;

export const SHIP_VIA_COURIER = gql`
  ${SELLER_ORDER_FIELDS}
  mutation ShipViaCourier($sellerOrderId: ID!, $courierId: String!) {
    shipViaCourier(sellerOrderId: $sellerOrderId, courierId: $courierId) {
      ...SellerOrderFields
    }
  }
`;
