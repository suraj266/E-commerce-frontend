/**
 * Account "My reviews" GraphQL — the customer's own reviews list.
 *
 * GET_MY_REVIEWS is new (backend ReviewResolver.myReviews, JwtAuthGuard +
 * customerId scoping). Edit / delete reuse the EXISTING review mutations —
 * re-exported here so the account page has a single import surface, and so the
 * shared WriteReviewDialog (which imports them from ./reviews) stays the one
 * source of truth for the mutation documents.
 */

import { gql } from "@apollo/client";

// Reuse — do not redefine (avoids duplicate Apollo operation names).
export { UPDATE_REVIEW, DELETE_REVIEW } from "./reviews";

export const GET_MY_REVIEWS = gql`
  query GetMyReviews {
    myReviews {
      id
      productId
      productName
      productSlug
      rating
      title
      body
      status
      createdAt
      updatedAt
    }
  }
`;

/** One row of the caller's own-reviews list. */
export interface MyReview {
  id: string;
  productId: string;
  productName: string | null;
  productSlug: string | null;
  rating: number;
  title: string | null;
  body: string;
  status: "PUBLISHED" | "HIDDEN" | "PENDING";
  createdAt: string;
  updatedAt: string;
}

export interface MyReviewsData {
  myReviews: MyReview[];
}
