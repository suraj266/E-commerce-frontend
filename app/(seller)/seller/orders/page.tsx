"use client";

/**
 * /seller/orders — seller's incoming orders as a data table.
 *
 * Each row is a SellerOrder (one seller's slice of a customer's checkout),
 * not the parent Order. Sellers never see other sellers' items.
 *
 * Server query supports `status` + pagination only, so multi-status / search /
 * date / amount filters run client-side. We fetch a large batch (FETCH_LIMIT)
 * and paginate the filtered+sorted result locally.
 */

import { useMemo, useState } from "react";
import Link from "next/link";
import { useQuery } from "@apollo/client/react";
import { Download, Eye, Package } from "lucide-react";

import { GET_MY_SELLER_ORDERS } from "@/lib/graphql/orders";
import {
  MySellerOrdersData,
  ORDER_STATUSES,
  ORDER_STATUS_LABEL,
  PAYMENT_STATUSES,
  type OrderStatus,
  type PaymentStatus,
  type SellerOrder,
} from "@/types/order.types";
import { formatPrice } from "@/lib/utils/currency";
import { OrderStatusBadge } from "@/components/orders/order-status-badge";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  exportToCsv,
  FilterPills,
  SortHeader,
  TableEmpty,
  TablePagination,
  TableSkeleton,
  TableToolbar,
  usePagination,
  useSort,
} from "@/components/ui/data-table";

const FETCH_LIMIT = 200;
const COL_COUNT = 10;

type SortKey =
  | "orderNumber"
  | "createdAt"
  | "customerName"
  | "itemCount"
  | "total"
  | "status";

/** Amount the customer actually paid for this seller's slice. */
function customerTotal(so: SellerOrder): number {
  return so.subtotal + so.taxAmount + so.shippingAmount - so.discountAmount;
}

const PAYMENT_LABEL: Record<PaymentStatus, string> = {
  PENDING: "Pending",
  AWAITING_PAYMENT: "Awaiting Payment",
  PAID: "Paid",
  PARTIALLY_PAID: "Partially Paid",
  REFUNDED: "Refunded",
  PARTIALLY_REFUNDED: "Partially Refunded",
  FAILED: "Failed",
};

const PAYMENT_VARIANT: Record<
  PaymentStatus,
  "default" | "secondary" | "destructive" | "outline"
> = {
  PENDING: "outline",
  AWAITING_PAYMENT: "outline",
  PAID: "default",
  PARTIALLY_PAID: "secondary",
  REFUNDED: "destructive",
  PARTIALLY_REFUNDED: "secondary",
  FAILED: "destructive",
};

export default function SellerOrdersPage() {
  // ---- domain filters (page-owned) -----------------------------------------
  const [search, setSearch] = useState("");
  const [statusFilters, setStatusFilters] = useState<OrderStatus[]>([]);
  const [paymentFilters, setPaymentFilters] = useState<PaymentStatus[]>([]);
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [minAmount, setMinAmount] = useState("");
  const [maxAmount, setMaxAmount] = useState("");

  // ---- data fetch -----------------------------------------------------------
  const { data, loading } = useQuery<MySellerOrdersData>(
    GET_MY_SELLER_ORDERS,
    {
      variables: { status: null, page: 1, pageSize: FETCH_LIMIT },
      fetchPolicy: "cache-and-network",
      errorPolicy: "all",
    },
  );

  const all = data?.mySellerOrders?.items ?? [];
  const serverTotal = data?.mySellerOrders?.totalCount ?? all.length;

  // ---- filter ---------------------------------------------------------------
  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    const fromTs = dateFrom ? new Date(dateFrom).getTime() : null;
    const toTs = dateTo ? new Date(dateTo).getTime() + 86_400_000 - 1 : null;
    const min = minAmount ? Number(minAmount) : null;
    const max = maxAmount ? Number(maxAmount) : null;

    return all.filter((so) => {
      if (statusFilters.length && !statusFilters.includes(so.status)) {
        return false;
      }
      if (
        paymentFilters.length &&
        !paymentFilters.includes(so.paymentStatus)
      ) {
        return false;
      }
      const ts = new Date(so.createdAt).getTime();
      if (fromTs != null && ts < fromTs) return false;
      if (toTs != null && ts > toTs) return false;
      const total = customerTotal(so);
      if (min != null && total < min) return false;
      if (max != null && total > max) return false;

      if (q) {
        const haystack = [
          so.orderNumber,
          so.parentOrderNumber ?? "",
          so.customerName ?? "",
          so.storeName ?? "",
          ...so.items.map((i) => `${i.name} ${i.sku} ${i.variantName ?? ""}`),
        ]
          .join(" ")
          .toLowerCase();
        if (!haystack.includes(q)) return false;
      }
      return true;
    });
  }, [
    all,
    search,
    statusFilters,
    paymentFilters,
    dateFrom,
    dateTo,
    minAmount,
    maxAmount,
  ]);

  // ---- shared table state ---------------------------------------------------
  const sort = useSort<SortKey>({
    defaultSort: { key: "createdAt", dir: "desc" },
    descByDefaultFor: ["createdAt", "total"],
  });
  const pg = usePagination({ totalRows: filtered.length, defaultPageSize: 25 });

  // ---- sort -----------------------------------------------------------------
  const sorted = useMemo(() => {
    const dir = sort.sortDir === "asc" ? 1 : -1;
    const arr = [...filtered];
    arr.sort((a, b) => {
      let av: string | number = "";
      let bv: string | number = "";
      switch (sort.sortKey) {
        case "orderNumber":
          av = a.orderNumber;
          bv = b.orderNumber;
          break;
        case "createdAt":
          av = new Date(a.createdAt).getTime();
          bv = new Date(b.createdAt).getTime();
          break;
        case "customerName":
          av = (a.customerName ?? "").toLowerCase();
          bv = (b.customerName ?? "").toLowerCase();
          break;
        case "itemCount":
          av = a.itemCount;
          bv = b.itemCount;
          break;
        case "total":
          av = customerTotal(a);
          bv = customerTotal(b);
          break;
        case "status":
          av = a.status;
          bv = b.status;
          break;
      }
      if (av < bv) return -1 * dir;
      if (av > bv) return 1 * dir;
      return 0;
    });
    return arr;
  }, [filtered, sort.sortKey, sort.sortDir]);

  const visible = sorted.slice(pg.start, pg.start + pg.pageSize);

  // ---- aggregates -----------------------------------------------------------
  const totalRevenue = useMemo(
    () => sorted.reduce((sum, so) => sum + customerTotal(so), 0),
    [sorted],
  );

  // ---- handlers -------------------------------------------------------------
  const onSearchChange = (v: string) => {
    setSearch(v);
    pg.resetPage();
  };
  const toggleStatus = (s: OrderStatus) => {
    setStatusFilters((prev) =>
      prev.includes(s) ? prev.filter((x) => x !== s) : [...prev, s],
    );
    pg.resetPage();
  };
  const togglePayment = (s: PaymentStatus) => {
    setPaymentFilters((prev) =>
      prev.includes(s) ? prev.filter((x) => x !== s) : [...prev, s],
    );
    pg.resetPage();
  };
  const resetFilters = () => {
    setSearch("");
    setStatusFilters([]);
    setPaymentFilters([]);
    setDateFrom("");
    setDateTo("");
    setMinAmount("");
    setMaxAmount("");
    pg.resetPage();
  };
  const handleExport = () => {
    exportToCsv({
      filename: "seller-orders",
      headers: [
        "Order #",
        "Parent Order",
        "Date",
        "Customer",
        "Items",
        "Total",
        "Currency",
        "Status",
        "Payment Status",
      ],
      rows: sorted.map((so) => [
        so.orderNumber,
        so.parentOrderNumber ?? "",
        new Date(so.createdAt).toISOString(),
        so.customerName ?? "",
        so.itemCount,
        customerTotal(so),
        so.currencyCode,
        so.status,
        so.paymentStatus,
      ]),
    });
  };

  const activeFilterCount =
    (search ? 1 : 0) +
    statusFilters.length +
    paymentFilters.length +
    (dateFrom ? 1 : 0) +
    (dateTo ? 1 : 0) +
    (minAmount ? 1 : 0) +
    (maxAmount ? 1 : 0);

  // ---- render ---------------------------------------------------------------
  return (
    <div className="space-y-6">
      <header className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight flex items-center gap-2">
            <Package className="h-6 w-6 text-primary" />
            Orders
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Customer orders for your products. Confirm, pack, and ship from here.
          </p>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={handleExport}
          disabled={sorted.length === 0}
        >
          <Download className="mr-1 h-4 w-4" />
          Export CSV
        </Button>
      </header>

      <TableToolbar
        search={search}
        onSearchChange={onSearchChange}
        searchPlaceholder="Search order #, customer, product, SKU..."
        activeFilterCount={activeFilterCount}
        onReset={resetFilters}
        primaryFilters={
          <FilterPills
            options={ORDER_STATUSES}
            selected={statusFilters}
            onToggle={toggleStatus}
            getLabel={(s) => ORDER_STATUS_LABEL[s]}
          />
        }
        advancedFilters={
          <>
            <div>
              <label className="text-xs font-medium text-muted-foreground">
                From date
              </label>
              <Input
                type="date"
                value={dateFrom}
                onChange={(e) => {
                  setDateFrom(e.target.value);
                  pg.resetPage();
                }}
              />
            </div>
            <div>
              <label className="text-xs font-medium text-muted-foreground">
                To date
              </label>
              <Input
                type="date"
                value={dateTo}
                onChange={(e) => {
                  setDateTo(e.target.value);
                  pg.resetPage();
                }}
              />
            </div>
            <div>
              <label className="text-xs font-medium text-muted-foreground">
                Min total
              </label>
              <Input
                type="number"
                inputMode="decimal"
                placeholder="0"
                value={minAmount}
                onChange={(e) => {
                  setMinAmount(e.target.value);
                  pg.resetPage();
                }}
              />
            </div>
            <div>
              <label className="text-xs font-medium text-muted-foreground">
                Max total
              </label>
              <Input
                type="number"
                inputMode="decimal"
                placeholder="∞"
                value={maxAmount}
                onChange={(e) => {
                  setMaxAmount(e.target.value);
                  pg.resetPage();
                }}
              />
            </div>
            <div className="sm:col-span-2 lg:col-span-4">
              <label className="text-xs font-medium text-muted-foreground">
                Payment status
              </label>
              <FilterPills
                className="mt-1"
                options={PAYMENT_STATUSES}
                selected={paymentFilters}
                onToggle={togglePayment}
                getLabel={(p) => PAYMENT_LABEL[p]}
              />
            </div>
          </>
        }
      />

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
        <Stat label="Matching" value={sorted.length.toString()} />
        <Stat label="Total" value={serverTotal.toString()} muted />
        <Stat label="Revenue" value={formatPrice(totalRevenue)} emphasised />
      </div>

      <div className="rounded-lg border bg-card shadow-sm overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/40 hover:bg-muted/40">
              <TableHead className="w-12">#</TableHead>
              <TableHead>
                <SortHeader
                  label="Order"
                  sortKey="orderNumber"
                  currentKey={sort.sortKey}
                  dir={sort.sortDir}
                  onClick={sort.toggleSort}
                />
              </TableHead>
              <TableHead>Items</TableHead>
              <TableHead>
                <SortHeader
                  label="Customer"
                  sortKey="customerName"
                  currentKey={sort.sortKey}
                  dir={sort.sortDir}
                  onClick={sort.toggleSort}
                />
              </TableHead>
              <TableHead>
                <SortHeader
                  label="Date"
                  sortKey="createdAt"
                  currentKey={sort.sortKey}
                  dir={sort.sortDir}
                  onClick={sort.toggleSort}
                />
              </TableHead>
              <TableHead>
                <SortHeader
                  label="Qty"
                  sortKey="itemCount"
                  currentKey={sort.sortKey}
                  dir={sort.sortDir}
                  onClick={sort.toggleSort}
                />
              </TableHead>
              <TableHead className="text-right">
                <SortHeader
                  label="Total"
                  sortKey="total"
                  currentKey={sort.sortKey}
                  dir={sort.sortDir}
                  onClick={sort.toggleSort}
                  align="right"
                />
              </TableHead>
              <TableHead>Payment</TableHead>
              <TableHead>
                <SortHeader
                  label="Status"
                  sortKey="status"
                  currentKey={sort.sortKey}
                  dir={sort.sortDir}
                  onClick={sort.toggleSort}
                />
              </TableHead>
              <TableHead className="w-12 text-right">Open</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading && all.length === 0 ? (
              <TableSkeleton colSpan={COL_COUNT} />
            ) : visible.length === 0 ? (
              <TableEmpty
                colSpan={COL_COUNT}
                icon={Package}
                hasFilters={activeFilterCount > 0}
                onClearFilters={resetFilters}
              >
                {activeFilterCount > 0
                  ? "No orders match the current filters."
                  : "No orders yet."}
              </TableEmpty>
            ) : (
              visible.map((so, idx) => (
                <OrderRow key={so.id} order={so} index={pg.start + idx + 1} />
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <TablePagination
        page={pg.safePage}
        pageSize={pg.pageSize}
        totalRows={sorted.length}
        totalPages={pg.totalPages}
        onPageChange={pg.setPage}
        onPageSizeChange={(n) => {
          pg.setPageSize(n);
          pg.resetPage();
        }}
      />
    </div>
  );
}

// ---------------------------------------------------------------------------
function OrderRow({ order, index }: { order: SellerOrder; index: number }) {
  const firstImage = order.items[0]?.imageUrlSnapshot;
  const summary =
    order.items.length === 1
      ? order.items[0].name
      : `${order.items[0]?.name ?? "Item"} +${order.items.length - 1}`;
  return (
    <TableRow>
      <TableCell className="text-xs text-muted-foreground font-mono">
        {index}
      </TableCell>
      <TableCell>
        <div className="font-mono text-xs">{order.orderNumber}</div>
        {order.parentOrderNumber && (
          <div className="text-[10px] text-muted-foreground font-mono">
            {order.parentOrderNumber}
          </div>
        )}
      </TableCell>
      <TableCell>
        <div className="flex items-center gap-2 max-w-[260px]">
          <div className="h-9 w-9 shrink-0 rounded-md overflow-hidden bg-muted">
            {firstImage ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={firstImage}
                alt=""
                className="h-full w-full object-cover"
              />
            ) : (
              <Package className="h-4 w-4 m-2.5 text-muted-foreground" />
            )}
          </div>
          <div className="min-w-0">
            <div className="text-sm font-medium truncate" title={summary}>
              {summary}
            </div>
            <div className="text-[11px] text-muted-foreground">
              {order.itemCount} {order.itemCount === 1 ? "item" : "items"}
            </div>
          </div>
        </div>
      </TableCell>
      <TableCell className="text-sm">
        {order.customerName ?? (
          <span className="text-muted-foreground">—</span>
        )}
      </TableCell>
      <TableCell className="text-sm whitespace-nowrap">
        {new Date(order.createdAt).toLocaleDateString()}
        <div className="text-[11px] text-muted-foreground">
          {new Date(order.createdAt).toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          })}
        </div>
      </TableCell>
      <TableCell className="text-sm tabular-nums">{order.itemCount}</TableCell>
      <TableCell className="text-right font-semibold tabular-nums">
        {formatPrice(customerTotal(order))}
      </TableCell>
      <TableCell>
        <Badge
          variant={PAYMENT_VARIANT[order.paymentStatus]}
          className="text-[10px]"
        >
          {PAYMENT_LABEL[order.paymentStatus]}
        </Badge>
      </TableCell>
      <TableCell>
        <OrderStatusBadge status={order.status} />
      </TableCell>
      <TableCell className="text-right">
        <Button asChild variant="ghost" size="icon" className="h-8 w-8">
          <Link href={`/seller/orders/${order.id}`} title="Open order">
            <Eye className="h-4 w-4" />
          </Link>
        </Button>
      </TableCell>
    </TableRow>
  );
}

function Stat({
  label,
  value,
  emphasised,
  muted,
}: {
  label: string;
  value: string;
  emphasised?: boolean;
  muted?: boolean;
}) {
  return (
    <div className="rounded-lg border bg-card p-3 shadow-sm">
      <div className="text-[10px] uppercase tracking-wide text-muted-foreground">
        {label}
      </div>
      <div
        className={`mt-1 font-mono text-lg ${
          emphasised ? "font-bold text-primary" : ""
        } ${muted ? "text-muted-foreground" : ""}`}
      >
        {value}
      </div>
    </div>
  );
}
