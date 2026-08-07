"use client";

/**
 * Customer grievances list (P4-01, CP-EC) — every complaint the customer has
 * filed, newest first, with its live status + SLA flag. Filing a new complaint
 * is a button away; tracking + replying happens on the detail page.
 */

import Link from "next/link";
import { useQuery } from "@apollo/client/react";
import { MessageSquareWarning, Plus } from "lucide-react";

import {
  GET_MY_GRIEVANCES,
  GRIEVANCE_STATUS_LABEL,
  GRIEVANCE_STATUS_BADGE,
  GRIEVANCE_CATEGORY_LABEL,
  type MyGrievancesData,
} from "@/lib/graphql/grievances";
import { Badge } from "@/components/ui/badge";

export default function MyGrievancesPage() {
  const { data, loading, error } = useQuery<MyGrievancesData>(
    GET_MY_GRIEVANCES,
    { fetchPolicy: "cache-and-network" },
  );
  const grievances = data?.myGrievances ?? [];

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Help &amp; complaints</h1>
          <p className="text-sm text-muted-foreground">
            Raise a complaint with our grievance team and track its resolution.
          </p>
        </div>
        <Link
          href="/account/grievances/new"
          className="inline-flex items-center gap-2 rounded-md bg-brand px-4 py-2 text-sm font-semibold text-white shadow hover:bg-brand/90 transition"
        >
          <Plus className="h-4 w-4" />
          New complaint
        </Link>
      </div>

      {loading && grievances.length === 0 ? (
        <p className="text-sm text-muted-foreground">Loading…</p>
      ) : error ? (
        <p className="text-sm text-destructive">{error.message}</p>
      ) : grievances.length === 0 ? (
        <div className="rounded-lg border border-dashed p-10 text-center">
          <MessageSquareWarning className="mx-auto h-8 w-8 text-muted-foreground" />
          <p className="mt-3 text-sm text-muted-foreground">
            You haven&apos;t raised any complaints yet.
          </p>
          <Link
            href="/account/grievances/new"
            className="mt-2 inline-block text-sm text-primary hover:underline"
          >
            File a complaint →
          </Link>
        </div>
      ) : (
        <ul className="space-y-3">
          {grievances.map((g) => (
            <li key={g.id}>
              <Link
                href={`/account/grievances/${g.id}`}
                className="flex items-center justify-between gap-3 rounded-lg border bg-card p-4 hover:border-primary/50"
              >
                <div className="min-w-0">
                  <div className="font-mono text-sm">{g.ticketNumber}</div>
                  <div className="truncate text-sm font-medium">{g.subject}</div>
                  <div className="text-xs text-muted-foreground">
                    {GRIEVANCE_CATEGORY_LABEL[g.category]} ·{" "}
                    {new Date(g.createdAt).toLocaleDateString("en-IN")}
                  </div>
                </div>
                <div className="flex shrink-0 flex-col items-end gap-1">
                  <Badge
                    variant="outline"
                    className={`border ${GRIEVANCE_STATUS_BADGE[g.status]}`}
                  >
                    {GRIEVANCE_STATUS_LABEL[g.status]}
                  </Badge>
                  {g.slaBreached && (
                    <span className="text-[10px] font-medium text-rose-600">
                      Overdue
                    </span>
                  )}
                </div>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
