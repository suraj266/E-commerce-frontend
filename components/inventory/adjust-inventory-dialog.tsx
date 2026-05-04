"use client";

/**
 * AdjustInventoryDialog — shared modal for recording an inventory movement.
 *
 * Used from /seller/inventory and from the per-product variants page. Two
 * input modes: relative delta (+/-) or absolute on-hand recount. Server
 * validates that the resulting available quantity stays >= 0.
 */

import { useEffect, useState } from "react";
import { useMutation } from "@apollo/client/react";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";

import { ADJUST_MY_INVENTORY } from "@/lib/graphql/inventory";
import {
  AdjustMyInventoryData,
  Inventory,
  InventoryMovementType,
  MANUAL_MOVEMENT_TYPES,
  MOVEMENT_TYPE_LABEL,
} from "@/types/inventory.types";

import { Button } from "@/components/ui/button";
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
import { Separator } from "@/components/ui/separator";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface Props {
  open: boolean;
  /** Required. Pass null when closed to avoid stale state. */
  row: Inventory | null;
  onClose: () => void;
  /** Fired after a successful save. Caller refetches its list. */
  onDone: (updated: Inventory) => void;
}

export function AdjustInventoryDialog({ open, row, onClose, onDone }: Props) {
  const [mode, setMode] = useState<"delta" | "set">("delta");
  const [movementType, setMovementType] =
    useState<InventoryMovementType>("PURCHASE");
  const [delta, setDelta] = useState("");
  const [setValue, setSetValue] = useState("");
  const [notes, setNotes] = useState("");

  useEffect(() => {
    if (open && row) {
      setMode("delta");
      setMovementType("PURCHASE");
      setDelta("");
      setSetValue(String(row.quantityOnHand));
      setNotes("");
    }
  }, [open, row]);

  const [adjust, { loading }] = useMutation<AdjustMyInventoryData>(
    ADJUST_MY_INVENTORY,
    {
      onCompleted: (res) => {
        toast.success("Inventory updated");
        onDone(res.adjustMyInventory);
      },
      onError: (err) => toast.error(`Failed: ${err.message}`),
    },
  );

  if (!row) return null;

  const valid =
    mode === "delta"
      ? delta.trim() !== "" && Number(delta) !== 0
      : setValue.trim() !== "";

  const previewOnHand =
    mode === "delta"
      ? row.quantityOnHand + (Number(delta) || 0)
      : Number(setValue) || 0;
  const previewAvailable = previewOnHand - row.quantityReserved;
  const wouldOversell = previewAvailable < 0;

  async function submit() {
    if (!row || !valid) return;
    await adjust({
      variables: {
        adjustInventoryInput: {
          variantId: row.variantId,
          warehouseId: row.warehouseId,
          movementType,
          delta: mode === "delta" ? Number(delta) : undefined,
          newQuantityOnHand: mode === "set" ? Number(setValue) : undefined,
          notes: notes.trim() || undefined,
        },
      },
    });
  }

  return (
    <Dialog open={open} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Adjust inventory</DialogTitle>
          <DialogDescription>
            <span className="font-medium text-foreground">
              {row.product?.name ?? row.variant?.sku ?? "Variant"}
            </span>{" "}
            · {row.variant?.sku}
            <br />
            Warehouse: {row.warehouse?.name}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="grid grid-cols-3 gap-2 text-center text-xs">
            <div>
              <div className="text-muted-foreground uppercase">On hand</div>
              <div className="font-mono text-lg">{row.quantityOnHand}</div>
            </div>
            <div>
              <div className="text-muted-foreground uppercase">Reserved</div>
              <div className="font-mono text-lg">{row.quantityReserved}</div>
            </div>
            <div>
              <div className="text-muted-foreground uppercase">Available</div>
              <div className="font-mono text-lg font-semibold">
                {row.quantityAvailable}
              </div>
            </div>
          </div>

          <Separator />

          <div className="flex gap-2">
            <Button
              type="button"
              variant={mode === "delta" ? "default" : "outline"}
              size="sm"
              className="flex-1"
              onClick={() => setMode("delta")}
            >
              Add / remove
            </Button>
            <Button
              type="button"
              variant={mode === "set" ? "default" : "outline"}
              size="sm"
              className="flex-1"
              onClick={() => setMode("set")}
            >
              Set absolute
            </Button>
          </div>

          {mode === "delta" ? (
            <div>
              <Label htmlFor="delta">Quantity change</Label>
              <Input
                id="delta"
                type="number"
                placeholder="+10 received, -1 damaged"
                value={delta}
                onChange={(e) => setDelta(e.target.value)}
              />
              <p className="text-xs text-muted-foreground mt-1">
                Positive = received, negative = removed.
              </p>
            </div>
          ) : (
            <div>
              <Label htmlFor="setVal">New on-hand quantity</Label>
              <Input
                id="setVal"
                type="number"
                min={0}
                value={setValue}
                onChange={(e) => setSetValue(e.target.value)}
              />
              <p className="text-xs text-muted-foreground mt-1">
                Use this for a recount. We&apos;ll record the difference as an
                adjustment.
              </p>
            </div>
          )}

          <div>
            <Label>Reason</Label>
            <Select
              value={movementType}
              onValueChange={(v) => setMovementType(v as InventoryMovementType)}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {MANUAL_MOVEMENT_TYPES.map((t) => (
                  <SelectItem key={t} value={t}>
                    {MOVEMENT_TYPE_LABEL[t]}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="notes">Notes (optional)</Label>
            <Input
              id="notes"
              placeholder="e.g. Damaged in transit, customer return..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              maxLength={500}
            />
          </div>

          <Separator />

          <div className="rounded-md bg-muted/50 p-3 text-sm">
            <div className="text-xs text-muted-foreground uppercase tracking-wide mb-1">
              After change
            </div>
            <div className="grid grid-cols-2 gap-2 font-mono">
              <div>
                On hand:{" "}
                <span className="font-semibold">{previewOnHand}</span>
              </div>
              <div>
                Available:{" "}
                <span
                  className={`font-semibold ${wouldOversell ? "text-destructive" : ""}`}
                >
                  {previewAvailable}
                </span>
              </div>
            </div>
            {wouldOversell && (
              <p className="text-xs text-destructive mt-2">
                Adjustment would drive available below zero — refused by
                server.
              </p>
            )}
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button
            onClick={submit}
            disabled={!valid || loading || wouldOversell}
          >
            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Apply
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
