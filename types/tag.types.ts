/**
 * Tag types — mirror backend GraphQL Tag entity.
 * Cross-cutting flexible labels (e.g. "trending", "diwali-special",
 * "made-in-india"). Admin-managed centrally; sellers will pick from this
 * list when listing products in 2.4d.
 */

export const TAG_STATUSES = ["ACTIVE", "INACTIVE"] as const;
export type TagStatus = (typeof TAG_STATUSES)[number];

export const TAG_STATUS_LABEL: Record<TagStatus, string> = {
  ACTIVE: "Active",
  INACTIVE: "Inactive",
};

export interface Tag {
  id: string;
  name: string;
  slug: string;
  description?: string | null;
  status: TagStatus;
  isFeatured: boolean;
  createdAt: string;
  updatedAt: string;
  deletedAt?: string | null;
}

// ---------------------------------------------------------------------------
// GraphQL response shapes
// ---------------------------------------------------------------------------
export interface GetAdminTagsData {
  adminTags: Tag[];
}

export interface GetTagsData {
  tags: Tag[];
}

export interface GetTagData {
  tag: Tag;
}

export interface CreateTagData {
  createTag: Tag;
}

export interface UpdateTagData {
  updateTag: Tag;
}

export interface SetTagStatusData {
  setTagStatus: Tag;
}

export interface RemoveTagData {
  removeTag: Tag;
}
