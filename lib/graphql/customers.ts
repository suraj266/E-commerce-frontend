import { gql } from "@apollo/client";

export const ADMIN_CUSTOMER_FIELDS = gql`
  fragment AdminCustomerFields on AdminCustomer {
    id
    userId
    name
    email
    phone
    status
    emailVerifiedAt
    lastLoginAt
    userCreatedAt
    marketingOptIn
    preferredCurrency
    createdAt
    updatedAt
    deletedAt
  }
`;

export const GET_ADMIN_CUSTOMERS = gql`
  ${ADMIN_CUSTOMER_FIELDS}
  query GetAdminCustomers(
    $status: String
    $search: String
    $includeDeleted: Boolean
    $page: Int
    $pageSize: Int
  ) {
    adminCustomers(
      status: $status
      search: $search
      includeDeleted: $includeDeleted
      page: $page
      pageSize: $pageSize
    ) {
      items {
        ...AdminCustomerFields
      }
      totalCount
      totalPages
      currentPage
      pageSize
    }
  }
`;

export const GET_ADMIN_CUSTOMER = gql`
  ${ADMIN_CUSTOMER_FIELDS}
  query GetAdminCustomer($id: ID!) {
    adminCustomer(id: $id) {
      ...AdminCustomerFields
    }
  }
`;

export const UPDATE_CUSTOMER = gql`
  ${ADMIN_CUSTOMER_FIELDS}
  mutation UpdateCustomer($input: UpdateCustomerInput!) {
    updateCustomer(input: $input) {
      ...AdminCustomerFields
    }
  }
`;

export const SOFT_DELETE_CUSTOMER = gql`
  ${ADMIN_CUSTOMER_FIELDS}
  mutation SoftDeleteCustomer($id: ID!) {
    softDeleteCustomer(id: $id) {
      ...AdminCustomerFields
    }
  }
`;

export const RESTORE_CUSTOMER = gql`
  ${ADMIN_CUSTOMER_FIELDS}
  mutation RestoreCustomer($id: ID!) {
    restoreCustomer(id: $id) {
      ...AdminCustomerFields
    }
  }
`;
