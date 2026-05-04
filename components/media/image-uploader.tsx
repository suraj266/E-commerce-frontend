"use client";

/**
 * ImageUploader — drag-drop / click-to-pick upload.
 *
 * Flow:
 *   1. User picks a file (or drops one)
 *   2. Component validates size + MIME client-side
 *   3. Calls `presignImageUpload` GraphQL mutation → uploadUrl + externalId
 *   4. Uploads bytes via `uploadImageBytes` (XHR for progress)
 *   5. Calls `confirmImageUpload` to persist Image row in DB
 *   6. Calls `onUploaded({ id, url })` so the parent form can store the FK
 *
 * Stays purpose-agnostic: caller passes `purpose`, `ownerType`, `ownerId`,
 * and an `onUploaded` callback. Caller is responsible for storing the FK
 * on whatever entity it belongs to.
 */

import { useRef, useState, useCallback } from "react";
import { useMutation } from "@apollo/client/react";
import { Loader2, Upload, X, Image as ImageIcon } from "lucide-react";
import { toast } from "sonner";

import {
  CONFIRM_IMAGE_UPLOAD,
  PRESIGN_IMAGE_UPLOAD,
} from "@/lib/graphql/images";
import { uploadImageBytes } from "@/lib/api/image.api";
import { useAuthStore } from "@/store/auth.store";
import {
  ConfirmImageUploadData,
  Image as ImageRecord,
  ImageOwnerType,
  ImagePurpose,
  PresignImageUploadData,
} from "@/types/image.types";

import { Button } from "@/components/ui/button";

const ACCEPT = "image/jpeg,image/png,image/webp";
const MAX_BYTES = 5 * 1024 * 1024; // 5 MB

interface ImageUploaderProps {
  purpose: ImagePurpose;
  ownerType?: ImageOwnerType;
  ownerId?: string;
  /**
   * Called after upload + confirmUpload succeeds. Fires once per file.
   * May return a Promise; in `multiple` mode it is awaited before the next
   * file starts so the parent can finish any follow-up bookkeeping
   * (e.g. attaching the image to the product) without races.
   */
  onUploaded: (image: ImageRecord) => void | Promise<void>;
  /** Optional initial preview (e.g. existing image URL). Single mode only. */
  initialUrl?: string | null;
  /** Optional clear callback to detach the image from the form. Single mode only. */
  onClear?: () => void;
  className?: string;
  /** Visual aspect ratio hint (CSS only, doesn't crop). */
  aspectClass?: string;
  /**
   * Gallery mode — accept multiple files in one pick/drop, upload them
   * serially, fire onUploaded per file, and reset to the dropzone between.
   * No preview is kept on this component (parent renders the gallery).
   */
  multiple?: boolean;
  /** When `multiple`, cap how many files to accept in this pick. */
  maxFiles?: number;
}

export function ImageUploader({
  purpose,
  ownerType,
  ownerId,
  onUploaded,
  initialUrl,
  onClear,
  className,
  aspectClass = "aspect-square",
  multiple = false,
  maxFiles,
}: ImageUploaderProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const accessToken = useAuthStore((s) => s.accessToken);
  const [previewUrl, setPreviewUrl] = useState<string | null>(initialUrl ?? null);
  const [progress, setProgress] = useState<number | null>(null);
  const [busy, setBusy] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const [queue, setQueue] = useState<{ done: number; total: number } | null>(
    null,
  );

  const [presign] = useMutation<PresignImageUploadData>(PRESIGN_IMAGE_UPLOAD);
  const [confirm] = useMutation<ConfirmImageUploadData>(CONFIRM_IMAGE_UPLOAD);

  const uploadOne = useCallback(
    async (file: File): Promise<boolean> => {
      if (!ACCEPT.split(",").includes(file.type)) {
        toast.error(`Unsupported file type: ${file.type}`);
        return false;
      }
      if (file.size > MAX_BYTES) {
        toast.error(
          `File too large: ${(file.size / 1024 / 1024).toFixed(1)} MB (max 5 MB)`,
        );
        return false;
      }

      // Show local preview immediately for snappy UX
      const localPreview = URL.createObjectURL(file);
      setPreviewUrl(localPreview);

      try {
        setProgress(0);

        const presignRes = await presign({
          variables: {
            presignUploadInput: {
              purpose,
              contentType: file.type,
              originalName: file.name,
            },
          },
        });
        const payload = presignRes.data?.presignImageUpload;
        if (!payload) throw new Error("Presign returned no payload");

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
              purpose,
              ownerType,
              ownerId,
            },
          },
        });
        const image = confirmRes.data?.confirmImageUpload;
        if (!image) throw new Error("Confirm returned no image");

        setPreviewUrl(image.url);
        const maybe = onUploaded(image);
        if (maybe && typeof (maybe as Promise<void>).then === "function") {
          await maybe;
        }
        return true;
      } catch (err) {
        const msg = err instanceof Error ? err.message : "Upload failed";
        toast.error(msg);
        setPreviewUrl(initialUrl ?? null);
        return false;
      } finally {
        setProgress(null);
      }
    },
    [accessToken, confirm, initialUrl, onUploaded, ownerId, ownerType, presign, purpose],
  );

  const handleFiles = useCallback(
    async (files: File[]) => {
      if (files.length === 0) return;

      let batch = files;
      if (maxFiles != null && batch.length > maxFiles) {
        toast.warning(
          `Only ${maxFiles} of ${batch.length} files will be uploaded (slot limit).`,
        );
        batch = batch.slice(0, maxFiles);
      }

      // Single-file path keeps preview behavior (Replace/Remove footer)
      if (!multiple) {
        setBusy(true);
        const ok = await uploadOne(batch[0]);
        setBusy(false);
        if (ok) toast.success("Image uploaded");
        return;
      }

      // Gallery path — serialize so parent state (e.g. isPrimary) updates
      // between uploads, and reset preview between so dropzone is ready.
      setBusy(true);
      setQueue({ done: 0, total: batch.length });
      let success = 0;
      for (let i = 0; i < batch.length; i++) {
        const ok = await uploadOne(batch[i]);
        if (ok) success += 1;
        setQueue({ done: i + 1, total: batch.length });
        // Reset preview between files so dropzone shows again
        setPreviewUrl(null);
      }
      setQueue(null);
      setBusy(false);
      if (success > 0) {
        toast.success(
          success === 1
            ? "Image uploaded"
            : `${success} images uploaded`,
        );
      }
    },
    [maxFiles, multiple, uploadOne],
  );

  function onDrop(e: React.DragEvent) {
    e.preventDefault();
    setDragActive(false);
    const list = Array.from(e.dataTransfer.files ?? []);
    if (list.length > 0) void handleFiles(multiple ? list : [list[0]]);
  }

  function onDragOver(e: React.DragEvent) {
    e.preventDefault();
    setDragActive(true);
  }

  function onDragLeave() {
    setDragActive(false);
  }

  function onPick() {
    inputRef.current?.click();
  }

  function onClearClick() {
    setPreviewUrl(null);
    onClear?.();
  }

  return (
    <div className={`space-y-2 ${className ?? ""}`}>
      <div
        onClick={!busy ? onPick : undefined}
        onDrop={!busy ? onDrop : undefined}
        onDragOver={!busy ? onDragOver : undefined}
        onDragLeave={onDragLeave}
        className={`relative flex items-center justify-center rounded-md border-2 border-dashed transition-colors cursor-pointer ${aspectClass} ${
          dragActive
            ? "border-primary bg-primary/5"
            : "border-muted-foreground/30 hover:border-muted-foreground/50"
        } ${busy ? "opacity-60 cursor-not-allowed" : ""}`}
      >
        {previewUrl && !multiple ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={previewUrl}
            alt="Preview"
            className="h-full w-full object-cover rounded-md"
          />
        ) : (
          <div className="flex flex-col items-center gap-2 text-muted-foreground">
            <ImageIcon className="h-6 w-6" />
            <span className="text-xs">
              {multiple
                ? "Click or drag to upload (multiple allowed)"
                : "Click or drag to upload"}
            </span>
            <span className="text-[10px]">JPEG / PNG / WebP · max 5 MB</span>
          </div>
        )}

        {busy && (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 bg-background/80 rounded-md">
            <Loader2 className="h-6 w-6 animate-spin text-primary" />
            {queue ? (
              <span className="text-xs text-muted-foreground">
                {queue.done}/{queue.total}
                {progress !== null ? ` · ${progress}%` : ""}
              </span>
            ) : (
              progress !== null && (
                <span className="text-xs text-muted-foreground">
                  {progress}%
                </span>
              )
            )}
          </div>
        )}
      </div>

      <input
        ref={inputRef}
        type="file"
        accept={ACCEPT}
        multiple={multiple}
        className="hidden"
        onChange={(e) => {
          const list = Array.from(e.target.files ?? []);
          if (list.length > 0) void handleFiles(multiple ? list : [list[0]]);
          // reset so picking the same file twice still fires onChange
          e.target.value = "";
        }}
      />

      {previewUrl && !busy && !multiple && (
        <div className="flex justify-between items-center">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={onPick}
          >
            <Upload className="mr-2 h-3 w-3" />
            Replace
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="text-destructive hover:text-destructive"
            onClick={onClearClick}
          >
            <X className="mr-2 h-3 w-3" />
            Remove
          </Button>
        </div>
      )}
    </div>
  );
}
