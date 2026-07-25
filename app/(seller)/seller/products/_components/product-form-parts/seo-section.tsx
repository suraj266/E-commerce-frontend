import { useState } from "react";
import type { UseFormReturn } from "react-hook-form";
import { X } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

import type { ProductFormValues } from "./schema";

/**
 * SEO — meta title/description + a keyword chip picker. The keyword input state
 * lives here (self-contained); the confirmed keywords are written back to the
 * form's `seoKeywords` array.
 */
export function SeoSection({
  form,
}: {
  form: UseFormReturn<ProductFormValues>;
}) {
  const [keywordInput, setKeywordInput] = useState("");

  function addKeyword() {
    const k = keywordInput.trim();
    if (!k) return;
    const current = form.getValues("seoKeywords") ?? [];
    if (current.includes(k)) return;
    form.setValue("seoKeywords", [...current, k]);
    setKeywordInput("");
  }

  function removeKeyword(k: string) {
    const current = form.getValues("seoKeywords") ?? [];
    form.setValue(
      "seoKeywords",
      current.filter((x) => x !== k),
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>SEO</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <FormField
          control={form.control}
          name="seoTitle"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Meta Title</FormLabel>
              <FormControl>
                <Input placeholder="Defaults to product name" {...field} />
              </FormControl>
              <FormDescription className="text-xs">
                ≤ 70 characters. Shown as Google search title.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="seoDescription"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Meta Description</FormLabel>
              <FormControl>
                <textarea
                  className="flex min-h-[60px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                  placeholder="Defaults to short description"
                  {...field}
                />
              </FormControl>
              <FormDescription className="text-xs">
                ≤ 200 characters. Shown as Google search snippet.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="seoKeywords"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Keywords</FormLabel>
              <div className="flex gap-2">
                <Input
                  value={keywordInput}
                  onChange={(e) => setKeywordInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      addKeyword();
                    }
                  }}
                  placeholder="Type and press Enter"
                />
                <Button type="button" onClick={addKeyword}>
                  Add
                </Button>
              </div>
              <div className="flex flex-wrap gap-2 pt-2">
                {(field.value ?? []).map((k) => (
                  <Badge
                    key={k}
                    variant="secondary"
                    className="flex items-center gap-1"
                  >
                    {k}
                    <button
                      type="button"
                      onClick={() => removeKeyword(k)}
                      className="hover:text-destructive"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                ))}
              </div>
              <FormMessage />
            </FormItem>
          )}
        />
      </CardContent>
    </Card>
  );
}
