"use client";

/**
 * Tiny inline rating line for the PDP — stars + count, links to the
 * full reviews section via an in-page anchor.
 *
 * Renders nothing when the product has no reviews yet (keeps the title
 * area uncluttered until the first review lands).
 */

import { useQuery } from "@apollo/client/react";

import { GET_PRODUCT_RATING_SUMMARY } from "@/lib/graphql/reviews";
import type { GetProductRatingSummaryData } from "@/types/review.types";
import { StarRating } from "./star-rating";

export function InlineRatingLink({ productId }: { productId: string }) {
  const { data } = useQuery<GetProductRatingSummaryData>(
    GET_PRODUCT_RATING_SUMMARY,
    {
      variables: { productId },
      fetchPolicy: "cache-and-network",
    },
  );
  const summary = data?.productRatingSummary;
  if (!summary || summary.total === 0) return null;

  return (
    <a
      href="#reviews"
      className="inline-flex items-center gap-2 hover:underline"
      title="Jump to reviews"
    >
      <StarRating value={summary.average} size={14} />
      <span className="text-sm text-muted-foreground">
        {summary.average.toFixed(1)} ({summary.total}{" "}
        {summary.total === 1 ? "review" : "reviews"})
      </span>
    </a>
  );
}
