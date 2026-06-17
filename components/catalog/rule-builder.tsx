/**
 * RuleBuilder — visual editor for a catalog RuleSet (match ALL/ANY + a list of
 * field/op/value conditions). Shared by AUTO labels and (Phase 2) smart
 * collections. Emits a RuleSet via onChange.
 *
 * Value kinds:
 *   - boolean → true/false select
 *   - number  → number input
 *   - id      → uuid text input (single, or comma-separated for the "in" op)
 */

"use client";

import { Plus, Trash2 } from "lucide-react";
import {
  RULE_FIELD_META,
  RULE_OP_LABEL,
  fieldMeta,
  type RuleCondition,
  type RuleField,
  type RuleOp,
  type RuleSet,
} from "@/lib/constants/catalog-rules";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface RuleBuilderProps {
  value: RuleSet;
  onChange: (next: RuleSet) => void;
}

const EMPTY_CONDITION: RuleCondition = { field: "onSale", op: "eq", value: true };

export function RuleBuilder({ value, onChange }: RuleBuilderProps) {
  const conditions = value.conditions ?? [];

  function update(patch: Partial<RuleSet>) {
    onChange({ match: value.match, conditions, ...patch });
  }
  function setConditions(next: RuleCondition[]) {
    onChange({ match: value.match, conditions: next });
  }
  function addCondition() {
    setConditions([...conditions, { ...EMPTY_CONDITION }]);
  }
  function removeCondition(i: number) {
    setConditions(conditions.filter((_, idx) => idx !== i));
  }
  function patchCondition(i: number, patch: Partial<RuleCondition>) {
    setConditions(conditions.map((c, idx) => (idx === i ? { ...c, ...patch } : c)));
  }

  /** When the field changes, reset op + value to sensible defaults. */
  function changeField(i: number, field: RuleField) {
    const meta = fieldMeta(field)!;
    const op = meta.ops[0];
    let val: RuleCondition["value"];
    if (meta.kind === "boolean") val = true;
    else if (meta.kind === "number") val = 0;
    else val = "";
    patchCondition(i, { field, op, value: val });
  }

  return (
    <div className="space-y-3 rounded-md border bg-muted/20 p-3">
      <div className="flex items-center gap-2 text-sm">
        <span className="text-muted-foreground">Match</span>
        <Select value={value.match} onValueChange={(m) => update({ match: m as "ALL" | "ANY" })}>
          <SelectTrigger className="h-8 w-28">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="ALL">ALL conditions</SelectItem>
            <SelectItem value="ANY">ANY condition</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        {conditions.map((c, i) => {
          const meta = fieldMeta(c.field);
          return (
            <div key={i} className="flex flex-wrap items-center gap-2">
              {/* Field */}
              <Select value={c.field} onValueChange={(f) => changeField(i, f as RuleField)}>
                <SelectTrigger className="h-8 w-44">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {RULE_FIELD_META.map((m) => (
                    <SelectItem key={m.field} value={m.field}>
                      {m.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {/* Op */}
              <Select value={c.op} onValueChange={(op) => patchCondition(i, { op: op as RuleOp })}>
                <SelectTrigger className="h-8 w-24">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {(meta?.ops ?? []).map((op) => (
                    <SelectItem key={op} value={op}>
                      {RULE_OP_LABEL[op]}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {/* Value */}
              {meta?.kind === "boolean" ? (
                <Select
                  value={String(c.value)}
                  onValueChange={(v) => patchCondition(i, { value: v === "true" })}
                >
                  <SelectTrigger className="h-8 w-28">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="true">true</SelectItem>
                    <SelectItem value="false">false</SelectItem>
                  </SelectContent>
                </Select>
              ) : meta?.kind === "number" ? (
                <Input
                  type="number"
                  className="h-8 w-28"
                  value={Number(c.value)}
                  onChange={(e) => patchCondition(i, { value: Number(e.target.value) })}
                />
              ) : (
                <Input
                  className="h-8 w-56 font-mono text-xs"
                  placeholder={c.op === "in" ? "id1, id2, …" : "uuid"}
                  value={Array.isArray(c.value) ? c.value.join(", ") : String(c.value)}
                  onChange={(e) =>
                    patchCondition(i, {
                      value:
                        c.op === "in"
                          ? e.target.value.split(",").map((s) => s.trim()).filter(Boolean)
                          : e.target.value.trim(),
                    })
                  }
                />
              )}

              <button
                type="button"
                onClick={() => removeCondition(i)}
                className="text-muted-foreground hover:text-destructive p-1"
                title="Remove condition"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          );
        })}
      </div>

      <Button type="button" variant="outline" size="sm" onClick={addCondition}>
        <Plus className="mr-1 h-3.5 w-3.5" />
        Add condition
      </Button>

      {conditions.length === 0 && (
        <p className="text-xs text-muted-foreground">
          No conditions — this rule matches nothing. Add at least one.
        </p>
      )}
    </div>
  );
}
