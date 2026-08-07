"use client";

/**
 * Seller Category Browser — /seller/categories (read-only)
 *
 * A reference view of the marketplace category taxonomy so sellers can see
 * where their products fit before listing. Categories are a platform-owned,
 * publicly-readable taxonomy (the `categories` query needs no auth) — sellers
 * cannot create/edit them, so this surface is intentionally read-only.
 *
 * The `categories` query returns a flat list; we assemble the tree client-side
 * from `parentId` and render it collapsible with a name/slug search that keeps
 * matching branches (and their ancestors) visible.
 */

import { useMemo, useState } from "react";
import { useQuery } from "@apollo/client/react";
import {
  ChevronRight,
  FolderTree,
  Loader2,
  Search,
  Tag,
} from "lucide-react";

import { GET_CATEGORIES } from "@/lib/graphql/categories";
import { useSetPageTitle } from "@/components/shell/page-title-context";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

interface FlatCategory {
  id: string;
  name: string;
  slug: string;
  description?: string | null;
  parentId?: string | null;
  imageUrl?: string | null;
  iconUrl?: string | null;
  displayOrder: number;
  isActive: boolean;
}

interface GetCategoriesData {
  categories: FlatCategory[];
}

interface CategoryNode extends FlatCategory {
  children: CategoryNode[];
}

function buildTree(flat: FlatCategory[]): CategoryNode[] {
  const byId = new Map<string, CategoryNode>();
  for (const c of flat) byId.set(c.id, { ...c, children: [] });

  const roots: CategoryNode[] = [];
  for (const node of byId.values()) {
    const parent = node.parentId ? byId.get(node.parentId) : null;
    if (parent) parent.children.push(node);
    else roots.push(node);
  }

  const sortRec = (nodes: CategoryNode[]) => {
    nodes.sort(
      (a, b) => a.displayOrder - b.displayOrder || a.name.localeCompare(b.name),
    );
    nodes.forEach((n) => sortRec(n.children));
  };
  sortRec(roots);
  return roots;
}

/**
 * Prune the tree to nodes matching `query` (by name or slug), keeping the
 * ancestor chain of every match so branches stay navigable. Returns the pruned
 * roots plus the set of ids to auto-expand.
 */
function filterTree(
  roots: CategoryNode[],
  query: string,
): { roots: CategoryNode[]; expand: Set<string> } {
  const q = query.trim().toLowerCase();
  if (!q) return { roots, expand: new Set() };

  const expand = new Set<string>();

  const walk = (node: CategoryNode): CategoryNode | null => {
    const keptChildren = node.children
      .map(walk)
      .filter((c): c is CategoryNode => c !== null);
    const selfMatch =
      node.name.toLowerCase().includes(q) ||
      node.slug.toLowerCase().includes(q);
    if (selfMatch || keptChildren.length > 0) {
      if (keptChildren.length > 0) expand.add(node.id);
      return { ...node, children: keptChildren };
    }
    return null;
  };

  const pruned = roots
    .map(walk)
    .filter((c): c is CategoryNode => c !== null);
  return { roots: pruned, expand };
}

export default function SellerCategoriesPage() {
  useSetPageTitle("Categories");

  const { data, loading } = useQuery<GetCategoriesData>(GET_CATEGORIES, {
    fetchPolicy: "cache-and-network",
  });
  const [search, setSearch] = useState("");
  const [manualExpanded, setManualExpanded] = useState<Set<string>>(new Set());

  const tree = useMemo(
    () => buildTree(data?.categories ?? []),
    [data?.categories],
  );
  const { roots, expand: searchExpanded } = useMemo(
    () => filterTree(tree, search),
    [tree, search],
  );

  const searching = search.trim().length > 0;
  // While searching, matching branches force-expand; otherwise the user's
  // manual toggles drive it.
  const isExpanded = (id: string) =>
    searching ? searchExpanded.has(id) : manualExpanded.has(id);

  const toggle = (id: string) =>
    setManualExpanded((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });

  const total = data?.categories?.length ?? 0;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight flex items-center gap-2">
          <FolderTree className="h-6 w-6 text-primary" />
          Categories
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          Browse the marketplace category taxonomy. Pick the most specific
          category when listing a product so it&apos;s easy to find.
        </p>
      </div>

      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search categories…"
          className="pl-9"
        />
      </div>

      <div className="rounded-lg border bg-card">
        {loading && total === 0 ? (
          <div className="flex items-center justify-center py-16">
            <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
          </div>
        ) : roots.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <FolderTree className="h-10 w-10 text-muted-foreground mb-3" />
            <p className="font-medium">
              {searching ? "No categories match your search" : "No categories yet"}
            </p>
            {searching && (
              <p className="text-sm text-muted-foreground mt-1">
                Try a different name or slug.
              </p>
            )}
          </div>
        ) : (
          <ul className="p-2">
            {roots.map((node) => (
              <TreeRow
                key={node.id}
                node={node}
                depth={0}
                isExpanded={isExpanded}
                onToggle={toggle}
              />
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

function TreeRow({
  node,
  depth,
  isExpanded,
  onToggle,
}: {
  node: CategoryNode;
  depth: number;
  isExpanded: (id: string) => boolean;
  onToggle: (id: string) => void;
}) {
  const hasChildren = node.children.length > 0;
  const open = isExpanded(node.id);

  return (
    <li>
      <div
        className="flex items-center gap-2 rounded-md px-2 py-2 hover:bg-muted/40 transition-colors"
        style={{ paddingLeft: `${depth * 20 + 8}px` }}
      >
        {hasChildren ? (
          <button
            type="button"
            onClick={() => onToggle(node.id)}
            className="flex h-5 w-5 items-center justify-center rounded text-muted-foreground hover:text-foreground"
            aria-label={open ? "Collapse" : "Expand"}
          >
            <ChevronRight
              className={`h-4 w-4 transition-transform ${open ? "rotate-90" : ""}`}
            />
          </button>
        ) : (
          <span className="flex h-5 w-5 items-center justify-center text-muted-foreground/60">
            <Tag className="h-3.5 w-3.5" />
          </span>
        )}

        <span className="text-sm font-medium">{node.name}</span>
        <code className="text-xs text-muted-foreground">/{node.slug}</code>

        {hasChildren && (
          <Badge variant="secondary" className="ml-1 text-[10px]">
            {node.children.length}
          </Badge>
        )}
        {!node.isActive && (
          <Badge variant="outline" className="text-[10px]">
            Inactive
          </Badge>
        )}
      </div>

      {hasChildren && open && (
        <ul>
          {node.children.map((child) => (
            <TreeRow
              key={child.id}
              node={child}
              depth={depth + 1}
              isExpanded={isExpanded}
              onToggle={onToggle}
            />
          ))}
        </ul>
      )}
    </li>
  );
}
