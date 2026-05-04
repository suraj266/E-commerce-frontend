/**
 * Image module types — provider-agnostic.
 *
 * The frontend never knows whether bytes live on local disk, S3, or Cloudinary
 * — backend reports the canonical URL via `image.url`, and `<SmartImage>`
 * appends size/format query params for variants.
 */

export const IMAGE_OWNER_TYPES = [
  "STORE",
  "SELLER",
  "PRODUCT",
  "CATEGORY",
  "USER",
  "GENERIC",
] as const;
export type ImageOwnerType = (typeof IMAGE_OWNER_TYPES)[number];

export const IMAGE_PURPOSES = [
  "LOGO",
  "BANNER",
  "AVATAR",
  "ICON",
  "PRODUCT_PRIMARY",
  "PRODUCT_GALLERY",
  "GENERIC",
] as const;
export type ImagePurpose = (typeof IMAGE_PURPOSES)[number];

export interface Image {
  id: string;
  provider: string;
  externalId: string;
  url: string;
  format: string;
  width: number;
  height: number;
  sizeBytes: number;
  ownerType: ImageOwnerType;
  ownerId?: string | null;
  purpose: ImagePurpose;
  alt?: string | null;
  createdAt: string;
}

export interface PresignUploadPayload {
  uploadUrl: string;
  /** "POST" | "PUT" */
  method: string;
  /** JSON-encoded extra form fields (used by Cloudinary signed POST). */
  fields: string;
  externalId: string;
  expiresIn: number;
  /** "local" | "s3" | "cloudinary" — frontend uses this to decide how to upload. */
  provider: string;
}

export interface PresignImageUploadData {
  presignImageUpload: PresignUploadPayload;
}

export interface ConfirmImageUploadData {
  confirmImageUpload: Image;
}

export interface DeleteImageData {
  deleteImage: Image;
}

/** Standard variant size buckets baked into the SmartImage component. */
export const IMAGE_PRESETS = {
  AVATAR: { sizes: [40, 80, 160], aspect: "1:1" },
  LOGO: { sizes: [80, 200, 400], aspect: "1:1" },
  BANNER: { sizes: [800, 1600, 1920], aspect: "16:9" },
  ICON: { sizes: [80, 200], aspect: "1:1" },
  PRODUCT_PRIMARY: {
    sizes: [200, 400, 800, 1200, 2048],
    aspect: "1:1",
  },
  PRODUCT_GALLERY: { sizes: [400, 800, 1200], aspect: "free" },
  GENERIC: { sizes: [200, 400, 800, 1200], aspect: "free" },
} as const satisfies Record<
  ImagePurpose,
  { sizes: number[]; aspect: string }
>;
