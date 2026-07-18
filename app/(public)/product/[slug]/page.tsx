/**
 * Public Product Detail Page — /product/[slug]  (Server Component)
 *
 * Server-renders SEO metadata (title / description / canonical / Open Graph)
 * and Product + BreadcrumbList JSON-LD, then hands the product data to the
 * interactive client island (`product-detail-client.tsx`) which owns the
 * gallery, variant picker, add-to-cart and sticky buy bar.
 *
 * A missing or non-ACTIVE product renders the 404 page via `notFound()`.
 */

import { cache } from "react";
import { print } from "graphql";
import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { GET_PUBLIC_PRODUCT } from "@/lib/graphql/products";
import type { GetPublicProductData, Product } from "@/types/product.types";
import { serverGraphQL } from "@/lib/graphql/server-fetch";
import { absoluteUrl, getSiteName } from "@/lib/seo/site";
import { JsonLd } from "@/lib/seo/json-ld";

import { ProductDetailClient } from "./product-detail-client";

const PRODUCT_QUERY = print(GET_PUBLIC_PRODUCT);

// Memoized per request so `generateMetadata` and the page body share one fetch.
const loadProduct = cache(async (slug: string): Promise<Product | null> => {
  const data = await serverGraphQL<GetPublicProductData>(PRODUCT_QUERY, {
    slug,
  });
  const product = data?.publicProduct ?? null;
  if (!product || product.status !== "ACTIVE") return null;
  return product;
});

function primaryImageUrl(product: Product): string | undefined {
  const images = product.images ?? [];
  const primary = images.find((i) => i.isPrimary) ?? images[0];
  return primary?.imageUrl;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const product = await loadProduct(slug);
  if (!product) return {};

  const title = product.seoTitle || product.name;
  const description =
    product.seoDescription ||
    product.shortDescription ||
    `Buy ${product.name} online.`;
  const canonical = absoluteUrl(`/product/${product.slug}`);
  const image = primaryImageUrl(product);

  return {
    title,
    description,
    keywords: product.seoKeywords?.length ? product.seoKeywords : undefined,
    alternates: { canonical },
    openGraph: {
      type: "website",
      title,
      description,
      url: canonical,
      images: image ? [{ url: image, alt: product.name }] : undefined,
    },
    twitter: {
      card: image ? "summary_large_image" : "summary",
      title,
      description,
      images: image ? [image] : undefined,
    },
  };
}

export default async function PublicProductPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const product = await loadProduct(slug);
  if (!product) notFound();

  const siteName = await getSiteName();
  const canonical = absoluteUrl(`/product/${product.slug}`);
  const currency =
    (product as unknown as { metadata?: { currencyCode?: string } }).metadata
      ?.currencyCode ?? "INR";
  const price = product.priceWithTax ?? product.price;
  const inStock = (product.variants ?? []).some(
    (v) => (v.availableQuantity ?? 0) > 0,
  );

  const productLd: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description:
      product.seoDescription || product.shortDescription || undefined,
    sku: product.sku || undefined,
    image: (product.images ?? []).map((i) => i.imageUrl),
    ...(product.brand
      ? { brand: { "@type": "Brand", name: product.brand.name } }
      : {}),
    ...(price != null
      ? {
          offers: {
            "@type": "Offer",
            price,
            priceCurrency: currency,
            availability: inStock
              ? "https://schema.org/InStock"
              : "https://schema.org/OutOfStock",
            url: canonical,
          },
        }
      : {}),
  };

  const breadcrumbLd: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: siteName, item: absoluteUrl("/") },
      ...(product.category
        ? [
            {
              "@type": "ListItem",
              position: 2,
              name: product.category.name,
              item: absoluteUrl(`/category/${product.category.slug}`),
            },
            {
              "@type": "ListItem",
              position: 3,
              name: product.name,
              item: canonical,
            },
          ]
        : [
            {
              "@type": "ListItem",
              position: 2,
              name: product.name,
              item: canonical,
            },
          ]),
    ],
  };

  return (
    <>
      <JsonLd data={productLd} />
      <JsonLd data={breadcrumbLd} />
      <ProductDetailClient product={product} />
    </>
  );
}
