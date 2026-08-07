"use client";

/**
 * Seller Business Profile — /seller/profile
 *
 * A dedicated view of the seller's business + KYC record (read from
 * `mySeller`). Contact / storefront fields (display name, business email &
 * phone, support email) are inline-editable via `updateMySeller` while the
 * profile is in DRAFT or REJECTED — the exact server rule the onboarding
 * wizard enforces (`update()` throws outside DRAFT/REJECTED). KYC / structural
 * fields (legal name, PAN, GSTIN, state, signatory) carry cross-field
 * validation that lives in the onboarding wizard, so we link there rather than
 * duplicate that form here.
 */

import { useEffect, useState } from "react";
import Link from "next/link";
import { useQuery, useMutation } from "@apollo/client/react";
import {
  Building2,
  Loader2,
  Save,
  ShieldCheck,
  ArrowRight,
  Wallet,
  CheckCircle2,
  Clock,
} from "lucide-react";
import { toast } from "sonner";

import { GET_MY_SELLER, UPDATE_MY_SELLER } from "@/lib/graphql/sellers";
import {
  GetMySellerData,
  UpdateMySellerData,
  Seller,
  SellerStatus,
  BUSINESS_TYPE_LABELS,
  PHONE_REGEX,
} from "@/types/seller.types";
import { useSetPageTitle } from "@/components/shell/page-title-context";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function SellerProfilePage() {
  useSetPageTitle("Business Profile");

  const { data, loading, refetch } = useQuery<GetMySellerData>(GET_MY_SELLER, {
    fetchPolicy: "cache-and-network",
  });
  const seller = data?.mySeller ?? null;

  if (loading && !seller) {
    return (
      <div className="flex h-64 items-center justify-center">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (!seller) {
    return (
      <div className="space-y-6">
        <Header />
        <div className="rounded-lg border bg-card p-6">
          <div className="flex items-start gap-3">
            <div className="h-10 w-10 rounded-full bg-muted flex items-center justify-center flex-shrink-0">
              <ShieldCheck className="h-5 w-5 text-muted-foreground" />
            </div>
            <div>
              <h2 className="font-semibold">You haven&apos;t started onboarding</h2>
              <p className="text-sm text-muted-foreground mt-1">
                Complete your KYC to create your seller profile and start
                selling.
              </p>
              <Button asChild variant="outline" className="mt-4">
                <Link href="/seller/onboarding">
                  Begin KYC
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const editable =
    seller.overallStatus === "DRAFT" || seller.overallStatus === "REJECTED";

  return (
    <div className="space-y-6">
      <Header status={seller.overallStatus} />

      {seller.overallStatus === "REJECTED" && seller.rejectionReason && (
        <div className="rounded-md border border-destructive/50 bg-destructive/10 p-3 text-sm">
          <div className="font-semibold text-destructive">
            Your submission was rejected
          </div>
          <div className="mt-1 text-muted-foreground">
            {seller.rejectionReason}
          </div>
          <div className="mt-1 text-xs text-muted-foreground">
            Update your details below (or in KYC) and re-submit.
          </div>
        </div>
      )}

      {/* Contact / storefront — inline editable while DRAFT / REJECTED */}
      <ContactSection
        seller={seller}
        editable={editable}
        onSaved={() => refetch()}
      />

      {/* Business identity — read-only; edited in the onboarding wizard */}
      <BusinessSection seller={seller} editable={editable} />

      {/* KYC verification status */}
      <KycSection seller={seller} />
    </div>
  );
}

/* -------------------------------------------------------------------------- */

function Header({ status }: { status?: SellerStatus }) {
  return (
    <div className="flex items-start justify-between gap-4">
      <div>
        <h1 className="text-2xl font-bold tracking-tight flex items-center gap-2">
          <Building2 className="h-6 w-6 text-primary" />
          Business Profile
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          Your legal, tax, and contact details on the marketplace.
        </p>
      </div>
      {status && (
        <Badge variant={STATUS_BADGE[status]} className="capitalize text-xs">
          {status.replace(/_/g, " ").toLowerCase()}
        </Badge>
      )}
    </div>
  );
}

interface ContactForm {
  displayName: string;
  businessEmail: string;
  businessPhone: string;
  supportEmail: string;
}

function ContactSection({
  seller,
  editable,
  onSaved,
}: {
  seller: Seller;
  editable: boolean;
  onSaved: () => void;
}) {
  const [updateMySeller] = useMutation<UpdateMySellerData>(UPDATE_MY_SELLER);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState<ContactForm>({
    displayName: seller.displayName ?? "",
    businessEmail: seller.businessEmail ?? "",
    businessPhone: seller.businessPhone ?? "",
    supportEmail: seller.supportEmail ?? "",
  });

  // Re-seed if the server record changes (e.g. after a refetch).
  useEffect(() => {
    setForm({
      displayName: seller.displayName ?? "",
      businessEmail: seller.businessEmail ?? "",
      businessPhone: seller.businessPhone ?? "",
      supportEmail: seller.supportEmail ?? "",
    });
  }, [seller]);

  const set = <K extends keyof ContactForm>(k: K, v: ContactForm[K]) =>
    setForm((f) => ({ ...f, [k]: v }));

  const dirty =
    form.displayName !== (seller.displayName ?? "") ||
    form.businessEmail !== (seller.businessEmail ?? "") ||
    form.businessPhone !== (seller.businessPhone ?? "") ||
    form.supportEmail !== (seller.supportEmail ?? "");

  const validate = (): string | null => {
    if (form.displayName.trim().length < 2) return "Display name is required.";
    if (!EMAIL_RE.test(form.businessEmail.trim()))
      return "Enter a valid business email.";
    if (!PHONE_REGEX.test(form.businessPhone.trim()))
      return "Enter a valid India phone (10 digits, optional +91).";
    if (form.supportEmail.trim() && !EMAIL_RE.test(form.supportEmail.trim()))
      return "Enter a valid support email.";
    return null;
  };

  const handleSave = async () => {
    const err = validate();
    if (err) {
      toast.error(err);
      return;
    }
    setSaving(true);
    try {
      await updateMySeller({
        variables: {
          updateSellerInput: {
            id: seller.id,
            displayName: form.displayName.trim(),
            businessEmail: form.businessEmail.trim().toLowerCase(),
            businessPhone: form.businessPhone.trim(),
            supportEmail: form.supportEmail.trim()
              ? form.supportEmail.trim().toLowerCase()
              : null,
          },
        },
      });
      toast.success("Profile updated");
      onSaved();
    } catch (e: unknown) {
      toast.error(e instanceof Error ? e.message : "Failed to save");
    } finally {
      setSaving(false);
    }
  };

  return (
    <section className="rounded-lg border bg-card p-5 space-y-4">
      <h2 className="font-semibold">Contact &amp; storefront</h2>

      {editable ? (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label>Display name</Label>
              <Input
                value={form.displayName}
                onChange={(e) => set("displayName", e.target.value)}
                placeholder="What customers will see"
              />
            </div>
            <div className="space-y-1.5">
              <Label>Business phone</Label>
              <Input
                value={form.businessPhone}
                onChange={(e) => set("businessPhone", e.target.value)}
                placeholder="9876543210 or +919876543210"
              />
            </div>
            <div className="space-y-1.5">
              <Label>Business email</Label>
              <Input
                type="email"
                value={form.businessEmail}
                onChange={(e) => set("businessEmail", e.target.value)}
                placeholder="business@yourbrand.com"
              />
            </div>
            <div className="space-y-1.5">
              <Label>Support email</Label>
              <Input
                type="email"
                value={form.supportEmail}
                onChange={(e) => set("supportEmail", e.target.value)}
                placeholder="Optional — shown to customers"
              />
            </div>
          </div>
          <Button onClick={handleSave} disabled={saving || !dirty}>
            {saving ? (
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            ) : (
              <Save className="h-4 w-4 mr-2" />
            )}
            Save changes
          </Button>
        </>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8">
          <div>
            <Row label="Display name" value={seller.displayName} />
            <Row label="Business phone" value={seller.businessPhone} />
          </div>
          <div>
            <Row label="Business email" value={seller.businessEmail} />
            <Row label="Support email" value={seller.supportEmail} />
          </div>
        </div>
      )}
    </section>
  );
}

function BusinessSection({
  seller,
  editable,
}: {
  seller: Seller;
  editable: boolean;
}) {
  return (
    <section className="rounded-lg border bg-card p-5 space-y-4">
      <div className="flex items-center justify-between gap-3">
        <h2 className="font-semibold">Business identity</h2>
        <Button asChild variant="outline" size="sm">
          <Link href="/seller/onboarding">
            <ShieldCheck className="h-4 w-4 mr-2" />
            {editable ? "Edit in KYC" : "View KYC"}
          </Link>
        </Button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8">
        <div>
          <Row label="Legal name" value={seller.legalName} />
          <Row
            label="Business type"
            value={BUSINESS_TYPE_LABELS[seller.businessType]}
          />
          <Row
            label="Date of incorporation"
            value={
              seller.dateOfIncorporation
                ? new Date(seller.dateOfIncorporation).toLocaleDateString()
                : null
            }
          />
          <Row label="Registration number" value={seller.registrationNumber} />
          <Row label="Commission rate" value={`${seller.commissionRate}%`} />
        </div>
        <div>
          <Row label="PAN" value={seller.panNumber} mono />
          <Row label="GSTIN" value={seller.gstin} mono />
          <Row
            label="State (place of supply)"
            value={
              seller.stateName
                ? `${seller.stateName}${
                    seller.stateCode ? ` (${seller.stateCode})` : ""
                  }`
                : null
            }
          />
          {seller.signatoryName && (
            <>
              <Row label="Signatory" value={seller.signatoryName} />
              <Row label="Signatory PAN" value={seller.signatoryPan} mono />
            </>
          )}
        </div>
      </div>

      {!editable && (
        <p className="text-xs text-muted-foreground">
          Business identity is locked after submission. Contact support to
          change these details.
        </p>
      )}
    </section>
  );
}

function KycSection({ seller }: { seller: Seller }) {
  const sections: { label: string; verifiedAt?: string | null; show: boolean }[] =
    [
      { label: "PAN", verifiedAt: seller.panVerifiedAt, show: true },
      { label: "GSTIN", verifiedAt: seller.gstinVerifiedAt, show: !!seller.gstin },
      { label: "Bank account", verifiedAt: seller.bankVerifiedAt, show: true },
      {
        label: "Documents",
        verifiedAt: seller.documentsVerifiedAt,
        show: true,
      },
    ];

  return (
    <section className="rounded-lg border bg-card p-5 space-y-3">
      <div className="flex items-center justify-between gap-3">
        <h2 className="font-semibold">KYC verification</h2>
        {seller.overallStatus === "VERIFIED" && (
          <Button asChild variant="ghost" size="sm">
            <Link href="/seller/payouts">
              <Wallet className="h-4 w-4 mr-2" />
              Payout accounts
            </Link>
          </Button>
        )}
      </div>
      <ul className="divide-y">
        {sections
          .filter((s) => s.show)
          .map((s) => (
            <li key={s.label} className="flex items-center justify-between py-2">
              <span className="text-sm">{s.label}</span>
              {s.verifiedAt ? (
                <span className="inline-flex items-center gap-1.5 text-xs font-medium text-emerald-600 dark:text-emerald-400">
                  <CheckCircle2 className="h-3.5 w-3.5" />
                  Verified
                </span>
              ) : (
                <span className="inline-flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
                  <Clock className="h-3.5 w-3.5" />
                  Pending
                </span>
              )}
            </li>
          ))}
      </ul>
    </section>
  );
}

function Row({
  label,
  value,
  mono,
}: {
  label: string;
  value?: string | null;
  mono?: boolean;
}) {
  return (
    <div className="flex items-center justify-between gap-4 py-2 border-b last:border-0">
      <span className="text-sm text-muted-foreground">{label}</span>
      <span
        className={`text-sm font-medium text-right ${mono ? "font-mono" : ""}`}
      >
        {value || "—"}
      </span>
    </div>
  );
}
