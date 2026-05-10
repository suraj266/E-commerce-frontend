/**
 * Slider GraphQL operations.
 *
 * `publicSlider(key)` is publicly readable for the storefront page-builder
 * blocks that render carousels. Admin queries/mutations are gated by
 * `slider:*` permissions.
 */

import { gql } from "@apollo/client";

export const SLIDE_ITEM_FIELDS = gql`
  fragment SlideItemFields on SlideItem {
    id
    sliderId
    title
    description
    link
    ctaLabel
    imageUrl
    tabletImageUrl
    mobileImageUrl
    order
    isEnabled
    createdAt
    updatedAt
  }
`;

export const SLIDER_FIELDS = gql`
  ${SLIDE_ITEM_FIELDS}
  fragment SliderFields on Slider {
    id
    name
    key
    description
    status
    config
    createdAt
    updatedAt
    items {
      ...SlideItemFields
    }
  }
`;

// ---------------------------------------------------------------------------
// Queries
// ---------------------------------------------------------------------------

export const GET_PUBLIC_SLIDER = gql`
  ${SLIDER_FIELDS}
  query GetPublicSlider($key: String!) {
    publicSlider(key: $key) {
      ...SliderFields
    }
  }
`;

export const GET_ADMIN_SLIDERS = gql`
  ${SLIDER_FIELDS}
  query GetAdminSliders {
    adminSliders {
      ...SliderFields
    }
  }
`;

export const GET_ADMIN_SLIDERS_PAGINATED = gql`
  ${SLIDER_FIELDS}
  query GetAdminSlidersPaginated(
    $status: SliderStatus
    $page: Int
    $pageSize: Int
    $search: String
  ) {
    adminSlidersPaginated(
      status: $status
      page: $page
      pageSize: $pageSize
      search: $search
    ) {
      items {
        ...SliderFields
      }
      totalCount
      totalPages
      currentPage
      pageSize
    }
  }
`;

export const GET_ADMIN_SLIDER = gql`
  ${SLIDER_FIELDS}
  query GetAdminSlider($id: ID!) {
    adminSlider(id: $id) {
      ...SliderFields
    }
  }
`;

// ---------------------------------------------------------------------------
// Slider mutations
// ---------------------------------------------------------------------------

export const CREATE_SLIDER = gql`
  ${SLIDER_FIELDS}
  mutation CreateSlider($createSliderInput: CreateSliderInput!) {
    createSlider(createSliderInput: $createSliderInput) {
      ...SliderFields
    }
  }
`;

export const UPDATE_SLIDER = gql`
  ${SLIDER_FIELDS}
  mutation UpdateSlider($updateSliderInput: UpdateSliderInput!) {
    updateSlider(updateSliderInput: $updateSliderInput) {
      ...SliderFields
    }
  }
`;

export const SET_SLIDER_STATUS = gql`
  ${SLIDER_FIELDS}
  mutation SetSliderStatus($setSliderStatusInput: SetSliderStatusInput!) {
    setSliderStatus(setSliderStatusInput: $setSliderStatusInput) {
      ...SliderFields
    }
  }
`;

export const REMOVE_SLIDER = gql`
  ${SLIDER_FIELDS}
  mutation RemoveSlider($id: ID!) {
    removeSlider(id: $id) {
      ...SliderFields
    }
  }
`;

// ---------------------------------------------------------------------------
// Slide item mutations
// ---------------------------------------------------------------------------

export const ADD_SLIDE_ITEM = gql`
  ${SLIDE_ITEM_FIELDS}
  mutation AddSlideItem($addSlideItemInput: AddSlideItemInput!) {
    addSlideItem(addSlideItemInput: $addSlideItemInput) {
      ...SlideItemFields
    }
  }
`;

export const UPDATE_SLIDE_ITEM = gql`
  ${SLIDE_ITEM_FIELDS}
  mutation UpdateSlideItem($updateSlideItemInput: UpdateSlideItemInput!) {
    updateSlideItem(updateSlideItemInput: $updateSlideItemInput) {
      ...SlideItemFields
    }
  }
`;

export const REMOVE_SLIDE_ITEM = gql`
  ${SLIDE_ITEM_FIELDS}
  mutation RemoveSlideItem($id: ID!) {
    removeSlideItem(id: $id) {
      ...SlideItemFields
    }
  }
`;

export const REORDER_SLIDE_ITEMS = gql`
  mutation ReorderSlideItems(
    $reorderSlideItemsInput: ReorderSlideItemsInput!
  ) {
    reorderSlideItems(reorderSlideItemsInput: $reorderSlideItemsInput)
  }
`;
