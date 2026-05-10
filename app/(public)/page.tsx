"use client";

/**
 * Public homepage at `/`.
 *
 * CMS-driven: fetches the `home` slug via `publicPage` and renders its
 * blocks. Falls back to a minimal welcome screen if the page isn't seeded
 * yet (e.g. fresh DB) so the site is never broken.
 */

import { useEffect } from "react";
import Link from "next/link";
import { useQuery } from "@apollo/client/react";

import { GET_PUBLIC_PAGE } from "@/lib/graphql/pages";
import { GetPublicPageData, parseBlocks } from "@/types/page.types";
import { BlockRenderer } from "@/components/page-builder/block-renderer";
import { Button } from "@/components/ui/button";

const HOME_SLUG = "home";

export default function Home() {
  const { data, loading, error } = useQuery<GetPublicPageData>(
    GET_PUBLIC_PAGE,
    {
      variables: { slug: HOME_SLUG },
      fetchPolicy: "cache-and-network",
      errorPolicy: "ignore",
    },
  );

  useEffect(() => {
    const page = data?.publicPage;
    if (!page) return;
    const t = page.metaTitle ?? page.title;
    if (t) document.title = t;
  }, [data]);

  if (loading && !data) {
    return (
      <div className="px-4 py-12 max-w-6xl mx-auto space-y-3">
        <div className="h-64 w-full bg-muted animate-pulse rounded" />
        <div className="h-32 w-full bg-muted animate-pulse rounded" />
      </div>
    );
  }

  const page = data?.publicPage;
  if (page) {
    const blocks = parseBlocks(page.blocks);
    return <BlockRenderer blocks={blocks} />;
  }

  // Fallback when no `home` page is published yet — keeps the site usable
  // before the admin builds the homepage in /admin/pages.
  if (error || !page) {
    return (
      <div className="flex flex-col items-center justify-center px-6 py-20 sm:py-32">
        <div className="z-10 max-w-3xl w-full text-center space-y-6">
          <h1 className="text-4xl sm:text-5xl font-bold tracking-tight">
            Welcome
          </h1>
          <p className="text-muted-foreground max-w-lg mx-auto text-lg">
            Build the homepage in <code>/admin/pages</code>. Create a page with
            slug <code>home</code> and publish it to take over this view.
          </p>
          <div className="flex flex-wrap gap-3 justify-center pt-2">
            <Button size="lg" className="px-8" asChild>
              <Link href="/shop">Browse Products</Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link href="/login">Login</Link>
            </Button>
          </div>
        </div>
      </div>
    );
  }
}
