import { gql } from "@apollo/client";

/**
 * DPDP (P3-07) privacy operations for the storefront /account/privacy page:
 * data export (portability), account deletion (erasure), and marketing consent.
 * All are scoped to the signed-in customer server-side.
 */

export const DATA_EXPORT_FIELDS = gql`
  fragment DataExportFields on DataExportRequestEntity {
    id
    status
    fileUrl
    expiresAt
    requestedAt
    completedAt
    createdAt
  }
`;

export const ACCOUNT_DELETION_FIELDS = gql`
  fragment AccountDeletionFields on AccountDeletionRequestEntity {
    id
    status
    requestedAt
    executeAfter
    anonymizedAt
    cancelledAt
  }
`;

// --- Data export -------------------------------------------------------------

export const MY_DATA_EXPORTS = gql`
  ${DATA_EXPORT_FIELDS}
  query MyDataExports {
    myDataExports {
      ...DataExportFields
    }
  }
`;

export const REQUEST_MY_DATA_EXPORT = gql`
  ${DATA_EXPORT_FIELDS}
  mutation RequestMyDataExport {
    requestMyDataExport {
      ...DataExportFields
    }
  }
`;

// --- Account deletion (erasure) ----------------------------------------------

export const MY_ACCOUNT_DELETION = gql`
  ${ACCOUNT_DELETION_FIELDS}
  query MyAccountDeletion {
    myAccountDeletion {
      ...AccountDeletionFields
    }
  }
`;

export const REQUEST_MY_ACCOUNT_DELETION = gql`
  ${ACCOUNT_DELETION_FIELDS}
  mutation RequestMyAccountDeletion {
    requestMyAccountDeletion {
      ...AccountDeletionFields
    }
  }
`;

export const CANCEL_MY_ACCOUNT_DELETION = gql`
  ${ACCOUNT_DELETION_FIELDS}
  mutation CancelMyAccountDeletion {
    cancelMyAccountDeletion {
      ...AccountDeletionFields
    }
  }
`;

// --- Marketing consent -------------------------------------------------------

export const MY_MARKETING_CONSENT = gql`
  query MyMarketingConsent {
    myMarketingConsent {
      granted
    }
  }
`;

export const UPDATE_MY_MARKETING_CONSENT = gql`
  mutation UpdateMyMarketingConsent($input: UpdateMarketingConsentInput!) {
    updateMyMarketingConsent(input: $input) {
      granted
    }
  }
`;
