"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";

interface ShopPaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

/**
 * Compact numbered pager with chevrons. Shows up to 3 numbered pages with
 * an ellipsis to the next-to-last when total is large. Mirrors the layout
 * shown in the design (1, 2, 3, ..., >).
 */
export function ShopPagination({
  currentPage,
  totalPages,
  onPageChange,
}: ShopPaginationProps) {
  if (totalPages <= 1) return null;

  const pages = buildPageList(currentPage, totalPages);

  return (
    <nav
      aria-label="Pagination"
      className="flex items-center justify-center gap-1.5 pt-6"
    >
      <PagerButton
        ariaLabel="Previous page"
        disabled={currentPage <= 1}
        onClick={() => onPageChange(currentPage - 1)}
      >
        <ChevronLeft className="h-4 w-4" />
      </PagerButton>

      {pages.map((p, i) =>
        p === "ellipsis" ? (
          <span
            key={`e-${i}`}
            className="px-2 text-sm text-foreground/50 select-none"
          >
            …
          </span>
        ) : (
          <button
            key={p}
            type="button"
            aria-current={p === currentPage ? "page" : undefined}
            onClick={() => onPageChange(p)}
            className={`h-9 min-w-9 px-3 rounded-md text-sm font-semibold transition ${
              p === currentPage
                ? "bg-brand text-white"
                : "border text-foreground/80 hover:border-foreground/40"
            }`}
          >
            {p}
          </button>
        ),
      )}

      <PagerButton
        ariaLabel="Next page"
        disabled={currentPage >= totalPages}
        onClick={() => onPageChange(currentPage + 1)}
      >
        <ChevronRight className="h-4 w-4" />
      </PagerButton>
    </nav>
  );
}

function PagerButton({
  ariaLabel,
  disabled,
  onClick,
  children,
}: {
  ariaLabel: string;
  disabled: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      aria-label={ariaLabel}
      disabled={disabled}
      onClick={onClick}
      className="h-9 w-9 rounded-md border flex items-center justify-center text-foreground/70 hover:border-foreground/40 disabled:opacity-40 disabled:hover:border-input transition"
    >
      {children}
    </button>
  );
}

function buildPageList(
  current: number,
  total: number,
): (number | "ellipsis")[] {
  if (total <= 5) {
    return Array.from({ length: total }, (_, i) => i + 1);
  }
  // Always show 1, current-1, current, current+1, total. Insert ellipses
  // where there are gaps. The design shows a clean "1 2 3 ... >" pattern
  // when current is near the start.
  const pages = new Set<number>([1, total, current, current - 1, current + 1]);
  const sorted = [...pages].filter((p) => p >= 1 && p <= total).sort((a, b) => a - b);
  const out: (number | "ellipsis")[] = [];
  for (let i = 0; i < sorted.length; i++) {
    if (i > 0 && sorted[i] - sorted[i - 1] > 1) out.push("ellipsis");
    out.push(sorted[i]);
  }
  return out;
}
