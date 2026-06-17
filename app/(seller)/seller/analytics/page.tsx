/**
 * Seller Analytics — /seller/analytics
 *
 * Earnings + sales dashboard backed by the `mySellerStats` query (aggregates
 * the seller's own SellerOrders). KPI cards, a 12-month net-earnings bar chart
 * (CSS, mirroring the admin dashboard — no chart lib), pipeline counts, and a
 * best-sellers leaderboard.
 */

"use client";

import { useQuery } from "@apollo/client/react";
import {
  TrendingUp,
  TrendingDown,
  Wallet,
  ShoppingBag,
  Receipt,
  Loader2,
  BarChart3,
  Trophy,
  Clock,
  Package,
  CheckCircle2,
  XCircle,
} from "lucide-react";

import {
  GET_MY_SELLER_STATS,
  MySellerStatsData,
} from "@/lib/graphql/seller-stats";

function formatINR(value: number, compact = false): string {
  try {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
      notation: compact ? "compact" : "standard",
    }).format(value);
  } catch {
    return `₹${Math.round(value).toLocaleString("en-IN")}`;
  }
}

function DeltaBadge({ pct }: { pct: number }) {
  const up = pct >= 0;
  const Icon = up ? TrendingUp : TrendingDown;
  return (
    <span
      className={`inline-flex items-center gap-0.5 text-xs font-medium ${
        up ? "text-green-600" : "text-destructive"
      }`}
    >
      <Icon className="h-3.5 w-3.5" />
      {Math.abs(pct).toFixed(1)}%
    </span>
  );
}

function KpiCard({
  label,
  value,
  icon: Icon,
  delta,
  hint,
}: {
  label: string;
  value: string;
  icon: typeof Wallet;
  delta?: number;
  hint?: string;
}) {
  return (
    <div className="rounded-lg border bg-card p-5">
      <div className="flex items-center justify-between">
        <span className="text-sm text-muted-foreground">{label}</span>
        <Icon className="h-4 w-4 text-muted-foreground" />
      </div>
      <div className="mt-2 text-2xl font-bold tracking-tight">{value}</div>
      <div className="mt-1 flex items-center gap-2">
        {delta !== undefined && <DeltaBadge pct={delta} />}
        {hint && <span className="text-xs text-muted-foreground">{hint}</span>}
      </div>
    </div>
  );
}

export default function SellerAnalyticsPage() {
  const { data, loading, error } = useQuery<MySellerStatsData>(
    GET_MY_SELLER_STATS,
    { fetchPolicy: "cache-and-network" },
  );
  const stats = data?.mySellerStats;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight flex items-center gap-2">
          <BarChart3 className="h-6 w-6 text-primary" />
          Analytics
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          Your earnings, orders, and best-selling products at a glance.
        </p>
      </div>

      {loading && !stats && (
        <div className="rounded-lg border bg-card p-8 flex items-center justify-center">
          <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
        </div>
      )}

      {error && !stats && (
        <div className="rounded-lg border border-destructive/50 bg-destructive/10 p-4 text-sm text-destructive">
          Couldn’t load analytics: {error.message}
        </div>
      )}

      {stats && (
        <>
          {/* KPI cards */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <KpiCard
              label="Net earnings (this month)"
              value={formatINR(stats.netEarningsThisMonth)}
              icon={Wallet}
              delta={stats.netEarningsChangePct}
              hint="vs last month"
            />
            <KpiCard
              label="Pending payout"
              value={formatINR(stats.pendingPayoutAmount)}
              icon={Receipt}
              hint={`${formatINR(stats.paidPayoutAmount)} paid out`}
            />
            <KpiCard
              label="Orders (this month)"
              value={String(stats.ordersThisMonth)}
              icon={ShoppingBag}
              delta={stats.ordersChangePct}
              hint="vs last month"
            />
            <KpiCard
              label="Lifetime earnings"
              value={formatINR(stats.lifetimeNetEarnings)}
              icon={TrendingUp}
              hint={`Avg order ${formatINR(stats.avgOrderValue)}`}
            />
          </div>

          {/* Pipeline counts */}
          <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
            <PipelineStat
              label="Pending"
              value={stats.pendingOrders}
              icon={Clock}
            />
            <PipelineStat
              label="To ship"
              value={stats.toShipOrders}
              icon={Package}
            />
            <PipelineStat
              label="Delivered"
              value={stats.deliveredOrders}
              icon={CheckCircle2}
            />
            <PipelineStat
              label="Cancelled"
              value={stats.cancelledOrders}
              icon={XCircle}
            />
          </div>

          <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
            {/* Monthly earnings bar chart */}
            <div className="rounded-lg border bg-card p-5 lg:col-span-2">
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-semibold">Net earnings by month</h2>
                <span className="text-xs text-muted-foreground">
                  Commission: {formatINR(stats.lifetimeCommission)} lifetime
                </span>
              </div>
              <MonthlyBars points={stats.monthlyEarnings} />
            </div>

            {/* Best sellers */}
            <div className="rounded-lg border bg-card p-5">
              <h2 className="font-semibold flex items-center gap-2 mb-4">
                <Trophy className="h-4 w-4 text-primary" />
                Best sellers
                <span className="text-xs font-normal text-muted-foreground">
                  (last 30 days)
                </span>
              </h2>
              {stats.bestSellers.length === 0 ? (
                <p className="text-sm text-muted-foreground py-6 text-center">
                  No sales in the last 30 days yet.
                </p>
              ) : (
                <ul className="space-y-3">
                  {stats.bestSellers.map((b, i) => (
                    <li
                      key={b.productId}
                      className="flex items-center gap-3 text-sm"
                    >
                      <span className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-muted text-xs font-semibold">
                        {i + 1}
                      </span>
                      <div className="min-w-0 flex-1">
                        <div className="truncate font-medium">{b.name}</div>
                        <div className="text-xs text-muted-foreground">
                          {b.unitsSold} sold · {formatINR(b.revenue)}
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}

function PipelineStat({
  label,
  value,
  icon: Icon,
}: {
  label: string;
  value: number;
  icon: typeof Clock;
}) {
  return (
    <div className="rounded-lg border bg-card p-4 flex items-center gap-3">
      <div className="h-9 w-9 rounded-md bg-muted flex items-center justify-center flex-shrink-0">
        <Icon className="h-5 w-5 text-muted-foreground" />
      </div>
      <div>
        <div className="text-xl font-bold leading-none">{value}</div>
        <div className="text-xs text-muted-foreground mt-1">{label}</div>
      </div>
    </div>
  );
}

function MonthlyBars({ points }: { points: { label: string; value: number }[] }) {
  const max = Math.max(1, ...points.map((p) => p.value));
  return (
    <div className="flex items-end gap-2 h-[200px]">
      {points.map((p) => (
        <div
          key={p.label}
          className="flex-1 flex flex-col items-center gap-1 min-w-0"
        >
          <span className="text-[10px] text-muted-foreground font-medium">
            {p.value > 0 ? formatINR(p.value, true) : ""}
          </span>
          <div
            className="w-full rounded-t-md bg-primary/80 hover:bg-primary transition-colors min-h-[2px]"
            style={{ height: `${(p.value / max) * 160}px` }}
            title={`${p.label}: ${formatINR(p.value)}`}
          />
          <span className="text-[10px] text-muted-foreground">{p.label}</span>
        </div>
      ))}
    </div>
  );
}
