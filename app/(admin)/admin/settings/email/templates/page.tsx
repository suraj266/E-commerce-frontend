/**
 * Admin → Settings → Email → Templates
 *
 * Lists all seeded email templates grouped by category. Click "edit" to open
 * the editor; toggle the switch to enable/disable (system templates can be
 * edited but not disabled — the toggle is greyed out for those).
 *
 * Uses the shared data-table toolkit so search + reset behaviour is identical
 * to other admin list pages.
 */

"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useMutation, useQuery } from "@apollo/client/react";
import { toast } from "sonner";
import { ArrowLeft, Lock, Mail, Pencil } from "lucide-react";

import {
  GET_EMAIL_TEMPLATES,
  UPDATE_EMAIL_TEMPLATE,
} from "@/lib/graphql/email";
import {
  CATEGORY_LABEL,
  type EmailTemplate,
  type EmailTemplateCategory,
  type GetEmailTemplatesData,
  type UpdateEmailTemplateData,
} from "@/types/email.types";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  TableEmpty,
  TableSkeleton,
  TableToolbar,
} from "@/components/ui/data-table";
import { useSetPageTitle } from "@/components/shell/page-title-context";

const COL_COUNT = 5;

const CATEGORY_VARIANT: Record<
  EmailTemplateCategory,
  "default" | "secondary" | "outline"
> = {
  SYSTEM: "default",
  AUTH: "secondary",
  ORDER: "secondary",
  SELLER: "secondary",
  ADMIN: "secondary",
  NEWSLETTER: "outline",
  PARTIAL: "outline",
};

export default function EmailTemplatesPage() {
  useSetPageTitle("Email Templates");

  const { data, loading } = useQuery<GetEmailTemplatesData>(
    GET_EMAIL_TEMPLATES,
    { fetchPolicy: "cache-and-network" },
  );

  const [search, setSearch] = useState("");
  const [pendingToggleId, setPendingToggleId] = useState<string | null>(null);

  const all = data?.emailTemplates ?? [];
  const filtered = all.filter((t) => {
    const q = search.trim().toLowerCase();
    if (!q) return true;
    return (
      t.name.toLowerCase().includes(q) ||
      t.key.toLowerCase().includes(q) ||
      t.description.toLowerCase().includes(q) ||
      t.category.toLowerCase().includes(q)
    );
  });

  const [updateTemplate] = useMutation<UpdateEmailTemplateData>(
    UPDATE_EMAIL_TEMPLATE,
    {
      onError: (err) => {
        toast.error(err.message);
        setPendingToggleId(null);
      },
      onCompleted: (res) => {
        toast.success(
          `${res.updateEmailTemplate.name} ${res.updateEmailTemplate.isEnabled ? "enabled" : "disabled"}`,
        );
        setPendingToggleId(null);
      },
      refetchQueries: [{ query: GET_EMAIL_TEMPLATES }],
    },
  );

  function handleToggle(t: EmailTemplate, next: boolean) {
    if (t.isSystem) {
      toast.warning("System templates cannot be disabled — edit instead.");
      return;
    }
    setPendingToggleId(t.id);
    updateTemplate({
      variables: { input: { id: t.id, isEnabled: next } },
    });
  }

  // Hide subject column from PARTIAL category since they're wrappers
  const activeFilterCount = search ? 1 : 0;

  // Sort the filtered list by category order then by name for predictable grouping
  const CATEGORY_ORDER: EmailTemplateCategory[] = [
    "SYSTEM",
    "AUTH",
    "ORDER",
    "SELLER",
    "ADMIN",
    "NEWSLETTER",
    "PARTIAL",
  ];
  const sorted = [...filtered].sort((a, b) => {
    const ca = CATEGORY_ORDER.indexOf(a.category);
    const cb = CATEGORY_ORDER.indexOf(b.category);
    if (ca !== cb) return ca - cb;
    return a.name.localeCompare(b.name);
  });

  // Track the last category we rendered so we can stamp a row-spanning header
  // for each new group inside a single Table.
  const groupedRows: Array<{
    type: "header" | "row";
    template?: EmailTemplate;
    category?: EmailTemplateCategory;
  }> = [];
  let lastCategory: EmailTemplateCategory | null = null;
  for (const t of sorted) {
    if (t.category !== lastCategory) {
      groupedRows.push({ type: "header", category: t.category });
      lastCategory = t.category;
    }
    groupedRows.push({ type: "row", template: t });
  }

  // Re-fetch after navigation back from editor
  useEffect(() => {
    return () => undefined;
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-1 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight flex items-center gap-2">
            <Mail className="h-6 w-6 text-primary" />
            Email templates
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Per-event email bodies. Edit the HTML inline; the variables below
            each subject are interpolated at send time.
          </p>
        </div>
        <Button asChild variant="outline" size="sm">
          <Link href="/admin/settings/email">
            <ArrowLeft className="mr-1 h-4 w-4" />
            SMTP settings
          </Link>
        </Button>
      </div>

      <TableToolbar
        search={search}
        onSearchChange={setSearch}
        searchPlaceholder="Search name, key, category..."
        activeFilterCount={activeFilterCount}
        onReset={() => setSearch("")}
      />

      <div className="rounded-lg border bg-card shadow-sm overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/40 hover:bg-muted/40">
              <TableHead>Name</TableHead>
              <TableHead className="hidden md:table-cell">Subject</TableHead>
              <TableHead className="hidden lg:table-cell">Variables</TableHead>
              <TableHead className="text-center">Enabled</TableHead>
              <TableHead className="text-right">Edit</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading && all.length === 0 ? (
              <TableSkeleton colSpan={COL_COUNT} />
            ) : groupedRows.length === 0 ? (
              <TableEmpty
                colSpan={COL_COUNT}
                icon={Mail}
                hasFilters={activeFilterCount > 0}
                onClearFilters={() => setSearch("")}
              >
                {search
                  ? `No templates match "${search}"`
                  : "No templates yet. Run pnpm seed:emails."}
              </TableEmpty>
            ) : (
              groupedRows.map((entry, i) => {
                if (entry.type === "header") {
                  return (
                    <TableRow
                      key={`h-${entry.category}-${i}`}
                      className="bg-muted/20 hover:bg-muted/20"
                    >
                      <TableCell
                        colSpan={COL_COUNT}
                        className="text-xs font-semibold uppercase tracking-wide text-muted-foreground py-2"
                      >
                        <div className="flex items-center gap-2">
                          <Badge
                            variant={
                              CATEGORY_VARIANT[entry.category!] ?? "outline"
                            }
                            className="text-[10px]"
                          >
                            {CATEGORY_LABEL[entry.category!]}
                          </Badge>
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                }

                const t = entry.template!;
                const togglePending = pendingToggleId === t.id;
                const vars = t.variables ?? [];
                return (
                  <TableRow key={t.id}>
                    <TableCell>
                      <Link
                        href={`/admin/settings/email/templates/${t.id}`}
                        className="block hover:underline"
                      >
                        <div className="font-medium flex items-center gap-2">
                          {t.name}
                          {t.isSystem && (
                            <span
                              title="System template — cannot be disabled"
                              className="text-muted-foreground"
                            >
                              <Lock className="h-3 w-3" />
                            </span>
                          )}
                        </div>
                        <div className="text-xs text-muted-foreground font-mono truncate">
                          {t.key}
                        </div>
                      </Link>
                    </TableCell>
                    <TableCell className="hidden md:table-cell text-sm text-muted-foreground truncate max-w-[320px]">
                      {t.subject || (
                        <span className="italic text-muted-foreground/60">
                          (partial — no subject)
                        </span>
                      )}
                    </TableCell>
                    <TableCell className="hidden lg:table-cell">
                      <div className="flex flex-wrap gap-1 max-w-[280px]">
                        {vars.length === 0 ? (
                          <span className="text-xs text-muted-foreground">
                            —
                          </span>
                        ) : (
                          vars.slice(0, 4).map((v) => (
                            <Badge
                              key={v}
                              variant="outline"
                              className="text-[10px] font-mono"
                            >
                              {v}
                            </Badge>
                          ))
                        )}
                        {vars.length > 4 && (
                          <span className="text-[10px] text-muted-foreground">
                            +{vars.length - 4}
                          </span>
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="text-center">
                      <Switch
                        checked={t.isEnabled}
                        disabled={t.isSystem || togglePending}
                        onCheckedChange={(v) => handleToggle(t, v)}
                      />
                    </TableCell>
                    <TableCell className="text-right">
                      <Button
                        asChild
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8"
                        title="Edit template"
                      >
                        <Link
                          href={`/admin/settings/email/templates/${t.id}`}
                        >
                          <Pencil className="h-4 w-4" />
                        </Link>
                      </Button>
                    </TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
