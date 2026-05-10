/**
 * Sort state — current key + direction, with a smart toggle.
 *
 * `toggleSort(key)` flips direction if you click the same column, otherwise
 * switches to the new key with a sensible default direction (descending for
 * "amount-like" or "recency-like" columns, ascending for everything else).
 */

import { useCallback, useState } from "react";

export type SortDir = "asc" | "desc";

export interface UseSortOptions<TSortKey extends string> {
  defaultSort: { key: TSortKey; dir: SortDir };
  /** Keys that default to descending the first time they're picked. */
  descByDefaultFor?: readonly TSortKey[];
}

export interface SortState<TSortKey extends string> {
  sortKey: TSortKey;
  sortDir: SortDir;
  toggleSort: (key: TSortKey) => void;
}

export function useSort<TSortKey extends string>({
  defaultSort,
  descByDefaultFor,
}: UseSortOptions<TSortKey>): SortState<TSortKey> {
  const [sortKey, setSortKey] = useState<TSortKey>(defaultSort.key);
  const [sortDir, setSortDir] = useState<SortDir>(defaultSort.dir);

  const toggleSort = useCallback(
    (key: TSortKey) => {
      if (key === sortKey) {
        setSortDir((d) => (d === "asc" ? "desc" : "asc"));
        return;
      }
      setSortKey(key);
      setSortDir(descByDefaultFor?.includes(key) ? "desc" : "asc");
    },
    [sortKey, descByDefaultFor],
  );

  return { sortKey, sortDir, toggleSort };
}
