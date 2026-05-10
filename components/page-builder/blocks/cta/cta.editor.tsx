"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ImageUploader } from "@/components/media/image-uploader";
import type { BlockEditorProps } from "../../types";
import type { CtaProps } from "./cta.schema";

export function CtaEditor({ props, onChange }: BlockEditorProps<CtaProps>) {
  function patch(p: Partial<CtaProps>) {
    onChange({ ...props, ...p });
  }
  return (
    <div className="space-y-4">
      <div>
        <Label htmlFor="cta-headline" className="text-xs">
          Headline
        </Label>
        <Input
          id="cta-headline"
          value={props.headline}
          onChange={(e) => patch({ headline: e.target.value })}
        />
      </div>

      <div>
        <Label htmlFor="cta-subtext" className="text-xs">
          Subtext
        </Label>
        <Input
          id="cta-subtext"
          value={props.subtext}
          onChange={(e) => patch({ subtext: e.target.value })}
        />
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <Label htmlFor="cta-btn-label" className="text-xs">
            Button label
          </Label>
          <Input
            id="cta-btn-label"
            value={props.buttonLabel}
            onChange={(e) => patch({ buttonLabel: e.target.value })}
          />
        </div>
        <div>
          <Label htmlFor="cta-btn-href" className="text-xs">
            Button link
          </Label>
          <Input
            id="cta-btn-href"
            value={props.buttonHref}
            onChange={(e) => patch({ buttonHref: e.target.value })}
            placeholder="/category/electronics"
          />
        </div>
      </div>

      <div>
        <Label className="text-xs">
          Background image{" "}
          <span className="text-muted-foreground font-normal">
            (used only by the &ldquo;Image background&rdquo; layout)
          </span>
        </Label>
        <ImageUploader
          purpose="BANNER"
          initialUrl={props.imageUrl || null}
          onUploaded={(img) => patch({ imageUrl: img.url })}
          onClear={() => patch({ imageUrl: "" })}
          aspectClass="aspect-[16/6] h-32"
        />
      </div>
    </div>
  );
}
