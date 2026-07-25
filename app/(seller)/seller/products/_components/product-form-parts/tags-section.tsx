import type { UseFormReturn } from "react-hook-form";
import { Tag as TagIcon } from "lucide-react";

import { Tag } from "@/types/tag.types";
import type { Label } from "@/types/label.types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

import type { ProductFormValues } from "./schema";

export function TagsSection({
  form,
  tags,
  manualLabels,
  autoLabels,
}: {
  form: UseFormReturn<ProductFormValues>;
  tags: Tag[];
  manualLabels: Label[];
  autoLabels: Label[];
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <TagIcon className="h-5 w-5" />
          Tags
        </CardTitle>
      </CardHeader>
      <CardContent>
        <FormField
          control={form.control}
          name="tagIds"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Pick from registry</FormLabel>
              <div className="flex flex-wrap gap-2 pt-2">
                {tags.length === 0 ? (
                  <p className="text-sm text-muted-foreground italic">
                    No tags available. Ask admin to create some.
                  </p>
                ) : (
                  tags.map((t) => {
                    const selected = field.value?.includes(t.id);
                    return (
                      <button
                        key={t.id}
                        type="button"
                        onClick={() => {
                          const cur = field.value ?? [];
                          if (selected) {
                            field.onChange(cur.filter((id) => id !== t.id));
                          } else {
                            field.onChange([...cur, t.id]);
                          }
                        }}
                        className={`px-3 py-1 rounded-full text-xs border transition ${
                          selected
                            ? "bg-primary text-primary-foreground border-primary"
                            : "bg-background text-muted-foreground border-border hover:border-foreground"
                        }`}
                      >
                        #{t.name}
                      </button>
                    );
                  })
                )}
              </div>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Labels — assign MANUAL badges; AUTO badges shown read-only. */}
        <FormField
          control={form.control}
          name="labelIds"
          render={({ field }) => (
            <FormItem className="mt-5">
              <FormLabel>Labels (badges)</FormLabel>
              <div className="flex flex-wrap gap-2 pt-2">
                {manualLabels.length === 0 ? (
                  <p className="text-sm text-muted-foreground italic">
                    No manual labels available. Admin manages these at
                    /admin/labels.
                  </p>
                ) : (
                  manualLabels.map((l) => {
                    const selected = field.value?.includes(l.id);
                    return (
                      <button
                        key={l.id}
                        type="button"
                        onClick={() => {
                          const cur = field.value ?? [];
                          field.onChange(
                            selected
                              ? cur.filter((id) => id !== l.id)
                              : [...cur, l.id],
                          );
                        }}
                        className="px-3 py-1 rounded-full text-xs font-semibold border transition"
                        style={
                          selected
                            ? {
                                backgroundColor: l.color,
                                color: l.textColor ?? "#fff",
                                borderColor: l.color,
                              }
                            : undefined
                        }
                      >
                        {l.name}
                      </button>
                    );
                  })
                )}
              </div>
              {autoLabels.length > 0 && (
                <FormDescription className="text-xs mt-2">
                  Auto badges (applied by rule, not assignable here):{" "}
                  {autoLabels.map((l) => l.name).join(", ")}.
                </FormDescription>
              )}
              <FormMessage />
            </FormItem>
          )}
        />
      </CardContent>
    </Card>
  );
}
