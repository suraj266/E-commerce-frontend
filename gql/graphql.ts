/* eslint-disable */
import { TypedDocumentNode as DocumentNode } from '@graphql-typed-document-node/core';
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type MakeEmpty<T extends { [key: string]: unknown }, K extends keyof T> = { [_ in K]?: never };
export type Incremental<T> = T | { [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: { input: string; output: string; }
  String: { input: string; output: string; }
  Boolean: { input: boolean; output: boolean; }
  Int: { input: number; output: number; }
  Float: { input: number; output: number; }
  /** A date-time string at UTC, such as 2019-12-03T09:54:33Z, compliant with the date-time format. */
  DateTime: { input: any; output: any; }
};

export type AddProductImageInput = {
  altText?: InputMaybe<Scalars['String']['input']>;
  displayOrder?: InputMaybe<Scalars['Int']['input']>;
  /** Canonical URL from Image module upload */
  imageUrl: Scalars['String']['input'];
  isPrimary?: InputMaybe<Scalars['Boolean']['input']>;
  productId: Scalars['ID']['input'];
};

export type AddSlideItemInput = {
  ctaLabel?: InputMaybe<Scalars['String']['input']>;
  description?: InputMaybe<Scalars['String']['input']>;
  imageUrl?: InputMaybe<Scalars['String']['input']>;
  isEnabled?: InputMaybe<Scalars['Boolean']['input']>;
  link?: InputMaybe<Scalars['String']['input']>;
  mobileImageUrl?: InputMaybe<Scalars['String']['input']>;
  order?: InputMaybe<Scalars['Int']['input']>;
  sliderId: Scalars['ID']['input'];
  tabletImageUrl?: InputMaybe<Scalars['String']['input']>;
  title?: InputMaybe<Scalars['String']['input']>;
};

export type AddToCartInput = {
  quantity?: InputMaybe<Scalars['Int']['input']>;
  variantId: Scalars['ID']['input'];
};

export type Address = {
  __typename?: 'Address';
  addressLine1: Scalars['String']['output'];
  addressLine2?: Maybe<Scalars['String']['output']>;
  city: Scalars['String']['output'];
  /** ISO 3166-1 alpha-2 country code (e.g. "IN", "US"). */
  countryCode: Scalars['String']['output'];
  firstName: Scalars['String']['output'];
  id: Scalars['ID']['output'];
  isDefault: Scalars['Boolean']['output'];
  label?: Maybe<Scalars['String']['output']>;
  lastName: Scalars['String']['output'];
  phone?: Maybe<Scalars['String']['output']>;
  postalCode: Scalars['String']['output'];
  state: Scalars['String']['output'];
  type: AddressType;
  userId: Scalars['ID']['output'];
};

export enum AddressType {
  Billing = 'BILLING',
  Both = 'BOTH',
  Shipping = 'SHIPPING'
}

export type AdjustInventoryInput = {
  /** Relative change to onHand. Positive = received, negative = removed. Mutually exclusive with newQuantityOnHand. */
  delta?: InputMaybe<Scalars['Int']['input']>;
  movementType: InventoryMovementType;
  /** Absolute set — used for recounts. The service derives delta from current onHand. Mutually exclusive with delta. */
  newQuantityOnHand?: InputMaybe<Scalars['Int']['input']>;
  notes?: InputMaybe<Scalars['String']['input']>;
  variantId: Scalars['ID']['input'];
  warehouseId?: InputMaybe<Scalars['ID']['input']>;
};

export type AdminCustomer = {
  __typename?: 'AdminCustomer';
  createdAt: Scalars['DateTime']['output'];
  deletedAt?: Maybe<Scalars['DateTime']['output']>;
  email: Scalars['String']['output'];
  emailVerifiedAt?: Maybe<Scalars['DateTime']['output']>;
  id: Scalars['ID']['output'];
  lastLoginAt?: Maybe<Scalars['DateTime']['output']>;
  marketingOptIn: Scalars['Boolean']['output'];
  name: Scalars['String']['output'];
  phone?: Maybe<Scalars['String']['output']>;
  preferredCurrency: Scalars['String']['output'];
  status?: Maybe<Scalars['String']['output']>;
  updatedAt: Scalars['DateTime']['output'];
  userCreatedAt: Scalars['DateTime']['output'];
  userId: Scalars['ID']['output'];
};

export type AdminTheme = {
  __typename?: 'AdminTheme';
  accentDark: Scalars['String']['output'];
  accentLight: Scalars['String']['output'];
  destructiveDark: Scalars['String']['output'];
  destructiveLight: Scalars['String']['output'];
  fontFamily?: Maybe<Scalars['String']['output']>;
  id: Scalars['ID']['output'];
  primaryDark: Scalars['String']['output'];
  primaryLight: Scalars['String']['output'];
  radius: Scalars['String']['output'];
  sidebarDark: Scalars['String']['output'];
  sidebarLight: Scalars['String']['output'];
  updatedAt: Scalars['DateTime']['output'];
  updatedById?: Maybe<Scalars['String']['output']>;
};

export enum AttributeType {
  Boolean = 'BOOLEAN',
  Multiselect = 'MULTISELECT',
  Number = 'NUMBER',
  Select = 'SELECT',
  Text = 'TEXT'
}

export type Brand = {
  __typename?: 'Brand';
  bannerUrl?: Maybe<Scalars['String']['output']>;
  /** ISO 3166-1 alpha-2 (e.g. IN, US) */
  countryCode?: Maybe<Scalars['String']['output']>;
  createdAt: Scalars['DateTime']['output'];
  deletedAt?: Maybe<Scalars['DateTime']['output']>;
  description?: Maybe<Scalars['String']['output']>;
  foundedYear?: Maybe<Scalars['Int']['output']>;
  id: Scalars['ID']['output'];
  isFeatured: Scalars['Boolean']['output'];
  logoUrl?: Maybe<Scalars['String']['output']>;
  name: Scalars['String']['output'];
  slug: Scalars['String']['output'];
  status: BrandStatus;
  updatedAt: Scalars['DateTime']['output'];
  websiteUrl?: Maybe<Scalars['String']['output']>;
};

export enum BrandStatus {
  Active = 'ACTIVE',
  Inactive = 'INACTIVE'
}

export type BulkUpdateVariantsInput = {
  compareAtPrice?: InputMaybe<Scalars['Float']['input']>;
  /** Optional filter: only update variants having ANY of these attribute value IDs */
  filterValueIds?: InputMaybe<Array<Scalars['ID']['input']>>;
  price?: InputMaybe<Scalars['Float']['input']>;
  productId: Scalars['ID']['input'];
  status?: InputMaybe<VariantStatus>;
};

export enum BusinessType {
  Huf = 'HUF',
  Individual = 'INDIVIDUAL',
  Llp = 'LLP',
  Partnership = 'PARTNERSHIP',
  PrivateLimited = 'PRIVATE_LIMITED',
  Proprietorship = 'PROPRIETORSHIP',
  PublicLimited = 'PUBLIC_LIMITED'
}

export type Cart = {
  __typename?: 'Cart';
  createdAt: Scalars['DateTime']['output'];
  customerId: Scalars['ID']['output'];
  id: Scalars['ID']['output'];
  /** Sum of quantity across all items — drives the header badge. */
  itemCount: Scalars['Int']['output'];
  items: Array<CartItem>;
  /** true if any line has a price change OR is out of stock. */
  needsReview: Scalars['Boolean']['output'];
  /** Sum of all lineTotal values. Tax + shipping computed at checkout. */
  subtotal: Scalars['Float']['output'];
  updatedAt: Scalars['DateTime']['output'];
};

export type CartItem = {
  __typename?: 'CartItem';
  /** Aggregate available stock across warehouses. -1 if unknown/unbounded. */
  availableQuantity: Scalars['Int']['output'];
  cartId: Scalars['ID']['output'];
  createdAt: Scalars['DateTime']['output'];
  id: Scalars['ID']['output'];
  /** quantity * unitPriceCurrent — what the line costs today. */
  lineTotal: Scalars['Float']['output'];
  /** true when unitPriceCurrent != unitPriceSnapshot — the customer should re-confirm before checkout. */
  priceChanged: Scalars['Boolean']['output'];
  product?: Maybe<Product>;
  productId: Scalars['ID']['output'];
  quantity: Scalars['Int']['output'];
  /** Stock state for this variant: IN_STOCK | LOW_STOCK | OUT_OF_STOCK. */
  stockState: Scalars['String']['output'];
  /** Live price right now (variant.price). */
  unitPriceCurrent: Scalars['Float']['output'];
  /** Price of the variant at the time it was added to the cart. Compare with `unitPriceCurrent` to detect price drift. */
  unitPriceSnapshot: Scalars['Float']['output'];
  updatedAt: Scalars['DateTime']['output'];
  variant?: Maybe<ProductVariant>;
  variantId: Scalars['ID']['output'];
};

export type Category = {
  __typename?: 'Category';
  children?: Maybe<Array<Category>>;
  createdAt: Scalars['DateTime']['output'];
  deletedAt?: Maybe<Scalars['DateTime']['output']>;
  description?: Maybe<Scalars['String']['output']>;
  displayOrder: Scalars['Int']['output'];
  hasChildren?: Maybe<Scalars['Boolean']['output']>;
  iconUrl?: Maybe<Scalars['String']['output']>;
  id: Scalars['ID']['output'];
  imageUrl?: Maybe<Scalars['String']['output']>;
  isActive: Scalars['Boolean']['output'];
  name: Scalars['String']['output'];
  parentId?: Maybe<Scalars['String']['output']>;
  productCount?: Maybe<Scalars['Int']['output']>;
  slug: Scalars['String']['output'];
  updatedAt: Scalars['DateTime']['output'];
};

export type CategoryTreeItemInput = {
  displayOrder: Scalars['Int']['input'];
  id: Scalars['ID']['input'];
  parentId?: InputMaybe<Scalars['String']['input']>;
};

export type CheckoutResult = {
  __typename?: 'CheckoutResult';
  gateway: PaymentGateway;
  gatewayPayload?: Maybe<Scalars['String']['output']>;
  orderId: Scalars['ID']['output'];
  orderNumber: Scalars['String']['output'];
  requiresPayment: Scalars['Boolean']['output'];
};

export type ConfirmUploadInput = {
  alt?: InputMaybe<Scalars['String']['input']>;
  externalId: Scalars['String']['input'];
  ownerId?: InputMaybe<Scalars['ID']['input']>;
  ownerType?: InputMaybe<ImageOwnerType>;
  purpose: ImagePurpose;
};

export type Coupon = {
  __typename?: 'Coupon';
  code: Scalars['String']['output'];
  createdAt: Scalars['DateTime']['output'];
  description?: Maybe<Scalars['String']['output']>;
  discountType: Scalars['String']['output'];
  discountValue: Scalars['Float']['output'];
  id: Scalars['ID']['output'];
  isActive: Scalars['Boolean']['output'];
  maximumDiscountAmount?: Maybe<Scalars['Float']['output']>;
  minimumPurchaseAmount?: Maybe<Scalars['Float']['output']>;
  name: Scalars['String']['output'];
  redemptionCount?: Maybe<Scalars['Int']['output']>;
  storeId?: Maybe<Scalars['ID']['output']>;
  updatedAt: Scalars['DateTime']['output'];
  usageLimit?: Maybe<Scalars['Int']['output']>;
  usageLimitPerUser?: Maybe<Scalars['Int']['output']>;
  validFrom: Scalars['DateTime']['output'];
  validUntil: Scalars['DateTime']['output'];
};

export type CouponValidation = {
  __typename?: 'CouponValidation';
  coupon?: Maybe<Coupon>;
  customerTotal: Scalars['Float']['output'];
  discountAmount: Scalars['Float']['output'];
  discountInclTax: Scalars['Float']['output'];
  isValid: Scalars['Boolean']['output'];
  reason?: Maybe<Scalars['String']['output']>;
  subtotal: Scalars['Float']['output'];
  subtotalInclTax: Scalars['Float']['output'];
};

export type CreateAddressInput = {
  addressLine1: Scalars['String']['input'];
  addressLine2?: InputMaybe<Scalars['String']['input']>;
  city: Scalars['String']['input'];
  countryCode: Scalars['String']['input'];
  firstName: Scalars['String']['input'];
  isDefault?: InputMaybe<Scalars['Boolean']['input']>;
  label?: InputMaybe<Scalars['String']['input']>;
  lastName: Scalars['String']['input'];
  phone?: InputMaybe<Scalars['String']['input']>;
  postalCode: Scalars['String']['input'];
  state: Scalars['String']['input'];
  type: AddressType;
};

export type CreateAttributeInput = {
  description?: InputMaybe<Scalars['String']['input']>;
  isVariantAttribute?: InputMaybe<Scalars['Boolean']['input']>;
  name: Scalars['String']['input'];
  /** Auto-generated from name if blank */
  slug?: InputMaybe<Scalars['String']['input']>;
  type?: AttributeType;
};

export type CreateAttributeValueInput = {
  attributeId: Scalars['ID']['input'];
  /** Appended to end of list when omitted */
  displayOrder?: InputMaybe<Scalars['Int']['input']>;
  /** Auto-generated from value if blank */
  slug?: InputMaybe<Scalars['String']['input']>;
  value: Scalars['String']['input'];
};

export type CreateBrandInput = {
  bannerUrl?: InputMaybe<Scalars['String']['input']>;
  countryCode?: InputMaybe<Scalars['String']['input']>;
  description?: InputMaybe<Scalars['String']['input']>;
  foundedYear?: InputMaybe<Scalars['Int']['input']>;
  isFeatured?: InputMaybe<Scalars['Boolean']['input']>;
  logoUrl?: InputMaybe<Scalars['String']['input']>;
  name: Scalars['String']['input'];
  /** Auto-generated from name if blank */
  slug?: InputMaybe<Scalars['String']['input']>;
  websiteUrl?: InputMaybe<Scalars['String']['input']>;
};

export type CreateCategoryInput = {
  description?: InputMaybe<Scalars['String']['input']>;
  displayOrder?: Scalars['Int']['input'];
  iconUrl?: InputMaybe<Scalars['String']['input']>;
  imageUrl?: InputMaybe<Scalars['String']['input']>;
  isActive?: Scalars['Boolean']['input'];
  name: Scalars['String']['input'];
  parentId?: InputMaybe<Scalars['String']['input']>;
  slug?: InputMaybe<Scalars['String']['input']>;
};

export type CreateCouponInput = {
  code: Scalars['String']['input'];
  description?: InputMaybe<Scalars['String']['input']>;
  discountType: Scalars['String']['input'];
  discountValue: Scalars['Float']['input'];
  isActive?: InputMaybe<Scalars['Boolean']['input']>;
  maximumDiscountAmount?: InputMaybe<Scalars['Float']['input']>;
  minimumPurchaseAmount?: InputMaybe<Scalars['Float']['input']>;
  name: Scalars['String']['input'];
  storeId?: InputMaybe<Scalars['String']['input']>;
  usageLimit?: InputMaybe<Scalars['Int']['input']>;
  usageLimitPerUser?: InputMaybe<Scalars['Int']['input']>;
  validFrom: Scalars['String']['input'];
  validUntil: Scalars['String']['input'];
};

export type CreateGatewayConfigInput = {
  credentialsJson?: InputMaybe<Scalars['String']['input']>;
  description?: InputMaybe<Scalars['String']['input']>;
  displayName: Scalars['String']['input'];
  displayOrder?: Scalars['Int']['input'];
  gateway: PaymentGateway;
  instructions?: InputMaybe<Scalars['String']['input']>;
  isDefault?: Scalars['Boolean']['input'];
  isEnabled?: Scalars['Boolean']['input'];
  logoUrl?: InputMaybe<Scalars['String']['input']>;
  paymentType?: GatewayPaymentType;
  processingFee?: Scalars['Float']['input'];
  processingFeeType?: ProcessingFeeType;
  sandboxMode?: Scalars['Boolean']['input'];
  supportedMethods?: Array<Scalars['String']['input']>;
};

export type CreatePageInput = {
  /** JSON-encoded blocks array. Optional on create; defaults to "[]". */
  blocks?: InputMaybe<Scalars['String']['input']>;
  isSystem?: InputMaybe<Scalars['Boolean']['input']>;
  metaDesc?: InputMaybe<Scalars['String']['input']>;
  metaTitle?: InputMaybe<Scalars['String']['input']>;
  slug: Scalars['String']['input'];
  title: Scalars['String']['input'];
};

export type CreatePayoutAccountInput = {
  accountHolderName: Scalars['String']['input'];
  accountNumber?: InputMaybe<Scalars['String']['input']>;
  /** One of: bank, upi, wallet */
  accountType: Scalars['String']['input'];
  bankName?: InputMaybe<Scalars['String']['input']>;
  ifscCode?: InputMaybe<Scalars['String']['input']>;
  isPrimary?: InputMaybe<Scalars['Boolean']['input']>;
  sellerId: Scalars['ID']['input'];
  upiId?: InputMaybe<Scalars['String']['input']>;
  walletProvider?: InputMaybe<Scalars['String']['input']>;
};

export type CreateProductInput = {
  brandId?: InputMaybe<Scalars['ID']['input']>;
  categoryId?: InputMaybe<Scalars['ID']['input']>;
  compareAtPrice?: InputMaybe<Scalars['Float']['input']>;
  costPrice?: InputMaybe<Scalars['Float']['input']>;
  description?: InputMaybe<Scalars['String']['input']>;
  height?: InputMaybe<Scalars['Float']['input']>;
  hsnCode?: InputMaybe<Scalars['String']['input']>;
  isDigital?: InputMaybe<Scalars['Boolean']['input']>;
  length?: InputMaybe<Scalars['Float']['input']>;
  name: Scalars['String']['input'];
  /** Required for SIMPLE products. Ignored for VARIABLE (set per variant). */
  price?: InputMaybe<Scalars['Float']['input']>;
  /** SIMPLE = single SKU (auto-creates 1 variant with the price). VARIABLE = seller adds variants on the next screen. */
  productType?: InputMaybe<ProductType>;
  seoDescription?: InputMaybe<Scalars['String']['input']>;
  seoKeywords?: InputMaybe<Array<Scalars['String']['input']>>;
  seoTitle?: InputMaybe<Scalars['String']['input']>;
  shortDescription?: InputMaybe<Scalars['String']['input']>;
  /** SKU. Auto-generated from product name if blank. */
  sku?: InputMaybe<Scalars['String']['input']>;
  /** Auto-generated from name if blank */
  slug?: InputMaybe<Scalars['String']['input']>;
  /** JSON: [{name, order, items: [{label, value, order}]}] */
  specifications?: InputMaybe<Scalars['String']['input']>;
  storeId: Scalars['ID']['input'];
  tagIds?: InputMaybe<Array<Scalars['ID']['input']>>;
  taxId?: InputMaybe<Scalars['ID']['input']>;
  weight?: InputMaybe<Scalars['Float']['input']>;
  width?: InputMaybe<Scalars['Float']['input']>;
};

export type CreateRoleInput = {
  createdById?: InputMaybe<Scalars['String']['input']>;
  description?: InputMaybe<Scalars['String']['input']>;
  isDefault?: InputMaybe<Scalars['Boolean']['input']>;
  name: Scalars['String']['input'];
  updatedById?: InputMaybe<Scalars['String']['input']>;
};

export type CreateSellerInput = {
  businessEmail: Scalars['String']['input'];
  businessPhone: Scalars['String']['input'];
  businessType: BusinessType;
  commissionRate?: InputMaybe<Scalars['Float']['input']>;
  dateOfIncorporation?: InputMaybe<Scalars['DateTime']['input']>;
  /** Storefront / brand name */
  displayName: Scalars['String']['input'];
  /** 15-char GSTIN */
  gstin?: InputMaybe<Scalars['String']['input']>;
  /** Legal/registered business name */
  legalName: Scalars['String']['input'];
  /** India PAN (10 chars) */
  panNumber: Scalars['String']['input'];
  /** CIN / LLPIN / etc. */
  registrationNumber?: InputMaybe<Scalars['String']['input']>;
  signatoryDesignation?: InputMaybe<Scalars['String']['input']>;
  signatoryName?: InputMaybe<Scalars['String']['input']>;
  signatoryPan?: InputMaybe<Scalars['String']['input']>;
  supportEmail?: InputMaybe<Scalars['String']['input']>;
};

export type CreateSliderInput = {
  /** JSON-encoded config object. */
  config?: InputMaybe<Scalars['String']['input']>;
  description?: InputMaybe<Scalars['String']['input']>;
  /** Stable identifier. Auto-slugified from name if omitted. */
  key?: InputMaybe<Scalars['String']['input']>;
  name: Scalars['String']['input'];
};

export type CreateStoreInput = {
  bannerUrl?: InputMaybe<Scalars['String']['input']>;
  /** ISO 4217 currency code (default: INR) */
  currencyCode?: InputMaybe<Scalars['String']['input']>;
  description?: InputMaybe<Scalars['String']['input']>;
  isFeatured?: InputMaybe<Scalars['Boolean']['input']>;
  /** BCP 47 locale (default: en-IN) */
  locale?: InputMaybe<Scalars['String']['input']>;
  logoUrl?: InputMaybe<Scalars['String']['input']>;
  name: Scalars['String']['input'];
  /** Auto-generated from name if blank */
  slug?: InputMaybe<Scalars['String']['input']>;
  supportEmail?: InputMaybe<Scalars['String']['input']>;
  supportPhone?: InputMaybe<Scalars['String']['input']>;
  /** IANA timezone (default: Asia/Kolkata) */
  timezone?: InputMaybe<Scalars['String']['input']>;
};

export type CreateTagInput = {
  description?: InputMaybe<Scalars['String']['input']>;
  isFeatured?: InputMaybe<Scalars['Boolean']['input']>;
  name: Scalars['String']['input'];
  /** Auto-generated from name if blank */
  slug?: InputMaybe<Scalars['String']['input']>;
};

export type CreateTaxInput = {
  description?: InputMaybe<Scalars['String']['input']>;
  displayOrder?: InputMaybe<Scalars['Int']['input']>;
  isActive?: InputMaybe<Scalars['Boolean']['input']>;
  name: Scalars['String']['input'];
  rate: Scalars['Float']['input'];
};

export type CreateUserInput = {
  avatarUrl?: InputMaybe<Scalars['String']['input']>;
  dateOfBirth?: InputMaybe<Scalars['DateTime']['input']>;
  email: Scalars['String']['input'];
  emailVerifiedAt?: InputMaybe<Scalars['DateTime']['input']>;
  gender?: InputMaybe<Scalars['String']['input']>;
  lastLoginAt?: InputMaybe<Scalars['DateTime']['input']>;
  name: Scalars['String']['input'];
  password: Scalars['String']['input'];
  phone: Scalars['String']['input'];
  phoneVerifiedAt?: InputMaybe<Scalars['DateTime']['input']>;
  roleId: Scalars['String']['input'];
  status?: InputMaybe<Scalars['String']['input']>;
};

export type CreateVariantInput = {
  /** Attribute value IDs that define this variant — one per axis */
  attributeValueIds: Array<Scalars['ID']['input']>;
  compareAtPrice?: InputMaybe<Scalars['Float']['input']>;
  costPrice?: InputMaybe<Scalars['Float']['input']>;
  imageUrl?: InputMaybe<Scalars['String']['input']>;
  price: Scalars['Float']['input'];
  productId: Scalars['ID']['input'];
  /** Auto-generated from attribute slugs if blank */
  sku?: InputMaybe<Scalars['String']['input']>;
};

export type CreateWarehouseInput = {
  addressLine1: Scalars['String']['input'];
  addressLine2?: InputMaybe<Scalars['String']['input']>;
  city: Scalars['String']['input'];
  /** Short unique-per-store code, e.g. MUM01 */
  code: Scalars['String']['input'];
  /** ISO 3166-1 alpha-2 (default: IN) */
  countryCode?: InputMaybe<Scalars['String']['input']>;
  isDefault?: InputMaybe<Scalars['Boolean']['input']>;
  name: Scalars['String']['input'];
  phone?: InputMaybe<Scalars['String']['input']>;
  postalCode: Scalars['String']['input'];
  state: Scalars['String']['input'];
  storeId: Scalars['ID']['input'];
};

export enum EmailEncryption {
  None = 'NONE',
  Ssl = 'SSL',
  Tls = 'TLS'
}

export enum EmailMailer {
  Smtp = 'SMTP'
}

export type EmailSetting = {
  __typename?: 'EmailSetting';
  encryption: EmailEncryption;
  hasPassword: Scalars['Boolean']['output'];
  host: Scalars['String']['output'];
  id: Scalars['ID']['output'];
  isConfigured: Scalars['Boolean']['output'];
  localDomain?: Maybe<Scalars['String']['output']>;
  mailer: EmailMailer;
  port: Scalars['Int']['output'];
  senderEmail: Scalars['String']['output'];
  senderName: Scalars['String']['output'];
  updatedAt: Scalars['DateTime']['output'];
  username: Scalars['String']['output'];
};

export type EmailTemplate = {
  __typename?: 'EmailTemplate';
  category: EmailTemplateCategory;
  description: Scalars['String']['output'];
  htmlBody: Scalars['String']['output'];
  id: Scalars['ID']['output'];
  isEnabled: Scalars['Boolean']['output'];
  isSystem: Scalars['Boolean']['output'];
  key: Scalars['String']['output'];
  name: Scalars['String']['output'];
  subject: Scalars['String']['output'];
  textBody?: Maybe<Scalars['String']['output']>;
  updatedAt: Scalars['DateTime']['output'];
  variables: Array<Scalars['String']['output']>;
};

export enum EmailTemplateCategory {
  Admin = 'ADMIN',
  Auth = 'AUTH',
  Newsletter = 'NEWSLETTER',
  Order = 'ORDER',
  Partial = 'PARTIAL',
  Seller = 'SELLER',
  System = 'SYSTEM'
}

export enum GatewayPaymentType {
  Redirect = 'REDIRECT',
  WebsiteEmbedded = 'WEBSITE_EMBEDDED'
}

export type GenerateVariantMatrixInput = {
  axes: Array<VariantAxisValuesInput>;
  baseCompareAtPrice?: InputMaybe<Scalars['Float']['input']>;
  baseCostPrice?: InputMaybe<Scalars['Float']['input']>;
  /** Default price applied to all generated variants */
  basePrice: Scalars['Float']['input'];
  productId: Scalars['ID']['input'];
};

export type Image = {
  __typename?: 'Image';
  alt?: Maybe<Scalars['String']['output']>;
  createdAt: Scalars['DateTime']['output'];
  externalId: Scalars['String']['output'];
  format: Scalars['String']['output'];
  height: Scalars['Int']['output'];
  id: Scalars['ID']['output'];
  ownerId?: Maybe<Scalars['ID']['output']>;
  ownerType: ImageOwnerType;
  /** local | s3 | cloudinary */
  provider: Scalars['String']['output'];
  purpose: ImagePurpose;
  sizeBytes: Scalars['Int']['output'];
  /** Canonical URL — render directly or via variants. */
  url: Scalars['String']['output'];
  width: Scalars['Int']['output'];
};

export enum ImageOwnerType {
  Category = 'CATEGORY',
  Generic = 'GENERIC',
  Product = 'PRODUCT',
  Seller = 'SELLER',
  Store = 'STORE',
  User = 'USER'
}

export enum ImagePurpose {
  Avatar = 'AVATAR',
  Banner = 'BANNER',
  Generic = 'GENERIC',
  Icon = 'ICON',
  Logo = 'LOGO',
  ProductGallery = 'PRODUCT_GALLERY',
  ProductPrimary = 'PRODUCT_PRIMARY'
}

export type InitiateCheckoutInput = {
  billingAddressId?: InputMaybe<Scalars['ID']['input']>;
  couponCode?: InputMaybe<Scalars['String']['input']>;
  customerNotes?: InputMaybe<Scalars['String']['input']>;
  gateway: PaymentGateway;
  shippingAddressId: Scalars['ID']['input'];
};

export type Inventory = {
  __typename?: 'Inventory';
  createdAt: Scalars['DateTime']['output'];
  id: Scalars['ID']['output'];
  lastCountedAt?: Maybe<Scalars['DateTime']['output']>;
  /** The variant's parent product — included for cross-product dashboard listings so the UI doesn't have to chase nested relations. */
  product?: Maybe<Product>;
  quantityAvailable: Scalars['Int']['output'];
  quantityOnHand: Scalars['Int']['output'];
  quantityReserved: Scalars['Int']['output'];
  reorderPoint: Scalars['Int']['output'];
  reorderQuantity: Scalars['Int']['output'];
  /** Derived: OUT_OF_STOCK when available <= 0; LOW_STOCK when available <= reorderPoint; else IN_STOCK. */
  stockState: StockState;
  updatedAt: Scalars['DateTime']['output'];
  variant?: Maybe<ProductVariant>;
  variantId: Scalars['ID']['output'];
  warehouse?: Maybe<Warehouse>;
  warehouseId: Scalars['ID']['output'];
};

export type InventoryMovement = {
  __typename?: 'InventoryMovement';
  createdAt: Scalars['DateTime']['output'];
  createdById?: Maybe<Scalars['ID']['output']>;
  id: Scalars['ID']['output'];
  inventoryId: Scalars['ID']['output'];
  movementType: InventoryMovementType;
  notes?: Maybe<Scalars['String']['output']>;
  quantityAfter: Scalars['Int']['output'];
  quantityBefore: Scalars['Int']['output'];
  quantityChange: Scalars['Int']['output'];
  referenceId?: Maybe<Scalars['ID']['output']>;
  referenceType?: Maybe<Scalars['String']['output']>;
  variantId: Scalars['ID']['output'];
  warehouseId: Scalars['ID']['output'];
};

export enum InventoryMovementType {
  Adjustment = 'ADJUSTMENT',
  Damage = 'DAMAGE',
  Expired = 'EXPIRED',
  Purchase = 'PURCHASE',
  Return = 'RETURN',
  Sale = 'SALE',
  Transfer = 'TRANSFER'
}

export type Menu = {
  __typename?: 'Menu';
  createdAt: Scalars['DateTime']['output'];
  deletedAt?: Maybe<Scalars['DateTime']['output']>;
  id: Scalars['ID']['output'];
  isActive: Scalars['Boolean']['output'];
  /** JSON-encoded array: [{id, label, url, target?, icon?, visible, children: [...]}]. Frontend parses and renders. */
  items: Scalars['String']['output'];
  location: MenuLocation;
  name: Scalars['String']['output'];
  updatedAt: Scalars['DateTime']['output'];
};

export enum MenuLocation {
  FooterCompany = 'FOOTER_COMPANY',
  FooterHelp = 'FOOTER_HELP',
  FooterLegal = 'FOOTER_LEGAL',
  FooterShop = 'FOOTER_SHOP',
  FooterSocial = 'FOOTER_SOCIAL',
  HeaderPrimary = 'HEADER_PRIMARY',
  HeaderTop = 'HEADER_TOP'
}

export type Mutation = {
  __typename?: 'Mutation';
  addMyAddress: Address;
  addMyProductImage: ProductImage;
  addMyProductVariant: ProductVariant;
  addSlideItem: SlideItem;
  addToCart: Cart;
  addToWishlist: Wishlist;
  adjustMyInventory: Inventory;
  adminRemoveStore: Store;
  adminSetProductStatus: Product;
  adminUpdateSeller: Seller;
  bulkUpdateMyProductVariants: Scalars['Float']['output'];
  cancelMyOrder: Order;
  clearCart: Cart;
  clearWishlist: Wishlist;
  confirmImageUpload: Image;
  createAttribute: ProductAttribute;
  createAttributeValue: ProductAttributeValue;
  createBrand: Brand;
  createCategory: Category;
  createCoupon: Coupon;
  createMyPayoutAccount: SellerPayoutAccount;
  createMyProduct: Product;
  createMySeller: Seller;
  createMyStore: Store;
  createMyWarehouse: Warehouse;
  createPage: Page;
  createPaymentGatewayConfig: PaymentGatewayConfigEntity;
  createRole: Role;
  createSlider: Slider;
  createTag: Tag;
  createTax: Tax;
  createUser: User;
  deleteImage: Image;
  generateMyProductVariantMatrix: Array<ProductVariant>;
  initiateCheckout: CheckoutResult;
  placeOrder: Order;
  presignImageUpload: PresignUploadPayload;
  removeAttribute: ProductAttribute;
  removeAttributeValue: ProductAttributeValue;
  removeBrand: Brand;
  removeCategory: Category;
  removeCoupon?: Maybe<Coupon>;
  removeFromCart: Cart;
  removeFromWishlist: Wishlist;
  removeMenu: Menu;
  removeMyAddress: Address;
  removeMyPayoutAccount: SellerPayoutAccount;
  removeMyProduct: Product;
  removeMyProductImage: ProductImage;
  removeMyProductVariant: ProductVariant;
  removeMyStore: Store;
  removeMyWarehouse: Warehouse;
  removePage: Page;
  removeRole: Role;
  removeSeller: Seller;
  removeSlideItem: SlideItem;
  removeSlider: Slider;
  removeTag: Tag;
  removeTax: Tax;
  removeUser: User;
  reorderAttributeValues: Scalars['Boolean']['output'];
  reorderMyProductImages: Scalars['Boolean']['output'];
  reorderSlideItems: Scalars['Boolean']['output'];
  resetAdminTheme: AdminTheme;
  restoreCustomer: AdminCustomer;
  sendTestEmail: SendTestResult;
  setBrandStatus: Brand;
  setDefaultPaymentGateway: PaymentGatewayConfigEntity;
  setMenuActive: Menu;
  setMyDefaultAddress: Address;
  setMyProductStatus: Product;
  setMyProductVariantAxes: Array<VariantAxis>;
  setMyReorderPoint: Inventory;
  setPageStatus: Page;
  setSellerStatus: Seller;
  setSliderStatus: Slider;
  setStoreStatus: Store;
  setTagStatus: Tag;
  softDeleteCustomer: AdminCustomer;
  submitMySellerForReview: Seller;
  submitMyStoreForReview: Store;
  subscribeToNewsletter: NewsletterSubscribeResult;
  togglePaymentGateway: PaymentGatewayConfigEntity;
  unsubscribeNewsletter: NewsletterSubscription;
  updateAdminTheme: AdminTheme;
  updateAttribute: ProductAttribute;
  updateAttributeValue: ProductAttributeValue;
  updateBrand: Brand;
  updateCartItemQty: Cart;
  updateCategory: Category;
  updateCategoryTree: Scalars['Boolean']['output'];
  updateCoupon: Coupon;
  updateCustomer: AdminCustomer;
  updateEmailSetting: EmailSetting;
  updateEmailTemplate: EmailTemplate;
  updateMyAddress: Address;
  updateMyPayoutAccount: SellerPayoutAccount;
  updateMyProduct: Product;
  updateMyProductImage: ProductImage;
  updateMyProductVariant: ProductVariant;
  updateMyProfile: AdminCustomer;
  updateMySeller: Seller;
  updateMyStore: Store;
  updateMyWarehouse: Warehouse;
  updatePage: Page;
  updatePaymentGatewayConfig: PaymentGatewayConfigEntity;
  updateRole: Role;
  updateSellerOrderStatus: SellerOrder;
  /** Admin — update a setting value by key. */
  updateSiteSetting: SiteSetting;
  updateSlideItem: SlideItem;
  updateSlider: Slider;
  updateTag: Tag;
  updateTax: Tax;
  updateUser: User;
  upsertMenu: Menu;
  validateCoupon: CouponValidation;
  verifyPayment: Order;
  verifySellerSection: Seller;
};


export type MutationAddMyAddressArgs = {
  input: CreateAddressInput;
};


export type MutationAddMyProductImageArgs = {
  addProductImageInput: AddProductImageInput;
};


export type MutationAddMyProductVariantArgs = {
  createVariantInput: CreateVariantInput;
};


export type MutationAddSlideItemArgs = {
  addSlideItemInput: AddSlideItemInput;
};


export type MutationAddToCartArgs = {
  input: AddToCartInput;
};


export type MutationAddToWishlistArgs = {
  input: ToggleWishlistInput;
};


export type MutationAdjustMyInventoryArgs = {
  adjustInventoryInput: AdjustInventoryInput;
};


export type MutationAdminRemoveStoreArgs = {
  id: Scalars['ID']['input'];
};


export type MutationAdminSetProductStatusArgs = {
  setProductStatusInput: SetProductStatusInput;
};


export type MutationAdminUpdateSellerArgs = {
  updateSellerInput: UpdateSellerInput;
};


export type MutationBulkUpdateMyProductVariantsArgs = {
  bulkUpdateVariantsInput: BulkUpdateVariantsInput;
};


export type MutationCancelMyOrderArgs = {
  id: Scalars['ID']['input'];
  notes?: InputMaybe<Scalars['String']['input']>;
};


export type MutationConfirmImageUploadArgs = {
  confirmUploadInput: ConfirmUploadInput;
};


export type MutationCreateAttributeArgs = {
  createAttributeInput: CreateAttributeInput;
};


export type MutationCreateAttributeValueArgs = {
  createAttributeValueInput: CreateAttributeValueInput;
};


export type MutationCreateBrandArgs = {
  createBrandInput: CreateBrandInput;
};


export type MutationCreateCategoryArgs = {
  createCategoryInput: CreateCategoryInput;
};


export type MutationCreateCouponArgs = {
  input: CreateCouponInput;
};


export type MutationCreateMyPayoutAccountArgs = {
  createPayoutAccountInput: CreatePayoutAccountInput;
};


export type MutationCreateMyProductArgs = {
  createProductInput: CreateProductInput;
};


export type MutationCreateMySellerArgs = {
  createSellerInput: CreateSellerInput;
};


export type MutationCreateMyStoreArgs = {
  createStoreInput: CreateStoreInput;
};


export type MutationCreateMyWarehouseArgs = {
  createWarehouseInput: CreateWarehouseInput;
};


export type MutationCreatePageArgs = {
  createPageInput: CreatePageInput;
};


export type MutationCreatePaymentGatewayConfigArgs = {
  input: CreateGatewayConfigInput;
};


export type MutationCreateRoleArgs = {
  createRoleInput: CreateRoleInput;
};


export type MutationCreateSliderArgs = {
  createSliderInput: CreateSliderInput;
};


export type MutationCreateTagArgs = {
  createTagInput: CreateTagInput;
};


export type MutationCreateTaxArgs = {
  createTaxInput: CreateTaxInput;
};


export type MutationCreateUserArgs = {
  createUserInput: CreateUserInput;
};


export type MutationDeleteImageArgs = {
  id: Scalars['ID']['input'];
};


export type MutationGenerateMyProductVariantMatrixArgs = {
  generateVariantMatrixInput: GenerateVariantMatrixInput;
};


export type MutationInitiateCheckoutArgs = {
  input: InitiateCheckoutInput;
};


export type MutationPlaceOrderArgs = {
  input: PlaceOrderInput;
};


export type MutationPresignImageUploadArgs = {
  presignUploadInput: PresignUploadInput;
};


export type MutationRemoveAttributeArgs = {
  id: Scalars['ID']['input'];
};


export type MutationRemoveAttributeValueArgs = {
  id: Scalars['ID']['input'];
};


export type MutationRemoveBrandArgs = {
  id: Scalars['ID']['input'];
};


export type MutationRemoveCategoryArgs = {
  id: Scalars['ID']['input'];
};


export type MutationRemoveCouponArgs = {
  id: Scalars['ID']['input'];
};


export type MutationRemoveFromCartArgs = {
  input: RemoveCartItemInput;
};


export type MutationRemoveFromWishlistArgs = {
  input: ToggleWishlistInput;
};


export type MutationRemoveMenuArgs = {
  location: MenuLocation;
};


export type MutationRemoveMyAddressArgs = {
  id: Scalars['ID']['input'];
};


export type MutationRemoveMyPayoutAccountArgs = {
  id: Scalars['ID']['input'];
};


export type MutationRemoveMyProductArgs = {
  id: Scalars['ID']['input'];
};


export type MutationRemoveMyProductImageArgs = {
  id: Scalars['ID']['input'];
};


export type MutationRemoveMyProductVariantArgs = {
  id: Scalars['ID']['input'];
};


export type MutationRemoveMyStoreArgs = {
  id: Scalars['ID']['input'];
};


export type MutationRemoveMyWarehouseArgs = {
  id: Scalars['ID']['input'];
};


export type MutationRemovePageArgs = {
  id: Scalars['ID']['input'];
};


export type MutationRemoveRoleArgs = {
  id: Scalars['ID']['input'];
};


export type MutationRemoveSellerArgs = {
  id: Scalars['ID']['input'];
};


export type MutationRemoveSlideItemArgs = {
  id: Scalars['ID']['input'];
};


export type MutationRemoveSliderArgs = {
  id: Scalars['ID']['input'];
};


export type MutationRemoveTagArgs = {
  id: Scalars['ID']['input'];
};


export type MutationRemoveTaxArgs = {
  id: Scalars['ID']['input'];
};


export type MutationRemoveUserArgs = {
  id: Scalars['ID']['input'];
};


export type MutationReorderAttributeValuesArgs = {
  reorderAttributeValuesInput: ReorderAttributeValuesInput;
};


export type MutationReorderMyProductImagesArgs = {
  reorderProductImagesInput: ReorderProductImagesInput;
};


export type MutationReorderSlideItemsArgs = {
  reorderSlideItemsInput: ReorderSlideItemsInput;
};


export type MutationRestoreCustomerArgs = {
  id: Scalars['ID']['input'];
};


export type MutationSendTestEmailArgs = {
  input: SendTestEmailInput;
};


export type MutationSetBrandStatusArgs = {
  setBrandStatusInput: SetBrandStatusInput;
};


export type MutationSetDefaultPaymentGatewayArgs = {
  id: Scalars['ID']['input'];
};


export type MutationSetMenuActiveArgs = {
  isActive: Scalars['Boolean']['input'];
  location: MenuLocation;
};


export type MutationSetMyDefaultAddressArgs = {
  id: Scalars['ID']['input'];
};


export type MutationSetMyProductStatusArgs = {
  setProductStatusInput: SetProductStatusInput;
};


export type MutationSetMyProductVariantAxesArgs = {
  setVariantAxesInput: SetVariantAxesInput;
};


export type MutationSetMyReorderPointArgs = {
  setReorderPointInput: SetReorderPointInput;
};


export type MutationSetPageStatusArgs = {
  setPageStatusInput: SetPageStatusInput;
};


export type MutationSetSellerStatusArgs = {
  setStatusInput: SetSellerStatusInput;
};


export type MutationSetSliderStatusArgs = {
  setSliderStatusInput: SetSliderStatusInput;
};


export type MutationSetStoreStatusArgs = {
  setStoreStatusInput: SetStoreStatusInput;
};


export type MutationSetTagStatusArgs = {
  setTagStatusInput: SetTagStatusInput;
};


export type MutationSoftDeleteCustomerArgs = {
  id: Scalars['ID']['input'];
};


export type MutationSubmitMySellerForReviewArgs = {
  id: Scalars['ID']['input'];
};


export type MutationSubmitMyStoreForReviewArgs = {
  id: Scalars['ID']['input'];
};


export type MutationSubscribeToNewsletterArgs = {
  input: SubscribeNewsletterInput;
};


export type MutationTogglePaymentGatewayArgs = {
  enabled: Scalars['Boolean']['input'];
  id: Scalars['ID']['input'];
};


export type MutationUnsubscribeNewsletterArgs = {
  id: Scalars['ID']['input'];
};


export type MutationUpdateAdminThemeArgs = {
  updateAdminThemeInput: UpdateAdminThemeInput;
};


export type MutationUpdateAttributeArgs = {
  updateAttributeInput: UpdateAttributeInput;
};


export type MutationUpdateAttributeValueArgs = {
  updateAttributeValueInput: UpdateAttributeValueInput;
};


export type MutationUpdateBrandArgs = {
  updateBrandInput: UpdateBrandInput;
};


export type MutationUpdateCartItemQtyArgs = {
  input: UpdateCartItemQtyInput;
};


export type MutationUpdateCategoryArgs = {
  updateCategoryInput: UpdateCategoryInput;
};


export type MutationUpdateCategoryTreeArgs = {
  updateCategoryTreeInput: UpdateCategoryTreeInput;
};


export type MutationUpdateCouponArgs = {
  input: UpdateCouponInput;
};


export type MutationUpdateCustomerArgs = {
  input: UpdateCustomerInput;
};


export type MutationUpdateEmailSettingArgs = {
  input: UpdateEmailSettingInput;
};


export type MutationUpdateEmailTemplateArgs = {
  input: UpdateEmailTemplateInput;
};


export type MutationUpdateMyAddressArgs = {
  input: UpdateAddressInput;
};


export type MutationUpdateMyPayoutAccountArgs = {
  updatePayoutAccountInput: UpdatePayoutAccountInput;
};


export type MutationUpdateMyProductArgs = {
  updateProductInput: UpdateProductInput;
};


export type MutationUpdateMyProductImageArgs = {
  updateProductImageInput: UpdateProductImageInput;
};


export type MutationUpdateMyProductVariantArgs = {
  updateVariantInput: UpdateVariantInput;
};


export type MutationUpdateMyProfileArgs = {
  input: UpdateMyProfileInput;
};


export type MutationUpdateMySellerArgs = {
  updateSellerInput: UpdateSellerInput;
};


export type MutationUpdateMyStoreArgs = {
  updateStoreInput: UpdateStoreInput;
};


export type MutationUpdateMyWarehouseArgs = {
  updateWarehouseInput: UpdateWarehouseInput;
};


export type MutationUpdatePageArgs = {
  updatePageInput: UpdatePageInput;
};


export type MutationUpdatePaymentGatewayConfigArgs = {
  input: UpdateGatewayConfigInput;
};


export type MutationUpdateRoleArgs = {
  updateRoleInput: UpdateRoleInput;
};


export type MutationUpdateSellerOrderStatusArgs = {
  input: UpdateSellerOrderStatusInput;
};


export type MutationUpdateSiteSettingArgs = {
  input: UpdateSiteSettingInput;
};


export type MutationUpdateSlideItemArgs = {
  updateSlideItemInput: UpdateSlideItemInput;
};


export type MutationUpdateSliderArgs = {
  updateSliderInput: UpdateSliderInput;
};


export type MutationUpdateTagArgs = {
  updateTagInput: UpdateTagInput;
};


export type MutationUpdateTaxArgs = {
  updateTaxInput: UpdateTaxInput;
};


export type MutationUpdateUserArgs = {
  updateUserInput: UpdateUserInput;
};


export type MutationUpsertMenuArgs = {
  upsertMenuInput: UpsertMenuInput;
};


export type MutationValidateCouponArgs = {
  input: ValidateCouponInput;
};


export type MutationVerifyPaymentArgs = {
  input: VerifyPaymentInput;
};


export type MutationVerifySellerSectionArgs = {
  verifySectionInput: VerifySellerSectionInput;
};

export enum NewsletterStatus {
  Active = 'ACTIVE',
  Unsubscribed = 'UNSUBSCRIBED'
}

export type NewsletterSubscribeResult = {
  __typename?: 'NewsletterSubscribeResult';
  /** Friendly message — "subscribed", "already-subscribed", "resubscribed". */
  message: Scalars['String']['output'];
  ok: Scalars['Boolean']['output'];
};

export type NewsletterSubscription = {
  __typename?: 'NewsletterSubscription';
  createdAt: Scalars['DateTime']['output'];
  email: Scalars['String']['output'];
  id: Scalars['ID']['output'];
  source?: Maybe<Scalars['String']['output']>;
  status: NewsletterStatus;
  unsubscribedAt?: Maybe<Scalars['DateTime']['output']>;
  updatedAt: Scalars['DateTime']['output'];
};

export type Order = {
  __typename?: 'Order';
  billingAddress?: Maybe<OrderAddressSnapshot>;
  cancelledAt?: Maybe<Scalars['DateTime']['output']>;
  createdAt: Scalars['DateTime']['output'];
  currencyCode: Scalars['String']['output'];
  customerId: Scalars['ID']['output'];
  customerNotes?: Maybe<Scalars['String']['output']>;
  deliveredAt?: Maybe<Scalars['DateTime']['output']>;
  discountAmount: Scalars['Float']['output'];
  id: Scalars['ID']['output'];
  itemCount: Scalars['Int']['output'];
  items: Array<OrderItem>;
  orderNumber: Scalars['String']['output'];
  paymentMethod: PaymentMethod;
  paymentStatus: PaymentStatus;
  placedAt: Scalars['DateTime']['output'];
  sellerOrders: Array<SellerOrder>;
  shippingAddress?: Maybe<OrderAddressSnapshot>;
  shippingAmount: Scalars['Float']['output'];
  /** Aggregate status across all SellerOrders. Computed as the earliest stage any sub-order is at. */
  status: OrderStatus;
  statusHistory: Array<OrderStatusHistoryEntry>;
  subtotal: Scalars['Float']['output'];
  taxAmount: Scalars['Float']['output'];
  totalAmount: Scalars['Float']['output'];
  updatedAt: Scalars['DateTime']['output'];
};

export type OrderAddressSnapshot = {
  __typename?: 'OrderAddressSnapshot';
  addressLine1: Scalars['String']['output'];
  addressLine2?: Maybe<Scalars['String']['output']>;
  city: Scalars['String']['output'];
  countryCode: Scalars['String']['output'];
  firstName: Scalars['String']['output'];
  id: Scalars['ID']['output'];
  lastName: Scalars['String']['output'];
  phone?: Maybe<Scalars['String']['output']>;
  postalCode: Scalars['String']['output'];
  state: Scalars['String']['output'];
};

export type OrderItem = {
  __typename?: 'OrderItem';
  attributesSnapshot: Array<OrderItemAttribute>;
  createdAt: Scalars['DateTime']['output'];
  discountAmount: Scalars['Float']['output'];
  id: Scalars['ID']['output'];
  imageUrlSnapshot?: Maybe<Scalars['String']['output']>;
  name: Scalars['String']['output'];
  orderId: Scalars['ID']['output'];
  productId: Scalars['ID']['output'];
  quantity: Scalars['Int']['output'];
  sellerOrderId: Scalars['ID']['output'];
  sku: Scalars['String']['output'];
  storeId: Scalars['ID']['output'];
  taxAmount: Scalars['Float']['output'];
  totalPrice: Scalars['Float']['output'];
  unitPrice: Scalars['Float']['output'];
  variantId: Scalars['ID']['output'];
  variantName?: Maybe<Scalars['String']['output']>;
};

export type OrderItemAttribute = {
  __typename?: 'OrderItemAttribute';
  attributeName: Scalars['String']['output'];
  value: Scalars['String']['output'];
};

export enum OrderStatus {
  Cancelled = 'CANCELLED',
  Confirmed = 'CONFIRMED',
  Delivered = 'DELIVERED',
  Packed = 'PACKED',
  Pending = 'PENDING',
  Refunded = 'REFUNDED',
  Shipped = 'SHIPPED'
}

export type OrderStatusHistoryEntry = {
  __typename?: 'OrderStatusHistoryEntry';
  changedById?: Maybe<Scalars['ID']['output']>;
  createdAt: Scalars['DateTime']['output'];
  fromStatus?: Maybe<OrderStatus>;
  id: Scalars['ID']['output'];
  notes?: Maybe<Scalars['String']['output']>;
  toStatus: OrderStatus;
};

export type Page = {
  __typename?: 'Page';
  /** JSON-encoded array: [{id, type, props, visible}]. Frontend parses + renders via BLOCK_REGISTRY. */
  blocks: Scalars['String']['output'];
  createdAt: Scalars['DateTime']['output'];
  createdById?: Maybe<Scalars['ID']['output']>;
  deletedAt?: Maybe<Scalars['DateTime']['output']>;
  id: Scalars['ID']['output'];
  isSystem: Scalars['Boolean']['output'];
  metaDesc?: Maybe<Scalars['String']['output']>;
  metaTitle?: Maybe<Scalars['String']['output']>;
  publishedAt?: Maybe<Scalars['DateTime']['output']>;
  slug: Scalars['String']['output'];
  status: PageStatus;
  title: Scalars['String']['output'];
  updatedAt: Scalars['DateTime']['output'];
};

export enum PageStatus {
  Archived = 'ARCHIVED',
  Draft = 'DRAFT',
  Published = 'PUBLISHED'
}

export type PaginatedAdminCustomers = {
  __typename?: 'PaginatedAdminCustomers';
  currentPage: Scalars['Int']['output'];
  items: Array<AdminCustomer>;
  pageSize: Scalars['Int']['output'];
  totalCount: Scalars['Int']['output'];
  totalPages: Scalars['Int']['output'];
};

export type PaginatedCategories = {
  __typename?: 'PaginatedCategories';
  currentPage: Scalars['Int']['output'];
  items: Array<Category>;
  pageSize: Scalars['Int']['output'];
  totalCount: Scalars['Int']['output'];
  totalPages: Scalars['Int']['output'];
};

export type PaginatedNewsletterSubscriptions = {
  __typename?: 'PaginatedNewsletterSubscriptions';
  currentPage: Scalars['Int']['output'];
  items: Array<NewsletterSubscription>;
  pageSize: Scalars['Int']['output'];
  totalCount: Scalars['Int']['output'];
  totalPages: Scalars['Int']['output'];
};

export type PaginatedOrders = {
  __typename?: 'PaginatedOrders';
  currentPage: Scalars['Int']['output'];
  items: Array<Order>;
  pageSize: Scalars['Int']['output'];
  totalCount: Scalars['Int']['output'];
  totalPages: Scalars['Int']['output'];
};

export type PaginatedPages = {
  __typename?: 'PaginatedPages';
  currentPage: Scalars['Int']['output'];
  items: Array<Page>;
  pageSize: Scalars['Int']['output'];
  totalCount: Scalars['Int']['output'];
  totalPages: Scalars['Int']['output'];
};

export type PaginatedPayments = {
  __typename?: 'PaginatedPayments';
  currentPage: Scalars['Int']['output'];
  items: Array<PaymentEntity>;
  pageSize: Scalars['Int']['output'];
  totalCount: Scalars['Int']['output'];
  totalPages: Scalars['Int']['output'];
};

export type PaginatedProducts = {
  __typename?: 'PaginatedProducts';
  currentPage: Scalars['Int']['output'];
  items: Array<Product>;
  pageSize: Scalars['Int']['output'];
  totalCount: Scalars['Int']['output'];
  totalPages: Scalars['Int']['output'];
};

export type PaginatedSellerOrders = {
  __typename?: 'PaginatedSellerOrders';
  currentPage: Scalars['Int']['output'];
  items: Array<SellerOrder>;
  pageSize: Scalars['Int']['output'];
  totalCount: Scalars['Int']['output'];
  totalPages: Scalars['Int']['output'];
};

export type PaginatedSliders = {
  __typename?: 'PaginatedSliders';
  currentPage: Scalars['Int']['output'];
  items: Array<Slider>;
  pageSize: Scalars['Int']['output'];
  totalCount: Scalars['Int']['output'];
  totalPages: Scalars['Int']['output'];
};

export type PaginatedTaxes = {
  __typename?: 'PaginatedTaxes';
  currentPage: Scalars['Int']['output'];
  items: Array<Tax>;
  pageSize: Scalars['Int']['output'];
  totalCount: Scalars['Int']['output'];
  totalPages: Scalars['Int']['output'];
};

export type PaymentEntity = {
  __typename?: 'PaymentEntity';
  amount: Scalars['Float']['output'];
  capturedAt?: Maybe<Scalars['DateTime']['output']>;
  createdAt: Scalars['DateTime']['output'];
  currency: Scalars['String']['output'];
  expiresAt?: Maybe<Scalars['DateTime']['output']>;
  failedAt?: Maybe<Scalars['DateTime']['output']>;
  gateway: PaymentGateway;
  gatewayOrderId?: Maybe<Scalars['String']['output']>;
  gatewayPaymentId?: Maybe<Scalars['String']['output']>;
  id: Scalars['ID']['output'];
  method: PaymentMethod;
  orderId: Scalars['ID']['output'];
  processingFee: Scalars['Float']['output'];
  status: PaymentTransactionStatus;
  updatedAt: Scalars['DateTime']['output'];
};

export enum PaymentGateway {
  Cod = 'COD',
  Phonepe = 'PHONEPE',
  Razorpay = 'RAZORPAY',
  Stripe = 'STRIPE'
}

export type PaymentGatewayConfigEntity = {
  __typename?: 'PaymentGatewayConfigEntity';
  createdAt: Scalars['DateTime']['output'];
  credentialHints?: Maybe<Scalars['String']['output']>;
  description?: Maybe<Scalars['String']['output']>;
  displayName: Scalars['String']['output'];
  displayOrder: Scalars['Int']['output'];
  gateway: PaymentGateway;
  hasCredentials: Scalars['Boolean']['output'];
  id: Scalars['ID']['output'];
  instructions?: Maybe<Scalars['String']['output']>;
  isDefault: Scalars['Boolean']['output'];
  isEnabled: Scalars['Boolean']['output'];
  logoUrl?: Maybe<Scalars['String']['output']>;
  paymentType: GatewayPaymentType;
  processingFee: Scalars['Float']['output'];
  processingFeeType: ProcessingFeeType;
  sandboxMode: Scalars['Boolean']['output'];
  supportedMethods: Array<Scalars['String']['output']>;
  updatedAt: Scalars['DateTime']['output'];
  webhookUrl?: Maybe<Scalars['String']['output']>;
};

export enum PaymentMethod {
  Card = 'CARD',
  Cod = 'COD',
  NetBanking = 'NET_BANKING',
  Upi = 'UPI',
  Wallet = 'WALLET'
}

export enum PaymentStatus {
  AwaitingPayment = 'AWAITING_PAYMENT',
  Failed = 'FAILED',
  Paid = 'PAID',
  PartiallyPaid = 'PARTIALLY_PAID',
  PartiallyRefunded = 'PARTIALLY_REFUNDED',
  Pending = 'PENDING',
  Refunded = 'REFUNDED'
}

export enum PaymentTransactionStatus {
  Authorized = 'AUTHORIZED',
  Captured = 'CAPTURED',
  Created = 'CREATED',
  Expired = 'EXPIRED',
  Failed = 'FAILED',
  PartiallyRefunded = 'PARTIALLY_REFUNDED',
  Refunded = 'REFUNDED'
}

export enum PayoutStatus {
  Failed = 'FAILED',
  Paid = 'PAID',
  Pending = 'PENDING',
  Processing = 'PROCESSING'
}

export type PlaceOrderInput = {
  billingAddressId?: InputMaybe<Scalars['ID']['input']>;
  couponCode?: InputMaybe<Scalars['String']['input']>;
  customerNotes?: InputMaybe<Scalars['String']['input']>;
  paymentMethod?: PaymentMethod;
  shippingAddressId: Scalars['ID']['input'];
};

export type PresignUploadInput = {
  /** image/jpeg | image/png | image/webp */
  contentType: Scalars['String']['input'];
  originalName?: InputMaybe<Scalars['String']['input']>;
  purpose: ImagePurpose;
};

export type PresignUploadPayload = {
  __typename?: 'PresignUploadPayload';
  expiresIn: Scalars['Int']['output'];
  externalId: Scalars['String']['output'];
  /** JSON-encoded extra form fields for multipart POST uploads. */
  fields: Scalars['String']['output'];
  method: Scalars['String']['output'];
  provider: Scalars['String']['output'];
  uploadUrl: Scalars['String']['output'];
};

export enum ProcessingFeeType {
  Fixed = 'FIXED',
  Percentage = 'PERCENTAGE'
}

export type Product = {
  __typename?: 'Product';
  brand?: Maybe<Brand>;
  brandId?: Maybe<Scalars['ID']['output']>;
  category?: Maybe<Category>;
  categoryId?: Maybe<Scalars['ID']['output']>;
  compareAtPrice?: Maybe<Scalars['Float']['output']>;
  costPrice?: Maybe<Scalars['Float']['output']>;
  createdAt: Scalars['DateTime']['output'];
  deletedAt?: Maybe<Scalars['DateTime']['output']>;
  description?: Maybe<Scalars['String']['output']>;
  height?: Maybe<Scalars['Float']['output']>;
  /** Harmonized System of Nomenclature code (4/6/8 digits). Required for GST invoicing in India. */
  hsnCode?: Maybe<Scalars['String']['output']>;
  id: Scalars['ID']['output'];
  images?: Maybe<Array<ProductImage>>;
  isDigital: Scalars['Boolean']['output'];
  isFeatured: Scalars['Boolean']['output'];
  length?: Maybe<Scalars['Float']['output']>;
  name: Scalars['String']['output'];
  /** Default variant price (SIMPLE products) or starting from (VARIABLE). */
  price?: Maybe<Scalars['Float']['output']>;
  /** Price including tax (price + price × taxRate/100). Null if no tax assigned. */
  priceWithTax?: Maybe<Scalars['Float']['output']>;
  productType: ProductType;
  seoDescription?: Maybe<Scalars['String']['output']>;
  seoKeywords: Array<Scalars['String']['output']>;
  seoTitle?: Maybe<Scalars['String']['output']>;
  shortDescription?: Maybe<Scalars['String']['output']>;
  sku?: Maybe<Scalars['String']['output']>;
  slug: Scalars['String']['output'];
  /** JSON-encoded array: [{name, order, items: [{label, value, order}]}]. Frontend parses. */
  specifications: Scalars['String']['output'];
  status: ProductStatus;
  storeId: Scalars['ID']['output'];
  tags?: Maybe<Array<Tag>>;
  tax?: Maybe<Tax>;
  taxId?: Maybe<Scalars['ID']['output']>;
  updatedAt: Scalars['DateTime']['output'];
  /** Always present; for SIMPLE products contains 1 default variant. */
  variants?: Maybe<Array<ProductVariant>>;
  weight?: Maybe<Scalars['Float']['output']>;
  width?: Maybe<Scalars['Float']['output']>;
};

export type ProductAttribute = {
  __typename?: 'ProductAttribute';
  createdAt: Scalars['DateTime']['output'];
  deletedAt?: Maybe<Scalars['DateTime']['output']>;
  description?: Maybe<Scalars['String']['output']>;
  id: Scalars['ID']['output'];
  /** When true, this attribute is used to differentiate variants (Phase B). */
  isVariantAttribute: Scalars['Boolean']['output'];
  name: Scalars['String']['output'];
  slug: Scalars['String']['output'];
  type: AttributeType;
  updatedAt: Scalars['DateTime']['output'];
  values?: Maybe<Array<ProductAttributeValue>>;
};

export type ProductAttributeValue = {
  __typename?: 'ProductAttributeValue';
  attributeId: Scalars['ID']['output'];
  createdAt: Scalars['DateTime']['output'];
  deletedAt?: Maybe<Scalars['DateTime']['output']>;
  displayOrder: Scalars['Int']['output'];
  id: Scalars['ID']['output'];
  slug: Scalars['String']['output'];
  updatedAt: Scalars['DateTime']['output'];
  value: Scalars['String']['output'];
};

export type ProductImage = {
  __typename?: 'ProductImage';
  altText?: Maybe<Scalars['String']['output']>;
  createdAt: Scalars['DateTime']['output'];
  displayOrder: Scalars['Int']['output'];
  id: Scalars['ID']['output'];
  imageUrl: Scalars['String']['output'];
  isPrimary: Scalars['Boolean']['output'];
  productId: Scalars['ID']['output'];
  updatedAt: Scalars['DateTime']['output'];
};

export enum ProductSortOrder {
  Newest = 'NEWEST',
  PriceAsc = 'PRICE_ASC',
  PriceDesc = 'PRICE_DESC'
}

export enum ProductStatus {
  Active = 'ACTIVE',
  Archived = 'ARCHIVED',
  Draft = 'DRAFT',
  Inactive = 'INACTIVE'
}

export enum ProductType {
  Simple = 'SIMPLE',
  Variable = 'VARIABLE'
}

export type ProductVariant = {
  __typename?: 'ProductVariant';
  attributes: Array<ProductVariantAttribute>;
  availableQuantity?: Maybe<Scalars['Int']['output']>;
  barcode?: Maybe<Scalars['String']['output']>;
  compareAtPrice?: Maybe<Scalars['Float']['output']>;
  costPrice?: Maybe<Scalars['Float']['output']>;
  createdAt: Scalars['DateTime']['output'];
  deletedAt?: Maybe<Scalars['DateTime']['output']>;
  height?: Maybe<Scalars['Float']['output']>;
  id: Scalars['ID']['output'];
  imageUrl?: Maybe<Scalars['String']['output']>;
  length?: Maybe<Scalars['Float']['output']>;
  name?: Maybe<Scalars['String']['output']>;
  price: Scalars['Float']['output'];
  /** Price including tax. Null if parent product has no tax. */
  priceWithTax?: Maybe<Scalars['Float']['output']>;
  productId: Scalars['ID']['output'];
  sku: Scalars['String']['output'];
  status: VariantStatus;
  stockState?: Maybe<StockState>;
  updatedAt: Scalars['DateTime']['output'];
  weight?: Maybe<Scalars['Float']['output']>;
  width?: Maybe<Scalars['Float']['output']>;
};

export type ProductVariantAttribute = {
  __typename?: 'ProductVariantAttribute';
  attributeId: Scalars['ID']['output'];
  attributeName: Scalars['String']['output'];
  attributeSlug: Scalars['String']['output'];
  attributeValueId: Scalars['ID']['output'];
  value: Scalars['String']['output'];
  valueSlug: Scalars['String']['output'];
};

export type Query = {
  __typename?: 'Query';
  activePaymentGateways: Array<PaymentGatewayConfigEntity>;
  adminAttributes: Array<ProductAttribute>;
  adminBrands: Array<Brand>;
  adminCategoriesPaginated: PaginatedCategories;
  adminCoupon: Coupon;
  adminCoupons: Array<Coupon>;
  adminCustomer: AdminCustomer;
  adminCustomers: PaginatedAdminCustomers;
  adminInventoryByProduct: Array<Inventory>;
  adminMenu: Menu;
  adminMenus: Array<Menu>;
  adminNewsletterSubscriptions: PaginatedNewsletterSubscriptions;
  adminPages: Array<Page>;
  adminPagesPaginated: PaginatedPages;
  adminPaymentGateway: PaymentGatewayConfigEntity;
  adminPaymentGateways: Array<PaymentGatewayConfigEntity>;
  adminPaymentTransactions: PaginatedPayments;
  adminProduct: Product;
  adminProducts: Array<Product>;
  adminSlider: Slider;
  adminSliders: Array<Slider>;
  adminSlidersPaginated: PaginatedSliders;
  adminTags: Array<Tag>;
  adminTaxes: Array<Tax>;
  adminTaxesPaginated: PaginatedTaxes;
  adminTheme: AdminTheme;
  attribute: ProductAttribute;
  attributes: Array<ProductAttribute>;
  brand: Brand;
  brands: Array<Brand>;
  categories: Array<Category>;
  category: Category;
  categoryAncestors: Array<Category>;
  categoryChildren: Array<Category>;
  emailSetting: EmailSetting;
  emailTemplate: EmailTemplate;
  emailTemplates: Array<EmailTemplate>;
  image?: Maybe<Image>;
  myAddresses: Array<Address>;
  myCart: Cart;
  myCartItemCount: Scalars['Int']['output'];
  myInventory: Array<Inventory>;
  myInventoryByVariant?: Maybe<Inventory>;
  myInventoryMovements: Array<InventoryMovement>;
  myOrder: Order;
  myOrders: PaginatedOrders;
  myProduct: Product;
  myProductVariantAxes: Array<VariantAxis>;
  myProductVariants: Array<ProductVariant>;
  myProducts: Array<Product>;
  myProfile: AdminCustomer;
  mySeller?: Maybe<Seller>;
  mySellerOrder: SellerOrder;
  mySellerOrders: PaginatedSellerOrders;
  myStore?: Maybe<Store>;
  myStores: Array<Store>;
  myWarehouses: Array<Warehouse>;
  myWishlist: Wishlist;
  myWishlistProductIds: Array<Scalars['String']['output']>;
  page: Page;
  paginatedPublicProducts: PaginatedProducts;
  publicBrand: Brand;
  publicCategoryBySlug: Category;
  publicMenu: Menu;
  publicPage: Page;
  publicProduct: Product;
  publicProducts: Array<Product>;
  publicSlider: Slider;
  publicStore: Store;
  publicTag: Tag;
  role: Role;
  roles: Array<Role>;
  seller: Seller;
  sellerUsers: Array<SellerListItem>;
  sellers: Array<Seller>;
  shopFilterCategories: Array<Category>;
  /** Public — get settings by group. Used by storefront for display config. */
  siteSettings: Array<SiteSetting>;
  store: Store;
  stores: Array<Store>;
  tag: Tag;
  tags: Array<Tag>;
  tax: Tax;
  taxes: Array<Tax>;
  user: User;
  users: Array<User>;
};


export type QueryAdminAttributesArgs = {
  type?: InputMaybe<AttributeType>;
};


export type QueryAdminBrandsArgs = {
  status?: InputMaybe<BrandStatus>;
};


export type QueryAdminCategoriesPaginatedArgs = {
  page?: InputMaybe<Scalars['Int']['input']>;
  pageSize?: InputMaybe<Scalars['Int']['input']>;
  search?: InputMaybe<Scalars['String']['input']>;
};


export type QueryAdminCouponArgs = {
  id: Scalars['ID']['input'];
};


export type QueryAdminCouponsArgs = {
  search?: InputMaybe<Scalars['String']['input']>;
  status?: InputMaybe<Scalars['String']['input']>;
};


export type QueryAdminCustomerArgs = {
  id: Scalars['ID']['input'];
};


export type QueryAdminCustomersArgs = {
  includeDeleted?: InputMaybe<Scalars['Boolean']['input']>;
  page?: InputMaybe<Scalars['Int']['input']>;
  pageSize?: InputMaybe<Scalars['Int']['input']>;
  search?: InputMaybe<Scalars['String']['input']>;
  status?: InputMaybe<Scalars['String']['input']>;
};


export type QueryAdminInventoryByProductArgs = {
  productId: Scalars['ID']['input'];
};


export type QueryAdminMenuArgs = {
  location: MenuLocation;
};


export type QueryAdminNewsletterSubscriptionsArgs = {
  page?: InputMaybe<Scalars['Int']['input']>;
  pageSize?: InputMaybe<Scalars['Int']['input']>;
  search?: InputMaybe<Scalars['String']['input']>;
  status?: InputMaybe<NewsletterStatus>;
};


export type QueryAdminPagesArgs = {
  status?: InputMaybe<PageStatus>;
};


export type QueryAdminPagesPaginatedArgs = {
  page?: InputMaybe<Scalars['Int']['input']>;
  pageSize?: InputMaybe<Scalars['Int']['input']>;
  search?: InputMaybe<Scalars['String']['input']>;
  status?: InputMaybe<PageStatus>;
};


export type QueryAdminPaymentGatewayArgs = {
  id: Scalars['ID']['input'];
};


export type QueryAdminPaymentTransactionsArgs = {
  gateway?: InputMaybe<PaymentGateway>;
  page?: Scalars['Int']['input'];
  pageSize?: Scalars['Int']['input'];
  status?: InputMaybe<PaymentTransactionStatus>;
};


export type QueryAdminProductArgs = {
  id: Scalars['ID']['input'];
};


export type QueryAdminProductsArgs = {
  brandId?: InputMaybe<Scalars['ID']['input']>;
  categoryId?: InputMaybe<Scalars['ID']['input']>;
  status?: InputMaybe<ProductStatus>;
  storeId?: InputMaybe<Scalars['ID']['input']>;
};


export type QueryAdminSliderArgs = {
  id: Scalars['ID']['input'];
};


export type QueryAdminSlidersPaginatedArgs = {
  page?: InputMaybe<Scalars['Int']['input']>;
  pageSize?: InputMaybe<Scalars['Int']['input']>;
  search?: InputMaybe<Scalars['String']['input']>;
  status?: InputMaybe<SliderStatus>;
};


export type QueryAdminTagsArgs = {
  status?: InputMaybe<TagStatus>;
};


export type QueryAdminTaxesPaginatedArgs = {
  page?: InputMaybe<Scalars['Int']['input']>;
  pageSize?: InputMaybe<Scalars['Int']['input']>;
  search?: InputMaybe<Scalars['String']['input']>;
};


export type QueryAttributeArgs = {
  id: Scalars['ID']['input'];
};


export type QueryAttributesArgs = {
  type?: InputMaybe<AttributeType>;
  variantOnly?: InputMaybe<Scalars['Boolean']['input']>;
};


export type QueryBrandArgs = {
  id: Scalars['ID']['input'];
};


export type QueryBrandsArgs = {
  featuredOnly?: InputMaybe<Scalars['Boolean']['input']>;
  status?: InputMaybe<BrandStatus>;
};


export type QueryCategoryArgs = {
  id: Scalars['ID']['input'];
};


export type QueryCategoryAncestorsArgs = {
  id: Scalars['ID']['input'];
};


export type QueryCategoryChildrenArgs = {
  limit?: InputMaybe<Scalars['Int']['input']>;
  parentId?: InputMaybe<Scalars['ID']['input']>;
  search?: InputMaybe<Scalars['String']['input']>;
};


export type QueryEmailTemplateArgs = {
  id: Scalars['ID']['input'];
};


export type QueryImageArgs = {
  id: Scalars['ID']['input'];
};


export type QueryMyInventoryArgs = {
  lowStockOnly?: InputMaybe<Scalars['Boolean']['input']>;
  productId?: InputMaybe<Scalars['ID']['input']>;
  search?: InputMaybe<Scalars['String']['input']>;
  storeId?: InputMaybe<Scalars['ID']['input']>;
  warehouseId?: InputMaybe<Scalars['ID']['input']>;
};


export type QueryMyInventoryByVariantArgs = {
  variantId: Scalars['ID']['input'];
  warehouseId?: InputMaybe<Scalars['ID']['input']>;
};


export type QueryMyInventoryMovementsArgs = {
  limit?: InputMaybe<Scalars['Int']['input']>;
  variantId?: InputMaybe<Scalars['ID']['input']>;
  warehouseId?: InputMaybe<Scalars['ID']['input']>;
};


export type QueryMyOrderArgs = {
  id: Scalars['ID']['input'];
};


export type QueryMyOrdersArgs = {
  page?: InputMaybe<Scalars['Int']['input']>;
  pageSize?: InputMaybe<Scalars['Int']['input']>;
  status?: InputMaybe<OrderStatus>;
};


export type QueryMyProductArgs = {
  id: Scalars['ID']['input'];
};


export type QueryMyProductVariantAxesArgs = {
  productId: Scalars['ID']['input'];
};


export type QueryMyProductVariantsArgs = {
  productId: Scalars['ID']['input'];
};


export type QueryMyProductsArgs = {
  status?: InputMaybe<ProductStatus>;
  storeId?: InputMaybe<Scalars['ID']['input']>;
};


export type QueryMySellerOrderArgs = {
  id: Scalars['ID']['input'];
};


export type QueryMySellerOrdersArgs = {
  page?: InputMaybe<Scalars['Int']['input']>;
  pageSize?: InputMaybe<Scalars['Int']['input']>;
  status?: InputMaybe<OrderStatus>;
};


export type QueryMyStoreArgs = {
  id: Scalars['ID']['input'];
};


export type QueryMyWarehousesArgs = {
  storeId: Scalars['ID']['input'];
};


export type QueryPageArgs = {
  id: Scalars['ID']['input'];
};


export type QueryPaginatedPublicProductsArgs = {
  brandSlug?: InputMaybe<Scalars['String']['input']>;
  categorySlug?: InputMaybe<Scalars['String']['input']>;
  maxPrice?: InputMaybe<Scalars['Float']['input']>;
  minPrice?: InputMaybe<Scalars['Float']['input']>;
  page?: InputMaybe<Scalars['Int']['input']>;
  pageSize?: InputMaybe<Scalars['Int']['input']>;
  sort?: InputMaybe<ProductSortOrder>;
  storeSlug?: InputMaybe<Scalars['String']['input']>;
  tagSlug?: InputMaybe<Scalars['String']['input']>;
};


export type QueryPublicBrandArgs = {
  slug: Scalars['String']['input'];
};


export type QueryPublicCategoryBySlugArgs = {
  slug: Scalars['String']['input'];
};


export type QueryPublicMenuArgs = {
  location: MenuLocation;
};


export type QueryPublicPageArgs = {
  slug: Scalars['String']['input'];
};


export type QueryPublicProductArgs = {
  slug: Scalars['String']['input'];
};


export type QueryPublicProductsArgs = {
  brandSlug?: InputMaybe<Scalars['String']['input']>;
  categorySlug?: InputMaybe<Scalars['String']['input']>;
  limit?: InputMaybe<Scalars['Float']['input']>;
  sort?: InputMaybe<ProductSortOrder>;
  storeSlug?: InputMaybe<Scalars['String']['input']>;
  tagSlug?: InputMaybe<Scalars['String']['input']>;
};


export type QueryPublicSliderArgs = {
  key: Scalars['String']['input'];
};


export type QueryPublicStoreArgs = {
  slug: Scalars['String']['input'];
};


export type QueryPublicTagArgs = {
  slug: Scalars['String']['input'];
};


export type QueryRoleArgs = {
  id: Scalars['ID']['input'];
};


export type QuerySellerArgs = {
  id: Scalars['ID']['input'];
};


export type QuerySellerUsersArgs = {
  status?: InputMaybe<SellerListStatus>;
};


export type QuerySellersArgs = {
  status?: InputMaybe<SellerStatus>;
};


export type QuerySiteSettingsArgs = {
  group?: InputMaybe<SettingGroup>;
};


export type QueryStoreArgs = {
  id: Scalars['ID']['input'];
};


export type QueryStoresArgs = {
  status?: InputMaybe<StoreStatus>;
};


export type QueryTagArgs = {
  id: Scalars['ID']['input'];
};


export type QueryTagsArgs = {
  featuredOnly?: InputMaybe<Scalars['Boolean']['input']>;
  status?: InputMaybe<TagStatus>;
};


export type QueryTaxArgs = {
  id: Scalars['ID']['input'];
};


export type QueryUserArgs = {
  id: Scalars['ID']['input'];
};

export type RemoveCartItemInput = {
  variantId: Scalars['ID']['input'];
};

export type ReorderAttributeValuesInput = {
  attributeId: Scalars['ID']['input'];
  /** Value IDs in the desired display order (top to bottom) */
  valueIds: Array<Scalars['ID']['input']>;
};

export type ReorderProductImagesInput = {
  /** Image IDs in desired display order (top to bottom) */
  imageIds: Array<Scalars['ID']['input']>;
  productId: Scalars['ID']['input'];
};

export type ReorderSlideItemsInput = {
  /** Slide item IDs in their new order (top → bottom). */
  itemIds: Array<Scalars['ID']['input']>;
  sliderId: Scalars['ID']['input'];
};

export type Role = {
  __typename?: 'Role';
  createdAt: Scalars['DateTime']['output'];
  createdById?: Maybe<Scalars['String']['output']>;
  description?: Maybe<Scalars['String']['output']>;
  id: Scalars['ID']['output'];
  isDefault?: Maybe<Scalars['Boolean']['output']>;
  name: Scalars['String']['output'];
  updatedAt: Scalars['DateTime']['output'];
  updatedById?: Maybe<Scalars['String']['output']>;
};

export type Seller = {
  __typename?: 'Seller';
  bankVerifiedAt?: Maybe<Scalars['DateTime']['output']>;
  businessEmail: Scalars['String']['output'];
  businessPhone: Scalars['String']['output'];
  businessType: BusinessType;
  commissionRate: Scalars['Float']['output'];
  createdAt: Scalars['DateTime']['output'];
  dateOfIncorporation?: Maybe<Scalars['DateTime']['output']>;
  deletedAt?: Maybe<Scalars['DateTime']['output']>;
  displayName: Scalars['String']['output'];
  documentsVerifiedAt?: Maybe<Scalars['DateTime']['output']>;
  gstin?: Maybe<Scalars['String']['output']>;
  gstinVerifiedAt?: Maybe<Scalars['DateTime']['output']>;
  id: Scalars['ID']['output'];
  legalName: Scalars['String']['output'];
  overallStatus: SellerStatus;
  panNumber: Scalars['String']['output'];
  panVerifiedAt?: Maybe<Scalars['DateTime']['output']>;
  payoutAccounts?: Maybe<Array<SellerPayoutAccount>>;
  registrationNumber?: Maybe<Scalars['String']['output']>;
  rejectionReason?: Maybe<Scalars['String']['output']>;
  signatoryDesignation?: Maybe<Scalars['String']['output']>;
  signatoryName?: Maybe<Scalars['String']['output']>;
  signatoryPan?: Maybe<Scalars['String']['output']>;
  supportEmail?: Maybe<Scalars['String']['output']>;
  updatedAt: Scalars['DateTime']['output'];
  userId: Scalars['ID']['output'];
};

export type SellerListItem = {
  __typename?: 'SellerListItem';
  email: Scalars['String']['output'];
  emailVerifiedAt?: Maybe<Scalars['DateTime']['output']>;
  name: Scalars['String']['output'];
  phone: Scalars['String']['output'];
  registeredAt: Scalars['DateTime']['output'];
  seller?: Maybe<Seller>;
  status: SellerListStatus;
  userId: Scalars['ID']['output'];
};

export enum SellerListStatus {
  Draft = 'DRAFT',
  Pending = 'PENDING',
  Registered = 'REGISTERED',
  RegisteredUnverified = 'REGISTERED_UNVERIFIED',
  Rejected = 'REJECTED',
  Suspended = 'SUSPENDED',
  UnderReview = 'UNDER_REVIEW',
  Verified = 'VERIFIED'
}

export type SellerOrder = {
  __typename?: 'SellerOrder';
  cancelledAt?: Maybe<Scalars['DateTime']['output']>;
  commissionAmount: Scalars['Float']['output'];
  createdAt: Scalars['DateTime']['output'];
  currencyCode: Scalars['String']['output'];
  customerName?: Maybe<Scalars['String']['output']>;
  deliveredAt?: Maybe<Scalars['DateTime']['output']>;
  discountAmount: Scalars['Float']['output'];
  id: Scalars['ID']['output'];
  itemCount: Scalars['Int']['output'];
  items: Array<OrderItem>;
  orderId: Scalars['ID']['output'];
  orderNumber: Scalars['String']['output'];
  packedAt?: Maybe<Scalars['DateTime']['output']>;
  parentOrderNumber?: Maybe<Scalars['String']['output']>;
  paymentStatus: PaymentStatus;
  payoutAmount: Scalars['Float']['output'];
  payoutStatus: PayoutStatus;
  sellerId: Scalars['ID']['output'];
  shippedAt?: Maybe<Scalars['DateTime']['output']>;
  shippingAddress?: Maybe<OrderAddressSnapshot>;
  shippingAmount: Scalars['Float']['output'];
  status: OrderStatus;
  statusHistory: Array<OrderStatusHistoryEntry>;
  storeId: Scalars['ID']['output'];
  storeName?: Maybe<Scalars['String']['output']>;
  subtotal: Scalars['Float']['output'];
  taxAmount: Scalars['Float']['output'];
  updatedAt: Scalars['DateTime']['output'];
};

export type SellerPayoutAccount = {
  __typename?: 'SellerPayoutAccount';
  accountHolderName: Scalars['String']['output'];
  accountNumber?: Maybe<Scalars['String']['output']>;
  accountType: Scalars['String']['output'];
  bankName?: Maybe<Scalars['String']['output']>;
  createdAt: Scalars['DateTime']['output'];
  deletedAt?: Maybe<Scalars['DateTime']['output']>;
  id: Scalars['ID']['output'];
  ifscCode?: Maybe<Scalars['String']['output']>;
  isPrimary: Scalars['Boolean']['output'];
  isVerified: Scalars['Boolean']['output'];
  sellerId: Scalars['ID']['output'];
  updatedAt: Scalars['DateTime']['output'];
  upiId?: Maybe<Scalars['String']['output']>;
  walletProvider?: Maybe<Scalars['String']['output']>;
};

export enum SellerStatus {
  Draft = 'DRAFT',
  Pending = 'PENDING',
  Rejected = 'REJECTED',
  Suspended = 'SUSPENDED',
  UnderReview = 'UNDER_REVIEW',
  Verified = 'VERIFIED'
}

export enum SellerVerificationSection {
  Bank = 'BANK',
  Documents = 'DOCUMENTS',
  Gstin = 'GSTIN',
  Pan = 'PAN'
}

export type SendTestEmailInput = {
  templateKey?: InputMaybe<Scalars['String']['input']>;
  to: Scalars['String']['input'];
};

export type SendTestResult = {
  __typename?: 'SendTestResult';
  message?: Maybe<Scalars['String']['output']>;
  success: Scalars['Boolean']['output'];
};

export type SetBrandStatusInput = {
  id: Scalars['ID']['input'];
  isFeatured?: InputMaybe<Scalars['Boolean']['input']>;
  status?: InputMaybe<BrandStatus>;
};

export type SetPageStatusInput = {
  id: Scalars['ID']['input'];
  status: PageStatus;
};

export type SetProductStatusInput = {
  id: Scalars['ID']['input'];
  /** Reason — recommended for ARCHIVED */
  reason?: InputMaybe<Scalars['String']['input']>;
  status: ProductStatus;
};

export type SetReorderPointInput = {
  reorderPoint: Scalars['Int']['input'];
  reorderQuantity?: InputMaybe<Scalars['Int']['input']>;
  variantId: Scalars['ID']['input'];
  warehouseId?: InputMaybe<Scalars['ID']['input']>;
};

export type SetSellerStatusInput = {
  id: Scalars['ID']['input'];
  reason?: InputMaybe<Scalars['String']['input']>;
  status: SellerStatus;
};

export type SetSliderStatusInput = {
  id: Scalars['ID']['input'];
  status: SliderStatus;
};

export type SetStoreStatusInput = {
  id: Scalars['ID']['input'];
  reason?: InputMaybe<Scalars['String']['input']>;
  status: StoreStatus;
};

export type SetTagStatusInput = {
  id: Scalars['ID']['input'];
  isFeatured?: InputMaybe<Scalars['Boolean']['input']>;
  status?: InputMaybe<TagStatus>;
};

export type SetVariantAxesInput = {
  /** Attribute IDs that define this variable product (e.g. Color, Size). Order is preserved for SKU generation. */
  attributeIds: Array<Scalars['ID']['input']>;
  productId: Scalars['ID']['input'];
};

export enum SettingGroup {
  Checkout = 'CHECKOUT',
  Email = 'EMAIL',
  General = 'GENERAL',
  Seo = 'SEO',
  Tax = 'TAX'
}

export enum SettingValueType {
  Boolean = 'BOOLEAN',
  Json = 'JSON',
  Number = 'NUMBER',
  String = 'STRING'
}

export type SiteSetting = {
  __typename?: 'SiteSetting';
  createdAt: Scalars['DateTime']['output'];
  description?: Maybe<Scalars['String']['output']>;
  group: SettingGroup;
  id: Scalars['ID']['output'];
  key: Scalars['String']['output'];
  label: Scalars['String']['output'];
  updatedAt: Scalars['DateTime']['output'];
  value: Scalars['String']['output'];
  valueType: SettingValueType;
};

export type SlideItem = {
  __typename?: 'SlideItem';
  createdAt: Scalars['DateTime']['output'];
  ctaLabel?: Maybe<Scalars['String']['output']>;
  deletedAt?: Maybe<Scalars['DateTime']['output']>;
  description?: Maybe<Scalars['String']['output']>;
  id: Scalars['ID']['output'];
  /** Desktop image (>= 1200px). Falls through to tablet/mobile chain. */
  imageUrl?: Maybe<Scalars['String']['output']>;
  isEnabled: Scalars['Boolean']['output'];
  link?: Maybe<Scalars['String']['output']>;
  /** Mobile image (<768px). Falls back to tablet → desktop. */
  mobileImageUrl?: Maybe<Scalars['String']['output']>;
  order: Scalars['Int']['output'];
  sliderId: Scalars['ID']['output'];
  /** Tablet image (768-1199px). Falls back to desktop if empty. */
  tabletImageUrl?: Maybe<Scalars['String']['output']>;
  title?: Maybe<Scalars['String']['output']>;
  updatedAt: Scalars['DateTime']['output'];
};

export type Slider = {
  __typename?: 'Slider';
  /** JSON-stringified config (style, autoplay interval, etc.). Frontend parses. */
  config: Scalars['String']['output'];
  createdAt: Scalars['DateTime']['output'];
  deletedAt?: Maybe<Scalars['DateTime']['output']>;
  description?: Maybe<Scalars['String']['output']>;
  id: Scalars['ID']['output'];
  items?: Maybe<Array<SlideItem>>;
  /** Stable identifier used by page blocks to reference this slider. Auto-derived from name on create; admin-editable. */
  key: Scalars['String']['output'];
  name: Scalars['String']['output'];
  status: SliderStatus;
  updatedAt: Scalars['DateTime']['output'];
};

export enum SliderStatus {
  Archived = 'ARCHIVED',
  Draft = 'DRAFT',
  Published = 'PUBLISHED'
}

export enum StockState {
  InStock = 'IN_STOCK',
  LowStock = 'LOW_STOCK',
  OutOfStock = 'OUT_OF_STOCK'
}

export type Store = {
  __typename?: 'Store';
  bannerUrl?: Maybe<Scalars['String']['output']>;
  createdAt: Scalars['DateTime']['output'];
  currencyCode: Scalars['String']['output'];
  customDomain?: Maybe<Scalars['String']['output']>;
  deletedAt?: Maybe<Scalars['DateTime']['output']>;
  description?: Maybe<Scalars['String']['output']>;
  id: Scalars['ID']['output'];
  isFeatured: Scalars['Boolean']['output'];
  locale: Scalars['String']['output'];
  logoUrl?: Maybe<Scalars['String']['output']>;
  name: Scalars['String']['output'];
  sellerId: Scalars['ID']['output'];
  slug: Scalars['String']['output'];
  status: StoreStatus;
  subdomain?: Maybe<Scalars['String']['output']>;
  supportEmail?: Maybe<Scalars['String']['output']>;
  supportPhone?: Maybe<Scalars['String']['output']>;
  timezone: Scalars['String']['output'];
  updatedAt: Scalars['DateTime']['output'];
  warehouses?: Maybe<Array<Warehouse>>;
};

export enum StoreStatus {
  Active = 'ACTIVE',
  Draft = 'DRAFT',
  Inactive = 'INACTIVE',
  Suspended = 'SUSPENDED',
  UnderReview = 'UNDER_REVIEW'
}

export type SubscribeNewsletterInput = {
  email: Scalars['String']['input'];
  source?: InputMaybe<Scalars['String']['input']>;
};

export type Tag = {
  __typename?: 'Tag';
  createdAt: Scalars['DateTime']['output'];
  deletedAt?: Maybe<Scalars['DateTime']['output']>;
  description?: Maybe<Scalars['String']['output']>;
  id: Scalars['ID']['output'];
  isFeatured: Scalars['Boolean']['output'];
  name: Scalars['String']['output'];
  slug: Scalars['String']['output'];
  status: TagStatus;
  updatedAt: Scalars['DateTime']['output'];
};

export enum TagStatus {
  Active = 'ACTIVE',
  Inactive = 'INACTIVE'
}

export type Tax = {
  __typename?: 'Tax';
  createdAt: Scalars['DateTime']['output'];
  deletedAt?: Maybe<Scalars['DateTime']['output']>;
  description?: Maybe<Scalars['String']['output']>;
  displayOrder: Scalars['Int']['output'];
  id: Scalars['ID']['output'];
  isActive: Scalars['Boolean']['output'];
  name: Scalars['String']['output'];
  /** Percentage value (0-100), e.g. 18.00 for 18% GST. */
  rate: Scalars['Float']['output'];
  updatedAt: Scalars['DateTime']['output'];
};

export type ToggleWishlistInput = {
  productId: Scalars['ID']['input'];
  variantId?: InputMaybe<Scalars['ID']['input']>;
};

export type UpdateAddressInput = {
  addressLine1?: InputMaybe<Scalars['String']['input']>;
  addressLine2?: InputMaybe<Scalars['String']['input']>;
  city?: InputMaybe<Scalars['String']['input']>;
  countryCode?: InputMaybe<Scalars['String']['input']>;
  firstName?: InputMaybe<Scalars['String']['input']>;
  id: Scalars['ID']['input'];
  isDefault?: InputMaybe<Scalars['Boolean']['input']>;
  label?: InputMaybe<Scalars['String']['input']>;
  lastName?: InputMaybe<Scalars['String']['input']>;
  phone?: InputMaybe<Scalars['String']['input']>;
  postalCode?: InputMaybe<Scalars['String']['input']>;
  state?: InputMaybe<Scalars['String']['input']>;
  type?: InputMaybe<AddressType>;
};

export type UpdateAdminThemeInput = {
  accentDark?: InputMaybe<Scalars['String']['input']>;
  accentLight?: InputMaybe<Scalars['String']['input']>;
  destructiveDark?: InputMaybe<Scalars['String']['input']>;
  destructiveLight?: InputMaybe<Scalars['String']['input']>;
  fontFamily?: InputMaybe<Scalars['String']['input']>;
  primaryDark?: InputMaybe<Scalars['String']['input']>;
  primaryLight?: InputMaybe<Scalars['String']['input']>;
  radius?: InputMaybe<Scalars['String']['input']>;
  sidebarDark?: InputMaybe<Scalars['String']['input']>;
  sidebarLight?: InputMaybe<Scalars['String']['input']>;
};

export type UpdateAttributeInput = {
  description?: InputMaybe<Scalars['String']['input']>;
  id: Scalars['ID']['input'];
  isVariantAttribute?: InputMaybe<Scalars['Boolean']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
  /** Auto-generated from name if blank */
  slug?: InputMaybe<Scalars['String']['input']>;
  type?: InputMaybe<AttributeType>;
};

export type UpdateAttributeValueInput = {
  /** Appended to end of list when omitted */
  displayOrder?: InputMaybe<Scalars['Int']['input']>;
  id: Scalars['ID']['input'];
  /** Auto-generated from value if blank */
  slug?: InputMaybe<Scalars['String']['input']>;
  value?: InputMaybe<Scalars['String']['input']>;
};

export type UpdateBrandInput = {
  bannerUrl?: InputMaybe<Scalars['String']['input']>;
  countryCode?: InputMaybe<Scalars['String']['input']>;
  description?: InputMaybe<Scalars['String']['input']>;
  foundedYear?: InputMaybe<Scalars['Int']['input']>;
  id: Scalars['ID']['input'];
  isFeatured?: InputMaybe<Scalars['Boolean']['input']>;
  logoUrl?: InputMaybe<Scalars['String']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
  /** Auto-generated from name if blank */
  slug?: InputMaybe<Scalars['String']['input']>;
  websiteUrl?: InputMaybe<Scalars['String']['input']>;
};

export type UpdateCartItemQtyInput = {
  quantity: Scalars['Int']['input'];
  variantId: Scalars['ID']['input'];
};

export type UpdateCategoryInput = {
  description?: InputMaybe<Scalars['String']['input']>;
  displayOrder?: InputMaybe<Scalars['Int']['input']>;
  iconUrl?: InputMaybe<Scalars['String']['input']>;
  id: Scalars['ID']['input'];
  imageUrl?: InputMaybe<Scalars['String']['input']>;
  isActive?: InputMaybe<Scalars['Boolean']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
  parentId?: InputMaybe<Scalars['String']['input']>;
  slug?: InputMaybe<Scalars['String']['input']>;
};

export type UpdateCategoryTreeInput = {
  items: Array<CategoryTreeItemInput>;
};

export type UpdateCouponInput = {
  description?: InputMaybe<Scalars['String']['input']>;
  discountType?: InputMaybe<Scalars['String']['input']>;
  discountValue?: InputMaybe<Scalars['Float']['input']>;
  id: Scalars['ID']['input'];
  isActive?: InputMaybe<Scalars['Boolean']['input']>;
  maximumDiscountAmount?: InputMaybe<Scalars['Float']['input']>;
  minimumPurchaseAmount?: InputMaybe<Scalars['Float']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
  storeId?: InputMaybe<Scalars['String']['input']>;
  usageLimit?: InputMaybe<Scalars['Int']['input']>;
  usageLimitPerUser?: InputMaybe<Scalars['Int']['input']>;
  validFrom?: InputMaybe<Scalars['String']['input']>;
  validUntil?: InputMaybe<Scalars['String']['input']>;
};

export type UpdateCustomerInput = {
  id: Scalars['ID']['input'];
  marketingOptIn?: InputMaybe<Scalars['Boolean']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
  phone?: InputMaybe<Scalars['String']['input']>;
  preferredCurrency?: InputMaybe<Scalars['String']['input']>;
  status?: InputMaybe<Scalars['String']['input']>;
};

export type UpdateEmailSettingInput = {
  encryption?: InputMaybe<EmailEncryption>;
  host?: InputMaybe<Scalars['String']['input']>;
  localDomain?: InputMaybe<Scalars['String']['input']>;
  mailer?: InputMaybe<EmailMailer>;
  password?: InputMaybe<Scalars['String']['input']>;
  port?: InputMaybe<Scalars['Int']['input']>;
  senderEmail?: InputMaybe<Scalars['String']['input']>;
  senderName?: InputMaybe<Scalars['String']['input']>;
  username?: InputMaybe<Scalars['String']['input']>;
};

export type UpdateEmailTemplateInput = {
  description?: InputMaybe<Scalars['String']['input']>;
  htmlBody?: InputMaybe<Scalars['String']['input']>;
  id: Scalars['String']['input'];
  isEnabled?: InputMaybe<Scalars['Boolean']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
  subject?: InputMaybe<Scalars['String']['input']>;
  textBody?: InputMaybe<Scalars['String']['input']>;
};

export type UpdateGatewayConfigInput = {
  credentialsJson?: InputMaybe<Scalars['String']['input']>;
  description?: InputMaybe<Scalars['String']['input']>;
  displayName?: InputMaybe<Scalars['String']['input']>;
  displayOrder?: InputMaybe<Scalars['Int']['input']>;
  id: Scalars['ID']['input'];
  instructions?: InputMaybe<Scalars['String']['input']>;
  isDefault?: InputMaybe<Scalars['Boolean']['input']>;
  isEnabled?: InputMaybe<Scalars['Boolean']['input']>;
  logoUrl?: InputMaybe<Scalars['String']['input']>;
  paymentType?: InputMaybe<GatewayPaymentType>;
  processingFee?: InputMaybe<Scalars['Float']['input']>;
  processingFeeType?: InputMaybe<ProcessingFeeType>;
  sandboxMode?: InputMaybe<Scalars['Boolean']['input']>;
  supportedMethods?: InputMaybe<Array<Scalars['String']['input']>>;
};

export type UpdateMyProfileInput = {
  marketingOptIn?: InputMaybe<Scalars['Boolean']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
  phone?: InputMaybe<Scalars['String']['input']>;
  preferredCurrency?: InputMaybe<Scalars['String']['input']>;
};

export type UpdatePageInput = {
  /** JSON-encoded blocks array. Optional on create; defaults to "[]". */
  blocks?: InputMaybe<Scalars['String']['input']>;
  id: Scalars['ID']['input'];
  metaDesc?: InputMaybe<Scalars['String']['input']>;
  metaTitle?: InputMaybe<Scalars['String']['input']>;
  slug?: InputMaybe<Scalars['String']['input']>;
  title?: InputMaybe<Scalars['String']['input']>;
};

export type UpdatePayoutAccountInput = {
  accountHolderName?: InputMaybe<Scalars['String']['input']>;
  accountNumber?: InputMaybe<Scalars['String']['input']>;
  /** One of: bank, upi, wallet */
  accountType?: InputMaybe<Scalars['String']['input']>;
  bankName?: InputMaybe<Scalars['String']['input']>;
  id: Scalars['ID']['input'];
  ifscCode?: InputMaybe<Scalars['String']['input']>;
  isPrimary?: InputMaybe<Scalars['Boolean']['input']>;
  upiId?: InputMaybe<Scalars['String']['input']>;
  walletProvider?: InputMaybe<Scalars['String']['input']>;
};

export type UpdateProductImageInput = {
  altText?: InputMaybe<Scalars['String']['input']>;
  displayOrder?: InputMaybe<Scalars['Int']['input']>;
  id: Scalars['ID']['input'];
  isPrimary?: InputMaybe<Scalars['Boolean']['input']>;
};

export type UpdateProductInput = {
  brandId?: InputMaybe<Scalars['ID']['input']>;
  categoryId?: InputMaybe<Scalars['ID']['input']>;
  compareAtPrice?: InputMaybe<Scalars['Float']['input']>;
  costPrice?: InputMaybe<Scalars['Float']['input']>;
  description?: InputMaybe<Scalars['String']['input']>;
  height?: InputMaybe<Scalars['Float']['input']>;
  hsnCode?: InputMaybe<Scalars['String']['input']>;
  id: Scalars['ID']['input'];
  isDigital?: InputMaybe<Scalars['Boolean']['input']>;
  length?: InputMaybe<Scalars['Float']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
  /** Required for SIMPLE products. Ignored for VARIABLE (set per variant). */
  price?: InputMaybe<Scalars['Float']['input']>;
  /** SIMPLE = single SKU (auto-creates 1 variant with the price). VARIABLE = seller adds variants on the next screen. */
  productType?: InputMaybe<ProductType>;
  seoDescription?: InputMaybe<Scalars['String']['input']>;
  seoKeywords?: InputMaybe<Array<Scalars['String']['input']>>;
  seoTitle?: InputMaybe<Scalars['String']['input']>;
  shortDescription?: InputMaybe<Scalars['String']['input']>;
  /** SKU. Auto-generated from product name if blank. */
  sku?: InputMaybe<Scalars['String']['input']>;
  /** Auto-generated from name if blank */
  slug?: InputMaybe<Scalars['String']['input']>;
  /** JSON: [{name, order, items: [{label, value, order}]}] */
  specifications?: InputMaybe<Scalars['String']['input']>;
  tagIds?: InputMaybe<Array<Scalars['ID']['input']>>;
  taxId?: InputMaybe<Scalars['ID']['input']>;
  weight?: InputMaybe<Scalars['Float']['input']>;
  width?: InputMaybe<Scalars['Float']['input']>;
};

export type UpdateRoleInput = {
  createdById?: InputMaybe<Scalars['String']['input']>;
  description?: InputMaybe<Scalars['String']['input']>;
  id: Scalars['ID']['input'];
  isDefault?: InputMaybe<Scalars['Boolean']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
  updatedById?: InputMaybe<Scalars['String']['input']>;
};

export type UpdateSellerInput = {
  businessEmail?: InputMaybe<Scalars['String']['input']>;
  businessPhone?: InputMaybe<Scalars['String']['input']>;
  businessType?: InputMaybe<BusinessType>;
  commissionRate?: InputMaybe<Scalars['Float']['input']>;
  dateOfIncorporation?: InputMaybe<Scalars['DateTime']['input']>;
  /** Storefront / brand name */
  displayName?: InputMaybe<Scalars['String']['input']>;
  /** 15-char GSTIN */
  gstin?: InputMaybe<Scalars['String']['input']>;
  id: Scalars['ID']['input'];
  /** Legal/registered business name */
  legalName?: InputMaybe<Scalars['String']['input']>;
  /** India PAN (10 chars) */
  panNumber?: InputMaybe<Scalars['String']['input']>;
  /** CIN / LLPIN / etc. */
  registrationNumber?: InputMaybe<Scalars['String']['input']>;
  signatoryDesignation?: InputMaybe<Scalars['String']['input']>;
  signatoryName?: InputMaybe<Scalars['String']['input']>;
  signatoryPan?: InputMaybe<Scalars['String']['input']>;
  supportEmail?: InputMaybe<Scalars['String']['input']>;
};

export type UpdateSellerOrderStatusInput = {
  notes?: InputMaybe<Scalars['String']['input']>;
  sellerOrderId: Scalars['ID']['input'];
  status: OrderStatus;
};

export type UpdateSiteSettingInput = {
  key: Scalars['String']['input'];
  value: Scalars['String']['input'];
};

export type UpdateSlideItemInput = {
  ctaLabel?: InputMaybe<Scalars['String']['input']>;
  description?: InputMaybe<Scalars['String']['input']>;
  id: Scalars['ID']['input'];
  imageUrl?: InputMaybe<Scalars['String']['input']>;
  isEnabled?: InputMaybe<Scalars['Boolean']['input']>;
  link?: InputMaybe<Scalars['String']['input']>;
  mobileImageUrl?: InputMaybe<Scalars['String']['input']>;
  order?: InputMaybe<Scalars['Int']['input']>;
  tabletImageUrl?: InputMaybe<Scalars['String']['input']>;
  title?: InputMaybe<Scalars['String']['input']>;
};

export type UpdateSliderInput = {
  /** JSON-encoded config object. */
  config?: InputMaybe<Scalars['String']['input']>;
  description?: InputMaybe<Scalars['String']['input']>;
  id: Scalars['ID']['input'];
  /** Stable identifier. Auto-slugified from name if omitted. */
  key?: InputMaybe<Scalars['String']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
};

export type UpdateStoreInput = {
  bannerUrl?: InputMaybe<Scalars['String']['input']>;
  /** ISO 4217 currency code (default: INR) */
  currencyCode?: InputMaybe<Scalars['String']['input']>;
  description?: InputMaybe<Scalars['String']['input']>;
  id: Scalars['ID']['input'];
  isFeatured?: InputMaybe<Scalars['Boolean']['input']>;
  /** BCP 47 locale (default: en-IN) */
  locale?: InputMaybe<Scalars['String']['input']>;
  logoUrl?: InputMaybe<Scalars['String']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
  /** Auto-generated from name if blank */
  slug?: InputMaybe<Scalars['String']['input']>;
  supportEmail?: InputMaybe<Scalars['String']['input']>;
  supportPhone?: InputMaybe<Scalars['String']['input']>;
  /** IANA timezone (default: Asia/Kolkata) */
  timezone?: InputMaybe<Scalars['String']['input']>;
};

export type UpdateTagInput = {
  description?: InputMaybe<Scalars['String']['input']>;
  id: Scalars['ID']['input'];
  isFeatured?: InputMaybe<Scalars['Boolean']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
  /** Auto-generated from name if blank */
  slug?: InputMaybe<Scalars['String']['input']>;
};

export type UpdateTaxInput = {
  description?: InputMaybe<Scalars['String']['input']>;
  displayOrder?: InputMaybe<Scalars['Int']['input']>;
  id: Scalars['ID']['input'];
  isActive?: InputMaybe<Scalars['Boolean']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
  rate?: InputMaybe<Scalars['Float']['input']>;
};

export type UpdateUserInput = {
  avatarUrl?: InputMaybe<Scalars['String']['input']>;
  dateOfBirth?: InputMaybe<Scalars['DateTime']['input']>;
  email?: InputMaybe<Scalars['String']['input']>;
  emailVerifiedAt?: InputMaybe<Scalars['DateTime']['input']>;
  gender?: InputMaybe<Scalars['String']['input']>;
  id: Scalars['ID']['input'];
  lastLoginAt?: InputMaybe<Scalars['DateTime']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
  password?: InputMaybe<Scalars['String']['input']>;
  phone?: InputMaybe<Scalars['String']['input']>;
  phoneVerifiedAt?: InputMaybe<Scalars['DateTime']['input']>;
  roleId?: InputMaybe<Scalars['String']['input']>;
  status?: InputMaybe<Scalars['String']['input']>;
};

export type UpdateVariantInput = {
  compareAtPrice?: InputMaybe<Scalars['Float']['input']>;
  costPrice?: InputMaybe<Scalars['Float']['input']>;
  id: Scalars['ID']['input'];
  imageUrl?: InputMaybe<Scalars['String']['input']>;
  price?: InputMaybe<Scalars['Float']['input']>;
  sku?: InputMaybe<Scalars['String']['input']>;
  status?: InputMaybe<VariantStatus>;
};

export type UpdateWarehouseInput = {
  addressLine1?: InputMaybe<Scalars['String']['input']>;
  addressLine2?: InputMaybe<Scalars['String']['input']>;
  city?: InputMaybe<Scalars['String']['input']>;
  /** Short unique-per-store code, e.g. MUM01 */
  code?: InputMaybe<Scalars['String']['input']>;
  /** ISO 3166-1 alpha-2 (default: IN) */
  countryCode?: InputMaybe<Scalars['String']['input']>;
  id: Scalars['ID']['input'];
  isActive?: InputMaybe<Scalars['Boolean']['input']>;
  isDefault?: InputMaybe<Scalars['Boolean']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
  phone?: InputMaybe<Scalars['String']['input']>;
  postalCode?: InputMaybe<Scalars['String']['input']>;
  state?: InputMaybe<Scalars['String']['input']>;
};

export type UpsertMenuInput = {
  isActive?: InputMaybe<Scalars['Boolean']['input']>;
  /** JSON-encoded array of MenuItem nodes (tree). */
  items: Scalars['String']['input'];
  location: MenuLocation;
  name: Scalars['String']['input'];
};

export type User = {
  __typename?: 'User';
  avatarUrl?: Maybe<Scalars['String']['output']>;
  createdAt: Scalars['DateTime']['output'];
  dateOfBirth?: Maybe<Scalars['DateTime']['output']>;
  email: Scalars['String']['output'];
  emailVerifiedAt?: Maybe<Scalars['DateTime']['output']>;
  gender?: Maybe<Scalars['String']['output']>;
  id: Scalars['ID']['output'];
  lastLoginAt?: Maybe<Scalars['DateTime']['output']>;
  name?: Maybe<Scalars['String']['output']>;
  phone?: Maybe<Scalars['String']['output']>;
  phoneVerifiedAt?: Maybe<Scalars['DateTime']['output']>;
  role?: Maybe<Role>;
  roleId?: Maybe<Scalars['String']['output']>;
  status?: Maybe<Scalars['String']['output']>;
  updatedAt: Scalars['DateTime']['output'];
};

export type ValidateCouponInput = {
  code: Scalars['String']['input'];
};

export type VariantAxis = {
  __typename?: 'VariantAxis';
  attributeId: Scalars['ID']['output'];
  attributeName: Scalars['String']['output'];
  attributeSlug: Scalars['String']['output'];
  values: Array<ProductAttributeValue>;
};

export type VariantAxisValuesInput = {
  attributeId: Scalars['ID']['input'];
  /** Selected value IDs to include in the matrix */
  valueIds: Array<Scalars['ID']['input']>;
};

export enum VariantStatus {
  Active = 'ACTIVE',
  Inactive = 'INACTIVE',
  OutOfStock = 'OUT_OF_STOCK'
}

export type VerifyPaymentInput = {
  gatewayOrderId?: InputMaybe<Scalars['String']['input']>;
  gatewayPaymentId: Scalars['String']['input'];
  gatewaySignature: Scalars['String']['input'];
  orderId: Scalars['ID']['input'];
};

export type VerifySellerSectionInput = {
  id: Scalars['ID']['input'];
  section: SellerVerificationSection;
  verified: Scalars['Boolean']['input'];
};

export type Warehouse = {
  __typename?: 'Warehouse';
  addressLine1: Scalars['String']['output'];
  addressLine2?: Maybe<Scalars['String']['output']>;
  city: Scalars['String']['output'];
  code: Scalars['String']['output'];
  countryCode: Scalars['String']['output'];
  createdAt: Scalars['DateTime']['output'];
  deletedAt?: Maybe<Scalars['DateTime']['output']>;
  id: Scalars['ID']['output'];
  isActive: Scalars['Boolean']['output'];
  isDefault: Scalars['Boolean']['output'];
  name: Scalars['String']['output'];
  phone?: Maybe<Scalars['String']['output']>;
  postalCode: Scalars['String']['output'];
  state: Scalars['String']['output'];
  storeId: Scalars['ID']['output'];
  updatedAt: Scalars['DateTime']['output'];
};

export type Wishlist = {
  __typename?: 'Wishlist';
  createdAt: Scalars['DateTime']['output'];
  customerId: Scalars['ID']['output'];
  id: Scalars['ID']['output'];
  isDefault: Scalars['Boolean']['output'];
  isPublic: Scalars['Boolean']['output'];
  /** Convenience count — same as items.length. */
  itemCount: Scalars['Int']['output'];
  items: Array<WishlistItem>;
  name: Scalars['String']['output'];
  updatedAt: Scalars['DateTime']['output'];
};

export type WishlistItem = {
  __typename?: 'WishlistItem';
  createdAt: Scalars['DateTime']['output'];
  id: Scalars['ID']['output'];
  product?: Maybe<Product>;
  productId: Scalars['ID']['output'];
  variantId?: Maybe<Scalars['ID']['output']>;
  wishlistId: Scalars['ID']['output'];
};

export type GetMyProfileQueryVariables = Exact<{ [key: string]: never; }>;


export type GetMyProfileQuery = { __typename?: 'Query', myProfile: (
    { __typename?: 'AdminCustomer' }
    & { ' $fragmentRefs'?: { 'AdminCustomerFieldsFragment': AdminCustomerFieldsFragment } }
  ) };

export type UpdateMyProfileMutationVariables = Exact<{
  input: UpdateMyProfileInput;
}>;


export type UpdateMyProfileMutation = { __typename?: 'Mutation', updateMyProfile: (
    { __typename?: 'AdminCustomer' }
    & { ' $fragmentRefs'?: { 'AdminCustomerFieldsFragment': AdminCustomerFieldsFragment } }
  ) };

export type AddressFieldsFragment = { __typename?: 'Address', id: string, userId: string, type: AddressType, label?: string | null, firstName: string, lastName: string, phone?: string | null, addressLine1: string, addressLine2?: string | null, city: string, state: string, postalCode: string, countryCode: string, isDefault: boolean } & { ' $fragmentName'?: 'AddressFieldsFragment' };

export type GetMyAddressesQueryVariables = Exact<{ [key: string]: never; }>;


export type GetMyAddressesQuery = { __typename?: 'Query', myAddresses: Array<(
    { __typename?: 'Address' }
    & { ' $fragmentRefs'?: { 'AddressFieldsFragment': AddressFieldsFragment } }
  )> };

export type AddMyAddressMutationVariables = Exact<{
  input: CreateAddressInput;
}>;


export type AddMyAddressMutation = { __typename?: 'Mutation', addMyAddress: (
    { __typename?: 'Address' }
    & { ' $fragmentRefs'?: { 'AddressFieldsFragment': AddressFieldsFragment } }
  ) };

export type UpdateMyAddressMutationVariables = Exact<{
  input: UpdateAddressInput;
}>;


export type UpdateMyAddressMutation = { __typename?: 'Mutation', updateMyAddress: (
    { __typename?: 'Address' }
    & { ' $fragmentRefs'?: { 'AddressFieldsFragment': AddressFieldsFragment } }
  ) };

export type SetMyDefaultAddressMutationVariables = Exact<{
  id: Scalars['ID']['input'];
}>;


export type SetMyDefaultAddressMutation = { __typename?: 'Mutation', setMyDefaultAddress: (
    { __typename?: 'Address' }
    & { ' $fragmentRefs'?: { 'AddressFieldsFragment': AddressFieldsFragment } }
  ) };

export type RemoveMyAddressMutationVariables = Exact<{
  id: Scalars['ID']['input'];
}>;


export type RemoveMyAddressMutation = { __typename?: 'Mutation', removeMyAddress: (
    { __typename?: 'Address' }
    & { ' $fragmentRefs'?: { 'AddressFieldsFragment': AddressFieldsFragment } }
  ) };

export type AdminThemeFieldsFragment = { __typename?: 'AdminTheme', id: string, primaryLight: string, primaryDark: string, accentLight: string, accentDark: string, sidebarLight: string, sidebarDark: string, destructiveLight: string, destructiveDark: string, radius: string, fontFamily?: string | null, updatedAt: any, updatedById?: string | null } & { ' $fragmentName'?: 'AdminThemeFieldsFragment' };

export type GetAdminThemeQueryVariables = Exact<{ [key: string]: never; }>;


export type GetAdminThemeQuery = { __typename?: 'Query', adminTheme: (
    { __typename?: 'AdminTheme' }
    & { ' $fragmentRefs'?: { 'AdminThemeFieldsFragment': AdminThemeFieldsFragment } }
  ) };

export type UpdateAdminThemeMutationVariables = Exact<{
  updateAdminThemeInput: UpdateAdminThemeInput;
}>;


export type UpdateAdminThemeMutation = { __typename?: 'Mutation', updateAdminTheme: (
    { __typename?: 'AdminTheme' }
    & { ' $fragmentRefs'?: { 'AdminThemeFieldsFragment': AdminThemeFieldsFragment } }
  ) };

export type ResetAdminThemeMutationVariables = Exact<{ [key: string]: never; }>;


export type ResetAdminThemeMutation = { __typename?: 'Mutation', resetAdminTheme: (
    { __typename?: 'AdminTheme' }
    & { ' $fragmentRefs'?: { 'AdminThemeFieldsFragment': AdminThemeFieldsFragment } }
  ) };

export type AttributeValueFieldsFragment = { __typename?: 'ProductAttributeValue', id: string, attributeId: string, value: string, slug: string, displayOrder: number, createdAt: any, updatedAt: any } & { ' $fragmentName'?: 'AttributeValueFieldsFragment' };

export type AttributeFieldsFragment = { __typename?: 'ProductAttribute', id: string, name: string, slug: string, description?: string | null, type: AttributeType, isVariantAttribute: boolean, createdAt: any, updatedAt: any, values?: Array<(
    { __typename?: 'ProductAttributeValue' }
    & { ' $fragmentRefs'?: { 'AttributeValueFieldsFragment': AttributeValueFieldsFragment } }
  )> | null } & { ' $fragmentName'?: 'AttributeFieldsFragment' };

export type GetAdminAttributesQueryVariables = Exact<{
  type?: InputMaybe<AttributeType>;
}>;


export type GetAdminAttributesQuery = { __typename?: 'Query', adminAttributes: Array<(
    { __typename?: 'ProductAttribute' }
    & { ' $fragmentRefs'?: { 'AttributeFieldsFragment': AttributeFieldsFragment } }
  )> };

export type GetAttributesQueryVariables = Exact<{
  type?: InputMaybe<AttributeType>;
  variantOnly?: InputMaybe<Scalars['Boolean']['input']>;
}>;


export type GetAttributesQuery = { __typename?: 'Query', attributes: Array<(
    { __typename?: 'ProductAttribute' }
    & { ' $fragmentRefs'?: { 'AttributeFieldsFragment': AttributeFieldsFragment } }
  )> };

export type GetAttributeQueryVariables = Exact<{
  id: Scalars['ID']['input'];
}>;


export type GetAttributeQuery = { __typename?: 'Query', attribute: (
    { __typename?: 'ProductAttribute' }
    & { ' $fragmentRefs'?: { 'AttributeFieldsFragment': AttributeFieldsFragment } }
  ) };

export type CreateAttributeMutationVariables = Exact<{
  createAttributeInput: CreateAttributeInput;
}>;


export type CreateAttributeMutation = { __typename?: 'Mutation', createAttribute: (
    { __typename?: 'ProductAttribute' }
    & { ' $fragmentRefs'?: { 'AttributeFieldsFragment': AttributeFieldsFragment } }
  ) };

export type UpdateAttributeMutationVariables = Exact<{
  updateAttributeInput: UpdateAttributeInput;
}>;


export type UpdateAttributeMutation = { __typename?: 'Mutation', updateAttribute: (
    { __typename?: 'ProductAttribute' }
    & { ' $fragmentRefs'?: { 'AttributeFieldsFragment': AttributeFieldsFragment } }
  ) };

export type RemoveAttributeMutationVariables = Exact<{
  id: Scalars['ID']['input'];
}>;


export type RemoveAttributeMutation = { __typename?: 'Mutation', removeAttribute: (
    { __typename?: 'ProductAttribute' }
    & { ' $fragmentRefs'?: { 'AttributeFieldsFragment': AttributeFieldsFragment } }
  ) };

export type CreateAttributeValueMutationVariables = Exact<{
  createAttributeValueInput: CreateAttributeValueInput;
}>;


export type CreateAttributeValueMutation = { __typename?: 'Mutation', createAttributeValue: (
    { __typename?: 'ProductAttributeValue' }
    & { ' $fragmentRefs'?: { 'AttributeValueFieldsFragment': AttributeValueFieldsFragment } }
  ) };

export type UpdateAttributeValueMutationVariables = Exact<{
  updateAttributeValueInput: UpdateAttributeValueInput;
}>;


export type UpdateAttributeValueMutation = { __typename?: 'Mutation', updateAttributeValue: (
    { __typename?: 'ProductAttributeValue' }
    & { ' $fragmentRefs'?: { 'AttributeValueFieldsFragment': AttributeValueFieldsFragment } }
  ) };

export type RemoveAttributeValueMutationVariables = Exact<{
  id: Scalars['ID']['input'];
}>;


export type RemoveAttributeValueMutation = { __typename?: 'Mutation', removeAttributeValue: (
    { __typename?: 'ProductAttributeValue' }
    & { ' $fragmentRefs'?: { 'AttributeValueFieldsFragment': AttributeValueFieldsFragment } }
  ) };

export type ReorderAttributeValuesMutationVariables = Exact<{
  reorderAttributeValuesInput: ReorderAttributeValuesInput;
}>;


export type ReorderAttributeValuesMutation = { __typename?: 'Mutation', reorderAttributeValues: boolean };

export type BrandFieldsFragment = { __typename?: 'Brand', id: string, name: string, slug: string, description?: string | null, logoUrl?: string | null, bannerUrl?: string | null, websiteUrl?: string | null, countryCode?: string | null, foundedYear?: number | null, status: BrandStatus, isFeatured: boolean, createdAt: any, updatedAt: any } & { ' $fragmentName'?: 'BrandFieldsFragment' };

export type GetAdminBrandsQueryVariables = Exact<{
  status?: InputMaybe<BrandStatus>;
}>;


export type GetAdminBrandsQuery = { __typename?: 'Query', adminBrands: Array<(
    { __typename?: 'Brand' }
    & { ' $fragmentRefs'?: { 'BrandFieldsFragment': BrandFieldsFragment } }
  )> };

export type GetBrandsQueryVariables = Exact<{
  status?: InputMaybe<BrandStatus>;
  featuredOnly?: InputMaybe<Scalars['Boolean']['input']>;
}>;


export type GetBrandsQuery = { __typename?: 'Query', brands: Array<(
    { __typename?: 'Brand' }
    & { ' $fragmentRefs'?: { 'BrandFieldsFragment': BrandFieldsFragment } }
  )> };

export type GetBrandQueryVariables = Exact<{
  id: Scalars['ID']['input'];
}>;


export type GetBrandQuery = { __typename?: 'Query', brand: (
    { __typename?: 'Brand' }
    & { ' $fragmentRefs'?: { 'BrandFieldsFragment': BrandFieldsFragment } }
  ) };

export type GetPublicBrandQueryVariables = Exact<{
  slug: Scalars['String']['input'];
}>;


export type GetPublicBrandQuery = { __typename?: 'Query', publicBrand: (
    { __typename?: 'Brand' }
    & { ' $fragmentRefs'?: { 'BrandFieldsFragment': BrandFieldsFragment } }
  ) };

export type CreateBrandMutationVariables = Exact<{
  createBrandInput: CreateBrandInput;
}>;


export type CreateBrandMutation = { __typename?: 'Mutation', createBrand: (
    { __typename?: 'Brand' }
    & { ' $fragmentRefs'?: { 'BrandFieldsFragment': BrandFieldsFragment } }
  ) };

export type UpdateBrandMutationVariables = Exact<{
  updateBrandInput: UpdateBrandInput;
}>;


export type UpdateBrandMutation = { __typename?: 'Mutation', updateBrand: (
    { __typename?: 'Brand' }
    & { ' $fragmentRefs'?: { 'BrandFieldsFragment': BrandFieldsFragment } }
  ) };

export type SetBrandStatusMutationVariables = Exact<{
  setBrandStatusInput: SetBrandStatusInput;
}>;


export type SetBrandStatusMutation = { __typename?: 'Mutation', setBrandStatus: (
    { __typename?: 'Brand' }
    & { ' $fragmentRefs'?: { 'BrandFieldsFragment': BrandFieldsFragment } }
  ) };

export type RemoveBrandMutationVariables = Exact<{
  id: Scalars['ID']['input'];
}>;


export type RemoveBrandMutation = { __typename?: 'Mutation', removeBrand: (
    { __typename?: 'Brand' }
    & { ' $fragmentRefs'?: { 'BrandFieldsFragment': BrandFieldsFragment } }
  ) };

export type CartFieldsFragment = { __typename?: 'Cart', id: string, customerId: string, itemCount: number, subtotal: number, needsReview: boolean, createdAt: any, updatedAt: any, items: Array<{ __typename?: 'CartItem', id: string, productId: string, variantId: string, quantity: number, unitPriceSnapshot: number, unitPriceCurrent: number, priceChanged: boolean, lineTotal: number, availableQuantity: number, stockState: string, createdAt: any, product?: (
      { __typename?: 'Product' }
      & { ' $fragmentRefs'?: { 'ProductFieldsFragment': ProductFieldsFragment } }
    ) | null, variant?: { __typename?: 'ProductVariant', id: string, sku: string, name?: string | null, price: number, priceWithTax?: number | null, imageUrl?: string | null, attributes: Array<{ __typename?: 'ProductVariantAttribute', attributeId: string, attributeValueId: string, attributeName: string, attributeSlug: string, value: string, valueSlug: string }> } | null }> } & { ' $fragmentName'?: 'CartFieldsFragment' };

export type GetMyCartQueryVariables = Exact<{ [key: string]: never; }>;


export type GetMyCartQuery = { __typename?: 'Query', myCart: (
    { __typename?: 'Cart' }
    & { ' $fragmentRefs'?: { 'CartFieldsFragment': CartFieldsFragment } }
  ) };

export type GetMyCartItemCountQueryVariables = Exact<{ [key: string]: never; }>;


export type GetMyCartItemCountQuery = { __typename?: 'Query', myCartItemCount: number };

export type AddToCartMutationVariables = Exact<{
  input: AddToCartInput;
}>;


export type AddToCartMutation = { __typename?: 'Mutation', addToCart: (
    { __typename?: 'Cart' }
    & { ' $fragmentRefs'?: { 'CartFieldsFragment': CartFieldsFragment } }
  ) };

export type UpdateCartItemQtyMutationVariables = Exact<{
  input: UpdateCartItemQtyInput;
}>;


export type UpdateCartItemQtyMutation = { __typename?: 'Mutation', updateCartItemQty: (
    { __typename?: 'Cart' }
    & { ' $fragmentRefs'?: { 'CartFieldsFragment': CartFieldsFragment } }
  ) };

export type RemoveFromCartMutationVariables = Exact<{
  input: RemoveCartItemInput;
}>;


export type RemoveFromCartMutation = { __typename?: 'Mutation', removeFromCart: (
    { __typename?: 'Cart' }
    & { ' $fragmentRefs'?: { 'CartFieldsFragment': CartFieldsFragment } }
  ) };

export type ClearCartMutationVariables = Exact<{ [key: string]: never; }>;


export type ClearCartMutation = { __typename?: 'Mutation', clearCart: (
    { __typename?: 'Cart' }
    & { ' $fragmentRefs'?: { 'CartFieldsFragment': CartFieldsFragment } }
  ) };

export type CategoryFieldsFragment = { __typename?: 'Category', id: string, name: string, slug: string, description?: string | null, parentId?: string | null, imageUrl?: string | null, iconUrl?: string | null, displayOrder: number, isActive: boolean, createdAt: any, updatedAt: any } & { ' $fragmentName'?: 'CategoryFieldsFragment' };

export type GetCategoriesQueryVariables = Exact<{ [key: string]: never; }>;


export type GetCategoriesQuery = { __typename?: 'Query', categories: Array<(
    { __typename?: 'Category' }
    & { ' $fragmentRefs'?: { 'CategoryFieldsFragment': CategoryFieldsFragment } }
  )> };

export type GetShopFilterCategoriesQueryVariables = Exact<{ [key: string]: never; }>;


export type GetShopFilterCategoriesQuery = { __typename?: 'Query', shopFilterCategories: Array<{ __typename?: 'Category', id: string, name: string, slug: string, displayOrder: number, productCount?: number | null }> };

export type GetAdminCategoriesPaginatedQueryVariables = Exact<{
  page?: InputMaybe<Scalars['Int']['input']>;
  pageSize?: InputMaybe<Scalars['Int']['input']>;
  search?: InputMaybe<Scalars['String']['input']>;
}>;


export type GetAdminCategoriesPaginatedQuery = { __typename?: 'Query', adminCategoriesPaginated: { __typename?: 'PaginatedCategories', totalCount: number, totalPages: number, currentPage: number, pageSize: number, items: Array<(
      { __typename?: 'Category' }
      & { ' $fragmentRefs'?: { 'CategoryFieldsFragment': CategoryFieldsFragment } }
    )> } };

export type GetCategoryChildrenQueryVariables = Exact<{
  parentId?: InputMaybe<Scalars['ID']['input']>;
  search?: InputMaybe<Scalars['String']['input']>;
  limit?: InputMaybe<Scalars['Int']['input']>;
}>;


export type GetCategoryChildrenQuery = { __typename?: 'Query', categoryChildren: Array<{ __typename?: 'Category', id: string, name: string, slug: string, parentId?: string | null, hasChildren?: boolean | null }> };

export type GetCategoryAncestorsQueryVariables = Exact<{
  id: Scalars['ID']['input'];
}>;


export type GetCategoryAncestorsQuery = { __typename?: 'Query', categoryAncestors: Array<{ __typename?: 'Category', id: string, name: string, slug: string, parentId?: string | null, hasChildren?: boolean | null }> };

export type GetCategoryQueryVariables = Exact<{
  id: Scalars['ID']['input'];
}>;


export type GetCategoryQuery = { __typename?: 'Query', category: (
    { __typename?: 'Category' }
    & { ' $fragmentRefs'?: { 'CategoryFieldsFragment': CategoryFieldsFragment } }
  ) };

export type GetPublicCategoryBySlugQueryVariables = Exact<{
  slug: Scalars['String']['input'];
}>;


export type GetPublicCategoryBySlugQuery = { __typename?: 'Query', publicCategoryBySlug: (
    { __typename?: 'Category', children?: Array<(
      { __typename?: 'Category' }
      & { ' $fragmentRefs'?: { 'CategoryFieldsFragment': CategoryFieldsFragment } }
    )> | null }
    & { ' $fragmentRefs'?: { 'CategoryFieldsFragment': CategoryFieldsFragment } }
  ) };

export type CreateCategoryMutationVariables = Exact<{
  createCategoryInput: CreateCategoryInput;
}>;


export type CreateCategoryMutation = { __typename?: 'Mutation', createCategory: (
    { __typename?: 'Category' }
    & { ' $fragmentRefs'?: { 'CategoryFieldsFragment': CategoryFieldsFragment } }
  ) };

export type UpdateCategoryMutationVariables = Exact<{
  updateCategoryInput: UpdateCategoryInput;
}>;


export type UpdateCategoryMutation = { __typename?: 'Mutation', updateCategory: (
    { __typename?: 'Category' }
    & { ' $fragmentRefs'?: { 'CategoryFieldsFragment': CategoryFieldsFragment } }
  ) };

export type RemoveCategoryMutationVariables = Exact<{
  id: Scalars['ID']['input'];
}>;


export type RemoveCategoryMutation = { __typename?: 'Mutation', removeCategory: (
    { __typename?: 'Category' }
    & { ' $fragmentRefs'?: { 'CategoryFieldsFragment': CategoryFieldsFragment } }
  ) };

export type UpdateCategoryTreeMutationVariables = Exact<{
  input: UpdateCategoryTreeInput;
}>;


export type UpdateCategoryTreeMutation = { __typename?: 'Mutation', updateCategoryTree: boolean };

export type CouponFieldsFragment = { __typename?: 'Coupon', id: string, storeId?: string | null, code: string, name: string, description?: string | null, discountType: string, discountValue: number, minimumPurchaseAmount?: number | null, maximumDiscountAmount?: number | null, usageLimit?: number | null, usageLimitPerUser?: number | null, validFrom: any, validUntil: any, isActive: boolean, redemptionCount?: number | null, createdAt: any, updatedAt: any } & { ' $fragmentName'?: 'CouponFieldsFragment' };

export type GetAdminCouponsQueryVariables = Exact<{
  search?: InputMaybe<Scalars['String']['input']>;
  status?: InputMaybe<Scalars['String']['input']>;
}>;


export type GetAdminCouponsQuery = { __typename?: 'Query', adminCoupons: Array<(
    { __typename?: 'Coupon' }
    & { ' $fragmentRefs'?: { 'CouponFieldsFragment': CouponFieldsFragment } }
  )> };

export type GetAdminCouponQueryVariables = Exact<{
  id: Scalars['ID']['input'];
}>;


export type GetAdminCouponQuery = { __typename?: 'Query', adminCoupon: (
    { __typename?: 'Coupon' }
    & { ' $fragmentRefs'?: { 'CouponFieldsFragment': CouponFieldsFragment } }
  ) };

export type CreateCouponMutationVariables = Exact<{
  input: CreateCouponInput;
}>;


export type CreateCouponMutation = { __typename?: 'Mutation', createCoupon: (
    { __typename?: 'Coupon' }
    & { ' $fragmentRefs'?: { 'CouponFieldsFragment': CouponFieldsFragment } }
  ) };

export type UpdateCouponMutationVariables = Exact<{
  input: UpdateCouponInput;
}>;


export type UpdateCouponMutation = { __typename?: 'Mutation', updateCoupon: (
    { __typename?: 'Coupon' }
    & { ' $fragmentRefs'?: { 'CouponFieldsFragment': CouponFieldsFragment } }
  ) };

export type RemoveCouponMutationVariables = Exact<{
  id: Scalars['ID']['input'];
}>;


export type RemoveCouponMutation = { __typename?: 'Mutation', removeCoupon?: { __typename?: 'Coupon', id: string } | null };

export type ValidateCouponMutationVariables = Exact<{
  input: ValidateCouponInput;
}>;


export type ValidateCouponMutation = { __typename?: 'Mutation', validateCoupon: { __typename?: 'CouponValidation', isValid: boolean, reason?: string | null, discountAmount: number, subtotal: number, subtotalInclTax: number, discountInclTax: number, customerTotal: number, coupon?: (
      { __typename?: 'Coupon' }
      & { ' $fragmentRefs'?: { 'CouponFieldsFragment': CouponFieldsFragment } }
    ) | null } };

export type AdminCustomerFieldsFragment = { __typename?: 'AdminCustomer', id: string, userId: string, name: string, email: string, phone?: string | null, status?: string | null, emailVerifiedAt?: any | null, lastLoginAt?: any | null, userCreatedAt: any, marketingOptIn: boolean, preferredCurrency: string, createdAt: any, updatedAt: any, deletedAt?: any | null } & { ' $fragmentName'?: 'AdminCustomerFieldsFragment' };

export type GetAdminCustomersQueryVariables = Exact<{
  status?: InputMaybe<Scalars['String']['input']>;
  search?: InputMaybe<Scalars['String']['input']>;
  includeDeleted?: InputMaybe<Scalars['Boolean']['input']>;
  page?: InputMaybe<Scalars['Int']['input']>;
  pageSize?: InputMaybe<Scalars['Int']['input']>;
}>;


export type GetAdminCustomersQuery = { __typename?: 'Query', adminCustomers: { __typename?: 'PaginatedAdminCustomers', totalCount: number, totalPages: number, currentPage: number, pageSize: number, items: Array<(
      { __typename?: 'AdminCustomer' }
      & { ' $fragmentRefs'?: { 'AdminCustomerFieldsFragment': AdminCustomerFieldsFragment } }
    )> } };

export type GetAdminCustomerQueryVariables = Exact<{
  id: Scalars['ID']['input'];
}>;


export type GetAdminCustomerQuery = { __typename?: 'Query', adminCustomer: (
    { __typename?: 'AdminCustomer' }
    & { ' $fragmentRefs'?: { 'AdminCustomerFieldsFragment': AdminCustomerFieldsFragment } }
  ) };

export type UpdateCustomerMutationVariables = Exact<{
  input: UpdateCustomerInput;
}>;


export type UpdateCustomerMutation = { __typename?: 'Mutation', updateCustomer: (
    { __typename?: 'AdminCustomer' }
    & { ' $fragmentRefs'?: { 'AdminCustomerFieldsFragment': AdminCustomerFieldsFragment } }
  ) };

export type SoftDeleteCustomerMutationVariables = Exact<{
  id: Scalars['ID']['input'];
}>;


export type SoftDeleteCustomerMutation = { __typename?: 'Mutation', softDeleteCustomer: (
    { __typename?: 'AdminCustomer' }
    & { ' $fragmentRefs'?: { 'AdminCustomerFieldsFragment': AdminCustomerFieldsFragment } }
  ) };

export type RestoreCustomerMutationVariables = Exact<{
  id: Scalars['ID']['input'];
}>;


export type RestoreCustomerMutation = { __typename?: 'Mutation', restoreCustomer: (
    { __typename?: 'AdminCustomer' }
    & { ' $fragmentRefs'?: { 'AdminCustomerFieldsFragment': AdminCustomerFieldsFragment } }
  ) };

export type GetEmailSettingQueryVariables = Exact<{ [key: string]: never; }>;


export type GetEmailSettingQuery = { __typename?: 'Query', emailSetting: { __typename?: 'EmailSetting', id: string, mailer: EmailMailer, host: string, port: number, username: string, encryption: EmailEncryption, senderName: string, senderEmail: string, localDomain?: string | null, isConfigured: boolean, hasPassword: boolean, updatedAt: any } };

export type UpdateEmailSettingMutationVariables = Exact<{
  input: UpdateEmailSettingInput;
}>;


export type UpdateEmailSettingMutation = { __typename?: 'Mutation', updateEmailSetting: { __typename?: 'EmailSetting', id: string, mailer: EmailMailer, host: string, port: number, username: string, encryption: EmailEncryption, senderName: string, senderEmail: string, localDomain?: string | null, isConfigured: boolean, hasPassword: boolean, updatedAt: any } };

export type GetEmailTemplatesQueryVariables = Exact<{ [key: string]: never; }>;


export type GetEmailTemplatesQuery = { __typename?: 'Query', emailTemplates: Array<{ __typename?: 'EmailTemplate', id: string, key: string, name: string, description: string, category: EmailTemplateCategory, subject: string, variables: Array<string>, isEnabled: boolean, isSystem: boolean, updatedAt: any }> };

export type GetEmailTemplateQueryVariables = Exact<{
  id: Scalars['ID']['input'];
}>;


export type GetEmailTemplateQuery = { __typename?: 'Query', emailTemplate: { __typename?: 'EmailTemplate', id: string, key: string, name: string, description: string, category: EmailTemplateCategory, subject: string, htmlBody: string, textBody?: string | null, variables: Array<string>, isEnabled: boolean, isSystem: boolean, updatedAt: any } };

export type UpdateEmailTemplateMutationVariables = Exact<{
  input: UpdateEmailTemplateInput;
}>;


export type UpdateEmailTemplateMutation = { __typename?: 'Mutation', updateEmailTemplate: { __typename?: 'EmailTemplate', id: string, key: string, name: string, description: string, category: EmailTemplateCategory, subject: string, htmlBody: string, textBody?: string | null, variables: Array<string>, isEnabled: boolean, isSystem: boolean, updatedAt: any } };

export type SendTestEmailMutationVariables = Exact<{
  input: SendTestEmailInput;
}>;


export type SendTestEmailMutation = { __typename?: 'Mutation', sendTestEmail: { __typename?: 'SendTestResult', success: boolean, message?: string | null } };

export type ImageFieldsFragment = { __typename?: 'Image', id: string, provider: string, externalId: string, url: string, format: string, width: number, height: number, sizeBytes: number, ownerType: ImageOwnerType, ownerId?: string | null, purpose: ImagePurpose, alt?: string | null, createdAt: any } & { ' $fragmentName'?: 'ImageFieldsFragment' };

export type PresignImageUploadMutationVariables = Exact<{
  presignUploadInput: PresignUploadInput;
}>;


export type PresignImageUploadMutation = { __typename?: 'Mutation', presignImageUpload: { __typename?: 'PresignUploadPayload', uploadUrl: string, method: string, fields: string, externalId: string, expiresIn: number, provider: string } };

export type ConfirmImageUploadMutationVariables = Exact<{
  confirmUploadInput: ConfirmUploadInput;
}>;


export type ConfirmImageUploadMutation = { __typename?: 'Mutation', confirmImageUpload: (
    { __typename?: 'Image' }
    & { ' $fragmentRefs'?: { 'ImageFieldsFragment': ImageFieldsFragment } }
  ) };

export type DeleteImageMutationVariables = Exact<{
  id: Scalars['ID']['input'];
}>;


export type DeleteImageMutation = { __typename?: 'Mutation', deleteImage: (
    { __typename?: 'Image' }
    & { ' $fragmentRefs'?: { 'ImageFieldsFragment': ImageFieldsFragment } }
  ) };

export type InventoryFieldsFragment = { __typename?: 'Inventory', id: string, variantId: string, warehouseId: string, quantityAvailable: number, quantityReserved: number, quantityOnHand: number, reorderPoint: number, reorderQuantity: number, lastCountedAt?: any | null, createdAt: any, updatedAt: any, stockState: StockState, warehouse?: { __typename?: 'Warehouse', id: string, name: string, code: string, isDefault: boolean, storeId: string } | null, variant?: { __typename?: 'ProductVariant', id: string, productId: string, sku: string, imageUrl?: string | null, status: VariantStatus, attributes: Array<{ __typename?: 'ProductVariantAttribute', attributeId: string, attributeValueId: string, attributeName: string, attributeSlug: string, value: string, valueSlug: string }> } | null, product?: { __typename?: 'Product', id: string, name: string, slug: string, storeId: string } | null } & { ' $fragmentName'?: 'InventoryFieldsFragment' };

export type InventoryMovementFieldsFragment = { __typename?: 'InventoryMovement', id: string, inventoryId: string, variantId: string, warehouseId: string, movementType: InventoryMovementType, quantityChange: number, quantityBefore: number, quantityAfter: number, referenceType?: string | null, referenceId?: string | null, notes?: string | null, createdById?: string | null, createdAt: any } & { ' $fragmentName'?: 'InventoryMovementFieldsFragment' };

export type GetMyInventoryQueryVariables = Exact<{
  storeId?: InputMaybe<Scalars['ID']['input']>;
  warehouseId?: InputMaybe<Scalars['ID']['input']>;
  productId?: InputMaybe<Scalars['ID']['input']>;
  lowStockOnly?: InputMaybe<Scalars['Boolean']['input']>;
  search?: InputMaybe<Scalars['String']['input']>;
}>;


export type GetMyInventoryQuery = { __typename?: 'Query', myInventory: Array<(
    { __typename?: 'Inventory' }
    & { ' $fragmentRefs'?: { 'InventoryFieldsFragment': InventoryFieldsFragment } }
  )> };

export type GetMyInventoryByVariantQueryVariables = Exact<{
  variantId: Scalars['ID']['input'];
  warehouseId?: InputMaybe<Scalars['ID']['input']>;
}>;


export type GetMyInventoryByVariantQuery = { __typename?: 'Query', myInventoryByVariant?: (
    { __typename?: 'Inventory' }
    & { ' $fragmentRefs'?: { 'InventoryFieldsFragment': InventoryFieldsFragment } }
  ) | null };

export type GetMyInventoryMovementsQueryVariables = Exact<{
  variantId?: InputMaybe<Scalars['ID']['input']>;
  warehouseId?: InputMaybe<Scalars['ID']['input']>;
  limit?: InputMaybe<Scalars['Int']['input']>;
}>;


export type GetMyInventoryMovementsQuery = { __typename?: 'Query', myInventoryMovements: Array<(
    { __typename?: 'InventoryMovement' }
    & { ' $fragmentRefs'?: { 'InventoryMovementFieldsFragment': InventoryMovementFieldsFragment } }
  )> };

export type GetAdminInventoryByProductQueryVariables = Exact<{
  productId: Scalars['ID']['input'];
}>;


export type GetAdminInventoryByProductQuery = { __typename?: 'Query', adminInventoryByProduct: Array<(
    { __typename?: 'Inventory' }
    & { ' $fragmentRefs'?: { 'InventoryFieldsFragment': InventoryFieldsFragment } }
  )> };

export type AdjustMyInventoryMutationVariables = Exact<{
  adjustInventoryInput: AdjustInventoryInput;
}>;


export type AdjustMyInventoryMutation = { __typename?: 'Mutation', adjustMyInventory: (
    { __typename?: 'Inventory' }
    & { ' $fragmentRefs'?: { 'InventoryFieldsFragment': InventoryFieldsFragment } }
  ) };

export type SetMyReorderPointMutationVariables = Exact<{
  setReorderPointInput: SetReorderPointInput;
}>;


export type SetMyReorderPointMutation = { __typename?: 'Mutation', setMyReorderPoint: (
    { __typename?: 'Inventory' }
    & { ' $fragmentRefs'?: { 'InventoryFieldsFragment': InventoryFieldsFragment } }
  ) };

export type MenuFieldsFragment = { __typename?: 'Menu', id: string, name: string, location: MenuLocation, isActive: boolean, items: string, createdAt: any, updatedAt: any } & { ' $fragmentName'?: 'MenuFieldsFragment' };

export type GetPublicMenuQueryVariables = Exact<{
  location: MenuLocation;
}>;


export type GetPublicMenuQuery = { __typename?: 'Query', publicMenu: (
    { __typename?: 'Menu' }
    & { ' $fragmentRefs'?: { 'MenuFieldsFragment': MenuFieldsFragment } }
  ) };

export type GetAdminMenusQueryVariables = Exact<{ [key: string]: never; }>;


export type GetAdminMenusQuery = { __typename?: 'Query', adminMenus: Array<(
    { __typename?: 'Menu' }
    & { ' $fragmentRefs'?: { 'MenuFieldsFragment': MenuFieldsFragment } }
  )> };

export type GetAdminMenuQueryVariables = Exact<{
  location: MenuLocation;
}>;


export type GetAdminMenuQuery = { __typename?: 'Query', adminMenu: (
    { __typename?: 'Menu' }
    & { ' $fragmentRefs'?: { 'MenuFieldsFragment': MenuFieldsFragment } }
  ) };

export type UpsertMenuMutationVariables = Exact<{
  upsertMenuInput: UpsertMenuInput;
}>;


export type UpsertMenuMutation = { __typename?: 'Mutation', upsertMenu: (
    { __typename?: 'Menu' }
    & { ' $fragmentRefs'?: { 'MenuFieldsFragment': MenuFieldsFragment } }
  ) };

export type SetMenuActiveMutationVariables = Exact<{
  location: MenuLocation;
  isActive: Scalars['Boolean']['input'];
}>;


export type SetMenuActiveMutation = { __typename?: 'Mutation', setMenuActive: (
    { __typename?: 'Menu' }
    & { ' $fragmentRefs'?: { 'MenuFieldsFragment': MenuFieldsFragment } }
  ) };

export type RemoveMenuMutationVariables = Exact<{
  location: MenuLocation;
}>;


export type RemoveMenuMutation = { __typename?: 'Mutation', removeMenu: (
    { __typename?: 'Menu' }
    & { ' $fragmentRefs'?: { 'MenuFieldsFragment': MenuFieldsFragment } }
  ) };

export type NewsletterFieldsFragment = { __typename?: 'NewsletterSubscription', id: string, email: string, source?: string | null, status: NewsletterStatus, unsubscribedAt?: any | null, createdAt: any, updatedAt: any } & { ' $fragmentName'?: 'NewsletterFieldsFragment' };

export type SubscribeToNewsletterMutationVariables = Exact<{
  input: SubscribeNewsletterInput;
}>;


export type SubscribeToNewsletterMutation = { __typename?: 'Mutation', subscribeToNewsletter: { __typename?: 'NewsletterSubscribeResult', ok: boolean, message: string } };

export type GetAdminNewsletterSubscriptionsQueryVariables = Exact<{
  status?: InputMaybe<NewsletterStatus>;
  page?: InputMaybe<Scalars['Int']['input']>;
  pageSize?: InputMaybe<Scalars['Int']['input']>;
  search?: InputMaybe<Scalars['String']['input']>;
}>;


export type GetAdminNewsletterSubscriptionsQuery = { __typename?: 'Query', adminNewsletterSubscriptions: { __typename?: 'PaginatedNewsletterSubscriptions', totalCount: number, totalPages: number, currentPage: number, pageSize: number, items: Array<(
      { __typename?: 'NewsletterSubscription' }
      & { ' $fragmentRefs'?: { 'NewsletterFieldsFragment': NewsletterFieldsFragment } }
    )> } };

export type UnsubscribeNewsletterMutationVariables = Exact<{
  id: Scalars['ID']['input'];
}>;


export type UnsubscribeNewsletterMutation = { __typename?: 'Mutation', unsubscribeNewsletter: (
    { __typename?: 'NewsletterSubscription' }
    & { ' $fragmentRefs'?: { 'NewsletterFieldsFragment': NewsletterFieldsFragment } }
  ) };

export type OrderAddressFieldsFragment = { __typename?: 'OrderAddressSnapshot', id: string, firstName: string, lastName: string, phone?: string | null, addressLine1: string, addressLine2?: string | null, city: string, state: string, postalCode: string, countryCode: string } & { ' $fragmentName'?: 'OrderAddressFieldsFragment' };

export type OrderItemFieldsFragment = { __typename?: 'OrderItem', id: string, orderId: string, sellerOrderId: string, productId: string, variantId: string, storeId: string, sku: string, name: string, variantName?: string | null, quantity: number, unitPrice: number, totalPrice: number, taxAmount: number, discountAmount: number, imageUrlSnapshot?: string | null, createdAt: any, attributesSnapshot: Array<{ __typename?: 'OrderItemAttribute', attributeName: string, value: string }> } & { ' $fragmentName'?: 'OrderItemFieldsFragment' };

export type StatusHistoryFieldsFragment = { __typename?: 'OrderStatusHistoryEntry', id: string, fromStatus?: OrderStatus | null, toStatus: OrderStatus, changedById?: string | null, notes?: string | null, createdAt: any } & { ' $fragmentName'?: 'StatusHistoryFieldsFragment' };

export type SellerOrderFieldsFragment = { __typename?: 'SellerOrder', id: string, orderId: string, sellerId: string, storeId: string, orderNumber: string, status: OrderStatus, paymentStatus: PaymentStatus, payoutStatus: PayoutStatus, subtotal: number, taxAmount: number, shippingAmount: number, discountAmount: number, commissionAmount: number, payoutAmount: number, currencyCode: string, packedAt?: any | null, shippedAt?: any | null, deliveredAt?: any | null, cancelledAt?: any | null, createdAt: any, updatedAt: any, itemCount: number, storeName?: string | null, parentOrderNumber?: string | null, customerName?: string | null, items: Array<(
    { __typename?: 'OrderItem' }
    & { ' $fragmentRefs'?: { 'OrderItemFieldsFragment': OrderItemFieldsFragment } }
  )>, statusHistory: Array<(
    { __typename?: 'OrderStatusHistoryEntry' }
    & { ' $fragmentRefs'?: { 'StatusHistoryFieldsFragment': StatusHistoryFieldsFragment } }
  )>, shippingAddress?: (
    { __typename?: 'OrderAddressSnapshot' }
    & { ' $fragmentRefs'?: { 'OrderAddressFieldsFragment': OrderAddressFieldsFragment } }
  ) | null } & { ' $fragmentName'?: 'SellerOrderFieldsFragment' };

export type OrderFieldsFragment = { __typename?: 'Order', id: string, orderNumber: string, customerId: string, status: OrderStatus, paymentStatus: PaymentStatus, paymentMethod: PaymentMethod, subtotal: number, taxAmount: number, shippingAmount: number, discountAmount: number, totalAmount: number, currencyCode: string, customerNotes?: string | null, placedAt: any, cancelledAt?: any | null, deliveredAt?: any | null, createdAt: any, updatedAt: any, itemCount: number, items: Array<(
    { __typename?: 'OrderItem' }
    & { ' $fragmentRefs'?: { 'OrderItemFieldsFragment': OrderItemFieldsFragment } }
  )>, sellerOrders: Array<(
    { __typename?: 'SellerOrder' }
    & { ' $fragmentRefs'?: { 'SellerOrderFieldsFragment': SellerOrderFieldsFragment } }
  )>, statusHistory: Array<(
    { __typename?: 'OrderStatusHistoryEntry' }
    & { ' $fragmentRefs'?: { 'StatusHistoryFieldsFragment': StatusHistoryFieldsFragment } }
  )>, shippingAddress?: (
    { __typename?: 'OrderAddressSnapshot' }
    & { ' $fragmentRefs'?: { 'OrderAddressFieldsFragment': OrderAddressFieldsFragment } }
  ) | null, billingAddress?: (
    { __typename?: 'OrderAddressSnapshot' }
    & { ' $fragmentRefs'?: { 'OrderAddressFieldsFragment': OrderAddressFieldsFragment } }
  ) | null } & { ' $fragmentName'?: 'OrderFieldsFragment' };

export type GetMyOrdersQueryVariables = Exact<{
  status?: InputMaybe<OrderStatus>;
  page?: InputMaybe<Scalars['Int']['input']>;
  pageSize?: InputMaybe<Scalars['Int']['input']>;
}>;


export type GetMyOrdersQuery = { __typename?: 'Query', myOrders: { __typename?: 'PaginatedOrders', totalCount: number, totalPages: number, currentPage: number, pageSize: number, items: Array<(
      { __typename?: 'Order' }
      & { ' $fragmentRefs'?: { 'OrderFieldsFragment': OrderFieldsFragment } }
    )> } };

export type GetMyOrderQueryVariables = Exact<{
  id: Scalars['ID']['input'];
}>;


export type GetMyOrderQuery = { __typename?: 'Query', myOrder: (
    { __typename?: 'Order' }
    & { ' $fragmentRefs'?: { 'OrderFieldsFragment': OrderFieldsFragment } }
  ) };

export type PlaceOrderMutationVariables = Exact<{
  input: PlaceOrderInput;
}>;


export type PlaceOrderMutation = { __typename?: 'Mutation', placeOrder: (
    { __typename?: 'Order' }
    & { ' $fragmentRefs'?: { 'OrderFieldsFragment': OrderFieldsFragment } }
  ) };

export type CancelMyOrderMutationVariables = Exact<{
  id: Scalars['ID']['input'];
  notes?: InputMaybe<Scalars['String']['input']>;
}>;


export type CancelMyOrderMutation = { __typename?: 'Mutation', cancelMyOrder: (
    { __typename?: 'Order' }
    & { ' $fragmentRefs'?: { 'OrderFieldsFragment': OrderFieldsFragment } }
  ) };

export type GetMySellerOrdersQueryVariables = Exact<{
  status?: InputMaybe<OrderStatus>;
  page?: InputMaybe<Scalars['Int']['input']>;
  pageSize?: InputMaybe<Scalars['Int']['input']>;
}>;


export type GetMySellerOrdersQuery = { __typename?: 'Query', mySellerOrders: { __typename?: 'PaginatedSellerOrders', totalCount: number, totalPages: number, currentPage: number, pageSize: number, items: Array<(
      { __typename?: 'SellerOrder' }
      & { ' $fragmentRefs'?: { 'SellerOrderFieldsFragment': SellerOrderFieldsFragment } }
    )> } };

export type GetMySellerOrderQueryVariables = Exact<{
  id: Scalars['ID']['input'];
}>;


export type GetMySellerOrderQuery = { __typename?: 'Query', mySellerOrder: (
    { __typename?: 'SellerOrder' }
    & { ' $fragmentRefs'?: { 'SellerOrderFieldsFragment': SellerOrderFieldsFragment } }
  ) };

export type UpdateSellerOrderStatusMutationVariables = Exact<{
  input: UpdateSellerOrderStatusInput;
}>;


export type UpdateSellerOrderStatusMutation = { __typename?: 'Mutation', updateSellerOrderStatus: (
    { __typename?: 'SellerOrder' }
    & { ' $fragmentRefs'?: { 'SellerOrderFieldsFragment': SellerOrderFieldsFragment } }
  ) };

export type PageFieldsFragment = { __typename?: 'Page', id: string, slug: string, title: string, metaTitle?: string | null, metaDesc?: string | null, status: PageStatus, blocks: string, isSystem: boolean, publishedAt?: any | null, createdAt: any, updatedAt: any } & { ' $fragmentName'?: 'PageFieldsFragment' };

export type GetPublicPageQueryVariables = Exact<{
  slug: Scalars['String']['input'];
}>;


export type GetPublicPageQuery = { __typename?: 'Query', publicPage: (
    { __typename?: 'Page' }
    & { ' $fragmentRefs'?: { 'PageFieldsFragment': PageFieldsFragment } }
  ) };

export type GetAdminPagesQueryVariables = Exact<{
  status?: InputMaybe<PageStatus>;
}>;


export type GetAdminPagesQuery = { __typename?: 'Query', adminPages: Array<(
    { __typename?: 'Page' }
    & { ' $fragmentRefs'?: { 'PageFieldsFragment': PageFieldsFragment } }
  )> };

export type GetAdminPagesPaginatedQueryVariables = Exact<{
  status?: InputMaybe<PageStatus>;
  page?: InputMaybe<Scalars['Int']['input']>;
  pageSize?: InputMaybe<Scalars['Int']['input']>;
  search?: InputMaybe<Scalars['String']['input']>;
}>;


export type GetAdminPagesPaginatedQuery = { __typename?: 'Query', adminPagesPaginated: { __typename?: 'PaginatedPages', totalCount: number, totalPages: number, currentPage: number, pageSize: number, items: Array<(
      { __typename?: 'Page' }
      & { ' $fragmentRefs'?: { 'PageFieldsFragment': PageFieldsFragment } }
    )> } };

export type GetPageQueryVariables = Exact<{
  id: Scalars['ID']['input'];
}>;


export type GetPageQuery = { __typename?: 'Query', page: (
    { __typename?: 'Page' }
    & { ' $fragmentRefs'?: { 'PageFieldsFragment': PageFieldsFragment } }
  ) };

export type CreatePageMutationVariables = Exact<{
  createPageInput: CreatePageInput;
}>;


export type CreatePageMutation = { __typename?: 'Mutation', createPage: (
    { __typename?: 'Page' }
    & { ' $fragmentRefs'?: { 'PageFieldsFragment': PageFieldsFragment } }
  ) };

export type UpdatePageMutationVariables = Exact<{
  updatePageInput: UpdatePageInput;
}>;


export type UpdatePageMutation = { __typename?: 'Mutation', updatePage: (
    { __typename?: 'Page' }
    & { ' $fragmentRefs'?: { 'PageFieldsFragment': PageFieldsFragment } }
  ) };

export type SetPageStatusMutationVariables = Exact<{
  setPageStatusInput: SetPageStatusInput;
}>;


export type SetPageStatusMutation = { __typename?: 'Mutation', setPageStatus: (
    { __typename?: 'Page' }
    & { ' $fragmentRefs'?: { 'PageFieldsFragment': PageFieldsFragment } }
  ) };

export type RemovePageMutationVariables = Exact<{
  id: Scalars['ID']['input'];
}>;


export type RemovePageMutation = { __typename?: 'Mutation', removePage: (
    { __typename?: 'Page' }
    & { ' $fragmentRefs'?: { 'PageFieldsFragment': PageFieldsFragment } }
  ) };

export type AdminPaymentGatewaysQueryVariables = Exact<{ [key: string]: never; }>;


export type AdminPaymentGatewaysQuery = { __typename?: 'Query', adminPaymentGateways: Array<{ __typename?: 'PaymentGatewayConfigEntity', id: string, gateway: PaymentGateway, displayName: string, description?: string | null, logoUrl?: string | null, isEnabled: boolean, isDefault: boolean, displayOrder: number, supportedMethods: Array<string>, sandboxMode: boolean, processingFee: number, processingFeeType: ProcessingFeeType, paymentType: GatewayPaymentType, instructions?: string | null, webhookUrl?: string | null, credentialHints?: string | null, hasCredentials: boolean, createdAt: any, updatedAt: any }> };

export type AdminPaymentGatewayQueryVariables = Exact<{
  id: Scalars['ID']['input'];
}>;


export type AdminPaymentGatewayQuery = { __typename?: 'Query', adminPaymentGateway: { __typename?: 'PaymentGatewayConfigEntity', id: string, gateway: PaymentGateway, displayName: string, description?: string | null, logoUrl?: string | null, isEnabled: boolean, isDefault: boolean, displayOrder: number, supportedMethods: Array<string>, sandboxMode: boolean, processingFee: number, processingFeeType: ProcessingFeeType, paymentType: GatewayPaymentType, instructions?: string | null, webhookUrl?: string | null, credentialHints?: string | null, hasCredentials: boolean, createdAt: any, updatedAt: any } };

export type CreatePaymentGatewayConfigMutationVariables = Exact<{
  input: CreateGatewayConfigInput;
}>;


export type CreatePaymentGatewayConfigMutation = { __typename?: 'Mutation', createPaymentGatewayConfig: { __typename?: 'PaymentGatewayConfigEntity', id: string, gateway: PaymentGateway, displayName: string, isEnabled: boolean, isDefault: boolean } };

export type UpdatePaymentGatewayConfigMutationVariables = Exact<{
  input: UpdateGatewayConfigInput;
}>;


export type UpdatePaymentGatewayConfigMutation = { __typename?: 'Mutation', updatePaymentGatewayConfig: { __typename?: 'PaymentGatewayConfigEntity', id: string, gateway: PaymentGateway, displayName: string, description?: string | null, logoUrl?: string | null, isEnabled: boolean, isDefault: boolean, displayOrder: number, supportedMethods: Array<string>, sandboxMode: boolean, processingFee: number, processingFeeType: ProcessingFeeType, paymentType: GatewayPaymentType, instructions?: string | null, webhookUrl?: string | null, credentialHints?: string | null, hasCredentials: boolean, updatedAt: any } };

export type TogglePaymentGatewayMutationVariables = Exact<{
  id: Scalars['ID']['input'];
  enabled: Scalars['Boolean']['input'];
}>;


export type TogglePaymentGatewayMutation = { __typename?: 'Mutation', togglePaymentGateway: { __typename?: 'PaymentGatewayConfigEntity', id: string, isEnabled: boolean } };

export type SetDefaultPaymentGatewayMutationVariables = Exact<{
  id: Scalars['ID']['input'];
}>;


export type SetDefaultPaymentGatewayMutation = { __typename?: 'Mutation', setDefaultPaymentGateway: { __typename?: 'PaymentGatewayConfigEntity', id: string, isDefault: boolean } };

export type AdminPaymentTransactionsQueryVariables = Exact<{
  page?: InputMaybe<Scalars['Int']['input']>;
  pageSize?: InputMaybe<Scalars['Int']['input']>;
  gateway?: InputMaybe<PaymentGateway>;
  status?: InputMaybe<PaymentTransactionStatus>;
}>;


export type AdminPaymentTransactionsQuery = { __typename?: 'Query', adminPaymentTransactions: { __typename?: 'PaginatedPayments', totalCount: number, totalPages: number, currentPage: number, pageSize: number, items: Array<{ __typename?: 'PaymentEntity', id: string, orderId: string, gateway: PaymentGateway, method: PaymentMethod, amount: number, processingFee: number, currency: string, status: PaymentTransactionStatus, gatewayOrderId?: string | null, gatewayPaymentId?: string | null, capturedAt?: any | null, failedAt?: any | null, createdAt: any }> } };

export type ActivePaymentGatewaysQueryVariables = Exact<{ [key: string]: never; }>;


export type ActivePaymentGatewaysQuery = { __typename?: 'Query', activePaymentGateways: Array<{ __typename?: 'PaymentGatewayConfigEntity', id: string, gateway: PaymentGateway, displayName: string, description?: string | null, logoUrl?: string | null, isDefault: boolean, processingFee: number, processingFeeType: ProcessingFeeType, paymentType: GatewayPaymentType, supportedMethods: Array<string> }> };

export type InitiateCheckoutMutationVariables = Exact<{
  input: InitiateCheckoutInput;
}>;


export type InitiateCheckoutMutation = { __typename?: 'Mutation', initiateCheckout: { __typename?: 'CheckoutResult', orderId: string, orderNumber: string, gateway: PaymentGateway, gatewayPayload?: string | null, requiresPayment: boolean } };

export type VerifyPaymentMutationVariables = Exact<{
  input: VerifyPaymentInput;
}>;


export type VerifyPaymentMutation = { __typename?: 'Mutation', verifyPayment: { __typename?: 'Order', id: string, orderNumber: string, status: OrderStatus, paymentStatus: PaymentStatus } };

export type ProductImageFieldsFragment = { __typename?: 'ProductImage', id: string, productId: string, imageUrl: string, altText?: string | null, displayOrder: number, isPrimary: boolean, createdAt: any, updatedAt: any } & { ' $fragmentName'?: 'ProductImageFieldsFragment' };

export type ProductSummaryFieldsFragment = { __typename?: 'Product', id: string, name: string, slug: string, productType: ProductType, status: ProductStatus, isFeatured: boolean, price?: number | null, compareAtPrice?: number | null, priceWithTax?: number | null, createdAt: any, images?: Array<(
    { __typename?: 'ProductImage' }
    & { ' $fragmentRefs'?: { 'ProductImageFieldsFragment': ProductImageFieldsFragment } }
  )> | null } & { ' $fragmentName'?: 'ProductSummaryFieldsFragment' };

export type ProductFieldsFragment = { __typename?: 'Product', id: string, storeId: string, categoryId?: string | null, brandId?: string | null, name: string, slug: string, description?: string | null, shortDescription?: string | null, productType: ProductType, status: ProductStatus, isFeatured: boolean, isDigital: boolean, price?: number | null, compareAtPrice?: number | null, costPrice?: number | null, priceWithTax?: number | null, sku?: string | null, weight?: number | null, length?: number | null, width?: number | null, height?: number | null, hsnCode?: string | null, seoTitle?: string | null, seoDescription?: string | null, seoKeywords: Array<string>, specifications: string, createdAt: any, updatedAt: any, taxId?: string | null, images?: Array<(
    { __typename?: 'ProductImage' }
    & { ' $fragmentRefs'?: { 'ProductImageFieldsFragment': ProductImageFieldsFragment } }
  )> | null, brand?: { __typename?: 'Brand', id: string, name: string, slug: string, logoUrl?: string | null } | null, category?: { __typename?: 'Category', id: string, name: string, slug: string } | null, tax?: { __typename?: 'Tax', id: string, name: string, rate: number } | null, tags?: Array<{ __typename?: 'Tag', id: string, name: string, slug: string }> | null } & { ' $fragmentName'?: 'ProductFieldsFragment' };

export type GetMyProductsQueryVariables = Exact<{
  storeId?: InputMaybe<Scalars['ID']['input']>;
  status?: InputMaybe<ProductStatus>;
}>;


export type GetMyProductsQuery = { __typename?: 'Query', myProducts: Array<(
    { __typename?: 'Product' }
    & { ' $fragmentRefs'?: { 'ProductFieldsFragment': ProductFieldsFragment } }
  )> };

export type GetMyProductQueryVariables = Exact<{
  id: Scalars['ID']['input'];
}>;


export type GetMyProductQuery = { __typename?: 'Query', myProduct: (
    { __typename?: 'Product' }
    & { ' $fragmentRefs'?: { 'ProductFieldsFragment': ProductFieldsFragment } }
  ) };

export type CreateMyProductMutationVariables = Exact<{
  createProductInput: CreateProductInput;
}>;


export type CreateMyProductMutation = { __typename?: 'Mutation', createMyProduct: (
    { __typename?: 'Product' }
    & { ' $fragmentRefs'?: { 'ProductFieldsFragment': ProductFieldsFragment } }
  ) };

export type UpdateMyProductMutationVariables = Exact<{
  updateProductInput: UpdateProductInput;
}>;


export type UpdateMyProductMutation = { __typename?: 'Mutation', updateMyProduct: (
    { __typename?: 'Product' }
    & { ' $fragmentRefs'?: { 'ProductFieldsFragment': ProductFieldsFragment } }
  ) };

export type SetMyProductStatusMutationVariables = Exact<{
  setProductStatusInput: SetProductStatusInput;
}>;


export type SetMyProductStatusMutation = { __typename?: 'Mutation', setMyProductStatus: (
    { __typename?: 'Product' }
    & { ' $fragmentRefs'?: { 'ProductFieldsFragment': ProductFieldsFragment } }
  ) };

export type RemoveMyProductMutationVariables = Exact<{
  id: Scalars['ID']['input'];
}>;


export type RemoveMyProductMutation = { __typename?: 'Mutation', removeMyProduct: (
    { __typename?: 'Product' }
    & { ' $fragmentRefs'?: { 'ProductFieldsFragment': ProductFieldsFragment } }
  ) };

export type AddMyProductImageMutationVariables = Exact<{
  addProductImageInput: AddProductImageInput;
}>;


export type AddMyProductImageMutation = { __typename?: 'Mutation', addMyProductImage: (
    { __typename?: 'ProductImage' }
    & { ' $fragmentRefs'?: { 'ProductImageFieldsFragment': ProductImageFieldsFragment } }
  ) };

export type UpdateMyProductImageMutationVariables = Exact<{
  updateProductImageInput: UpdateProductImageInput;
}>;


export type UpdateMyProductImageMutation = { __typename?: 'Mutation', updateMyProductImage: (
    { __typename?: 'ProductImage' }
    & { ' $fragmentRefs'?: { 'ProductImageFieldsFragment': ProductImageFieldsFragment } }
  ) };

export type RemoveMyProductImageMutationVariables = Exact<{
  id: Scalars['ID']['input'];
}>;


export type RemoveMyProductImageMutation = { __typename?: 'Mutation', removeMyProductImage: (
    { __typename?: 'ProductImage' }
    & { ' $fragmentRefs'?: { 'ProductImageFieldsFragment': ProductImageFieldsFragment } }
  ) };

export type ReorderMyProductImagesMutationVariables = Exact<{
  reorderProductImagesInput: ReorderProductImagesInput;
}>;


export type ReorderMyProductImagesMutation = { __typename?: 'Mutation', reorderMyProductImages: boolean };

export type GetAdminProductsQueryVariables = Exact<{
  status?: InputMaybe<ProductStatus>;
  storeId?: InputMaybe<Scalars['ID']['input']>;
  brandId?: InputMaybe<Scalars['ID']['input']>;
  categoryId?: InputMaybe<Scalars['ID']['input']>;
}>;


export type GetAdminProductsQuery = { __typename?: 'Query', adminProducts: Array<(
    { __typename?: 'Product', variants?: Array<{ __typename?: 'ProductVariant', id: string, sku: string, price: number, status: VariantStatus, attributes: Array<{ __typename?: 'ProductVariantAttribute', attributeName: string, value: string }> }> | null }
    & { ' $fragmentRefs'?: { 'ProductFieldsFragment': ProductFieldsFragment } }
  )> };

export type AdminSetProductStatusMutationVariables = Exact<{
  setProductStatusInput: SetProductStatusInput;
}>;


export type AdminSetProductStatusMutation = { __typename?: 'Mutation', adminSetProductStatus: (
    { __typename?: 'Product' }
    & { ' $fragmentRefs'?: { 'ProductFieldsFragment': ProductFieldsFragment } }
  ) };

export type GetPublicProductQueryVariables = Exact<{
  slug: Scalars['String']['input'];
}>;


export type GetPublicProductQuery = { __typename?: 'Query', publicProduct: (
    { __typename?: 'Product', variants?: Array<{ __typename?: 'ProductVariant', id: string, sku: string, price: number, priceWithTax?: number | null, compareAtPrice?: number | null, imageUrl?: string | null, status: VariantStatus, availableQuantity?: number | null, stockState?: StockState | null, attributes: Array<{ __typename?: 'ProductVariantAttribute', attributeId: string, attributeValueId: string, attributeName: string, attributeSlug: string, value: string, valueSlug: string }> }> | null }
    & { ' $fragmentRefs'?: { 'ProductFieldsFragment': ProductFieldsFragment } }
  ) };

export type GetPublicProductsQueryVariables = Exact<{
  storeSlug?: InputMaybe<Scalars['String']['input']>;
  brandSlug?: InputMaybe<Scalars['String']['input']>;
  tagSlug?: InputMaybe<Scalars['String']['input']>;
  categorySlug?: InputMaybe<Scalars['String']['input']>;
  sort?: InputMaybe<ProductSortOrder>;
  limit?: InputMaybe<Scalars['Float']['input']>;
}>;


export type GetPublicProductsQuery = { __typename?: 'Query', publicProducts: Array<(
    { __typename?: 'Product', variants?: Array<{ __typename?: 'ProductVariant', id: string, price: number, priceWithTax?: number | null, availableQuantity?: number | null }> | null }
    & { ' $fragmentRefs'?: { 'ProductSummaryFieldsFragment': ProductSummaryFieldsFragment } }
  )> };

export type GetPaginatedPublicProductsQueryVariables = Exact<{
  storeSlug?: InputMaybe<Scalars['String']['input']>;
  brandSlug?: InputMaybe<Scalars['String']['input']>;
  tagSlug?: InputMaybe<Scalars['String']['input']>;
  categorySlug?: InputMaybe<Scalars['String']['input']>;
  minPrice?: InputMaybe<Scalars['Float']['input']>;
  maxPrice?: InputMaybe<Scalars['Float']['input']>;
  sort?: InputMaybe<ProductSortOrder>;
  page?: InputMaybe<Scalars['Int']['input']>;
  pageSize?: InputMaybe<Scalars['Int']['input']>;
}>;


export type GetPaginatedPublicProductsQuery = { __typename?: 'Query', paginatedPublicProducts: { __typename?: 'PaginatedProducts', totalCount: number, totalPages: number, currentPage: number, pageSize: number, items: Array<(
      { __typename?: 'Product', variants?: Array<{ __typename?: 'ProductVariant', id: string, price: number, priceWithTax?: number | null, availableQuantity?: number | null }> | null }
      & { ' $fragmentRefs'?: { 'ProductSummaryFieldsFragment': ProductSummaryFieldsFragment } }
    )> } };

export type VariantFieldsFragment = { __typename?: 'ProductVariant', id: string, productId: string, sku: string, name?: string | null, price: number, compareAtPrice?: number | null, costPrice?: number | null, weight?: number | null, length?: number | null, width?: number | null, height?: number | null, imageUrl?: string | null, status: VariantStatus, createdAt: any, updatedAt: any, attributes: Array<{ __typename?: 'ProductVariantAttribute', attributeId: string, attributeValueId: string, attributeName: string, attributeSlug: string, value: string, valueSlug: string }> } & { ' $fragmentName'?: 'VariantFieldsFragment' };

export type VariantAxisFieldsFragment = { __typename?: 'VariantAxis', attributeId: string, attributeName: string, attributeSlug: string, values: Array<{ __typename?: 'ProductAttributeValue', id: string, attributeId: string, value: string, slug: string, displayOrder: number, createdAt: any, updatedAt: any }> } & { ' $fragmentName'?: 'VariantAxisFieldsFragment' };

export type GetMyProductVariantsQueryVariables = Exact<{
  productId: Scalars['ID']['input'];
}>;


export type GetMyProductVariantsQuery = { __typename?: 'Query', myProductVariants: Array<(
    { __typename?: 'ProductVariant' }
    & { ' $fragmentRefs'?: { 'VariantFieldsFragment': VariantFieldsFragment } }
  )> };

export type GetMyProductVariantAxesQueryVariables = Exact<{
  productId: Scalars['ID']['input'];
}>;


export type GetMyProductVariantAxesQuery = { __typename?: 'Query', myProductVariantAxes: Array<(
    { __typename?: 'VariantAxis' }
    & { ' $fragmentRefs'?: { 'VariantAxisFieldsFragment': VariantAxisFieldsFragment } }
  )> };

export type SetMyProductVariantAxesMutationVariables = Exact<{
  setVariantAxesInput: SetVariantAxesInput;
}>;


export type SetMyProductVariantAxesMutation = { __typename?: 'Mutation', setMyProductVariantAxes: Array<(
    { __typename?: 'VariantAxis' }
    & { ' $fragmentRefs'?: { 'VariantAxisFieldsFragment': VariantAxisFieldsFragment } }
  )> };

export type GenerateMyProductVariantMatrixMutationVariables = Exact<{
  generateVariantMatrixInput: GenerateVariantMatrixInput;
}>;


export type GenerateMyProductVariantMatrixMutation = { __typename?: 'Mutation', generateMyProductVariantMatrix: Array<(
    { __typename?: 'ProductVariant' }
    & { ' $fragmentRefs'?: { 'VariantFieldsFragment': VariantFieldsFragment } }
  )> };

export type AddMyProductVariantMutationVariables = Exact<{
  createVariantInput: CreateVariantInput;
}>;


export type AddMyProductVariantMutation = { __typename?: 'Mutation', addMyProductVariant: (
    { __typename?: 'ProductVariant' }
    & { ' $fragmentRefs'?: { 'VariantFieldsFragment': VariantFieldsFragment } }
  ) };

export type UpdateMyProductVariantMutationVariables = Exact<{
  updateVariantInput: UpdateVariantInput;
}>;


export type UpdateMyProductVariantMutation = { __typename?: 'Mutation', updateMyProductVariant: (
    { __typename?: 'ProductVariant' }
    & { ' $fragmentRefs'?: { 'VariantFieldsFragment': VariantFieldsFragment } }
  ) };

export type RemoveMyProductVariantMutationVariables = Exact<{
  id: Scalars['ID']['input'];
}>;


export type RemoveMyProductVariantMutation = { __typename?: 'Mutation', removeMyProductVariant: (
    { __typename?: 'ProductVariant' }
    & { ' $fragmentRefs'?: { 'VariantFieldsFragment': VariantFieldsFragment } }
  ) };

export type BulkUpdateMyProductVariantsMutationVariables = Exact<{
  bulkUpdateVariantsInput: BulkUpdateVariantsInput;
}>;


export type BulkUpdateMyProductVariantsMutation = { __typename?: 'Mutation', bulkUpdateMyProductVariants: number };

export type PayoutAccountFieldsFragment = { __typename?: 'SellerPayoutAccount', id: string, sellerId: string, accountType: string, accountHolderName: string, accountNumber?: string | null, ifscCode?: string | null, bankName?: string | null, upiId?: string | null, walletProvider?: string | null, isPrimary: boolean, isVerified: boolean, createdAt: any, updatedAt: any } & { ' $fragmentName'?: 'PayoutAccountFieldsFragment' };

export type SellerFieldsFragment = { __typename?: 'Seller', id: string, userId: string, legalName: string, displayName: string, businessType: BusinessType, dateOfIncorporation?: any | null, registrationNumber?: string | null, panNumber: string, gstin?: string | null, businessEmail: string, businessPhone: string, supportEmail?: string | null, signatoryName?: string | null, signatoryPan?: string | null, signatoryDesignation?: string | null, overallStatus: SellerStatus, panVerifiedAt?: any | null, gstinVerifiedAt?: any | null, bankVerifiedAt?: any | null, documentsVerifiedAt?: any | null, rejectionReason?: string | null, commissionRate: number, createdAt: any, updatedAt: any, payoutAccounts?: Array<(
    { __typename?: 'SellerPayoutAccount' }
    & { ' $fragmentRefs'?: { 'PayoutAccountFieldsFragment': PayoutAccountFieldsFragment } }
  )> | null } & { ' $fragmentName'?: 'SellerFieldsFragment' };

export type GetMySellerQueryVariables = Exact<{ [key: string]: never; }>;


export type GetMySellerQuery = { __typename?: 'Query', mySeller?: (
    { __typename?: 'Seller' }
    & { ' $fragmentRefs'?: { 'SellerFieldsFragment': SellerFieldsFragment } }
  ) | null };

export type GetSellersQueryVariables = Exact<{
  status?: InputMaybe<SellerStatus>;
}>;


export type GetSellersQuery = { __typename?: 'Query', sellers: Array<(
    { __typename?: 'Seller' }
    & { ' $fragmentRefs'?: { 'SellerFieldsFragment': SellerFieldsFragment } }
  )> };

export type GetSellerUsersQueryVariables = Exact<{
  status?: InputMaybe<SellerListStatus>;
}>;


export type GetSellerUsersQuery = { __typename?: 'Query', sellerUsers: Array<{ __typename?: 'SellerListItem', userId: string, name: string, email: string, phone: string, emailVerifiedAt?: any | null, registeredAt: any, status: SellerListStatus, seller?: (
      { __typename?: 'Seller' }
      & { ' $fragmentRefs'?: { 'SellerFieldsFragment': SellerFieldsFragment } }
    ) | null }> };

export type GetSellerQueryVariables = Exact<{
  id: Scalars['ID']['input'];
}>;


export type GetSellerQuery = { __typename?: 'Query', seller: (
    { __typename?: 'Seller' }
    & { ' $fragmentRefs'?: { 'SellerFieldsFragment': SellerFieldsFragment } }
  ) };

export type CreateMySellerMutationVariables = Exact<{
  createSellerInput: CreateSellerInput;
}>;


export type CreateMySellerMutation = { __typename?: 'Mutation', createMySeller: (
    { __typename?: 'Seller' }
    & { ' $fragmentRefs'?: { 'SellerFieldsFragment': SellerFieldsFragment } }
  ) };

export type UpdateMySellerMutationVariables = Exact<{
  updateSellerInput: UpdateSellerInput;
}>;


export type UpdateMySellerMutation = { __typename?: 'Mutation', updateMySeller: (
    { __typename?: 'Seller' }
    & { ' $fragmentRefs'?: { 'SellerFieldsFragment': SellerFieldsFragment } }
  ) };

export type SubmitMySellerForReviewMutationVariables = Exact<{
  id: Scalars['ID']['input'];
}>;


export type SubmitMySellerForReviewMutation = { __typename?: 'Mutation', submitMySellerForReview: (
    { __typename?: 'Seller' }
    & { ' $fragmentRefs'?: { 'SellerFieldsFragment': SellerFieldsFragment } }
  ) };

export type VerifySellerSectionMutationVariables = Exact<{
  verifySectionInput: VerifySellerSectionInput;
}>;


export type VerifySellerSectionMutation = { __typename?: 'Mutation', verifySellerSection: (
    { __typename?: 'Seller' }
    & { ' $fragmentRefs'?: { 'SellerFieldsFragment': SellerFieldsFragment } }
  ) };

export type SetSellerStatusMutationVariables = Exact<{
  setStatusInput: SetSellerStatusInput;
}>;


export type SetSellerStatusMutation = { __typename?: 'Mutation', setSellerStatus: (
    { __typename?: 'Seller' }
    & { ' $fragmentRefs'?: { 'SellerFieldsFragment': SellerFieldsFragment } }
  ) };

export type RemoveSellerMutationVariables = Exact<{
  id: Scalars['ID']['input'];
}>;


export type RemoveSellerMutation = { __typename?: 'Mutation', removeSeller: (
    { __typename?: 'Seller' }
    & { ' $fragmentRefs'?: { 'SellerFieldsFragment': SellerFieldsFragment } }
  ) };

export type GetSiteSettingsQueryVariables = Exact<{
  group?: InputMaybe<SettingGroup>;
}>;


export type GetSiteSettingsQuery = { __typename?: 'Query', siteSettings: Array<{ __typename?: 'SiteSetting', id: string, key: string, value: string, group: SettingGroup, label: string, description?: string | null, valueType: SettingValueType, createdAt: any, updatedAt: any }> };

export type UpdateSiteSettingMutationVariables = Exact<{
  input: UpdateSiteSettingInput;
}>;


export type UpdateSiteSettingMutation = { __typename?: 'Mutation', updateSiteSetting: { __typename?: 'SiteSetting', id: string, key: string, value: string, group: SettingGroup, label: string, description?: string | null, valueType: SettingValueType, updatedAt: any } };

export type SlideItemFieldsFragment = { __typename?: 'SlideItem', id: string, sliderId: string, title?: string | null, description?: string | null, link?: string | null, ctaLabel?: string | null, imageUrl?: string | null, tabletImageUrl?: string | null, mobileImageUrl?: string | null, order: number, isEnabled: boolean, createdAt: any, updatedAt: any } & { ' $fragmentName'?: 'SlideItemFieldsFragment' };

export type SliderFieldsFragment = { __typename?: 'Slider', id: string, name: string, key: string, description?: string | null, status: SliderStatus, config: string, createdAt: any, updatedAt: any, items?: Array<(
    { __typename?: 'SlideItem' }
    & { ' $fragmentRefs'?: { 'SlideItemFieldsFragment': SlideItemFieldsFragment } }
  )> | null } & { ' $fragmentName'?: 'SliderFieldsFragment' };

export type GetPublicSliderQueryVariables = Exact<{
  key: Scalars['String']['input'];
}>;


export type GetPublicSliderQuery = { __typename?: 'Query', publicSlider: (
    { __typename?: 'Slider' }
    & { ' $fragmentRefs'?: { 'SliderFieldsFragment': SliderFieldsFragment } }
  ) };

export type GetAdminSlidersQueryVariables = Exact<{ [key: string]: never; }>;


export type GetAdminSlidersQuery = { __typename?: 'Query', adminSliders: Array<(
    { __typename?: 'Slider' }
    & { ' $fragmentRefs'?: { 'SliderFieldsFragment': SliderFieldsFragment } }
  )> };

export type GetAdminSlidersPaginatedQueryVariables = Exact<{
  status?: InputMaybe<SliderStatus>;
  page?: InputMaybe<Scalars['Int']['input']>;
  pageSize?: InputMaybe<Scalars['Int']['input']>;
  search?: InputMaybe<Scalars['String']['input']>;
}>;


export type GetAdminSlidersPaginatedQuery = { __typename?: 'Query', adminSlidersPaginated: { __typename?: 'PaginatedSliders', totalCount: number, totalPages: number, currentPage: number, pageSize: number, items: Array<(
      { __typename?: 'Slider' }
      & { ' $fragmentRefs'?: { 'SliderFieldsFragment': SliderFieldsFragment } }
    )> } };

export type GetAdminSliderQueryVariables = Exact<{
  id: Scalars['ID']['input'];
}>;


export type GetAdminSliderQuery = { __typename?: 'Query', adminSlider: (
    { __typename?: 'Slider' }
    & { ' $fragmentRefs'?: { 'SliderFieldsFragment': SliderFieldsFragment } }
  ) };

export type CreateSliderMutationVariables = Exact<{
  createSliderInput: CreateSliderInput;
}>;


export type CreateSliderMutation = { __typename?: 'Mutation', createSlider: (
    { __typename?: 'Slider' }
    & { ' $fragmentRefs'?: { 'SliderFieldsFragment': SliderFieldsFragment } }
  ) };

export type UpdateSliderMutationVariables = Exact<{
  updateSliderInput: UpdateSliderInput;
}>;


export type UpdateSliderMutation = { __typename?: 'Mutation', updateSlider: (
    { __typename?: 'Slider' }
    & { ' $fragmentRefs'?: { 'SliderFieldsFragment': SliderFieldsFragment } }
  ) };

export type SetSliderStatusMutationVariables = Exact<{
  setSliderStatusInput: SetSliderStatusInput;
}>;


export type SetSliderStatusMutation = { __typename?: 'Mutation', setSliderStatus: (
    { __typename?: 'Slider' }
    & { ' $fragmentRefs'?: { 'SliderFieldsFragment': SliderFieldsFragment } }
  ) };

export type RemoveSliderMutationVariables = Exact<{
  id: Scalars['ID']['input'];
}>;


export type RemoveSliderMutation = { __typename?: 'Mutation', removeSlider: (
    { __typename?: 'Slider' }
    & { ' $fragmentRefs'?: { 'SliderFieldsFragment': SliderFieldsFragment } }
  ) };

export type AddSlideItemMutationVariables = Exact<{
  addSlideItemInput: AddSlideItemInput;
}>;


export type AddSlideItemMutation = { __typename?: 'Mutation', addSlideItem: (
    { __typename?: 'SlideItem' }
    & { ' $fragmentRefs'?: { 'SlideItemFieldsFragment': SlideItemFieldsFragment } }
  ) };

export type UpdateSlideItemMutationVariables = Exact<{
  updateSlideItemInput: UpdateSlideItemInput;
}>;


export type UpdateSlideItemMutation = { __typename?: 'Mutation', updateSlideItem: (
    { __typename?: 'SlideItem' }
    & { ' $fragmentRefs'?: { 'SlideItemFieldsFragment': SlideItemFieldsFragment } }
  ) };

export type RemoveSlideItemMutationVariables = Exact<{
  id: Scalars['ID']['input'];
}>;


export type RemoveSlideItemMutation = { __typename?: 'Mutation', removeSlideItem: (
    { __typename?: 'SlideItem' }
    & { ' $fragmentRefs'?: { 'SlideItemFieldsFragment': SlideItemFieldsFragment } }
  ) };

export type ReorderSlideItemsMutationVariables = Exact<{
  reorderSlideItemsInput: ReorderSlideItemsInput;
}>;


export type ReorderSlideItemsMutation = { __typename?: 'Mutation', reorderSlideItems: boolean };

export type WarehouseFieldsFragment = { __typename?: 'Warehouse', id: string, storeId: string, name: string, code: string, addressLine1: string, addressLine2?: string | null, city: string, state: string, postalCode: string, countryCode: string, phone?: string | null, isDefault: boolean, isActive: boolean, createdAt: any, updatedAt: any } & { ' $fragmentName'?: 'WarehouseFieldsFragment' };

export type StoreFieldsFragment = { __typename?: 'Store', id: string, sellerId: string, name: string, slug: string, description?: string | null, logoUrl?: string | null, bannerUrl?: string | null, currencyCode: string, timezone: string, locale: string, supportEmail?: string | null, supportPhone?: string | null, status: StoreStatus, isFeatured: boolean, createdAt: any, updatedAt: any, warehouses?: Array<(
    { __typename?: 'Warehouse' }
    & { ' $fragmentRefs'?: { 'WarehouseFieldsFragment': WarehouseFieldsFragment } }
  )> | null } & { ' $fragmentName'?: 'StoreFieldsFragment' };

export type GetMyStoresQueryVariables = Exact<{ [key: string]: never; }>;


export type GetMyStoresQuery = { __typename?: 'Query', myStores: Array<(
    { __typename?: 'Store' }
    & { ' $fragmentRefs'?: { 'StoreFieldsFragment': StoreFieldsFragment } }
  )> };

export type GetMyStoreQueryVariables = Exact<{
  id: Scalars['ID']['input'];
}>;


export type GetMyStoreQuery = { __typename?: 'Query', myStore?: (
    { __typename?: 'Store' }
    & { ' $fragmentRefs'?: { 'StoreFieldsFragment': StoreFieldsFragment } }
  ) | null };

export type CreateMyStoreMutationVariables = Exact<{
  createStoreInput: CreateStoreInput;
}>;


export type CreateMyStoreMutation = { __typename?: 'Mutation', createMyStore: (
    { __typename?: 'Store' }
    & { ' $fragmentRefs'?: { 'StoreFieldsFragment': StoreFieldsFragment } }
  ) };

export type UpdateMyStoreMutationVariables = Exact<{
  updateStoreInput: UpdateStoreInput;
}>;


export type UpdateMyStoreMutation = { __typename?: 'Mutation', updateMyStore: (
    { __typename?: 'Store' }
    & { ' $fragmentRefs'?: { 'StoreFieldsFragment': StoreFieldsFragment } }
  ) };

export type SubmitMyStoreForReviewMutationVariables = Exact<{
  id: Scalars['ID']['input'];
}>;


export type SubmitMyStoreForReviewMutation = { __typename?: 'Mutation', submitMyStoreForReview: (
    { __typename?: 'Store' }
    & { ' $fragmentRefs'?: { 'StoreFieldsFragment': StoreFieldsFragment } }
  ) };

export type RemoveMyStoreMutationVariables = Exact<{
  id: Scalars['ID']['input'];
}>;


export type RemoveMyStoreMutation = { __typename?: 'Mutation', removeMyStore: (
    { __typename?: 'Store' }
    & { ' $fragmentRefs'?: { 'StoreFieldsFragment': StoreFieldsFragment } }
  ) };

export type CreateMyWarehouseMutationVariables = Exact<{
  createWarehouseInput: CreateWarehouseInput;
}>;


export type CreateMyWarehouseMutation = { __typename?: 'Mutation', createMyWarehouse: (
    { __typename?: 'Warehouse' }
    & { ' $fragmentRefs'?: { 'WarehouseFieldsFragment': WarehouseFieldsFragment } }
  ) };

export type UpdateMyWarehouseMutationVariables = Exact<{
  updateWarehouseInput: UpdateWarehouseInput;
}>;


export type UpdateMyWarehouseMutation = { __typename?: 'Mutation', updateMyWarehouse: (
    { __typename?: 'Warehouse' }
    & { ' $fragmentRefs'?: { 'WarehouseFieldsFragment': WarehouseFieldsFragment } }
  ) };

export type RemoveMyWarehouseMutationVariables = Exact<{
  id: Scalars['ID']['input'];
}>;


export type RemoveMyWarehouseMutation = { __typename?: 'Mutation', removeMyWarehouse: (
    { __typename?: 'Warehouse' }
    & { ' $fragmentRefs'?: { 'WarehouseFieldsFragment': WarehouseFieldsFragment } }
  ) };

export type GetStoresQueryVariables = Exact<{
  status?: InputMaybe<StoreStatus>;
}>;


export type GetStoresQuery = { __typename?: 'Query', stores: Array<(
    { __typename?: 'Store' }
    & { ' $fragmentRefs'?: { 'StoreFieldsFragment': StoreFieldsFragment } }
  )> };

export type SetStoreStatusMutationVariables = Exact<{
  setStoreStatusInput: SetStoreStatusInput;
}>;


export type SetStoreStatusMutation = { __typename?: 'Mutation', setStoreStatus: (
    { __typename?: 'Store' }
    & { ' $fragmentRefs'?: { 'StoreFieldsFragment': StoreFieldsFragment } }
  ) };

export type AdminRemoveStoreMutationVariables = Exact<{
  id: Scalars['ID']['input'];
}>;


export type AdminRemoveStoreMutation = { __typename?: 'Mutation', adminRemoveStore: (
    { __typename?: 'Store' }
    & { ' $fragmentRefs'?: { 'StoreFieldsFragment': StoreFieldsFragment } }
  ) };

export type GetPublicStoreQueryVariables = Exact<{
  slug: Scalars['String']['input'];
}>;


export type GetPublicStoreQuery = { __typename?: 'Query', publicStore: (
    { __typename?: 'Store' }
    & { ' $fragmentRefs'?: { 'StoreFieldsFragment': StoreFieldsFragment } }
  ) };

export type TagFieldsFragment = { __typename?: 'Tag', id: string, name: string, slug: string, description?: string | null, status: TagStatus, isFeatured: boolean, createdAt: any, updatedAt: any } & { ' $fragmentName'?: 'TagFieldsFragment' };

export type GetAdminTagsQueryVariables = Exact<{
  status?: InputMaybe<TagStatus>;
}>;


export type GetAdminTagsQuery = { __typename?: 'Query', adminTags: Array<(
    { __typename?: 'Tag' }
    & { ' $fragmentRefs'?: { 'TagFieldsFragment': TagFieldsFragment } }
  )> };

export type GetTagsQueryVariables = Exact<{
  status?: InputMaybe<TagStatus>;
  featuredOnly?: InputMaybe<Scalars['Boolean']['input']>;
}>;


export type GetTagsQuery = { __typename?: 'Query', tags: Array<(
    { __typename?: 'Tag' }
    & { ' $fragmentRefs'?: { 'TagFieldsFragment': TagFieldsFragment } }
  )> };

export type GetTagQueryVariables = Exact<{
  id: Scalars['ID']['input'];
}>;


export type GetTagQuery = { __typename?: 'Query', tag: (
    { __typename?: 'Tag' }
    & { ' $fragmentRefs'?: { 'TagFieldsFragment': TagFieldsFragment } }
  ) };

export type GetPublicTagQueryVariables = Exact<{
  slug: Scalars['String']['input'];
}>;


export type GetPublicTagQuery = { __typename?: 'Query', publicTag: (
    { __typename?: 'Tag' }
    & { ' $fragmentRefs'?: { 'TagFieldsFragment': TagFieldsFragment } }
  ) };

export type CreateTagMutationVariables = Exact<{
  createTagInput: CreateTagInput;
}>;


export type CreateTagMutation = { __typename?: 'Mutation', createTag: (
    { __typename?: 'Tag' }
    & { ' $fragmentRefs'?: { 'TagFieldsFragment': TagFieldsFragment } }
  ) };

export type UpdateTagMutationVariables = Exact<{
  updateTagInput: UpdateTagInput;
}>;


export type UpdateTagMutation = { __typename?: 'Mutation', updateTag: (
    { __typename?: 'Tag' }
    & { ' $fragmentRefs'?: { 'TagFieldsFragment': TagFieldsFragment } }
  ) };

export type SetTagStatusMutationVariables = Exact<{
  setTagStatusInput: SetTagStatusInput;
}>;


export type SetTagStatusMutation = { __typename?: 'Mutation', setTagStatus: (
    { __typename?: 'Tag' }
    & { ' $fragmentRefs'?: { 'TagFieldsFragment': TagFieldsFragment } }
  ) };

export type RemoveTagMutationVariables = Exact<{
  id: Scalars['ID']['input'];
}>;


export type RemoveTagMutation = { __typename?: 'Mutation', removeTag: (
    { __typename?: 'Tag' }
    & { ' $fragmentRefs'?: { 'TagFieldsFragment': TagFieldsFragment } }
  ) };

export type TaxFieldsFragment = { __typename?: 'Tax', id: string, name: string, rate: number, description?: string | null, isActive: boolean, displayOrder: number, createdAt: any, updatedAt: any } & { ' $fragmentName'?: 'TaxFieldsFragment' };

export type GetTaxesQueryVariables = Exact<{ [key: string]: never; }>;


export type GetTaxesQuery = { __typename?: 'Query', taxes: Array<(
    { __typename?: 'Tax' }
    & { ' $fragmentRefs'?: { 'TaxFieldsFragment': TaxFieldsFragment } }
  )> };

export type GetAdminTaxesQueryVariables = Exact<{ [key: string]: never; }>;


export type GetAdminTaxesQuery = { __typename?: 'Query', adminTaxes: Array<(
    { __typename?: 'Tax' }
    & { ' $fragmentRefs'?: { 'TaxFieldsFragment': TaxFieldsFragment } }
  )> };

export type GetAdminTaxesPaginatedQueryVariables = Exact<{
  page?: InputMaybe<Scalars['Int']['input']>;
  pageSize?: InputMaybe<Scalars['Int']['input']>;
  search?: InputMaybe<Scalars['String']['input']>;
}>;


export type GetAdminTaxesPaginatedQuery = { __typename?: 'Query', adminTaxesPaginated: { __typename?: 'PaginatedTaxes', totalCount: number, totalPages: number, currentPage: number, pageSize: number, items: Array<(
      { __typename?: 'Tax' }
      & { ' $fragmentRefs'?: { 'TaxFieldsFragment': TaxFieldsFragment } }
    )> } };

export type GetTaxQueryVariables = Exact<{
  id: Scalars['ID']['input'];
}>;


export type GetTaxQuery = { __typename?: 'Query', tax: (
    { __typename?: 'Tax' }
    & { ' $fragmentRefs'?: { 'TaxFieldsFragment': TaxFieldsFragment } }
  ) };

export type CreateTaxMutationVariables = Exact<{
  createTaxInput: CreateTaxInput;
}>;


export type CreateTaxMutation = { __typename?: 'Mutation', createTax: (
    { __typename?: 'Tax' }
    & { ' $fragmentRefs'?: { 'TaxFieldsFragment': TaxFieldsFragment } }
  ) };

export type UpdateTaxMutationVariables = Exact<{
  updateTaxInput: UpdateTaxInput;
}>;


export type UpdateTaxMutation = { __typename?: 'Mutation', updateTax: (
    { __typename?: 'Tax' }
    & { ' $fragmentRefs'?: { 'TaxFieldsFragment': TaxFieldsFragment } }
  ) };

export type RemoveTaxMutationVariables = Exact<{
  id: Scalars['ID']['input'];
}>;


export type RemoveTaxMutation = { __typename?: 'Mutation', removeTax: (
    { __typename?: 'Tax' }
    & { ' $fragmentRefs'?: { 'TaxFieldsFragment': TaxFieldsFragment } }
  ) };

export type WishlistFieldsFragment = { __typename?: 'Wishlist', id: string, customerId: string, name: string, isDefault: boolean, isPublic: boolean, itemCount: number, createdAt: any, updatedAt: any, items: Array<{ __typename?: 'WishlistItem', id: string, productId: string, variantId?: string | null, createdAt: any, product?: (
      { __typename?: 'Product' }
      & { ' $fragmentRefs'?: { 'ProductFieldsFragment': ProductFieldsFragment } }
    ) | null }> } & { ' $fragmentName'?: 'WishlistFieldsFragment' };

export type GetMyWishlistQueryVariables = Exact<{ [key: string]: never; }>;


export type GetMyWishlistQuery = { __typename?: 'Query', myWishlist: (
    { __typename?: 'Wishlist' }
    & { ' $fragmentRefs'?: { 'WishlistFieldsFragment': WishlistFieldsFragment } }
  ) };

export type GetMyWishlistProductIdsQueryVariables = Exact<{ [key: string]: never; }>;


export type GetMyWishlistProductIdsQuery = { __typename?: 'Query', myWishlistProductIds: Array<string> };

export type AddToWishlistMutationVariables = Exact<{
  input: ToggleWishlistInput;
}>;


export type AddToWishlistMutation = { __typename?: 'Mutation', addToWishlist: (
    { __typename?: 'Wishlist' }
    & { ' $fragmentRefs'?: { 'WishlistFieldsFragment': WishlistFieldsFragment } }
  ) };

export type RemoveFromWishlistMutationVariables = Exact<{
  input: ToggleWishlistInput;
}>;


export type RemoveFromWishlistMutation = { __typename?: 'Mutation', removeFromWishlist: (
    { __typename?: 'Wishlist' }
    & { ' $fragmentRefs'?: { 'WishlistFieldsFragment': WishlistFieldsFragment } }
  ) };

export type ClearWishlistMutationVariables = Exact<{ [key: string]: never; }>;


export type ClearWishlistMutation = { __typename?: 'Mutation', clearWishlist: (
    { __typename?: 'Wishlist' }
    & { ' $fragmentRefs'?: { 'WishlistFieldsFragment': WishlistFieldsFragment } }
  ) };

export type GetAdminThemeSsrQueryVariables = Exact<{ [key: string]: never; }>;


export type GetAdminThemeSsrQuery = { __typename?: 'Query', adminTheme: { __typename?: 'AdminTheme', id: string, primaryLight: string, primaryDark: string, accentLight: string, accentDark: string, sidebarLight: string, sidebarDark: string, destructiveLight: string, destructiveDark: string, radius: string, fontFamily?: string | null, updatedAt: any, updatedById?: string | null } };

export const AddressFieldsFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"AddressFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Address"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"userId"}},{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"label"}},{"kind":"Field","name":{"kind":"Name","value":"firstName"}},{"kind":"Field","name":{"kind":"Name","value":"lastName"}},{"kind":"Field","name":{"kind":"Name","value":"phone"}},{"kind":"Field","name":{"kind":"Name","value":"addressLine1"}},{"kind":"Field","name":{"kind":"Name","value":"addressLine2"}},{"kind":"Field","name":{"kind":"Name","value":"city"}},{"kind":"Field","name":{"kind":"Name","value":"state"}},{"kind":"Field","name":{"kind":"Name","value":"postalCode"}},{"kind":"Field","name":{"kind":"Name","value":"countryCode"}},{"kind":"Field","name":{"kind":"Name","value":"isDefault"}}]}}]} as unknown as DocumentNode<AddressFieldsFragment, unknown>;
export const AdminThemeFieldsFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"AdminThemeFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"AdminTheme"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"primaryLight"}},{"kind":"Field","name":{"kind":"Name","value":"primaryDark"}},{"kind":"Field","name":{"kind":"Name","value":"accentLight"}},{"kind":"Field","name":{"kind":"Name","value":"accentDark"}},{"kind":"Field","name":{"kind":"Name","value":"sidebarLight"}},{"kind":"Field","name":{"kind":"Name","value":"sidebarDark"}},{"kind":"Field","name":{"kind":"Name","value":"destructiveLight"}},{"kind":"Field","name":{"kind":"Name","value":"destructiveDark"}},{"kind":"Field","name":{"kind":"Name","value":"radius"}},{"kind":"Field","name":{"kind":"Name","value":"fontFamily"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedById"}}]}}]} as unknown as DocumentNode<AdminThemeFieldsFragment, unknown>;
export const AttributeValueFieldsFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"AttributeValueFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"ProductAttributeValue"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"attributeId"}},{"kind":"Field","name":{"kind":"Name","value":"value"}},{"kind":"Field","name":{"kind":"Name","value":"slug"}},{"kind":"Field","name":{"kind":"Name","value":"displayOrder"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}}]}}]} as unknown as DocumentNode<AttributeValueFieldsFragment, unknown>;
export const AttributeFieldsFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"AttributeFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"ProductAttribute"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"slug"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"isVariantAttribute"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}},{"kind":"Field","name":{"kind":"Name","value":"values"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"AttributeValueFields"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"AttributeValueFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"ProductAttributeValue"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"attributeId"}},{"kind":"Field","name":{"kind":"Name","value":"value"}},{"kind":"Field","name":{"kind":"Name","value":"slug"}},{"kind":"Field","name":{"kind":"Name","value":"displayOrder"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}}]}}]} as unknown as DocumentNode<AttributeFieldsFragment, unknown>;
export const BrandFieldsFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"BrandFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Brand"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"slug"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"logoUrl"}},{"kind":"Field","name":{"kind":"Name","value":"bannerUrl"}},{"kind":"Field","name":{"kind":"Name","value":"websiteUrl"}},{"kind":"Field","name":{"kind":"Name","value":"countryCode"}},{"kind":"Field","name":{"kind":"Name","value":"foundedYear"}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"isFeatured"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}}]}}]} as unknown as DocumentNode<BrandFieldsFragment, unknown>;
export const ProductImageFieldsFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"ProductImageFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"ProductImage"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"productId"}},{"kind":"Field","name":{"kind":"Name","value":"imageUrl"}},{"kind":"Field","name":{"kind":"Name","value":"altText"}},{"kind":"Field","name":{"kind":"Name","value":"displayOrder"}},{"kind":"Field","name":{"kind":"Name","value":"isPrimary"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}}]}}]} as unknown as DocumentNode<ProductImageFieldsFragment, unknown>;
export const ProductFieldsFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"ProductFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Product"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"storeId"}},{"kind":"Field","name":{"kind":"Name","value":"categoryId"}},{"kind":"Field","name":{"kind":"Name","value":"brandId"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"slug"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"shortDescription"}},{"kind":"Field","name":{"kind":"Name","value":"productType"}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"isFeatured"}},{"kind":"Field","name":{"kind":"Name","value":"isDigital"}},{"kind":"Field","name":{"kind":"Name","value":"price"}},{"kind":"Field","name":{"kind":"Name","value":"compareAtPrice"}},{"kind":"Field","name":{"kind":"Name","value":"costPrice"}},{"kind":"Field","name":{"kind":"Name","value":"priceWithTax"}},{"kind":"Field","name":{"kind":"Name","value":"sku"}},{"kind":"Field","name":{"kind":"Name","value":"weight"}},{"kind":"Field","name":{"kind":"Name","value":"length"}},{"kind":"Field","name":{"kind":"Name","value":"width"}},{"kind":"Field","name":{"kind":"Name","value":"height"}},{"kind":"Field","name":{"kind":"Name","value":"hsnCode"}},{"kind":"Field","name":{"kind":"Name","value":"seoTitle"}},{"kind":"Field","name":{"kind":"Name","value":"seoDescription"}},{"kind":"Field","name":{"kind":"Name","value":"seoKeywords"}},{"kind":"Field","name":{"kind":"Name","value":"specifications"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}},{"kind":"Field","name":{"kind":"Name","value":"images"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"ProductImageFields"}}]}},{"kind":"Field","name":{"kind":"Name","value":"brand"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"slug"}},{"kind":"Field","name":{"kind":"Name","value":"logoUrl"}}]}},{"kind":"Field","name":{"kind":"Name","value":"category"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"slug"}}]}},{"kind":"Field","name":{"kind":"Name","value":"taxId"}},{"kind":"Field","name":{"kind":"Name","value":"tax"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"rate"}}]}},{"kind":"Field","name":{"kind":"Name","value":"tags"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"slug"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"ProductImageFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"ProductImage"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"productId"}},{"kind":"Field","name":{"kind":"Name","value":"imageUrl"}},{"kind":"Field","name":{"kind":"Name","value":"altText"}},{"kind":"Field","name":{"kind":"Name","value":"displayOrder"}},{"kind":"Field","name":{"kind":"Name","value":"isPrimary"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}}]}}]} as unknown as DocumentNode<ProductFieldsFragment, unknown>;
export const CartFieldsFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"CartFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Cart"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"customerId"}},{"kind":"Field","name":{"kind":"Name","value":"itemCount"}},{"kind":"Field","name":{"kind":"Name","value":"subtotal"}},{"kind":"Field","name":{"kind":"Name","value":"needsReview"}},{"kind":"Field","name":{"kind":"Name","value":"items"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"productId"}},{"kind":"Field","name":{"kind":"Name","value":"variantId"}},{"kind":"Field","name":{"kind":"Name","value":"quantity"}},{"kind":"Field","name":{"kind":"Name","value":"unitPriceSnapshot"}},{"kind":"Field","name":{"kind":"Name","value":"unitPriceCurrent"}},{"kind":"Field","name":{"kind":"Name","value":"priceChanged"}},{"kind":"Field","name":{"kind":"Name","value":"lineTotal"}},{"kind":"Field","name":{"kind":"Name","value":"availableQuantity"}},{"kind":"Field","name":{"kind":"Name","value":"stockState"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"product"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"ProductFields"}}]}},{"kind":"Field","name":{"kind":"Name","value":"variant"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"sku"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"price"}},{"kind":"Field","name":{"kind":"Name","value":"priceWithTax"}},{"kind":"Field","name":{"kind":"Name","value":"imageUrl"}},{"kind":"Field","name":{"kind":"Name","value":"attributes"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"attributeId"}},{"kind":"Field","name":{"kind":"Name","value":"attributeValueId"}},{"kind":"Field","name":{"kind":"Name","value":"attributeName"}},{"kind":"Field","name":{"kind":"Name","value":"attributeSlug"}},{"kind":"Field","name":{"kind":"Name","value":"value"}},{"kind":"Field","name":{"kind":"Name","value":"valueSlug"}}]}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"ProductImageFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"ProductImage"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"productId"}},{"kind":"Field","name":{"kind":"Name","value":"imageUrl"}},{"kind":"Field","name":{"kind":"Name","value":"altText"}},{"kind":"Field","name":{"kind":"Name","value":"displayOrder"}},{"kind":"Field","name":{"kind":"Name","value":"isPrimary"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"ProductFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Product"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"storeId"}},{"kind":"Field","name":{"kind":"Name","value":"categoryId"}},{"kind":"Field","name":{"kind":"Name","value":"brandId"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"slug"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"shortDescription"}},{"kind":"Field","name":{"kind":"Name","value":"productType"}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"isFeatured"}},{"kind":"Field","name":{"kind":"Name","value":"isDigital"}},{"kind":"Field","name":{"kind":"Name","value":"price"}},{"kind":"Field","name":{"kind":"Name","value":"compareAtPrice"}},{"kind":"Field","name":{"kind":"Name","value":"costPrice"}},{"kind":"Field","name":{"kind":"Name","value":"priceWithTax"}},{"kind":"Field","name":{"kind":"Name","value":"sku"}},{"kind":"Field","name":{"kind":"Name","value":"weight"}},{"kind":"Field","name":{"kind":"Name","value":"length"}},{"kind":"Field","name":{"kind":"Name","value":"width"}},{"kind":"Field","name":{"kind":"Name","value":"height"}},{"kind":"Field","name":{"kind":"Name","value":"hsnCode"}},{"kind":"Field","name":{"kind":"Name","value":"seoTitle"}},{"kind":"Field","name":{"kind":"Name","value":"seoDescription"}},{"kind":"Field","name":{"kind":"Name","value":"seoKeywords"}},{"kind":"Field","name":{"kind":"Name","value":"specifications"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}},{"kind":"Field","name":{"kind":"Name","value":"images"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"ProductImageFields"}}]}},{"kind":"Field","name":{"kind":"Name","value":"brand"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"slug"}},{"kind":"Field","name":{"kind":"Name","value":"logoUrl"}}]}},{"kind":"Field","name":{"kind":"Name","value":"category"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"slug"}}]}},{"kind":"Field","name":{"kind":"Name","value":"taxId"}},{"kind":"Field","name":{"kind":"Name","value":"tax"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"rate"}}]}},{"kind":"Field","name":{"kind":"Name","value":"tags"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"slug"}}]}}]}}]} as unknown as DocumentNode<CartFieldsFragment, unknown>;
export const CategoryFieldsFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"CategoryFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Category"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"slug"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"parentId"}},{"kind":"Field","name":{"kind":"Name","value":"imageUrl"}},{"kind":"Field","name":{"kind":"Name","value":"iconUrl"}},{"kind":"Field","name":{"kind":"Name","value":"displayOrder"}},{"kind":"Field","name":{"kind":"Name","value":"isActive"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}}]}}]} as unknown as DocumentNode<CategoryFieldsFragment, unknown>;
export const CouponFieldsFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"CouponFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Coupon"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"storeId"}},{"kind":"Field","name":{"kind":"Name","value":"code"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"discountType"}},{"kind":"Field","name":{"kind":"Name","value":"discountValue"}},{"kind":"Field","name":{"kind":"Name","value":"minimumPurchaseAmount"}},{"kind":"Field","name":{"kind":"Name","value":"maximumDiscountAmount"}},{"kind":"Field","name":{"kind":"Name","value":"usageLimit"}},{"kind":"Field","name":{"kind":"Name","value":"usageLimitPerUser"}},{"kind":"Field","name":{"kind":"Name","value":"validFrom"}},{"kind":"Field","name":{"kind":"Name","value":"validUntil"}},{"kind":"Field","name":{"kind":"Name","value":"isActive"}},{"kind":"Field","name":{"kind":"Name","value":"redemptionCount"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}}]}}]} as unknown as DocumentNode<CouponFieldsFragment, unknown>;
export const AdminCustomerFieldsFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"AdminCustomerFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"AdminCustomer"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"userId"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"email"}},{"kind":"Field","name":{"kind":"Name","value":"phone"}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"emailVerifiedAt"}},{"kind":"Field","name":{"kind":"Name","value":"lastLoginAt"}},{"kind":"Field","name":{"kind":"Name","value":"userCreatedAt"}},{"kind":"Field","name":{"kind":"Name","value":"marketingOptIn"}},{"kind":"Field","name":{"kind":"Name","value":"preferredCurrency"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}},{"kind":"Field","name":{"kind":"Name","value":"deletedAt"}}]}}]} as unknown as DocumentNode<AdminCustomerFieldsFragment, unknown>;
export const ImageFieldsFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"ImageFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Image"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"provider"}},{"kind":"Field","name":{"kind":"Name","value":"externalId"}},{"kind":"Field","name":{"kind":"Name","value":"url"}},{"kind":"Field","name":{"kind":"Name","value":"format"}},{"kind":"Field","name":{"kind":"Name","value":"width"}},{"kind":"Field","name":{"kind":"Name","value":"height"}},{"kind":"Field","name":{"kind":"Name","value":"sizeBytes"}},{"kind":"Field","name":{"kind":"Name","value":"ownerType"}},{"kind":"Field","name":{"kind":"Name","value":"ownerId"}},{"kind":"Field","name":{"kind":"Name","value":"purpose"}},{"kind":"Field","name":{"kind":"Name","value":"alt"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}}]}}]} as unknown as DocumentNode<ImageFieldsFragment, unknown>;
export const InventoryFieldsFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"InventoryFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Inventory"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"variantId"}},{"kind":"Field","name":{"kind":"Name","value":"warehouseId"}},{"kind":"Field","name":{"kind":"Name","value":"quantityAvailable"}},{"kind":"Field","name":{"kind":"Name","value":"quantityReserved"}},{"kind":"Field","name":{"kind":"Name","value":"quantityOnHand"}},{"kind":"Field","name":{"kind":"Name","value":"reorderPoint"}},{"kind":"Field","name":{"kind":"Name","value":"reorderQuantity"}},{"kind":"Field","name":{"kind":"Name","value":"lastCountedAt"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}},{"kind":"Field","name":{"kind":"Name","value":"stockState"}},{"kind":"Field","name":{"kind":"Name","value":"warehouse"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"code"}},{"kind":"Field","name":{"kind":"Name","value":"isDefault"}},{"kind":"Field","name":{"kind":"Name","value":"storeId"}}]}},{"kind":"Field","name":{"kind":"Name","value":"variant"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"productId"}},{"kind":"Field","name":{"kind":"Name","value":"sku"}},{"kind":"Field","name":{"kind":"Name","value":"imageUrl"}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"attributes"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"attributeId"}},{"kind":"Field","name":{"kind":"Name","value":"attributeValueId"}},{"kind":"Field","name":{"kind":"Name","value":"attributeName"}},{"kind":"Field","name":{"kind":"Name","value":"attributeSlug"}},{"kind":"Field","name":{"kind":"Name","value":"value"}},{"kind":"Field","name":{"kind":"Name","value":"valueSlug"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"product"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"slug"}},{"kind":"Field","name":{"kind":"Name","value":"storeId"}}]}}]}}]} as unknown as DocumentNode<InventoryFieldsFragment, unknown>;
export const InventoryMovementFieldsFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"InventoryMovementFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"InventoryMovement"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"inventoryId"}},{"kind":"Field","name":{"kind":"Name","value":"variantId"}},{"kind":"Field","name":{"kind":"Name","value":"warehouseId"}},{"kind":"Field","name":{"kind":"Name","value":"movementType"}},{"kind":"Field","name":{"kind":"Name","value":"quantityChange"}},{"kind":"Field","name":{"kind":"Name","value":"quantityBefore"}},{"kind":"Field","name":{"kind":"Name","value":"quantityAfter"}},{"kind":"Field","name":{"kind":"Name","value":"referenceType"}},{"kind":"Field","name":{"kind":"Name","value":"referenceId"}},{"kind":"Field","name":{"kind":"Name","value":"notes"}},{"kind":"Field","name":{"kind":"Name","value":"createdById"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}}]}}]} as unknown as DocumentNode<InventoryMovementFieldsFragment, unknown>;
export const MenuFieldsFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"MenuFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Menu"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"location"}},{"kind":"Field","name":{"kind":"Name","value":"isActive"}},{"kind":"Field","name":{"kind":"Name","value":"items"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}}]}}]} as unknown as DocumentNode<MenuFieldsFragment, unknown>;
export const NewsletterFieldsFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"NewsletterFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"NewsletterSubscription"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"email"}},{"kind":"Field","name":{"kind":"Name","value":"source"}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"unsubscribedAt"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}}]}}]} as unknown as DocumentNode<NewsletterFieldsFragment, unknown>;
export const OrderItemFieldsFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"OrderItemFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"OrderItem"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"orderId"}},{"kind":"Field","name":{"kind":"Name","value":"sellerOrderId"}},{"kind":"Field","name":{"kind":"Name","value":"productId"}},{"kind":"Field","name":{"kind":"Name","value":"variantId"}},{"kind":"Field","name":{"kind":"Name","value":"storeId"}},{"kind":"Field","name":{"kind":"Name","value":"sku"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"variantName"}},{"kind":"Field","name":{"kind":"Name","value":"quantity"}},{"kind":"Field","name":{"kind":"Name","value":"unitPrice"}},{"kind":"Field","name":{"kind":"Name","value":"totalPrice"}},{"kind":"Field","name":{"kind":"Name","value":"taxAmount"}},{"kind":"Field","name":{"kind":"Name","value":"discountAmount"}},{"kind":"Field","name":{"kind":"Name","value":"attributesSnapshot"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"attributeName"}},{"kind":"Field","name":{"kind":"Name","value":"value"}}]}},{"kind":"Field","name":{"kind":"Name","value":"imageUrlSnapshot"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}}]}}]} as unknown as DocumentNode<OrderItemFieldsFragment, unknown>;
export const StatusHistoryFieldsFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"StatusHistoryFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"OrderStatusHistoryEntry"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"fromStatus"}},{"kind":"Field","name":{"kind":"Name","value":"toStatus"}},{"kind":"Field","name":{"kind":"Name","value":"changedById"}},{"kind":"Field","name":{"kind":"Name","value":"notes"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}}]}}]} as unknown as DocumentNode<StatusHistoryFieldsFragment, unknown>;
export const OrderAddressFieldsFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"OrderAddressFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"OrderAddressSnapshot"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"firstName"}},{"kind":"Field","name":{"kind":"Name","value":"lastName"}},{"kind":"Field","name":{"kind":"Name","value":"phone"}},{"kind":"Field","name":{"kind":"Name","value":"addressLine1"}},{"kind":"Field","name":{"kind":"Name","value":"addressLine2"}},{"kind":"Field","name":{"kind":"Name","value":"city"}},{"kind":"Field","name":{"kind":"Name","value":"state"}},{"kind":"Field","name":{"kind":"Name","value":"postalCode"}},{"kind":"Field","name":{"kind":"Name","value":"countryCode"}}]}}]} as unknown as DocumentNode<OrderAddressFieldsFragment, unknown>;
export const SellerOrderFieldsFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"SellerOrderFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"SellerOrder"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"orderId"}},{"kind":"Field","name":{"kind":"Name","value":"sellerId"}},{"kind":"Field","name":{"kind":"Name","value":"storeId"}},{"kind":"Field","name":{"kind":"Name","value":"orderNumber"}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"paymentStatus"}},{"kind":"Field","name":{"kind":"Name","value":"payoutStatus"}},{"kind":"Field","name":{"kind":"Name","value":"subtotal"}},{"kind":"Field","name":{"kind":"Name","value":"taxAmount"}},{"kind":"Field","name":{"kind":"Name","value":"shippingAmount"}},{"kind":"Field","name":{"kind":"Name","value":"discountAmount"}},{"kind":"Field","name":{"kind":"Name","value":"commissionAmount"}},{"kind":"Field","name":{"kind":"Name","value":"payoutAmount"}},{"kind":"Field","name":{"kind":"Name","value":"currencyCode"}},{"kind":"Field","name":{"kind":"Name","value":"packedAt"}},{"kind":"Field","name":{"kind":"Name","value":"shippedAt"}},{"kind":"Field","name":{"kind":"Name","value":"deliveredAt"}},{"kind":"Field","name":{"kind":"Name","value":"cancelledAt"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}},{"kind":"Field","name":{"kind":"Name","value":"itemCount"}},{"kind":"Field","name":{"kind":"Name","value":"storeName"}},{"kind":"Field","name":{"kind":"Name","value":"items"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"OrderItemFields"}}]}},{"kind":"Field","name":{"kind":"Name","value":"statusHistory"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"StatusHistoryFields"}}]}},{"kind":"Field","name":{"kind":"Name","value":"parentOrderNumber"}},{"kind":"Field","name":{"kind":"Name","value":"shippingAddress"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"OrderAddressFields"}}]}},{"kind":"Field","name":{"kind":"Name","value":"customerName"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"OrderItemFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"OrderItem"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"orderId"}},{"kind":"Field","name":{"kind":"Name","value":"sellerOrderId"}},{"kind":"Field","name":{"kind":"Name","value":"productId"}},{"kind":"Field","name":{"kind":"Name","value":"variantId"}},{"kind":"Field","name":{"kind":"Name","value":"storeId"}},{"kind":"Field","name":{"kind":"Name","value":"sku"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"variantName"}},{"kind":"Field","name":{"kind":"Name","value":"quantity"}},{"kind":"Field","name":{"kind":"Name","value":"unitPrice"}},{"kind":"Field","name":{"kind":"Name","value":"totalPrice"}},{"kind":"Field","name":{"kind":"Name","value":"taxAmount"}},{"kind":"Field","name":{"kind":"Name","value":"discountAmount"}},{"kind":"Field","name":{"kind":"Name","value":"attributesSnapshot"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"attributeName"}},{"kind":"Field","name":{"kind":"Name","value":"value"}}]}},{"kind":"Field","name":{"kind":"Name","value":"imageUrlSnapshot"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"StatusHistoryFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"OrderStatusHistoryEntry"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"fromStatus"}},{"kind":"Field","name":{"kind":"Name","value":"toStatus"}},{"kind":"Field","name":{"kind":"Name","value":"changedById"}},{"kind":"Field","name":{"kind":"Name","value":"notes"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"OrderAddressFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"OrderAddressSnapshot"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"firstName"}},{"kind":"Field","name":{"kind":"Name","value":"lastName"}},{"kind":"Field","name":{"kind":"Name","value":"phone"}},{"kind":"Field","name":{"kind":"Name","value":"addressLine1"}},{"kind":"Field","name":{"kind":"Name","value":"addressLine2"}},{"kind":"Field","name":{"kind":"Name","value":"city"}},{"kind":"Field","name":{"kind":"Name","value":"state"}},{"kind":"Field","name":{"kind":"Name","value":"postalCode"}},{"kind":"Field","name":{"kind":"Name","value":"countryCode"}}]}}]} as unknown as DocumentNode<SellerOrderFieldsFragment, unknown>;
export const OrderFieldsFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"OrderFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Order"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"orderNumber"}},{"kind":"Field","name":{"kind":"Name","value":"customerId"}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"paymentStatus"}},{"kind":"Field","name":{"kind":"Name","value":"paymentMethod"}},{"kind":"Field","name":{"kind":"Name","value":"subtotal"}},{"kind":"Field","name":{"kind":"Name","value":"taxAmount"}},{"kind":"Field","name":{"kind":"Name","value":"shippingAmount"}},{"kind":"Field","name":{"kind":"Name","value":"discountAmount"}},{"kind":"Field","name":{"kind":"Name","value":"totalAmount"}},{"kind":"Field","name":{"kind":"Name","value":"currencyCode"}},{"kind":"Field","name":{"kind":"Name","value":"customerNotes"}},{"kind":"Field","name":{"kind":"Name","value":"placedAt"}},{"kind":"Field","name":{"kind":"Name","value":"cancelledAt"}},{"kind":"Field","name":{"kind":"Name","value":"deliveredAt"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}},{"kind":"Field","name":{"kind":"Name","value":"itemCount"}},{"kind":"Field","name":{"kind":"Name","value":"items"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"OrderItemFields"}}]}},{"kind":"Field","name":{"kind":"Name","value":"sellerOrders"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"SellerOrderFields"}}]}},{"kind":"Field","name":{"kind":"Name","value":"statusHistory"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"StatusHistoryFields"}}]}},{"kind":"Field","name":{"kind":"Name","value":"shippingAddress"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"OrderAddressFields"}}]}},{"kind":"Field","name":{"kind":"Name","value":"billingAddress"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"OrderAddressFields"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"OrderItemFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"OrderItem"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"orderId"}},{"kind":"Field","name":{"kind":"Name","value":"sellerOrderId"}},{"kind":"Field","name":{"kind":"Name","value":"productId"}},{"kind":"Field","name":{"kind":"Name","value":"variantId"}},{"kind":"Field","name":{"kind":"Name","value":"storeId"}},{"kind":"Field","name":{"kind":"Name","value":"sku"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"variantName"}},{"kind":"Field","name":{"kind":"Name","value":"quantity"}},{"kind":"Field","name":{"kind":"Name","value":"unitPrice"}},{"kind":"Field","name":{"kind":"Name","value":"totalPrice"}},{"kind":"Field","name":{"kind":"Name","value":"taxAmount"}},{"kind":"Field","name":{"kind":"Name","value":"discountAmount"}},{"kind":"Field","name":{"kind":"Name","value":"attributesSnapshot"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"attributeName"}},{"kind":"Field","name":{"kind":"Name","value":"value"}}]}},{"kind":"Field","name":{"kind":"Name","value":"imageUrlSnapshot"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"StatusHistoryFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"OrderStatusHistoryEntry"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"fromStatus"}},{"kind":"Field","name":{"kind":"Name","value":"toStatus"}},{"kind":"Field","name":{"kind":"Name","value":"changedById"}},{"kind":"Field","name":{"kind":"Name","value":"notes"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"OrderAddressFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"OrderAddressSnapshot"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"firstName"}},{"kind":"Field","name":{"kind":"Name","value":"lastName"}},{"kind":"Field","name":{"kind":"Name","value":"phone"}},{"kind":"Field","name":{"kind":"Name","value":"addressLine1"}},{"kind":"Field","name":{"kind":"Name","value":"addressLine2"}},{"kind":"Field","name":{"kind":"Name","value":"city"}},{"kind":"Field","name":{"kind":"Name","value":"state"}},{"kind":"Field","name":{"kind":"Name","value":"postalCode"}},{"kind":"Field","name":{"kind":"Name","value":"countryCode"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"SellerOrderFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"SellerOrder"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"orderId"}},{"kind":"Field","name":{"kind":"Name","value":"sellerId"}},{"kind":"Field","name":{"kind":"Name","value":"storeId"}},{"kind":"Field","name":{"kind":"Name","value":"orderNumber"}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"paymentStatus"}},{"kind":"Field","name":{"kind":"Name","value":"payoutStatus"}},{"kind":"Field","name":{"kind":"Name","value":"subtotal"}},{"kind":"Field","name":{"kind":"Name","value":"taxAmount"}},{"kind":"Field","name":{"kind":"Name","value":"shippingAmount"}},{"kind":"Field","name":{"kind":"Name","value":"discountAmount"}},{"kind":"Field","name":{"kind":"Name","value":"commissionAmount"}},{"kind":"Field","name":{"kind":"Name","value":"payoutAmount"}},{"kind":"Field","name":{"kind":"Name","value":"currencyCode"}},{"kind":"Field","name":{"kind":"Name","value":"packedAt"}},{"kind":"Field","name":{"kind":"Name","value":"shippedAt"}},{"kind":"Field","name":{"kind":"Name","value":"deliveredAt"}},{"kind":"Field","name":{"kind":"Name","value":"cancelledAt"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}},{"kind":"Field","name":{"kind":"Name","value":"itemCount"}},{"kind":"Field","name":{"kind":"Name","value":"storeName"}},{"kind":"Field","name":{"kind":"Name","value":"items"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"OrderItemFields"}}]}},{"kind":"Field","name":{"kind":"Name","value":"statusHistory"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"StatusHistoryFields"}}]}},{"kind":"Field","name":{"kind":"Name","value":"parentOrderNumber"}},{"kind":"Field","name":{"kind":"Name","value":"shippingAddress"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"OrderAddressFields"}}]}},{"kind":"Field","name":{"kind":"Name","value":"customerName"}}]}}]} as unknown as DocumentNode<OrderFieldsFragment, unknown>;
export const PageFieldsFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"PageFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Page"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"slug"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"metaTitle"}},{"kind":"Field","name":{"kind":"Name","value":"metaDesc"}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"blocks"}},{"kind":"Field","name":{"kind":"Name","value":"isSystem"}},{"kind":"Field","name":{"kind":"Name","value":"publishedAt"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}}]}}]} as unknown as DocumentNode<PageFieldsFragment, unknown>;
export const ProductSummaryFieldsFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"ProductSummaryFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Product"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"slug"}},{"kind":"Field","name":{"kind":"Name","value":"productType"}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"isFeatured"}},{"kind":"Field","name":{"kind":"Name","value":"price"}},{"kind":"Field","name":{"kind":"Name","value":"compareAtPrice"}},{"kind":"Field","name":{"kind":"Name","value":"priceWithTax"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"images"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"ProductImageFields"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"ProductImageFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"ProductImage"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"productId"}},{"kind":"Field","name":{"kind":"Name","value":"imageUrl"}},{"kind":"Field","name":{"kind":"Name","value":"altText"}},{"kind":"Field","name":{"kind":"Name","value":"displayOrder"}},{"kind":"Field","name":{"kind":"Name","value":"isPrimary"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}}]}}]} as unknown as DocumentNode<ProductSummaryFieldsFragment, unknown>;
export const VariantFieldsFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"VariantFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"ProductVariant"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"productId"}},{"kind":"Field","name":{"kind":"Name","value":"sku"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"price"}},{"kind":"Field","name":{"kind":"Name","value":"compareAtPrice"}},{"kind":"Field","name":{"kind":"Name","value":"costPrice"}},{"kind":"Field","name":{"kind":"Name","value":"weight"}},{"kind":"Field","name":{"kind":"Name","value":"length"}},{"kind":"Field","name":{"kind":"Name","value":"width"}},{"kind":"Field","name":{"kind":"Name","value":"height"}},{"kind":"Field","name":{"kind":"Name","value":"imageUrl"}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}},{"kind":"Field","name":{"kind":"Name","value":"attributes"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"attributeId"}},{"kind":"Field","name":{"kind":"Name","value":"attributeValueId"}},{"kind":"Field","name":{"kind":"Name","value":"attributeName"}},{"kind":"Field","name":{"kind":"Name","value":"attributeSlug"}},{"kind":"Field","name":{"kind":"Name","value":"value"}},{"kind":"Field","name":{"kind":"Name","value":"valueSlug"}}]}}]}}]} as unknown as DocumentNode<VariantFieldsFragment, unknown>;
export const VariantAxisFieldsFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"VariantAxisFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"VariantAxis"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"attributeId"}},{"kind":"Field","name":{"kind":"Name","value":"attributeName"}},{"kind":"Field","name":{"kind":"Name","value":"attributeSlug"}},{"kind":"Field","name":{"kind":"Name","value":"values"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"attributeId"}},{"kind":"Field","name":{"kind":"Name","value":"value"}},{"kind":"Field","name":{"kind":"Name","value":"slug"}},{"kind":"Field","name":{"kind":"Name","value":"displayOrder"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}}]}}]}}]} as unknown as DocumentNode<VariantAxisFieldsFragment, unknown>;
export const PayoutAccountFieldsFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"PayoutAccountFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"SellerPayoutAccount"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"sellerId"}},{"kind":"Field","name":{"kind":"Name","value":"accountType"}},{"kind":"Field","name":{"kind":"Name","value":"accountHolderName"}},{"kind":"Field","name":{"kind":"Name","value":"accountNumber"}},{"kind":"Field","name":{"kind":"Name","value":"ifscCode"}},{"kind":"Field","name":{"kind":"Name","value":"bankName"}},{"kind":"Field","name":{"kind":"Name","value":"upiId"}},{"kind":"Field","name":{"kind":"Name","value":"walletProvider"}},{"kind":"Field","name":{"kind":"Name","value":"isPrimary"}},{"kind":"Field","name":{"kind":"Name","value":"isVerified"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}}]}}]} as unknown as DocumentNode<PayoutAccountFieldsFragment, unknown>;
export const SellerFieldsFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"SellerFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Seller"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"userId"}},{"kind":"Field","name":{"kind":"Name","value":"legalName"}},{"kind":"Field","name":{"kind":"Name","value":"displayName"}},{"kind":"Field","name":{"kind":"Name","value":"businessType"}},{"kind":"Field","name":{"kind":"Name","value":"dateOfIncorporation"}},{"kind":"Field","name":{"kind":"Name","value":"registrationNumber"}},{"kind":"Field","name":{"kind":"Name","value":"panNumber"}},{"kind":"Field","name":{"kind":"Name","value":"gstin"}},{"kind":"Field","name":{"kind":"Name","value":"businessEmail"}},{"kind":"Field","name":{"kind":"Name","value":"businessPhone"}},{"kind":"Field","name":{"kind":"Name","value":"supportEmail"}},{"kind":"Field","name":{"kind":"Name","value":"signatoryName"}},{"kind":"Field","name":{"kind":"Name","value":"signatoryPan"}},{"kind":"Field","name":{"kind":"Name","value":"signatoryDesignation"}},{"kind":"Field","name":{"kind":"Name","value":"overallStatus"}},{"kind":"Field","name":{"kind":"Name","value":"panVerifiedAt"}},{"kind":"Field","name":{"kind":"Name","value":"gstinVerifiedAt"}},{"kind":"Field","name":{"kind":"Name","value":"bankVerifiedAt"}},{"kind":"Field","name":{"kind":"Name","value":"documentsVerifiedAt"}},{"kind":"Field","name":{"kind":"Name","value":"rejectionReason"}},{"kind":"Field","name":{"kind":"Name","value":"commissionRate"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}},{"kind":"Field","name":{"kind":"Name","value":"payoutAccounts"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"PayoutAccountFields"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"PayoutAccountFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"SellerPayoutAccount"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"sellerId"}},{"kind":"Field","name":{"kind":"Name","value":"accountType"}},{"kind":"Field","name":{"kind":"Name","value":"accountHolderName"}},{"kind":"Field","name":{"kind":"Name","value":"accountNumber"}},{"kind":"Field","name":{"kind":"Name","value":"ifscCode"}},{"kind":"Field","name":{"kind":"Name","value":"bankName"}},{"kind":"Field","name":{"kind":"Name","value":"upiId"}},{"kind":"Field","name":{"kind":"Name","value":"walletProvider"}},{"kind":"Field","name":{"kind":"Name","value":"isPrimary"}},{"kind":"Field","name":{"kind":"Name","value":"isVerified"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}}]}}]} as unknown as DocumentNode<SellerFieldsFragment, unknown>;
export const SlideItemFieldsFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"SlideItemFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"SlideItem"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"sliderId"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"link"}},{"kind":"Field","name":{"kind":"Name","value":"ctaLabel"}},{"kind":"Field","name":{"kind":"Name","value":"imageUrl"}},{"kind":"Field","name":{"kind":"Name","value":"tabletImageUrl"}},{"kind":"Field","name":{"kind":"Name","value":"mobileImageUrl"}},{"kind":"Field","name":{"kind":"Name","value":"order"}},{"kind":"Field","name":{"kind":"Name","value":"isEnabled"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}}]}}]} as unknown as DocumentNode<SlideItemFieldsFragment, unknown>;
export const SliderFieldsFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"SliderFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Slider"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"key"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"config"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}},{"kind":"Field","name":{"kind":"Name","value":"items"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"SlideItemFields"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"SlideItemFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"SlideItem"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"sliderId"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"link"}},{"kind":"Field","name":{"kind":"Name","value":"ctaLabel"}},{"kind":"Field","name":{"kind":"Name","value":"imageUrl"}},{"kind":"Field","name":{"kind":"Name","value":"tabletImageUrl"}},{"kind":"Field","name":{"kind":"Name","value":"mobileImageUrl"}},{"kind":"Field","name":{"kind":"Name","value":"order"}},{"kind":"Field","name":{"kind":"Name","value":"isEnabled"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}}]}}]} as unknown as DocumentNode<SliderFieldsFragment, unknown>;
export const WarehouseFieldsFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"WarehouseFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Warehouse"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"storeId"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"code"}},{"kind":"Field","name":{"kind":"Name","value":"addressLine1"}},{"kind":"Field","name":{"kind":"Name","value":"addressLine2"}},{"kind":"Field","name":{"kind":"Name","value":"city"}},{"kind":"Field","name":{"kind":"Name","value":"state"}},{"kind":"Field","name":{"kind":"Name","value":"postalCode"}},{"kind":"Field","name":{"kind":"Name","value":"countryCode"}},{"kind":"Field","name":{"kind":"Name","value":"phone"}},{"kind":"Field","name":{"kind":"Name","value":"isDefault"}},{"kind":"Field","name":{"kind":"Name","value":"isActive"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}}]}}]} as unknown as DocumentNode<WarehouseFieldsFragment, unknown>;
export const StoreFieldsFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"StoreFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Store"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"sellerId"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"slug"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"logoUrl"}},{"kind":"Field","name":{"kind":"Name","value":"bannerUrl"}},{"kind":"Field","name":{"kind":"Name","value":"currencyCode"}},{"kind":"Field","name":{"kind":"Name","value":"timezone"}},{"kind":"Field","name":{"kind":"Name","value":"locale"}},{"kind":"Field","name":{"kind":"Name","value":"supportEmail"}},{"kind":"Field","name":{"kind":"Name","value":"supportPhone"}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"isFeatured"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}},{"kind":"Field","name":{"kind":"Name","value":"warehouses"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"WarehouseFields"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"WarehouseFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Warehouse"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"storeId"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"code"}},{"kind":"Field","name":{"kind":"Name","value":"addressLine1"}},{"kind":"Field","name":{"kind":"Name","value":"addressLine2"}},{"kind":"Field","name":{"kind":"Name","value":"city"}},{"kind":"Field","name":{"kind":"Name","value":"state"}},{"kind":"Field","name":{"kind":"Name","value":"postalCode"}},{"kind":"Field","name":{"kind":"Name","value":"countryCode"}},{"kind":"Field","name":{"kind":"Name","value":"phone"}},{"kind":"Field","name":{"kind":"Name","value":"isDefault"}},{"kind":"Field","name":{"kind":"Name","value":"isActive"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}}]}}]} as unknown as DocumentNode<StoreFieldsFragment, unknown>;
export const TagFieldsFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"TagFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Tag"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"slug"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"isFeatured"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}}]}}]} as unknown as DocumentNode<TagFieldsFragment, unknown>;
export const TaxFieldsFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"TaxFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Tax"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"rate"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"isActive"}},{"kind":"Field","name":{"kind":"Name","value":"displayOrder"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}}]}}]} as unknown as DocumentNode<TaxFieldsFragment, unknown>;
export const WishlistFieldsFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"WishlistFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Wishlist"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"customerId"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"isDefault"}},{"kind":"Field","name":{"kind":"Name","value":"isPublic"}},{"kind":"Field","name":{"kind":"Name","value":"itemCount"}},{"kind":"Field","name":{"kind":"Name","value":"items"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"productId"}},{"kind":"Field","name":{"kind":"Name","value":"variantId"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"product"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"ProductFields"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"ProductImageFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"ProductImage"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"productId"}},{"kind":"Field","name":{"kind":"Name","value":"imageUrl"}},{"kind":"Field","name":{"kind":"Name","value":"altText"}},{"kind":"Field","name":{"kind":"Name","value":"displayOrder"}},{"kind":"Field","name":{"kind":"Name","value":"isPrimary"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"ProductFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Product"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"storeId"}},{"kind":"Field","name":{"kind":"Name","value":"categoryId"}},{"kind":"Field","name":{"kind":"Name","value":"brandId"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"slug"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"shortDescription"}},{"kind":"Field","name":{"kind":"Name","value":"productType"}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"isFeatured"}},{"kind":"Field","name":{"kind":"Name","value":"isDigital"}},{"kind":"Field","name":{"kind":"Name","value":"price"}},{"kind":"Field","name":{"kind":"Name","value":"compareAtPrice"}},{"kind":"Field","name":{"kind":"Name","value":"costPrice"}},{"kind":"Field","name":{"kind":"Name","value":"priceWithTax"}},{"kind":"Field","name":{"kind":"Name","value":"sku"}},{"kind":"Field","name":{"kind":"Name","value":"weight"}},{"kind":"Field","name":{"kind":"Name","value":"length"}},{"kind":"Field","name":{"kind":"Name","value":"width"}},{"kind":"Field","name":{"kind":"Name","value":"height"}},{"kind":"Field","name":{"kind":"Name","value":"hsnCode"}},{"kind":"Field","name":{"kind":"Name","value":"seoTitle"}},{"kind":"Field","name":{"kind":"Name","value":"seoDescription"}},{"kind":"Field","name":{"kind":"Name","value":"seoKeywords"}},{"kind":"Field","name":{"kind":"Name","value":"specifications"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}},{"kind":"Field","name":{"kind":"Name","value":"images"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"ProductImageFields"}}]}},{"kind":"Field","name":{"kind":"Name","value":"brand"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"slug"}},{"kind":"Field","name":{"kind":"Name","value":"logoUrl"}}]}},{"kind":"Field","name":{"kind":"Name","value":"category"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"slug"}}]}},{"kind":"Field","name":{"kind":"Name","value":"taxId"}},{"kind":"Field","name":{"kind":"Name","value":"tax"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"rate"}}]}},{"kind":"Field","name":{"kind":"Name","value":"tags"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"slug"}}]}}]}}]} as unknown as DocumentNode<WishlistFieldsFragment, unknown>;
export const GetMyProfileDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetMyProfile"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"myProfile"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"AdminCustomerFields"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"AdminCustomerFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"AdminCustomer"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"userId"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"email"}},{"kind":"Field","name":{"kind":"Name","value":"phone"}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"emailVerifiedAt"}},{"kind":"Field","name":{"kind":"Name","value":"lastLoginAt"}},{"kind":"Field","name":{"kind":"Name","value":"userCreatedAt"}},{"kind":"Field","name":{"kind":"Name","value":"marketingOptIn"}},{"kind":"Field","name":{"kind":"Name","value":"preferredCurrency"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}},{"kind":"Field","name":{"kind":"Name","value":"deletedAt"}}]}}]} as unknown as DocumentNode<GetMyProfileQuery, GetMyProfileQueryVariables>;
export const UpdateMyProfileDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"UpdateMyProfile"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"UpdateMyProfileInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"updateMyProfile"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"AdminCustomerFields"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"AdminCustomerFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"AdminCustomer"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"userId"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"email"}},{"kind":"Field","name":{"kind":"Name","value":"phone"}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"emailVerifiedAt"}},{"kind":"Field","name":{"kind":"Name","value":"lastLoginAt"}},{"kind":"Field","name":{"kind":"Name","value":"userCreatedAt"}},{"kind":"Field","name":{"kind":"Name","value":"marketingOptIn"}},{"kind":"Field","name":{"kind":"Name","value":"preferredCurrency"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}},{"kind":"Field","name":{"kind":"Name","value":"deletedAt"}}]}}]} as unknown as DocumentNode<UpdateMyProfileMutation, UpdateMyProfileMutationVariables>;
export const GetMyAddressesDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetMyAddresses"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"myAddresses"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"AddressFields"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"AddressFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Address"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"userId"}},{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"label"}},{"kind":"Field","name":{"kind":"Name","value":"firstName"}},{"kind":"Field","name":{"kind":"Name","value":"lastName"}},{"kind":"Field","name":{"kind":"Name","value":"phone"}},{"kind":"Field","name":{"kind":"Name","value":"addressLine1"}},{"kind":"Field","name":{"kind":"Name","value":"addressLine2"}},{"kind":"Field","name":{"kind":"Name","value":"city"}},{"kind":"Field","name":{"kind":"Name","value":"state"}},{"kind":"Field","name":{"kind":"Name","value":"postalCode"}},{"kind":"Field","name":{"kind":"Name","value":"countryCode"}},{"kind":"Field","name":{"kind":"Name","value":"isDefault"}}]}}]} as unknown as DocumentNode<GetMyAddressesQuery, GetMyAddressesQueryVariables>;
export const AddMyAddressDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"AddMyAddress"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"CreateAddressInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"addMyAddress"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"AddressFields"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"AddressFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Address"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"userId"}},{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"label"}},{"kind":"Field","name":{"kind":"Name","value":"firstName"}},{"kind":"Field","name":{"kind":"Name","value":"lastName"}},{"kind":"Field","name":{"kind":"Name","value":"phone"}},{"kind":"Field","name":{"kind":"Name","value":"addressLine1"}},{"kind":"Field","name":{"kind":"Name","value":"addressLine2"}},{"kind":"Field","name":{"kind":"Name","value":"city"}},{"kind":"Field","name":{"kind":"Name","value":"state"}},{"kind":"Field","name":{"kind":"Name","value":"postalCode"}},{"kind":"Field","name":{"kind":"Name","value":"countryCode"}},{"kind":"Field","name":{"kind":"Name","value":"isDefault"}}]}}]} as unknown as DocumentNode<AddMyAddressMutation, AddMyAddressMutationVariables>;
export const UpdateMyAddressDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"UpdateMyAddress"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"UpdateAddressInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"updateMyAddress"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"AddressFields"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"AddressFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Address"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"userId"}},{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"label"}},{"kind":"Field","name":{"kind":"Name","value":"firstName"}},{"kind":"Field","name":{"kind":"Name","value":"lastName"}},{"kind":"Field","name":{"kind":"Name","value":"phone"}},{"kind":"Field","name":{"kind":"Name","value":"addressLine1"}},{"kind":"Field","name":{"kind":"Name","value":"addressLine2"}},{"kind":"Field","name":{"kind":"Name","value":"city"}},{"kind":"Field","name":{"kind":"Name","value":"state"}},{"kind":"Field","name":{"kind":"Name","value":"postalCode"}},{"kind":"Field","name":{"kind":"Name","value":"countryCode"}},{"kind":"Field","name":{"kind":"Name","value":"isDefault"}}]}}]} as unknown as DocumentNode<UpdateMyAddressMutation, UpdateMyAddressMutationVariables>;
export const SetMyDefaultAddressDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"SetMyDefaultAddress"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"setMyDefaultAddress"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"AddressFields"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"AddressFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Address"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"userId"}},{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"label"}},{"kind":"Field","name":{"kind":"Name","value":"firstName"}},{"kind":"Field","name":{"kind":"Name","value":"lastName"}},{"kind":"Field","name":{"kind":"Name","value":"phone"}},{"kind":"Field","name":{"kind":"Name","value":"addressLine1"}},{"kind":"Field","name":{"kind":"Name","value":"addressLine2"}},{"kind":"Field","name":{"kind":"Name","value":"city"}},{"kind":"Field","name":{"kind":"Name","value":"state"}},{"kind":"Field","name":{"kind":"Name","value":"postalCode"}},{"kind":"Field","name":{"kind":"Name","value":"countryCode"}},{"kind":"Field","name":{"kind":"Name","value":"isDefault"}}]}}]} as unknown as DocumentNode<SetMyDefaultAddressMutation, SetMyDefaultAddressMutationVariables>;
export const RemoveMyAddressDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"RemoveMyAddress"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"removeMyAddress"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"AddressFields"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"AddressFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Address"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"userId"}},{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"label"}},{"kind":"Field","name":{"kind":"Name","value":"firstName"}},{"kind":"Field","name":{"kind":"Name","value":"lastName"}},{"kind":"Field","name":{"kind":"Name","value":"phone"}},{"kind":"Field","name":{"kind":"Name","value":"addressLine1"}},{"kind":"Field","name":{"kind":"Name","value":"addressLine2"}},{"kind":"Field","name":{"kind":"Name","value":"city"}},{"kind":"Field","name":{"kind":"Name","value":"state"}},{"kind":"Field","name":{"kind":"Name","value":"postalCode"}},{"kind":"Field","name":{"kind":"Name","value":"countryCode"}},{"kind":"Field","name":{"kind":"Name","value":"isDefault"}}]}}]} as unknown as DocumentNode<RemoveMyAddressMutation, RemoveMyAddressMutationVariables>;
export const GetAdminThemeDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetAdminTheme"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"adminTheme"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"AdminThemeFields"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"AdminThemeFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"AdminTheme"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"primaryLight"}},{"kind":"Field","name":{"kind":"Name","value":"primaryDark"}},{"kind":"Field","name":{"kind":"Name","value":"accentLight"}},{"kind":"Field","name":{"kind":"Name","value":"accentDark"}},{"kind":"Field","name":{"kind":"Name","value":"sidebarLight"}},{"kind":"Field","name":{"kind":"Name","value":"sidebarDark"}},{"kind":"Field","name":{"kind":"Name","value":"destructiveLight"}},{"kind":"Field","name":{"kind":"Name","value":"destructiveDark"}},{"kind":"Field","name":{"kind":"Name","value":"radius"}},{"kind":"Field","name":{"kind":"Name","value":"fontFamily"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedById"}}]}}]} as unknown as DocumentNode<GetAdminThemeQuery, GetAdminThemeQueryVariables>;
export const UpdateAdminThemeDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"UpdateAdminTheme"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"updateAdminThemeInput"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"UpdateAdminThemeInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"updateAdminTheme"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"updateAdminThemeInput"},"value":{"kind":"Variable","name":{"kind":"Name","value":"updateAdminThemeInput"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"AdminThemeFields"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"AdminThemeFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"AdminTheme"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"primaryLight"}},{"kind":"Field","name":{"kind":"Name","value":"primaryDark"}},{"kind":"Field","name":{"kind":"Name","value":"accentLight"}},{"kind":"Field","name":{"kind":"Name","value":"accentDark"}},{"kind":"Field","name":{"kind":"Name","value":"sidebarLight"}},{"kind":"Field","name":{"kind":"Name","value":"sidebarDark"}},{"kind":"Field","name":{"kind":"Name","value":"destructiveLight"}},{"kind":"Field","name":{"kind":"Name","value":"destructiveDark"}},{"kind":"Field","name":{"kind":"Name","value":"radius"}},{"kind":"Field","name":{"kind":"Name","value":"fontFamily"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedById"}}]}}]} as unknown as DocumentNode<UpdateAdminThemeMutation, UpdateAdminThemeMutationVariables>;
export const ResetAdminThemeDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"ResetAdminTheme"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"resetAdminTheme"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"AdminThemeFields"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"AdminThemeFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"AdminTheme"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"primaryLight"}},{"kind":"Field","name":{"kind":"Name","value":"primaryDark"}},{"kind":"Field","name":{"kind":"Name","value":"accentLight"}},{"kind":"Field","name":{"kind":"Name","value":"accentDark"}},{"kind":"Field","name":{"kind":"Name","value":"sidebarLight"}},{"kind":"Field","name":{"kind":"Name","value":"sidebarDark"}},{"kind":"Field","name":{"kind":"Name","value":"destructiveLight"}},{"kind":"Field","name":{"kind":"Name","value":"destructiveDark"}},{"kind":"Field","name":{"kind":"Name","value":"radius"}},{"kind":"Field","name":{"kind":"Name","value":"fontFamily"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedById"}}]}}]} as unknown as DocumentNode<ResetAdminThemeMutation, ResetAdminThemeMutationVariables>;
export const GetAdminAttributesDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetAdminAttributes"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"type"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"AttributeType"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"adminAttributes"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"type"},"value":{"kind":"Variable","name":{"kind":"Name","value":"type"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"AttributeFields"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"AttributeValueFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"ProductAttributeValue"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"attributeId"}},{"kind":"Field","name":{"kind":"Name","value":"value"}},{"kind":"Field","name":{"kind":"Name","value":"slug"}},{"kind":"Field","name":{"kind":"Name","value":"displayOrder"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"AttributeFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"ProductAttribute"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"slug"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"isVariantAttribute"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}},{"kind":"Field","name":{"kind":"Name","value":"values"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"AttributeValueFields"}}]}}]}}]} as unknown as DocumentNode<GetAdminAttributesQuery, GetAdminAttributesQueryVariables>;
export const GetAttributesDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetAttributes"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"type"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"AttributeType"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"variantOnly"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Boolean"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"attributes"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"type"},"value":{"kind":"Variable","name":{"kind":"Name","value":"type"}}},{"kind":"Argument","name":{"kind":"Name","value":"variantOnly"},"value":{"kind":"Variable","name":{"kind":"Name","value":"variantOnly"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"AttributeFields"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"AttributeValueFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"ProductAttributeValue"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"attributeId"}},{"kind":"Field","name":{"kind":"Name","value":"value"}},{"kind":"Field","name":{"kind":"Name","value":"slug"}},{"kind":"Field","name":{"kind":"Name","value":"displayOrder"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"AttributeFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"ProductAttribute"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"slug"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"isVariantAttribute"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}},{"kind":"Field","name":{"kind":"Name","value":"values"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"AttributeValueFields"}}]}}]}}]} as unknown as DocumentNode<GetAttributesQuery, GetAttributesQueryVariables>;
export const GetAttributeDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetAttribute"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"attribute"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"AttributeFields"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"AttributeValueFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"ProductAttributeValue"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"attributeId"}},{"kind":"Field","name":{"kind":"Name","value":"value"}},{"kind":"Field","name":{"kind":"Name","value":"slug"}},{"kind":"Field","name":{"kind":"Name","value":"displayOrder"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"AttributeFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"ProductAttribute"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"slug"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"isVariantAttribute"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}},{"kind":"Field","name":{"kind":"Name","value":"values"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"AttributeValueFields"}}]}}]}}]} as unknown as DocumentNode<GetAttributeQuery, GetAttributeQueryVariables>;
export const CreateAttributeDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"CreateAttribute"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"createAttributeInput"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"CreateAttributeInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"createAttribute"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"createAttributeInput"},"value":{"kind":"Variable","name":{"kind":"Name","value":"createAttributeInput"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"AttributeFields"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"AttributeValueFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"ProductAttributeValue"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"attributeId"}},{"kind":"Field","name":{"kind":"Name","value":"value"}},{"kind":"Field","name":{"kind":"Name","value":"slug"}},{"kind":"Field","name":{"kind":"Name","value":"displayOrder"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"AttributeFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"ProductAttribute"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"slug"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"isVariantAttribute"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}},{"kind":"Field","name":{"kind":"Name","value":"values"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"AttributeValueFields"}}]}}]}}]} as unknown as DocumentNode<CreateAttributeMutation, CreateAttributeMutationVariables>;
export const UpdateAttributeDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"UpdateAttribute"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"updateAttributeInput"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"UpdateAttributeInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"updateAttribute"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"updateAttributeInput"},"value":{"kind":"Variable","name":{"kind":"Name","value":"updateAttributeInput"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"AttributeFields"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"AttributeValueFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"ProductAttributeValue"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"attributeId"}},{"kind":"Field","name":{"kind":"Name","value":"value"}},{"kind":"Field","name":{"kind":"Name","value":"slug"}},{"kind":"Field","name":{"kind":"Name","value":"displayOrder"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"AttributeFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"ProductAttribute"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"slug"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"isVariantAttribute"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}},{"kind":"Field","name":{"kind":"Name","value":"values"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"AttributeValueFields"}}]}}]}}]} as unknown as DocumentNode<UpdateAttributeMutation, UpdateAttributeMutationVariables>;
export const RemoveAttributeDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"RemoveAttribute"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"removeAttribute"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"AttributeFields"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"AttributeValueFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"ProductAttributeValue"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"attributeId"}},{"kind":"Field","name":{"kind":"Name","value":"value"}},{"kind":"Field","name":{"kind":"Name","value":"slug"}},{"kind":"Field","name":{"kind":"Name","value":"displayOrder"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"AttributeFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"ProductAttribute"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"slug"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"isVariantAttribute"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}},{"kind":"Field","name":{"kind":"Name","value":"values"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"AttributeValueFields"}}]}}]}}]} as unknown as DocumentNode<RemoveAttributeMutation, RemoveAttributeMutationVariables>;
export const CreateAttributeValueDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"CreateAttributeValue"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"createAttributeValueInput"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"CreateAttributeValueInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"createAttributeValue"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"createAttributeValueInput"},"value":{"kind":"Variable","name":{"kind":"Name","value":"createAttributeValueInput"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"AttributeValueFields"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"AttributeValueFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"ProductAttributeValue"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"attributeId"}},{"kind":"Field","name":{"kind":"Name","value":"value"}},{"kind":"Field","name":{"kind":"Name","value":"slug"}},{"kind":"Field","name":{"kind":"Name","value":"displayOrder"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}}]}}]} as unknown as DocumentNode<CreateAttributeValueMutation, CreateAttributeValueMutationVariables>;
export const UpdateAttributeValueDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"UpdateAttributeValue"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"updateAttributeValueInput"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"UpdateAttributeValueInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"updateAttributeValue"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"updateAttributeValueInput"},"value":{"kind":"Variable","name":{"kind":"Name","value":"updateAttributeValueInput"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"AttributeValueFields"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"AttributeValueFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"ProductAttributeValue"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"attributeId"}},{"kind":"Field","name":{"kind":"Name","value":"value"}},{"kind":"Field","name":{"kind":"Name","value":"slug"}},{"kind":"Field","name":{"kind":"Name","value":"displayOrder"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}}]}}]} as unknown as DocumentNode<UpdateAttributeValueMutation, UpdateAttributeValueMutationVariables>;
export const RemoveAttributeValueDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"RemoveAttributeValue"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"removeAttributeValue"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"AttributeValueFields"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"AttributeValueFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"ProductAttributeValue"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"attributeId"}},{"kind":"Field","name":{"kind":"Name","value":"value"}},{"kind":"Field","name":{"kind":"Name","value":"slug"}},{"kind":"Field","name":{"kind":"Name","value":"displayOrder"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}}]}}]} as unknown as DocumentNode<RemoveAttributeValueMutation, RemoveAttributeValueMutationVariables>;
export const ReorderAttributeValuesDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"ReorderAttributeValues"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"reorderAttributeValuesInput"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ReorderAttributeValuesInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"reorderAttributeValues"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"reorderAttributeValuesInput"},"value":{"kind":"Variable","name":{"kind":"Name","value":"reorderAttributeValuesInput"}}}]}]}}]} as unknown as DocumentNode<ReorderAttributeValuesMutation, ReorderAttributeValuesMutationVariables>;
export const GetAdminBrandsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetAdminBrands"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"status"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"BrandStatus"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"adminBrands"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"status"},"value":{"kind":"Variable","name":{"kind":"Name","value":"status"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"BrandFields"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"BrandFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Brand"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"slug"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"logoUrl"}},{"kind":"Field","name":{"kind":"Name","value":"bannerUrl"}},{"kind":"Field","name":{"kind":"Name","value":"websiteUrl"}},{"kind":"Field","name":{"kind":"Name","value":"countryCode"}},{"kind":"Field","name":{"kind":"Name","value":"foundedYear"}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"isFeatured"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}}]}}]} as unknown as DocumentNode<GetAdminBrandsQuery, GetAdminBrandsQueryVariables>;
export const GetBrandsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetBrands"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"status"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"BrandStatus"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"featuredOnly"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Boolean"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"brands"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"status"},"value":{"kind":"Variable","name":{"kind":"Name","value":"status"}}},{"kind":"Argument","name":{"kind":"Name","value":"featuredOnly"},"value":{"kind":"Variable","name":{"kind":"Name","value":"featuredOnly"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"BrandFields"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"BrandFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Brand"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"slug"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"logoUrl"}},{"kind":"Field","name":{"kind":"Name","value":"bannerUrl"}},{"kind":"Field","name":{"kind":"Name","value":"websiteUrl"}},{"kind":"Field","name":{"kind":"Name","value":"countryCode"}},{"kind":"Field","name":{"kind":"Name","value":"foundedYear"}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"isFeatured"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}}]}}]} as unknown as DocumentNode<GetBrandsQuery, GetBrandsQueryVariables>;
export const GetBrandDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetBrand"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"brand"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"BrandFields"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"BrandFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Brand"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"slug"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"logoUrl"}},{"kind":"Field","name":{"kind":"Name","value":"bannerUrl"}},{"kind":"Field","name":{"kind":"Name","value":"websiteUrl"}},{"kind":"Field","name":{"kind":"Name","value":"countryCode"}},{"kind":"Field","name":{"kind":"Name","value":"foundedYear"}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"isFeatured"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}}]}}]} as unknown as DocumentNode<GetBrandQuery, GetBrandQueryVariables>;
export const GetPublicBrandDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetPublicBrand"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"slug"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"publicBrand"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"slug"},"value":{"kind":"Variable","name":{"kind":"Name","value":"slug"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"BrandFields"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"BrandFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Brand"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"slug"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"logoUrl"}},{"kind":"Field","name":{"kind":"Name","value":"bannerUrl"}},{"kind":"Field","name":{"kind":"Name","value":"websiteUrl"}},{"kind":"Field","name":{"kind":"Name","value":"countryCode"}},{"kind":"Field","name":{"kind":"Name","value":"foundedYear"}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"isFeatured"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}}]}}]} as unknown as DocumentNode<GetPublicBrandQuery, GetPublicBrandQueryVariables>;
export const CreateBrandDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"CreateBrand"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"createBrandInput"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"CreateBrandInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"createBrand"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"createBrandInput"},"value":{"kind":"Variable","name":{"kind":"Name","value":"createBrandInput"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"BrandFields"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"BrandFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Brand"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"slug"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"logoUrl"}},{"kind":"Field","name":{"kind":"Name","value":"bannerUrl"}},{"kind":"Field","name":{"kind":"Name","value":"websiteUrl"}},{"kind":"Field","name":{"kind":"Name","value":"countryCode"}},{"kind":"Field","name":{"kind":"Name","value":"foundedYear"}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"isFeatured"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}}]}}]} as unknown as DocumentNode<CreateBrandMutation, CreateBrandMutationVariables>;
export const UpdateBrandDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"UpdateBrand"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"updateBrandInput"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"UpdateBrandInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"updateBrand"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"updateBrandInput"},"value":{"kind":"Variable","name":{"kind":"Name","value":"updateBrandInput"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"BrandFields"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"BrandFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Brand"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"slug"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"logoUrl"}},{"kind":"Field","name":{"kind":"Name","value":"bannerUrl"}},{"kind":"Field","name":{"kind":"Name","value":"websiteUrl"}},{"kind":"Field","name":{"kind":"Name","value":"countryCode"}},{"kind":"Field","name":{"kind":"Name","value":"foundedYear"}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"isFeatured"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}}]}}]} as unknown as DocumentNode<UpdateBrandMutation, UpdateBrandMutationVariables>;
export const SetBrandStatusDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"SetBrandStatus"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"setBrandStatusInput"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"SetBrandStatusInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"setBrandStatus"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"setBrandStatusInput"},"value":{"kind":"Variable","name":{"kind":"Name","value":"setBrandStatusInput"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"BrandFields"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"BrandFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Brand"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"slug"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"logoUrl"}},{"kind":"Field","name":{"kind":"Name","value":"bannerUrl"}},{"kind":"Field","name":{"kind":"Name","value":"websiteUrl"}},{"kind":"Field","name":{"kind":"Name","value":"countryCode"}},{"kind":"Field","name":{"kind":"Name","value":"foundedYear"}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"isFeatured"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}}]}}]} as unknown as DocumentNode<SetBrandStatusMutation, SetBrandStatusMutationVariables>;
export const RemoveBrandDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"RemoveBrand"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"removeBrand"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"BrandFields"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"BrandFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Brand"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"slug"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"logoUrl"}},{"kind":"Field","name":{"kind":"Name","value":"bannerUrl"}},{"kind":"Field","name":{"kind":"Name","value":"websiteUrl"}},{"kind":"Field","name":{"kind":"Name","value":"countryCode"}},{"kind":"Field","name":{"kind":"Name","value":"foundedYear"}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"isFeatured"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}}]}}]} as unknown as DocumentNode<RemoveBrandMutation, RemoveBrandMutationVariables>;
export const GetMyCartDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetMyCart"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"myCart"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"CartFields"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"ProductImageFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"ProductImage"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"productId"}},{"kind":"Field","name":{"kind":"Name","value":"imageUrl"}},{"kind":"Field","name":{"kind":"Name","value":"altText"}},{"kind":"Field","name":{"kind":"Name","value":"displayOrder"}},{"kind":"Field","name":{"kind":"Name","value":"isPrimary"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"ProductFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Product"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"storeId"}},{"kind":"Field","name":{"kind":"Name","value":"categoryId"}},{"kind":"Field","name":{"kind":"Name","value":"brandId"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"slug"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"shortDescription"}},{"kind":"Field","name":{"kind":"Name","value":"productType"}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"isFeatured"}},{"kind":"Field","name":{"kind":"Name","value":"isDigital"}},{"kind":"Field","name":{"kind":"Name","value":"price"}},{"kind":"Field","name":{"kind":"Name","value":"compareAtPrice"}},{"kind":"Field","name":{"kind":"Name","value":"costPrice"}},{"kind":"Field","name":{"kind":"Name","value":"priceWithTax"}},{"kind":"Field","name":{"kind":"Name","value":"sku"}},{"kind":"Field","name":{"kind":"Name","value":"weight"}},{"kind":"Field","name":{"kind":"Name","value":"length"}},{"kind":"Field","name":{"kind":"Name","value":"width"}},{"kind":"Field","name":{"kind":"Name","value":"height"}},{"kind":"Field","name":{"kind":"Name","value":"hsnCode"}},{"kind":"Field","name":{"kind":"Name","value":"seoTitle"}},{"kind":"Field","name":{"kind":"Name","value":"seoDescription"}},{"kind":"Field","name":{"kind":"Name","value":"seoKeywords"}},{"kind":"Field","name":{"kind":"Name","value":"specifications"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}},{"kind":"Field","name":{"kind":"Name","value":"images"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"ProductImageFields"}}]}},{"kind":"Field","name":{"kind":"Name","value":"brand"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"slug"}},{"kind":"Field","name":{"kind":"Name","value":"logoUrl"}}]}},{"kind":"Field","name":{"kind":"Name","value":"category"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"slug"}}]}},{"kind":"Field","name":{"kind":"Name","value":"taxId"}},{"kind":"Field","name":{"kind":"Name","value":"tax"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"rate"}}]}},{"kind":"Field","name":{"kind":"Name","value":"tags"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"slug"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"CartFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Cart"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"customerId"}},{"kind":"Field","name":{"kind":"Name","value":"itemCount"}},{"kind":"Field","name":{"kind":"Name","value":"subtotal"}},{"kind":"Field","name":{"kind":"Name","value":"needsReview"}},{"kind":"Field","name":{"kind":"Name","value":"items"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"productId"}},{"kind":"Field","name":{"kind":"Name","value":"variantId"}},{"kind":"Field","name":{"kind":"Name","value":"quantity"}},{"kind":"Field","name":{"kind":"Name","value":"unitPriceSnapshot"}},{"kind":"Field","name":{"kind":"Name","value":"unitPriceCurrent"}},{"kind":"Field","name":{"kind":"Name","value":"priceChanged"}},{"kind":"Field","name":{"kind":"Name","value":"lineTotal"}},{"kind":"Field","name":{"kind":"Name","value":"availableQuantity"}},{"kind":"Field","name":{"kind":"Name","value":"stockState"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"product"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"ProductFields"}}]}},{"kind":"Field","name":{"kind":"Name","value":"variant"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"sku"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"price"}},{"kind":"Field","name":{"kind":"Name","value":"priceWithTax"}},{"kind":"Field","name":{"kind":"Name","value":"imageUrl"}},{"kind":"Field","name":{"kind":"Name","value":"attributes"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"attributeId"}},{"kind":"Field","name":{"kind":"Name","value":"attributeValueId"}},{"kind":"Field","name":{"kind":"Name","value":"attributeName"}},{"kind":"Field","name":{"kind":"Name","value":"attributeSlug"}},{"kind":"Field","name":{"kind":"Name","value":"value"}},{"kind":"Field","name":{"kind":"Name","value":"valueSlug"}}]}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}}]}}]} as unknown as DocumentNode<GetMyCartQuery, GetMyCartQueryVariables>;
export const GetMyCartItemCountDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetMyCartItemCount"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"myCartItemCount"}}]}}]} as unknown as DocumentNode<GetMyCartItemCountQuery, GetMyCartItemCountQueryVariables>;
export const AddToCartDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"AddToCart"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"AddToCartInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"addToCart"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"CartFields"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"ProductImageFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"ProductImage"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"productId"}},{"kind":"Field","name":{"kind":"Name","value":"imageUrl"}},{"kind":"Field","name":{"kind":"Name","value":"altText"}},{"kind":"Field","name":{"kind":"Name","value":"displayOrder"}},{"kind":"Field","name":{"kind":"Name","value":"isPrimary"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"ProductFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Product"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"storeId"}},{"kind":"Field","name":{"kind":"Name","value":"categoryId"}},{"kind":"Field","name":{"kind":"Name","value":"brandId"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"slug"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"shortDescription"}},{"kind":"Field","name":{"kind":"Name","value":"productType"}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"isFeatured"}},{"kind":"Field","name":{"kind":"Name","value":"isDigital"}},{"kind":"Field","name":{"kind":"Name","value":"price"}},{"kind":"Field","name":{"kind":"Name","value":"compareAtPrice"}},{"kind":"Field","name":{"kind":"Name","value":"costPrice"}},{"kind":"Field","name":{"kind":"Name","value":"priceWithTax"}},{"kind":"Field","name":{"kind":"Name","value":"sku"}},{"kind":"Field","name":{"kind":"Name","value":"weight"}},{"kind":"Field","name":{"kind":"Name","value":"length"}},{"kind":"Field","name":{"kind":"Name","value":"width"}},{"kind":"Field","name":{"kind":"Name","value":"height"}},{"kind":"Field","name":{"kind":"Name","value":"hsnCode"}},{"kind":"Field","name":{"kind":"Name","value":"seoTitle"}},{"kind":"Field","name":{"kind":"Name","value":"seoDescription"}},{"kind":"Field","name":{"kind":"Name","value":"seoKeywords"}},{"kind":"Field","name":{"kind":"Name","value":"specifications"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}},{"kind":"Field","name":{"kind":"Name","value":"images"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"ProductImageFields"}}]}},{"kind":"Field","name":{"kind":"Name","value":"brand"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"slug"}},{"kind":"Field","name":{"kind":"Name","value":"logoUrl"}}]}},{"kind":"Field","name":{"kind":"Name","value":"category"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"slug"}}]}},{"kind":"Field","name":{"kind":"Name","value":"taxId"}},{"kind":"Field","name":{"kind":"Name","value":"tax"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"rate"}}]}},{"kind":"Field","name":{"kind":"Name","value":"tags"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"slug"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"CartFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Cart"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"customerId"}},{"kind":"Field","name":{"kind":"Name","value":"itemCount"}},{"kind":"Field","name":{"kind":"Name","value":"subtotal"}},{"kind":"Field","name":{"kind":"Name","value":"needsReview"}},{"kind":"Field","name":{"kind":"Name","value":"items"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"productId"}},{"kind":"Field","name":{"kind":"Name","value":"variantId"}},{"kind":"Field","name":{"kind":"Name","value":"quantity"}},{"kind":"Field","name":{"kind":"Name","value":"unitPriceSnapshot"}},{"kind":"Field","name":{"kind":"Name","value":"unitPriceCurrent"}},{"kind":"Field","name":{"kind":"Name","value":"priceChanged"}},{"kind":"Field","name":{"kind":"Name","value":"lineTotal"}},{"kind":"Field","name":{"kind":"Name","value":"availableQuantity"}},{"kind":"Field","name":{"kind":"Name","value":"stockState"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"product"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"ProductFields"}}]}},{"kind":"Field","name":{"kind":"Name","value":"variant"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"sku"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"price"}},{"kind":"Field","name":{"kind":"Name","value":"priceWithTax"}},{"kind":"Field","name":{"kind":"Name","value":"imageUrl"}},{"kind":"Field","name":{"kind":"Name","value":"attributes"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"attributeId"}},{"kind":"Field","name":{"kind":"Name","value":"attributeValueId"}},{"kind":"Field","name":{"kind":"Name","value":"attributeName"}},{"kind":"Field","name":{"kind":"Name","value":"attributeSlug"}},{"kind":"Field","name":{"kind":"Name","value":"value"}},{"kind":"Field","name":{"kind":"Name","value":"valueSlug"}}]}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}}]}}]} as unknown as DocumentNode<AddToCartMutation, AddToCartMutationVariables>;
export const UpdateCartItemQtyDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"UpdateCartItemQty"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"UpdateCartItemQtyInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"updateCartItemQty"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"CartFields"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"ProductImageFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"ProductImage"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"productId"}},{"kind":"Field","name":{"kind":"Name","value":"imageUrl"}},{"kind":"Field","name":{"kind":"Name","value":"altText"}},{"kind":"Field","name":{"kind":"Name","value":"displayOrder"}},{"kind":"Field","name":{"kind":"Name","value":"isPrimary"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"ProductFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Product"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"storeId"}},{"kind":"Field","name":{"kind":"Name","value":"categoryId"}},{"kind":"Field","name":{"kind":"Name","value":"brandId"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"slug"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"shortDescription"}},{"kind":"Field","name":{"kind":"Name","value":"productType"}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"isFeatured"}},{"kind":"Field","name":{"kind":"Name","value":"isDigital"}},{"kind":"Field","name":{"kind":"Name","value":"price"}},{"kind":"Field","name":{"kind":"Name","value":"compareAtPrice"}},{"kind":"Field","name":{"kind":"Name","value":"costPrice"}},{"kind":"Field","name":{"kind":"Name","value":"priceWithTax"}},{"kind":"Field","name":{"kind":"Name","value":"sku"}},{"kind":"Field","name":{"kind":"Name","value":"weight"}},{"kind":"Field","name":{"kind":"Name","value":"length"}},{"kind":"Field","name":{"kind":"Name","value":"width"}},{"kind":"Field","name":{"kind":"Name","value":"height"}},{"kind":"Field","name":{"kind":"Name","value":"hsnCode"}},{"kind":"Field","name":{"kind":"Name","value":"seoTitle"}},{"kind":"Field","name":{"kind":"Name","value":"seoDescription"}},{"kind":"Field","name":{"kind":"Name","value":"seoKeywords"}},{"kind":"Field","name":{"kind":"Name","value":"specifications"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}},{"kind":"Field","name":{"kind":"Name","value":"images"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"ProductImageFields"}}]}},{"kind":"Field","name":{"kind":"Name","value":"brand"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"slug"}},{"kind":"Field","name":{"kind":"Name","value":"logoUrl"}}]}},{"kind":"Field","name":{"kind":"Name","value":"category"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"slug"}}]}},{"kind":"Field","name":{"kind":"Name","value":"taxId"}},{"kind":"Field","name":{"kind":"Name","value":"tax"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"rate"}}]}},{"kind":"Field","name":{"kind":"Name","value":"tags"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"slug"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"CartFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Cart"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"customerId"}},{"kind":"Field","name":{"kind":"Name","value":"itemCount"}},{"kind":"Field","name":{"kind":"Name","value":"subtotal"}},{"kind":"Field","name":{"kind":"Name","value":"needsReview"}},{"kind":"Field","name":{"kind":"Name","value":"items"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"productId"}},{"kind":"Field","name":{"kind":"Name","value":"variantId"}},{"kind":"Field","name":{"kind":"Name","value":"quantity"}},{"kind":"Field","name":{"kind":"Name","value":"unitPriceSnapshot"}},{"kind":"Field","name":{"kind":"Name","value":"unitPriceCurrent"}},{"kind":"Field","name":{"kind":"Name","value":"priceChanged"}},{"kind":"Field","name":{"kind":"Name","value":"lineTotal"}},{"kind":"Field","name":{"kind":"Name","value":"availableQuantity"}},{"kind":"Field","name":{"kind":"Name","value":"stockState"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"product"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"ProductFields"}}]}},{"kind":"Field","name":{"kind":"Name","value":"variant"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"sku"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"price"}},{"kind":"Field","name":{"kind":"Name","value":"priceWithTax"}},{"kind":"Field","name":{"kind":"Name","value":"imageUrl"}},{"kind":"Field","name":{"kind":"Name","value":"attributes"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"attributeId"}},{"kind":"Field","name":{"kind":"Name","value":"attributeValueId"}},{"kind":"Field","name":{"kind":"Name","value":"attributeName"}},{"kind":"Field","name":{"kind":"Name","value":"attributeSlug"}},{"kind":"Field","name":{"kind":"Name","value":"value"}},{"kind":"Field","name":{"kind":"Name","value":"valueSlug"}}]}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}}]}}]} as unknown as DocumentNode<UpdateCartItemQtyMutation, UpdateCartItemQtyMutationVariables>;
export const RemoveFromCartDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"RemoveFromCart"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"RemoveCartItemInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"removeFromCart"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"CartFields"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"ProductImageFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"ProductImage"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"productId"}},{"kind":"Field","name":{"kind":"Name","value":"imageUrl"}},{"kind":"Field","name":{"kind":"Name","value":"altText"}},{"kind":"Field","name":{"kind":"Name","value":"displayOrder"}},{"kind":"Field","name":{"kind":"Name","value":"isPrimary"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"ProductFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Product"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"storeId"}},{"kind":"Field","name":{"kind":"Name","value":"categoryId"}},{"kind":"Field","name":{"kind":"Name","value":"brandId"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"slug"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"shortDescription"}},{"kind":"Field","name":{"kind":"Name","value":"productType"}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"isFeatured"}},{"kind":"Field","name":{"kind":"Name","value":"isDigital"}},{"kind":"Field","name":{"kind":"Name","value":"price"}},{"kind":"Field","name":{"kind":"Name","value":"compareAtPrice"}},{"kind":"Field","name":{"kind":"Name","value":"costPrice"}},{"kind":"Field","name":{"kind":"Name","value":"priceWithTax"}},{"kind":"Field","name":{"kind":"Name","value":"sku"}},{"kind":"Field","name":{"kind":"Name","value":"weight"}},{"kind":"Field","name":{"kind":"Name","value":"length"}},{"kind":"Field","name":{"kind":"Name","value":"width"}},{"kind":"Field","name":{"kind":"Name","value":"height"}},{"kind":"Field","name":{"kind":"Name","value":"hsnCode"}},{"kind":"Field","name":{"kind":"Name","value":"seoTitle"}},{"kind":"Field","name":{"kind":"Name","value":"seoDescription"}},{"kind":"Field","name":{"kind":"Name","value":"seoKeywords"}},{"kind":"Field","name":{"kind":"Name","value":"specifications"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}},{"kind":"Field","name":{"kind":"Name","value":"images"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"ProductImageFields"}}]}},{"kind":"Field","name":{"kind":"Name","value":"brand"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"slug"}},{"kind":"Field","name":{"kind":"Name","value":"logoUrl"}}]}},{"kind":"Field","name":{"kind":"Name","value":"category"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"slug"}}]}},{"kind":"Field","name":{"kind":"Name","value":"taxId"}},{"kind":"Field","name":{"kind":"Name","value":"tax"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"rate"}}]}},{"kind":"Field","name":{"kind":"Name","value":"tags"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"slug"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"CartFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Cart"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"customerId"}},{"kind":"Field","name":{"kind":"Name","value":"itemCount"}},{"kind":"Field","name":{"kind":"Name","value":"subtotal"}},{"kind":"Field","name":{"kind":"Name","value":"needsReview"}},{"kind":"Field","name":{"kind":"Name","value":"items"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"productId"}},{"kind":"Field","name":{"kind":"Name","value":"variantId"}},{"kind":"Field","name":{"kind":"Name","value":"quantity"}},{"kind":"Field","name":{"kind":"Name","value":"unitPriceSnapshot"}},{"kind":"Field","name":{"kind":"Name","value":"unitPriceCurrent"}},{"kind":"Field","name":{"kind":"Name","value":"priceChanged"}},{"kind":"Field","name":{"kind":"Name","value":"lineTotal"}},{"kind":"Field","name":{"kind":"Name","value":"availableQuantity"}},{"kind":"Field","name":{"kind":"Name","value":"stockState"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"product"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"ProductFields"}}]}},{"kind":"Field","name":{"kind":"Name","value":"variant"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"sku"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"price"}},{"kind":"Field","name":{"kind":"Name","value":"priceWithTax"}},{"kind":"Field","name":{"kind":"Name","value":"imageUrl"}},{"kind":"Field","name":{"kind":"Name","value":"attributes"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"attributeId"}},{"kind":"Field","name":{"kind":"Name","value":"attributeValueId"}},{"kind":"Field","name":{"kind":"Name","value":"attributeName"}},{"kind":"Field","name":{"kind":"Name","value":"attributeSlug"}},{"kind":"Field","name":{"kind":"Name","value":"value"}},{"kind":"Field","name":{"kind":"Name","value":"valueSlug"}}]}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}}]}}]} as unknown as DocumentNode<RemoveFromCartMutation, RemoveFromCartMutationVariables>;
export const ClearCartDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"ClearCart"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"clearCart"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"CartFields"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"ProductImageFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"ProductImage"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"productId"}},{"kind":"Field","name":{"kind":"Name","value":"imageUrl"}},{"kind":"Field","name":{"kind":"Name","value":"altText"}},{"kind":"Field","name":{"kind":"Name","value":"displayOrder"}},{"kind":"Field","name":{"kind":"Name","value":"isPrimary"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"ProductFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Product"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"storeId"}},{"kind":"Field","name":{"kind":"Name","value":"categoryId"}},{"kind":"Field","name":{"kind":"Name","value":"brandId"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"slug"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"shortDescription"}},{"kind":"Field","name":{"kind":"Name","value":"productType"}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"isFeatured"}},{"kind":"Field","name":{"kind":"Name","value":"isDigital"}},{"kind":"Field","name":{"kind":"Name","value":"price"}},{"kind":"Field","name":{"kind":"Name","value":"compareAtPrice"}},{"kind":"Field","name":{"kind":"Name","value":"costPrice"}},{"kind":"Field","name":{"kind":"Name","value":"priceWithTax"}},{"kind":"Field","name":{"kind":"Name","value":"sku"}},{"kind":"Field","name":{"kind":"Name","value":"weight"}},{"kind":"Field","name":{"kind":"Name","value":"length"}},{"kind":"Field","name":{"kind":"Name","value":"width"}},{"kind":"Field","name":{"kind":"Name","value":"height"}},{"kind":"Field","name":{"kind":"Name","value":"hsnCode"}},{"kind":"Field","name":{"kind":"Name","value":"seoTitle"}},{"kind":"Field","name":{"kind":"Name","value":"seoDescription"}},{"kind":"Field","name":{"kind":"Name","value":"seoKeywords"}},{"kind":"Field","name":{"kind":"Name","value":"specifications"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}},{"kind":"Field","name":{"kind":"Name","value":"images"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"ProductImageFields"}}]}},{"kind":"Field","name":{"kind":"Name","value":"brand"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"slug"}},{"kind":"Field","name":{"kind":"Name","value":"logoUrl"}}]}},{"kind":"Field","name":{"kind":"Name","value":"category"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"slug"}}]}},{"kind":"Field","name":{"kind":"Name","value":"taxId"}},{"kind":"Field","name":{"kind":"Name","value":"tax"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"rate"}}]}},{"kind":"Field","name":{"kind":"Name","value":"tags"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"slug"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"CartFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Cart"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"customerId"}},{"kind":"Field","name":{"kind":"Name","value":"itemCount"}},{"kind":"Field","name":{"kind":"Name","value":"subtotal"}},{"kind":"Field","name":{"kind":"Name","value":"needsReview"}},{"kind":"Field","name":{"kind":"Name","value":"items"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"productId"}},{"kind":"Field","name":{"kind":"Name","value":"variantId"}},{"kind":"Field","name":{"kind":"Name","value":"quantity"}},{"kind":"Field","name":{"kind":"Name","value":"unitPriceSnapshot"}},{"kind":"Field","name":{"kind":"Name","value":"unitPriceCurrent"}},{"kind":"Field","name":{"kind":"Name","value":"priceChanged"}},{"kind":"Field","name":{"kind":"Name","value":"lineTotal"}},{"kind":"Field","name":{"kind":"Name","value":"availableQuantity"}},{"kind":"Field","name":{"kind":"Name","value":"stockState"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"product"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"ProductFields"}}]}},{"kind":"Field","name":{"kind":"Name","value":"variant"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"sku"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"price"}},{"kind":"Field","name":{"kind":"Name","value":"priceWithTax"}},{"kind":"Field","name":{"kind":"Name","value":"imageUrl"}},{"kind":"Field","name":{"kind":"Name","value":"attributes"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"attributeId"}},{"kind":"Field","name":{"kind":"Name","value":"attributeValueId"}},{"kind":"Field","name":{"kind":"Name","value":"attributeName"}},{"kind":"Field","name":{"kind":"Name","value":"attributeSlug"}},{"kind":"Field","name":{"kind":"Name","value":"value"}},{"kind":"Field","name":{"kind":"Name","value":"valueSlug"}}]}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}}]}}]} as unknown as DocumentNode<ClearCartMutation, ClearCartMutationVariables>;
export const GetCategoriesDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetCategories"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"categories"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"CategoryFields"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"CategoryFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Category"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"slug"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"parentId"}},{"kind":"Field","name":{"kind":"Name","value":"imageUrl"}},{"kind":"Field","name":{"kind":"Name","value":"iconUrl"}},{"kind":"Field","name":{"kind":"Name","value":"displayOrder"}},{"kind":"Field","name":{"kind":"Name","value":"isActive"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}}]}}]} as unknown as DocumentNode<GetCategoriesQuery, GetCategoriesQueryVariables>;
export const GetShopFilterCategoriesDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetShopFilterCategories"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"shopFilterCategories"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"slug"}},{"kind":"Field","name":{"kind":"Name","value":"displayOrder"}},{"kind":"Field","name":{"kind":"Name","value":"productCount"}}]}}]}}]} as unknown as DocumentNode<GetShopFilterCategoriesQuery, GetShopFilterCategoriesQueryVariables>;
export const GetAdminCategoriesPaginatedDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetAdminCategoriesPaginated"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"page"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"pageSize"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"search"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"adminCategoriesPaginated"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"page"},"value":{"kind":"Variable","name":{"kind":"Name","value":"page"}}},{"kind":"Argument","name":{"kind":"Name","value":"pageSize"},"value":{"kind":"Variable","name":{"kind":"Name","value":"pageSize"}}},{"kind":"Argument","name":{"kind":"Name","value":"search"},"value":{"kind":"Variable","name":{"kind":"Name","value":"search"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"items"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"CategoryFields"}}]}},{"kind":"Field","name":{"kind":"Name","value":"totalCount"}},{"kind":"Field","name":{"kind":"Name","value":"totalPages"}},{"kind":"Field","name":{"kind":"Name","value":"currentPage"}},{"kind":"Field","name":{"kind":"Name","value":"pageSize"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"CategoryFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Category"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"slug"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"parentId"}},{"kind":"Field","name":{"kind":"Name","value":"imageUrl"}},{"kind":"Field","name":{"kind":"Name","value":"iconUrl"}},{"kind":"Field","name":{"kind":"Name","value":"displayOrder"}},{"kind":"Field","name":{"kind":"Name","value":"isActive"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}}]}}]} as unknown as DocumentNode<GetAdminCategoriesPaginatedQuery, GetAdminCategoriesPaginatedQueryVariables>;
export const GetCategoryChildrenDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetCategoryChildren"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"parentId"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"search"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"limit"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"categoryChildren"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"parentId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"parentId"}}},{"kind":"Argument","name":{"kind":"Name","value":"search"},"value":{"kind":"Variable","name":{"kind":"Name","value":"search"}}},{"kind":"Argument","name":{"kind":"Name","value":"limit"},"value":{"kind":"Variable","name":{"kind":"Name","value":"limit"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"slug"}},{"kind":"Field","name":{"kind":"Name","value":"parentId"}},{"kind":"Field","name":{"kind":"Name","value":"hasChildren"}}]}}]}}]} as unknown as DocumentNode<GetCategoryChildrenQuery, GetCategoryChildrenQueryVariables>;
export const GetCategoryAncestorsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetCategoryAncestors"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"categoryAncestors"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"slug"}},{"kind":"Field","name":{"kind":"Name","value":"parentId"}},{"kind":"Field","name":{"kind":"Name","value":"hasChildren"}}]}}]}}]} as unknown as DocumentNode<GetCategoryAncestorsQuery, GetCategoryAncestorsQueryVariables>;
export const GetCategoryDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetCategory"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"category"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"CategoryFields"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"CategoryFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Category"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"slug"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"parentId"}},{"kind":"Field","name":{"kind":"Name","value":"imageUrl"}},{"kind":"Field","name":{"kind":"Name","value":"iconUrl"}},{"kind":"Field","name":{"kind":"Name","value":"displayOrder"}},{"kind":"Field","name":{"kind":"Name","value":"isActive"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}}]}}]} as unknown as DocumentNode<GetCategoryQuery, GetCategoryQueryVariables>;
export const GetPublicCategoryBySlugDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetPublicCategoryBySlug"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"slug"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"publicCategoryBySlug"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"slug"},"value":{"kind":"Variable","name":{"kind":"Name","value":"slug"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"CategoryFields"}},{"kind":"Field","name":{"kind":"Name","value":"children"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"CategoryFields"}}]}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"CategoryFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Category"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"slug"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"parentId"}},{"kind":"Field","name":{"kind":"Name","value":"imageUrl"}},{"kind":"Field","name":{"kind":"Name","value":"iconUrl"}},{"kind":"Field","name":{"kind":"Name","value":"displayOrder"}},{"kind":"Field","name":{"kind":"Name","value":"isActive"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}}]}}]} as unknown as DocumentNode<GetPublicCategoryBySlugQuery, GetPublicCategoryBySlugQueryVariables>;
export const CreateCategoryDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"CreateCategory"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"createCategoryInput"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"CreateCategoryInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"createCategory"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"createCategoryInput"},"value":{"kind":"Variable","name":{"kind":"Name","value":"createCategoryInput"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"CategoryFields"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"CategoryFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Category"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"slug"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"parentId"}},{"kind":"Field","name":{"kind":"Name","value":"imageUrl"}},{"kind":"Field","name":{"kind":"Name","value":"iconUrl"}},{"kind":"Field","name":{"kind":"Name","value":"displayOrder"}},{"kind":"Field","name":{"kind":"Name","value":"isActive"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}}]}}]} as unknown as DocumentNode<CreateCategoryMutation, CreateCategoryMutationVariables>;
export const UpdateCategoryDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"UpdateCategory"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"updateCategoryInput"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"UpdateCategoryInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"updateCategory"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"updateCategoryInput"},"value":{"kind":"Variable","name":{"kind":"Name","value":"updateCategoryInput"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"CategoryFields"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"CategoryFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Category"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"slug"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"parentId"}},{"kind":"Field","name":{"kind":"Name","value":"imageUrl"}},{"kind":"Field","name":{"kind":"Name","value":"iconUrl"}},{"kind":"Field","name":{"kind":"Name","value":"displayOrder"}},{"kind":"Field","name":{"kind":"Name","value":"isActive"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}}]}}]} as unknown as DocumentNode<UpdateCategoryMutation, UpdateCategoryMutationVariables>;
export const RemoveCategoryDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"RemoveCategory"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"removeCategory"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"CategoryFields"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"CategoryFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Category"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"slug"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"parentId"}},{"kind":"Field","name":{"kind":"Name","value":"imageUrl"}},{"kind":"Field","name":{"kind":"Name","value":"iconUrl"}},{"kind":"Field","name":{"kind":"Name","value":"displayOrder"}},{"kind":"Field","name":{"kind":"Name","value":"isActive"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}}]}}]} as unknown as DocumentNode<RemoveCategoryMutation, RemoveCategoryMutationVariables>;
export const UpdateCategoryTreeDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"UpdateCategoryTree"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"UpdateCategoryTreeInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"updateCategoryTree"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"updateCategoryTreeInput"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}]}]}}]} as unknown as DocumentNode<UpdateCategoryTreeMutation, UpdateCategoryTreeMutationVariables>;
export const GetAdminCouponsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetAdminCoupons"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"search"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"status"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"adminCoupons"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"search"},"value":{"kind":"Variable","name":{"kind":"Name","value":"search"}}},{"kind":"Argument","name":{"kind":"Name","value":"status"},"value":{"kind":"Variable","name":{"kind":"Name","value":"status"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"CouponFields"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"CouponFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Coupon"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"storeId"}},{"kind":"Field","name":{"kind":"Name","value":"code"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"discountType"}},{"kind":"Field","name":{"kind":"Name","value":"discountValue"}},{"kind":"Field","name":{"kind":"Name","value":"minimumPurchaseAmount"}},{"kind":"Field","name":{"kind":"Name","value":"maximumDiscountAmount"}},{"kind":"Field","name":{"kind":"Name","value":"usageLimit"}},{"kind":"Field","name":{"kind":"Name","value":"usageLimitPerUser"}},{"kind":"Field","name":{"kind":"Name","value":"validFrom"}},{"kind":"Field","name":{"kind":"Name","value":"validUntil"}},{"kind":"Field","name":{"kind":"Name","value":"isActive"}},{"kind":"Field","name":{"kind":"Name","value":"redemptionCount"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}}]}}]} as unknown as DocumentNode<GetAdminCouponsQuery, GetAdminCouponsQueryVariables>;
export const GetAdminCouponDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetAdminCoupon"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"adminCoupon"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"CouponFields"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"CouponFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Coupon"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"storeId"}},{"kind":"Field","name":{"kind":"Name","value":"code"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"discountType"}},{"kind":"Field","name":{"kind":"Name","value":"discountValue"}},{"kind":"Field","name":{"kind":"Name","value":"minimumPurchaseAmount"}},{"kind":"Field","name":{"kind":"Name","value":"maximumDiscountAmount"}},{"kind":"Field","name":{"kind":"Name","value":"usageLimit"}},{"kind":"Field","name":{"kind":"Name","value":"usageLimitPerUser"}},{"kind":"Field","name":{"kind":"Name","value":"validFrom"}},{"kind":"Field","name":{"kind":"Name","value":"validUntil"}},{"kind":"Field","name":{"kind":"Name","value":"isActive"}},{"kind":"Field","name":{"kind":"Name","value":"redemptionCount"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}}]}}]} as unknown as DocumentNode<GetAdminCouponQuery, GetAdminCouponQueryVariables>;
export const CreateCouponDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"CreateCoupon"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"CreateCouponInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"createCoupon"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"CouponFields"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"CouponFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Coupon"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"storeId"}},{"kind":"Field","name":{"kind":"Name","value":"code"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"discountType"}},{"kind":"Field","name":{"kind":"Name","value":"discountValue"}},{"kind":"Field","name":{"kind":"Name","value":"minimumPurchaseAmount"}},{"kind":"Field","name":{"kind":"Name","value":"maximumDiscountAmount"}},{"kind":"Field","name":{"kind":"Name","value":"usageLimit"}},{"kind":"Field","name":{"kind":"Name","value":"usageLimitPerUser"}},{"kind":"Field","name":{"kind":"Name","value":"validFrom"}},{"kind":"Field","name":{"kind":"Name","value":"validUntil"}},{"kind":"Field","name":{"kind":"Name","value":"isActive"}},{"kind":"Field","name":{"kind":"Name","value":"redemptionCount"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}}]}}]} as unknown as DocumentNode<CreateCouponMutation, CreateCouponMutationVariables>;
export const UpdateCouponDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"UpdateCoupon"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"UpdateCouponInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"updateCoupon"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"CouponFields"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"CouponFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Coupon"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"storeId"}},{"kind":"Field","name":{"kind":"Name","value":"code"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"discountType"}},{"kind":"Field","name":{"kind":"Name","value":"discountValue"}},{"kind":"Field","name":{"kind":"Name","value":"minimumPurchaseAmount"}},{"kind":"Field","name":{"kind":"Name","value":"maximumDiscountAmount"}},{"kind":"Field","name":{"kind":"Name","value":"usageLimit"}},{"kind":"Field","name":{"kind":"Name","value":"usageLimitPerUser"}},{"kind":"Field","name":{"kind":"Name","value":"validFrom"}},{"kind":"Field","name":{"kind":"Name","value":"validUntil"}},{"kind":"Field","name":{"kind":"Name","value":"isActive"}},{"kind":"Field","name":{"kind":"Name","value":"redemptionCount"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}}]}}]} as unknown as DocumentNode<UpdateCouponMutation, UpdateCouponMutationVariables>;
export const RemoveCouponDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"RemoveCoupon"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"removeCoupon"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}}]}}]} as unknown as DocumentNode<RemoveCouponMutation, RemoveCouponMutationVariables>;
export const ValidateCouponDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"ValidateCoupon"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ValidateCouponInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"validateCoupon"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"isValid"}},{"kind":"Field","name":{"kind":"Name","value":"reason"}},{"kind":"Field","name":{"kind":"Name","value":"discountAmount"}},{"kind":"Field","name":{"kind":"Name","value":"subtotal"}},{"kind":"Field","name":{"kind":"Name","value":"subtotalInclTax"}},{"kind":"Field","name":{"kind":"Name","value":"discountInclTax"}},{"kind":"Field","name":{"kind":"Name","value":"customerTotal"}},{"kind":"Field","name":{"kind":"Name","value":"coupon"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"CouponFields"}}]}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"CouponFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Coupon"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"storeId"}},{"kind":"Field","name":{"kind":"Name","value":"code"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"discountType"}},{"kind":"Field","name":{"kind":"Name","value":"discountValue"}},{"kind":"Field","name":{"kind":"Name","value":"minimumPurchaseAmount"}},{"kind":"Field","name":{"kind":"Name","value":"maximumDiscountAmount"}},{"kind":"Field","name":{"kind":"Name","value":"usageLimit"}},{"kind":"Field","name":{"kind":"Name","value":"usageLimitPerUser"}},{"kind":"Field","name":{"kind":"Name","value":"validFrom"}},{"kind":"Field","name":{"kind":"Name","value":"validUntil"}},{"kind":"Field","name":{"kind":"Name","value":"isActive"}},{"kind":"Field","name":{"kind":"Name","value":"redemptionCount"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}}]}}]} as unknown as DocumentNode<ValidateCouponMutation, ValidateCouponMutationVariables>;
export const GetAdminCustomersDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetAdminCustomers"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"status"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"search"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"includeDeleted"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Boolean"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"page"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"pageSize"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"adminCustomers"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"status"},"value":{"kind":"Variable","name":{"kind":"Name","value":"status"}}},{"kind":"Argument","name":{"kind":"Name","value":"search"},"value":{"kind":"Variable","name":{"kind":"Name","value":"search"}}},{"kind":"Argument","name":{"kind":"Name","value":"includeDeleted"},"value":{"kind":"Variable","name":{"kind":"Name","value":"includeDeleted"}}},{"kind":"Argument","name":{"kind":"Name","value":"page"},"value":{"kind":"Variable","name":{"kind":"Name","value":"page"}}},{"kind":"Argument","name":{"kind":"Name","value":"pageSize"},"value":{"kind":"Variable","name":{"kind":"Name","value":"pageSize"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"items"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"AdminCustomerFields"}}]}},{"kind":"Field","name":{"kind":"Name","value":"totalCount"}},{"kind":"Field","name":{"kind":"Name","value":"totalPages"}},{"kind":"Field","name":{"kind":"Name","value":"currentPage"}},{"kind":"Field","name":{"kind":"Name","value":"pageSize"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"AdminCustomerFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"AdminCustomer"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"userId"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"email"}},{"kind":"Field","name":{"kind":"Name","value":"phone"}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"emailVerifiedAt"}},{"kind":"Field","name":{"kind":"Name","value":"lastLoginAt"}},{"kind":"Field","name":{"kind":"Name","value":"userCreatedAt"}},{"kind":"Field","name":{"kind":"Name","value":"marketingOptIn"}},{"kind":"Field","name":{"kind":"Name","value":"preferredCurrency"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}},{"kind":"Field","name":{"kind":"Name","value":"deletedAt"}}]}}]} as unknown as DocumentNode<GetAdminCustomersQuery, GetAdminCustomersQueryVariables>;
export const GetAdminCustomerDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetAdminCustomer"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"adminCustomer"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"AdminCustomerFields"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"AdminCustomerFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"AdminCustomer"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"userId"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"email"}},{"kind":"Field","name":{"kind":"Name","value":"phone"}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"emailVerifiedAt"}},{"kind":"Field","name":{"kind":"Name","value":"lastLoginAt"}},{"kind":"Field","name":{"kind":"Name","value":"userCreatedAt"}},{"kind":"Field","name":{"kind":"Name","value":"marketingOptIn"}},{"kind":"Field","name":{"kind":"Name","value":"preferredCurrency"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}},{"kind":"Field","name":{"kind":"Name","value":"deletedAt"}}]}}]} as unknown as DocumentNode<GetAdminCustomerQuery, GetAdminCustomerQueryVariables>;
export const UpdateCustomerDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"UpdateCustomer"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"UpdateCustomerInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"updateCustomer"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"AdminCustomerFields"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"AdminCustomerFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"AdminCustomer"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"userId"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"email"}},{"kind":"Field","name":{"kind":"Name","value":"phone"}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"emailVerifiedAt"}},{"kind":"Field","name":{"kind":"Name","value":"lastLoginAt"}},{"kind":"Field","name":{"kind":"Name","value":"userCreatedAt"}},{"kind":"Field","name":{"kind":"Name","value":"marketingOptIn"}},{"kind":"Field","name":{"kind":"Name","value":"preferredCurrency"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}},{"kind":"Field","name":{"kind":"Name","value":"deletedAt"}}]}}]} as unknown as DocumentNode<UpdateCustomerMutation, UpdateCustomerMutationVariables>;
export const SoftDeleteCustomerDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"SoftDeleteCustomer"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"softDeleteCustomer"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"AdminCustomerFields"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"AdminCustomerFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"AdminCustomer"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"userId"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"email"}},{"kind":"Field","name":{"kind":"Name","value":"phone"}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"emailVerifiedAt"}},{"kind":"Field","name":{"kind":"Name","value":"lastLoginAt"}},{"kind":"Field","name":{"kind":"Name","value":"userCreatedAt"}},{"kind":"Field","name":{"kind":"Name","value":"marketingOptIn"}},{"kind":"Field","name":{"kind":"Name","value":"preferredCurrency"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}},{"kind":"Field","name":{"kind":"Name","value":"deletedAt"}}]}}]} as unknown as DocumentNode<SoftDeleteCustomerMutation, SoftDeleteCustomerMutationVariables>;
export const RestoreCustomerDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"RestoreCustomer"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"restoreCustomer"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"AdminCustomerFields"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"AdminCustomerFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"AdminCustomer"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"userId"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"email"}},{"kind":"Field","name":{"kind":"Name","value":"phone"}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"emailVerifiedAt"}},{"kind":"Field","name":{"kind":"Name","value":"lastLoginAt"}},{"kind":"Field","name":{"kind":"Name","value":"userCreatedAt"}},{"kind":"Field","name":{"kind":"Name","value":"marketingOptIn"}},{"kind":"Field","name":{"kind":"Name","value":"preferredCurrency"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}},{"kind":"Field","name":{"kind":"Name","value":"deletedAt"}}]}}]} as unknown as DocumentNode<RestoreCustomerMutation, RestoreCustomerMutationVariables>;
export const GetEmailSettingDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetEmailSetting"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"emailSetting"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"mailer"}},{"kind":"Field","name":{"kind":"Name","value":"host"}},{"kind":"Field","name":{"kind":"Name","value":"port"}},{"kind":"Field","name":{"kind":"Name","value":"username"}},{"kind":"Field","name":{"kind":"Name","value":"encryption"}},{"kind":"Field","name":{"kind":"Name","value":"senderName"}},{"kind":"Field","name":{"kind":"Name","value":"senderEmail"}},{"kind":"Field","name":{"kind":"Name","value":"localDomain"}},{"kind":"Field","name":{"kind":"Name","value":"isConfigured"}},{"kind":"Field","name":{"kind":"Name","value":"hasPassword"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}}]}}]}}]} as unknown as DocumentNode<GetEmailSettingQuery, GetEmailSettingQueryVariables>;
export const UpdateEmailSettingDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"UpdateEmailSetting"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"UpdateEmailSettingInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"updateEmailSetting"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"mailer"}},{"kind":"Field","name":{"kind":"Name","value":"host"}},{"kind":"Field","name":{"kind":"Name","value":"port"}},{"kind":"Field","name":{"kind":"Name","value":"username"}},{"kind":"Field","name":{"kind":"Name","value":"encryption"}},{"kind":"Field","name":{"kind":"Name","value":"senderName"}},{"kind":"Field","name":{"kind":"Name","value":"senderEmail"}},{"kind":"Field","name":{"kind":"Name","value":"localDomain"}},{"kind":"Field","name":{"kind":"Name","value":"isConfigured"}},{"kind":"Field","name":{"kind":"Name","value":"hasPassword"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}}]}}]}}]} as unknown as DocumentNode<UpdateEmailSettingMutation, UpdateEmailSettingMutationVariables>;
export const GetEmailTemplatesDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetEmailTemplates"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"emailTemplates"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"key"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"category"}},{"kind":"Field","name":{"kind":"Name","value":"subject"}},{"kind":"Field","name":{"kind":"Name","value":"variables"}},{"kind":"Field","name":{"kind":"Name","value":"isEnabled"}},{"kind":"Field","name":{"kind":"Name","value":"isSystem"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}}]}}]}}]} as unknown as DocumentNode<GetEmailTemplatesQuery, GetEmailTemplatesQueryVariables>;
export const GetEmailTemplateDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetEmailTemplate"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"emailTemplate"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"key"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"category"}},{"kind":"Field","name":{"kind":"Name","value":"subject"}},{"kind":"Field","name":{"kind":"Name","value":"htmlBody"}},{"kind":"Field","name":{"kind":"Name","value":"textBody"}},{"kind":"Field","name":{"kind":"Name","value":"variables"}},{"kind":"Field","name":{"kind":"Name","value":"isEnabled"}},{"kind":"Field","name":{"kind":"Name","value":"isSystem"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}}]}}]}}]} as unknown as DocumentNode<GetEmailTemplateQuery, GetEmailTemplateQueryVariables>;
export const UpdateEmailTemplateDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"UpdateEmailTemplate"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"UpdateEmailTemplateInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"updateEmailTemplate"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"key"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"category"}},{"kind":"Field","name":{"kind":"Name","value":"subject"}},{"kind":"Field","name":{"kind":"Name","value":"htmlBody"}},{"kind":"Field","name":{"kind":"Name","value":"textBody"}},{"kind":"Field","name":{"kind":"Name","value":"variables"}},{"kind":"Field","name":{"kind":"Name","value":"isEnabled"}},{"kind":"Field","name":{"kind":"Name","value":"isSystem"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}}]}}]}}]} as unknown as DocumentNode<UpdateEmailTemplateMutation, UpdateEmailTemplateMutationVariables>;
export const SendTestEmailDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"SendTestEmail"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"SendTestEmailInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"sendTestEmail"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"success"}},{"kind":"Field","name":{"kind":"Name","value":"message"}}]}}]}}]} as unknown as DocumentNode<SendTestEmailMutation, SendTestEmailMutationVariables>;
export const PresignImageUploadDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"PresignImageUpload"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"presignUploadInput"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"PresignUploadInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"presignImageUpload"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"presignUploadInput"},"value":{"kind":"Variable","name":{"kind":"Name","value":"presignUploadInput"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"uploadUrl"}},{"kind":"Field","name":{"kind":"Name","value":"method"}},{"kind":"Field","name":{"kind":"Name","value":"fields"}},{"kind":"Field","name":{"kind":"Name","value":"externalId"}},{"kind":"Field","name":{"kind":"Name","value":"expiresIn"}},{"kind":"Field","name":{"kind":"Name","value":"provider"}}]}}]}}]} as unknown as DocumentNode<PresignImageUploadMutation, PresignImageUploadMutationVariables>;
export const ConfirmImageUploadDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"ConfirmImageUpload"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"confirmUploadInput"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ConfirmUploadInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"confirmImageUpload"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"confirmUploadInput"},"value":{"kind":"Variable","name":{"kind":"Name","value":"confirmUploadInput"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"ImageFields"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"ImageFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Image"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"provider"}},{"kind":"Field","name":{"kind":"Name","value":"externalId"}},{"kind":"Field","name":{"kind":"Name","value":"url"}},{"kind":"Field","name":{"kind":"Name","value":"format"}},{"kind":"Field","name":{"kind":"Name","value":"width"}},{"kind":"Field","name":{"kind":"Name","value":"height"}},{"kind":"Field","name":{"kind":"Name","value":"sizeBytes"}},{"kind":"Field","name":{"kind":"Name","value":"ownerType"}},{"kind":"Field","name":{"kind":"Name","value":"ownerId"}},{"kind":"Field","name":{"kind":"Name","value":"purpose"}},{"kind":"Field","name":{"kind":"Name","value":"alt"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}}]}}]} as unknown as DocumentNode<ConfirmImageUploadMutation, ConfirmImageUploadMutationVariables>;
export const DeleteImageDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"DeleteImage"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"deleteImage"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"ImageFields"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"ImageFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Image"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"provider"}},{"kind":"Field","name":{"kind":"Name","value":"externalId"}},{"kind":"Field","name":{"kind":"Name","value":"url"}},{"kind":"Field","name":{"kind":"Name","value":"format"}},{"kind":"Field","name":{"kind":"Name","value":"width"}},{"kind":"Field","name":{"kind":"Name","value":"height"}},{"kind":"Field","name":{"kind":"Name","value":"sizeBytes"}},{"kind":"Field","name":{"kind":"Name","value":"ownerType"}},{"kind":"Field","name":{"kind":"Name","value":"ownerId"}},{"kind":"Field","name":{"kind":"Name","value":"purpose"}},{"kind":"Field","name":{"kind":"Name","value":"alt"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}}]}}]} as unknown as DocumentNode<DeleteImageMutation, DeleteImageMutationVariables>;
export const GetMyInventoryDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetMyInventory"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"storeId"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"warehouseId"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"productId"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"lowStockOnly"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Boolean"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"search"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"myInventory"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"storeId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"storeId"}}},{"kind":"Argument","name":{"kind":"Name","value":"warehouseId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"warehouseId"}}},{"kind":"Argument","name":{"kind":"Name","value":"productId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"productId"}}},{"kind":"Argument","name":{"kind":"Name","value":"lowStockOnly"},"value":{"kind":"Variable","name":{"kind":"Name","value":"lowStockOnly"}}},{"kind":"Argument","name":{"kind":"Name","value":"search"},"value":{"kind":"Variable","name":{"kind":"Name","value":"search"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"InventoryFields"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"InventoryFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Inventory"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"variantId"}},{"kind":"Field","name":{"kind":"Name","value":"warehouseId"}},{"kind":"Field","name":{"kind":"Name","value":"quantityAvailable"}},{"kind":"Field","name":{"kind":"Name","value":"quantityReserved"}},{"kind":"Field","name":{"kind":"Name","value":"quantityOnHand"}},{"kind":"Field","name":{"kind":"Name","value":"reorderPoint"}},{"kind":"Field","name":{"kind":"Name","value":"reorderQuantity"}},{"kind":"Field","name":{"kind":"Name","value":"lastCountedAt"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}},{"kind":"Field","name":{"kind":"Name","value":"stockState"}},{"kind":"Field","name":{"kind":"Name","value":"warehouse"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"code"}},{"kind":"Field","name":{"kind":"Name","value":"isDefault"}},{"kind":"Field","name":{"kind":"Name","value":"storeId"}}]}},{"kind":"Field","name":{"kind":"Name","value":"variant"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"productId"}},{"kind":"Field","name":{"kind":"Name","value":"sku"}},{"kind":"Field","name":{"kind":"Name","value":"imageUrl"}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"attributes"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"attributeId"}},{"kind":"Field","name":{"kind":"Name","value":"attributeValueId"}},{"kind":"Field","name":{"kind":"Name","value":"attributeName"}},{"kind":"Field","name":{"kind":"Name","value":"attributeSlug"}},{"kind":"Field","name":{"kind":"Name","value":"value"}},{"kind":"Field","name":{"kind":"Name","value":"valueSlug"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"product"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"slug"}},{"kind":"Field","name":{"kind":"Name","value":"storeId"}}]}}]}}]} as unknown as DocumentNode<GetMyInventoryQuery, GetMyInventoryQueryVariables>;
export const GetMyInventoryByVariantDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetMyInventoryByVariant"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"variantId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"warehouseId"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"myInventoryByVariant"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"variantId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"variantId"}}},{"kind":"Argument","name":{"kind":"Name","value":"warehouseId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"warehouseId"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"InventoryFields"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"InventoryFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Inventory"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"variantId"}},{"kind":"Field","name":{"kind":"Name","value":"warehouseId"}},{"kind":"Field","name":{"kind":"Name","value":"quantityAvailable"}},{"kind":"Field","name":{"kind":"Name","value":"quantityReserved"}},{"kind":"Field","name":{"kind":"Name","value":"quantityOnHand"}},{"kind":"Field","name":{"kind":"Name","value":"reorderPoint"}},{"kind":"Field","name":{"kind":"Name","value":"reorderQuantity"}},{"kind":"Field","name":{"kind":"Name","value":"lastCountedAt"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}},{"kind":"Field","name":{"kind":"Name","value":"stockState"}},{"kind":"Field","name":{"kind":"Name","value":"warehouse"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"code"}},{"kind":"Field","name":{"kind":"Name","value":"isDefault"}},{"kind":"Field","name":{"kind":"Name","value":"storeId"}}]}},{"kind":"Field","name":{"kind":"Name","value":"variant"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"productId"}},{"kind":"Field","name":{"kind":"Name","value":"sku"}},{"kind":"Field","name":{"kind":"Name","value":"imageUrl"}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"attributes"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"attributeId"}},{"kind":"Field","name":{"kind":"Name","value":"attributeValueId"}},{"kind":"Field","name":{"kind":"Name","value":"attributeName"}},{"kind":"Field","name":{"kind":"Name","value":"attributeSlug"}},{"kind":"Field","name":{"kind":"Name","value":"value"}},{"kind":"Field","name":{"kind":"Name","value":"valueSlug"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"product"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"slug"}},{"kind":"Field","name":{"kind":"Name","value":"storeId"}}]}}]}}]} as unknown as DocumentNode<GetMyInventoryByVariantQuery, GetMyInventoryByVariantQueryVariables>;
export const GetMyInventoryMovementsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetMyInventoryMovements"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"variantId"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"warehouseId"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"limit"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"myInventoryMovements"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"variantId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"variantId"}}},{"kind":"Argument","name":{"kind":"Name","value":"warehouseId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"warehouseId"}}},{"kind":"Argument","name":{"kind":"Name","value":"limit"},"value":{"kind":"Variable","name":{"kind":"Name","value":"limit"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"InventoryMovementFields"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"InventoryMovementFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"InventoryMovement"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"inventoryId"}},{"kind":"Field","name":{"kind":"Name","value":"variantId"}},{"kind":"Field","name":{"kind":"Name","value":"warehouseId"}},{"kind":"Field","name":{"kind":"Name","value":"movementType"}},{"kind":"Field","name":{"kind":"Name","value":"quantityChange"}},{"kind":"Field","name":{"kind":"Name","value":"quantityBefore"}},{"kind":"Field","name":{"kind":"Name","value":"quantityAfter"}},{"kind":"Field","name":{"kind":"Name","value":"referenceType"}},{"kind":"Field","name":{"kind":"Name","value":"referenceId"}},{"kind":"Field","name":{"kind":"Name","value":"notes"}},{"kind":"Field","name":{"kind":"Name","value":"createdById"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}}]}}]} as unknown as DocumentNode<GetMyInventoryMovementsQuery, GetMyInventoryMovementsQueryVariables>;
export const GetAdminInventoryByProductDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetAdminInventoryByProduct"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"productId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"adminInventoryByProduct"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"productId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"productId"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"InventoryFields"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"InventoryFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Inventory"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"variantId"}},{"kind":"Field","name":{"kind":"Name","value":"warehouseId"}},{"kind":"Field","name":{"kind":"Name","value":"quantityAvailable"}},{"kind":"Field","name":{"kind":"Name","value":"quantityReserved"}},{"kind":"Field","name":{"kind":"Name","value":"quantityOnHand"}},{"kind":"Field","name":{"kind":"Name","value":"reorderPoint"}},{"kind":"Field","name":{"kind":"Name","value":"reorderQuantity"}},{"kind":"Field","name":{"kind":"Name","value":"lastCountedAt"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}},{"kind":"Field","name":{"kind":"Name","value":"stockState"}},{"kind":"Field","name":{"kind":"Name","value":"warehouse"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"code"}},{"kind":"Field","name":{"kind":"Name","value":"isDefault"}},{"kind":"Field","name":{"kind":"Name","value":"storeId"}}]}},{"kind":"Field","name":{"kind":"Name","value":"variant"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"productId"}},{"kind":"Field","name":{"kind":"Name","value":"sku"}},{"kind":"Field","name":{"kind":"Name","value":"imageUrl"}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"attributes"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"attributeId"}},{"kind":"Field","name":{"kind":"Name","value":"attributeValueId"}},{"kind":"Field","name":{"kind":"Name","value":"attributeName"}},{"kind":"Field","name":{"kind":"Name","value":"attributeSlug"}},{"kind":"Field","name":{"kind":"Name","value":"value"}},{"kind":"Field","name":{"kind":"Name","value":"valueSlug"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"product"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"slug"}},{"kind":"Field","name":{"kind":"Name","value":"storeId"}}]}}]}}]} as unknown as DocumentNode<GetAdminInventoryByProductQuery, GetAdminInventoryByProductQueryVariables>;
export const AdjustMyInventoryDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"AdjustMyInventory"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"adjustInventoryInput"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"AdjustInventoryInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"adjustMyInventory"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"adjustInventoryInput"},"value":{"kind":"Variable","name":{"kind":"Name","value":"adjustInventoryInput"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"InventoryFields"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"InventoryFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Inventory"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"variantId"}},{"kind":"Field","name":{"kind":"Name","value":"warehouseId"}},{"kind":"Field","name":{"kind":"Name","value":"quantityAvailable"}},{"kind":"Field","name":{"kind":"Name","value":"quantityReserved"}},{"kind":"Field","name":{"kind":"Name","value":"quantityOnHand"}},{"kind":"Field","name":{"kind":"Name","value":"reorderPoint"}},{"kind":"Field","name":{"kind":"Name","value":"reorderQuantity"}},{"kind":"Field","name":{"kind":"Name","value":"lastCountedAt"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}},{"kind":"Field","name":{"kind":"Name","value":"stockState"}},{"kind":"Field","name":{"kind":"Name","value":"warehouse"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"code"}},{"kind":"Field","name":{"kind":"Name","value":"isDefault"}},{"kind":"Field","name":{"kind":"Name","value":"storeId"}}]}},{"kind":"Field","name":{"kind":"Name","value":"variant"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"productId"}},{"kind":"Field","name":{"kind":"Name","value":"sku"}},{"kind":"Field","name":{"kind":"Name","value":"imageUrl"}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"attributes"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"attributeId"}},{"kind":"Field","name":{"kind":"Name","value":"attributeValueId"}},{"kind":"Field","name":{"kind":"Name","value":"attributeName"}},{"kind":"Field","name":{"kind":"Name","value":"attributeSlug"}},{"kind":"Field","name":{"kind":"Name","value":"value"}},{"kind":"Field","name":{"kind":"Name","value":"valueSlug"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"product"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"slug"}},{"kind":"Field","name":{"kind":"Name","value":"storeId"}}]}}]}}]} as unknown as DocumentNode<AdjustMyInventoryMutation, AdjustMyInventoryMutationVariables>;
export const SetMyReorderPointDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"SetMyReorderPoint"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"setReorderPointInput"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"SetReorderPointInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"setMyReorderPoint"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"setReorderPointInput"},"value":{"kind":"Variable","name":{"kind":"Name","value":"setReorderPointInput"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"InventoryFields"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"InventoryFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Inventory"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"variantId"}},{"kind":"Field","name":{"kind":"Name","value":"warehouseId"}},{"kind":"Field","name":{"kind":"Name","value":"quantityAvailable"}},{"kind":"Field","name":{"kind":"Name","value":"quantityReserved"}},{"kind":"Field","name":{"kind":"Name","value":"quantityOnHand"}},{"kind":"Field","name":{"kind":"Name","value":"reorderPoint"}},{"kind":"Field","name":{"kind":"Name","value":"reorderQuantity"}},{"kind":"Field","name":{"kind":"Name","value":"lastCountedAt"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}},{"kind":"Field","name":{"kind":"Name","value":"stockState"}},{"kind":"Field","name":{"kind":"Name","value":"warehouse"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"code"}},{"kind":"Field","name":{"kind":"Name","value":"isDefault"}},{"kind":"Field","name":{"kind":"Name","value":"storeId"}}]}},{"kind":"Field","name":{"kind":"Name","value":"variant"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"productId"}},{"kind":"Field","name":{"kind":"Name","value":"sku"}},{"kind":"Field","name":{"kind":"Name","value":"imageUrl"}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"attributes"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"attributeId"}},{"kind":"Field","name":{"kind":"Name","value":"attributeValueId"}},{"kind":"Field","name":{"kind":"Name","value":"attributeName"}},{"kind":"Field","name":{"kind":"Name","value":"attributeSlug"}},{"kind":"Field","name":{"kind":"Name","value":"value"}},{"kind":"Field","name":{"kind":"Name","value":"valueSlug"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"product"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"slug"}},{"kind":"Field","name":{"kind":"Name","value":"storeId"}}]}}]}}]} as unknown as DocumentNode<SetMyReorderPointMutation, SetMyReorderPointMutationVariables>;
export const GetPublicMenuDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetPublicMenu"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"location"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"MenuLocation"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"publicMenu"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"location"},"value":{"kind":"Variable","name":{"kind":"Name","value":"location"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"MenuFields"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"MenuFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Menu"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"location"}},{"kind":"Field","name":{"kind":"Name","value":"isActive"}},{"kind":"Field","name":{"kind":"Name","value":"items"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}}]}}]} as unknown as DocumentNode<GetPublicMenuQuery, GetPublicMenuQueryVariables>;
export const GetAdminMenusDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetAdminMenus"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"adminMenus"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"MenuFields"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"MenuFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Menu"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"location"}},{"kind":"Field","name":{"kind":"Name","value":"isActive"}},{"kind":"Field","name":{"kind":"Name","value":"items"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}}]}}]} as unknown as DocumentNode<GetAdminMenusQuery, GetAdminMenusQueryVariables>;
export const GetAdminMenuDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetAdminMenu"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"location"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"MenuLocation"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"adminMenu"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"location"},"value":{"kind":"Variable","name":{"kind":"Name","value":"location"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"MenuFields"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"MenuFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Menu"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"location"}},{"kind":"Field","name":{"kind":"Name","value":"isActive"}},{"kind":"Field","name":{"kind":"Name","value":"items"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}}]}}]} as unknown as DocumentNode<GetAdminMenuQuery, GetAdminMenuQueryVariables>;
export const UpsertMenuDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"UpsertMenu"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"upsertMenuInput"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"UpsertMenuInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"upsertMenu"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"upsertMenuInput"},"value":{"kind":"Variable","name":{"kind":"Name","value":"upsertMenuInput"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"MenuFields"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"MenuFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Menu"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"location"}},{"kind":"Field","name":{"kind":"Name","value":"isActive"}},{"kind":"Field","name":{"kind":"Name","value":"items"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}}]}}]} as unknown as DocumentNode<UpsertMenuMutation, UpsertMenuMutationVariables>;
export const SetMenuActiveDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"SetMenuActive"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"location"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"MenuLocation"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"isActive"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Boolean"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"setMenuActive"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"location"},"value":{"kind":"Variable","name":{"kind":"Name","value":"location"}}},{"kind":"Argument","name":{"kind":"Name","value":"isActive"},"value":{"kind":"Variable","name":{"kind":"Name","value":"isActive"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"MenuFields"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"MenuFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Menu"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"location"}},{"kind":"Field","name":{"kind":"Name","value":"isActive"}},{"kind":"Field","name":{"kind":"Name","value":"items"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}}]}}]} as unknown as DocumentNode<SetMenuActiveMutation, SetMenuActiveMutationVariables>;
export const RemoveMenuDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"RemoveMenu"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"location"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"MenuLocation"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"removeMenu"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"location"},"value":{"kind":"Variable","name":{"kind":"Name","value":"location"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"MenuFields"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"MenuFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Menu"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"location"}},{"kind":"Field","name":{"kind":"Name","value":"isActive"}},{"kind":"Field","name":{"kind":"Name","value":"items"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}}]}}]} as unknown as DocumentNode<RemoveMenuMutation, RemoveMenuMutationVariables>;
export const SubscribeToNewsletterDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"SubscribeToNewsletter"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"SubscribeNewsletterInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"subscribeToNewsletter"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"ok"}},{"kind":"Field","name":{"kind":"Name","value":"message"}}]}}]}}]} as unknown as DocumentNode<SubscribeToNewsletterMutation, SubscribeToNewsletterMutationVariables>;
export const GetAdminNewsletterSubscriptionsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetAdminNewsletterSubscriptions"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"status"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"NewsletterStatus"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"page"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"pageSize"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"search"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"adminNewsletterSubscriptions"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"status"},"value":{"kind":"Variable","name":{"kind":"Name","value":"status"}}},{"kind":"Argument","name":{"kind":"Name","value":"page"},"value":{"kind":"Variable","name":{"kind":"Name","value":"page"}}},{"kind":"Argument","name":{"kind":"Name","value":"pageSize"},"value":{"kind":"Variable","name":{"kind":"Name","value":"pageSize"}}},{"kind":"Argument","name":{"kind":"Name","value":"search"},"value":{"kind":"Variable","name":{"kind":"Name","value":"search"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"items"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"NewsletterFields"}}]}},{"kind":"Field","name":{"kind":"Name","value":"totalCount"}},{"kind":"Field","name":{"kind":"Name","value":"totalPages"}},{"kind":"Field","name":{"kind":"Name","value":"currentPage"}},{"kind":"Field","name":{"kind":"Name","value":"pageSize"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"NewsletterFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"NewsletterSubscription"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"email"}},{"kind":"Field","name":{"kind":"Name","value":"source"}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"unsubscribedAt"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}}]}}]} as unknown as DocumentNode<GetAdminNewsletterSubscriptionsQuery, GetAdminNewsletterSubscriptionsQueryVariables>;
export const UnsubscribeNewsletterDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"UnsubscribeNewsletter"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"unsubscribeNewsletter"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"NewsletterFields"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"NewsletterFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"NewsletterSubscription"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"email"}},{"kind":"Field","name":{"kind":"Name","value":"source"}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"unsubscribedAt"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}}]}}]} as unknown as DocumentNode<UnsubscribeNewsletterMutation, UnsubscribeNewsletterMutationVariables>;
export const GetMyOrdersDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetMyOrders"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"status"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"OrderStatus"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"page"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"pageSize"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"myOrders"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"status"},"value":{"kind":"Variable","name":{"kind":"Name","value":"status"}}},{"kind":"Argument","name":{"kind":"Name","value":"page"},"value":{"kind":"Variable","name":{"kind":"Name","value":"page"}}},{"kind":"Argument","name":{"kind":"Name","value":"pageSize"},"value":{"kind":"Variable","name":{"kind":"Name","value":"pageSize"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"items"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"OrderFields"}}]}},{"kind":"Field","name":{"kind":"Name","value":"totalCount"}},{"kind":"Field","name":{"kind":"Name","value":"totalPages"}},{"kind":"Field","name":{"kind":"Name","value":"currentPage"}},{"kind":"Field","name":{"kind":"Name","value":"pageSize"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"OrderItemFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"OrderItem"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"orderId"}},{"kind":"Field","name":{"kind":"Name","value":"sellerOrderId"}},{"kind":"Field","name":{"kind":"Name","value":"productId"}},{"kind":"Field","name":{"kind":"Name","value":"variantId"}},{"kind":"Field","name":{"kind":"Name","value":"storeId"}},{"kind":"Field","name":{"kind":"Name","value":"sku"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"variantName"}},{"kind":"Field","name":{"kind":"Name","value":"quantity"}},{"kind":"Field","name":{"kind":"Name","value":"unitPrice"}},{"kind":"Field","name":{"kind":"Name","value":"totalPrice"}},{"kind":"Field","name":{"kind":"Name","value":"taxAmount"}},{"kind":"Field","name":{"kind":"Name","value":"discountAmount"}},{"kind":"Field","name":{"kind":"Name","value":"attributesSnapshot"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"attributeName"}},{"kind":"Field","name":{"kind":"Name","value":"value"}}]}},{"kind":"Field","name":{"kind":"Name","value":"imageUrlSnapshot"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"StatusHistoryFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"OrderStatusHistoryEntry"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"fromStatus"}},{"kind":"Field","name":{"kind":"Name","value":"toStatus"}},{"kind":"Field","name":{"kind":"Name","value":"changedById"}},{"kind":"Field","name":{"kind":"Name","value":"notes"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"OrderAddressFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"OrderAddressSnapshot"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"firstName"}},{"kind":"Field","name":{"kind":"Name","value":"lastName"}},{"kind":"Field","name":{"kind":"Name","value":"phone"}},{"kind":"Field","name":{"kind":"Name","value":"addressLine1"}},{"kind":"Field","name":{"kind":"Name","value":"addressLine2"}},{"kind":"Field","name":{"kind":"Name","value":"city"}},{"kind":"Field","name":{"kind":"Name","value":"state"}},{"kind":"Field","name":{"kind":"Name","value":"postalCode"}},{"kind":"Field","name":{"kind":"Name","value":"countryCode"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"SellerOrderFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"SellerOrder"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"orderId"}},{"kind":"Field","name":{"kind":"Name","value":"sellerId"}},{"kind":"Field","name":{"kind":"Name","value":"storeId"}},{"kind":"Field","name":{"kind":"Name","value":"orderNumber"}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"paymentStatus"}},{"kind":"Field","name":{"kind":"Name","value":"payoutStatus"}},{"kind":"Field","name":{"kind":"Name","value":"subtotal"}},{"kind":"Field","name":{"kind":"Name","value":"taxAmount"}},{"kind":"Field","name":{"kind":"Name","value":"shippingAmount"}},{"kind":"Field","name":{"kind":"Name","value":"discountAmount"}},{"kind":"Field","name":{"kind":"Name","value":"commissionAmount"}},{"kind":"Field","name":{"kind":"Name","value":"payoutAmount"}},{"kind":"Field","name":{"kind":"Name","value":"currencyCode"}},{"kind":"Field","name":{"kind":"Name","value":"packedAt"}},{"kind":"Field","name":{"kind":"Name","value":"shippedAt"}},{"kind":"Field","name":{"kind":"Name","value":"deliveredAt"}},{"kind":"Field","name":{"kind":"Name","value":"cancelledAt"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}},{"kind":"Field","name":{"kind":"Name","value":"itemCount"}},{"kind":"Field","name":{"kind":"Name","value":"storeName"}},{"kind":"Field","name":{"kind":"Name","value":"items"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"OrderItemFields"}}]}},{"kind":"Field","name":{"kind":"Name","value":"statusHistory"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"StatusHistoryFields"}}]}},{"kind":"Field","name":{"kind":"Name","value":"parentOrderNumber"}},{"kind":"Field","name":{"kind":"Name","value":"shippingAddress"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"OrderAddressFields"}}]}},{"kind":"Field","name":{"kind":"Name","value":"customerName"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"OrderFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Order"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"orderNumber"}},{"kind":"Field","name":{"kind":"Name","value":"customerId"}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"paymentStatus"}},{"kind":"Field","name":{"kind":"Name","value":"paymentMethod"}},{"kind":"Field","name":{"kind":"Name","value":"subtotal"}},{"kind":"Field","name":{"kind":"Name","value":"taxAmount"}},{"kind":"Field","name":{"kind":"Name","value":"shippingAmount"}},{"kind":"Field","name":{"kind":"Name","value":"discountAmount"}},{"kind":"Field","name":{"kind":"Name","value":"totalAmount"}},{"kind":"Field","name":{"kind":"Name","value":"currencyCode"}},{"kind":"Field","name":{"kind":"Name","value":"customerNotes"}},{"kind":"Field","name":{"kind":"Name","value":"placedAt"}},{"kind":"Field","name":{"kind":"Name","value":"cancelledAt"}},{"kind":"Field","name":{"kind":"Name","value":"deliveredAt"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}},{"kind":"Field","name":{"kind":"Name","value":"itemCount"}},{"kind":"Field","name":{"kind":"Name","value":"items"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"OrderItemFields"}}]}},{"kind":"Field","name":{"kind":"Name","value":"sellerOrders"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"SellerOrderFields"}}]}},{"kind":"Field","name":{"kind":"Name","value":"statusHistory"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"StatusHistoryFields"}}]}},{"kind":"Field","name":{"kind":"Name","value":"shippingAddress"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"OrderAddressFields"}}]}},{"kind":"Field","name":{"kind":"Name","value":"billingAddress"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"OrderAddressFields"}}]}}]}}]} as unknown as DocumentNode<GetMyOrdersQuery, GetMyOrdersQueryVariables>;
export const GetMyOrderDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetMyOrder"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"myOrder"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"OrderFields"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"OrderItemFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"OrderItem"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"orderId"}},{"kind":"Field","name":{"kind":"Name","value":"sellerOrderId"}},{"kind":"Field","name":{"kind":"Name","value":"productId"}},{"kind":"Field","name":{"kind":"Name","value":"variantId"}},{"kind":"Field","name":{"kind":"Name","value":"storeId"}},{"kind":"Field","name":{"kind":"Name","value":"sku"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"variantName"}},{"kind":"Field","name":{"kind":"Name","value":"quantity"}},{"kind":"Field","name":{"kind":"Name","value":"unitPrice"}},{"kind":"Field","name":{"kind":"Name","value":"totalPrice"}},{"kind":"Field","name":{"kind":"Name","value":"taxAmount"}},{"kind":"Field","name":{"kind":"Name","value":"discountAmount"}},{"kind":"Field","name":{"kind":"Name","value":"attributesSnapshot"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"attributeName"}},{"kind":"Field","name":{"kind":"Name","value":"value"}}]}},{"kind":"Field","name":{"kind":"Name","value":"imageUrlSnapshot"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"StatusHistoryFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"OrderStatusHistoryEntry"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"fromStatus"}},{"kind":"Field","name":{"kind":"Name","value":"toStatus"}},{"kind":"Field","name":{"kind":"Name","value":"changedById"}},{"kind":"Field","name":{"kind":"Name","value":"notes"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"OrderAddressFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"OrderAddressSnapshot"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"firstName"}},{"kind":"Field","name":{"kind":"Name","value":"lastName"}},{"kind":"Field","name":{"kind":"Name","value":"phone"}},{"kind":"Field","name":{"kind":"Name","value":"addressLine1"}},{"kind":"Field","name":{"kind":"Name","value":"addressLine2"}},{"kind":"Field","name":{"kind":"Name","value":"city"}},{"kind":"Field","name":{"kind":"Name","value":"state"}},{"kind":"Field","name":{"kind":"Name","value":"postalCode"}},{"kind":"Field","name":{"kind":"Name","value":"countryCode"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"SellerOrderFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"SellerOrder"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"orderId"}},{"kind":"Field","name":{"kind":"Name","value":"sellerId"}},{"kind":"Field","name":{"kind":"Name","value":"storeId"}},{"kind":"Field","name":{"kind":"Name","value":"orderNumber"}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"paymentStatus"}},{"kind":"Field","name":{"kind":"Name","value":"payoutStatus"}},{"kind":"Field","name":{"kind":"Name","value":"subtotal"}},{"kind":"Field","name":{"kind":"Name","value":"taxAmount"}},{"kind":"Field","name":{"kind":"Name","value":"shippingAmount"}},{"kind":"Field","name":{"kind":"Name","value":"discountAmount"}},{"kind":"Field","name":{"kind":"Name","value":"commissionAmount"}},{"kind":"Field","name":{"kind":"Name","value":"payoutAmount"}},{"kind":"Field","name":{"kind":"Name","value":"currencyCode"}},{"kind":"Field","name":{"kind":"Name","value":"packedAt"}},{"kind":"Field","name":{"kind":"Name","value":"shippedAt"}},{"kind":"Field","name":{"kind":"Name","value":"deliveredAt"}},{"kind":"Field","name":{"kind":"Name","value":"cancelledAt"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}},{"kind":"Field","name":{"kind":"Name","value":"itemCount"}},{"kind":"Field","name":{"kind":"Name","value":"storeName"}},{"kind":"Field","name":{"kind":"Name","value":"items"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"OrderItemFields"}}]}},{"kind":"Field","name":{"kind":"Name","value":"statusHistory"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"StatusHistoryFields"}}]}},{"kind":"Field","name":{"kind":"Name","value":"parentOrderNumber"}},{"kind":"Field","name":{"kind":"Name","value":"shippingAddress"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"OrderAddressFields"}}]}},{"kind":"Field","name":{"kind":"Name","value":"customerName"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"OrderFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Order"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"orderNumber"}},{"kind":"Field","name":{"kind":"Name","value":"customerId"}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"paymentStatus"}},{"kind":"Field","name":{"kind":"Name","value":"paymentMethod"}},{"kind":"Field","name":{"kind":"Name","value":"subtotal"}},{"kind":"Field","name":{"kind":"Name","value":"taxAmount"}},{"kind":"Field","name":{"kind":"Name","value":"shippingAmount"}},{"kind":"Field","name":{"kind":"Name","value":"discountAmount"}},{"kind":"Field","name":{"kind":"Name","value":"totalAmount"}},{"kind":"Field","name":{"kind":"Name","value":"currencyCode"}},{"kind":"Field","name":{"kind":"Name","value":"customerNotes"}},{"kind":"Field","name":{"kind":"Name","value":"placedAt"}},{"kind":"Field","name":{"kind":"Name","value":"cancelledAt"}},{"kind":"Field","name":{"kind":"Name","value":"deliveredAt"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}},{"kind":"Field","name":{"kind":"Name","value":"itemCount"}},{"kind":"Field","name":{"kind":"Name","value":"items"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"OrderItemFields"}}]}},{"kind":"Field","name":{"kind":"Name","value":"sellerOrders"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"SellerOrderFields"}}]}},{"kind":"Field","name":{"kind":"Name","value":"statusHistory"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"StatusHistoryFields"}}]}},{"kind":"Field","name":{"kind":"Name","value":"shippingAddress"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"OrderAddressFields"}}]}},{"kind":"Field","name":{"kind":"Name","value":"billingAddress"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"OrderAddressFields"}}]}}]}}]} as unknown as DocumentNode<GetMyOrderQuery, GetMyOrderQueryVariables>;
export const PlaceOrderDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"PlaceOrder"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"PlaceOrderInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"placeOrder"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"OrderFields"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"OrderItemFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"OrderItem"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"orderId"}},{"kind":"Field","name":{"kind":"Name","value":"sellerOrderId"}},{"kind":"Field","name":{"kind":"Name","value":"productId"}},{"kind":"Field","name":{"kind":"Name","value":"variantId"}},{"kind":"Field","name":{"kind":"Name","value":"storeId"}},{"kind":"Field","name":{"kind":"Name","value":"sku"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"variantName"}},{"kind":"Field","name":{"kind":"Name","value":"quantity"}},{"kind":"Field","name":{"kind":"Name","value":"unitPrice"}},{"kind":"Field","name":{"kind":"Name","value":"totalPrice"}},{"kind":"Field","name":{"kind":"Name","value":"taxAmount"}},{"kind":"Field","name":{"kind":"Name","value":"discountAmount"}},{"kind":"Field","name":{"kind":"Name","value":"attributesSnapshot"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"attributeName"}},{"kind":"Field","name":{"kind":"Name","value":"value"}}]}},{"kind":"Field","name":{"kind":"Name","value":"imageUrlSnapshot"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"StatusHistoryFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"OrderStatusHistoryEntry"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"fromStatus"}},{"kind":"Field","name":{"kind":"Name","value":"toStatus"}},{"kind":"Field","name":{"kind":"Name","value":"changedById"}},{"kind":"Field","name":{"kind":"Name","value":"notes"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"OrderAddressFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"OrderAddressSnapshot"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"firstName"}},{"kind":"Field","name":{"kind":"Name","value":"lastName"}},{"kind":"Field","name":{"kind":"Name","value":"phone"}},{"kind":"Field","name":{"kind":"Name","value":"addressLine1"}},{"kind":"Field","name":{"kind":"Name","value":"addressLine2"}},{"kind":"Field","name":{"kind":"Name","value":"city"}},{"kind":"Field","name":{"kind":"Name","value":"state"}},{"kind":"Field","name":{"kind":"Name","value":"postalCode"}},{"kind":"Field","name":{"kind":"Name","value":"countryCode"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"SellerOrderFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"SellerOrder"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"orderId"}},{"kind":"Field","name":{"kind":"Name","value":"sellerId"}},{"kind":"Field","name":{"kind":"Name","value":"storeId"}},{"kind":"Field","name":{"kind":"Name","value":"orderNumber"}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"paymentStatus"}},{"kind":"Field","name":{"kind":"Name","value":"payoutStatus"}},{"kind":"Field","name":{"kind":"Name","value":"subtotal"}},{"kind":"Field","name":{"kind":"Name","value":"taxAmount"}},{"kind":"Field","name":{"kind":"Name","value":"shippingAmount"}},{"kind":"Field","name":{"kind":"Name","value":"discountAmount"}},{"kind":"Field","name":{"kind":"Name","value":"commissionAmount"}},{"kind":"Field","name":{"kind":"Name","value":"payoutAmount"}},{"kind":"Field","name":{"kind":"Name","value":"currencyCode"}},{"kind":"Field","name":{"kind":"Name","value":"packedAt"}},{"kind":"Field","name":{"kind":"Name","value":"shippedAt"}},{"kind":"Field","name":{"kind":"Name","value":"deliveredAt"}},{"kind":"Field","name":{"kind":"Name","value":"cancelledAt"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}},{"kind":"Field","name":{"kind":"Name","value":"itemCount"}},{"kind":"Field","name":{"kind":"Name","value":"storeName"}},{"kind":"Field","name":{"kind":"Name","value":"items"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"OrderItemFields"}}]}},{"kind":"Field","name":{"kind":"Name","value":"statusHistory"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"StatusHistoryFields"}}]}},{"kind":"Field","name":{"kind":"Name","value":"parentOrderNumber"}},{"kind":"Field","name":{"kind":"Name","value":"shippingAddress"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"OrderAddressFields"}}]}},{"kind":"Field","name":{"kind":"Name","value":"customerName"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"OrderFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Order"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"orderNumber"}},{"kind":"Field","name":{"kind":"Name","value":"customerId"}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"paymentStatus"}},{"kind":"Field","name":{"kind":"Name","value":"paymentMethod"}},{"kind":"Field","name":{"kind":"Name","value":"subtotal"}},{"kind":"Field","name":{"kind":"Name","value":"taxAmount"}},{"kind":"Field","name":{"kind":"Name","value":"shippingAmount"}},{"kind":"Field","name":{"kind":"Name","value":"discountAmount"}},{"kind":"Field","name":{"kind":"Name","value":"totalAmount"}},{"kind":"Field","name":{"kind":"Name","value":"currencyCode"}},{"kind":"Field","name":{"kind":"Name","value":"customerNotes"}},{"kind":"Field","name":{"kind":"Name","value":"placedAt"}},{"kind":"Field","name":{"kind":"Name","value":"cancelledAt"}},{"kind":"Field","name":{"kind":"Name","value":"deliveredAt"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}},{"kind":"Field","name":{"kind":"Name","value":"itemCount"}},{"kind":"Field","name":{"kind":"Name","value":"items"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"OrderItemFields"}}]}},{"kind":"Field","name":{"kind":"Name","value":"sellerOrders"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"SellerOrderFields"}}]}},{"kind":"Field","name":{"kind":"Name","value":"statusHistory"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"StatusHistoryFields"}}]}},{"kind":"Field","name":{"kind":"Name","value":"shippingAddress"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"OrderAddressFields"}}]}},{"kind":"Field","name":{"kind":"Name","value":"billingAddress"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"OrderAddressFields"}}]}}]}}]} as unknown as DocumentNode<PlaceOrderMutation, PlaceOrderMutationVariables>;
export const CancelMyOrderDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"CancelMyOrder"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"notes"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"cancelMyOrder"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}},{"kind":"Argument","name":{"kind":"Name","value":"notes"},"value":{"kind":"Variable","name":{"kind":"Name","value":"notes"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"OrderFields"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"OrderItemFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"OrderItem"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"orderId"}},{"kind":"Field","name":{"kind":"Name","value":"sellerOrderId"}},{"kind":"Field","name":{"kind":"Name","value":"productId"}},{"kind":"Field","name":{"kind":"Name","value":"variantId"}},{"kind":"Field","name":{"kind":"Name","value":"storeId"}},{"kind":"Field","name":{"kind":"Name","value":"sku"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"variantName"}},{"kind":"Field","name":{"kind":"Name","value":"quantity"}},{"kind":"Field","name":{"kind":"Name","value":"unitPrice"}},{"kind":"Field","name":{"kind":"Name","value":"totalPrice"}},{"kind":"Field","name":{"kind":"Name","value":"taxAmount"}},{"kind":"Field","name":{"kind":"Name","value":"discountAmount"}},{"kind":"Field","name":{"kind":"Name","value":"attributesSnapshot"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"attributeName"}},{"kind":"Field","name":{"kind":"Name","value":"value"}}]}},{"kind":"Field","name":{"kind":"Name","value":"imageUrlSnapshot"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"StatusHistoryFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"OrderStatusHistoryEntry"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"fromStatus"}},{"kind":"Field","name":{"kind":"Name","value":"toStatus"}},{"kind":"Field","name":{"kind":"Name","value":"changedById"}},{"kind":"Field","name":{"kind":"Name","value":"notes"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"OrderAddressFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"OrderAddressSnapshot"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"firstName"}},{"kind":"Field","name":{"kind":"Name","value":"lastName"}},{"kind":"Field","name":{"kind":"Name","value":"phone"}},{"kind":"Field","name":{"kind":"Name","value":"addressLine1"}},{"kind":"Field","name":{"kind":"Name","value":"addressLine2"}},{"kind":"Field","name":{"kind":"Name","value":"city"}},{"kind":"Field","name":{"kind":"Name","value":"state"}},{"kind":"Field","name":{"kind":"Name","value":"postalCode"}},{"kind":"Field","name":{"kind":"Name","value":"countryCode"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"SellerOrderFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"SellerOrder"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"orderId"}},{"kind":"Field","name":{"kind":"Name","value":"sellerId"}},{"kind":"Field","name":{"kind":"Name","value":"storeId"}},{"kind":"Field","name":{"kind":"Name","value":"orderNumber"}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"paymentStatus"}},{"kind":"Field","name":{"kind":"Name","value":"payoutStatus"}},{"kind":"Field","name":{"kind":"Name","value":"subtotal"}},{"kind":"Field","name":{"kind":"Name","value":"taxAmount"}},{"kind":"Field","name":{"kind":"Name","value":"shippingAmount"}},{"kind":"Field","name":{"kind":"Name","value":"discountAmount"}},{"kind":"Field","name":{"kind":"Name","value":"commissionAmount"}},{"kind":"Field","name":{"kind":"Name","value":"payoutAmount"}},{"kind":"Field","name":{"kind":"Name","value":"currencyCode"}},{"kind":"Field","name":{"kind":"Name","value":"packedAt"}},{"kind":"Field","name":{"kind":"Name","value":"shippedAt"}},{"kind":"Field","name":{"kind":"Name","value":"deliveredAt"}},{"kind":"Field","name":{"kind":"Name","value":"cancelledAt"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}},{"kind":"Field","name":{"kind":"Name","value":"itemCount"}},{"kind":"Field","name":{"kind":"Name","value":"storeName"}},{"kind":"Field","name":{"kind":"Name","value":"items"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"OrderItemFields"}}]}},{"kind":"Field","name":{"kind":"Name","value":"statusHistory"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"StatusHistoryFields"}}]}},{"kind":"Field","name":{"kind":"Name","value":"parentOrderNumber"}},{"kind":"Field","name":{"kind":"Name","value":"shippingAddress"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"OrderAddressFields"}}]}},{"kind":"Field","name":{"kind":"Name","value":"customerName"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"OrderFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Order"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"orderNumber"}},{"kind":"Field","name":{"kind":"Name","value":"customerId"}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"paymentStatus"}},{"kind":"Field","name":{"kind":"Name","value":"paymentMethod"}},{"kind":"Field","name":{"kind":"Name","value":"subtotal"}},{"kind":"Field","name":{"kind":"Name","value":"taxAmount"}},{"kind":"Field","name":{"kind":"Name","value":"shippingAmount"}},{"kind":"Field","name":{"kind":"Name","value":"discountAmount"}},{"kind":"Field","name":{"kind":"Name","value":"totalAmount"}},{"kind":"Field","name":{"kind":"Name","value":"currencyCode"}},{"kind":"Field","name":{"kind":"Name","value":"customerNotes"}},{"kind":"Field","name":{"kind":"Name","value":"placedAt"}},{"kind":"Field","name":{"kind":"Name","value":"cancelledAt"}},{"kind":"Field","name":{"kind":"Name","value":"deliveredAt"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}},{"kind":"Field","name":{"kind":"Name","value":"itemCount"}},{"kind":"Field","name":{"kind":"Name","value":"items"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"OrderItemFields"}}]}},{"kind":"Field","name":{"kind":"Name","value":"sellerOrders"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"SellerOrderFields"}}]}},{"kind":"Field","name":{"kind":"Name","value":"statusHistory"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"StatusHistoryFields"}}]}},{"kind":"Field","name":{"kind":"Name","value":"shippingAddress"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"OrderAddressFields"}}]}},{"kind":"Field","name":{"kind":"Name","value":"billingAddress"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"OrderAddressFields"}}]}}]}}]} as unknown as DocumentNode<CancelMyOrderMutation, CancelMyOrderMutationVariables>;
export const GetMySellerOrdersDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetMySellerOrders"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"status"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"OrderStatus"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"page"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"pageSize"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"mySellerOrders"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"status"},"value":{"kind":"Variable","name":{"kind":"Name","value":"status"}}},{"kind":"Argument","name":{"kind":"Name","value":"page"},"value":{"kind":"Variable","name":{"kind":"Name","value":"page"}}},{"kind":"Argument","name":{"kind":"Name","value":"pageSize"},"value":{"kind":"Variable","name":{"kind":"Name","value":"pageSize"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"items"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"SellerOrderFields"}}]}},{"kind":"Field","name":{"kind":"Name","value":"totalCount"}},{"kind":"Field","name":{"kind":"Name","value":"totalPages"}},{"kind":"Field","name":{"kind":"Name","value":"currentPage"}},{"kind":"Field","name":{"kind":"Name","value":"pageSize"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"OrderItemFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"OrderItem"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"orderId"}},{"kind":"Field","name":{"kind":"Name","value":"sellerOrderId"}},{"kind":"Field","name":{"kind":"Name","value":"productId"}},{"kind":"Field","name":{"kind":"Name","value":"variantId"}},{"kind":"Field","name":{"kind":"Name","value":"storeId"}},{"kind":"Field","name":{"kind":"Name","value":"sku"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"variantName"}},{"kind":"Field","name":{"kind":"Name","value":"quantity"}},{"kind":"Field","name":{"kind":"Name","value":"unitPrice"}},{"kind":"Field","name":{"kind":"Name","value":"totalPrice"}},{"kind":"Field","name":{"kind":"Name","value":"taxAmount"}},{"kind":"Field","name":{"kind":"Name","value":"discountAmount"}},{"kind":"Field","name":{"kind":"Name","value":"attributesSnapshot"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"attributeName"}},{"kind":"Field","name":{"kind":"Name","value":"value"}}]}},{"kind":"Field","name":{"kind":"Name","value":"imageUrlSnapshot"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"StatusHistoryFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"OrderStatusHistoryEntry"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"fromStatus"}},{"kind":"Field","name":{"kind":"Name","value":"toStatus"}},{"kind":"Field","name":{"kind":"Name","value":"changedById"}},{"kind":"Field","name":{"kind":"Name","value":"notes"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"OrderAddressFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"OrderAddressSnapshot"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"firstName"}},{"kind":"Field","name":{"kind":"Name","value":"lastName"}},{"kind":"Field","name":{"kind":"Name","value":"phone"}},{"kind":"Field","name":{"kind":"Name","value":"addressLine1"}},{"kind":"Field","name":{"kind":"Name","value":"addressLine2"}},{"kind":"Field","name":{"kind":"Name","value":"city"}},{"kind":"Field","name":{"kind":"Name","value":"state"}},{"kind":"Field","name":{"kind":"Name","value":"postalCode"}},{"kind":"Field","name":{"kind":"Name","value":"countryCode"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"SellerOrderFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"SellerOrder"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"orderId"}},{"kind":"Field","name":{"kind":"Name","value":"sellerId"}},{"kind":"Field","name":{"kind":"Name","value":"storeId"}},{"kind":"Field","name":{"kind":"Name","value":"orderNumber"}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"paymentStatus"}},{"kind":"Field","name":{"kind":"Name","value":"payoutStatus"}},{"kind":"Field","name":{"kind":"Name","value":"subtotal"}},{"kind":"Field","name":{"kind":"Name","value":"taxAmount"}},{"kind":"Field","name":{"kind":"Name","value":"shippingAmount"}},{"kind":"Field","name":{"kind":"Name","value":"discountAmount"}},{"kind":"Field","name":{"kind":"Name","value":"commissionAmount"}},{"kind":"Field","name":{"kind":"Name","value":"payoutAmount"}},{"kind":"Field","name":{"kind":"Name","value":"currencyCode"}},{"kind":"Field","name":{"kind":"Name","value":"packedAt"}},{"kind":"Field","name":{"kind":"Name","value":"shippedAt"}},{"kind":"Field","name":{"kind":"Name","value":"deliveredAt"}},{"kind":"Field","name":{"kind":"Name","value":"cancelledAt"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}},{"kind":"Field","name":{"kind":"Name","value":"itemCount"}},{"kind":"Field","name":{"kind":"Name","value":"storeName"}},{"kind":"Field","name":{"kind":"Name","value":"items"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"OrderItemFields"}}]}},{"kind":"Field","name":{"kind":"Name","value":"statusHistory"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"StatusHistoryFields"}}]}},{"kind":"Field","name":{"kind":"Name","value":"parentOrderNumber"}},{"kind":"Field","name":{"kind":"Name","value":"shippingAddress"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"OrderAddressFields"}}]}},{"kind":"Field","name":{"kind":"Name","value":"customerName"}}]}}]} as unknown as DocumentNode<GetMySellerOrdersQuery, GetMySellerOrdersQueryVariables>;
export const GetMySellerOrderDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetMySellerOrder"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"mySellerOrder"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"SellerOrderFields"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"OrderItemFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"OrderItem"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"orderId"}},{"kind":"Field","name":{"kind":"Name","value":"sellerOrderId"}},{"kind":"Field","name":{"kind":"Name","value":"productId"}},{"kind":"Field","name":{"kind":"Name","value":"variantId"}},{"kind":"Field","name":{"kind":"Name","value":"storeId"}},{"kind":"Field","name":{"kind":"Name","value":"sku"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"variantName"}},{"kind":"Field","name":{"kind":"Name","value":"quantity"}},{"kind":"Field","name":{"kind":"Name","value":"unitPrice"}},{"kind":"Field","name":{"kind":"Name","value":"totalPrice"}},{"kind":"Field","name":{"kind":"Name","value":"taxAmount"}},{"kind":"Field","name":{"kind":"Name","value":"discountAmount"}},{"kind":"Field","name":{"kind":"Name","value":"attributesSnapshot"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"attributeName"}},{"kind":"Field","name":{"kind":"Name","value":"value"}}]}},{"kind":"Field","name":{"kind":"Name","value":"imageUrlSnapshot"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"StatusHistoryFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"OrderStatusHistoryEntry"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"fromStatus"}},{"kind":"Field","name":{"kind":"Name","value":"toStatus"}},{"kind":"Field","name":{"kind":"Name","value":"changedById"}},{"kind":"Field","name":{"kind":"Name","value":"notes"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"OrderAddressFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"OrderAddressSnapshot"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"firstName"}},{"kind":"Field","name":{"kind":"Name","value":"lastName"}},{"kind":"Field","name":{"kind":"Name","value":"phone"}},{"kind":"Field","name":{"kind":"Name","value":"addressLine1"}},{"kind":"Field","name":{"kind":"Name","value":"addressLine2"}},{"kind":"Field","name":{"kind":"Name","value":"city"}},{"kind":"Field","name":{"kind":"Name","value":"state"}},{"kind":"Field","name":{"kind":"Name","value":"postalCode"}},{"kind":"Field","name":{"kind":"Name","value":"countryCode"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"SellerOrderFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"SellerOrder"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"orderId"}},{"kind":"Field","name":{"kind":"Name","value":"sellerId"}},{"kind":"Field","name":{"kind":"Name","value":"storeId"}},{"kind":"Field","name":{"kind":"Name","value":"orderNumber"}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"paymentStatus"}},{"kind":"Field","name":{"kind":"Name","value":"payoutStatus"}},{"kind":"Field","name":{"kind":"Name","value":"subtotal"}},{"kind":"Field","name":{"kind":"Name","value":"taxAmount"}},{"kind":"Field","name":{"kind":"Name","value":"shippingAmount"}},{"kind":"Field","name":{"kind":"Name","value":"discountAmount"}},{"kind":"Field","name":{"kind":"Name","value":"commissionAmount"}},{"kind":"Field","name":{"kind":"Name","value":"payoutAmount"}},{"kind":"Field","name":{"kind":"Name","value":"currencyCode"}},{"kind":"Field","name":{"kind":"Name","value":"packedAt"}},{"kind":"Field","name":{"kind":"Name","value":"shippedAt"}},{"kind":"Field","name":{"kind":"Name","value":"deliveredAt"}},{"kind":"Field","name":{"kind":"Name","value":"cancelledAt"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}},{"kind":"Field","name":{"kind":"Name","value":"itemCount"}},{"kind":"Field","name":{"kind":"Name","value":"storeName"}},{"kind":"Field","name":{"kind":"Name","value":"items"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"OrderItemFields"}}]}},{"kind":"Field","name":{"kind":"Name","value":"statusHistory"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"StatusHistoryFields"}}]}},{"kind":"Field","name":{"kind":"Name","value":"parentOrderNumber"}},{"kind":"Field","name":{"kind":"Name","value":"shippingAddress"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"OrderAddressFields"}}]}},{"kind":"Field","name":{"kind":"Name","value":"customerName"}}]}}]} as unknown as DocumentNode<GetMySellerOrderQuery, GetMySellerOrderQueryVariables>;
export const UpdateSellerOrderStatusDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"UpdateSellerOrderStatus"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"UpdateSellerOrderStatusInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"updateSellerOrderStatus"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"SellerOrderFields"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"OrderItemFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"OrderItem"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"orderId"}},{"kind":"Field","name":{"kind":"Name","value":"sellerOrderId"}},{"kind":"Field","name":{"kind":"Name","value":"productId"}},{"kind":"Field","name":{"kind":"Name","value":"variantId"}},{"kind":"Field","name":{"kind":"Name","value":"storeId"}},{"kind":"Field","name":{"kind":"Name","value":"sku"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"variantName"}},{"kind":"Field","name":{"kind":"Name","value":"quantity"}},{"kind":"Field","name":{"kind":"Name","value":"unitPrice"}},{"kind":"Field","name":{"kind":"Name","value":"totalPrice"}},{"kind":"Field","name":{"kind":"Name","value":"taxAmount"}},{"kind":"Field","name":{"kind":"Name","value":"discountAmount"}},{"kind":"Field","name":{"kind":"Name","value":"attributesSnapshot"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"attributeName"}},{"kind":"Field","name":{"kind":"Name","value":"value"}}]}},{"kind":"Field","name":{"kind":"Name","value":"imageUrlSnapshot"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"StatusHistoryFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"OrderStatusHistoryEntry"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"fromStatus"}},{"kind":"Field","name":{"kind":"Name","value":"toStatus"}},{"kind":"Field","name":{"kind":"Name","value":"changedById"}},{"kind":"Field","name":{"kind":"Name","value":"notes"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"OrderAddressFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"OrderAddressSnapshot"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"firstName"}},{"kind":"Field","name":{"kind":"Name","value":"lastName"}},{"kind":"Field","name":{"kind":"Name","value":"phone"}},{"kind":"Field","name":{"kind":"Name","value":"addressLine1"}},{"kind":"Field","name":{"kind":"Name","value":"addressLine2"}},{"kind":"Field","name":{"kind":"Name","value":"city"}},{"kind":"Field","name":{"kind":"Name","value":"state"}},{"kind":"Field","name":{"kind":"Name","value":"postalCode"}},{"kind":"Field","name":{"kind":"Name","value":"countryCode"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"SellerOrderFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"SellerOrder"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"orderId"}},{"kind":"Field","name":{"kind":"Name","value":"sellerId"}},{"kind":"Field","name":{"kind":"Name","value":"storeId"}},{"kind":"Field","name":{"kind":"Name","value":"orderNumber"}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"paymentStatus"}},{"kind":"Field","name":{"kind":"Name","value":"payoutStatus"}},{"kind":"Field","name":{"kind":"Name","value":"subtotal"}},{"kind":"Field","name":{"kind":"Name","value":"taxAmount"}},{"kind":"Field","name":{"kind":"Name","value":"shippingAmount"}},{"kind":"Field","name":{"kind":"Name","value":"discountAmount"}},{"kind":"Field","name":{"kind":"Name","value":"commissionAmount"}},{"kind":"Field","name":{"kind":"Name","value":"payoutAmount"}},{"kind":"Field","name":{"kind":"Name","value":"currencyCode"}},{"kind":"Field","name":{"kind":"Name","value":"packedAt"}},{"kind":"Field","name":{"kind":"Name","value":"shippedAt"}},{"kind":"Field","name":{"kind":"Name","value":"deliveredAt"}},{"kind":"Field","name":{"kind":"Name","value":"cancelledAt"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}},{"kind":"Field","name":{"kind":"Name","value":"itemCount"}},{"kind":"Field","name":{"kind":"Name","value":"storeName"}},{"kind":"Field","name":{"kind":"Name","value":"items"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"OrderItemFields"}}]}},{"kind":"Field","name":{"kind":"Name","value":"statusHistory"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"StatusHistoryFields"}}]}},{"kind":"Field","name":{"kind":"Name","value":"parentOrderNumber"}},{"kind":"Field","name":{"kind":"Name","value":"shippingAddress"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"OrderAddressFields"}}]}},{"kind":"Field","name":{"kind":"Name","value":"customerName"}}]}}]} as unknown as DocumentNode<UpdateSellerOrderStatusMutation, UpdateSellerOrderStatusMutationVariables>;
export const GetPublicPageDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetPublicPage"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"slug"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"publicPage"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"slug"},"value":{"kind":"Variable","name":{"kind":"Name","value":"slug"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"PageFields"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"PageFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Page"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"slug"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"metaTitle"}},{"kind":"Field","name":{"kind":"Name","value":"metaDesc"}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"blocks"}},{"kind":"Field","name":{"kind":"Name","value":"isSystem"}},{"kind":"Field","name":{"kind":"Name","value":"publishedAt"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}}]}}]} as unknown as DocumentNode<GetPublicPageQuery, GetPublicPageQueryVariables>;
export const GetAdminPagesDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetAdminPages"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"status"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"PageStatus"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"adminPages"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"status"},"value":{"kind":"Variable","name":{"kind":"Name","value":"status"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"PageFields"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"PageFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Page"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"slug"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"metaTitle"}},{"kind":"Field","name":{"kind":"Name","value":"metaDesc"}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"blocks"}},{"kind":"Field","name":{"kind":"Name","value":"isSystem"}},{"kind":"Field","name":{"kind":"Name","value":"publishedAt"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}}]}}]} as unknown as DocumentNode<GetAdminPagesQuery, GetAdminPagesQueryVariables>;
export const GetAdminPagesPaginatedDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetAdminPagesPaginated"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"status"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"PageStatus"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"page"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"pageSize"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"search"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"adminPagesPaginated"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"status"},"value":{"kind":"Variable","name":{"kind":"Name","value":"status"}}},{"kind":"Argument","name":{"kind":"Name","value":"page"},"value":{"kind":"Variable","name":{"kind":"Name","value":"page"}}},{"kind":"Argument","name":{"kind":"Name","value":"pageSize"},"value":{"kind":"Variable","name":{"kind":"Name","value":"pageSize"}}},{"kind":"Argument","name":{"kind":"Name","value":"search"},"value":{"kind":"Variable","name":{"kind":"Name","value":"search"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"items"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"PageFields"}}]}},{"kind":"Field","name":{"kind":"Name","value":"totalCount"}},{"kind":"Field","name":{"kind":"Name","value":"totalPages"}},{"kind":"Field","name":{"kind":"Name","value":"currentPage"}},{"kind":"Field","name":{"kind":"Name","value":"pageSize"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"PageFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Page"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"slug"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"metaTitle"}},{"kind":"Field","name":{"kind":"Name","value":"metaDesc"}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"blocks"}},{"kind":"Field","name":{"kind":"Name","value":"isSystem"}},{"kind":"Field","name":{"kind":"Name","value":"publishedAt"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}}]}}]} as unknown as DocumentNode<GetAdminPagesPaginatedQuery, GetAdminPagesPaginatedQueryVariables>;
export const GetPageDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetPage"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"page"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"PageFields"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"PageFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Page"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"slug"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"metaTitle"}},{"kind":"Field","name":{"kind":"Name","value":"metaDesc"}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"blocks"}},{"kind":"Field","name":{"kind":"Name","value":"isSystem"}},{"kind":"Field","name":{"kind":"Name","value":"publishedAt"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}}]}}]} as unknown as DocumentNode<GetPageQuery, GetPageQueryVariables>;
export const CreatePageDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"CreatePage"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"createPageInput"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"CreatePageInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"createPage"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"createPageInput"},"value":{"kind":"Variable","name":{"kind":"Name","value":"createPageInput"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"PageFields"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"PageFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Page"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"slug"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"metaTitle"}},{"kind":"Field","name":{"kind":"Name","value":"metaDesc"}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"blocks"}},{"kind":"Field","name":{"kind":"Name","value":"isSystem"}},{"kind":"Field","name":{"kind":"Name","value":"publishedAt"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}}]}}]} as unknown as DocumentNode<CreatePageMutation, CreatePageMutationVariables>;
export const UpdatePageDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"UpdatePage"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"updatePageInput"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"UpdatePageInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"updatePage"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"updatePageInput"},"value":{"kind":"Variable","name":{"kind":"Name","value":"updatePageInput"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"PageFields"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"PageFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Page"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"slug"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"metaTitle"}},{"kind":"Field","name":{"kind":"Name","value":"metaDesc"}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"blocks"}},{"kind":"Field","name":{"kind":"Name","value":"isSystem"}},{"kind":"Field","name":{"kind":"Name","value":"publishedAt"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}}]}}]} as unknown as DocumentNode<UpdatePageMutation, UpdatePageMutationVariables>;
export const SetPageStatusDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"SetPageStatus"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"setPageStatusInput"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"SetPageStatusInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"setPageStatus"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"setPageStatusInput"},"value":{"kind":"Variable","name":{"kind":"Name","value":"setPageStatusInput"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"PageFields"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"PageFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Page"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"slug"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"metaTitle"}},{"kind":"Field","name":{"kind":"Name","value":"metaDesc"}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"blocks"}},{"kind":"Field","name":{"kind":"Name","value":"isSystem"}},{"kind":"Field","name":{"kind":"Name","value":"publishedAt"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}}]}}]} as unknown as DocumentNode<SetPageStatusMutation, SetPageStatusMutationVariables>;
export const RemovePageDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"RemovePage"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"removePage"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"PageFields"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"PageFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Page"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"slug"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"metaTitle"}},{"kind":"Field","name":{"kind":"Name","value":"metaDesc"}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"blocks"}},{"kind":"Field","name":{"kind":"Name","value":"isSystem"}},{"kind":"Field","name":{"kind":"Name","value":"publishedAt"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}}]}}]} as unknown as DocumentNode<RemovePageMutation, RemovePageMutationVariables>;
export const AdminPaymentGatewaysDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"AdminPaymentGateways"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"adminPaymentGateways"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"gateway"}},{"kind":"Field","name":{"kind":"Name","value":"displayName"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"logoUrl"}},{"kind":"Field","name":{"kind":"Name","value":"isEnabled"}},{"kind":"Field","name":{"kind":"Name","value":"isDefault"}},{"kind":"Field","name":{"kind":"Name","value":"displayOrder"}},{"kind":"Field","name":{"kind":"Name","value":"supportedMethods"}},{"kind":"Field","name":{"kind":"Name","value":"sandboxMode"}},{"kind":"Field","name":{"kind":"Name","value":"processingFee"}},{"kind":"Field","name":{"kind":"Name","value":"processingFeeType"}},{"kind":"Field","name":{"kind":"Name","value":"paymentType"}},{"kind":"Field","name":{"kind":"Name","value":"instructions"}},{"kind":"Field","name":{"kind":"Name","value":"webhookUrl"}},{"kind":"Field","name":{"kind":"Name","value":"credentialHints"}},{"kind":"Field","name":{"kind":"Name","value":"hasCredentials"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}}]}}]}}]} as unknown as DocumentNode<AdminPaymentGatewaysQuery, AdminPaymentGatewaysQueryVariables>;
export const AdminPaymentGatewayDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"AdminPaymentGateway"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"adminPaymentGateway"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"gateway"}},{"kind":"Field","name":{"kind":"Name","value":"displayName"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"logoUrl"}},{"kind":"Field","name":{"kind":"Name","value":"isEnabled"}},{"kind":"Field","name":{"kind":"Name","value":"isDefault"}},{"kind":"Field","name":{"kind":"Name","value":"displayOrder"}},{"kind":"Field","name":{"kind":"Name","value":"supportedMethods"}},{"kind":"Field","name":{"kind":"Name","value":"sandboxMode"}},{"kind":"Field","name":{"kind":"Name","value":"processingFee"}},{"kind":"Field","name":{"kind":"Name","value":"processingFeeType"}},{"kind":"Field","name":{"kind":"Name","value":"paymentType"}},{"kind":"Field","name":{"kind":"Name","value":"instructions"}},{"kind":"Field","name":{"kind":"Name","value":"webhookUrl"}},{"kind":"Field","name":{"kind":"Name","value":"credentialHints"}},{"kind":"Field","name":{"kind":"Name","value":"hasCredentials"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}}]}}]}}]} as unknown as DocumentNode<AdminPaymentGatewayQuery, AdminPaymentGatewayQueryVariables>;
export const CreatePaymentGatewayConfigDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"CreatePaymentGatewayConfig"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"CreateGatewayConfigInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"createPaymentGatewayConfig"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"gateway"}},{"kind":"Field","name":{"kind":"Name","value":"displayName"}},{"kind":"Field","name":{"kind":"Name","value":"isEnabled"}},{"kind":"Field","name":{"kind":"Name","value":"isDefault"}}]}}]}}]} as unknown as DocumentNode<CreatePaymentGatewayConfigMutation, CreatePaymentGatewayConfigMutationVariables>;
export const UpdatePaymentGatewayConfigDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"UpdatePaymentGatewayConfig"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"UpdateGatewayConfigInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"updatePaymentGatewayConfig"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"gateway"}},{"kind":"Field","name":{"kind":"Name","value":"displayName"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"logoUrl"}},{"kind":"Field","name":{"kind":"Name","value":"isEnabled"}},{"kind":"Field","name":{"kind":"Name","value":"isDefault"}},{"kind":"Field","name":{"kind":"Name","value":"displayOrder"}},{"kind":"Field","name":{"kind":"Name","value":"supportedMethods"}},{"kind":"Field","name":{"kind":"Name","value":"sandboxMode"}},{"kind":"Field","name":{"kind":"Name","value":"processingFee"}},{"kind":"Field","name":{"kind":"Name","value":"processingFeeType"}},{"kind":"Field","name":{"kind":"Name","value":"paymentType"}},{"kind":"Field","name":{"kind":"Name","value":"instructions"}},{"kind":"Field","name":{"kind":"Name","value":"webhookUrl"}},{"kind":"Field","name":{"kind":"Name","value":"credentialHints"}},{"kind":"Field","name":{"kind":"Name","value":"hasCredentials"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}}]}}]}}]} as unknown as DocumentNode<UpdatePaymentGatewayConfigMutation, UpdatePaymentGatewayConfigMutationVariables>;
export const TogglePaymentGatewayDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"TogglePaymentGateway"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"enabled"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Boolean"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"togglePaymentGateway"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}},{"kind":"Argument","name":{"kind":"Name","value":"enabled"},"value":{"kind":"Variable","name":{"kind":"Name","value":"enabled"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"isEnabled"}}]}}]}}]} as unknown as DocumentNode<TogglePaymentGatewayMutation, TogglePaymentGatewayMutationVariables>;
export const SetDefaultPaymentGatewayDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"SetDefaultPaymentGateway"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"setDefaultPaymentGateway"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"isDefault"}}]}}]}}]} as unknown as DocumentNode<SetDefaultPaymentGatewayMutation, SetDefaultPaymentGatewayMutationVariables>;
export const AdminPaymentTransactionsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"AdminPaymentTransactions"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"page"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}},"defaultValue":{"kind":"IntValue","value":"1"}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"pageSize"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}},"defaultValue":{"kind":"IntValue","value":"10"}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"gateway"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"PaymentGateway"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"status"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"PaymentTransactionStatus"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"adminPaymentTransactions"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"page"},"value":{"kind":"Variable","name":{"kind":"Name","value":"page"}}},{"kind":"Argument","name":{"kind":"Name","value":"pageSize"},"value":{"kind":"Variable","name":{"kind":"Name","value":"pageSize"}}},{"kind":"Argument","name":{"kind":"Name","value":"gateway"},"value":{"kind":"Variable","name":{"kind":"Name","value":"gateway"}}},{"kind":"Argument","name":{"kind":"Name","value":"status"},"value":{"kind":"Variable","name":{"kind":"Name","value":"status"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"items"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"orderId"}},{"kind":"Field","name":{"kind":"Name","value":"gateway"}},{"kind":"Field","name":{"kind":"Name","value":"method"}},{"kind":"Field","name":{"kind":"Name","value":"amount"}},{"kind":"Field","name":{"kind":"Name","value":"processingFee"}},{"kind":"Field","name":{"kind":"Name","value":"currency"}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"gatewayOrderId"}},{"kind":"Field","name":{"kind":"Name","value":"gatewayPaymentId"}},{"kind":"Field","name":{"kind":"Name","value":"capturedAt"}},{"kind":"Field","name":{"kind":"Name","value":"failedAt"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}}]}},{"kind":"Field","name":{"kind":"Name","value":"totalCount"}},{"kind":"Field","name":{"kind":"Name","value":"totalPages"}},{"kind":"Field","name":{"kind":"Name","value":"currentPage"}},{"kind":"Field","name":{"kind":"Name","value":"pageSize"}}]}}]}}]} as unknown as DocumentNode<AdminPaymentTransactionsQuery, AdminPaymentTransactionsQueryVariables>;
export const ActivePaymentGatewaysDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"ActivePaymentGateways"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"activePaymentGateways"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"gateway"}},{"kind":"Field","name":{"kind":"Name","value":"displayName"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"logoUrl"}},{"kind":"Field","name":{"kind":"Name","value":"isDefault"}},{"kind":"Field","name":{"kind":"Name","value":"processingFee"}},{"kind":"Field","name":{"kind":"Name","value":"processingFeeType"}},{"kind":"Field","name":{"kind":"Name","value":"paymentType"}},{"kind":"Field","name":{"kind":"Name","value":"supportedMethods"}}]}}]}}]} as unknown as DocumentNode<ActivePaymentGatewaysQuery, ActivePaymentGatewaysQueryVariables>;
export const InitiateCheckoutDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"InitiateCheckout"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"InitiateCheckoutInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"initiateCheckout"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"orderId"}},{"kind":"Field","name":{"kind":"Name","value":"orderNumber"}},{"kind":"Field","name":{"kind":"Name","value":"gateway"}},{"kind":"Field","name":{"kind":"Name","value":"gatewayPayload"}},{"kind":"Field","name":{"kind":"Name","value":"requiresPayment"}}]}}]}}]} as unknown as DocumentNode<InitiateCheckoutMutation, InitiateCheckoutMutationVariables>;
export const VerifyPaymentDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"VerifyPayment"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"VerifyPaymentInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"verifyPayment"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"orderNumber"}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"paymentStatus"}}]}}]}}]} as unknown as DocumentNode<VerifyPaymentMutation, VerifyPaymentMutationVariables>;
export const GetMyProductsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetMyProducts"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"storeId"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"status"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"ProductStatus"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"myProducts"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"storeId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"storeId"}}},{"kind":"Argument","name":{"kind":"Name","value":"status"},"value":{"kind":"Variable","name":{"kind":"Name","value":"status"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"ProductFields"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"ProductImageFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"ProductImage"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"productId"}},{"kind":"Field","name":{"kind":"Name","value":"imageUrl"}},{"kind":"Field","name":{"kind":"Name","value":"altText"}},{"kind":"Field","name":{"kind":"Name","value":"displayOrder"}},{"kind":"Field","name":{"kind":"Name","value":"isPrimary"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"ProductFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Product"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"storeId"}},{"kind":"Field","name":{"kind":"Name","value":"categoryId"}},{"kind":"Field","name":{"kind":"Name","value":"brandId"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"slug"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"shortDescription"}},{"kind":"Field","name":{"kind":"Name","value":"productType"}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"isFeatured"}},{"kind":"Field","name":{"kind":"Name","value":"isDigital"}},{"kind":"Field","name":{"kind":"Name","value":"price"}},{"kind":"Field","name":{"kind":"Name","value":"compareAtPrice"}},{"kind":"Field","name":{"kind":"Name","value":"costPrice"}},{"kind":"Field","name":{"kind":"Name","value":"priceWithTax"}},{"kind":"Field","name":{"kind":"Name","value":"sku"}},{"kind":"Field","name":{"kind":"Name","value":"weight"}},{"kind":"Field","name":{"kind":"Name","value":"length"}},{"kind":"Field","name":{"kind":"Name","value":"width"}},{"kind":"Field","name":{"kind":"Name","value":"height"}},{"kind":"Field","name":{"kind":"Name","value":"hsnCode"}},{"kind":"Field","name":{"kind":"Name","value":"seoTitle"}},{"kind":"Field","name":{"kind":"Name","value":"seoDescription"}},{"kind":"Field","name":{"kind":"Name","value":"seoKeywords"}},{"kind":"Field","name":{"kind":"Name","value":"specifications"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}},{"kind":"Field","name":{"kind":"Name","value":"images"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"ProductImageFields"}}]}},{"kind":"Field","name":{"kind":"Name","value":"brand"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"slug"}},{"kind":"Field","name":{"kind":"Name","value":"logoUrl"}}]}},{"kind":"Field","name":{"kind":"Name","value":"category"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"slug"}}]}},{"kind":"Field","name":{"kind":"Name","value":"taxId"}},{"kind":"Field","name":{"kind":"Name","value":"tax"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"rate"}}]}},{"kind":"Field","name":{"kind":"Name","value":"tags"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"slug"}}]}}]}}]} as unknown as DocumentNode<GetMyProductsQuery, GetMyProductsQueryVariables>;
export const GetMyProductDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetMyProduct"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"myProduct"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"ProductFields"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"ProductImageFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"ProductImage"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"productId"}},{"kind":"Field","name":{"kind":"Name","value":"imageUrl"}},{"kind":"Field","name":{"kind":"Name","value":"altText"}},{"kind":"Field","name":{"kind":"Name","value":"displayOrder"}},{"kind":"Field","name":{"kind":"Name","value":"isPrimary"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"ProductFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Product"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"storeId"}},{"kind":"Field","name":{"kind":"Name","value":"categoryId"}},{"kind":"Field","name":{"kind":"Name","value":"brandId"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"slug"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"shortDescription"}},{"kind":"Field","name":{"kind":"Name","value":"productType"}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"isFeatured"}},{"kind":"Field","name":{"kind":"Name","value":"isDigital"}},{"kind":"Field","name":{"kind":"Name","value":"price"}},{"kind":"Field","name":{"kind":"Name","value":"compareAtPrice"}},{"kind":"Field","name":{"kind":"Name","value":"costPrice"}},{"kind":"Field","name":{"kind":"Name","value":"priceWithTax"}},{"kind":"Field","name":{"kind":"Name","value":"sku"}},{"kind":"Field","name":{"kind":"Name","value":"weight"}},{"kind":"Field","name":{"kind":"Name","value":"length"}},{"kind":"Field","name":{"kind":"Name","value":"width"}},{"kind":"Field","name":{"kind":"Name","value":"height"}},{"kind":"Field","name":{"kind":"Name","value":"hsnCode"}},{"kind":"Field","name":{"kind":"Name","value":"seoTitle"}},{"kind":"Field","name":{"kind":"Name","value":"seoDescription"}},{"kind":"Field","name":{"kind":"Name","value":"seoKeywords"}},{"kind":"Field","name":{"kind":"Name","value":"specifications"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}},{"kind":"Field","name":{"kind":"Name","value":"images"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"ProductImageFields"}}]}},{"kind":"Field","name":{"kind":"Name","value":"brand"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"slug"}},{"kind":"Field","name":{"kind":"Name","value":"logoUrl"}}]}},{"kind":"Field","name":{"kind":"Name","value":"category"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"slug"}}]}},{"kind":"Field","name":{"kind":"Name","value":"taxId"}},{"kind":"Field","name":{"kind":"Name","value":"tax"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"rate"}}]}},{"kind":"Field","name":{"kind":"Name","value":"tags"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"slug"}}]}}]}}]} as unknown as DocumentNode<GetMyProductQuery, GetMyProductQueryVariables>;
export const CreateMyProductDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"CreateMyProduct"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"createProductInput"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"CreateProductInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"createMyProduct"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"createProductInput"},"value":{"kind":"Variable","name":{"kind":"Name","value":"createProductInput"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"ProductFields"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"ProductImageFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"ProductImage"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"productId"}},{"kind":"Field","name":{"kind":"Name","value":"imageUrl"}},{"kind":"Field","name":{"kind":"Name","value":"altText"}},{"kind":"Field","name":{"kind":"Name","value":"displayOrder"}},{"kind":"Field","name":{"kind":"Name","value":"isPrimary"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"ProductFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Product"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"storeId"}},{"kind":"Field","name":{"kind":"Name","value":"categoryId"}},{"kind":"Field","name":{"kind":"Name","value":"brandId"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"slug"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"shortDescription"}},{"kind":"Field","name":{"kind":"Name","value":"productType"}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"isFeatured"}},{"kind":"Field","name":{"kind":"Name","value":"isDigital"}},{"kind":"Field","name":{"kind":"Name","value":"price"}},{"kind":"Field","name":{"kind":"Name","value":"compareAtPrice"}},{"kind":"Field","name":{"kind":"Name","value":"costPrice"}},{"kind":"Field","name":{"kind":"Name","value":"priceWithTax"}},{"kind":"Field","name":{"kind":"Name","value":"sku"}},{"kind":"Field","name":{"kind":"Name","value":"weight"}},{"kind":"Field","name":{"kind":"Name","value":"length"}},{"kind":"Field","name":{"kind":"Name","value":"width"}},{"kind":"Field","name":{"kind":"Name","value":"height"}},{"kind":"Field","name":{"kind":"Name","value":"hsnCode"}},{"kind":"Field","name":{"kind":"Name","value":"seoTitle"}},{"kind":"Field","name":{"kind":"Name","value":"seoDescription"}},{"kind":"Field","name":{"kind":"Name","value":"seoKeywords"}},{"kind":"Field","name":{"kind":"Name","value":"specifications"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}},{"kind":"Field","name":{"kind":"Name","value":"images"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"ProductImageFields"}}]}},{"kind":"Field","name":{"kind":"Name","value":"brand"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"slug"}},{"kind":"Field","name":{"kind":"Name","value":"logoUrl"}}]}},{"kind":"Field","name":{"kind":"Name","value":"category"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"slug"}}]}},{"kind":"Field","name":{"kind":"Name","value":"taxId"}},{"kind":"Field","name":{"kind":"Name","value":"tax"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"rate"}}]}},{"kind":"Field","name":{"kind":"Name","value":"tags"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"slug"}}]}}]}}]} as unknown as DocumentNode<CreateMyProductMutation, CreateMyProductMutationVariables>;
export const UpdateMyProductDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"UpdateMyProduct"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"updateProductInput"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"UpdateProductInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"updateMyProduct"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"updateProductInput"},"value":{"kind":"Variable","name":{"kind":"Name","value":"updateProductInput"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"ProductFields"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"ProductImageFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"ProductImage"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"productId"}},{"kind":"Field","name":{"kind":"Name","value":"imageUrl"}},{"kind":"Field","name":{"kind":"Name","value":"altText"}},{"kind":"Field","name":{"kind":"Name","value":"displayOrder"}},{"kind":"Field","name":{"kind":"Name","value":"isPrimary"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"ProductFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Product"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"storeId"}},{"kind":"Field","name":{"kind":"Name","value":"categoryId"}},{"kind":"Field","name":{"kind":"Name","value":"brandId"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"slug"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"shortDescription"}},{"kind":"Field","name":{"kind":"Name","value":"productType"}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"isFeatured"}},{"kind":"Field","name":{"kind":"Name","value":"isDigital"}},{"kind":"Field","name":{"kind":"Name","value":"price"}},{"kind":"Field","name":{"kind":"Name","value":"compareAtPrice"}},{"kind":"Field","name":{"kind":"Name","value":"costPrice"}},{"kind":"Field","name":{"kind":"Name","value":"priceWithTax"}},{"kind":"Field","name":{"kind":"Name","value":"sku"}},{"kind":"Field","name":{"kind":"Name","value":"weight"}},{"kind":"Field","name":{"kind":"Name","value":"length"}},{"kind":"Field","name":{"kind":"Name","value":"width"}},{"kind":"Field","name":{"kind":"Name","value":"height"}},{"kind":"Field","name":{"kind":"Name","value":"hsnCode"}},{"kind":"Field","name":{"kind":"Name","value":"seoTitle"}},{"kind":"Field","name":{"kind":"Name","value":"seoDescription"}},{"kind":"Field","name":{"kind":"Name","value":"seoKeywords"}},{"kind":"Field","name":{"kind":"Name","value":"specifications"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}},{"kind":"Field","name":{"kind":"Name","value":"images"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"ProductImageFields"}}]}},{"kind":"Field","name":{"kind":"Name","value":"brand"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"slug"}},{"kind":"Field","name":{"kind":"Name","value":"logoUrl"}}]}},{"kind":"Field","name":{"kind":"Name","value":"category"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"slug"}}]}},{"kind":"Field","name":{"kind":"Name","value":"taxId"}},{"kind":"Field","name":{"kind":"Name","value":"tax"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"rate"}}]}},{"kind":"Field","name":{"kind":"Name","value":"tags"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"slug"}}]}}]}}]} as unknown as DocumentNode<UpdateMyProductMutation, UpdateMyProductMutationVariables>;
export const SetMyProductStatusDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"SetMyProductStatus"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"setProductStatusInput"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"SetProductStatusInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"setMyProductStatus"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"setProductStatusInput"},"value":{"kind":"Variable","name":{"kind":"Name","value":"setProductStatusInput"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"ProductFields"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"ProductImageFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"ProductImage"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"productId"}},{"kind":"Field","name":{"kind":"Name","value":"imageUrl"}},{"kind":"Field","name":{"kind":"Name","value":"altText"}},{"kind":"Field","name":{"kind":"Name","value":"displayOrder"}},{"kind":"Field","name":{"kind":"Name","value":"isPrimary"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"ProductFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Product"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"storeId"}},{"kind":"Field","name":{"kind":"Name","value":"categoryId"}},{"kind":"Field","name":{"kind":"Name","value":"brandId"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"slug"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"shortDescription"}},{"kind":"Field","name":{"kind":"Name","value":"productType"}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"isFeatured"}},{"kind":"Field","name":{"kind":"Name","value":"isDigital"}},{"kind":"Field","name":{"kind":"Name","value":"price"}},{"kind":"Field","name":{"kind":"Name","value":"compareAtPrice"}},{"kind":"Field","name":{"kind":"Name","value":"costPrice"}},{"kind":"Field","name":{"kind":"Name","value":"priceWithTax"}},{"kind":"Field","name":{"kind":"Name","value":"sku"}},{"kind":"Field","name":{"kind":"Name","value":"weight"}},{"kind":"Field","name":{"kind":"Name","value":"length"}},{"kind":"Field","name":{"kind":"Name","value":"width"}},{"kind":"Field","name":{"kind":"Name","value":"height"}},{"kind":"Field","name":{"kind":"Name","value":"hsnCode"}},{"kind":"Field","name":{"kind":"Name","value":"seoTitle"}},{"kind":"Field","name":{"kind":"Name","value":"seoDescription"}},{"kind":"Field","name":{"kind":"Name","value":"seoKeywords"}},{"kind":"Field","name":{"kind":"Name","value":"specifications"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}},{"kind":"Field","name":{"kind":"Name","value":"images"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"ProductImageFields"}}]}},{"kind":"Field","name":{"kind":"Name","value":"brand"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"slug"}},{"kind":"Field","name":{"kind":"Name","value":"logoUrl"}}]}},{"kind":"Field","name":{"kind":"Name","value":"category"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"slug"}}]}},{"kind":"Field","name":{"kind":"Name","value":"taxId"}},{"kind":"Field","name":{"kind":"Name","value":"tax"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"rate"}}]}},{"kind":"Field","name":{"kind":"Name","value":"tags"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"slug"}}]}}]}}]} as unknown as DocumentNode<SetMyProductStatusMutation, SetMyProductStatusMutationVariables>;
export const RemoveMyProductDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"RemoveMyProduct"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"removeMyProduct"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"ProductFields"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"ProductImageFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"ProductImage"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"productId"}},{"kind":"Field","name":{"kind":"Name","value":"imageUrl"}},{"kind":"Field","name":{"kind":"Name","value":"altText"}},{"kind":"Field","name":{"kind":"Name","value":"displayOrder"}},{"kind":"Field","name":{"kind":"Name","value":"isPrimary"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"ProductFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Product"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"storeId"}},{"kind":"Field","name":{"kind":"Name","value":"categoryId"}},{"kind":"Field","name":{"kind":"Name","value":"brandId"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"slug"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"shortDescription"}},{"kind":"Field","name":{"kind":"Name","value":"productType"}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"isFeatured"}},{"kind":"Field","name":{"kind":"Name","value":"isDigital"}},{"kind":"Field","name":{"kind":"Name","value":"price"}},{"kind":"Field","name":{"kind":"Name","value":"compareAtPrice"}},{"kind":"Field","name":{"kind":"Name","value":"costPrice"}},{"kind":"Field","name":{"kind":"Name","value":"priceWithTax"}},{"kind":"Field","name":{"kind":"Name","value":"sku"}},{"kind":"Field","name":{"kind":"Name","value":"weight"}},{"kind":"Field","name":{"kind":"Name","value":"length"}},{"kind":"Field","name":{"kind":"Name","value":"width"}},{"kind":"Field","name":{"kind":"Name","value":"height"}},{"kind":"Field","name":{"kind":"Name","value":"hsnCode"}},{"kind":"Field","name":{"kind":"Name","value":"seoTitle"}},{"kind":"Field","name":{"kind":"Name","value":"seoDescription"}},{"kind":"Field","name":{"kind":"Name","value":"seoKeywords"}},{"kind":"Field","name":{"kind":"Name","value":"specifications"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}},{"kind":"Field","name":{"kind":"Name","value":"images"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"ProductImageFields"}}]}},{"kind":"Field","name":{"kind":"Name","value":"brand"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"slug"}},{"kind":"Field","name":{"kind":"Name","value":"logoUrl"}}]}},{"kind":"Field","name":{"kind":"Name","value":"category"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"slug"}}]}},{"kind":"Field","name":{"kind":"Name","value":"taxId"}},{"kind":"Field","name":{"kind":"Name","value":"tax"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"rate"}}]}},{"kind":"Field","name":{"kind":"Name","value":"tags"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"slug"}}]}}]}}]} as unknown as DocumentNode<RemoveMyProductMutation, RemoveMyProductMutationVariables>;
export const AddMyProductImageDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"AddMyProductImage"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"addProductImageInput"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"AddProductImageInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"addMyProductImage"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"addProductImageInput"},"value":{"kind":"Variable","name":{"kind":"Name","value":"addProductImageInput"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"ProductImageFields"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"ProductImageFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"ProductImage"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"productId"}},{"kind":"Field","name":{"kind":"Name","value":"imageUrl"}},{"kind":"Field","name":{"kind":"Name","value":"altText"}},{"kind":"Field","name":{"kind":"Name","value":"displayOrder"}},{"kind":"Field","name":{"kind":"Name","value":"isPrimary"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}}]}}]} as unknown as DocumentNode<AddMyProductImageMutation, AddMyProductImageMutationVariables>;
export const UpdateMyProductImageDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"UpdateMyProductImage"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"updateProductImageInput"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"UpdateProductImageInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"updateMyProductImage"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"updateProductImageInput"},"value":{"kind":"Variable","name":{"kind":"Name","value":"updateProductImageInput"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"ProductImageFields"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"ProductImageFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"ProductImage"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"productId"}},{"kind":"Field","name":{"kind":"Name","value":"imageUrl"}},{"kind":"Field","name":{"kind":"Name","value":"altText"}},{"kind":"Field","name":{"kind":"Name","value":"displayOrder"}},{"kind":"Field","name":{"kind":"Name","value":"isPrimary"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}}]}}]} as unknown as DocumentNode<UpdateMyProductImageMutation, UpdateMyProductImageMutationVariables>;
export const RemoveMyProductImageDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"RemoveMyProductImage"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"removeMyProductImage"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"ProductImageFields"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"ProductImageFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"ProductImage"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"productId"}},{"kind":"Field","name":{"kind":"Name","value":"imageUrl"}},{"kind":"Field","name":{"kind":"Name","value":"altText"}},{"kind":"Field","name":{"kind":"Name","value":"displayOrder"}},{"kind":"Field","name":{"kind":"Name","value":"isPrimary"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}}]}}]} as unknown as DocumentNode<RemoveMyProductImageMutation, RemoveMyProductImageMutationVariables>;
export const ReorderMyProductImagesDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"ReorderMyProductImages"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"reorderProductImagesInput"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ReorderProductImagesInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"reorderMyProductImages"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"reorderProductImagesInput"},"value":{"kind":"Variable","name":{"kind":"Name","value":"reorderProductImagesInput"}}}]}]}}]} as unknown as DocumentNode<ReorderMyProductImagesMutation, ReorderMyProductImagesMutationVariables>;
export const GetAdminProductsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetAdminProducts"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"status"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"ProductStatus"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"storeId"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"brandId"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"categoryId"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"adminProducts"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"status"},"value":{"kind":"Variable","name":{"kind":"Name","value":"status"}}},{"kind":"Argument","name":{"kind":"Name","value":"storeId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"storeId"}}},{"kind":"Argument","name":{"kind":"Name","value":"brandId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"brandId"}}},{"kind":"Argument","name":{"kind":"Name","value":"categoryId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"categoryId"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"ProductFields"}},{"kind":"Field","name":{"kind":"Name","value":"variants"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"sku"}},{"kind":"Field","name":{"kind":"Name","value":"price"}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"attributes"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"attributeName"}},{"kind":"Field","name":{"kind":"Name","value":"value"}}]}}]}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"ProductImageFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"ProductImage"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"productId"}},{"kind":"Field","name":{"kind":"Name","value":"imageUrl"}},{"kind":"Field","name":{"kind":"Name","value":"altText"}},{"kind":"Field","name":{"kind":"Name","value":"displayOrder"}},{"kind":"Field","name":{"kind":"Name","value":"isPrimary"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"ProductFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Product"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"storeId"}},{"kind":"Field","name":{"kind":"Name","value":"categoryId"}},{"kind":"Field","name":{"kind":"Name","value":"brandId"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"slug"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"shortDescription"}},{"kind":"Field","name":{"kind":"Name","value":"productType"}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"isFeatured"}},{"kind":"Field","name":{"kind":"Name","value":"isDigital"}},{"kind":"Field","name":{"kind":"Name","value":"price"}},{"kind":"Field","name":{"kind":"Name","value":"compareAtPrice"}},{"kind":"Field","name":{"kind":"Name","value":"costPrice"}},{"kind":"Field","name":{"kind":"Name","value":"priceWithTax"}},{"kind":"Field","name":{"kind":"Name","value":"sku"}},{"kind":"Field","name":{"kind":"Name","value":"weight"}},{"kind":"Field","name":{"kind":"Name","value":"length"}},{"kind":"Field","name":{"kind":"Name","value":"width"}},{"kind":"Field","name":{"kind":"Name","value":"height"}},{"kind":"Field","name":{"kind":"Name","value":"hsnCode"}},{"kind":"Field","name":{"kind":"Name","value":"seoTitle"}},{"kind":"Field","name":{"kind":"Name","value":"seoDescription"}},{"kind":"Field","name":{"kind":"Name","value":"seoKeywords"}},{"kind":"Field","name":{"kind":"Name","value":"specifications"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}},{"kind":"Field","name":{"kind":"Name","value":"images"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"ProductImageFields"}}]}},{"kind":"Field","name":{"kind":"Name","value":"brand"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"slug"}},{"kind":"Field","name":{"kind":"Name","value":"logoUrl"}}]}},{"kind":"Field","name":{"kind":"Name","value":"category"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"slug"}}]}},{"kind":"Field","name":{"kind":"Name","value":"taxId"}},{"kind":"Field","name":{"kind":"Name","value":"tax"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"rate"}}]}},{"kind":"Field","name":{"kind":"Name","value":"tags"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"slug"}}]}}]}}]} as unknown as DocumentNode<GetAdminProductsQuery, GetAdminProductsQueryVariables>;
export const AdminSetProductStatusDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"AdminSetProductStatus"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"setProductStatusInput"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"SetProductStatusInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"adminSetProductStatus"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"setProductStatusInput"},"value":{"kind":"Variable","name":{"kind":"Name","value":"setProductStatusInput"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"ProductFields"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"ProductImageFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"ProductImage"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"productId"}},{"kind":"Field","name":{"kind":"Name","value":"imageUrl"}},{"kind":"Field","name":{"kind":"Name","value":"altText"}},{"kind":"Field","name":{"kind":"Name","value":"displayOrder"}},{"kind":"Field","name":{"kind":"Name","value":"isPrimary"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"ProductFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Product"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"storeId"}},{"kind":"Field","name":{"kind":"Name","value":"categoryId"}},{"kind":"Field","name":{"kind":"Name","value":"brandId"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"slug"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"shortDescription"}},{"kind":"Field","name":{"kind":"Name","value":"productType"}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"isFeatured"}},{"kind":"Field","name":{"kind":"Name","value":"isDigital"}},{"kind":"Field","name":{"kind":"Name","value":"price"}},{"kind":"Field","name":{"kind":"Name","value":"compareAtPrice"}},{"kind":"Field","name":{"kind":"Name","value":"costPrice"}},{"kind":"Field","name":{"kind":"Name","value":"priceWithTax"}},{"kind":"Field","name":{"kind":"Name","value":"sku"}},{"kind":"Field","name":{"kind":"Name","value":"weight"}},{"kind":"Field","name":{"kind":"Name","value":"length"}},{"kind":"Field","name":{"kind":"Name","value":"width"}},{"kind":"Field","name":{"kind":"Name","value":"height"}},{"kind":"Field","name":{"kind":"Name","value":"hsnCode"}},{"kind":"Field","name":{"kind":"Name","value":"seoTitle"}},{"kind":"Field","name":{"kind":"Name","value":"seoDescription"}},{"kind":"Field","name":{"kind":"Name","value":"seoKeywords"}},{"kind":"Field","name":{"kind":"Name","value":"specifications"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}},{"kind":"Field","name":{"kind":"Name","value":"images"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"ProductImageFields"}}]}},{"kind":"Field","name":{"kind":"Name","value":"brand"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"slug"}},{"kind":"Field","name":{"kind":"Name","value":"logoUrl"}}]}},{"kind":"Field","name":{"kind":"Name","value":"category"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"slug"}}]}},{"kind":"Field","name":{"kind":"Name","value":"taxId"}},{"kind":"Field","name":{"kind":"Name","value":"tax"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"rate"}}]}},{"kind":"Field","name":{"kind":"Name","value":"tags"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"slug"}}]}}]}}]} as unknown as DocumentNode<AdminSetProductStatusMutation, AdminSetProductStatusMutationVariables>;
export const GetPublicProductDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetPublicProduct"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"slug"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"publicProduct"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"slug"},"value":{"kind":"Variable","name":{"kind":"Name","value":"slug"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"ProductFields"}},{"kind":"Field","name":{"kind":"Name","value":"variants"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"sku"}},{"kind":"Field","name":{"kind":"Name","value":"price"}},{"kind":"Field","name":{"kind":"Name","value":"priceWithTax"}},{"kind":"Field","name":{"kind":"Name","value":"compareAtPrice"}},{"kind":"Field","name":{"kind":"Name","value":"imageUrl"}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"availableQuantity"}},{"kind":"Field","name":{"kind":"Name","value":"stockState"}},{"kind":"Field","name":{"kind":"Name","value":"attributes"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"attributeId"}},{"kind":"Field","name":{"kind":"Name","value":"attributeValueId"}},{"kind":"Field","name":{"kind":"Name","value":"attributeName"}},{"kind":"Field","name":{"kind":"Name","value":"attributeSlug"}},{"kind":"Field","name":{"kind":"Name","value":"value"}},{"kind":"Field","name":{"kind":"Name","value":"valueSlug"}}]}}]}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"ProductImageFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"ProductImage"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"productId"}},{"kind":"Field","name":{"kind":"Name","value":"imageUrl"}},{"kind":"Field","name":{"kind":"Name","value":"altText"}},{"kind":"Field","name":{"kind":"Name","value":"displayOrder"}},{"kind":"Field","name":{"kind":"Name","value":"isPrimary"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"ProductFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Product"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"storeId"}},{"kind":"Field","name":{"kind":"Name","value":"categoryId"}},{"kind":"Field","name":{"kind":"Name","value":"brandId"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"slug"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"shortDescription"}},{"kind":"Field","name":{"kind":"Name","value":"productType"}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"isFeatured"}},{"kind":"Field","name":{"kind":"Name","value":"isDigital"}},{"kind":"Field","name":{"kind":"Name","value":"price"}},{"kind":"Field","name":{"kind":"Name","value":"compareAtPrice"}},{"kind":"Field","name":{"kind":"Name","value":"costPrice"}},{"kind":"Field","name":{"kind":"Name","value":"priceWithTax"}},{"kind":"Field","name":{"kind":"Name","value":"sku"}},{"kind":"Field","name":{"kind":"Name","value":"weight"}},{"kind":"Field","name":{"kind":"Name","value":"length"}},{"kind":"Field","name":{"kind":"Name","value":"width"}},{"kind":"Field","name":{"kind":"Name","value":"height"}},{"kind":"Field","name":{"kind":"Name","value":"hsnCode"}},{"kind":"Field","name":{"kind":"Name","value":"seoTitle"}},{"kind":"Field","name":{"kind":"Name","value":"seoDescription"}},{"kind":"Field","name":{"kind":"Name","value":"seoKeywords"}},{"kind":"Field","name":{"kind":"Name","value":"specifications"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}},{"kind":"Field","name":{"kind":"Name","value":"images"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"ProductImageFields"}}]}},{"kind":"Field","name":{"kind":"Name","value":"brand"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"slug"}},{"kind":"Field","name":{"kind":"Name","value":"logoUrl"}}]}},{"kind":"Field","name":{"kind":"Name","value":"category"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"slug"}}]}},{"kind":"Field","name":{"kind":"Name","value":"taxId"}},{"kind":"Field","name":{"kind":"Name","value":"tax"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"rate"}}]}},{"kind":"Field","name":{"kind":"Name","value":"tags"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"slug"}}]}}]}}]} as unknown as DocumentNode<GetPublicProductQuery, GetPublicProductQueryVariables>;
export const GetPublicProductsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetPublicProducts"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"storeSlug"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"brandSlug"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"tagSlug"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"categorySlug"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"sort"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"ProductSortOrder"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"limit"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Float"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"publicProducts"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"storeSlug"},"value":{"kind":"Variable","name":{"kind":"Name","value":"storeSlug"}}},{"kind":"Argument","name":{"kind":"Name","value":"brandSlug"},"value":{"kind":"Variable","name":{"kind":"Name","value":"brandSlug"}}},{"kind":"Argument","name":{"kind":"Name","value":"tagSlug"},"value":{"kind":"Variable","name":{"kind":"Name","value":"tagSlug"}}},{"kind":"Argument","name":{"kind":"Name","value":"categorySlug"},"value":{"kind":"Variable","name":{"kind":"Name","value":"categorySlug"}}},{"kind":"Argument","name":{"kind":"Name","value":"sort"},"value":{"kind":"Variable","name":{"kind":"Name","value":"sort"}}},{"kind":"Argument","name":{"kind":"Name","value":"limit"},"value":{"kind":"Variable","name":{"kind":"Name","value":"limit"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"ProductSummaryFields"}},{"kind":"Field","name":{"kind":"Name","value":"variants"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"price"}},{"kind":"Field","name":{"kind":"Name","value":"priceWithTax"}},{"kind":"Field","name":{"kind":"Name","value":"availableQuantity"}}]}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"ProductImageFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"ProductImage"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"productId"}},{"kind":"Field","name":{"kind":"Name","value":"imageUrl"}},{"kind":"Field","name":{"kind":"Name","value":"altText"}},{"kind":"Field","name":{"kind":"Name","value":"displayOrder"}},{"kind":"Field","name":{"kind":"Name","value":"isPrimary"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"ProductSummaryFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Product"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"slug"}},{"kind":"Field","name":{"kind":"Name","value":"productType"}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"isFeatured"}},{"kind":"Field","name":{"kind":"Name","value":"price"}},{"kind":"Field","name":{"kind":"Name","value":"compareAtPrice"}},{"kind":"Field","name":{"kind":"Name","value":"priceWithTax"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"images"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"ProductImageFields"}}]}}]}}]} as unknown as DocumentNode<GetPublicProductsQuery, GetPublicProductsQueryVariables>;
export const GetPaginatedPublicProductsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetPaginatedPublicProducts"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"storeSlug"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"brandSlug"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"tagSlug"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"categorySlug"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"minPrice"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Float"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"maxPrice"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Float"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"sort"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"ProductSortOrder"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"page"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"pageSize"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"paginatedPublicProducts"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"storeSlug"},"value":{"kind":"Variable","name":{"kind":"Name","value":"storeSlug"}}},{"kind":"Argument","name":{"kind":"Name","value":"brandSlug"},"value":{"kind":"Variable","name":{"kind":"Name","value":"brandSlug"}}},{"kind":"Argument","name":{"kind":"Name","value":"tagSlug"},"value":{"kind":"Variable","name":{"kind":"Name","value":"tagSlug"}}},{"kind":"Argument","name":{"kind":"Name","value":"categorySlug"},"value":{"kind":"Variable","name":{"kind":"Name","value":"categorySlug"}}},{"kind":"Argument","name":{"kind":"Name","value":"minPrice"},"value":{"kind":"Variable","name":{"kind":"Name","value":"minPrice"}}},{"kind":"Argument","name":{"kind":"Name","value":"maxPrice"},"value":{"kind":"Variable","name":{"kind":"Name","value":"maxPrice"}}},{"kind":"Argument","name":{"kind":"Name","value":"sort"},"value":{"kind":"Variable","name":{"kind":"Name","value":"sort"}}},{"kind":"Argument","name":{"kind":"Name","value":"page"},"value":{"kind":"Variable","name":{"kind":"Name","value":"page"}}},{"kind":"Argument","name":{"kind":"Name","value":"pageSize"},"value":{"kind":"Variable","name":{"kind":"Name","value":"pageSize"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"items"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"ProductSummaryFields"}},{"kind":"Field","name":{"kind":"Name","value":"variants"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"price"}},{"kind":"Field","name":{"kind":"Name","value":"priceWithTax"}},{"kind":"Field","name":{"kind":"Name","value":"availableQuantity"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"totalCount"}},{"kind":"Field","name":{"kind":"Name","value":"totalPages"}},{"kind":"Field","name":{"kind":"Name","value":"currentPage"}},{"kind":"Field","name":{"kind":"Name","value":"pageSize"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"ProductImageFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"ProductImage"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"productId"}},{"kind":"Field","name":{"kind":"Name","value":"imageUrl"}},{"kind":"Field","name":{"kind":"Name","value":"altText"}},{"kind":"Field","name":{"kind":"Name","value":"displayOrder"}},{"kind":"Field","name":{"kind":"Name","value":"isPrimary"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"ProductSummaryFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Product"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"slug"}},{"kind":"Field","name":{"kind":"Name","value":"productType"}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"isFeatured"}},{"kind":"Field","name":{"kind":"Name","value":"price"}},{"kind":"Field","name":{"kind":"Name","value":"compareAtPrice"}},{"kind":"Field","name":{"kind":"Name","value":"priceWithTax"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"images"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"ProductImageFields"}}]}}]}}]} as unknown as DocumentNode<GetPaginatedPublicProductsQuery, GetPaginatedPublicProductsQueryVariables>;
export const GetMyProductVariantsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetMyProductVariants"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"productId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"myProductVariants"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"productId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"productId"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"VariantFields"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"VariantFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"ProductVariant"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"productId"}},{"kind":"Field","name":{"kind":"Name","value":"sku"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"price"}},{"kind":"Field","name":{"kind":"Name","value":"compareAtPrice"}},{"kind":"Field","name":{"kind":"Name","value":"costPrice"}},{"kind":"Field","name":{"kind":"Name","value":"weight"}},{"kind":"Field","name":{"kind":"Name","value":"length"}},{"kind":"Field","name":{"kind":"Name","value":"width"}},{"kind":"Field","name":{"kind":"Name","value":"height"}},{"kind":"Field","name":{"kind":"Name","value":"imageUrl"}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}},{"kind":"Field","name":{"kind":"Name","value":"attributes"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"attributeId"}},{"kind":"Field","name":{"kind":"Name","value":"attributeValueId"}},{"kind":"Field","name":{"kind":"Name","value":"attributeName"}},{"kind":"Field","name":{"kind":"Name","value":"attributeSlug"}},{"kind":"Field","name":{"kind":"Name","value":"value"}},{"kind":"Field","name":{"kind":"Name","value":"valueSlug"}}]}}]}}]} as unknown as DocumentNode<GetMyProductVariantsQuery, GetMyProductVariantsQueryVariables>;
export const GetMyProductVariantAxesDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetMyProductVariantAxes"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"productId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"myProductVariantAxes"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"productId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"productId"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"VariantAxisFields"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"VariantAxisFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"VariantAxis"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"attributeId"}},{"kind":"Field","name":{"kind":"Name","value":"attributeName"}},{"kind":"Field","name":{"kind":"Name","value":"attributeSlug"}},{"kind":"Field","name":{"kind":"Name","value":"values"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"attributeId"}},{"kind":"Field","name":{"kind":"Name","value":"value"}},{"kind":"Field","name":{"kind":"Name","value":"slug"}},{"kind":"Field","name":{"kind":"Name","value":"displayOrder"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}}]}}]}}]} as unknown as DocumentNode<GetMyProductVariantAxesQuery, GetMyProductVariantAxesQueryVariables>;
export const SetMyProductVariantAxesDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"SetMyProductVariantAxes"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"setVariantAxesInput"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"SetVariantAxesInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"setMyProductVariantAxes"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"setVariantAxesInput"},"value":{"kind":"Variable","name":{"kind":"Name","value":"setVariantAxesInput"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"VariantAxisFields"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"VariantAxisFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"VariantAxis"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"attributeId"}},{"kind":"Field","name":{"kind":"Name","value":"attributeName"}},{"kind":"Field","name":{"kind":"Name","value":"attributeSlug"}},{"kind":"Field","name":{"kind":"Name","value":"values"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"attributeId"}},{"kind":"Field","name":{"kind":"Name","value":"value"}},{"kind":"Field","name":{"kind":"Name","value":"slug"}},{"kind":"Field","name":{"kind":"Name","value":"displayOrder"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}}]}}]}}]} as unknown as DocumentNode<SetMyProductVariantAxesMutation, SetMyProductVariantAxesMutationVariables>;
export const GenerateMyProductVariantMatrixDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"GenerateMyProductVariantMatrix"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"generateVariantMatrixInput"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"GenerateVariantMatrixInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"generateMyProductVariantMatrix"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"generateVariantMatrixInput"},"value":{"kind":"Variable","name":{"kind":"Name","value":"generateVariantMatrixInput"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"VariantFields"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"VariantFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"ProductVariant"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"productId"}},{"kind":"Field","name":{"kind":"Name","value":"sku"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"price"}},{"kind":"Field","name":{"kind":"Name","value":"compareAtPrice"}},{"kind":"Field","name":{"kind":"Name","value":"costPrice"}},{"kind":"Field","name":{"kind":"Name","value":"weight"}},{"kind":"Field","name":{"kind":"Name","value":"length"}},{"kind":"Field","name":{"kind":"Name","value":"width"}},{"kind":"Field","name":{"kind":"Name","value":"height"}},{"kind":"Field","name":{"kind":"Name","value":"imageUrl"}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}},{"kind":"Field","name":{"kind":"Name","value":"attributes"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"attributeId"}},{"kind":"Field","name":{"kind":"Name","value":"attributeValueId"}},{"kind":"Field","name":{"kind":"Name","value":"attributeName"}},{"kind":"Field","name":{"kind":"Name","value":"attributeSlug"}},{"kind":"Field","name":{"kind":"Name","value":"value"}},{"kind":"Field","name":{"kind":"Name","value":"valueSlug"}}]}}]}}]} as unknown as DocumentNode<GenerateMyProductVariantMatrixMutation, GenerateMyProductVariantMatrixMutationVariables>;
export const AddMyProductVariantDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"AddMyProductVariant"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"createVariantInput"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"CreateVariantInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"addMyProductVariant"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"createVariantInput"},"value":{"kind":"Variable","name":{"kind":"Name","value":"createVariantInput"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"VariantFields"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"VariantFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"ProductVariant"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"productId"}},{"kind":"Field","name":{"kind":"Name","value":"sku"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"price"}},{"kind":"Field","name":{"kind":"Name","value":"compareAtPrice"}},{"kind":"Field","name":{"kind":"Name","value":"costPrice"}},{"kind":"Field","name":{"kind":"Name","value":"weight"}},{"kind":"Field","name":{"kind":"Name","value":"length"}},{"kind":"Field","name":{"kind":"Name","value":"width"}},{"kind":"Field","name":{"kind":"Name","value":"height"}},{"kind":"Field","name":{"kind":"Name","value":"imageUrl"}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}},{"kind":"Field","name":{"kind":"Name","value":"attributes"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"attributeId"}},{"kind":"Field","name":{"kind":"Name","value":"attributeValueId"}},{"kind":"Field","name":{"kind":"Name","value":"attributeName"}},{"kind":"Field","name":{"kind":"Name","value":"attributeSlug"}},{"kind":"Field","name":{"kind":"Name","value":"value"}},{"kind":"Field","name":{"kind":"Name","value":"valueSlug"}}]}}]}}]} as unknown as DocumentNode<AddMyProductVariantMutation, AddMyProductVariantMutationVariables>;
export const UpdateMyProductVariantDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"UpdateMyProductVariant"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"updateVariantInput"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"UpdateVariantInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"updateMyProductVariant"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"updateVariantInput"},"value":{"kind":"Variable","name":{"kind":"Name","value":"updateVariantInput"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"VariantFields"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"VariantFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"ProductVariant"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"productId"}},{"kind":"Field","name":{"kind":"Name","value":"sku"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"price"}},{"kind":"Field","name":{"kind":"Name","value":"compareAtPrice"}},{"kind":"Field","name":{"kind":"Name","value":"costPrice"}},{"kind":"Field","name":{"kind":"Name","value":"weight"}},{"kind":"Field","name":{"kind":"Name","value":"length"}},{"kind":"Field","name":{"kind":"Name","value":"width"}},{"kind":"Field","name":{"kind":"Name","value":"height"}},{"kind":"Field","name":{"kind":"Name","value":"imageUrl"}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}},{"kind":"Field","name":{"kind":"Name","value":"attributes"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"attributeId"}},{"kind":"Field","name":{"kind":"Name","value":"attributeValueId"}},{"kind":"Field","name":{"kind":"Name","value":"attributeName"}},{"kind":"Field","name":{"kind":"Name","value":"attributeSlug"}},{"kind":"Field","name":{"kind":"Name","value":"value"}},{"kind":"Field","name":{"kind":"Name","value":"valueSlug"}}]}}]}}]} as unknown as DocumentNode<UpdateMyProductVariantMutation, UpdateMyProductVariantMutationVariables>;
export const RemoveMyProductVariantDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"RemoveMyProductVariant"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"removeMyProductVariant"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"VariantFields"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"VariantFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"ProductVariant"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"productId"}},{"kind":"Field","name":{"kind":"Name","value":"sku"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"price"}},{"kind":"Field","name":{"kind":"Name","value":"compareAtPrice"}},{"kind":"Field","name":{"kind":"Name","value":"costPrice"}},{"kind":"Field","name":{"kind":"Name","value":"weight"}},{"kind":"Field","name":{"kind":"Name","value":"length"}},{"kind":"Field","name":{"kind":"Name","value":"width"}},{"kind":"Field","name":{"kind":"Name","value":"height"}},{"kind":"Field","name":{"kind":"Name","value":"imageUrl"}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}},{"kind":"Field","name":{"kind":"Name","value":"attributes"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"attributeId"}},{"kind":"Field","name":{"kind":"Name","value":"attributeValueId"}},{"kind":"Field","name":{"kind":"Name","value":"attributeName"}},{"kind":"Field","name":{"kind":"Name","value":"attributeSlug"}},{"kind":"Field","name":{"kind":"Name","value":"value"}},{"kind":"Field","name":{"kind":"Name","value":"valueSlug"}}]}}]}}]} as unknown as DocumentNode<RemoveMyProductVariantMutation, RemoveMyProductVariantMutationVariables>;
export const BulkUpdateMyProductVariantsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"BulkUpdateMyProductVariants"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"bulkUpdateVariantsInput"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"BulkUpdateVariantsInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"bulkUpdateMyProductVariants"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"bulkUpdateVariantsInput"},"value":{"kind":"Variable","name":{"kind":"Name","value":"bulkUpdateVariantsInput"}}}]}]}}]} as unknown as DocumentNode<BulkUpdateMyProductVariantsMutation, BulkUpdateMyProductVariantsMutationVariables>;
export const GetMySellerDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetMySeller"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"mySeller"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"SellerFields"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"PayoutAccountFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"SellerPayoutAccount"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"sellerId"}},{"kind":"Field","name":{"kind":"Name","value":"accountType"}},{"kind":"Field","name":{"kind":"Name","value":"accountHolderName"}},{"kind":"Field","name":{"kind":"Name","value":"accountNumber"}},{"kind":"Field","name":{"kind":"Name","value":"ifscCode"}},{"kind":"Field","name":{"kind":"Name","value":"bankName"}},{"kind":"Field","name":{"kind":"Name","value":"upiId"}},{"kind":"Field","name":{"kind":"Name","value":"walletProvider"}},{"kind":"Field","name":{"kind":"Name","value":"isPrimary"}},{"kind":"Field","name":{"kind":"Name","value":"isVerified"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"SellerFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Seller"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"userId"}},{"kind":"Field","name":{"kind":"Name","value":"legalName"}},{"kind":"Field","name":{"kind":"Name","value":"displayName"}},{"kind":"Field","name":{"kind":"Name","value":"businessType"}},{"kind":"Field","name":{"kind":"Name","value":"dateOfIncorporation"}},{"kind":"Field","name":{"kind":"Name","value":"registrationNumber"}},{"kind":"Field","name":{"kind":"Name","value":"panNumber"}},{"kind":"Field","name":{"kind":"Name","value":"gstin"}},{"kind":"Field","name":{"kind":"Name","value":"businessEmail"}},{"kind":"Field","name":{"kind":"Name","value":"businessPhone"}},{"kind":"Field","name":{"kind":"Name","value":"supportEmail"}},{"kind":"Field","name":{"kind":"Name","value":"signatoryName"}},{"kind":"Field","name":{"kind":"Name","value":"signatoryPan"}},{"kind":"Field","name":{"kind":"Name","value":"signatoryDesignation"}},{"kind":"Field","name":{"kind":"Name","value":"overallStatus"}},{"kind":"Field","name":{"kind":"Name","value":"panVerifiedAt"}},{"kind":"Field","name":{"kind":"Name","value":"gstinVerifiedAt"}},{"kind":"Field","name":{"kind":"Name","value":"bankVerifiedAt"}},{"kind":"Field","name":{"kind":"Name","value":"documentsVerifiedAt"}},{"kind":"Field","name":{"kind":"Name","value":"rejectionReason"}},{"kind":"Field","name":{"kind":"Name","value":"commissionRate"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}},{"kind":"Field","name":{"kind":"Name","value":"payoutAccounts"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"PayoutAccountFields"}}]}}]}}]} as unknown as DocumentNode<GetMySellerQuery, GetMySellerQueryVariables>;
export const GetSellersDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetSellers"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"status"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"SellerStatus"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"sellers"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"status"},"value":{"kind":"Variable","name":{"kind":"Name","value":"status"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"SellerFields"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"PayoutAccountFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"SellerPayoutAccount"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"sellerId"}},{"kind":"Field","name":{"kind":"Name","value":"accountType"}},{"kind":"Field","name":{"kind":"Name","value":"accountHolderName"}},{"kind":"Field","name":{"kind":"Name","value":"accountNumber"}},{"kind":"Field","name":{"kind":"Name","value":"ifscCode"}},{"kind":"Field","name":{"kind":"Name","value":"bankName"}},{"kind":"Field","name":{"kind":"Name","value":"upiId"}},{"kind":"Field","name":{"kind":"Name","value":"walletProvider"}},{"kind":"Field","name":{"kind":"Name","value":"isPrimary"}},{"kind":"Field","name":{"kind":"Name","value":"isVerified"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"SellerFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Seller"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"userId"}},{"kind":"Field","name":{"kind":"Name","value":"legalName"}},{"kind":"Field","name":{"kind":"Name","value":"displayName"}},{"kind":"Field","name":{"kind":"Name","value":"businessType"}},{"kind":"Field","name":{"kind":"Name","value":"dateOfIncorporation"}},{"kind":"Field","name":{"kind":"Name","value":"registrationNumber"}},{"kind":"Field","name":{"kind":"Name","value":"panNumber"}},{"kind":"Field","name":{"kind":"Name","value":"gstin"}},{"kind":"Field","name":{"kind":"Name","value":"businessEmail"}},{"kind":"Field","name":{"kind":"Name","value":"businessPhone"}},{"kind":"Field","name":{"kind":"Name","value":"supportEmail"}},{"kind":"Field","name":{"kind":"Name","value":"signatoryName"}},{"kind":"Field","name":{"kind":"Name","value":"signatoryPan"}},{"kind":"Field","name":{"kind":"Name","value":"signatoryDesignation"}},{"kind":"Field","name":{"kind":"Name","value":"overallStatus"}},{"kind":"Field","name":{"kind":"Name","value":"panVerifiedAt"}},{"kind":"Field","name":{"kind":"Name","value":"gstinVerifiedAt"}},{"kind":"Field","name":{"kind":"Name","value":"bankVerifiedAt"}},{"kind":"Field","name":{"kind":"Name","value":"documentsVerifiedAt"}},{"kind":"Field","name":{"kind":"Name","value":"rejectionReason"}},{"kind":"Field","name":{"kind":"Name","value":"commissionRate"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}},{"kind":"Field","name":{"kind":"Name","value":"payoutAccounts"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"PayoutAccountFields"}}]}}]}}]} as unknown as DocumentNode<GetSellersQuery, GetSellersQueryVariables>;
export const GetSellerUsersDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetSellerUsers"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"status"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"SellerListStatus"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"sellerUsers"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"status"},"value":{"kind":"Variable","name":{"kind":"Name","value":"status"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"userId"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"email"}},{"kind":"Field","name":{"kind":"Name","value":"phone"}},{"kind":"Field","name":{"kind":"Name","value":"emailVerifiedAt"}},{"kind":"Field","name":{"kind":"Name","value":"registeredAt"}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"seller"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"SellerFields"}}]}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"PayoutAccountFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"SellerPayoutAccount"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"sellerId"}},{"kind":"Field","name":{"kind":"Name","value":"accountType"}},{"kind":"Field","name":{"kind":"Name","value":"accountHolderName"}},{"kind":"Field","name":{"kind":"Name","value":"accountNumber"}},{"kind":"Field","name":{"kind":"Name","value":"ifscCode"}},{"kind":"Field","name":{"kind":"Name","value":"bankName"}},{"kind":"Field","name":{"kind":"Name","value":"upiId"}},{"kind":"Field","name":{"kind":"Name","value":"walletProvider"}},{"kind":"Field","name":{"kind":"Name","value":"isPrimary"}},{"kind":"Field","name":{"kind":"Name","value":"isVerified"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"SellerFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Seller"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"userId"}},{"kind":"Field","name":{"kind":"Name","value":"legalName"}},{"kind":"Field","name":{"kind":"Name","value":"displayName"}},{"kind":"Field","name":{"kind":"Name","value":"businessType"}},{"kind":"Field","name":{"kind":"Name","value":"dateOfIncorporation"}},{"kind":"Field","name":{"kind":"Name","value":"registrationNumber"}},{"kind":"Field","name":{"kind":"Name","value":"panNumber"}},{"kind":"Field","name":{"kind":"Name","value":"gstin"}},{"kind":"Field","name":{"kind":"Name","value":"businessEmail"}},{"kind":"Field","name":{"kind":"Name","value":"businessPhone"}},{"kind":"Field","name":{"kind":"Name","value":"supportEmail"}},{"kind":"Field","name":{"kind":"Name","value":"signatoryName"}},{"kind":"Field","name":{"kind":"Name","value":"signatoryPan"}},{"kind":"Field","name":{"kind":"Name","value":"signatoryDesignation"}},{"kind":"Field","name":{"kind":"Name","value":"overallStatus"}},{"kind":"Field","name":{"kind":"Name","value":"panVerifiedAt"}},{"kind":"Field","name":{"kind":"Name","value":"gstinVerifiedAt"}},{"kind":"Field","name":{"kind":"Name","value":"bankVerifiedAt"}},{"kind":"Field","name":{"kind":"Name","value":"documentsVerifiedAt"}},{"kind":"Field","name":{"kind":"Name","value":"rejectionReason"}},{"kind":"Field","name":{"kind":"Name","value":"commissionRate"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}},{"kind":"Field","name":{"kind":"Name","value":"payoutAccounts"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"PayoutAccountFields"}}]}}]}}]} as unknown as DocumentNode<GetSellerUsersQuery, GetSellerUsersQueryVariables>;
export const GetSellerDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetSeller"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"seller"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"SellerFields"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"PayoutAccountFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"SellerPayoutAccount"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"sellerId"}},{"kind":"Field","name":{"kind":"Name","value":"accountType"}},{"kind":"Field","name":{"kind":"Name","value":"accountHolderName"}},{"kind":"Field","name":{"kind":"Name","value":"accountNumber"}},{"kind":"Field","name":{"kind":"Name","value":"ifscCode"}},{"kind":"Field","name":{"kind":"Name","value":"bankName"}},{"kind":"Field","name":{"kind":"Name","value":"upiId"}},{"kind":"Field","name":{"kind":"Name","value":"walletProvider"}},{"kind":"Field","name":{"kind":"Name","value":"isPrimary"}},{"kind":"Field","name":{"kind":"Name","value":"isVerified"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"SellerFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Seller"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"userId"}},{"kind":"Field","name":{"kind":"Name","value":"legalName"}},{"kind":"Field","name":{"kind":"Name","value":"displayName"}},{"kind":"Field","name":{"kind":"Name","value":"businessType"}},{"kind":"Field","name":{"kind":"Name","value":"dateOfIncorporation"}},{"kind":"Field","name":{"kind":"Name","value":"registrationNumber"}},{"kind":"Field","name":{"kind":"Name","value":"panNumber"}},{"kind":"Field","name":{"kind":"Name","value":"gstin"}},{"kind":"Field","name":{"kind":"Name","value":"businessEmail"}},{"kind":"Field","name":{"kind":"Name","value":"businessPhone"}},{"kind":"Field","name":{"kind":"Name","value":"supportEmail"}},{"kind":"Field","name":{"kind":"Name","value":"signatoryName"}},{"kind":"Field","name":{"kind":"Name","value":"signatoryPan"}},{"kind":"Field","name":{"kind":"Name","value":"signatoryDesignation"}},{"kind":"Field","name":{"kind":"Name","value":"overallStatus"}},{"kind":"Field","name":{"kind":"Name","value":"panVerifiedAt"}},{"kind":"Field","name":{"kind":"Name","value":"gstinVerifiedAt"}},{"kind":"Field","name":{"kind":"Name","value":"bankVerifiedAt"}},{"kind":"Field","name":{"kind":"Name","value":"documentsVerifiedAt"}},{"kind":"Field","name":{"kind":"Name","value":"rejectionReason"}},{"kind":"Field","name":{"kind":"Name","value":"commissionRate"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}},{"kind":"Field","name":{"kind":"Name","value":"payoutAccounts"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"PayoutAccountFields"}}]}}]}}]} as unknown as DocumentNode<GetSellerQuery, GetSellerQueryVariables>;
export const CreateMySellerDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"CreateMySeller"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"createSellerInput"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"CreateSellerInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"createMySeller"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"createSellerInput"},"value":{"kind":"Variable","name":{"kind":"Name","value":"createSellerInput"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"SellerFields"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"PayoutAccountFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"SellerPayoutAccount"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"sellerId"}},{"kind":"Field","name":{"kind":"Name","value":"accountType"}},{"kind":"Field","name":{"kind":"Name","value":"accountHolderName"}},{"kind":"Field","name":{"kind":"Name","value":"accountNumber"}},{"kind":"Field","name":{"kind":"Name","value":"ifscCode"}},{"kind":"Field","name":{"kind":"Name","value":"bankName"}},{"kind":"Field","name":{"kind":"Name","value":"upiId"}},{"kind":"Field","name":{"kind":"Name","value":"walletProvider"}},{"kind":"Field","name":{"kind":"Name","value":"isPrimary"}},{"kind":"Field","name":{"kind":"Name","value":"isVerified"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"SellerFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Seller"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"userId"}},{"kind":"Field","name":{"kind":"Name","value":"legalName"}},{"kind":"Field","name":{"kind":"Name","value":"displayName"}},{"kind":"Field","name":{"kind":"Name","value":"businessType"}},{"kind":"Field","name":{"kind":"Name","value":"dateOfIncorporation"}},{"kind":"Field","name":{"kind":"Name","value":"registrationNumber"}},{"kind":"Field","name":{"kind":"Name","value":"panNumber"}},{"kind":"Field","name":{"kind":"Name","value":"gstin"}},{"kind":"Field","name":{"kind":"Name","value":"businessEmail"}},{"kind":"Field","name":{"kind":"Name","value":"businessPhone"}},{"kind":"Field","name":{"kind":"Name","value":"supportEmail"}},{"kind":"Field","name":{"kind":"Name","value":"signatoryName"}},{"kind":"Field","name":{"kind":"Name","value":"signatoryPan"}},{"kind":"Field","name":{"kind":"Name","value":"signatoryDesignation"}},{"kind":"Field","name":{"kind":"Name","value":"overallStatus"}},{"kind":"Field","name":{"kind":"Name","value":"panVerifiedAt"}},{"kind":"Field","name":{"kind":"Name","value":"gstinVerifiedAt"}},{"kind":"Field","name":{"kind":"Name","value":"bankVerifiedAt"}},{"kind":"Field","name":{"kind":"Name","value":"documentsVerifiedAt"}},{"kind":"Field","name":{"kind":"Name","value":"rejectionReason"}},{"kind":"Field","name":{"kind":"Name","value":"commissionRate"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}},{"kind":"Field","name":{"kind":"Name","value":"payoutAccounts"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"PayoutAccountFields"}}]}}]}}]} as unknown as DocumentNode<CreateMySellerMutation, CreateMySellerMutationVariables>;
export const UpdateMySellerDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"UpdateMySeller"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"updateSellerInput"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"UpdateSellerInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"updateMySeller"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"updateSellerInput"},"value":{"kind":"Variable","name":{"kind":"Name","value":"updateSellerInput"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"SellerFields"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"PayoutAccountFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"SellerPayoutAccount"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"sellerId"}},{"kind":"Field","name":{"kind":"Name","value":"accountType"}},{"kind":"Field","name":{"kind":"Name","value":"accountHolderName"}},{"kind":"Field","name":{"kind":"Name","value":"accountNumber"}},{"kind":"Field","name":{"kind":"Name","value":"ifscCode"}},{"kind":"Field","name":{"kind":"Name","value":"bankName"}},{"kind":"Field","name":{"kind":"Name","value":"upiId"}},{"kind":"Field","name":{"kind":"Name","value":"walletProvider"}},{"kind":"Field","name":{"kind":"Name","value":"isPrimary"}},{"kind":"Field","name":{"kind":"Name","value":"isVerified"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"SellerFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Seller"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"userId"}},{"kind":"Field","name":{"kind":"Name","value":"legalName"}},{"kind":"Field","name":{"kind":"Name","value":"displayName"}},{"kind":"Field","name":{"kind":"Name","value":"businessType"}},{"kind":"Field","name":{"kind":"Name","value":"dateOfIncorporation"}},{"kind":"Field","name":{"kind":"Name","value":"registrationNumber"}},{"kind":"Field","name":{"kind":"Name","value":"panNumber"}},{"kind":"Field","name":{"kind":"Name","value":"gstin"}},{"kind":"Field","name":{"kind":"Name","value":"businessEmail"}},{"kind":"Field","name":{"kind":"Name","value":"businessPhone"}},{"kind":"Field","name":{"kind":"Name","value":"supportEmail"}},{"kind":"Field","name":{"kind":"Name","value":"signatoryName"}},{"kind":"Field","name":{"kind":"Name","value":"signatoryPan"}},{"kind":"Field","name":{"kind":"Name","value":"signatoryDesignation"}},{"kind":"Field","name":{"kind":"Name","value":"overallStatus"}},{"kind":"Field","name":{"kind":"Name","value":"panVerifiedAt"}},{"kind":"Field","name":{"kind":"Name","value":"gstinVerifiedAt"}},{"kind":"Field","name":{"kind":"Name","value":"bankVerifiedAt"}},{"kind":"Field","name":{"kind":"Name","value":"documentsVerifiedAt"}},{"kind":"Field","name":{"kind":"Name","value":"rejectionReason"}},{"kind":"Field","name":{"kind":"Name","value":"commissionRate"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}},{"kind":"Field","name":{"kind":"Name","value":"payoutAccounts"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"PayoutAccountFields"}}]}}]}}]} as unknown as DocumentNode<UpdateMySellerMutation, UpdateMySellerMutationVariables>;
export const SubmitMySellerForReviewDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"SubmitMySellerForReview"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"submitMySellerForReview"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"SellerFields"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"PayoutAccountFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"SellerPayoutAccount"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"sellerId"}},{"kind":"Field","name":{"kind":"Name","value":"accountType"}},{"kind":"Field","name":{"kind":"Name","value":"accountHolderName"}},{"kind":"Field","name":{"kind":"Name","value":"accountNumber"}},{"kind":"Field","name":{"kind":"Name","value":"ifscCode"}},{"kind":"Field","name":{"kind":"Name","value":"bankName"}},{"kind":"Field","name":{"kind":"Name","value":"upiId"}},{"kind":"Field","name":{"kind":"Name","value":"walletProvider"}},{"kind":"Field","name":{"kind":"Name","value":"isPrimary"}},{"kind":"Field","name":{"kind":"Name","value":"isVerified"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"SellerFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Seller"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"userId"}},{"kind":"Field","name":{"kind":"Name","value":"legalName"}},{"kind":"Field","name":{"kind":"Name","value":"displayName"}},{"kind":"Field","name":{"kind":"Name","value":"businessType"}},{"kind":"Field","name":{"kind":"Name","value":"dateOfIncorporation"}},{"kind":"Field","name":{"kind":"Name","value":"registrationNumber"}},{"kind":"Field","name":{"kind":"Name","value":"panNumber"}},{"kind":"Field","name":{"kind":"Name","value":"gstin"}},{"kind":"Field","name":{"kind":"Name","value":"businessEmail"}},{"kind":"Field","name":{"kind":"Name","value":"businessPhone"}},{"kind":"Field","name":{"kind":"Name","value":"supportEmail"}},{"kind":"Field","name":{"kind":"Name","value":"signatoryName"}},{"kind":"Field","name":{"kind":"Name","value":"signatoryPan"}},{"kind":"Field","name":{"kind":"Name","value":"signatoryDesignation"}},{"kind":"Field","name":{"kind":"Name","value":"overallStatus"}},{"kind":"Field","name":{"kind":"Name","value":"panVerifiedAt"}},{"kind":"Field","name":{"kind":"Name","value":"gstinVerifiedAt"}},{"kind":"Field","name":{"kind":"Name","value":"bankVerifiedAt"}},{"kind":"Field","name":{"kind":"Name","value":"documentsVerifiedAt"}},{"kind":"Field","name":{"kind":"Name","value":"rejectionReason"}},{"kind":"Field","name":{"kind":"Name","value":"commissionRate"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}},{"kind":"Field","name":{"kind":"Name","value":"payoutAccounts"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"PayoutAccountFields"}}]}}]}}]} as unknown as DocumentNode<SubmitMySellerForReviewMutation, SubmitMySellerForReviewMutationVariables>;
export const VerifySellerSectionDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"VerifySellerSection"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"verifySectionInput"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"VerifySellerSectionInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"verifySellerSection"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"verifySectionInput"},"value":{"kind":"Variable","name":{"kind":"Name","value":"verifySectionInput"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"SellerFields"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"PayoutAccountFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"SellerPayoutAccount"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"sellerId"}},{"kind":"Field","name":{"kind":"Name","value":"accountType"}},{"kind":"Field","name":{"kind":"Name","value":"accountHolderName"}},{"kind":"Field","name":{"kind":"Name","value":"accountNumber"}},{"kind":"Field","name":{"kind":"Name","value":"ifscCode"}},{"kind":"Field","name":{"kind":"Name","value":"bankName"}},{"kind":"Field","name":{"kind":"Name","value":"upiId"}},{"kind":"Field","name":{"kind":"Name","value":"walletProvider"}},{"kind":"Field","name":{"kind":"Name","value":"isPrimary"}},{"kind":"Field","name":{"kind":"Name","value":"isVerified"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"SellerFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Seller"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"userId"}},{"kind":"Field","name":{"kind":"Name","value":"legalName"}},{"kind":"Field","name":{"kind":"Name","value":"displayName"}},{"kind":"Field","name":{"kind":"Name","value":"businessType"}},{"kind":"Field","name":{"kind":"Name","value":"dateOfIncorporation"}},{"kind":"Field","name":{"kind":"Name","value":"registrationNumber"}},{"kind":"Field","name":{"kind":"Name","value":"panNumber"}},{"kind":"Field","name":{"kind":"Name","value":"gstin"}},{"kind":"Field","name":{"kind":"Name","value":"businessEmail"}},{"kind":"Field","name":{"kind":"Name","value":"businessPhone"}},{"kind":"Field","name":{"kind":"Name","value":"supportEmail"}},{"kind":"Field","name":{"kind":"Name","value":"signatoryName"}},{"kind":"Field","name":{"kind":"Name","value":"signatoryPan"}},{"kind":"Field","name":{"kind":"Name","value":"signatoryDesignation"}},{"kind":"Field","name":{"kind":"Name","value":"overallStatus"}},{"kind":"Field","name":{"kind":"Name","value":"panVerifiedAt"}},{"kind":"Field","name":{"kind":"Name","value":"gstinVerifiedAt"}},{"kind":"Field","name":{"kind":"Name","value":"bankVerifiedAt"}},{"kind":"Field","name":{"kind":"Name","value":"documentsVerifiedAt"}},{"kind":"Field","name":{"kind":"Name","value":"rejectionReason"}},{"kind":"Field","name":{"kind":"Name","value":"commissionRate"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}},{"kind":"Field","name":{"kind":"Name","value":"payoutAccounts"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"PayoutAccountFields"}}]}}]}}]} as unknown as DocumentNode<VerifySellerSectionMutation, VerifySellerSectionMutationVariables>;
export const SetSellerStatusDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"SetSellerStatus"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"setStatusInput"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"SetSellerStatusInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"setSellerStatus"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"setStatusInput"},"value":{"kind":"Variable","name":{"kind":"Name","value":"setStatusInput"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"SellerFields"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"PayoutAccountFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"SellerPayoutAccount"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"sellerId"}},{"kind":"Field","name":{"kind":"Name","value":"accountType"}},{"kind":"Field","name":{"kind":"Name","value":"accountHolderName"}},{"kind":"Field","name":{"kind":"Name","value":"accountNumber"}},{"kind":"Field","name":{"kind":"Name","value":"ifscCode"}},{"kind":"Field","name":{"kind":"Name","value":"bankName"}},{"kind":"Field","name":{"kind":"Name","value":"upiId"}},{"kind":"Field","name":{"kind":"Name","value":"walletProvider"}},{"kind":"Field","name":{"kind":"Name","value":"isPrimary"}},{"kind":"Field","name":{"kind":"Name","value":"isVerified"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"SellerFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Seller"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"userId"}},{"kind":"Field","name":{"kind":"Name","value":"legalName"}},{"kind":"Field","name":{"kind":"Name","value":"displayName"}},{"kind":"Field","name":{"kind":"Name","value":"businessType"}},{"kind":"Field","name":{"kind":"Name","value":"dateOfIncorporation"}},{"kind":"Field","name":{"kind":"Name","value":"registrationNumber"}},{"kind":"Field","name":{"kind":"Name","value":"panNumber"}},{"kind":"Field","name":{"kind":"Name","value":"gstin"}},{"kind":"Field","name":{"kind":"Name","value":"businessEmail"}},{"kind":"Field","name":{"kind":"Name","value":"businessPhone"}},{"kind":"Field","name":{"kind":"Name","value":"supportEmail"}},{"kind":"Field","name":{"kind":"Name","value":"signatoryName"}},{"kind":"Field","name":{"kind":"Name","value":"signatoryPan"}},{"kind":"Field","name":{"kind":"Name","value":"signatoryDesignation"}},{"kind":"Field","name":{"kind":"Name","value":"overallStatus"}},{"kind":"Field","name":{"kind":"Name","value":"panVerifiedAt"}},{"kind":"Field","name":{"kind":"Name","value":"gstinVerifiedAt"}},{"kind":"Field","name":{"kind":"Name","value":"bankVerifiedAt"}},{"kind":"Field","name":{"kind":"Name","value":"documentsVerifiedAt"}},{"kind":"Field","name":{"kind":"Name","value":"rejectionReason"}},{"kind":"Field","name":{"kind":"Name","value":"commissionRate"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}},{"kind":"Field","name":{"kind":"Name","value":"payoutAccounts"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"PayoutAccountFields"}}]}}]}}]} as unknown as DocumentNode<SetSellerStatusMutation, SetSellerStatusMutationVariables>;
export const RemoveSellerDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"RemoveSeller"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"removeSeller"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"SellerFields"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"PayoutAccountFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"SellerPayoutAccount"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"sellerId"}},{"kind":"Field","name":{"kind":"Name","value":"accountType"}},{"kind":"Field","name":{"kind":"Name","value":"accountHolderName"}},{"kind":"Field","name":{"kind":"Name","value":"accountNumber"}},{"kind":"Field","name":{"kind":"Name","value":"ifscCode"}},{"kind":"Field","name":{"kind":"Name","value":"bankName"}},{"kind":"Field","name":{"kind":"Name","value":"upiId"}},{"kind":"Field","name":{"kind":"Name","value":"walletProvider"}},{"kind":"Field","name":{"kind":"Name","value":"isPrimary"}},{"kind":"Field","name":{"kind":"Name","value":"isVerified"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"SellerFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Seller"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"userId"}},{"kind":"Field","name":{"kind":"Name","value":"legalName"}},{"kind":"Field","name":{"kind":"Name","value":"displayName"}},{"kind":"Field","name":{"kind":"Name","value":"businessType"}},{"kind":"Field","name":{"kind":"Name","value":"dateOfIncorporation"}},{"kind":"Field","name":{"kind":"Name","value":"registrationNumber"}},{"kind":"Field","name":{"kind":"Name","value":"panNumber"}},{"kind":"Field","name":{"kind":"Name","value":"gstin"}},{"kind":"Field","name":{"kind":"Name","value":"businessEmail"}},{"kind":"Field","name":{"kind":"Name","value":"businessPhone"}},{"kind":"Field","name":{"kind":"Name","value":"supportEmail"}},{"kind":"Field","name":{"kind":"Name","value":"signatoryName"}},{"kind":"Field","name":{"kind":"Name","value":"signatoryPan"}},{"kind":"Field","name":{"kind":"Name","value":"signatoryDesignation"}},{"kind":"Field","name":{"kind":"Name","value":"overallStatus"}},{"kind":"Field","name":{"kind":"Name","value":"panVerifiedAt"}},{"kind":"Field","name":{"kind":"Name","value":"gstinVerifiedAt"}},{"kind":"Field","name":{"kind":"Name","value":"bankVerifiedAt"}},{"kind":"Field","name":{"kind":"Name","value":"documentsVerifiedAt"}},{"kind":"Field","name":{"kind":"Name","value":"rejectionReason"}},{"kind":"Field","name":{"kind":"Name","value":"commissionRate"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}},{"kind":"Field","name":{"kind":"Name","value":"payoutAccounts"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"PayoutAccountFields"}}]}}]}}]} as unknown as DocumentNode<RemoveSellerMutation, RemoveSellerMutationVariables>;
export const GetSiteSettingsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetSiteSettings"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"group"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"SettingGroup"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"siteSettings"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"group"},"value":{"kind":"Variable","name":{"kind":"Name","value":"group"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"key"}},{"kind":"Field","name":{"kind":"Name","value":"value"}},{"kind":"Field","name":{"kind":"Name","value":"group"}},{"kind":"Field","name":{"kind":"Name","value":"label"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"valueType"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}}]}}]}}]} as unknown as DocumentNode<GetSiteSettingsQuery, GetSiteSettingsQueryVariables>;
export const UpdateSiteSettingDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"UpdateSiteSetting"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"UpdateSiteSettingInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"updateSiteSetting"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"key"}},{"kind":"Field","name":{"kind":"Name","value":"value"}},{"kind":"Field","name":{"kind":"Name","value":"group"}},{"kind":"Field","name":{"kind":"Name","value":"label"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"valueType"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}}]}}]}}]} as unknown as DocumentNode<UpdateSiteSettingMutation, UpdateSiteSettingMutationVariables>;
export const GetPublicSliderDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetPublicSlider"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"key"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"publicSlider"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"key"},"value":{"kind":"Variable","name":{"kind":"Name","value":"key"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"SliderFields"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"SlideItemFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"SlideItem"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"sliderId"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"link"}},{"kind":"Field","name":{"kind":"Name","value":"ctaLabel"}},{"kind":"Field","name":{"kind":"Name","value":"imageUrl"}},{"kind":"Field","name":{"kind":"Name","value":"tabletImageUrl"}},{"kind":"Field","name":{"kind":"Name","value":"mobileImageUrl"}},{"kind":"Field","name":{"kind":"Name","value":"order"}},{"kind":"Field","name":{"kind":"Name","value":"isEnabled"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"SliderFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Slider"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"key"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"config"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}},{"kind":"Field","name":{"kind":"Name","value":"items"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"SlideItemFields"}}]}}]}}]} as unknown as DocumentNode<GetPublicSliderQuery, GetPublicSliderQueryVariables>;
export const GetAdminSlidersDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetAdminSliders"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"adminSliders"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"SliderFields"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"SlideItemFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"SlideItem"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"sliderId"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"link"}},{"kind":"Field","name":{"kind":"Name","value":"ctaLabel"}},{"kind":"Field","name":{"kind":"Name","value":"imageUrl"}},{"kind":"Field","name":{"kind":"Name","value":"tabletImageUrl"}},{"kind":"Field","name":{"kind":"Name","value":"mobileImageUrl"}},{"kind":"Field","name":{"kind":"Name","value":"order"}},{"kind":"Field","name":{"kind":"Name","value":"isEnabled"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"SliderFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Slider"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"key"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"config"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}},{"kind":"Field","name":{"kind":"Name","value":"items"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"SlideItemFields"}}]}}]}}]} as unknown as DocumentNode<GetAdminSlidersQuery, GetAdminSlidersQueryVariables>;
export const GetAdminSlidersPaginatedDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetAdminSlidersPaginated"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"status"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"SliderStatus"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"page"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"pageSize"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"search"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"adminSlidersPaginated"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"status"},"value":{"kind":"Variable","name":{"kind":"Name","value":"status"}}},{"kind":"Argument","name":{"kind":"Name","value":"page"},"value":{"kind":"Variable","name":{"kind":"Name","value":"page"}}},{"kind":"Argument","name":{"kind":"Name","value":"pageSize"},"value":{"kind":"Variable","name":{"kind":"Name","value":"pageSize"}}},{"kind":"Argument","name":{"kind":"Name","value":"search"},"value":{"kind":"Variable","name":{"kind":"Name","value":"search"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"items"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"SliderFields"}}]}},{"kind":"Field","name":{"kind":"Name","value":"totalCount"}},{"kind":"Field","name":{"kind":"Name","value":"totalPages"}},{"kind":"Field","name":{"kind":"Name","value":"currentPage"}},{"kind":"Field","name":{"kind":"Name","value":"pageSize"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"SlideItemFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"SlideItem"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"sliderId"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"link"}},{"kind":"Field","name":{"kind":"Name","value":"ctaLabel"}},{"kind":"Field","name":{"kind":"Name","value":"imageUrl"}},{"kind":"Field","name":{"kind":"Name","value":"tabletImageUrl"}},{"kind":"Field","name":{"kind":"Name","value":"mobileImageUrl"}},{"kind":"Field","name":{"kind":"Name","value":"order"}},{"kind":"Field","name":{"kind":"Name","value":"isEnabled"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"SliderFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Slider"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"key"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"config"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}},{"kind":"Field","name":{"kind":"Name","value":"items"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"SlideItemFields"}}]}}]}}]} as unknown as DocumentNode<GetAdminSlidersPaginatedQuery, GetAdminSlidersPaginatedQueryVariables>;
export const GetAdminSliderDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetAdminSlider"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"adminSlider"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"SliderFields"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"SlideItemFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"SlideItem"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"sliderId"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"link"}},{"kind":"Field","name":{"kind":"Name","value":"ctaLabel"}},{"kind":"Field","name":{"kind":"Name","value":"imageUrl"}},{"kind":"Field","name":{"kind":"Name","value":"tabletImageUrl"}},{"kind":"Field","name":{"kind":"Name","value":"mobileImageUrl"}},{"kind":"Field","name":{"kind":"Name","value":"order"}},{"kind":"Field","name":{"kind":"Name","value":"isEnabled"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"SliderFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Slider"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"key"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"config"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}},{"kind":"Field","name":{"kind":"Name","value":"items"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"SlideItemFields"}}]}}]}}]} as unknown as DocumentNode<GetAdminSliderQuery, GetAdminSliderQueryVariables>;
export const CreateSliderDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"CreateSlider"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"createSliderInput"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"CreateSliderInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"createSlider"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"createSliderInput"},"value":{"kind":"Variable","name":{"kind":"Name","value":"createSliderInput"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"SliderFields"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"SlideItemFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"SlideItem"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"sliderId"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"link"}},{"kind":"Field","name":{"kind":"Name","value":"ctaLabel"}},{"kind":"Field","name":{"kind":"Name","value":"imageUrl"}},{"kind":"Field","name":{"kind":"Name","value":"tabletImageUrl"}},{"kind":"Field","name":{"kind":"Name","value":"mobileImageUrl"}},{"kind":"Field","name":{"kind":"Name","value":"order"}},{"kind":"Field","name":{"kind":"Name","value":"isEnabled"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"SliderFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Slider"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"key"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"config"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}},{"kind":"Field","name":{"kind":"Name","value":"items"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"SlideItemFields"}}]}}]}}]} as unknown as DocumentNode<CreateSliderMutation, CreateSliderMutationVariables>;
export const UpdateSliderDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"UpdateSlider"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"updateSliderInput"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"UpdateSliderInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"updateSlider"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"updateSliderInput"},"value":{"kind":"Variable","name":{"kind":"Name","value":"updateSliderInput"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"SliderFields"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"SlideItemFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"SlideItem"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"sliderId"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"link"}},{"kind":"Field","name":{"kind":"Name","value":"ctaLabel"}},{"kind":"Field","name":{"kind":"Name","value":"imageUrl"}},{"kind":"Field","name":{"kind":"Name","value":"tabletImageUrl"}},{"kind":"Field","name":{"kind":"Name","value":"mobileImageUrl"}},{"kind":"Field","name":{"kind":"Name","value":"order"}},{"kind":"Field","name":{"kind":"Name","value":"isEnabled"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"SliderFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Slider"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"key"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"config"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}},{"kind":"Field","name":{"kind":"Name","value":"items"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"SlideItemFields"}}]}}]}}]} as unknown as DocumentNode<UpdateSliderMutation, UpdateSliderMutationVariables>;
export const SetSliderStatusDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"SetSliderStatus"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"setSliderStatusInput"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"SetSliderStatusInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"setSliderStatus"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"setSliderStatusInput"},"value":{"kind":"Variable","name":{"kind":"Name","value":"setSliderStatusInput"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"SliderFields"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"SlideItemFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"SlideItem"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"sliderId"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"link"}},{"kind":"Field","name":{"kind":"Name","value":"ctaLabel"}},{"kind":"Field","name":{"kind":"Name","value":"imageUrl"}},{"kind":"Field","name":{"kind":"Name","value":"tabletImageUrl"}},{"kind":"Field","name":{"kind":"Name","value":"mobileImageUrl"}},{"kind":"Field","name":{"kind":"Name","value":"order"}},{"kind":"Field","name":{"kind":"Name","value":"isEnabled"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"SliderFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Slider"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"key"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"config"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}},{"kind":"Field","name":{"kind":"Name","value":"items"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"SlideItemFields"}}]}}]}}]} as unknown as DocumentNode<SetSliderStatusMutation, SetSliderStatusMutationVariables>;
export const RemoveSliderDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"RemoveSlider"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"removeSlider"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"SliderFields"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"SlideItemFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"SlideItem"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"sliderId"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"link"}},{"kind":"Field","name":{"kind":"Name","value":"ctaLabel"}},{"kind":"Field","name":{"kind":"Name","value":"imageUrl"}},{"kind":"Field","name":{"kind":"Name","value":"tabletImageUrl"}},{"kind":"Field","name":{"kind":"Name","value":"mobileImageUrl"}},{"kind":"Field","name":{"kind":"Name","value":"order"}},{"kind":"Field","name":{"kind":"Name","value":"isEnabled"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"SliderFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Slider"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"key"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"config"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}},{"kind":"Field","name":{"kind":"Name","value":"items"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"SlideItemFields"}}]}}]}}]} as unknown as DocumentNode<RemoveSliderMutation, RemoveSliderMutationVariables>;
export const AddSlideItemDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"AddSlideItem"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"addSlideItemInput"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"AddSlideItemInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"addSlideItem"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"addSlideItemInput"},"value":{"kind":"Variable","name":{"kind":"Name","value":"addSlideItemInput"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"SlideItemFields"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"SlideItemFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"SlideItem"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"sliderId"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"link"}},{"kind":"Field","name":{"kind":"Name","value":"ctaLabel"}},{"kind":"Field","name":{"kind":"Name","value":"imageUrl"}},{"kind":"Field","name":{"kind":"Name","value":"tabletImageUrl"}},{"kind":"Field","name":{"kind":"Name","value":"mobileImageUrl"}},{"kind":"Field","name":{"kind":"Name","value":"order"}},{"kind":"Field","name":{"kind":"Name","value":"isEnabled"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}}]}}]} as unknown as DocumentNode<AddSlideItemMutation, AddSlideItemMutationVariables>;
export const UpdateSlideItemDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"UpdateSlideItem"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"updateSlideItemInput"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"UpdateSlideItemInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"updateSlideItem"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"updateSlideItemInput"},"value":{"kind":"Variable","name":{"kind":"Name","value":"updateSlideItemInput"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"SlideItemFields"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"SlideItemFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"SlideItem"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"sliderId"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"link"}},{"kind":"Field","name":{"kind":"Name","value":"ctaLabel"}},{"kind":"Field","name":{"kind":"Name","value":"imageUrl"}},{"kind":"Field","name":{"kind":"Name","value":"tabletImageUrl"}},{"kind":"Field","name":{"kind":"Name","value":"mobileImageUrl"}},{"kind":"Field","name":{"kind":"Name","value":"order"}},{"kind":"Field","name":{"kind":"Name","value":"isEnabled"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}}]}}]} as unknown as DocumentNode<UpdateSlideItemMutation, UpdateSlideItemMutationVariables>;
export const RemoveSlideItemDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"RemoveSlideItem"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"removeSlideItem"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"SlideItemFields"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"SlideItemFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"SlideItem"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"sliderId"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"link"}},{"kind":"Field","name":{"kind":"Name","value":"ctaLabel"}},{"kind":"Field","name":{"kind":"Name","value":"imageUrl"}},{"kind":"Field","name":{"kind":"Name","value":"tabletImageUrl"}},{"kind":"Field","name":{"kind":"Name","value":"mobileImageUrl"}},{"kind":"Field","name":{"kind":"Name","value":"order"}},{"kind":"Field","name":{"kind":"Name","value":"isEnabled"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}}]}}]} as unknown as DocumentNode<RemoveSlideItemMutation, RemoveSlideItemMutationVariables>;
export const ReorderSlideItemsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"ReorderSlideItems"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"reorderSlideItemsInput"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ReorderSlideItemsInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"reorderSlideItems"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"reorderSlideItemsInput"},"value":{"kind":"Variable","name":{"kind":"Name","value":"reorderSlideItemsInput"}}}]}]}}]} as unknown as DocumentNode<ReorderSlideItemsMutation, ReorderSlideItemsMutationVariables>;
export const GetMyStoresDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetMyStores"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"myStores"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"StoreFields"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"WarehouseFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Warehouse"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"storeId"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"code"}},{"kind":"Field","name":{"kind":"Name","value":"addressLine1"}},{"kind":"Field","name":{"kind":"Name","value":"addressLine2"}},{"kind":"Field","name":{"kind":"Name","value":"city"}},{"kind":"Field","name":{"kind":"Name","value":"state"}},{"kind":"Field","name":{"kind":"Name","value":"postalCode"}},{"kind":"Field","name":{"kind":"Name","value":"countryCode"}},{"kind":"Field","name":{"kind":"Name","value":"phone"}},{"kind":"Field","name":{"kind":"Name","value":"isDefault"}},{"kind":"Field","name":{"kind":"Name","value":"isActive"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"StoreFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Store"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"sellerId"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"slug"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"logoUrl"}},{"kind":"Field","name":{"kind":"Name","value":"bannerUrl"}},{"kind":"Field","name":{"kind":"Name","value":"currencyCode"}},{"kind":"Field","name":{"kind":"Name","value":"timezone"}},{"kind":"Field","name":{"kind":"Name","value":"locale"}},{"kind":"Field","name":{"kind":"Name","value":"supportEmail"}},{"kind":"Field","name":{"kind":"Name","value":"supportPhone"}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"isFeatured"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}},{"kind":"Field","name":{"kind":"Name","value":"warehouses"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"WarehouseFields"}}]}}]}}]} as unknown as DocumentNode<GetMyStoresQuery, GetMyStoresQueryVariables>;
export const GetMyStoreDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetMyStore"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"myStore"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"StoreFields"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"WarehouseFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Warehouse"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"storeId"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"code"}},{"kind":"Field","name":{"kind":"Name","value":"addressLine1"}},{"kind":"Field","name":{"kind":"Name","value":"addressLine2"}},{"kind":"Field","name":{"kind":"Name","value":"city"}},{"kind":"Field","name":{"kind":"Name","value":"state"}},{"kind":"Field","name":{"kind":"Name","value":"postalCode"}},{"kind":"Field","name":{"kind":"Name","value":"countryCode"}},{"kind":"Field","name":{"kind":"Name","value":"phone"}},{"kind":"Field","name":{"kind":"Name","value":"isDefault"}},{"kind":"Field","name":{"kind":"Name","value":"isActive"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"StoreFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Store"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"sellerId"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"slug"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"logoUrl"}},{"kind":"Field","name":{"kind":"Name","value":"bannerUrl"}},{"kind":"Field","name":{"kind":"Name","value":"currencyCode"}},{"kind":"Field","name":{"kind":"Name","value":"timezone"}},{"kind":"Field","name":{"kind":"Name","value":"locale"}},{"kind":"Field","name":{"kind":"Name","value":"supportEmail"}},{"kind":"Field","name":{"kind":"Name","value":"supportPhone"}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"isFeatured"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}},{"kind":"Field","name":{"kind":"Name","value":"warehouses"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"WarehouseFields"}}]}}]}}]} as unknown as DocumentNode<GetMyStoreQuery, GetMyStoreQueryVariables>;
export const CreateMyStoreDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"CreateMyStore"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"createStoreInput"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"CreateStoreInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"createMyStore"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"createStoreInput"},"value":{"kind":"Variable","name":{"kind":"Name","value":"createStoreInput"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"StoreFields"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"WarehouseFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Warehouse"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"storeId"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"code"}},{"kind":"Field","name":{"kind":"Name","value":"addressLine1"}},{"kind":"Field","name":{"kind":"Name","value":"addressLine2"}},{"kind":"Field","name":{"kind":"Name","value":"city"}},{"kind":"Field","name":{"kind":"Name","value":"state"}},{"kind":"Field","name":{"kind":"Name","value":"postalCode"}},{"kind":"Field","name":{"kind":"Name","value":"countryCode"}},{"kind":"Field","name":{"kind":"Name","value":"phone"}},{"kind":"Field","name":{"kind":"Name","value":"isDefault"}},{"kind":"Field","name":{"kind":"Name","value":"isActive"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"StoreFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Store"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"sellerId"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"slug"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"logoUrl"}},{"kind":"Field","name":{"kind":"Name","value":"bannerUrl"}},{"kind":"Field","name":{"kind":"Name","value":"currencyCode"}},{"kind":"Field","name":{"kind":"Name","value":"timezone"}},{"kind":"Field","name":{"kind":"Name","value":"locale"}},{"kind":"Field","name":{"kind":"Name","value":"supportEmail"}},{"kind":"Field","name":{"kind":"Name","value":"supportPhone"}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"isFeatured"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}},{"kind":"Field","name":{"kind":"Name","value":"warehouses"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"WarehouseFields"}}]}}]}}]} as unknown as DocumentNode<CreateMyStoreMutation, CreateMyStoreMutationVariables>;
export const UpdateMyStoreDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"UpdateMyStore"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"updateStoreInput"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"UpdateStoreInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"updateMyStore"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"updateStoreInput"},"value":{"kind":"Variable","name":{"kind":"Name","value":"updateStoreInput"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"StoreFields"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"WarehouseFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Warehouse"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"storeId"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"code"}},{"kind":"Field","name":{"kind":"Name","value":"addressLine1"}},{"kind":"Field","name":{"kind":"Name","value":"addressLine2"}},{"kind":"Field","name":{"kind":"Name","value":"city"}},{"kind":"Field","name":{"kind":"Name","value":"state"}},{"kind":"Field","name":{"kind":"Name","value":"postalCode"}},{"kind":"Field","name":{"kind":"Name","value":"countryCode"}},{"kind":"Field","name":{"kind":"Name","value":"phone"}},{"kind":"Field","name":{"kind":"Name","value":"isDefault"}},{"kind":"Field","name":{"kind":"Name","value":"isActive"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"StoreFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Store"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"sellerId"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"slug"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"logoUrl"}},{"kind":"Field","name":{"kind":"Name","value":"bannerUrl"}},{"kind":"Field","name":{"kind":"Name","value":"currencyCode"}},{"kind":"Field","name":{"kind":"Name","value":"timezone"}},{"kind":"Field","name":{"kind":"Name","value":"locale"}},{"kind":"Field","name":{"kind":"Name","value":"supportEmail"}},{"kind":"Field","name":{"kind":"Name","value":"supportPhone"}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"isFeatured"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}},{"kind":"Field","name":{"kind":"Name","value":"warehouses"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"WarehouseFields"}}]}}]}}]} as unknown as DocumentNode<UpdateMyStoreMutation, UpdateMyStoreMutationVariables>;
export const SubmitMyStoreForReviewDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"SubmitMyStoreForReview"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"submitMyStoreForReview"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"StoreFields"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"WarehouseFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Warehouse"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"storeId"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"code"}},{"kind":"Field","name":{"kind":"Name","value":"addressLine1"}},{"kind":"Field","name":{"kind":"Name","value":"addressLine2"}},{"kind":"Field","name":{"kind":"Name","value":"city"}},{"kind":"Field","name":{"kind":"Name","value":"state"}},{"kind":"Field","name":{"kind":"Name","value":"postalCode"}},{"kind":"Field","name":{"kind":"Name","value":"countryCode"}},{"kind":"Field","name":{"kind":"Name","value":"phone"}},{"kind":"Field","name":{"kind":"Name","value":"isDefault"}},{"kind":"Field","name":{"kind":"Name","value":"isActive"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"StoreFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Store"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"sellerId"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"slug"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"logoUrl"}},{"kind":"Field","name":{"kind":"Name","value":"bannerUrl"}},{"kind":"Field","name":{"kind":"Name","value":"currencyCode"}},{"kind":"Field","name":{"kind":"Name","value":"timezone"}},{"kind":"Field","name":{"kind":"Name","value":"locale"}},{"kind":"Field","name":{"kind":"Name","value":"supportEmail"}},{"kind":"Field","name":{"kind":"Name","value":"supportPhone"}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"isFeatured"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}},{"kind":"Field","name":{"kind":"Name","value":"warehouses"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"WarehouseFields"}}]}}]}}]} as unknown as DocumentNode<SubmitMyStoreForReviewMutation, SubmitMyStoreForReviewMutationVariables>;
export const RemoveMyStoreDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"RemoveMyStore"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"removeMyStore"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"StoreFields"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"WarehouseFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Warehouse"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"storeId"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"code"}},{"kind":"Field","name":{"kind":"Name","value":"addressLine1"}},{"kind":"Field","name":{"kind":"Name","value":"addressLine2"}},{"kind":"Field","name":{"kind":"Name","value":"city"}},{"kind":"Field","name":{"kind":"Name","value":"state"}},{"kind":"Field","name":{"kind":"Name","value":"postalCode"}},{"kind":"Field","name":{"kind":"Name","value":"countryCode"}},{"kind":"Field","name":{"kind":"Name","value":"phone"}},{"kind":"Field","name":{"kind":"Name","value":"isDefault"}},{"kind":"Field","name":{"kind":"Name","value":"isActive"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"StoreFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Store"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"sellerId"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"slug"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"logoUrl"}},{"kind":"Field","name":{"kind":"Name","value":"bannerUrl"}},{"kind":"Field","name":{"kind":"Name","value":"currencyCode"}},{"kind":"Field","name":{"kind":"Name","value":"timezone"}},{"kind":"Field","name":{"kind":"Name","value":"locale"}},{"kind":"Field","name":{"kind":"Name","value":"supportEmail"}},{"kind":"Field","name":{"kind":"Name","value":"supportPhone"}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"isFeatured"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}},{"kind":"Field","name":{"kind":"Name","value":"warehouses"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"WarehouseFields"}}]}}]}}]} as unknown as DocumentNode<RemoveMyStoreMutation, RemoveMyStoreMutationVariables>;
export const CreateMyWarehouseDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"CreateMyWarehouse"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"createWarehouseInput"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"CreateWarehouseInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"createMyWarehouse"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"createWarehouseInput"},"value":{"kind":"Variable","name":{"kind":"Name","value":"createWarehouseInput"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"WarehouseFields"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"WarehouseFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Warehouse"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"storeId"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"code"}},{"kind":"Field","name":{"kind":"Name","value":"addressLine1"}},{"kind":"Field","name":{"kind":"Name","value":"addressLine2"}},{"kind":"Field","name":{"kind":"Name","value":"city"}},{"kind":"Field","name":{"kind":"Name","value":"state"}},{"kind":"Field","name":{"kind":"Name","value":"postalCode"}},{"kind":"Field","name":{"kind":"Name","value":"countryCode"}},{"kind":"Field","name":{"kind":"Name","value":"phone"}},{"kind":"Field","name":{"kind":"Name","value":"isDefault"}},{"kind":"Field","name":{"kind":"Name","value":"isActive"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}}]}}]} as unknown as DocumentNode<CreateMyWarehouseMutation, CreateMyWarehouseMutationVariables>;
export const UpdateMyWarehouseDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"UpdateMyWarehouse"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"updateWarehouseInput"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"UpdateWarehouseInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"updateMyWarehouse"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"updateWarehouseInput"},"value":{"kind":"Variable","name":{"kind":"Name","value":"updateWarehouseInput"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"WarehouseFields"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"WarehouseFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Warehouse"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"storeId"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"code"}},{"kind":"Field","name":{"kind":"Name","value":"addressLine1"}},{"kind":"Field","name":{"kind":"Name","value":"addressLine2"}},{"kind":"Field","name":{"kind":"Name","value":"city"}},{"kind":"Field","name":{"kind":"Name","value":"state"}},{"kind":"Field","name":{"kind":"Name","value":"postalCode"}},{"kind":"Field","name":{"kind":"Name","value":"countryCode"}},{"kind":"Field","name":{"kind":"Name","value":"phone"}},{"kind":"Field","name":{"kind":"Name","value":"isDefault"}},{"kind":"Field","name":{"kind":"Name","value":"isActive"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}}]}}]} as unknown as DocumentNode<UpdateMyWarehouseMutation, UpdateMyWarehouseMutationVariables>;
export const RemoveMyWarehouseDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"RemoveMyWarehouse"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"removeMyWarehouse"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"WarehouseFields"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"WarehouseFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Warehouse"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"storeId"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"code"}},{"kind":"Field","name":{"kind":"Name","value":"addressLine1"}},{"kind":"Field","name":{"kind":"Name","value":"addressLine2"}},{"kind":"Field","name":{"kind":"Name","value":"city"}},{"kind":"Field","name":{"kind":"Name","value":"state"}},{"kind":"Field","name":{"kind":"Name","value":"postalCode"}},{"kind":"Field","name":{"kind":"Name","value":"countryCode"}},{"kind":"Field","name":{"kind":"Name","value":"phone"}},{"kind":"Field","name":{"kind":"Name","value":"isDefault"}},{"kind":"Field","name":{"kind":"Name","value":"isActive"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}}]}}]} as unknown as DocumentNode<RemoveMyWarehouseMutation, RemoveMyWarehouseMutationVariables>;
export const GetStoresDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetStores"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"status"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"StoreStatus"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"stores"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"status"},"value":{"kind":"Variable","name":{"kind":"Name","value":"status"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"StoreFields"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"WarehouseFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Warehouse"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"storeId"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"code"}},{"kind":"Field","name":{"kind":"Name","value":"addressLine1"}},{"kind":"Field","name":{"kind":"Name","value":"addressLine2"}},{"kind":"Field","name":{"kind":"Name","value":"city"}},{"kind":"Field","name":{"kind":"Name","value":"state"}},{"kind":"Field","name":{"kind":"Name","value":"postalCode"}},{"kind":"Field","name":{"kind":"Name","value":"countryCode"}},{"kind":"Field","name":{"kind":"Name","value":"phone"}},{"kind":"Field","name":{"kind":"Name","value":"isDefault"}},{"kind":"Field","name":{"kind":"Name","value":"isActive"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"StoreFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Store"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"sellerId"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"slug"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"logoUrl"}},{"kind":"Field","name":{"kind":"Name","value":"bannerUrl"}},{"kind":"Field","name":{"kind":"Name","value":"currencyCode"}},{"kind":"Field","name":{"kind":"Name","value":"timezone"}},{"kind":"Field","name":{"kind":"Name","value":"locale"}},{"kind":"Field","name":{"kind":"Name","value":"supportEmail"}},{"kind":"Field","name":{"kind":"Name","value":"supportPhone"}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"isFeatured"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}},{"kind":"Field","name":{"kind":"Name","value":"warehouses"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"WarehouseFields"}}]}}]}}]} as unknown as DocumentNode<GetStoresQuery, GetStoresQueryVariables>;
export const SetStoreStatusDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"SetStoreStatus"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"setStoreStatusInput"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"SetStoreStatusInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"setStoreStatus"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"setStoreStatusInput"},"value":{"kind":"Variable","name":{"kind":"Name","value":"setStoreStatusInput"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"StoreFields"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"WarehouseFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Warehouse"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"storeId"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"code"}},{"kind":"Field","name":{"kind":"Name","value":"addressLine1"}},{"kind":"Field","name":{"kind":"Name","value":"addressLine2"}},{"kind":"Field","name":{"kind":"Name","value":"city"}},{"kind":"Field","name":{"kind":"Name","value":"state"}},{"kind":"Field","name":{"kind":"Name","value":"postalCode"}},{"kind":"Field","name":{"kind":"Name","value":"countryCode"}},{"kind":"Field","name":{"kind":"Name","value":"phone"}},{"kind":"Field","name":{"kind":"Name","value":"isDefault"}},{"kind":"Field","name":{"kind":"Name","value":"isActive"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"StoreFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Store"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"sellerId"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"slug"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"logoUrl"}},{"kind":"Field","name":{"kind":"Name","value":"bannerUrl"}},{"kind":"Field","name":{"kind":"Name","value":"currencyCode"}},{"kind":"Field","name":{"kind":"Name","value":"timezone"}},{"kind":"Field","name":{"kind":"Name","value":"locale"}},{"kind":"Field","name":{"kind":"Name","value":"supportEmail"}},{"kind":"Field","name":{"kind":"Name","value":"supportPhone"}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"isFeatured"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}},{"kind":"Field","name":{"kind":"Name","value":"warehouses"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"WarehouseFields"}}]}}]}}]} as unknown as DocumentNode<SetStoreStatusMutation, SetStoreStatusMutationVariables>;
export const AdminRemoveStoreDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"AdminRemoveStore"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"adminRemoveStore"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"StoreFields"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"WarehouseFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Warehouse"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"storeId"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"code"}},{"kind":"Field","name":{"kind":"Name","value":"addressLine1"}},{"kind":"Field","name":{"kind":"Name","value":"addressLine2"}},{"kind":"Field","name":{"kind":"Name","value":"city"}},{"kind":"Field","name":{"kind":"Name","value":"state"}},{"kind":"Field","name":{"kind":"Name","value":"postalCode"}},{"kind":"Field","name":{"kind":"Name","value":"countryCode"}},{"kind":"Field","name":{"kind":"Name","value":"phone"}},{"kind":"Field","name":{"kind":"Name","value":"isDefault"}},{"kind":"Field","name":{"kind":"Name","value":"isActive"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"StoreFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Store"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"sellerId"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"slug"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"logoUrl"}},{"kind":"Field","name":{"kind":"Name","value":"bannerUrl"}},{"kind":"Field","name":{"kind":"Name","value":"currencyCode"}},{"kind":"Field","name":{"kind":"Name","value":"timezone"}},{"kind":"Field","name":{"kind":"Name","value":"locale"}},{"kind":"Field","name":{"kind":"Name","value":"supportEmail"}},{"kind":"Field","name":{"kind":"Name","value":"supportPhone"}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"isFeatured"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}},{"kind":"Field","name":{"kind":"Name","value":"warehouses"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"WarehouseFields"}}]}}]}}]} as unknown as DocumentNode<AdminRemoveStoreMutation, AdminRemoveStoreMutationVariables>;
export const GetPublicStoreDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetPublicStore"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"slug"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"publicStore"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"slug"},"value":{"kind":"Variable","name":{"kind":"Name","value":"slug"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"StoreFields"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"WarehouseFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Warehouse"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"storeId"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"code"}},{"kind":"Field","name":{"kind":"Name","value":"addressLine1"}},{"kind":"Field","name":{"kind":"Name","value":"addressLine2"}},{"kind":"Field","name":{"kind":"Name","value":"city"}},{"kind":"Field","name":{"kind":"Name","value":"state"}},{"kind":"Field","name":{"kind":"Name","value":"postalCode"}},{"kind":"Field","name":{"kind":"Name","value":"countryCode"}},{"kind":"Field","name":{"kind":"Name","value":"phone"}},{"kind":"Field","name":{"kind":"Name","value":"isDefault"}},{"kind":"Field","name":{"kind":"Name","value":"isActive"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"StoreFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Store"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"sellerId"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"slug"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"logoUrl"}},{"kind":"Field","name":{"kind":"Name","value":"bannerUrl"}},{"kind":"Field","name":{"kind":"Name","value":"currencyCode"}},{"kind":"Field","name":{"kind":"Name","value":"timezone"}},{"kind":"Field","name":{"kind":"Name","value":"locale"}},{"kind":"Field","name":{"kind":"Name","value":"supportEmail"}},{"kind":"Field","name":{"kind":"Name","value":"supportPhone"}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"isFeatured"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}},{"kind":"Field","name":{"kind":"Name","value":"warehouses"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"WarehouseFields"}}]}}]}}]} as unknown as DocumentNode<GetPublicStoreQuery, GetPublicStoreQueryVariables>;
export const GetAdminTagsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetAdminTags"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"status"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"TagStatus"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"adminTags"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"status"},"value":{"kind":"Variable","name":{"kind":"Name","value":"status"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"TagFields"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"TagFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Tag"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"slug"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"isFeatured"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}}]}}]} as unknown as DocumentNode<GetAdminTagsQuery, GetAdminTagsQueryVariables>;
export const GetTagsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetTags"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"status"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"TagStatus"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"featuredOnly"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Boolean"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"tags"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"status"},"value":{"kind":"Variable","name":{"kind":"Name","value":"status"}}},{"kind":"Argument","name":{"kind":"Name","value":"featuredOnly"},"value":{"kind":"Variable","name":{"kind":"Name","value":"featuredOnly"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"TagFields"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"TagFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Tag"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"slug"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"isFeatured"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}}]}}]} as unknown as DocumentNode<GetTagsQuery, GetTagsQueryVariables>;
export const GetTagDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetTag"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"tag"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"TagFields"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"TagFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Tag"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"slug"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"isFeatured"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}}]}}]} as unknown as DocumentNode<GetTagQuery, GetTagQueryVariables>;
export const GetPublicTagDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetPublicTag"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"slug"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"publicTag"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"slug"},"value":{"kind":"Variable","name":{"kind":"Name","value":"slug"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"TagFields"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"TagFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Tag"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"slug"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"isFeatured"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}}]}}]} as unknown as DocumentNode<GetPublicTagQuery, GetPublicTagQueryVariables>;
export const CreateTagDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"CreateTag"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"createTagInput"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"CreateTagInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"createTag"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"createTagInput"},"value":{"kind":"Variable","name":{"kind":"Name","value":"createTagInput"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"TagFields"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"TagFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Tag"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"slug"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"isFeatured"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}}]}}]} as unknown as DocumentNode<CreateTagMutation, CreateTagMutationVariables>;
export const UpdateTagDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"UpdateTag"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"updateTagInput"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"UpdateTagInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"updateTag"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"updateTagInput"},"value":{"kind":"Variable","name":{"kind":"Name","value":"updateTagInput"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"TagFields"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"TagFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Tag"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"slug"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"isFeatured"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}}]}}]} as unknown as DocumentNode<UpdateTagMutation, UpdateTagMutationVariables>;
export const SetTagStatusDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"SetTagStatus"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"setTagStatusInput"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"SetTagStatusInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"setTagStatus"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"setTagStatusInput"},"value":{"kind":"Variable","name":{"kind":"Name","value":"setTagStatusInput"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"TagFields"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"TagFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Tag"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"slug"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"isFeatured"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}}]}}]} as unknown as DocumentNode<SetTagStatusMutation, SetTagStatusMutationVariables>;
export const RemoveTagDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"RemoveTag"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"removeTag"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"TagFields"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"TagFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Tag"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"slug"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"isFeatured"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}}]}}]} as unknown as DocumentNode<RemoveTagMutation, RemoveTagMutationVariables>;
export const GetTaxesDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetTaxes"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"taxes"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"TaxFields"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"TaxFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Tax"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"rate"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"isActive"}},{"kind":"Field","name":{"kind":"Name","value":"displayOrder"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}}]}}]} as unknown as DocumentNode<GetTaxesQuery, GetTaxesQueryVariables>;
export const GetAdminTaxesDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetAdminTaxes"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"adminTaxes"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"TaxFields"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"TaxFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Tax"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"rate"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"isActive"}},{"kind":"Field","name":{"kind":"Name","value":"displayOrder"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}}]}}]} as unknown as DocumentNode<GetAdminTaxesQuery, GetAdminTaxesQueryVariables>;
export const GetAdminTaxesPaginatedDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetAdminTaxesPaginated"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"page"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"pageSize"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"search"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"adminTaxesPaginated"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"page"},"value":{"kind":"Variable","name":{"kind":"Name","value":"page"}}},{"kind":"Argument","name":{"kind":"Name","value":"pageSize"},"value":{"kind":"Variable","name":{"kind":"Name","value":"pageSize"}}},{"kind":"Argument","name":{"kind":"Name","value":"search"},"value":{"kind":"Variable","name":{"kind":"Name","value":"search"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"items"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"TaxFields"}}]}},{"kind":"Field","name":{"kind":"Name","value":"totalCount"}},{"kind":"Field","name":{"kind":"Name","value":"totalPages"}},{"kind":"Field","name":{"kind":"Name","value":"currentPage"}},{"kind":"Field","name":{"kind":"Name","value":"pageSize"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"TaxFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Tax"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"rate"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"isActive"}},{"kind":"Field","name":{"kind":"Name","value":"displayOrder"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}}]}}]} as unknown as DocumentNode<GetAdminTaxesPaginatedQuery, GetAdminTaxesPaginatedQueryVariables>;
export const GetTaxDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetTax"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"tax"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"TaxFields"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"TaxFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Tax"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"rate"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"isActive"}},{"kind":"Field","name":{"kind":"Name","value":"displayOrder"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}}]}}]} as unknown as DocumentNode<GetTaxQuery, GetTaxQueryVariables>;
export const CreateTaxDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"CreateTax"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"createTaxInput"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"CreateTaxInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"createTax"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"createTaxInput"},"value":{"kind":"Variable","name":{"kind":"Name","value":"createTaxInput"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"TaxFields"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"TaxFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Tax"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"rate"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"isActive"}},{"kind":"Field","name":{"kind":"Name","value":"displayOrder"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}}]}}]} as unknown as DocumentNode<CreateTaxMutation, CreateTaxMutationVariables>;
export const UpdateTaxDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"UpdateTax"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"updateTaxInput"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"UpdateTaxInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"updateTax"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"updateTaxInput"},"value":{"kind":"Variable","name":{"kind":"Name","value":"updateTaxInput"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"TaxFields"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"TaxFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Tax"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"rate"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"isActive"}},{"kind":"Field","name":{"kind":"Name","value":"displayOrder"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}}]}}]} as unknown as DocumentNode<UpdateTaxMutation, UpdateTaxMutationVariables>;
export const RemoveTaxDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"RemoveTax"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"removeTax"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"TaxFields"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"TaxFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Tax"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"rate"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"isActive"}},{"kind":"Field","name":{"kind":"Name","value":"displayOrder"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}}]}}]} as unknown as DocumentNode<RemoveTaxMutation, RemoveTaxMutationVariables>;
export const GetMyWishlistDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetMyWishlist"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"myWishlist"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"WishlistFields"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"ProductImageFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"ProductImage"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"productId"}},{"kind":"Field","name":{"kind":"Name","value":"imageUrl"}},{"kind":"Field","name":{"kind":"Name","value":"altText"}},{"kind":"Field","name":{"kind":"Name","value":"displayOrder"}},{"kind":"Field","name":{"kind":"Name","value":"isPrimary"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"ProductFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Product"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"storeId"}},{"kind":"Field","name":{"kind":"Name","value":"categoryId"}},{"kind":"Field","name":{"kind":"Name","value":"brandId"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"slug"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"shortDescription"}},{"kind":"Field","name":{"kind":"Name","value":"productType"}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"isFeatured"}},{"kind":"Field","name":{"kind":"Name","value":"isDigital"}},{"kind":"Field","name":{"kind":"Name","value":"price"}},{"kind":"Field","name":{"kind":"Name","value":"compareAtPrice"}},{"kind":"Field","name":{"kind":"Name","value":"costPrice"}},{"kind":"Field","name":{"kind":"Name","value":"priceWithTax"}},{"kind":"Field","name":{"kind":"Name","value":"sku"}},{"kind":"Field","name":{"kind":"Name","value":"weight"}},{"kind":"Field","name":{"kind":"Name","value":"length"}},{"kind":"Field","name":{"kind":"Name","value":"width"}},{"kind":"Field","name":{"kind":"Name","value":"height"}},{"kind":"Field","name":{"kind":"Name","value":"hsnCode"}},{"kind":"Field","name":{"kind":"Name","value":"seoTitle"}},{"kind":"Field","name":{"kind":"Name","value":"seoDescription"}},{"kind":"Field","name":{"kind":"Name","value":"seoKeywords"}},{"kind":"Field","name":{"kind":"Name","value":"specifications"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}},{"kind":"Field","name":{"kind":"Name","value":"images"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"ProductImageFields"}}]}},{"kind":"Field","name":{"kind":"Name","value":"brand"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"slug"}},{"kind":"Field","name":{"kind":"Name","value":"logoUrl"}}]}},{"kind":"Field","name":{"kind":"Name","value":"category"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"slug"}}]}},{"kind":"Field","name":{"kind":"Name","value":"taxId"}},{"kind":"Field","name":{"kind":"Name","value":"tax"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"rate"}}]}},{"kind":"Field","name":{"kind":"Name","value":"tags"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"slug"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"WishlistFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Wishlist"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"customerId"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"isDefault"}},{"kind":"Field","name":{"kind":"Name","value":"isPublic"}},{"kind":"Field","name":{"kind":"Name","value":"itemCount"}},{"kind":"Field","name":{"kind":"Name","value":"items"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"productId"}},{"kind":"Field","name":{"kind":"Name","value":"variantId"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"product"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"ProductFields"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}}]}}]} as unknown as DocumentNode<GetMyWishlistQuery, GetMyWishlistQueryVariables>;
export const GetMyWishlistProductIdsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetMyWishlistProductIds"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"myWishlistProductIds"}}]}}]} as unknown as DocumentNode<GetMyWishlistProductIdsQuery, GetMyWishlistProductIdsQueryVariables>;
export const AddToWishlistDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"AddToWishlist"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ToggleWishlistInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"addToWishlist"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"WishlistFields"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"ProductImageFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"ProductImage"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"productId"}},{"kind":"Field","name":{"kind":"Name","value":"imageUrl"}},{"kind":"Field","name":{"kind":"Name","value":"altText"}},{"kind":"Field","name":{"kind":"Name","value":"displayOrder"}},{"kind":"Field","name":{"kind":"Name","value":"isPrimary"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"ProductFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Product"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"storeId"}},{"kind":"Field","name":{"kind":"Name","value":"categoryId"}},{"kind":"Field","name":{"kind":"Name","value":"brandId"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"slug"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"shortDescription"}},{"kind":"Field","name":{"kind":"Name","value":"productType"}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"isFeatured"}},{"kind":"Field","name":{"kind":"Name","value":"isDigital"}},{"kind":"Field","name":{"kind":"Name","value":"price"}},{"kind":"Field","name":{"kind":"Name","value":"compareAtPrice"}},{"kind":"Field","name":{"kind":"Name","value":"costPrice"}},{"kind":"Field","name":{"kind":"Name","value":"priceWithTax"}},{"kind":"Field","name":{"kind":"Name","value":"sku"}},{"kind":"Field","name":{"kind":"Name","value":"weight"}},{"kind":"Field","name":{"kind":"Name","value":"length"}},{"kind":"Field","name":{"kind":"Name","value":"width"}},{"kind":"Field","name":{"kind":"Name","value":"height"}},{"kind":"Field","name":{"kind":"Name","value":"hsnCode"}},{"kind":"Field","name":{"kind":"Name","value":"seoTitle"}},{"kind":"Field","name":{"kind":"Name","value":"seoDescription"}},{"kind":"Field","name":{"kind":"Name","value":"seoKeywords"}},{"kind":"Field","name":{"kind":"Name","value":"specifications"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}},{"kind":"Field","name":{"kind":"Name","value":"images"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"ProductImageFields"}}]}},{"kind":"Field","name":{"kind":"Name","value":"brand"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"slug"}},{"kind":"Field","name":{"kind":"Name","value":"logoUrl"}}]}},{"kind":"Field","name":{"kind":"Name","value":"category"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"slug"}}]}},{"kind":"Field","name":{"kind":"Name","value":"taxId"}},{"kind":"Field","name":{"kind":"Name","value":"tax"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"rate"}}]}},{"kind":"Field","name":{"kind":"Name","value":"tags"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"slug"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"WishlistFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Wishlist"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"customerId"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"isDefault"}},{"kind":"Field","name":{"kind":"Name","value":"isPublic"}},{"kind":"Field","name":{"kind":"Name","value":"itemCount"}},{"kind":"Field","name":{"kind":"Name","value":"items"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"productId"}},{"kind":"Field","name":{"kind":"Name","value":"variantId"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"product"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"ProductFields"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}}]}}]} as unknown as DocumentNode<AddToWishlistMutation, AddToWishlistMutationVariables>;
export const RemoveFromWishlistDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"RemoveFromWishlist"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ToggleWishlistInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"removeFromWishlist"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"WishlistFields"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"ProductImageFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"ProductImage"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"productId"}},{"kind":"Field","name":{"kind":"Name","value":"imageUrl"}},{"kind":"Field","name":{"kind":"Name","value":"altText"}},{"kind":"Field","name":{"kind":"Name","value":"displayOrder"}},{"kind":"Field","name":{"kind":"Name","value":"isPrimary"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"ProductFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Product"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"storeId"}},{"kind":"Field","name":{"kind":"Name","value":"categoryId"}},{"kind":"Field","name":{"kind":"Name","value":"brandId"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"slug"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"shortDescription"}},{"kind":"Field","name":{"kind":"Name","value":"productType"}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"isFeatured"}},{"kind":"Field","name":{"kind":"Name","value":"isDigital"}},{"kind":"Field","name":{"kind":"Name","value":"price"}},{"kind":"Field","name":{"kind":"Name","value":"compareAtPrice"}},{"kind":"Field","name":{"kind":"Name","value":"costPrice"}},{"kind":"Field","name":{"kind":"Name","value":"priceWithTax"}},{"kind":"Field","name":{"kind":"Name","value":"sku"}},{"kind":"Field","name":{"kind":"Name","value":"weight"}},{"kind":"Field","name":{"kind":"Name","value":"length"}},{"kind":"Field","name":{"kind":"Name","value":"width"}},{"kind":"Field","name":{"kind":"Name","value":"height"}},{"kind":"Field","name":{"kind":"Name","value":"hsnCode"}},{"kind":"Field","name":{"kind":"Name","value":"seoTitle"}},{"kind":"Field","name":{"kind":"Name","value":"seoDescription"}},{"kind":"Field","name":{"kind":"Name","value":"seoKeywords"}},{"kind":"Field","name":{"kind":"Name","value":"specifications"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}},{"kind":"Field","name":{"kind":"Name","value":"images"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"ProductImageFields"}}]}},{"kind":"Field","name":{"kind":"Name","value":"brand"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"slug"}},{"kind":"Field","name":{"kind":"Name","value":"logoUrl"}}]}},{"kind":"Field","name":{"kind":"Name","value":"category"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"slug"}}]}},{"kind":"Field","name":{"kind":"Name","value":"taxId"}},{"kind":"Field","name":{"kind":"Name","value":"tax"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"rate"}}]}},{"kind":"Field","name":{"kind":"Name","value":"tags"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"slug"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"WishlistFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Wishlist"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"customerId"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"isDefault"}},{"kind":"Field","name":{"kind":"Name","value":"isPublic"}},{"kind":"Field","name":{"kind":"Name","value":"itemCount"}},{"kind":"Field","name":{"kind":"Name","value":"items"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"productId"}},{"kind":"Field","name":{"kind":"Name","value":"variantId"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"product"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"ProductFields"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}}]}}]} as unknown as DocumentNode<RemoveFromWishlistMutation, RemoveFromWishlistMutationVariables>;
export const ClearWishlistDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"ClearWishlist"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"clearWishlist"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"WishlistFields"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"ProductImageFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"ProductImage"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"productId"}},{"kind":"Field","name":{"kind":"Name","value":"imageUrl"}},{"kind":"Field","name":{"kind":"Name","value":"altText"}},{"kind":"Field","name":{"kind":"Name","value":"displayOrder"}},{"kind":"Field","name":{"kind":"Name","value":"isPrimary"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"ProductFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Product"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"storeId"}},{"kind":"Field","name":{"kind":"Name","value":"categoryId"}},{"kind":"Field","name":{"kind":"Name","value":"brandId"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"slug"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"shortDescription"}},{"kind":"Field","name":{"kind":"Name","value":"productType"}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"isFeatured"}},{"kind":"Field","name":{"kind":"Name","value":"isDigital"}},{"kind":"Field","name":{"kind":"Name","value":"price"}},{"kind":"Field","name":{"kind":"Name","value":"compareAtPrice"}},{"kind":"Field","name":{"kind":"Name","value":"costPrice"}},{"kind":"Field","name":{"kind":"Name","value":"priceWithTax"}},{"kind":"Field","name":{"kind":"Name","value":"sku"}},{"kind":"Field","name":{"kind":"Name","value":"weight"}},{"kind":"Field","name":{"kind":"Name","value":"length"}},{"kind":"Field","name":{"kind":"Name","value":"width"}},{"kind":"Field","name":{"kind":"Name","value":"height"}},{"kind":"Field","name":{"kind":"Name","value":"hsnCode"}},{"kind":"Field","name":{"kind":"Name","value":"seoTitle"}},{"kind":"Field","name":{"kind":"Name","value":"seoDescription"}},{"kind":"Field","name":{"kind":"Name","value":"seoKeywords"}},{"kind":"Field","name":{"kind":"Name","value":"specifications"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}},{"kind":"Field","name":{"kind":"Name","value":"images"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"ProductImageFields"}}]}},{"kind":"Field","name":{"kind":"Name","value":"brand"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"slug"}},{"kind":"Field","name":{"kind":"Name","value":"logoUrl"}}]}},{"kind":"Field","name":{"kind":"Name","value":"category"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"slug"}}]}},{"kind":"Field","name":{"kind":"Name","value":"taxId"}},{"kind":"Field","name":{"kind":"Name","value":"tax"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"rate"}}]}},{"kind":"Field","name":{"kind":"Name","value":"tags"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"slug"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"WishlistFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Wishlist"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"customerId"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"isDefault"}},{"kind":"Field","name":{"kind":"Name","value":"isPublic"}},{"kind":"Field","name":{"kind":"Name","value":"itemCount"}},{"kind":"Field","name":{"kind":"Name","value":"items"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"productId"}},{"kind":"Field","name":{"kind":"Name","value":"variantId"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"product"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"ProductFields"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}}]}}]} as unknown as DocumentNode<ClearWishlistMutation, ClearWishlistMutationVariables>;
export const GetAdminThemeSsrDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetAdminThemeSSR"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"adminTheme"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"primaryLight"}},{"kind":"Field","name":{"kind":"Name","value":"primaryDark"}},{"kind":"Field","name":{"kind":"Name","value":"accentLight"}},{"kind":"Field","name":{"kind":"Name","value":"accentDark"}},{"kind":"Field","name":{"kind":"Name","value":"sidebarLight"}},{"kind":"Field","name":{"kind":"Name","value":"sidebarDark"}},{"kind":"Field","name":{"kind":"Name","value":"destructiveLight"}},{"kind":"Field","name":{"kind":"Name","value":"destructiveDark"}},{"kind":"Field","name":{"kind":"Name","value":"radius"}},{"kind":"Field","name":{"kind":"Name","value":"fontFamily"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedById"}}]}}]}}]} as unknown as DocumentNode<GetAdminThemeSsrQuery, GetAdminThemeSsrQueryVariables>;