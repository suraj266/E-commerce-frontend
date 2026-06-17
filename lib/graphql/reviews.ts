/**
 * Review GraphQL ops — customer CRUD, public list/summary, eligibility.
 */

import { gql } from "@apollo/client";

const REVIEW_FIELDS = gql`
  fragment ReviewFields on Review {
    id
    productId
    customerId
    customerName
    customerAvatarUrl
    rating
    title
    body
    status
    verifiedPurchase
    media {
      id
      type
      url
      thumbnailUrl
      width
      height
      durationMs
      sizeBytes
    }
    createdAt
    updatedAt
  }
`;

// ---- Public ----
export const GET_PRODUCT_RATING_SUMMARY = gql`
  query GetProductRatingSummary($productId: ID!) {
    productRatingSummary(productId: $productId) {
      total
      average
      count1
      count2
      count3
      count4
      count5
    }
  }
`;

export const GET_PUBLIC_PRODUCT_REVIEWS = gql`
  ${REVIEW_FIELDS}
  query GetPublicProductReviews(
    $productId: ID!
    $page: Int
    $pageSize: Int
    $rating: Int
    $sort: String
  ) {
    publicProductReviews(
      productId: $productId
      page: $page
      pageSize: $pageSize
      rating: $rating
      sort: $sort
    ) {
      items {
        ...ReviewFields
      }
      totalCount
      totalPages
      currentPage
      pageSize
    }
  }
`;

// ---- Customer ----
export const GET_REVIEW_ELIGIBILITY = gql`
  query GetReviewEligibility($productId: ID!) {
    reviewEligibility(productId: $productId) {
      canReview
      hasPurchased
      existingReviewId
    }
  }
`;

export const GET_MY_REVIEW = gql`
  ${REVIEW_FIELDS}
  query GetMyReview($productId: ID!) {
    myReview(productId: $productId) {
      ...ReviewFields
    }
  }
`;

export const CREATE_REVIEW = gql`
  ${REVIEW_FIELDS}
  mutation CreateReview($input: CreateReviewInput!) {
    createReview(input: $input) {
      ...ReviewFields
    }
  }
`;

export const UPDATE_REVIEW = gql`
  ${REVIEW_FIELDS}
  mutation UpdateReview($input: UpdateReviewInput!) {
    updateReview(input: $input) {
      ...ReviewFields
    }
  }
`;

export const DELETE_REVIEW = gql`
  mutation DeleteReview($id: ID!) {
    deleteReview(id: $id) {
      id
    }
  }
`;

// ---- Admin ----
const ADMIN_REVIEW_FIELDS = gql`
  fragment AdminReviewFields on AdminReview {
    id
    productId
    productName
    productSlug
    customerId
    customerName
    customerEmail
    rating
    title
    body
    status
    verifiedPurchase
    hiddenReason
    hiddenById
    hiddenAt
    createdAt
    updatedAt
  }
`;

export const GET_ADMIN_REVIEWS = gql`
  ${ADMIN_REVIEW_FIELDS}
  query GetAdminReviews(
    $status: ReviewStatus
    $search: String
    $page: Int
    $pageSize: Int
  ) {
    adminReviews(
      status: $status
      search: $search
      page: $page
      pageSize: $pageSize
    ) {
      items {
        ...AdminReviewFields
      }
      totalCount
      totalPages
      currentPage
      pageSize
    }
  }
`;

export const APPROVE_REVIEW = gql`
  ${ADMIN_REVIEW_FIELDS}
  mutation ApproveReview($id: ID!) {
    approveReview(id: $id) {
      ...AdminReviewFields
    }
  }
`;

export const REJECT_REVIEW = gql`
  ${ADMIN_REVIEW_FIELDS}
  mutation RejectReview($id: ID!, $reason: String) {
    rejectReview(id: $id, reason: $reason) {
      ...AdminReviewFields
    }
  }
`;
