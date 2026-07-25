import { z } from "zod";

// ---------------------------------------------------------------------------
// Product form schema — shared by the orchestrator and the section components.
//
// Path A pricing: the form carries a flat `price`/`sku`. The backend creates
// the implicit variant transparently for SIMPLE products.
// ---------------------------------------------------------------------------
export const productSchema = z.object({
  storeId: z.string().uuid("Pick a store"),
  name: z.string().min(2, "At least 2 characters").max(200),
  slug: z
    .string()
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "lowercase, digits, hyphens")
    .optional()
    .or(z.literal("")),
  categoryId: z.string().uuid().optional().or(z.literal("")),
  brandId: z.string().uuid().optional().or(z.literal("")),
  shortDescription: z.string().max(500).optional(),
  description: z.string().optional(),

  productType: z.enum(["SIMPLE", "VARIABLE"]),

  price: z.coerce.number().min(0, "Must be ≥ 0").optional().or(z.literal("")),
  compareAtPrice: z.coerce.number().min(0).optional().or(z.literal("")),
  costPrice: z.coerce.number().min(0).optional().or(z.literal("")),
  sku: z.string().min(2).max(60).optional().or(z.literal("")),

  weight: z.coerce.number().min(0).optional().or(z.literal("")),
  length: z.coerce.number().min(0).optional().or(z.literal("")),
  width: z.coerce.number().min(0).optional().or(z.literal("")),
  height: z.coerce.number().min(0).optional().or(z.literal("")),
  isDigital: z.boolean(),

  /** Tax — pick from admin-managed catalog. UUID or empty (no tax assigned). */
  taxId: z.string().uuid().optional().or(z.literal("")),

  /** HSN code — 4/6/8 digits required for GST. Validated as digits-only. */
  hsnCode: z
    .string()
    .regex(/^(\d{4}|\d{6}|\d{8})$/, "HSN code must be 4, 6, or 8 digits")
    .optional()
    .or(z.literal("")),

  /** ISO 3166-1 alpha-2 country code (CP-EC Rules 2020 mandatory disclosure). */
  countryOfOrigin: z
    .string()
    .regex(/^[A-Z]{2}$/, "Pick a country")
    .optional()
    .or(z.literal("")),

  /** True = stored price is MRP. False = exclusive (rare). Default true. */
  isPriceTaxInclusive: z.boolean().default(true),

  seoTitle: z.string().max(70).optional(),
  seoDescription: z.string().max(200).optional(),
  seoKeywords: z.array(z.string()).default([]),

  tagIds: z.array(z.string().uuid()).default([]),
  labelIds: z.array(z.string().uuid()).default([]),
});

export type ProductFormValues = z.infer<typeof productSchema>;
