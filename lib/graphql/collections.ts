/**
 * GraphQL ops for product collections (manual + smart).
 *
 * Public: `collections` (nav/home), `publicCollection` (page header).
 * Admin: `adminCollections` / `collection` + create/update/remove.
 * Membership is resolved through the product query via `collectionSlug`.
 */

import { gql } from "@apollo/client";

const COLLECTION_FIELDS = gql`
  fragment CollectionFields on Collection {
    id
    name
    slug
    description
    bannerUrl
    imageUrl
    type
    rule
    status
    isFeatured
    displayOrder
    productIds
    createdAt
    updatedAt
  }
`;

export const GET_PUBLIC_COLLECTIONS = gql`
  ${COLLECTION_FIELDS}
  query GetPublicCollections($featuredOnly: Boolean) {
    collections(featuredOnly: $featuredOnly) {
      ...CollectionFields
    }
  }
`;

export const GET_PUBLIC_COLLECTION = gql`
  ${COLLECTION_FIELDS}
  query GetPublicCollection($slug: String!) {
    publicCollection(slug: $slug) {
      ...CollectionFields
    }
  }
`;

export const GET_ADMIN_COLLECTIONS = gql`
  ${COLLECTION_FIELDS}
  query GetAdminCollections($status: CollectionStatus) {
    adminCollections(status: $status) {
      ...CollectionFields
    }
  }
`;

export const GET_COLLECTION = gql`
  ${COLLECTION_FIELDS}
  query GetCollection($id: ID!) {
    collection(id: $id) {
      ...CollectionFields
    }
  }
`;

export const CREATE_COLLECTION = gql`
  ${COLLECTION_FIELDS}
  mutation CreateCollection($createCollectionInput: CreateCollectionInput!) {
    createCollection(createCollectionInput: $createCollectionInput) {
      ...CollectionFields
    }
  }
`;

export const UPDATE_COLLECTION = gql`
  ${COLLECTION_FIELDS}
  mutation UpdateCollection($updateCollectionInput: UpdateCollectionInput!) {
    updateCollection(updateCollectionInput: $updateCollectionInput) {
      ...CollectionFields
    }
  }
`;

export const REMOVE_COLLECTION = gql`
  mutation RemoveCollection($id: ID!) {
    removeCollection(id: $id) {
      id
    }
  }
`;
