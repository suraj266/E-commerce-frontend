/** Review types — mirror backend GraphQL. */

export const REVIEW_STATUSES = ["PUBLISHED", "HIDDEN", "PENDING"] as const;
export type ReviewStatus = (typeof REVIEW_STATUSES)[number];

export const REVIEW_SORT_OPTIONS = ["newest", "highest", "lowest"] as const;
export type ReviewSort = (typeof REVIEW_SORT_OPTIONS)[number];

export const REVIEW_SORT_LABEL: Record<ReviewSort, string> = {
  newest: "Most recent",
  highest: "Highest rating",
  lowest: "Lowest rating",
};

export const REVIEW_MEDIA_TYPES = ["IMAGE", "VIDEO"] as const;
export type ReviewMediaType = (typeof REVIEW_MEDIA_TYPES)[number];

export interface ReviewMedia {
  id: string;
  type: ReviewMediaType;
  url: string;
  thumbnailUrl: string | null;
  width: number | null;
  height: number | null;
  durationMs: number | null;
  sizeBytes: number;
}

/** Shape the upload endpoint returns + the create/update mutations accept. */
export interface ReviewMediaInput {
  type: ReviewMediaType;
  url: string;
  width?: number;
  height?: number;
  durationMs?: number;
  sizeBytes: number;
}

export interface Review {
  id: string;
  productId: string;
  customerId: string;
  customerName: string | null;
  customerAvatarUrl: string | null;
  rating: number;
  title: string | null;
  body: string;
  status: ReviewStatus;
  verifiedPurchase: boolean;
  media: ReviewMedia[];
  createdAt: string;
  updatedAt: string;
}

export interface PaginatedReviews {
  items: Review[];
  totalCount: number;
  totalPages: number;
  currentPage: number;
  pageSize: number;
}

export interface ProductRatingSummary {
  total: number;
  average: number;
  count1: number;
  count2: number;
  count3: number;
  count4: number;
  count5: number;
}

export interface ReviewEligibility {
  canReview: boolean;
  hasPurchased: boolean;
  existingReviewId: string | null;
}

// ---- Inputs ----
export interface CreateReviewInput {
  productId: string;
  rating: number;
  title?: string;
  body: string;
  media?: ReviewMediaInput[];
}

export interface UpdateReviewInput {
  id: string;
  rating?: number;
  title?: string;
  body?: string;
  /** Replace-wholesale. Omit to leave alone; [] to clear. */
  media?: ReviewMediaInput[];
}

// ---- Apollo response shapes ----
export interface GetProductRatingSummaryData {
  productRatingSummary: ProductRatingSummary;
}

export interface GetPublicProductReviewsData {
  publicProductReviews: PaginatedReviews;
}

export interface GetReviewEligibilityData {
  reviewEligibility: ReviewEligibility;
}

export interface GetMyReviewData {
  myReview: Review | null;
}

export interface CreateReviewData {
  createReview: Review;
}

export interface UpdateReviewData {
  updateReview: Review;
}

// ---- Admin ----
export interface AdminReview extends Review {
  productName: string | null;
  productSlug: string | null;
  customerEmail: string | null;
  hiddenReason: string | null;
  hiddenById: string | null;
  hiddenAt: string | null;
}

export interface PaginatedAdminReviews {
  items: AdminReview[];
  totalCount: number;
  totalPages: number;
  currentPage: number;
  pageSize: number;
}

export interface GetAdminReviewsData {
  adminReviews: PaginatedAdminReviews;
}

export interface ApproveReviewData {
  approveReview: AdminReview;
}

export interface RejectReviewData {
  rejectReview: AdminReview;
}
