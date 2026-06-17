/**
 * GraphQL ops for the admin-editable tax-invoice template.
 *
 * Mirrors lib/graphql/email.ts. The template is a single DB row
 * (key="tax_invoice"); the PDF generator renders from it. The editor uses
 * `previewInvoiceTemplate` for an accurate server-rendered live preview.
 */

import { gql } from "@apollo/client";

export const GET_INVOICE_TEMPLATE = gql`
  query GetInvoiceTemplate {
    invoiceTemplate {
      id
      key
      name
      description
      htmlBody
      css
      variables
      isEnabled
      isSystem
      updatedAt
    }
  }
`;

export const UPDATE_INVOICE_TEMPLATE = gql`
  mutation UpdateInvoiceTemplate($input: UpdateInvoiceTemplateInput!) {
    updateInvoiceTemplate(input: $input) {
      id
      key
      name
      description
      htmlBody
      css
      variables
      isEnabled
      isSystem
      updatedAt
    }
  }
`;

export const PREVIEW_INVOICE_TEMPLATE = gql`
  query PreviewInvoiceTemplate($input: PreviewInvoiceTemplateInput!) {
    previewInvoiceTemplate(input: $input)
  }
`;
