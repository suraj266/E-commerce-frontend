/**
 * Seller Settings — /seller/settings
 *
 * Account hub:
 *  - Business profile + KYC status (read-only; editable only while DRAFT /
 *    REJECTED, enforced by the backend's updateMySeller rule — so we route
 *    edits to onboarding and otherwise show it locked).
 *  - Store preferences: support contact + localization (timezone / locale)
 *    per store, saved via updateMyStore. These aren't editable on the store
 *    detail page, so this is the place to manage them.
 */

"use client";

import { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { useQuery, useMutation } from "@apollo/client/react";
import {
  Settings as SettingsIcon,
  User,
  Store as StoreIcon,
  Save,
  Loader2,
  ArrowRight,
  Wallet,
  ShieldCheck,
  Truck,
} from "lucide-react";
import { toast } from "sonner";

import { GET_MY_SELLER } from "@/lib/graphql/sellers";
import {
  GET_MY_STORES,
  UPDATE_MY_STORE,
  UPDATE_MY_STORE_SHIPPING,
} from "@/lib/graphql/stores";
import {
  GetMySellerData,
  Seller,
  BUSINESS_TYPE_LABELS,
} from "@/types/seller.types";
import { GetMyStoresData, Store } from "@/types/store.types";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

function Row({ label, value }: { label: string; value?: string | null }) {
  return (
    <div className="flex items-center justify-between gap-4 py-2 border-b last:border-0">
      <span className="text-sm text-muted-foreground">{label}</span>
      <span className="text-sm font-medium text-right">{value || "—"}</span>
    </div>
  );
}

export default function SellerSettingsPage() {
  const { data: sellerData, loading: sellerLoading } =
    useQuery<GetMySellerData>(GET_MY_SELLER, {
      fetchPolicy: "cache-and-network",
    });
  const seller = sellerData?.mySeller ?? null;

  const { data: storesData, loading: storesLoading } =
    useQuery<GetMyStoresData>(GET_MY_STORES, {
      fetchPolicy: "cache-and-network",
    });
  const stores = useMemo(() => storesData?.myStores ?? [], [storesData]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight flex items-center gap-2">
          <SettingsIcon className="h-6 w-6 text-primary" />
          Settings
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          Your business profile and store preferences.
        </p>
      </div>

      {/* Business profile */}
      <section className="rounded-lg border bg-card p-5 space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="font-semibold flex items-center gap-2">
            <User className="h-4 w-4 text-primary" />
            Business profile
          </h2>
          {seller && (
            <Badge variant="outline" className="capitalize text-xs">
              {seller.overallStatus.replace(/_/g, " ").toLowerCase()}
            </Badge>
          )}
        </div>

        {sellerLoading && !seller ? (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
          </div>
        ) : !seller ? (
          <div className="text-sm text-muted-foreground">
            You haven’t started onboarding yet.{" "}
            <Link href="/seller/onboarding" className="text-primary underline">
              Begin KYC
            </Link>
            .
          </div>
        ) : (
          <ProfileBody seller={seller} />
        )}
      </section>

      {/* Store preferences */}
      <section className="rounded-lg border bg-card p-5 space-y-4">
        <h2 className="font-semibold flex items-center gap-2">
          <StoreIcon className="h-4 w-4 text-primary" />
          Store preferences
        </h2>
        {storesLoading && stores.length === 0 ? (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
          </div>
        ) : stores.length === 0 ? (
          <div className="text-sm text-muted-foreground">
            No stores yet.{" "}
            <Link href="/seller/stores/new" className="text-primary underline">
              Create a store
            </Link>{" "}
            to set its support contact and localization.
          </div>
        ) : (
          <StorePreferences stores={stores} />
        )}
      </section>

      {/* Shipping */}
      <section className="rounded-lg border bg-card p-5 space-y-4">
        <div>
          <h2 className="font-semibold flex items-center gap-2">
            <Truck className="h-4 w-4 text-primary" />
            Shipping &amp; delivery
          </h2>
          <p className="text-xs text-muted-foreground mt-1">
            Delivery charges and COD rules per store. GST on shipping is applied
            automatically at the product&apos;s tax rate (composite supply).
          </p>
        </div>
        {storesLoading && stores.length === 0 ? (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
          </div>
        ) : stores.length === 0 ? (
          <div className="text-sm text-muted-foreground">
            Create a store to configure shipping.
          </div>
        ) : (
          <ShippingSettings stores={stores} />
        )}
      </section>

      {/* Courier integration → moved to the Shipping menu */}
      <Link
        href="/seller/shipping"
        className="flex items-center justify-between rounded-lg border bg-card p-5 hover:bg-muted/30 transition-colors"
      >
        <div className="flex items-center gap-3">
          <Truck className="h-5 w-5 text-primary" />
          <div>
            <div className="font-medium">Courier &amp; live rates</div>
            <div className="text-xs text-muted-foreground">
              Connect Shiprocket for live checkout rates, AWB labels + tracking.
            </div>
          </div>
        </div>
        <ArrowRight className="h-4 w-4 text-muted-foreground" />
      </Link>

      {/* Quick link to payouts */}
      <Link
        href="/seller/payouts"
        className="flex items-center justify-between rounded-lg border bg-card p-5 hover:bg-muted/30 transition-colors"
      >
        <div className="flex items-center gap-3">
          <Wallet className="h-5 w-5 text-primary" />
          <div>
            <div className="font-medium">Payout accounts</div>
            <div className="text-xs text-muted-foreground">
              Manage where your earnings are sent.
            </div>
          </div>
        </div>
        <ArrowRight className="h-4 w-4 text-muted-foreground" />
      </Link>
    </div>
  );
}

function ProfileBody({ seller }: { seller: Seller }) {
  const editable =
    seller.overallStatus === "DRAFT" || seller.overallStatus === "REJECTED";

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8">
        <div>
          <Row label="Legal name" value={seller.legalName} />
          <Row label="Display name" value={seller.displayName} />
          <Row
            label="Business type"
            value={BUSINESS_TYPE_LABELS[seller.businessType]}
          />
          <Row
            label="Commission rate"
            value={`${seller.commissionRate}%`}
          />
        </div>
        <div>
          <Row label="PAN" value={seller.panNumber} />
          <Row label="GSTIN" value={seller.gstin} />
          <Row
            label="State"
            value={
              seller.stateName
                ? `${seller.stateName}${seller.stateCode ? ` (${seller.stateCode})` : ""}`
                : null
            }
          />
          <Row label="Business email" value={seller.businessEmail} />
          <Row label="Business phone" value={seller.businessPhone} />
          <Row label="Support email" value={seller.supportEmail} />
        </div>
      </div>

      {editable ? (
        <Button asChild variant="outline" size="sm">
          <Link href="/seller/onboarding">
            <ShieldCheck className="h-4 w-4 mr-2" />
            Edit profile
          </Link>
        </Button>
      ) : (
        <p className="text-xs text-muted-foreground">
          Business details are locked after verification. Contact support to
          change them.
        </p>
      )}
    </div>
  );
}

interface StoreForm {
  supportEmail: string;
  supportPhone: string;
  timezone: string;
  locale: string;
}

function StorePreferences({ stores }: { stores: Store[] }) {
  const [storeId, setStoreId] = useState<string>(stores[0]?.id ?? "");
  const selected = stores.find((s) => s.id === storeId) ?? stores[0];

  const [form, setForm] = useState<StoreForm>({
    supportEmail: "",
    supportPhone: "",
    timezone: "",
    locale: "",
  });
  const [saving, setSaving] = useState(false);

  const [updateStore] = useMutation(UPDATE_MY_STORE);

  useEffect(() => {
    if (selected) {
      setForm({
        supportEmail: selected.supportEmail ?? "",
        supportPhone: selected.supportPhone ?? "",
        timezone: selected.timezone ?? "",
        locale: selected.locale ?? "",
      });
    }
  }, [selected]);

  const set = <K extends keyof StoreForm>(k: K, v: StoreForm[K]) =>
    setForm((f) => ({ ...f, [k]: v }));

  const dirty =
    !!selected &&
    (form.supportEmail !== (selected.supportEmail ?? "") ||
      form.supportPhone !== (selected.supportPhone ?? "") ||
      form.timezone !== (selected.timezone ?? "") ||
      form.locale !== (selected.locale ?? ""));

  const handleSave = async () => {
    if (!selected) return;
    setSaving(true);
    try {
      await updateStore({
        variables: {
          updateStoreInput: {
            id: selected.id,
            supportEmail: form.supportEmail.trim() || null,
            supportPhone: form.supportPhone.trim() || null,
            timezone: form.timezone.trim(),
            locale: form.locale.trim(),
          },
        },
      });
      toast.success("Store preferences saved");
    } catch (e: unknown) {
      toast.error(e instanceof Error ? e.message : "Failed to save");
    } finally {
      setSaving(false);
    }
  };

  if (!selected) return null;

  return (
    <div className="space-y-4">
      {stores.length > 1 && (
        <div className="space-y-1.5 max-w-xs">
          <Label>Store</Label>
          <Select value={storeId} onValueChange={setStoreId}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {stores.map((s) => (
                <SelectItem key={s.id} value={s.id}>
                  {s.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <Label>Support email</Label>
          <Input
            type="email"
            value={form.supportEmail}
            onChange={(e) => set("supportEmail", e.target.value)}
            placeholder="support@yourstore.com"
          />
        </div>
        <div className="space-y-1.5">
          <Label>Support phone</Label>
          <Input
            value={form.supportPhone}
            onChange={(e) => set("supportPhone", e.target.value)}
            placeholder="+91…"
          />
        </div>
        <div className="space-y-1.5">
          <Label>Timezone</Label>
          <Input
            value={form.timezone}
            onChange={(e) => set("timezone", e.target.value)}
            placeholder="Asia/Kolkata"
          />
        </div>
        <div className="space-y-1.5">
          <Label>Locale</Label>
          <Input
            value={form.locale}
            onChange={(e) => set("locale", e.target.value)}
            placeholder="en-IN"
          />
        </div>
      </div>

      <div className="flex items-center gap-3">
        <Button onClick={handleSave} disabled={saving || !dirty}>
          {saving ? (
            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
          ) : (
            <Save className="h-4 w-4 mr-2" />
          )}
          Save changes
        </Button>
        <span className="text-xs text-muted-foreground">
          Currency:{" "}
          <span className="font-medium">{selected.currencyCode}</span> (fixed
          after creation)
        </span>
      </div>
    </div>
  );
}

interface ShippingForm {
  freeAbove: string;
  flatRate: string;
  perKgRate: string;
  codEnabled: boolean;
  codLimit: string;
  processingDays: string;
  excludedPincodes: string;
}

function ShippingSettings({ stores }: { stores: Store[] }) {
  const [storeId, setStoreId] = useState<string>(stores[0]?.id ?? "");
  const selected = stores.find((s) => s.id === storeId) ?? stores[0];

  const emptyForm: ShippingForm = {
    freeAbove: "",
    flatRate: "",
    perKgRate: "",
    codEnabled: false,
    codLimit: "",
    processingDays: "",
    excludedPincodes: "",
  };
  const [form, setForm] = useState<ShippingForm>(emptyForm);
  const [saving, setSaving] = useState(false);

  const [updateShipping] = useMutation(UPDATE_MY_STORE_SHIPPING);

  useEffect(() => {
    const c = selected?.shippingConfig;
    const numStr = (n?: number | null) =>
      n === null || n === undefined ? "" : String(n);
    setForm({
      freeAbove: numStr(c?.freeAbove),
      flatRate: numStr(c?.flatRate),
      perKgRate: numStr(c?.perKgRate),
      codEnabled: c?.codEnabled ?? false,
      codLimit: numStr(c?.codLimit),
      processingDays: numStr(c?.processingDays),
      excludedPincodes: (c?.excludedPincodes ?? []).join(", "),
    });
  }, [selected]);

  const set = <K extends keyof ShippingForm>(k: K, v: ShippingForm[K]) =>
    setForm((f) => ({ ...f, [k]: v }));

  const handleSave = async () => {
    if (!selected) return;
    const pincodes = form.excludedPincodes
      .split(/[\s,]+/)
      .map((p) => p.trim())
      .filter(Boolean);
    const bad = pincodes.find((p) => !/^[1-9][0-9]{5}$/.test(p));
    if (bad) {
      toast.error(`"${bad}" is not a valid 6-digit pincode`);
      return;
    }
    const toNum = (s: string): number | null =>
      s.trim() === "" ? null : Number(s);

    setSaving(true);
    try {
      await updateShipping({
        variables: {
          input: {
            storeId: selected.id,
            freeAbove: toNum(form.freeAbove),
            flatRate: toNum(form.flatRate) ?? 0,
            perKgRate: toNum(form.perKgRate),
            codEnabled: form.codEnabled,
            codLimit: toNum(form.codLimit),
            processingDays: toNum(form.processingDays),
            excludedPincodes: pincodes,
          },
        },
      });
      toast.success("Shipping settings saved");
    } catch (e: unknown) {
      toast.error(e instanceof Error ? e.message : "Failed to save");
    } finally {
      setSaving(false);
    }
  };

  if (!selected) return null;

  return (
    <div className="space-y-4">
      {stores.length > 1 && (
        <div className="space-y-1.5 max-w-xs">
          <Label>Store</Label>
          <Select value={storeId} onValueChange={setStoreId}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {stores.map((s) => (
                <SelectItem key={s.id} value={s.id}>
                  {s.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="space-y-1.5">
          <Label>Free shipping above (₹)</Label>
          <Input
            type="number"
            min={0}
            value={form.freeAbove}
            onChange={(e) => set("freeAbove", e.target.value)}
            placeholder="e.g. 499 (blank = never free)"
          />
        </div>
        <div className="space-y-1.5">
          <Label>Flat rate (₹)</Label>
          <Input
            type="number"
            min={0}
            value={form.flatRate}
            onChange={(e) => set("flatRate", e.target.value)}
            placeholder="e.g. 49 (blank = free)"
          />
        </div>
        <div className="space-y-1.5">
          <Label>Per-kg rate (₹)</Label>
          <Input
            type="number"
            min={0}
            value={form.perKgRate}
            onChange={(e) => set("perKgRate", e.target.value)}
            placeholder="e.g. 20"
          />
        </div>
      </div>

      <div className="rounded-md border p-4 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <Label className="text-sm">Cash on Delivery</Label>
            <p className="text-xs text-muted-foreground">
              Offer COD for this store&apos;s orders.
            </p>
          </div>
          <Switch
            checked={form.codEnabled}
            onCheckedChange={(v) => set("codEnabled", v)}
          />
        </div>
        {form.codEnabled && (
          <div className="space-y-1.5 max-w-xs">
            <Label>COD limit (₹)</Label>
            <Input
              type="number"
              min={0}
              value={form.codLimit}
              onChange={(e) => set("codLimit", e.target.value)}
              placeholder="Max order value for COD (blank = no limit)"
            />
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <Label>Dispatch time (days)</Label>
          <Input
            type="number"
            min={0}
            value={form.processingDays}
            onChange={(e) => set("processingDays", e.target.value)}
            placeholder="e.g. 2"
          />
        </div>
        <div className="space-y-1.5">
          <Label>Non-serviceable pincodes</Label>
          <Input
            value={form.excludedPincodes}
            onChange={(e) => set("excludedPincodes", e.target.value)}
            placeholder="Comma-separated, e.g. 190001, 744101"
          />
        </div>
      </div>

      <Button onClick={handleSave} disabled={saving}>
        {saving ? (
          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
        ) : (
          <Save className="h-4 w-4 mr-2" />
        )}
        Save shipping
      </Button>
    </div>
  );
}
