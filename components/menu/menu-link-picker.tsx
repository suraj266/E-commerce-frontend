"use client";

/**
 * MenuLinkPicker — fills label + URL on a menu item by picking from
 * known entities (Pages / Categories / Brands / Tags).
 *
 * 4 small buttons, each opens a popover with a search input + results
 * list. Click an option → calls onPick with the resolved label and URL.
 * The caller decides whether to overwrite both fields (currently: yes,
 * picker is "set" not "merge").
 *
 * Categories use the cascading children query so the admin can drill
 * into deep trees without hitting all 2000 leaves at once. Pages /
 * Brands / Tags are flat lists.
 */

import { useEffect, useRef, useState } from "react";
import { useQuery } from "@apollo/client/react";
import {
  ChevronRight,
  FileText,
  Hash,
  FolderTree,
  Loader2,
  Tag as TagIcon,
  X,
  Search,
} from "lucide-react";

import { GET_ADMIN_PAGES } from "@/lib/graphql/pages";
import { GET_BRANDS } from "@/lib/graphql/brands";
import { GET_TAGS } from "@/lib/graphql/tags";
import { GET_CATEGORY_CHILDREN } from "@/lib/graphql/categories";
import type { GetAdminPagesData } from "@/types/page.types";
import type { GetCategoryChildrenData } from "@/types/category.types";
// Tag and Brand types are imported only for shape; queries return arrays
import type { Brand } from "@/types/brand.types";
import type { Tag } from "@/types/tag.types";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

type Source = "page" | "category" | "brand" | "tag";

interface PickResult {
  label: string;
  url: string;
}

interface Props {
  onPick: (result: PickResult) => void;
}

export function MenuLinkPicker({ onPick }: Props) {
  const [open, setOpen] = useState<Source | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Click-outside closes the panel
  useEffect(() => {
    if (!open) return;
    function onDocClick(e: MouseEvent) {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        setOpen(null);
      }
    }
    document.addEventListener("mousedown", onDocClick);
    return () => document.removeEventListener("mousedown", onDocClick);
  }, [open]);

  function pick(result: PickResult) {
    onPick(result);
    setOpen(null);
  }

  return (
    <div className="relative" ref={containerRef}>
      <div className="text-xs text-muted-foreground mb-1.5">
        Quick fill from:
      </div>
      <div className="flex gap-1.5 flex-wrap">
        <PickerButton
          icon={<FileText className="h-3 w-3" />}
          label="Page"
          active={open === "page"}
          onClick={() => setOpen(open === "page" ? null : "page")}
        />
        <PickerButton
          icon={<FolderTree className="h-3 w-3" />}
          label="Category"
          active={open === "category"}
          onClick={() => setOpen(open === "category" ? null : "category")}
        />
        <PickerButton
          icon={<TagIcon className="h-3 w-3" />}
          label="Brand"
          active={open === "brand"}
          onClick={() => setOpen(open === "brand" ? null : "brand")}
        />
        <PickerButton
          icon={<Hash className="h-3 w-3" />}
          label="Tag"
          active={open === "tag"}
          onClick={() => setOpen(open === "tag" ? null : "tag")}
        />
      </div>

      {open === "page" && <PagePanel onPick={pick} onClose={() => setOpen(null)} />}
      {open === "category" && (
        <CategoryPanel onPick={pick} onClose={() => setOpen(null)} />
      )}
      {open === "brand" && (
        <BrandPanel onPick={pick} onClose={() => setOpen(null)} />
      )}
      {open === "tag" && <TagPanel onPick={pick} onClose={() => setOpen(null)} />}
    </div>
  );
}

// ---------------------------------------------------------------------------

function PickerButton({
  icon,
  label,
  active,
  onClick,
}: {
  icon: React.ReactNode;
  label: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <Button
      type="button"
      variant={active ? "default" : "outline"}
      size="sm"
      className="h-7 text-xs gap-1.5"
      onClick={onClick}
    >
      {icon}
      {label}
    </Button>
  );
}

function PanelShell({
  title,
  onClose,
  children,
}: {
  title: string;
  onClose: () => void;
  children: React.ReactNode;
}) {
  return (
    <div className="absolute z-50 mt-2 w-full rounded-md border bg-popover shadow-lg">
      <div className="flex items-center justify-between px-3 py-2 border-b">
        <span className="text-xs font-semibold">{title}</span>
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="h-6 w-6"
          onClick={onClose}
        >
          <X className="h-3 w-3" />
        </Button>
      </div>
      {children}
    </div>
  );
}

function SearchInput({
  value,
  onChange,
  placeholder,
}: {
  value: string;
  onChange: (v: string) => void;
  placeholder: string;
}) {
  return (
    <div className="p-2 border-b">
      <div className="relative">
        <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
        <Input
          autoFocus
          placeholder={placeholder}
          className="pl-8 h-8 text-sm"
          value={value}
          onChange={(e) => onChange(e.target.value)}
        />
      </div>
    </div>
  );
}

function ResultsList<T>({
  items,
  loading,
  empty,
  renderItem,
}: {
  items: T[];
  loading: boolean;
  empty: string;
  renderItem: (item: T) => React.ReactNode;
}) {
  return (
    <div className="max-h-64 overflow-y-auto py-1">
      {loading && (
        <div className="flex items-center justify-center py-6">
          <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
        </div>
      )}
      {!loading && items.length === 0 && (
        <div className="px-3 py-6 text-center text-xs text-muted-foreground">
          {empty}
        </div>
      )}
      {!loading && items.map((item, i) => <div key={i}>{renderItem(item)}</div>)}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Page panel
// ---------------------------------------------------------------------------

function PagePanel({
  onPick,
  onClose,
}: {
  onPick: (r: PickResult) => void;
  onClose: () => void;
}) {
  const [search, setSearch] = useState("");
  const { data, loading } = useQuery<GetAdminPagesData>(GET_ADMIN_PAGES, {
    fetchPolicy: "cache-and-network",
  });
  const filtered = (data?.adminPages ?? []).filter((p) => {
    if (!search) return true;
    const q = search.toLowerCase();
    return (
      p.title.toLowerCase().includes(q) || p.slug.toLowerCase().includes(q)
    );
  });

  return (
    <PanelShell title="Pick a page" onClose={onClose}>
      <SearchInput
        value={search}
        onChange={setSearch}
        placeholder="Search title or slug..."
      />
      <ResultsList
        items={filtered}
        loading={loading && !data}
        empty={search ? `No matches for "${search}"` : "No pages yet."}
        renderItem={(p) => (
          <button
            type="button"
            onClick={() =>
              onPick({
                label: p.title,
                url: p.slug === "home" ? "/" : `/${p.slug}`,
              })
            }
            className="w-full flex items-center justify-between px-3 py-2 text-sm hover:bg-muted/50 transition text-left gap-2"
          >
            <span className="flex-1 min-w-0">
              <span className="block font-medium truncate">{p.title}</span>
              <span className="block text-xs text-muted-foreground font-mono truncate">
                /{p.slug}
              </span>
            </span>
            <span className="text-[10px] uppercase text-muted-foreground shrink-0">
              {p.status}
            </span>
          </button>
        )}
      />
    </PanelShell>
  );
}

// ---------------------------------------------------------------------------
// Category panel — cascading drill-down (reuses existing children query)
// ---------------------------------------------------------------------------

interface CategoryNode {
  id: string;
  name: string;
  slug: string;
  parentId?: string | null;
  hasChildren?: boolean | null;
}

function CategoryPanel({
  onPick,
  onClose,
}: {
  onPick: (r: PickResult) => void;
  onClose: () => void;
}) {
  // path is the chain of categories the admin has drilled into
  const [path, setPath] = useState<CategoryNode[]>([]);
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");

  useEffect(() => {
    const t = setTimeout(() => setDebouncedSearch(search.trim()), 200);
    return () => clearTimeout(t);
  }, [search]);

  // Reset search when drilling into a category
  useEffect(() => {
    setSearch("");
    setDebouncedSearch("");
  }, [path.length]);

  const parentId = path.length === 0 ? null : path[path.length - 1].id;

  const { data, loading } = useQuery<GetCategoryChildrenData>(
    GET_CATEGORY_CHILDREN,
    {
      variables: {
        parentId: parentId ?? null,
        search: debouncedSearch || null,
        limit: 50,
      },
      fetchPolicy: "cache-and-network",
    },
  );

  const items = data?.categoryChildren ?? [];

  return (
    <PanelShell title="Pick a category" onClose={onClose}>
      {/* Breadcrumb */}
      <div className="px-3 py-1.5 text-xs text-muted-foreground border-b flex items-center gap-1 flex-wrap">
        <button
          type="button"
          onClick={() => setPath([])}
          className="hover:text-foreground"
        >
          All
        </button>
        {path.map((node, idx) => (
          <span key={node.id} className="flex items-center gap-1">
            <ChevronRight className="h-3 w-3" />
            <button
              type="button"
              onClick={() => setPath(path.slice(0, idx + 1))}
              className="hover:text-foreground"
            >
              {node.name}
            </button>
          </span>
        ))}
      </div>

      <SearchInput
        value={search}
        onChange={setSearch}
        placeholder="Search at this level..."
      />

      <ResultsList
        items={items}
        loading={loading && items.length === 0}
        empty={debouncedSearch ? "No matches." : "No categories at this level."}
        renderItem={(c) => (
          <div className="flex items-center hover:bg-muted/50 transition">
            <button
              type="button"
              onClick={() =>
                onPick({ label: c.name, url: `/category/${c.slug}` })
              }
              className="flex-1 px-3 py-2 text-sm text-left min-w-0"
              title="Use this category as the link"
            >
              <span className="block font-medium truncate">{c.name}</span>
              <span className="block text-xs text-muted-foreground font-mono truncate">
                /category/{c.slug}
              </span>
            </button>
            {c.hasChildren && (
              <button
                type="button"
                onClick={() =>
                  setPath([
                    ...path,
                    {
                      id: c.id,
                      name: c.name,
                      slug: c.slug,
                      parentId: c.parentId,
                      hasChildren: c.hasChildren,
                    },
                  ])
                }
                className="px-2 py-2 text-muted-foreground hover:text-foreground"
                title="Drill into subcategories"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            )}
          </div>
        )}
      />
    </PanelShell>
  );
}

// ---------------------------------------------------------------------------
// Brand panel
// ---------------------------------------------------------------------------

function BrandPanel({
  onPick,
  onClose,
}: {
  onPick: (r: PickResult) => void;
  onClose: () => void;
}) {
  const [search, setSearch] = useState("");
  const { data, loading } = useQuery<{ brands: Brand[] }>(GET_BRANDS, {
    fetchPolicy: "cache-and-network",
  });
  const filtered = (data?.brands ?? []).filter((b) => {
    if (!search) return true;
    const q = search.toLowerCase();
    return (
      b.name.toLowerCase().includes(q) || b.slug.toLowerCase().includes(q)
    );
  });

  return (
    <PanelShell title="Pick a brand" onClose={onClose}>
      <SearchInput
        value={search}
        onChange={setSearch}
        placeholder="Search name or slug..."
      />
      <ResultsList
        items={filtered}
        loading={loading && !data}
        empty={search ? `No matches for "${search}"` : "No brands yet."}
        renderItem={(b) => (
          <button
            type="button"
            onClick={() => onPick({ label: b.name, url: `/brand/${b.slug}` })}
            className="w-full flex items-center justify-between px-3 py-2 text-sm hover:bg-muted/50 transition text-left"
          >
            <span className="flex-1 min-w-0">
              <span className="block font-medium truncate">{b.name}</span>
              <span className="block text-xs text-muted-foreground font-mono truncate">
                /brand/{b.slug}
              </span>
            </span>
          </button>
        )}
      />
    </PanelShell>
  );
}

// ---------------------------------------------------------------------------
// Tag panel
// ---------------------------------------------------------------------------

function TagPanel({
  onPick,
  onClose,
}: {
  onPick: (r: PickResult) => void;
  onClose: () => void;
}) {
  const [search, setSearch] = useState("");
  const { data, loading } = useQuery<{ tags: Tag[] }>(GET_TAGS, {
    fetchPolicy: "cache-and-network",
  });
  const filtered = (data?.tags ?? []).filter((t) => {
    if (!search) return true;
    const q = search.toLowerCase();
    return (
      t.name.toLowerCase().includes(q) || t.slug.toLowerCase().includes(q)
    );
  });

  return (
    <PanelShell title="Pick a tag" onClose={onClose}>
      <SearchInput
        value={search}
        onChange={setSearch}
        placeholder="Search name or slug..."
      />
      <ResultsList
        items={filtered}
        loading={loading && !data}
        empty={search ? `No matches for "${search}"` : "No tags yet."}
        renderItem={(t) => (
          <button
            type="button"
            onClick={() => onPick({ label: t.name, url: `/tag/${t.slug}` })}
            className="w-full flex items-center justify-between px-3 py-2 text-sm hover:bg-muted/50 transition text-left"
          >
            <span className="flex-1 min-w-0">
              <span className="block font-medium truncate">{t.name}</span>
              <span className="block text-xs text-muted-foreground font-mono truncate">
                /tag/{t.slug}
              </span>
            </span>
          </button>
        )}
      />
    </PanelShell>
  );
}
