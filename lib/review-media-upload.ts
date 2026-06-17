/**
 * Wrapper around POST /media/review/upload — uploads a single file (image
 * or short video) and returns the metadata the review mutation needs.
 *
 * Auth: sends the user's access token from `useAuthStore`. The endpoint is
 * JWT-guarded since uploads cost storage; anonymous uploads would be a free
 * abuse vector.
 */

import type { ReviewMediaInput } from "@/types/review.types";

const GRAPHQL_URL =
  process.env.NEXT_PUBLIC_GRAPHQL_URL || "http://localhost:7000/graphql";

/** Derives the REST upload URL from the GraphQL URL (same origin). */
function uploadUrl(): string {
  try {
    const u = new URL(GRAPHQL_URL);
    return `${u.protocol}//${u.host}/media/review/upload`;
  } catch {
    return "http://localhost:7000/media/review/upload";
  }
}

export interface UploadReviewMediaResult extends ReviewMediaInput {}

export async function uploadReviewMedia(
  file: File,
  accessToken: string,
): Promise<UploadReviewMediaResult> {
  const form = new FormData();
  form.append("file", file);

  const res = await fetch(uploadUrl(), {
    method: "POST",
    headers: { Authorization: `Bearer ${accessToken}` },
    body: form,
  });

  if (!res.ok) {
    const text = await res.text().catch(() => "");
    let message = `Upload failed (${res.status})`;
    try {
      const parsed = JSON.parse(text);
      message = parsed.message ?? message;
    } catch {
      if (text) message = text;
    }
    throw new Error(message);
  }

  // The REST API wraps every successful response in a global envelope
  // ({ success, data, message, ... } — see backend ResponseInterceptor), so
  // the actual payload lives under `.data`. Unwrap defensively, falling back
  // to the root in case the envelope is ever removed.
  type UploadBody = {
    url: string;
    type: "IMAGE" | "VIDEO";
    sizeBytes: number;
    width?: number;
    height?: number;
  };
  const raw = (await res.json()) as { data?: UploadBody } & Partial<UploadBody>;
  const body = (raw.data ?? raw) as UploadBody;
  return {
    type: body.type,
    url: body.url,
    sizeBytes: body.sizeBytes,
    width: body.width,
    height: body.height,
  };
}

/**
 * Probe a local video file for its duration before upload — cheap on the
 * client (just metadata, not the bytes). Returns ms, or null on error.
 */
export function getVideoDurationMs(file: File): Promise<number | null> {
  if (!file.type.startsWith("video/")) return Promise.resolve(null);
  return new Promise((resolve) => {
    const video = document.createElement("video");
    video.preload = "metadata";
    video.onloadedmetadata = () => {
      const ms = Math.round((video.duration ?? 0) * 1000);
      URL.revokeObjectURL(video.src);
      resolve(Number.isFinite(ms) && ms > 0 ? ms : null);
    };
    video.onerror = () => {
      URL.revokeObjectURL(video.src);
      resolve(null);
    };
    video.src = URL.createObjectURL(file);
  });
}
