/**
 * =============================================================================
 * Seller TypeScript Types
 * =============================================================================
 *
 * Mirrors backend GraphQL Seller + SellerPayoutAccount entities.
 * KYC-aware: granular verification timestamps + structured business fields.
 * =============================================================================
 */

export const SELLER_STATUSES = [
  "DRAFT",
  "PENDING",
  "UNDER_REVIEW",
  "VERIFIED",
  "REJECTED",
  "SUSPENDED",
] as const;
export type SellerStatus = (typeof SELLER_STATUSES)[number];

// Funnel statuses for the admin's unified seller-users list — adds two
// pre-onboarding states on top of the regular SellerStatus values.
export const SELLER_LIST_STATUSES = [
  "REGISTERED_UNVERIFIED",
  "REGISTERED",
  "DRAFT",
  "PENDING",
  "UNDER_REVIEW",
  "VERIFIED",
  "REJECTED",
  "SUSPENDED",
] as const;
export type SellerListStatus = (typeof SELLER_LIST_STATUSES)[number];

export const SELLER_LIST_STATUS_LABEL: Record<SellerListStatus, string> = {
  REGISTERED_UNVERIFIED: "Email pending",
  REGISTERED: "Awaiting onboarding",
  DRAFT: "Onboarding draft",
  PENDING: "Submitted",
  UNDER_REVIEW: "Under review",
  VERIFIED: "Verified",
  REJECTED: "Rejected",
  SUSPENDED: "Suspended",
};

export const BUSINESS_TYPES = [
  "INDIVIDUAL",
  "PROPRIETORSHIP",
  "PARTNERSHIP",
  "LLP",
  "PRIVATE_LIMITED",
  "PUBLIC_LIMITED",
  "HUF",
] as const;
export type BusinessType = (typeof BUSINESS_TYPES)[number];

export const ENTITY_BUSINESS_TYPES: BusinessType[] = [
  "PARTNERSHIP",
  "LLP",
  "PRIVATE_LIMITED",
  "PUBLIC_LIMITED",
];

export const VERIFICATION_SECTIONS = [
  "PAN",
  "GSTIN",
  "BANK",
  "DOCUMENTS",
] as const;
export type VerificationSection = (typeof VERIFICATION_SECTIONS)[number];

export const PAYOUT_ACCOUNT_TYPES = ["bank", "upi", "wallet"] as const;
export type PayoutAccountType = (typeof PAYOUT_ACCOUNT_TYPES)[number];

// ---------------------------------------------------------------------------
// Validation regexes (mirror backend)
// ---------------------------------------------------------------------------
export const PAN_REGEX = /^[A-Z]{5}[0-9]{4}[A-Z]$/;
export const GSTIN_REGEX = /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z][0-9A-Z][Z][0-9A-Z]$/;
export const PHONE_REGEX = /^(\+?91)?[6-9][0-9]{9}$/;

export const BUSINESS_TYPE_LABELS: Record<BusinessType, string> = {
  INDIVIDUAL: "Individual",
  PROPRIETORSHIP: "Sole Proprietorship",
  PARTNERSHIP: "Partnership",
  LLP: "LLP",
  PRIVATE_LIMITED: "Private Limited",
  PUBLIC_LIMITED: "Public Limited",
  HUF: "HUF",
};

// ---------------------------------------------------------------------------
// Entity types
// ---------------------------------------------------------------------------
export interface SellerPayoutAccount {
  id: string;
  sellerId: string;
  accountType: PayoutAccountType;
  accountHolderName: string;
  accountNumber?: string | null;
  ifscCode?: string | null;
  bankName?: string | null;
  upiId?: string | null;
  walletProvider?: string | null;
  isPrimary: boolean;
  isVerified: boolean;
  createdAt: string;
  updatedAt: string;
  deletedAt?: string | null;
}

export interface Seller {
  id: string;
  userId: string;
  legalName: string;
  displayName: string;
  businessType: BusinessType;
  dateOfIncorporation?: string | null;
  registrationNumber?: string | null;
  panNumber: string;
  gstin?: string | null;
  businessEmail: string;
  businessPhone: string;
  supportEmail?: string | null;
  signatoryName?: string | null;
  signatoryPan?: string | null;
  signatoryDesignation?: string | null;
  overallStatus: SellerStatus;
  panVerifiedAt?: string | null;
  gstinVerifiedAt?: string | null;
  bankVerifiedAt?: string | null;
  documentsVerifiedAt?: string | null;
  rejectionReason?: string | null;
  commissionRate: number;
  createdAt: string;
  updatedAt: string;
  deletedAt?: string | null;
  payoutAccounts?: SellerPayoutAccount[];
}

// ---------------------------------------------------------------------------
// Form values
// ---------------------------------------------------------------------------
export interface SellerOnboardingFormValues {
  legalName: string;
  displayName: string;
  businessType: BusinessType;
  dateOfIncorporation: string;
  registrationNumber: string;
  panNumber: string;
  gstin: string;
  businessEmail: string;
  businessPhone: string;
  supportEmail: string;
  signatoryName: string;
  signatoryPan: string;
  signatoryDesignation: string;
}

// ---------------------------------------------------------------------------
// GraphQL response shapes
// ---------------------------------------------------------------------------
export interface GetSellersData {
  sellers: Seller[];
}
export interface GetSellerData {
  seller: Seller;
}
export interface GetMySellerData {
  mySeller: Seller | null;
}
export interface CreateMySellerData {
  createMySeller: Seller;
}
export interface UpdateMySellerData {
  updateMySeller: Seller;
}
export interface SubmitMySellerForReviewData {
  submitMySellerForReview: Seller;
}
export interface VerifySellerSectionData {
  verifySellerSection: Seller;
}
export interface SetSellerStatusData {
  setSellerStatus: Seller;
}
export interface RemoveSellerData {
  removeSeller: Seller;
}

// ---------------------------------------------------------------------------
// SellerListItem — combined User + optional Seller record for the admin list
// ---------------------------------------------------------------------------
export interface SellerListItem {
  userId: string;
  name: string;
  email: string;
  phone: string;
  emailVerifiedAt?: string | null;
  registeredAt: string;
  status: SellerListStatus;
  seller: Seller | null;
}

export interface GetSellerUsersData {
  sellerUsers: SellerListItem[];
}
