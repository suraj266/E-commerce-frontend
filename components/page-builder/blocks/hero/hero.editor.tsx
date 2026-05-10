"use client";

import Link from "next/link";
import { useQuery } from "@apollo/client/react";
import { Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ImageUploader } from "@/components/media/image-uploader";

import { GET_ADMIN_SLIDERS } from "@/lib/graphql/sliders";
import type { GetAdminSlidersData } from "@/types/slider.types";
import type { BlockEditorProps } from "../../types";
import type { HeroProps } from "./hero.schema";

export function HeroEditor({
  props,
  onChange,
  variant,
}: BlockEditorProps<HeroProps>) {
  function patch(p: Partial<HeroProps>) {
    onChange({ ...props, ...p });
  }

  const isSliderVariant = variant === "slider";
  const isSpotlightVariant = variant === "spotlight";

  // ----- Spotlight variant: helpers for the small repeaters -----
  function patchAccent(
    idx: number,
    p: Partial<HeroProps["accents"][number]>,
  ) {
    const next = [...(props.accents ?? [])];
    next[idx] = { ...next[idx], ...p };
    onChange({ ...props, accents: next });
  }
  function addAccent() {
    if ((props.accents?.length ?? 0) >= 3) return;
    onChange({
      ...props,
      accents: [...(props.accents ?? []), { label: "" }],
    });
  }
  function removeAccent(idx: number) {
    onChange({
      ...props,
      accents: (props.accents ?? []).filter((_, i) => i !== idx),
    });
  }

  function patchThumbnail(
    idx: number,
    p: Partial<HeroProps["thumbnails"][number]>,
  ) {
    const next = [...(props.thumbnails ?? [])];
    next[idx] = { ...next[idx], ...p };
    onChange({ ...props, thumbnails: next });
  }
  function addThumbnail() {
    if ((props.thumbnails?.length ?? 0) >= 4) return;
    onChange({
      ...props,
      thumbnails: [...(props.thumbnails ?? []), { imageUrl: "", href: "" }],
    });
  }
  function removeThumbnail(idx: number) {
    onChange({
      ...props,
      thumbnails: (props.thumbnails ?? []).filter((_, i) => i !== idx),
    });
  }

  // Fetch sliders ONLY when the slider variant is active to avoid an
  // unnecessary admin query for every Hero block in the editor.
  const { data: slidersData } = useQuery<GetAdminSlidersData>(
    GET_ADMIN_SLIDERS,
    { fetchPolicy: "cache-and-network", skip: !isSliderVariant },
  );
  const sliders = slidersData?.adminSliders ?? [];

  // ============================================================
  // Slider variant — only the slider picker + autoplay matter.
  // Hide the single-banner fields to avoid confusion.
  // ============================================================
  if (isSliderVariant) {
    return (
      <div className="space-y-4">
        <div>
          <Label className="text-xs">Slider</Label>
          {sliders.length === 0 ? (
            <div className="rounded-md border bg-muted/30 px-3 py-3 text-sm text-muted-foreground">
              No sliders yet. Create one at{" "}
              <Link
                href="/admin/sliders"
                target="_blank"
                className="text-primary hover:underline"
              >
                /admin/sliders
              </Link>{" "}
              and come back.
            </div>
          ) : (
            <Select
              value={props.sliderKey || ""}
              onValueChange={(v) => patch({ sliderKey: v })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Pick a slider..." />
              </SelectTrigger>
              <SelectContent>
                {sliders.map((s) => (
                  <SelectItem key={s.id} value={s.key}>
                    <span className="flex items-center gap-2">
                      <span>{s.name}</span>
                      <span className="text-xs text-muted-foreground font-mono">
                        {s.key}
                      </span>
                      {s.status !== "PUBLISHED" && (
                        <span className="text-[10px] uppercase text-feature">
                          {s.status.toLowerCase()}
                        </span>
                      )}
                    </span>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
          <p className="text-xs text-muted-foreground mt-1">
            Public site only renders sliders with status = Published.
          </p>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <Label className="text-xs">Height</Label>
            <Select
              value={props.height}
              onValueChange={(v) =>
                patch({ height: v as HeroProps["height"] })
              }
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="sm">Small</SelectItem>
                <SelectItem value="md">Medium</SelectItem>
                <SelectItem value="lg">Large</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="hero-autoplay" className="text-xs">
              Autoplay override (ms)
            </Label>
            <Input
              id="hero-autoplay"
              type="number"
              min={0}
              step={500}
              value={props.autoAdvanceMs ?? ""}
              onChange={(e) =>
                patch({
                  autoAdvanceMs:
                    e.target.value === ""
                      ? undefined
                      : Math.max(0, Number(e.target.value) || 0),
                })
              }
              placeholder="Use slider default"
            />
            <p className="text-xs text-muted-foreground mt-1">
              Empty = use the slider&apos;s own setting. 0 disables.
            </p>
          </div>
        </div>
      </div>
    );
  }

  // ============================================================
  // Spotlight variant — extra fields for accents + thumbnails +
  // secondary CTA. Reuses the standard image / headline / subtext /
  // CTA fields shown on the single-banner variants.
  // ============================================================
  if (isSpotlightVariant) {
    const accents = props.accents ?? [];
    const thumbnails = props.thumbnails ?? [];
    return (
      <div className="space-y-4">
        <div>
          <Label className="text-xs">Hero image</Label>
          <ImageUploader
            purpose="BANNER"
            initialUrl={props.imageUrl || null}
            onUploaded={(img) => patch({ imageUrl: img.url })}
            onClear={() => patch({ imageUrl: "" })}
            aspectClass="aspect-square h-40"
          />
          <p className="text-xs text-muted-foreground mt-1">
            Square image works best — sits inside the peach circle.
          </p>
        </div>

        <div>
          <Label htmlFor="hero-eyebrow" className="text-xs">
            Eyebrow (small uppercase tagline)
          </Label>
          <Input
            id="hero-eyebrow"
            value={props.eyebrow}
            onChange={(e) => patch({ eyebrow: e.target.value })}
            placeholder="Support local everything"
          />
        </div>

        <div>
          <Label htmlFor="hero-headline-spot" className="text-xs">
            Headline
          </Label>
          <Input
            id="hero-headline-spot"
            value={props.headline}
            onChange={(e) => patch({ headline: e.target.value })}
            placeholder="e-commerce Website"
          />
        </div>

        <div>
          <Label htmlFor="hero-subtext-spot" className="text-xs">
            Subtext
          </Label>
          <Input
            id="hero-subtext-spot"
            value={props.subtext}
            onChange={(e) => patch({ subtext: e.target.value })}
            placeholder="Optional supporting line"
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <Label htmlFor="hero-cta-label-spot" className="text-xs">
              Button label
            </Label>
            <Input
              id="hero-cta-label-spot"
              value={props.ctaLabel}
              onChange={(e) => patch({ ctaLabel: e.target.value })}
              placeholder="Buy Now"
            />
          </div>
          <div>
            <Label htmlFor="hero-cta-href-spot" className="text-xs">
              Button URL
            </Label>
            <Input
              id="hero-cta-href-spot"
              value={props.ctaHref}
              onChange={(e) => patch({ ctaHref: e.target.value })}
              placeholder="/shop"
            />
          </div>
        </div>

        {/* ------- Accents (floating pill labels) ------- */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label className="text-xs">
              Floating labels ({accents.length}/3)
            </Label>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={addAccent}
              disabled={accents.length >= 3}
            >
              <Plus className="mr-1 h-3 w-3" />
              Add label
            </Button>
          </div>
          {accents.length === 0 && (
            <p className="text-xs text-muted-foreground italic">
              Optional pill chips that float over the hero image (e.g. &ldquo;Minimalistic&rdquo;).
            </p>
          )}
          {accents.map((accent, idx) => (
            <div
              key={idx}
              className="flex items-center gap-2 rounded-md border bg-muted/20 p-2"
            >
              <Input
                value={accent.label}
                onChange={(e) => patchAccent(idx, { label: e.target.value })}
                placeholder={`Label ${idx + 1}`}
              />
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="h-7 w-7 text-destructive hover:text-destructive"
                onClick={() => removeAccent(idx)}
              >
                <Trash2 className="h-3.5 w-3.5" />
              </Button>
            </div>
          ))}
        </div>

        {/* ------- Thumbnails (right-side strip) ------- */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label className="text-xs">
              Side thumbnails ({thumbnails.length}/4)
            </Label>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={addThumbnail}
              disabled={thumbnails.length >= 4}
            >
              <Plus className="mr-1 h-3 w-3" />
              Add thumbnail
            </Button>
          </div>
          {thumbnails.length === 0 && (
            <p className="text-xs text-muted-foreground italic">
              Optional small circular images on the right edge of the hero.
            </p>
          )}
          {thumbnails.map((thumb, idx) => (
            <div
              key={idx}
              className="rounded-md border bg-muted/20 p-3 space-y-2"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium">
                  Thumbnail {idx + 1}
                </span>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="h-6 w-6 text-destructive hover:text-destructive"
                  onClick={() => removeThumbnail(idx)}
                >
                  <Trash2 className="h-3 w-3" />
                </Button>
              </div>
              <ImageUploader
                purpose="GENERIC"
                initialUrl={thumb.imageUrl || null}
                onUploaded={(img) =>
                  patchThumbnail(idx, { imageUrl: img.url })
                }
                onClear={() => patchThumbnail(idx, { imageUrl: "" })}
                aspectClass="aspect-square h-20"
              />
              <Input
                value={thumb.href}
                onChange={(e) =>
                  patchThumbnail(idx, { href: e.target.value })
                }
                placeholder="Optional click-through URL"
              />
            </div>
          ))}
        </div>

        {/* ------- Secondary CTA ------- */}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <Label htmlFor="hero-cta2-label" className="text-xs">
              Secondary link label
            </Label>
            <Input
              id="hero-cta2-label"
              value={props.secondaryCtaLabel}
              onChange={(e) =>
                patch({ secondaryCtaLabel: e.target.value })
              }
              placeholder="Continue shopping"
            />
          </div>
          <div>
            <Label htmlFor="hero-cta2-href" className="text-xs">
              Secondary link URL
            </Label>
            <Input
              id="hero-cta2-href"
              value={props.secondaryCtaHref}
              onChange={(e) => patch({ secondaryCtaHref: e.target.value })}
              placeholder="/shop"
            />
          </div>
        </div>

        <div>
          <Label className="text-xs">Height</Label>
          <Select
            value={props.height}
            onValueChange={(v) => patch({ height: v as HeroProps["height"] })}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="sm">Small</SelectItem>
              <SelectItem value="md">Medium</SelectItem>
              <SelectItem value="lg">Large</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    );
  }

  // ============================================================
  // Single-banner variants (centered / split) — original fields
  // ============================================================
  return (
    <div className="space-y-4">
      <div>
        <Label className="text-xs">Background image</Label>
        <ImageUploader
          purpose="BANNER"
          initialUrl={props.imageUrl || null}
          onUploaded={(img) => patch({ imageUrl: img.url })}
          onClear={() => patch({ imageUrl: "" })}
          aspectClass="aspect-[16/9] h-40"
        />
      </div>

      <div>
        <Label htmlFor="hero-headline" className="text-xs">
          Headline
        </Label>
        <Input
          id="hero-headline"
          value={props.headline}
          onChange={(e) => patch({ headline: e.target.value })}
          placeholder="Shop the best of India"
        />
      </div>

      <div>
        <Label htmlFor="hero-subtext" className="text-xs">
          Subtext
        </Label>
        <Input
          id="hero-subtext"
          value={props.subtext}
          onChange={(e) => patch({ subtext: e.target.value })}
          placeholder="One-liner under the headline"
        />
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <Label htmlFor="hero-cta-label" className="text-xs">
            CTA label
          </Label>
          <Input
            id="hero-cta-label"
            value={props.ctaLabel}
            onChange={(e) => patch({ ctaLabel: e.target.value })}
            placeholder="Browse products"
          />
        </div>
        <div>
          <Label htmlFor="hero-cta-href" className="text-xs">
            CTA link
          </Label>
          <Input
            id="hero-cta-href"
            value={props.ctaHref}
            onChange={(e) => patch({ ctaHref: e.target.value })}
            placeholder="/category/electronics"
          />
        </div>
      </div>

      <div className="grid grid-cols-3 gap-3">
        <div>
          <Label className="text-xs">Alignment</Label>
          <Select
            value={props.alignment}
            onValueChange={(v) =>
              patch({ alignment: v as HeroProps["alignment"] })
            }
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="left">Left</SelectItem>
              <SelectItem value="center">Center</SelectItem>
              <SelectItem value="right">Right</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label className="text-xs">Height</Label>
          <Select
            value={props.height}
            onValueChange={(v) => patch({ height: v as HeroProps["height"] })}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="sm">Small</SelectItem>
              <SelectItem value="md">Medium</SelectItem>
              <SelectItem value="lg">Large</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label htmlFor="hero-overlay" className="text-xs">
            Overlay (%)
          </Label>
          <Input
            id="hero-overlay"
            type="number"
            min={0}
            max={100}
            value={props.overlayOpacity}
            onChange={(e) =>
              patch({ overlayOpacity: Number(e.target.value) || 0 })
            }
          />
        </div>
      </div>
    </div>
  );
}
