/**
 * Product Attribute types — mirror backend GraphQL ProductAttribute /
 * ProductAttributeValue.
 *
 * Attributes are the formal taxonomy used for variant differentiation
 * (Phase B) and faceted filters (Sprint 5). Distinct from specifications
 * (which are per-product JSON for PDP display only).
 */

export const ATTRIBUTE_TYPES = [
  "SELECT",
  "MULTISELECT",
  "BOOLEAN",
  "TEXT",   // schema-supported, hidden in v1 UI
  "NUMBER", // schema-supported, hidden in v1 UI
] as const;
export type AttributeType = (typeof ATTRIBUTE_TYPES)[number];

/** Types exposed in the v1 admin UI. TEXT/NUMBER are schema-only. */
export const ATTRIBUTE_TYPE_OPTIONS = ["SELECT", "MULTISELECT", "BOOLEAN"] as const;

export const ATTRIBUTE_TYPE_LABEL: Record<AttributeType, string> = {
  SELECT: "Single select",
  MULTISELECT: "Multi-select",
  BOOLEAN: "Yes / No",
  TEXT: "Free text",
  NUMBER: "Number",
};

export interface ProductAttributeValue {
  id: string;
  attributeId: string;
  value: string;
  slug: string;
  displayOrder: number;
  createdAt: string;
  updatedAt: string;
  deletedAt?: string | null;
}

export interface ProductAttribute {
  id: string;
  name: string;
  slug: string;
  description?: string | null;
  type: AttributeType;
  isVariantAttribute: boolean;
  values?: ProductAttributeValue[];
  createdAt: string;
  updatedAt: string;
  deletedAt?: string | null;
}

// ---------------------------------------------------------------------------
// GraphQL response shapes
// ---------------------------------------------------------------------------
export interface GetAdminAttributesData {
  adminAttributes: ProductAttribute[];
}

export interface GetAttributesData {
  attributes: ProductAttribute[];
}

export interface GetAttributeData {
  attribute: ProductAttribute;
}

export interface CreateAttributeData {
  createAttribute: ProductAttribute;
}

export interface UpdateAttributeData {
  updateAttribute: ProductAttribute;
}

export interface RemoveAttributeData {
  removeAttribute: ProductAttribute;
}

export interface CreateAttributeValueData {
  createAttributeValue: ProductAttributeValue;
}

export interface UpdateAttributeValueData {
  updateAttributeValue: ProductAttributeValue;
}

export interface RemoveAttributeValueData {
  removeAttributeValue: ProductAttributeValue;
}

export interface ReorderAttributeValuesData {
  reorderAttributeValues: boolean;
}
