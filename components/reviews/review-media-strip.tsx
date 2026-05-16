"use client";

/**
 * Strip of media thumbnails shown under a review. Click any item to open a
 * lightweight lightbox/overlay that shows the full image or plays the video.
 *
 * v1 keeps the lightbox in-component (no external dep). v2 might switch to
 * a shared media-viewer if the storefront grows more attachment surfaces.
 */

import { useEffect, useState } from "react";
import Image from "next/image";
import { Play, Video, X } from "lucide-react";

import type { ReviewMedia } from "@/types/review.types";

export function ReviewMediaStrip({ media }: { media: ReviewMedia[] }) {
  const [openIdx, setOpenIdx] = useState<number | null>(null);

  // Esc closes the lightbox
  useEffect(() => {
    if (openIdx == null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpenIdx(null);
      if (e.key === "ArrowRight")
        setOpenIdx((i) => (i == null ? null : (i + 1) % media.length));
      if (e.key === "ArrowLeft")
        setOpenIdx((i) =>
          i == null ? null : (i - 1 + media.length) % media.length,
        );
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [openIdx, media.length]);

  if (media.length === 0) return null;

  return (
    <>
      <div className="mt-3 flex flex-wrap gap-2">
        {media.map((m, i) => (
          <button
            key={m.id}
            type="button"
            onClick={() => setOpenIdx(i)}
            className="relative h-20 w-20 rounded-md overflow-hidden border bg-muted hover:opacity-90 transition focus:outline-none focus:ring-2 focus:ring-ring/50"
            aria-label={`Open ${m.type === "VIDEO" ? "video" : "photo"}`}
          >
            {m.type === "IMAGE" ? (
              // Plain <img> — the URL is on our REST media host, not
              // necessarily in Next's image-optimisation allowlist.
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={m.url}
                alt=""
                className="h-full w-full object-cover"
              />
            ) : (
              <>
                <div className="h-full w-full flex flex-col items-center justify-center bg-foreground/5">
                  <Video className="h-5 w-5 text-foreground/60" />
                </div>
                <Play className="absolute inset-0 m-auto h-7 w-7 text-foreground/30" />
              </>
            )}
          </button>
        ))}
      </div>

      {openIdx != null && media[openIdx] && (
        <Lightbox
          item={media[openIdx]}
          onClose={() => setOpenIdx(null)}
          onPrev={
            media.length > 1
              ? () =>
                  setOpenIdx((i) =>
                    i == null ? null : (i - 1 + media.length) % media.length,
                  )
              : undefined
          }
          onNext={
            media.length > 1
              ? () =>
                  setOpenIdx((i) => (i == null ? null : (i + 1) % media.length))
              : undefined
          }
        />
      )}
    </>
  );
}

// ---------------------------------------------------------------------------
function Lightbox({
  item,
  onClose,
  onPrev,
  onNext,
}: {
  item: ReviewMedia;
  onClose: () => void;
  onPrev?: () => void;
  onNext?: () => void;
}) {
  return (
    <div
      // Backdrop — click to close. Inner content stops propagation so clicks
      // on the image/video don't dismiss the viewer.
      onClick={onClose}
      className="fixed inset-0 z-50 bg-black/80 backdrop-blur flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
    >
      <button
        type="button"
        onClick={onClose}
        aria-label="Close"
        className="absolute top-4 right-4 inline-flex h-9 w-9 items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20 transition"
      >
        <X className="h-5 w-5" />
      </button>
      {onPrev && (
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onPrev();
          }}
          aria-label="Previous"
          className="absolute left-4 top-1/2 -translate-y-1/2 inline-flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20 transition"
        >
          ‹
        </button>
      )}
      {onNext && (
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onNext();
          }}
          aria-label="Next"
          className="absolute right-4 top-1/2 -translate-y-1/2 inline-flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20 transition"
        >
          ›
        </button>
      )}

      <div
        onClick={(e) => e.stopPropagation()}
        className="max-w-[min(1100px,90vw)] max-h-[85vh] flex items-center justify-center"
      >
        {item.type === "IMAGE" ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={item.url}
            alt=""
            className="max-w-full max-h-[85vh] object-contain"
          />
        ) : (
          <video
            src={item.url}
            controls
            autoPlay
            className="max-w-full max-h-[85vh]"
          />
        )}
      </div>
    </div>
  );
}
