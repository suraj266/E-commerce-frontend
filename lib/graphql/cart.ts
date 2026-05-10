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
