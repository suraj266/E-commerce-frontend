/**
 * Admin role / permission-matrix operations (P3-06) — consumes the RoleResolver.
 * The assign/revoke mutations were added to the role backend for this wave:
 *   Query    roles: [Role]                                (role:read)
 *   Query    permissions: [Permission]                    (permission:read | role:read)
 *   Mutation assignPermission(roleId, permissionId): Role (permission:update)
 *   Mutation revokePermission(roleId, permissionId): Role (permission:update)
 *
 * Each mutation returns the affected role re-hydrated with its full permission
 * set, so one toggle updates a whole matrix row from the payload.
 */
import { gql } from "@apollo/client";

export const PERMISSION_FIELDS = gql`
  fragment PermissionFields on Permission {
    id
    module
    action
    slug
    description
  }
`;

export const ROLE_FIELDS = gql`
  ${PERMISSION_FIELDS}
  fragment RoleFields on Role {
    id
    name
    description
    isDefault
    createdAt
    updatedAt
    permissions {
      ...PermissionFields
    }
  }
`;

export const GET_ADMIN_ROLES = gql`
  ${ROLE_FIELDS}
  query GetAdminRoles {
    roles {
      ...RoleFields
    }
  }
`;

export const GET_ADMIN_PERMISSIONS_CATALOG = gql`
  ${PERMISSION_FIELDS}
  query GetAdminPermissionsCatalog {
    permissions {
      ...PermissionFields
    }
  }
`;

export const ASSIGN_PERMISSION = gql`
  ${ROLE_FIELDS}
  mutation AssignPermission($roleId: ID!, $permissionId: ID!) {
    assignPermission(roleId: $roleId, permissionId: $permissionId) {
      ...RoleFields
    }
  }
`;

export const REVOKE_PERMISSION = gql`
  ${ROLE_FIELDS}
  mutation RevokePermission($roleId: ID!, $permissionId: ID!) {
    revokePermission(roleId: $roleId, permissionId: $permissionId) {
      ...RoleFields
    }
  }
`;

export interface AdminPermission {
  id: string;
  module: string;
  action: string;
  slug: string;
  description?: string | null;
}

export interface AdminRole {
  id: string;
  name: string;
  description?: string | null;
  isDefault?: boolean | null;
  createdAt: string;
  updatedAt: string;
  permissions?: AdminPermission[] | null;
}

export interface AdminRolesData {
  roles: AdminRole[];
}
export interface AdminPermissionsCatalogData {
  permissions: AdminPermission[];
}
export interface AssignPermissionData {
  assignPermission: AdminRole;
}
export interface RevokePermissionData {
  revokePermission: AdminRole;
}
