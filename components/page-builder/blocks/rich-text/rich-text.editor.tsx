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
import type { RichTextProps } from "./rich-text.schema";

export function RichTextEditor({
  props,
  onChange,
}: BlockEditorProps<RichTextProps>) {
  function patch(p: Partial<RichTextProps>) {
    onChange({ ...props, ...p });
  }
  return (
    <div className="space-y-4">
      <div>
        <Label htmlFor="rt-body" className="text-xs">
          Body (Markdown)
        </Label>
        <textarea
          id="rt-body"
          value={props.body}
          onChange={(e) => patch({ body: e.target.value })}
          rows={14}
          className="w-full rounded-md border bg-background px-3 py-2 text-sm font-mono leading-relaxed focus:outline-none focus:ring-1 focus:ring-ring resize-y"
          placeholder="## Heading&#10;&#10;Write here..."
        />
        <p className="text-xs text-muted-foreground mt-1">
          Supports Markdown: <code>**bold**</code>, <code>*italic*</code>,{" "}
          <code># headings</code>, <code>- lists</code>,{" "}
          <code>[link](url)</code>, blockquotes, code.
        </p>
      </div>

      <div>
        <Label className="text-xs">Width</Label>
        <Select
          value={props.maxWidth}
          onValueChange={(v) =>
            patch({ maxWidth: v as RichTextProps["maxWidth"] })
          }
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="narrow">Narrow (prose)</SelectItem>
            <SelectItem value="medium">Medium</SelectItem>
            <SelectItem value="wide">Wide</SelectItem>
            <SelectItem value="full">Full</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}
