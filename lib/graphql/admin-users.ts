/**
 * Admin platform-user operations (P3-06) — consumes the existing UserResolver
 * (these are staff/admin accounts with a Role; storefront shoppers live under
 * /admin/customers):
 *   Query    users: [User]                         (user:read)
 *   Mutation updateUser(updateUserInput): User      (user:update)
 *
 * A create flow is intentionally omitted — new users self-register or are
 * provisioned out of band; the admin surface manages status + role assignment.
 */
import { gql } from "@apollo/client";

// NOTE: the `users` query resolves off prisma.user.findMany() with no role
// include and there is no User.role field resolver — so only the scalar
// `roleId` is populated. The page maps `roleId` → role name using the roles
// catalog (GET_ADMIN_ROLES). We intentionally do NOT request `role { ... }`
// here (it would always resolve null).
export const ADMIN_USER_FIELDS = gql`
  fragment AdminUserFields on User {
    id
    name
    email
    phone
    status
    roleId
    emailVerifiedAt
    lastLoginAt
    createdAt
    updatedAt
  }
`;

export const GET_ADMIN_USERS = gql`
  ${ADMIN_USER_FIELDS}
  query GetAdminUsers {
    users {
      ...AdminUserFields
    }
  }
`;

export const UPDATE_ADMIN_USER = gql`
  ${ADMIN_USER_FIELDS}
  mutation UpdateAdminUser($updateUserInput: UpdateUserInput!) {
    updateUser(updateUserInput: $updateUserInput) {
      ...AdminUserFields
    }
  }
`;

export const ADMIN_USER_STATUSES = [
  "active",
  "inactive",
  "suspended",
  "banned",
] as const;
export type AdminUserStatus = (typeof ADMIN_USER_STATUSES)[number];

export const ADMIN_USER_STATUS_LABEL: Record<AdminUserStatus, string> = {
  active: "Active",
  inactive: "Inactive",
  suspended: "Suspended",
  banned: "Banned",
};

export interface AdminUser {
  id: string;
  name?: string | null;
  email: string;
  phone?: string | null;
  status?: string | null;
  roleId?: string | null;
  emailVerifiedAt?: string | null;
  lastLoginAt?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface AdminUsersData {
  users: AdminUser[];
}
export interface UpdateAdminUserData {
  updateUser: AdminUser;
}

/* ===========================================================================
 * Server-paginated admin user console (Phase 3 Wave 4)
 * ---------------------------------------------------------------------------
 * Consumes the NEW UserResolver operations:
 *   Query    adminUsers(search, status, roleId, page, pageSize): PaginatedUsers
 *              (user:read) — includes the `role` relation so the role name is
 *              rendered without the roles catalog.
 *   Mutation setUserStatus(id, status): User   (user:update)
 * ======================================================================== */

export const GET_ADMIN_USERS_PAGINATED = gql`
  query GetAdminUsersPaginated(
    $search: String
    $status: String
    $roleId: ID
    $page: Int
    $pageSize: Int
  ) {
    adminUsers(
      search: $search
      status: $status
      roleId: $roleId
      page: $page
      pageSize: $pageSize
    ) {
      items {
        id
        name
        email
        phone
        status
        roleId
        role {
          id
          name
        }
        emailVerifiedAt
        lastLoginAt
        createdAt
        updatedAt
      }
      totalCount
      totalPages
      currentPage
      pageSize
    }
  }
`;

export const SET_USER_STATUS = gql`
  mutation SetUserStatus($id: ID!, $status: String!) {
    setUserStatus(id: $id, status: $status) {
      id
      status
    }
  }
`;

export interface AdminUserRole {
  id: string;
  name: string;
}

export interface AdminUserRow extends AdminUser {
  role?: AdminUserRole | null;
}

export interface PaginatedAdminUsers {
  items: AdminUserRow[];
  totalCount: number;
  totalPages: number;
  currentPage: number;
  pageSize: number;
}

export interface AdminUsersPaginatedData {
  adminUsers: PaginatedAdminUsers;
}
export interface SetUserStatusData {
  setUserStatus: { id: string; status?: string | null };
}
