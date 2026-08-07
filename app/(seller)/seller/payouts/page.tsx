/**
 * Seller Payouts — /seller/payouts
 *
 * Manage payout (bank / UPI / wallet) accounts. Backend mutations already
 * exist (createMyPayoutAccount / updateMyPayoutAccount / removeMyPayoutAccount);
 * adding an account requires the seller to be VERIFIED (enforced server-side
 * and gated here too). Accounts are read from mySeller.payoutAccounts.
 */

"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { useQuery, useMutation } from "@apollo/client/react";
import {
  Wallet,
  Plus,
  Pencil,
  Trash2,
  Loader2,
  Star,
  CheckCircle2,
  Landmark,
  Smartphone,
  ShieldAlert,
  ArrowRight,
  Hourglass,
  TrendingUp,
  Coins,
} from "lucide-react";
import { toast } from "sonner";

import {
  GET_MY_SELLER,
  CREATE_MY_PAYOUT_ACCOUNT,
  UPDATE_MY_PAYOUT_ACCOUNT,
  REMOVE_MY_PAYOUT_ACCOUNT,
} from "@/lib/graphql/sellers";
import {
  GET_MY_SELLER_STATS,
  MySellerStatsData,
  SellerStats,
} from "@/lib/graphql/seller-stats";
import {
  GET_MY_PAYOUTS,
  type MyPayoutsData,
  type PayoutStatus,
} from "@/lib/graphql/seller-payouts";
import {
  GetMySellerData,
  PayoutAccountType,
  SellerPayoutAccount,
} from "@/types/seller.types";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { TableEmpty, TableSkeleton } from "@/components/ui/data-table";

interface FormState {
  accountType: PayoutAccountType;
  accountHolderName: string;
  accountNumber: string;
  ifscCode: string;
  bankName: string;
  upiId: string;
  walletProvider: string;
  isPrimary: boolean;
}

const EMPTY_FORM: FormState = {
  accountType: "bank",
  accountHolderName: "",
  accountNumber: "",
  ifscCode: "",
  bankName: "",
  upiId: "",
  walletProvider: "",
  isPrimary: false,
};

const TYPE_META: Record<
  PayoutAccountType,
  { label: string; icon: typeof Landmark }
> = {
  bank: { label: "Bank account", icon: Landmark },
  upi: { label: "UPI", icon: Smartphone },
  wallet: { label: "Wallet", icon: Wallet },
};

function maskAccountNumber(num?: string | null): string {
  if (!num) return "";
  const last4 = num.slice(-4);
  return `•••• ${last4}`;
}

function formatINR(amount?: number | null): string {
  const n = Number(amount ?? 0);
  return `₹${n.toLocaleString("en-IN", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
}

export default function SellerPayoutsPage() {
  const { data, loading, refetch } =
    useQuery<GetMySellerData>(GET_MY_SELLER, {
      fetchPolicy: "cache-and-network",
    });
  const seller = data?.mySeller ?? null;
  const verified = seller?.overallStatus === "VERIFIED";
  const accounts = seller?.payoutAccounts ?? [];

  // Earnings summary — seller-scoped stats (mySellerStats is JwtAuthGuard +
  // service ownership). Read-only; drives the summary cards above the accounts.
  const { data: statsData } = useQuery<MySellerStatsData>(GET_MY_SELLER_STATS, {
    fetchPolicy: "cache-and-network",
  });
  const stats = statsData?.mySellerStats ?? null;

  const [createAccount] = useMutation(CREATE_MY_PAYOUT_ACCOUNT);
  const [updateAccount] = useMutation(UPDATE_MY_PAYOUT_ACCOUNT);
  const [removeAccount] = useMutation(REMOVE_MY_PAYOUT_ACCOUNT);

  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<SellerPayoutAccount | null>(null);
  const [form, setForm] = useState<FormState>(EMPTY_FORM);
  const [saving, setSaving] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<SellerPayoutAccount | null>(
    null,
  );
  const [busyId, setBusyId] = useState<string | null>(null);

  const openAdd = useCallback(() => {
    setEditing(null);
    setForm(EMPTY_FORM);
    setDialogOpen(true);
  }, []);

  const openEdit = useCallback((acc: SellerPayoutAccount) => {
    setEditing(acc);
    setForm({
      accountType: acc.accountType,
      accountHolderName: acc.accountHolderName ?? "",
      accountNumber: acc.accountNumber ?? "",
      ifscCode: acc.ifscCode ?? "",
      bankName: acc.bankName ?? "",
      upiId: acc.upiId ?? "",
      walletProvider: acc.walletProvider ?? "",
      isPrimary: acc.isPrimary,
    });
    setDialogOpen(true);
  }, []);

  const set = <K extends keyof FormState>(key: K, value: FormState[K]) =>
    setForm((f) => ({ ...f, [key]: value }));

  // Client-side mirror of the backend's per-type required-field rule.
  const validate = (f: FormState): string | null => {
    if (!f.accountHolderName.trim()) return "Account holder name is required.";
    if (f.accountType === "bank") {
      if (!f.accountNumber.trim()) return "Account number is required.";
      if (!f.ifscCode.trim()) return "IFSC code is required.";
      if (!f.bankName.trim()) return "Bank name is required.";
    }
    if (f.accountType === "upi" && !f.upiId.trim())
      return "UPI ID is required.";
    if (f.accountType === "wallet" && !f.walletProvider.trim())
      return "Wallet provider is required.";
    return null;
  };

  const handleSubmit = async () => {
    if (!seller) return;
    const err = validate(form);
    if (err) {
      toast.error(err);
      return;
    }
    setSaving(true);
    try {
      // Only send the fields relevant to the chosen type (others stay null).
      const typeFields =
        form.accountType === "bank"
          ? {
              accountNumber: form.accountNumber.trim(),
              ifscCode: form.ifscCode.trim(),
              bankName: form.bankName.trim(),
            }
          : form.accountType === "upi"
            ? { upiId: form.upiId.trim() }
            : { walletProvider: form.walletProvider.trim() };

      if (editing) {
        await updateAccount({
          variables: {
            updatePayoutAccountInput: {
              id: editing.id,
              accountType: form.accountType,
              accountHolderName: form.accountHolderName.trim(),
              isPrimary: form.isPrimary,
              ...typeFields,
            },
          },
        });
        toast.success("Payout account updated");
      } else {
        await createAccount({
          variables: {
            createPayoutAccountInput: {
              sellerId: seller.id,
              accountType: form.accountType,
              accountHolderName: form.accountHolderName.trim(),
              isPrimary: form.isPrimary,
              ...typeFields,
            },
          },
        });
        toast.success("Payout account added");
      }
      setDialogOpen(false);
      await refetch();
    } catch (e: unknown) {
      toast.error(e instanceof Error ? e.message : "Failed to save account");
    } finally {
      setSaving(false);
    }
  };

  const handleSetPrimary = async (acc: SellerPayoutAccount) => {
    setBusyId(acc.id);
    try {
      await updateAccount({
        variables: {
          updatePayoutAccountInput: { id: acc.id, isPrimary: true },
        },
      });
      toast.success(`Set ${TYPE_META[acc.accountType].label} as primary`);
      await refetch();
    } catch (e: unknown) {
      toast.error(e instanceof Error ? e.message : "Failed to update");
    } finally {
      setBusyId(null);
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setBusyId(deleteTarget.id);
    try {
      await removeAccount({ variables: { id: deleteTarget.id } });
      toast.success("Payout account removed");
      setDeleteTarget(null);
      await refetch();
    } catch (e: unknown) {
      toast.error(e instanceof Error ? e.message : "Failed to remove");
    } finally {
      setBusyId(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight flex items-center gap-2">
            <Wallet className="h-6 w-6 text-primary" />
            Payouts
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Your earnings and the accounts we send them to.
          </p>
        </div>
        {verified && (
          <Button onClick={openAdd}>
            <Plus className="h-4 w-4 mr-2" />
            Add account
          </Button>
        )}
      </div>

      {/* Earnings summary */}
      <EarningsSummary stats={stats} />

      {loading && (
        <div className="rounded-lg border bg-card p-8 flex items-center justify-center">
          <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
        </div>
      )}

      {/* Not verified → gate */}
      {!loading && !verified && (
        <div className="rounded-lg border bg-card p-6 space-y-4">
          <div className="flex items-start gap-3">
            <div className="h-10 w-10 rounded-full bg-muted flex items-center justify-center flex-shrink-0">
              <ShieldAlert className="h-5 w-5 text-muted-foreground" />
            </div>
            <div>
              <h2 className="font-semibold">Complete KYC to add payout accounts</h2>
              <p className="text-sm text-muted-foreground mt-1">
                For your security, payout accounts can only be added once your
                seller profile is verified.
              </p>
            </div>
          </div>
          <Button asChild variant="outline">
            <Link href="/seller/onboarding">
              Go to KYC
              <ArrowRight className="h-4 w-4 ml-2" />
            </Link>
          </Button>
        </div>
      )}

      {/* Verified → list */}
      {!loading && verified && accounts.length === 0 && (
        <div className="flex flex-col items-center justify-center rounded-lg border border-dashed bg-card py-12 text-center">
          <Wallet className="h-10 w-10 text-muted-foreground mb-3" />
          <p className="font-medium">No payout accounts yet</p>
          <p className="text-sm text-muted-foreground mt-1 mb-4">
            Add one so we know where to send your earnings.
          </p>
          <Button onClick={openAdd}>
            <Plus className="h-4 w-4 mr-2" />
            Add account
          </Button>
        </div>
      )}

      {!loading && verified && accounts.length > 0 && (
        <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
          {accounts.map((acc) => {
            const Icon = TYPE_META[acc.accountType].icon;
            return (
              <div
                key={acc.id}
                className="rounded-lg border bg-card p-4 flex flex-col gap-3"
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2 min-w-0">
                    <div className="h-9 w-9 rounded-md bg-muted flex items-center justify-center flex-shrink-0">
                      <Icon className="h-5 w-5 text-primary" />
                    </div>
                    <div className="min-w-0">
                      <div className="font-medium truncate">
                        {acc.accountHolderName}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {TYPE_META[acc.accountType].label}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-1.5 flex-shrink-0">
                    {acc.isPrimary && (
                      <Badge variant="default" className="text-xs gap-1">
                        <Star className="h-3 w-3" />
                        Primary
                      </Badge>
                    )}
                    {acc.isVerified ? (
                      <Badge variant="secondary" className="text-xs gap-1">
                        <CheckCircle2 className="h-3 w-3" />
                        Verified
                      </Badge>
                    ) : (
                      <Badge variant="outline" className="text-xs">
                        Unverified
                      </Badge>
                    )}
                  </div>
                </div>

                <div className="text-sm text-muted-foreground space-y-0.5">
                  {acc.accountType === "bank" && (
                    <>
                      <div>
                        A/C {maskAccountNumber(acc.accountNumber)}
                      </div>
                      <div>
                        {acc.bankName}
                        {acc.ifscCode ? ` · ${acc.ifscCode}` : ""}
                      </div>
                    </>
                  )}
                  {acc.accountType === "upi" && <div>{acc.upiId}</div>}
                  {acc.accountType === "wallet" && (
                    <div>{acc.walletProvider}</div>
                  )}
                </div>

                <div className="flex items-center gap-2 pt-1">
                  {!acc.isPrimary && (
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => handleSetPrimary(acc)}
                      disabled={busyId === acc.id}
                    >
                      {busyId === acc.id ? (
                        <Loader2 className="h-3.5 w-3.5 animate-spin" />
                      ) : (
                        <Star className="h-3.5 w-3.5 mr-1" />
                      )}
                      Make primary
                    </Button>
                  )}
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => openEdit(acc)}
                  >
                    <Pencil className="h-3.5 w-3.5 mr-1" />
                    Edit
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    className="text-destructive hover:text-destructive"
                    onClick={() => setDeleteTarget(acc)}
                  >
                    <Trash2 className="h-3.5 w-3.5 mr-1" />
                    Remove
                  </Button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Payout-run history */}
      <PayoutHistory />

      {/* Add / edit dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>
              {editing ? "Edit payout account" : "Add payout account"}
            </DialogTitle>
            <DialogDescription>
              Funds from your sales are disbursed to your primary account.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-2">
            <div className="space-y-1.5">
              <Label>Account type</Label>
              <Select
                value={form.accountType}
                onValueChange={(v) => set("accountType", v as PayoutAccountType)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="bank">Bank account</SelectItem>
                  <SelectItem value="upi">UPI</SelectItem>
                  <SelectItem value="wallet">Wallet</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1.5">
              <Label>Account holder name</Label>
              <Input
                value={form.accountHolderName}
                onChange={(e) => set("accountHolderName", e.target.value)}
                placeholder="As per bank records"
              />
            </div>

            {form.accountType === "bank" && (
              <>
                <div className="space-y-1.5">
                  <Label>Account number</Label>
                  <Input
                    value={form.accountNumber}
                    onChange={(e) => set("accountNumber", e.target.value)}
                    inputMode="numeric"
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <Label>IFSC code</Label>
                    <Input
                      value={form.ifscCode}
                      onChange={(e) =>
                        set("ifscCode", e.target.value.toUpperCase())
                      }
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label>Bank name</Label>
                    <Input
                      value={form.bankName}
                      onChange={(e) => set("bankName", e.target.value)}
                    />
                  </div>
                </div>
              </>
            )}

            {form.accountType === "upi" && (
              <div className="space-y-1.5">
                <Label>UPI ID</Label>
                <Input
                  value={form.upiId}
                  onChange={(e) => set("upiId", e.target.value)}
                  placeholder="name@bank"
                />
              </div>
            )}

            {form.accountType === "wallet" && (
              <div className="space-y-1.5">
                <Label>Wallet provider</Label>
                <Input
                  value={form.walletProvider}
                  onChange={(e) => set("walletProvider", e.target.value)}
                  placeholder="e.g. Paytm, PhonePe"
                />
              </div>
            )}

            <div className="flex items-center justify-between rounded-md border p-3">
              <div>
                <Label className="text-sm">Set as primary</Label>
                <p className="text-xs text-muted-foreground">
                  Earnings are paid to your primary account.
                </p>
              </div>
              <Switch
                checked={form.isPrimary}
                onCheckedChange={(v) => set("isPrimary", v)}
              />
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setDialogOpen(false)}
              disabled={saving}
            >
              Cancel
            </Button>
            <Button onClick={handleSubmit} disabled={saving}>
              {saving && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
              {editing ? "Save changes" : "Add account"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete confirmation */}
      <AlertDialog
        open={!!deleteTarget}
        onOpenChange={(open) => !open && setDeleteTarget(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Remove payout account?</AlertDialogTitle>
            <AlertDialogDescription>
              This removes the {deleteTarget && TYPE_META[deleteTarget.accountType].label.toLowerCase()}{" "}
              for {deleteTarget?.accountHolderName}. You can add it again later.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={busyId === deleteTarget?.id}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={(e) => {
                e.preventDefault();
                handleDelete();
              }}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {busyId === deleteTarget?.id ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                "Remove"
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

/**
 * Read-only earnings summary sourced from `mySellerStats` — the accrued totals.
 * Individual settlement runs are listed below by <PayoutHistory /> (the
 * seller-scoped `myPayouts` query, P4-03).
 */
function EarningsSummary({ stats }: { stats: SellerStats | null }) {
  const cards: {
    label: string;
    value: string;
    hint: string;
    icon: typeof Wallet;
  }[] = [
    {
      label: "Pending payout",
      value: formatINR(stats?.pendingPayoutAmount),
      hint: "Awaiting settlement",
      icon: Hourglass,
    },
    {
      label: "Paid to date",
      value: formatINR(stats?.paidPayoutAmount),
      hint: "Disbursed to you",
      icon: CheckCircle2,
    },
    {
      label: "Net this month",
      value: formatINR(stats?.netEarningsThisMonth),
      hint: "After commission & fees",
      icon: TrendingUp,
    },
    {
      label: "Lifetime net",
      value: formatINR(stats?.lifetimeNetEarnings),
      hint: "Total net earnings",
      icon: Coins,
    },
  ];

  return (
    <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
      {cards.map((c) => {
        const Icon = c.icon;
        return (
          <div key={c.label} className="rounded-lg border bg-card p-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-muted-foreground">
                {c.label}
              </span>
              <Icon className="h-4 w-4 text-primary" />
            </div>
            <div className="mt-2 text-xl font-bold tracking-tight">
              {c.value}
            </div>
            <div className="mt-0.5 text-[11px] text-muted-foreground">
              {c.hint}
            </div>
          </div>
        );
      })}
    </div>
  );
}

const PAYOUT_STATUS_VARIANT: Record<
  PayoutStatus,
  "default" | "secondary" | "destructive" | "outline"
> = {
  PENDING: "outline",
  PROCESSING: "secondary",
  PAID: "default",
  FAILED: "destructive",
};

/**
 * Read-only payout-run history from the seller-scoped `myPayouts` query. Each
 * row is one settlement run — gross, refund adjustment, and the net actually
 * disbursed — newest first. Scoped server-side to the caller's own seller.
 */
function PayoutHistory() {
  const { data, loading } = useQuery<MyPayoutsData>(GET_MY_PAYOUTS, {
    variables: { page: 1, pageSize: 20 },
    fetchPolicy: "cache-and-network",
  });
  const payouts = data?.myPayouts?.items ?? [];

  return (
    <div className="space-y-3">
      <div>
        <h2 className="text-lg font-semibold tracking-tight">Payout history</h2>
        <p className="text-sm text-muted-foreground">
          Your settlement runs. Each groups delivered orders paid out together.
        </p>
      </div>
      <div className="rounded-lg border bg-card shadow-sm overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/40 hover:bg-muted/40">
              <TableHead>Date</TableHead>
              <TableHead className="text-center">Status</TableHead>
              <TableHead className="hidden sm:table-cell text-right">
                Gross
              </TableHead>
              <TableHead className="hidden md:table-cell text-right">
                Refunds
              </TableHead>
              <TableHead className="text-right">Net paid</TableHead>
              <TableHead className="hidden lg:table-cell">Reference</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading && payouts.length === 0 ? (
              <TableSkeleton colSpan={6} />
            ) : payouts.length === 0 ? (
              <TableEmpty colSpan={6} icon={Wallet}>
                No payouts yet. Settlements show here once your delivered orders
                are paid out.
              </TableEmpty>
            ) : (
              payouts.map((p) => (
                <TableRow key={p.id}>
                  <TableCell className="text-sm whitespace-nowrap">
                    {new Date(p.createdAt).toLocaleDateString("en-IN")}
                  </TableCell>
                  <TableCell className="text-center">
                    <Badge
                      variant={PAYOUT_STATUS_VARIANT[p.status]}
                      className="text-[10px]"
                    >
                      {p.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="hidden sm:table-cell text-right tabular-nums">
                    {formatINR(p.grossAmount)}
                  </TableCell>
                  <TableCell className="hidden md:table-cell text-right tabular-nums text-muted-foreground">
                    {p.refundAdjustment > 0
                      ? `− ${formatINR(p.refundAdjustment)}`
                      : "—"}
                  </TableCell>
                  <TableCell className="text-right font-semibold tabular-nums">
                    {formatINR(p.netAmount)}
                  </TableCell>
                  <TableCell className="hidden lg:table-cell text-xs font-mono text-muted-foreground">
                    {p.utr
                      ? `UTR ${p.utr}`
                      : p.status === "FAILED" && p.failureReason
                        ? p.failureReason
                        : "—"}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
