"use client";

/**
 * Multi-select toggle pills. Each pill is independent — clicking adds/removes
 * the option from `selected`. Pairs naturally with status / payment-status /
 * tag-style filters.
 */

export interface FilterPillsProps<T extends string> {
  options: readonly T[];
  selected: readonly T[];
  onToggle: (option: T) => void;
  getLabel?: (option: T) => string;
  className?: string;
}

export function FilterPills<T extends string>({
  options,
  selected,
  onToggle,
  getLabel,
  className,
}: FilterPillsProps<T>) {
  return (
    <div className={`flex flex-wrap gap-1.5 ${className ?? ""}`}>
      {options.map((opt) => {
        const active = selected.includes(opt);
        return (
          <button
            key={opt}
            type="button"
            onClick={() => onToggle(opt)}
            className={`rounded-full border px-3 py-1 text-xs font-medium transition ${
              active
                ? "bg-primary text-primary-foreground border-primary"
                : "bg-background text-foreground hover:bg-muted/40"
            }`}
          >
            {getLabel ? getLabel(opt) : opt}
          </button>
        );
      })}
    </div>
  );
}
