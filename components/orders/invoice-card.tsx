"use client";

/**
 * Tax-invoice download card.
 *
 * Shown on customer and seller order-detail pages. Renders one of three
 * states for the given SellerOrder:
 *
 *   - `pending`   — order placed but no invoice issued yet (payment
 *                   pending for online; seller hasn't confirmed for COD).
 *   - `ready`     — invoice URL available; renders the primary download
 *                   button.
 *   - `failed`    — payment captured / order confirmed but generation
 *                   failed (no URL). Surfaces a polite copy + suggests
 *                   contacting support. Admin can regenerate via the
 *                   /admin surface.
 */

import { FileText, Download, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";

interface InvoiceCardProps {
  /** Invoice number once allocated; null/undefined while pending. */
  invoiceNumber?: string | null;
  invoiceDate?: string | null;
  invoiceUrl?: string | null;
  /** Place of supply line shown for transparency on what tax kind applied. */
  placeOfSupplyStateName?: string | null;
  placeOfSupplyStateCode?: string | null;
  taxKind?: string | null;
  /** Pre-invoice copy varies depending on payment method. */
  paymentMethod?: "COD" | "ONLINE" | string | null;
  /** True for parity with order-confirmed-but-paid status. */
  hasReachedInvoiceTrigger?: boolean;
  /** Optional override controls (e.g. admin regenerate). */
  trailing?: React.ReactNode;
}

export function InvoiceCard({
  invoiceNumber,
  invoiceDate,
  invoiceUrl,
  placeOfSupplyStateName,
  placeOfSupplyStateCode,
  taxKind,
  paymentMethod,
  hasReachedInvoiceTrigger,
  trailing,
}: InvoiceCardProps) {
  const ready = !!invoiceUrl;
  const failed = !ready && hasReachedInvoiceTrigger;

  return (
    <div className="rounded-lg border bg-card p-4">
      <div className="flex items-start gap-3">
        <div className="rounded-md bg-muted p-2">
          {ready ? (
            <FileText className="h-5 w-5 text-primary" />
          ) : (
            <Clock className="h-5 w-5 text-muted-foreground" />
          )}
        </div>

        <div className="flex-1 min-w-0">
          <h3 className="text-sm font-semibold">Tax invoice</h3>

          {ready ? (
            <>
              <p className="mt-1 text-xs text-muted-foreground font-mono">
                {invoiceNumber}
              </p>
              {invoiceDate && (
                <p className="text-xs text-muted-foreground">
                  Issued{" "}
                  {new Date(invoiceDate).toLocaleDateString("en-IN", {
                    day: "2-digit",
                    month: "short",
                    year: "numeric",
                  })}
                </p>
              )}
              {(placeOfSupplyStateName || taxKind) && (
                <p className="mt-1 text-xs text-muted-foreground">
                  Place of supply: {placeOfSupplyStateName ?? "—"}
                  {placeOfSupplyStateCode
                    ? ` (${placeOfSupplyStateCode})`
                    : ""}
                  {taxKind ? (
                    <span className="ml-1">
                      ·{" "}
                      {taxKind === "INTRA_STATE"
                        ? "CGST + SGST"
                        : taxKind === "INTER_STATE"
                          ? "IGST"
                          : taxKind}
                    </span>
                  ) : null}
                </p>
              )}
            </>
          ) : failed ? (
            <p className="mt-1 text-xs text-muted-foreground">
              Your invoice is still being generated. If it doesn&apos;t
              appear shortly, contact support.
            </p>
          ) : (
            <p className="mt-1 text-xs text-muted-foreground">
              {paymentMethod === "COD"
                ? "Invoice will be ready once the seller confirms your order."
                : "Invoice will be ready once payment is processed."}
            </p>
          )}
        </div>

        {ready && (
          <Button asChild variant="default" size="sm">
            <a href={invoiceUrl!} target="_blank" rel="noopener noreferrer">
              <Download className="h-4 w-4 mr-2" />
              Download
            </a>
          </Button>
        )}
      </div>

      {trailing && <div className="mt-3">{trailing}</div>}
    </div>
  );
}
