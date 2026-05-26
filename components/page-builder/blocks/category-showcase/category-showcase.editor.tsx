"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ImageUploader } from "@/components/media/image-uploader";
import { CategoryCascader } from "@/components/category/category-cascader";
import { Plus, Trash2, ArrowUp, ArrowDown } from "lucide-react";
import type { BlockEditorProps } from "../../types";
import type {
  CategoryShowcaseItem,
  CategoryShowcaseProps,
} from "./category-showcase.schema";

export function CategoryShowcaseEditor({
  props,
  onChange,
}: BlockEditorProps<CategoryShowcaseProps>) {
  function patch(p: Partial<CategoryShowcaseProps>) {
    onChange({ ...props, ...p });
  }
  function patchItem(idx: number, p: Partial<CategoryShowcaseItem>) {
    const next = [...props.items];
    next[idx] = { ...next[idx], ...p };
    onChange({ ...props, items: next });
  }
  function addItem() {
    onChange({
      ...props,
      items: [...props.items, { categoryId: "", imageOverride: "" }],
    });
  }
  function removeItem(idx: number) {
    onChange({ ...props, items: props.items.filter((_, i) => i !== idx) });
  }
  function moveItem(idx: number, dir: -1 | 1) {
    const next = [...props.items];
    const target = idx + dir;
    if (target < 0 || target >= next.length) return;
    [next[idx], next[target]] = [next[target], next[idx]];
    onChange({ ...props, items: next });
  }

  return (
    <div className="space-y-4">
      <div>
        <Label htmlFor="cs-title" className="text-xs">
          Title
        </Label>
        <Input
          id="cs-title"
          value={props.title}
          onChange={(e) => patch({ title: e.target.value })}
        />
      </div>

      <div>
        <Label htmlFor="cs-subtitle" className="text-xs">
          Subtitle
        </Label>
        <Input
          id="cs-subtitle"
          value={props.subtitle}
          onChange={(e) => patch({ subtitle: e.target.value })}
          placeholder="Optional supporting line"
        />
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <Label className="text-xs">Width</Label>
          <Select
            value={props.width}
            onValueChange={(v) =>
              patch({ width: v as CategoryShowcaseProps["width"] })
            }
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="contained">Contained (default)</SelectItem>
              <SelectItem value="full">Full screen width</SelectItem>
            </SelectContent>
          </Select>
          <p className="text-xs text-muted-foreground mt-1">
            {props.width === "full"
              ? "Spans edge-to-edge. Carousel loses the soft fade."
              : "Capped at the page's standard content width."}
          </p>
        </div>
        <div>
          <Label className="text-xs">Tile shape</Label>
          <Select
            value={props.tileShape}
            onValueChange={(v) =>
              patch({ tileShape: v as CategoryShowcaseProps["tileShape"] })
            }
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="square">Square (default)</SelectItem>
              <SelectItem value="rounded">Rounded</SelectItem>
              <SelectItem value="circle">Circle</SelectItem>
            </SelectContent>
          </Select>
          <p className="text-xs text-muted-foreground mt-1">
            {props.tileShape === "circle"
              ? "Tiles render as circles (clips image corners)."
              : props.tileShape === "rounded"
                ? "Soft 6px corners."
                : "Sharp 1:1 corners, full image visible."}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <Label className="text-xs">Source</Label>
          <Select
            value={props.source}
            onValueChange={(v) =>
              patch({ source: v as CategoryShowcaseProps["source"] })
            }
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="manual">Manual (curated)</SelectItem>
              <SelectItem value="auto">Auto (top-level)</SelectItem>
              <SelectItem value="children-of">Children of category</SelectItem>
            </SelectContent>
          </Select>
          <p className="text-xs text-muted-foreground mt-1">
            {props.source === "auto"
              ? "Pulls active root categories by display order."
              : props.source === "children-of"
                ? "Pulls active sub-categories of the picked parent by display order."
                : "Hand-pick tiles below."}
          </p>
        </div>
        <div>
          <Label htmlFor="cs-max" className="text-xs">
            Max items
          </Label>
          <Input
            id="cs-max"
            type="number"
            min={2}
            max={12}
            value={props.maxItems}
            onChange={(e) => patch({ maxItems: Number(e.target.value) || 6 })}
          />
        </div>
      </div>

      {props.source === "children-of" && (
        <div>
          <Label className="text-xs">Parent category</Label>
          <CategoryCascader
            value={props.parentCategoryId || null}
            onChange={(id) => patch({ parentCategoryId: id ?? "" })}
            rootPlaceholder="Pick the parent..."
          />
          <p className="text-xs text-muted-foreground mt-1">
            The block renders this category&apos;s direct sub-categories.
          </p>
        </div>
      )}

      {props.source === "manual" && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <Label className="text-xs">
              Curated tiles ({props.items.length})
            </Label>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={addItem}
            >
              <Plus className="mr-1 h-3 w-3" />
              Add tile
            </Button>
          </div>

          {props.items.length === 0 && (
            <p className="text-xs text-muted-foreground italic">
              No tiles yet. Click &ldquo;Add tile&rdquo; to start.
            </p>
          )}

          {props.items.map((item, idx) => (
            <div
              key={idx}
              className="rounded-md border p-3 space-y-2 bg-muted/20"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium">Tile {idx + 1}</span>
                <div className="flex items-center gap-1">
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="h-6 w-6"
                    disabled={idx === 0}
                    onClick={() => moveItem(idx, -1)}
                  >
                    <ArrowUp className="h-3 w-3" />
                  </Button>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="h-6 w-6"
                    disabled={idx === props.items.length - 1}
                    onClick={() => moveItem(idx, 1)}
                  >
                    <ArrowDown className="h-3 w-3" />
                  </Button>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="h-6 w-6 text-destructive hover:text-destructive"
                    onClick={() => removeItem(idx)}
                  >
                    <Trash2 className="h-3 w-3" />
                  </Button>
                </div>
              </div>

              <div>
                <Label className="text-xs">Category</Label>
                <CategoryCascader
                  value={item.categoryId || null}
                  onChange={(id) =>
                    patchItem(idx, { categoryId: id ?? "" })
                  }
                  rootPlaceholder="Pick a category..."
                />
              </div>

              <div>
                <Label className="text-xs">
                  Image override{" "}
                  <span className="text-muted-foreground">(optional)</span>
                </Label>
                <ImageUploader
                  purpose="GENERIC"
                  initialUrl={item.imageOverride || null}
                  onUploaded={(img) =>
                    patchItem(idx, { imageOverride: img.url })
                  }
                  onClear={() => patchItem(idx, { imageOverride: "" })}
                  aspectClass="aspect-square h-32"
                />
                <p className="text-xs text-muted-foreground mt-1">
                  Leave empty to use the category&apos;s own image.
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
