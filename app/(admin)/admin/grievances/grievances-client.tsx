"use client";

/**
 * Admin Grievance console (P4-01, CP-EC Rules 2020). Two surfaces:
 *   • Queue — every complaint across all customers, filterable by status /
 *     category / SLA-breach; open one to read the thread and act on it (assign,
 *     respond, resolve, escalate, close).
 *   • Compliance report — the monthly CP-EC roll-up (counts / resolutions /
 *     SLA compliance / avg resolution time), with a JSON export. PROVISIONAL —
 *     the report + its filing cadence NEED LEGAL SIGN-OFF.
 */

import { useEffect, useState } from "react";
import { useMutation, useQuery } from "@apollo/client/react";
import { toast } from "sonner";
import {
  MessageSquareWarning,
  Eye,
  Loader2,
  AlertTriangle,
  Download,
  Send,
  CheckCircle2,
  ArrowUpCircle,
  XCircle,
} from "lucide-react";

import {
  GET_ADMIN_GRIEVANCES,
  GET_ADMIN_GRIEVANCE,
  GET_GRIEVANCE_COMPLIANCE_REPORT,
  ASSIGN_GRIEVANCE,
  RESPOND_TO_GRIEVANCE,
  RESOLVE_GRIEVANCE,
  ESCALATE_GRIEVANCE,
  CLOSE_GRIEVANCE,
  GRIEVANCE_STATUSES,
  GRIEVANCE_CATEGORIES,
  GRIEVANCE_PRIORITIES,
  GRIEVANCE_STATUS_LABEL,
  GRIEVANCE_STATUS_BADGE,
  GRIEVANCE_CATEGORY_LABEL,
  GRIEVANCE_PRIORITY_BADGE,
  type AdminGrievancesData,
  type AdminGrievanceData,
  type GrievanceComplianceReportData,
  type GrievanceStatus,
  type GrievanceCategory,
  type GrievancePriority,
} from "@/lib/graphql/admin-grievances";
import { dateTime } from "@/lib/utils/admin-format";
import { useAuthStore } from "@/store/auth.store";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useSetPageTitle } from "@/components/shell/page-title-context";
import {
  TableEmpty,
  TablePagination,
  TableSkeleton,
  TableToolbar,
  usePagination,
} from "@/components/ui/data-table";

const COL_COUNT = 6;
const PAGE_SIZE_OPTIONS = [10, 25, 50] as const;

function currentPeriod(): string {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
}

function StatusBadge({ status }: { status: GrievanceStatus }) {
  return (
    <Badge variant="outline" className={`border ${GRIEVANCE_STATUS_BADGE[status]}`}>
      {GRIEVANCE_STATUS_LABEL[status]}
    </Badge>
  );
}

export default function GrievancesClient() {
  useSetPageTitle("Grievances");
  const [tab, setTab] = useState<"queue" | "report">("queue");

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-bold tracking-tight flex items-center gap-2">
          <MessageSquareWarning className="h-6 w-6 text-primary" />
          Grievances
        </h1>
        <p className="text-sm text-muted-foreground">
          Consumer complaints under the CP-EC Rules 2020 redressal workflow —
          triage, respond, and resolve within SLA, and file the monthly
          compliance report.
        </p>
      </div>

      <div className="inline-flex rounded-md border bg-card p-1 text-sm">
        <button
          type="button"
          onClick={() => setTab("queue")}
          className={`rounded px-3 py-1.5 font-medium transition ${
            tab === "queue"
              ? "bg-primary text-primary-foreground"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          Queue
        </button>
        <button
          type="button"
          onClick={() => setTab("report")}
          className={`rounded px-3 py-1.5 font-medium transition ${
            tab === "report"
              ? "bg-primary text-primary-foreground"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          Compliance report
        </button>
      </div>

      {tab === "queue" ? <GrievanceQueue /> : <ComplianceReportView />}
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* Queue                                                                       */
/* -------------------------------------------------------------------------- */

function GrievanceQueue() {
  const [statusFilter, setStatusFilter] = useState<"all" | GrievanceStatus>("all");
  const [categoryFilter, setCategoryFilter] = useState<"all" | GrievanceCategory>(
    "all",
  );
  const [breachedOnly, setBreachedOnly] = useState(false);
  const [search, setSearch] = useState("");
  const [detailId, setDetailId] = useState<string | null>(null);

  const [serverTotal, setServerTotal] = useState(0);
  const pg = usePagination({ totalRows: serverTotal, defaultPageSize: 10 });

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    pg.resetPage();
  }, [statusFilter, categoryFilter, breachedOnly, pg.pageSize]);

  const filter = {
    page: pg.page,
    pageSize: pg.pageSize,
    status: statusFilter === "all" ? null : statusFilter,
    category: categoryFilter === "all" ? null : categoryFilter,
    breachedOnly: breachedOnly ? true : null,
  };

  const { data, loading, error, refetch } = useQuery<AdminGrievancesData>(
    GET_ADMIN_GRIEVANCES,
    { variables: { filter }, fetchPolicy: "cache-and-network" },
  );

  useEffect(() => {
    if (error) toast.error(`Failed to load complaints: ${error.message}`);
  }, [error]);

  useEffect(() => {
    const c = data?.adminGrievances?.totalCount;
    if (typeof c === "number" && c !== serverTotal) setServerTotal(c);
  }, [data?.adminGrievances?.totalCount, serverTotal]);

  const allItems = data?.adminGrievances?.items ?? [];
  const q = search.trim().toLowerCase();
  const items = q
    ? allItems.filter(
        (g) =>
          g.ticketNumber.toLowerCase().includes(q) ||
          g.subject.toLowerCase().includes(q),
      )
    : allItems;

  const activeFilterCount =
    (statusFilter !== "all" ? 1 : 0) +
    (categoryFilter !== "all" ? 1 : 0) +
    (breachedOnly ? 1 : 0) +
    (q ? 1 : 0);

  const resetFilters = () => {
    setStatusFilter("all");
    setCategoryFilter("all");
    setBreachedOnly(false);
    setSearch("");
    pg.resetPage();
  };

  return (
    <div className="space-y-6">
      <TableToolbar
        search={search}
        onSearchChange={setSearch}
        searchPlaceholder="Search ticket # or subject…"
        activeFilterCount={activeFilterCount}
        onReset={resetFilters}
        primaryFilters={
          <div className="flex flex-wrap gap-2">
            <Select
              value={statusFilter}
              onValueChange={(v) => setStatusFilter(v as "all" | GrievanceStatus)}
            >
              <SelectTrigger className="w-full sm:w-44">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All statuses</SelectItem>
                {GRIEVANCE_STATUSES.map((s) => (
                  <SelectItem key={s} value={s}>
                    {GRIEVANCE_STATUS_LABEL[s]}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select
              value={categoryFilter}
              onValueChange={(v) =>
                setCategoryFilter(v as "all" | GrievanceCategory)
              }
            >
              <SelectTrigger className="w-full sm:w-48">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All categories</SelectItem>
                {GRIEVANCE_CATEGORIES.map((c) => (
                  <SelectItem key={c} value={c}>
                    {GRIEVANCE_CATEGORY_LABEL[c]}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button
              type="button"
              variant={breachedOnly ? "default" : "outline"}
              onClick={() => setBreachedOnly((v) => !v)}
              className="shrink-0"
            >
              <AlertTriangle className="h-4 w-4" />
              Breached
            </Button>
          </div>
        }
      />

      <div className="rounded-lg border bg-card shadow-sm overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/40 hover:bg-muted/40">
              <TableHead>Ticket</TableHead>
              <TableHead>Category</TableHead>
              <TableHead className="text-center">Status</TableHead>
              <TableHead className="text-center">Priority</TableHead>
              <TableHead className="hidden lg:table-cell">SLA due</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading && items.length === 0 ? (
              <TableSkeleton colSpan={COL_COUNT} />
            ) : items.length === 0 ? (
              <TableEmpty
                colSpan={COL_COUNT}
                icon={MessageSquareWarning}
                hasFilters={activeFilterCount > 0}
                onClearFilters={resetFilters}
              >
                No complaints found.
              </TableEmpty>
            ) : (
              items.map((g) => (
                <TableRow key={g.id}>
                  <TableCell>
                    <div className="font-mono text-xs">{g.ticketNumber}</div>
                    <div className="max-w-[18rem] truncate text-xs text-muted-foreground">
                      {g.subject}
                    </div>
                  </TableCell>
                  <TableCell className="text-xs">
                    {GRIEVANCE_CATEGORY_LABEL[g.category]}
                  </TableCell>
                  <TableCell className="text-center">
                    <StatusBadge status={g.status} />
                  </TableCell>
                  <TableCell className="text-center">
                    <Badge
                      variant="outline"
                      className={`border text-[10px] ${GRIEVANCE_PRIORITY_BADGE[g.priority]}`}
                    >
                      {g.priority}
                    </Badge>
                  </TableCell>
                  <TableCell className="hidden lg:table-cell text-xs">
                    <span
                      className={
                        g.slaBreached ? "font-medium text-rose-600" : "text-muted-foreground"
                      }
                    >
                      {dateTime(g.slaDueAt)}
                      {g.slaBreached ? " · overdue" : ""}
                    </span>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8"
                      onClick={() => setDetailId(g.id)}
                      title="Open complaint"
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
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

      <Dialog open={!!detailId} onOpenChange={(o) => !o && setDetailId(null)}>
        <DialogContent className="max-w-2xl">
          {detailId && (
            <GrievanceDetail id={detailId} onChanged={() => void refetch()} />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* Detail + actions                                                            */
/* -------------------------------------------------------------------------- */

function GrievanceDetail({
  id,
  onChanged,
}: {
  id: string;
  onChanged: () => void;
}) {
  const myUserId = useAuthStore((s) => s.user?.id ?? null);
  const { data, loading, refetch } = useQuery<AdminGrievanceData>(
    GET_ADMIN_GRIEVANCE,
    { variables: { id }, fetchPolicy: "cache-and-network" },
  );

  const [priority, setPriority] = useState<GrievancePriority>("NORMAL");
  const [reply, setReply] = useState("");
  const [internal, setInternal] = useState(false);
  const [resolution, setResolution] = useState("");

  const g = data?.adminGrievance;
  useEffect(() => {
    if (g?.priority) setPriority(g.priority);
  }, [g?.priority]);

  const done = () => {
    void refetch();
    onChanged();
  };

  const [assign, { loading: assigning }] = useMutation(ASSIGN_GRIEVANCE, {
    onCompleted: () => {
      toast.success("Assigned");
      done();
    },
    onError: (e) => toast.error(e.message),
  });
  const [respond, { loading: responding }] = useMutation(RESPOND_TO_GRIEVANCE, {
    onCompleted: () => {
      toast.success("Sent");
      setReply("");
      setInternal(false);
      done();
    },
    onError: (e) => toast.error(e.message),
  });
  const [resolve, { loading: resolving }] = useMutation(RESOLVE_GRIEVANCE, {
    onCompleted: () => {
      toast.success("Resolved");
      setResolution("");
      done();
    },
    onError: (e) => toast.error(e.message),
  });
  const [escalate, { loading: escalating }] = useMutation(ESCALATE_GRIEVANCE, {
    onCompleted: () => {
      toast.success("Escalated");
      done();
    },
    onError: (e) => toast.error(e.message),
  });
  const [close, { loading: closing }] = useMutation(CLOSE_GRIEVANCE, {
    onCompleted: () => {
      toast.success("Closed");
      done();
    },
    onError: (e) => toast.error(e.message),
  });

  if (loading && !g) {
    return <div className="py-6 text-sm text-muted-foreground">Loading…</div>;
  }
  if (!g) {
    return <div className="py-6 text-sm text-destructive">Not found.</div>;
  }

  const isOpenish = g.status === "OPEN" || g.status === "IN_PROGRESS";
  const canResolve = isOpenish || g.status === "ESCALATED";

  return (
    <>
      <DialogHeader>
        <DialogTitle className="font-mono text-sm">{g.ticketNumber}</DialogTitle>
        <DialogDescription>{g.subject}</DialogDescription>
      </DialogHeader>

      <div className="max-h-[70vh] space-y-4 overflow-y-auto pr-1 text-sm">
        <div className="flex flex-wrap items-center gap-2">
          <StatusBadge status={g.status} />
          <Badge
            variant="outline"
            className={`border text-[10px] ${GRIEVANCE_PRIORITY_BADGE[g.priority]}`}
          >
            {g.priority}
          </Badge>
          <span className="text-xs text-muted-foreground">
            {GRIEVANCE_CATEGORY_LABEL[g.category]}
          </span>
          {g.slaBreached && (
            <span className="text-xs font-medium text-rose-600">
              SLA breached
            </span>
          )}
        </div>

        <div className="rounded-md border bg-muted/30 p-3 text-xs text-muted-foreground">
          <div>Filed {dateTime(g.createdAt)} · SLA due {dateTime(g.slaDueAt)}</div>
          {g.orderId && <div>Order: {g.orderId.slice(0, 12)}…</div>}
          {g.assignedToUserId && (
            <div>Assigned to: {g.assignedToUserId.slice(0, 12)}…</div>
          )}
        </div>

        {/* Thread */}
        <div>
          <div className="mb-2 text-xs font-semibold uppercase text-muted-foreground">
            Conversation
          </div>
          <ol className="space-y-2">
            {(g.messages ?? []).map((m) => (
              <li
                key={m.id}
                className={`rounded-md border p-2.5 text-sm ${
                  m.internal
                    ? "border-amber-300 bg-amber-50 dark:border-amber-500/40 dark:bg-amber-500/10"
                    : m.authorRole === "CUSTOMER"
                      ? "bg-muted/40"
                      : "bg-background"
                }`}
              >
                <div className="mb-1 flex items-center justify-between gap-2 text-xs text-muted-foreground">
                  <span className="font-medium">
                    {m.authorRole === "CUSTOMER"
                      ? "Customer"
                      : m.authorRole === "OFFICER"
                        ? "Officer"
                        : "System"}
                    {m.internal ? " · internal note" : ""}
                  </span>
                  <span>{dateTime(m.createdAt)}</span>
                </div>
                <p className="whitespace-pre-wrap">{m.body}</p>
              </li>
            ))}
          </ol>
        </div>

        {g.resolutionNote && (
          <div className="rounded-md border border-emerald-300 bg-emerald-50 p-3 text-xs dark:border-emerald-500/40 dark:bg-emerald-500/10">
            <span className="font-medium text-emerald-900 dark:text-emerald-200">
              Resolution:{" "}
            </span>
            <span className="text-emerald-900/90 dark:text-emerald-100/90">
              {g.resolutionNote}
            </span>
          </div>
        )}

        {/* Actions */}
        {g.status !== "CLOSED" && (
          <div className="space-y-4 border-t pt-4">
            {/* Assign + priority */}
            <div className="flex flex-wrap items-end gap-2">
              <div className="space-y-1.5">
                <Label className="text-xs">Priority</Label>
                <Select
                  value={priority}
                  onValueChange={(v) => setPriority(v as GrievancePriority)}
                >
                  <SelectTrigger className="h-9 w-32">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {GRIEVANCE_PRIORITIES.map((p) => (
                      <SelectItem key={p} value={p}>
                        {p}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <Button
                variant="outline"
                disabled={assigning || !myUserId}
                onClick={() =>
                  assign({
                    variables: {
                      input: {
                        grievanceId: g.id,
                        assigneeUserId: myUserId,
                        priority,
                      },
                    },
                  })
                }
              >
                {assigning && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Assign to me
              </Button>
              {isOpenish && (
                <Button
                  variant="outline"
                  disabled={escalating}
                  onClick={() => escalate({ variables: { id: g.id } })}
                >
                  {escalating ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  ) : (
                    <ArrowUpCircle className="mr-2 h-4 w-4" />
                  )}
                  Escalate
                </Button>
              )}
              {g.status === "RESOLVED" && (
                <Button
                  variant="outline"
                  disabled={closing}
                  onClick={() => close({ variables: { id: g.id } })}
                >
                  {closing ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  ) : (
                    <XCircle className="mr-2 h-4 w-4" />
                  )}
                  Close
                </Button>
              )}
            </div>

            {/* Respond */}
            <div className="space-y-2">
              <Textarea
                value={reply}
                onChange={(e) => setReply(e.target.value)}
                placeholder="Reply to the customer, or add an internal note…"
                className="min-h-20"
              />
              <div className="flex items-center justify-between gap-2">
                <label className="flex items-center gap-2 text-xs text-muted-foreground">
                  <input
                    type="checkbox"
                    checked={internal}
                    onChange={(e) => setInternal(e.target.checked)}
                    className="h-4 w-4"
                  />
                  Internal note (not sent to customer)
                </label>
                <Button
                  size="sm"
                  disabled={responding || !reply.trim()}
                  onClick={() =>
                    respond({
                      variables: {
                        input: { grievanceId: g.id, body: reply.trim(), internal },
                      },
                    })
                  }
                >
                  {responding ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  ) : (
                    <Send className="mr-2 h-4 w-4" />
                  )}
                  Send
                </Button>
              </div>
            </div>

            {/* Resolve */}
            {canResolve && (
              <div className="space-y-2 rounded-md border border-emerald-300/60 p-3 dark:border-emerald-500/30">
                <Label className="text-xs">Resolution note</Label>
                <Textarea
                  value={resolution}
                  onChange={(e) => setResolution(e.target.value)}
                  placeholder="Describe how the complaint was resolved (sent to the customer)…"
                  className="min-h-16"
                />
                <Button
                  size="sm"
                  disabled={resolving || resolution.trim().length < 5}
                  onClick={() =>
                    resolve({
                      variables: {
                        input: {
                          grievanceId: g.id,
                          resolutionNote: resolution.trim(),
                        },
                      },
                    })
                  }
                >
                  {resolving ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  ) : (
                    <CheckCircle2 className="mr-2 h-4 w-4" />
                  )}
                  Mark resolved
                </Button>
              </div>
            )}
          </div>
        )}
      </div>
    </>
  );
}

/* -------------------------------------------------------------------------- */
/* Compliance report                                                           */
/* -------------------------------------------------------------------------- */

function ComplianceReportView() {
  const [period, setPeriod] = useState(currentPeriod());
  const { data, loading, error } = useQuery<GrievanceComplianceReportData>(
    GET_GRIEVANCE_COMPLIANCE_REPORT,
    { variables: { period }, fetchPolicy: "cache-and-network" },
  );

  const report = data?.grievanceComplianceReport;

  const download = () => {
    if (!report) return;
    const blob = new Blob([JSON.stringify(report, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `grievance-compliance-${report.period}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div className="space-y-1.5">
          <Label htmlFor="report-period" className="text-xs">
            Period (YYYY-MM)
          </Label>
          <Input
            id="report-period"
            type="month"
            value={period}
            onChange={(e) => setPeriod(e.target.value)}
            className="w-44"
          />
        </div>
        <Button variant="outline" onClick={download} disabled={!report}>
          <Download className="h-4 w-4" />
          Export JSON
        </Button>
      </div>

      {loading && !report ? (
        <p className="text-sm text-muted-foreground">Loading…</p>
      ) : error ? (
        <p className="text-sm text-destructive">{error.message}</p>
      ) : !report ? (
        <p className="text-sm text-muted-foreground">No data for this period.</p>
      ) : (
        <div className="space-y-6">
          <div className="rounded-md border border-amber-300 bg-amber-50 p-3 text-xs text-amber-900 dark:border-amber-500/40 dark:bg-amber-500/10 dark:text-amber-200">
            {report.disclaimer}
          </div>

          {(report.officerName || report.officerEmail) && (
            <div className="rounded-lg border bg-card p-4 text-sm">
              <div className="text-xs font-semibold uppercase text-muted-foreground">
                Grievance Officer
              </div>
              <div className="mt-1">
                {report.officerName ?? "—"}
                {report.officerEmail ? ` · ${report.officerEmail}` : ""}
                {report.officerPhone ? ` · ${report.officerPhone}` : ""}
              </div>
            </div>
          )}

          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            <Stat label="Opening backlog" value={report.openingBacklog} />
            <Stat label="Received" value={report.received} />
            <Stat label="Resolved" value={report.resolved} />
            <Stat label="Closed" value={report.closed} />
            <Stat label="Escalated" value={report.escalated} />
            <Stat label="Pending (period end)" value={report.pending} />
            <Stat label="SLA breached" value={report.slaBreached} />
            <Stat
              label="SLA compliance"
              value={
                report.slaComplianceRate == null
                  ? "—"
                  : `${report.slaComplianceRate}%`
              }
            />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="rounded-lg border bg-card p-4">
              <div className="mb-2 text-xs font-semibold uppercase text-muted-foreground">
                By category
              </div>
              <BucketList
                buckets={report.byCategory}
                labeler={(k) =>
                  GRIEVANCE_CATEGORY_LABEL[k as GrievanceCategory] ?? k
                }
              />
            </div>
            <div className="rounded-lg border bg-card p-4">
              <div className="mb-2 text-xs font-semibold uppercase text-muted-foreground">
                By status
              </div>
              <BucketList
                buckets={report.byStatus}
                labeler={(k) =>
                  GRIEVANCE_STATUS_LABEL[k as GrievanceStatus] ?? k
                }
              />
            </div>
          </div>

          <div className="rounded-lg border bg-card p-4 text-sm">
            <span className="text-muted-foreground">
              Mean resolution time:{" "}
            </span>
            <span className="font-medium">
              {report.avgResolutionHours == null
                ? "—"
                : `${report.avgResolutionHours} hrs`}
            </span>
          </div>
        </div>
      )}
    </div>
  );
}

function Stat({ label, value }: { label: string; value: number | string }) {
  return (
    <div className="rounded-lg border bg-card p-4">
      <div className="text-2xl font-bold tabular-nums">{value}</div>
      <div className="mt-1 text-xs text-muted-foreground">{label}</div>
    </div>
  );
}

function BucketList({
  buckets,
  labeler,
}: {
  buckets: { key: string; count: number }[];
  labeler: (k: string) => string;
}) {
  if (buckets.length === 0) {
    return <p className="text-xs text-muted-foreground">None.</p>;
  }
  return (
    <ul className="space-y-1 text-sm">
      {buckets.map((b) => (
        <li key={b.key} className="flex items-center justify-between">
          <span>{labeler(b.key)}</span>
          <span className="font-medium tabular-nums">{b.count}</span>
        </li>
      ))}
    </ul>
  );
}
