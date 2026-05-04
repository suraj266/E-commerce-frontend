/**
 * Attribute GraphQL operations.
 *
 * - `attributes` (public — Phase B variant builder + Sprint 5 filters)
 * - `adminAttributes` (admin — full registry management)
 * - Mutations cover both attribute itself AND its values (nested in registry)
 */

import { gql } from "@apollo/client";

export const ATTRIBUTE_VALUE_FIELDS = gql`
  fragment AttributeValueFields on ProductAttributeValue {
    id
    attributeId
    value
    slug
    displayOrder
    createdAt
    updatedAt
  }
`;

export const ATTRIBUTE_FIELDS = gql`
  ${ATTRIBUTE_VALUE_FIELDS}
  fragment AttributeFields on ProductAttribute {
    id
    name
    slug
    description
    type
    isVariantAttribute
    createdAt
    updatedAt
    values {
      ...AttributeValueFields
    }
  }
`;

// ---------------------------------------------------------------------------
// Queries
// ---------------------------------------------------------------------------
export const GET_ADMIN_ATTRIBUTES = gql`
  ${ATTRIBUTE_FIELDS}
  query GetAdminAttributes($type: AttributeType) {
    adminAttributes(type: $type) {
      ...AttributeFields
    }
  }
`;

export const GET_ATTRIBUTES = gql`
  ${ATTRIBUTE_FIELDS}
  query GetAttributes($type: AttributeType, $variantOnly: Boolean) {
    attributes(type: $type, variantOnly: $variantOnly) {
      ...AttributeFields
    }
  }
`;

export const GET_ATTRIBUTE = gql`
  ${ATTRIBUTE_FIELDS}
  query GetAttribute($id: ID!) {
    attribute(id: $id) {
      ...AttributeFields
    }
  }
`;

// ---------------------------------------------------------------------------
// Attribute mutations
// ---------------------------------------------------------------------------
export const CREATE_ATTRIBUTE = gql`
  ${ATTRIBUTE_FIELDS}
  mutation CreateAttribute($createAttributeInput: CreateAttributeInput!) {
    createAttribute(createAttributeInput: $createAttributeInput) {
      ...AttributeFields
    }
  }
`;

export const UPDATE_ATTRIBUTE = gql`
  ${ATTRIBUTE_FIELDS}
  mutation UpdateAttribute($updateAttributeInput: UpdateAttributeInput!) {
    updateAttribute(updateAttributeInput: $updateAttributeInput) {
      ...AttributeFields
    }
  }
`;

export const REMOVE_ATTRIBUTE = gql`
  ${ATTRIBUTE_FIELDS}
  mutation RemoveAttribute($id: ID!) {
    removeAttribute(id: $id) {
      ...AttributeFields
    }
  }
`;

// ---------------------------------------------------------------------------
// Value mutations
// ---------------------------------------------------------------------------
export const CREATE_ATTRIBUTE_VALUE = gql`
  ${ATTRIBUTE_VALUE_FIELDS}
  mutation CreateAttributeValue(
    $createAttributeValueInput: CreateAttributeValueInput!
  ) {
    createAttributeValue(createAttributeValueInput: $createAttributeValueInput) {
      ...AttributeValueFields
    }
  }
`;

export const UPDATE_ATTRIBUTE_VALUE = gql`
  ${ATTRIBUTE_VALUE_FIELDS}
  mutation UpdateAttributeValue(
    $updateAttributeValueInput: UpdateAttributeValueInput!
  ) {
    updateAttributeValue(updateAttributeValueInput: $updateAttributeValueInput) {
      ...AttributeValueFields
    }
  }
`;

export const REMOVE_ATTRIBUTE_VALUE = gql`
  ${ATTRIBUTE_VALUE_FIELDS}
  mutation RemoveAttributeValue($id: ID!) {
    removeAttributeValue(id: $id) {
      ...AttributeValueFields
    }
  }
`;

export const REORDER_ATTRIBUTE_VALUES = gql`
  mutation ReorderAttributeValues(
    $reorderAttributeValuesInput: ReorderAttributeValuesInput!
  ) {
    reorderAttributeValues(
      reorderAttributeValuesInput: $reorderAttributeValuesInput
    )
  }
`;
