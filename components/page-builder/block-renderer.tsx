"use client";

import type { Block } from "@/types/page.types";
import { BLOCK_REGISTRY } from "./registry";

/**
 * BlockRenderer — iterates a page's blocks array and renders each via the
 * matching variant View in BLOCK_REGISTRY. Resolution rules:
 *
 *   - Unknown block.type → skipped (forward-compat for new block types
 *     not yet deployed in this build)
 *   - Unknown / missing block.variant → falls back to def.defaultVariant
 *     (covers legacy blocks saved before the variants system, AND blocks
 *     that referenced a variant key the current build doesn't have)
 *   - Props that fail schema validation → fall back to def.defaults()
 *     (lazy migration on read for schema drift)
 */
export function BlockRenderer({ blocks }: { blocks: Block[] }) {
  return (
    <>
      {blocks
        .filter((b) => b.visible !== false)
        .map((block) => {
          const def = BLOCK_REGISTRY[block.type];
          if (!def) {
            if (process.env.NODE_ENV !== "production") {
              // eslint-disable-next-line no-console
              console.warn(
                `[BlockRenderer] unknown block type "${block.type}"`,
              );
            }
            return null;
          }

          const variantKey = block.variant ?? def.defaultVariant;
          const variant =
            def.variants[variantKey] ?? def.variants[def.defaultVariant];
          if (!variant) {
            if (process.env.NODE_ENV !== "production") {
              // eslint-disable-next-line no-console
              console.warn(
                `[BlockRenderer] no variants registered for block type "${block.type}"`,
              );
            }
            return null;
          }

          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          const View = variant.View as any;
          const parsed = def.schema.safeParse(block.props ?? {});
          const props = parsed.success ? parsed.data : def.defaults();
          return <View key={block.id} {...props} />;
        })}
    </>
  );
}
