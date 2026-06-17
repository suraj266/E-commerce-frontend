"use client";

/**
 * Reviews section for the PDP — combines the rating summary header, the
 * "Write a review" / "Edit your review" CTA, and the paginated list of
 * customer reviews.
 *
 * For the unauthenticated case we still render the summary + list; the CTA
 * just falls back to "Sign in to write a review" which routes to /login.
 */

import { useState } from "react";
import { useQuery } from "@apollo/client/react";
import Link from "next/link";
import { CheckCircle2 } from "lucide-react";

import {
  GET_MY_REVIEW,
  GET_PRODUCT_RATING_SUMMARY,
  GET_PUBLIC_PRODUCT_REVIEWS,
  GET_REVIEW_ELIGIBILITY,
} from "@/lib/graphql/reviews";
import type {
  GetMyReviewData,
  GetProductRatingSummaryData,
  GetPublicProductReviewsData,
  GetReviewEligibilityData,
  ReviewSort,
} from "@/types/review.types";
import { REVIEW_SORT_LABEL, REVIEW_SORT_OPTIONS } from "@/types/review.types";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useAuthStore } from "@/store/auth.store";
import { StarRating } from "./star-rating";
import { ReviewMediaStrip } from "./review-media-strip";
import { WriteReviewDialog } from "./write-review-dialog";

interface Props {
  productId: string;
  productName: string;
}

export function ProductReviewsSection({ productId, productName }: Props) {
  const user = useAuthStore((s) => s.user);
  const isAuthed = !!user;

  const [sort, setSort] = useState<ReviewSort>("newest");
  const [page, setPage] = useState(1);
  const [writeOpen, setWriteOpen] = useState(false);

  const { data: summaryData } = useQuery<GetProductRatingSummaryData>(
    GET_PRODUCT_RATING_SUMMARY,
    {
      variables: { productId },
      fetchPolicy: "cache-and-network",
    },
  );

  const { data: listData, loading: loadingList } =
    useQuery<GetPublicProductReviewsData>(GET_PUBLIC_PRODUCT_REVIEWS, {
      variables: { productId, page, pageSize: 5, sort },
      fetchPolicy: "cache-and-network",
    });

  const { data: eligibilityData } = useQuery<GetReviewEligibilityData>(
    GET_REVIEW_ELIGIBILITY,
    {
      variables: { productId },
      skip: !isAuthed,
      fetchPolicy: "cache-and-network",
    },
  );

  // Pull the customer's own review (if any) so the CTA can reflect its
  // moderation status. Public list filters to PUBLISHED only, so a
  // freshly-submitted PENDING review wouldn't show up there.
  const { data: myReviewData } = useQuery<GetMyReviewData>(GET_MY_REVIEW, {
    variables: { productId },
    skip: !isAuthed || !eligibilityData?.reviewEligibility?.existingReviewId,
    fetchPolicy: "cache-and-network",
  });

  const summary = summaryData?.productRatingSummary;
  const reviews = listData?.publicProductReviews?.items ?? [];
  const totalPages = listData?.publicProductReviews?.totalPages ?? 1;
  const totalCount = listData?.publicProductReviews?.totalCount ?? 0;
  const eligibility = eligibilityData?.reviewEligibility;
  const myReview = myReviewData?.myReview;

  const total = summary?.total ?? 0;
  const average = summary?.average ?? 0;

  // CTA states (top to bottom in precedence):
  //   - unauthenticated:              "Sign in to write a review" → /login
  //   - has PENDING review:           muted "pending approval" badge + Edit
  //   - has HIDDEN review:            muted "needs changes" badge + Edit
  //   - has PUBLISHED review:         "Edit your review"
  //   - eligible (delivered, none):   "Write a review"
  //   - hasn't bought:                muted "delivered customers only" hint
  let cta: React.ReactNode = null;
  if (!isAuthed) {
    cta = (
      <Button asChild variant="outline">
        <Link href={`/login?next=/product/${productId}`}>
          Sign in to write a review
        </Link>
      </Button>
    );
  } else if (eligibility?.existingReviewId) {
    const status = myReview?.status;
    const statusNote =
      status === "PENDING"
        ? "Your review is pending approval."
        : status === "HIDDEN"
          ? "Your review was hidden — edit and resubmit."
          : null;
    cta = (
      <div className="flex flex-col items-end gap-1">
        <Button onClick={() => setWriteOpen(true)}>
          {status === "PUBLISHED" ? "Edit your review" : "Edit pending review"}
        </Button>
        {statusNote && (
          <p className="text-[11px] text-muted-foreground">{statusNote}</p>
        )}
      </div>
    );
  } else if (eligibility?.canReview) {
    cta = <Button onClick={() => setWriteOpen(true)}>Write a review</Button>;
  } else if (eligibility && !eligibility.hasPurchased) {
    cta = (
      <p className="text-xs text-muted-foreground">
        Only customers who&apos;ve received this product can review it.
      </p>
    );
  }

  return (
    <section className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">
            Customer reviews
          </h2>
          <div className="mt-2 flex items-center gap-3">
            <StarRating value={average} size={18} />
            <div className="text-sm">
              <span className="font-semibold">{average.toFixed(1)}</span>
              <span className="text-muted-foreground">
                {" "}
                · {total} {total === 1 ? "review" : "reviews"}
              </span>
            </div>
          </div>
        </div>
        <div className="flex items-start gap-2">{cta}</div>
      </div>

      {total > 0 && summary && (
        <RatingDistribution summary={summary} />
      )}

      {total === 0 ? (
        <div className="rounded-lg border bg-muted/30 px-6 py-10 text-center">
          <p className="text-sm font-medium">No reviews yet</p>
          <p className="mt-1 text-xs text-muted-foreground">
            Be the first to share your experience with this product.
          </p>
        </div>
      ) : (
        <>
          <div className="flex items-center justify-between border-b pb-3">
            <p className="text-sm text-muted-foreground">
              Showing {reviews.length} of {totalCount} reviews
            </p>
            <Select
              value={sort}
              onValueChange={(v) => {
                setSort(v as ReviewSort);
                setPage(1);
              }}
            >
              <SelectTrigger className="w-44 h-9">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {REVIEW_SORT_OPTIONS.map((o) => (
                  <SelectItem key={o} value={o}>
                    {REVIEW_SORT_LABEL[o]}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-5">
            {loadingList && reviews.length === 0 ? (
              <div className="space-y-3">
                {Array.from({ length: 3 }).map((_, i) => (
                  <div
                    key={i}
                    className="h-20 w-full animate-pulse rounded-lg bg-muted"
                  />
                ))}
              </div>
            ) : (
              reviews.map((r) => (
                <article
                  key={r.id}
                  className="border-b last:border-b-0 pb-6 last:pb-0"
                >
                  {/* Reviewer name + verified purchase */}
                  <div className="flex items-center gap-2">
                    <Avatar className="h-8 w-8">
                      {r.customerAvatarUrl && (
                        <AvatarImage
                          src={r.customerAvatarUrl}
                          alt={r.customerName ?? "Reviewer"}
                        />
                      )}
                      <AvatarFallback className="bg-primary/10 text-primary text-[11px] font-bold">
                        {reviewerInitials(r.customerName)}
                      </AvatarFallback>
                    </Avatar>
                    <span className="text-sm font-medium text-foreground">
                      {r.customerName ?? "Anonymous"}
                    </span>
                    {r.verifiedPurchase && (
                      <span
                        className="inline-flex items-center gap-1 text-[10px] uppercase tracking-wide text-emerald-700 bg-emerald-50 border border-emerald-200 rounded px-1.5 py-0.5"
                        title="This reviewer purchased the product"
                      >
                        <CheckCircle2 className="h-3 w-3" />
                        Verified Purchase
                      </span>
                    )}
                  </div>

                  {/* Stars + review title */}
                  <div className="mt-2 flex items-center gap-2">
                    <StarRating value={r.rating} size={14} />
                    {r.title && (
                      <h3 className="font-semibold text-sm">{r.title}</h3>
                    )}
                  </div>

                  {/* Purchased product name */}
                  <p className="mt-1 text-xs text-muted-foreground">
                    {productName}
                  </p>

                  {/* Review body */}
                  <p className="mt-2 text-sm whitespace-pre-line text-foreground/80 leading-relaxed">
                    {r.body}
                  </p>

                  {/* Images / videos */}
                  {r.media.length > 0 && <ReviewMediaStrip media={r.media} />}

                  {/* Date — Month Year */}
                  <div className="mt-3 text-xs text-muted-foreground">
                    {new Date(r.createdAt).toLocaleDateString(undefined, {
                      month: "long",
                      year: "numeric",
                    })}
                  </div>
                </article>
              ))
            )}
          </div>

          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-2 pt-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page <= 1}
              >
                Previous
              </Button>
              <span className="text-sm text-muted-foreground tabular-nums">
                Page {page} of {totalPages}
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page >= totalPages}
              >
                Next
              </Button>
            </div>
          )}
        </>
      )}

      <WriteReviewDialog
        productId={productId}
        productName={productName}
        open={writeOpen}
        onOpenChange={setWriteOpen}
        existingReviewId={eligibility?.existingReviewId ?? null}
      />
    </section>
  );
}

// ---------------------------------------------------------------------------

/** Up to two-letter initials for the avatar fallback; "?" when no name. */
function reviewerInitials(name?: string | null): string {
  if (!name?.trim()) return "?";
  const parts = name.trim().split(/\s+/);
  const first = parts[0]?.charAt(0) ?? "";
  const last = parts.length > 1 ? parts[parts.length - 1].charAt(0) : "";
  return (first + last).toUpperCase();
}

// ---------------------------------------------------------------------------
function RatingDistribution({
  summary,
}: {
  summary: { total: number; count1: number; count2: number; count3: number; count4: number; count5: number };
}) {
  const buckets: { rating: number; count: number }[] = [
    { rating: 5, count: summary.count5 },
    { rating: 4, count: summary.count4 },
    { rating: 3, count: summary.count3 },
    { rating: 2, count: summary.count2 },
    { rating: 1, count: summary.count1 },
  ];
  const max = Math.max(summary.total, 1);
  return (
    <div className="grid gap-1.5 max-w-md">
      {buckets.map((b) => (
        <div key={b.rating} className="flex items-center gap-2 text-xs">
          <span className="w-6 text-right tabular-nums">{b.rating}★</span>
          <div className="flex-1 h-2 bg-muted rounded overflow-hidden">
            <div
              className="h-full bg-amber-400"
              style={{ width: `${(b.count / max) * 100}%` }}
            />
          </div>
          <span className="w-10 tabular-nums text-muted-foreground">
            {b.count}
          </span>
        </div>
      ))}
    </div>
  );
}
