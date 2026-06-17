/**
 * GraphQL ops for product labels (badges).
 *
 * `labels` (enabled) feeds the seller product-form picker; the admin pages use
 * the `adminLabels` / `label` queries + create/update/remove mutations.
 */

import { gql } from "@apollo/client";

const LABEL_FIELDS = gql`
  fragment LabelFields on Label {
    id
    key
    name
    color
    textColor
    icon
    type
    rule
    priority
    isEnabled
    isSystem
    displayOrder
    createdAt
    updatedAt
  }
`;

/** Enabled labels — product-form picker. */
export const GET_LABELS = gql`
  ${LABEL_FIELDS}
  query GetLabels {
    labels {
      ...LabelFields
    }
  }
`;

export const GET_ADMIN_LABELS = gql`
  ${LABEL_FIELDS}
  query GetAdminLabels {
    adminLabels {
      ...LabelFields
    }
  }
`;

export const GET_LABEL = gql`
  ${LABEL_FIELDS}
  query GetLabel($id: ID!) {
    label(id: $id) {
      ...LabelFields
    }
  }
`;

export const CREATE_LABEL = gql`
  ${LABEL_FIELDS}
  mutation CreateLabel($createLabelInput: CreateLabelInput!) {
    createLabel(createLabelInput: $createLabelInput) {
      ...LabelFields
    }
  }
`;

export const UPDATE_LABEL = gql`
  ${LABEL_FIELDS}
  mutation UpdateLabel($updateLabelInput: UpdateLabelInput!) {
    updateLabel(updateLabelInput: $updateLabelInput) {
      ...LabelFields
    }
  }
`;

export const REMOVE_LABEL = gql`
  mutation RemoveLabel($id: ID!) {
    removeLabel(id: $id) {
      id
    }
  }
`;
