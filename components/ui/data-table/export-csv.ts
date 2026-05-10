/**
 * Plain CSV download helper. Quotes any cell containing comma, quote, or
 * newline; doubles embedded quotes per RFC 4180.
 *
 * Usage:
 *   exportToCsv({
 *     filename: "orders",
 *     headers: ["Order #", "Date"],
 *     rows: data.map((d) => [d.number, d.createdAt]),
 *   });
 */

export interface ExportToCsvOptions {
  filename: string;
  headers: readonly string[];
  rows: readonly (readonly (string | number | null | undefined)[])[];
  /** Append today's ISO date to the filename (default true). */
  withDate?: boolean;
}

export function exportToCsv({
  filename,
  headers,
  rows,
  withDate = true,
}: ExportToCsvOptions): void {
  const csv = [headers, ...rows]
    .map((r) => r.map(escapeCell).join(","))
    .join("\n");

  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  const datePart = withDate ? `-${new Date().toISOString().slice(0, 10)}` : "";
  a.href = url;
  a.download = `${filename}${datePart}.csv`;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}

function escapeCell(c: string | number | null | undefined): string {
  const s = String(c ?? "");
  return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
}
