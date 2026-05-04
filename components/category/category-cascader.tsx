"use client";

/**
 * CategoryCascader — cascading + searchable category picker.
 *
 * Replaces the flat <Select> that tried to render 2000+ categories at once.
 * Now each level renders its own server-paginated, server-searchable
 * dropdown. Picking a category commits its id as the form value; if that
 * category has children, an additional picker appears so the seller can
 * refine further. They can stop at any level.
 *
 * On edit, the picker pre-populates by walking the ancestor chain up to
 * the saved category.
 */

import { useEffect, useRef, useState } from "react";
import { useLazyQuery, useQuery } from "@apollo/client/react";
import { Loader2, ChevronDown, X, Search } from "lucide-react";

import {
  GET_CATEGORY_ANCESTORS,
  GET_CATEGORY_CHILDREN,
} from "@/lib/graphql/categories";
import type {
  CategoryNode,
  GetCategoryAncestorsData,
  GetCategoryChildrenData,
} from "@/types/category.types";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface CategoryCascaderProps {
  value: string | null;
  onChange: (id: string | null) => void;
  /** First-level placeholder, e.g. "Pick a category". */
  rootPlaceholder?: string;
}

export function CategoryCascader({
  value,
  onChange,
  rootPlaceholder = "Select category...",
}: CategoryCascaderProps) {
  // path = list of category nodes the user has picked so far, root → leaf.
  // The last node's id is what gets committed as the form value.
  const [path, setPath] = useState<CategoryNode[]>([]);

  // ---- Pre-populate on mount when a value is already set (edit mode) ----
  const [loadAncestors] = useLazyQuery<GetCategoryAncestorsData>(
    GET_CATEGORY_ANCESTORS,
  );
  const seededFor = useRef<string | null>(null);

  useEffect(() => {
    // Only seed once per value. Avoids overwriting the user's manual picks.
    if (!value || seededFor.current === value) return;
    seededFor.current = value;
    void loadAncestors({ variables: { id: value } }).then((res) => {
      const chain = res.data?.categoryAncestors;
      if (chain && chain.length > 0) setPath(chain);
    });
  }, [value, loadAncestors]);

  // If the parent clears the value externally (e.g. form reset), drop our path.
  useEffect(() => {
    if (value === null) {
      setPath([]);
      seededFor.current = null;
    }
  }, [value]);

  function pickAt(level: number, node: CategoryNode) {
    const newPath = [...path.slice(0, level), node];
    setPath(newPath);
    onChange(node.id);
  }

  function clearFrom(level: number) {
    const newPath = path.slice(0, level);
    setPath(newPath);
    onChange(
      newPath.length > 0 ? newPath[newPath.length - 1].id : null,
    );
  }

  // Show one extra picker if the last pick has children (refinement option),
  // or always show one if path is empty (the root picker).
  const lastPick = path[path.length - 1];
  const showNextPicker = path.length === 0 || lastPick?.hasChildren;

  return (
    <div className="space-y-2">
      {path.map((picked, idx) => (
        <CategoryLevelPicker
          key={`${idx}-${picked.id}`}
          parentId={idx === 0 ? null : path[idx - 1].id}
          selectedId={picked.id}
          selectedName={picked.name}
          level={idx}
          onSelect={(node) => pickAt(idx, node)}
          onClear={() => clearFrom(idx)}
        />
      ))}
      {showNextPicker && (
        <CategoryLevelPicker
          parentId={lastPick?.id ?? null}
          selectedId={null}
          selectedName={null}
          level={path.length}
          rootPlaceholder={rootPlaceholder}
          onSelect={(node) => pickAt(path.length, node)}
        />
      )}
    </div>
  );
}

// ===========================================================================
// One level — a searchable dropdown for a single tier in the chain
// ===========================================================================

interface CategoryLevelPickerProps {
  parentId: string | null;
  selectedId: string | null;
  selectedName: string | null;
  level: number;
  rootPlaceholder?: string;
  onSelect: (node: CategoryNode) => void;
  onClear?: () => void;
}

function CategoryLevelPicker({
  parentId,
  selectedId,
  selectedName,
  level,
  rootPlaceholder,
  onSelect,
  onClear,
}: CategoryLevelPickerProps) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const containerRef = useRef<HTMLDivElement>(null);

  // Debounce so we don't fire on every keystroke
  useEffect(() => {
    const t = setTimeout(() => setDebouncedSearch(search.trim()), 250);
    return () => clearTimeout(t);
  }, [search]);

  // Click-outside closes the panel
  useEffect(() => {
    function onDocClick(e: MouseEvent) {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        setOpen(false);
      }
    }
    if (open) document.addEventListener("mousedown", onDocClick);
    return () => document.removeEventListener("mousedown", onDocClick);
  }, [open]);

  const { data, loading } = useQuery<GetCategoryChildrenData>(
    GET_CATEGORY_CHILDREN,
    {
      variables: {
        parentId: parentId ?? null,
        search: debouncedSearch || null,
        limit: 10,
      },
      // network-only when typing so search results stay fresh; cache other lookups
      fetchPolicy: debouncedSearch ? "network-only" : "cache-first",
      skip: !open && !selectedId,
    },
  );

  const options = data?.categoryChildren ?? [];

  const placeholder =
    level === 0
      ? rootPlaceholder ?? "Select..."
      : "Refine further (optional)...";

  return (
    <div className="relative" ref={containerRef}>
      {/* Tier label */}
      {level > 0 && (
        <div className="text-xs text-muted-foreground mb-1">
          Subcategory {level}
        </div>
      )}

      {/* Trigger */}
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="w-full flex items-center justify-between gap-2 rounded-md border bg-background px-3 py-2 text-sm hover:bg-muted/30 transition"
      >
        <span
          className={
            selectedName ? "font-medium" : "text-muted-foreground"
          }
        >
          {selectedName ?? placeholder}
        </span>
        <div className="flex items-center gap-1">
          {selectedId && onClear && (
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="h-5 w-5"
              onClick={(e) => {
                e.stopPropagation();
                onClear();
              }}
              title="Clear this level and below"
            >
              <X className="h-3 w-3" />
            </Button>
          )}
          <ChevronDown className="h-4 w-4 text-muted-foreground" />
        </div>
      </button>

      {/* Panel */}
      {open && (
        <div className="absolute z-50 mt-1 w-full rounded-md border bg-popover shadow-lg">
          <div className="p-2 border-b">
            <div className="relative">
              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
              <Input
                autoFocus
                placeholder="Search..."
                className="pl-8 h-8 text-sm"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
          </div>

          <div className="max-h-64 overflow-y-auto py-1">
            {loading && (
              <div className="flex items-center justify-center py-4">
                <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
              </div>
            )}

            {!loading && options.length === 0 && (
              <div className="px-3 py-4 text-center text-xs text-muted-foreground">
                {debouncedSearch
                  ? `No matches for "${debouncedSearch}"`
                  : "No categories at this level"}
              </div>
            )}

            {!loading &&
              options.map((opt) => (
                <button
                  key={opt.id}
                  type="button"
                  onClick={() => {
                    onSelect(opt);
                    setOpen(false);
                    setSearch("");
                  }}
                  className={`w-full text-left px-3 py-2 text-sm hover:bg-muted/50 transition flex items-center justify-between ${
                    selectedId === opt.id ? "bg-muted/30 font-medium" : ""
                  }`}
                >
                  <span>{opt.name}</span>
                  {opt.hasChildren && (
                    <span className="text-[10px] text-muted-foreground">
                      has subcategories ›
                    </span>
                  )}
                </button>
              ))}
          </div>
        </div>
      )}
    </div>
  );
}
