import { z } from "zod";

export const richTextSchema = z.object({
  body: z.string().default(""),
  /** Constrains content width on wide screens — useful for prose. */
  maxWidth: z.enum(["narrow", "medium", "wide", "full"]).default("medium"),
});

export type RichTextProps = z.infer<typeof richTextSchema>;

export const richTextDefaults = (): RichTextProps => ({
  body: "## Heading\n\nWrite your content here. Markdown is supported.\n\n- Lists\n- **Bold**\n- [Links](/)",
  maxWidth: "medium",
});
