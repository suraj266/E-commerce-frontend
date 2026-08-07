/**
 * Admin Dashboard GraphQL operations.
 *
 * - `adminDashboardStats` (admin) — aggregated metrics for /admin/dashboard:
 *   revenue/orders/products/users with MoM deltas, monthly revenue chart,
 *   quick stats (conversion, AOV, sellers, returns), and recent orders.
 */

import { gql } from "@apollo/client";

import type { OrderStatus } from "@/types/dashboard.types";

export const GET_ADMIN_DASHBOARD_STATS = gql`
  query GetAdminDashboardStats {
    adminDashboardStats {
      totalRevenue {
        current
        previous
        changePct
      }
      totalOrders {
        current
        previous
        changePct
      }
      totalProducts {
        current
        previous
        changePct
      }
      activeUsers {
        current
        previous
        changePct
      }
      monthlyRevenue {
        month
        value
      }
      conversionRate
      avgOrderValue
      activeSellers
      pendingReturns
      recentOrders {
        id
        orderNumber
        customerName
        productSummary
        totalAmount
        status
        placedAt
      }
    }
  }
`;

/**
 * `adminAnalytics` (admin) — date-range scoped platform analytics for
 * /admin/dashboard: net-of-refunds revenue, time-bucketed GMV series
 * (day/week/month), order counts by status, new signups, and the top
 * product / seller leaderboards. Auth: `dashboard:read`.
 */
export const GET_ADMIN_ANALYTICS = gql`
  query GetAdminAnalytics($input: AnalyticsRangeInput) {
    adminAnalytics(input: $input) {
      range {
        from
        to
        granularity
      }
      revenue {
        gross
        refunds
        net
        orderCount
        avgOrderValue
      }
      newSignups {
        users
        sellers
      }
      gmvSeries {
        bucket
        label
        gmv
        orderCount
      }
      ordersByStatus {
        status
        count
      }
      topProducts {
        productId
        name
        unitsSold
        grossRevenue
      }
      topSellers {
        sellerId
        sellerName
        orderCount
        gmv
        netPayable
      }
    }
  }
`;

export type AnalyticsBucket = "DAY" | "WEEK" | "MONTH";

export interface AnalyticsRangeInput {
  from?: string;
  to?: string;
  granularity?: AnalyticsBucket;
  topLimit?: number;
}

export interface AnalyticsRange {
  from: string;
  to: string;
  granularity: AnalyticsBucket;
}

export interface RevenueSummary {
  gross: number;
  refunds: number;
  net: number;
  orderCount: number;
  avgOrderValue: number;
}

export interface NewSignups {
  users: number;
  sellers: number;
}

export interface AnalyticsSeriesPoint {
  bucket: string;
  label: string;
  gmv: number;
  orderCount: number;
}

export interface OrderStatusCount {
  status: OrderStatus;
  count: number;
}

export interface TopProduct {
  productId: string;
  name: string;
  unitsSold: number;
  grossRevenue: number;
}

export interface TopSeller {
  sellerId: string;
  sellerName: string;
  orderCount: number;
  gmv: number;
  netPayable: number;
}

export interface AdminAnalytics {
  range: AnalyticsRange;
  revenue: RevenueSummary;
  newSignups: NewSignups;
  gmvSeries: AnalyticsSeriesPoint[];
  ordersByStatus: OrderStatusCount[];
  topProducts: TopProduct[];
  topSellers: TopSeller[];
}

export interface GetAdminAnalyticsData {
  adminAnalytics: AdminAnalytics;
}
