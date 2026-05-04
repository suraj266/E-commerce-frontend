/**
 * Public Tag Page — /tag/[slug]
 *
 * Phase 1 placeholder: shows tag name + description. Sprint 2.4d will add
 * a products grid filtered by this tag.
 */

"use client";

import { useEffect } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useQuery } from "@apollo/client/react";
import { Hash } from "lucide-react";

import { GET_PUBLIC_TAG } from "@/lib/graphql/tags";
import { Tag } from "@/types/tag.types";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface GetPublicTagData {
  publicTag: Tag;
}

export default function PublicTagPage() {
  const params = useParams<{ slug: string }>();
  const slug = params.slug;

  const { data, loading, error } = useQuery<GetPublicTagData>(GET_PUBLIC_TAG, {
    variables: { slug },
    errorPolicy: "all",
  });

  useEffect(() => {
    if (typeof document !== "undefined" && data?.publicTag) {
      document.title = `${data.publicTag.name} | MultiMart`;
    }
  }, [data?.publicTag]);

  if (loading) {
    return (
      <div className="max-w-5xl mx-auto p-8">
        <div className="h-32 animate-pulse rounded-lg bg-muted" />
      </div>
    );
  }

  if (error || !data?.publicTag) {
    return (
      <div className="max-w-5xl mx-auto p-8">
        <Card>
          <CardContent className="py-12 text-center space-y-3">
            <Hash className="h-12 w-12 mx-auto text-muted-foreground/50" />
            <h1 className="text-xl font-semibold">Tag not found</h1>
            <p className="text-sm text-muted-foreground">
              The tag &ldquo;{slug}&rdquo; doesn&apos;t exist or is inactive.
            </p>
            <Button asChild variant="outline">
              <Link href="/">Back to home</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const tag = data.publicTag;

  return (
    <div className="min-h-screen bg-muted/20">
      <div className="max-w-5xl mx-auto px-4 py-12">
        <div className="flex items-center gap-3 mb-4">
          <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center">
            <Hash className="h-6 w-6 text-primary" />
          </div>
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
              #{tag.name}
            </h1>
            {tag.description && (
              <p className="text-sm text-muted-foreground mt-1">
                {tag.description}
              </p>
            )}
          </div>
        </div>

        <Card>
          <CardContent className="py-16 text-center space-y-3">
            <Hash className="h-10 w-10 mx-auto text-muted-foreground/40" />
            <h2 className="font-semibold">Products coming soon</h2>
            <p className="text-sm text-muted-foreground">
              All products tagged <span className="font-mono">#{tag.slug}</span>{" "}
              will appear here once sellers list them.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
