/**
 * =============================================================================
 * Menu Tree Editor — /admin/menus/[location]
 * =============================================================================
 *
 * Two-pane editor:
 *   - Left: tree of menu items. Each row has reorder (up/down), add-child,
 *     delete, and visibility-toggle buttons. Click a row to select.
 *   - Right: settings form for the selected item — label, URL, target,
 *     icon (FOOTER_SOCIAL only).
 *
 * Saves the entire tree atomically via `upsertMenu`. Status (active/
 * inactive) flips through a separate mutation so saving never silently
 * unpublishes.
 *
 * Depth cap: 2 levels (top + 1 sub) for v1 — enforced client-side via the
 * "Add child" button only being shown on top-level rows.
 * =============================================================================
 */

"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useMutation, useQuery } from "@apollo/client/react";
import { toast } from "sonner";
import {
  ArrowDown,
  ArrowUp,
  ChevronLeft,
  ChevronDown,
  ChevronRight,
  Eye,
  EyeOff,
  Loader2,
  Plus,
  Save,
  Trash2,
} from "lucide-react";

import {
  GET_ADMIN_MENU,
  UPSERT_MENU,
} from "@/lib/graphql/menus";
import {
  GetAdminMenuData,
  MENU_LOCATION_HINT,
  MENU_LOCATION_LABEL,
  MENU_LOCATIONS,
  MenuItem,
  MenuLocation,
  parseMenuItems,
  serializeMenuItems,
  UpsertMenuData,
} from "@/types/menu.types";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useSetPageTitle } from "@/components/shell/page-title-context";
import { MenuLinkPicker } from "@/components/menu/menu-link-picker";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

function newId(): string {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }
  return Math.random().toString(36).slice(2, 11);
}

function newItem(label = "New item"): MenuItem {
  return {
    id: newId(),
    label,
    url: "/",
    target: "_self",
    visible: true,
    children: [],
  };
}

// ---------------------------------------------------------------------------
// Tree-mutation helpers — operate on a `path` of indices into the tree
// ---------------------------------------------------------------------------

/** Get the array containing the node at `path`, plus the local index. */
function locate(
  items: MenuItem[],
  path: number[],
): { parentArr: MenuItem[]; index: number } | null {
  if (path.length === 0) return null;
  if (path.length === 1) return { parentArr: items, index: path[0] };
  let arr = items;
  for (let i = 0; i < path.length - 1; i++) {
    const idx = path[i];
    const node = arr[idx];
    if (!node) return null;
    arr = node.children;
  }
  return { parentArr: arr, index: path[path.length - 1] };
}

/** Apply a structural change. The mutator may mutate the cloned tree. */
function mutate(
  items: MenuItem[],
  fn: (clone: MenuItem[]) => void,
): MenuItem[] {
  // Deep clone via JSON — sufficient since tree is plain data.
  const clone: MenuItem[] = JSON.parse(JSON.stringify(items));
  fn(clone);
  return clone;
}

// ---------------------------------------------------------------------------

export default function MenuTreeEditor() {
  const params = useParams<{ location: string }>();
  const location = params.location as MenuLocation;
  const isValid = (MENU_LOCATIONS as readonly string[]).includes(location);

  useSetPageTitle("Edit menu");

  const { data, loading, error } = useQuery<GetAdminMenuData>(
    GET_ADMIN_MENU,
    {
      variables: { location },
      fetchPolicy: "cache-and-network",
      skip: !isValid,
    },
  );

  const [name, setName] = useState("");
  const [items, setItems] = useState<MenuItem[]>([]);
  const [selectedPath, setSelectedPath] = useState<number[] | null>(null);
  const [hydrated, setHydrated] = useState(false);
  const [collapsedIds, setCollapsedIds] = useState<Set<string>>(new Set());
  // Path of the item the admin clicked the trash icon on. While set, the
  // confirmation dialog is shown. Required before any item leaves the tree
  // — fixes accidental clicks in the dense action-button strip.
  const [pendingDelete, setPendingDelete] = useState<number[] | null>(null);

  useEffect(() => {
    if (!data?.adminMenu || hydrated) return;
    setName(data.adminMenu.name);
    setItems(parseMenuItems(data.adminMenu.items));
    setHydrated(true);
  }, [data, hydrated]);

  useEffect(() => {
    if (error) toast.error(`Failed to load: ${error.message}`);
  }, [error]);

  const selectedItem = useMemo(() => {
    if (!selectedPath) return null;
    const loc = locate(items, selectedPath);
    if (!loc) return null;
    return loc.parentArr[loc.index] ?? null;
  }, [items, selectedPath]);

  /** Resolve the node currently pending deletion + its descendant count
   *  so the confirmation dialog can warn the admin if children will go too. */
  const pendingDeleteInfo = useMemo(() => {
    if (!pendingDelete) return null;
    const loc = locate(items, pendingDelete);
    if (!loc) return null;
    const node = loc.parentArr[loc.index];
    if (!node) return null;
    const countDescendants = (n: MenuItem): number =>
      (n.children ?? []).reduce(
        (sum, child) => sum + 1 + countDescendants(child),
        0,
      );
    return { node, descendantCount: countDescendants(node) };
  }, [items, pendingDelete]);

  function confirmDelete() {
    if (!pendingDelete) return;
    removeItem(pendingDelete);
    setPendingDelete(null);
  }

  // ---- Mutations ----
  const [upsertMenu, { loading: saving }] = useMutation<UpsertMenuData>(
    UPSERT_MENU,
    {
      onCompleted: () => toast.success("Menu saved"),
      onError: (err) => toast.error(`Save failed: ${err.message}`),
    },
  );

  // ---- Tree operations ----
  function patchSelected(p: Partial<MenuItem>) {
    if (!selectedPath) return;
    setItems((prev) =>
      mutate(prev, (clone) => {
        const loc = locate(clone, selectedPath);
        if (!loc) return;
        loc.parentArr[loc.index] = { ...loc.parentArr[loc.index], ...p };
      }),
    );
  }

  function addRoot() {
    setItems((prev) => [...prev, newItem()]);
  }

  function addChild(path: number[]) {
    setItems((prev) =>
      mutate(prev, (clone) => {
        const loc = locate(clone, path);
        if (!loc) return;
        const parent = loc.parentArr[loc.index];
        parent.children.push(newItem("New sub-item"));
      }),
    );
    // Auto-expand on add-child
    const loc = locate(items, path);
    if (loc) {
      const parentNode = loc.parentArr[loc.index];
      setCollapsedIds((prev) => {
        const next = new Set(prev);
        next.delete(parentNode.id);
        return next;
      });
    }
  }

  function removeItem(path: number[]) {
    setItems((prev) =>
      mutate(prev, (clone) => {
        const loc = locate(clone, path);
        if (!loc) return;
        loc.parentArr.splice(loc.index, 1);
      }),
    );
    if (
      selectedPath &&
      selectedPath.length === path.length &&
      selectedPath.every((v, i) => v === path[i])
    ) {
      setSelectedPath(null);
    }
  }

  function moveItem(path: number[], dir: -1 | 1) {
    setItems((prev) =>
      mutate(prev, (clone) => {
        const loc = locate(clone, path);
        if (!loc) return;
        const target = loc.index + dir;
        if (target < 0 || target >= loc.parentArr.length) return;
        [loc.parentArr[loc.index], loc.parentArr[target]] = [
          loc.parentArr[target],
          loc.parentArr[loc.index],
        ];
      }),
    );
    // Track selected through move
    if (
      selectedPath &&
      selectedPath.length === path.length &&
      selectedPath.slice(0, -1).every((v, i) => v === path[i])
    ) {
      const newSelected = [...selectedPath];
      newSelected[newSelected.length - 1] += dir;
      setSelectedPath(newSelected);
    }
  }

  function toggleVisible(path: number[]) {
    setItems((prev) =>
      mutate(prev, (clone) => {
        const loc = locate(clone, path);
        if (!loc) return;
        const node = loc.parentArr[loc.index];
        node.visible = !node.visible;
      }),
    );
  }

  function toggleCollapse(id: string) {
    setCollapsedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  async function save() {
    await upsertMenu({
      variables: {
        upsertMenuInput: {
          location,
          name,
          items: serializeMenuItems(items),
        },
      },
    });
  }

  if (!isValid) {
    return (
      <div className="space-y-3">
        <Button asChild variant="ghost" size="sm" className="-ml-2">
          <Link href="/admin/menus">
            <ChevronLeft className="mr-1 h-4 w-4" />
            All menus
          </Link>
        </Button>
        <Card>
          <CardContent className="py-12 text-center text-muted-foreground">
            Unknown menu location: <code>{location}</code>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (loading || !hydrated || !data) {
    return (
      <div className="space-y-3">
        <div className="h-8 w-64 bg-muted animate-pulse rounded" />
        <div className="h-96 w-full bg-muted animate-pulse rounded" />
      </div>
    );
  }

  const isSocial = location === "FOOTER_SOCIAL";

  return (
    <div className="space-y-4">
      {/* Top bar */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <Button asChild variant="ghost" size="sm" className="-ml-2">
            <Link href="/admin/menus">
              <ChevronLeft className="mr-1 h-4 w-4" />
              All menus
            </Link>
          </Button>
          <div className="flex items-center gap-2 mt-1 flex-wrap">
            <h1 className="text-xl font-bold">
              {MENU_LOCATION_LABEL[location]}
            </h1>
            <Badge variant="outline" className="text-xs">
              {data.adminMenu.isActive ? "Active" : "Inactive"}
            </Badge>
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            {MENU_LOCATION_HINT[location]}
          </p>
        </div>
        <Button onClick={save} disabled={saving}>
          {saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          <Save className="mr-2 h-4 w-4" />
          Save
        </Button>
      </div>

      {/* Menu meta */}
      <Card>
        <CardContent className="py-4">
          <Label htmlFor="menu-name" className="text-xs">
            Internal name
          </Label>
          <Input
            id="menu-name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="max-w-md"
          />
          <p className="text-xs text-muted-foreground mt-1">
            Admin-facing label only. Not shown on the public site.
          </p>
        </CardContent>
      </Card>

      {/* Two-pane editor */}
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-4">
        {/* Tree pane */}
        <Card>
          <CardContent className="py-4 space-y-2">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                Items ({items.length})
              </h3>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={addRoot}
              >
                <Plus className="mr-1 h-3 w-3" />
                Add item
              </Button>
            </div>

            {items.length === 0 && (
              <div className="rounded-md border border-dashed py-12 text-center text-sm text-muted-foreground">
                No items yet. Click &ldquo;Add item&rdquo; to start.
              </div>
            )}

            <div className="space-y-1">
              {items.map((item, idx) => (
                <ItemRow
                  key={item.id}
                  item={item}
                  path={[idx]}
                  parentLength={items.length}
                  selectedPath={selectedPath}
                  collapsedIds={collapsedIds}
                  onSelect={setSelectedPath}
                  onMove={moveItem}
                  onAddChild={addChild}
                  onRemove={(p) => setPendingDelete(p)}
                  onToggleVisible={toggleVisible}
                  onToggleCollapse={toggleCollapse}
                />
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Settings pane */}
        <Card>
          <CardContent className="py-4 space-y-3">
            <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2">
              Item settings
            </h3>
            {!selectedItem && (
              <p className="text-sm text-muted-foreground italic">
                Select an item from the tree to edit its label, URL, and
                target.
              </p>
            )}
            {selectedItem && (
              <>
                <div>
                  <Label htmlFor="item-label" className="text-xs">
                    Label
                  </Label>
                  <Input
                    id="item-label"
                    value={selectedItem.label}
                    onChange={(e) => patchSelected({ label: e.target.value })}
                  />
                </div>

                {/* Quick fill from existing entities — overwrites label + url */}
                <div className="rounded-md border bg-muted/20 p-3">
                  <MenuLinkPicker
                    onPick={({ label, url }) =>
                      patchSelected({ label, url })
                    }
                  />
                </div>

                <div>
                  <Label htmlFor="item-url" className="text-xs">
                    URL
                  </Label>
                  <Input
                    id="item-url"
                    value={selectedItem.url}
                    onChange={(e) => patchSelected({ url: e.target.value })}
                    placeholder="/category/electronics or https://twitter.com/..."
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    Internal links: <code>/about</code>,{" "}
                    <code>/category/electronics</code>. External links open
                    in a new tab automatically.
                  </p>
                </div>
                <div>
                  <Label className="text-xs">Open link in</Label>
                  <Select
                    value={selectedItem.target ?? "_self"}
                    onValueChange={(v) =>
                      patchSelected({ target: v as "_self" | "_blank" })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="_self">Same tab</SelectItem>
                      <SelectItem value="_blank">New tab</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                {isSocial && (
                  <div>
                    <Label htmlFor="item-icon" className="text-xs">
                      Icon
                    </Label>
                    <Input
                      id="item-icon"
                      value={selectedItem.icon ?? ""}
                      onChange={(e) =>
                        patchSelected({ icon: e.target.value || undefined })
                      }
                      placeholder="Twitter, Instagram, Facebook, Youtube..."
                    />
                    <p className="text-xs text-muted-foreground mt-1">
                      Lucide icon name (case-sensitive). See{" "}
                      <a
                        href="https://lucide.dev/icons"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-primary hover:underline"
                      >
                        lucide.dev/icons
                      </a>
                      .
                    </p>
                  </div>
                )}
              </>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Delete confirmation — guards against accidental clicks on the
          dense action-button strip per row. */}
      <AlertDialog
        open={!!pendingDelete}
        onOpenChange={(o) => !o && setPendingDelete(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Remove item?</AlertDialogTitle>
            <AlertDialogDescription>
              {pendingDeleteInfo && (
                <>
                  Remove{" "}
                  <span className="font-semibold text-foreground">
                    &ldquo;{pendingDeleteInfo.node.label}&rdquo;
                  </span>{" "}
                  from this menu?
                  {pendingDeleteInfo.descendantCount > 0 && (
                    <>
                      <br />
                      <span className="text-destructive">
                        {pendingDeleteInfo.descendantCount} sub-item
                        {pendingDeleteInfo.descendantCount === 1 ? "" : "s"}{" "}
                        will also be removed.
                      </span>
                    </>
                  )}
                  <br />
                  <span className="text-xs text-muted-foreground">
                    Changes are local until you click &ldquo;Save&rdquo;.
                  </span>
                </>
              )}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              onClick={confirmDelete}
            >
              Remove
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

// ===========================================================================
// Recursive tree row
// ===========================================================================

interface ItemRowProps {
  item: MenuItem;
  path: number[];
  parentLength: number;
  selectedPath: number[] | null;
  collapsedIds: Set<string>;
  onSelect: (path: number[]) => void;
  onMove: (path: number[], dir: -1 | 1) => void;
  onAddChild: (path: number[]) => void;
  onRemove: (path: number[]) => void;
  onToggleVisible: (path: number[]) => void;
  onToggleCollapse: (id: string) => void;
}

function ItemRow({
  item,
  path,
  parentLength,
  selectedPath,
  collapsedIds,
  onSelect,
  onMove,
  onAddChild,
  onRemove,
  onToggleVisible,
  onToggleCollapse,
}: ItemRowProps) {
  const idx = path[path.length - 1];
  const depth = path.length - 1;
  const isSelected =
    !!selectedPath &&
    selectedPath.length === path.length &&
    selectedPath.every((v, i) => v === path[i]);
  const isHidden = item.visible === false;
  const hasChildren = item.children.length > 0;
  const isCollapsed = collapsedIds.has(item.id);
  // Depth cap = 2 (top + 1 sub). Hide "add child" on already-nested items.
  const canAddChild = depth === 0;

  return (
    <>
      <div
        className={`flex items-center gap-1 rounded-md border px-2 py-1.5 text-sm transition cursor-pointer ${
          isSelected
            ? "border-primary ring-1 ring-primary bg-primary/5"
            : "hover:border-foreground/30 bg-background"
        } ${isHidden ? "opacity-50" : ""}`}
        style={{ marginLeft: `${depth * 24}px` }}
        onClick={() => onSelect(path)}
      >
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            if (hasChildren) onToggleCollapse(item.id);
          }}
          className={`shrink-0 ${
            hasChildren
              ? "text-muted-foreground hover:text-foreground"
              : "invisible"
          }`}
          aria-label={isCollapsed ? "Expand" : "Collapse"}
        >
          {isCollapsed ? (
            <ChevronRight className="h-4 w-4" />
          ) : (
            <ChevronDown className="h-4 w-4" />
          )}
        </button>

        <div className="flex-1 min-w-0">
          <div className="font-medium truncate">{item.label}</div>
          <div className="text-xs text-muted-foreground font-mono truncate">
            {item.url || "(no link)"}
          </div>
        </div>

        <div className="flex items-center gap-0.5 shrink-0">
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="h-7 w-7"
            disabled={idx === 0}
            onClick={(e) => {
              e.stopPropagation();
              onMove(path, -1);
            }}
            title="Move up"
          >
            <ArrowUp className="h-3 w-3" />
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="h-7 w-7"
            disabled={idx === parentLength - 1}
            onClick={(e) => {
              e.stopPropagation();
              onMove(path, 1);
            }}
            title="Move down"
          >
            <ArrowDown className="h-3 w-3" />
          </Button>
          {canAddChild && (
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="h-7 w-7"
              onClick={(e) => {
                e.stopPropagation();
                onAddChild(path);
              }}
              title="Add child"
            >
              <Plus className="h-3 w-3" />
            </Button>
          )}
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="h-7 w-7"
            onClick={(e) => {
              e.stopPropagation();
              onToggleVisible(path);
            }}
            title={isHidden ? "Show" : "Hide"}
          >
            {isHidden ? (
              <EyeOff className="h-3 w-3" />
            ) : (
              <Eye className="h-3 w-3" />
            )}
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="h-7 w-7 text-destructive hover:text-destructive"
            onClick={(e) => {
              e.stopPropagation();
              onRemove(path);
            }}
            title="Remove"
          >
            <Trash2 className="h-3 w-3" />
          </Button>
        </div>
      </div>

      {hasChildren && !isCollapsed && (
        <div className="space-y-1">
          {item.children.map((child, childIdx) => (
            <ItemRow
              key={child.id}
              item={child}
              path={[...path, childIdx]}
              parentLength={item.children.length}
              selectedPath={selectedPath}
              collapsedIds={collapsedIds}
              onSelect={onSelect}
              onMove={onMove}
              onAddChild={onAddChild}
              onRemove={onRemove}
              onToggleVisible={onToggleVisible}
              onToggleCollapse={onToggleCollapse}
            />
          ))}
        </div>
      )}
    </>
  );
}
