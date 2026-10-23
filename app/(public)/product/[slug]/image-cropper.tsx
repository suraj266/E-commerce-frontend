"use client";

/**
 * ImageCropper — a dependency-free, aspect-locked crop modal.
 *
 * The frame is locked to the chosen print size's aspect ratio, so whatever sits
 * inside the frame is EXACTLY what gets printed (WYSIWYG — the whole point).
 * The user pans (drag) and zooms (slider) the image behind the fixed window; we
 * capture the crop as a rectangle normalized to the original image (0..1) and
 * show the live effective print resolution so they can't zoom past what prints
 * sharply.
 *
 * No canvas/cropper library — pure DOM transform math — so it adds no npm
 * dependency (and no Docker image rebuild).
 */

import { useCallback, useEffect, useRef, useState } from "react";
import { AlertTriangle, Check } from "lucide-react";

import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import type { CropRect } from "@/config/poster-sizes";

export type { CropRect };

const FRAME_W = 320;
const MAX_ZOOM = 5;

interface Props {
  open: boolean;
  imageUrl: string;
  /** Target print aspect ratio, width / height. */
  aspect: number;
  minWidthPx: number;
  minHeightPx: number;
  sizeLabel: string;
  onApply: (crop: CropRect) => void;
  onCancel: () => void;
}

export function ImageCropper({
  open,
  imageUrl,
  aspect,
  minWidthPx,
  minHeightPx,
  sizeLabel,
  onApply,
  onCancel,
}: Props) {
  const frameW = FRAME_W;
  const frameH = Math.round(FRAME_W / aspect);

  const [nat, setNat] = useState<{ w: number; h: number } | null>(null);
  const [coverScale, setCoverScale] = useState(1);
  const [scale, setScale] = useState(1);
  const [pos, setPos] = useState({ x: 0, y: 0 });
  const dragRef = useRef<{ px: number; py: number } | null>(null);

  const clampPos = useCallback(
    (p: { x: number; y: number }, s: number, n: { w: number; h: number }) => ({
      x: Math.min(0, Math.max(frameW - n.w * s, p.x)),
      y: Math.min(0, Math.max(frameH - n.h * s, p.y)),
    }),
    [frameW, frameH],
  );

  // (Re)initialise when opened or the image / aspect changes. State is set from
  // the async img.onload callback, not synchronously in the effect body.
  useEffect(() => {
    if (!open || !imageUrl) return;
    let cancelled = false;
    const img = new window.Image();
    img.onload = () => {
      if (cancelled) return;
      const nw = img.naturalWidth;
      const nh = img.naturalHeight;
      const cs = Math.max(frameW / nw, frameH / nh);
      setNat({ w: nw, h: nh });
      setCoverScale(cs);
      setScale(cs);
      setPos({ x: (frameW - nw * cs) / 2, y: (frameH - nh * cs) / 2 });
    };
    img.src = imageUrl;
    return () => {
      cancelled = true;
    };
  }, [open, imageUrl, frameW, frameH]);

  const onPointerDown = (e: React.PointerEvent) => {
    dragRef.current = { px: e.clientX, py: e.clientY };
    e.currentTarget.setPointerCapture(e.pointerId);
  };
  const onPointerMove = (e: React.PointerEvent) => {
    if (!dragRef.current || !nat) return;
    const dx = e.clientX - dragRef.current.px;
    const dy = e.clientY - dragRef.current.py;
    dragRef.current = { px: e.clientX, py: e.clientY };
    setPos((p) => clampPos({ x: p.x + dx, y: p.y + dy }, scale, nat));
  };
  const onPointerUp = () => {
    dragRef.current = null;
  };

  const onZoom = (z: number) => {
    if (!nat) return;
    const newScale = coverScale * z;
    const cx = frameW / 2;
    const cy = frameH / 2;
    setPos((p) =>
      clampPos(
        {
          x: cx - (cx - p.x) * (newScale / scale),
          y: cy - (cy - p.y) * (newScale / scale),
        },
        newScale,
        nat,
      ),
    );
    setScale(newScale);
  };

  // Live printed pixels = the frame mapped back into native image pixels.
  const printW = nat ? Math.round(frameW / scale) : 0;
  const printH = nat ? Math.round(frameH / scale) : 0;
  const ok = printW >= minWidthPx && printH >= minHeightPx;

  const apply = () => {
    if (!nat) return;
    const natX0 = (0 - pos.x) / scale;
    const natY0 = (0 - pos.y) / scale;
    const natW = frameW / scale;
    const natH = frameH / scale;
    const clamp01 = (n: number) => Math.min(1, Math.max(0, n));
    const x = clamp01(natX0 / nat.w);
    const y = clamp01(natY0 / nat.h);
    const w = Math.min(clamp01(natW / nat.w), 1 - x);
    const h = Math.min(clamp01(natH / nat.h), 1 - y);
    onApply({ x, y, w, h });
  };

  return (
    <Dialog open={open} onOpenChange={(o) => !o && onCancel()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Position & crop · {sizeLabel}</DialogTitle>
        </DialogHeader>

        <p className="text-xs text-muted-foreground">
          Drag to reposition, use the slider to zoom. Everything inside the frame
          is what gets printed.
        </p>

        <div
          className="relative mx-auto touch-none overflow-hidden rounded-md bg-black select-none"
          style={{ width: frameW, height: frameH }}
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={onPointerUp}
          onPointerCancel={onPointerUp}
        >
          {nat && (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={imageUrl}
              alt="Crop preview"
              draggable={false}
              className="pointer-events-none absolute select-none"
              style={{
                left: pos.x,
                top: pos.y,
                width: nat.w * scale,
                height: nat.h * scale,
                maxWidth: "none",
              }}
            />
          )}
          {/* rule-of-thirds overlay */}
          <div className="pointer-events-none absolute inset-0">
            <div className="absolute inset-y-0 left-1/3 w-px bg-white/30" />
            <div className="absolute inset-y-0 left-2/3 w-px bg-white/30" />
            <div className="absolute inset-x-0 top-1/3 h-px bg-white/30" />
            <div className="absolute inset-x-0 top-2/3 h-px bg-white/30" />
            <div className="absolute inset-0 ring-1 ring-inset ring-white/40" />
          </div>
        </div>

        <div className="space-y-1.5">
          <input
            type="range"
            min={1}
            max={MAX_ZOOM}
            step={0.01}
            value={coverScale ? scale / coverScale : 1}
            onChange={(e) => onZoom(Number(e.target.value))}
            className="w-full accent-[var(--primary)]"
            aria-label="Zoom"
          />
          <div
            className={`flex items-center gap-1.5 text-xs ${
              ok
                ? "text-emerald-600 dark:text-emerald-400"
                : "text-red-600 dark:text-red-400"
            }`}
          >
            {ok ? (
              <Check className="h-3.5 w-3.5" />
            ) : (
              <AlertTriangle className="h-3.5 w-3.5" />
            )}
            {printW > 0
              ? ok
                ? `Sharp at ${sizeLabel} — printing ${printW}×${printH}px`
                : `Too low-res for ${sizeLabel} at this zoom (${printW}×${printH}px, need ${minWidthPx}×${minHeightPx}). Zoom out.`
              : "Loading…"}
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button onClick={apply}>Apply crop</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
