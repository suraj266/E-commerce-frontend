import Link from "next/link";
import type { UseFormReturn } from "react-hook-form";

import { Product } from "@/types/product.types";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  FormDescription,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";

import type { ProductFormValues } from "./schema";

/**
 * Product Type — a create-time chooser (Simple vs Variable), locked once the
 * product exists. In edit mode it renders a read-only summary + variant link.
 */
export function ProductTypeSection({
  form,
  isEdit,
  product,
}: {
  form: UseFormReturn<ProductFormValues>;
  isEdit: boolean;
  product?: Product;
}) {
  if (isEdit && product) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Product Type</CardTitle>
        </CardHeader>
        <CardContent className="flex items-center justify-between">
          <div>
            <div className="font-semibold">{product.productType}</div>
            <div className="text-xs text-muted-foreground mt-0.5">
              {product.productType === "VARIABLE"
                ? "Manage variants below"
                : "Single SKU product"}
            </div>
          </div>
          {product.productType === "VARIABLE" && (
            <Button asChild variant="outline" size="sm">
              <Link href={`/seller/products/${product.id}/variants`}>
                Manage variants
              </Link>
            </Button>
          )}
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Product Type</CardTitle>
      </CardHeader>
      <CardContent>
        <FormField
          control={form.control}
          name="productType"
          render={({ field }) => (
            <FormItem>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => field.onChange("SIMPLE")}
                  className={`text-left rounded-md border p-4 transition ${
                    field.value === "SIMPLE"
                      ? "border-primary ring-2 ring-primary bg-primary/5"
                      : "border-border hover:border-foreground/40"
                  }`}
                >
                  <div className="font-semibold">Simple</div>
                  <div className="text-xs text-muted-foreground mt-1">
                    One SKU, one price. Easiest to set up.
                  </div>
                </button>
                <button
                  type="button"
                  onClick={() => field.onChange("VARIABLE")}
                  className={`text-left rounded-md border p-4 transition ${
                    field.value === "VARIABLE"
                      ? "border-primary ring-2 ring-primary bg-primary/5"
                      : "border-border hover:border-foreground/40"
                  }`}
                >
                  <div className="font-semibold">Variable</div>
                  <div className="text-xs text-muted-foreground mt-1">
                    Multiple variants by Color/Size/etc. Configure on the next
                    screen.
                  </div>
                </button>
              </div>
              <FormDescription className="text-xs mt-2">
                Type is locked once the product is created.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
      </CardContent>
    </Card>
  );
}
