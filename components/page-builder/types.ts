/**
 * Block engine — shared types used by the registry, renderer, and editor.
 *
 * A block TYPE (e.g. "hero", "cta") groups multiple LAYOUT VARIANTS that
 * all consume the same props. Admin picks the variant in the block
 * settings panel; switching variants is seamless because props are shared.
 *
 * Each block module exports:
 *   - schema       (Zod) — validates props + drives the editor form
 *   - defaults     — initial props when a block is added to a page
 *   - Editor       — admin-side React component (settings form)
 *   - meta         — label, icon, description shown in the block picker
 *   - variants     — map of variantKey → { label, description, View }
 *   - defaultVariant — which variant to use when a block has none set
 *
 * Adding a new layout for an existing block:
 *   1. Create a sibling file (e.g. `hero.minimal.tsx`) exporting a View
 *   2. Register it in `variants` for that block in `registry.ts`
 *
 * That's the entire flow. No schema change, no DB migration — variant key
 * is a string stored inside each block's JSON entry.
 */

import type { ZodTypeAny } from "zod";
import type { LucideIcon } from "lucide-react";
import type { ComponentType } from "react";

export interface BlockMeta {
  label: string;
  description: string;
  icon: LucideIcon;
}

export interface BlockEditorProps<TProps> {
  props: TProps;
  onChange: (next: TProps) => void;
  /**
   * Currently-selected variant key. Editors can branch on this to show
   * variant-specific fields (e.g. Hero's `slider` variant shows a slider
   * picker; other variants don't need it).
   */
  variant?: string;
}

export interface BlockVariant<TProps = Record<string, unknown>> {
  /** Human-facing name shown in the layout picker (e.g. "Centered overlay"). */
  label: string;
  /** Short hint shown under the label in the picker. */
  description?: string;
  /** Optional preview image / thumbnail URL. */
  preview?: string;
  /** Public-side renderer for this layout. */
  View: ComponentType<TProps>;
}

export interface BlockDefinition<TProps = Record<string, unknown>> {
  type: string;
  meta: BlockMeta;
  schema: ZodTypeAny;
  defaults: () => TProps;
  Editor: ComponentType<BlockEditorProps<TProps>>;
  /** Map of variantKey → BlockVariant. Must contain at least one entry. */
  variants: Record<string, BlockVariant<TProps>>;
  /** Variant used when a block has no `variant` set (legacy blocks + new inserts). */
  defaultVariant: string;
}
