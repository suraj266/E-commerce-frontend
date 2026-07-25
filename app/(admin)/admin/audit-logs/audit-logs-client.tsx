"use client";

/**
 * Audit Log viewer (P3-06) — the append-only security trail over the money
 * movers, with a before/after JSON diff. Consumes the existing AuditResolver
 * (auditLogs). `before` / `after` arrive as JSON strings and are parsed +
 * diffed client-side (lib/audit/diff.ts).
 */

import { useEffect, useState } from "react";
import { useQuery } from "@apollo/client/react";
import { toast } from "sonner";
import { ScrollText, ArrowRight } from "lucide-react";

import {
  GET_AUDIT_LOGS,
  type AuditLog,
  type AuditLogsData,
} from "@/lib/graphql/admin-audit";
import { dateTime } from "@/lib/utils/admin-format";
import {
  safeParse,
  diffObjects,
  displayValue,
  type DiffKind,
} from "@/lib/audit/diff";

import { Badge } from "@/components/ui/badge";
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
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Separator } from "@/components/ui/separator";
import { useSetPageTitle } from "@/components/shell/page-title-context";
import {
  TableEmpty,
  TablePagination,
  TableSkeleton,
  TableToolbar,
  usePagination,
} from "@/components/ui/data-table";

const COL_COUNT = 5;
const PAGE_SIZE_OPTIONS = [20, 50, 100] as const;

export default function AuditLogsClient() {
  useSetPageTitle("Audit Log");

  const [entityTypeInput, setEntityTypeInput] = useState("");
  const [entityTypeFilter, setEntityTypeFilter] = useState("");
  const [actionInput, setActionInput] = useState("");
  const [actionFilter, setActionFilter] = useState("");

  const [selected, setSelected] = useState<AuditLog | null>(null);

  const [serverTotal, setServerTotal] = useState(0);
  const pg = usePagination({ totalRows: serverTotal, defaultPageSize: 20 });

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    pg.resetPage();
  }, [entityTypeFilter, actionFilter, pg.pageSize]);

  const filter = {
    entityType: entityTypeFilter || null,
    action: actionFilter || null,
    page: pg.page,
    pageSize: pg.pageSize,
  };

  const { data, loading, error } = useQuery<AuditLogsData>(GET_AUDIT_LOGS, {
    variables: { filter },
    fetchPolicy: "cache-and-network",
  });

  useEffect(() => {
    if (error) toast.error(`Failed to load audit log: ${error.message}`);
  }, [error]);

  useEffect(() => {
    const c = data?.auditLogs?.totalCount;
    if (typeof c === "number" && c !== serverTotal) setServerTotal(c);
  }, [data?.auditLogs?.totalCount, serverTotal]);

  const items = data?.auditLogs?.items ?? [];
  const activeFilterCount =
    (entityTypeFilter ? 1 : 0) + (actionFilter ? 1 : 0);

  const resetFilters = () => {
    setEntityTypeInput("");
    setEntityTypeFilter("");
    setActionInput("");
    setActionFilter("");
    pg.resetPage();
  };

  const applyFilters = () => {
    setEntityTypeFilter(entityTypeInput.trim());
    setActionFilter(actionInput.trim());
    pg.resetPage();
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-bold tracking-tight flex items-center gap-2">
          <ScrollText className="h-6 w-6 text-primary" />
          Audit Log
        </h1>
        <p className="text-sm text-muted-foreground">
          Append-only trail of privileged actions (refunds, payouts, gateway
          config, role changes). Click a row to see the before/after diff.
        </p>
      </div>

      <TableToolbar
        search={entityTypeInput}
        onSearchChange={setEntityTypeInput}
        searchPlaceholder="Entity type (e.g. Refund, Payout)…"
        activeFilterCount={activeFilterCount}
        onReset={resetFilters}
        primaryFilters={
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <Input
              value={actionInput}
              onChange={(e) => setActionInput(e.target.value)}
              placeholder="Action (e.g. refund.approve)…"
              className="w-full sm:w-56"
              onKeyDown={(e) => e.key === "Enter" && applyFilters()}
            />
            <button
              onClick={applyFilters}
              className="rounded-md bg-secondary px-3 py-2 text-sm text-secondary-foreground hover:bg-secondary/80"
            >
              Apply filters
            </button>
          </div>
        }
      />

      <div className="rounded-lg border bg-card shadow-sm overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/40 hover:bg-muted/40">
              <TableHead>When</TableHead>
              <TableHead>Actor</TableHead>
              <TableHead>Action</TableHead>
              <TableHead>Entity</TableHead>
              <TableHead className="hidden lg:table-cell">Request</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading && items.length === 0 ? (
              <TableSkeleton colSpan={COL_COUNT} />
            ) : items.length === 0 ? (
              <TableEmpty
                colSpan={COL_COUNT}
                icon={ScrollText}
                hasFilters={activeFilterCount > 0}
                onClearFilters={resetFilters}
              >
                No audit entries found.
              </TableEmpty>
            ) : (
              items.map((log) => (
                <TableRow
                  key={log.id}
                  className="cursor-pointer"
                  onClick={() => setSelected(log)}
                >
                  <TableCell className="text-xs text-muted-foreground whitespace-nowrap">
                    {dateTime(log.createdAt)}
                  </TableCell>
                  <TableCell className="text-sm">
                    {log.actorEmail ?? (
                      <span className="text-muted-foreground">system</span>
                    )}
                  </TableCell>
                  <TableCell>
                    <Badge variant="secondary" className="text-[10px] font-mono">
                      {log.action}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-sm">
                    <span className="font-medium">{log.entityType}</span>
                    {log.entityId && (
                      <span className="ml-1 font-mono text-[10px] text-muted-foreground">
                        {log.entityId.slice(0, 8)}
                      </span>
                    )}
                  </TableCell>
                  <TableCell className="hidden lg:table-cell text-[10px] font-mono text-muted-foreground">
                    {log.requestId ?? "—"}
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

      <AuditDetailSheet log={selected} onClose={() => setSelected(null)} />
    </div>
  );
}

const KIND_STYLE: Record<DiffKind, string> = {
  added: "text-emerald-600",
  removed: "text-destructive",
  changed: "text-amber-600",
  unchanged: "text-muted-foreground",
};
const KIND_LABEL: Record<DiffKind, string> = {
  added: "Added",
  removed: "Removed",
  changed: "Changed",
  unchanged: "",
};

function AuditDetailSheet({
  log,
  onClose,
}: {
  log: AuditLog | null;
  onClose: () => void;
}) {
  const before = safeParse(log?.before);
  const after = safeParse(log?.after);
  const rows = log ? diffObjects(before, after) : [];
  const changedRows = rows.filter((r) => r.kind !== "unchanged");
  const unchangedRows = rows.filter((r) => r.kind === "unchanged");

  return (
    <Sheet open={!!log} onOpenChange={(o) => !o && onClose()}>
      <SheetContent className="sm:max-w-xl w-full overflow-y-auto">
        <SheetHeader>
          <SheetTitle className="font-mono text-base">{log?.action}</SheetTitle>
          <SheetDescription>
            {log?.entityType}
            {log?.entityId ? ` · ${log.entityId}` : ""}
          </SheetDescription>
        </SheetHeader>

        {log && (
          <div className="px-4 pb-6 space-y-5">
            <div className="grid grid-cols-2 gap-2 text-xs">
              <Meta label="Actor" value={log.actorEmail ?? "system"} />
              <Meta label="When" value={dateTime(log.createdAt)} />
              <Meta label="IP" value={log.ip ?? "—"} />
              <Meta label="Request ID" value={log.requestId ?? "—"} mono />
              {log.userAgent && (
                <div className="col-span-2">
                  <Meta label="User agent" value={log.userAgent} />
                </div>
              )}
            </div>

            <Separator />

            {rows.length === 0 ? (
              <p className="text-sm text-muted-foreground">
                No snapshot recorded for this entry.
              </p>
            ) : (
              <>
                <div>
                  <h4 className="text-xs font-semibold uppercase text-muted-foreground mb-2">
                    Changes ({changedRows.length})
                  </h4>
                  {changedRows.length === 0 ? (
                    <p className="text-xs text-muted-foreground">
                      No field-level changes.
                    </p>
                  ) : (
                    <div className="space-y-2">
                      {changedRows.map((r) => (
                        <DiffLine key={r.key} row={r} />
                      ))}
                    </div>
                  )}
                </div>

                {unchangedRows.length > 0 && (
                  <details className="group">
                    <summary className="cursor-pointer text-xs text-muted-foreground hover:text-foreground">
                      Show {unchangedRows.length} unchanged field
                      {unchangedRows.length === 1 ? "" : "s"}
                    </summary>
                    <div className="mt-2 space-y-1">
                      {unchangedRows.map((r) => (
                        <div
                          key={r.key}
                          className="flex justify-between gap-3 text-xs"
                        >
                          <span className="font-mono text-muted-foreground">
                            {r.key}
                          </span>
                          <span className="truncate text-right">
                            {displayValue(r.after ?? r.before)}
                          </span>
                        </div>
                      ))}
                    </div>
                  </details>
                )}
              </>
            )}
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
}

function DiffLine({ row }: { row: ReturnType<typeof diffObjects>[number] }) {
  return (
    <div className="rounded-md border p-2 text-xs">
      <div className="flex items-center justify-between">
        <span className="font-mono font-medium">{row.key}</span>
        <span className={KIND_STYLE[row.kind]}>{KIND_LABEL[row.kind]}</span>
      </div>
      <div className="mt-1 flex items-center gap-2">
        {row.kind !== "added" && (
          <code className="rounded bg-destructive/10 px-1.5 py-0.5 text-destructive break-all">
            {displayValue(row.before)}
          </code>
        )}
        {row.kind === "changed" && (
          <ArrowRight className="h-3 w-3 shrink-0 text-muted-foreground" />
        )}
        {row.kind !== "removed" && (
          <code className="rounded bg-emerald-500/10 px-1.5 py-0.5 text-emerald-600 break-all">
            {displayValue(row.after)}
          </code>
        )}
      </div>
    </div>
  );
}

function Meta({
  label,
  value,
  mono,
}: {
  label: string;
  value: string;
  mono?: boolean;
}) {
  return (
    <div>
      <div className="text-[10px] uppercase text-muted-foreground">{label}</div>
      <div className={mono ? "font-mono break-all" : "break-all"}>{value}</div>
    </div>
  );
}
