"use client";

/**
 * Admin Refunds console (P3-06) — list every buyer-refund attempt across all
 * sellers, and approve / reject the ones still in REQUESTED. Consumes the
 * existing RefundAdminResolver; the money movement itself is the backend's job.
 */

import { useEffect, useState } from "react";
import { useQuery, useMutation } from "@apollo/client/react";
import { toast } from "sonner";
import { Check, Loader2, Receipt, X } from "lucide-react";

import {
  GET_ADMIN_REFUNDS,
  APPROVE_REFUND,
  REJECT_REFUND,
  REFUND_STATUSES,
  type AdminRefund,
  type AdminRefundsData,
  type ApproveRefundData,
  type RejectRefundData,
  type RefundStatus,
} from "@/lib/graphql/admin-refunds";
import { money, dateTime } from "@/lib/utils/admin-format";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
import { useSetPageTitle } from "@/components/shell/page-title-context";
import {
  TableEmpty,
  TablePagination,
  TableSkeleton,
  TableToolbar,
  usePagination,
} from "@/components/ui/data-table";

const COL_COUNT = 7;
const PAGE_SIZE_OPTIONS = [10, 25, 50] as const;

const STATUS_VARIANT: Record<
  RefundStatus,
  "default" | "secondary" | "destructive" | "outline"
> = {
  REQUESTED: "secondary",
  PROCESSING: "outline",
  PROCESSED: "default",
  REJECTED: "destructive",
  FAILED: "destructive",
  CANCELLED: "outline",
};

export default function RefundsClient() {
  useSetPageTitle("Refunds");

  const [statusFilter, setStatusFilter] = useState<"all" | RefundStatus>("all");
  const [orderIdInput, setOrderIdInput] = useState("");
  const [orderIdFilter, setOrderIdFilter] = useState("");

  const [approving, setApproving] = useState<AdminRefund | null>(null);
  const [rejecting, setRejecting] = useState<AdminRefund | null>(null);
  const [rejectReason, setRejectReason] = useState("");

  const [serverTotal, setServerTotal] = useState(0);
  const pg = usePagination({ totalRows: serverTotal, defaultPageSize: 10 });

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    pg.resetPage();
  }, [statusFilter, orderIdFilter, pg.pageSize]);

  const vars = {
    page: pg.page,
    pageSize: pg.pageSize,
    status: statusFilter === "all" ? null : statusFilter,
    orderId: orderIdFilter || null,
  };

  const { data, loading, error } = useQuery<AdminRefundsData>(
    GET_ADMIN_REFUNDS,
    { variables: vars, fetchPolicy: "cache-and-network" },
  );

  useEffect(() => {
    if (error) toast.error(`Failed to load refunds: ${error.message}`);
  }, [error]);

  useEffect(() => {
    const c = data?.adminRefunds?.totalCount;
    if (typeof c === "number" && c !== serverTotal) setServerTotal(c);
  }, [data?.adminRefunds?.totalCount, serverTotal]);

  const [approveRefund, { loading: approveLoading }] =
    useMutation<ApproveRefundData>(APPROVE_REFUND, {
      refetchQueries: [{ query: GET_ADMIN_REFUNDS, variables: vars }],
      onCompleted: () => {
        toast.success("Refund approved");
        setApproving(null);
      },
      onError: (e) => toast.error(`Approve failed: ${e.message}`),
    });

  const [rejectRefund, { loading: rejectLoading }] =
    useMutation<RejectRefundData>(REJECT_REFUND, {
      refetchQueries: [{ query: GET_ADMIN_REFUNDS, variables: vars }],
      onCompleted: () => {
        toast.success("Refund rejected");
        setRejecting(null);
        setRejectReason("");
      },
      onError: (e) => toast.error(`Reject failed: ${e.message}`),
    });

  const items = data?.adminRefunds?.items ?? [];
  const activeFilterCount =
    (statusFilter !== "all" ? 1 : 0) + (orderIdFilter ? 1 : 0);

  const resetFilters = () => {
    setStatusFilter("all");
    setOrderIdInput("");
    setOrderIdFilter("");
    pg.resetPage();
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-bold tracking-tight flex items-center gap-2">
          <Receipt className="h-6 w-6 text-primary" />
          Refunds
        </h1>
        <p className="text-sm text-muted-foreground">
          Buyer-refund requests across every seller. Approving executes the
          refund against the captured payment; rejecting closes the request.
        </p>
      </div>

      <TableToolbar
        search={orderIdInput}
        onSearchChange={setOrderIdInput}
        searchPlaceholder="Filter by exact Order ID…"
        activeFilterCount={activeFilterCount}
        onReset={resetFilters}
        primaryFilters={
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <Select
              value={statusFilter}
              onValueChange={(v) => setStatusFilter(v as "all" | RefundStatus)}
            >
              <SelectTrigger className="w-full sm:w-44">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All statuses</SelectItem>
                {REFUND_STATUSES.map((s) => (
                  <SelectItem key={s} value={s}>
                    {s}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button
              variant="secondary"
              onClick={() => {
                setOrderIdFilter(orderIdInput.trim());
                pg.resetPage();
              }}
            >
              Apply order filter
            </Button>
          </div>
        }
      />

      <div className="rounded-lg border bg-card shadow-sm overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/40 hover:bg-muted/40">
              <TableHead>Refund</TableHead>
              <TableHead>Order</TableHead>
              <TableHead className="text-right">Amount</TableHead>
              <TableHead className="text-center">Status</TableHead>
              <TableHead className="text-center">Restock</TableHead>
              <TableHead className="hidden lg:table-cell">Requested</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading && items.length === 0 ? (
              <TableSkeleton colSpan={COL_COUNT} />
            ) : items.length === 0 ? (
              <TableEmpty
                colSpan={COL_COUNT}
                icon={Receipt}
                hasFilters={activeFilterCount > 0}
                onClearFilters={resetFilters}
              >
                No refunds found.
              </TableEmpty>
            ) : (
              items.map((r) => {
                const canAct = r.status === "REQUESTED";
                return (
                  <TableRow key={r.id}>
                    <TableCell>
                      <div className="font-mono text-xs">
                        {r.id.slice(0, 8)}
                      </div>
                      {r.reason && (
                        <div className="text-xs text-muted-foreground max-w-[16rem] truncate">
                          {r.reason}
                        </div>
                      )}
                      {r.failureReason && (
                        <div className="text-xs text-destructive max-w-[16rem] truncate">
                          {r.failureReason}
                        </div>
                      )}
                    </TableCell>
                    <TableCell>
                      <div className="font-mono text-xs">
                        {r.orderId.slice(0, 8)}
                      </div>
                      {r.sellerOrderId && (
                        <div className="text-[10px] text-muted-foreground">
                          seller: {r.sellerOrderId.slice(0, 8)}
                        </div>
                      )}
                    </TableCell>
                    <TableCell className="text-right font-medium">
                      {money(r.amount)}
                    </TableCell>
                    <TableCell className="text-center">
                      <Badge
                        variant={STATUS_VARIANT[r.status]}
                        className="text-[10px]"
                      >
                        {r.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-center text-xs text-muted-foreground">
                      {r.restock ? "Yes" : "No"}
                    </TableCell>
                    <TableCell className="hidden lg:table-cell text-xs text-muted-foreground">
                      {dateTime(r.createdAt)}
                    </TableCell>
                    <TableCell className="text-right">
                      {canAct ? (
                        <div className="flex items-center justify-end gap-1">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-emerald-600 hover:text-emerald-700"
                            onClick={() => setApproving(r)}
                            title="Approve refund"
                          >
                            <Check className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-destructive hover:text-destructive"
                            onClick={() => {
                              setRejectReason("");
                              setRejecting(r);
                            }}
                            title="Reject refund"
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      ) : (
                        <span className="text-xs text-muted-foreground">—</span>
                      )}
                    </TableCell>
                  </TableRow>
                );
              })
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

      {/* Approve confirm */}
      <AlertDialog
        open={!!approving}
        onOpenChange={(o) => !o && setApproving(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Approve this refund?</AlertDialogTitle>
            <AlertDialogDescription>
              This executes a{" "}
              <span className="font-semibold text-foreground">
                {approving && money(approving.amount)}
              </span>{" "}
              refund against the captured payment
              {approving?.restock && " and restocks the returned items"}. This
              cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={(e) => {
                e.preventDefault();
                if (approving)
                  approveRefund({ variables: { refundId: approving.id } });
              }}
              disabled={approveLoading}
            >
              {approveLoading && (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              )}
              Approve &amp; refund
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Reject dialog (with reason) */}
      <AlertDialog
        open={!!rejecting}
        onOpenChange={(o) => !o && setRejecting(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Reject this refund?</AlertDialogTitle>
            <AlertDialogDescription>
              The request is closed with no money moved. Add an optional note for
              the audit trail.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <Textarea
            value={rejectReason}
            onChange={(e) => setRejectReason(e.target.value)}
            placeholder="Reason (optional)…"
            className="min-h-20"
          />
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              onClick={(e) => {
                e.preventDefault();
                if (rejecting)
                  rejectRefund({
                    variables: {
                      refundId: rejecting.id,
                      reason: rejectReason.trim() || null,
                    },
                  });
              }}
              disabled={rejectLoading}
            >
              {rejectLoading && (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              )}
              Reject refund
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
