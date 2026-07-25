"use client";

/**
 * Admin Orders console (Phase 3 Wave 4) — cross-seller view of every PARENT
 * order, with status / payment / date / free-text filters, a detail sheet that
 * breaks the order down by seller, and a guarded admin-cancel that runs through
 * the existing cancellation service path.
 *
 * Backend: OrderAdminResolver (adminOrders / adminOrder gated order:read;
 * adminCancelOrder gated order:manage). The older per-seller-order invoice-audit
 * surface (adminSellerOrdersWithInvoices) still lives in admin-orders.ts and is
 * unchanged — this console targets the parent Order instead.
 */

import { useEffect, useMemo, useState } from "react";
import { useQuery, useMutation } from "@apollo/client/react";
import { toast } from "sonner";
import {
  FileText,
  Loader2,
  Package,
  Eye,
  Ban,
  Store as StoreIcon,
} from "lucide-react";

import {
  GET_ADMIN_PARENT_ORDERS,
  GET_ADMIN_PARENT_ORDER,
  ADMIN_CANCEL_ORDER,
  ORDER_STATUSES,
  PAYMENT_STATUSES,
  ORDER_STATUS_LABEL,
  PAYMENT_STATUS_LABEL,
  type AdminParentOrder,
  type AdminParentOrdersData,
  type AdminParentOrderData,
  type AdminCancelOrderData,
  type OrderStatus,
} from "@/lib/graphql/admin-orders";
import { money, dateTime } from "@/lib/utils/admin-format";
import { useAdminPermissions } from "@/hooks/use-admin-permissions";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { useSetPageTitle } from "@/components/shell/page-title-context";
import {
  TableEmpty,
  TablePagination,
  TableSkeleton,
  TableToolbar,
  usePagination,
} from "@/components/ui/data-table";

const COL_COUNT = 6;
const PAGE_SIZE_OPTIONS = [25, 50, 100] as const;

const ORDER_STATUS_VARIANT: Record<
  OrderStatus,
  "default" | "secondary" | "destructive" | "outline"
> = {
  PENDING: "secondary",
  CONFIRMED: "outline",
  PACKED: "outline",
  SHIPPED: "outline",
  DELIVERED: "default",
  CANCELLED: "destructive",
  REFUNDED: "destructive",
};

// A parent order can only be cancelled here while no money has been captured
// (mirrors the backend guard: a paid order routes to the Refunds console).
const PAID_LIKE = new Set([
  "PAID",
  "PARTIALLY_PAID",
  "PARTIALLY_REFUNDED",
  "REFUNDED",
]);
function isCancellable(o: {
  status: OrderStatus;
  paymentStatus: string;
}): boolean {
  return o.status !== "CANCELLED" && !PAID_LIKE.has(o.paymentStatus);
}

export default function OrdersClient() {
  useSetPageTitle("Orders");
  const { can } = useAdminPermissions();
  const canManage = can(["order:manage"]);

  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | OrderStatus>("all");
  const [paymentFilter, setPaymentFilter] = useState<string>("all");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");

  const [detailId, setDetailId] = useState<string | null>(null);
  const [cancelTarget, setCancelTarget] = useState<AdminParentOrder | null>(
    null,
  );
  const [cancelReason, setCancelReason] = useState("");

  const [serverTotal, setServerTotal] = useState(0);
  const pg = usePagination({ totalRows: serverTotal, defaultPageSize: 25 });

  // Debounce the free-text search so we don't re-query on every keystroke.
  useEffect(() => {
    const t = setTimeout(() => setDebouncedSearch(search.trim()), 300);
    return () => clearTimeout(t);
  }, [search]);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    pg.resetPage();
  }, [
    debouncedSearch,
    statusFilter,
    paymentFilter,
    dateFrom,
    dateTo,
    pg.pageSize,
  ]);

  const vars = useMemo(
    () => ({
      page: pg.page,
      pageSize: pg.pageSize,
      status: statusFilter === "all" ? undefined : statusFilter,
      paymentStatus: paymentFilter === "all" ? undefined : paymentFilter,
      search: debouncedSearch || undefined,
      dateFrom: dateFrom ? new Date(dateFrom).toISOString() : undefined,
      dateTo: dateTo
        ? new Date(`${dateTo}T23:59:59.999`).toISOString()
        : undefined,
    }),
    [
      pg.page,
      pg.pageSize,
      statusFilter,
      paymentFilter,
      debouncedSearch,
      dateFrom,
      dateTo,
    ],
  );

  const { data, loading, error } = useQuery<AdminParentOrdersData>(
    GET_ADMIN_PARENT_ORDERS,
    { variables: vars, fetchPolicy: "cache-and-network" },
  );

  useEffect(() => {
    if (error) toast.error(`Failed to load orders: ${error.message}`);
  }, [error]);

  useEffect(() => {
    const c = data?.adminOrders?.totalCount;
    if (typeof c === "number" && c !== serverTotal) setServerTotal(c);
  }, [data?.adminOrders?.totalCount, serverTotal]);

  const { data: detailData, loading: detailLoading } =
    useQuery<AdminParentOrderData>(GET_ADMIN_PARENT_ORDER, {
      variables: { id: detailId },
      skip: !detailId,
    });

  const [cancelOrder, { loading: cancelling }] =
    useMutation<AdminCancelOrderData>(ADMIN_CANCEL_ORDER, {
      refetchQueries: [
        { query: GET_ADMIN_PARENT_ORDERS, variables: vars },
        ...(detailId
          ? [{ query: GET_ADMIN_PARENT_ORDER, variables: { id: detailId } }]
          : []),
      ],
      onCompleted: () => {
        toast.success("Order cancelled");
        setCancelTarget(null);
        setCancelReason("");
      },
      onError: (e) => toast.error(`Cancel failed: ${e.message}`),
    });

  const doCancel = () => {
    if (!cancelTarget) return;
    cancelOrder({
      variables: {
        id: cancelTarget.id,
        reason: cancelReason.trim() || undefined,
      },
    });
  };

  const items = data?.adminOrders?.items ?? [];
  const detail = detailData?.adminOrder;

  const activeFilterCount =
    (debouncedSearch ? 1 : 0) +
    (statusFilter !== "all" ? 1 : 0) +
    (paymentFilter !== "all" ? 1 : 0) +
    (dateFrom ? 1 : 0) +
    (dateTo ? 1 : 0);

  const resetFilters = () => {
    setSearch("");
    setStatusFilter("all");
    setPaymentFilter("all");
    setDateFrom("");
    setDateTo("");
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-bold tracking-tight flex items-center gap-2">
          <Package className="h-6 w-6 text-primary" />
          Orders
        </h1>
        <p className="text-sm text-muted-foreground">
          Every customer order across the marketplace. Filter by status, payment
          or date, open an order to see its per-seller breakdown, and cancel an
          unpaid order when needed.
        </p>
      </div>

      <TableToolbar
        search={search}
        onSearchChange={setSearch}
        searchPlaceholder="Search order #, customer, seller/store…"
        activeFilterCount={activeFilterCount}
        onReset={resetFilters}
        primaryFilters={
          <div className="flex flex-col gap-2 sm:flex-row sm:flex-wrap">
            <Select
              value={statusFilter}
              onValueChange={(v) => setStatusFilter(v as "all" | OrderStatus)}
            >
              <SelectTrigger className="w-full sm:w-44">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All statuses</SelectItem>
                {ORDER_STATUSES.map((s) => (
                  <SelectItem key={s} value={s}>
                    {ORDER_STATUS_LABEL[s]}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select
              value={paymentFilter}
              onValueChange={setPaymentFilter}
            >
              <SelectTrigger className="w-full sm:w-44">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All payments</SelectItem>
                {PAYMENT_STATUSES.map((s) => (
                  <SelectItem key={s} value={s}>
                    {PAYMENT_STATUS_LABEL[s] ?? s}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        }
        advancedFilters={
          <>
            <div className="space-y-1.5">
              <Label className="text-xs">Placed from</Label>
              <input
                type="date"
                value={dateFrom}
                onChange={(e) => setDateFrom(e.target.value)}
                className="h-9 w-full rounded-md border border-input bg-transparent px-3 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
              />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs">Placed to</Label>
              <input
                type="date"
                value={dateTo}
                onChange={(e) => setDateTo(e.target.value)}
                className="h-9 w-full rounded-md border border-input bg-transparent px-3 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
              />
            </div>
          </>
        }
      />

      <div className="rounded-lg border bg-card shadow-sm overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/40 hover:bg-muted/40">
              <TableHead>Order</TableHead>
              <TableHead>Customer / Sellers</TableHead>
              <TableHead className="text-center">Status</TableHead>
              <TableHead className="text-center">Payment</TableHead>
              <TableHead className="text-right">Total</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading && items.length === 0 ? (
              <TableSkeleton colSpan={COL_COUNT} />
            ) : items.length === 0 ? (
              <TableEmpty
                colSpan={COL_COUNT}
                icon={Package}
                hasFilters={activeFilterCount > 0}
                onClearFilters={resetFilters}
              >
                No orders found.
              </TableEmpty>
            ) : (
              items.map((o) => {
                const sellerCount = o.sellerOrders.length;
                return (
                  <TableRow key={o.id}>
                    <TableCell>
                      <button
                        onClick={() => setDetailId(o.id)}
                        className="text-left hover:underline"
                      >
                        <div className="font-medium text-sm">
                          {o.orderNumber}
                        </div>
                        <div className="text-[10px] text-muted-foreground">
                          {o.itemCount} item{o.itemCount === 1 ? "" : "s"} ·{" "}
                          {dateTime(o.placedAt)}
                        </div>
                      </button>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1 text-xs text-muted-foreground">
                        <StoreIcon className="h-3 w-3" />
                        {sellerCount} seller{sellerCount === 1 ? "" : "s"}
                      </div>
                      <div className="text-[10px] text-muted-foreground truncate max-w-[16rem]">
                        {o.sellerOrders
                          .map((so) => so.storeName)
                          .filter(Boolean)
                          .join(", ") || "—"}
                      </div>
                    </TableCell>
                    <TableCell className="text-center">
                      <Badge
                        variant={ORDER_STATUS_VARIANT[o.status] ?? "outline"}
                        className="text-[10px]"
                      >
                        {ORDER_STATUS_LABEL[o.status] ?? o.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-center text-xs text-muted-foreground">
                      {PAYMENT_STATUS_LABEL[o.paymentStatus] ?? o.paymentStatus}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="font-medium">
                        {money(o.totalAmount, o.currencyCode)}
                      </div>
                      <div className="text-[10px] text-muted-foreground">
                        {o.paymentMethod}
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-1">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8"
                          onClick={() => setDetailId(o.id)}
                          title="View detail"
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        {canManage && isCancellable(o) && (
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-destructive"
                            onClick={() => {
                              setCancelReason("");
                              setCancelTarget(o);
                            }}
                            title="Cancel order"
                          >
                            <Ban className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
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

      {/* Detail sheet */}
      <Sheet open={!!detailId} onOpenChange={(o) => !o && setDetailId(null)}>
        <SheetContent className="sm:max-w-xl w-full overflow-y-auto">
          <SheetHeader>
            <SheetTitle>{detail ? detail.orderNumber : "Order detail"}</SheetTitle>
            <SheetDescription>
              {detail
                ? `${detail.itemCount} item${
                    detail.itemCount === 1 ? "" : "s"
                  } · placed ${dateTime(detail.placedAt)}`
                : ""}
            </SheetDescription>
          </SheetHeader>

          {detailLoading || !detail ? (
            <div className="p-6 flex justify-center">
              <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
            </div>
          ) : (
            <div className="px-4 pb-6 space-y-5">
              <div className="grid grid-cols-2 gap-3 text-sm">
                <Stat
                  label="Status"
                  value={ORDER_STATUS_LABEL[detail.status] ?? detail.status}
                />
                <Stat
                  label="Payment"
                  value={
                    PAYMENT_STATUS_LABEL[detail.paymentStatus] ??
                    detail.paymentStatus
                  }
                />
                <Stat label="Method" value={detail.paymentMethod} />
                <Stat label="Total" value={money(detail.totalAmount, detail.currencyCode)} />
              </div>

              {detail.buyerGstin && (
                <div className="text-xs text-muted-foreground">
                  Buyer GSTIN: <span className="font-mono">{detail.buyerGstin}</span>
                </div>
              )}

              <Separator />

              <div>
                <h4 className="text-xs font-semibold uppercase text-muted-foreground mb-2">
                  Sellers ({detail.sellerOrders.length})
                </h4>
                <div className="space-y-3">
                  {detail.sellerOrders.map((so) => (
                    <div
                      key={so.id}
                      className="rounded-md border bg-muted/30 p-3 space-y-1"
                    >
                      <div className="flex items-center justify-between gap-2">
                        <div className="min-w-0">
                          <div className="text-sm font-medium truncate">
                            {so.storeName ?? "—"}
                          </div>
                          <div className="text-[10px] text-muted-foreground">
                            {so.orderNumber}
                          </div>
                        </div>
                        <Badge
                          variant={ORDER_STATUS_VARIANT[so.status] ?? "outline"}
                          className="text-[10px] shrink-0"
                        >
                          {ORDER_STATUS_LABEL[so.status] ?? so.status}
                        </Badge>
                      </div>
                      <div className="flex justify-between text-xs text-muted-foreground">
                        <span>
                          Payout {money(so.payoutAmount, so.currencyCode)}
                        </span>
                        <span>
                          {PAYMENT_STATUS_LABEL[so.paymentStatus] ??
                            so.paymentStatus}
                        </span>
                      </div>
                      {so.trackingNumber && (
                        <div className="text-[10px] text-muted-foreground">
                          {so.carrier ? `${so.carrier} · ` : ""}
                          {so.trackingNumber}
                        </div>
                      )}
                      {so.invoiceUrl && (
                        <a
                          href={so.invoiceUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 text-[10px] text-primary hover:underline"
                        >
                          <FileText className="h-3 w-3" />
                          {so.invoiceNumber ?? "Invoice"}
                        </a>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              <Separator />

              <div className="space-y-1 text-sm">
                <Row
                  label="Subtotal"
                  value={money(detail.subtotal, detail.currencyCode)}
                />
                <Row
                  label="Tax"
                  value={money(detail.taxAmount, detail.currencyCode)}
                />
                <Row
                  label="Shipping"
                  value={money(detail.shippingAmount, detail.currencyCode)}
                />
                <Row
                  label="Discount"
                  value={money(detail.discountAmount, detail.currencyCode)}
                />
                <Row
                  label="Total"
                  value={money(detail.totalAmount, detail.currencyCode)}
                  strong
                />
              </div>

              {detail.shippingAddress && (
                <>
                  <Separator />
                  <div>
                    <h4 className="text-xs font-semibold uppercase text-muted-foreground mb-1">
                      Ship to
                    </h4>
                    <p className="text-sm">
                      {detail.shippingAddress.firstName}{" "}
                      {detail.shippingAddress.lastName}
                      <br />
                      {detail.shippingAddress.addressLine1}
                      {detail.shippingAddress.addressLine2
                        ? `, ${detail.shippingAddress.addressLine2}`
                        : ""}
                      <br />
                      {detail.shippingAddress.city},{" "}
                      {detail.shippingAddress.state}{" "}
                      {detail.shippingAddress.postalCode}
                    </p>
                  </div>
                </>
              )}

              {canManage && (
                <>
                  <Separator />
                  {isCancellable(detail) ? (
                    <Button
                      variant="destructive"
                      className="w-full"
                      onClick={() => {
                        setCancelReason("");
                        setCancelTarget(detail);
                      }}
                    >
                      <Ban className="mr-2 h-4 w-4" />
                      Cancel order
                    </Button>
                  ) : (
                    <p className="text-xs text-muted-foreground">
                      {detail.status === "CANCELLED"
                        ? "This order is already cancelled."
                        : "This order has a captured payment — cancel and refund it from the Refunds console."}
                    </p>
                  )}
                </>
              )}
            </div>
          )}
        </SheetContent>
      </Sheet>

      {/* Cancel confirmation */}
      <AlertDialog
        open={!!cancelTarget}
        onOpenChange={(o) => {
          if (!o) {
            setCancelTarget(null);
            setCancelReason("");
          }
        }}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              Cancel order {cancelTarget?.orderNumber}?
            </AlertDialogTitle>
            <AlertDialogDescription>
              This cancels every seller sub-order and releases the reserved
              stock back to inventory. It cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="space-y-1.5">
            <Label htmlFor="cancel-reason" className="text-xs">
              Reason (optional)
            </Label>
            <Textarea
              id="cancel-reason"
              value={cancelReason}
              onChange={(e) => setCancelReason(e.target.value)}
              placeholder="e.g. duplicate order, customer request via support…"
              rows={3}
            />
          </div>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={cancelling}>Keep order</AlertDialogCancel>
            <AlertDialogAction
              onClick={(e) => {
                e.preventDefault();
                doCancel();
              }}
              disabled={cancelling}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {cancelling && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Cancel order
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-md bg-muted/40 p-2">
      <div className="text-[10px] uppercase text-muted-foreground">{label}</div>
      <div className="font-medium">{value}</div>
    </div>
  );
}

function Row({
  label,
  value,
  strong,
}: {
  label: string;
  value: string;
  strong?: boolean;
}) {
  return (
    <div className="flex justify-between">
      <span className="text-muted-foreground">{label}</span>
      <span className={strong ? "font-semibold" : ""}>{value}</span>
    </div>
  );
}
