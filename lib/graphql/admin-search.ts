/**
 * Global admin-search GraphQL operations.
 *
 * These back the header command palette (<AdminSearch />). They deliberately
 * reuse the EXISTING resolvers that already accept a text-search argument —
 * `searchProducts` (Phase-4 Postgres FTS, public), `adminOrders(search)`
 * (order:read) and `adminCustomers(search)` (customer:read) — but each selects
 * only the few fields the palette renders (id + a label + enough to build a
 * link), so a keystroke-driven search stays cheap. No new backend surface.
 *
 * Each source is permission-gated client-side before it runs (see AdminSearch),
 * mirroring the resolver's own PermissionsGuard so we never fire a query the
 * viewer would get a 403 for.
 */

import { gql } from "@apollo/client";

// ---------------------------------------------------------------------------
// Products — public Postgres FTS (searchProducts). NOTE: the FTS index only
// covers publicly-visible products, so DRAFT/ARCHIVED items won't surface here.
// ---------------------------------------------------------------------------
export const ADMIN_SEARCH_PRODUCTS = gql`
  query AdminSearchProducts($query: String!, $pageSize: Int) {
    searchProducts(query: $query, page: 1, pageSize: $pageSize) {
      items {
        id
        name
        slug
        status
        price
      }
      totalCount
    }
  }
`;

export interface AdminSearchProductItem {
  id: string;
  name: string;
  slug: string;
  status: string;
  price: number;
}

export interface AdminSearchProductsData {
  searchProducts: {
    items: AdminSearchProductItem[];
    totalCount: number;
  };
}

// ---------------------------------------------------------------------------
// Orders — adminOrders(search) (order:read / invoice:manage)
// ---------------------------------------------------------------------------
export const ADMIN_SEARCH_ORDERS = gql`
  query AdminSearchOrders($search: String, $pageSize: Int) {
    adminOrders(search: $search, page: 1, pageSize: $pageSize) {
      items {
        id
        orderNumber
        status
        paymentStatus
        totalAmount
        currencyCode
      }
      totalCount
    }
  }
`;

export interface AdminSearchOrderItem {
  id: string;
  orderNumber: string;
  status: string;
  paymentStatus: string;
  totalAmount: number;
  currencyCode: string;
}

export interface AdminSearchOrdersData {
  adminOrders: {
    items: AdminSearchOrderItem[];
    totalCount: number;
  };
}

// ---------------------------------------------------------------------------
// Customers — adminCustomers(search) (customer:read)
// ---------------------------------------------------------------------------
export const ADMIN_SEARCH_CUSTOMERS = gql`
  query AdminSearchCustomers($search: String, $pageSize: Int) {
    adminCustomers(search: $search, page: 1, pageSize: $pageSize) {
      items {
        id
        name
        email
        phone
        status
      }
      totalCount
    }
  }
`;

export interface AdminSearchCustomerItem {
  id: string;
  name: string | null;
  email: string | null;
  phone: string | null;
  status: string;
}

export interface AdminSearchCustomersData {
  adminCustomers: {
    items: AdminSearchCustomerItem[];
    totalCount: number;
  };
}
