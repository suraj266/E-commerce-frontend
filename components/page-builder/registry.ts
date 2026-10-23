/**
 * BLOCK_REGISTRY — single source of truth for block types and their layout
 * variants, as used by the admin page builder.
 *
 * It is VIEW_REGISTRY (view-registry.ts: schema, defaults, variants + Views)
 * plus the admin-only pieces: picker `meta` and the settings `Editor`. The
 * storefront BlockRenderer reads VIEW_REGISTRY directly, so the editors never
 * ship to shoppers.
 *
 * To add a new variant for an existing block:
 *   1. Create a sibling file in the block's folder, e.g.
 *      `blocks/hero/hero.minimal.tsx`, exporting a View component.
 *   2. Register it in the block's `variants` map in view-registry.ts.
 *
 * To add a brand-new block:
 *   1. Create a folder under blocks/<type>/ with schema, editor, and at
 *      least one variant View file
 *   2. Register its schema/defaults/variants in view-registry.ts and its
 *      meta + Editor below.
 *
 * The renderer (BlockRenderer) resolves a block's view by:
 *   def.variants[block.variant ?? def.defaultVariant].View
 *
 * Unknown variants gracefully fall back to defaultVariant (forward-compat
 * for blocks saved on a build that knew about a variant the current build
 * doesn't have).
 */

import {
  Image as ImageIcon,
  Type,
  ShoppingBag,
  LayoutGrid,
  Megaphone,
  SeparatorHorizontal,
  Boxes,
  Mail,
} from "lucide-react";

import type { BlockDefinition } from "./types";
import { VIEW_REGISTRY } from "./view-registry";

import { HeroEditor } from "./blocks/hero/hero.editor";
import { RichTextEditor } from "./blocks/rich-text/rich-text.editor";
import { FeaturedProductsEditor } from "./blocks/featured-products/featured-products.editor";
import { ImageGridEditor } from "./blocks/image-grid/image-grid.editor";
import { CategoryShowcaseEditor } from "./blocks/category-showcase/category-showcase.editor";
import { CtaEditor } from "./blocks/cta/cta.editor";
import { NewsletterSignupEditor } from "./blocks/newsletter-signup/newsletter-signup.editor";
import { SpacerEditor } from "./blocks/spacer/spacer.editor";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const BLOCK_REGISTRY: Record<string, BlockDefinition<any>> = {
  hero: {
    ...VIEW_REGISTRY.hero,
    meta: {
      label: "Hero banner",
      description: "Big visual at the top with a headline + CTA",
      icon: ImageIcon,
    },
    Editor: HeroEditor,
  },

  "rich-text": {
    ...VIEW_REGISTRY["rich-text"],
    meta: {
      label: "Rich text",
      description: "Markdown body for prose content",
      icon: Type,
    },
    Editor: RichTextEditor,
  },

  "featured-products": {
    ...VIEW_REGISTRY["featured-products"],
    meta: {
      label: "Featured products",
      description: "Grid or carousel of products",
      icon: ShoppingBag,
    },
    Editor: FeaturedProductsEditor,
  },

  "category-showcase": {
    ...VIEW_REGISTRY["category-showcase"],
    meta: {
      label: "Category showcase",
      description: "Promote categories — equal grid, mosaic, or carousel",
      icon: Boxes,
    },
    Editor: CategoryShowcaseEditor,
  },

  "image-grid": {
    ...VIEW_REGISTRY["image-grid"],
    meta: {
      label: "Image grid",
      description: "Grid of clickable images with captions",
      icon: LayoutGrid,
    },
    Editor: ImageGridEditor,
  },

  cta: {
    ...VIEW_REGISTRY.cta,
    meta: {
      label: "Call to action",
      description: "Banner with headline, subtext, and a button",
      icon: Megaphone,
    },
    Editor: CtaEditor,
  },

  "newsletter-signup": {
    ...VIEW_REGISTRY["newsletter-signup"],
    meta: {
      label: "Newsletter signup",
      description: "Capture email subscribers — banner or inline form",
      icon: Mail,
    },
    Editor: NewsletterSignupEditor,
  },

  spacer: {
    ...VIEW_REGISTRY.spacer,
    meta: {
      label: "Spacer / divider",
      description: "Vertical space, optionally with a line",
      icon: SeparatorHorizontal,
    },
    Editor: SpacerEditor,
  },
};

/** Iteration order for the block picker UI. */
export const BLOCK_TYPES_ORDER = [
  "hero",
  "rich-text",
  "category-showcase",
  "featured-products",
  "image-grid",
  "cta",
  "newsletter-signup",
  "spacer",
];
