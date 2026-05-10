/**
 * =============================================================================
 * Admin Transactions — /admin/payments/transactions
 * =============================================================================
 *
 * Read-only, paginated table of all payment transactions across gateways.
 * Filterable by gateway and status.
 * =============================================================================
 */

"use client";

import { useState } from "react";
import { useQuery } from "@apollo/client/react";
import {
  ScrollText,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
} from "lucide-react";

import { GET_ADMIN_PAYMENT_TRANSACTIONS } from "@/lib/graphql/payments";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useSetPageTitle } from "@/components/shell/page-title-context";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------
interface PaymentItem {
  id: string;
  orderId: string;
  gateway: string;
  method: string;
  amount: number;
  processingFee: number;
  currency: string;
  status: string;
  gatewayOrderId: string | null;
  gatewayPaymentId: string | null;
  capturedAt: string | null;
  failedAt: string | null;
  createdAt: string;
}

const STATUS_COLORS: Record<string, string> = {
  CREATED: "bg-blue-100 text-blue-800",
  AUTHORIZED: "bg-indigo-100 text-indigo-800",
  CAPTURED: "bg-green-100 text-green-800",
  FAILED: "bg-red-100 text-red-800",
  REFUNDED: "bg-amber-100 text-amber-800",
  PARTIALLY_REFUNDED: "bg-orange-100 text-orange-800",
  EXPIRED: "bg-gray-100 text-gray-800",
};

// ===========================================================================
export default function TransactionsPage() {
  useSetPageTitle("Transactions");

  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [gatewayFilter, setGatewayFilter] = useState<string>("ALL");
  const [statusFilter, setStatusFilter] = useState<string>("ALL");

  const variables = {
    page: currentPage,
    pageSize,
    ...(gatewayFilter !== "ALL" ? { gateway: gatewayFilter } : {}),
    ...(statusFilter !== "ALL" ? { status: statusFilter } : {}),
  };

  interface PaginatedPayments {
    items: PaymentItem[];
    totalCount: number;
    totalPages: number;
    currentPage: number;
    pageSize: number;
  }

  const { data, loading } = useQuery<{ adminPaymentTransactions: PaginatedPayments }>(GET_ADMIN_PAYMENT_TRANSACTIONS, {
    variables,
    fetchPolicy: "cache-and-network",
  });

  const paged = data?.adminPaymentTransactions;
  const items: PaymentItem[] = paged?.items ?? [];
  const totalCount = paged?.totalCount ?? 0;
  const totalPages = paged?.totalPages ?? 1;
  const serverPage = paged?.currentPage ?? currentPage;
  const startIdx = (serverPage - 1) * pageSize + 1;
  const endIdx = Math.min(serverPage * pageSize, totalCount);

  function formatDate(iso: string) {
    return new Date(iso).toLocaleString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  }

  function formatCurrency(amount: number, currency: string) {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency,
    }).format(amount);
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight flex items-center gap-2">
          <ScrollText className="h-6 w-6 text-primary" />
          Transactions
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          All payment transactions across gateways.
        </p>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3">
        <Select value={gatewayFilter} onValueChange={(v) => { setGatewayFilter(v); setCurrentPage(1); }}>
          <SelectTrigger className="w-40">
            <SelectValue placeholder="All Gateways" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="ALL">All Gateways</SelectItem>
            <SelectItem value="COD">COD</SelectItem>
            <SelectItem value="RAZORPAY">Razorpay</SelectItem>
            <SelectItem value="STRIPE">Stripe</SelectItem>
            <SelectItem value="PHONEPE">PhonePe</SelectItem>
          </SelectContent>
        </Select>

        <Select value={statusFilter} onValueChange={(v) => { setStatusFilter(v); setCurrentPage(1); }}>
          <SelectTrigger className="w-44">
            <SelectValue placeholder="All Statuses" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="ALL">All Statuses</SelectItem>
            <SelectItem value="CREATED">Created</SelectItem>
            <SelectItem value="AUTHORIZED">Authorized</SelectItem>
            <SelectItem value="CAPTURED">Captured</SelectItem>
            <SelectItem value="FAILED">Failed</SelectItem>
            <SelectItem value="REFUNDED">Refunded</SelectItem>
            <SelectItem value="EXPIRED">Expired</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Table */}
      <div className="rounded-lg border bg-card shadow-sm min-h-[300px]">
        {loading && (
          <div className="space-y-3 p-4">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="h-14 w-full animate-pulse rounded-lg bg-muted" />
            ))}
          </div>
        )}

        {!loading && items.length === 0 && (
          <div className="flex h-40 items-center justify-center text-muted-foreground">
            No transactions found.
          </div>
        )}

        {!loading && items.length > 0 && (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="text-xs uppercase text-muted-foreground border-b">
                <tr>
                  <th className="px-4 py-3 text-left font-medium">Date</th>
                  <th className="px-3 py-3 text-left font-medium">Gateway</th>
                  <th className="px-3 py-3 text-left font-medium">Method</th>
                  <th className="px-3 py-3 text-right font-medium">Amount</th>
                  <th className="px-3 py-3 text-right font-medium hidden md:table-cell">Fee</th>
                  <th className="px-3 py-3 text-center font-medium">Status</th>
                  <th className="px-3 py-3 text-left font-medium hidden lg:table-cell">Gateway ID</th>
                </tr>
              </thead>
              <tbody>
                {items.map((item) => (
                  <tr
                    key={item.id}
                    className="border-b last:border-b-0 hover:bg-muted/30 transition-colors"
                  >
                    <td className="px-4 py-3 text-xs whitespace-nowrap">
                      {formatDate(item.createdAt)}
                    </td>
                    <td className="px-3 py-3">
                      <Badge variant="outline" className="text-[10px]">
                        {item.gateway}
                      </Badge>
                    </td>
                    <td className="px-3 py-3 text-xs text-muted-foreground">
                      {item.method}
                    </td>
                    <td className="px-3 py-3 text-right font-mono text-sm">
                      {formatCurrency(item.amount, item.currency)}
                    </td>
                    <td className="px-3 py-3 text-right font-mono text-xs text-muted-foreground hidden md:table-cell">
                      {item.processingFee > 0
                        ? formatCurrency(item.processingFee, item.currency)
                        : "—"}
                    </td>
                    <td className="px-3 py-3 text-center">
                      <span
                        className={`inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-medium ${
                          STATUS_COLORS[item.status] ?? "bg-gray-100 text-gray-800"
                        }`}
                      >
                        {item.status}
                      </span>
                    </td>
                    <td className="px-3 py-3 text-xs font-mono text-muted-foreground hidden lg:table-cell max-w-[180px] truncate">
                      {item.gatewayPaymentId ?? item.gatewayOrderId ?? "—"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination */}
        {!loading && totalCount > 0 && (
          <div className="border-t px-3 py-3 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="text-sm text-muted-foreground">
              Showing{" "}
              <span className="font-medium text-foreground">{startIdx}</span>–
              <span className="font-medium text-foreground">{endIdx}</span> of{" "}
              <span className="font-medium text-foreground">{totalCount}</span>{" "}
              transactions
            </div>
            <div className="flex items-center gap-2">
              <Select
                value={String(pageSize)}
                onValueChange={(v) => { setPageSize(Number(v)); setCurrentPage(1); }}
              >
                <SelectTrigger className="h-8 w-20">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {[10, 25, 50].map((n) => (
                    <SelectItem key={n} value={String(n)}>
                      {n}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Button variant="outline" size="icon" className="h-8 w-8" onClick={() => setCurrentPage(1)} disabled={serverPage <= 1}>
                <ChevronsLeft className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="icon" className="h-8 w-8" onClick={() => setCurrentPage((p) => Math.max(1, p - 1))} disabled={serverPage <= 1}>
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <span className="text-sm font-medium px-2 min-w-[5rem] text-center">
                {serverPage} / {totalPages}
              </span>
              <Button variant="outline" size="icon" className="h-8 w-8" onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))} disabled={serverPage >= totalPages}>
                <ChevronRight className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="icon" className="h-8 w-8" onClick={() => setCurrentPage(totalPages)} disabled={serverPage >= totalPages}>
                <ChevronsRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
