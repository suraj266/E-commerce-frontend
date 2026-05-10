/**
 * Public CMS page renderer — /[slug]
 *
 * Looks up `publicPage(slug)` and renders the blocks via BlockRenderer.
 * Returns notFound() if the slug doesn't resolve to a PUBLISHED page.
 *
 * Note on routing: Next.js prefers explicit static routes over dynamic
 * `[slug]`, so `/product/[slug]`, `/brand/[slug]`, `/store/[slug]`,
 * `/tag/[slug]` continue to work — this catch-all only fires for slugs
 * that don't match a sibling. Backend ALSO blocks reserved slugs at
 * create-time (see RESERVED_SLUGS in backend page.service.ts).
 */

"use client";

import { useEffect } from "react";
import { useParams } from "next/navigation";
import { useQuery } from "@apollo/client/react";

import { GET_PUBLIC_PAGE } from "@/lib/graphql/pages";
import { GetPublicPageData, parseBlocks } from "@/types/page.types";
import { BlockRenderer } from "@/components/page-builder/block-renderer";

export default function PublicCmsPage() {
  const params = useParams<{ slug: string }>();
  const slug = params.slug;

  const { data, loading, error } = useQuery<GetPublicPageData>(
    GET_PUBLIC_PAGE,
    {
      variables: { slug },
      fetchPolicy: "cache-and-network",
    },
  );

  // Set document title from the page meta — keeps SEO basic in client mode.
  useEffect(() => {
    const page = data?.publicPage;
    if (!page) return;
    const t = page.metaTitle ?? page.title;
    if (t) document.title = t;
  }, [data]);

  if (loading && !data) {
    return (
      <div className="px-4 py-12 max-w-6xl mx-auto space-y-3">
        <div className="h-8 w-1/3 bg-muted animate-pulse rounded" />
        <div className="h-64 w-full bg-muted animate-pulse rounded" />
      </div>
    );
  }

  if (error || !data?.publicPage) {
    return (
      <div className="px-4 py-20 max-w-2xl mx-auto text-center space-y-3">
        <h1 className="text-3xl font-bold">Page not found</h1>
        <p className="text-muted-foreground">
          This page is unavailable or hasn&apos;t been published yet.
        </p>
      </div>
    );
  }

  const page = data.publicPage;
  const blocks = parseBlocks(page.blocks);

  return <BlockRenderer blocks={blocks} />;
}
