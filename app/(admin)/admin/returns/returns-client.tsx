"use client";

/**
 * Admin Returns console (P3-02) — cross-seller returns oversight: list every
 * ReturnRequest with its lifecycle status, and inspect the transition trail +
 * money linkage (refund + clawback) in a read-only detail dialog. The lifecycle
 * actions themselves belong to the seller queue; admin is oversight only.
 */

import { useEffect, useState } from "react";
import { useQuery, useMutation } from "@apollo/client/react";
import { toast } from "sonner";
import { PackageX, Eye, Loader2 } from "lucide-react";

import {
  GET_ADMIN_RETURNS,
  GET_ADMIN_RETURN,
  DISBURSE_MANUAL_REFUND,
  RETURN_STATUSES,
  type AdminReturnsData,
  type AdminReturnData,
  type DisburseManualRefundData,
  type ReturnStatus,
} from "@/lib/graphql/admin-returns";
import { money, dateTime } from "@/lib/utils/admin-format";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ReturnStatusBadge } from "@/components/orders/return-status-badge";
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
  TableToolbar,
  usePagination,
} from "@/components/ui/data-table";

const COL_COUNT = 6;
const PAGE_SIZE_OPTIONS = [10, 25, 50] as const;

export default function ReturnsClient() {
  useSetPageTitle("Returns");

  const [statusFilter, setStatusFilter] = useState<"all" | ReturnStatus>("all");
  const [search, setSearch] = useState("");
  const [detailId, setDetailId] = useState<string | null>(null);

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

  const { data, loading, error } = useQuery<AdminReturnsData>(
    GET_ADMIN_RETURNS,
    { variables: vars, fetchPolicy: "cache-and-network" },
  );

  useEffect(() => {
    if (error) toast.error(`Failed to load returns: ${error.message}`);
  }, [error]);

  useEffect(() => {
    const c = data?.adminReturns?.totalCount;
    if (typeof c === "number" && c !== serverTotal) setServerTotal(c);
  }, [data?.adminReturns?.totalCount, serverTotal]);

  const allItems = data?.adminReturns?.items ?? [];
  const q = search.trim().toLowerCase();
  const items = q
    ? allItems.filter(
        (r) =>
          r.returnNumber.toLowerCase().includes(q) ||
          r.sellerOrderId.toLowerCase().includes(q),
      )
    : allItems;
  const activeFilterCount = (statusFilter !== "all" ? 1 : 0) + (q ? 1 : 0);
  const resetFilters = () => {
    setStatusFilter("all");
    setSearch("");
    pg.resetPage();
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-bold tracking-tight flex items-center gap-2">
          <PackageX className="h-6 w-6 text-primary" />
          Returns
        </h1>
        <p className="text-sm text-muted-foreground">
          Every return/RMA across all sellers. Oversight only — sellers approve,
          schedule pickups, and pass QC from their portal.
        </p>
      </div>

      <TableToolbar
        search={search}
        onSearchChange={setSearch}
        searchPlaceholder="Search return # or seller-order id…"
        activeFilterCount={activeFilterCount}
        onReset={resetFilters}
        primaryFilters={
          <Select
            value={statusFilter}
            onValueChange={(v) => setStatusFilter(v as "all" | ReturnStatus)}
          >
            <SelectTrigger className="w-full sm:w-52">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All statuses</SelectItem>
              {RETURN_STATUSES.map((s) => (
                <SelectItem key={s} value={s}>
                  {s}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        }
      />

      <div className="rounded-lg border bg-card shadow-sm overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/40 hover:bg-muted/40">
              <TableHead>Return</TableHead>
              <TableHead>Order</TableHead>
              <TableHead className="text-center">Status</TableHead>
              <TableHead className="text-right">Refund</TableHead>
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
                icon={PackageX}
                hasFilters={activeFilterCount > 0}
                onClearFilters={resetFilters}
              >
                No returns found.
              </TableEmpty>
            ) : (
              items.map((r) => (
                <TableRow key={r.id}>
                  <TableCell>
                    <div className="font-mono text-xs">{r.returnNumber}</div>
                    {r.reason && (
                      <div className="text-xs text-muted-foreground max-w-[16rem] truncate">
                        {r.reason}
                      </div>
                    )}
                  </TableCell>
                  <TableCell>
                    <div className="font-mono text-xs">
                      {r.sellerOrderId.slice(0, 8)}
                    </div>
                  </TableCell>
                  <TableCell className="text-center">
                    <ReturnStatusBadge status={r.status} className="text-[10px]" />
                  </TableCell>
                  <TableCell className="text-right font-medium">
                    {r.refundAmount != null ? money(r.refundAmount) : "—"}
                  </TableCell>
                  <TableCell className="hidden lg:table-cell text-xs text-muted-foreground">
                    {dateTime(r.requestedAt)}
                  </TableCell>
                  <TableCell className="text-right">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8"
                      onClick={() => setDetailId(r.id)}
                      title="View return"
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
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

      <Dialog open={!!detailId} onOpenChange={(o) => !o && setDetailId(null)}>
        <DialogContent className="max-w-lg">
          {detailId && <ReturnDetail id={detailId} />}
        </DialogContent>
      </Dialog>
    </div>
  );
}

function ReturnDetail({ id }: { id: string }) {
  const { data, loading, refetch } = useQuery<AdminReturnData>(
    GET_ADMIN_RETURN,
    { variables: { id } },
  );
  const [reference, setReference] = useState("");

  const [disburse, { loading: disbursing }] =
    useMutation<DisburseManualRefundData>(DISBURSE_MANUAL_REFUND, {
      onCompleted: () => {
        toast.success("Manual refund disbursement recorded");
        setReference("");
        void refetch();
      },
      onError: (e) => toast.error(e.message),
    });

  const r = data?.adminReturn;
  const mr = r?.manualRefund;
  return (
    <>
      <DialogHeader>
        <DialogTitle className="font-mono text-sm">
          {r?.returnNumber ?? "Return"}
        </DialogTitle>
        <DialogDescription>
          Return lifecycle, refund + clawback linkage.
        </DialogDescription>
      </DialogHeader>
      {loading || !r ? (
        <div className="py-6 text-sm text-muted-foreground">Loading…</div>
      ) : (
        <div className="space-y-4 text-sm">
          <div className="flex items-center justify-between">
            <ReturnStatusBadge status={r.status} />
            <span className="font-medium">
              {r.refundAmount != null ? money(r.refundAmount) : "—"}
            </span>
          </div>
          <div className="text-muted-foreground">
            <div>Reason: {r.reason}</div>
            {r.reverseAwb && <div>Reverse AWB: {r.reverseAwb}</div>}
            {r.refundId && <div>Refund: {r.refundId.slice(0, 12)}…</div>}
            {r.replacementReference && (
              <div>Replacement ref: {r.replacementReference}</div>
            )}
          </div>

          {mr?.disbursable && r.refundId && (
            <div className="rounded-md border border-amber-300 bg-amber-50 p-3 space-y-2 dark:border-amber-500/40 dark:bg-amber-500/10">
              <div className="text-xs font-medium text-amber-900 dark:text-amber-200">
                COD refund pending manual disbursement — {money(mr.amount)}
              </div>
              <Input
                value={reference}
                onChange={(e) => setReference(e.target.value)}
                placeholder="UTR / bank reference"
                className="h-8"
              />
              <Button
                size="sm"
                disabled={disbursing || !reference.trim()}
                onClick={() =>
                  disburse({
                    variables: {
                      refundId: r.refundId,
                      reference: reference.trim(),
                    },
                  })
                }
              >
                {disbursing && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Mark disbursed
              </Button>
            </div>
          )}
          {mr && mr.isManual && !mr.disbursable && mr.reference && (
            <div className="text-xs text-muted-foreground">
              Disbursed · ref {mr.reference}
            </div>
          )}

          <div>
            <div className="mb-1 font-medium">Timeline</div>
            <ol className="space-y-1">
              {(r.events ?? []).map((e) => (
                <li
                  key={e.id}
                  className="flex items-center justify-between gap-2 text-xs"
                >
                  <span>
                    {e.fromStatus ? `${e.fromStatus} → ` : ""}
                    {e.toStatus}
                    {e.note ? ` — ${e.note}` : ""}
                  </span>
                  <span className="text-muted-foreground whitespace-nowrap">
                    {dateTime(e.createdAt)}
                  </span>
                </li>
              ))}
            </ol>
          </div>
        </div>
      )}
    </>
  );
}
