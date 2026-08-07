/**
 * Seller Dashboard — /seller/dashboard
 *
 * Landing page after seller login. Shows:
 *  - Welcome with seller name
 *  - KYC progress card (gates further actions)
 *  - Quick links to Products / Orders / Payouts (placeholder, not built yet)
 */

"use client";

import Link from "next/link";
import type { ComponentType } from "react";
import { useQuery } from "@apollo/client/react";
import {
  ShieldCheck,
  Package,
  ShoppingBag,
  Wallet,
  ArrowRight,
  Loader2,
  CheckCircle2,
  Clock,
  AlertTriangle,
  IndianRupee,
  TrendingUp,
  TrendingDown,
  ShoppingCart,
} from "lucide-react";

import { GET_MY_SELLER } from "@/lib/graphql/sellers";
import {
  GET_MY_SELLER_STATS,
  type MySellerStatsData,
  type SellerStats,
} from "@/lib/graphql/seller-stats";
import {
  GetMySellerData,
  Seller,
  SellerStatus,
  BUSINESS_TYPE_LABELS,
} from "@/types/seller.types";
import { useAuthStore } from "@/store/auth.store";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { formatPrice } from "@/lib/utils/currency";

const STATUS_BADGE: Record<
  SellerStatus,
  "default" | "secondary" | "destructive" | "outline"
> = {
  DRAFT: "outline",
  PENDING: "secondary",
  UNDER_REVIEW: "secondary",
  VERIFIED: "default",
  REJECTED: "destructive",
  SUSPENDED: "destructive",
};

export default function SellerDashboardPage() {
  const user = useAuthStore((s) => s.user);
  const { data, loading } = useQuery<GetMySellerData>(GET_MY_SELLER);
  const seller = data?.mySeller ?? null;
  const verified = seller?.overallStatus === "VERIFIED";

  // Real earnings/sales analytics — only fetched once the seller can transact
  // (VERIFIED). `mySellerStats` is scoped to the caller's own store server-side.
  const { data: statsData, loading: statsLoading } =
    useQuery<MySellerStatsData>(GET_MY_SELLER_STATS, {
      skip: !verified,
      fetchPolicy: "cache-and-network",
    });
  const stats = statsData?.mySellerStats ?? null;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">
          Welcome{user?.name ? `, ${user.name}` : ""}
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          Manage your seller profile and business from here.
        </p>
      </div>

      {loading ? (
        <div className="rounded-lg border bg-card p-8 flex items-center justify-center">
          <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
        </div>
      ) : !seller ? (
        <KycEmptyCard />
      ) : (
        <KycProgressCard seller={seller} />
      )}

      {verified && (
        <SellerAnalytics stats={stats} loading={statsLoading && !stats} />
      )}

      <QuickLinks verified={verified} />
    </div>
  );
}

// ---------------------------------------------------------------------------
// KYC progress card variants
// ---------------------------------------------------------------------------
function KycEmptyCard() {
  return (
    <div className="rounded-lg border bg-card p-6 space-y-4">
      <div className="flex items-start gap-3">
        <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
          <ShieldCheck className="h-5 w-5 text-primary" />
        </div>
        <div className="flex-1">
          <h2 className="font-semibold">Complete your KYC</h2>
          <p className="text-sm text-muted-foreground mt-1">
            Add your business details, tax info, and contact to start selling
            on the platform.
          </p>
        </div>
      </div>
      <Button asChild>
        <Link href="/seller/onboarding">
          Start onboarding
          <ArrowRight className="h-4 w-4 ml-2" />
        </Link>
      </Button>
    </div>
  );
}

function KycProgressCard({ seller }: { seller: Seller }) {
  const sectionState = (verifiedAt: string | null | undefined) => !!verifiedAt;
  const sections = [
    { label: "PAN Card", verified: sectionState(seller.panVerifiedAt) },
    {
      label: "GSTIN",
      verified: sectionState(seller.gstinVerifiedAt),
      skipped: !seller.gstin,
    },
    { label: "Bank Account", verified: sectionState(seller.bankVerifiedAt) },
    { label: "Documents", verified: sectionState(seller.documentsVerifiedAt) },
  ];

  return (
    <div className="rounded-lg border bg-card p-6 space-y-4">
      <div className="flex items-start gap-3">
        <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
          {seller.overallStatus === "VERIFIED" ? (
            <CheckCircle2 className="h-5 w-5 text-primary" />
          ) : seller.overallStatus === "REJECTED" ||
            seller.overallStatus === "SUSPENDED" ? (
            <AlertTriangle className="h-5 w-5 text-destructive" />
          ) : (
            <Clock className="h-5 w-5 text-primary" />
          )}
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <h2 className="font-semibold">{seller.displayName}</h2>
            <Badge
              variant={STATUS_BADGE[seller.overallStatus]}
              className="capitalize text-xs"
            >
              {seller.overallStatus.replace(/_/g, " ").toLowerCase()}
            </Badge>
          </div>
          <p className="text-sm text-muted-foreground mt-0.5">
            {seller.legalName} · {BUSINESS_TYPE_LABELS[seller.businessType]}
          </p>
        </div>
      </div>

      {seller.rejectionReason && (
        <div className="rounded-md border border-destructive/50 bg-destructive/10 p-3 text-sm">
          <div className="font-semibold text-destructive">
            {seller.overallStatus === "SUSPENDED"
              ? "Suspension reason"
              : "Rejection reason"}
          </div>
          <div className="mt-1 text-muted-foreground">
            {seller.rejectionReason}
          </div>
        </div>
      )}

      <div>
        <div className="text-sm font-semibold mb-2">KYC Sections</div>
        <ul className="space-y-1.5 text-sm">
          {sections.map((s) => (
            <li
              key={s.label}
              className="flex items-center justify-between rounded-md bg-muted/40 px-3 py-2"
            >
              <span>{s.label}</span>
              {s.skipped ? (
                <span className="text-xs text-muted-foreground">
                  Not provided
                </span>
              ) : s.verified ? (
                <span className="text-xs flex items-center gap-1 text-primary font-medium">
                  <CheckCircle2 className="h-3.5 w-3.5" />
                  Verified
                </span>
              ) : (
                <span className="text-xs text-muted-foreground flex items-center gap-1">
                  <Clock className="h-3.5 w-3.5" />
                  Pending
                </span>
              )}
            </li>
          ))}
        </ul>
      </div>

      {(seller.overallStatus === "DRAFT" ||
        seller.overallStatus === "REJECTED") && (
        <Button asChild>
          <Link href="/seller/onboarding">
            {seller.overallStatus === "REJECTED"
              ? "Edit & resubmit"
              : "Continue onboarding"}
            <ArrowRight className="h-4 w-4 ml-2" />
          </Link>
        </Button>
      )}

      {seller.overallStatus === "PENDING" && (
        <p className="text-sm text-muted-foreground">
          Submitted for review. The platform team will get back shortly.
        </p>
      )}

      {seller.overallStatus === "UNDER_REVIEW" && (
        <p className="text-sm text-muted-foreground">
          Verification in progress. Some sections are already approved.
        </p>
      )}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Quick links — locked until verified
// ---------------------------------------------------------------------------
function QuickLinks({ verified }: { verified: boolean }) {
  const tiles = [
    {
      label: "Products",
      desc: "Add and manage your catalog",
      icon: Package,
      href: "/seller/products",
    },
    {
      label: "Orders",
      desc: "Fulfill incoming orders",
      icon: ShoppingBag,
      href: "/seller/orders",
    },
    {
      label: "Payouts",
      desc: "Bank accounts and payout history",
      icon: Wallet,
      href: "/seller/payouts",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {tiles.map((t) => {
        const Icon = t.icon;
        const disabled = !verified;
        return (
          <div
            key={t.label}
            className={`rounded-lg border p-5 ${
              disabled
                ? "bg-muted/30 opacity-60"
                : "bg-card hover:bg-muted/30 transition-colors"
            }`}
          >
            <div className="flex items-start justify-between mb-3">
              <Icon className="h-6 w-6 text-primary" />
              {disabled && (
                <Badge variant="outline" className="text-xs">
                  Locked
                </Badge>
              )}
            </div>
            <div className="font-semibold">{t.label}</div>
            <div className="text-xs text-muted-foreground mt-0.5">{t.desc}</div>
            {disabled && (
              <div className="text-xs text-muted-foreground mt-2">
                Available after KYC is verified.
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Seller analytics — real earnings/sales aggregations (mySellerStats), scoped
// server-side to the caller's own store. Shown once the seller is VERIFIED.
// ---------------------------------------------------------------------------
function SellerAnalytics({
  stats,
  loading,
}: {
  stats: SellerStats | null;
  loading: boolean;
}) {
  if (loading) {
    return (
      <div className="rounded-lg border bg-card p-8 flex items-center justify-center">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    );
  }
  if (!stats) return null;

  const monthly = stats.monthlyEarnings ?? [];
  const maxEarnings = Math.max(1, ...monthly.map((m) => m.value));
  const noEarnings = monthly.every((m) => m.value === 0);

  return (
    <div className="space-y-4">
      {/* Earnings + payout tiles */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <SellerStatTile
          icon={IndianRupee}
          label="Net This Month"
          value={formatPrice(stats.netEarningsThisMonth, "INR")}
          delta={stats.netEarningsChangePct}
        />
        <SellerStatTile
          icon={Wallet}
          label="Lifetime Net"
          value={formatPrice(stats.lifetimeNetEarnings, "INR")}
          sub="After commission"
        />
        <SellerStatTile
          icon={Clock}
          label="Pending Payout"
          value={formatPrice(stats.pendingPayoutAmount, "INR")}
          sub="Awaiting settlement"
        />
        <SellerStatTile
          icon={CheckCircle2}
          label="Paid Out"
          value={formatPrice(stats.paidPayoutAmount, "INR")}
          sub="Settled to date"
        />
      </div>

      {/* Order pipeline */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
        <SellerStatTile
          icon={ShoppingCart}
          label="Orders This Month"
          value={stats.ordersThisMonth.toLocaleString("en-IN")}
          delta={stats.ordersChangePct}
          compact
        />
        <SellerStatTile
          icon={Clock}
          label="Pending"
          value={stats.pendingOrders.toLocaleString("en-IN")}
          compact
        />
        <SellerStatTile
          icon={Package}
          label="To Ship"
          value={stats.toShipOrders.toLocaleString("en-IN")}
          compact
        />
        <SellerStatTile
          icon={CheckCircle2}
          label="Delivered"
          value={stats.deliveredOrders.toLocaleString("en-IN")}
          compact
        />
        <SellerStatTile
          icon={AlertTriangle}
          label="Cancelled"
          value={stats.cancelledOrders.toLocaleString("en-IN")}
          compact
        />
      </div>

      <div className="grid gap-4 lg:grid-cols-5">
        {/* Monthly net-earnings chart */}
        <div className="rounded-lg border bg-card p-5 lg:col-span-3">
          <div className="mb-4">
            <h2 className="font-semibold">Net Earnings</h2>
            <p className="text-xs text-muted-foreground">
              Payouts by month, current year
            </p>
          </div>
          {noEarnings ? (
            <div className="flex h-[200px] items-center justify-center text-sm text-muted-foreground">
              No earnings yet.
            </div>
          ) : (
            <div className="flex h-[200px] items-end gap-1.5">
              {monthly.map((m) => (
                <div
                  key={m.label}
                  className="flex flex-1 flex-col items-center gap-1"
                  title={`${m.label}: ${formatPrice(m.value, "INR")}`}
                >
                  <div
                    className="min-h-[3px] w-full rounded-t-md bg-primary/80 transition-colors hover:bg-primary"
                    style={{ height: `${(m.value / maxEarnings) * 160}px` }}
                  />
                  <span className="text-[9px] text-muted-foreground">
                    {m.label}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Best sellers */}
        <div className="rounded-lg border bg-card p-5 lg:col-span-2">
          <div className="mb-4">
            <h2 className="font-semibold">Best Sellers</h2>
            <p className="text-xs text-muted-foreground">
              Top products, last 30 days
            </p>
          </div>
          {stats.bestSellers.length === 0 ? (
            <div className="flex h-[160px] items-center justify-center text-sm text-muted-foreground">
              No sales in the last 30 days.
            </div>
          ) : (
            <ul className="space-y-2">
              {stats.bestSellers.map((b) => (
                <li
                  key={b.productId}
                  className="flex items-center justify-between gap-3 rounded-md bg-muted/40 px-3 py-2"
                >
                  <span className="min-w-0 flex-1 truncate text-sm font-medium">
                    {b.name}
                  </span>
                  <span className="whitespace-nowrap text-xs text-muted-foreground">
                    {b.unitsSold} sold
                  </span>
                  <span className="whitespace-nowrap text-sm font-semibold">
                    {formatPrice(b.revenue, "INR")}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}

function SellerStatTile({
  icon: Icon,
  label,
  value,
  sub,
  delta,
  compact,
}: {
  icon: ComponentType<{ className?: string }>;
  label: string;
  value: string;
  sub?: string;
  delta?: number;
  compact?: boolean;
}) {
  const positive = (delta ?? 0) >= 0;
  return (
    <div className="rounded-lg border bg-card p-4">
      <div className="flex items-center justify-between">
        <span className="text-xs font-medium text-muted-foreground">
          {label}
        </span>
        <Icon className="h-4 w-4 text-primary" />
      </div>
      <div className={`mt-1 font-bold ${compact ? "text-xl" : "text-2xl"}`}>
        {value}
      </div>
      {delta !== undefined ? (
        <div className="mt-1 flex items-center gap-1">
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
            {positive ? "+" : ""}
            {delta.toFixed(1)}%
          </span>
          <span className="text-xs text-muted-foreground">vs last month</span>
        </div>
      ) : sub ? (
        <p className="mt-1 text-xs text-muted-foreground">{sub}</p>
      ) : null}
    </div>
  );
}
