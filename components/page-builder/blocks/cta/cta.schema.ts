import { z } from "zod";

/**
 * CTA props are layout-agnostic. Visual style (solid / soft / image-bg)
 * is now selected via the block-level layout variant in the page editor,
 * not a prop here. `imageUrl` is always available — only the "image"
 * variant uses it.
 */
export const ctaSchema = z.object({
  headline: z.string().default("Ready to start?"),
  subtext: z.string().default(""),
  buttonLabel: z.string().default("Get started"),
  buttonHref: z.string().default("/"),
  imageUrl: z.string().default(""),
});

export type CtaProps = z.infer<typeof ctaSchema>;

export const ctaDefaults = (): CtaProps => ({
  headline: "Ready to start?",
  subtext: "Browse the catalog or chat with our team.",
  buttonLabel: "Browse products",
  buttonHref: "/",
  imageUrl: "",
});
