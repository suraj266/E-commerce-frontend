/**
 * VIEW_REGISTRY — the public-render half of the block registry: each block's
 * schema, defaults and layout variants (with their View components).
 *
 * The storefront BlockRenderer only needs this. The admin editing pieces
 * (Editor forms with image uploaders, category cascaders, slider pickers —
 * plus picker metadata) live in `registry.ts`, which builds BLOCK_REGISTRY
 * from this file, so they are no longer shipped to every storefront visitor.
 *
 * To add a variant or block, see the steps in registry.ts — the View and
 * schema go here, the Editor + meta go there.
 */

import type { ViewBlockDefinition } from "./types";

// Hero variants
import { HeroCenteredView } from "./blocks/hero/hero";
import { HeroSplitView } from "./blocks/hero/hero.split";
import { HeroSliderView } from "./blocks/hero/hero.slider";
import { HeroSpotlightView } from "./blocks/hero/hero.spotlight";
import { heroSchema, heroDefaults } from "./blocks/hero/hero.schema";

// Rich text (single variant for now)
import { RichTextView } from "./blocks/rich-text/rich-text";
import {
  richTextSchema,
  richTextDefaults,
} from "./blocks/rich-text/rich-text.schema";

// Featured products — default (layout prop drives grid/carousel) + showcase-carousel
import { FeaturedProductsView } from "./blocks/featured-products/featured-products";
import { FeaturedProductsShowcaseCarouselView } from "./blocks/featured-products/featured-products.showcase-carousel";
import {
  featuredProductsSchema,
  featuredProductsDefaults,
} from "./blocks/featured-products/featured-products.schema";

// Image grid (single variant for now)
import { ImageGridView } from "./blocks/image-grid/image-grid";
import {
  imageGridSchema,
  imageGridDefaults,
} from "./blocks/image-grid/image-grid.schema";

// Category showcase — four layout variants (equal-grid / mosaic / carousel / soft-cards)
import { CategoryShowcaseEqualGridView } from "./blocks/category-showcase/category-showcase.equal-grid";
import { CategoryShowcaseMosaicView } from "./blocks/category-showcase/category-showcase.mosaic";
import { CategoryShowcaseCarouselView } from "./blocks/category-showcase/category-showcase.carousel";
import { CategoryShowcaseSoftCardsView } from "./blocks/category-showcase/category-showcase.soft-cards";
import {
  categoryShowcaseSchema,
  categoryShowcaseDefaults,
} from "./blocks/category-showcase/category-showcase.schema";

// CTA — three layout variants (solid / soft / image-bg)
import { CtaSolidView } from "./blocks/cta/cta.solid";
import { CtaSoftView } from "./blocks/cta/cta.soft";
import { CtaImageView } from "./blocks/cta/cta.image";
import { ctaSchema, ctaDefaults } from "./blocks/cta/cta.schema";

// Newsletter signup — two layout variants (centered-banner / inline-narrow)
import { NewsletterSignupCenteredBannerView } from "./blocks/newsletter-signup/newsletter-signup.centered-banner";
import { NewsletterSignupInlineNarrowView } from "./blocks/newsletter-signup/newsletter-signup.inline-narrow";
import {
  newsletterSignupSchema,
  newsletterSignupDefaults,
} from "./blocks/newsletter-signup/newsletter-signup.schema";

// Spacer (single variant)
import { SpacerView } from "./blocks/spacer/spacer";
import {
  spacerSchema,
  spacerDefaults,
} from "./blocks/spacer/spacer.schema";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const VIEW_REGISTRY: Record<string, ViewBlockDefinition<any>> = {
  hero: {
    type: "hero",
    schema: heroSchema,
    defaults: heroDefaults,
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
    schema: richTextSchema,
    defaults: richTextDefaults,
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
    schema: featuredProductsSchema,
    defaults: featuredProductsDefaults,
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
    schema: categoryShowcaseSchema,
    defaults: categoryShowcaseDefaults,
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
      "soft-cards": {
        label: "Soft cards (arrows)",
        description: "Pastel rotating cards with image + name and Prev/Next arrows",
        View: CategoryShowcaseSoftCardsView,
      },
    },
  },

  "image-grid": {
    type: "image-grid",
    schema: imageGridSchema,
    defaults: imageGridDefaults,
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
    schema: ctaSchema,
    defaults: ctaDefaults,
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
    schema: newsletterSignupSchema,
    defaults: newsletterSignupDefaults,
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
    schema: spacerSchema,
    defaults: spacerDefaults,
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
