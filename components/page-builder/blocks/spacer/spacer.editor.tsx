"use client";

import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { BlockEditorProps } from "../../types";
import type { SpacerProps } from "./spacer.schema";

export function SpacerEditor({
  props,
  onChange,
}: BlockEditorProps<SpacerProps>) {
  function patch(p: Partial<SpacerProps>) {
    onChange({ ...props, ...p });
  }
  return (
    <div className="grid grid-cols-2 gap-3">
      <div>
        <Label className="text-xs">Size</Label>
        <Select
          value={props.size}
          onValueChange={(v) => patch({ size: v as SpacerProps["size"] })}
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="sm">Small</SelectItem>
            <SelectItem value="md">Medium</SelectItem>
            <SelectItem value="lg">Large</SelectItem>
            <SelectItem value="xl">Extra large</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div>
        <Label className="text-xs">Divider</Label>
        <Select
          value={props.divider}
          onValueChange={(v) =>
            patch({ divider: v as SpacerProps["divider"] })
          }
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="none">None (just space)</SelectItem>
            <SelectItem value="line">Line</SelectItem>
            <SelectItem value="dots">Dots</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}
