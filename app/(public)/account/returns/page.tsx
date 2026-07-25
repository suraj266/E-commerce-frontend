"use client";

/**
 * Customer returns list (P3-02) — every return the customer has opened, newest
 * first, with its live lifecycle status. Starting a new return happens from a
 * delivered order (Account → Orders → open a delivered order → "Request a
 * return").
 */

import Link from "next/link";
import { useQuery } from "@apollo/client/react";
import { PackageX } from "lucide-react";

import { GET_MY_RETURNS, type MyReturnsData } from "@/lib/graphql/returns";
import { ReturnStatusBadge } from "@/components/orders/return-status-badge";

export default function MyReturnsPage() {
  const { data, loading, error } = useQuery<MyReturnsData>(GET_MY_RETURNS, {
    fetchPolicy: "cache-and-network",
  });
  const returns = data?.myReturns ?? [];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">My returns</h1>
        <p className="text-sm text-muted-foreground">
          Track your return requests. Start a new one from a delivered order.
        </p>
      </div>

      {loading && returns.length === 0 ? (
        <p className="text-sm text-muted-foreground">Loading…</p>
      ) : error ? (
        <p className="text-sm text-destructive">{error.message}</p>
      ) : returns.length === 0 ? (
        <div className="rounded-lg border border-dashed p-10 text-center">
          <PackageX className="mx-auto h-8 w-8 text-muted-foreground" />
          <p className="mt-3 text-sm text-muted-foreground">
            You haven&apos;t requested any returns yet.
          </p>
          <Link
            href="/account/orders"
            className="mt-2 inline-block text-sm text-primary hover:underline"
          >
            Go to your orders →
          </Link>
        </div>
      ) : (
        <ul className="space-y-3">
          {returns.map((r) => (
            <li key={r.id}>
              <Link
                href={`/account/returns/${r.id}`}
                className="flex items-center justify-between gap-3 rounded-lg border bg-card p-4 hover:border-primary/50"
              >
                <div>
                  <div className="font-mono text-sm">{r.returnNumber}</div>
                  <div className="text-xs text-muted-foreground">
                    {new Date(r.requestedAt).toLocaleDateString("en-IN")} ·{" "}
                    {r.reason}
                  </div>
                </div>
                <ReturnStatusBadge status={r.status} />
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
