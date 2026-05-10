/**
 * Product GraphQL operations.
 *
 * Phase A scope: simple products only. Pricing (price/sku) is flat on the
 * Product type — backend handles the variant indirection transparently.
 */

import { gql } from "@apollo/client";

export const PRODUCT_IMAGE_FIELDS = gql`
  fragment ProductImageFields on ProductImage {
    id
    productId
    imageUrl
    altText
    displayOrder
    isPrimary
    createdAt
    updatedAt
  }
`;

export const PRODUCT_SUMMARY_FIELDS = gql`
  ${PRODUCT_IMAGE_FIELDS}
  fragment ProductSummaryFields on Product {
    id
    name
    slug
    productType
    status
    isFeatured
    price
    compareAtPrice
    priceWithTax
    createdAt
    images {
      ...ProductImageFields
    }
  }
`;

export const PRODUCT_FIELDS = gql`
  ${PRODUCT_IMAGE_FIELDS}
  fragment ProductFields on Product {
    id
    storeId
    categoryId
    brandId
    name
    slug
    description
    shortDescription
    productType
    status
    isFeatured
    isDigital
    price
    compareAtPrice
    costPrice
    priceWithTax
    sku
    weight
    length
    width
    height
    hsnCode
    seoTitle
    seoDescription
    seoKeywords
    specifications
    createdAt
    updatedAt
    images {
      ...ProductImageFields
    }
    brand {
      id
      name
      slug
      logoUrl
    }
    category {
      id
      name
      slug
    }
    taxId
    tax {
      id
      name
      rate
    }
    tags {
      id
      name
      slug
    }
  }
`;

// ---------------------------------------------------------------------------
// Self (seller)
// ---------------------------------------------------------------------------
export const GET_MY_PRODUCTS = gql`
  ${PRODUCT_FIELDS}
  query GetMyProducts($storeId: ID, $status: ProductStatus) {
    myProducts(storeId: $storeId, status: $status) {
      ...ProductFields
    }
  }
`;

export const GET_MY_PRODUCT = gql`
  ${PRODUCT_FIELDS}
  query GetMyProduct($id: ID!) {
    myProduct(id: $id) {
      ...ProductFields
    }
  }
`;

export const CREATE_MY_PRODUCT = gql`
  ${PRODUCT_FIELDS}
  mutation CreateMyProduct($createProductInput: CreateProductInput!) {
    createMyProduct(createProductInput: $createProductInput) {
      ...ProductFields
    }
  }
`;

export const UPDATE_MY_PRODUCT = gql`
  ${PRODUCT_FIELDS}
  mutation UpdateMyProduct($updateProductInput: UpdateProductInput!) {
    updateMyProduct(updateProductInput: $updateProductInput) {
      ...ProductFields
    }
  }
`;

export const SET_MY_PRODUCT_STATUS = gql`
  ${PRODUCT_FIELDS}
  mutation SetMyProductStatus($setProductStatusInput: SetProductStatusInput!) {
    setMyProductStatus(setProductStatusInput: $setProductStatusInput) {
      ...ProductFields
    }
  }
`;

export const REMOVE_MY_PRODUCT = gql`
  ${PRODUCT_FIELDS}
  mutation RemoveMyProduct($id: ID!) {
    removeMyProduct(id: $id) {
      ...ProductFields
    }
  }
`;

// ---------------------------------------------------------------------------
// Image management
// ---------------------------------------------------------------------------
export const ADD_MY_PRODUCT_IMAGE = gql`
  ${PRODUCT_IMAGE_FIELDS}
  mutation AddMyProductImage($addProductImageInput: AddProductImageInput!) {
    addMyProductImage(addProductImageInput: $addProductImageInput) {
      ...ProductImageFields
    }
  }
`;

export const UPDATE_MY_PRODUCT_IMAGE = gql`
  ${PRODUCT_IMAGE_FIELDS}
  mutation UpdateMyProductImage(
    $updateProductImageInput: UpdateProductImageInput!
  ) {
    updateMyProductImage(updateProductImageInput: $updateProductImageInput) {
      ...ProductImageFields
    }
  }
`;

export const REMOVE_MY_PRODUCT_IMAGE = gql`
  ${PRODUCT_IMAGE_FIELDS}
  mutation RemoveMyProductImage($id: ID!) {
    removeMyProductImage(id: $id) {
      ...ProductImageFields
    }
  }
`;

export const REORDER_MY_PRODUCT_IMAGES = gql`
  mutation ReorderMyProductImages(
    $reorderProductImagesInput: ReorderProductImagesInput!
  ) {
    reorderMyProductImages(
      reorderProductImagesInput: $reorderProductImagesInput
    )
  }
`;

// ---------------------------------------------------------------------------
// Admin
// ---------------------------------------------------------------------------
export const GET_ADMIN_PRODUCTS = gql`
  ${PRODUCT_FIELDS}
  query GetAdminProducts(
    $status: ProductStatus
    $storeId: ID
    $brandId: ID
    $categoryId: ID
  ) {
    adminProducts(
      status: $status
      storeId: $storeId
      brandId: $brandId
      categoryId: $categoryId
    ) {
      ...ProductFields
      variants {
        id
        sku
        price
        status
        attributes {
          attributeName
          value
        }
      }
    }
  }
`;

export const ADMIN_SET_PRODUCT_STATUS = gql`
  ${PRODUCT_FIELDS}
  mutation AdminSetProductStatus(
    $setProductStatusInput: SetProductStatusInput!
  ) {
    adminSetProductStatus(setProductStatusInput: $setProductStatusInput) {
      ...ProductFields
    }
  }
`;

// ---------------------------------------------------------------------------
// Public
// ---------------------------------------------------------------------------
export const GET_PUBLIC_PRODUCT = gql`
  ${PRODUCT_FIELDS}
  query GetPublicProduct($slug: String!) {
    publicProduct(slug: $slug) {
      ...ProductFields
      variants {
        id
        sku
        price
        priceWithTax
        compareAtPrice
        imageUrl
        status
        availableQuantity
        stockState
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
  }
`;

export const GET_PUBLIC_PRODUCTS = gql`
  ${PRODUCT_SUMMARY_FIELDS}
  query GetPublicProducts(
    $storeSlug: String
    $brandSlug: String
    $tagSlug: String
    $categorySlug: String
    $sort: ProductSortOrder
    $limit: Float
  ) {
    publicProducts(
      storeSlug: $storeSlug
      brandSlug: $brandSlug
      tagSlug: $tagSlug
      categorySlug: $categorySlug
      sort: $sort
      limit: $limit
    ) {
      ...ProductSummaryFields
      variants {
        id
        price
        priceWithTax
        availableQuantity
      }
    }
  }
`;

export const GET_PAGINATED_PUBLIC_PRODUCTS = gql`
  ${PRODUCT_SUMMARY_FIELDS}
  query GetPaginatedPublicProducts(
    $storeSlug: String
    $brandSlug: String
    $tagSlug: String
    $categorySlug: String
    $minPrice: Float
    $maxPrice: Float
    $sort: ProductSortOrder
    $page: Int
    $pageSize: Int
  ) {
    paginatedPublicProducts(
      storeSlug: $storeSlug
      brandSlug: $brandSlug
      tagSlug: $tagSlug
      categorySlug: $categorySlug
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
          price
          priceWithTax
          availableQuantity
        }
      }
      totalCount
      totalPages
      currentPage
      pageSize
    }
  }
`;

// ---------------------------------------------------------------------------
// Variant queries + mutations (Phase B)
// ---------------------------------------------------------------------------

export const VARIANT_FIELDS = gql`
  fragment VariantFields on ProductVariant {
    id
    productId
    sku
    name
    price
    compareAtPrice
    costPrice
    weight
    length
    width
    height
    imageUrl
    status
    createdAt
    updatedAt
    attributes {
      attributeId
      attributeValueId
      attributeName
      attributeSlug
      value
      valueSlug
    }
  }
`;

export const VARIANT_AXIS_FIELDS = gql`
  fragment VariantAxisFields on VariantAxis {
    attributeId
    attributeName
    attributeSlug
    values {
      id
      attributeId
      value
      slug
      displayOrder
      createdAt
      updatedAt
    }
  }
`;

export const GET_MY_PRODUCT_VARIANTS = gql`
  ${VARIANT_FIELDS}
  query GetMyProductVariants($productId: ID!) {
    myProductVariants(productId: $productId) {
      ...VariantFields
    }
  }
`;

export const GET_MY_PRODUCT_VARIANT_AXES = gql`
  ${VARIANT_AXIS_FIELDS}
  query GetMyProductVariantAxes($productId: ID!) {
    myProductVariantAxes(productId: $productId) {
      ...VariantAxisFields
    }
  }
`;

export const SET_MY_PRODUCT_VARIANT_AXES = gql`
  ${VARIANT_AXIS_FIELDS}
  mutation SetMyProductVariantAxes($setVariantAxesInput: SetVariantAxesInput!) {
    setMyProductVariantAxes(setVariantAxesInput: $setVariantAxesInput) {
      ...VariantAxisFields
    }
  }
`;

export const GENERATE_MY_PRODUCT_VARIANT_MATRIX = gql`
  ${VARIANT_FIELDS}
  mutation GenerateMyProductVariantMatrix(
    $generateVariantMatrixInput: GenerateVariantMatrixInput!
  ) {
    generateMyProductVariantMatrix(
      generateVariantMatrixInput: $generateVariantMatrixInput
    ) {
      ...VariantFields
    }
  }
`;

export const ADD_MY_PRODUCT_VARIANT = gql`
  ${VARIANT_FIELDS}
  mutation AddMyProductVariant($createVariantInput: CreateVariantInput!) {
    addMyProductVariant(createVariantInput: $createVariantInput) {
      ...VariantFields
    }
  }
`;

export const UPDATE_MY_PRODUCT_VARIANT = gql`
  ${VARIANT_FIELDS}
  mutation UpdateMyProductVariant($updateVariantInput: UpdateVariantInput!) {
    updateMyProductVariant(updateVariantInput: $updateVariantInput) {
      ...VariantFields
    }
  }
`;

export const REMOVE_MY_PRODUCT_VARIANT = gql`
  ${VARIANT_FIELDS}
  mutation RemoveMyProductVariant($id: ID!) {
    removeMyProductVariant(id: $id) {
      ...VariantFields
    }
  }
`;

export const BULK_UPDATE_MY_PRODUCT_VARIANTS = gql`
  mutation BulkUpdateMyProductVariants(
    $bulkUpdateVariantsInput: BulkUpdateVariantsInput!
  ) {
    bulkUpdateMyProductVariants(
      bulkUpdateVariantsInput: $bulkUpdateVariantsInput
    )
  }
`;
