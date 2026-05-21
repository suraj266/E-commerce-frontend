"use client";

/**
 * Write-review dialog — used from both the PDP "Write a review" button and
 * (later) the order-detail page "Write review" links per delivered item.
 *
 * Modes:
 *   - Create: when `existingReviewId` is null/undefined
 *   - Edit:   when an `existingReviewId` is passed in. The dialog fetches
 *             the existing review on mount and seeds the form.
 *
 * Submitting refreshes both the eligibility query and the public list +
 * summary so the PDP updates without a full page reload.
 */

import { useEffect, useState } from "react";
import { useMutation, useQuery } from "@apollo/client/react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@/lib/forms/zod-resolver";
import { toast } from "sonner";
import { ImagePlus, Loader2, Play, Trash2, Video, X } from "lucide-react";

import {
  CREATE_REVIEW,
  DELETE_REVIEW,
  GET_MY_REVIEW,
  GET_PRODUCT_RATING_SUMMARY,
  GET_PUBLIC_PRODUCT_REVIEWS,
  GET_REVIEW_ELIGIBILITY,
  UPDATE_REVIEW,
} from "@/lib/graphql/reviews";
import type {
  CreateReviewData,
  GetMyReviewData,
  ReviewMediaInput,
  UpdateReviewData,
} from "@/types/review.types";
import {
  getVideoDurationMs,
  uploadReviewMedia,
} from "@/lib/review-media-upload";
import { useAuthStore } from "@/store/auth.store";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { StarRating } from "./star-rating";

const schema = z.object({
  rating: z.number().int().min(1, "Pick a star rating").max(5),
  title: z.string().max(120).optional(),
  body: z.string().min(2, "Write at least a few words").max(5000),
});
type ReviewFormValues = z.infer<typeof schema>;

interface WriteReviewDialogProps {
  productId: string;
  productName: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  /** Pass the existing review id to switch into edit mode. */
  existingReviewId?: string | null;
}

export function WriteReviewDialog({
  productId,
  productName,
  open,
  onOpenChange,
  existingReviewId,
}: WriteReviewDialogProps) {
  const isEditing = !!existingReviewId;
  const [confirmDelete, setConfirmDelete] = useState(false);
  const accessToken = useAuthStore((s) => s.accessToken);

  // Media is managed outside react-hook-form because each item involves an
  // async upload + per-item error state. The final `media` array is bolted
  // onto the mutation payload on submit.
  const [media, setMedia] = useState<ReviewMediaInput[]>([]);
  const [uploadingCount, setUploadingCount] = useState(0);

  // Load the existing review when editing. `skip` so we don't fire it for
  // brand-new reviews — wasteful query.
  const { data: existingData, loading: loadingExisting } =
    useQuery<GetMyReviewData>(GET_MY_REVIEW, {
      variables: { productId },
      skip: !isEditing || !open,
      fetchPolicy: "network-only",
    });

  const form = useForm<ReviewFormValues>({
    resolver: zodResolver(schema),
    defaultValues: { rating: 0, title: "", body: "" },
  });

  // Seed the form when an existing review lands
  useEffect(() => {
    const r = existingData?.myReview;
    if (r) {
      form.reset({
        rating: r.rating,
        title: r.title ?? "",
        body: r.body,
      });
      // Bring existing media into the editor so unchanged uploads are
      // preserved on submit (we send the full set wholesale).
      setMedia(
        r.media.map((m) => ({
          type: m.type,
          url: m.url,
          width: m.width ?? undefined,
          height: m.height ?? undefined,
          durationMs: m.durationMs ?? undefined,
          sizeBytes: m.sizeBytes,
        })),
      );
    } else if (!isEditing && open) {
      form.reset({ rating: 0, title: "", body: "" });
      setMedia([]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [existingData?.myReview?.id, open]);

  const refetchAll = [
    { query: GET_PRODUCT_RATING_SUMMARY, variables: { productId } },
    {
      query: GET_PUBLIC_PRODUCT_REVIEWS,
      variables: { productId, page: 1, pageSize: 5, sort: "newest" },
    },
    { query: GET_REVIEW_ELIGIBILITY, variables: { productId } },
    { query: GET_MY_REVIEW, variables: { productId } },
  ];

  const [createReview, { loading: creating }] = useMutation<CreateReviewData>(
    CREATE_REVIEW,
    {
      refetchQueries: refetchAll,
      onCompleted: () => {
        // All new reviews land in the moderation queue first — be explicit
        // about it so the customer doesn't wonder why their review isn't
        // visible immediately on the PDP.
        toast.success(
          "Thanks! Your review is pending approval — we'll publish it shortly.",
        );
        onOpenChange(false);
      },
      onError: (err) => toast.error(`Could not post: ${err.message}`),
    },
  );

  const [updateReview, { loading: updating }] = useMutation<UpdateReviewData>(
    UPDATE_REVIEW,
    {
      refetchQueries: refetchAll,
      onCompleted: () => {
        // Edits to an already-published review re-enter moderation; surface
        // that so the change-then-disappear-from-PDP loop isn't surprising.
        toast.success(
          "Review updated — changes will be visible after approval.",
        );
        onOpenChange(false);
      },
      onError: (err) => toast.error(`Could not update: ${err.message}`),
    },
  );

  const [deleteReview, { loading: deleting }] = useMutation(DELETE_REVIEW, {
    refetchQueries: refetchAll,
    onCompleted: () => {
      toast.success("Review removed");
      setConfirmDelete(false);
      onOpenChange(false);
    },
    onError: (err) => toast.error(`Could not delete: ${err.message}`),
  });

  // ---- Media: pick / upload / remove ----
  const IMAGE_LIMIT = 5;
  const VIDEO_LIMIT = 1;
  const VIDEO_MAX_BYTES = 50 * 1024 * 1024;
  const VIDEO_MAX_DURATION_MS = 60_000;

  const imageCount = media.filter((m) => m.type === "IMAGE").length;
  const videoCount = media.filter((m) => m.type === "VIDEO").length;

  async function onPickFiles(files: FileList | null) {
    if (!files || files.length === 0) return;
    if (!accessToken) {
      toast.error("Please sign in to upload media.");
      return;
    }
    const picked = Array.from(files);

    // Validate per-file before kicking off any uploads. Friendlier than
    // letting the server reject one at a time.
    let nextImageCount = imageCount;
    let nextVideoCount = videoCount;
    const acceptable: { file: File; durationMs: number | null }[] = [];
    for (const file of picked) {
      if (file.type.startsWith("image/")) {
        if (nextImageCount >= IMAGE_LIMIT) {
          toast.warning(`Image limit is ${IMAGE_LIMIT}; skipping ${file.name}.`);
          continue;
        }
        nextImageCount++;
        acceptable.push({ file, durationMs: null });
      } else if (file.type.startsWith("video/")) {
        if (nextVideoCount >= VIDEO_LIMIT) {
          toast.warning(`Only ${VIDEO_LIMIT} video per review; skipping ${file.name}.`);
          continue;
        }
        if (file.size > VIDEO_MAX_BYTES) {
          toast.error(
            `Video "${file.name}" is too large (max ${VIDEO_MAX_BYTES / 1024 / 1024}MB).`,
          );
          continue;
        }
        const dur = await getVideoDurationMs(file);
        if (dur != null && dur > VIDEO_MAX_DURATION_MS) {
          toast.error(
            `Video "${file.name}" is longer than ${VIDEO_MAX_DURATION_MS / 1000}s.`,
          );
          continue;
        }
        nextVideoCount++;
        acceptable.push({ file, durationMs: dur });
      } else {
        toast.error(`Unsupported file: ${file.name}`);
      }
    }
    if (acceptable.length === 0) return;

    setUploadingCount((c) => c + acceptable.length);
    for (const { file, durationMs } of acceptable) {
      try {
        const result = await uploadReviewMedia(file, accessToken);
        const item: ReviewMediaInput = {
          ...result,
          durationMs: result.type === "VIDEO" ? (durationMs ?? undefined) : undefined,
        };
        setMedia((m) => [...m, item]);
      } catch (err) {
        toast.error(
          `Couldn't upload ${file.name}: ${
            err instanceof Error ? err.message : "unknown error"
          }`,
        );
      } finally {
        setUploadingCount((c) => c - 1);
      }
    }
  }

  function removeMediaAt(idx: number) {
    setMedia((m) => m.filter((_, i) => i !== idx));
  }

  async function onSubmit(values: ReviewFormValues) {
    if (uploadingCount > 0) {
      toast.warning("Wait for the uploads to finish before submitting.");
      return;
    }
    if (isEditing && existingReviewId) {
      await updateReview({
        variables: {
          input: {
            id: existingReviewId,
            rating: values.rating,
            title: values.title?.trim() || undefined,
            body: values.body.trim(),
            media,
          },
        },
      });
    } else {
      await createReview({
        variables: {
          input: {
            productId,
            rating: values.rating,
            title: values.title?.trim() || undefined,
            body: values.body.trim(),
            media: media.length > 0 ? media : undefined,
          },
        },
      });
    }
  }

  const saving = creating || updating;
  const canAddMore = imageCount < IMAGE_LIMIT || videoCount < VIDEO_LIMIT;

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>
              {isEditing ? "Edit your review" : "Write a review"}
            </DialogTitle>
            <DialogDescription>
              {isEditing
                ? `Update your review of ${productName}.`
                : `Tell other customers what you think about ${productName}.`}
            </DialogDescription>
          </DialogHeader>

          {loadingExisting ? (
            <div className="py-8 text-center text-sm text-muted-foreground">
              <Loader2 className="mx-auto h-5 w-5 animate-spin" />
            </div>
          ) : (
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-5"
              >
                <FormField
                  control={form.control}
                  name="rating"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Your rating *</FormLabel>
                      <FormControl>
                        <div>
                          <StarRating
                            value={field.value}
                            size={28}
                            onChange={field.onChange}
                          />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Title (optional)</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="A short summary..."
                          {...field}
                          value={field.value ?? ""}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="body"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Your review *</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="What did you like or dislike? How did you use it?"
                          rows={5}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* ---- Media picker ---- */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="text-sm font-medium">
                      Photos / video (optional)
                    </label>
                    <span className="text-[11px] text-muted-foreground">
                      Up to {IMAGE_LIMIT} photos · 1 short clip (60s, 50MB)
                    </span>
                  </div>
                  {media.length > 0 && (
                    <div className="grid grid-cols-4 gap-2">
                      {media.map((m, i) => (
                        <MediaThumb
                          key={`${m.url}-${i}`}
                          item={m}
                          onRemove={() => removeMediaAt(i)}
                        />
                      ))}
                    </div>
                  )}
                  <label
                    className={`flex items-center justify-center gap-2 rounded-md border border-dashed cursor-pointer text-xs text-muted-foreground hover:bg-muted/40 transition py-3 ${
                      !canAddMore ? "opacity-50 pointer-events-none" : ""
                    }`}
                  >
                    {uploadingCount > 0 ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Uploading {uploadingCount}…
                      </>
                    ) : (
                      <>
                        <ImagePlus className="h-4 w-4" />
                        <span>Add photos or a short clip</span>
                      </>
                    )}
                    <input
                      type="file"
                      multiple
                      accept="image/jpeg,image/png,image/webp,video/mp4"
                      className="hidden"
                      onChange={(e) => {
                        onPickFiles(e.target.files);
                        // Reset so picking the same file again retriggers
                        e.target.value = "";
                      }}
                      disabled={!canAddMore || uploadingCount > 0}
                    />
                  </label>
                </div>

                <DialogFooter className="flex-row !justify-between sm:!justify-between gap-2">
                  {isEditing ? (
                    <Button
                      type="button"
                      variant="ghost"
                      className="text-destructive hover:text-destructive"
                      onClick={() => setConfirmDelete(true)}
                    >
                      <Trash2 className="mr-2 h-4 w-4" />
                      Delete
                    </Button>
                  ) : (
                    <span />
                  )}
                  <div className="flex items-center gap-2">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => onOpenChange(false)}
                    >
                      Cancel
                    </Button>
                    <Button type="submit" disabled={saving}>
                      {saving && (
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      )}
                      {isEditing ? "Save changes" : "Post review"}
                    </Button>
                  </div>
                </DialogFooter>
              </form>
            </Form>
          )}
        </DialogContent>
      </Dialog>

      <AlertDialog
        open={confirmDelete}
        onOpenChange={(o) => !o && setConfirmDelete(false)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete this review?</AlertDialogTitle>
            <AlertDialogDescription>
              Your review will be removed from the product page. You can write
              a new one later if you change your mind.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              onClick={() =>
                existingReviewId &&
                deleteReview({ variables: { id: existingReviewId } })
              }
              disabled={deleting}
            >
              {deleting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}

// ---------------------------------------------------------------------------

/** A single thumbnail in the picker — image preview or video play icon. */
function MediaThumb({
  item,
  onRemove,
}: {
  item: ReviewMediaInput;
  onRemove: () => void;
}) {
  return (
    <div className="relative aspect-square rounded-md border overflow-hidden bg-muted group">
      {item.type === "IMAGE" ? (
        // Plain <img> here (not next/image) — the URL is on our REST media
        // host, not within Next's image-optimisation allowlist. Width is
        // capped at 1080 server-side already.
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={item.url}
          alt=""
          className="h-full w-full object-cover"
        />
      ) : (
        <div className="h-full w-full flex flex-col items-center justify-center bg-foreground/5">
          <Video className="h-5 w-5 text-foreground/60" />
          <span className="mt-1 text-[10px] text-foreground/60">
            {item.durationMs
              ? `${Math.round(item.durationMs / 1000)}s`
              : "Video"}
          </span>
          <Play className="absolute h-6 w-6 text-foreground/30" />
        </div>
      )}
      <button
        type="button"
        aria-label="Remove"
        onClick={onRemove}
        className="absolute top-1 right-1 inline-flex h-6 w-6 items-center justify-center rounded-full bg-background/95 backdrop-blur shadow opacity-0 group-hover:opacity-100 hover:bg-background transition"
      >
        <X className="h-3 w-3" />
      </button>
    </div>
  );
}
