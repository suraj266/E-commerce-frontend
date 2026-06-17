/**
 * ProductLabels — renders a product's badges (computed server-side: manual +
 * matching auto labels, already sorted by priority). Replaces the old
 * duplicated client-side `deriveBadge` logic in the card components.
 *
 * Shows only the top `max` (default 1) badge to avoid clutter — on a listing
 * card, one badge is the convention (Amazon/Shopify/Myntra). The backend
 * returns the full priority-sorted set, so the single highest-priority label
 * wins (e.g. SALE @ priority 10 beats NEW @ 20). Pass `max={2}` for surfaces
 * with more room (e.g. a PDP). Colors come from the label (admin-editable).
 */

import type { ProductBadge } from "@/types/product.types";

interface ProductLabelsProps {
  labels?: ProductBadge[] | null;
  /** Max badges to show. Default 1 (one-badge-per-card convention). */
  max?: number;
  /** Extra classes for the wrapper (positioning). */
  className?: string;
  /** Visual size. */
  size?: "sm" | "md";
}

export function ProductLabels({
  labels,
  max = 1,
  className = "",
  size = "md",
}: ProductLabelsProps) {
  if (!labels || labels.length === 0) return null;
  const shown = labels.slice(0, max);

  const pad = size === "sm" ? "px-2 py-0.5 text-[9px]" : "px-2.5 py-1 text-[10px]";

  return (
    <div className={`flex flex-col items-start gap-1 ${className}`}>
      {shown.map((l) => (
        <span
          key={l.key}
          className={`uppercase tracking-wide font-semibold rounded-full ${pad}`}
          style={{ backgroundColor: l.color, color: l.textColor ?? "#ffffff" }}
        >
          {l.name}
        </span>
      ))}
    </div>
  );
}
