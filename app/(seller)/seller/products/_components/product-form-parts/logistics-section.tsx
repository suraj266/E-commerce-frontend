import type { UseFormReturn } from "react-hook-form";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

import type { ProductFormValues } from "./schema";

export function LogisticsSection({
  form,
}: {
  form: UseFormReturn<ProductFormValues>;
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Logistics</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <FormField
            control={form.control}
            name="weight"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Weight (kg)</FormLabel>
                <FormControl>
                  <Input type="number" min={0} step={0.01} {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="length"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Length (cm)</FormLabel>
                <FormControl>
                  <Input type="number" min={0} step={0.01} {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="width"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Width (cm)</FormLabel>
                <FormControl>
                  <Input type="number" min={0} step={0.01} {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="height"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Height (cm)</FormLabel>
                <FormControl>
                  <Input type="number" min={0} step={0.01} {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="isDigital"
          render={({ field }) => (
            <FormItem className="flex items-center gap-2">
              <FormControl>
                <input
                  type="checkbox"
                  checked={field.value}
                  onChange={field.onChange}
                  className="h-4 w-4"
                />
              </FormControl>
              <FormLabel className="!m-0">
                This is a digital product (no shipping)
              </FormLabel>
            </FormItem>
          )}
        />

        <div className="rounded-lg border border-primary/25 bg-primary/5 p-3">
          <FormField
            control={form.control}
            name="isCustomizable"
            render={({ field }) => (
              <FormItem className="flex items-center gap-2">
                <FormControl>
                  <input
                    type="checkbox"
                    checked={field.value}
                    onChange={field.onChange}
                    className="h-4 w-4"
                  />
                </FormControl>
                <FormLabel className="!m-0 font-semibold">
                  Personalized print — customers upload their own image
                </FormLabel>
              </FormItem>
            )}
          />
          <p className="mt-2 text-xs text-muted-foreground">
            Turns the product page into an upload-your-photo flow: the customer
            uploads an image, crops it to the chosen size, and only sizes their
            image can print sharply are offered. Make this a{" "}
            <span className="font-medium">Variable</span> product and name its
            size variants <span className="font-mono">A4 / A3 / A2 / A1</span> —
            each size&apos;s print resolution is derived from the name. Leave off
            for ordinary products.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
