/**
 * Page (CMS) types — mirror backend GraphQL Page entity.
 *
 * `blocks` is a JSON-stringified array of `Block` objects. Frontend parses
 * + validates each block via the BLOCK_REGISTRY in components/page-builder/.
 */

export const PAGE_STATUSES = ["DRAFT", "PUBLISHED", "ARCHIVED"] as const;
export type PageStatus = (typeof PAGE_STATUSES)[number];

export const PAGE_STATUS_LABEL: Record<PageStatus, string> = {
  DRAFT: "Draft",
  PUBLISHED: "Published",
  ARCHIVED: "Archived",
};

export interface Page {
  id: string;
  slug: string;
  title: string;
  metaTitle?: string | null;
  metaDesc?: string | null;
  status: PageStatus;
  /** JSON-encoded array of blocks. Use parseBlocks() to read. */
  blocks: string;
  isSystem: boolean;
  publishedAt?: string | null;
  createdById?: string | null;
  createdAt: string;
  updatedAt: string;
  deletedAt?: string | null;
}

export interface PaginatedPages {
  items: Page[];
  totalCount: number;
  totalPages: number;
  currentPage: number;
  pageSize: number;
}

// ---------------------------------------------------------------------------
// Block shape — stored inside Page.blocks JSON, rendered via BLOCK_REGISTRY
// ---------------------------------------------------------------------------

export interface Block<TProps = Record<string, unknown>> {
  /** Stable per-page UUID — used as React key during edits. */
  id: string;
  /** Maps to BLOCK_REGISTRY key (e.g. "hero", "rich-text"). */
  type: string;
  /**
   * Layout variant for this block (e.g. "centered" | "split" for hero).
   * Maps to a key inside the block definition's `variants` map. When
   * undefined, renderer falls back to the block's `defaultVariant`.
   */
  variant?: string;
  /** Type-specific config. Validated via the block's Zod schema in the registry. */
  props: TProps;
  /** Soft-hide without removing — useful for A/B drafting. */
  visible: boolean;
}

export function parseBlocks(json: string | null | undefined): Block[] {
  if (!json) return [];
  try {
    const parsed = JSON.parse(json);
    if (!Array.isArray(parsed)) return [];
    // Defensive: drop entries missing required fields. Lazy migration of
    // legacy blocks happens in the renderer; this just keeps the array
    // shape sane.
    return parsed.filter(
      (b): b is Block =>
        b &&
        typeof b === "object" &&
        typeof b.id === "string" &&
        typeof b.type === "string",
    );
  } catch {
    return [];
  }
}

export function serializeBlocks(blocks: Block[]): string {
  return JSON.stringify(blocks);
}

// ---------------------------------------------------------------------------
// GraphQL response shapes
// ---------------------------------------------------------------------------

export interface GetPublicPageData {
  publicPage: Page;
}

export interface GetAdminPagesData {
  adminPages: Page[];
}

export interface GetAdminPagesPaginatedData {
  adminPagesPaginated: PaginatedPages;
}

export interface GetPageData {
  page: Page;
}

export interface CreatePageData {
  createPage: Page;
}

export interface UpdatePageData {
  updatePage: Page;
}

export interface SetPageStatusData {
  setPageStatus: Page;
}

export interface RemovePageData {
  removePage: Page;
}
