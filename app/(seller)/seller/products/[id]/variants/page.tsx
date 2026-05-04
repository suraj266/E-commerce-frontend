/**
 * Variants management — /seller/products/[id]/variants
 *
 * Layout:
 *   1. Axes picker — choose attributes (Color, Size) from registry; lock
 *      once variants exist
 *   2. Matrix generator — pick values per axis + base price → cartesian
 *      product creates all combinations server-side (skips existing)
 *   3. Variants table — inline edit SKU/price/status, drag-reorder, delete
 *   4. Bulk apply — set price for filtered subset (e.g. all "Red")
 */

"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useMutation, useQuery } from "@apollo/client/react";
import { toast } from "sonner";
import {
  Boxes,
  ChevronLeft,
  Loader2,
  Pencil,
  Save,
  Sparkles,
  Trash2,
  X,
} from "lucide-react";

import { GET_ATTRIBUTES } from "@/lib/graphql/attributes";
import { GET_MY_PRODUCT } from "@/lib/graphql/products";
import {
  BULK_UPDATE_MY_PRODUCT_VARIANTS,
  GENERATE_MY_PRODUCT_VARIANT_MATRIX,
  GET_MY_PRODUCT_VARIANTS,
  GET_MY_PRODUCT_VARIANT_AXES,
  REMOVE_MY_PRODUCT_VARIANT,
  SET_MY_PRODUCT_VARIANT_AXES,
  UPDATE_MY_PRODUCT_VARIANT,
} from "@/lib/graphql/products";
import { GET_MY_INVENTORY } from "@/lib/graphql/inventory";

import {
  GetMyProductData,
  GetMyProductVariantAxesData,
  GetMyProductVariantsData,
  ProductVariant,
  VARIANT_STATUS_LABEL,
  VARIANT_STATUSES,
  VariantStatus,
} from "@/types/product.types";
import {
  Inventory,
  MyInventoryData,
  STOCK_STATE_LABEL,
  StockState,
} from "@/types/inventory.types";
import { ProductAttribute } from "@/types/attribute.types";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { useSetPageTitle } from "@/components/shell/page-title-context";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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
import { ImageUploader } from "@/components/media/image-uploader";
import { AdjustInventoryDialog } from "@/components/inventory/adjust-inventory-dialog";

const STATUS_VARIANT: Record<
  VariantStatus,
  "default" | "secondary" | "destructive" | "outline"
> = {
  ACTIVE: "default",
  INACTIVE: "secondary",
  OUT_OF_STOCK: "outline",
};

export default function VariantsPage() {
  const params = useParams<{ id: string }>();
  const productId = params.id;

  const { data: productData } = useQuery<GetMyProductData>(GET_MY_PRODUCT, {
    variables: { id: productId },
    fetchPolicy: "cache-and-network",
  });
  const product = productData?.myProduct;

  const { data: axesData, loading: axesLoading } =
    useQuery<GetMyProductVariantAxesData>(GET_MY_PRODUCT_VARIANT_AXES, {
      variables: { productId },
      fetchPolicy: "cache-and-network",
    });
  const axes = axesData?.myProductVariantAxes ?? [];

  const { data: variantsData, loading: variantsLoading } =
    useQuery<GetMyProductVariantsData>(GET_MY_PRODUCT_VARIANTS, {
      variables: { productId },
      fetchPolicy: "cache-and-network",
    });
  const variants = variantsData?.myProductVariants ?? [];

  // Inventory rows for this product's variants — one row per variant at the
  // store's default warehouse (Phase 1 single-warehouse UX). Keyed by variantId
  // for O(1) lookup in the table.
  const { data: inventoryData, refetch: refetchInventory } =
    useQuery<MyInventoryData>(GET_MY_INVENTORY, {
      variables: { productId },
      fetchPolicy: "cache-and-network",
      skip: variants.length === 0,
    });
  const inventoryByVariant = useMemo(() => {
    const map = new Map<string, Inventory>();
    for (const r of inventoryData?.myInventory ?? []) {
      map.set(r.variantId, r);
    }
    return map;
  }, [inventoryData]);

  // All available attributes (only isVariantAttribute=true)
  const { data: attributesData } = useQuery<{ attributes: ProductAttribute[] }>(
    GET_ATTRIBUTES,
    { variables: { variantOnly: true }, fetchPolicy: "cache-first" },
  );
  const variantAttributes = attributesData?.attributes ?? [];

  useSetPageTitle("Variants");

  if (!product) {
    return <div className="h-96 animate-pulse rounded-lg bg-muted" />;
  }

  if (product.productType !== "VARIABLE") {
    return (
      <Card>
        <CardContent className="py-12 text-center space-y-3">
          <Boxes className="h-12 w-12 mx-auto text-muted-foreground/50" />
          <h2 className="font-semibold">Not a variable product</h2>
          <p className="text-sm text-muted-foreground">
            Variants are only available for VARIABLE products. This one is{" "}
            {product.productType}.
          </p>
          <Button asChild variant="outline">
            <Link href={`/seller/products/${productId}`}>Back to product</Link>
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Button variant="ghost" size="sm" asChild>
        <Link href={`/seller/products/${productId}`}>
          <ChevronLeft className="mr-1 h-4 w-4" />
          Back to product
        </Link>
      </Button>

      <div>
        <h1 className="text-2xl font-bold tracking-tight flex items-center gap-2">
          <Boxes className="h-6 w-6 text-primary" />
          Variants — {product.name}
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          Configure the axes (Color, Size, etc.) and generate variant
          combinations.
        </p>
      </div>

      <AxesPicker
        productId={productId}
        axes={axes}
        availableAttributes={variantAttributes}
        loading={axesLoading}
        hasVariants={variants.length > 0}
      />

      {axes.length > 0 && (
        <MatrixGenerator productId={productId} axes={axes} />
      )}

      <VariantsTable
        productId={productId}
        variants={variants}
        loading={variantsLoading}
        inventoryByVariant={inventoryByVariant}
        onInventoryChanged={() => void refetchInventory()}
      />

      {variants.length > 0 && axes.length > 0 && (
        <BulkApply productId={productId} axes={axes} />
      )}
    </div>
  );
}

// ===========================================================================
// 1. Axes picker
// ===========================================================================
function AxesPicker({
  productId,
  axes,
  availableAttributes,
  loading,
  hasVariants,
}: {
  productId: string;
  axes: GetMyProductVariantAxesData["myProductVariantAxes"];
  availableAttributes: ProductAttribute[];
  loading: boolean;
  hasVariants: boolean;
}) {
  const [setAxes, { loading: saving }] = useMutation(
    SET_MY_PRODUCT_VARIANT_AXES,
    {
      refetchQueries: [{ query: GET_MY_PRODUCT_VARIANT_AXES, variables: { productId } }],
      onCompleted: () => toast.success("Axes saved"),
      onError: (err) => toast.error(`Failed: ${err.message}`),
    },
  );

  const selectedIds = axes.map((a) => a.attributeId);
  const [draftIds, setDraftIds] = useState<string[]>(selectedIds);

  // Sync draft when axes change externally
  useEffect(() => {
    setDraftIds(selectedIds);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [JSON.stringify(selectedIds)]);

  function toggleAxis(attrId: string) {
    if (draftIds.includes(attrId)) {
      setDraftIds(draftIds.filter((id) => id !== attrId));
    } else {
      if (draftIds.length >= 4) {
        toast.error("Maximum 4 axes per product");
        return;
      }
      setDraftIds([...draftIds, attrId]);
    }
  }

  const dirty =
    JSON.stringify(draftIds.sort()) !== JSON.stringify([...selectedIds].sort());

  async function save() {
    await setAxes({
      variables: {
        setVariantAxesInput: { productId, attributeIds: draftIds },
      },
    });
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          Variant Axes
          {hasVariants && (
            <Badge variant="outline" className="text-xs">
              Locked — delete variants to change
            </Badge>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {loading ? (
          <div className="h-12 animate-pulse rounded bg-muted" />
        ) : availableAttributes.length === 0 ? (
          <p className="text-sm text-muted-foreground italic">
            No variant attributes in registry. Ask admin to mark attributes as
            &quot;variant&quot; first.
          </p>
        ) : (
          <div className="flex flex-wrap gap-2">
            {availableAttributes.map((attr) => {
              const selected = draftIds.includes(attr.id);
              return (
                <button
                  key={attr.id}
                  type="button"
                  disabled={hasVariants}
                  onClick={() => toggleAxis(attr.id)}
                  className={`px-3 py-1.5 rounded-md border text-sm transition ${
                    selected
                      ? "bg-primary text-primary-foreground border-primary"
                      : "bg-background text-muted-foreground border-border hover:border-foreground"
                  } ${hasVariants ? "opacity-60 cursor-not-allowed" : ""}`}
                >
                  {attr.name}{" "}
                  <span className="text-xs opacity-60">
                    ({attr.values?.length ?? 0})
                  </span>
                </button>
              );
            })}
          </div>
        )}

        {dirty && !hasVariants && (
          <div className="flex justify-end">
            <Button onClick={save} disabled={saving} size="sm">
              {saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              <Save className="mr-2 h-4 w-4" />
              Save axes
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

// ============================================================================
// 2. Matrix generator
// ============================================================================
function MatrixGenerator({
  productId,
  axes,
}: {
  productId: string;
  axes: GetMyProductVariantAxesData["myProductVariantAxes"];
}) {
  const [selectedValues, setSelectedValues] = useState<
    Record<string, Set<string>>
  >({});
  const [basePrice, setBasePrice] = useState<string>("");
  const [generate, { loading }] = useMutation(
    GENERATE_MY_PRODUCT_VARIANT_MATRIX,
    {
      refetchQueries: [{ query: GET_MY_PRODUCT_VARIANTS, variables: { productId } }],
      onCompleted: () => {
        toast.success("Matrix generated");
        setSelectedValues({});
      },
      onError: (err) => toast.error(`Failed: ${err.message}`),
    },
  );

  function toggleValue(axisId: string, valueId: string) {
    setSelectedValues((prev) => {
      const next = { ...prev };
      const set = new Set(next[axisId] ?? []);
      if (set.has(valueId)) set.delete(valueId);
      else set.add(valueId);
      next[axisId] = set;
      return next;
    });
  }

  const variantCount = axes.reduce(
    (acc, a) => acc * (selectedValues[a.attributeId]?.size ?? 0),
    1,
  );
  const canGenerate =
    variantCount > 0 && variantCount <= 100 && Number(basePrice) >= 0 && basePrice !== "";

  async function run() {
    if (!canGenerate) return;
    await generate({
      variables: {
        generateVariantMatrixInput: {
          productId,
          axes: axes.map((a) => ({
            attributeId: a.attributeId,
            valueIds: Array.from(selectedValues[a.attributeId] ?? []),
          })),
          basePrice: Number(basePrice),
        },
      },
    });
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Sparkles className="h-5 w-5" />
          Generate Matrix
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-xs text-muted-foreground">
          Pick values for each axis. We&apos;ll create one variant per
          combination (skipping any that already exist).
        </p>

        {axes.map((axis) => (
          <div key={axis.attributeId} className="space-y-2">
            <div className="text-sm font-medium">{axis.attributeName}</div>
            <div className="flex flex-wrap gap-2">
              {axis.values.map((v) => {
                const selected = selectedValues[axis.attributeId]?.has(v.id);
                return (
                  <button
                    key={v.id}
                    type="button"
                    onClick={() => toggleValue(axis.attributeId, v.id)}
                    className={`px-3 py-1 rounded-md border text-xs transition ${
                      selected
                        ? "bg-primary text-primary-foreground border-primary"
                        : "bg-background text-muted-foreground border-border hover:border-foreground"
                    }`}
                  >
                    {v.value}
                  </button>
                );
              })}
            </div>
          </div>
        ))}

        <div className="flex items-end gap-3 flex-wrap">
          <div className="flex-1 min-w-[140px]">
            <label className="text-xs font-medium text-muted-foreground">
              Base price for all
            </label>
            <Input
              type="number"
              min={0}
              step={0.01}
              placeholder="999"
              value={basePrice}
              onChange={(e) => setBasePrice(e.target.value)}
            />
          </div>
          <div className="text-sm text-muted-foreground">
            Will create <span className="font-semibold">{variantCount}</span>{" "}
            variants
          </div>
          <Button onClick={run} disabled={!canGenerate || loading}>
            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Generate
          </Button>
        </div>
        {variantCount > 100 && (
          <p className="text-xs text-destructive">
            Limit is 100 — reduce selections.
          </p>
        )}
      </CardContent>
    </Card>
  );
}

// ============================================================================
// 3. Variants table
// ============================================================================
const STOCK_STATE_VARIANT: Record<
  StockState,
  "default" | "secondary" | "destructive" | "outline"
> = {
  IN_STOCK: "default",
  LOW_STOCK: "secondary",
  OUT_OF_STOCK: "destructive",
};

function VariantsTable({
  productId,
  variants,
  loading,
  inventoryByVariant,
  onInventoryChanged,
}: {
  productId: string;
  variants: ProductVariant[];
  loading: boolean;
  inventoryByVariant: Map<string, Inventory>;
  onInventoryChanged: () => void;
}) {
  const [stockTarget, setStockTarget] = useState<Inventory | null>(null);
  const [updateVariant] = useMutation(UPDATE_MY_PRODUCT_VARIANT, {
    refetchQueries: [{ query: GET_MY_PRODUCT_VARIANTS, variables: { productId } }],
    onError: (err) => toast.error(`Update failed: ${err.message}`),
  });
  const [removeVariant, { loading: removing }] = useMutation(
    REMOVE_MY_PRODUCT_VARIANT,
    {
      refetchQueries: [{ query: GET_MY_PRODUCT_VARIANTS, variables: { productId } }],
      onError: (err) => toast.error(`Delete failed: ${err.message}`),
    },
  );

  const [editingId, setEditingId] = useState<string | null>(null);
  const [draftPrice, setDraftPrice] = useState<string>("");
  const [draftSku, setDraftSku] = useState<string>("");
  const [deleting, setDeleting] = useState<ProductVariant | null>(null);

  function startEdit(v: ProductVariant) {
    setEditingId(v.id);
    setDraftPrice(String(v.price));
    setDraftSku(v.sku);
  }

  async function saveEdit(v: ProductVariant) {
    await updateVariant({
      variables: {
        updateVariantInput: {
          id: v.id,
          price: Number(draftPrice),
          sku: draftSku !== v.sku ? draftSku : undefined,
        },
      },
    });
    toast.success("Variant updated");
    setEditingId(null);
  }

  async function setStatus(v: ProductVariant, next: VariantStatus) {
    await updateVariant({
      variables: { updateVariantInput: { id: v.id, status: next } },
    });
    toast.success(`Variant → ${VARIANT_STATUS_LABEL[next]}`);
  }

  async function setImage(v: ProductVariant, url: string | null) {
    await updateVariant({
      variables: { updateVariantInput: { id: v.id, imageUrl: url } },
    });
    toast.success("Image updated");
  }

  async function confirmDelete() {
    if (!deleting) return;
    await removeVariant({ variables: { id: deleting.id } });
    toast.success("Variant deleted");
    setDeleting(null);
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Variants ({variants.length})</CardTitle>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="space-y-2">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="h-12 animate-pulse rounded bg-muted" />
            ))}
          </div>
        ) : variants.length === 0 ? (
          <p className="text-sm text-muted-foreground italic text-center py-6">
            No variants yet. Use the matrix generator above.
          </p>
        ) : (
          <div className="space-y-2">
            <div
              className="grid gap-2 text-xs font-medium text-muted-foreground uppercase border-b pb-2"
              style={{
                gridTemplateColumns:
                  "3rem minmax(0,3fr) minmax(0,3fr) minmax(0,2fr) minmax(0,2fr) minmax(0,2fr) minmax(0,1fr)",
              }}
            >
              <div>Img</div>
              <div>Combination</div>
              <div>SKU</div>
              <div>Price</div>
              <div className="text-center">Stock</div>
              <div className="text-center">Status</div>
              <div className="text-right">Actions</div>
            </div>
            {variants.map((v) => {
              const isEdit = editingId === v.id;
              const inv = inventoryByVariant.get(v.id);
              return (
                <div
                  key={v.id}
                  className="grid gap-2 items-center py-2 border-b text-sm"
                  style={{
                    gridTemplateColumns:
                      "3rem minmax(0,3fr) minmax(0,3fr) minmax(0,2fr) minmax(0,2fr) minmax(0,2fr) minmax(0,1fr)",
                  }}
                >
                  <div>
                    <div className="h-10 w-10 rounded bg-muted overflow-hidden flex items-center justify-center">
                      {v.imageUrl ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={v.imageUrl}
                          alt=""
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <Boxes className="h-4 w-4 text-muted-foreground" />
                      )}
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {v.attributes.map((a) => (
                      <Badge
                        key={a.attributeValueId}
                        variant="secondary"
                        className="text-xs"
                      >
                        {a.attributeName}: {a.value}
                      </Badge>
                    ))}
                  </div>
                  <div>
                    {isEdit ? (
                      <Input
                        value={draftSku}
                        onChange={(e) => setDraftSku(e.target.value)}
                        className="h-8"
                      />
                    ) : (
                      <span className="font-mono text-xs truncate">{v.sku}</span>
                    )}
                  </div>
                  <div>
                    {isEdit ? (
                      <Input
                        type="number"
                        min={0}
                        step={0.01}
                        value={draftPrice}
                        onChange={(e) => setDraftPrice(e.target.value)}
                        className="h-8"
                      />
                    ) : (
                      <span>₹{v.price.toLocaleString("en-IN")}</span>
                    )}
                  </div>
                  <div className="flex flex-col items-center gap-1">
                    {inv ? (
                      <button
                        type="button"
                        onClick={() => setStockTarget(inv)}
                        className="flex flex-col items-center hover:bg-muted/50 rounded px-2 py-0.5 transition-colors"
                        title="Adjust stock"
                      >
                        <span className="font-mono font-semibold text-sm">
                          {inv.quantityAvailable}
                        </span>
                        <Badge
                          variant={STOCK_STATE_VARIANT[inv.stockState]}
                          className="text-[9px] px-1 py-0"
                        >
                          {STOCK_STATE_LABEL[inv.stockState]}
                        </Badge>
                      </button>
                    ) : (
                      <span className="text-xs text-muted-foreground italic">
                        —
                      </span>
                    )}
                  </div>
                  <div className="flex justify-center">
                    <Select
                      value={v.status}
                      onValueChange={(val) => setStatus(v, val as VariantStatus)}
                    >
                      <SelectTrigger className="h-8 text-xs w-32">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {VARIANT_STATUSES.map((s) => (
                          <SelectItem key={s} value={s}>
                            {VARIANT_STATUS_LABEL[s]}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="flex items-center justify-end gap-1">
                    {isEdit ? (
                      <>
                        <Button
                          size="icon"
                          variant="ghost"
                          onClick={() => saveEdit(v)}
                          className="h-7 w-7"
                        >
                          <Save className="h-3 w-3" />
                        </Button>
                        <Button
                          size="icon"
                          variant="ghost"
                          onClick={() => setEditingId(null)}
                          className="h-7 w-7"
                        >
                          <X className="h-3 w-3" />
                        </Button>
                      </>
                    ) : (
                      <>
                        <Button
                          size="icon"
                          variant="ghost"
                          onClick={() => startEdit(v)}
                          className="h-7 w-7"
                          title="Edit SKU/price"
                        >
                          <Pencil className="h-3 w-3" />
                        </Button>
                        <Button
                          size="icon"
                          variant="ghost"
                          className="h-7 w-7 text-destructive hover:text-destructive"
                          onClick={() => setDeleting(v)}
                          title="Delete"
                        >
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </>
                    )}
                  </div>

                  {/* Image uploader row — full-width below variant row */}
                  {isEdit && (
                    <div
                      className="pl-12 pt-2"
                      style={{ gridColumn: "1 / -1" }}
                    >
                      <p className="text-xs text-muted-foreground mb-2">
                        Variant-specific image (optional — falls back to product
                        primary):
                      </p>
                      <div className="max-w-xs">
                        <ImageUploader
                          purpose="PRODUCT_GALLERY"
                          ownerType="PRODUCT"
                          ownerId={productId}
                          initialUrl={v.imageUrl ?? null}
                          onUploaded={(img) => setImage(v, img.url)}
                          onClear={() => setImage(v, null)}
                          aspectClass="aspect-square h-32"
                        />
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </CardContent>

      {/* Delete confirm */}
      <AlertDialog
        open={!!deleting}
        onOpenChange={(o) => !o && setDeleting(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete variant?</AlertDialogTitle>
            <AlertDialogDescription>
              {deleting && (
                <>
                  Soft-delete &ldquo;{deleting.sku}&rdquo;? Cart/orders
                  referencing this variant will keep working but new orders
                  can&apos;t be placed against it.
                </>
              )}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              onClick={confirmDelete}
              disabled={removing}
            >
              {removing && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AdjustInventoryDialog
        open={!!stockTarget}
        row={stockTarget}
        onClose={() => setStockTarget(null)}
        onDone={() => {
          setStockTarget(null);
          onInventoryChanged();
        }}
      />
    </Card>
  );
}

// ============================================================================
// 4. Bulk apply
// ============================================================================
function BulkApply({
  productId,
  axes,
}: {
  productId: string;
  axes: GetMyProductVariantAxesData["myProductVariantAxes"];
}) {
  const [filterValueIds, setFilterValueIds] = useState<Set<string>>(new Set());
  const [price, setPrice] = useState<string>("");
  const [status, setStatus] = useState<VariantStatus | "">("");

  const [bulk, { loading }] = useMutation(BULK_UPDATE_MY_PRODUCT_VARIANTS, {
    refetchQueries: [
      { query: GET_MY_PRODUCT_VARIANTS, variables: { productId } },
    ],
    onCompleted: (res) => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const count = (res as any).bulkUpdateMyProductVariants;
      toast.success(`Updated ${count} variants`);
      setFilterValueIds(new Set());
      setPrice("");
      setStatus("");
    },
    onError: (err) => toast.error(`Failed: ${err.message}`),
  });

  function toggleFilter(valueId: string) {
    setFilterValueIds((prev) => {
      const next = new Set(prev);
      if (next.has(valueId)) next.delete(valueId);
      else next.add(valueId);
      return next;
    });
  }

  const canApply = price !== "" || status !== "";

  async function apply() {
    await bulk({
      variables: {
        bulkUpdateVariantsInput: {
          productId,
          filterValueIds:
            filterValueIds.size > 0 ? Array.from(filterValueIds) : undefined,
          price: price === "" ? undefined : Number(price),
          status: status || undefined,
        },
      },
    });
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Bulk Apply</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-xs text-muted-foreground">
          Apply price or status to multiple variants at once. Optionally narrow
          by attribute value (e.g. &quot;all Red variants&quot;).
        </p>

        <Separator />

        <div className="space-y-2">
          <div className="text-sm font-medium">Filter (optional)</div>
          {axes.map((axis) => (
            <div key={axis.attributeId} className="space-y-1">
              <div className="text-xs text-muted-foreground">
                {axis.attributeName}
              </div>
              <div className="flex flex-wrap gap-2">
                {axis.values.map((v) => {
                  const selected = filterValueIds.has(v.id);
                  return (
                    <button
                      key={v.id}
                      type="button"
                      onClick={() => toggleFilter(v.id)}
                      className={`px-2 py-1 rounded text-xs border transition ${
                        selected
                          ? "bg-primary text-primary-foreground border-primary"
                          : "bg-background text-muted-foreground border-border"
                      }`}
                    >
                      {v.value}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        <Separator />

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div>
            <label className="text-xs text-muted-foreground">Price</label>
            <Input
              type="number"
              min={0}
              step={0.01}
              placeholder="leave blank to skip"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
            />
          </div>
          <div>
            <label className="text-xs text-muted-foreground">Status</label>
            <Select
              value={status || "none"}
              onValueChange={(v) =>
                setStatus(v === "none" ? "" : (v as VariantStatus))
              }
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">— skip —</SelectItem>
                {VARIANT_STATUSES.map((s) => (
                  <SelectItem key={s} value={s}>
                    {VARIANT_STATUS_LABEL[s]}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="flex items-end">
            <Button
              onClick={apply}
              disabled={!canApply || loading}
              className="w-full"
            >
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Apply
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

