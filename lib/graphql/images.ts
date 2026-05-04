/**
 * Image GraphQL operations — control plane only.
 * Bytes are uploaded via REST (POST /media/upload for local, PUT to S3
 * presigned URL for S3) — see `lib/api/image.api.ts`.
 */

import { gql } from "@apollo/client";

export const IMAGE_FIELDS = gql`
  fragment ImageFields on Image {
    id
    provider
    externalId
    url
    format
    width
    height
    sizeBytes
    ownerType
    ownerId
    purpose
    alt
    createdAt
  }
`;

export const PRESIGN_IMAGE_UPLOAD = gql`
  mutation PresignImageUpload($presignUploadInput: PresignUploadInput!) {
    presignImageUpload(presignUploadInput: $presignUploadInput) {
      uploadUrl
      method
      fields
      externalId
      expiresIn
      provider
    }
  }
`;

export const CONFIRM_IMAGE_UPLOAD = gql`
  ${IMAGE_FIELDS}
  mutation ConfirmImageUpload($confirmUploadInput: ConfirmUploadInput!) {
    confirmImageUpload(confirmUploadInput: $confirmUploadInput) {
      ...ImageFields
    }
  }
`;

export const DELETE_IMAGE = gql`
  ${IMAGE_FIELDS}
  mutation DeleteImage($id: ID!) {
    deleteImage(id: $id) {
      ...ImageFields
    }
  }
`;
