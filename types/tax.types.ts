/**
 * Tax types — mirror backend GraphQL Tax entity.
 *
 * `rate` is a percentage (0-100) with up to 2 decimals. Wire format is
 * Float (number) — backend's Decimal(5,2) is coerced server-side.
 */

export interface Tax {
  id: string;
  name: string;
  rate: number;
  description?: string | null;
  isActive: boolean;
  displayOrder: number;
  createdAt: string;
  updatedAt: string;
  deletedAt?: string | null;
}

export interface PaginatedTaxes {
  items: Tax[];
  totalCount: number;
  totalPages: number;
  currentPage: number;
  pageSize: number;
}

// ---------------------------------------------------------------------------
// GraphQL response shapes
// ---------------------------------------------------------------------------

export interface GetTaxesData {
  taxes: Tax[];
}

export interface GetAdminTaxesData {
  adminTaxes: Tax[];
}

export interface GetAdminTaxesPaginatedData {
  adminTaxesPaginated: PaginatedTaxes;
}

export interface GetTaxData {
  tax: Tax;
}

export interface CreateTaxData {
  createTax: Tax;
}

export interface UpdateTaxData {
  updateTax: Tax;
}

export interface RemoveTaxData {
  removeTax: Tax;
}

// ---------------------------------------------------------------------------
// Form
// ---------------------------------------------------------------------------

export interface TaxFormValues {
  name: string;
  rate: number;
  description: string;
  isActive: boolean;
  displayOrder: number;
}
