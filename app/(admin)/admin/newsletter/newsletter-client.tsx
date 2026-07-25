"use client";

/**
 * Admin Newsletter Broadcast console (P3 Wave 4) — compose a marketing campaign
 * and send it to every ACTIVE subscriber, consent-gated + durable server-side.
 *
 * The list shows each campaign's lifecycle (DRAFT → SENDING → SENT) and the
 * outcome counters finalized when the fan-out completes (recipients / sent /
 * skipped). "Send" is a one-way action behind a confirmation dialog; the actual
 * per-recipient delivery drains asynchronously through the outbox, so a freshly
 * sent campaign shows SENDING and its counters fill in shortly after.
 */

import { useEffect, useState } from "react";
import { useMutation, useQuery } from "@apollo/client/react";
import { toast } from "sonner";
import { Mail, Send, Plus, Eye } from "lucide-react";

import {
  GET_ADMIN_NEWSLETTER_CAMPAIGNS,
  CREATE_NEWSLETTER_CAMPAIGN,
  SEND_NEWSLETTER_CAMPAIGN,
  NEWSLETTER_CAMPAIGN_STATUSES,
  type AdminNewsletterCampaignsData,
  type NewsletterCampaign,
  type NewsletterCampaignStatus,
} from "@/lib/graphql/admin-newsletter";
import { dateTime } from "@/lib/utils/admin-format";

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
  DialogFooter,
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

function statusVariant(
  status: NewsletterCampaignStatus,
): "secondary" | "default" | "outline" {
  if (status === "SENT") return "default";
  if (status === "SENDING") return "secondary";
  return "outline";
}

export default function NewsletterClient() {
  useSetPageTitle("Newsletter");

  const [statusFilter, setStatusFilter] = useState<
    "all" | NewsletterCampaignStatus
  >("all");
  const [search, setSearch] = useState("");
  const [composeOpen, setComposeOpen] = useState(false);
  const [sendTarget, setSendTarget] = useState<NewsletterCampaign | null>(null);
  const [preview, setPreview] = useState<NewsletterCampaign | null>(null);

  const [serverTotal, setServerTotal] = useState(0);
  const pg = usePagination({ totalRows: serverTotal, defaultPageSize: 10 });

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    pg.resetPage();
  }, [statusFilter, pg.pageSize]);

  const vars = {
    page: pg.page,
    pageSize: pg.pageSize,
    status: statusFilter === "all" ? null : statusFilter,
    search: search.trim() || null,
  };

  const { data, loading, error, refetch } =
    useQuery<AdminNewsletterCampaignsData>(GET_ADMIN_NEWSLETTER_CAMPAIGNS, {
      variables: vars,
      fetchPolicy: "cache-and-network",
    });

  useEffect(() => {
    if (error) toast.error(`Failed to load campaigns: ${error.message}`);
  }, [error]);

  useEffect(() => {
    const c = data?.adminNewsletterCampaigns?.totalCount;
    if (typeof c === "number" && c !== serverTotal) setServerTotal(c);
  }, [data?.adminNewsletterCampaigns?.totalCount, serverTotal]);

  const items = data?.adminNewsletterCampaigns?.items ?? [];
  const activeFilterCount =
    (statusFilter !== "all" ? 1 : 0) + (search.trim() ? 1 : 0);
  const resetFilters = () => {
    setStatusFilter("all");
    setSearch("");
    pg.resetPage();
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex flex-col gap-1">
          <h1 className="text-2xl font-bold tracking-tight flex items-center gap-2">
            <Mail className="h-6 w-6 text-primary" />
            Newsletter
          </h1>
          <p className="text-sm text-muted-foreground">
            Compose a broadcast and send it to every active subscriber. Sends are
            consent-gated — subscribers who revoked marketing consent are skipped
            automatically, and every email carries an unsubscribe link.
          </p>
        </div>
        <Button onClick={() => setComposeOpen(true)} className="shrink-0">
          <Plus className="h-4 w-4" />
          New campaign
        </Button>
      </div>

      <TableToolbar
        search={search}
        onSearchChange={setSearch}
        searchPlaceholder="Search subject…"
        activeFilterCount={activeFilterCount}
        onReset={resetFilters}
        primaryFilters={
          <Select
            value={statusFilter}
            onValueChange={(v) =>
              setStatusFilter(v as "all" | NewsletterCampaignStatus)
            }
          >
            <SelectTrigger className="w-full sm:w-52">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All statuses</SelectItem>
              {NEWSLETTER_CAMPAIGN_STATUSES.map((s) => (
                <SelectItem key={s} value={s}>
                  {s}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        }
      />

      <div className="rounded-lg border bg-card shadow-sm overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/40 hover:bg-muted/40">
              <TableHead>Subject</TableHead>
              <TableHead className="text-center">Status</TableHead>
              <TableHead className="text-right">Recipients</TableHead>
              <TableHead className="text-right">Sent / Skipped</TableHead>
              <TableHead className="hidden lg:table-cell">Created</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading && items.length === 0 ? (
              <TableSkeleton colSpan={COL_COUNT} />
            ) : items.length === 0 ? (
              <TableEmpty
                colSpan={COL_COUNT}
                icon={Mail}
                hasFilters={activeFilterCount > 0}
                onClearFilters={resetFilters}
              >
                No campaigns yet.
              </TableEmpty>
            ) : (
              items.map((c) => (
                <TableRow key={c.id}>
                  <TableCell className="max-w-[22rem]">
                    <div className="truncate font-medium">{c.subject}</div>
                  </TableCell>
                  <TableCell className="text-center">
                    <Badge variant={statusVariant(c.status)}>{c.status}</Badge>
                  </TableCell>
                  <TableCell className="text-right tabular-nums">
                    {c.status === "DRAFT" ? "—" : c.recipientCount}
                  </TableCell>
                  <TableCell className="text-right tabular-nums text-muted-foreground">
                    {c.status === "DRAFT"
                      ? "—"
                      : `${c.sentCount} / ${c.skippedCount}`}
                  </TableCell>
                  <TableCell className="hidden lg:table-cell text-xs text-muted-foreground">
                    {dateTime(c.createdAt)}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => setPreview(c)}
                        title="Preview"
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      {c.status === "DRAFT" && (
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8"
                          onClick={() => setSendTarget(c)}
                          title="Send campaign"
                        >
                          <Send className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
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

      <ComposeDialog
        open={composeOpen}
        onOpenChange={setComposeOpen}
        onCreated={() => {
          setComposeOpen(false);
          void refetch();
        }}
      />

      <SendConfirmDialog
        campaign={sendTarget}
        onOpenChange={(o) => !o && setSendTarget(null)}
        onSent={() => {
          setSendTarget(null);
          void refetch();
        }}
      />

      <PreviewDialog
        campaign={preview}
        onOpenChange={(o) => !o && setPreview(null)}
      />
    </div>
  );
}

/* -------------------------------------------------------------------------- */

function ComposeDialog({
  open,
  onOpenChange,
  onCreated,
}: {
  open: boolean;
  onOpenChange: (o: boolean) => void;
  onCreated: () => void;
}) {
  const [subject, setSubject] = useState("");
  const [htmlBody, setHtmlBody] = useState("");
  const [create, { loading }] = useMutation(CREATE_NEWSLETTER_CAMPAIGN);

  useEffect(() => {
    if (open) {
      setSubject("");
      setHtmlBody("");
    }
  }, [open]);

  const submit = async () => {
    if (!subject.trim() || !htmlBody.trim()) {
      toast.error("Subject and body are required.");
      return;
    }
    try {
      await create({
        variables: { input: { subject: subject.trim(), htmlBody } },
      });
      toast.success("Draft campaign created.");
      onCreated();
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : "Failed to create campaign.",
      );
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>New campaign</DialogTitle>
          <DialogDescription>
            Compose the broadcast. It is saved as a draft — nothing is sent until
            you send it. The body is HTML and is wrapped with the store header,
            footer, and an unsubscribe link automatically.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="campaign-subject">Subject</Label>
            <Input
              id="campaign-subject"
              value={subject}
              maxLength={200}
              onChange={(e) => setSubject(e.target.value)}
              placeholder="e.g. New arrivals just dropped"
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="campaign-body">Body (HTML)</Label>
            <Textarea
              id="campaign-body"
              value={htmlBody}
              onChange={(e) => setHtmlBody(e.target.value)}
              placeholder="<h2>Hello!</h2><p>Here's what's new…</p>"
              className="min-h-56 font-mono text-xs"
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={submit} disabled={loading}>
            {loading ? "Saving…" : "Save draft"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function SendConfirmDialog({
  campaign,
  onOpenChange,
  onSent,
}: {
  campaign: NewsletterCampaign | null;
  onOpenChange: (o: boolean) => void;
  onSent: () => void;
}) {
  const [send, { loading }] = useMutation(SEND_NEWSLETTER_CAMPAIGN);

  const doSend = async () => {
    if (!campaign) return;
    try {
      await send({ variables: { id: campaign.id } });
      toast.success("Campaign is sending — delivery is in progress.");
      onSent();
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : "Failed to send campaign.",
      );
    }
  };

  return (
    <Dialog open={!!campaign} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Send this campaign?</DialogTitle>
          <DialogDescription>
            &ldquo;{campaign?.subject}&rdquo; will be sent to every active
            subscriber who has not opted out of marketing. This can&apos;t be
            undone.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={doSend} disabled={loading}>
            <Send className="h-4 w-4" />
            {loading ? "Sending…" : "Send now"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function PreviewDialog({
  campaign,
  onOpenChange,
}: {
  campaign: NewsletterCampaign | null;
  onOpenChange: (o: boolean) => void;
}) {
  return (
    <Dialog open={!!campaign} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="truncate">{campaign?.subject}</DialogTitle>
          <DialogDescription>
            Body preview — the store header, footer, and unsubscribe link are
            added when the email is sent.
          </DialogDescription>
        </DialogHeader>
        {campaign && (
          <div
            className="max-h-[60vh] overflow-y-auto rounded-md border bg-background p-4 text-sm"
            // Admin-authored campaign HTML, shown only to the admin who can
            // already edit it — rendered for an accurate content preview.
            dangerouslySetInnerHTML={{ __html: campaign.htmlBody }}
          />
        )}
      </DialogContent>
    </Dialog>
  );
}
