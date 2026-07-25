/**
 * Audit before/after diff helpers (P3-06).
 *
 * The backend exposes AuditLog `before` / `after` as JSON STRINGS (no JSON
 * scalar is registered server-side). These helpers parse them defensively and
 * compute a shallow, key-level diff for the audit detail viewer.
 */

export type DiffKind = "added" | "removed" | "changed" | "unchanged";

export interface DiffRow {
  key: string;
  kind: DiffKind;
  before?: unknown;
  after?: unknown;
}

/** Parse a JSON string into an object, or return null on empty/invalid input. */
export function safeParse(
  json: string | null | undefined,
): Record<string, unknown> | null {
  if (!json) return null;
  try {
    const parsed = JSON.parse(json);
    if (parsed && typeof parsed === "object" && !Array.isArray(parsed)) {
      return parsed as Record<string, unknown>;
    }
    // Non-object JSON (array / primitive) — wrap so it still renders.
    return { value: parsed };
  } catch {
    // Not JSON — surface the raw string rather than dropping it.
    return { value: json };
  }
}

/** Stable string form of a value for comparison + display. */
export function displayValue(value: unknown): string {
  if (value === undefined) return "—";
  if (value === null) return "null";
  if (typeof value === "string") return value;
  if (typeof value === "number" || typeof value === "boolean") {
    return String(value);
  }
  try {
    return JSON.stringify(value);
  } catch {
    return String(value);
  }
}

/**
 * Shallow key-level diff between two parsed snapshots. Either side may be null
 * (a create has no `before`; a delete has no `after`). Rows are sorted with
 * changed/added/removed first, then unchanged, each alphabetical.
 */
export function diffObjects(
  before: Record<string, unknown> | null,
  after: Record<string, unknown> | null,
): DiffRow[] {
  const keys = new Set<string>([
    ...Object.keys(before ?? {}),
    ...Object.keys(after ?? {}),
  ]);

  const rows: DiffRow[] = [];
  for (const key of keys) {
    const inBefore = before ? key in before : false;
    const inAfter = after ? key in after : false;
    const b = before?.[key];
    const a = after?.[key];

    let kind: DiffKind;
    if (inBefore && !inAfter) kind = "removed";
    else if (!inBefore && inAfter) kind = "added";
    else if (displayValue(b) !== displayValue(a)) kind = "changed";
    else kind = "unchanged";

    rows.push({ key, kind, before: b, after: a });
  }

  const order: Record<DiffKind, number> = {
    changed: 0,
    added: 1,
    removed: 2,
    unchanged: 3,
  };
  return rows.sort(
    (x, y) => order[x.kind] - order[y.kind] || x.key.localeCompare(y.key),
  );
}
