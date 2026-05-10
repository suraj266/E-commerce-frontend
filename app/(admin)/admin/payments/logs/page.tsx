/**
 * =============================================================================
 * Admin Payment Logs — /admin/payments/logs
 * =============================================================================
 *
 * Placeholder page for future webhook event logs and audit trail.
 * Will show raw gateway callback data for debugging.
 * =============================================================================
 */

"use client";

import { Wallet } from "lucide-react";
import { useSetPageTitle } from "@/components/shell/page-title-context";

export default function PaymentLogsPage() {
  useSetPageTitle("Payment Logs");

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight flex items-center gap-2">
          <Wallet className="h-6 w-6 text-primary" />
          Payment Logs
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          Webhook event logs and audit trail.
        </p>
      </div>

      <div className="flex h-60 items-center justify-center text-muted-foreground rounded-lg border bg-card">
        <div className="text-center space-y-2">
          <Wallet className="h-12 w-12 mx-auto text-muted-foreground/40" />
          <p className="text-sm">
            Payment logs will appear here once webhook events are received.
          </p>
          <p className="text-xs text-muted-foreground">
            Coming soon — will show raw gateway callbacks for debugging.
          </p>
        </div>
      </div>
    </div>
  );
}
