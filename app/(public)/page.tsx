/**
 * Public homepage at `/`.  (Server Component)
 *
 * CMS-driven: server-fetches the `home` slug via `publicPage` and renders its
 * blocks through the (client) BlockRenderer. Metadata comes from the page's
 * meta fields, and WebSite JSON-LD (with SearchAction) is emitted for rich
 * results. Falls back to a minimal welcome screen when the page isn't seeded
 * yet, so the site is never broken.
 */

import { cache } from "react";
import { print } from "graphql";
import type { Metadata } from "next";
import Link from "next/link";

import { GET_PUBLIC_PAGE } from "@/lib/graphql/pages";
import { GetPublicPageData, parseBlocks } from "@/types/page.types";
import { BlockRenderer } from "@/components/page-builder/block-renderer";
import { Button } from "@/components/ui/button";
import { serverGraphQL } from "@/lib/graphql/server-fetch";
import { absoluteUrl, getSiteName } from "@/lib/seo/site";
import { JsonLd } from "@/lib/seo/json-ld";

const HOME_SLUG = "home";
const HOME_QUERY = print(GET_PUBLIC_PAGE);

// Memoized per request so `generateMetadata` and the page body share one fetch.
const loadHomePage = cache(async () => {
  const data = await serverGraphQL<GetPublicPageData>(HOME_QUERY, {
    slug: HOME_SLUG,
  });
  return data?.publicPage ?? null;
});

export async function generateMetadata(): Promise<Metadata> {
  const [page, siteName] = await Promise.all([loadHomePage(), getSiteName()]);
  const title = page?.metaTitle || page?.title;
  const description =
    page?.metaDesc || `${siteName} — shop across categories and sellers.`;
  const canonical = absoluteUrl("/");

  return {
    // The home page owns the brand title itself (ignores the "%s | brand"
    // template) so it renders as just the site name, not "Home | brand".
    title: title ? title : { absolute: siteName },
    description,
    alternates: { canonical },
    openGraph: {
      type: "website",
      title: title || siteName,
      description,
      url: canonical,
      siteName,
    },
  };
}

export default async function Home() {
  const [page, siteName] = await Promise.all([loadHomePage(), getSiteName()]);

  const websiteLd: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: siteName,
    url: absoluteUrl("/"),
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: absoluteUrl("/search?q={search_term_string}"),
      },
      "query-input": "required name=search_term_string",
    },
  };

  if (page) {
    const blocks = parseBlocks(page.blocks);
    return (
      <>
        <JsonLd data={websiteLd} />
        <BlockRenderer blocks={blocks} />
      </>
    );
  }

  // Fallback when no `home` page is published yet — keeps the site usable
  // before the admin builds the homepage in /admin/pages.
  return (
    <>
      <JsonLd data={websiteLd} />
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
    </>
  );
}
