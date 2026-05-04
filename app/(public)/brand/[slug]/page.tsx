/**
 * Public Brand Page — /brand/[slug]
 *
 * Phase 1 placeholder: shows brand name, logo, banner, description.
 * Sprint 2.4d will fill in products grid filtered by this brand.
 */

"use client";

import { useEffect } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useQuery } from "@apollo/client/react";
import { Globe, Tag as BrandIcon } from "lucide-react";

import { GET_PUBLIC_BRAND } from "@/lib/graphql/brands";
import { Brand } from "@/types/brand.types";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface GetPublicBrandData {
  publicBrand: Brand;
}

export default function PublicBrandPage() {
  const params = useParams<{ slug: string }>();
  const slug = params.slug;

  const { data, loading, error } = useQuery<GetPublicBrandData>(
    GET_PUBLIC_BRAND,
    { variables: { slug }, errorPolicy: "all" },
  );

  useEffect(() => {
    if (typeof document !== "undefined" && data?.publicBrand) {
      document.title = `${data.publicBrand.name} | MultiMart`;
    }
  }, [data?.publicBrand]);

  if (loading) {
    return (
      <div className="max-w-5xl mx-auto p-8">
        <div className="h-48 animate-pulse rounded-lg bg-muted" />
      </div>
    );
  }

  if (error || !data?.publicBrand) {
    return (
      <div className="max-w-5xl mx-auto p-8">
        <Card>
          <CardContent className="py-12 text-center space-y-3">
            <BrandIcon className="h-12 w-12 mx-auto text-muted-foreground/50" />
            <h1 className="text-xl font-semibold">Brand not found</h1>
            <p className="text-sm text-muted-foreground">
              The brand &ldquo;{slug}&rdquo; doesn&apos;t exist or is inactive.
            </p>
            <Button asChild variant="outline">
              <Link href="/">Back to home</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const brand = data.publicBrand;

  return (
    <div className="min-h-screen bg-muted/20">
      {/* Banner */}
      <div className="relative h-48 sm:h-64 bg-gradient-to-r from-primary/20 to-primary/5">
        {brand.bannerUrl && (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={brand.bannerUrl}
            alt={`${brand.name} banner`}
            className="h-full w-full object-cover"
          />
        )}
      </div>

      {/* Header */}
      <div className="max-w-5xl mx-auto px-4 -mt-12 relative">
        <div className="flex items-end gap-4">
          <div className="h-24 w-24 rounded-lg bg-card border-4 border-background shadow-lg flex items-center justify-center overflow-hidden">
            {brand.logoUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={brand.logoUrl}
                alt={brand.name}
                className="h-full w-full object-cover"
              />
            ) : (
              <BrandIcon className="h-10 w-10 text-muted-foreground" />
            )}
          </div>
          <div className="flex-1 min-w-0 pb-2">
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight truncate">
              {brand.name}
            </h1>
            {brand.description && (
              <p className="text-sm text-muted-foreground line-clamp-2">
                {brand.description}
              </p>
            )}
          </div>
        </div>

        {/* Meta strip */}
        <div className="mt-6 flex flex-wrap gap-4 text-sm text-muted-foreground">
          {brand.websiteUrl && (
            <a
              href={brand.websiteUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 hover:text-foreground"
            >
              <Globe className="h-4 w-4" />
              Official site
            </a>
          )}
          {brand.foundedYear && (
            <span>Est. {brand.foundedYear}</span>
          )}
          {brand.countryCode && <span>{brand.countryCode}</span>}
        </div>
      </div>

      {/* Products placeholder */}
      <div className="max-w-5xl mx-auto px-4 py-10">
        <Card>
          <CardContent className="py-16 text-center space-y-3">
            <BrandIcon className="h-10 w-10 mx-auto text-muted-foreground/40" />
            <h2 className="font-semibold">Products coming soon</h2>
            <p className="text-sm text-muted-foreground">
              Browse all {brand.name} products once sellers list them.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
