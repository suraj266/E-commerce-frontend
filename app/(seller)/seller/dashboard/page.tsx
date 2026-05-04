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
} from "lucide-react";

import { GET_MY_SELLER } from "@/lib/graphql/sellers";
import {
  GetMySellerData,
  Seller,
  SellerStatus,
  BUSINESS_TYPE_LABELS,
} from "@/types/seller.types";
import { useAuthStore } from "@/store/auth.store";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

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

      <QuickLinks verified={seller?.overallStatus === "VERIFIED"} />
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
