"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ImageUploader } from "@/components/media/image-uploader";
import type { BlockEditorProps } from "../../types";
import type { NewsletterSignupProps } from "./newsletter-signup.schema";

export function NewsletterSignupEditor({
  props,
  onChange,
  variant,
}: BlockEditorProps<NewsletterSignupProps>) {
  function patch(p: Partial<NewsletterSignupProps>) {
    onChange({ ...props, ...p });
  }

  const isCenteredBanner = variant === "centered-banner";

  return (
    <div className="space-y-4">
      <div>
        <Label htmlFor="ns-title" className="text-xs">
          Title
        </Label>
        <Input
          id="ns-title"
          value={props.title}
          onChange={(e) => patch({ title: e.target.value })}
        />
      </div>

      <div>
        <Label htmlFor="ns-subtext" className="text-xs">
          Subtext
        </Label>
        <Input
          id="ns-subtext"
          value={props.subtext}
          onChange={(e) => patch({ subtext: e.target.value })}
        />
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <Label htmlFor="ns-button" className="text-xs">
            Button label
          </Label>
          <Input
            id="ns-button"
            value={props.buttonLabel}
            onChange={(e) => patch({ buttonLabel: e.target.value })}
          />
        </div>
        <div>
          <Label htmlFor="ns-placeholder" className="text-xs">
            Email placeholder
          </Label>
          <Input
            id="ns-placeholder"
            value={props.placeholder}
            onChange={(e) => patch({ placeholder: e.target.value })}
          />
        </div>
      </div>

      <div>
        <Label htmlFor="ns-source" className="text-xs">
          Source tag
        </Label>
        <Input
          id="ns-source"
          value={props.source}
          onChange={(e) => patch({ source: e.target.value })}
          placeholder="homepage-newsletter"
        />
        <p className="text-xs text-muted-foreground mt-1">
          Stored on each signup so you can group leads by where they came from.
        </p>
      </div>

      {isCenteredBanner && (
        <div>
          <Label className="text-xs">
            Background image{" "}
            <span className="text-muted-foreground">(optional)</span>
          </Label>
          <ImageUploader
            purpose="BANNER"
            initialUrl={props.backgroundImageUrl || null}
            onUploaded={(img) => patch({ backgroundImageUrl: img.url })}
            onClear={() => patch({ backgroundImageUrl: "" })}
            aspectClass="aspect-[16/6] h-40"
          />
          <p className="text-xs text-muted-foreground mt-1">
            Falls back to a primary-color gradient when empty.
          </p>
        </div>
      )}
    </div>
  );
}
