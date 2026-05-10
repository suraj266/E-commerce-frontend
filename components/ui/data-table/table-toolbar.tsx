"use client";

/**
 * Toolbar layout — search + advanced toggle + reset, with optional slots for
 * primary filters (always visible, e.g. status pills) and advanced filters
 * (collapsible, e.g. date / amount ranges).
 *
 * Each list page owns its filter state; this component just lays out the
 * shared chrome around them.
 */

import { useState, type ReactNode } from "react";
import { Filter, Search, X } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export interface TableToolbarProps {
  search: string;
  onSearchChange: (value: string) => void;
  searchPlaceholder?: string;
  activeFilterCount?: number;
  onReset?: () => void;
  /** Always-visible filters rendered below the search bar (e.g. status pills). */
  primaryFilters?: ReactNode;
  /** Filters revealed by the Advanced toggle. Omit to hide the toggle. */
  advancedFilters?: ReactNode;
}

export function TableToolbar({
  search,
  onSearchChange,
  searchPlaceholder = "Search...",
  activeFilterCount = 0,
  onReset,
  primaryFilters,
  advancedFilters,
}: TableToolbarProps) {
  const [showAdvanced, setShowAdvanced] = useState(false);
  const hasAdvanced = Boolean(advancedFilters);

  return (
    <div className="rounded-lg border bg-card p-3 shadow-sm space-y-3">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder={searchPlaceholder}
            className="pl-9"
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
          />
        </div>
        {hasAdvanced && (
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowAdvanced((v) => !v)}
            className="shrink-0"
          >
            <Filter className="mr-1 h-4 w-4" />
            Advanced
            {activeFilterCount > 0 && (
              <Badge
                variant="secondary"
                className="ml-1.5 h-5 px-1.5 text-[10px]"
              >
                {activeFilterCount}
              </Badge>
            )}
          </Button>
        )}
        {activeFilterCount > 0 && onReset && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onReset}
            className="shrink-0 text-muted-foreground"
          >
            <X className="mr-1 h-4 w-4" />
            Reset
          </Button>
        )}
      </div>

      {primaryFilters}

      {hasAdvanced && showAdvanced && (
        <div className="grid grid-cols-1 gap-3 pt-1 sm:grid-cols-2 lg:grid-cols-4">
          {advancedFilters}
        </div>
      )}
    </div>
  );
}
