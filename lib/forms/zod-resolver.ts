/**
 * Typed shim around `@hookform/resolvers/zod`.
 *
 * Why this exists: `@hookform/resolvers@5` + `zod@4` + `react-hook-form@7`
 * have a signature mismatch that the raw `zodResolver` can't satisfy
 * without `as any` casts. Centralizing the cast here means we do it once
 * instead of polluting every form page with two suppression comments.
 *
 * Usage:
 *   import { zodResolver } from "@/lib/forms/zod-resolver";
 *   const form = useForm<MyValues>({ resolver: zodResolver(mySchema), ... });
 */

import { zodResolver as rawZodResolver } from "@hookform/resolvers/zod";
import type { FieldValues, Resolver } from "react-hook-form";
import type { ZodType } from "zod";

export function zodResolver<T extends FieldValues>(
  schema: ZodType<T>,
): Resolver<T> {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return rawZodResolver(schema as any) as Resolver<T>;
}
