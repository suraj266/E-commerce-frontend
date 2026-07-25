"use client";

/**
 * Customer return tracking (P3-02) — read-only lifecycle + refund status for one
 * of the customer's own returns.
 */

import Link from "next/link";
import { useParams } from "next/navigation";
import { useQuery } from "@apollo/client/react";
import { ArrowLeft } from "lucide-react";

import { GET_MY_RETURN, type MyReturnData } from "@/lib/graphql/returns";
import { ReturnStatusBadge } from "@/components/orders/return-status-badge";

const money = (n: number) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
  }).format(n);

export default function MyReturnDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { data, loading, error } = useQuery<MyReturnData>(GET_MY_RETURN, {
    variables: { id },
    fetchPolicy: "cache-and-network",
  });
  const r = data?.myReturn;

  return (
    <div className="space-y-6">
      <Link
        href="/account/returns"
        className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="mr-1 h-4 w-4" /> Back to returns
      </Link>

      {loading && !r ? (
        <p className="text-sm text-muted-foreground">Loading…</p>
      ) : error || !r ? (
        <p className="text-sm text-destructive">
          {error?.message ?? "Return not found."}
        </p>
      ) : (
        <>
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h1 className="font-mono text-lg font-semibold">
                {r.returnNumber}
              </h1>
              <p className="text-sm text-muted-foreground">{r.reason}</p>
            </div>
            <ReturnStatusBadge status={r.status} />
          </div>

          <div className="rounded-lg border bg-card p-4 text-sm space-y-1">
            {r.refundAmount != null && (
              <div className="flex justify-between">
                <span className="text-muted-foreground">Refund</span>
                <span className="font-medium">{money(r.refundAmount)}</span>
              </div>
            )}
            {r.status === "REJECTED" && r.rejectionReason && (
              <div className="text-destructive">Reason: {r.rejectionReason}</div>
            )}
            {r.reverseAwb && (
              <div className="flex justify-between">
                <span className="text-muted-foreground">Reverse pickup AWB</span>
                <span className="font-mono">{r.reverseAwb}</span>
              </div>
            )}
            {r.resolutionType === "REPLACEMENT" && (
              <div className="flex justify-between">
                <span className="text-muted-foreground">Resolution</span>
                <span className="font-medium">Replacement</span>
              </div>
            )}
            {r.replacementReference && (
              <div className="flex justify-between">
                <span className="text-muted-foreground">Replacement tracking</span>
                <span className="font-mono">{r.replacementReference}</span>
              </div>
            )}
          </div>

          <div className="rounded-lg border bg-card p-4">
            <h2 className="mb-3 text-sm font-semibold">Progress</h2>
            <ol className="space-y-2">
              {(r.events ?? []).map((e) => (
                <li
                  key={e.id}
                  className="flex items-center justify-between gap-2 text-sm"
                >
                  <span>
                    <strong>{e.toStatus}</strong>
                    {e.note ? ` — ${e.note}` : ""}
                  </span>
                  <span className="text-xs text-muted-foreground whitespace-nowrap">
                    {new Date(e.createdAt).toLocaleString("en-IN")}
                  </span>
                </li>
              ))}
            </ol>
          </div>
        </>
      )}
    </div>
  );
}
