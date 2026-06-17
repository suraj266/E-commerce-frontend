export type CollectionType = "MANUAL" | "SMART";
export type CollectionStatus = "ACTIVE" | "INACTIVE";

export interface Collection {
  id: string;
  name: string;
  slug: string;
  description?: string | null;
  bannerUrl?: string | null;
  imageUrl?: string | null;
  type: CollectionType;
  /** JSON-encoded RuleSet string for SMART; null for MANUAL. */
  rule?: string | null;
  status: CollectionStatus;
  isFeatured: boolean;
  displayOrder: number;
  /** MANUAL membership ids. */
  productIds?: string[];
  createdAt: string;
  updatedAt: string;
}

export interface GetPublicCollectionsData {
  collections: Collection[];
}
export interface GetPublicCollectionData {
  publicCollection: Collection;
}
export interface GetAdminCollectionsData {
  adminCollections: Collection[];
}
export interface GetCollectionData {
  collection: Collection;
}
export interface CreateCollectionData {
  createCollection: Collection;
}
export interface UpdateCollectionData {
  updateCollection: Collection;
}
