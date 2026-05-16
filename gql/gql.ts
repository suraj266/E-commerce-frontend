/* eslint-disable */
import * as types from './graphql';
import { TypedDocumentNode as DocumentNode } from '@graphql-typed-document-node/core';

/**
 * Map of all GraphQL operations in the project.
 *
 * This map has several performance disadvantages:
 * 1. It is not tree-shakeable, so it will include all operations in the project.
 * 2. It is not minifiable, so the string of a GraphQL query will be multiple times inside the bundle.
 * 3. It does not support dead code elimination, so it will add unused operations.
 *
 * Therefore it is highly recommended to use the babel or swc plugin for production.
 * Learn more about it here: https://the-guild.dev/graphql/codegen/plugins/presets/preset-client#reducing-bundle-size
 */
type Documents = {
    "\n  \n  query GetMyProfile {\n    myProfile {\n      ...AdminCustomerFields\n    }\n  }\n": typeof types.GetMyProfileDocument,
    "\n  \n  mutation UpdateMyProfile($input: UpdateMyProfileInput!) {\n    updateMyProfile(input: $input) {\n      ...AdminCustomerFields\n    }\n  }\n": typeof types.UpdateMyProfileDocument,
    "\n  fragment AddressFields on Address {\n    id\n    userId\n    type\n    label\n    firstName\n    lastName\n    phone\n    addressLine1\n    addressLine2\n    city\n    state\n    postalCode\n    countryCode\n    isDefault\n  }\n": typeof types.AddressFieldsFragmentDoc,
    "\n  \n  query GetMyAddresses {\n    myAddresses {\n      ...AddressFields\n    }\n  }\n": typeof types.GetMyAddressesDocument,
    "\n  \n  mutation AddMyAddress($input: CreateAddressInput!) {\n    addMyAddress(input: $input) {\n      ...AddressFields\n    }\n  }\n": typeof types.AddMyAddressDocument,
    "\n  \n  mutation UpdateMyAddress($input: UpdateAddressInput!) {\n    updateMyAddress(input: $input) {\n      ...AddressFields\n    }\n  }\n": typeof types.UpdateMyAddressDocument,
    "\n  \n  mutation SetMyDefaultAddress($id: ID!) {\n    setMyDefaultAddress(id: $id) {\n      ...AddressFields\n    }\n  }\n": typeof types.SetMyDefaultAddressDocument,
    "\n  \n  mutation RemoveMyAddress($id: ID!) {\n    removeMyAddress(id: $id) {\n      ...AddressFields\n    }\n  }\n": typeof types.RemoveMyAddressDocument,
    "\n  fragment AdminThemeFields on AdminTheme {\n    id\n    primaryLight\n    primaryDark\n    accentLight\n    accentDark\n    sidebarLight\n    sidebarDark\n    destructiveLight\n    destructiveDark\n    radius\n    fontFamily\n    updatedAt\n    updatedById\n  }\n": typeof types.AdminThemeFieldsFragmentDoc,
    "\n  \n  query GetAdminTheme {\n    adminTheme {\n      ...AdminThemeFields\n    }\n  }\n": typeof types.GetAdminThemeDocument,
    "\n  \n  mutation UpdateAdminTheme(\n    $updateAdminThemeInput: UpdateAdminThemeInput!\n  ) {\n    updateAdminTheme(updateAdminThemeInput: $updateAdminThemeInput) {\n      ...AdminThemeFields\n    }\n  }\n": typeof types.UpdateAdminThemeDocument,
    "\n  \n  mutation ResetAdminTheme {\n    resetAdminTheme {\n      ...AdminThemeFields\n    }\n  }\n": typeof types.ResetAdminThemeDocument,
    "\n  fragment AttributeValueFields on ProductAttributeValue {\n    id\n    attributeId\n    value\n    slug\n    displayOrder\n    createdAt\n    updatedAt\n  }\n": typeof types.AttributeValueFieldsFragmentDoc,
    "\n  \n  fragment AttributeFields on ProductAttribute {\n    id\n    name\n    slug\n    description\n    type\n    isVariantAttribute\n    createdAt\n    updatedAt\n    values {\n      ...AttributeValueFields\n    }\n  }\n": typeof types.AttributeFieldsFragmentDoc,
    "\n  \n  query GetAdminAttributes($type: AttributeType) {\n    adminAttributes(type: $type) {\n      ...AttributeFields\n    }\n  }\n": typeof types.GetAdminAttributesDocument,
    "\n  \n  query GetAttributes($type: AttributeType, $variantOnly: Boolean) {\n    attributes(type: $type, variantOnly: $variantOnly) {\n      ...AttributeFields\n    }\n  }\n": typeof types.GetAttributesDocument,
    "\n  \n  query GetAttribute($id: ID!) {\n    attribute(id: $id) {\n      ...AttributeFields\n    }\n  }\n": typeof types.GetAttributeDocument,
    "\n  \n  mutation CreateAttribute($createAttributeInput: CreateAttributeInput!) {\n    createAttribute(createAttributeInput: $createAttributeInput) {\n      ...AttributeFields\n    }\n  }\n": typeof types.CreateAttributeDocument,
    "\n  \n  mutation UpdateAttribute($updateAttributeInput: UpdateAttributeInput!) {\n    updateAttribute(updateAttributeInput: $updateAttributeInput) {\n      ...AttributeFields\n    }\n  }\n": typeof types.UpdateAttributeDocument,
    "\n  \n  mutation RemoveAttribute($id: ID!) {\n    removeAttribute(id: $id) {\n      ...AttributeFields\n    }\n  }\n": typeof types.RemoveAttributeDocument,
    "\n  \n  mutation CreateAttributeValue(\n    $createAttributeValueInput: CreateAttributeValueInput!\n  ) {\n    createAttributeValue(createAttributeValueInput: $createAttributeValueInput) {\n      ...AttributeValueFields\n    }\n  }\n": typeof types.CreateAttributeValueDocument,
    "\n  \n  mutation UpdateAttributeValue(\n    $updateAttributeValueInput: UpdateAttributeValueInput!\n  ) {\n    updateAttributeValue(updateAttributeValueInput: $updateAttributeValueInput) {\n      ...AttributeValueFields\n    }\n  }\n": typeof types.UpdateAttributeValueDocument,
    "\n  \n  mutation RemoveAttributeValue($id: ID!) {\n    removeAttributeValue(id: $id) {\n      ...AttributeValueFields\n    }\n  }\n": typeof types.RemoveAttributeValueDocument,
    "\n  mutation ReorderAttributeValues(\n    $reorderAttributeValuesInput: ReorderAttributeValuesInput!\n  ) {\n    reorderAttributeValues(\n      reorderAttributeValuesInput: $reorderAttributeValuesInput\n    )\n  }\n": typeof types.ReorderAttributeValuesDocument,
    "\n  fragment BrandFields on Brand {\n    id\n    name\n    slug\n    description\n    logoUrl\n    bannerUrl\n    websiteUrl\n    countryCode\n    foundedYear\n    status\n    isFeatured\n    createdAt\n    updatedAt\n  }\n": typeof types.BrandFieldsFragmentDoc,
    "\n  \n  query GetAdminBrands($status: BrandStatus) {\n    adminBrands(status: $status) {\n      ...BrandFields\n    }\n  }\n": typeof types.GetAdminBrandsDocument,
    "\n  \n  query GetBrands($status: BrandStatus, $featuredOnly: Boolean) {\n    brands(status: $status, featuredOnly: $featuredOnly) {\n      ...BrandFields\n    }\n  }\n": typeof types.GetBrandsDocument,
    "\n  \n  query GetBrand($id: ID!) {\n    brand(id: $id) {\n      ...BrandFields\n    }\n  }\n": typeof types.GetBrandDocument,
    "\n  \n  query GetPublicBrand($slug: String!) {\n    publicBrand(slug: $slug) {\n      ...BrandFields\n    }\n  }\n": typeof types.GetPublicBrandDocument,
    "\n  \n  mutation CreateBrand($createBrandInput: CreateBrandInput!) {\n    createBrand(createBrandInput: $createBrandInput) {\n      ...BrandFields\n    }\n  }\n": typeof types.CreateBrandDocument,
    "\n  \n  mutation UpdateBrand($updateBrandInput: UpdateBrandInput!) {\n    updateBrand(updateBrandInput: $updateBrandInput) {\n      ...BrandFields\n    }\n  }\n": typeof types.UpdateBrandDocument,
    "\n  \n  mutation SetBrandStatus($setBrandStatusInput: SetBrandStatusInput!) {\n    setBrandStatus(setBrandStatusInput: $setBrandStatusInput) {\n      ...BrandFields\n    }\n  }\n": typeof types.SetBrandStatusDocument,
    "\n  \n  mutation RemoveBrand($id: ID!) {\n    removeBrand(id: $id) {\n      ...BrandFields\n    }\n  }\n": typeof types.RemoveBrandDocument,
    "\n  \n  fragment CartFields on Cart {\n    id\n    customerId\n    itemCount\n    subtotal\n    needsReview\n    items {\n      id\n      productId\n      variantId\n      quantity\n      unitPriceSnapshot\n      unitPriceCurrent\n      priceChanged\n      lineTotal\n      availableQuantity\n      stockState\n      createdAt\n      product {\n        ...ProductFields\n      }\n      variant {\n        id\n        sku\n        name\n        price\n        priceWithTax\n        imageUrl\n        attributes {\n          attributeId\n          attributeValueId\n          attributeName\n          attributeSlug\n          value\n          valueSlug\n        }\n      }\n    }\n    createdAt\n    updatedAt\n  }\n": typeof types.CartFieldsFragmentDoc,
    "\n  \n  query GetMyCart {\n    myCart {\n      ...CartFields\n    }\n  }\n": typeof types.GetMyCartDocument,
    "\n  query GetMyCartItemCount {\n    myCartItemCount\n  }\n": typeof types.GetMyCartItemCountDocument,
    "\n  \n  mutation AddToCart($input: AddToCartInput!) {\n    addToCart(input: $input) {\n      ...CartFields\n    }\n  }\n": typeof types.AddToCartDocument,
    "\n  \n  mutation UpdateCartItemQty($input: UpdateCartItemQtyInput!) {\n    updateCartItemQty(input: $input) {\n      ...CartFields\n    }\n  }\n": typeof types.UpdateCartItemQtyDocument,
    "\n  \n  mutation RemoveFromCart($input: RemoveCartItemInput!) {\n    removeFromCart(input: $input) {\n      ...CartFields\n    }\n  }\n": typeof types.RemoveFromCartDocument,
    "\n  \n  mutation ClearCart {\n    clearCart {\n      ...CartFields\n    }\n  }\n": typeof types.ClearCartDocument,
    "\n  fragment CategoryFields on Category {\n    id\n    name\n    slug\n    description\n    parentId\n    imageUrl\n    iconUrl\n    displayOrder\n    isActive\n    createdAt\n    updatedAt\n  }\n": typeof types.CategoryFieldsFragmentDoc,
    "\n  \n  query GetCategories {\n    categories {\n      ...CategoryFields\n    }\n  }\n": typeof types.GetCategoriesDocument,
    "\n  query GetShopFilterCategories {\n    shopFilterCategories {\n      id\n      name\n      slug\n      displayOrder\n      productCount\n    }\n  }\n": typeof types.GetShopFilterCategoriesDocument,
    "\n  \n  query GetAdminCategoriesPaginated(\n    $page: Int\n    $pageSize: Int\n    $search: String\n  ) {\n    adminCategoriesPaginated(page: $page, pageSize: $pageSize, search: $search) {\n      items {\n        ...CategoryFields\n      }\n      totalCount\n      totalPages\n      currentPage\n      pageSize\n    }\n  }\n": typeof types.GetAdminCategoriesPaginatedDocument,
    "\n  query GetCategoryChildren($parentId: ID, $search: String, $limit: Int) {\n    categoryChildren(parentId: $parentId, search: $search, limit: $limit) {\n      id\n      name\n      slug\n      parentId\n      hasChildren\n    }\n  }\n": typeof types.GetCategoryChildrenDocument,
    "\n  query GetCategoryAncestors($id: ID!) {\n    categoryAncestors(id: $id) {\n      id\n      name\n      slug\n      parentId\n      hasChildren\n    }\n  }\n": typeof types.GetCategoryAncestorsDocument,
    "\n  \n  query GetCategory($id: ID!) {\n    category(id: $id) {\n      ...CategoryFields\n    }\n  }\n": typeof types.GetCategoryDocument,
    "\n  \n  query GetPublicCategoryBySlug($slug: String!) {\n    publicCategoryBySlug(slug: $slug) {\n      ...CategoryFields\n      children {\n        ...CategoryFields\n      }\n    }\n  }\n": typeof types.GetPublicCategoryBySlugDocument,
    "\n  \n  mutation CreateCategory($createCategoryInput: CreateCategoryInput!) {\n    createCategory(createCategoryInput: $createCategoryInput) {\n      ...CategoryFields\n    }\n  }\n": typeof types.CreateCategoryDocument,
    "\n  \n  mutation UpdateCategory($updateCategoryInput: UpdateCategoryInput!) {\n    updateCategory(updateCategoryInput: $updateCategoryInput) {\n      ...CategoryFields\n    }\n  }\n": typeof types.UpdateCategoryDocument,
    "\n  \n  mutation RemoveCategory($id: ID!) {\n    removeCategory(id: $id) {\n      ...CategoryFields\n    }\n  }\n": typeof types.RemoveCategoryDocument,
    "\n  mutation UpdateCategoryTree($input: UpdateCategoryTreeInput!) {\n    updateCategoryTree(updateCategoryTreeInput: $input)\n  }\n": typeof types.UpdateCategoryTreeDocument,
    "\n  fragment CouponFields on Coupon {\n    id\n    storeId\n    code\n    name\n    description\n    discountType\n    discountValue\n    minimumPurchaseAmount\n    maximumDiscountAmount\n    usageLimit\n    usageLimitPerUser\n    validFrom\n    validUntil\n    isActive\n    redemptionCount\n    createdAt\n    updatedAt\n  }\n": typeof types.CouponFieldsFragmentDoc,
    "\n  query GetAdminCoupons($search: String, $status: String) {\n    adminCoupons(search: $search, status: $status) {\n      ...CouponFields\n    }\n  }\n": typeof types.GetAdminCouponsDocument,
    "\n  query GetAdminCoupon($id: ID!) {\n    adminCoupon(id: $id) {\n      ...CouponFields\n    }\n  }\n": typeof types.GetAdminCouponDocument,
    "\n  mutation CreateCoupon($input: CreateCouponInput!) {\n    createCoupon(input: $input) {\n      ...CouponFields\n    }\n  }\n": typeof types.CreateCouponDocument,
    "\n  mutation UpdateCoupon($input: UpdateCouponInput!) {\n    updateCoupon(input: $input) {\n      ...CouponFields\n    }\n  }\n": typeof types.UpdateCouponDocument,
    "\n  mutation RemoveCoupon($id: ID!) {\n    removeCoupon(id: $id) {\n      id\n    }\n  }\n": typeof types.RemoveCouponDocument,
    "\n  mutation ValidateCoupon($input: ValidateCouponInput!) {\n    validateCoupon(input: $input) {\n      isValid\n      reason\n      discountAmount\n      subtotal\n      subtotalInclTax\n      discountInclTax\n      customerTotal\n      coupon {\n        ...CouponFields\n      }\n    }\n  }\n": typeof types.ValidateCouponDocument,
    "\n  fragment AdminCustomerFields on AdminCustomer {\n    id\n    userId\n    name\n    email\n    phone\n    status\n    emailVerifiedAt\n    lastLoginAt\n    userCreatedAt\n    marketingOptIn\n    preferredCurrency\n    createdAt\n    updatedAt\n    deletedAt\n  }\n": typeof types.AdminCustomerFieldsFragmentDoc,
    "\n  \n  query GetAdminCustomers(\n    $status: String\n    $search: String\n    $includeDeleted: Boolean\n    $page: Int\n    $pageSize: Int\n  ) {\n    adminCustomers(\n      status: $status\n      search: $search\n      includeDeleted: $includeDeleted\n      page: $page\n      pageSize: $pageSize\n    ) {\n      items {\n        ...AdminCustomerFields\n      }\n      totalCount\n      totalPages\n      currentPage\n      pageSize\n    }\n  }\n": typeof types.GetAdminCustomersDocument,
    "\n  \n  query GetAdminCustomer($id: ID!) {\n    adminCustomer(id: $id) {\n      ...AdminCustomerFields\n    }\n  }\n": typeof types.GetAdminCustomerDocument,
    "\n  \n  mutation UpdateCustomer($input: UpdateCustomerInput!) {\n    updateCustomer(input: $input) {\n      ...AdminCustomerFields\n    }\n  }\n": typeof types.UpdateCustomerDocument,
    "\n  \n  mutation SoftDeleteCustomer($id: ID!) {\n    softDeleteCustomer(id: $id) {\n      ...AdminCustomerFields\n    }\n  }\n": typeof types.SoftDeleteCustomerDocument,
    "\n  \n  mutation RestoreCustomer($id: ID!) {\n    restoreCustomer(id: $id) {\n      ...AdminCustomerFields\n    }\n  }\n": typeof types.RestoreCustomerDocument,
    "\n  query GetEmailSetting {\n    emailSetting {\n      id\n      mailer\n      host\n      port\n      username\n      encryption\n      senderName\n      senderEmail\n      localDomain\n      isConfigured\n      hasPassword\n      updatedAt\n    }\n  }\n": typeof types.GetEmailSettingDocument,
    "\n  mutation UpdateEmailSetting($input: UpdateEmailSettingInput!) {\n    updateEmailSetting(input: $input) {\n      id\n      mailer\n      host\n      port\n      username\n      encryption\n      senderName\n      senderEmail\n      localDomain\n      isConfigured\n      hasPassword\n      updatedAt\n    }\n  }\n": typeof types.UpdateEmailSettingDocument,
    "\n  query GetEmailTemplates {\n    emailTemplates {\n      id\n      key\n      name\n      description\n      category\n      subject\n      variables\n      isEnabled\n      isSystem\n      updatedAt\n    }\n  }\n": typeof types.GetEmailTemplatesDocument,
    "\n  query GetEmailTemplate($id: ID!) {\n    emailTemplate(id: $id) {\n      id\n      key\n      name\n      description\n      category\n      subject\n      htmlBody\n      textBody\n      variables\n      isEnabled\n      isSystem\n      updatedAt\n    }\n  }\n": typeof types.GetEmailTemplateDocument,
    "\n  mutation UpdateEmailTemplate($input: UpdateEmailTemplateInput!) {\n    updateEmailTemplate(input: $input) {\n      id\n      key\n      name\n      description\n      category\n      subject\n      htmlBody\n      textBody\n      variables\n      isEnabled\n      isSystem\n      updatedAt\n    }\n  }\n": typeof types.UpdateEmailTemplateDocument,
    "\n  mutation SendTestEmail($input: SendTestEmailInput!) {\n    sendTestEmail(input: $input) {\n      success\n      message\n    }\n  }\n": typeof types.SendTestEmailDocument,
    "\n  fragment ImageFields on Image {\n    id\n    provider\n    externalId\n    url\n    format\n    width\n    height\n    sizeBytes\n    ownerType\n    ownerId\n    purpose\n    alt\n    createdAt\n  }\n": typeof types.ImageFieldsFragmentDoc,
    "\n  mutation PresignImageUpload($presignUploadInput: PresignUploadInput!) {\n    presignImageUpload(presignUploadInput: $presignUploadInput) {\n      uploadUrl\n      method\n      fields\n      externalId\n      expiresIn\n      provider\n    }\n  }\n": typeof types.PresignImageUploadDocument,
    "\n  \n  mutation ConfirmImageUpload($confirmUploadInput: ConfirmUploadInput!) {\n    confirmImageUpload(confirmUploadInput: $confirmUploadInput) {\n      ...ImageFields\n    }\n  }\n": typeof types.ConfirmImageUploadDocument,
    "\n  \n  mutation DeleteImage($id: ID!) {\n    deleteImage(id: $id) {\n      ...ImageFields\n    }\n  }\n": typeof types.DeleteImageDocument,
    "\n  fragment InventoryFields on Inventory {\n    id\n    variantId\n    warehouseId\n    quantityAvailable\n    quantityReserved\n    quantityOnHand\n    reorderPoint\n    reorderQuantity\n    lastCountedAt\n    createdAt\n    updatedAt\n    stockState\n    warehouse {\n      id\n      name\n      code\n      isDefault\n      storeId\n    }\n    variant {\n      id\n      productId\n      sku\n      imageUrl\n      status\n      attributes {\n        attributeId\n        attributeValueId\n        attributeName\n        attributeSlug\n        value\n        valueSlug\n      }\n    }\n    product {\n      id\n      name\n      slug\n      storeId\n    }\n  }\n": typeof types.InventoryFieldsFragmentDoc,
    "\n  fragment InventoryMovementFields on InventoryMovement {\n    id\n    inventoryId\n    variantId\n    warehouseId\n    movementType\n    quantityChange\n    quantityBefore\n    quantityAfter\n    referenceType\n    referenceId\n    notes\n    createdById\n    createdAt\n  }\n": typeof types.InventoryMovementFieldsFragmentDoc,
    "\n  \n  query GetMyInventory(\n    $storeId: ID\n    $warehouseId: ID\n    $productId: ID\n    $lowStockOnly: Boolean\n    $search: String\n  ) {\n    myInventory(\n      storeId: $storeId\n      warehouseId: $warehouseId\n      productId: $productId\n      lowStockOnly: $lowStockOnly\n      search: $search\n    ) {\n      ...InventoryFields\n    }\n  }\n": typeof types.GetMyInventoryDocument,
    "\n  \n  query GetMyInventoryByVariant($variantId: ID!, $warehouseId: ID) {\n    myInventoryByVariant(variantId: $variantId, warehouseId: $warehouseId) {\n      ...InventoryFields\n    }\n  }\n": typeof types.GetMyInventoryByVariantDocument,
    "\n  \n  query GetMyInventoryMovements(\n    $variantId: ID\n    $warehouseId: ID\n    $limit: Int\n  ) {\n    myInventoryMovements(\n      variantId: $variantId\n      warehouseId: $warehouseId\n      limit: $limit\n    ) {\n      ...InventoryMovementFields\n    }\n  }\n": typeof types.GetMyInventoryMovementsDocument,
    "\n  \n  query GetAdminInventoryByProduct($productId: ID!) {\n    adminInventoryByProduct(productId: $productId) {\n      ...InventoryFields\n    }\n  }\n": typeof types.GetAdminInventoryByProductDocument,
    "\n  \n  mutation AdjustMyInventory($adjustInventoryInput: AdjustInventoryInput!) {\n    adjustMyInventory(adjustInventoryInput: $adjustInventoryInput) {\n      ...InventoryFields\n    }\n  }\n": typeof types.AdjustMyInventoryDocument,
    "\n  \n  mutation SetMyReorderPoint($setReorderPointInput: SetReorderPointInput!) {\n    setMyReorderPoint(setReorderPointInput: $setReorderPointInput) {\n      ...InventoryFields\n    }\n  }\n": typeof types.SetMyReorderPointDocument,
    "\n  fragment MenuFields on Menu {\n    id\n    name\n    location\n    isActive\n    items\n    createdAt\n    updatedAt\n  }\n": typeof types.MenuFieldsFragmentDoc,
    "\n  \n  query GetPublicMenu($location: MenuLocation!) {\n    publicMenu(location: $location) {\n      ...MenuFields\n    }\n  }\n": typeof types.GetPublicMenuDocument,
    "\n  \n  query GetAdminMenus {\n    adminMenus {\n      ...MenuFields\n    }\n  }\n": typeof types.GetAdminMenusDocument,
    "\n  \n  query GetAdminMenu($location: MenuLocation!) {\n    adminMenu(location: $location) {\n      ...MenuFields\n    }\n  }\n": typeof types.GetAdminMenuDocument,
    "\n  \n  mutation UpsertMenu($upsertMenuInput: UpsertMenuInput!) {\n    upsertMenu(upsertMenuInput: $upsertMenuInput) {\n      ...MenuFields\n    }\n  }\n": typeof types.UpsertMenuDocument,
    "\n  \n  mutation SetMenuActive($location: MenuLocation!, $isActive: Boolean!) {\n    setMenuActive(location: $location, isActive: $isActive) {\n      ...MenuFields\n    }\n  }\n": typeof types.SetMenuActiveDocument,
    "\n  \n  mutation RemoveMenu($location: MenuLocation!) {\n    removeMenu(location: $location) {\n      ...MenuFields\n    }\n  }\n": typeof types.RemoveMenuDocument,
    "\n  fragment NewsletterFields on NewsletterSubscription {\n    id\n    email\n    source\n    status\n    unsubscribedAt\n    createdAt\n    updatedAt\n  }\n": typeof types.NewsletterFieldsFragmentDoc,
    "\n  mutation SubscribeToNewsletter($input: SubscribeNewsletterInput!) {\n    subscribeToNewsletter(input: $input) {\n      ok\n      message\n    }\n  }\n": typeof types.SubscribeToNewsletterDocument,
    "\n  \n  query GetAdminNewsletterSubscriptions(\n    $status: NewsletterStatus\n    $page: Int\n    $pageSize: Int\n    $search: String\n  ) {\n    adminNewsletterSubscriptions(\n      status: $status\n      page: $page\n      pageSize: $pageSize\n      search: $search\n    ) {\n      items {\n        ...NewsletterFields\n      }\n      totalCount\n      totalPages\n      currentPage\n      pageSize\n    }\n  }\n": typeof types.GetAdminNewsletterSubscriptionsDocument,
    "\n  \n  mutation UnsubscribeNewsletter($id: ID!) {\n    unsubscribeNewsletter(id: $id) {\n      ...NewsletterFields\n    }\n  }\n": typeof types.UnsubscribeNewsletterDocument,
    "\n  fragment OrderAddressFields on OrderAddressSnapshot {\n    id\n    firstName\n    lastName\n    phone\n    addressLine1\n    addressLine2\n    city\n    state\n    postalCode\n    countryCode\n  }\n": typeof types.OrderAddressFieldsFragmentDoc,
    "\n  fragment OrderItemFields on OrderItem {\n    id\n    orderId\n    sellerOrderId\n    productId\n    variantId\n    storeId\n    sku\n    name\n    variantName\n    quantity\n    unitPrice\n    totalPrice\n    taxAmount\n    discountAmount\n    attributesSnapshot {\n      attributeName\n      value\n    }\n    imageUrlSnapshot\n    createdAt\n  }\n": typeof types.OrderItemFieldsFragmentDoc,
    "\n  fragment StatusHistoryFields on OrderStatusHistoryEntry {\n    id\n    fromStatus\n    toStatus\n    changedById\n    notes\n    createdAt\n  }\n": typeof types.StatusHistoryFieldsFragmentDoc,
    "\n  \n  \n  \n  fragment SellerOrderFields on SellerOrder {\n    id\n    orderId\n    sellerId\n    storeId\n    orderNumber\n    status\n    paymentStatus\n    payoutStatus\n    subtotal\n    taxAmount\n    shippingAmount\n    discountAmount\n    commissionAmount\n    payoutAmount\n    currencyCode\n    packedAt\n    shippedAt\n    deliveredAt\n    cancelledAt\n    createdAt\n    updatedAt\n    itemCount\n    storeName\n    items {\n      ...OrderItemFields\n    }\n    statusHistory {\n      ...StatusHistoryFields\n    }\n    parentOrderNumber\n    shippingAddress {\n      ...OrderAddressFields\n    }\n    customerName\n  }\n": typeof types.SellerOrderFieldsFragmentDoc,
    "\n  \n  \n  \n  \n  fragment OrderFields on Order {\n    id\n    orderNumber\n    customerId\n    status\n    paymentStatus\n    paymentMethod\n    subtotal\n    taxAmount\n    shippingAmount\n    discountAmount\n    totalAmount\n    currencyCode\n    customerNotes\n    placedAt\n    cancelledAt\n    deliveredAt\n    createdAt\n    updatedAt\n    itemCount\n    items {\n      ...OrderItemFields\n    }\n    sellerOrders {\n      ...SellerOrderFields\n    }\n    statusHistory {\n      ...StatusHistoryFields\n    }\n    shippingAddress {\n      ...OrderAddressFields\n    }\n    billingAddress {\n      ...OrderAddressFields\n    }\n  }\n": typeof types.OrderFieldsFragmentDoc,
    "\n  \n  query GetMyOrders($status: OrderStatus, $page: Int, $pageSize: Int) {\n    myOrders(status: $status, page: $page, pageSize: $pageSize) {\n      items {\n        ...OrderFields\n      }\n      totalCount\n      totalPages\n      currentPage\n      pageSize\n    }\n  }\n": typeof types.GetMyOrdersDocument,
    "\n  \n  query GetMyOrder($id: ID!) {\n    myOrder(id: $id) {\n      ...OrderFields\n    }\n  }\n": typeof types.GetMyOrderDocument,
    "\n  \n  mutation PlaceOrder($input: PlaceOrderInput!) {\n    placeOrder(input: $input) {\n      ...OrderFields\n    }\n  }\n": typeof types.PlaceOrderDocument,
    "\n  \n  mutation CancelMyOrder($id: ID!, $notes: String) {\n    cancelMyOrder(id: $id, notes: $notes) {\n      ...OrderFields\n    }\n  }\n": typeof types.CancelMyOrderDocument,
    "\n  \n  query GetMySellerOrders($status: OrderStatus, $page: Int, $pageSize: Int) {\n    mySellerOrders(status: $status, page: $page, pageSize: $pageSize) {\n      items {\n        ...SellerOrderFields\n      }\n      totalCount\n      totalPages\n      currentPage\n      pageSize\n    }\n  }\n": typeof types.GetMySellerOrdersDocument,
    "\n  \n  query GetMySellerOrder($id: ID!) {\n    mySellerOrder(id: $id) {\n      ...SellerOrderFields\n    }\n  }\n": typeof types.GetMySellerOrderDocument,
    "\n  \n  mutation UpdateSellerOrderStatus($input: UpdateSellerOrderStatusInput!) {\n    updateSellerOrderStatus(input: $input) {\n      ...SellerOrderFields\n    }\n  }\n": typeof types.UpdateSellerOrderStatusDocument,
    "\n  fragment PageFields on Page {\n    id\n    slug\n    title\n    metaTitle\n    metaDesc\n    status\n    blocks\n    isSystem\n    publishedAt\n    createdAt\n    updatedAt\n  }\n": typeof types.PageFieldsFragmentDoc,
    "\n  \n  query GetPublicPage($slug: String!) {\n    publicPage(slug: $slug) {\n      ...PageFields\n    }\n  }\n": typeof types.GetPublicPageDocument,
    "\n  \n  query GetAdminPages($status: PageStatus) {\n    adminPages(status: $status) {\n      ...PageFields\n    }\n  }\n": typeof types.GetAdminPagesDocument,
    "\n  \n  query GetAdminPagesPaginated(\n    $status: PageStatus\n    $page: Int\n    $pageSize: Int\n    $search: String\n  ) {\n    adminPagesPaginated(\n      status: $status\n      page: $page\n      pageSize: $pageSize\n      search: $search\n    ) {\n      items {\n        ...PageFields\n      }\n      totalCount\n      totalPages\n      currentPage\n      pageSize\n    }\n  }\n": typeof types.GetAdminPagesPaginatedDocument,
    "\n  \n  query GetPage($id: ID!) {\n    page(id: $id) {\n      ...PageFields\n    }\n  }\n": typeof types.GetPageDocument,
    "\n  \n  mutation CreatePage($createPageInput: CreatePageInput!) {\n    createPage(createPageInput: $createPageInput) {\n      ...PageFields\n    }\n  }\n": typeof types.CreatePageDocument,
    "\n  \n  mutation UpdatePage($updatePageInput: UpdatePageInput!) {\n    updatePage(updatePageInput: $updatePageInput) {\n      ...PageFields\n    }\n  }\n": typeof types.UpdatePageDocument,
    "\n  \n  mutation SetPageStatus($setPageStatusInput: SetPageStatusInput!) {\n    setPageStatus(setPageStatusInput: $setPageStatusInput) {\n      ...PageFields\n    }\n  }\n": typeof types.SetPageStatusDocument,
    "\n  \n  mutation RemovePage($id: ID!) {\n    removePage(id: $id) {\n      ...PageFields\n    }\n  }\n": typeof types.RemovePageDocument,
    "\n  query AdminPaymentGateways {\n    adminPaymentGateways {\n      id\n      gateway\n      displayName\n      description\n      logoUrl\n      isEnabled\n      isDefault\n      displayOrder\n      supportedMethods\n      sandboxMode\n      processingFee\n      processingFeeType\n      paymentType\n      instructions\n      webhookUrl\n      credentialHints\n      hasCredentials\n      createdAt\n      updatedAt\n    }\n  }\n": typeof types.AdminPaymentGatewaysDocument,
    "\n  query AdminPaymentGateway($id: ID!) {\n    adminPaymentGateway(id: $id) {\n      id\n      gateway\n      displayName\n      description\n      logoUrl\n      isEnabled\n      isDefault\n      displayOrder\n      supportedMethods\n      sandboxMode\n      processingFee\n      processingFeeType\n      paymentType\n      instructions\n      webhookUrl\n      credentialHints\n      hasCredentials\n      createdAt\n      updatedAt\n    }\n  }\n": typeof types.AdminPaymentGatewayDocument,
    "\n  mutation CreatePaymentGatewayConfig($input: CreateGatewayConfigInput!) {\n    createPaymentGatewayConfig(input: $input) {\n      id\n      gateway\n      displayName\n      isEnabled\n      isDefault\n    }\n  }\n": typeof types.CreatePaymentGatewayConfigDocument,
    "\n  mutation UpdatePaymentGatewayConfig($input: UpdateGatewayConfigInput!) {\n    updatePaymentGatewayConfig(input: $input) {\n      id\n      gateway\n      displayName\n      description\n      logoUrl\n      isEnabled\n      isDefault\n      displayOrder\n      supportedMethods\n      sandboxMode\n      processingFee\n      processingFeeType\n      paymentType\n      instructions\n      webhookUrl\n      credentialHints\n      hasCredentials\n      updatedAt\n    }\n  }\n": typeof types.UpdatePaymentGatewayConfigDocument,
    "\n  mutation TogglePaymentGateway($id: ID!, $enabled: Boolean!) {\n    togglePaymentGateway(id: $id, enabled: $enabled) {\n      id\n      isEnabled\n    }\n  }\n": typeof types.TogglePaymentGatewayDocument,
    "\n  mutation SetDefaultPaymentGateway($id: ID!) {\n    setDefaultPaymentGateway(id: $id) {\n      id\n      isDefault\n    }\n  }\n": typeof types.SetDefaultPaymentGatewayDocument,
    "\n  query AdminPaymentTransactions(\n    $page: Int = 1\n    $pageSize: Int = 10\n    $gateway: PaymentGateway\n    $status: PaymentTransactionStatus\n  ) {\n    adminPaymentTransactions(\n      page: $page\n      pageSize: $pageSize\n      gateway: $gateway\n      status: $status\n    ) {\n      items {\n        id\n        orderId\n        gateway\n        method\n        amount\n        processingFee\n        currency\n        status\n        gatewayOrderId\n        gatewayPaymentId\n        capturedAt\n        failedAt\n        createdAt\n      }\n      totalCount\n      totalPages\n      currentPage\n      pageSize\n    }\n  }\n": typeof types.AdminPaymentTransactionsDocument,
    "\n  query ActivePaymentGateways {\n    activePaymentGateways {\n      id\n      gateway\n      displayName\n      description\n      logoUrl\n      isDefault\n      processingFee\n      processingFeeType\n      paymentType\n      supportedMethods\n    }\n  }\n": typeof types.ActivePaymentGatewaysDocument,
    "\n  mutation InitiateCheckout($input: InitiateCheckoutInput!) {\n    initiateCheckout(input: $input) {\n      orderId\n      orderNumber\n      gateway\n      gatewayPayload\n      requiresPayment\n    }\n  }\n": typeof types.InitiateCheckoutDocument,
    "\n  mutation VerifyPayment($input: VerifyPaymentInput!) {\n    verifyPayment(input: $input) {\n      id\n      orderNumber\n      status\n      paymentStatus\n    }\n  }\n": typeof types.VerifyPaymentDocument,
    "\n  fragment ProductImageFields on ProductImage {\n    id\n    productId\n    imageUrl\n    altText\n    displayOrder\n    isPrimary\n    createdAt\n    updatedAt\n  }\n": typeof types.ProductImageFieldsFragmentDoc,
    "\n  \n  fragment ProductSummaryFields on Product {\n    id\n    name\n    slug\n    productType\n    status\n    isFeatured\n    price\n    compareAtPrice\n    priceWithTax\n    createdAt\n    images {\n      ...ProductImageFields\n    }\n  }\n": typeof types.ProductSummaryFieldsFragmentDoc,
    "\n  \n  fragment ProductFields on Product {\n    id\n    storeId\n    categoryId\n    brandId\n    name\n    slug\n    description\n    shortDescription\n    productType\n    status\n    isFeatured\n    isDigital\n    price\n    compareAtPrice\n    costPrice\n    priceWithTax\n    sku\n    weight\n    length\n    width\n    height\n    hsnCode\n    seoTitle\n    seoDescription\n    seoKeywords\n    specifications\n    createdAt\n    updatedAt\n    images {\n      ...ProductImageFields\n    }\n    brand {\n      id\n      name\n      slug\n      logoUrl\n    }\n    category {\n      id\n      name\n      slug\n    }\n    taxId\n    tax {\n      id\n      name\n      rate\n    }\n    tags {\n      id\n      name\n      slug\n    }\n  }\n": typeof types.ProductFieldsFragmentDoc,
    "\n  \n  query GetMyProducts($storeId: ID, $status: ProductStatus) {\n    myProducts(storeId: $storeId, status: $status) {\n      ...ProductFields\n    }\n  }\n": typeof types.GetMyProductsDocument,
    "\n  \n  query GetMyProduct($id: ID!) {\n    myProduct(id: $id) {\n      ...ProductFields\n    }\n  }\n": typeof types.GetMyProductDocument,
    "\n  \n  mutation CreateMyProduct($createProductInput: CreateProductInput!) {\n    createMyProduct(createProductInput: $createProductInput) {\n      ...ProductFields\n    }\n  }\n": typeof types.CreateMyProductDocument,
    "\n  \n  mutation UpdateMyProduct($updateProductInput: UpdateProductInput!) {\n    updateMyProduct(updateProductInput: $updateProductInput) {\n      ...ProductFields\n    }\n  }\n": typeof types.UpdateMyProductDocument,
    "\n  \n  mutation SetMyProductStatus($setProductStatusInput: SetProductStatusInput!) {\n    setMyProductStatus(setProductStatusInput: $setProductStatusInput) {\n      ...ProductFields\n    }\n  }\n": typeof types.SetMyProductStatusDocument,
    "\n  \n  mutation RemoveMyProduct($id: ID!) {\n    removeMyProduct(id: $id) {\n      ...ProductFields\n    }\n  }\n": typeof types.RemoveMyProductDocument,
    "\n  \n  mutation AddMyProductImage($addProductImageInput: AddProductImageInput!) {\n    addMyProductImage(addProductImageInput: $addProductImageInput) {\n      ...ProductImageFields\n    }\n  }\n": typeof types.AddMyProductImageDocument,
    "\n  \n  mutation UpdateMyProductImage(\n    $updateProductImageInput: UpdateProductImageInput!\n  ) {\n    updateMyProductImage(updateProductImageInput: $updateProductImageInput) {\n      ...ProductImageFields\n    }\n  }\n": typeof types.UpdateMyProductImageDocument,
    "\n  \n  mutation RemoveMyProductImage($id: ID!) {\n    removeMyProductImage(id: $id) {\n      ...ProductImageFields\n    }\n  }\n": typeof types.RemoveMyProductImageDocument,
    "\n  mutation ReorderMyProductImages(\n    $reorderProductImagesInput: ReorderProductImagesInput!\n  ) {\n    reorderMyProductImages(\n      reorderProductImagesInput: $reorderProductImagesInput\n    )\n  }\n": typeof types.ReorderMyProductImagesDocument,
    "\n  \n  query GetAdminProducts(\n    $status: ProductStatus\n    $storeId: ID\n    $brandId: ID\n    $categoryId: ID\n  ) {\n    adminProducts(\n      status: $status\n      storeId: $storeId\n      brandId: $brandId\n      categoryId: $categoryId\n    ) {\n      ...ProductFields\n      variants {\n        id\n        sku\n        price\n        status\n        attributes {\n          attributeName\n          value\n        }\n      }\n    }\n  }\n": typeof types.GetAdminProductsDocument,
    "\n  \n  mutation AdminSetProductStatus(\n    $setProductStatusInput: SetProductStatusInput!\n  ) {\n    adminSetProductStatus(setProductStatusInput: $setProductStatusInput) {\n      ...ProductFields\n    }\n  }\n": typeof types.AdminSetProductStatusDocument,
    "\n  \n  query GetPublicProduct($slug: String!) {\n    publicProduct(slug: $slug) {\n      ...ProductFields\n      variants {\n        id\n        sku\n        price\n        priceWithTax\n        compareAtPrice\n        imageUrl\n        status\n        availableQuantity\n        stockState\n        attributes {\n          attributeId\n          attributeValueId\n          attributeName\n          attributeSlug\n          value\n          valueSlug\n        }\n      }\n    }\n  }\n": typeof types.GetPublicProductDocument,
    "\n  \n  query GetPublicProducts(\n    $storeSlug: String\n    $brandSlug: String\n    $tagSlug: String\n    $categorySlug: String\n    $sort: ProductSortOrder\n    $limit: Float\n  ) {\n    publicProducts(\n      storeSlug: $storeSlug\n      brandSlug: $brandSlug\n      tagSlug: $tagSlug\n      categorySlug: $categorySlug\n      sort: $sort\n      limit: $limit\n    ) {\n      ...ProductSummaryFields\n      variants {\n        id\n        price\n        priceWithTax\n        availableQuantity\n      }\n    }\n  }\n": typeof types.GetPublicProductsDocument,
    "\n  \n  query GetPaginatedPublicProducts(\n    $storeSlug: String\n    $brandSlug: String\n    $tagSlug: String\n    $categorySlug: String\n    $minPrice: Float\n    $maxPrice: Float\n    $sort: ProductSortOrder\n    $page: Int\n    $pageSize: Int\n  ) {\n    paginatedPublicProducts(\n      storeSlug: $storeSlug\n      brandSlug: $brandSlug\n      tagSlug: $tagSlug\n      categorySlug: $categorySlug\n      minPrice: $minPrice\n      maxPrice: $maxPrice\n      sort: $sort\n      page: $page\n      pageSize: $pageSize\n    ) {\n      items {\n        ...ProductSummaryFields\n        variants {\n          id\n          price\n          priceWithTax\n          availableQuantity\n        }\n      }\n      totalCount\n      totalPages\n      currentPage\n      pageSize\n    }\n  }\n": typeof types.GetPaginatedPublicProductsDocument,
    "\n  fragment VariantFields on ProductVariant {\n    id\n    productId\n    sku\n    name\n    price\n    compareAtPrice\n    costPrice\n    weight\n    length\n    width\n    height\n    imageUrl\n    status\n    createdAt\n    updatedAt\n    attributes {\n      attributeId\n      attributeValueId\n      attributeName\n      attributeSlug\n      value\n      valueSlug\n    }\n  }\n": typeof types.VariantFieldsFragmentDoc,
    "\n  fragment VariantAxisFields on VariantAxis {\n    attributeId\n    attributeName\n    attributeSlug\n    values {\n      id\n      attributeId\n      value\n      slug\n      displayOrder\n      createdAt\n      updatedAt\n    }\n  }\n": typeof types.VariantAxisFieldsFragmentDoc,
    "\n  \n  query GetMyProductVariants($productId: ID!) {\n    myProductVariants(productId: $productId) {\n      ...VariantFields\n    }\n  }\n": typeof types.GetMyProductVariantsDocument,
    "\n  \n  query GetMyProductVariantAxes($productId: ID!) {\n    myProductVariantAxes(productId: $productId) {\n      ...VariantAxisFields\n    }\n  }\n": typeof types.GetMyProductVariantAxesDocument,
    "\n  \n  mutation SetMyProductVariantAxes($setVariantAxesInput: SetVariantAxesInput!) {\n    setMyProductVariantAxes(setVariantAxesInput: $setVariantAxesInput) {\n      ...VariantAxisFields\n    }\n  }\n": typeof types.SetMyProductVariantAxesDocument,
    "\n  \n  mutation GenerateMyProductVariantMatrix(\n    $generateVariantMatrixInput: GenerateVariantMatrixInput!\n  ) {\n    generateMyProductVariantMatrix(\n      generateVariantMatrixInput: $generateVariantMatrixInput\n    ) {\n      ...VariantFields\n    }\n  }\n": typeof types.GenerateMyProductVariantMatrixDocument,
    "\n  \n  mutation AddMyProductVariant($createVariantInput: CreateVariantInput!) {\n    addMyProductVariant(createVariantInput: $createVariantInput) {\n      ...VariantFields\n    }\n  }\n": typeof types.AddMyProductVariantDocument,
    "\n  \n  mutation UpdateMyProductVariant($updateVariantInput: UpdateVariantInput!) {\n    updateMyProductVariant(updateVariantInput: $updateVariantInput) {\n      ...VariantFields\n    }\n  }\n": typeof types.UpdateMyProductVariantDocument,
    "\n  \n  mutation RemoveMyProductVariant($id: ID!) {\n    removeMyProductVariant(id: $id) {\n      ...VariantFields\n    }\n  }\n": typeof types.RemoveMyProductVariantDocument,
    "\n  mutation BulkUpdateMyProductVariants(\n    $bulkUpdateVariantsInput: BulkUpdateVariantsInput!\n  ) {\n    bulkUpdateMyProductVariants(\n      bulkUpdateVariantsInput: $bulkUpdateVariantsInput\n    )\n  }\n": typeof types.BulkUpdateMyProductVariantsDocument,
    "\n  fragment PayoutAccountFields on SellerPayoutAccount {\n    id\n    sellerId\n    accountType\n    accountHolderName\n    accountNumber\n    ifscCode\n    bankName\n    upiId\n    walletProvider\n    isPrimary\n    isVerified\n    createdAt\n    updatedAt\n  }\n": typeof types.PayoutAccountFieldsFragmentDoc,
    "\n  \n  fragment SellerFields on Seller {\n    id\n    userId\n    legalName\n    displayName\n    businessType\n    dateOfIncorporation\n    registrationNumber\n    panNumber\n    gstin\n    businessEmail\n    businessPhone\n    supportEmail\n    signatoryName\n    signatoryPan\n    signatoryDesignation\n    overallStatus\n    panVerifiedAt\n    gstinVerifiedAt\n    bankVerifiedAt\n    documentsVerifiedAt\n    rejectionReason\n    commissionRate\n    createdAt\n    updatedAt\n    payoutAccounts {\n      ...PayoutAccountFields\n    }\n  }\n": typeof types.SellerFieldsFragmentDoc,
    "\n  \n  query GetMySeller {\n    mySeller {\n      ...SellerFields\n    }\n  }\n": typeof types.GetMySellerDocument,
    "\n  \n  query GetSellers($status: SellerStatus) {\n    sellers(status: $status) {\n      ...SellerFields\n    }\n  }\n": typeof types.GetSellersDocument,
    "\n  \n  query GetSellerUsers($status: SellerListStatus) {\n    sellerUsers(status: $status) {\n      userId\n      name\n      email\n      phone\n      emailVerifiedAt\n      registeredAt\n      status\n      seller {\n        ...SellerFields\n      }\n    }\n  }\n": typeof types.GetSellerUsersDocument,
    "\n  \n  query GetSeller($id: ID!) {\n    seller(id: $id) {\n      ...SellerFields\n    }\n  }\n": typeof types.GetSellerDocument,
    "\n  \n  mutation CreateMySeller($createSellerInput: CreateSellerInput!) {\n    createMySeller(createSellerInput: $createSellerInput) {\n      ...SellerFields\n    }\n  }\n": typeof types.CreateMySellerDocument,
    "\n  \n  mutation UpdateMySeller($updateSellerInput: UpdateSellerInput!) {\n    updateMySeller(updateSellerInput: $updateSellerInput) {\n      ...SellerFields\n    }\n  }\n": typeof types.UpdateMySellerDocument,
    "\n  \n  mutation SubmitMySellerForReview($id: ID!) {\n    submitMySellerForReview(id: $id) {\n      ...SellerFields\n    }\n  }\n": typeof types.SubmitMySellerForReviewDocument,
    "\n  \n  mutation VerifySellerSection(\n    $verifySectionInput: VerifySellerSectionInput!\n  ) {\n    verifySellerSection(verifySectionInput: $verifySectionInput) {\n      ...SellerFields\n    }\n  }\n": typeof types.VerifySellerSectionDocument,
    "\n  \n  mutation SetSellerStatus($setStatusInput: SetSellerStatusInput!) {\n    setSellerStatus(setStatusInput: $setStatusInput) {\n      ...SellerFields\n    }\n  }\n": typeof types.SetSellerStatusDocument,
    "\n  \n  mutation RemoveSeller($id: ID!) {\n    removeSeller(id: $id) {\n      ...SellerFields\n    }\n  }\n": typeof types.RemoveSellerDocument,
    "\n  query GetSiteSettings($group: SettingGroup) {\n    siteSettings(group: $group) {\n      id\n      key\n      value\n      group\n      label\n      description\n      valueType\n      createdAt\n      updatedAt\n    }\n  }\n": typeof types.GetSiteSettingsDocument,
    "\n  mutation UpdateSiteSetting($input: UpdateSiteSettingInput!) {\n    updateSiteSetting(input: $input) {\n      id\n      key\n      value\n      group\n      label\n      description\n      valueType\n      updatedAt\n    }\n  }\n": typeof types.UpdateSiteSettingDocument,
    "\n  fragment SlideItemFields on SlideItem {\n    id\n    sliderId\n    title\n    description\n    link\n    ctaLabel\n    imageUrl\n    tabletImageUrl\n    mobileImageUrl\n    order\n    isEnabled\n    createdAt\n    updatedAt\n  }\n": typeof types.SlideItemFieldsFragmentDoc,
    "\n  \n  fragment SliderFields on Slider {\n    id\n    name\n    key\n    description\n    status\n    config\n    createdAt\n    updatedAt\n    items {\n      ...SlideItemFields\n    }\n  }\n": typeof types.SliderFieldsFragmentDoc,
    "\n  \n  query GetPublicSlider($key: String!) {\n    publicSlider(key: $key) {\n      ...SliderFields\n    }\n  }\n": typeof types.GetPublicSliderDocument,
    "\n  \n  query GetAdminSliders {\n    adminSliders {\n      ...SliderFields\n    }\n  }\n": typeof types.GetAdminSlidersDocument,
    "\n  \n  query GetAdminSlidersPaginated(\n    $status: SliderStatus\n    $page: Int\n    $pageSize: Int\n    $search: String\n  ) {\n    adminSlidersPaginated(\n      status: $status\n      page: $page\n      pageSize: $pageSize\n      search: $search\n    ) {\n      items {\n        ...SliderFields\n      }\n      totalCount\n      totalPages\n      currentPage\n      pageSize\n    }\n  }\n": typeof types.GetAdminSlidersPaginatedDocument,
    "\n  \n  query GetAdminSlider($id: ID!) {\n    adminSlider(id: $id) {\n      ...SliderFields\n    }\n  }\n": typeof types.GetAdminSliderDocument,
    "\n  \n  mutation CreateSlider($createSliderInput: CreateSliderInput!) {\n    createSlider(createSliderInput: $createSliderInput) {\n      ...SliderFields\n    }\n  }\n": typeof types.CreateSliderDocument,
    "\n  \n  mutation UpdateSlider($updateSliderInput: UpdateSliderInput!) {\n    updateSlider(updateSliderInput: $updateSliderInput) {\n      ...SliderFields\n    }\n  }\n": typeof types.UpdateSliderDocument,
    "\n  \n  mutation SetSliderStatus($setSliderStatusInput: SetSliderStatusInput!) {\n    setSliderStatus(setSliderStatusInput: $setSliderStatusInput) {\n      ...SliderFields\n    }\n  }\n": typeof types.SetSliderStatusDocument,
    "\n  \n  mutation RemoveSlider($id: ID!) {\n    removeSlider(id: $id) {\n      ...SliderFields\n    }\n  }\n": typeof types.RemoveSliderDocument,
    "\n  \n  mutation AddSlideItem($addSlideItemInput: AddSlideItemInput!) {\n    addSlideItem(addSlideItemInput: $addSlideItemInput) {\n      ...SlideItemFields\n    }\n  }\n": typeof types.AddSlideItemDocument,
    "\n  \n  mutation UpdateSlideItem($updateSlideItemInput: UpdateSlideItemInput!) {\n    updateSlideItem(updateSlideItemInput: $updateSlideItemInput) {\n      ...SlideItemFields\n    }\n  }\n": typeof types.UpdateSlideItemDocument,
    "\n  \n  mutation RemoveSlideItem($id: ID!) {\n    removeSlideItem(id: $id) {\n      ...SlideItemFields\n    }\n  }\n": typeof types.RemoveSlideItemDocument,
    "\n  mutation ReorderSlideItems(\n    $reorderSlideItemsInput: ReorderSlideItemsInput!\n  ) {\n    reorderSlideItems(reorderSlideItemsInput: $reorderSlideItemsInput)\n  }\n": typeof types.ReorderSlideItemsDocument,
    "\n  fragment WarehouseFields on Warehouse {\n    id\n    storeId\n    name\n    code\n    addressLine1\n    addressLine2\n    city\n    state\n    postalCode\n    countryCode\n    phone\n    isDefault\n    isActive\n    createdAt\n    updatedAt\n  }\n": typeof types.WarehouseFieldsFragmentDoc,
    "\n  \n  fragment StoreFields on Store {\n    id\n    sellerId\n    name\n    slug\n    description\n    logoUrl\n    bannerUrl\n    currencyCode\n    timezone\n    locale\n    supportEmail\n    supportPhone\n    status\n    isFeatured\n    createdAt\n    updatedAt\n    warehouses {\n      ...WarehouseFields\n    }\n  }\n": typeof types.StoreFieldsFragmentDoc,
    "\n  \n  query GetMyStores {\n    myStores {\n      ...StoreFields\n    }\n  }\n": typeof types.GetMyStoresDocument,
    "\n  \n  query GetMyStore($id: ID!) {\n    myStore(id: $id) {\n      ...StoreFields\n    }\n  }\n": typeof types.GetMyStoreDocument,
    "\n  \n  mutation CreateMyStore($createStoreInput: CreateStoreInput!) {\n    createMyStore(createStoreInput: $createStoreInput) {\n      ...StoreFields\n    }\n  }\n": typeof types.CreateMyStoreDocument,
    "\n  \n  mutation UpdateMyStore($updateStoreInput: UpdateStoreInput!) {\n    updateMyStore(updateStoreInput: $updateStoreInput) {\n      ...StoreFields\n    }\n  }\n": typeof types.UpdateMyStoreDocument,
    "\n  \n  mutation SubmitMyStoreForReview($id: ID!) {\n    submitMyStoreForReview(id: $id) {\n      ...StoreFields\n    }\n  }\n": typeof types.SubmitMyStoreForReviewDocument,
    "\n  \n  mutation RemoveMyStore($id: ID!) {\n    removeMyStore(id: $id) {\n      ...StoreFields\n    }\n  }\n": typeof types.RemoveMyStoreDocument,
    "\n  \n  mutation CreateMyWarehouse($createWarehouseInput: CreateWarehouseInput!) {\n    createMyWarehouse(createWarehouseInput: $createWarehouseInput) {\n      ...WarehouseFields\n    }\n  }\n": typeof types.CreateMyWarehouseDocument,
    "\n  \n  mutation UpdateMyWarehouse($updateWarehouseInput: UpdateWarehouseInput!) {\n    updateMyWarehouse(updateWarehouseInput: $updateWarehouseInput) {\n      ...WarehouseFields\n    }\n  }\n": typeof types.UpdateMyWarehouseDocument,
    "\n  \n  mutation RemoveMyWarehouse($id: ID!) {\n    removeMyWarehouse(id: $id) {\n      ...WarehouseFields\n    }\n  }\n": typeof types.RemoveMyWarehouseDocument,
    "\n  \n  query GetStores($status: StoreStatus) {\n    stores(status: $status) {\n      ...StoreFields\n    }\n  }\n": typeof types.GetStoresDocument,
    "\n  \n  mutation SetStoreStatus($setStoreStatusInput: SetStoreStatusInput!) {\n    setStoreStatus(setStoreStatusInput: $setStoreStatusInput) {\n      ...StoreFields\n    }\n  }\n": typeof types.SetStoreStatusDocument,
    "\n  \n  mutation AdminRemoveStore($id: ID!) {\n    adminRemoveStore(id: $id) {\n      ...StoreFields\n    }\n  }\n": typeof types.AdminRemoveStoreDocument,
    "\n  \n  query GetPublicStore($slug: String!) {\n    publicStore(slug: $slug) {\n      ...StoreFields\n    }\n  }\n": typeof types.GetPublicStoreDocument,
    "\n  fragment TagFields on Tag {\n    id\n    name\n    slug\n    description\n    status\n    isFeatured\n    createdAt\n    updatedAt\n  }\n": typeof types.TagFieldsFragmentDoc,
    "\n  \n  query GetAdminTags($status: TagStatus) {\n    adminTags(status: $status) {\n      ...TagFields\n    }\n  }\n": typeof types.GetAdminTagsDocument,
    "\n  \n  query GetTags($status: TagStatus, $featuredOnly: Boolean) {\n    tags(status: $status, featuredOnly: $featuredOnly) {\n      ...TagFields\n    }\n  }\n": typeof types.GetTagsDocument,
    "\n  \n  query GetTag($id: ID!) {\n    tag(id: $id) {\n      ...TagFields\n    }\n  }\n": typeof types.GetTagDocument,
    "\n  \n  query GetPublicTag($slug: String!) {\n    publicTag(slug: $slug) {\n      ...TagFields\n    }\n  }\n": typeof types.GetPublicTagDocument,
    "\n  \n  mutation CreateTag($createTagInput: CreateTagInput!) {\n    createTag(createTagInput: $createTagInput) {\n      ...TagFields\n    }\n  }\n": typeof types.CreateTagDocument,
    "\n  \n  mutation UpdateTag($updateTagInput: UpdateTagInput!) {\n    updateTag(updateTagInput: $updateTagInput) {\n      ...TagFields\n    }\n  }\n": typeof types.UpdateTagDocument,
    "\n  \n  mutation SetTagStatus($setTagStatusInput: SetTagStatusInput!) {\n    setTagStatus(setTagStatusInput: $setTagStatusInput) {\n      ...TagFields\n    }\n  }\n": typeof types.SetTagStatusDocument,
    "\n  \n  mutation RemoveTag($id: ID!) {\n    removeTag(id: $id) {\n      ...TagFields\n    }\n  }\n": typeof types.RemoveTagDocument,
    "\n  fragment TaxFields on Tax {\n    id\n    name\n    rate\n    description\n    isActive\n    displayOrder\n    createdAt\n    updatedAt\n  }\n": typeof types.TaxFieldsFragmentDoc,
    "\n  \n  query GetTaxes {\n    taxes {\n      ...TaxFields\n    }\n  }\n": typeof types.GetTaxesDocument,
    "\n  \n  query GetAdminTaxes {\n    adminTaxes {\n      ...TaxFields\n    }\n  }\n": typeof types.GetAdminTaxesDocument,
    "\n  \n  query GetAdminTaxesPaginated(\n    $page: Int\n    $pageSize: Int\n    $search: String\n  ) {\n    adminTaxesPaginated(page: $page, pageSize: $pageSize, search: $search) {\n      items {\n        ...TaxFields\n      }\n      totalCount\n      totalPages\n      currentPage\n      pageSize\n    }\n  }\n": typeof types.GetAdminTaxesPaginatedDocument,
    "\n  \n  query GetTax($id: ID!) {\n    tax(id: $id) {\n      ...TaxFields\n    }\n  }\n": typeof types.GetTaxDocument,
    "\n  \n  mutation CreateTax($createTaxInput: CreateTaxInput!) {\n    createTax(createTaxInput: $createTaxInput) {\n      ...TaxFields\n    }\n  }\n": typeof types.CreateTaxDocument,
    "\n  \n  mutation UpdateTax($updateTaxInput: UpdateTaxInput!) {\n    updateTax(updateTaxInput: $updateTaxInput) {\n      ...TaxFields\n    }\n  }\n": typeof types.UpdateTaxDocument,
    "\n  \n  mutation RemoveTax($id: ID!) {\n    removeTax(id: $id) {\n      ...TaxFields\n    }\n  }\n": typeof types.RemoveTaxDocument,
    "\n  \n  fragment WishlistFields on Wishlist {\n    id\n    customerId\n    name\n    isDefault\n    isPublic\n    itemCount\n    items {\n      id\n      productId\n      variantId\n      createdAt\n      product {\n        ...ProductFields\n      }\n    }\n    createdAt\n    updatedAt\n  }\n": typeof types.WishlistFieldsFragmentDoc,
    "\n  \n  query GetMyWishlist {\n    myWishlist {\n      ...WishlistFields\n    }\n  }\n": typeof types.GetMyWishlistDocument,
    "\n  query GetMyWishlistProductIds {\n    myWishlistProductIds\n  }\n": typeof types.GetMyWishlistProductIdsDocument,
    "\n  \n  mutation AddToWishlist($input: ToggleWishlistInput!) {\n    addToWishlist(input: $input) {\n      ...WishlistFields\n    }\n  }\n": typeof types.AddToWishlistDocument,
    "\n  \n  mutation RemoveFromWishlist($input: ToggleWishlistInput!) {\n    removeFromWishlist(input: $input) {\n      ...WishlistFields\n    }\n  }\n": typeof types.RemoveFromWishlistDocument,
    "\n  \n  mutation ClearWishlist {\n    clearWishlist {\n      ...WishlistFields\n    }\n  }\n": typeof types.ClearWishlistDocument,
    "\n  query GetAdminThemeSSR {\n    adminTheme {\n      id\n      primaryLight\n      primaryDark\n      accentLight\n      accentDark\n      sidebarLight\n      sidebarDark\n      destructiveLight\n      destructiveDark\n      radius\n      fontFamily\n      updatedAt\n      updatedById\n    }\n  }\n": typeof types.GetAdminThemeSsrDocument,
};
const documents: Documents = {
    "\n  \n  query GetMyProfile {\n    myProfile {\n      ...AdminCustomerFields\n    }\n  }\n": types.GetMyProfileDocument,
    "\n  \n  mutation UpdateMyProfile($input: UpdateMyProfileInput!) {\n    updateMyProfile(input: $input) {\n      ...AdminCustomerFields\n    }\n  }\n": types.UpdateMyProfileDocument,
    "\n  fragment AddressFields on Address {\n    id\n    userId\n    type\n    label\n    firstName\n    lastName\n    phone\n    addressLine1\n    addressLine2\n    city\n    state\n    postalCode\n    countryCode\n    isDefault\n  }\n": types.AddressFieldsFragmentDoc,
    "\n  \n  query GetMyAddresses {\n    myAddresses {\n      ...AddressFields\n    }\n  }\n": types.GetMyAddressesDocument,
    "\n  \n  mutation AddMyAddress($input: CreateAddressInput!) {\n    addMyAddress(input: $input) {\n      ...AddressFields\n    }\n  }\n": types.AddMyAddressDocument,
    "\n  \n  mutation UpdateMyAddress($input: UpdateAddressInput!) {\n    updateMyAddress(input: $input) {\n      ...AddressFields\n    }\n  }\n": types.UpdateMyAddressDocument,
    "\n  \n  mutation SetMyDefaultAddress($id: ID!) {\n    setMyDefaultAddress(id: $id) {\n      ...AddressFields\n    }\n  }\n": types.SetMyDefaultAddressDocument,
    "\n  \n  mutation RemoveMyAddress($id: ID!) {\n    removeMyAddress(id: $id) {\n      ...AddressFields\n    }\n  }\n": types.RemoveMyAddressDocument,
    "\n  fragment AdminThemeFields on AdminTheme {\n    id\n    primaryLight\n    primaryDark\n    accentLight\n    accentDark\n    sidebarLight\n    sidebarDark\n    destructiveLight\n    destructiveDark\n    radius\n    fontFamily\n    updatedAt\n    updatedById\n  }\n": types.AdminThemeFieldsFragmentDoc,
    "\n  \n  query GetAdminTheme {\n    adminTheme {\n      ...AdminThemeFields\n    }\n  }\n": types.GetAdminThemeDocument,
    "\n  \n  mutation UpdateAdminTheme(\n    $updateAdminThemeInput: UpdateAdminThemeInput!\n  ) {\n    updateAdminTheme(updateAdminThemeInput: $updateAdminThemeInput) {\n      ...AdminThemeFields\n    }\n  }\n": types.UpdateAdminThemeDocument,
    "\n  \n  mutation ResetAdminTheme {\n    resetAdminTheme {\n      ...AdminThemeFields\n    }\n  }\n": types.ResetAdminThemeDocument,
    "\n  fragment AttributeValueFields on ProductAttributeValue {\n    id\n    attributeId\n    value\n    slug\n    displayOrder\n    createdAt\n    updatedAt\n  }\n": types.AttributeValueFieldsFragmentDoc,
    "\n  \n  fragment AttributeFields on ProductAttribute {\n    id\n    name\n    slug\n    description\n    type\n    isVariantAttribute\n    createdAt\n    updatedAt\n    values {\n      ...AttributeValueFields\n    }\n  }\n": types.AttributeFieldsFragmentDoc,
    "\n  \n  query GetAdminAttributes($type: AttributeType) {\n    adminAttributes(type: $type) {\n      ...AttributeFields\n    }\n  }\n": types.GetAdminAttributesDocument,
    "\n  \n  query GetAttributes($type: AttributeType, $variantOnly: Boolean) {\n    attributes(type: $type, variantOnly: $variantOnly) {\n      ...AttributeFields\n    }\n  }\n": types.GetAttributesDocument,
    "\n  \n  query GetAttribute($id: ID!) {\n    attribute(id: $id) {\n      ...AttributeFields\n    }\n  }\n": types.GetAttributeDocument,
    "\n  \n  mutation CreateAttribute($createAttributeInput: CreateAttributeInput!) {\n    createAttribute(createAttributeInput: $createAttributeInput) {\n      ...AttributeFields\n    }\n  }\n": types.CreateAttributeDocument,
    "\n  \n  mutation UpdateAttribute($updateAttributeInput: UpdateAttributeInput!) {\n    updateAttribute(updateAttributeInput: $updateAttributeInput) {\n      ...AttributeFields\n    }\n  }\n": types.UpdateAttributeDocument,
    "\n  \n  mutation RemoveAttribute($id: ID!) {\n    removeAttribute(id: $id) {\n      ...AttributeFields\n    }\n  }\n": types.RemoveAttributeDocument,
    "\n  \n  mutation CreateAttributeValue(\n    $createAttributeValueInput: CreateAttributeValueInput!\n  ) {\n    createAttributeValue(createAttributeValueInput: $createAttributeValueInput) {\n      ...AttributeValueFields\n    }\n  }\n": types.CreateAttributeValueDocument,
    "\n  \n  mutation UpdateAttributeValue(\n    $updateAttributeValueInput: UpdateAttributeValueInput!\n  ) {\n    updateAttributeValue(updateAttributeValueInput: $updateAttributeValueInput) {\n      ...AttributeValueFields\n    }\n  }\n": types.UpdateAttributeValueDocument,
    "\n  \n  mutation RemoveAttributeValue($id: ID!) {\n    removeAttributeValue(id: $id) {\n      ...AttributeValueFields\n    }\n  }\n": types.RemoveAttributeValueDocument,
    "\n  mutation ReorderAttributeValues(\n    $reorderAttributeValuesInput: ReorderAttributeValuesInput!\n  ) {\n    reorderAttributeValues(\n      reorderAttributeValuesInput: $reorderAttributeValuesInput\n    )\n  }\n": types.ReorderAttributeValuesDocument,
    "\n  fragment BrandFields on Brand {\n    id\n    name\n    slug\n    description\n    logoUrl\n    bannerUrl\n    websiteUrl\n    countryCode\n    foundedYear\n    status\n    isFeatured\n    createdAt\n    updatedAt\n  }\n": types.BrandFieldsFragmentDoc,
    "\n  \n  query GetAdminBrands($status: BrandStatus) {\n    adminBrands(status: $status) {\n      ...BrandFields\n    }\n  }\n": types.GetAdminBrandsDocument,
    "\n  \n  query GetBrands($status: BrandStatus, $featuredOnly: Boolean) {\n    brands(status: $status, featuredOnly: $featuredOnly) {\n      ...BrandFields\n    }\n  }\n": types.GetBrandsDocument,
    "\n  \n  query GetBrand($id: ID!) {\n    brand(id: $id) {\n      ...BrandFields\n    }\n  }\n": types.GetBrandDocument,
    "\n  \n  query GetPublicBrand($slug: String!) {\n    publicBrand(slug: $slug) {\n      ...BrandFields\n    }\n  }\n": types.GetPublicBrandDocument,
    "\n  \n  mutation CreateBrand($createBrandInput: CreateBrandInput!) {\n    createBrand(createBrandInput: $createBrandInput) {\n      ...BrandFields\n    }\n  }\n": types.CreateBrandDocument,
    "\n  \n  mutation UpdateBrand($updateBrandInput: UpdateBrandInput!) {\n    updateBrand(updateBrandInput: $updateBrandInput) {\n      ...BrandFields\n    }\n  }\n": types.UpdateBrandDocument,
    "\n  \n  mutation SetBrandStatus($setBrandStatusInput: SetBrandStatusInput!) {\n    setBrandStatus(setBrandStatusInput: $setBrandStatusInput) {\n      ...BrandFields\n    }\n  }\n": types.SetBrandStatusDocument,
    "\n  \n  mutation RemoveBrand($id: ID!) {\n    removeBrand(id: $id) {\n      ...BrandFields\n    }\n  }\n": types.RemoveBrandDocument,
    "\n  \n  fragment CartFields on Cart {\n    id\n    customerId\n    itemCount\n    subtotal\n    needsReview\n    items {\n      id\n      productId\n      variantId\n      quantity\n      unitPriceSnapshot\n      unitPriceCurrent\n      priceChanged\n      lineTotal\n      availableQuantity\n      stockState\n      createdAt\n      product {\n        ...ProductFields\n      }\n      variant {\n        id\n        sku\n        name\n        price\n        priceWithTax\n        imageUrl\n        attributes {\n          attributeId\n          attributeValueId\n          attributeName\n          attributeSlug\n          value\n          valueSlug\n        }\n      }\n    }\n    createdAt\n    updatedAt\n  }\n": types.CartFieldsFragmentDoc,
    "\n  \n  query GetMyCart {\n    myCart {\n      ...CartFields\n    }\n  }\n": types.GetMyCartDocument,
    "\n  query GetMyCartItemCount {\n    myCartItemCount\n  }\n": types.GetMyCartItemCountDocument,
    "\n  \n  mutation AddToCart($input: AddToCartInput!) {\n    addToCart(input: $input) {\n      ...CartFields\n    }\n  }\n": types.AddToCartDocument,
    "\n  \n  mutation UpdateCartItemQty($input: UpdateCartItemQtyInput!) {\n    updateCartItemQty(input: $input) {\n      ...CartFields\n    }\n  }\n": types.UpdateCartItemQtyDocument,
    "\n  \n  mutation RemoveFromCart($input: RemoveCartItemInput!) {\n    removeFromCart(input: $input) {\n      ...CartFields\n    }\n  }\n": types.RemoveFromCartDocument,
    "\n  \n  mutation ClearCart {\n    clearCart {\n      ...CartFields\n    }\n  }\n": types.ClearCartDocument,
    "\n  fragment CategoryFields on Category {\n    id\n    name\n    slug\n    description\n    parentId\n    imageUrl\n    iconUrl\n    displayOrder\n    isActive\n    createdAt\n    updatedAt\n  }\n": types.CategoryFieldsFragmentDoc,
    "\n  \n  query GetCategories {\n    categories {\n      ...CategoryFields\n    }\n  }\n": types.GetCategoriesDocument,
    "\n  query GetShopFilterCategories {\n    shopFilterCategories {\n      id\n      name\n      slug\n      displayOrder\n      productCount\n    }\n  }\n": types.GetShopFilterCategoriesDocument,
    "\n  \n  query GetAdminCategoriesPaginated(\n    $page: Int\n    $pageSize: Int\n    $search: String\n  ) {\n    adminCategoriesPaginated(page: $page, pageSize: $pageSize, search: $search) {\n      items {\n        ...CategoryFields\n      }\n      totalCount\n      totalPages\n      currentPage\n      pageSize\n    }\n  }\n": types.GetAdminCategoriesPaginatedDocument,
    "\n  query GetCategoryChildren($parentId: ID, $search: String, $limit: Int) {\n    categoryChildren(parentId: $parentId, search: $search, limit: $limit) {\n      id\n      name\n      slug\n      parentId\n      hasChildren\n    }\n  }\n": types.GetCategoryChildrenDocument,
    "\n  query GetCategoryAncestors($id: ID!) {\n    categoryAncestors(id: $id) {\n      id\n      name\n      slug\n      parentId\n      hasChildren\n    }\n  }\n": types.GetCategoryAncestorsDocument,
    "\n  \n  query GetCategory($id: ID!) {\n    category(id: $id) {\n      ...CategoryFields\n    }\n  }\n": types.GetCategoryDocument,
    "\n  \n  query GetPublicCategoryBySlug($slug: String!) {\n    publicCategoryBySlug(slug: $slug) {\n      ...CategoryFields\n      children {\n        ...CategoryFields\n      }\n    }\n  }\n": types.GetPublicCategoryBySlugDocument,
    "\n  \n  mutation CreateCategory($createCategoryInput: CreateCategoryInput!) {\n    createCategory(createCategoryInput: $createCategoryInput) {\n      ...CategoryFields\n    }\n  }\n": types.CreateCategoryDocument,
    "\n  \n  mutation UpdateCategory($updateCategoryInput: UpdateCategoryInput!) {\n    updateCategory(updateCategoryInput: $updateCategoryInput) {\n      ...CategoryFields\n    }\n  }\n": types.UpdateCategoryDocument,
    "\n  \n  mutation RemoveCategory($id: ID!) {\n    removeCategory(id: $id) {\n      ...CategoryFields\n    }\n  }\n": types.RemoveCategoryDocument,
    "\n  mutation UpdateCategoryTree($input: UpdateCategoryTreeInput!) {\n    updateCategoryTree(updateCategoryTreeInput: $input)\n  }\n": types.UpdateCategoryTreeDocument,
    "\n  fragment CouponFields on Coupon {\n    id\n    storeId\n    code\n    name\n    description\n    discountType\n    discountValue\n    minimumPurchaseAmount\n    maximumDiscountAmount\n    usageLimit\n    usageLimitPerUser\n    validFrom\n    validUntil\n    isActive\n    redemptionCount\n    createdAt\n    updatedAt\n  }\n": types.CouponFieldsFragmentDoc,
    "\n  query GetAdminCoupons($search: String, $status: String) {\n    adminCoupons(search: $search, status: $status) {\n      ...CouponFields\n    }\n  }\n": types.GetAdminCouponsDocument,
    "\n  query GetAdminCoupon($id: ID!) {\n    adminCoupon(id: $id) {\n      ...CouponFields\n    }\n  }\n": types.GetAdminCouponDocument,
    "\n  mutation CreateCoupon($input: CreateCouponInput!) {\n    createCoupon(input: $input) {\n      ...CouponFields\n    }\n  }\n": types.CreateCouponDocument,
    "\n  mutation UpdateCoupon($input: UpdateCouponInput!) {\n    updateCoupon(input: $input) {\n      ...CouponFields\n    }\n  }\n": types.UpdateCouponDocument,
    "\n  mutation RemoveCoupon($id: ID!) {\n    removeCoupon(id: $id) {\n      id\n    }\n  }\n": types.RemoveCouponDocument,
    "\n  mutation ValidateCoupon($input: ValidateCouponInput!) {\n    validateCoupon(input: $input) {\n      isValid\n      reason\n      discountAmount\n      subtotal\n      subtotalInclTax\n      discountInclTax\n      customerTotal\n      coupon {\n        ...CouponFields\n      }\n    }\n  }\n": types.ValidateCouponDocument,
    "\n  fragment AdminCustomerFields on AdminCustomer {\n    id\n    userId\n    name\n    email\n    phone\n    status\n    emailVerifiedAt\n    lastLoginAt\n    userCreatedAt\n    marketingOptIn\n    preferredCurrency\n    createdAt\n    updatedAt\n    deletedAt\n  }\n": types.AdminCustomerFieldsFragmentDoc,
    "\n  \n  query GetAdminCustomers(\n    $status: String\n    $search: String\n    $includeDeleted: Boolean\n    $page: Int\n    $pageSize: Int\n  ) {\n    adminCustomers(\n      status: $status\n      search: $search\n      includeDeleted: $includeDeleted\n      page: $page\n      pageSize: $pageSize\n    ) {\n      items {\n        ...AdminCustomerFields\n      }\n      totalCount\n      totalPages\n      currentPage\n      pageSize\n    }\n  }\n": types.GetAdminCustomersDocument,
    "\n  \n  query GetAdminCustomer($id: ID!) {\n    adminCustomer(id: $id) {\n      ...AdminCustomerFields\n    }\n  }\n": types.GetAdminCustomerDocument,
    "\n  \n  mutation UpdateCustomer($input: UpdateCustomerInput!) {\n    updateCustomer(input: $input) {\n      ...AdminCustomerFields\n    }\n  }\n": types.UpdateCustomerDocument,
    "\n  \n  mutation SoftDeleteCustomer($id: ID!) {\n    softDeleteCustomer(id: $id) {\n      ...AdminCustomerFields\n    }\n  }\n": types.SoftDeleteCustomerDocument,
    "\n  \n  mutation RestoreCustomer($id: ID!) {\n    restoreCustomer(id: $id) {\n      ...AdminCustomerFields\n    }\n  }\n": types.RestoreCustomerDocument,
    "\n  query GetEmailSetting {\n    emailSetting {\n      id\n      mailer\n      host\n      port\n      username\n      encryption\n      senderName\n      senderEmail\n      localDomain\n      isConfigured\n      hasPassword\n      updatedAt\n    }\n  }\n": types.GetEmailSettingDocument,
    "\n  mutation UpdateEmailSetting($input: UpdateEmailSettingInput!) {\n    updateEmailSetting(input: $input) {\n      id\n      mailer\n      host\n      port\n      username\n      encryption\n      senderName\n      senderEmail\n      localDomain\n      isConfigured\n      hasPassword\n      updatedAt\n    }\n  }\n": types.UpdateEmailSettingDocument,
    "\n  query GetEmailTemplates {\n    emailTemplates {\n      id\n      key\n      name\n      description\n      category\n      subject\n      variables\n      isEnabled\n      isSystem\n      updatedAt\n    }\n  }\n": types.GetEmailTemplatesDocument,
    "\n  query GetEmailTemplate($id: ID!) {\n    emailTemplate(id: $id) {\n      id\n      key\n      name\n      description\n      category\n      subject\n      htmlBody\n      textBody\n      variables\n      isEnabled\n      isSystem\n      updatedAt\n    }\n  }\n": types.GetEmailTemplateDocument,
    "\n  mutation UpdateEmailTemplate($input: UpdateEmailTemplateInput!) {\n    updateEmailTemplate(input: $input) {\n      id\n      key\n      name\n      description\n      category\n      subject\n      htmlBody\n      textBody\n      variables\n      isEnabled\n      isSystem\n      updatedAt\n    }\n  }\n": types.UpdateEmailTemplateDocument,
    "\n  mutation SendTestEmail($input: SendTestEmailInput!) {\n    sendTestEmail(input: $input) {\n      success\n      message\n    }\n  }\n": types.SendTestEmailDocument,
    "\n  fragment ImageFields on Image {\n    id\n    provider\n    externalId\n    url\n    format\n    width\n    height\n    sizeBytes\n    ownerType\n    ownerId\n    purpose\n    alt\n    createdAt\n  }\n": types.ImageFieldsFragmentDoc,
    "\n  mutation PresignImageUpload($presignUploadInput: PresignUploadInput!) {\n    presignImageUpload(presignUploadInput: $presignUploadInput) {\n      uploadUrl\n      method\n      fields\n      externalId\n      expiresIn\n      provider\n    }\n  }\n": types.PresignImageUploadDocument,
    "\n  \n  mutation ConfirmImageUpload($confirmUploadInput: ConfirmUploadInput!) {\n    confirmImageUpload(confirmUploadInput: $confirmUploadInput) {\n      ...ImageFields\n    }\n  }\n": types.ConfirmImageUploadDocument,
    "\n  \n  mutation DeleteImage($id: ID!) {\n    deleteImage(id: $id) {\n      ...ImageFields\n    }\n  }\n": types.DeleteImageDocument,
    "\n  fragment InventoryFields on Inventory {\n    id\n    variantId\n    warehouseId\n    quantityAvailable\n    quantityReserved\n    quantityOnHand\n    reorderPoint\n    reorderQuantity\n    lastCountedAt\n    createdAt\n    updatedAt\n    stockState\n    warehouse {\n      id\n      name\n      code\n      isDefault\n      storeId\n    }\n    variant {\n      id\n      productId\n      sku\n      imageUrl\n      status\n      attributes {\n        attributeId\n        attributeValueId\n        attributeName\n        attributeSlug\n        value\n        valueSlug\n      }\n    }\n    product {\n      id\n      name\n      slug\n      storeId\n    }\n  }\n": types.InventoryFieldsFragmentDoc,
    "\n  fragment InventoryMovementFields on InventoryMovement {\n    id\n    inventoryId\n    variantId\n    warehouseId\n    movementType\n    quantityChange\n    quantityBefore\n    quantityAfter\n    referenceType\n    referenceId\n    notes\n    createdById\n    createdAt\n  }\n": types.InventoryMovementFieldsFragmentDoc,
    "\n  \n  query GetMyInventory(\n    $storeId: ID\n    $warehouseId: ID\n    $productId: ID\n    $lowStockOnly: Boolean\n    $search: String\n  ) {\n    myInventory(\n      storeId: $storeId\n      warehouseId: $warehouseId\n      productId: $productId\n      lowStockOnly: $lowStockOnly\n      search: $search\n    ) {\n      ...InventoryFields\n    }\n  }\n": types.GetMyInventoryDocument,
    "\n  \n  query GetMyInventoryByVariant($variantId: ID!, $warehouseId: ID) {\n    myInventoryByVariant(variantId: $variantId, warehouseId: $warehouseId) {\n      ...InventoryFields\n    }\n  }\n": types.GetMyInventoryByVariantDocument,
    "\n  \n  query GetMyInventoryMovements(\n    $variantId: ID\n    $warehouseId: ID\n    $limit: Int\n  ) {\n    myInventoryMovements(\n      variantId: $variantId\n      warehouseId: $warehouseId\n      limit: $limit\n    ) {\n      ...InventoryMovementFields\n    }\n  }\n": types.GetMyInventoryMovementsDocument,
    "\n  \n  query GetAdminInventoryByProduct($productId: ID!) {\n    adminInventoryByProduct(productId: $productId) {\n      ...InventoryFields\n    }\n  }\n": types.GetAdminInventoryByProductDocument,
    "\n  \n  mutation AdjustMyInventory($adjustInventoryInput: AdjustInventoryInput!) {\n    adjustMyInventory(adjustInventoryInput: $adjustInventoryInput) {\n      ...InventoryFields\n    }\n  }\n": types.AdjustMyInventoryDocument,
    "\n  \n  mutation SetMyReorderPoint($setReorderPointInput: SetReorderPointInput!) {\n    setMyReorderPoint(setReorderPointInput: $setReorderPointInput) {\n      ...InventoryFields\n    }\n  }\n": types.SetMyReorderPointDocument,
    "\n  fragment MenuFields on Menu {\n    id\n    name\n    location\n    isActive\n    items\n    createdAt\n    updatedAt\n  }\n": types.MenuFieldsFragmentDoc,
    "\n  \n  query GetPublicMenu($location: MenuLocation!) {\n    publicMenu(location: $location) {\n      ...MenuFields\n    }\n  }\n": types.GetPublicMenuDocument,
    "\n  \n  query GetAdminMenus {\n    adminMenus {\n      ...MenuFields\n    }\n  }\n": types.GetAdminMenusDocument,
    "\n  \n  query GetAdminMenu($location: MenuLocation!) {\n    adminMenu(location: $location) {\n      ...MenuFields\n    }\n  }\n": types.GetAdminMenuDocument,
    "\n  \n  mutation UpsertMenu($upsertMenuInput: UpsertMenuInput!) {\n    upsertMenu(upsertMenuInput: $upsertMenuInput) {\n      ...MenuFields\n    }\n  }\n": types.UpsertMenuDocument,
    "\n  \n  mutation SetMenuActive($location: MenuLocation!, $isActive: Boolean!) {\n    setMenuActive(location: $location, isActive: $isActive) {\n      ...MenuFields\n    }\n  }\n": types.SetMenuActiveDocument,
    "\n  \n  mutation RemoveMenu($location: MenuLocation!) {\n    removeMenu(location: $location) {\n      ...MenuFields\n    }\n  }\n": types.RemoveMenuDocument,
    "\n  fragment NewsletterFields on NewsletterSubscription {\n    id\n    email\n    source\n    status\n    unsubscribedAt\n    createdAt\n    updatedAt\n  }\n": types.NewsletterFieldsFragmentDoc,
    "\n  mutation SubscribeToNewsletter($input: SubscribeNewsletterInput!) {\n    subscribeToNewsletter(input: $input) {\n      ok\n      message\n    }\n  }\n": types.SubscribeToNewsletterDocument,
    "\n  \n  query GetAdminNewsletterSubscriptions(\n    $status: NewsletterStatus\n    $page: Int\n    $pageSize: Int\n    $search: String\n  ) {\n    adminNewsletterSubscriptions(\n      status: $status\n      page: $page\n      pageSize: $pageSize\n      search: $search\n    ) {\n      items {\n        ...NewsletterFields\n      }\n      totalCount\n      totalPages\n      currentPage\n      pageSize\n    }\n  }\n": types.GetAdminNewsletterSubscriptionsDocument,
    "\n  \n  mutation UnsubscribeNewsletter($id: ID!) {\n    unsubscribeNewsletter(id: $id) {\n      ...NewsletterFields\n    }\n  }\n": types.UnsubscribeNewsletterDocument,
    "\n  fragment OrderAddressFields on OrderAddressSnapshot {\n    id\n    firstName\n    lastName\n    phone\n    addressLine1\n    addressLine2\n    city\n    state\n    postalCode\n    countryCode\n  }\n": types.OrderAddressFieldsFragmentDoc,
    "\n  fragment OrderItemFields on OrderItem {\n    id\n    orderId\n    sellerOrderId\n    productId\n    variantId\n    storeId\n    sku\n    name\n    variantName\n    quantity\n    unitPrice\n    totalPrice\n    taxAmount\n    discountAmount\n    attributesSnapshot {\n      attributeName\n      value\n    }\n    imageUrlSnapshot\n    createdAt\n  }\n": types.OrderItemFieldsFragmentDoc,
    "\n  fragment StatusHistoryFields on OrderStatusHistoryEntry {\n    id\n    fromStatus\n    toStatus\n    changedById\n    notes\n    createdAt\n  }\n": types.StatusHistoryFieldsFragmentDoc,
    "\n  \n  \n  \n  fragment SellerOrderFields on SellerOrder {\n    id\n    orderId\n    sellerId\n    storeId\n    orderNumber\n    status\n    paymentStatus\n    payoutStatus\n    subtotal\n    taxAmount\n    shippingAmount\n    discountAmount\n    commissionAmount\n    payoutAmount\n    currencyCode\n    packedAt\n    shippedAt\n    deliveredAt\n    cancelledAt\n    createdAt\n    updatedAt\n    itemCount\n    storeName\n    items {\n      ...OrderItemFields\n    }\n    statusHistory {\n      ...StatusHistoryFields\n    }\n    parentOrderNumber\n    shippingAddress {\n      ...OrderAddressFields\n    }\n    customerName\n  }\n": types.SellerOrderFieldsFragmentDoc,
    "\n  \n  \n  \n  \n  fragment OrderFields on Order {\n    id\n    orderNumber\n    customerId\n    status\n    paymentStatus\n    paymentMethod\n    subtotal\n    taxAmount\n    shippingAmount\n    discountAmount\n    totalAmount\n    currencyCode\n    customerNotes\n    placedAt\n    cancelledAt\n    deliveredAt\n    createdAt\n    updatedAt\n    itemCount\n    items {\n      ...OrderItemFields\n    }\n    sellerOrders {\n      ...SellerOrderFields\n    }\n    statusHistory {\n      ...StatusHistoryFields\n    }\n    shippingAddress {\n      ...OrderAddressFields\n    }\n    billingAddress {\n      ...OrderAddressFields\n    }\n  }\n": types.OrderFieldsFragmentDoc,
    "\n  \n  query GetMyOrders($status: OrderStatus, $page: Int, $pageSize: Int) {\n    myOrders(status: $status, page: $page, pageSize: $pageSize) {\n      items {\n        ...OrderFields\n      }\n      totalCount\n      totalPages\n      currentPage\n      pageSize\n    }\n  }\n": types.GetMyOrdersDocument,
    "\n  \n  query GetMyOrder($id: ID!) {\n    myOrder(id: $id) {\n      ...OrderFields\n    }\n  }\n": types.GetMyOrderDocument,
    "\n  \n  mutation PlaceOrder($input: PlaceOrderInput!) {\n    placeOrder(input: $input) {\n      ...OrderFields\n    }\n  }\n": types.PlaceOrderDocument,
    "\n  \n  mutation CancelMyOrder($id: ID!, $notes: String) {\n    cancelMyOrder(id: $id, notes: $notes) {\n      ...OrderFields\n    }\n  }\n": types.CancelMyOrderDocument,
    "\n  \n  query GetMySellerOrders($status: OrderStatus, $page: Int, $pageSize: Int) {\n    mySellerOrders(status: $status, page: $page, pageSize: $pageSize) {\n      items {\n        ...SellerOrderFields\n      }\n      totalCount\n      totalPages\n      currentPage\n      pageSize\n    }\n  }\n": types.GetMySellerOrdersDocument,
    "\n  \n  query GetMySellerOrder($id: ID!) {\n    mySellerOrder(id: $id) {\n      ...SellerOrderFields\n    }\n  }\n": types.GetMySellerOrderDocument,
    "\n  \n  mutation UpdateSellerOrderStatus($input: UpdateSellerOrderStatusInput!) {\n    updateSellerOrderStatus(input: $input) {\n      ...SellerOrderFields\n    }\n  }\n": types.UpdateSellerOrderStatusDocument,
    "\n  fragment PageFields on Page {\n    id\n    slug\n    title\n    metaTitle\n    metaDesc\n    status\n    blocks\n    isSystem\n    publishedAt\n    createdAt\n    updatedAt\n  }\n": types.PageFieldsFragmentDoc,
    "\n  \n  query GetPublicPage($slug: String!) {\n    publicPage(slug: $slug) {\n      ...PageFields\n    }\n  }\n": types.GetPublicPageDocument,
    "\n  \n  query GetAdminPages($status: PageStatus) {\n    adminPages(status: $status) {\n      ...PageFields\n    }\n  }\n": types.GetAdminPagesDocument,
    "\n  \n  query GetAdminPagesPaginated(\n    $status: PageStatus\n    $page: Int\n    $pageSize: Int\n    $search: String\n  ) {\n    adminPagesPaginated(\n      status: $status\n      page: $page\n      pageSize: $pageSize\n      search: $search\n    ) {\n      items {\n        ...PageFields\n      }\n      totalCount\n      totalPages\n      currentPage\n      pageSize\n    }\n  }\n": types.GetAdminPagesPaginatedDocument,
    "\n  \n  query GetPage($id: ID!) {\n    page(id: $id) {\n      ...PageFields\n    }\n  }\n": types.GetPageDocument,
    "\n  \n  mutation CreatePage($createPageInput: CreatePageInput!) {\n    createPage(createPageInput: $createPageInput) {\n      ...PageFields\n    }\n  }\n": types.CreatePageDocument,
    "\n  \n  mutation UpdatePage($updatePageInput: UpdatePageInput!) {\n    updatePage(updatePageInput: $updatePageInput) {\n      ...PageFields\n    }\n  }\n": types.UpdatePageDocument,
    "\n  \n  mutation SetPageStatus($setPageStatusInput: SetPageStatusInput!) {\n    setPageStatus(setPageStatusInput: $setPageStatusInput) {\n      ...PageFields\n    }\n  }\n": types.SetPageStatusDocument,
    "\n  \n  mutation RemovePage($id: ID!) {\n    removePage(id: $id) {\n      ...PageFields\n    }\n  }\n": types.RemovePageDocument,
    "\n  query AdminPaymentGateways {\n    adminPaymentGateways {\n      id\n      gateway\n      displayName\n      description\n      logoUrl\n      isEnabled\n      isDefault\n      displayOrder\n      supportedMethods\n      sandboxMode\n      processingFee\n      processingFeeType\n      paymentType\n      instructions\n      webhookUrl\n      credentialHints\n      hasCredentials\n      createdAt\n      updatedAt\n    }\n  }\n": types.AdminPaymentGatewaysDocument,
    "\n  query AdminPaymentGateway($id: ID!) {\n    adminPaymentGateway(id: $id) {\n      id\n      gateway\n      displayName\n      description\n      logoUrl\n      isEnabled\n      isDefault\n      displayOrder\n      supportedMethods\n      sandboxMode\n      processingFee\n      processingFeeType\n      paymentType\n      instructions\n      webhookUrl\n      credentialHints\n      hasCredentials\n      createdAt\n      updatedAt\n    }\n  }\n": types.AdminPaymentGatewayDocument,
    "\n  mutation CreatePaymentGatewayConfig($input: CreateGatewayConfigInput!) {\n    createPaymentGatewayConfig(input: $input) {\n      id\n      gateway\n      displayName\n      isEnabled\n      isDefault\n    }\n  }\n": types.CreatePaymentGatewayConfigDocument,
    "\n  mutation UpdatePaymentGatewayConfig($input: UpdateGatewayConfigInput!) {\n    updatePaymentGatewayConfig(input: $input) {\n      id\n      gateway\n      displayName\n      description\n      logoUrl\n      isEnabled\n      isDefault\n      displayOrder\n      supportedMethods\n      sandboxMode\n      processingFee\n      processingFeeType\n      paymentType\n      instructions\n      webhookUrl\n      credentialHints\n      hasCredentials\n      updatedAt\n    }\n  }\n": types.UpdatePaymentGatewayConfigDocument,
    "\n  mutation TogglePaymentGateway($id: ID!, $enabled: Boolean!) {\n    togglePaymentGateway(id: $id, enabled: $enabled) {\n      id\n      isEnabled\n    }\n  }\n": types.TogglePaymentGatewayDocument,
    "\n  mutation SetDefaultPaymentGateway($id: ID!) {\n    setDefaultPaymentGateway(id: $id) {\n      id\n      isDefault\n    }\n  }\n": types.SetDefaultPaymentGatewayDocument,
    "\n  query AdminPaymentTransactions(\n    $page: Int = 1\n    $pageSize: Int = 10\n    $gateway: PaymentGateway\n    $status: PaymentTransactionStatus\n  ) {\n    adminPaymentTransactions(\n      page: $page\n      pageSize: $pageSize\n      gateway: $gateway\n      status: $status\n    ) {\n      items {\n        id\n        orderId\n        gateway\n        method\n        amount\n        processingFee\n        currency\n        status\n        gatewayOrderId\n        gatewayPaymentId\n        capturedAt\n        failedAt\n        createdAt\n      }\n      totalCount\n      totalPages\n      currentPage\n      pageSize\n    }\n  }\n": types.AdminPaymentTransactionsDocument,
    "\n  query ActivePaymentGateways {\n    activePaymentGateways {\n      id\n      gateway\n      displayName\n      description\n      logoUrl\n      isDefault\n      processingFee\n      processingFeeType\n      paymentType\n      supportedMethods\n    }\n  }\n": types.ActivePaymentGatewaysDocument,
    "\n  mutation InitiateCheckout($input: InitiateCheckoutInput!) {\n    initiateCheckout(input: $input) {\n      orderId\n      orderNumber\n      gateway\n      gatewayPayload\n      requiresPayment\n    }\n  }\n": types.InitiateCheckoutDocument,
    "\n  mutation VerifyPayment($input: VerifyPaymentInput!) {\n    verifyPayment(input: $input) {\n      id\n      orderNumber\n      status\n      paymentStatus\n    }\n  }\n": types.VerifyPaymentDocument,
    "\n  fragment ProductImageFields on ProductImage {\n    id\n    productId\n    imageUrl\n    altText\n    displayOrder\n    isPrimary\n    createdAt\n    updatedAt\n  }\n": types.ProductImageFieldsFragmentDoc,
    "\n  \n  fragment ProductSummaryFields on Product {\n    id\n    name\n    slug\n    productType\n    status\n    isFeatured\n    price\n    compareAtPrice\n    priceWithTax\n    createdAt\n    images {\n      ...ProductImageFields\n    }\n  }\n": types.ProductSummaryFieldsFragmentDoc,
    "\n  \n  fragment ProductFields on Product {\n    id\n    storeId\n    categoryId\n    brandId\n    name\n    slug\n    description\n    shortDescription\n    productType\n    status\n    isFeatured\n    isDigital\n    price\n    compareAtPrice\n    costPrice\n    priceWithTax\n    sku\n    weight\n    length\n    width\n    height\n    hsnCode\n    seoTitle\n    seoDescription\n    seoKeywords\n    specifications\n    createdAt\n    updatedAt\n    images {\n      ...ProductImageFields\n    }\n    brand {\n      id\n      name\n      slug\n      logoUrl\n    }\n    category {\n      id\n      name\n      slug\n    }\n    taxId\n    tax {\n      id\n      name\n      rate\n    }\n    tags {\n      id\n      name\n      slug\n    }\n  }\n": types.ProductFieldsFragmentDoc,
    "\n  \n  query GetMyProducts($storeId: ID, $status: ProductStatus) {\n    myProducts(storeId: $storeId, status: $status) {\n      ...ProductFields\n    }\n  }\n": types.GetMyProductsDocument,
    "\n  \n  query GetMyProduct($id: ID!) {\n    myProduct(id: $id) {\n      ...ProductFields\n    }\n  }\n": types.GetMyProductDocument,
    "\n  \n  mutation CreateMyProduct($createProductInput: CreateProductInput!) {\n    createMyProduct(createProductInput: $createProductInput) {\n      ...ProductFields\n    }\n  }\n": types.CreateMyProductDocument,
    "\n  \n  mutation UpdateMyProduct($updateProductInput: UpdateProductInput!) {\n    updateMyProduct(updateProductInput: $updateProductInput) {\n      ...ProductFields\n    }\n  }\n": types.UpdateMyProductDocument,
    "\n  \n  mutation SetMyProductStatus($setProductStatusInput: SetProductStatusInput!) {\n    setMyProductStatus(setProductStatusInput: $setProductStatusInput) {\n      ...ProductFields\n    }\n  }\n": types.SetMyProductStatusDocument,
    "\n  \n  mutation RemoveMyProduct($id: ID!) {\n    removeMyProduct(id: $id) {\n      ...ProductFields\n    }\n  }\n": types.RemoveMyProductDocument,
    "\n  \n  mutation AddMyProductImage($addProductImageInput: AddProductImageInput!) {\n    addMyProductImage(addProductImageInput: $addProductImageInput) {\n      ...ProductImageFields\n    }\n  }\n": types.AddMyProductImageDocument,
    "\n  \n  mutation UpdateMyProductImage(\n    $updateProductImageInput: UpdateProductImageInput!\n  ) {\n    updateMyProductImage(updateProductImageInput: $updateProductImageInput) {\n      ...ProductImageFields\n    }\n  }\n": types.UpdateMyProductImageDocument,
    "\n  \n  mutation RemoveMyProductImage($id: ID!) {\n    removeMyProductImage(id: $id) {\n      ...ProductImageFields\n    }\n  }\n": types.RemoveMyProductImageDocument,
    "\n  mutation ReorderMyProductImages(\n    $reorderProductImagesInput: ReorderProductImagesInput!\n  ) {\n    reorderMyProductImages(\n      reorderProductImagesInput: $reorderProductImagesInput\n    )\n  }\n": types.ReorderMyProductImagesDocument,
    "\n  \n  query GetAdminProducts(\n    $status: ProductStatus\n    $storeId: ID\n    $brandId: ID\n    $categoryId: ID\n  ) {\n    adminProducts(\n      status: $status\n      storeId: $storeId\n      brandId: $brandId\n      categoryId: $categoryId\n    ) {\n      ...ProductFields\n      variants {\n        id\n        sku\n        price\n        status\n        attributes {\n          attributeName\n          value\n        }\n      }\n    }\n  }\n": types.GetAdminProductsDocument,
    "\n  \n  mutation AdminSetProductStatus(\n    $setProductStatusInput: SetProductStatusInput!\n  ) {\n    adminSetProductStatus(setProductStatusInput: $setProductStatusInput) {\n      ...ProductFields\n    }\n  }\n": types.AdminSetProductStatusDocument,
    "\n  \n  query GetPublicProduct($slug: String!) {\n    publicProduct(slug: $slug) {\n      ...ProductFields\n      variants {\n        id\n        sku\n        price\n        priceWithTax\n        compareAtPrice\n        imageUrl\n        status\n        availableQuantity\n        stockState\n        attributes {\n          attributeId\n          attributeValueId\n          attributeName\n          attributeSlug\n          value\n          valueSlug\n        }\n      }\n    }\n  }\n": types.GetPublicProductDocument,
    "\n  \n  query GetPublicProducts(\n    $storeSlug: String\n    $brandSlug: String\n    $tagSlug: String\n    $categorySlug: String\n    $sort: ProductSortOrder\n    $limit: Float\n  ) {\n    publicProducts(\n      storeSlug: $storeSlug\n      brandSlug: $brandSlug\n      tagSlug: $tagSlug\n      categorySlug: $categorySlug\n      sort: $sort\n      limit: $limit\n    ) {\n      ...ProductSummaryFields\n      variants {\n        id\n        price\n        priceWithTax\n        availableQuantity\n      }\n    }\n  }\n": types.GetPublicProductsDocument,
    "\n  \n  query GetPaginatedPublicProducts(\n    $storeSlug: String\n    $brandSlug: String\n    $tagSlug: String\n    $categorySlug: String\n    $minPrice: Float\n    $maxPrice: Float\n    $sort: ProductSortOrder\n    $page: Int\n    $pageSize: Int\n  ) {\n    paginatedPublicProducts(\n      storeSlug: $storeSlug\n      brandSlug: $brandSlug\n      tagSlug: $tagSlug\n      categorySlug: $categorySlug\n      minPrice: $minPrice\n      maxPrice: $maxPrice\n      sort: $sort\n      page: $page\n      pageSize: $pageSize\n    ) {\n      items {\n        ...ProductSummaryFields\n        variants {\n          id\n          price\n          priceWithTax\n          availableQuantity\n        }\n      }\n      totalCount\n      totalPages\n      currentPage\n      pageSize\n    }\n  }\n": types.GetPaginatedPublicProductsDocument,
    "\n  fragment VariantFields on ProductVariant {\n    id\n    productId\n    sku\n    name\n    price\n    compareAtPrice\n    costPrice\n    weight\n    length\n    width\n    height\n    imageUrl\n    status\n    createdAt\n    updatedAt\n    attributes {\n      attributeId\n      attributeValueId\n      attributeName\n      attributeSlug\n      value\n      valueSlug\n    }\n  }\n": types.VariantFieldsFragmentDoc,
    "\n  fragment VariantAxisFields on VariantAxis {\n    attributeId\n    attributeName\n    attributeSlug\n    values {\n      id\n      attributeId\n      value\n      slug\n      displayOrder\n      createdAt\n      updatedAt\n    }\n  }\n": types.VariantAxisFieldsFragmentDoc,
    "\n  \n  query GetMyProductVariants($productId: ID!) {\n    myProductVariants(productId: $productId) {\n      ...VariantFields\n    }\n  }\n": types.GetMyProductVariantsDocument,
    "\n  \n  query GetMyProductVariantAxes($productId: ID!) {\n    myProductVariantAxes(productId: $productId) {\n      ...VariantAxisFields\n    }\n  }\n": types.GetMyProductVariantAxesDocument,
    "\n  \n  mutation SetMyProductVariantAxes($setVariantAxesInput: SetVariantAxesInput!) {\n    setMyProductVariantAxes(setVariantAxesInput: $setVariantAxesInput) {\n      ...VariantAxisFields\n    }\n  }\n": types.SetMyProductVariantAxesDocument,
    "\n  \n  mutation GenerateMyProductVariantMatrix(\n    $generateVariantMatrixInput: GenerateVariantMatrixInput!\n  ) {\n    generateMyProductVariantMatrix(\n      generateVariantMatrixInput: $generateVariantMatrixInput\n    ) {\n      ...VariantFields\n    }\n  }\n": types.GenerateMyProductVariantMatrixDocument,
    "\n  \n  mutation AddMyProductVariant($createVariantInput: CreateVariantInput!) {\n    addMyProductVariant(createVariantInput: $createVariantInput) {\n      ...VariantFields\n    }\n  }\n": types.AddMyProductVariantDocument,
    "\n  \n  mutation UpdateMyProductVariant($updateVariantInput: UpdateVariantInput!) {\n    updateMyProductVariant(updateVariantInput: $updateVariantInput) {\n      ...VariantFields\n    }\n  }\n": types.UpdateMyProductVariantDocument,
    "\n  \n  mutation RemoveMyProductVariant($id: ID!) {\n    removeMyProductVariant(id: $id) {\n      ...VariantFields\n    }\n  }\n": types.RemoveMyProductVariantDocument,
    "\n  mutation BulkUpdateMyProductVariants(\n    $bulkUpdateVariantsInput: BulkUpdateVariantsInput!\n  ) {\n    bulkUpdateMyProductVariants(\n      bulkUpdateVariantsInput: $bulkUpdateVariantsInput\n    )\n  }\n": types.BulkUpdateMyProductVariantsDocument,
    "\n  fragment PayoutAccountFields on SellerPayoutAccount {\n    id\n    sellerId\n    accountType\n    accountHolderName\n    accountNumber\n    ifscCode\n    bankName\n    upiId\n    walletProvider\n    isPrimary\n    isVerified\n    createdAt\n    updatedAt\n  }\n": types.PayoutAccountFieldsFragmentDoc,
    "\n  \n  fragment SellerFields on Seller {\n    id\n    userId\n    legalName\n    displayName\n    businessType\n    dateOfIncorporation\n    registrationNumber\n    panNumber\n    gstin\n    businessEmail\n    businessPhone\n    supportEmail\n    signatoryName\n    signatoryPan\n    signatoryDesignation\n    overallStatus\n    panVerifiedAt\n    gstinVerifiedAt\n    bankVerifiedAt\n    documentsVerifiedAt\n    rejectionReason\n    commissionRate\n    createdAt\n    updatedAt\n    payoutAccounts {\n      ...PayoutAccountFields\n    }\n  }\n": types.SellerFieldsFragmentDoc,
    "\n  \n  query GetMySeller {\n    mySeller {\n      ...SellerFields\n    }\n  }\n": types.GetMySellerDocument,
    "\n  \n  query GetSellers($status: SellerStatus) {\n    sellers(status: $status) {\n      ...SellerFields\n    }\n  }\n": types.GetSellersDocument,
    "\n  \n  query GetSellerUsers($status: SellerListStatus) {\n    sellerUsers(status: $status) {\n      userId\n      name\n      email\n      phone\n      emailVerifiedAt\n      registeredAt\n      status\n      seller {\n        ...SellerFields\n      }\n    }\n  }\n": types.GetSellerUsersDocument,
    "\n  \n  query GetSeller($id: ID!) {\n    seller(id: $id) {\n      ...SellerFields\n    }\n  }\n": types.GetSellerDocument,
    "\n  \n  mutation CreateMySeller($createSellerInput: CreateSellerInput!) {\n    createMySeller(createSellerInput: $createSellerInput) {\n      ...SellerFields\n    }\n  }\n": types.CreateMySellerDocument,
    "\n  \n  mutation UpdateMySeller($updateSellerInput: UpdateSellerInput!) {\n    updateMySeller(updateSellerInput: $updateSellerInput) {\n      ...SellerFields\n    }\n  }\n": types.UpdateMySellerDocument,
    "\n  \n  mutation SubmitMySellerForReview($id: ID!) {\n    submitMySellerForReview(id: $id) {\n      ...SellerFields\n    }\n  }\n": types.SubmitMySellerForReviewDocument,
    "\n  \n  mutation VerifySellerSection(\n    $verifySectionInput: VerifySellerSectionInput!\n  ) {\n    verifySellerSection(verifySectionInput: $verifySectionInput) {\n      ...SellerFields\n    }\n  }\n": types.VerifySellerSectionDocument,
    "\n  \n  mutation SetSellerStatus($setStatusInput: SetSellerStatusInput!) {\n    setSellerStatus(setStatusInput: $setStatusInput) {\n      ...SellerFields\n    }\n  }\n": types.SetSellerStatusDocument,
    "\n  \n  mutation RemoveSeller($id: ID!) {\n    removeSeller(id: $id) {\n      ...SellerFields\n    }\n  }\n": types.RemoveSellerDocument,
    "\n  query GetSiteSettings($group: SettingGroup) {\n    siteSettings(group: $group) {\n      id\n      key\n      value\n      group\n      label\n      description\n      valueType\n      createdAt\n      updatedAt\n    }\n  }\n": types.GetSiteSettingsDocument,
    "\n  mutation UpdateSiteSetting($input: UpdateSiteSettingInput!) {\n    updateSiteSetting(input: $input) {\n      id\n      key\n      value\n      group\n      label\n      description\n      valueType\n      updatedAt\n    }\n  }\n": types.UpdateSiteSettingDocument,
    "\n  fragment SlideItemFields on SlideItem {\n    id\n    sliderId\n    title\n    description\n    link\n    ctaLabel\n    imageUrl\n    tabletImageUrl\n    mobileImageUrl\n    order\n    isEnabled\n    createdAt\n    updatedAt\n  }\n": types.SlideItemFieldsFragmentDoc,
    "\n  \n  fragment SliderFields on Slider {\n    id\n    name\n    key\n    description\n    status\n    config\n    createdAt\n    updatedAt\n    items {\n      ...SlideItemFields\n    }\n  }\n": types.SliderFieldsFragmentDoc,
    "\n  \n  query GetPublicSlider($key: String!) {\n    publicSlider(key: $key) {\n      ...SliderFields\n    }\n  }\n": types.GetPublicSliderDocument,
    "\n  \n  query GetAdminSliders {\n    adminSliders {\n      ...SliderFields\n    }\n  }\n": types.GetAdminSlidersDocument,
    "\n  \n  query GetAdminSlidersPaginated(\n    $status: SliderStatus\n    $page: Int\n    $pageSize: Int\n    $search: String\n  ) {\n    adminSlidersPaginated(\n      status: $status\n      page: $page\n      pageSize: $pageSize\n      search: $search\n    ) {\n      items {\n        ...SliderFields\n      }\n      totalCount\n      totalPages\n      currentPage\n      pageSize\n    }\n  }\n": types.GetAdminSlidersPaginatedDocument,
    "\n  \n  query GetAdminSlider($id: ID!) {\n    adminSlider(id: $id) {\n      ...SliderFields\n    }\n  }\n": types.GetAdminSliderDocument,
    "\n  \n  mutation CreateSlider($createSliderInput: CreateSliderInput!) {\n    createSlider(createSliderInput: $createSliderInput) {\n      ...SliderFields\n    }\n  }\n": types.CreateSliderDocument,
    "\n  \n  mutation UpdateSlider($updateSliderInput: UpdateSliderInput!) {\n    updateSlider(updateSliderInput: $updateSliderInput) {\n      ...SliderFields\n    }\n  }\n": types.UpdateSliderDocument,
    "\n  \n  mutation SetSliderStatus($setSliderStatusInput: SetSliderStatusInput!) {\n    setSliderStatus(setSliderStatusInput: $setSliderStatusInput) {\n      ...SliderFields\n    }\n  }\n": types.SetSliderStatusDocument,
    "\n  \n  mutation RemoveSlider($id: ID!) {\n    removeSlider(id: $id) {\n      ...SliderFields\n    }\n  }\n": types.RemoveSliderDocument,
    "\n  \n  mutation AddSlideItem($addSlideItemInput: AddSlideItemInput!) {\n    addSlideItem(addSlideItemInput: $addSlideItemInput) {\n      ...SlideItemFields\n    }\n  }\n": types.AddSlideItemDocument,
    "\n  \n  mutation UpdateSlideItem($updateSlideItemInput: UpdateSlideItemInput!) {\n    updateSlideItem(updateSlideItemInput: $updateSlideItemInput) {\n      ...SlideItemFields\n    }\n  }\n": types.UpdateSlideItemDocument,
    "\n  \n  mutation RemoveSlideItem($id: ID!) {\n    removeSlideItem(id: $id) {\n      ...SlideItemFields\n    }\n  }\n": types.RemoveSlideItemDocument,
    "\n  mutation ReorderSlideItems(\n    $reorderSlideItemsInput: ReorderSlideItemsInput!\n  ) {\n    reorderSlideItems(reorderSlideItemsInput: $reorderSlideItemsInput)\n  }\n": types.ReorderSlideItemsDocument,
    "\n  fragment WarehouseFields on Warehouse {\n    id\n    storeId\n    name\n    code\n    addressLine1\n    addressLine2\n    city\n    state\n    postalCode\n    countryCode\n    phone\n    isDefault\n    isActive\n    createdAt\n    updatedAt\n  }\n": types.WarehouseFieldsFragmentDoc,
    "\n  \n  fragment StoreFields on Store {\n    id\n    sellerId\n    name\n    slug\n    description\n    logoUrl\n    bannerUrl\n    currencyCode\n    timezone\n    locale\n    supportEmail\n    supportPhone\n    status\n    isFeatured\n    createdAt\n    updatedAt\n    warehouses {\n      ...WarehouseFields\n    }\n  }\n": types.StoreFieldsFragmentDoc,
    "\n  \n  query GetMyStores {\n    myStores {\n      ...StoreFields\n    }\n  }\n": types.GetMyStoresDocument,
    "\n  \n  query GetMyStore($id: ID!) {\n    myStore(id: $id) {\n      ...StoreFields\n    }\n  }\n": types.GetMyStoreDocument,
    "\n  \n  mutation CreateMyStore($createStoreInput: CreateStoreInput!) {\n    createMyStore(createStoreInput: $createStoreInput) {\n      ...StoreFields\n    }\n  }\n": types.CreateMyStoreDocument,
    "\n  \n  mutation UpdateMyStore($updateStoreInput: UpdateStoreInput!) {\n    updateMyStore(updateStoreInput: $updateStoreInput) {\n      ...StoreFields\n    }\n  }\n": types.UpdateMyStoreDocument,
    "\n  \n  mutation SubmitMyStoreForReview($id: ID!) {\n    submitMyStoreForReview(id: $id) {\n      ...StoreFields\n    }\n  }\n": types.SubmitMyStoreForReviewDocument,
    "\n  \n  mutation RemoveMyStore($id: ID!) {\n    removeMyStore(id: $id) {\n      ...StoreFields\n    }\n  }\n": types.RemoveMyStoreDocument,
    "\n  \n  mutation CreateMyWarehouse($createWarehouseInput: CreateWarehouseInput!) {\n    createMyWarehouse(createWarehouseInput: $createWarehouseInput) {\n      ...WarehouseFields\n    }\n  }\n": types.CreateMyWarehouseDocument,
    "\n  \n  mutation UpdateMyWarehouse($updateWarehouseInput: UpdateWarehouseInput!) {\n    updateMyWarehouse(updateWarehouseInput: $updateWarehouseInput) {\n      ...WarehouseFields\n    }\n  }\n": types.UpdateMyWarehouseDocument,
    "\n  \n  mutation RemoveMyWarehouse($id: ID!) {\n    removeMyWarehouse(id: $id) {\n      ...WarehouseFields\n    }\n  }\n": types.RemoveMyWarehouseDocument,
    "\n  \n  query GetStores($status: StoreStatus) {\n    stores(status: $status) {\n      ...StoreFields\n    }\n  }\n": types.GetStoresDocument,
    "\n  \n  mutation SetStoreStatus($setStoreStatusInput: SetStoreStatusInput!) {\n    setStoreStatus(setStoreStatusInput: $setStoreStatusInput) {\n      ...StoreFields\n    }\n  }\n": types.SetStoreStatusDocument,
    "\n  \n  mutation AdminRemoveStore($id: ID!) {\n    adminRemoveStore(id: $id) {\n      ...StoreFields\n    }\n  }\n": types.AdminRemoveStoreDocument,
    "\n  \n  query GetPublicStore($slug: String!) {\n    publicStore(slug: $slug) {\n      ...StoreFields\n    }\n  }\n": types.GetPublicStoreDocument,
    "\n  fragment TagFields on Tag {\n    id\n    name\n    slug\n    description\n    status\n    isFeatured\n    createdAt\n    updatedAt\n  }\n": types.TagFieldsFragmentDoc,
    "\n  \n  query GetAdminTags($status: TagStatus) {\n    adminTags(status: $status) {\n      ...TagFields\n    }\n  }\n": types.GetAdminTagsDocument,
    "\n  \n  query GetTags($status: TagStatus, $featuredOnly: Boolean) {\n    tags(status: $status, featuredOnly: $featuredOnly) {\n      ...TagFields\n    }\n  }\n": types.GetTagsDocument,
    "\n  \n  query GetTag($id: ID!) {\n    tag(id: $id) {\n      ...TagFields\n    }\n  }\n": types.GetTagDocument,
    "\n  \n  query GetPublicTag($slug: String!) {\n    publicTag(slug: $slug) {\n      ...TagFields\n    }\n  }\n": types.GetPublicTagDocument,
    "\n  \n  mutation CreateTag($createTagInput: CreateTagInput!) {\n    createTag(createTagInput: $createTagInput) {\n      ...TagFields\n    }\n  }\n": types.CreateTagDocument,
    "\n  \n  mutation UpdateTag($updateTagInput: UpdateTagInput!) {\n    updateTag(updateTagInput: $updateTagInput) {\n      ...TagFields\n    }\n  }\n": types.UpdateTagDocument,
    "\n  \n  mutation SetTagStatus($setTagStatusInput: SetTagStatusInput!) {\n    setTagStatus(setTagStatusInput: $setTagStatusInput) {\n      ...TagFields\n    }\n  }\n": types.SetTagStatusDocument,
    "\n  \n  mutation RemoveTag($id: ID!) {\n    removeTag(id: $id) {\n      ...TagFields\n    }\n  }\n": types.RemoveTagDocument,
    "\n  fragment TaxFields on Tax {\n    id\n    name\n    rate\n    description\n    isActive\n    displayOrder\n    createdAt\n    updatedAt\n  }\n": types.TaxFieldsFragmentDoc,
    "\n  \n  query GetTaxes {\n    taxes {\n      ...TaxFields\n    }\n  }\n": types.GetTaxesDocument,
    "\n  \n  query GetAdminTaxes {\n    adminTaxes {\n      ...TaxFields\n    }\n  }\n": types.GetAdminTaxesDocument,
    "\n  \n  query GetAdminTaxesPaginated(\n    $page: Int\n    $pageSize: Int\n    $search: String\n  ) {\n    adminTaxesPaginated(page: $page, pageSize: $pageSize, search: $search) {\n      items {\n        ...TaxFields\n      }\n      totalCount\n      totalPages\n      currentPage\n      pageSize\n    }\n  }\n": types.GetAdminTaxesPaginatedDocument,
    "\n  \n  query GetTax($id: ID!) {\n    tax(id: $id) {\n      ...TaxFields\n    }\n  }\n": types.GetTaxDocument,
    "\n  \n  mutation CreateTax($createTaxInput: CreateTaxInput!) {\n    createTax(createTaxInput: $createTaxInput) {\n      ...TaxFields\n    }\n  }\n": types.CreateTaxDocument,
    "\n  \n  mutation UpdateTax($updateTaxInput: UpdateTaxInput!) {\n    updateTax(updateTaxInput: $updateTaxInput) {\n      ...TaxFields\n    }\n  }\n": types.UpdateTaxDocument,
    "\n  \n  mutation RemoveTax($id: ID!) {\n    removeTax(id: $id) {\n      ...TaxFields\n    }\n  }\n": types.RemoveTaxDocument,
    "\n  \n  fragment WishlistFields on Wishlist {\n    id\n    customerId\n    name\n    isDefault\n    isPublic\n    itemCount\n    items {\n      id\n      productId\n      variantId\n      createdAt\n      product {\n        ...ProductFields\n      }\n    }\n    createdAt\n    updatedAt\n  }\n": types.WishlistFieldsFragmentDoc,
    "\n  \n  query GetMyWishlist {\n    myWishlist {\n      ...WishlistFields\n    }\n  }\n": types.GetMyWishlistDocument,
    "\n  query GetMyWishlistProductIds {\n    myWishlistProductIds\n  }\n": types.GetMyWishlistProductIdsDocument,
    "\n  \n  mutation AddToWishlist($input: ToggleWishlistInput!) {\n    addToWishlist(input: $input) {\n      ...WishlistFields\n    }\n  }\n": types.AddToWishlistDocument,
    "\n  \n  mutation RemoveFromWishlist($input: ToggleWishlistInput!) {\n    removeFromWishlist(input: $input) {\n      ...WishlistFields\n    }\n  }\n": types.RemoveFromWishlistDocument,
    "\n  \n  mutation ClearWishlist {\n    clearWishlist {\n      ...WishlistFields\n    }\n  }\n": types.ClearWishlistDocument,
    "\n  query GetAdminThemeSSR {\n    adminTheme {\n      id\n      primaryLight\n      primaryDark\n      accentLight\n      accentDark\n      sidebarLight\n      sidebarDark\n      destructiveLight\n      destructiveDark\n      radius\n      fontFamily\n      updatedAt\n      updatedById\n    }\n  }\n": types.GetAdminThemeSsrDocument,
};

/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 *
 *
 * @example
 * ```ts
 * const query = graphql(`query GetUser($id: ID!) { user(id: $id) { name } }`);
 * ```
 *
 * The query argument is unknown!
 * Please regenerate the types.
 */
export function graphql(source: string): unknown;

/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  \n  query GetMyProfile {\n    myProfile {\n      ...AdminCustomerFields\n    }\n  }\n"): (typeof documents)["\n  \n  query GetMyProfile {\n    myProfile {\n      ...AdminCustomerFields\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  \n  mutation UpdateMyProfile($input: UpdateMyProfileInput!) {\n    updateMyProfile(input: $input) {\n      ...AdminCustomerFields\n    }\n  }\n"): (typeof documents)["\n  \n  mutation UpdateMyProfile($input: UpdateMyProfileInput!) {\n    updateMyProfile(input: $input) {\n      ...AdminCustomerFields\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  fragment AddressFields on Address {\n    id\n    userId\n    type\n    label\n    firstName\n    lastName\n    phone\n    addressLine1\n    addressLine2\n    city\n    state\n    postalCode\n    countryCode\n    isDefault\n  }\n"): (typeof documents)["\n  fragment AddressFields on Address {\n    id\n    userId\n    type\n    label\n    firstName\n    lastName\n    phone\n    addressLine1\n    addressLine2\n    city\n    state\n    postalCode\n    countryCode\n    isDefault\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  \n  query GetMyAddresses {\n    myAddresses {\n      ...AddressFields\n    }\n  }\n"): (typeof documents)["\n  \n  query GetMyAddresses {\n    myAddresses {\n      ...AddressFields\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  \n  mutation AddMyAddress($input: CreateAddressInput!) {\n    addMyAddress(input: $input) {\n      ...AddressFields\n    }\n  }\n"): (typeof documents)["\n  \n  mutation AddMyAddress($input: CreateAddressInput!) {\n    addMyAddress(input: $input) {\n      ...AddressFields\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  \n  mutation UpdateMyAddress($input: UpdateAddressInput!) {\n    updateMyAddress(input: $input) {\n      ...AddressFields\n    }\n  }\n"): (typeof documents)["\n  \n  mutation UpdateMyAddress($input: UpdateAddressInput!) {\n    updateMyAddress(input: $input) {\n      ...AddressFields\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  \n  mutation SetMyDefaultAddress($id: ID!) {\n    setMyDefaultAddress(id: $id) {\n      ...AddressFields\n    }\n  }\n"): (typeof documents)["\n  \n  mutation SetMyDefaultAddress($id: ID!) {\n    setMyDefaultAddress(id: $id) {\n      ...AddressFields\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  \n  mutation RemoveMyAddress($id: ID!) {\n    removeMyAddress(id: $id) {\n      ...AddressFields\n    }\n  }\n"): (typeof documents)["\n  \n  mutation RemoveMyAddress($id: ID!) {\n    removeMyAddress(id: $id) {\n      ...AddressFields\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  fragment AdminThemeFields on AdminTheme {\n    id\n    primaryLight\n    primaryDark\n    accentLight\n    accentDark\n    sidebarLight\n    sidebarDark\n    destructiveLight\n    destructiveDark\n    radius\n    fontFamily\n    updatedAt\n    updatedById\n  }\n"): (typeof documents)["\n  fragment AdminThemeFields on AdminTheme {\n    id\n    primaryLight\n    primaryDark\n    accentLight\n    accentDark\n    sidebarLight\n    sidebarDark\n    destructiveLight\n    destructiveDark\n    radius\n    fontFamily\n    updatedAt\n    updatedById\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  \n  query GetAdminTheme {\n    adminTheme {\n      ...AdminThemeFields\n    }\n  }\n"): (typeof documents)["\n  \n  query GetAdminTheme {\n    adminTheme {\n      ...AdminThemeFields\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  \n  mutation UpdateAdminTheme(\n    $updateAdminThemeInput: UpdateAdminThemeInput!\n  ) {\n    updateAdminTheme(updateAdminThemeInput: $updateAdminThemeInput) {\n      ...AdminThemeFields\n    }\n  }\n"): (typeof documents)["\n  \n  mutation UpdateAdminTheme(\n    $updateAdminThemeInput: UpdateAdminThemeInput!\n  ) {\n    updateAdminTheme(updateAdminThemeInput: $updateAdminThemeInput) {\n      ...AdminThemeFields\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  \n  mutation ResetAdminTheme {\n    resetAdminTheme {\n      ...AdminThemeFields\n    }\n  }\n"): (typeof documents)["\n  \n  mutation ResetAdminTheme {\n    resetAdminTheme {\n      ...AdminThemeFields\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  fragment AttributeValueFields on ProductAttributeValue {\n    id\n    attributeId\n    value\n    slug\n    displayOrder\n    createdAt\n    updatedAt\n  }\n"): (typeof documents)["\n  fragment AttributeValueFields on ProductAttributeValue {\n    id\n    attributeId\n    value\n    slug\n    displayOrder\n    createdAt\n    updatedAt\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  \n  fragment AttributeFields on ProductAttribute {\n    id\n    name\n    slug\n    description\n    type\n    isVariantAttribute\n    createdAt\n    updatedAt\n    values {\n      ...AttributeValueFields\n    }\n  }\n"): (typeof documents)["\n  \n  fragment AttributeFields on ProductAttribute {\n    id\n    name\n    slug\n    description\n    type\n    isVariantAttribute\n    createdAt\n    updatedAt\n    values {\n      ...AttributeValueFields\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  \n  query GetAdminAttributes($type: AttributeType) {\n    adminAttributes(type: $type) {\n      ...AttributeFields\n    }\n  }\n"): (typeof documents)["\n  \n  query GetAdminAttributes($type: AttributeType) {\n    adminAttributes(type: $type) {\n      ...AttributeFields\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  \n  query GetAttributes($type: AttributeType, $variantOnly: Boolean) {\n    attributes(type: $type, variantOnly: $variantOnly) {\n      ...AttributeFields\n    }\n  }\n"): (typeof documents)["\n  \n  query GetAttributes($type: AttributeType, $variantOnly: Boolean) {\n    attributes(type: $type, variantOnly: $variantOnly) {\n      ...AttributeFields\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  \n  query GetAttribute($id: ID!) {\n    attribute(id: $id) {\n      ...AttributeFields\n    }\n  }\n"): (typeof documents)["\n  \n  query GetAttribute($id: ID!) {\n    attribute(id: $id) {\n      ...AttributeFields\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  \n  mutation CreateAttribute($createAttributeInput: CreateAttributeInput!) {\n    createAttribute(createAttributeInput: $createAttributeInput) {\n      ...AttributeFields\n    }\n  }\n"): (typeof documents)["\n  \n  mutation CreateAttribute($createAttributeInput: CreateAttributeInput!) {\n    createAttribute(createAttributeInput: $createAttributeInput) {\n      ...AttributeFields\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  \n  mutation UpdateAttribute($updateAttributeInput: UpdateAttributeInput!) {\n    updateAttribute(updateAttributeInput: $updateAttributeInput) {\n      ...AttributeFields\n    }\n  }\n"): (typeof documents)["\n  \n  mutation UpdateAttribute($updateAttributeInput: UpdateAttributeInput!) {\n    updateAttribute(updateAttributeInput: $updateAttributeInput) {\n      ...AttributeFields\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  \n  mutation RemoveAttribute($id: ID!) {\n    removeAttribute(id: $id) {\n      ...AttributeFields\n    }\n  }\n"): (typeof documents)["\n  \n  mutation RemoveAttribute($id: ID!) {\n    removeAttribute(id: $id) {\n      ...AttributeFields\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  \n  mutation CreateAttributeValue(\n    $createAttributeValueInput: CreateAttributeValueInput!\n  ) {\n    createAttributeValue(createAttributeValueInput: $createAttributeValueInput) {\n      ...AttributeValueFields\n    }\n  }\n"): (typeof documents)["\n  \n  mutation CreateAttributeValue(\n    $createAttributeValueInput: CreateAttributeValueInput!\n  ) {\n    createAttributeValue(createAttributeValueInput: $createAttributeValueInput) {\n      ...AttributeValueFields\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  \n  mutation UpdateAttributeValue(\n    $updateAttributeValueInput: UpdateAttributeValueInput!\n  ) {\n    updateAttributeValue(updateAttributeValueInput: $updateAttributeValueInput) {\n      ...AttributeValueFields\n    }\n  }\n"): (typeof documents)["\n  \n  mutation UpdateAttributeValue(\n    $updateAttributeValueInput: UpdateAttributeValueInput!\n  ) {\n    updateAttributeValue(updateAttributeValueInput: $updateAttributeValueInput) {\n      ...AttributeValueFields\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  \n  mutation RemoveAttributeValue($id: ID!) {\n    removeAttributeValue(id: $id) {\n      ...AttributeValueFields\n    }\n  }\n"): (typeof documents)["\n  \n  mutation RemoveAttributeValue($id: ID!) {\n    removeAttributeValue(id: $id) {\n      ...AttributeValueFields\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation ReorderAttributeValues(\n    $reorderAttributeValuesInput: ReorderAttributeValuesInput!\n  ) {\n    reorderAttributeValues(\n      reorderAttributeValuesInput: $reorderAttributeValuesInput\n    )\n  }\n"): (typeof documents)["\n  mutation ReorderAttributeValues(\n    $reorderAttributeValuesInput: ReorderAttributeValuesInput!\n  ) {\n    reorderAttributeValues(\n      reorderAttributeValuesInput: $reorderAttributeValuesInput\n    )\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  fragment BrandFields on Brand {\n    id\n    name\n    slug\n    description\n    logoUrl\n    bannerUrl\n    websiteUrl\n    countryCode\n    foundedYear\n    status\n    isFeatured\n    createdAt\n    updatedAt\n  }\n"): (typeof documents)["\n  fragment BrandFields on Brand {\n    id\n    name\n    slug\n    description\n    logoUrl\n    bannerUrl\n    websiteUrl\n    countryCode\n    foundedYear\n    status\n    isFeatured\n    createdAt\n    updatedAt\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  \n  query GetAdminBrands($status: BrandStatus) {\n    adminBrands(status: $status) {\n      ...BrandFields\n    }\n  }\n"): (typeof documents)["\n  \n  query GetAdminBrands($status: BrandStatus) {\n    adminBrands(status: $status) {\n      ...BrandFields\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  \n  query GetBrands($status: BrandStatus, $featuredOnly: Boolean) {\n    brands(status: $status, featuredOnly: $featuredOnly) {\n      ...BrandFields\n    }\n  }\n"): (typeof documents)["\n  \n  query GetBrands($status: BrandStatus, $featuredOnly: Boolean) {\n    brands(status: $status, featuredOnly: $featuredOnly) {\n      ...BrandFields\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  \n  query GetBrand($id: ID!) {\n    brand(id: $id) {\n      ...BrandFields\n    }\n  }\n"): (typeof documents)["\n  \n  query GetBrand($id: ID!) {\n    brand(id: $id) {\n      ...BrandFields\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  \n  query GetPublicBrand($slug: String!) {\n    publicBrand(slug: $slug) {\n      ...BrandFields\n    }\n  }\n"): (typeof documents)["\n  \n  query GetPublicBrand($slug: String!) {\n    publicBrand(slug: $slug) {\n      ...BrandFields\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  \n  mutation CreateBrand($createBrandInput: CreateBrandInput!) {\n    createBrand(createBrandInput: $createBrandInput) {\n      ...BrandFields\n    }\n  }\n"): (typeof documents)["\n  \n  mutation CreateBrand($createBrandInput: CreateBrandInput!) {\n    createBrand(createBrandInput: $createBrandInput) {\n      ...BrandFields\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  \n  mutation UpdateBrand($updateBrandInput: UpdateBrandInput!) {\n    updateBrand(updateBrandInput: $updateBrandInput) {\n      ...BrandFields\n    }\n  }\n"): (typeof documents)["\n  \n  mutation UpdateBrand($updateBrandInput: UpdateBrandInput!) {\n    updateBrand(updateBrandInput: $updateBrandInput) {\n      ...BrandFields\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  \n  mutation SetBrandStatus($setBrandStatusInput: SetBrandStatusInput!) {\n    setBrandStatus(setBrandStatusInput: $setBrandStatusInput) {\n      ...BrandFields\n    }\n  }\n"): (typeof documents)["\n  \n  mutation SetBrandStatus($setBrandStatusInput: SetBrandStatusInput!) {\n    setBrandStatus(setBrandStatusInput: $setBrandStatusInput) {\n      ...BrandFields\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  \n  mutation RemoveBrand($id: ID!) {\n    removeBrand(id: $id) {\n      ...BrandFields\n    }\n  }\n"): (typeof documents)["\n  \n  mutation RemoveBrand($id: ID!) {\n    removeBrand(id: $id) {\n      ...BrandFields\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  \n  fragment CartFields on Cart {\n    id\n    customerId\n    itemCount\n    subtotal\n    needsReview\n    items {\n      id\n      productId\n      variantId\n      quantity\n      unitPriceSnapshot\n      unitPriceCurrent\n      priceChanged\n      lineTotal\n      availableQuantity\n      stockState\n      createdAt\n      product {\n        ...ProductFields\n      }\n      variant {\n        id\n        sku\n        name\n        price\n        priceWithTax\n        imageUrl\n        attributes {\n          attributeId\n          attributeValueId\n          attributeName\n          attributeSlug\n          value\n          valueSlug\n        }\n      }\n    }\n    createdAt\n    updatedAt\n  }\n"): (typeof documents)["\n  \n  fragment CartFields on Cart {\n    id\n    customerId\n    itemCount\n    subtotal\n    needsReview\n    items {\n      id\n      productId\n      variantId\n      quantity\n      unitPriceSnapshot\n      unitPriceCurrent\n      priceChanged\n      lineTotal\n      availableQuantity\n      stockState\n      createdAt\n      product {\n        ...ProductFields\n      }\n      variant {\n        id\n        sku\n        name\n        price\n        priceWithTax\n        imageUrl\n        attributes {\n          attributeId\n          attributeValueId\n          attributeName\n          attributeSlug\n          value\n          valueSlug\n        }\n      }\n    }\n    createdAt\n    updatedAt\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  \n  query GetMyCart {\n    myCart {\n      ...CartFields\n    }\n  }\n"): (typeof documents)["\n  \n  query GetMyCart {\n    myCart {\n      ...CartFields\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query GetMyCartItemCount {\n    myCartItemCount\n  }\n"): (typeof documents)["\n  query GetMyCartItemCount {\n    myCartItemCount\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  \n  mutation AddToCart($input: AddToCartInput!) {\n    addToCart(input: $input) {\n      ...CartFields\n    }\n  }\n"): (typeof documents)["\n  \n  mutation AddToCart($input: AddToCartInput!) {\n    addToCart(input: $input) {\n      ...CartFields\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  \n  mutation UpdateCartItemQty($input: UpdateCartItemQtyInput!) {\n    updateCartItemQty(input: $input) {\n      ...CartFields\n    }\n  }\n"): (typeof documents)["\n  \n  mutation UpdateCartItemQty($input: UpdateCartItemQtyInput!) {\n    updateCartItemQty(input: $input) {\n      ...CartFields\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  \n  mutation RemoveFromCart($input: RemoveCartItemInput!) {\n    removeFromCart(input: $input) {\n      ...CartFields\n    }\n  }\n"): (typeof documents)["\n  \n  mutation RemoveFromCart($input: RemoveCartItemInput!) {\n    removeFromCart(input: $input) {\n      ...CartFields\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  \n  mutation ClearCart {\n    clearCart {\n      ...CartFields\n    }\n  }\n"): (typeof documents)["\n  \n  mutation ClearCart {\n    clearCart {\n      ...CartFields\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  fragment CategoryFields on Category {\n    id\n    name\n    slug\n    description\n    parentId\n    imageUrl\n    iconUrl\n    displayOrder\n    isActive\n    createdAt\n    updatedAt\n  }\n"): (typeof documents)["\n  fragment CategoryFields on Category {\n    id\n    name\n    slug\n    description\n    parentId\n    imageUrl\n    iconUrl\n    displayOrder\n    isActive\n    createdAt\n    updatedAt\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  \n  query GetCategories {\n    categories {\n      ...CategoryFields\n    }\n  }\n"): (typeof documents)["\n  \n  query GetCategories {\n    categories {\n      ...CategoryFields\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query GetShopFilterCategories {\n    shopFilterCategories {\n      id\n      name\n      slug\n      displayOrder\n      productCount\n    }\n  }\n"): (typeof documents)["\n  query GetShopFilterCategories {\n    shopFilterCategories {\n      id\n      name\n      slug\n      displayOrder\n      productCount\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  \n  query GetAdminCategoriesPaginated(\n    $page: Int\n    $pageSize: Int\n    $search: String\n  ) {\n    adminCategoriesPaginated(page: $page, pageSize: $pageSize, search: $search) {\n      items {\n        ...CategoryFields\n      }\n      totalCount\n      totalPages\n      currentPage\n      pageSize\n    }\n  }\n"): (typeof documents)["\n  \n  query GetAdminCategoriesPaginated(\n    $page: Int\n    $pageSize: Int\n    $search: String\n  ) {\n    adminCategoriesPaginated(page: $page, pageSize: $pageSize, search: $search) {\n      items {\n        ...CategoryFields\n      }\n      totalCount\n      totalPages\n      currentPage\n      pageSize\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query GetCategoryChildren($parentId: ID, $search: String, $limit: Int) {\n    categoryChildren(parentId: $parentId, search: $search, limit: $limit) {\n      id\n      name\n      slug\n      parentId\n      hasChildren\n    }\n  }\n"): (typeof documents)["\n  query GetCategoryChildren($parentId: ID, $search: String, $limit: Int) {\n    categoryChildren(parentId: $parentId, search: $search, limit: $limit) {\n      id\n      name\n      slug\n      parentId\n      hasChildren\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query GetCategoryAncestors($id: ID!) {\n    categoryAncestors(id: $id) {\n      id\n      name\n      slug\n      parentId\n      hasChildren\n    }\n  }\n"): (typeof documents)["\n  query GetCategoryAncestors($id: ID!) {\n    categoryAncestors(id: $id) {\n      id\n      name\n      slug\n      parentId\n      hasChildren\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  \n  query GetCategory($id: ID!) {\n    category(id: $id) {\n      ...CategoryFields\n    }\n  }\n"): (typeof documents)["\n  \n  query GetCategory($id: ID!) {\n    category(id: $id) {\n      ...CategoryFields\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  \n  query GetPublicCategoryBySlug($slug: String!) {\n    publicCategoryBySlug(slug: $slug) {\n      ...CategoryFields\n      children {\n        ...CategoryFields\n      }\n    }\n  }\n"): (typeof documents)["\n  \n  query GetPublicCategoryBySlug($slug: String!) {\n    publicCategoryBySlug(slug: $slug) {\n      ...CategoryFields\n      children {\n        ...CategoryFields\n      }\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  \n  mutation CreateCategory($createCategoryInput: CreateCategoryInput!) {\n    createCategory(createCategoryInput: $createCategoryInput) {\n      ...CategoryFields\n    }\n  }\n"): (typeof documents)["\n  \n  mutation CreateCategory($createCategoryInput: CreateCategoryInput!) {\n    createCategory(createCategoryInput: $createCategoryInput) {\n      ...CategoryFields\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  \n  mutation UpdateCategory($updateCategoryInput: UpdateCategoryInput!) {\n    updateCategory(updateCategoryInput: $updateCategoryInput) {\n      ...CategoryFields\n    }\n  }\n"): (typeof documents)["\n  \n  mutation UpdateCategory($updateCategoryInput: UpdateCategoryInput!) {\n    updateCategory(updateCategoryInput: $updateCategoryInput) {\n      ...CategoryFields\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  \n  mutation RemoveCategory($id: ID!) {\n    removeCategory(id: $id) {\n      ...CategoryFields\n    }\n  }\n"): (typeof documents)["\n  \n  mutation RemoveCategory($id: ID!) {\n    removeCategory(id: $id) {\n      ...CategoryFields\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation UpdateCategoryTree($input: UpdateCategoryTreeInput!) {\n    updateCategoryTree(updateCategoryTreeInput: $input)\n  }\n"): (typeof documents)["\n  mutation UpdateCategoryTree($input: UpdateCategoryTreeInput!) {\n    updateCategoryTree(updateCategoryTreeInput: $input)\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  fragment CouponFields on Coupon {\n    id\n    storeId\n    code\n    name\n    description\n    discountType\n    discountValue\n    minimumPurchaseAmount\n    maximumDiscountAmount\n    usageLimit\n    usageLimitPerUser\n    validFrom\n    validUntil\n    isActive\n    redemptionCount\n    createdAt\n    updatedAt\n  }\n"): (typeof documents)["\n  fragment CouponFields on Coupon {\n    id\n    storeId\n    code\n    name\n    description\n    discountType\n    discountValue\n    minimumPurchaseAmount\n    maximumDiscountAmount\n    usageLimit\n    usageLimitPerUser\n    validFrom\n    validUntil\n    isActive\n    redemptionCount\n    createdAt\n    updatedAt\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query GetAdminCoupons($search: String, $status: String) {\n    adminCoupons(search: $search, status: $status) {\n      ...CouponFields\n    }\n  }\n"): (typeof documents)["\n  query GetAdminCoupons($search: String, $status: String) {\n    adminCoupons(search: $search, status: $status) {\n      ...CouponFields\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query GetAdminCoupon($id: ID!) {\n    adminCoupon(id: $id) {\n      ...CouponFields\n    }\n  }\n"): (typeof documents)["\n  query GetAdminCoupon($id: ID!) {\n    adminCoupon(id: $id) {\n      ...CouponFields\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation CreateCoupon($input: CreateCouponInput!) {\n    createCoupon(input: $input) {\n      ...CouponFields\n    }\n  }\n"): (typeof documents)["\n  mutation CreateCoupon($input: CreateCouponInput!) {\n    createCoupon(input: $input) {\n      ...CouponFields\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation UpdateCoupon($input: UpdateCouponInput!) {\n    updateCoupon(input: $input) {\n      ...CouponFields\n    }\n  }\n"): (typeof documents)["\n  mutation UpdateCoupon($input: UpdateCouponInput!) {\n    updateCoupon(input: $input) {\n      ...CouponFields\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation RemoveCoupon($id: ID!) {\n    removeCoupon(id: $id) {\n      id\n    }\n  }\n"): (typeof documents)["\n  mutation RemoveCoupon($id: ID!) {\n    removeCoupon(id: $id) {\n      id\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation ValidateCoupon($input: ValidateCouponInput!) {\n    validateCoupon(input: $input) {\n      isValid\n      reason\n      discountAmount\n      subtotal\n      subtotalInclTax\n      discountInclTax\n      customerTotal\n      coupon {\n        ...CouponFields\n      }\n    }\n  }\n"): (typeof documents)["\n  mutation ValidateCoupon($input: ValidateCouponInput!) {\n    validateCoupon(input: $input) {\n      isValid\n      reason\n      discountAmount\n      subtotal\n      subtotalInclTax\n      discountInclTax\n      customerTotal\n      coupon {\n        ...CouponFields\n      }\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  fragment AdminCustomerFields on AdminCustomer {\n    id\n    userId\n    name\n    email\n    phone\n    status\n    emailVerifiedAt\n    lastLoginAt\n    userCreatedAt\n    marketingOptIn\n    preferredCurrency\n    createdAt\n    updatedAt\n    deletedAt\n  }\n"): (typeof documents)["\n  fragment AdminCustomerFields on AdminCustomer {\n    id\n    userId\n    name\n    email\n    phone\n    status\n    emailVerifiedAt\n    lastLoginAt\n    userCreatedAt\n    marketingOptIn\n    preferredCurrency\n    createdAt\n    updatedAt\n    deletedAt\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  \n  query GetAdminCustomers(\n    $status: String\n    $search: String\n    $includeDeleted: Boolean\n    $page: Int\n    $pageSize: Int\n  ) {\n    adminCustomers(\n      status: $status\n      search: $search\n      includeDeleted: $includeDeleted\n      page: $page\n      pageSize: $pageSize\n    ) {\n      items {\n        ...AdminCustomerFields\n      }\n      totalCount\n      totalPages\n      currentPage\n      pageSize\n    }\n  }\n"): (typeof documents)["\n  \n  query GetAdminCustomers(\n    $status: String\n    $search: String\n    $includeDeleted: Boolean\n    $page: Int\n    $pageSize: Int\n  ) {\n    adminCustomers(\n      status: $status\n      search: $search\n      includeDeleted: $includeDeleted\n      page: $page\n      pageSize: $pageSize\n    ) {\n      items {\n        ...AdminCustomerFields\n      }\n      totalCount\n      totalPages\n      currentPage\n      pageSize\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  \n  query GetAdminCustomer($id: ID!) {\n    adminCustomer(id: $id) {\n      ...AdminCustomerFields\n    }\n  }\n"): (typeof documents)["\n  \n  query GetAdminCustomer($id: ID!) {\n    adminCustomer(id: $id) {\n      ...AdminCustomerFields\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  \n  mutation UpdateCustomer($input: UpdateCustomerInput!) {\n    updateCustomer(input: $input) {\n      ...AdminCustomerFields\n    }\n  }\n"): (typeof documents)["\n  \n  mutation UpdateCustomer($input: UpdateCustomerInput!) {\n    updateCustomer(input: $input) {\n      ...AdminCustomerFields\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  \n  mutation SoftDeleteCustomer($id: ID!) {\n    softDeleteCustomer(id: $id) {\n      ...AdminCustomerFields\n    }\n  }\n"): (typeof documents)["\n  \n  mutation SoftDeleteCustomer($id: ID!) {\n    softDeleteCustomer(id: $id) {\n      ...AdminCustomerFields\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  \n  mutation RestoreCustomer($id: ID!) {\n    restoreCustomer(id: $id) {\n      ...AdminCustomerFields\n    }\n  }\n"): (typeof documents)["\n  \n  mutation RestoreCustomer($id: ID!) {\n    restoreCustomer(id: $id) {\n      ...AdminCustomerFields\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query GetEmailSetting {\n    emailSetting {\n      id\n      mailer\n      host\n      port\n      username\n      encryption\n      senderName\n      senderEmail\n      localDomain\n      isConfigured\n      hasPassword\n      updatedAt\n    }\n  }\n"): (typeof documents)["\n  query GetEmailSetting {\n    emailSetting {\n      id\n      mailer\n      host\n      port\n      username\n      encryption\n      senderName\n      senderEmail\n      localDomain\n      isConfigured\n      hasPassword\n      updatedAt\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation UpdateEmailSetting($input: UpdateEmailSettingInput!) {\n    updateEmailSetting(input: $input) {\n      id\n      mailer\n      host\n      port\n      username\n      encryption\n      senderName\n      senderEmail\n      localDomain\n      isConfigured\n      hasPassword\n      updatedAt\n    }\n  }\n"): (typeof documents)["\n  mutation UpdateEmailSetting($input: UpdateEmailSettingInput!) {\n    updateEmailSetting(input: $input) {\n      id\n      mailer\n      host\n      port\n      username\n      encryption\n      senderName\n      senderEmail\n      localDomain\n      isConfigured\n      hasPassword\n      updatedAt\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query GetEmailTemplates {\n    emailTemplates {\n      id\n      key\n      name\n      description\n      category\n      subject\n      variables\n      isEnabled\n      isSystem\n      updatedAt\n    }\n  }\n"): (typeof documents)["\n  query GetEmailTemplates {\n    emailTemplates {\n      id\n      key\n      name\n      description\n      category\n      subject\n      variables\n      isEnabled\n      isSystem\n      updatedAt\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query GetEmailTemplate($id: ID!) {\n    emailTemplate(id: $id) {\n      id\n      key\n      name\n      description\n      category\n      subject\n      htmlBody\n      textBody\n      variables\n      isEnabled\n      isSystem\n      updatedAt\n    }\n  }\n"): (typeof documents)["\n  query GetEmailTemplate($id: ID!) {\n    emailTemplate(id: $id) {\n      id\n      key\n      name\n      description\n      category\n      subject\n      htmlBody\n      textBody\n      variables\n      isEnabled\n      isSystem\n      updatedAt\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation UpdateEmailTemplate($input: UpdateEmailTemplateInput!) {\n    updateEmailTemplate(input: $input) {\n      id\n      key\n      name\n      description\n      category\n      subject\n      htmlBody\n      textBody\n      variables\n      isEnabled\n      isSystem\n      updatedAt\n    }\n  }\n"): (typeof documents)["\n  mutation UpdateEmailTemplate($input: UpdateEmailTemplateInput!) {\n    updateEmailTemplate(input: $input) {\n      id\n      key\n      name\n      description\n      category\n      subject\n      htmlBody\n      textBody\n      variables\n      isEnabled\n      isSystem\n      updatedAt\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation SendTestEmail($input: SendTestEmailInput!) {\n    sendTestEmail(input: $input) {\n      success\n      message\n    }\n  }\n"): (typeof documents)["\n  mutation SendTestEmail($input: SendTestEmailInput!) {\n    sendTestEmail(input: $input) {\n      success\n      message\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  fragment ImageFields on Image {\n    id\n    provider\n    externalId\n    url\n    format\n    width\n    height\n    sizeBytes\n    ownerType\n    ownerId\n    purpose\n    alt\n    createdAt\n  }\n"): (typeof documents)["\n  fragment ImageFields on Image {\n    id\n    provider\n    externalId\n    url\n    format\n    width\n    height\n    sizeBytes\n    ownerType\n    ownerId\n    purpose\n    alt\n    createdAt\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation PresignImageUpload($presignUploadInput: PresignUploadInput!) {\n    presignImageUpload(presignUploadInput: $presignUploadInput) {\n      uploadUrl\n      method\n      fields\n      externalId\n      expiresIn\n      provider\n    }\n  }\n"): (typeof documents)["\n  mutation PresignImageUpload($presignUploadInput: PresignUploadInput!) {\n    presignImageUpload(presignUploadInput: $presignUploadInput) {\n      uploadUrl\n      method\n      fields\n      externalId\n      expiresIn\n      provider\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  \n  mutation ConfirmImageUpload($confirmUploadInput: ConfirmUploadInput!) {\n    confirmImageUpload(confirmUploadInput: $confirmUploadInput) {\n      ...ImageFields\n    }\n  }\n"): (typeof documents)["\n  \n  mutation ConfirmImageUpload($confirmUploadInput: ConfirmUploadInput!) {\n    confirmImageUpload(confirmUploadInput: $confirmUploadInput) {\n      ...ImageFields\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  \n  mutation DeleteImage($id: ID!) {\n    deleteImage(id: $id) {\n      ...ImageFields\n    }\n  }\n"): (typeof documents)["\n  \n  mutation DeleteImage($id: ID!) {\n    deleteImage(id: $id) {\n      ...ImageFields\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  fragment InventoryFields on Inventory {\n    id\n    variantId\n    warehouseId\n    quantityAvailable\n    quantityReserved\n    quantityOnHand\n    reorderPoint\n    reorderQuantity\n    lastCountedAt\n    createdAt\n    updatedAt\n    stockState\n    warehouse {\n      id\n      name\n      code\n      isDefault\n      storeId\n    }\n    variant {\n      id\n      productId\n      sku\n      imageUrl\n      status\n      attributes {\n        attributeId\n        attributeValueId\n        attributeName\n        attributeSlug\n        value\n        valueSlug\n      }\n    }\n    product {\n      id\n      name\n      slug\n      storeId\n    }\n  }\n"): (typeof documents)["\n  fragment InventoryFields on Inventory {\n    id\n    variantId\n    warehouseId\n    quantityAvailable\n    quantityReserved\n    quantityOnHand\n    reorderPoint\n    reorderQuantity\n    lastCountedAt\n    createdAt\n    updatedAt\n    stockState\n    warehouse {\n      id\n      name\n      code\n      isDefault\n      storeId\n    }\n    variant {\n      id\n      productId\n      sku\n      imageUrl\n      status\n      attributes {\n        attributeId\n        attributeValueId\n        attributeName\n        attributeSlug\n        value\n        valueSlug\n      }\n    }\n    product {\n      id\n      name\n      slug\n      storeId\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  fragment InventoryMovementFields on InventoryMovement {\n    id\n    inventoryId\n    variantId\n    warehouseId\n    movementType\n    quantityChange\n    quantityBefore\n    quantityAfter\n    referenceType\n    referenceId\n    notes\n    createdById\n    createdAt\n  }\n"): (typeof documents)["\n  fragment InventoryMovementFields on InventoryMovement {\n    id\n    inventoryId\n    variantId\n    warehouseId\n    movementType\n    quantityChange\n    quantityBefore\n    quantityAfter\n    referenceType\n    referenceId\n    notes\n    createdById\n    createdAt\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  \n  query GetMyInventory(\n    $storeId: ID\n    $warehouseId: ID\n    $productId: ID\n    $lowStockOnly: Boolean\n    $search: String\n  ) {\n    myInventory(\n      storeId: $storeId\n      warehouseId: $warehouseId\n      productId: $productId\n      lowStockOnly: $lowStockOnly\n      search: $search\n    ) {\n      ...InventoryFields\n    }\n  }\n"): (typeof documents)["\n  \n  query GetMyInventory(\n    $storeId: ID\n    $warehouseId: ID\n    $productId: ID\n    $lowStockOnly: Boolean\n    $search: String\n  ) {\n    myInventory(\n      storeId: $storeId\n      warehouseId: $warehouseId\n      productId: $productId\n      lowStockOnly: $lowStockOnly\n      search: $search\n    ) {\n      ...InventoryFields\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  \n  query GetMyInventoryByVariant($variantId: ID!, $warehouseId: ID) {\n    myInventoryByVariant(variantId: $variantId, warehouseId: $warehouseId) {\n      ...InventoryFields\n    }\n  }\n"): (typeof documents)["\n  \n  query GetMyInventoryByVariant($variantId: ID!, $warehouseId: ID) {\n    myInventoryByVariant(variantId: $variantId, warehouseId: $warehouseId) {\n      ...InventoryFields\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  \n  query GetMyInventoryMovements(\n    $variantId: ID\n    $warehouseId: ID\n    $limit: Int\n  ) {\n    myInventoryMovements(\n      variantId: $variantId\n      warehouseId: $warehouseId\n      limit: $limit\n    ) {\n      ...InventoryMovementFields\n    }\n  }\n"): (typeof documents)["\n  \n  query GetMyInventoryMovements(\n    $variantId: ID\n    $warehouseId: ID\n    $limit: Int\n  ) {\n    myInventoryMovements(\n      variantId: $variantId\n      warehouseId: $warehouseId\n      limit: $limit\n    ) {\n      ...InventoryMovementFields\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  \n  query GetAdminInventoryByProduct($productId: ID!) {\n    adminInventoryByProduct(productId: $productId) {\n      ...InventoryFields\n    }\n  }\n"): (typeof documents)["\n  \n  query GetAdminInventoryByProduct($productId: ID!) {\n    adminInventoryByProduct(productId: $productId) {\n      ...InventoryFields\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  \n  mutation AdjustMyInventory($adjustInventoryInput: AdjustInventoryInput!) {\n    adjustMyInventory(adjustInventoryInput: $adjustInventoryInput) {\n      ...InventoryFields\n    }\n  }\n"): (typeof documents)["\n  \n  mutation AdjustMyInventory($adjustInventoryInput: AdjustInventoryInput!) {\n    adjustMyInventory(adjustInventoryInput: $adjustInventoryInput) {\n      ...InventoryFields\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  \n  mutation SetMyReorderPoint($setReorderPointInput: SetReorderPointInput!) {\n    setMyReorderPoint(setReorderPointInput: $setReorderPointInput) {\n      ...InventoryFields\n    }\n  }\n"): (typeof documents)["\n  \n  mutation SetMyReorderPoint($setReorderPointInput: SetReorderPointInput!) {\n    setMyReorderPoint(setReorderPointInput: $setReorderPointInput) {\n      ...InventoryFields\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  fragment MenuFields on Menu {\n    id\n    name\n    location\n    isActive\n    items\n    createdAt\n    updatedAt\n  }\n"): (typeof documents)["\n  fragment MenuFields on Menu {\n    id\n    name\n    location\n    isActive\n    items\n    createdAt\n    updatedAt\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  \n  query GetPublicMenu($location: MenuLocation!) {\n    publicMenu(location: $location) {\n      ...MenuFields\n    }\n  }\n"): (typeof documents)["\n  \n  query GetPublicMenu($location: MenuLocation!) {\n    publicMenu(location: $location) {\n      ...MenuFields\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  \n  query GetAdminMenus {\n    adminMenus {\n      ...MenuFields\n    }\n  }\n"): (typeof documents)["\n  \n  query GetAdminMenus {\n    adminMenus {\n      ...MenuFields\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  \n  query GetAdminMenu($location: MenuLocation!) {\n    adminMenu(location: $location) {\n      ...MenuFields\n    }\n  }\n"): (typeof documents)["\n  \n  query GetAdminMenu($location: MenuLocation!) {\n    adminMenu(location: $location) {\n      ...MenuFields\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  \n  mutation UpsertMenu($upsertMenuInput: UpsertMenuInput!) {\n    upsertMenu(upsertMenuInput: $upsertMenuInput) {\n      ...MenuFields\n    }\n  }\n"): (typeof documents)["\n  \n  mutation UpsertMenu($upsertMenuInput: UpsertMenuInput!) {\n    upsertMenu(upsertMenuInput: $upsertMenuInput) {\n      ...MenuFields\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  \n  mutation SetMenuActive($location: MenuLocation!, $isActive: Boolean!) {\n    setMenuActive(location: $location, isActive: $isActive) {\n      ...MenuFields\n    }\n  }\n"): (typeof documents)["\n  \n  mutation SetMenuActive($location: MenuLocation!, $isActive: Boolean!) {\n    setMenuActive(location: $location, isActive: $isActive) {\n      ...MenuFields\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  \n  mutation RemoveMenu($location: MenuLocation!) {\n    removeMenu(location: $location) {\n      ...MenuFields\n    }\n  }\n"): (typeof documents)["\n  \n  mutation RemoveMenu($location: MenuLocation!) {\n    removeMenu(location: $location) {\n      ...MenuFields\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  fragment NewsletterFields on NewsletterSubscription {\n    id\n    email\n    source\n    status\n    unsubscribedAt\n    createdAt\n    updatedAt\n  }\n"): (typeof documents)["\n  fragment NewsletterFields on NewsletterSubscription {\n    id\n    email\n    source\n    status\n    unsubscribedAt\n    createdAt\n    updatedAt\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation SubscribeToNewsletter($input: SubscribeNewsletterInput!) {\n    subscribeToNewsletter(input: $input) {\n      ok\n      message\n    }\n  }\n"): (typeof documents)["\n  mutation SubscribeToNewsletter($input: SubscribeNewsletterInput!) {\n    subscribeToNewsletter(input: $input) {\n      ok\n      message\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  \n  query GetAdminNewsletterSubscriptions(\n    $status: NewsletterStatus\n    $page: Int\n    $pageSize: Int\n    $search: String\n  ) {\n    adminNewsletterSubscriptions(\n      status: $status\n      page: $page\n      pageSize: $pageSize\n      search: $search\n    ) {\n      items {\n        ...NewsletterFields\n      }\n      totalCount\n      totalPages\n      currentPage\n      pageSize\n    }\n  }\n"): (typeof documents)["\n  \n  query GetAdminNewsletterSubscriptions(\n    $status: NewsletterStatus\n    $page: Int\n    $pageSize: Int\n    $search: String\n  ) {\n    adminNewsletterSubscriptions(\n      status: $status\n      page: $page\n      pageSize: $pageSize\n      search: $search\n    ) {\n      items {\n        ...NewsletterFields\n      }\n      totalCount\n      totalPages\n      currentPage\n      pageSize\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  \n  mutation UnsubscribeNewsletter($id: ID!) {\n    unsubscribeNewsletter(id: $id) {\n      ...NewsletterFields\n    }\n  }\n"): (typeof documents)["\n  \n  mutation UnsubscribeNewsletter($id: ID!) {\n    unsubscribeNewsletter(id: $id) {\n      ...NewsletterFields\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  fragment OrderAddressFields on OrderAddressSnapshot {\n    id\n    firstName\n    lastName\n    phone\n    addressLine1\n    addressLine2\n    city\n    state\n    postalCode\n    countryCode\n  }\n"): (typeof documents)["\n  fragment OrderAddressFields on OrderAddressSnapshot {\n    id\n    firstName\n    lastName\n    phone\n    addressLine1\n    addressLine2\n    city\n    state\n    postalCode\n    countryCode\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  fragment OrderItemFields on OrderItem {\n    id\n    orderId\n    sellerOrderId\n    productId\n    variantId\n    storeId\n    sku\n    name\n    variantName\n    quantity\n    unitPrice\n    totalPrice\n    taxAmount\n    discountAmount\n    attributesSnapshot {\n      attributeName\n      value\n    }\n    imageUrlSnapshot\n    createdAt\n  }\n"): (typeof documents)["\n  fragment OrderItemFields on OrderItem {\n    id\n    orderId\n    sellerOrderId\n    productId\n    variantId\n    storeId\n    sku\n    name\n    variantName\n    quantity\n    unitPrice\n    totalPrice\n    taxAmount\n    discountAmount\n    attributesSnapshot {\n      attributeName\n      value\n    }\n    imageUrlSnapshot\n    createdAt\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  fragment StatusHistoryFields on OrderStatusHistoryEntry {\n    id\n    fromStatus\n    toStatus\n    changedById\n    notes\n    createdAt\n  }\n"): (typeof documents)["\n  fragment StatusHistoryFields on OrderStatusHistoryEntry {\n    id\n    fromStatus\n    toStatus\n    changedById\n    notes\n    createdAt\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  \n  \n  \n  fragment SellerOrderFields on SellerOrder {\n    id\n    orderId\n    sellerId\n    storeId\n    orderNumber\n    status\n    paymentStatus\n    payoutStatus\n    subtotal\n    taxAmount\n    shippingAmount\n    discountAmount\n    commissionAmount\n    payoutAmount\n    currencyCode\n    packedAt\n    shippedAt\n    deliveredAt\n    cancelledAt\n    createdAt\n    updatedAt\n    itemCount\n    storeName\n    items {\n      ...OrderItemFields\n    }\n    statusHistory {\n      ...StatusHistoryFields\n    }\n    parentOrderNumber\n    shippingAddress {\n      ...OrderAddressFields\n    }\n    customerName\n  }\n"): (typeof documents)["\n  \n  \n  \n  fragment SellerOrderFields on SellerOrder {\n    id\n    orderId\n    sellerId\n    storeId\n    orderNumber\n    status\n    paymentStatus\n    payoutStatus\n    subtotal\n    taxAmount\n    shippingAmount\n    discountAmount\n    commissionAmount\n    payoutAmount\n    currencyCode\n    packedAt\n    shippedAt\n    deliveredAt\n    cancelledAt\n    createdAt\n    updatedAt\n    itemCount\n    storeName\n    items {\n      ...OrderItemFields\n    }\n    statusHistory {\n      ...StatusHistoryFields\n    }\n    parentOrderNumber\n    shippingAddress {\n      ...OrderAddressFields\n    }\n    customerName\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  \n  \n  \n  \n  fragment OrderFields on Order {\n    id\n    orderNumber\n    customerId\n    status\n    paymentStatus\n    paymentMethod\n    subtotal\n    taxAmount\n    shippingAmount\n    discountAmount\n    totalAmount\n    currencyCode\n    customerNotes\n    placedAt\n    cancelledAt\n    deliveredAt\n    createdAt\n    updatedAt\n    itemCount\n    items {\n      ...OrderItemFields\n    }\n    sellerOrders {\n      ...SellerOrderFields\n    }\n    statusHistory {\n      ...StatusHistoryFields\n    }\n    shippingAddress {\n      ...OrderAddressFields\n    }\n    billingAddress {\n      ...OrderAddressFields\n    }\n  }\n"): (typeof documents)["\n  \n  \n  \n  \n  fragment OrderFields on Order {\n    id\n    orderNumber\n    customerId\n    status\n    paymentStatus\n    paymentMethod\n    subtotal\n    taxAmount\n    shippingAmount\n    discountAmount\n    totalAmount\n    currencyCode\n    customerNotes\n    placedAt\n    cancelledAt\n    deliveredAt\n    createdAt\n    updatedAt\n    itemCount\n    items {\n      ...OrderItemFields\n    }\n    sellerOrders {\n      ...SellerOrderFields\n    }\n    statusHistory {\n      ...StatusHistoryFields\n    }\n    shippingAddress {\n      ...OrderAddressFields\n    }\n    billingAddress {\n      ...OrderAddressFields\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  \n  query GetMyOrders($status: OrderStatus, $page: Int, $pageSize: Int) {\n    myOrders(status: $status, page: $page, pageSize: $pageSize) {\n      items {\n        ...OrderFields\n      }\n      totalCount\n      totalPages\n      currentPage\n      pageSize\n    }\n  }\n"): (typeof documents)["\n  \n  query GetMyOrders($status: OrderStatus, $page: Int, $pageSize: Int) {\n    myOrders(status: $status, page: $page, pageSize: $pageSize) {\n      items {\n        ...OrderFields\n      }\n      totalCount\n      totalPages\n      currentPage\n      pageSize\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  \n  query GetMyOrder($id: ID!) {\n    myOrder(id: $id) {\n      ...OrderFields\n    }\n  }\n"): (typeof documents)["\n  \n  query GetMyOrder($id: ID!) {\n    myOrder(id: $id) {\n      ...OrderFields\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  \n  mutation PlaceOrder($input: PlaceOrderInput!) {\n    placeOrder(input: $input) {\n      ...OrderFields\n    }\n  }\n"): (typeof documents)["\n  \n  mutation PlaceOrder($input: PlaceOrderInput!) {\n    placeOrder(input: $input) {\n      ...OrderFields\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  \n  mutation CancelMyOrder($id: ID!, $notes: String) {\n    cancelMyOrder(id: $id, notes: $notes) {\n      ...OrderFields\n    }\n  }\n"): (typeof documents)["\n  \n  mutation CancelMyOrder($id: ID!, $notes: String) {\n    cancelMyOrder(id: $id, notes: $notes) {\n      ...OrderFields\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  \n  query GetMySellerOrders($status: OrderStatus, $page: Int, $pageSize: Int) {\n    mySellerOrders(status: $status, page: $page, pageSize: $pageSize) {\n      items {\n        ...SellerOrderFields\n      }\n      totalCount\n      totalPages\n      currentPage\n      pageSize\n    }\n  }\n"): (typeof documents)["\n  \n  query GetMySellerOrders($status: OrderStatus, $page: Int, $pageSize: Int) {\n    mySellerOrders(status: $status, page: $page, pageSize: $pageSize) {\n      items {\n        ...SellerOrderFields\n      }\n      totalCount\n      totalPages\n      currentPage\n      pageSize\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  \n  query GetMySellerOrder($id: ID!) {\n    mySellerOrder(id: $id) {\n      ...SellerOrderFields\n    }\n  }\n"): (typeof documents)["\n  \n  query GetMySellerOrder($id: ID!) {\n    mySellerOrder(id: $id) {\n      ...SellerOrderFields\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  \n  mutation UpdateSellerOrderStatus($input: UpdateSellerOrderStatusInput!) {\n    updateSellerOrderStatus(input: $input) {\n      ...SellerOrderFields\n    }\n  }\n"): (typeof documents)["\n  \n  mutation UpdateSellerOrderStatus($input: UpdateSellerOrderStatusInput!) {\n    updateSellerOrderStatus(input: $input) {\n      ...SellerOrderFields\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  fragment PageFields on Page {\n    id\n    slug\n    title\n    metaTitle\n    metaDesc\n    status\n    blocks\n    isSystem\n    publishedAt\n    createdAt\n    updatedAt\n  }\n"): (typeof documents)["\n  fragment PageFields on Page {\n    id\n    slug\n    title\n    metaTitle\n    metaDesc\n    status\n    blocks\n    isSystem\n    publishedAt\n    createdAt\n    updatedAt\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  \n  query GetPublicPage($slug: String!) {\n    publicPage(slug: $slug) {\n      ...PageFields\n    }\n  }\n"): (typeof documents)["\n  \n  query GetPublicPage($slug: String!) {\n    publicPage(slug: $slug) {\n      ...PageFields\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  \n  query GetAdminPages($status: PageStatus) {\n    adminPages(status: $status) {\n      ...PageFields\n    }\n  }\n"): (typeof documents)["\n  \n  query GetAdminPages($status: PageStatus) {\n    adminPages(status: $status) {\n      ...PageFields\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  \n  query GetAdminPagesPaginated(\n    $status: PageStatus\n    $page: Int\n    $pageSize: Int\n    $search: String\n  ) {\n    adminPagesPaginated(\n      status: $status\n      page: $page\n      pageSize: $pageSize\n      search: $search\n    ) {\n      items {\n        ...PageFields\n      }\n      totalCount\n      totalPages\n      currentPage\n      pageSize\n    }\n  }\n"): (typeof documents)["\n  \n  query GetAdminPagesPaginated(\n    $status: PageStatus\n    $page: Int\n    $pageSize: Int\n    $search: String\n  ) {\n    adminPagesPaginated(\n      status: $status\n      page: $page\n      pageSize: $pageSize\n      search: $search\n    ) {\n      items {\n        ...PageFields\n      }\n      totalCount\n      totalPages\n      currentPage\n      pageSize\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  \n  query GetPage($id: ID!) {\n    page(id: $id) {\n      ...PageFields\n    }\n  }\n"): (typeof documents)["\n  \n  query GetPage($id: ID!) {\n    page(id: $id) {\n      ...PageFields\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  \n  mutation CreatePage($createPageInput: CreatePageInput!) {\n    createPage(createPageInput: $createPageInput) {\n      ...PageFields\n    }\n  }\n"): (typeof documents)["\n  \n  mutation CreatePage($createPageInput: CreatePageInput!) {\n    createPage(createPageInput: $createPageInput) {\n      ...PageFields\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  \n  mutation UpdatePage($updatePageInput: UpdatePageInput!) {\n    updatePage(updatePageInput: $updatePageInput) {\n      ...PageFields\n    }\n  }\n"): (typeof documents)["\n  \n  mutation UpdatePage($updatePageInput: UpdatePageInput!) {\n    updatePage(updatePageInput: $updatePageInput) {\n      ...PageFields\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  \n  mutation SetPageStatus($setPageStatusInput: SetPageStatusInput!) {\n    setPageStatus(setPageStatusInput: $setPageStatusInput) {\n      ...PageFields\n    }\n  }\n"): (typeof documents)["\n  \n  mutation SetPageStatus($setPageStatusInput: SetPageStatusInput!) {\n    setPageStatus(setPageStatusInput: $setPageStatusInput) {\n      ...PageFields\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  \n  mutation RemovePage($id: ID!) {\n    removePage(id: $id) {\n      ...PageFields\n    }\n  }\n"): (typeof documents)["\n  \n  mutation RemovePage($id: ID!) {\n    removePage(id: $id) {\n      ...PageFields\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query AdminPaymentGateways {\n    adminPaymentGateways {\n      id\n      gateway\n      displayName\n      description\n      logoUrl\n      isEnabled\n      isDefault\n      displayOrder\n      supportedMethods\n      sandboxMode\n      processingFee\n      processingFeeType\n      paymentType\n      instructions\n      webhookUrl\n      credentialHints\n      hasCredentials\n      createdAt\n      updatedAt\n    }\n  }\n"): (typeof documents)["\n  query AdminPaymentGateways {\n    adminPaymentGateways {\n      id\n      gateway\n      displayName\n      description\n      logoUrl\n      isEnabled\n      isDefault\n      displayOrder\n      supportedMethods\n      sandboxMode\n      processingFee\n      processingFeeType\n      paymentType\n      instructions\n      webhookUrl\n      credentialHints\n      hasCredentials\n      createdAt\n      updatedAt\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query AdminPaymentGateway($id: ID!) {\n    adminPaymentGateway(id: $id) {\n      id\n      gateway\n      displayName\n      description\n      logoUrl\n      isEnabled\n      isDefault\n      displayOrder\n      supportedMethods\n      sandboxMode\n      processingFee\n      processingFeeType\n      paymentType\n      instructions\n      webhookUrl\n      credentialHints\n      hasCredentials\n      createdAt\n      updatedAt\n    }\n  }\n"): (typeof documents)["\n  query AdminPaymentGateway($id: ID!) {\n    adminPaymentGateway(id: $id) {\n      id\n      gateway\n      displayName\n      description\n      logoUrl\n      isEnabled\n      isDefault\n      displayOrder\n      supportedMethods\n      sandboxMode\n      processingFee\n      processingFeeType\n      paymentType\n      instructions\n      webhookUrl\n      credentialHints\n      hasCredentials\n      createdAt\n      updatedAt\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation CreatePaymentGatewayConfig($input: CreateGatewayConfigInput!) {\n    createPaymentGatewayConfig(input: $input) {\n      id\n      gateway\n      displayName\n      isEnabled\n      isDefault\n    }\n  }\n"): (typeof documents)["\n  mutation CreatePaymentGatewayConfig($input: CreateGatewayConfigInput!) {\n    createPaymentGatewayConfig(input: $input) {\n      id\n      gateway\n      displayName\n      isEnabled\n      isDefault\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation UpdatePaymentGatewayConfig($input: UpdateGatewayConfigInput!) {\n    updatePaymentGatewayConfig(input: $input) {\n      id\n      gateway\n      displayName\n      description\n      logoUrl\n      isEnabled\n      isDefault\n      displayOrder\n      supportedMethods\n      sandboxMode\n      processingFee\n      processingFeeType\n      paymentType\n      instructions\n      webhookUrl\n      credentialHints\n      hasCredentials\n      updatedAt\n    }\n  }\n"): (typeof documents)["\n  mutation UpdatePaymentGatewayConfig($input: UpdateGatewayConfigInput!) {\n    updatePaymentGatewayConfig(input: $input) {\n      id\n      gateway\n      displayName\n      description\n      logoUrl\n      isEnabled\n      isDefault\n      displayOrder\n      supportedMethods\n      sandboxMode\n      processingFee\n      processingFeeType\n      paymentType\n      instructions\n      webhookUrl\n      credentialHints\n      hasCredentials\n      updatedAt\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation TogglePaymentGateway($id: ID!, $enabled: Boolean!) {\n    togglePaymentGateway(id: $id, enabled: $enabled) {\n      id\n      isEnabled\n    }\n  }\n"): (typeof documents)["\n  mutation TogglePaymentGateway($id: ID!, $enabled: Boolean!) {\n    togglePaymentGateway(id: $id, enabled: $enabled) {\n      id\n      isEnabled\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation SetDefaultPaymentGateway($id: ID!) {\n    setDefaultPaymentGateway(id: $id) {\n      id\n      isDefault\n    }\n  }\n"): (typeof documents)["\n  mutation SetDefaultPaymentGateway($id: ID!) {\n    setDefaultPaymentGateway(id: $id) {\n      id\n      isDefault\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query AdminPaymentTransactions(\n    $page: Int = 1\n    $pageSize: Int = 10\n    $gateway: PaymentGateway\n    $status: PaymentTransactionStatus\n  ) {\n    adminPaymentTransactions(\n      page: $page\n      pageSize: $pageSize\n      gateway: $gateway\n      status: $status\n    ) {\n      items {\n        id\n        orderId\n        gateway\n        method\n        amount\n        processingFee\n        currency\n        status\n        gatewayOrderId\n        gatewayPaymentId\n        capturedAt\n        failedAt\n        createdAt\n      }\n      totalCount\n      totalPages\n      currentPage\n      pageSize\n    }\n  }\n"): (typeof documents)["\n  query AdminPaymentTransactions(\n    $page: Int = 1\n    $pageSize: Int = 10\n    $gateway: PaymentGateway\n    $status: PaymentTransactionStatus\n  ) {\n    adminPaymentTransactions(\n      page: $page\n      pageSize: $pageSize\n      gateway: $gateway\n      status: $status\n    ) {\n      items {\n        id\n        orderId\n        gateway\n        method\n        amount\n        processingFee\n        currency\n        status\n        gatewayOrderId\n        gatewayPaymentId\n        capturedAt\n        failedAt\n        createdAt\n      }\n      totalCount\n      totalPages\n      currentPage\n      pageSize\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query ActivePaymentGateways {\n    activePaymentGateways {\n      id\n      gateway\n      displayName\n      description\n      logoUrl\n      isDefault\n      processingFee\n      processingFeeType\n      paymentType\n      supportedMethods\n    }\n  }\n"): (typeof documents)["\n  query ActivePaymentGateways {\n    activePaymentGateways {\n      id\n      gateway\n      displayName\n      description\n      logoUrl\n      isDefault\n      processingFee\n      processingFeeType\n      paymentType\n      supportedMethods\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation InitiateCheckout($input: InitiateCheckoutInput!) {\n    initiateCheckout(input: $input) {\n      orderId\n      orderNumber\n      gateway\n      gatewayPayload\n      requiresPayment\n    }\n  }\n"): (typeof documents)["\n  mutation InitiateCheckout($input: InitiateCheckoutInput!) {\n    initiateCheckout(input: $input) {\n      orderId\n      orderNumber\n      gateway\n      gatewayPayload\n      requiresPayment\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation VerifyPayment($input: VerifyPaymentInput!) {\n    verifyPayment(input: $input) {\n      id\n      orderNumber\n      status\n      paymentStatus\n    }\n  }\n"): (typeof documents)["\n  mutation VerifyPayment($input: VerifyPaymentInput!) {\n    verifyPayment(input: $input) {\n      id\n      orderNumber\n      status\n      paymentStatus\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  fragment ProductImageFields on ProductImage {\n    id\n    productId\n    imageUrl\n    altText\n    displayOrder\n    isPrimary\n    createdAt\n    updatedAt\n  }\n"): (typeof documents)["\n  fragment ProductImageFields on ProductImage {\n    id\n    productId\n    imageUrl\n    altText\n    displayOrder\n    isPrimary\n    createdAt\n    updatedAt\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  \n  fragment ProductSummaryFields on Product {\n    id\n    name\n    slug\n    productType\n    status\n    isFeatured\n    price\n    compareAtPrice\n    priceWithTax\n    createdAt\n    images {\n      ...ProductImageFields\n    }\n  }\n"): (typeof documents)["\n  \n  fragment ProductSummaryFields on Product {\n    id\n    name\n    slug\n    productType\n    status\n    isFeatured\n    price\n    compareAtPrice\n    priceWithTax\n    createdAt\n    images {\n      ...ProductImageFields\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  \n  fragment ProductFields on Product {\n    id\n    storeId\n    categoryId\n    brandId\n    name\n    slug\n    description\n    shortDescription\n    productType\n    status\n    isFeatured\n    isDigital\n    price\n    compareAtPrice\n    costPrice\n    priceWithTax\n    sku\n    weight\n    length\n    width\n    height\n    hsnCode\n    seoTitle\n    seoDescription\n    seoKeywords\n    specifications\n    createdAt\n    updatedAt\n    images {\n      ...ProductImageFields\n    }\n    brand {\n      id\n      name\n      slug\n      logoUrl\n    }\n    category {\n      id\n      name\n      slug\n    }\n    taxId\n    tax {\n      id\n      name\n      rate\n    }\n    tags {\n      id\n      name\n      slug\n    }\n  }\n"): (typeof documents)["\n  \n  fragment ProductFields on Product {\n    id\n    storeId\n    categoryId\n    brandId\n    name\n    slug\n    description\n    shortDescription\n    productType\n    status\n    isFeatured\n    isDigital\n    price\n    compareAtPrice\n    costPrice\n    priceWithTax\n    sku\n    weight\n    length\n    width\n    height\n    hsnCode\n    seoTitle\n    seoDescription\n    seoKeywords\n    specifications\n    createdAt\n    updatedAt\n    images {\n      ...ProductImageFields\n    }\n    brand {\n      id\n      name\n      slug\n      logoUrl\n    }\n    category {\n      id\n      name\n      slug\n    }\n    taxId\n    tax {\n      id\n      name\n      rate\n    }\n    tags {\n      id\n      name\n      slug\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  \n  query GetMyProducts($storeId: ID, $status: ProductStatus) {\n    myProducts(storeId: $storeId, status: $status) {\n      ...ProductFields\n    }\n  }\n"): (typeof documents)["\n  \n  query GetMyProducts($storeId: ID, $status: ProductStatus) {\n    myProducts(storeId: $storeId, status: $status) {\n      ...ProductFields\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  \n  query GetMyProduct($id: ID!) {\n    myProduct(id: $id) {\n      ...ProductFields\n    }\n  }\n"): (typeof documents)["\n  \n  query GetMyProduct($id: ID!) {\n    myProduct(id: $id) {\n      ...ProductFields\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  \n  mutation CreateMyProduct($createProductInput: CreateProductInput!) {\n    createMyProduct(createProductInput: $createProductInput) {\n      ...ProductFields\n    }\n  }\n"): (typeof documents)["\n  \n  mutation CreateMyProduct($createProductInput: CreateProductInput!) {\n    createMyProduct(createProductInput: $createProductInput) {\n      ...ProductFields\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  \n  mutation UpdateMyProduct($updateProductInput: UpdateProductInput!) {\n    updateMyProduct(updateProductInput: $updateProductInput) {\n      ...ProductFields\n    }\n  }\n"): (typeof documents)["\n  \n  mutation UpdateMyProduct($updateProductInput: UpdateProductInput!) {\n    updateMyProduct(updateProductInput: $updateProductInput) {\n      ...ProductFields\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  \n  mutation SetMyProductStatus($setProductStatusInput: SetProductStatusInput!) {\n    setMyProductStatus(setProductStatusInput: $setProductStatusInput) {\n      ...ProductFields\n    }\n  }\n"): (typeof documents)["\n  \n  mutation SetMyProductStatus($setProductStatusInput: SetProductStatusInput!) {\n    setMyProductStatus(setProductStatusInput: $setProductStatusInput) {\n      ...ProductFields\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  \n  mutation RemoveMyProduct($id: ID!) {\n    removeMyProduct(id: $id) {\n      ...ProductFields\n    }\n  }\n"): (typeof documents)["\n  \n  mutation RemoveMyProduct($id: ID!) {\n    removeMyProduct(id: $id) {\n      ...ProductFields\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  \n  mutation AddMyProductImage($addProductImageInput: AddProductImageInput!) {\n    addMyProductImage(addProductImageInput: $addProductImageInput) {\n      ...ProductImageFields\n    }\n  }\n"): (typeof documents)["\n  \n  mutation AddMyProductImage($addProductImageInput: AddProductImageInput!) {\n    addMyProductImage(addProductImageInput: $addProductImageInput) {\n      ...ProductImageFields\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  \n  mutation UpdateMyProductImage(\n    $updateProductImageInput: UpdateProductImageInput!\n  ) {\n    updateMyProductImage(updateProductImageInput: $updateProductImageInput) {\n      ...ProductImageFields\n    }\n  }\n"): (typeof documents)["\n  \n  mutation UpdateMyProductImage(\n    $updateProductImageInput: UpdateProductImageInput!\n  ) {\n    updateMyProductImage(updateProductImageInput: $updateProductImageInput) {\n      ...ProductImageFields\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  \n  mutation RemoveMyProductImage($id: ID!) {\n    removeMyProductImage(id: $id) {\n      ...ProductImageFields\n    }\n  }\n"): (typeof documents)["\n  \n  mutation RemoveMyProductImage($id: ID!) {\n    removeMyProductImage(id: $id) {\n      ...ProductImageFields\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation ReorderMyProductImages(\n    $reorderProductImagesInput: ReorderProductImagesInput!\n  ) {\n    reorderMyProductImages(\n      reorderProductImagesInput: $reorderProductImagesInput\n    )\n  }\n"): (typeof documents)["\n  mutation ReorderMyProductImages(\n    $reorderProductImagesInput: ReorderProductImagesInput!\n  ) {\n    reorderMyProductImages(\n      reorderProductImagesInput: $reorderProductImagesInput\n    )\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  \n  query GetAdminProducts(\n    $status: ProductStatus\n    $storeId: ID\n    $brandId: ID\n    $categoryId: ID\n  ) {\n    adminProducts(\n      status: $status\n      storeId: $storeId\n      brandId: $brandId\n      categoryId: $categoryId\n    ) {\n      ...ProductFields\n      variants {\n        id\n        sku\n        price\n        status\n        attributes {\n          attributeName\n          value\n        }\n      }\n    }\n  }\n"): (typeof documents)["\n  \n  query GetAdminProducts(\n    $status: ProductStatus\n    $storeId: ID\n    $brandId: ID\n    $categoryId: ID\n  ) {\n    adminProducts(\n      status: $status\n      storeId: $storeId\n      brandId: $brandId\n      categoryId: $categoryId\n    ) {\n      ...ProductFields\n      variants {\n        id\n        sku\n        price\n        status\n        attributes {\n          attributeName\n          value\n        }\n      }\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  \n  mutation AdminSetProductStatus(\n    $setProductStatusInput: SetProductStatusInput!\n  ) {\n    adminSetProductStatus(setProductStatusInput: $setProductStatusInput) {\n      ...ProductFields\n    }\n  }\n"): (typeof documents)["\n  \n  mutation AdminSetProductStatus(\n    $setProductStatusInput: SetProductStatusInput!\n  ) {\n    adminSetProductStatus(setProductStatusInput: $setProductStatusInput) {\n      ...ProductFields\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  \n  query GetPublicProduct($slug: String!) {\n    publicProduct(slug: $slug) {\n      ...ProductFields\n      variants {\n        id\n        sku\n        price\n        priceWithTax\n        compareAtPrice\n        imageUrl\n        status\n        availableQuantity\n        stockState\n        attributes {\n          attributeId\n          attributeValueId\n          attributeName\n          attributeSlug\n          value\n          valueSlug\n        }\n      }\n    }\n  }\n"): (typeof documents)["\n  \n  query GetPublicProduct($slug: String!) {\n    publicProduct(slug: $slug) {\n      ...ProductFields\n      variants {\n        id\n        sku\n        price\n        priceWithTax\n        compareAtPrice\n        imageUrl\n        status\n        availableQuantity\n        stockState\n        attributes {\n          attributeId\n          attributeValueId\n          attributeName\n          attributeSlug\n          value\n          valueSlug\n        }\n      }\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  \n  query GetPublicProducts(\n    $storeSlug: String\n    $brandSlug: String\n    $tagSlug: String\n    $categorySlug: String\n    $sort: ProductSortOrder\n    $limit: Float\n  ) {\n    publicProducts(\n      storeSlug: $storeSlug\n      brandSlug: $brandSlug\n      tagSlug: $tagSlug\n      categorySlug: $categorySlug\n      sort: $sort\n      limit: $limit\n    ) {\n      ...ProductSummaryFields\n      variants {\n        id\n        price\n        priceWithTax\n        availableQuantity\n      }\n    }\n  }\n"): (typeof documents)["\n  \n  query GetPublicProducts(\n    $storeSlug: String\n    $brandSlug: String\n    $tagSlug: String\n    $categorySlug: String\n    $sort: ProductSortOrder\n    $limit: Float\n  ) {\n    publicProducts(\n      storeSlug: $storeSlug\n      brandSlug: $brandSlug\n      tagSlug: $tagSlug\n      categorySlug: $categorySlug\n      sort: $sort\n      limit: $limit\n    ) {\n      ...ProductSummaryFields\n      variants {\n        id\n        price\n        priceWithTax\n        availableQuantity\n      }\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  \n  query GetPaginatedPublicProducts(\n    $storeSlug: String\n    $brandSlug: String\n    $tagSlug: String\n    $categorySlug: String\n    $minPrice: Float\n    $maxPrice: Float\n    $sort: ProductSortOrder\n    $page: Int\n    $pageSize: Int\n  ) {\n    paginatedPublicProducts(\n      storeSlug: $storeSlug\n      brandSlug: $brandSlug\n      tagSlug: $tagSlug\n      categorySlug: $categorySlug\n      minPrice: $minPrice\n      maxPrice: $maxPrice\n      sort: $sort\n      page: $page\n      pageSize: $pageSize\n    ) {\n      items {\n        ...ProductSummaryFields\n        variants {\n          id\n          price\n          priceWithTax\n          availableQuantity\n        }\n      }\n      totalCount\n      totalPages\n      currentPage\n      pageSize\n    }\n  }\n"): (typeof documents)["\n  \n  query GetPaginatedPublicProducts(\n    $storeSlug: String\n    $brandSlug: String\n    $tagSlug: String\n    $categorySlug: String\n    $minPrice: Float\n    $maxPrice: Float\n    $sort: ProductSortOrder\n    $page: Int\n    $pageSize: Int\n  ) {\n    paginatedPublicProducts(\n      storeSlug: $storeSlug\n      brandSlug: $brandSlug\n      tagSlug: $tagSlug\n      categorySlug: $categorySlug\n      minPrice: $minPrice\n      maxPrice: $maxPrice\n      sort: $sort\n      page: $page\n      pageSize: $pageSize\n    ) {\n      items {\n        ...ProductSummaryFields\n        variants {\n          id\n          price\n          priceWithTax\n          availableQuantity\n        }\n      }\n      totalCount\n      totalPages\n      currentPage\n      pageSize\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  fragment VariantFields on ProductVariant {\n    id\n    productId\n    sku\n    name\n    price\n    compareAtPrice\n    costPrice\n    weight\n    length\n    width\n    height\n    imageUrl\n    status\n    createdAt\n    updatedAt\n    attributes {\n      attributeId\n      attributeValueId\n      attributeName\n      attributeSlug\n      value\n      valueSlug\n    }\n  }\n"): (typeof documents)["\n  fragment VariantFields on ProductVariant {\n    id\n    productId\n    sku\n    name\n    price\n    compareAtPrice\n    costPrice\n    weight\n    length\n    width\n    height\n    imageUrl\n    status\n    createdAt\n    updatedAt\n    attributes {\n      attributeId\n      attributeValueId\n      attributeName\n      attributeSlug\n      value\n      valueSlug\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  fragment VariantAxisFields on VariantAxis {\n    attributeId\n    attributeName\n    attributeSlug\n    values {\n      id\n      attributeId\n      value\n      slug\n      displayOrder\n      createdAt\n      updatedAt\n    }\n  }\n"): (typeof documents)["\n  fragment VariantAxisFields on VariantAxis {\n    attributeId\n    attributeName\n    attributeSlug\n    values {\n      id\n      attributeId\n      value\n      slug\n      displayOrder\n      createdAt\n      updatedAt\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  \n  query GetMyProductVariants($productId: ID!) {\n    myProductVariants(productId: $productId) {\n      ...VariantFields\n    }\n  }\n"): (typeof documents)["\n  \n  query GetMyProductVariants($productId: ID!) {\n    myProductVariants(productId: $productId) {\n      ...VariantFields\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  \n  query GetMyProductVariantAxes($productId: ID!) {\n    myProductVariantAxes(productId: $productId) {\n      ...VariantAxisFields\n    }\n  }\n"): (typeof documents)["\n  \n  query GetMyProductVariantAxes($productId: ID!) {\n    myProductVariantAxes(productId: $productId) {\n      ...VariantAxisFields\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  \n  mutation SetMyProductVariantAxes($setVariantAxesInput: SetVariantAxesInput!) {\n    setMyProductVariantAxes(setVariantAxesInput: $setVariantAxesInput) {\n      ...VariantAxisFields\n    }\n  }\n"): (typeof documents)["\n  \n  mutation SetMyProductVariantAxes($setVariantAxesInput: SetVariantAxesInput!) {\n    setMyProductVariantAxes(setVariantAxesInput: $setVariantAxesInput) {\n      ...VariantAxisFields\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  \n  mutation GenerateMyProductVariantMatrix(\n    $generateVariantMatrixInput: GenerateVariantMatrixInput!\n  ) {\n    generateMyProductVariantMatrix(\n      generateVariantMatrixInput: $generateVariantMatrixInput\n    ) {\n      ...VariantFields\n    }\n  }\n"): (typeof documents)["\n  \n  mutation GenerateMyProductVariantMatrix(\n    $generateVariantMatrixInput: GenerateVariantMatrixInput!\n  ) {\n    generateMyProductVariantMatrix(\n      generateVariantMatrixInput: $generateVariantMatrixInput\n    ) {\n      ...VariantFields\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  \n  mutation AddMyProductVariant($createVariantInput: CreateVariantInput!) {\n    addMyProductVariant(createVariantInput: $createVariantInput) {\n      ...VariantFields\n    }\n  }\n"): (typeof documents)["\n  \n  mutation AddMyProductVariant($createVariantInput: CreateVariantInput!) {\n    addMyProductVariant(createVariantInput: $createVariantInput) {\n      ...VariantFields\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  \n  mutation UpdateMyProductVariant($updateVariantInput: UpdateVariantInput!) {\n    updateMyProductVariant(updateVariantInput: $updateVariantInput) {\n      ...VariantFields\n    }\n  }\n"): (typeof documents)["\n  \n  mutation UpdateMyProductVariant($updateVariantInput: UpdateVariantInput!) {\n    updateMyProductVariant(updateVariantInput: $updateVariantInput) {\n      ...VariantFields\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  \n  mutation RemoveMyProductVariant($id: ID!) {\n    removeMyProductVariant(id: $id) {\n      ...VariantFields\n    }\n  }\n"): (typeof documents)["\n  \n  mutation RemoveMyProductVariant($id: ID!) {\n    removeMyProductVariant(id: $id) {\n      ...VariantFields\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation BulkUpdateMyProductVariants(\n    $bulkUpdateVariantsInput: BulkUpdateVariantsInput!\n  ) {\n    bulkUpdateMyProductVariants(\n      bulkUpdateVariantsInput: $bulkUpdateVariantsInput\n    )\n  }\n"): (typeof documents)["\n  mutation BulkUpdateMyProductVariants(\n    $bulkUpdateVariantsInput: BulkUpdateVariantsInput!\n  ) {\n    bulkUpdateMyProductVariants(\n      bulkUpdateVariantsInput: $bulkUpdateVariantsInput\n    )\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  fragment PayoutAccountFields on SellerPayoutAccount {\n    id\n    sellerId\n    accountType\n    accountHolderName\n    accountNumber\n    ifscCode\n    bankName\n    upiId\n    walletProvider\n    isPrimary\n    isVerified\n    createdAt\n    updatedAt\n  }\n"): (typeof documents)["\n  fragment PayoutAccountFields on SellerPayoutAccount {\n    id\n    sellerId\n    accountType\n    accountHolderName\n    accountNumber\n    ifscCode\n    bankName\n    upiId\n    walletProvider\n    isPrimary\n    isVerified\n    createdAt\n    updatedAt\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  \n  fragment SellerFields on Seller {\n    id\n    userId\n    legalName\n    displayName\n    businessType\n    dateOfIncorporation\n    registrationNumber\n    panNumber\n    gstin\n    businessEmail\n    businessPhone\n    supportEmail\n    signatoryName\n    signatoryPan\n    signatoryDesignation\n    overallStatus\n    panVerifiedAt\n    gstinVerifiedAt\n    bankVerifiedAt\n    documentsVerifiedAt\n    rejectionReason\n    commissionRate\n    createdAt\n    updatedAt\n    payoutAccounts {\n      ...PayoutAccountFields\n    }\n  }\n"): (typeof documents)["\n  \n  fragment SellerFields on Seller {\n    id\n    userId\n    legalName\n    displayName\n    businessType\n    dateOfIncorporation\n    registrationNumber\n    panNumber\n    gstin\n    businessEmail\n    businessPhone\n    supportEmail\n    signatoryName\n    signatoryPan\n    signatoryDesignation\n    overallStatus\n    panVerifiedAt\n    gstinVerifiedAt\n    bankVerifiedAt\n    documentsVerifiedAt\n    rejectionReason\n    commissionRate\n    createdAt\n    updatedAt\n    payoutAccounts {\n      ...PayoutAccountFields\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  \n  query GetMySeller {\n    mySeller {\n      ...SellerFields\n    }\n  }\n"): (typeof documents)["\n  \n  query GetMySeller {\n    mySeller {\n      ...SellerFields\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  \n  query GetSellers($status: SellerStatus) {\n    sellers(status: $status) {\n      ...SellerFields\n    }\n  }\n"): (typeof documents)["\n  \n  query GetSellers($status: SellerStatus) {\n    sellers(status: $status) {\n      ...SellerFields\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  \n  query GetSellerUsers($status: SellerListStatus) {\n    sellerUsers(status: $status) {\n      userId\n      name\n      email\n      phone\n      emailVerifiedAt\n      registeredAt\n      status\n      seller {\n        ...SellerFields\n      }\n    }\n  }\n"): (typeof documents)["\n  \n  query GetSellerUsers($status: SellerListStatus) {\n    sellerUsers(status: $status) {\n      userId\n      name\n      email\n      phone\n      emailVerifiedAt\n      registeredAt\n      status\n      seller {\n        ...SellerFields\n      }\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  \n  query GetSeller($id: ID!) {\n    seller(id: $id) {\n      ...SellerFields\n    }\n  }\n"): (typeof documents)["\n  \n  query GetSeller($id: ID!) {\n    seller(id: $id) {\n      ...SellerFields\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  \n  mutation CreateMySeller($createSellerInput: CreateSellerInput!) {\n    createMySeller(createSellerInput: $createSellerInput) {\n      ...SellerFields\n    }\n  }\n"): (typeof documents)["\n  \n  mutation CreateMySeller($createSellerInput: CreateSellerInput!) {\n    createMySeller(createSellerInput: $createSellerInput) {\n      ...SellerFields\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  \n  mutation UpdateMySeller($updateSellerInput: UpdateSellerInput!) {\n    updateMySeller(updateSellerInput: $updateSellerInput) {\n      ...SellerFields\n    }\n  }\n"): (typeof documents)["\n  \n  mutation UpdateMySeller($updateSellerInput: UpdateSellerInput!) {\n    updateMySeller(updateSellerInput: $updateSellerInput) {\n      ...SellerFields\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  \n  mutation SubmitMySellerForReview($id: ID!) {\n    submitMySellerForReview(id: $id) {\n      ...SellerFields\n    }\n  }\n"): (typeof documents)["\n  \n  mutation SubmitMySellerForReview($id: ID!) {\n    submitMySellerForReview(id: $id) {\n      ...SellerFields\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  \n  mutation VerifySellerSection(\n    $verifySectionInput: VerifySellerSectionInput!\n  ) {\n    verifySellerSection(verifySectionInput: $verifySectionInput) {\n      ...SellerFields\n    }\n  }\n"): (typeof documents)["\n  \n  mutation VerifySellerSection(\n    $verifySectionInput: VerifySellerSectionInput!\n  ) {\n    verifySellerSection(verifySectionInput: $verifySectionInput) {\n      ...SellerFields\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  \n  mutation SetSellerStatus($setStatusInput: SetSellerStatusInput!) {\n    setSellerStatus(setStatusInput: $setStatusInput) {\n      ...SellerFields\n    }\n  }\n"): (typeof documents)["\n  \n  mutation SetSellerStatus($setStatusInput: SetSellerStatusInput!) {\n    setSellerStatus(setStatusInput: $setStatusInput) {\n      ...SellerFields\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  \n  mutation RemoveSeller($id: ID!) {\n    removeSeller(id: $id) {\n      ...SellerFields\n    }\n  }\n"): (typeof documents)["\n  \n  mutation RemoveSeller($id: ID!) {\n    removeSeller(id: $id) {\n      ...SellerFields\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query GetSiteSettings($group: SettingGroup) {\n    siteSettings(group: $group) {\n      id\n      key\n      value\n      group\n      label\n      description\n      valueType\n      createdAt\n      updatedAt\n    }\n  }\n"): (typeof documents)["\n  query GetSiteSettings($group: SettingGroup) {\n    siteSettings(group: $group) {\n      id\n      key\n      value\n      group\n      label\n      description\n      valueType\n      createdAt\n      updatedAt\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation UpdateSiteSetting($input: UpdateSiteSettingInput!) {\n    updateSiteSetting(input: $input) {\n      id\n      key\n      value\n      group\n      label\n      description\n      valueType\n      updatedAt\n    }\n  }\n"): (typeof documents)["\n  mutation UpdateSiteSetting($input: UpdateSiteSettingInput!) {\n    updateSiteSetting(input: $input) {\n      id\n      key\n      value\n      group\n      label\n      description\n      valueType\n      updatedAt\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  fragment SlideItemFields on SlideItem {\n    id\n    sliderId\n    title\n    description\n    link\n    ctaLabel\n    imageUrl\n    tabletImageUrl\n    mobileImageUrl\n    order\n    isEnabled\n    createdAt\n    updatedAt\n  }\n"): (typeof documents)["\n  fragment SlideItemFields on SlideItem {\n    id\n    sliderId\n    title\n    description\n    link\n    ctaLabel\n    imageUrl\n    tabletImageUrl\n    mobileImageUrl\n    order\n    isEnabled\n    createdAt\n    updatedAt\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  \n  fragment SliderFields on Slider {\n    id\n    name\n    key\n    description\n    status\n    config\n    createdAt\n    updatedAt\n    items {\n      ...SlideItemFields\n    }\n  }\n"): (typeof documents)["\n  \n  fragment SliderFields on Slider {\n    id\n    name\n    key\n    description\n    status\n    config\n    createdAt\n    updatedAt\n    items {\n      ...SlideItemFields\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  \n  query GetPublicSlider($key: String!) {\n    publicSlider(key: $key) {\n      ...SliderFields\n    }\n  }\n"): (typeof documents)["\n  \n  query GetPublicSlider($key: String!) {\n    publicSlider(key: $key) {\n      ...SliderFields\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  \n  query GetAdminSliders {\n    adminSliders {\n      ...SliderFields\n    }\n  }\n"): (typeof documents)["\n  \n  query GetAdminSliders {\n    adminSliders {\n      ...SliderFields\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  \n  query GetAdminSlidersPaginated(\n    $status: SliderStatus\n    $page: Int\n    $pageSize: Int\n    $search: String\n  ) {\n    adminSlidersPaginated(\n      status: $status\n      page: $page\n      pageSize: $pageSize\n      search: $search\n    ) {\n      items {\n        ...SliderFields\n      }\n      totalCount\n      totalPages\n      currentPage\n      pageSize\n    }\n  }\n"): (typeof documents)["\n  \n  query GetAdminSlidersPaginated(\n    $status: SliderStatus\n    $page: Int\n    $pageSize: Int\n    $search: String\n  ) {\n    adminSlidersPaginated(\n      status: $status\n      page: $page\n      pageSize: $pageSize\n      search: $search\n    ) {\n      items {\n        ...SliderFields\n      }\n      totalCount\n      totalPages\n      currentPage\n      pageSize\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  \n  query GetAdminSlider($id: ID!) {\n    adminSlider(id: $id) {\n      ...SliderFields\n    }\n  }\n"): (typeof documents)["\n  \n  query GetAdminSlider($id: ID!) {\n    adminSlider(id: $id) {\n      ...SliderFields\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  \n  mutation CreateSlider($createSliderInput: CreateSliderInput!) {\n    createSlider(createSliderInput: $createSliderInput) {\n      ...SliderFields\n    }\n  }\n"): (typeof documents)["\n  \n  mutation CreateSlider($createSliderInput: CreateSliderInput!) {\n    createSlider(createSliderInput: $createSliderInput) {\n      ...SliderFields\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  \n  mutation UpdateSlider($updateSliderInput: UpdateSliderInput!) {\n    updateSlider(updateSliderInput: $updateSliderInput) {\n      ...SliderFields\n    }\n  }\n"): (typeof documents)["\n  \n  mutation UpdateSlider($updateSliderInput: UpdateSliderInput!) {\n    updateSlider(updateSliderInput: $updateSliderInput) {\n      ...SliderFields\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  \n  mutation SetSliderStatus($setSliderStatusInput: SetSliderStatusInput!) {\n    setSliderStatus(setSliderStatusInput: $setSliderStatusInput) {\n      ...SliderFields\n    }\n  }\n"): (typeof documents)["\n  \n  mutation SetSliderStatus($setSliderStatusInput: SetSliderStatusInput!) {\n    setSliderStatus(setSliderStatusInput: $setSliderStatusInput) {\n      ...SliderFields\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  \n  mutation RemoveSlider($id: ID!) {\n    removeSlider(id: $id) {\n      ...SliderFields\n    }\n  }\n"): (typeof documents)["\n  \n  mutation RemoveSlider($id: ID!) {\n    removeSlider(id: $id) {\n      ...SliderFields\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  \n  mutation AddSlideItem($addSlideItemInput: AddSlideItemInput!) {\n    addSlideItem(addSlideItemInput: $addSlideItemInput) {\n      ...SlideItemFields\n    }\n  }\n"): (typeof documents)["\n  \n  mutation AddSlideItem($addSlideItemInput: AddSlideItemInput!) {\n    addSlideItem(addSlideItemInput: $addSlideItemInput) {\n      ...SlideItemFields\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  \n  mutation UpdateSlideItem($updateSlideItemInput: UpdateSlideItemInput!) {\n    updateSlideItem(updateSlideItemInput: $updateSlideItemInput) {\n      ...SlideItemFields\n    }\n  }\n"): (typeof documents)["\n  \n  mutation UpdateSlideItem($updateSlideItemInput: UpdateSlideItemInput!) {\n    updateSlideItem(updateSlideItemInput: $updateSlideItemInput) {\n      ...SlideItemFields\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  \n  mutation RemoveSlideItem($id: ID!) {\n    removeSlideItem(id: $id) {\n      ...SlideItemFields\n    }\n  }\n"): (typeof documents)["\n  \n  mutation RemoveSlideItem($id: ID!) {\n    removeSlideItem(id: $id) {\n      ...SlideItemFields\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation ReorderSlideItems(\n    $reorderSlideItemsInput: ReorderSlideItemsInput!\n  ) {\n    reorderSlideItems(reorderSlideItemsInput: $reorderSlideItemsInput)\n  }\n"): (typeof documents)["\n  mutation ReorderSlideItems(\n    $reorderSlideItemsInput: ReorderSlideItemsInput!\n  ) {\n    reorderSlideItems(reorderSlideItemsInput: $reorderSlideItemsInput)\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  fragment WarehouseFields on Warehouse {\n    id\n    storeId\n    name\n    code\n    addressLine1\n    addressLine2\n    city\n    state\n    postalCode\n    countryCode\n    phone\n    isDefault\n    isActive\n    createdAt\n    updatedAt\n  }\n"): (typeof documents)["\n  fragment WarehouseFields on Warehouse {\n    id\n    storeId\n    name\n    code\n    addressLine1\n    addressLine2\n    city\n    state\n    postalCode\n    countryCode\n    phone\n    isDefault\n    isActive\n    createdAt\n    updatedAt\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  \n  fragment StoreFields on Store {\n    id\n    sellerId\n    name\n    slug\n    description\n    logoUrl\n    bannerUrl\n    currencyCode\n    timezone\n    locale\n    supportEmail\n    supportPhone\n    status\n    isFeatured\n    createdAt\n    updatedAt\n    warehouses {\n      ...WarehouseFields\n    }\n  }\n"): (typeof documents)["\n  \n  fragment StoreFields on Store {\n    id\n    sellerId\n    name\n    slug\n    description\n    logoUrl\n    bannerUrl\n    currencyCode\n    timezone\n    locale\n    supportEmail\n    supportPhone\n    status\n    isFeatured\n    createdAt\n    updatedAt\n    warehouses {\n      ...WarehouseFields\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  \n  query GetMyStores {\n    myStores {\n      ...StoreFields\n    }\n  }\n"): (typeof documents)["\n  \n  query GetMyStores {\n    myStores {\n      ...StoreFields\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  \n  query GetMyStore($id: ID!) {\n    myStore(id: $id) {\n      ...StoreFields\n    }\n  }\n"): (typeof documents)["\n  \n  query GetMyStore($id: ID!) {\n    myStore(id: $id) {\n      ...StoreFields\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  \n  mutation CreateMyStore($createStoreInput: CreateStoreInput!) {\n    createMyStore(createStoreInput: $createStoreInput) {\n      ...StoreFields\n    }\n  }\n"): (typeof documents)["\n  \n  mutation CreateMyStore($createStoreInput: CreateStoreInput!) {\n    createMyStore(createStoreInput: $createStoreInput) {\n      ...StoreFields\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  \n  mutation UpdateMyStore($updateStoreInput: UpdateStoreInput!) {\n    updateMyStore(updateStoreInput: $updateStoreInput) {\n      ...StoreFields\n    }\n  }\n"): (typeof documents)["\n  \n  mutation UpdateMyStore($updateStoreInput: UpdateStoreInput!) {\n    updateMyStore(updateStoreInput: $updateStoreInput) {\n      ...StoreFields\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  \n  mutation SubmitMyStoreForReview($id: ID!) {\n    submitMyStoreForReview(id: $id) {\n      ...StoreFields\n    }\n  }\n"): (typeof documents)["\n  \n  mutation SubmitMyStoreForReview($id: ID!) {\n    submitMyStoreForReview(id: $id) {\n      ...StoreFields\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  \n  mutation RemoveMyStore($id: ID!) {\n    removeMyStore(id: $id) {\n      ...StoreFields\n    }\n  }\n"): (typeof documents)["\n  \n  mutation RemoveMyStore($id: ID!) {\n    removeMyStore(id: $id) {\n      ...StoreFields\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  \n  mutation CreateMyWarehouse($createWarehouseInput: CreateWarehouseInput!) {\n    createMyWarehouse(createWarehouseInput: $createWarehouseInput) {\n      ...WarehouseFields\n    }\n  }\n"): (typeof documents)["\n  \n  mutation CreateMyWarehouse($createWarehouseInput: CreateWarehouseInput!) {\n    createMyWarehouse(createWarehouseInput: $createWarehouseInput) {\n      ...WarehouseFields\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  \n  mutation UpdateMyWarehouse($updateWarehouseInput: UpdateWarehouseInput!) {\n    updateMyWarehouse(updateWarehouseInput: $updateWarehouseInput) {\n      ...WarehouseFields\n    }\n  }\n"): (typeof documents)["\n  \n  mutation UpdateMyWarehouse($updateWarehouseInput: UpdateWarehouseInput!) {\n    updateMyWarehouse(updateWarehouseInput: $updateWarehouseInput) {\n      ...WarehouseFields\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  \n  mutation RemoveMyWarehouse($id: ID!) {\n    removeMyWarehouse(id: $id) {\n      ...WarehouseFields\n    }\n  }\n"): (typeof documents)["\n  \n  mutation RemoveMyWarehouse($id: ID!) {\n    removeMyWarehouse(id: $id) {\n      ...WarehouseFields\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  \n  query GetStores($status: StoreStatus) {\n    stores(status: $status) {\n      ...StoreFields\n    }\n  }\n"): (typeof documents)["\n  \n  query GetStores($status: StoreStatus) {\n    stores(status: $status) {\n      ...StoreFields\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  \n  mutation SetStoreStatus($setStoreStatusInput: SetStoreStatusInput!) {\n    setStoreStatus(setStoreStatusInput: $setStoreStatusInput) {\n      ...StoreFields\n    }\n  }\n"): (typeof documents)["\n  \n  mutation SetStoreStatus($setStoreStatusInput: SetStoreStatusInput!) {\n    setStoreStatus(setStoreStatusInput: $setStoreStatusInput) {\n      ...StoreFields\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  \n  mutation AdminRemoveStore($id: ID!) {\n    adminRemoveStore(id: $id) {\n      ...StoreFields\n    }\n  }\n"): (typeof documents)["\n  \n  mutation AdminRemoveStore($id: ID!) {\n    adminRemoveStore(id: $id) {\n      ...StoreFields\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  \n  query GetPublicStore($slug: String!) {\n    publicStore(slug: $slug) {\n      ...StoreFields\n    }\n  }\n"): (typeof documents)["\n  \n  query GetPublicStore($slug: String!) {\n    publicStore(slug: $slug) {\n      ...StoreFields\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  fragment TagFields on Tag {\n    id\n    name\n    slug\n    description\n    status\n    isFeatured\n    createdAt\n    updatedAt\n  }\n"): (typeof documents)["\n  fragment TagFields on Tag {\n    id\n    name\n    slug\n    description\n    status\n    isFeatured\n    createdAt\n    updatedAt\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  \n  query GetAdminTags($status: TagStatus) {\n    adminTags(status: $status) {\n      ...TagFields\n    }\n  }\n"): (typeof documents)["\n  \n  query GetAdminTags($status: TagStatus) {\n    adminTags(status: $status) {\n      ...TagFields\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  \n  query GetTags($status: TagStatus, $featuredOnly: Boolean) {\n    tags(status: $status, featuredOnly: $featuredOnly) {\n      ...TagFields\n    }\n  }\n"): (typeof documents)["\n  \n  query GetTags($status: TagStatus, $featuredOnly: Boolean) {\n    tags(status: $status, featuredOnly: $featuredOnly) {\n      ...TagFields\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  \n  query GetTag($id: ID!) {\n    tag(id: $id) {\n      ...TagFields\n    }\n  }\n"): (typeof documents)["\n  \n  query GetTag($id: ID!) {\n    tag(id: $id) {\n      ...TagFields\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  \n  query GetPublicTag($slug: String!) {\n    publicTag(slug: $slug) {\n      ...TagFields\n    }\n  }\n"): (typeof documents)["\n  \n  query GetPublicTag($slug: String!) {\n    publicTag(slug: $slug) {\n      ...TagFields\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  \n  mutation CreateTag($createTagInput: CreateTagInput!) {\n    createTag(createTagInput: $createTagInput) {\n      ...TagFields\n    }\n  }\n"): (typeof documents)["\n  \n  mutation CreateTag($createTagInput: CreateTagInput!) {\n    createTag(createTagInput: $createTagInput) {\n      ...TagFields\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  \n  mutation UpdateTag($updateTagInput: UpdateTagInput!) {\n    updateTag(updateTagInput: $updateTagInput) {\n      ...TagFields\n    }\n  }\n"): (typeof documents)["\n  \n  mutation UpdateTag($updateTagInput: UpdateTagInput!) {\n    updateTag(updateTagInput: $updateTagInput) {\n      ...TagFields\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  \n  mutation SetTagStatus($setTagStatusInput: SetTagStatusInput!) {\n    setTagStatus(setTagStatusInput: $setTagStatusInput) {\n      ...TagFields\n    }\n  }\n"): (typeof documents)["\n  \n  mutation SetTagStatus($setTagStatusInput: SetTagStatusInput!) {\n    setTagStatus(setTagStatusInput: $setTagStatusInput) {\n      ...TagFields\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  \n  mutation RemoveTag($id: ID!) {\n    removeTag(id: $id) {\n      ...TagFields\n    }\n  }\n"): (typeof documents)["\n  \n  mutation RemoveTag($id: ID!) {\n    removeTag(id: $id) {\n      ...TagFields\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  fragment TaxFields on Tax {\n    id\n    name\n    rate\n    description\n    isActive\n    displayOrder\n    createdAt\n    updatedAt\n  }\n"): (typeof documents)["\n  fragment TaxFields on Tax {\n    id\n    name\n    rate\n    description\n    isActive\n    displayOrder\n    createdAt\n    updatedAt\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  \n  query GetTaxes {\n    taxes {\n      ...TaxFields\n    }\n  }\n"): (typeof documents)["\n  \n  query GetTaxes {\n    taxes {\n      ...TaxFields\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  \n  query GetAdminTaxes {\n    adminTaxes {\n      ...TaxFields\n    }\n  }\n"): (typeof documents)["\n  \n  query GetAdminTaxes {\n    adminTaxes {\n      ...TaxFields\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  \n  query GetAdminTaxesPaginated(\n    $page: Int\n    $pageSize: Int\n    $search: String\n  ) {\n    adminTaxesPaginated(page: $page, pageSize: $pageSize, search: $search) {\n      items {\n        ...TaxFields\n      }\n      totalCount\n      totalPages\n      currentPage\n      pageSize\n    }\n  }\n"): (typeof documents)["\n  \n  query GetAdminTaxesPaginated(\n    $page: Int\n    $pageSize: Int\n    $search: String\n  ) {\n    adminTaxesPaginated(page: $page, pageSize: $pageSize, search: $search) {\n      items {\n        ...TaxFields\n      }\n      totalCount\n      totalPages\n      currentPage\n      pageSize\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  \n  query GetTax($id: ID!) {\n    tax(id: $id) {\n      ...TaxFields\n    }\n  }\n"): (typeof documents)["\n  \n  query GetTax($id: ID!) {\n    tax(id: $id) {\n      ...TaxFields\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  \n  mutation CreateTax($createTaxInput: CreateTaxInput!) {\n    createTax(createTaxInput: $createTaxInput) {\n      ...TaxFields\n    }\n  }\n"): (typeof documents)["\n  \n  mutation CreateTax($createTaxInput: CreateTaxInput!) {\n    createTax(createTaxInput: $createTaxInput) {\n      ...TaxFields\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  \n  mutation UpdateTax($updateTaxInput: UpdateTaxInput!) {\n    updateTax(updateTaxInput: $updateTaxInput) {\n      ...TaxFields\n    }\n  }\n"): (typeof documents)["\n  \n  mutation UpdateTax($updateTaxInput: UpdateTaxInput!) {\n    updateTax(updateTaxInput: $updateTaxInput) {\n      ...TaxFields\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  \n  mutation RemoveTax($id: ID!) {\n    removeTax(id: $id) {\n      ...TaxFields\n    }\n  }\n"): (typeof documents)["\n  \n  mutation RemoveTax($id: ID!) {\n    removeTax(id: $id) {\n      ...TaxFields\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  \n  fragment WishlistFields on Wishlist {\n    id\n    customerId\n    name\n    isDefault\n    isPublic\n    itemCount\n    items {\n      id\n      productId\n      variantId\n      createdAt\n      product {\n        ...ProductFields\n      }\n    }\n    createdAt\n    updatedAt\n  }\n"): (typeof documents)["\n  \n  fragment WishlistFields on Wishlist {\n    id\n    customerId\n    name\n    isDefault\n    isPublic\n    itemCount\n    items {\n      id\n      productId\n      variantId\n      createdAt\n      product {\n        ...ProductFields\n      }\n    }\n    createdAt\n    updatedAt\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  \n  query GetMyWishlist {\n    myWishlist {\n      ...WishlistFields\n    }\n  }\n"): (typeof documents)["\n  \n  query GetMyWishlist {\n    myWishlist {\n      ...WishlistFields\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query GetMyWishlistProductIds {\n    myWishlistProductIds\n  }\n"): (typeof documents)["\n  query GetMyWishlistProductIds {\n    myWishlistProductIds\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  \n  mutation AddToWishlist($input: ToggleWishlistInput!) {\n    addToWishlist(input: $input) {\n      ...WishlistFields\n    }\n  }\n"): (typeof documents)["\n  \n  mutation AddToWishlist($input: ToggleWishlistInput!) {\n    addToWishlist(input: $input) {\n      ...WishlistFields\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  \n  mutation RemoveFromWishlist($input: ToggleWishlistInput!) {\n    removeFromWishlist(input: $input) {\n      ...WishlistFields\n    }\n  }\n"): (typeof documents)["\n  \n  mutation RemoveFromWishlist($input: ToggleWishlistInput!) {\n    removeFromWishlist(input: $input) {\n      ...WishlistFields\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  \n  mutation ClearWishlist {\n    clearWishlist {\n      ...WishlistFields\n    }\n  }\n"): (typeof documents)["\n  \n  mutation ClearWishlist {\n    clearWishlist {\n      ...WishlistFields\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query GetAdminThemeSSR {\n    adminTheme {\n      id\n      primaryLight\n      primaryDark\n      accentLight\n      accentDark\n      sidebarLight\n      sidebarDark\n      destructiveLight\n      destructiveDark\n      radius\n      fontFamily\n      updatedAt\n      updatedById\n    }\n  }\n"): (typeof documents)["\n  query GetAdminThemeSSR {\n    adminTheme {\n      id\n      primaryLight\n      primaryDark\n      accentLight\n      accentDark\n      sidebarLight\n      sidebarDark\n      destructiveLight\n      destructiveDark\n      radius\n      fontFamily\n      updatedAt\n      updatedById\n    }\n  }\n"];

export function graphql(source: string) {
  return (documents as any)[source] ?? {};
}

export type DocumentType<TDocumentNode extends DocumentNode<any, any>> = TDocumentNode extends DocumentNode<  infer TType,  any>  ? TType  : never;