/**
 * Shipping GraphQL operations.
 *
 * `shippingQuote` previews per-seller delivery charges + COD eligibility +
 * serviceability for the current (server-side) cart, used by the cart "check
 * delivery" widget and the checkout order summary. It reuses the same engine
 * as order placement, so the quote equals what the customer is charged.
 */

import { gql } from "@apollo/client";

export const GET_SHIPPING_QUOTE = gql`
  query ShippingQuote($input: ShippingQuoteInput!) {
    shippingQuote(input: $input) {
      shippingTotal
      serviceable
      codEligible
      grandTotal
      sellers {
        sellerId
        storeId
        storeName
        merchandiseSubtotal
        shippingCharge
        freeApplied
        freeAbove
        serviceable
        codEligible
        estimatedDispatchDays
        rateSource
        courierName
      }
    }
  }
`;
