import { gql } from "@apollo/client";
import { PRODUCT_FIELDS } from "./products";

export const CART_FIELDS = gql`
  ${PRODUCT_FIELDS}
  fragment CartFields on Cart {
    id
    customerId
    itemCount
    subtotal
    needsReview
    items {
      id
      productId
      variantId
      quantity
      unitPriceSnapshot
      unitPriceCurrent
      priceChanged
      lineTotal
      taxAmount
      availableQuantity
      stockState
      createdAt
      product {
        ...ProductFields
      }
      variant {
        id
        sku
        name
        price
        priceWithTax
        taxAmount
        imageUrl
        attributes {
          attributeId
          attributeValueId
          attributeName
          attributeSlug
          value
          valueSlug
        }
      }
    }
    createdAt
    updatedAt
  }
`;

export const GET_MY_CART = gql`
  ${CART_FIELDS}
  query GetMyCart {
    myCart {
      ...CartFields
    }
  }
`;

export const GET_MY_CART_ITEM_COUNT = gql`
  query GetMyCartItemCount {
    myCartItemCount
  }
`;

export const ADD_TO_CART = gql`
  ${CART_FIELDS}
  mutation AddToCart($input: AddToCartInput!) {
    addToCart(input: $input) {
      ...CartFields
    }
  }
`;

export const UPDATE_CART_ITEM_QTY = gql`
  ${CART_FIELDS}
  mutation UpdateCartItemQty($input: UpdateCartItemQtyInput!) {
    updateCartItemQty(input: $input) {
      ...CartFields
    }
  }
`;

export const REMOVE_FROM_CART = gql`
  ${CART_FIELDS}
  mutation RemoveFromCart($input: RemoveCartItemInput!) {
    removeFromCart(input: $input) {
      ...CartFields
    }
  }
`;

export const CLEAR_CART = gql`
  ${CART_FIELDS}
  mutation ClearCart {
    clearCart {
      ...CartFields
    }
  }
`;

/* -------------------------------------------------------------------------- */
/* Guest cart (unauthenticated). The httpOnly guestCartToken cookie is minted  */
/* by the server on first write and travels automatically because the Apollo   */
/* client sends credentials. On login the server merges + clears it.           */
/* -------------------------------------------------------------------------- */

export const GET_GUEST_CART = gql`
  ${CART_FIELDS}
  query GetGuestCart {
    guestCart {
      ...CartFields
    }
  }
`;

export const ADD_TO_GUEST_CART = gql`
  ${CART_FIELDS}
  mutation AddToGuestCart($input: AddToCartInput!) {
    addToGuestCart(input: $input) {
      ...CartFields
    }
  }
`;

export const UPDATE_GUEST_CART_ITEM_QTY = gql`
  ${CART_FIELDS}
  mutation UpdateGuestCartItemQty($input: UpdateCartItemQtyInput!) {
    updateGuestCartItemQty(input: $input) {
      ...CartFields
    }
  }
`;

export const REMOVE_FROM_GUEST_CART = gql`
  ${CART_FIELDS}
  mutation RemoveFromGuestCart($input: RemoveCartItemInput!) {
    removeFromGuestCart(input: $input) {
      ...CartFields
    }
  }
`;

export const MERGE_GUEST_CART = gql`
  ${CART_FIELDS}
  mutation MergeGuestCart {
    mergeGuestCart {
      ...CartFields
    }
  }
`;

/**
 * Advisory stock/price re-validation. Non-mutating; serves both the signed-in
 * customer cart and the guest cart. Never a hard stop — the UI renders these
 * as inline, adjustable warnings.
 */
export const VALIDATE_CART = gql`
  query ValidateCart {
    validateCart {
      valid
      warnings {
        variantId
        code
        message
        availableQuantity
        suggestedQuantity
        oldPrice
        newPrice
      }
    }
  }
`;
