/**
 * Edit Product — /seller/products/[id]
 *
 * Loads the seller's own product, then renders the same ProductForm in edit
 * mode (which adds the images section, status workflow, and danger zone).
 */

"use client";

import { useEffect } from "react";
import { useParams } from "next/navigation";
import { useQuery } from "@apollo/client/react";
import { toast } from "sonner";

import { GET_MY_PRODUCT } from "@/lib/graphql/products";
import { GetMyProductData } from "@/types/product.types";

import { Card, CardContent } from "@/components/ui/card";
import { useSetPageTitle } from "@/components/shell/page-title-context";
import { ProductForm } from "../_components/product-form";

export default function EditProductPage() {
  const params = useParams<{ id: string }>();
  const id = params.id;

  const { data, loading, error } = useQuery<GetMyProductData>(GET_MY_PRODUCT, {
    variables: { id },
    fetchPolicy: "cache-and-network",
  });

  useSetPageTitle("Edit product");

  useEffect(() => {
    if (error) toast.error(`Failed to load: ${error.message}`);
  }, [error]);

  if (loading) {
    return <div className="h-96 animate-pulse rounded-lg bg-muted" />;
  }

  if (!data?.myProduct) {
    return (
      <Card>
        <CardContent className="py-12 text-center text-muted-foreground">
          Product not found.
        </CardContent>
      </Card>
    );
  }

  return <ProductForm product={data.myProduct} />;
}
