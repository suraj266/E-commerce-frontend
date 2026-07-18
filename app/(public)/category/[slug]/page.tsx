/**
 * /category/[slug] — SEO-friendly category landing page.  (Server Component)
 *
 * Server-renders metadata (title / description / canonical / Open Graph) and
 * BreadcrumbList JSON-LD, then hands the category record to the interactive
 * client island (`category-client.tsx`) which owns the filter sidebar, sort,
 * pagination and product grid.
 *
 * An unknown / inactive category renders the 404 page via `notFound()`.
 */

import { cache } from "react";
import { print } from "graphql";
import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { GET_PUBLIC_CATEGORY_BY_SLUG } from "@/lib/graphql/categories";
import type {
  Category,
  GetPublicCategoryBySlugData,
} from "@/types/category.types";
import { serverGraphQL } from "@/lib/graphql/server-fetch";
import { absoluteUrl, getSiteName } from "@/lib/seo/site";
import { JsonLd } from "@/lib/seo/json-ld";

import { CategoryClient } from "./category-client";

const CATEGORY_QUERY = print(GET_PUBLIC_CATEGORY_BY_SLUG);

// Memoized per request so `generateMetadata` and the page body share one fetch.
const loadCategory = cache(async (slug: string): Promise<Category | null> => {
  const data = await serverGraphQL<GetPublicCategoryBySlugData>(
    CATEGORY_QUERY,
    { slug },
  );
  return data?.publicCategoryBySlug ?? null;
});

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const category = await loadCategory(slug);
  if (!category) return {};

  const siteName = await getSiteName();
  const title = category.name;
  const description =
    category.description || `Shop ${category.name} on ${siteName}.`;
  const canonical = absoluteUrl(`/category/${category.slug}`);

  return {
    title,
    description,
    alternates: { canonical },
    openGraph: {
      type: "website",
      title,
      description,
      url: canonical,
      images: category.imageUrl
        ? [{ url: category.imageUrl, alt: category.name }]
        : undefined,
    },
  };
}

export default async function CategoryPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const category = await loadCategory(slug);
  if (!category) notFound();

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
        name: category.name,
        item: absoluteUrl(`/category/${category.slug}`),
      },
    ],
  };

  return (
    <>
      <JsonLd data={breadcrumbLd} />
      <CategoryClient category={category} slug={slug} />
    </>
  );
}
