/**
 * Small formatting helpers for the admin ops surfaces (P3-06).
 *
 * `money` keeps 2 fraction digits (paise matter for refunds/payouts/UTR ledger
 * reconciliation) — distinct from the storefront `formatPrice`, which rounds to
 * whole units for display.
 */

const MONEY_CACHE = new Map<string, Intl.NumberFormat>();

export function money(
  amount: number | null | undefined,
  currency = "INR",
): string {
  if (amount == null) return "—";
  const key = currency;
  let fmt = MONEY_CACHE.get(key);
  if (!fmt) {
    try {
      fmt = new Intl.NumberFormat(currency === "INR" ? "en-IN" : "en-US", {
        style: "currency",
        currency,
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      });
      MONEY_CACHE.set(key, fmt);
    } catch {
      return `${currency} ${amount.toFixed(2)}`;
    }
  }
  return fmt.format(amount);
}

/** Locale date-time, or an em dash for null. */
export function dateTime(value: string | Date | null | undefined): string {
  if (!value) return "—";
  const d = typeof value === "string" ? new Date(value) : value;
  if (Number.isNaN(d.getTime())) return "—";
  return d.toLocaleString();
}

/** Locale date (no time), or an em dash for null. */
export function dateOnly(value: string | Date | null | undefined): string {
  if (!value) return "—";
  const d = typeof value === "string" ? new Date(value) : value;
  if (Number.isNaN(d.getTime())) return "—";
  return d.toLocaleDateString();
}
