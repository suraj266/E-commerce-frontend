/**
 * =============================================================================
 * Admin Page Editor — /admin/pages/[id]
 * =============================================================================
 *
 * Three-pane block editor:
 *   - Left: block picker (BLOCK_REGISTRY entries — click to append)
 *   - Center: stack of blocks in current order; click to select; reorder
 *     buttons + delete + visibility toggle per block
 *   - Right: settings form for the currently-selected block (driven by the
 *     block's Editor component from the registry)
 *
 * Saves are explicit via the "Save" button (which serializes blocks JSON
 * + writes other meta). Status flips (Draft / Publish / Archive) are a
 * separate mutation so saving doesn't accidentally republish.
 * =============================================================================
 */

"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useMutation, useQuery } from "@apollo/client/react";
import { toast } from "sonner";
import {
  ArrowDown,
  ArrowUp,
  ChevronLeft,
  Eye,
  EyeOff,
  ExternalLink,
  Loader2,
  Save,
  Trash2,
} from "lucide-react";

import {
  GET_PAGE,
  SET_PAGE_STATUS,
  UPDATE_PAGE,
} from "@/lib/graphql/pages";
import {
  Block,
  GetPageData,
  PAGE_STATUS_LABEL,
  PageStatus,
  parseBlocks,
  serializeBlocks,
  SetPageStatusData,
  UpdatePageData,
} from "@/types/page.types";

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

import {
  BLOCK_REGISTRY,
  BLOCK_TYPES_ORDER,
} from "@/components/page-builder/registry";

const STATUS_VARIANT: Record<
  PageStatus,
  "default" | "secondary" | "destructive" | "outline"
> = {
  DRAFT: "outline",
  PUBLISHED: "default",
  ARCHIVED: "destructive",
};

/** Cheap UUID for client-only IDs on freshly added blocks. */
function newBlockId(): string {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }
  return Math.random().toString(36).slice(2, 11);
}

export default function PageEditor() {
  useSetPageTitle("Edit page");
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const pageId = params.id;

  // ---- Load ----
  const { data, loading, error } = useQuery<GetPageData>(GET_PAGE, {
    variables: { id: pageId },
    fetchPolicy: "cache-and-network",
  });

  const page = data?.page;

  // ---- Local edit state (mirrors page until saved) ----
  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [metaTitle, setMetaTitle] = useState("");
  const [metaDesc, setMetaDesc] = useState("");
  const [blocks, setBlocks] = useState<Block[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [hydrated, setHydrated] = useState(false);

  // Seed local state once when the page first loads.
  useEffect(() => {
    if (!page || hydrated) return;
    setTitle(page.title);
    setSlug(page.slug);
    setMetaTitle(page.metaTitle ?? "");
    setMetaDesc(page.metaDesc ?? "");
    setBlocks(parseBlocks(page.blocks));
    setHydrated(true);
  }, [page, hydrated]);

  useEffect(() => {
    if (error) toast.error(`Failed to load: ${error.message}`);
  }, [error]);

  const selectedBlock = useMemo(
    () => blocks.find((b) => b.id === selectedId) ?? null,
    [blocks, selectedId],
  );
  const selectedDef = selectedBlock
    ? BLOCK_REGISTRY[selectedBlock.type]
    : null;

  // ---- Mutations ----
  const [updatePage, { loading: saving }] = useMutation<UpdatePageData>(
    UPDATE_PAGE,
    {
      onCompleted: () => toast.success("Page saved"),
      onError: (err) => toast.error(`Save failed: ${err.message}`),
    },
  );

  const [setPageStatus, { loading: statusSaving }] =
    useMutation<SetPageStatusData>(SET_PAGE_STATUS, {
      onCompleted: (res) =>
        toast.success(`Status → ${PAGE_STATUS_LABEL[res.setPageStatus.status]}`),
      onError: (err) => toast.error(`Failed: ${err.message}`),
    });

  // ---- Block operations ----
  function addBlock(type: string) {
    const def = BLOCK_REGISTRY[type];
    if (!def) return;
    const id = newBlockId();
    setBlocks((prev) => [
      ...prev,
      {
        id,
        type,
        variant: def.defaultVariant,
        props: def.defaults(),
        visible: true,
      },
    ]);
    setSelectedId(id);
  }

  function changeSelectedVariant(variantKey: string) {
    if (!selectedId) return;
    setBlocks((prev) =>
      prev.map((b) =>
        b.id === selectedId ? { ...b, variant: variantKey } : b,
      ),
    );
  }

  function moveBlock(idx: number, dir: -1 | 1) {
    setBlocks((prev) => {
      const next = [...prev];
      const target = idx + dir;
      if (target < 0 || target >= next.length) return prev;
      [next[idx], next[target]] = [next[target], next[idx]];
      return next;
    });
  }

  function removeBlock(id: string) {
    setBlocks((prev) => prev.filter((b) => b.id !== id));
    if (selectedId === id) setSelectedId(null);
  }

  function toggleVisibility(id: string) {
    setBlocks((prev) =>
      prev.map((b) =>
        b.id === id ? { ...b, visible: !b.visible } : b,
      ),
    );
  }

  function patchSelectedProps(nextProps: Record<string, unknown>) {
    if (!selectedId) return;
    setBlocks((prev) =>
      prev.map((b) =>
        b.id === selectedId ? { ...b, props: nextProps } : b,
      ),
    );
  }

  // ---- Save ----
  async function save() {
    await updatePage({
      variables: {
        updatePageInput: {
          id: pageId,
          title,
          slug,
          metaTitle: metaTitle || undefined,
          metaDesc: metaDesc || undefined,
          blocks: serializeBlocks(blocks),
        },
      },
    });
  }

  async function changeStatus(status: PageStatus) {
    await setPageStatus({
      variables: { setPageStatusInput: { id: pageId, status } },
    });
  }

  if (loading || !hydrated || !page) {
    return (
      <div className="space-y-3">
        <div className="h-8 w-64 bg-muted animate-pulse rounded" />
        <div className="h-96 w-full bg-muted animate-pulse rounded" />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Top bar */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <Button asChild variant="ghost" size="sm" className="-ml-2">
            <Link href="/admin/pages">
              <ChevronLeft className="mr-1 h-4 w-4" />
              All pages
            </Link>
          </Button>
          <div className="flex items-center gap-2 mt-1 flex-wrap">
            <h1 className="text-xl font-bold">{title || "Untitled page"}</h1>
            <Badge variant={STATUS_VARIANT[page.status]} className="text-xs">
              {PAGE_STATUS_LABEL[page.status]}
            </Badge>
            {page.isSystem && (
              <Badge variant="outline" className="text-xs">
                System
              </Badge>
            )}
            {page.status === "PUBLISHED" && (
              <Button asChild variant="outline" size="sm">
                <Link href={`/${slug}`} target="_blank" rel="noopener noreferrer">
                  <ExternalLink className="mr-1 h-3 w-3" />
                  View
                </Link>
              </Button>
            )}
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Select
            value={page.status}
            onValueChange={(v) => changeStatus(v as PageStatus)}
            disabled={statusSaving}
          >
            <SelectTrigger className="w-32 h-9">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="DRAFT">Draft</SelectItem>
              <SelectItem value="PUBLISHED">Published</SelectItem>
              <SelectItem value="ARCHIVED">Archived</SelectItem>
            </SelectContent>
          </Select>
          <Button onClick={save} disabled={saving}>
            {saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            <Save className="mr-2 h-4 w-4" />
            Save
          </Button>
        </div>
      </div>

      {/* Page meta */}
      <Card>
        <CardContent className="py-4 grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="page-title" className="text-xs">
              Title
            </Label>
            <Input
              id="page-title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>
          <div>
            <Label htmlFor="page-slug" className="text-xs">
              Slug
            </Label>
            <div className="flex rounded-md border overflow-hidden focus-within:ring-1 focus-within:ring-ring">
              <span className="flex items-center px-3 bg-muted text-muted-foreground text-sm border-r select-none">
                /
              </span>
              <input
                id="page-slug"
                className="flex-1 bg-transparent px-3 py-2 text-sm outline-none"
                value={slug}
                onChange={(e) => setSlug(e.target.value)}
              />
            </div>
          </div>
          <div>
            <Label htmlFor="page-meta-title" className="text-xs">
              SEO title (optional)
            </Label>
            <Input
              id="page-meta-title"
              value={metaTitle}
              onChange={(e) => setMetaTitle(e.target.value)}
              placeholder={`Defaults to: ${title}`}
            />
          </div>
          <div>
            <Label htmlFor="page-meta-desc" className="text-xs">
              SEO description (optional)
            </Label>
            <Input
              id="page-meta-desc"
              value={metaDesc}
              onChange={(e) => setMetaDesc(e.target.value)}
              placeholder="Shown by Google in the search snippet"
            />
          </div>
        </CardContent>
      </Card>

      {/* 3-pane editor */}
      <div className="grid grid-cols-1 lg:grid-cols-[220px_1fr_360px] gap-4">
        {/* Block picker */}
        <Card>
          <CardContent className="py-4 space-y-2">
            <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2">
              Add block
            </h3>
            {BLOCK_TYPES_ORDER.map((type) => {
              const def = BLOCK_REGISTRY[type];
              if (!def) return null;
              const Icon = def.meta.icon;
              return (
                <button
                  key={type}
                  type="button"
                  onClick={() => addBlock(type)}
                  className="w-full flex items-center gap-2 rounded-md border bg-background px-3 py-2 text-sm hover:bg-muted/30 transition text-left"
                >
                  <Icon className="h-4 w-4 text-muted-foreground shrink-0" />
                  <span className="flex-1 min-w-0">
                    <span className="block font-medium">{def.meta.label}</span>
                    <span className="block text-xs text-muted-foreground line-clamp-1">
                      {def.meta.description}
                    </span>
                  </span>
                </button>
              );
            })}
          </CardContent>
        </Card>

        {/* Center: block stack */}
        <Card className="min-h-[400px]">
          <CardContent className="py-4 space-y-2">
            <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2">
              Page blocks ({blocks.length})
            </h3>
            {blocks.length === 0 && (
              <div className="rounded-md border border-dashed py-12 text-center text-sm text-muted-foreground">
                No blocks yet. Pick one from the left to get started.
              </div>
            )}
            {blocks.map((block, idx) => {
              const def = BLOCK_REGISTRY[block.type];
              const isSelected = selectedId === block.id;
              const Icon = def?.meta.icon;
              return (
                <div
                  key={block.id}
                  className={`rounded-md border bg-background transition cursor-pointer ${
                    isSelected
                      ? "border-primary ring-1 ring-primary"
                      : "hover:border-foreground/30"
                  } ${block.visible === false ? "opacity-50" : ""}`}
                  onClick={() => setSelectedId(block.id)}
                >
                  <div className="flex items-center gap-2 px-3 py-2">
                    {Icon && (
                      <Icon className="h-4 w-4 text-muted-foreground shrink-0" />
                    )}
                    <span className="flex-1 min-w-0 text-sm font-medium truncate">
                      {def?.meta.label ?? `Unknown: ${block.type}`}
                    </span>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="h-7 w-7"
                      onClick={(e) => {
                        e.stopPropagation();
                        moveBlock(idx, -1);
                      }}
                      disabled={idx === 0}
                      title="Move up"
                    >
                      <ArrowUp className="h-3 w-3" />
                    </Button>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="h-7 w-7"
                      onClick={(e) => {
                        e.stopPropagation();
                        moveBlock(idx, 1);
                      }}
                      disabled={idx === blocks.length - 1}
                      title="Move down"
                    >
                      <ArrowDown className="h-3 w-3" />
                    </Button>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="h-7 w-7"
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleVisibility(block.id);
                      }}
                      title={block.visible === false ? "Show" : "Hide"}
                    >
                      {block.visible === false ? (
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
                        removeBlock(block.id);
                      }}
                      title="Remove"
                    >
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
              );
            })}
          </CardContent>
        </Card>

        {/* Right: settings panel */}
        <Card>
          <CardContent className="py-4 space-y-3">
            <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2">
              Block settings
            </h3>
            {!selectedBlock && (
              <p className="text-sm text-muted-foreground italic">
                Select a block from the center panel to edit its settings.
              </p>
            )}
            {selectedBlock && selectedDef && (
              <>
                <div className="text-sm font-semibold">
                  {selectedDef.meta.label}
                </div>

                {/* Layout picker — only shown if the block has 2+ variants.
                    Switching layouts is lossless (props are shared). */}
                {Object.keys(selectedDef.variants).length > 1 && (
                  <div className="space-y-2 rounded-md border bg-muted/20 p-3">
                    <Label className="text-xs">Layout</Label>
                    <div className="space-y-1.5">
                      {Object.entries(selectedDef.variants).map(
                        ([key, variant]) => {
                          const active =
                            (selectedBlock.variant ??
                              selectedDef.defaultVariant) === key;
                          return (
                            <label
                              key={key}
                              className={`flex items-start gap-2 rounded-md border px-3 py-2 cursor-pointer transition ${
                                active
                                  ? "border-primary bg-primary/5"
                                  : "border-border hover:border-foreground/30 bg-background"
                              }`}
                            >
                              <input
                                type="radio"
                                name={`variant-${selectedBlock.id}`}
                                checked={active}
                                onChange={() => changeSelectedVariant(key)}
                                className="mt-0.5 h-4 w-4 shrink-0"
                              />
                              <span className="flex-1 min-w-0">
                                <span className="block text-sm font-medium">
                                  {variant.label}
                                </span>
                                {variant.description && (
                                  <span className="block text-xs text-muted-foreground">
                                    {variant.description}
                                  </span>
                                )}
                              </span>
                            </label>
                          );
                        },
                      )}
                    </div>
                  </div>
                )}

                {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                {(() => {
                  const Editor = selectedDef.Editor as any;
                  return (
                    <Editor
                      props={selectedBlock.props}
                      onChange={patchSelectedProps}
                      variant={selectedBlock.variant ?? selectedDef.defaultVariant}
                    />
                  );
                })()}
              </>
            )}
            {selectedBlock && !selectedDef && (
              <p className="text-sm text-destructive">
                This block&apos;s type ({selectedBlock.type}) isn&apos;t
                registered. Old block from a previous version?
              </p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
