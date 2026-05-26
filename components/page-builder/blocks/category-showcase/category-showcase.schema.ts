import { z } from "zod";

/**
 * One curated entry in the showcase. Stored as a list of category ids — the
 * View component fetches the live category data so renames / image updates
 * propagate without re-saving the block. `imageOverride` lets the admin pin
 * a different image just for this showcase tile (useful when the category's
 * own imageUrl is too generic).
 */
export const categoryShowcaseItemSchema = z.object({
  categoryId: z.string().default(""),
  imageOverride: z.string().default(""),
});

export const categoryShowcaseSchema = z.object({
  title: z.string().default("Shop by category"),
  subtitle: z.string().default(""),
  items: z.array(categoryShowcaseItemSchema).default([]),
  /**
   * Source drives what the tiles render:
   *   - "manual"      — admin curates the list in `items[]`
   *   - "auto"        — active root categories by displayOrder
   *   - "children-of" — active children of `parentCategoryId` by displayOrder
   */
  source: z.enum(["manual", "auto", "children-of"]).default("manual"),
  /** Used only when source === "children-of". Empty means "no parent picked". */
  parentCategoryId: z.string().default(""),
  maxItems: z.number().int().min(2).max(12).default(6),
});

export type CategoryShowcaseItem = z.infer<typeof categoryShowcaseItemSchema>;
export type CategoryShowcaseProps = z.infer<typeof categoryShowcaseSchema>;

export const categoryShowcaseDefaults = (): CategoryShowcaseProps => ({
  title: "Shop by category",
  subtitle: "",
  items: [],
  source: "manual",
  parentCategoryId: "",
  maxItems: 6,
});
