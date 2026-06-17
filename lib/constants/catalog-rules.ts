/**
 * Catalog rule field/op metadata — mirrors the backend rule engine
 * (backend/src/modules/ecommerce/catalog-rules/rule.types.ts). Drives the
 * shared RuleBuilder UI used by AUTO labels and (Phase 2) smart collections.
 */

export type RuleMatch = "ALL" | "ANY";

export type RuleField =
  | "onSale"
  | "ageDays"
  | "categoryId"
  | "brandId"
  | "tagId"
  | "price"
  | "unitsSold7d"
  | "unitsSold30d"
  | "isFeatured";

export type RuleOp = "eq" | "neq" | "lt" | "lte" | "gt" | "gte" | "in";

export type RuleValue = boolean | number | string | string[];

export interface RuleCondition {
  field: RuleField;
  op: RuleOp;
  value: RuleValue;
}

export interface RuleSet {
  match: RuleMatch;
  conditions: RuleCondition[];
}

export type RuleValueKind = "boolean" | "number" | "id" | "ids";

export interface RuleFieldMeta {
  field: RuleField;
  label: string;
  kind: RuleValueKind;
  /** Ops offered for this field in the builder. */
  ops: RuleOp[];
  hint?: string;
}

export const RULE_FIELD_META: RuleFieldMeta[] = [
  { field: "onSale", label: "On sale", kind: "boolean", ops: ["eq"], hint: "compareAtPrice > price" },
  { field: "ageDays", label: "Age (days)", kind: "number", ops: ["lte", "gte", "lt", "gt"], hint: "days since created" },
  { field: "unitsSold30d", label: "Units sold (30d)", kind: "number", ops: ["gte", "gt", "lte", "lt"] },
  { field: "unitsSold7d", label: "Units sold (7d)", kind: "number", ops: ["gte", "gt", "lte", "lt"] },
  { field: "price", label: "Price", kind: "number", ops: ["lte", "gte", "lt", "gt", "eq"] },
  { field: "isFeatured", label: "Featured", kind: "boolean", ops: ["eq"] },
  { field: "categoryId", label: "Category", kind: "id", ops: ["eq", "neq", "in"] },
  { field: "brandId", label: "Brand", kind: "id", ops: ["eq", "neq", "in"] },
  { field: "tagId", label: "Tag", kind: "id", ops: ["eq", "in"] },
];

export const RULE_OP_LABEL: Record<RuleOp, string> = {
  eq: "is",
  neq: "is not",
  lt: "<",
  lte: "≤",
  gt: ">",
  gte: "≥",
  in: "in",
};

export function fieldMeta(field: RuleField): RuleFieldMeta | undefined {
  return RULE_FIELD_META.find((m) => m.field === field);
}
