import { gql } from "@apollo/client";
import { PRODUCT_FIELDS } from "./products";

export const WISHLIST_FIELDS = gql`
  ${PRODUCT_FIELDS}
  fragment WishlistFields on Wishlist {
    id
    customerId
    name
    isDefault
    isPublic
    itemCount
    items {
      id
      productId
      variantId
      createdAt
      product {
        ...ProductFields
      }
    }
    createdAt
    updatedAt
  }
`;

export const GET_MY_WISHLIST = gql`
  ${WISHLIST_FIELDS}
  query GetMyWishlist {
    myWishlist {
      ...WishlistFields
    }
  }
`;

export const GET_MY_WISHLIST_PRODUCT_IDS = gql`
  query GetMyWishlistProductIds {
    myWishlistProductIds
  }
`;

export const ADD_TO_WISHLIST = gql`
  ${WISHLIST_FIELDS}
  mutation AddToWishlist($input: ToggleWishlistInput!) {
    addToWishlist(input: $input) {
      ...WishlistFields
    }
  }
`;

export const REMOVE_FROM_WISHLIST = gql`
  ${WISHLIST_FIELDS}
  mutation RemoveFromWishlist($input: ToggleWishlistInput!) {
    removeFromWishlist(input: $input) {
      ...WishlistFields
    }
  }
`;

export const CLEAR_WISHLIST = gql`
  ${WISHLIST_FIELDS}
  mutation ClearWishlist {
    clearWishlist {
      ...WishlistFields
    }
  }
`;
