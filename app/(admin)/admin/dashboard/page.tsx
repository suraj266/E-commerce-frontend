/**
 * =============================================================================
 * Admin Dashboard Page
 * =============================================================================
 * 
 * This is the main landing page for the Admin Panel after login.
 * It displays key business metrics in stat cards, a bar chart for 
 * monthly revenue, and a recent orders table for quick overview.
 * 
 * Route: /admin/dashboard
 * Access: superAdmin, admin (protected via AuthProxy in layout)
 * =============================================================================
 */

"use client";

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

// ---------------------------------------------------------------------------
// Types - Dashboard specific data shapes
// ---------------------------------------------------------------------------

/** Single stat card data */
interface StatCard {
  title: string;
  value: string;
  change: string;
  changeType: "positive" | "negative";
  icon: React.ElementType;
  description: string;
}

/** Single order row in recent orders table */
interface RecentOrder {
  id: string;
  customer: string;
  product: string;
  amount: string;
  status: "Delivered" | "Processing" | "Pending" | "Cancelled";
  date: string;
}

// ---------------------------------------------------------------------------
// Mock Data - Will be replaced with real API calls later
// ---------------------------------------------------------------------------

const statsData: StatCard[] = [
  {
    title: "Total Revenue",
    value: "₹14,08,540",
    change: "+12.5%",
    changeType: "positive",
    icon: IndianRupee,
    description: "Since last month",
  },
  {
    title: "Total Orders",
    value: "2,345",
    change: "+8.2%",
    changeType: "positive",
    icon: ShoppingCart,
    description: "Since last month",
  },
  {
    title: "Total Products",
    value: "1,247",
    change: "-3.1%",
    changeType: "negative",
    icon: Package,
    description: "Active listings",
  },
  {
    title: "Active Users",
    value: "8,942",
    change: "+18.7%",
    changeType: "positive",
    icon: Users,
    description: "Since last month",
  },
];

const recentOrders: RecentOrder[] = [
  {
    id: "ORD-7842",
    customer: "Rajesh Kumar",
    product: "iPhone 15 Pro Max",
    amount: "₹1,34,900",
    status: "Delivered",
    date: "26 Apr 2026",
  },
  {
    id: "ORD-7841",
    customer: "Priya Sharma",
    product: "Samsung Galaxy S24 Ultra",
    amount: "₹1,29,999",
    status: "Processing",
    date: "25 Apr 2026",
  },
  {
    id: "ORD-7840",
    customer: "Amit Patel",
    product: "MacBook Air M3",
    amount: "₹1,14,900",
    status: "Pending",
    date: "25 Apr 2026",
  },
  {
    id: "ORD-7839",
    customer: "Sneha Verma",
    product: "Sony WH-1000XM5",
    amount: "₹29,990",
    status: "Delivered",
    date: "24 Apr 2026",
  },
  {
    id: "ORD-7838",
    customer: "Vikram Singh",
    product: "iPad Pro 12.9\"",
    amount: "₹1,12,900",
    status: "Cancelled",
    date: "24 Apr 2026",
  },
];

// ---------------------------------------------------------------------------
// Helper - Status badge color mapping
// ---------------------------------------------------------------------------

const statusStyles: Record<RecentOrder["status"], string> = {
  Delivered: "bg-emerald-50 text-emerald-700 border-emerald-200",
  Processing: "bg-blue-50 text-blue-700 border-blue-200",
  Pending: "bg-amber-50 text-amber-700 border-amber-200",
  Cancelled: "bg-red-50 text-red-700 border-red-200",
};

// ---------------------------------------------------------------------------
// Monthly Revenue Data (for simple bar chart)
// ---------------------------------------------------------------------------

const monthlyRevenue = [
  { month: "Jan", value: 45000 },
  { month: "Feb", value: 62000 },
  { month: "Mar", value: 58000 },
  { month: "Apr", value: 71000 },
  { month: "May", value: 89000 },
  { month: "Jun", value: 95000 },
  { month: "Jul", value: 110000 },
  { month: "Aug", value: 78000 },
  { month: "Sep", value: 102000 },
  { month: "Oct", value: 125000 },
  { month: "Nov", value: 140000 },
  { month: "Dec", value: 118000 },
];

const maxRevenue = Math.max(...monthlyRevenue.map((m) => m.value));

// ===========================================================================
// Component: AdminDashboard
// ===========================================================================

export default function AdminDashboardPage() {
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
        {statsData.map((stat) => (
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
                {stat.changeType === "positive" ? (
                  <TrendingUp className="h-3.5 w-3.5 text-emerald-600" />
                ) : (
                  <TrendingDown className="h-3.5 w-3.5 text-red-500" />
                )}
                <span
                  className={`text-xs font-medium ${
                    stat.changeType === "positive"
                      ? "text-emerald-600"
                      : "text-red-500"
                  }`}
                >
                  {stat.change}
                </span>
                <span className="text-xs text-muted-foreground">
                  {stat.description}
                </span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* ----- Charts + Activity Section ----- */}
      <div className="grid gap-4 lg:grid-cols-7">
        {/* Revenue Bar Chart (5 cols) */}
        <Card className="lg:col-span-4">
          <CardHeader>
            <CardTitle className="text-lg">Monthly Revenue</CardTitle>
            <p className="text-sm text-muted-foreground">
              Revenue breakdown for the current year
            </p>
          </CardHeader>
          <CardContent>
            {/* Simple CSS bar chart - no heavy charting library needed */}
            <div className="flex items-end gap-2 h-[220px]">
              {monthlyRevenue.map((item) => (
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
          </CardContent>
        </Card>

        {/* Quick Stats Card (2 cols) */}
        <Card className="lg:col-span-3">
          <CardHeader>
            <CardTitle className="text-lg">Quick Stats</CardTitle>
            <p className="text-sm text-muted-foreground">
              Platform performance at a glance
            </p>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Stat item */}
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <p className="text-sm font-medium">Conversion Rate</p>
                <p className="text-xs text-muted-foreground">Visitors → Buyers</p>
              </div>
              <div className="text-right">
                <p className="text-xl font-bold">3.24%</p>
                <p className="text-xs text-emerald-600 flex items-center justify-end gap-0.5">
                  <TrendingUp className="h-3 w-3" /> +0.8%
                </p>
              </div>
            </div>

            <div className="h-px bg-border" />

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <p className="text-sm font-medium">Avg. Order Value</p>
                <p className="text-xs text-muted-foreground">Per transaction</p>
              </div>
              <div className="text-right">
                <p className="text-xl font-bold">₹4,560</p>
                <p className="text-xs text-emerald-600 flex items-center justify-end gap-0.5">
                  <TrendingUp className="h-3 w-3" /> +5.2%
                </p>
              </div>
            </div>

            <div className="h-px bg-border" />

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <p className="text-sm font-medium">Active Sellers</p>
                <p className="text-xs text-muted-foreground">Verified vendors</p>
              </div>
              <div className="text-right">
                <p className="text-xl font-bold">128</p>
                <p className="text-xs text-emerald-600 flex items-center justify-end gap-0.5">
                  <TrendingUp className="h-3 w-3" /> +12
                </p>
              </div>
            </div>

            <div className="h-px bg-border" />

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <p className="text-sm font-medium">Pending Returns</p>
                <p className="text-xs text-muted-foreground">Needs action</p>
              </div>
              <div className="text-right">
                <p className="text-xl font-bold">23</p>
                <p className="text-xs text-red-500 flex items-center justify-end gap-0.5">
                  <TrendingDown className="h-3 w-3" /> +7
                </p>
              </div>
            </div>
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
                <TableHead>Order ID</TableHead>
                <TableHead>Customer</TableHead>
                <TableHead>Product</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Date</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {recentOrders.map((order) => (
                <TableRow key={order.id} className="cursor-pointer hover:bg-muted/50">
                  <TableCell className="font-medium">{order.id}</TableCell>
                  <TableCell>{order.customer}</TableCell>
                  <TableCell className="max-w-[200px] truncate">
                    {order.product}
                  </TableCell>
                  <TableCell className="font-medium">{order.amount}</TableCell>
                  <TableCell>
                    <Badge
                      variant="outline"
                      className={statusStyles[order.status]}
                    >
                      {order.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right text-muted-foreground">
                    {order.date}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
