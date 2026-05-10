/**
 * Menu GraphQL operations.
 *
 * `publicMenu(location)` is publicly readable for the storefront header
 * and footer renderers. Admin queries/mutations are gated by `menu:*`
 * permissions.
 */

import { gql } from "@apollo/client";

export const MENU_FIELDS = gql`
  fragment MenuFields on Menu {
    id
    name
    location
    isActive
    items
    createdAt
    updatedAt
  }
`;

// ---------------------------------------------------------------------------
// Queries
// ---------------------------------------------------------------------------

export const GET_PUBLIC_MENU = gql`
  ${MENU_FIELDS}
  query GetPublicMenu($location: MenuLocation!) {
    publicMenu(location: $location) {
      ...MenuFields
    }
  }
`;

export const GET_ADMIN_MENUS = gql`
  ${MENU_FIELDS}
  query GetAdminMenus {
    adminMenus {
      ...MenuFields
    }
  }
`;

export const GET_ADMIN_MENU = gql`
  ${MENU_FIELDS}
  query GetAdminMenu($location: MenuLocation!) {
    adminMenu(location: $location) {
      ...MenuFields
    }
  }
`;

// ---------------------------------------------------------------------------
// Mutations
// ---------------------------------------------------------------------------

export const UPSERT_MENU = gql`
  ${MENU_FIELDS}
  mutation UpsertMenu($upsertMenuInput: UpsertMenuInput!) {
    upsertMenu(upsertMenuInput: $upsertMenuInput) {
      ...MenuFields
    }
  }
`;

export const SET_MENU_ACTIVE = gql`
  ${MENU_FIELDS}
  mutation SetMenuActive($location: MenuLocation!, $isActive: Boolean!) {
    setMenuActive(location: $location, isActive: $isActive) {
      ...MenuFields
    }
  }
`;

export const REMOVE_MENU = gql`
  ${MENU_FIELDS}
  mutation RemoveMenu($location: MenuLocation!) {
    removeMenu(location: $location) {
      ...MenuFields
    }
  }
`;
