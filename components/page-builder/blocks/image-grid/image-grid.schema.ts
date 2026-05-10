import { z } from "zod";

export const imageGridItemSchema = z.object({
  imageUrl: z.string().default(""),
  caption: z.string().default(""),
  link: z.string().default(""),
});

export const imageGridSchema = z.object({
  title: z.string().default(""),
  items: z.array(imageGridItemSchema).default([]),
  columns: z.number().int().min(2).max(4).default(3),
});

export type ImageGridItem = z.infer<typeof imageGridItemSchema>;
export type ImageGridProps = z.infer<typeof imageGridSchema>;

export const imageGridDefaults = (): ImageGridProps => ({
  title: "",
  items: [],
  columns: 3,
});
