/**
 * Admin → Tax Invoices — auditing + regeneration surface (Phase 1).
 *
 * Lists recent SellerOrders alongside their tax-invoice status. Each row
 * exposes:
 *   - the invoice number + issue date (if allocated)
 *   - a Download button when a PDF exists
 *   - a Regenerate button (force-rebuild the same number's PDF) for
 *     situations where an earlier render is broken or the template
 *     changed.
 *
 * Defaults to the "missing invoice" filter so staff can clear the
 * generation backlog at a glance. Switch the toggle off to view the
 * full list (paid + COD-confirmed orders).
 */

"use client";

import { useState } from "react";
import { useMutation, useQuery } from "@apollo/client/react";
import { toast } from "sonner";
import { Download, Loader2, RefreshCw } from "lucide-react";

import {
  GET_ADMIN_SELLER_ORDERS_WITH_INVOICES,
  REGENERATE_SELLER_ORDER_INVOICE,
} from "@/lib/graphql/orders";
import type { PaginatedSellerOrders, SellerOrder } from "@/types/order.types";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useSetPageTitle } from "@/components/shell/page-title-context";

type Result = { adminSellerOrdersWithInvoices: PaginatedSellerOrders };

export default function AdminInvoicesPage() {
  useSetPageTitle("Tax Invoices");

  const [page, setPage] = useState(1);
  const [onlyMissing, setOnlyMissing] = useState(true);
  const pageSize = 20;

  const { data, loading, error, refetch } = useQuery<Result>(
    GET_ADMIN_SELLER_ORDERS_WITH_INVOICES,
    {
      variables: { page, pageSize, onlyMissingInvoice: onlyMissing },
      fetchPolicy: "cache-and-network",
    },
  );

  const [regenerate, { loading: regenerating }] = useMutation<{
    regenerateSellerOrderInvoice: string;
  }>(REGENERATE_SELLER_ORDER_INVOICE);

  const [busyId, setBusyId] = useState<string | null>(null);

  async function handleRegenerate(sellerOrderId: string) {
    setBusyId(sellerOrderId);
    try {
      await regenerate({ variables: { sellerOrderId } });
      toast.success("Invoice regenerated");
      await refetch();
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : "Could not regenerate invoice",
      );
    } finally {
      setBusyId(null);
    }
  }

  const items = data?.adminSellerOrdersWithInvoices.items ?? [];
  const totalCount = data?.adminSellerOrdersWithInvoices.totalCount ?? 0;
  const totalPages = data?.adminSellerOrdersWithInvoices.totalPages ?? 1;

  return (
    <div className="space-y-6">
      <header className="flex items-end justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Tax invoices</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Per CGST Rule 46. Each seller-order has its own invoice. The
            invoice number, once allocated, is preserved across regenerations.
          </p>
        </div>

        <label className="flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            checked={onlyMissing}
            onChange={(e) => {
              setOnlyMissing(e.target.checked);
              setPage(1);
            }}
            className="h-4 w-4 rounded border-input"
          />
          Only show missing invoices on paid orders
        </label>
      </header>

      {error && (
        <div className="rounded-md border border-destructive bg-destructive/10 px-4 py-3 text-sm text-destructive">
          {error.message}
        </div>
      )}

      <div className="rounded-lg border bg-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-muted/40">
              <tr className="text-left">
                <th className="px-4 py-3 font-semibold">Seller order</th>
                <th className="px-4 py-3 font-semibold">Customer</th>
                <th className="px-4 py-3 font-semibold">Status</th>
                <th className="px-4 py-3 font-semibold">Invoice</th>
                <th className="px-4 py-3 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {loading && items.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-4 py-10 text-center text-muted-foreground">
                    <Loader2 className="inline h-4 w-4 mr-2 animate-spin" />
                    Loading…
                  </td>
                </tr>
              )}
              {!loading && items.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-4 py-10 text-center text-muted-foreground">
                    {onlyMissing
                      ? "No paid orders are waiting on invoice generation."
                      : "No seller-orders yet."}
                  </td>
                </tr>
              )}
              {items.map((so) => (
                <InvoiceRow
                  key={so.id}
                  sellerOrder={so}
                  isBusy={busyId === so.id && regenerating}
                  onRegenerate={() => handleRegenerate(so.id)}
                />
              ))}
            </tbody>
          </table>
        </div>

        {totalCount > pageSize && (
          <div className="flex items-center justify-between border-t px-4 py-3 text-sm">
            <span className="text-muted-foreground">
              Page {page} of {totalPages} · {totalCount} total
            </span>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                disabled={page === 1 || loading}
                onClick={() => setPage((p) => Math.max(1, p - 1))}
              >
                Previous
              </Button>
              <Button
                variant="outline"
                size="sm"
                disabled={page >= totalPages || loading}
                onClick={() => setPage((p) => p + 1)}
              >
                Next
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function InvoiceRow({
  sellerOrder: so,
  isBusy,
  onRegenerate,
}: {
  sellerOrder: SellerOrder;
  isBusy: boolean;
  onRegenerate: () => void;
}) {
  return (
    <tr>
      <td className="px-4 py-3">
        <div className="font-mono text-xs">{so.orderNumber}</div>
        <div className="text-xs text-muted-foreground mt-0.5">
          {so.storeName ?? "—"}
        </div>
      </td>
      <td className="px-4 py-3">
        <div className="text-sm">{so.customerName ?? "—"}</div>
        <div className="text-xs text-muted-foreground mt-0.5">
          {so.taxKind === "INTRA_STATE"
            ? "CGST + SGST"
            : so.taxKind === "INTER_STATE"
              ? "IGST"
              : "—"}
        </div>
      </td>
      <td className="px-4 py-3">
        <Badge variant="outline" className="text-xs">
          {so.status}
        </Badge>
        <div className="text-xs text-muted-foreground mt-1">
          Payment: {so.paymentStatus}
        </div>
      </td>
      <td className="px-4 py-3">
        {so.invoiceNumber ? (
          <>
            <div className="font-mono text-xs">{so.invoiceNumber}</div>
            {so.invoiceDate && (
              <div className="text-xs text-muted-foreground mt-0.5">
                {new Date(so.invoiceDate).toLocaleDateString("en-IN", {
                  day: "2-digit",
                  month: "short",
                  year: "numeric",
                })}
              </div>
            )}
          </>
        ) : (
          <span className="text-xs text-muted-foreground italic">
            Not allocated yet
          </span>
        )}
      </td>
      <td className="px-4 py-3 text-right">
        <div className="flex justify-end gap-2">
          {so.invoiceUrl && (
            <Button asChild variant="outline" size="sm">
              <a href={so.invoiceUrl} target="_blank" rel="noopener noreferrer">
                <Download className="h-3.5 w-3.5 mr-1.5" />
                View
              </a>
            </Button>
          )}
          <Button
            variant={so.invoiceUrl ? "outline" : "default"}
            size="sm"
            disabled={isBusy}
            onClick={onRegenerate}
          >
            {isBusy ? (
              <Loader2 className="h-3.5 w-3.5 mr-1.5 animate-spin" />
            ) : (
              <RefreshCw className="h-3.5 w-3.5 mr-1.5" />
            )}
            {so.invoiceUrl ? "Regenerate" : "Generate"}
          </Button>
        </div>
      </td>
    </tr>
  );
}
