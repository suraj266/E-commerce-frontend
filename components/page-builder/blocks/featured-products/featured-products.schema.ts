import { z } from "zod";

export const featuredProductsSchema = z.object({
  title: z.string().default("Featured products"),
  subtitle: z.string().default(""),
  /** Source of the products — manual list of slugs OR auto-by-relation. */
  source: z
    .enum(["manual", "category", "brand", "tag", "collection"])
    .default("category"),
  /** Comma-separated product slugs when source = "manual". */
  productSlugs: z.string().default(""),
  categorySlug: z.string().default(""),
  brandSlug: z.string().default(""),
  tagSlug: z.string().default(""),
  /** Collection slug when source = "collection" (manual or smart membership). */
  collectionSlug: z.string().default(""),
  maxItems: z.number().int().min(1).max(24).default(8),
  layout: z.enum(["grid", "carousel"]).default("grid"),
  columns: z.number().int().min(2).max(6).default(4),
  /** Auto-tag products with "Bestseller" / "New arrival" pill in the showcase variant. */
  showBadges: z.boolean().default(true),
});

export type FeaturedProductsProps = z.infer<typeof featuredProductsSchema>;

export const featuredProductsDefaults = (): FeaturedProductsProps => ({
  title: "Featured products",
  subtitle: "",
  source: "category",
  productSlugs: "",
  categorySlug: "",
  brandSlug: "",
  tagSlug: "",
  collectionSlug: "",
  maxItems: 8,
  layout: "grid",
  columns: 4,
  showBadges: true,
});
