import { z } from "zod";

/**
 * Spotlight variant — a floating chip overlaid on the hero image
 * (e.g. "Minimalistic", "¡Super cozy!"). 0–3 typical.
 */
export const heroAccentSchema = z.object({
  label: z.string().default(""),
});

/**
 * Spotlight variant — a small thumbnail in the right-side strip.
 * Optional href makes each thumbnail a click-through to a related
 * product / category.
 */
export const heroThumbnailSchema = z.object({
  imageUrl: z.string().default(""),
  href: z.string().default(""),
});

export const heroSchema = z.object({
  imageUrl: z.string().optional().default(""),
  headline: z.string().default("Shop the best of India"),
  subtext: z.string().default(""),
  ctaLabel: z.string().default(""),
  ctaHref: z.string().default(""),
  alignment: z.enum(["left", "center", "right"]).default("center"),
  /** 0 = no overlay, 100 = fully opaque dark overlay over image. */
  overlayOpacity: z.number().min(0).max(100).default(40),
  height: z.enum(["sm", "md", "lg"]).default("md"),

  /**
   * Reserved for the `slider` variant. Other variants ignore these fields.
   * sliderKey points to a `Slider` row's stable key (e.g. "home-hero").
   */
  sliderKey: z.string().optional().default(""),
  /** Override the slider's own autoplay setting. 0 disables. */
  autoAdvanceMs: z.number().int().min(0).optional(),

  /**
   * Spotlight variant fields. Other variants ignore these.
   *
   * `eyebrow` is the small uppercase tagline above the headline.
   * `accents` are floating pill labels on the hero image.
   * `thumbnails` are the small images on the right-side strip.
   * `secondaryCtaLabel/Href` is the "Continue shopping" link at the bottom.
   */
  eyebrow: z.string().default(""),
  accents: z.array(heroAccentSchema).default([]),
  thumbnails: z.array(heroThumbnailSchema).default([]),
  secondaryCtaLabel: z.string().default(""),
  secondaryCtaHref: z.string().default(""),
});

export type HeroAccent = z.infer<typeof heroAccentSchema>;
export type HeroThumbnail = z.infer<typeof heroThumbnailSchema>;
export type HeroProps = z.infer<typeof heroSchema>;

export const heroDefaults = (): HeroProps => ({
  imageUrl: "",
  headline: "Shop the best of India",
  subtext: "Hand-picked products from verified sellers",
  ctaLabel: "Browse products",
  ctaHref: "/",
  alignment: "center",
  overlayOpacity: 40,
  height: "md",
  sliderKey: "",
  autoAdvanceMs: undefined,
  eyebrow: "",
  accents: [],
  thumbnails: [],
  secondaryCtaLabel: "",
  secondaryCtaHref: "",
});
