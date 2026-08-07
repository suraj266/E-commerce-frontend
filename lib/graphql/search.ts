/**
 * Storefront search + delivery-estimate GraphQL operations (P4-B).
 *
 * `SEARCH_PRODUCTS` backs /search with Postgres full-text ranking
 * (websearch_to_tsquery over the product's weighted search vector + brand
 * name). It returns the same `PaginatedProducts` shape as the catalog list, so
 * the existing `ShopProductCard` / `ShopPagination` render it unchanged — the
 * only difference from `paginatedPublicProducts` is relevance ordering and the
 * text-first match. It reuses the shared `ProductSummaryFields` fragment from
 * `products.ts` rather than redefining it.
 *
 * `DELIVERY_ESTIMATE` powers the PDP pincode → ETA estimator. It reuses the
 * live courier serviceability read-only and degrades to the in-house shipping
 * config, returning an ETA window in days plus COD availability.
 */

import { gql } from "@apollo/client";
import { PRODUCT_SUMMARY_FIELDS } from "./products";
import type { PaginatedProducts } from "@/types/product.types";

export const SEARCH_PRODUCTS = gql`
  ${PRODUCT_SUMMARY_FIELDS}
  query SearchProducts(
    $query: String!
    $categorySlug: String
    $brandSlug: String
    $minPrice: Float
    $maxPrice: Float
    $sort: ProductSortOrder
    $page: Int
    $pageSize: Int
  ) {
    searchProducts(
      query: $query
      categorySlug: $categorySlug
      brandSlug: $brandSlug
      minPrice: $minPrice
      maxPrice: $maxPrice
      sort: $sort
      page: $page
      pageSize: $pageSize
    ) {
      items {
        ...ProductSummaryFields
        variants {
          id
          name
          price
          priceWithTax
          taxAmount
          compareAtPrice
          imageUrl
          availableQuantity
          stockState
          attributes {
            attributeName
            value
          }
        }
      }
      totalCount
      totalPages
      currentPage
      pageSize
    }
  }
`;

export interface GetSearchProductsData {
  searchProducts: PaginatedProducts;
}

/**
 * Indicative delivery estimate for a product/variant → pincode. Purely a PDP
 * hint — the binding charge/ETA is re-derived at checkout placement.
 */
export interface DeliveryEstimate {
  pincode: string;
  serviceable: boolean;
  estimatedDispatchDays?: number | null;
  minDeliveryDays?: number | null;
  maxDeliveryDays?: number | null;
  /** 'LIVE' | 'IN_HOUSE' | 'NONE' */
  rateSource: string;
  courierName?: string | null;
  shippingCharge?: number | null;
  freeShipping: boolean;
  codAvailable: boolean;
  message?: string | null;
}

export interface GetDeliveryEstimateData {
  deliveryEstimate: DeliveryEstimate;
}

export const DELIVERY_ESTIMATE = gql`
  query DeliveryEstimate($pincode: String!, $productId: ID, $variantId: ID) {
    deliveryEstimate(
      pincode: $pincode
      productId: $productId
      variantId: $variantId
    ) {
      pincode
      serviceable
      estimatedDispatchDays
      minDeliveryDays
      maxDeliveryDays
      rateSource
      courierName
      shippingCharge
      freeShipping
      codAvailable
      message
    }
  }
`;
