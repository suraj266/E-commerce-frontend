import type { UseFormReturn } from "react-hook-form";

import { Tax } from "@/types/tax.types";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { COUNTRIES } from "@/lib/constants/countries";

import type { ProductFormValues } from "./schema";

export function TaxComplianceSection({
  form,
  taxes,
}: {
  form: UseFormReturn<ProductFormValues>;
  taxes: Tax[];
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Tax & Compliance</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <FormField
          control={form.control}
          name="taxId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Applicable Tax</FormLabel>
              {taxes.length === 0 ? (
                <p className="text-sm text-muted-foreground italic">
                  No taxes configured yet — admin can add them in /admin/taxes.
                </p>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {/* "No tax" radio — clears the selection */}
                  <label
                    className={`flex items-center gap-3 rounded-md border px-3 py-2 cursor-pointer transition ${
                      !field.value
                        ? "border-primary bg-primary/5"
                        : "border-border hover:border-foreground/30"
                    }`}
                  >
                    <input
                      type="radio"
                      name="taxId"
                      checked={!field.value}
                      onChange={() => field.onChange("")}
                      className="h-4 w-4"
                    />
                    <span className="text-sm text-muted-foreground italic">
                      None
                    </span>
                  </label>
                  {taxes.map((t) => {
                    const selected = field.value === t.id;
                    return (
                      <label
                        key={t.id}
                        className={`flex items-center gap-3 rounded-md border px-3 py-2 cursor-pointer transition ${
                          selected
                            ? "border-primary bg-primary/5"
                            : "border-border hover:border-foreground/30"
                        }`}
                      >
                        <input
                          type="radio"
                          name="taxId"
                          checked={selected}
                          onChange={() => field.onChange(t.id)}
                          className="h-4 w-4"
                        />
                        <span className="flex-1 min-w-0">
                          <span className="block font-medium text-sm truncate">
                            {t.name}
                          </span>
                          <span className="block text-xs text-muted-foreground font-mono">
                            {Number(t.rate).toFixed(2)}%
                          </span>
                        </span>
                      </label>
                    );
                  })}
                </div>
              )}
              <FormDescription className="text-xs">
                Pick the tax rate that applies to this product. Admin manages the
                catalog at /admin/taxes.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="hsnCode"
          render={({ field }) => (
            <FormItem>
              <FormLabel>HSN Code *</FormLabel>
              <FormControl>
                <Input
                  placeholder="e.g. 8517 or 851712 or 85171290"
                  inputMode="numeric"
                  maxLength={8}
                  {...field}
                />
              </FormControl>
              <FormDescription className="text-xs">
                4, 6, or 8-digit Harmonized System of Nomenclature code. Required
                to publish — every tax invoice prints this.{" "}
                <a
                  href="https://services.gst.gov.in/services/searchhsnsac"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary hover:underline"
                >
                  Search HSN
                </a>
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="countryOfOrigin"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Country of origin *</FormLabel>
              <Select onValueChange={field.onChange} value={field.value || ""}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select country…" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent className="max-h-80">
                  {COUNTRIES.map((c) => (
                    <SelectItem key={c.code} value={c.code}>
                      {c.name} ({c.code})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormDescription className="text-xs">
                Required by Consumer Protection (E-Commerce) Rules 2020. Surfaced
                on the product page and tax invoice.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Note: the entered price is always the pre-tax BASE; GST is
            added on top at checkout, and the "show price with tax" site
            setting controls whether the storefront displays the price
            inclusive of GST. (The legacy isPriceTaxInclusive flag no
            longer affects pricing.) */}
        <p className="text-xs text-muted-foreground">
          Enter the <strong>pre-tax base price</strong>. GST is added on top at
          checkout based on the product&apos;s tax rate.
        </p>
      </CardContent>
    </Card>
  );
}
