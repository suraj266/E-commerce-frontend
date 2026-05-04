/**
 * Tag GraphQL operations.
 *
 * - `tags` (public, default ACTIVE) — used by Product create form picker
 * - `adminTags` (admin) — full list incl. INACTIVE for management
 * - `publicTag(slug)` — for /tag/[slug] page (Sprint 5 will add products feed)
 */

import { gql } from "@apollo/client";

export const TAG_FIELDS = gql`
  fragment TagFields on Tag {
    id
    name
    slug
    description
    status
    isFeatured
    createdAt
    updatedAt
  }
`;

// ---------------------------------------------------------------------------
// Queries
// ---------------------------------------------------------------------------
export const GET_ADMIN_TAGS = gql`
  ${TAG_FIELDS}
  query GetAdminTags($status: TagStatus) {
    adminTags(status: $status) {
      ...TagFields
    }
  }
`;

export const GET_TAGS = gql`
  ${TAG_FIELDS}
  query GetTags($status: TagStatus, $featuredOnly: Boolean) {
    tags(status: $status, featuredOnly: $featuredOnly) {
      ...TagFields
    }
  }
`;

export const GET_TAG = gql`
  ${TAG_FIELDS}
  query GetTag($id: ID!) {
    tag(id: $id) {
      ...TagFields
    }
  }
`;

export const GET_PUBLIC_TAG = gql`
  ${TAG_FIELDS}
  query GetPublicTag($slug: String!) {
    publicTag(slug: $slug) {
      ...TagFields
    }
  }
`;

// ---------------------------------------------------------------------------
// Mutations
// ---------------------------------------------------------------------------
export const CREATE_TAG = gql`
  ${TAG_FIELDS}
  mutation CreateTag($createTagInput: CreateTagInput!) {
    createTag(createTagInput: $createTagInput) {
      ...TagFields
    }
  }
`;

export const UPDATE_TAG = gql`
  ${TAG_FIELDS}
  mutation UpdateTag($updateTagInput: UpdateTagInput!) {
    updateTag(updateTagInput: $updateTagInput) {
      ...TagFields
    }
  }
`;

export const SET_TAG_STATUS = gql`
  ${TAG_FIELDS}
  mutation SetTagStatus($setTagStatusInput: SetTagStatusInput!) {
    setTagStatus(setTagStatusInput: $setTagStatusInput) {
      ...TagFields
    }
  }
`;

export const REMOVE_TAG = gql`
  ${TAG_FIELDS}
  mutation RemoveTag($id: ID!) {
    removeTag(id: $id) {
      ...TagFields
    }
  }
`;
