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
import { Plus, Trash2 } from "lucide-react";
import type { BlockEditorProps } from "../../types";
import type { ImageGridItem, ImageGridProps } from "./image-grid.schema";

export function ImageGridEditor({
  props,
  onChange,
}: BlockEditorProps<ImageGridProps>) {
  function patch(p: Partial<ImageGridProps>) {
    onChange({ ...props, ...p });
  }
  function patchItem(idx: number, patch: Partial<ImageGridItem>) {
    const next = [...props.items];
    next[idx] = { ...next[idx], ...patch };
    onChange({ ...props, items: next });
  }
  function addItem() {
    onChange({
      ...props,
      items: [...props.items, { imageUrl: "", caption: "", link: "" }],
    });
  }
  function removeItem(idx: number) {
    const next = props.items.filter((_, i) => i !== idx);
    onChange({ ...props, items: next });
  }

  return (
    <div className="space-y-4">
      <div>
        <Label htmlFor="ig-title" className="text-xs">
          Title
        </Label>
        <Input
          id="ig-title"
          value={props.title}
          onChange={(e) => patch({ title: e.target.value })}
          placeholder="Optional section title"
        />
      </div>

      <div>
        <Label className="text-xs">Columns</Label>
        <Select
          value={String(props.columns)}
          onValueChange={(v) => patch({ columns: Number(v) })}
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="2">2</SelectItem>
            <SelectItem value="3">3</SelectItem>
            <SelectItem value="4">4</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <Label className="text-xs">Items ({props.items.length})</Label>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={addItem}
          >
            <Plus className="mr-1 h-3 w-3" />
            Add image
          </Button>
        </div>

        {props.items.length === 0 && (
          <p className="text-xs text-muted-foreground italic">
            No images yet. Click &ldquo;Add image&rdquo; to start.
          </p>
        )}

        {props.items.map((item, idx) => (
          <div
            key={idx}
            className="rounded-md border p-3 space-y-2 bg-muted/20"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium">Image {idx + 1}</span>
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
            <ImageUploader
              purpose="GENERIC"
              initialUrl={item.imageUrl || null}
              onUploaded={(img) => patchItem(idx, { imageUrl: img.url })}
              onClear={() => patchItem(idx, { imageUrl: "" })}
              aspectClass="aspect-[4/3] h-32"
            />
            <Input
              placeholder="Caption (optional)"
              value={item.caption}
              onChange={(e) => patchItem(idx, { caption: e.target.value })}
            />
            <Input
              placeholder="Link (optional, e.g. /category/electronics)"
              value={item.link}
              onChange={(e) => patchItem(idx, { link: e.target.value })}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
