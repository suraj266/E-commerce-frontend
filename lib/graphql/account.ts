import { gql } from "@apollo/client";
import { ADMIN_CUSTOMER_FIELDS } from "./customers";

export const GET_MY_PROFILE = gql`
  ${ADMIN_CUSTOMER_FIELDS}
  query GetMyProfile {
    myProfile {
      ...AdminCustomerFields
    }
  }
`;

export const UPDATE_MY_PROFILE = gql`
  ${ADMIN_CUSTOMER_FIELDS}
  mutation UpdateMyProfile($input: UpdateMyProfileInput!) {
    updateMyProfile(input: $input) {
      ...AdminCustomerFields
    }
  }
`;

export const ADDRESS_FIELDS = gql`
  fragment AddressFields on Address {
    id
    userId
    type
    label
    firstName
    lastName
    phone
    addressLine1
    addressLine2
    city
    state
    postalCode
    countryCode
    isDefault
  }
`;

export const GET_MY_ADDRESSES = gql`
  ${ADDRESS_FIELDS}
  query GetMyAddresses {
    myAddresses {
      ...AddressFields
    }
  }
`;

export const ADD_MY_ADDRESS = gql`
  ${ADDRESS_FIELDS}
  mutation AddMyAddress($input: CreateAddressInput!) {
    addMyAddress(input: $input) {
      ...AddressFields
    }
  }
`;

export const UPDATE_MY_ADDRESS = gql`
  ${ADDRESS_FIELDS}
  mutation UpdateMyAddress($input: UpdateAddressInput!) {
    updateMyAddress(input: $input) {
      ...AddressFields
    }
  }
`;

export const SET_MY_DEFAULT_ADDRESS = gql`
  ${ADDRESS_FIELDS}
  mutation SetMyDefaultAddress($id: ID!) {
    setMyDefaultAddress(id: $id) {
      ...AddressFields
    }
  }
`;

export const REMOVE_MY_ADDRESS = gql`
  ${ADDRESS_FIELDS}
  mutation RemoveMyAddress($id: ID!) {
    removeMyAddress(id: $id) {
      ...AddressFields
    }
  }
`;
