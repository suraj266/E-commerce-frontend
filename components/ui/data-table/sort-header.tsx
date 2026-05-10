"use client";

/**
 * Clickable column header that drives `useTableState.toggleSort`.
 * Renders an icon: ArrowUpDown when inactive, ArrowUp/ArrowDown when active.
 */

import { ArrowDown, ArrowUp, ArrowUpDown } from "lucide-react";

import type { SortDir } from "./use-sort";

export interface SortHeaderProps<TSortKey extends string> {
  label: string;
  sortKey: TSortKey;
  currentKey: TSortKey;
  dir: SortDir;
  onClick: (key: TSortKey) => void;
  align?: "right";
}

export function SortHeader<TSortKey extends string>({
  label,
  sortKey,
  currentKey,
  dir,
  onClick,
  align,
}: SortHeaderProps<TSortKey>) {
  const active = currentKey === sortKey;
  const Icon = !active ? ArrowUpDown : dir === "asc" ? ArrowUp : ArrowDown;
  return (
    <button
      type="button"
      onClick={() => onClick(sortKey)}
      className={`inline-flex items-center gap-1 font-medium hover:text-foreground transition ${
        active ? "text-foreground" : "text-muted-foreground"
      } ${align === "right" ? "ml-auto" : ""}`}
    >
      {label}
      <Icon className="h-3.5 w-3.5" />
    </button>
  );
}
