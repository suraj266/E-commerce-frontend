/**
 * Admin dashboard types — mirror backend `AdminDashboardStats` object.
 */

export type OrderStatus =
  | "PENDING"
  | "CONFIRMED"
  | "PACKED"
  | "SHIPPED"
  | "DELIVERED"
  | "CANCELLED"
  | "REFUNDED";

export interface StatDelta {
  current: number;
  previous: number;
  changePct: number;
}

export interface MonthlyRevenuePoint {
  month: string;
  value: number;
}

export interface RecentOrderItem {
  id: string;
  orderNumber: string;
  customerName: string;
  productSummary: string;
  totalAmount: number;
  status: OrderStatus;
  placedAt: string;
}

export interface AdminDashboardStats {
  totalRevenue: StatDelta;
  totalOrders: StatDelta;
  totalProducts: StatDelta;
  activeUsers: StatDelta;
  monthlyRevenue: MonthlyRevenuePoint[];
  conversionRate: number;
  avgOrderValue: number;
  activeSellers: number;
  pendingReturns: number;
  recentOrders: RecentOrderItem[];
}

export interface GetAdminDashboardStatsData {
  adminDashboardStats: AdminDashboardStats;
}
