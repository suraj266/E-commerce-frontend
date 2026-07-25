"use client";

/**
 * Admin Payouts console (P3-06) — the full settlement flow:
 *   preview (dry run) → run (settle eligible seller-orders) → mark paid + UTR
 *   (or mark failed). Consumes the existing PayoutAdminResolver.
 *
 * Manual disbursement: finance transfers via bank/UPI off-platform, then pastes
 * the UTR back here to close the payout.
 */

import { useEffect, useState } from "react";
import { useQuery, useMutation } from "@apollo/client/react";
import { toast } from "sonner";
import { Loader2, PlayCircle, Wallet, Ban, CheckCircle2 } from "lucide-react";

import {
  GET_ADMIN_PAYOUTS,
  GET_PAYOUT_PREVIEW,
  CREATE_PAYOUT_RUN,
  MARK_PAYOUT_PAID,
  MARK_PAYOUT_FAILED,
  PAYOUT_STATUSES,
  type AdminPayout,
  type AdminPayoutsData,
  type PayoutPreviewData,
  type CreatePayoutRunData,
  type MarkPayoutPaidData,
  type MarkPayoutFailedData,
  type PayoutStatus,
} from "@/lib/graphql/admin-payouts";
import { money, dateTime } from "@/lib/utils/admin-format";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useSetPageTitle } from "@/components/shell/page-title-context";
import {
  TableEmpty,
  TablePagination,
  TableSkeleton,
  usePagination,
} from "@/components/ui/data-table";

const COL_COUNT = 7;
const PAGE_SIZE_OPTIONS = [10, 25, 50] as const;

const STATUS_VARIANT: Record<
  PayoutStatus,
  "default" | "secondary" | "destructive" | "outline"
> = {
  PENDING: "secondary",
  PROCESSING: "outline",
  PAID: "default",
  FAILED: "destructive",
};

export default function PayoutsClient() {
  useSetPageTitle("Payouts");

  const [statusFilter, setStatusFilter] = useState<"all" | PayoutStatus>("all");
  const [previewOpen, setPreviewOpen] = useState(false);

  const [payingOut, setPayingOut] = useState<AdminPayout | null>(null);
  const [utr, setUtr] = useState("");
  const [providerRef, setProviderRef] = useState("");

  const [failing, setFailing] = useState<AdminPayout | null>(null);
  const [failReason, setFailReason] = useState("");

  const [serverTotal, setServerTotal] = useState(0);
  const pg = usePagination({ totalRows: serverTotal, defaultPageSize: 10 });

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    pg.resetPage();
  }, [statusFilter, pg.pageSize]);

  const vars = {
    page: pg.page,
    pageSize: pg.pageSize,
    status: statusFilter === "all" ? null : statusFilter,
    sellerId: null,
  };

  const { data, loading, error } = useQuery<AdminPayoutsData>(
    GET_ADMIN_PAYOUTS,
    { variables: vars, fetchPolicy: "cache-and-network" },
  );

  useEffect(() => {
    if (error) toast.error(`Failed to load payouts: ${error.message}`);
  }, [error]);

  useEffect(() => {
    const c = data?.adminPayouts?.totalCount;
    if (typeof c === "number" && c !== serverTotal) setServerTotal(c);
  }, [data?.adminPayouts?.totalCount, serverTotal]);

  // Preview only fetches while the dialog is open.
  const {
    data: previewData,
    loading: previewLoading,
    error: previewError,
  } = useQuery<PayoutPreviewData>(GET_PAYOUT_PREVIEW, {
    variables: { sellerId: null },
    skip: !previewOpen,
    fetchPolicy: "network-only",
  });

  useEffect(() => {
    if (previewError)
      toast.error(`Failed to load preview: ${previewError.message}`);
  }, [previewError]);

  const [createPayoutRun, { loading: runLoading }] =
    useMutation<CreatePayoutRunData>(CREATE_PAYOUT_RUN, {
      refetchQueries: [{ query: GET_ADMIN_PAYOUTS, variables: vars }],
      onCompleted: (res) => {
        const n = res.createPayoutRun?.length ?? 0;
        toast.success(
          n > 0 ? `Created ${n} payout${n === 1 ? "" : "s"}` : "Nothing eligible",
        );
        setPreviewOpen(false);
      },
      onError: (e) => toast.error(`Run failed: ${e.message}`),
    });

  const [markPayoutPaid, { loading: paidLoading }] =
    useMutation<MarkPayoutPaidData>(MARK_PAYOUT_PAID, {
      refetchQueries: [{ query: GET_ADMIN_PAYOUTS, variables: vars }],
      onCompleted: () => {
        toast.success("Payout marked paid");
        setPayingOut(null);
        setUtr("");
        setProviderRef("");
      },
      onError: (e) => toast.error(`Mark-paid failed: ${e.message}`),
    });

  const [markPayoutFailed, { loading: failLoading }] =
    useMutation<MarkPayoutFailedData>(MARK_PAYOUT_FAILED, {
      refetchQueries: [{ query: GET_ADMIN_PAYOUTS, variables: vars }],
      onCompleted: () => {
        toast.success("Payout marked failed");
        setFailing(null);
        setFailReason("");
      },
      onError: (e) => toast.error(`Mark-failed failed: ${e.message}`),
    });

  const items = data?.adminPayouts?.items ?? [];
  const preview = previewData?.payoutPreview ?? [];
  const previewTotal = preview.reduce((sum, p) => sum + p.netAmount, 0);
  const activeFilterCount = statusFilter !== "all" ? 1 : 0;

  const canDisburse = (p: AdminPayout) =>
    p.status === "PENDING" || p.status === "PROCESSING";

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex flex-col gap-1">
          <h1 className="text-2xl font-bold tracking-tight flex items-center gap-2">
            <Wallet className="h-6 w-6 text-primary" />
            Payouts
          </h1>
          <p className="text-sm text-muted-foreground">
            Settle eligible seller-orders, then record the bank/UPI UTR to close
            each payout.
          </p>
        </div>
        <Button onClick={() => setPreviewOpen(true)}>
          <PlayCircle className="mr-2 h-4 w-4" />
          Preview &amp; run
        </Button>
      </div>

      <div className="rounded-lg border bg-card p-3 shadow-sm flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <Select
          value={statusFilter}
          onValueChange={(v) => setStatusFilter(v as "all" | PayoutStatus)}
        >
          <SelectTrigger className="w-full sm:w-44">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All statuses</SelectItem>
            {PAYOUT_STATUSES.map((s) => (
              <SelectItem key={s} value={s}>
                {s}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {activeFilterCount > 0 && (
          <Button
            variant="ghost"
            size="sm"
            className="text-muted-foreground"
            onClick={() => setStatusFilter("all")}
          >
            Reset
          </Button>
        )}
      </div>

      <div className="rounded-lg border bg-card shadow-sm overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/40 hover:bg-muted/40">
              <TableHead>Payout / Seller</TableHead>
              <TableHead className="text-right">Net</TableHead>
              <TableHead className="text-center">Status</TableHead>
              <TableHead className="hidden md:table-cell">Account</TableHead>
              <TableHead className="hidden lg:table-cell">UTR</TableHead>
              <TableHead className="hidden lg:table-cell">Created</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading && items.length === 0 ? (
              <TableSkeleton colSpan={COL_COUNT} />
            ) : items.length === 0 ? (
              <TableEmpty
                colSpan={COL_COUNT}
                icon={Wallet}
                hasFilters={activeFilterCount > 0}
                onClearFilters={() => setStatusFilter("all")}
              >
                No payouts yet. Use Preview &amp; run to settle eligible orders.
              </TableEmpty>
            ) : (
              items.map((p) => (
                <TableRow key={p.id}>
                  <TableCell>
                    <div className="font-mono text-xs">{p.id.slice(0, 8)}</div>
                    <div className="text-xs text-muted-foreground">
                      seller {p.sellerId.slice(0, 8)}
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="font-medium">
                      {money(p.netAmount, p.currencyCode)}
                    </div>
                    <div className="text-[10px] text-muted-foreground">
                      gross {money(p.grossAmount, p.currencyCode)}
                      {p.refundAdjustment > 0 &&
                        ` · −${money(p.refundAdjustment, p.currencyCode)}`}
                    </div>
                  </TableCell>
                  <TableCell className="text-center">
                    <Badge
                      variant={STATUS_VARIANT[p.status]}
                      className="text-[10px]"
                    >
                      {p.status}
                    </Badge>
                    {p.status === "FAILED" && p.failureReason && (
                      <div className="mt-1 text-[10px] text-destructive max-w-[10rem] truncate">
                        {p.failureReason}
                      </div>
                    )}
                  </TableCell>
                  <TableCell className="hidden md:table-cell text-xs text-muted-foreground">
                    {p.upiId
                      ? `UPI · ${p.upiId}`
                      : p.accountNumberMasked
                        ? `${p.accountNumberMasked}${
                            p.ifscCode ? ` · ${p.ifscCode}` : ""
                          }`
                        : "—"}
                  </TableCell>
                  <TableCell className="hidden lg:table-cell text-xs font-mono">
                    {p.utr ?? "—"}
                  </TableCell>
                  <TableCell className="hidden lg:table-cell text-xs text-muted-foreground">
                    {dateTime(p.createdAt)}
                  </TableCell>
                  <TableCell className="text-right">
                    {canDisburse(p) ? (
                      <div className="flex items-center justify-end gap-1">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-emerald-600 hover:text-emerald-700"
                          onClick={() => {
                            setUtr("");
                            setProviderRef("");
                            setPayingOut(p);
                          }}
                          title="Mark paid (UTR)"
                        >
                          <CheckCircle2 className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-destructive hover:text-destructive"
                          onClick={() => {
                            setFailReason("");
                            setFailing(p);
                          }}
                          title="Mark failed"
                        >
                          <Ban className="h-4 w-4" />
                        </Button>
                      </div>
                    ) : (
                      <span className="text-xs text-muted-foreground">
                        {p.paidAt ? `Paid ${dateTime(p.paidAt)}` : "—"}
                      </span>
                    )}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <TablePagination
        page={pg.safePage}
        pageSize={pg.pageSize}
        totalRows={serverTotal}
        totalPages={pg.totalPages}
        onPageChange={pg.setPage}
        onPageSizeChange={(n) => {
          pg.setPageSize(n);
          pg.resetPage();
        }}
        pageSizeOptions={PAGE_SIZE_OPTIONS}
      />

      {/* Preview → run dialog */}
      <Dialog open={previewOpen} onOpenChange={setPreviewOpen}>
        <DialogContent className="sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle>Payout preview (dry run)</DialogTitle>
            <DialogDescription>
              Eligible, unsettled seller-orders grouped by seller. Nothing is
              persisted until you run.
            </DialogDescription>
          </DialogHeader>

          <div className="max-h-[50vh] overflow-y-auto rounded-md border">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/40 hover:bg-muted/40">
                  <TableHead>Seller</TableHead>
                  <TableHead className="text-center">Orders</TableHead>
                  <TableHead className="text-right">Gross</TableHead>
                  <TableHead className="text-right">Refund adj.</TableHead>
                  <TableHead className="text-right">Net</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {previewLoading ? (
                  <TableSkeleton colSpan={5} />
                ) : preview.length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={5}
                      className="text-center text-sm text-muted-foreground py-8"
                    >
                      Nothing eligible to settle right now.
                    </TableCell>
                  </TableRow>
                ) : (
                  preview.map((p) => (
                    <TableRow key={p.sellerId}>
                      <TableCell>
                        <div className="font-medium text-sm">{p.sellerName}</div>
                        <div className="text-[10px] text-muted-foreground">
                          {p.sellerId.slice(0, 8)}
                        </div>
                      </TableCell>
                      <TableCell className="text-center">{p.itemCount}</TableCell>
                      <TableCell className="text-right">
                        {money(p.grossAmount, p.currencyCode)}
                      </TableCell>
                      <TableCell className="text-right text-muted-foreground">
                        {p.refundAdjustment > 0
                          ? `−${money(p.refundAdjustment, p.currencyCode)}`
                          : "—"}
                      </TableCell>
                      <TableCell className="text-right font-medium">
                        {money(p.netAmount, p.currencyCode)}
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>

          <DialogFooter className="items-center sm:justify-between gap-3">
            <div className="text-sm text-muted-foreground">
              {preview.length} seller{preview.length === 1 ? "" : "s"} ·{" "}
              <span className="font-medium text-foreground">
                {money(previewTotal)}
              </span>{" "}
              net
            </div>
            <div className="flex gap-2">
              <Button variant="outline" onClick={() => setPreviewOpen(false)}>
                Cancel
              </Button>
              <Button
                onClick={() => createPayoutRun({ variables: { sellerId: null } })}
                disabled={runLoading || previewLoading || preview.length === 0}
              >
                {runLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Run payouts
              </Button>
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Mark paid (UTR) dialog */}
      <Dialog
        open={!!payingOut}
        onOpenChange={(o) => !o && setPayingOut(null)}
      >
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Mark payout paid</DialogTitle>
            <DialogDescription>
              Record the bank/UPI UTR from the completed transfer of{" "}
              <span className="font-semibold text-foreground">
                {payingOut && money(payingOut.netAmount, payingOut.currencyCode)}
              </span>
              .
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="utr">UTR / reference number</Label>
              <Input
                id="utr"
                value={utr}
                onChange={(e) => setUtr(e.target.value)}
                placeholder="e.g. 401512345678"
                autoComplete="off"
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="providerRef">Provider reference (optional)</Label>
              <Input
                id="providerRef"
                value={providerRef}
                onChange={(e) => setProviderRef(e.target.value)}
                placeholder="Gateway payout id, if any"
                autoComplete="off"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setPayingOut(null)}>
              Cancel
            </Button>
            <Button
              onClick={() =>
                payingOut &&
                markPayoutPaid({
                  variables: {
                    input: {
                      payoutId: payingOut.id,
                      utr: utr.trim(),
                      providerRef: providerRef.trim() || null,
                    },
                  },
                })
              }
              disabled={paidLoading || utr.trim().length === 0}
            >
              {paidLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Mark paid
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Mark failed dialog */}
      <Dialog open={!!failing} onOpenChange={(o) => !o && setFailing(null)}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Mark payout failed</DialogTitle>
            <DialogDescription>
              Record why the transfer failed. The seller-orders stay unsettled
              and become eligible for the next run.
            </DialogDescription>
          </DialogHeader>
          <Textarea
            value={failReason}
            onChange={(e) => setFailReason(e.target.value)}
            placeholder="Reason (required)…"
            className="min-h-20"
          />
          <DialogFooter>
            <Button variant="outline" onClick={() => setFailing(null)}>
              Cancel
            </Button>
            <Button
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              onClick={() =>
                failing &&
                markPayoutFailed({
                  variables: {
                    payoutId: failing.id,
                    reason: failReason.trim(),
                  },
                })
              }
              disabled={failLoading || failReason.trim().length === 0}
            >
              {failLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Mark failed
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
