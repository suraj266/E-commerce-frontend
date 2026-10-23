/**
 * Custom-Wall poster sizes — FRONTEND mirror of the backend
 * `backend/src/modules/ecommerce/custom-poster/poster-sizes.ts`.
 *
 * Used for the instant, client-side quality hints on the PDP (which sizes an
 * uploaded image can print sharply, the live wall-preview aspect ratio, the
 * feedback message). The SERVER re-validates authoritatively at add-to-cart —
 * this is advisory UX only, so keep the numbers in sync with the backend.
 */

export interface PosterSize {
  label: string; // "A4" — matches the variant's Print Size attribute value
  title: string; // "A4 (21 × 29.7 cm)"
  widthCm: number;
  heightCm: number;
  dpiTarget: number;
  minWidthPx: number;
  minHeightPx: number;
}

function pxFor(cm: number, dpi: number): number {
  return Math.ceil((cm / 2.54) * dpi);
}

function size(
  label: string,
  widthCm: number,
  heightCm: number,
  dpiTarget: number,
): PosterSize {
  return {
    label,
    title: `${label} (${widthCm} × ${heightCm} cm)`,
    widthCm,
    heightCm,
    dpiTarget,
    minWidthPx: pxFor(widthCm, dpiTarget),
    minHeightPx: pxFor(heightCm, dpiTarget),
  };
}

/** Ordered smallest → largest. Keep in sync with the backend POSTER_SIZES. */
export const POSTER_SIZES: readonly PosterSize[] = [
  size("A4", 21.0, 29.7, 300),
  size("A3", 29.7, 42.0, 300),
  size("A2", 42.0, 59.4, 150),
  size("A1", 59.4, 84.1, 150),
] as const;

/** Look up a size spec from a variant's Print Size label (e.g. "A4"). */
export function findPosterSize(label: string | null | undefined): PosterSize | undefined {
  if (!label) return undefined;
  const norm = label.trim().toUpperCase();
  // Accept both "A4" and "A4 (21 × 29.7 cm)".
  return POSTER_SIZES.find(
    (s) => s.label === norm || norm.startsWith(`${s.label} `) || norm.startsWith(`${s.label}(`),
  );
}

/**
 * Orientation-agnostic resolution gate — mirrors the backend `meetsResolution`.
 * Returns true when the image has enough native pixels to print `size` at its
 * target DPI without upscaling.
 */
export function imageMeetsSize(
  imgW: number,
  imgH: number,
  size: Pick<PosterSize, "minWidthPx" | "minHeightPx">,
): boolean {
  if (!imgW || !imgH) return false;
  const short = Math.min(imgW, imgH);
  const long = Math.max(imgW, imgH);
  const reqShort = Math.min(size.minWidthPx, size.minHeightPx);
  const reqLong = Math.max(size.minWidthPx, size.minHeightPx);
  return short >= reqShort && long >= reqLong;
}

export interface CropRect {
  x: number;
  y: number;
  w: number;
  h: number;
}

/**
 * Largest centered rectangle of `aspect` (w/h) that fits the image, normalized
 * 0..1. This is the DEFAULT crop (equivalent to object-fit: cover, centered)
 * and the maximum-resolution crop for that aspect.
 */
export function centeredCoverCrop(
  imgW: number,
  imgH: number,
  aspect: number,
): CropRect {
  if (!imgW || !imgH) return { x: 0, y: 0, w: 1, h: 1 };
  const imgAspect = imgW / imgH;
  let w: number;
  let h: number;
  if (imgAspect >= aspect) {
    h = 1;
    w = (aspect * imgH) / imgW;
  } else {
    w = 1;
    h = imgW / aspect / imgH;
  }
  return { x: (1 - w) / 2, y: (1 - h) / 2, w, h };
}

/** Printed pixels of a normalized crop against the original image. */
export function cropPrintPx(
  imgW: number,
  imgH: number,
  crop: CropRect,
): { w: number; h: number } {
  return { w: Math.round(crop.w * imgW), h: Math.round(crop.h * imgH) };
}

/**
 * Can this size be printed sharply from this image? Measured on the BEST crop
 * (centered cover at the size's aspect) — the same rectangle the DPI gate
 * checks — so chip availability matches what the server will accept.
 */
export function sizeAvailable(
  imgW: number,
  imgH: number,
  size: PosterSize,
): boolean {
  const aspect = size.widthCm / size.heightCm;
  const px = cropPrintPx(imgW, imgH, centeredCoverCrop(imgW, imgH, aspect));
  const short = Math.min(px.w, px.h);
  const long = Math.max(px.w, px.h);
  const reqShort = Math.min(size.minWidthPx, size.minHeightPx);
  const reqLong = Math.max(size.minWidthPx, size.minHeightPx);
  return short >= reqShort && long >= reqLong;
}

/** Effective print DPI the image would achieve at `size` (min across edges). */
export function effectiveDpi(
  imgW: number,
  imgH: number,
  size: Pick<PosterSize, "widthCm" | "heightCm">,
): number {
  if (!imgW || !imgH) return 0;
  const short = Math.min(imgW, imgH);
  const long = Math.max(imgW, imgH);
  const shortIn = Math.min(size.widthCm, size.heightCm) / 2.54;
  const longIn = Math.max(size.widthCm, size.heightCm) / 2.54;
  return Math.floor(Math.min(short / shortIn, long / longIn));
}

export interface UploadQuality {
  /** Largest size the image can print sharply (null if none). */
  bestSize: PosterSize | null;
  /** Per-size availability, ordered smallest → largest. */
  perSize: { size: PosterSize; ok: boolean }[];
  /** Human summary for the feedback banner. */
  message: string;
  tone: "good" | "partial" | "bad";
}

/** Evaluate an uploaded image's print quality across every size. */
export function evaluateUpload(imgW: number, imgH: number): UploadQuality {
  const perSize = POSTER_SIZES.map((s) => ({
    size: s,
    ok: sizeAvailable(imgW, imgH, s),
  }));
  const okOnes = perSize.filter((p) => p.ok).map((p) => p.size);
  const bestSize = okOnes.length ? okOnes[okOnes.length - 1] : null;

  let message: string;
  let tone: UploadQuality["tone"];
  if (!bestSize) {
    const smallest = POSTER_SIZES[0];
    tone = "bad";
    message = `This image is ${imgW}×${imgH}px — too low-resolution to print sharply even at ${smallest.label}. It needs at least ${smallest.minWidthPx}×${smallest.minHeightPx}px. Try a higher-resolution file.`;
  } else if (okOnes.length === POSTER_SIZES.length) {
    tone = "good";
    message = `Great quality! This image (${imgW}×${imgH}px) will print sharply at every size, up to ${bestSize.label}.`;
  } else {
    tone = "partial";
    const lockedLabels = perSize
      .filter((p) => !p.ok)
      .map((p) => p.size.label)
      .join(", ");
    message = `Good quality up to ${bestSize.label}. ${lockedLabels} need${
      lockedLabels.includes(",") ? "" : "s"
    } a higher-resolution image (larger prints need more pixels).`;
  }
  return { bestSize, perSize, message, tone };
}
