"use client";

/**
 * Product create/edit form — shared by /new and /[id].
 *
 * This is the orchestrator: it owns the shared react-hook-form instance, the
 * reference-data queries, the create/update mutations and the submit handler,
 * then composes the section components in `./product-form-parts`. Each section
 * is a cohesive < 400-LOC unit:
 *   BasicsSection · ProductTypeSection · MediaSection · PricingSection ·
 *   TagsSection · SpecificationsSection · LogisticsSection ·
 *   TaxComplianceSection · SeoSection · StatusSection
 *
 * 8 visible sections, each in a Card:
 *   1. Basics       — name, slug, store, category, brand, descriptions
 *   2. Media        — image gallery (drag-drop add via ImageUploader)
 *   3. Pricing      — price, compare price, cost price, SKU
 *   4. Tags         — multi-select chip picker (+ labels)
 *   5. Specifications — dynamic groups + items
 *   6. Logistics    — weight, dims, isDigital
 *   7. SEO          — title, description, keywords
 *   8. Status       — DRAFT / ACTIVE / INACTIVE (+ delete in edit mode)
 *
 * Path A pricing: form has flat `price`/`sku`. Backend creates the implicit
 * variant transparently.
 */

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useMutation, useQuery } from "@apollo/client/react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@/lib/forms/zod-resolver";
import { toast } from "sonner";
import { Box, ChevronLeft, ExternalLink, Loader2, Save } from "lucide-react";

import { GET_BRANDS } from "@/lib/graphql/brands";
import { GET_TAGS } from "@/lib/graphql/tags";
import { GET_LABELS } from "@/lib/graphql/labels";
import type { Label } from "@/types/label.types";
import { GET_MY_STORES } from "@/lib/graphql/stores";
import { GET_TAXES } from "@/lib/graphql/taxes";
import {
  CREATE_MY_PRODUCT,
  GET_MY_PRODUCTS,
  UPDATE_MY_PRODUCT,
} from "@/lib/graphql/products";

import {
  CreateMyProductData,
  parseSpecifications,
  Product,
  ProductImage,
  PRODUCT_STATUS_LABEL,
  serializeSpecifications,
  Specifications,
  UpdateMyProductData,
} from "@/types/product.types";
import { Brand } from "@/types/brand.types";
import { Tag } from "@/types/tag.types";
import { Store } from "@/types/store.types";
import { Tax, GetTaxesData } from "@/types/tax.types";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";

import { productSchema, type ProductFormValues } from "./product-form-parts/schema";
import { BasicsSection } from "./product-form-parts/basics-section";
import { ProductTypeSection } from "./product-form-parts/product-type-section";
import { MediaSection } from "./product-form-parts/media-section";
import { PricingSection } from "./product-form-parts/pricing-section";
import { TagsSection } from "./product-form-parts/tags-section";
import { SpecificationsSection } from "./product-form-parts/specifications-section";
import { LogisticsSection } from "./product-form-parts/logistics-section";
import { TaxComplianceSection } from "./product-form-parts/tax-compliance-section";
import { SeoSection } from "./product-form-parts/seo-section";
import { StatusSection } from "./product-form-parts/status-section";

// ===========================================================================
interface ProductFormProps {
  /** Existing product being edited (omit for create). */
  product?: Product;
}

export function ProductForm({ product }: ProductFormProps) {
  const router = useRouter();
  const isEdit = !!product;

  // -- Reference data --
  const { data: storesData } = useQuery<{ myStores: Store[] }>(GET_MY_STORES, {
    fetchPolicy: "cache-and-network",
  });
  const { data: brandsData } = useQuery<{ brands: Brand[] }>(GET_BRANDS, {
    fetchPolicy: "cache-first",
  });
  // Categories are fetched lazily by the CategoryCascader per level; no need
  // for a top-level full-tree query here anymore.
  const { data: labelsData } = useQuery<{ labels: Label[] }>(GET_LABELS, {
    fetchPolicy: "cache-first",
  });
  const { data: tagsData } = useQuery<{ tags: Tag[] }>(GET_TAGS, {
    fetchPolicy: "cache-first",
  });
  const { data: taxesData } = useQuery<GetTaxesData>(GET_TAXES, {
    fetchPolicy: "cache-and-network",
  });

  const stores = storesData?.myStores ?? [];
  const activeStores = stores.filter((s) => s.status === "ACTIVE");
  const brands = brandsData?.brands ?? [];
  const tags = tagsData?.tags ?? [];
  const allLabels = labelsData?.labels ?? [];
  const manualLabels = allLabels.filter((l) => l.type === "MANUAL");
  const autoLabels = allLabels.filter((l) => l.type === "AUTO");
  const taxes: Tax[] = taxesData?.taxes ?? [];

  // -- Specifications state (separate from form because dynamic) --
  const [specs, setSpecs] = useState<Specifications>(() =>
    product ? parseSpecifications(product.specifications) : [],
  );

  // -- Image state — for edit mode, shows existing images with reorder/delete --
  const [images, setImages] = useState<ProductImage[]>(product?.images ?? []);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const form = useForm<ProductFormValues>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      storeId: product?.storeId ?? "",
      name: product?.name ?? "",
      slug: product?.slug ?? "",
      categoryId: product?.categoryId ?? "",
      brandId: product?.brandId ?? "",
      shortDescription: product?.shortDescription ?? "",
      description: product?.description ?? "",
      productType: (product?.productType as "SIMPLE" | "VARIABLE") ?? "SIMPLE",
      price: product?.price ?? "",
      compareAtPrice: product?.compareAtPrice ?? "",
      costPrice: product?.costPrice ?? "",
      sku: product?.sku ?? "",
      weight: product?.weight ?? "",
      length: product?.length ?? "",
      width: product?.width ?? "",
      height: product?.height ?? "",
      isDigital: product?.isDigital ?? false,
      taxId: product?.taxId ?? "",
      hsnCode: product?.hsnCode ?? "",
      countryOfOrigin: product?.countryOfOrigin ?? "IN",
      isPriceTaxInclusive: product?.isPriceTaxInclusive ?? true,
      seoTitle: product?.seoTitle ?? "",
      seoDescription: product?.seoDescription ?? "",
      seoKeywords: product?.seoKeywords ?? [],
      tagIds: product?.tags?.map((t) => t.id) ?? [],
      labelIds: product?.assignedLabelIds ?? [],
    },
  });

  // Default to the first ACTIVE store on create
  useEffect(() => {
    if (!isEdit && !form.getValues("storeId") && activeStores[0]) {
      form.setValue("storeId", activeStores[0].id);
    }
  }, [activeStores, form, isEdit]);

  // -- Mutations --
  const [createMyProduct, { loading: creating }] = useMutation<CreateMyProductData>(
    CREATE_MY_PRODUCT,
    {
      refetchQueries: [{ query: GET_MY_PRODUCTS, variables: { status: null } }],
    },
  );

  const [updateMyProduct, { loading: updating }] = useMutation<UpdateMyProductData>(
    UPDATE_MY_PRODUCT,
    {
      refetchQueries: [{ query: GET_MY_PRODUCTS, variables: { status: null } }],
    },
  );

  // Save action
  async function onSubmit(values: ProductFormValues) {
    const isVariable = values.productType === "VARIABLE";
    const baseInput = {
      name: values.name,
      slug: values.slug || undefined,
      categoryId: values.categoryId || undefined,
      brandId: values.brandId || undefined,
      shortDescription: values.shortDescription || undefined,
      description: values.description || undefined,
      // Pricing only for SIMPLE — VARIABLE products price per variant
      price: isVariable ? undefined : values.price === "" ? 0 : Number(values.price),
      compareAtPrice:
        isVariable || values.compareAtPrice === ""
          ? undefined
          : Number(values.compareAtPrice),
      costPrice:
        isVariable || values.costPrice === ""
          ? undefined
          : Number(values.costPrice),
      sku: isVariable ? undefined : values.sku || undefined,
      weight: values.weight === "" ? undefined : Number(values.weight),
      length: values.length === "" ? undefined : Number(values.length),
      width: values.width === "" ? undefined : Number(values.width),
      height: values.height === "" ? undefined : Number(values.height),
      isDigital: values.isDigital,
      taxId: values.taxId || undefined,
      hsnCode: values.hsnCode || undefined,
      countryOfOrigin: values.countryOfOrigin || undefined,
      isPriceTaxInclusive: values.isPriceTaxInclusive,
      seoTitle: values.seoTitle || undefined,
      seoDescription: values.seoDescription || undefined,
      seoKeywords: values.seoKeywords,
      specifications: serializeSpecifications(specs),
      tagIds: values.tagIds,
      labelIds: values.labelIds,
    };

    try {
      if (isEdit && product) {
        await updateMyProduct({
          variables: {
            updateProductInput: { id: product.id, ...baseInput },
          },
        });
        toast.success("Product updated");
      } else {
        const res = await createMyProduct({
          variables: {
            createProductInput: {
              storeId: values.storeId,
              productType: values.productType,
              ...baseInput,
            },
          },
        });
        const newId = res.data?.createMyProduct.id;
        if (newId) {
          if (isVariable) {
            toast.success("Product created — now configure variants");
            router.push(`/seller/products/${newId}/variants`);
          } else {
            toast.success("Product created — now add images and publish");
            router.push(`/seller/products/${newId}`);
          }
        }
      }
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Save failed";
      toast.error(msg);
    }
  }

  const isSaving = creating || updating;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <Button variant="ghost" size="sm" asChild>
          <Link href="/seller/products">
            <ChevronLeft className="mr-1 h-4 w-4" />
            All products
          </Link>
        </Button>

        {isEdit && product && (
          <div className="flex items-center gap-2 flex-wrap">
            <Badge variant="outline" className="text-xs">
              {PRODUCT_STATUS_LABEL[product.status]}
            </Badge>
            {product.status === "ACTIVE" && (
              <Button variant="outline" size="sm" asChild>
                <Link href={`/product/${product.slug}`} target="_blank">
                  <ExternalLink className="mr-1 h-3 w-3" />
                  View
                </Link>
              </Button>
            )}
          </div>
        )}
      </div>

      <div>
        <h1 className="text-2xl font-bold tracking-tight flex items-center gap-2">
          <Box className="h-6 w-6 text-primary" />
          {isEdit ? `Edit ${product?.name ?? "Product"}` : "Add Product"}
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          {isEdit
            ? "Update fields. Status and image management at the bottom."
            : "Create as DRAFT first. Add images + publish on the next screen."}
        </p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <BasicsSection
            form={form}
            isEdit={isEdit}
            activeStores={activeStores}
            brands={brands}
          />

          <ProductTypeSection form={form} isEdit={isEdit} product={product} />

          <MediaSection
            isEdit={isEdit}
            product={product}
            images={images}
            onImagesChange={setImages}
          />

          <PricingSection form={form} />

          <TagsSection
            form={form}
            tags={tags}
            manualLabels={manualLabels}
            autoLabels={autoLabels}
          />

          <SpecificationsSection specs={specs} onChange={setSpecs} />

          <LogisticsSection form={form} />

          <TaxComplianceSection form={form} taxes={taxes} />

          <SeoSection form={form} />

          {isEdit && product && <StatusSection product={product} />}

          {/* -------------------- Sticky save bar -------------------- */}
          <div className="sticky bottom-0 -mx-4 sm:-mx-0 bg-background/95 backdrop-blur border-t py-3 px-4 flex justify-end gap-2">
            <Button type="button" variant="outline" asChild>
              <Link href="/seller/products">Cancel</Link>
            </Button>
            <Button type="submit" disabled={isSaving}>
              {isSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              <Save className="mr-2 h-4 w-4" />
              {isEdit ? "Save changes" : "Create as Draft"}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
