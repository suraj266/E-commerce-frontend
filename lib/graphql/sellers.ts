/**
 * =============================================================================
 * Seller GraphQL Operations
 * =============================================================================
 * KYC-aware: separates self-onboarding mutations from admin verification.
 * =============================================================================
 */

import { gql } from "@apollo/client";

export const PAYOUT_ACCOUNT_FIELDS = gql`
  fragment PayoutAccountFields on SellerPayoutAccount {
    id
    sellerId
    accountType
    accountHolderName
    accountNumber
    ifscCode
    bankName
    upiId
    walletProvider
    isPrimary
    isVerified
    createdAt
    updatedAt
  }
`;

export const SELLER_FIELDS = gql`
  ${PAYOUT_ACCOUNT_FIELDS}
  fragment SellerFields on Seller {
    id
    userId
    legalName
    displayName
    businessType
    dateOfIncorporation
    registrationNumber
    panNumber
    gstin
    businessEmail
    businessPhone
    supportEmail
    signatoryName
    signatoryPan
    signatoryDesignation
    overallStatus
    panVerifiedAt
    gstinVerifiedAt
    bankVerifiedAt
    documentsVerifiedAt
    rejectionReason
    commissionRate
    createdAt
    updatedAt
    payoutAccounts {
      ...PayoutAccountFields
    }
  }
`;

// ---------------------------------------------------------------------------
// Self queries
// ---------------------------------------------------------------------------
export const GET_MY_SELLER = gql`
  ${SELLER_FIELDS}
  query GetMySeller {
    mySeller {
      ...SellerFields
    }
  }
`;

// ---------------------------------------------------------------------------
// Admin queries
// ---------------------------------------------------------------------------
export const GET_SELLERS = gql`
  ${SELLER_FIELDS}
  query GetSellers($status: SellerStatus) {
    sellers(status: $status) {
      ...SellerFields
    }
  }
`;

/**
 * Returns ALL seller-role users with their funnel status — including those
 * who registered but haven't started onboarding. Use this on the admin
 * sellers list page so it shows the full pipeline.
 */
export const GET_SELLER_USERS = gql`
  ${SELLER_FIELDS}
  query GetSellerUsers($status: SellerListStatus) {
    sellerUsers(status: $status) {
      userId
      name
      email
      phone
      emailVerifiedAt
      registeredAt
      status
      seller {
        ...SellerFields
      }
    }
  }
`;

export const GET_SELLER = gql`
  ${SELLER_FIELDS}
  query GetSeller($id: ID!) {
    seller(id: $id) {
      ...SellerFields
    }
  }
`;

// ---------------------------------------------------------------------------
// Self-onboarding mutations
// ---------------------------------------------------------------------------
export const CREATE_MY_SELLER = gql`
  ${SELLER_FIELDS}
  mutation CreateMySeller($createSellerInput: CreateSellerInput!) {
    createMySeller(createSellerInput: $createSellerInput) {
      ...SellerFields
    }
  }
`;

export const UPDATE_MY_SELLER = gql`
  ${SELLER_FIELDS}
  mutation UpdateMySeller($updateSellerInput: UpdateSellerInput!) {
    updateMySeller(updateSellerInput: $updateSellerInput) {
      ...SellerFields
    }
  }
`;

export const SUBMIT_MY_SELLER_FOR_REVIEW = gql`
  ${SELLER_FIELDS}
  mutation SubmitMySellerForReview($id: ID!) {
    submitMySellerForReview(id: $id) {
      ...SellerFields
    }
  }
`;

// ---------------------------------------------------------------------------
// Admin mutations
// ---------------------------------------------------------------------------
export const VERIFY_SELLER_SECTION = gql`
  ${SELLER_FIELDS}
  mutation VerifySellerSection(
    $verifySectionInput: VerifySellerSectionInput!
  ) {
    verifySellerSection(verifySectionInput: $verifySectionInput) {
      ...SellerFields
    }
  }
`;

export const SET_SELLER_STATUS = gql`
  ${SELLER_FIELDS}
  mutation SetSellerStatus($setStatusInput: SetSellerStatusInput!) {
    setSellerStatus(setStatusInput: $setStatusInput) {
      ...SellerFields
    }
  }
`;

export const REMOVE_SELLER = gql`
  ${SELLER_FIELDS}
  mutation RemoveSeller($id: ID!) {
    removeSeller(id: $id) {
      ...SellerFields
    }
  }
`;
