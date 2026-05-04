/**
 * Price formatting + discount helpers.
 *
 * Uses Intl.NumberFormat for locale-aware formatting (₹1,99,999 in en-IN,
 * $1,999.99 in en-US, etc.). Falls back to "{code} amount" if currency is
 * unrecognized.
 */

const FORMATTER_CACHE = new Map<string, Intl.NumberFormat>();

function getFormatter(currency: string): Intl.NumberFormat {
  const cached = FORMATTER_CACHE.get(currency);
  if (cached) return cached;
  try {
    const fmt = new Intl.NumberFormat(currency === "INR" ? "en-IN" : "en-US", {
      style: "currency",
      currency,
      maximumFractionDigits: 0,
    });
    FORMATTER_CACHE.set(currency, fmt);
    return fmt;
  } catch {
    // Currency code not supported by Intl — caller will use fallback path
    const fallback = new Intl.NumberFormat("en-US");
    return fallback;
  }
}

/**
 * Format a price value in the given currency.
 * `null`/`undefined` → empty string.
 */
export function formatPrice(
  amount: number | null | undefined,
  currency = "INR",
): string {
  if (amount == null) return "";
  try {
    return getFormatter(currency).format(amount);
  } catch {
    return `${currency} ${amount.toLocaleString()}`;
  }
}

/**
 * Returns rounded discount percentage when comparePrice > price by ≥1%.
 * Returns null when there's no meaningful discount.
 */
export function discountPercent(
  price: number | null | undefined,
  comparePrice: number | null | undefined,
): number | null {
  if (price == null || comparePrice == null) return null;
  if (comparePrice <= price) return null;
  const pct = Math.round(((comparePrice - price) / comparePrice) * 100);
  return pct >= 1 ? pct : null;
}
