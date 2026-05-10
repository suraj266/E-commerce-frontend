/**
 * Slider types — mirror backend Slider + SlideItem entities.
 *
 * `config` is JSON-encoded (slider-level settings). Use parseSliderConfig
 * to read; serializeSliderConfig to write back.
 */

export const SLIDER_STATUSES = ["DRAFT", "PUBLISHED", "ARCHIVED"] as const;
export type SliderStatus = (typeof SLIDER_STATUSES)[number];

export const SLIDER_STATUS_LABEL: Record<SliderStatus, string> = {
  DRAFT: "Draft",
  PUBLISHED: "Published",
  ARCHIVED: "Archived",
};

export const SLIDER_STYLES = ["default", "full-width", "boxed"] as const;
export type SliderStyle = (typeof SLIDER_STYLES)[number];

export const SLIDER_STYLE_LABEL: Record<SliderStyle, string> = {
  default: "Default",
  "full-width": "Full width",
  boxed: "Boxed",
};

export interface SliderConfig {
  style?: SliderStyle;
  /** Auto-advance interval in ms. 0 disables. */
  autoplayMs?: number;
  /** Show prev/next arrows on the public render. */
  showArrows?: boolean;
  /** Show dot indicators at the bottom. */
  showDots?: boolean;
}

export interface SlideItem {
  id: string;
  sliderId: string;
  title?: string | null;
  description?: string | null;
  link?: string | null;
  ctaLabel?: string | null;
  imageUrl?: string | null;
  tabletImageUrl?: string | null;
  mobileImageUrl?: string | null;
  order: number;
  isEnabled: boolean;
  createdAt: string;
  updatedAt: string;
  deletedAt?: string | null;
}

export interface Slider {
  id: string;
  name: string;
  key: string;
  description?: string | null;
  status: SliderStatus;
  /** JSON-encoded SliderConfig. */
  config: string;
  createdAt: string;
  updatedAt: string;
  deletedAt?: string | null;
  items?: SlideItem[];
}

export interface PaginatedSliders {
  items: Slider[];
  totalCount: number;
  totalPages: number;
  currentPage: number;
  pageSize: number;
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

export function parseSliderConfig(json: string | null | undefined): SliderConfig {
  if (!json) return {};
  try {
    const parsed = JSON.parse(json);
    if (!parsed || typeof parsed !== "object") return {};
    return parsed as SliderConfig;
  } catch {
    return {};
  }
}

export function serializeSliderConfig(config: SliderConfig): string {
  return JSON.stringify(config);
}

/** Pick the right image URL for the current viewport with fallback chain. */
export function pickResponsiveImage(
  slide: Pick<SlideItem, "imageUrl" | "tabletImageUrl" | "mobileImageUrl">,
  viewport: "desktop" | "tablet" | "mobile",
): string | null {
  if (viewport === "mobile") {
    return slide.mobileImageUrl ?? slide.tabletImageUrl ?? slide.imageUrl ?? null;
  }
  if (viewport === "tablet") {
    return slide.tabletImageUrl ?? slide.imageUrl ?? null;
  }
  return slide.imageUrl ?? slide.tabletImageUrl ?? slide.mobileImageUrl ?? null;
}

// ---------------------------------------------------------------------------
// GraphQL response shapes
// ---------------------------------------------------------------------------

export interface GetPublicSliderData {
  publicSlider: Slider;
}

export interface GetAdminSlidersData {
  adminSliders: Slider[];
}

export interface GetAdminSlidersPaginatedData {
  adminSlidersPaginated: PaginatedSliders;
}

export interface GetAdminSliderData {
  adminSlider: Slider;
}

export interface CreateSliderData {
  createSlider: Slider;
}

export interface UpdateSliderData {
  updateSlider: Slider;
}

export interface SetSliderStatusData {
  setSliderStatus: Slider;
}

export interface RemoveSliderData {
  removeSlider: Slider;
}

export interface AddSlideItemData {
  addSlideItem: SlideItem;
}

export interface UpdateSlideItemData {
  updateSlideItem: SlideItem;
}

export interface RemoveSlideItemData {
  removeSlideItem: SlideItem;
}

export interface ReorderSlideItemsData {
  reorderSlideItems: boolean;
}
