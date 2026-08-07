/**
 * Public Tag Page — /tag/[slug]  (Server Component)
 *
 * Server-renders SEO metadata (title / description / canonical / Open Graph)
 * and BreadcrumbList JSON-LD, then hands the tag record to the interactive
 * client island (`tag-client.tsx`) which owns the filter sidebar, sort,
 * pagination and the real product grid filtered by this tag.
 *
 * An unknown / inactive tag renders the 404 page via `notFound()` — the same
 * SSR pattern the /category and /product routes use (was a client-only stub).
 */

import { cache } from "react";
import { print } from "graphql";
import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { GET_PUBLIC_TAG } from "@/lib/graphql/tags";
import type { Tag } from "@/types/tag.types";
import { serverGraphQL } from "@/lib/graphql/server-fetch";
import { absoluteUrl, getSiteName } from "@/lib/seo/site";
import { JsonLd } from "@/lib/seo/json-ld";

import { TagClient } from "./tag-client";

const TAG_QUERY = print(GET_PUBLIC_TAG);

interface GetPublicTagData {
  publicTag: Tag | null;
}

// Memoized per request so `generateMetadata` and the page body share one fetch.
const loadTag = cache(async (slug: string): Promise<Tag | null> => {
  const data = await serverGraphQL<GetPublicTagData>(TAG_QUERY, { slug });
  return data?.publicTag ?? null;
});

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const tag = await loadTag(slug);
  if (!tag) return {};

  const siteName = await getSiteName();
  const title = `#${tag.name}`;
  const description =
    tag.description || `Shop products tagged #${tag.name} on ${siteName}.`;
  const canonical = absoluteUrl(`/tag/${tag.slug}`);

  return {
    title,
    description,
    alternates: { canonical },
    openGraph: {
      type: "website",
      title,
      description,
      url: canonical,
    },
  };
}

export default async function TagPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const tag = await loadTag(slug);
  if (!tag) notFound();

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
        name: `#${tag.name}`,
        item: absoluteUrl(`/tag/${tag.slug}`),
      },
    ],
  };

  return (
    <>
      <JsonLd data={breadcrumbLd} />
      <TagClient tag={tag} slug={slug} />
    </>
  );
}
