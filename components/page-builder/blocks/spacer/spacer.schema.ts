import { z } from "zod";

export const spacerSchema = z.object({
  size: z.enum(["sm", "md", "lg", "xl"]).default("md"),
  divider: z.enum(["none", "line", "dots"]).default("none"),
});

export type SpacerProps = z.infer<typeof spacerSchema>;

export const spacerDefaults = (): SpacerProps => ({
  size: "md",
  divider: "none",
});
