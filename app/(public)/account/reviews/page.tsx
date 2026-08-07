"use client";

/**
 * Customer "My reviews" (P4-03) — every review the caller has written, newest
 * first. Each row links to the product, shows the rating + moderation status,
 * and opens the shared WriteReviewDialog in edit mode (which reuses the
 * existing UPDATE_REVIEW / DELETE_REVIEW mutations). Writing a NEW review still
 * happens from the product page after a delivered order.
 */

import { useState } from "react";
import Link from "next/link";
import { useQuery } from "@apollo/client/react";
import { Star } from "lucide-react";

import {
  GET_MY_REVIEWS,
  type MyReview,
  type MyReviewsData,
} from "@/lib/graphql/account-reviews";
import { StarRating } from "@/components/reviews/star-rating";
import { WriteReviewDialog } from "@/components/reviews/write-review-dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

const STATUS_META: Record<
  MyReview["status"],
  { label: string; variant: "default" | "secondary" | "outline" }
> = {
  PUBLISHED: { label: "Published", variant: "default" },
  PENDING: { label: "Pending approval", variant: "secondary" },
  HIDDEN: { label: "Hidden by admin", variant: "outline" },
};

export default function MyReviewsPage() {
  const { data, loading, error, refetch } = useQuery<MyReviewsData>(
    GET_MY_REVIEWS,
    { fetchPolicy: "cache-and-network" },
  );
  const reviews = data?.myReviews ?? [];

  const [editing, setEditing] = useState<MyReview | null>(null);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">My reviews</h1>
        <p className="text-sm text-muted-foreground">
          Reviews you&apos;ve written. Edits re-enter moderation before they go
          public again.
        </p>
      </div>

      {loading && reviews.length === 0 ? (
        <p className="text-sm text-muted-foreground">Loading…</p>
      ) : error ? (
        <p className="text-sm text-destructive">{error.message}</p>
      ) : reviews.length === 0 ? (
        <div className="rounded-lg border border-dashed p-10 text-center">
          <Star className="mx-auto h-8 w-8 text-muted-foreground" />
          <p className="mt-3 text-sm text-muted-foreground">
            You haven&apos;t written any reviews yet.
          </p>
          <Link
            href="/account/orders"
            className="mt-2 inline-block text-sm text-primary hover:underline"
          >
            Review a delivered order →
          </Link>
        </div>
      ) : (
        <ul className="space-y-3">
          {reviews.map((r) => {
            const status = STATUS_META[r.status];
            return (
              <li
                key={r.id}
                className="rounded-lg border bg-card p-4 space-y-2"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    {r.productSlug ? (
                      <Link
                        href={`/product/${r.productSlug}`}
                        className="font-medium hover:underline"
                      >
                        {r.productName ?? "View product"}
                      </Link>
                    ) : (
                      <span className="font-medium">
                        {r.productName ?? "Product"}
                      </span>
                    )}
                    <div className="mt-1 flex items-center gap-2">
                      <StarRating value={r.rating} />
                      <Badge variant={status.variant} className="text-[10px]">
                        {status.label}
                      </Badge>
                    </div>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setEditing(r)}
                    className="flex-shrink-0"
                  >
                    Edit
                  </Button>
                </div>

                {r.title && <div className="text-sm font-medium">{r.title}</div>}
                <p className="text-sm text-muted-foreground whitespace-pre-line">
                  {r.body}
                </p>
                <div className="text-xs text-muted-foreground">
                  {new Date(r.createdAt).toLocaleDateString("en-IN")}
                </div>
              </li>
            );
          })}
        </ul>
      )}

      {/* Edit / delete reuse the shared dialog (UPDATE_REVIEW / DELETE_REVIEW).
          Refetch the list when it closes so status changes + deletions show. */}
      {editing && (
        <WriteReviewDialog
          productId={editing.productId}
          productName={editing.productName ?? "this product"}
          existingReviewId={editing.id}
          open={!!editing}
          onOpenChange={(open) => {
            if (!open) {
              setEditing(null);
              void refetch();
            }
          }}
        />
      )}
    </div>
  );
}
