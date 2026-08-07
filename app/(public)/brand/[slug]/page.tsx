/**
 * Public Brand Page — /brand/[slug]  (Server Component)
 *
 * Server-renders SEO metadata (title / description / canonical / Open Graph)
 * and BreadcrumbList JSON-LD, then hands the brand record to the interactive
 * client island (`brand-client.tsx`) which owns the brand header, filter
 * sidebar, sort, pagination and the real product grid.
 *
 * An unknown / inactive brand renders the 404 page via `notFound()` — the same
 * SSR pattern the /category and /product routes use (was a client-only stub).
 */

import { cache } from "react";
import { print } from "graphql";
import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { GET_PUBLIC_BRAND } from "@/lib/graphql/brands";
import type { Brand } from "@/types/brand.types";
import { serverGraphQL } from "@/lib/graphql/server-fetch";
import { absoluteUrl, getSiteName } from "@/lib/seo/site";
import { JsonLd } from "@/lib/seo/json-ld";

import { BrandClient } from "./brand-client";

const BRAND_QUERY = print(GET_PUBLIC_BRAND);

interface GetPublicBrandData {
  publicBrand: Brand | null;
}

// Memoized per request so `generateMetadata` and the page body share one fetch.
const loadBrand = cache(async (slug: string): Promise<Brand | null> => {
  const data = await serverGraphQL<GetPublicBrandData>(BRAND_QUERY, { slug });
  return data?.publicBrand ?? null;
});

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const brand = await loadBrand(slug);
  if (!brand) return {};

  const siteName = await getSiteName();
  const title = brand.name;
  const description =
    brand.description || `Shop ${brand.name} products on ${siteName}.`;
  const canonical = absoluteUrl(`/brand/${brand.slug}`);
  const image = brand.bannerUrl || brand.logoUrl || undefined;

  return {
    title,
    description,
    alternates: { canonical },
    openGraph: {
      type: "website",
      title,
      description,
      url: canonical,
      images: image ? [{ url: image, alt: brand.name }] : undefined,
    },
  };
}

export default async function BrandPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const brand = await loadBrand(slug);
  if (!brand) notFound();

  const siteName = await getSiteName();
  const breadcrumbLd: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: siteName, item: absoluteUrl("/") },
      { "@type": "ListItem", position: 2, name: "Shop", item: absoluteUrl("/shop") },
      {
        "@type": "ListItem",
        position: 3,
        name: brand.name,
        item: absoluteUrl(`/brand/${brand.slug}`),
      },
    ],
  };

  return (
    <>
      <JsonLd data={breadcrumbLd} />
      <BrandClient brand={brand} slug={slug} />
    </>
  );
}
