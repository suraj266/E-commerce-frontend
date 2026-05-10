/**
 * Site Settings GraphQL operations.
 *
 * Public query for storefront (no auth needed).
 * Admin mutation for updating settings.
 */

import { gql } from "@apollo/client";

// ---------------------------------------------------------------------------
// Public
// ---------------------------------------------------------------------------

export const GET_SITE_SETTINGS = gql`
  query GetSiteSettings($group: SettingGroup) {
    siteSettings(group: $group) {
      id
      key
      value
      group
      label
      description
      valueType
      createdAt
      updatedAt
    }
  }
`;

// ---------------------------------------------------------------------------
// Admin
// ---------------------------------------------------------------------------

export const UPDATE_SITE_SETTING = gql`
  mutation UpdateSiteSetting($input: UpdateSiteSettingInput!) {
    updateSiteSetting(input: $input) {
      id
      key
      value
      group
      label
      description
      valueType
      updatedAt
    }
  }
`;
