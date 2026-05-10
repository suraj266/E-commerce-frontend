"use client";

/**
 * Empty / loading state cells, sized to span the whole table body.
 *
 * Both render a single TableRow → TableCell with `colSpan`. Pair with the
 * shadcn Table primitive.
 */

import type { ComponentType, ReactNode } from "react";

import { Button } from "@/components/ui/button";
import { TableCell, TableRow } from "@/components/ui/table";

export interface TableEmptyProps {
  colSpan: number;
  icon?: ComponentType<{ className?: string }>;
  hasFilters?: boolean;
  onClearFilters?: () => void;
  children?: ReactNode;
}

export function TableEmpty({
  colSpan,
  icon: Icon,
  hasFilters,
  onClearFilters,
  children,
}: TableEmptyProps) {
  return (
    <TableRow>
      <TableCell colSpan={colSpan}>
        <div className="flex flex-col items-center justify-center gap-2 py-12 text-sm text-muted-foreground">
          {Icon && <Icon className="h-8 w-8 opacity-40" />}
          {children ?? (hasFilters ? "No results match your filters." : "No data yet.")}
          {hasFilters && onClearFilters && (
            <Button variant="ghost" size="sm" onClick={onClearFilters}>
              Clear filters
            </Button>
          )}
        </div>
      </TableCell>
    </TableRow>
  );
}

export interface TableSkeletonProps {
  colSpan: number;
  rows?: number;
}

export function TableSkeleton({ colSpan, rows = 6 }: TableSkeletonProps) {
  return (
    <>
      {Array.from({ length: rows }).map((_, i) => (
        <TableRow key={i}>
          <TableCell colSpan={colSpan}>
            <div className="h-10 w-full animate-pulse rounded bg-muted" />
          </TableCell>
        </TableRow>
      ))}
    </>
  );
}
