import { gql } from "@apollo/client";

const ADMIN_THEME_FIELDS = gql`
  fragment AdminThemeFields on AdminTheme {
    id
    primaryLight
    primaryDark
    accentLight
    accentDark
    sidebarLight
    sidebarDark
    destructiveLight
    destructiveDark
    radius
    fontFamily
    updatedAt
    updatedById
  }
`;

export const GET_ADMIN_THEME = gql`
  ${ADMIN_THEME_FIELDS}
  query GetAdminTheme {
    adminTheme {
      ...AdminThemeFields
    }
  }
`;

export const UPDATE_ADMIN_THEME = gql`
  ${ADMIN_THEME_FIELDS}
  mutation UpdateAdminTheme(
    $updateAdminThemeInput: UpdateAdminThemeInput!
  ) {
    updateAdminTheme(updateAdminThemeInput: $updateAdminThemeInput) {
      ...AdminThemeFields
    }
  }
`;

export const RESET_ADMIN_THEME = gql`
  ${ADMIN_THEME_FIELDS}
  mutation ResetAdminTheme {
    resetAdminTheme {
      ...AdminThemeFields
    }
  }
`;
