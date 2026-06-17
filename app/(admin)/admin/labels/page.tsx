/**
 * Admin → Labels — manage product badges (manual + auto/rule-based).
 *
 * MANUAL labels are hand-assigned to products. AUTO labels carry a rule
 * (built with the shared RuleBuilder) evaluated per product at read time.
 * System labels (sale/new/bestseller/trending) are editable but not deletable.
 */

"use client";

import { useMemo, useState } from "react";
import { useMutation, useQuery } from "@apollo/client/react";
import { toast } from "sonner";
import { Loader2, Lock, Plus, Trash2 } from "lucide-react";

import {
  CREATE_LABEL,
  GET_ADMIN_LABELS,
  REMOVE_LABEL,
  UPDATE_LABEL,
} from "@/lib/graphql/labels";
import type {
  CreateLabelData,
  GetAdminLabelsData,
  Label,
  LabelType,
  UpdateLabelData,
} from "@/types/label.types";
import type { RuleSet } from "@/lib/constants/catalog-rules";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { RuleBuilder } from "@/components/catalog/rule-builder";
import { useSetPageTitle } from "@/components/shell/page-title-context";

const DEFAULT_RULE: RuleSet = {
  match: "ALL",
  conditions: [{ field: "onSale", op: "eq", value: true }],
};

interface FormState {
  id?: string;
  key: string;
  name: string;
  color: string;
  textColor: string;
  icon: string;
  type: LabelType;
  priority: number;
  isEnabled: boolean;
  rule: RuleSet;
  isSystem: boolean;
}

const BLANK: FormState = {
  key: "",
  name: "",
  color: "#6366f1",
  textColor: "#ffffff",
  icon: "",
  type: "MANUAL",
  priority: 100,
  isEnabled: true,
  rule: DEFAULT_RULE,
  isSystem: false,
};

export default function AdminLabelsPage() {
  useSetPageTitle("Labels");

  const { data, loading, refetch } = useQuery<GetAdminLabelsData>(GET_ADMIN_LABELS, {
    fetchPolicy: "cache-and-network",
  });
  const labels = useMemo(() => data?.adminLabels ?? [], [data]);

  const [createLabel] = useMutation<CreateLabelData>(CREATE_LABEL);
  const [updateLabel] = useMutation<UpdateLabelData>(UPDATE_LABEL);
  const [removeLabel] = useMutation(REMOVE_LABEL);

  const [open, setOpen] = useState(false);
  const [form, setForm] = useState<FormState>(BLANK);
  const [saving, setSaving] = useState(false);

  function openCreate() {
    setForm(BLANK);
    setOpen(true);
  }
  function openEdit(l: Label) {
    setForm({
      id: l.id,
      key: l.key,
      name: l.name,
      color: l.color,
      textColor: l.textColor ?? "#ffffff",
      icon: l.icon ?? "",
      type: l.type,
      priority: l.priority,
      isEnabled: l.isEnabled,
      rule: l.rule ? (JSON.parse(l.rule) as RuleSet) : DEFAULT_RULE,
      isSystem: l.isSystem,
    });
    setOpen(true);
  }

  async function save() {
    setSaving(true);
    try {
      const ruleStr =
        form.type === "AUTO" ? JSON.stringify(form.rule) : undefined;
      if (form.id) {
        await updateLabel({
          variables: {
            updateLabelInput: {
              id: form.id,
              name: form.name,
              color: form.color,
              textColor: form.textColor || undefined,
              icon: form.icon || undefined,
              type: form.type,
              rule: ruleStr,
              priority: form.priority,
              isEnabled: form.isEnabled,
            },
          },
        });
      } else {
        await createLabel({
          variables: {
            createLabelInput: {
              key: form.key,
              name: form.name,
              color: form.color,
              textColor: form.textColor || undefined,
              icon: form.icon || undefined,
              type: form.type,
              rule: ruleStr,
              priority: form.priority,
              isEnabled: form.isEnabled,
            },
          },
        });
      }
      toast.success("Label saved.");
      setOpen(false);
      await refetch();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Save failed.");
    } finally {
      setSaving(false);
    }
  }

  async function toggleEnabled(l: Label, isEnabled: boolean) {
    try {
      await updateLabel({
        variables: { updateLabelInput: { id: l.id, isEnabled } },
      });
      await refetch();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Update failed.");
    }
  }

  async function handleDelete(l: Label) {
    if (!confirm(`Delete label "${l.name}"?`)) return;
    try {
      await removeLabel({ variables: { id: l.id } });
      toast.success("Label deleted.");
      await refetch();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Delete failed.");
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Labels</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Product badges. AUTO labels apply by rule (sale / new / bestseller /
            trending); MANUAL labels are assigned per product.
          </p>
        </div>
        <Button onClick={openCreate}>
          <Plus className="mr-1.5 h-4 w-4" />
          New label
        </Button>
      </div>

      <div className="rounded-lg border bg-card overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-muted/40 text-left text-xs uppercase tracking-wide text-muted-foreground">
            <tr>
              <th className="px-4 py-3">Badge</th>
              <th className="px-4 py-3">Key</th>
              <th className="px-4 py-3">Type</th>
              <th className="px-4 py-3">Priority</th>
              <th className="px-4 py-3">Enabled</th>
              <th className="px-4 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading && labels.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-4 py-8 text-center text-muted-foreground">
                  <Loader2 className="mx-auto h-5 w-5 animate-spin" />
                </td>
              </tr>
            ) : labels.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-4 py-8 text-center text-muted-foreground">
                  No labels yet. Run <code>pnpm seed:labels</code> or create one.
                </td>
              </tr>
            ) : (
              labels.map((l) => (
                <tr key={l.id} className="border-t">
                  <td className="px-4 py-3">
                    <span
                      className="inline-block rounded-full px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wide"
                      style={{ backgroundColor: l.color, color: l.textColor ?? "#fff" }}
                    >
                      {l.name}
                    </span>
                  </td>
                  <td className="px-4 py-3 font-mono text-xs">{l.key}</td>
                  <td className="px-4 py-3">
                    <Badge variant={l.type === "AUTO" ? "default" : "outline"} className="text-[10px]">
                      {l.type}
                    </Badge>
                    {l.isSystem && (
                      <Lock className="ml-1 inline h-3 w-3 text-muted-foreground" />
                    )}
                  </td>
                  <td className="px-4 py-3">{l.priority}</td>
                  <td className="px-4 py-3">
                    <Switch
                      checked={l.isEnabled}
                      onCheckedChange={(v) => toggleEnabled(l, v)}
                    />
                  </td>
                  <td className="px-4 py-3 text-right">
                    <Button variant="ghost" size="sm" onClick={() => openEdit(l)}>
                      Edit
                    </Button>
                    {!l.isSystem && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDelete(l)}
                        className="text-destructive"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Create / edit dialog */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>{form.id ? "Edit label" : "New label"}</DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <Field label="Key">
                <Input
                  value={form.key}
                  disabled={!!form.id}
                  placeholder="hot"
                  onChange={(e) => setForm({ ...form, key: e.target.value })}
                />
              </Field>
              <Field label="Name">
                <Input
                  value={form.name}
                  placeholder="Hot"
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                />
              </Field>
            </div>

            <div className="grid grid-cols-3 gap-3">
              <Field label="Color">
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={form.color}
                    onChange={(e) => setForm({ ...form, color: e.target.value })}
                    className="h-9 w-10 rounded border"
                  />
                  <Input
                    value={form.color}
                    onChange={(e) => setForm({ ...form, color: e.target.value })}
                    className="font-mono text-xs"
                  />
                </div>
              </Field>
              <Field label="Text">
                <input
                  type="color"
                  value={form.textColor}
                  onChange={(e) => setForm({ ...form, textColor: e.target.value })}
                  className="h-9 w-full rounded border"
                />
              </Field>
              <Field label="Priority">
                <Input
                  type="number"
                  value={form.priority}
                  onChange={(e) => setForm({ ...form, priority: Number(e.target.value) })}
                />
              </Field>
            </div>

            <Field label="Type">
              <Select
                value={form.type}
                onValueChange={(t) => setForm({ ...form, type: t as LabelType })}
                disabled={form.isSystem}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="MANUAL">Manual (assigned per product)</SelectItem>
                  <SelectItem value="AUTO">Auto (rule-based)</SelectItem>
                </SelectContent>
              </Select>
            </Field>

            {form.type === "AUTO" && (
              <Field label="Rule">
                <RuleBuilder
                  value={form.rule}
                  onChange={(rule) => setForm({ ...form, rule })}
                />
              </Field>
            )}

            <div className="flex items-center gap-2">
              <Switch
                checked={form.isEnabled}
                onCheckedChange={(v) => setForm({ ...form, isEnabled: v })}
              />
              <span className="text-sm">Enabled</span>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button onClick={save} disabled={saving}>
              {saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Save
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="space-y-1.5">
      <label className="text-xs font-medium text-muted-foreground">{label}</label>
      {children}
    </div>
  );
}
