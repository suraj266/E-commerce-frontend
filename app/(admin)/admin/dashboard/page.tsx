/**
 * =============================================================================
 * Admin Dashboard Page
 * =============================================================================
 *
 * Main landing page for the Admin Panel after login. Renders aggregated
 * platform metrics fetched from `adminDashboardStats` (NestJS GraphQL).
 *
 * Route: /admin/dashboard
 * Access: superAdmin, admin (gated by JwtAuthGuard + `dashboard:read`)
 * =============================================================================
 */

"use client";

import { useEffect } from "react";
import { useQuery } from "@apollo/client/react";
import { toast } from "sonner";
import {
  Package,
  ShoppingCart,
  Users,
  IndianRupee,
  TrendingUp,
  TrendingDown,
  ArrowUpRight,
} from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

import { GET_ADMIN_DASHBOARD_STATS } from "@/lib/graphql/dashboard";
import type {
  GetAdminDashboardStatsData,
  OrderStatus,
  StatDelta,
} from "@/types/dashboard.types";
import { formatPrice } from "@/lib/utils/currency";

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

const ORDER_STATUS_STYLES: Record<OrderStatus, string> = {
  DELIVERED: "bg-emerald-50 text-emerald-700 border-emerald-200",
  SHIPPED: "bg-blue-50 text-blue-700 border-blue-200",
  PACKED: "bg-indigo-50 text-indigo-700 border-indigo-200",
  CONFIRMED: "bg-cyan-50 text-cyan-700 border-cyan-200",
  PENDING: "bg-amber-50 text-amber-700 border-amber-200",
  CANCELLED: "bg-red-50 text-red-700 border-red-200",
  REFUNDED: "bg-zinc-100 text-zinc-700 border-zinc-200",
};

const ORDER_STATUS_LABEL: Record<OrderStatus, string> = {
  DELIVERED: "Delivered",
  SHIPPED: "Shipped",
  PACKED: "Packed",
  CONFIRMED: "Confirmed",
  PENDING: "Pending",
  CANCELLED: "Cancelled",
  REFUNDED: "Refunded",
};

function formatDelta(d: StatDelta): { label: string; positive: boolean } {
  const positive = d.changePct >= 0;
  const label = `${positive ? "+" : ""}${d.changePct.toFixed(1)}%`;
  return { label, positive };
}

function formatPlacedAt(iso: string): string {
  return new Date(iso).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

// ===========================================================================
// Component
// ===========================================================================

export default function AdminDashboardPage() {
  const { data, loading, error } = useQuery<GetAdminDashboardStatsData>(
    GET_ADMIN_DASHBOARD_STATS,
    { fetchPolicy: "cache-and-network" },
  );

  useEffect(() => {
    if (error) toast.error(`Failed to load dashboard: ${error.message}`);
  }, [error]);

  const stats = data?.adminDashboardStats;
  const showSkeletons = loading && !stats;

  const statCards = stats
    ? [
        {
          title: "Total Revenue",
          value: formatPrice(stats.totalRevenue.current, "INR"),
          delta: stats.totalRevenue,
          icon: IndianRupee,
          description: "Since last month",
        },
        {
          title: "Total Orders",
          value: stats.totalOrders.current.toLocaleString("en-IN"),
          delta: stats.totalOrders,
          icon: ShoppingCart,
          description: "Since last month",
        },
        {
          title: "Total Products",
          value: stats.totalProducts.current.toLocaleString("en-IN"),
          delta: stats.totalProducts,
          icon: Package,
          description: "Active listings",
        },
        {
          title: "Active Users",
          value: stats.activeUsers.current.toLocaleString("en-IN"),
          delta: stats.activeUsers,
          icon: Users,
          description: "Since last month",
        },
      ]
    : [];

  const monthly = stats?.monthlyRevenue ?? [];
  const maxRevenue = Math.max(1, ...monthly.map((m) => m.value));

  return (
    <div className="space-y-6">
      {/* ----- Page Header ----- */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground mt-1">
            Welcome back! Here&apos;s what&apos;s happening with your store.
          </p>
        </div>
        <Button className="gap-2">
          <ArrowUpRight className="h-4 w-4" />
          View Reports
        </Button>
      </div>

      {/* ----- Stat Cards Grid ----- */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {showSkeletons
          ? Array.from({ length: 4 }).map((_, i) => (
              <Card key={i} className="relative overflow-hidden">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-8 w-8 rounded-md" />
                </CardHeader>
                <CardContent>
                  <Skeleton className="h-8 w-32" />
                  <Skeleton className="h-3 w-40 mt-2" />
                </CardContent>
              </Card>
            ))
          : statCards.map((stat) => {
              const { label, positive } = formatDelta(stat.delta);
              return (
                <Card key={stat.title} className="relative overflow-hidden">
                  <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-sm font-medium text-muted-foreground">
                      {stat.title}
                    </CardTitle>
                    <div className="rounded-md bg-primary/10 p-2">
                      <stat.icon className="h-4 w-4 text-primary" />
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{stat.value}</div>
                    <div className="flex items-center gap-1 mt-1">
                      {positive ? (
                        <TrendingUp className="h-3.5 w-3.5 text-emerald-600" />
                      ) : (
                        <TrendingDown className="h-3.5 w-3.5 text-red-500" />
                      )}
                      <span
                        className={`text-xs font-medium ${
                          positive ? "text-emerald-600" : "text-red-500"
                        }`}
                      >
                        {label}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        {stat.description}
                      </span>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
      </div>

      {/* ----- Charts + Activity Section ----- */}
      <div className="grid gap-4 lg:grid-cols-7">
        {/* Revenue Bar Chart */}
        <Card className="lg:col-span-4">
          <CardHeader>
            <CardTitle className="text-lg">Monthly Revenue</CardTitle>
            <p className="text-sm text-muted-foreground">
              Revenue breakdown for the current year
            </p>
          </CardHeader>
          <CardContent>
            {showSkeletons ? (
              <Skeleton className="h-[220px] w-full" />
            ) : (
              <div className="flex items-end gap-2 h-[220px]">
                {monthly.map((item) => (
                  <div
                    key={item.month}
                    className="flex-1 flex flex-col items-center gap-1"
                  >
                    <span className="text-[10px] text-muted-foreground font-medium">
                      ₹{(item.value / 1000).toFixed(0)}k
                    </span>
                    <div
                      className="w-full rounded-t-md bg-primary/80 hover:bg-primary transition-colors cursor-pointer min-h-[4px]"
                      style={{
                        height: `${(item.value / maxRevenue) * 180}px`,
                      }}
                    />
                    <span className="text-[10px] text-muted-foreground">
                      {item.month}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Quick Stats */}
        <Card className="lg:col-span-3">
          <CardHeader>
            <CardTitle className="text-lg">Quick Stats</CardTitle>
            <p className="text-sm text-muted-foreground">
              Platform performance at a glance
            </p>
          </CardHeader>
          <CardContent className="space-y-6">
            {showSkeletons ? (
              Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="flex items-center justify-between">
                  <div className="space-y-1">
                    <Skeleton className="h-4 w-28" />
                    <Skeleton className="h-3 w-20" />
                  </div>
                  <Skeleton className="h-6 w-16" />
                </div>
              ))
            ) : (
              <>
                <QuickStatRow
                  label="Conversion Rate"
                  sub="Buyers / Total users"
                  value={`${(stats?.conversionRate ?? 0).toFixed(2)}%`}
                />
                <div className="h-px bg-border" />
                <QuickStatRow
                  label="Avg. Order Value"
                  sub="Per transaction"
                  value={formatPrice(stats?.avgOrderValue ?? 0, "INR")}
                />
                <div className="h-px bg-border" />
                <QuickStatRow
                  label="Active Sellers"
                  sub="Verified vendors"
                  value={(stats?.activeSellers ?? 0).toLocaleString("en-IN")}
                />
                <div className="h-px bg-border" />
                <QuickStatRow
                  label="Pending Returns"
                  sub="Refunded orders"
                  value={(stats?.pendingReturns ?? 0).toLocaleString("en-IN")}
                />
              </>
            )}
          </CardContent>
        </Card>
      </div>

      {/* ----- Recent Orders Table ----- */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle className="text-lg">Recent Orders</CardTitle>
            <p className="text-sm text-muted-foreground">
              Latest orders across the platform
            </p>
          </div>
          <Button variant="outline" size="sm">
            View All
          </Button>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Order #</TableHead>
                <TableHead>Customer</TableHead>
                <TableHead>Product</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Date</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {showSkeletons ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <TableRow key={i}>
                    {Array.from({ length: 6 }).map((__, j) => (
                      <TableCell key={j}>
                        <Skeleton className="h-4 w-full" />
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : stats && stats.recentOrders.length > 0 ? (
                stats.recentOrders.map((order) => (
                  <TableRow
                    key={order.id}
                    className="cursor-pointer hover:bg-muted/50"
                  >
                    <TableCell className="font-medium">
                      {order.orderNumber}
                    </TableCell>
                    <TableCell>{order.customerName}</TableCell>
                    <TableCell className="max-w-[200px] truncate">
                      {order.productSummary}
                    </TableCell>
                    <TableCell className="font-medium">
                      {formatPrice(order.totalAmount, "INR")}
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant="outline"
                        className={ORDER_STATUS_STYLES[order.status]}
                      >
                        {ORDER_STATUS_LABEL[order.status]}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right text-muted-foreground">
                      {formatPlacedAt(order.placedAt)}
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={6}
                    className="text-center text-muted-foreground py-8"
                  >
                    No orders yet.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Sub-component: a single Quick Stats row
// ---------------------------------------------------------------------------
function QuickStatRow({
  label,
  sub,
  value,
}: {
  label: string;
  sub: string;
  value: string;
}) {
  return (
    <div className="flex items-center justify-between">
      <div className="space-y-0.5">
        <p className="text-sm font-medium">{label}</p>
        <p className="text-xs text-muted-foreground">{sub}</p>
      </div>
      <div className="text-right">
        <p className="text-xl font-bold">{value}</p>
      </div>
    </div>
  );
}
