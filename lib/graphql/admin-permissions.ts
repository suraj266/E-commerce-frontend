/**
 * `myPermissions` (P3-06) — the current session's own permission slugs
 * (`module:action`), added to the RoleResolver for this wave. No permission
 * gate: any authenticated user may read their OWN grants. Powers the
 * client-side hidden-nav half of the per-permission route gate.
 */
import { gql } from "@apollo/client";

export const GET_MY_PERMISSIONS = gql`
  query GetMyPermissions {
    myPermissions
  }
`;

export interface MyPermissionsData {
  myPermissions: string[];
}
