/**
 * BLOCK_REGISTRY — single source of truth for block types and their layout
 * variants.
 *
 * To add a new variant for an existing block:
 *   1. Create a sibling file in the block's folder, e.g.
 *      `blocks/hero/hero.minimal.tsx`, exporting a View component.
 *   2. Register it in the block's `variants` map below.
 *
 * To add a brand-new block:
 *   1. Create a folder under blocks/<type>/ with schema, editor, and at
 *      least one variant View file
 *   2. Register the block here with at least one variant in `variants`
 *      and a `defaultVariant` key.
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

// Hero variants
import { HeroCenteredView } from "./blocks/hero/hero";
import { HeroSplitView } from "./blocks/hero/hero.split";
import { HeroSliderView } from "./blocks/hero/hero.slider";
import { HeroSpotlightView } from "./blocks/hero/hero.spotlight";
import { HeroEditor } from "./blocks/hero/hero.editor";
import { heroSchema, heroDefaults } from "./blocks/hero/hero.schema";

// Rich text (single variant for now)
import { RichTextView } from "./blocks/rich-text/rich-text";
import { RichTextEditor } from "./blocks/rich-text/rich-text.editor";
import {
  richTextSchema,
  richTextDefaults,
} from "./blocks/rich-text/rich-text.schema";

// Featured products — default (layout prop drives grid/carousel) + showcase-carousel
import { FeaturedProductsView } from "./blocks/featured-products/featured-products";
import { FeaturedProductsShowcaseCarouselView } from "./blocks/featured-products/featured-products.showcase-carousel";
import { FeaturedProductsEditor } from "./blocks/featured-products/featured-products.editor";
import {
  featuredProductsSchema,
  featuredProductsDefaults,
} from "./blocks/featured-products/featured-products.schema";

// Image grid (single variant for now)
import { ImageGridView } from "./blocks/image-grid/image-grid";
import { ImageGridEditor } from "./blocks/image-grid/image-grid.editor";
import {
  imageGridSchema,
  imageGridDefaults,
} from "./blocks/image-grid/image-grid.schema";

// Category showcase — three layout variants (equal-grid / mosaic / carousel)
import { CategoryShowcaseEqualGridView } from "./blocks/category-showcase/category-showcase.equal-grid";
import { CategoryShowcaseMosaicView } from "./blocks/category-showcase/category-showcase.mosaic";
import { CategoryShowcaseCarouselView } from "./blocks/category-showcase/category-showcase.carousel";
import { CategoryShowcaseEditor } from "./blocks/category-showcase/category-showcase.editor";
import {
  categoryShowcaseSchema,
  categoryShowcaseDefaults,
} from "./blocks/category-showcase/category-showcase.schema";

// CTA — three layout variants (solid / soft / image-bg)
import { CtaSolidView } from "./blocks/cta/cta.solid";
import { CtaSoftView } from "./blocks/cta/cta.soft";
import { CtaImageView } from "./blocks/cta/cta.image";
import { CtaEditor } from "./blocks/cta/cta.editor";
import { ctaSchema, ctaDefaults } from "./blocks/cta/cta.schema";

// Newsletter signup — two layout variants (centered-banner / inline-narrow)
import { NewsletterSignupCenteredBannerView } from "./blocks/newsletter-signup/newsletter-signup.centered-banner";
import { NewsletterSignupInlineNarrowView } from "./blocks/newsletter-signup/newsletter-signup.inline-narrow";
import { NewsletterSignupEditor } from "./blocks/newsletter-signup/newsletter-signup.editor";
import {
  newsletterSignupSchema,
  newsletterSignupDefaults,
} from "./blocks/newsletter-signup/newsletter-signup.schema";

// Spacer (single variant)
import { SpacerView } from "./blocks/spacer/spacer";
import { SpacerEditor } from "./blocks/spacer/spacer.editor";
import {
  spacerSchema,
  spacerDefaults,
} from "./blocks/spacer/spacer.schema";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const BLOCK_REGISTRY: Record<string, BlockDefinition<any>> = {
  hero: {
    type: "hero",
    meta: {
      label: "Hero banner",
      description: "Big visual at the top with a headline + CTA",
      icon: ImageIcon,
    },
    schema: heroSchema,
    defaults: heroDefaults,
    Editor: HeroEditor,
    defaultVariant: "centered",
    variants: {
      centered: {
        label: "Centered overlay",
        description: "Full-bleed image with centered text + dark overlay",
        View: HeroCenteredView,
      },
      split: {
        label: "Split (image + text)",
        description: "Image one side, text + CTA on the other",
        View: HeroSplitView,
      },
      slider: {
        label: "Slider (carousel)",
        description: "Pull slides from /admin/sliders. Best for reusable carousels.",
        View: HeroSliderView,
      },
      spotlight: {
        label: "Spotlight (product hero)",
        description:
          "Single product in a peach circle with floating labels + side thumbnails. Best for product-led storefronts.",
        View: HeroSpotlightView,
      },
    },
  },

  "rich-text": {
    type: "rich-text",
    meta: {
      label: "Rich text",
      description: "Markdown body for prose content",
      icon: Type,
    },
    schema: richTextSchema,
    defaults: richTextDefaults,
    Editor: RichTextEditor,
    defaultVariant: "default",
    variants: {
      default: {
        label: "Standard",
        description: "Markdown rendered with normal flow",
        View: RichTextView,
      },
    },
  },

  "featured-products": {
    type: "featured-products",
    meta: {
      label: "Featured products",
      description: "Grid or carousel of products",
      icon: ShoppingBag,
    },
    schema: featuredProductsSchema,
    defaults: featuredProductsDefaults,
    Editor: FeaturedProductsEditor,
    defaultVariant: "default",
    variants: {
      default: {
        label: "Standard",
        description: "Grid or carousel based on layout prop",
        View: FeaturedProductsView,
      },
      "showcase-carousel": {
        label: "Showcase carousel",
        description: "Tall product cards with arrow nav + auto-derived badges",
        View: FeaturedProductsShowcaseCarouselView,
      },
    },
  },

  "category-showcase": {
    type: "category-showcase",
    meta: {
      label: "Category showcase",
      description: "Promote categories — equal grid, mosaic, or carousel",
      icon: Boxes,
    },
    schema: categoryShowcaseSchema,
    defaults: categoryShowcaseDefaults,
    Editor: CategoryShowcaseEditor,
    defaultVariant: "equal-grid",
    variants: {
      "equal-grid": {
        label: "Equal grid",
        description: "Uniform 3-up / 6-up tiles with name overlay",
        View: CategoryShowcaseEqualGridView,
      },
      mosaic: {
        label: "Mosaic (1 large + 4)",
        description: "Hero tile alongside a 2x2 supporting grid",
        View: CategoryShowcaseMosaicView,
      },
      carousel: {
        label: "Carousel",
        description: "Horizontal scroll of circular tiles",
        View: CategoryShowcaseCarouselView,
      },
    },
  },

  "image-grid": {
    type: "image-grid",
    meta: {
      label: "Image grid",
      description: "Grid of clickable images with captions",
      icon: LayoutGrid,
    },
    schema: imageGridSchema,
    defaults: imageGridDefaults,
    Editor: ImageGridEditor,
    defaultVariant: "default",
    variants: {
      default: {
        label: "Standard",
        description: "Square thumbnails arranged in a grid",
        View: ImageGridView,
      },
    },
  },

  cta: {
    type: "cta",
    meta: {
      label: "Call to action",
      description: "Banner with headline, subtext, and a button",
      icon: Megaphone,
    },
    schema: ctaSchema,
    defaults: ctaDefaults,
    Editor: CtaEditor,
    defaultVariant: "solid",
    variants: {
      solid: {
        label: "Solid (primary background)",
        description: "Bold primary-color block",
        View: CtaSolidView,
      },
      soft: {
        label: "Soft (subtle border)",
        description: "Pastel background with a subtle border",
        View: CtaSoftView,
      },
      image: {
        label: "Image background",
        description: "Background image with dark overlay",
        View: CtaImageView,
      },
    },
  },

  "newsletter-signup": {
    type: "newsletter-signup",
    meta: {
      label: "Newsletter signup",
      description: "Capture email subscribers — banner or inline form",
      icon: Mail,
    },
    schema: newsletterSignupSchema,
    defaults: newsletterSignupDefaults,
    Editor: NewsletterSignupEditor,
    defaultVariant: "centered-banner",
    variants: {
      "centered-banner": {
        label: "Centered banner",
        description: "Full-bleed band with optional background image",
        View: NewsletterSignupCenteredBannerView,
      },
      "inline-narrow": {
        label: "Inline narrow",
        description: "Light card with text + form side-by-side",
        View: NewsletterSignupInlineNarrowView,
      },
    },
  },

  spacer: {
    type: "spacer",
    meta: {
      label: "Spacer / divider",
      description: "Vertical space, optionally with a line",
      icon: SeparatorHorizontal,
    },
    schema: spacerSchema,
    defaults: spacerDefaults,
    Editor: SpacerEditor,
    defaultVariant: "default",
    variants: {
      default: {
        label: "Standard",
        description: "Configurable size + divider style",
        View: SpacerView,
      },
    },
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
