"use client";

/**
 * PosterCustomizer — the buy experience for a Custom-Wall (print-on-demand)
 * product. Replaces the standard variant-picker + CTA block on the PDP when
 * `product.isCustomizable` is true.
 *
 * Flow: upload artwork → read its native resolution → show a live wall preview
 * + a print-quality message → offer only the sizes the image can print sharply
 * (no upscaling) → add to cart with the uploaded image attached.
 *
 * The size gate here is advisory/instant; the SERVER re-validates the same
 * resolution rule at add-to-cart (see CartService.buildCustomization), so a
 * tampered client can never order an under-resolution print.
 */

import { useCallback, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { useMutation } from "@apollo/client/react";
import {
  AlertTriangle,
  Check,
  Crop,
  ImagePlus,
  Loader2,
  ShoppingCart,
  Upload,
  Zap,
} from "lucide-react";
import { toast } from "sonner";

import type { Product } from "@/types/product.types";
import {
  POSTER_SIZES,
  centeredCoverCrop,
  evaluateUpload,
  findPosterSize,
  sizeAvailable,
  type CropRect,
  type PosterSize,
} from "@/config/poster-sizes";
import { ImageCropper } from "./image-cropper";
import {
  CONFIRM_IMAGE_UPLOAD,
  PRESIGN_IMAGE_UPLOAD,
} from "@/lib/graphql/images";
import { uploadImageBytes } from "@/lib/api/image.api";
import type {
  ConfirmImageUploadData,
  PresignImageUploadData,
} from "@/types/image.types";
import { useAuthStore } from "@/store/auth.store";
import { useCart } from "@/components/cart/use-cart";
import { useSiteSettings } from "@/lib/context/site-settings-context";
import { formatPrice } from "@/lib/utils/currency";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { InlineRatingLink } from "@/components/reviews/inline-rating-link";

const ACCEPT = "image/jpeg,image/png,image/webp";
const MAX_BYTES = 30 * 1024 * 1024; // 30 MB — matches the backend cap

type UploadPhase = "idle" | "uploading" | "ready" | "error";

/** Rough on-wall display scale per size, to hint physical proportions. */
const WALL_SCALE: Record<string, number> = { A4: 0.42, A3: 0.55, A2: 0.7, A1: 0.86 };

interface SizeOption {
  variantId: string;
  size: PosterSize;
  price: number;
  priceWithTax: number | null;
  taxAmount: number | null;
  outOfStock: boolean;
}

export function PosterCustomizer({ product }: { product: Product }) {
  const { add: addToCart, busy: cartBusy } = useCart();
  const { getDisplayPrice, showPriceWithTax } = useSiteSettings();
  const accessToken = useAuthStore((s) => s.accessToken);
  const currency =
    (product as unknown as { metadata?: { currencyCode?: string } }).metadata
      ?.currencyCode ?? "INR";

  const [presign] = useMutation<PresignImageUploadData>(PRESIGN_IMAGE_UPLOAD);
  const [confirm] = useMutation<ConfirmImageUploadData>(CONFIRM_IMAGE_UPLOAD);

  const inputRef = useRef<HTMLInputElement>(null);

  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [dims, setDims] = useState<{ w: number; h: number } | null>(null);
  const [phase, setPhase] = useState<UploadPhase>("idle");
  const [progress, setProgress] = useState<number | null>(null);
  const [imageId, setImageId] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string | null>(null);
  const [notes, setNotes] = useState("");
  const [selectedVariantId, setSelectedVariantId] = useState<string | null>(null);
  const [dragActive, setDragActive] = useState(false);
  // WYSIWYG crop rectangle for the SELECTED size (null → centered default).
  // Reset to null whenever the image or the size (hence aspect) changes.
  const [crop, setCrop] = useState<CropRect | null>(null);
  const [cropOpen, setCropOpen] = useState(false);

  // Map each size variant to its poster spec, ordered smallest → largest.
  const options = useMemo<SizeOption[]>(() => {
    const out: SizeOption[] = [];
    for (const v of product.variants ?? []) {
      if (v.status === "INACTIVE") continue;
      const label =
        v.attributes.find((a) => a.attributeName === "Print Size")?.value ??
        v.name ??
        "";
      const size = findPosterSize(label);
      if (!size) continue;
      out.push({
        variantId: v.id,
        size,
        price: v.price,
        priceWithTax: v.priceWithTax ?? null,
        taxAmount: v.taxAmount ?? null,
        outOfStock: (v.availableQuantity ?? 1) <= 0,
      });
    }
    return out.sort(
      (a, b) =>
        POSTER_SIZES.indexOf(a.size) - POSTER_SIZES.indexOf(b.size),
    );
  }, [product.variants]);

  const quality = useMemo(
    () => (dims ? evaluateUpload(dims.w, dims.h) : null),
    [dims],
  );

  /** Is a given size orderable with the current upload (at its best crop)? */
  const sizeOk = useCallback(
    (size: PosterSize) => (dims ? sizeAvailable(dims.w, dims.h, size) : false),
    [dims],
  );

  const selected = options.find((o) => o.variantId === selectedVariantId) ?? null;

  // The crop actually used for preview + order: the user's applied crop, or a
  // centered cover crop at the selected size's aspect when they haven't cropped.
  const selectedAspect = selected
    ? selected.size.widthCm / selected.size.heightCm
    : null;
  const effectiveCrop =
    dims && selectedAspect
      ? (crop ?? centeredCoverCrop(dims.w, dims.h, selectedAspect))
      : null;

  const readAndUpload = useCallback(
    async (file: File) => {
      if (!ACCEPT.split(",").includes(file.type)) {
        toast.error("Please upload a JPEG, PNG or WebP image.");
        return;
      }
      if (file.size > MAX_BYTES) {
        toast.error(
          `That file is ${(file.size / 1024 / 1024).toFixed(1)} MB — the limit is 30 MB.`,
        );
        return;
      }

      // Instant local preview + native dimensions (before any upload).
      const url = URL.createObjectURL(file);
      setPreviewUrl((prev) => {
        if (prev) URL.revokeObjectURL(prev);
        return url;
      });
      setFileName(file.name);
      setImageId(null);
      setCrop(null);
      setPhase("uploading");
      setProgress(0);

      const probe = new window.Image();
      probe.onload = () => {
        const w = probe.naturalWidth;
        const h = probe.naturalHeight;
        setDims({ w, h });
        // Auto-select the largest size this image prints sharply at.
        const best = [...POSTER_SIZES]
          .reverse()
          .find((s) => sizeAvailable(w, h, s));
        const match = best
          ? options.find((o) => o.size.label === best.label)
          : null;
        // Always land on a size so the crop + controls stay available — fall
        // back to the smallest offered size when the image is below every
        // size's ideal DPI (we warn about quality rather than hard-block).
        setSelectedVariantId(
          match?.variantId ?? options[0]?.variantId ?? null,
        );
      };
      probe.src = url;

      try {
        const presignRes = await presign({
          variables: {
            presignUploadInput: {
              purpose: "CUSTOM_ARTWORK",
              contentType: file.type,
              originalName: file.name,
            },
          },
        });
        const payload = presignRes.data?.presignImageUpload;
        if (!payload) throw new Error("Could not start the upload.");

        await uploadImageBytes({
          file,
          uploadUrl: payload.uploadUrl,
          method: payload.method as "POST" | "PUT",
          fields: JSON.parse(payload.fields || "{}"),
          provider: payload.provider,
          accessToken: accessToken ?? undefined,
          onProgress: (p) => setProgress(p.percent),
        });

        const confirmRes = await confirm({
          variables: {
            confirmUploadInput: {
              externalId: payload.externalId,
              purpose: "CUSTOM_ARTWORK",
            },
          },
        });
        const image = confirmRes.data?.confirmImageUpload;
        if (!image) throw new Error("Upload could not be confirmed.");

        // Trust the server's measured dimensions once available.
        setDims({ w: image.width, h: image.height });
        setImageId(image.id);
        setPhase("ready");
      } catch (err) {
        setPhase("error");
        toast.error(err instanceof Error ? err.message : "Upload failed.");
      } finally {
        setProgress(null);
      }
    },
    [accessToken, confirm, options, presign],
  );

  function onPick(files: FileList | null) {
    const file = files?.[0];
    if (file) void readAndUpload(file);
  }

  const canOrder =
    phase === "ready" && !!imageId && !!selected && !selected.outOfStock;

  async function handleAdd(buyNow: boolean) {
    if (!selected) {
      toast.error("Pick a size first.");
      return;
    }
    if (!imageId || phase !== "ready") {
      toast.error("Please wait for your image to finish uploading.");
      return;
    }
    const ok = await addToCart(selected.variantId, 1, {
      silent: buyNow,
      customization: {
        imageId,
        notes: notes.trim() || undefined,
        crop: effectiveCrop
          ? {
              x: effectiveCrop.x,
              y: effectiveCrop.y,
              w: effectiveCrop.w,
              h: effectiveCrop.h,
            }
          : undefined,
      },
    });
    if (ok && buyNow) window.location.href = "/cart";
  }

  const displayPrice = selected
    ? getDisplayPrice(selected.price, selected.priceWithTax)
    : null;

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:gap-10">
      {/* LEFT — live preview of the customer's poster */}
      <div className="md:sticky md:top-6 md:self-start">
        <div
          className="relative overflow-hidden rounded-xl border bg-muted p-6"
          style={{
            backgroundImage: "url('/poster-wall-scene.svg')",
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        >
          <div className="flex min-h-[360px] items-center justify-center md:min-h-[460px]">
          <div
            className="relative rounded-sm bg-white transition-all"
            style={{
              width: `${(WALL_SCALE[selected?.size.label ?? "A3"] ?? 0.55) * 100}%`,
              maxWidth: 360,
              aspectRatio: selected
                ? `${selected.size.widthCm} / ${selected.size.heightCm}`
                : "3 / 4",
              padding: 8,
            }}
          >
            {previewUrl ? (
              <div className="relative h-full w-full overflow-hidden rounded-[1px] bg-muted">
                {/* Show exactly the printed crop (WYSIWYG), not object-fit cover. */}
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={previewUrl}
                  alt="Your poster preview"
                  draggable={false}
                  className="absolute select-none"
                  style={
                    effectiveCrop
                      ? {
                          width: `${100 / effectiveCrop.w}%`,
                          height: `${100 / effectiveCrop.h}%`,
                          left: `${(-effectiveCrop.x * 100) / effectiveCrop.w}%`,
                          top: `${(-effectiveCrop.y * 100) / effectiveCrop.h}%`,
                          maxWidth: "none",
                        }
                      : {
                          width: "100%",
                          height: "100%",
                          objectFit: "cover",
                        }
                  }
                />
              </div>
            ) : (
              <div className="flex h-full w-full flex-col items-center justify-center gap-1 rounded-[1px] bg-muted text-muted-foreground">
                <ImagePlus className="h-6 w-6" />
                <span className="text-[11px]">Your art here</span>
              </div>
            )}
          </div>
        </div>
        {selected && (
          <div className="mt-3 flex flex-col items-center gap-1.5">
            <p className="text-center text-xs text-muted-foreground">
              Actual print size: {selected.size.title}
            </p>
            {previewUrl && (
              <button
                type="button"
                onClick={() => setCropOpen(true)}
                className="inline-flex items-center gap-1.5 rounded-md border px-2.5 py-1 text-xs font-medium transition hover:bg-muted"
              >
                <Crop className="h-3.5 w-3.5" />
                Adjust crop / position
              </button>
            )}
          </div>
        )}
        </div>
      </div>

      {/* RIGHT — product details + upload controls */}
      <div className="space-y-4">
        {product.brand && (
          <Link
            href={`/brand/${product.brand.slug}`}
            className="inline-flex items-center gap-2"
          >
            <Badge variant="outline" className="text-xs">
              {product.brand.name}
            </Badge>
          </Link>
        )}

        <h1 className="font-heading text-2xl font-bold tracking-tight sm:text-3xl">
          {product.name}
        </h1>

        <InlineRatingLink productId={product.id} />

        {product.shortDescription && (
          <p className="text-muted-foreground">{product.shortDescription}</p>
        )}

      {/* Uploader */}
      <div>
        <div
          role="button"
          tabIndex={0}
          onClick={() => inputRef.current?.click()}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") inputRef.current?.click();
          }}
          onDragOver={(e) => {
            e.preventDefault();
            setDragActive(true);
          }}
          onDragLeave={() => setDragActive(false)}
          onDrop={(e) => {
            e.preventDefault();
            setDragActive(false);
            onPick(e.dataTransfer.files);
          }}
          className={`flex cursor-pointer flex-col items-center justify-center gap-1 rounded-lg border-2 border-dashed px-4 py-5 text-center transition-colors ${
            dragActive
              ? "border-primary bg-primary/5"
              : "border-muted-foreground/30 hover:border-muted-foreground/50"
          }`}
        >
          {phase === "uploading" ? (
            <Loader2 className="h-6 w-6 animate-spin text-primary" />
          ) : (
            <Upload className="h-6 w-6 text-muted-foreground" />
          )}
          <span className="text-sm font-medium">
            {previewUrl ? "Replace image" : "Upload your image"}
          </span>
          <span className="text-[11px] text-muted-foreground">
            JPEG / PNG / WebP · up to 30 MB
            {phase === "uploading" && progress !== null ? ` · ${progress}%` : ""}
          </span>
        </div>
        <input
          ref={inputRef}
          type="file"
          accept={ACCEPT}
          className="hidden"
          onChange={(e) => {
            onPick(e.target.files);
            e.target.value = "";
          }}
        />
      </div>

      {/* Quality feedback */}
      {quality && (
        <div
          className={`flex items-start gap-2 rounded-lg border px-3 py-2 text-xs ${
            quality.tone === "good"
              ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300"
              : quality.tone === "partial"
                ? "border-amber-500/30 bg-amber-500/10 text-amber-700 dark:text-amber-300"
                : "border-red-500/30 bg-red-500/10 text-red-700 dark:text-red-300"
          }`}
        >
          {quality.tone === "good" ? (
            <Check className="mt-0.5 h-4 w-4 shrink-0" />
          ) : (
            <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" />
          )}
          <span>{quality.message}</span>
        </div>
      )}

      {/* Size chips (DPI-gated) */}
      <div className="space-y-1.5">
        <div className="text-sm font-medium">Size</div>
        <div className="flex flex-wrap gap-2">
          {options.map((o) => {
            const lowRes = dims != null && !sizeOk(o.size);
            const disabled = o.outOfStock;
            const isSelected = selectedVariantId === o.variantId;
            return (
              <button
                key={o.variantId}
                type="button"
                disabled={disabled}
                title={
                  o.outOfStock
                    ? "Unavailable"
                    : lowRes
                      ? `Lower print quality at ${o.size.label} — your image is below the ideal resolution for this size`
                      : undefined
                }
                onClick={() => {
                  setSelectedVariantId(o.variantId);
                  setCrop(null); // aspect changed → reset to centered default
                }}
                className={`rounded-md border px-3 py-1.5 text-sm transition ${
                  isSelected
                    ? "border-brand bg-brand text-brand-foreground"
                    : disabled
                      ? "cursor-not-allowed border-border bg-muted text-muted-foreground opacity-50 line-through"
                      : lowRes
                        ? "border-amber-400/60 bg-amber-50 text-amber-800 hover:border-amber-500 dark:bg-amber-900/20 dark:text-amber-300"
                        : "border-border bg-background text-foreground hover:border-foreground"
                }`}
              >
                {o.size.label}
                {lowRes && !isSelected ? " ⚠" : ""}
              </button>
            );
          })}
        </div>
      </div>

      {/* Optional note for the printer */}
      <div className="space-y-1.5">
        <label htmlFor="poster-notes" className="text-sm font-medium">
          Note for the printer{" "}
          <span className="font-normal text-muted-foreground">(optional)</span>
        </label>
        <Textarea
          id="poster-notes"
          value={notes}
          onChange={(e) => setNotes(e.target.value.slice(0, 500))}
          rows={2}
          placeholder="e.g. keep the colours warm; crop centred on the face"
        />
      </div>

      {/* Price */}
      {selected && displayPrice != null && (
        <div className="pt-1">
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-bold">
              {formatPrice(displayPrice, currency)}
            </span>
            <span className="text-sm text-muted-foreground">
              / {selected.size.label}
            </span>
          </div>
          <p className="text-xs text-muted-foreground">
            {showPriceWithTax
              ? "Inclusive of all taxes"
              : selected.taxAmount != null && selected.taxAmount > 0
                ? `+ ${formatPrice(selected.taxAmount, currency)} tax at checkout`
                : "Tax extra at checkout"}
          </p>
        </div>
      )}

      {/* CTAs */}
      <div className="flex flex-col gap-3 sm:flex-row">
        <Button
          size="xl"
          variant="cta"
          className="flex-1"
          disabled={!canOrder || cartBusy}
          onClick={() => void handleAdd(false)}
        >
          <ShoppingCart className="mr-2 h-5 w-5" />
          {phase === "uploading"
            ? "Uploading..."
            : cartBusy
              ? "Adding..."
              : "Add to Cart"}
        </Button>
        <Button
          size="xl"
          variant="brand"
          className="flex-1"
          disabled={!canOrder || cartBusy}
          onClick={() => void handleAdd(true)}
        >
          <Zap className="mr-2 h-5 w-5" />
          Buy Now
        </Button>
      </div>
      {!previewUrl && (
        <p className="text-center text-xs text-muted-foreground">
          Upload an image to choose a size and add it to your cart.
        </p>
      )}
      {fileName && (
        <p className="truncate text-center text-[11px] text-muted-foreground">
          {fileName}
          {dims ? ` · ${dims.w}×${dims.h}px` : ""}
        </p>
      )}
      </div>

      {previewUrl && selected && cropOpen && (
        <ImageCropper
          open={cropOpen}
          imageUrl={previewUrl}
          aspect={selected.size.widthCm / selected.size.heightCm}
          minWidthPx={selected.size.minWidthPx}
          minHeightPx={selected.size.minHeightPx}
          sizeLabel={selected.size.label}
          onApply={(c) => {
            setCrop(c);
            setCropOpen(false);
          }}
          onCancel={() => setCropOpen(false)}
        />
      )}
    </div>
  );
}
