"use client";

/**
 * SmartImage — provider-agnostic image renderer.
 *
 * Takes either a raw URL (legacy fields) or an Image record (post-upload)
 * and renders a Next.js `<Image>` with a custom loader that appends `?w=`
 * + `?format=webp` query params for variants. Backend (LocalProvider or
 * S3Provider) handles the actual transformation.
 *
 * Usage:
 *   <SmartImage src={store.logoUrl ?? ""} alt={store.name} purpose="LOGO"
 *               sizes="(max-width: 768px) 80px, 200px" />
 *   <SmartImage image={image} alt="..." purpose="PRODUCT_PRIMARY"
 *               sizes="(max-width: 1024px) 100vw, 800px" />
 */

import NextImage, { ImageLoaderProps } from "next/image";
import { Image as ImageRecord, IMAGE_PRESETS, ImagePurpose } from "@/types/image.types";

interface SmartImageProps {
  image?: Pick<ImageRecord, "url" | "width" | "height" | "alt"> | null;
  src?: string;
  alt: string;
  purpose: ImagePurpose;
  sizes?: string;
  className?: string;
  priority?: boolean;
  fill?: boolean;
  width?: number;
  height?: number;
}

const variantLoader = ({ src, width, quality }: ImageLoaderProps) => {
  // Append width/quality params; backend route handles them. WebP is requested
  // explicitly because browsers that don't support WebP rarely matter today.
  const url = new URL(src, typeof window === "undefined" ? "http://localhost" : window.location.origin);
  url.searchParams.set("w", String(width));
  if (quality) url.searchParams.set("q", String(quality));
  url.searchParams.set("format", "webp");
  // For absolute backend URLs we need to keep the host; for our origin we strip it.
  return url.toString();
};

export function SmartImage({
  image,
  src,
  alt,
  purpose,
  sizes,
  className,
  priority = false,
  fill = false,
  width,
  height,
}: SmartImageProps) {
  const url = image?.url ?? src ?? "";

  if (!url) {
    return (
      <div
        className={`bg-muted ${className ?? ""}`}
        aria-label={alt}
      />
    );
  }

  const preset = IMAGE_PRESETS[purpose];
  const fallbackWidth = width ?? preset.sizes[preset.sizes.length - 1];
  const fallbackHeight =
    height ?? (image ? Math.round((image.height / image.width) * fallbackWidth) : fallbackWidth);

  if (fill) {
    return (
      <NextImage
        loader={variantLoader}
        src={url}
        alt={alt}
        fill
        sizes={sizes ?? "100vw"}
        priority={priority}
        className={className}
      />
    );
  }

  return (
    <NextImage
      loader={variantLoader}
      src={url}
      alt={alt}
      width={fallbackWidth}
      height={fallbackHeight}
      sizes={sizes}
      priority={priority}
      className={className}
    />
  );
}
