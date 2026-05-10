/**
 * Pagination state — page, pageSize, and helpers. Works for both server-side
 * pagination (pass server's totalCount as `totalRows`) and client-side
 * pagination (pass the filtered array length).
 *
 * Auto-clamps `page` whenever the row count shrinks (e.g. filters narrow the
 * result set below the current page boundary).
 */

import { useCallback, useEffect, useState } from "react";

export interface UsePaginationOptions {
  totalRows: number;
  defaultPageSize?: number;
}

export interface PaginationState {
  page: number;
  pageSize: number;
  setPage: (n: number) => void;
  setPageSize: (n: number) => void;
  resetPage: () => void;
  totalPages: number;
  /** Page clamped to [1, totalPages]; safe for slicing. */
  safePage: number;
  /** Zero-based index of the first row on the current page. */
  start: number;
}

export function usePagination({
  totalRows,
  defaultPageSize = 25,
}: UsePaginationOptions): PaginationState {
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(defaultPageSize);

  const totalPages = Math.max(1, Math.ceil(totalRows / pageSize));
  const safePage = Math.min(page, totalPages);

  useEffect(() => {
    if (page > totalPages) setPage(totalPages);
  }, [page, totalPages]);

  const resetPage = useCallback(() => setPage(1), []);

  return {
    page,
    pageSize,
    setPage,
    setPageSize,
    resetPage,
    totalPages,
    safePage,
    start: (safePage - 1) * pageSize,
  };
}
