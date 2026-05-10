/**
 * Admin-side customer types — mirrors the backend AdminCustomer GraphQL
 * entity. Fields are flattened (extension + user) for convenience in the
 * admin table and detail sheet.
 */

export const USER_STATUSES = [
  "active",
  "inactive",
  "suspended",
  "banned",
] as const;
export type UserStatus = (typeof USER_STATUSES)[number];

export const USER_STATUS_LABEL: Record<UserStatus, string> = {
  active: "Active",
  inactive: "Inactive",
  suspended: "Suspended",
  banned: "Banned",
};

export interface AdminCustomer {
  id: string;
  userId: string;
  marketingOptIn: boolean;
  preferredCurrency: string;
  createdAt: string;
  updatedAt: string;
  deletedAt?: string | null;
  // flattened user
  name: string;
  email: string;
  phone?: string | null;
  status?: string | null;
  emailVerifiedAt?: string | null;
  lastLoginAt?: string | null;
  userCreatedAt: string;
}

export interface PaginatedAdminCustomers {
  items: AdminCustomer[];
  totalCount: number;
  totalPages: number;
  currentPage: number;
  pageSize: number;
}

export interface UpdateCustomerInput {
  id: string;
  name?: string;
  phone?: string;
  status?: UserStatus;
  marketingOptIn?: boolean;
  preferredCurrency?: string;
}

export interface AdminCustomersData {
  adminCustomers: PaginatedAdminCustomers;
}
export interface AdminCustomerData {
  adminCustomer: AdminCustomer;
}
export interface UpdateCustomerData {
  updateCustomer: AdminCustomer;
}
export interface SoftDeleteCustomerData {
  softDeleteCustomer: AdminCustomer;
}
export interface RestoreCustomerData {
  restoreCustomer: AdminCustomer;
}
