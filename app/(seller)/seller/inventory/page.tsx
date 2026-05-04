/**
 * Seller Inventory Dashboard — /seller/inventory
 *
 * Cross-product inventory view: every variant × warehouse the seller owns,
 * with available / reserved / on-hand columns and a derived stock state pill.
 * Click "Adjust" → opens modal to record a stock movement (purchase, recount,
 * damage, etc.). The same modal handles reorder-point edits.
 *
 * Phase 1 hides the warehouse selector when the seller only has one (which
 * is the default after store creation).
 */

"use client";

import { useEffect, useMemo, useState } from "react";
import { useMutation, useQuery } from "@apollo/client/react";
import { toast } from "sonner";
import {
  Boxes,
  ChevronDown,
  ChevronRight,
  Loader2,
  Pencil,
  Search,
  Settings2,
  TrendingDown,
  TrendingUp,
} from "lucide-react";

import {
  GET_MY_INVENTORY,
  SET_MY_REORDER_POINT,
} from "@/lib/graphql/inventory";
import {
  Inventory,
  MyInventoryData,
  SetMyReorderPointData,
  STOCK_STATE_LABEL,
  StockState,
} from "@/types/inventory.types";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { AdjustInventoryDialog } from "@/components/inventory/adjust-inventory-dialog";
import { useSetPageTitle } from "@/components/shell/page-title-context";

const STOCK_STATE_VARIANT: Record<
  StockState,
  "default" | "secondary" | "destructive" | "outline"
> = {
  IN_STOCK: "default",
  LOW_STOCK: "secondary",
  OUT_OF_STOCK: "destructive",
};

/**
 * Worst-state wins: OUT_OF_STOCK beats LOW_STOCK beats IN_STOCK. Used on
 * group rows so a seller spots problems without expanding the group.
 */
const STATE_SEVERITY: Record<StockState, number> = {
  IN_STOCK: 0,
  LOW_STOCK: 1,
  OUT_OF_STOCK: 2,
};

interface InventoryGroup {
  key: string;
  productId: string | null;
  productName: string;
  productSlug: string | null;
  imageUrl: string | null;
  rows: Inventory[];
  totalOnHand: number;
  totalReserved: number;
  totalAvailable: number;
  worstState: StockState;
  outCount: number;
  lowCount: number;
}

export default function SellerInventoryPage() {
  useSetPageTitle("Inventory");

  const [search, setSearch] = useState("");
  const [lowStockOnly, setLowStockOnly] = useState(false);
  const [adjustTarget, setAdjustTarget] = useState<Inventory | null>(null);
  const [reorderTarget, setReorderTarget] = useState<Inventory | null>(null);

  const { data, loading, error, refetch } = useQuery<MyInventoryData>(
    GET_MY_INVENTORY,
    {
      variables: { lowStockOnly: lowStockOnly || null },
      fetchPolicy: "cache-and-network",
    },
  );

  useEffect(() => {
    if (error) toast.error(`Failed to load: ${error.message}`);
  }, [error]);

  const all = data?.myInventory ?? [];
  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return all;
    return all.filter((row) => {
      const product = row.product?.name ?? "";
      const sku = row.variant?.sku ?? "";
      return (
        product.toLowerCase().includes(q) || sku.toLowerCase().includes(q)
      );
    });
  }, [all, search]);

  const totals = useMemo(() => {
    const t = {
      variants: all.length,
      onHand: 0,
      lowStock: 0,
      outOfStock: 0,
    };
    for (const r of all) {
      t.onHand += r.quantityOnHand;
      if (r.stockState === "LOW_STOCK") t.lowStock += 1;
      if (r.stockState === "OUT_OF_STOCK") t.outOfStock += 1;
    }
    return t;
  }, [all]);

  // Group by parent product so the table shows "1 Samsung S24" instead of 12
  // separate rows. Single-variant products (typical SIMPLE products) skip the
  // group treatment and render flat.
  const groups: InventoryGroup[] = useMemo(() => {
    const map = new Map<string, InventoryGroup>();
    for (const row of filtered) {
      const productId = row.product?.id ?? null;
      const key = productId ?? `__variant_${row.variantId}`;
      let g = map.get(key);
      if (!g) {
        g = {
          key,
          productId,
          productName: row.product?.name ?? row.variant?.sku ?? "—",
          productSlug: row.product?.slug ?? null,
          imageUrl: row.variant?.imageUrl ?? null,
          rows: [],
          totalOnHand: 0,
          totalReserved: 0,
          totalAvailable: 0,
          worstState: "IN_STOCK",
          outCount: 0,
          lowCount: 0,
        };
        map.set(key, g);
      }
      g.rows.push(row);
      g.totalOnHand += row.quantityOnHand;
      g.totalReserved += row.quantityReserved;
      g.totalAvailable += row.quantityAvailable;
      if (row.stockState === "OUT_OF_STOCK") g.outCount += 1;
      if (row.stockState === "LOW_STOCK") g.lowCount += 1;
      if (
        STATE_SEVERITY[row.stockState] > STATE_SEVERITY[g.worstState]
      ) {
        g.worstState = row.stockState;
      }
      // Surface the first available image as a thumbnail for the group.
      if (!g.imageUrl && row.variant?.imageUrl) {
        g.imageUrl = row.variant.imageUrl;
      }
    }
    return Array.from(map.values());
  }, [filtered]);

  const [expandedKeys, setExpandedKeys] = useState<Set<string>>(new Set());

  // Auto-expand any group when an active search/low-stock filter narrows the
  // view — sellers want to see the matched variant immediately.
  useEffect(() => {
    if (search.trim() || lowStockOnly) {
      setExpandedKeys(new Set(groups.map((g) => g.key)));
    }
  }, [search, lowStockOnly, groups]);

  function toggleGroup(key: string) {
    setExpandedKeys((prev) => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      return next;
    });
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight flex items-center gap-2">
          <Boxes className="h-6 w-6 text-primary" />
          Inventory
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          Stock per variant. Adjust quantities, set reorder thresholds, and
          spot anything running low.
        </p>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <SummaryCard label="Variants tracked" value={totals.variants} />
        <SummaryCard label="On-hand units" value={totals.onHand} mono />
        <SummaryCard
          label="Low stock"
          value={totals.lowStock}
          tone={totals.lowStock > 0 ? "warn" : undefined}
        />
        <SummaryCard
          label="Out of stock"
          value={totals.outOfStock}
          tone={totals.outOfStock > 0 ? "danger" : undefined}
        />
      </div>

      {/* Filters */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative w-full sm:max-w-xs">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search product or SKU..."
            className="pl-9"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <Button
          variant={lowStockOnly ? "default" : "outline"}
          size="sm"
          onClick={() => setLowStockOnly((v) => !v)}
        >
          <TrendingDown className="mr-2 h-4 w-4" />
          {lowStockOnly ? "Showing low-stock only" : "Low stock only"}
        </Button>
      </div>

      {/* Table */}
      <div className="rounded-lg border bg-card shadow-sm min-h-[300px]">
        {loading && (
          <div className="space-y-3 p-4">
            {Array.from({ length: 5 }).map((_, i) => (
              <div
                key={i}
                className="h-14 w-full animate-pulse rounded-md bg-muted"
              />
            ))}
          </div>
        )}

        {!loading && groups.length === 0 && (
          <div className="flex h-32 items-center justify-center text-muted-foreground">
            {search
              ? `No matches for "${search}"`
              : lowStockOnly
                ? "Nothing running low. Nice."
                : "No inventory yet — list a product to get started."}
          </div>
        )}

        {!loading && groups.length > 0 && (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="text-xs uppercase text-muted-foreground border-b">
                <tr>
                  <th className="px-4 py-3 text-left font-medium">Product / SKU</th>
                  <th className="px-3 py-3 text-left font-medium hidden md:table-cell">
                    Warehouse
                  </th>
                  <th className="px-3 py-3 text-right font-medium">On hand</th>
                  <th className="px-3 py-3 text-right font-medium">Reserved</th>
                  <th className="px-3 py-3 text-right font-medium">Available</th>
                  <th className="px-3 py-3 text-right font-medium hidden lg:table-cell">
                    Reorder pt
                  </th>
                  <th className="px-3 py-3 text-center font-medium">Status</th>
                  <th className="px-3 py-3 text-right font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {groups.map((group) => {
                  // Single-variant groups (SIMPLE products) render flat — no
                  // chevron, no aggregate row.
                  if (group.rows.length === 1) {
                    const row = group.rows[0];
                    return (
                      <InventoryRow
                        key={row.id}
                        row={row}
                        onAdjust={() => setAdjustTarget(row)}
                        onReorder={() => setReorderTarget(row)}
                      />
                    );
                  }
                  const isOpen = expandedKeys.has(group.key);
                  return (
                    <GroupRows
                      key={group.key}
                      group={group}
                      isOpen={isOpen}
                      onToggle={() => toggleGroup(group.key)}
                      onAdjust={(r) => setAdjustTarget(r)}
                      onReorder={(r) => setReorderTarget(r)}
                    />
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <AdjustInventoryDialog
        open={!!adjustTarget}
        row={adjustTarget}
        onClose={() => setAdjustTarget(null)}
        onDone={() => {
          setAdjustTarget(null);
          void refetch();
        }}
      />

      <ReorderDialog
        open={!!reorderTarget}
        row={reorderTarget}
        onClose={() => setReorderTarget(null)}
        onDone={() => {
          setReorderTarget(null);
          void refetch();
        }}
      />
    </div>
  );
}

// ===========================================================================
// Row + summary subcomponents
// ===========================================================================

function SummaryCard({
  label,
  value,
  mono,
  tone,
}: {
  label: string;
  value: number;
  mono?: boolean;
  tone?: "warn" | "danger";
}) {
  const valueClass =
    tone === "danger"
      ? "text-destructive"
      : tone === "warn"
        ? "text-amber-600 dark:text-amber-400"
        : "";
  return (
    <Card>
      <CardContent className="py-4">
        <div className="text-xs text-muted-foreground uppercase tracking-wide">
          {label}
        </div>
        <div
          className={`text-2xl font-bold mt-1 ${mono ? "font-mono" : ""} ${valueClass}`}
        >
          {value.toLocaleString("en-IN")}
        </div>
      </CardContent>
    </Card>
  );
}

function InventoryRow({
  row,
  onAdjust,
  onReorder,
}: {
  row: Inventory;
  onAdjust: () => void;
  onReorder: () => void;
}) {
  const product = row.product;
  const attrSummary =
    row.variant?.attributes?.map((a) => `${a.attributeName}: ${a.value}`).join(" / ") ||
    "Default";

  return (
    <tr className="border-b last:border-b-0 hover:bg-muted/30 transition-colors">
      <td className="px-4 py-3">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-md bg-muted flex items-center justify-center overflow-hidden shrink-0">
            {row.variant?.imageUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={row.variant.imageUrl}
                alt=""
                className="h-full w-full object-cover"
              />
            ) : (
              <Boxes className="h-4 w-4 text-muted-foreground" />
            )}
          </div>
          <div className="min-w-0">
            <div className="font-medium truncate">
              {product?.name ?? "—"}
            </div>
            <div className="text-xs text-muted-foreground font-mono truncate">
              {row.variant?.sku} · {attrSummary}
            </div>
          </div>
        </div>
      </td>
      <td className="px-3 py-3 hidden md:table-cell text-muted-foreground">
        {row.warehouse?.name}
      </td>
      <td className="px-3 py-3 text-right font-mono">{row.quantityOnHand}</td>
      <td className="px-3 py-3 text-right font-mono text-muted-foreground">
        {row.quantityReserved}
      </td>
      <td className="px-3 py-3 text-right font-mono font-semibold">
        {row.quantityAvailable}
      </td>
      <td className="px-3 py-3 text-right font-mono text-xs hidden lg:table-cell text-muted-foreground">
        {row.reorderPoint > 0 ? row.reorderPoint : "—"}
      </td>
      <td className="px-3 py-3 text-center">
        <Badge
          variant={STOCK_STATE_VARIANT[row.stockState]}
          className="text-[10px]"
        >
          {STOCK_STATE_LABEL[row.stockState]}
        </Badge>
      </td>
      <td className="px-3 py-3 text-right">
        <div className="flex items-center justify-end gap-1">
          <Button
            variant="ghost"
            size="icon"
            title="Adjust stock"
            className="h-8 w-8"
            onClick={onAdjust}
          >
            <TrendingUp className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            title="Reorder threshold"
            className="h-8 w-8"
            onClick={onReorder}
          >
            <Settings2 className="h-4 w-4" />
          </Button>
        </div>
      </td>
    </tr>
  );
}

// ===========================================================================
// Group row — collapsed product header + expanded variant rows
// ===========================================================================

function GroupRows({
  group,
  isOpen,
  onToggle,
  onAdjust,
  onReorder,
}: {
  group: InventoryGroup;
  isOpen: boolean;
  onToggle: () => void;
  onAdjust: (row: Inventory) => void;
  onReorder: (row: Inventory) => void;
}) {
  return (
    <>
      {/* Aggregate header row */}
      <tr
        className="border-b last:border-b-0 hover:bg-muted/30 transition-colors cursor-pointer bg-muted/10"
        onClick={onToggle}
      >
        <td className="px-4 py-3">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onToggle();
              }}
              className="text-muted-foreground hover:text-foreground shrink-0"
              aria-label={isOpen ? "Collapse" : "Expand"}
            >
              {isOpen ? (
                <ChevronDown className="h-4 w-4" />
              ) : (
                <ChevronRight className="h-4 w-4" />
              )}
            </button>
            <div className="h-10 w-10 rounded-md bg-muted flex items-center justify-center overflow-hidden shrink-0">
              {group.imageUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={group.imageUrl}
                  alt=""
                  className="h-full w-full object-cover"
                />
              ) : (
                <Boxes className="h-4 w-4 text-muted-foreground" />
              )}
            </div>
            <div className="min-w-0">
              <div className="font-semibold truncate">{group.productName}</div>
              <div className="text-xs text-muted-foreground">
                {group.rows.length} variants
                {group.outCount > 0 && (
                  <>
                    {" · "}
                    <span className="text-destructive">
                      {group.outCount} out
                    </span>
                  </>
                )}
                {group.lowCount > 0 && (
                  <>
                    {" · "}
                    <span className="text-amber-600 dark:text-amber-400">
                      {group.lowCount} low
                    </span>
                  </>
                )}
              </div>
            </div>
          </div>
        </td>
        <td className="px-3 py-3 hidden md:table-cell text-muted-foreground">
          —
        </td>
        <td className="px-3 py-3 text-right font-mono">{group.totalOnHand}</td>
        <td className="px-3 py-3 text-right font-mono text-muted-foreground">
          {group.totalReserved}
        </td>
        <td className="px-3 py-3 text-right font-mono font-semibold">
          {group.totalAvailable}
        </td>
        <td className="px-3 py-3 text-right font-mono text-xs hidden lg:table-cell text-muted-foreground">
          —
        </td>
        <td className="px-3 py-3 text-center">
          <Badge
            variant={STOCK_STATE_VARIANT[group.worstState]}
            className="text-[10px]"
          >
            {STOCK_STATE_LABEL[group.worstState]}
          </Badge>
        </td>
        <td className="px-3 py-3 text-right">
          <span className="text-xs text-muted-foreground">
            {isOpen ? "Hide" : "Show"}
          </span>
        </td>
      </tr>

      {/* Expanded variant rows */}
      {isOpen &&
        group.rows.map((row) => (
          <tr
            key={row.id}
            className="border-b last:border-b-0 hover:bg-muted/30 transition-colors"
          >
            <td className="px-4 py-2 pl-12">
              <div className="flex items-center gap-3">
                <div className="h-8 w-8 rounded-md bg-muted flex items-center justify-center overflow-hidden shrink-0">
                  {row.variant?.imageUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={row.variant.imageUrl}
                      alt=""
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <Boxes className="h-3 w-3 text-muted-foreground" />
                  )}
                </div>
                <div className="min-w-0">
                  <div className="text-xs text-muted-foreground font-mono truncate">
                    {row.variant?.sku}
                  </div>
                  <div className="text-xs text-muted-foreground truncate">
                    {row.variant?.attributes
                      ?.map((a) => `${a.attributeName}: ${a.value}`)
                      .join(" / ") || "Default"}
                  </div>
                </div>
              </div>
            </td>
            <td className="px-3 py-2 hidden md:table-cell text-muted-foreground text-xs">
              {row.warehouse?.name}
            </td>
            <td className="px-3 py-2 text-right font-mono text-sm">
              {row.quantityOnHand}
            </td>
            <td className="px-3 py-2 text-right font-mono text-sm text-muted-foreground">
              {row.quantityReserved}
            </td>
            <td className="px-3 py-2 text-right font-mono font-semibold text-sm">
              {row.quantityAvailable}
            </td>
            <td className="px-3 py-2 text-right font-mono text-xs hidden lg:table-cell text-muted-foreground">
              {row.reorderPoint > 0 ? row.reorderPoint : "—"}
            </td>
            <td className="px-3 py-2 text-center">
              <Badge
                variant={STOCK_STATE_VARIANT[row.stockState]}
                className="text-[10px]"
              >
                {STOCK_STATE_LABEL[row.stockState]}
              </Badge>
            </td>
            <td className="px-3 py-2 text-right">
              <div className="flex items-center justify-end gap-1">
                <Button
                  variant="ghost"
                  size="icon"
                  title="Adjust stock"
                  className="h-7 w-7"
                  onClick={() => onAdjust(row)}
                >
                  <TrendingUp className="h-3 w-3" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  title="Reorder threshold"
                  className="h-7 w-7"
                  onClick={() => onReorder(row)}
                >
                  <Settings2 className="h-3 w-3" />
                </Button>
              </div>
            </td>
          </tr>
        ))}
    </>
  );
}

// ===========================================================================
// Reorder threshold modal
// ===========================================================================

function ReorderDialog({
  open,
  row,
  onClose,
  onDone,
}: {
  open: boolean;
  row: Inventory | null;
  onClose: () => void;
  onDone: () => void;
}) {
  const [reorderPoint, setReorderPoint] = useState<string>("");
  const [reorderQuantity, setReorderQuantity] = useState<string>("");

  useEffect(() => {
    if (open && row) {
      setReorderPoint(String(row.reorderPoint));
      setReorderQuantity(String(row.reorderQuantity));
    }
  }, [open, row]);

  const [setReorder, { loading }] = useMutation<SetMyReorderPointData>(
    SET_MY_REORDER_POINT,
    {
      onCompleted: () => {
        toast.success("Reorder threshold saved");
        onDone();
      },
      onError: (err) => toast.error(`Failed: ${err.message}`),
    },
  );

  if (!row) return null;

  async function submit() {
    if (!row) return;
    await setReorder({
      variables: {
        setReorderPointInput: {
          variantId: row.variantId,
          warehouseId: row.warehouseId,
          reorderPoint: Math.max(0, Number(reorderPoint) || 0),
          reorderQuantity:
            reorderQuantity === ""
              ? undefined
              : Math.max(0, Number(reorderQuantity)),
        },
      },
    });
  }

  return (
    <Dialog open={open} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Pencil className="h-4 w-4" />
            Reorder threshold
          </DialogTitle>
          <DialogDescription>
            Triggers a &quot;low stock&quot; flag when available quantity drops
            to this level.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-3">
          <div>
            <Label htmlFor="rp">Reorder point</Label>
            <Input
              id="rp"
              type="number"
              min={0}
              value={reorderPoint}
              onChange={(e) => setReorderPoint(e.target.value)}
            />
            <p className="text-xs text-muted-foreground mt-1">
              0 disables the alert.
            </p>
          </div>
          <div>
            <Label htmlFor="rq">Reorder quantity (optional)</Label>
            <Input
              id="rq"
              type="number"
              min={0}
              placeholder="Suggested re-order size"
              value={reorderQuantity}
              onChange={(e) => setReorderQuantity(e.target.value)}
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={submit} disabled={loading}>
            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Save
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
