/**
 * Admin Dashboard GraphQL operations.
 *
 * - `adminDashboardStats` (admin) — aggregated metrics for /admin/dashboard:
 *   revenue/orders/products/users with MoM deltas, monthly revenue chart,
 *   quick stats (conversion, AOV, sellers, returns), and recent orders.
 */

import { gql } from "@apollo/client";

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
