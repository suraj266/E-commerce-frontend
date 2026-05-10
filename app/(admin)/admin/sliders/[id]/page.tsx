/**
 * =============================================================================
 * Slider Editor — /admin/sliders/[id]
 * =============================================================================
 *
 * Two sections:
 *   1. Slider settings card — name, key, description, status, config
 *      (saved via "Save" button at the top)
 *   2. Slide items table — add/edit/delete/reorder slide items, each with
 *      desktop/tablet/mobile image uploads (saved per-item on modal close)
 *
 * Slide reorder uses native up/down buttons backed by atomic
 * `reorderSlideItems` mutation. Drag-reorder via @dnd-kit can be added
 * later if requested.
 * =============================================================================
 */

"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useMutation, useQuery } from "@apollo/client/react";
import { toast } from "sonner";
import {
  ArrowDown,
  ArrowUp,
  Check,
  ChevronLeft,
  Eye,
  EyeOff,
  Loader2,
  Pencil,
  Plus,
  Save,
  Trash2,
  X,
} from "lucide-react";

import {
  ADD_SLIDE_ITEM,
  GET_ADMIN_SLIDER,
  REMOVE_SLIDE_ITEM,
  REORDER_SLIDE_ITEMS,
  SET_SLIDER_STATUS,
  UPDATE_SLIDER,
  UPDATE_SLIDE_ITEM,
} from "@/lib/graphql/sliders";
import {
  AddSlideItemData,
  GetAdminSliderData,
  parseSliderConfig,
  RemoveSlideItemData,
  serializeSliderConfig,
  SetSliderStatusData,
  SLIDER_STATUS_LABEL,
  SLIDER_STYLE_LABEL,
  SLIDER_STYLES,
  SliderStatus,
  SliderStyle,
  SlideItem,
  UpdateSliderData,
  UpdateSlideItemData,
} from "@/types/slider.types";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ImageUploader } from "@/components/media/image-uploader";
import { useSetPageTitle } from "@/components/shell/page-title-context";

const STATUS_VARIANT: Record<
  SliderStatus,
  "default" | "secondary" | "destructive" | "outline"
> = {
  DRAFT: "outline",
  PUBLISHED: "default",
  ARCHIVED: "destructive",
};

export default function SliderEditor() {
  useSetPageTitle("Edit slider");
  const params = useParams<{ id: string }>();
  const sliderId = params.id;

  const { data, loading, error, refetch } = useQuery<GetAdminSliderData>(
    GET_ADMIN_SLIDER,
    {
      variables: { id: sliderId },
      fetchPolicy: "cache-and-network",
    },
  );
  const slider = data?.adminSlider;

  // ---- Slider meta state (mirrors saved values until "Save") ----
  const [name, setName] = useState("");
  const [key, setKey] = useState("");
  const [description, setDescription] = useState("");
  const [style, setStyle] = useState<SliderStyle>("default");
  const [autoplayMs, setAutoplayMs] = useState<number>(5000);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    if (!slider || hydrated) return;
    setName(slider.name);
    setKey(slider.key);
    setDescription(slider.description ?? "");
    const cfg = parseSliderConfig(slider.config);
    setStyle((cfg.style as SliderStyle) ?? "default");
    setAutoplayMs(typeof cfg.autoplayMs === "number" ? cfg.autoplayMs : 5000);
    setHydrated(true);
  }, [slider, hydrated]);

  useEffect(() => {
    if (error) toast.error(`Failed to load: ${error.message}`);
  }, [error]);

  // ---- Slide modal state ----
  const [editingSlide, setEditingSlide] = useState<SlideItem | "new" | null>(
    null,
  );
  const [deletingSlide, setDeletingSlide] = useState<SlideItem | null>(null);

  // ---- Mutations ----
  const [updateSlider, { loading: savingMeta }] =
    useMutation<UpdateSliderData>(UPDATE_SLIDER, {
      onCompleted: () => toast.success("Slider saved"),
      onError: (err) => toast.error(`Save failed: ${err.message}`),
    });

  const [setSliderStatus, { loading: statusSaving }] =
    useMutation<SetSliderStatusData>(SET_SLIDER_STATUS, {
      onCompleted: (res) =>
        toast.success(
          `Status → ${SLIDER_STATUS_LABEL[res.setSliderStatus.status as SliderStatus]}`,
        ),
      onError: (err) => toast.error(`Failed: ${err.message}`),
    });

  const [reorderSlides] = useMutation(REORDER_SLIDE_ITEMS, {
    onCompleted: () => refetch(),
    onError: (err) => toast.error(`Reorder failed: ${err.message}`),
  });

  const [removeSlide, { loading: removingSlide }] =
    useMutation<RemoveSlideItemData>(REMOVE_SLIDE_ITEM, {
      refetchQueries: [
        { query: GET_ADMIN_SLIDER, variables: { id: sliderId } },
      ],
      onCompleted: () => {
        toast.success("Slide removed");
        setDeletingSlide(null);
      },
      onError: (err) => toast.error(`Remove failed: ${err.message}`),
    });

  // ---- Save handlers ----
  async function saveMeta() {
    await updateSlider({
      variables: {
        updateSliderInput: {
          id: sliderId,
          name,
          key,
          description: description || undefined,
          config: serializeSliderConfig({ style, autoplayMs }),
        },
      },
    });
  }

  async function changeStatus(status: SliderStatus) {
    await setSliderStatus({
      variables: { setSliderStatusInput: { id: sliderId, status } },
    });
  }

  // ---- Slide reorder ----
  const slides = useMemo(
    () => (slider?.items ?? []).slice().sort((a, b) => a.order - b.order),
    [slider],
  );

  async function moveSlide(idx: number, dir: -1 | 1) {
    const target = idx + dir;
    if (target < 0 || target >= slides.length) return;
    const newOrder = [...slides];
    [newOrder[idx], newOrder[target]] = [newOrder[target], newOrder[idx]];
    await reorderSlides({
      variables: {
        reorderSlideItemsInput: {
          sliderId,
          itemIds: newOrder.map((s) => s.id),
        },
      },
    });
  }

  if (loading || !hydrated || !slider) {
    return (
      <div className="space-y-3">
        <div className="h-8 w-64 bg-muted animate-pulse rounded" />
        <div className="h-96 w-full bg-muted animate-pulse rounded" />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Top bar */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <Button asChild variant="ghost" size="sm" className="-ml-2">
            <Link href="/admin/sliders">
              <ChevronLeft className="mr-1 h-4 w-4" />
              All sliders
            </Link>
          </Button>
          <div className="flex items-center gap-2 mt-1 flex-wrap">
            <h1 className="text-xl font-bold">{name || "Untitled slider"}</h1>
            <Badge variant={STATUS_VARIANT[slider.status]} className="text-xs">
              {SLIDER_STATUS_LABEL[slider.status]}
            </Badge>
            <code className="text-xs font-mono text-muted-foreground">
              {key}
            </code>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Select
            value={slider.status}
            onValueChange={(v) => changeStatus(v as SliderStatus)}
            disabled={statusSaving}
          >
            <SelectTrigger className="w-32 h-9">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="DRAFT">Draft</SelectItem>
              <SelectItem value="PUBLISHED">Published</SelectItem>
              <SelectItem value="ARCHIVED">Archived</SelectItem>
            </SelectContent>
          </Select>
          <Button onClick={saveMeta} disabled={savingMeta}>
            {savingMeta && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            <Save className="mr-2 h-4 w-4" />
            Save
          </Button>
        </div>
      </div>

      {/* Settings */}
      <Card>
        <CardContent className="py-4 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="slider-name" className="text-xs">
                Name
              </Label>
              <Input
                id="slider-name"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="slider-key" className="text-xs">
                Key
              </Label>
              <Input
                id="slider-key"
                value={key}
                onChange={(e) =>
                  setKey(
                    e.target.value
                      .toLowerCase()
                      .replace(/[^a-z0-9]+/g, "-")
                      .replace(/^-+|-+$/g, ""),
                  )
                }
              />
              <p className="text-xs text-muted-foreground mt-1">
                Used by page blocks to reference this slider. Be careful when
                changing — existing references will break.
              </p>
            </div>
          </div>

          <div>
            <Label htmlFor="slider-desc" className="text-xs">
              Description
            </Label>
            <Input
              id="slider-desc"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Internal notes — not shown publicly"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label className="text-xs">Style</Label>
              <Select
                value={style}
                onValueChange={(v) => setStyle(v as SliderStyle)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {SLIDER_STYLES.map((s) => (
                    <SelectItem key={s} value={s}>
                      {SLIDER_STYLE_LABEL[s]}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="slider-autoplay" className="text-xs">
                Autoplay (ms)
              </Label>
              <Input
                id="slider-autoplay"
                type="number"
                min={0}
                step={500}
                value={autoplayMs}
                onChange={(e) =>
                  setAutoplayMs(Math.max(0, Number(e.target.value) || 0))
                }
              />
              <p className="text-xs text-muted-foreground mt-1">
                0 disables. Default 5000 (5s).
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Slide items */}
      <Card>
        <CardContent className="py-4 space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold">
              Slide items{" "}
              <span className="text-muted-foreground font-normal">
                ({slides.length})
              </span>
            </h3>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setEditingSlide("new")}
            >
              <Plus className="mr-1 h-3 w-3" />
              Add slide
            </Button>
          </div>

          {slides.length === 0 && (
            <div className="rounded-md border border-dashed py-12 text-center text-sm text-muted-foreground">
              No slides yet. Click &ldquo;Add slide&rdquo; to start.
            </div>
          )}

          {slides.length > 0 && (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="text-xs uppercase text-muted-foreground border-b">
                  <tr>
                    <th className="px-2 py-2 text-left font-medium w-16">
                      Order
                    </th>
                    <th className="px-2 py-2 text-left font-medium w-20">
                      Image
                    </th>
                    <th className="px-2 py-2 text-left font-medium">
                      Title / Link
                    </th>
                    <th className="px-2 py-2 text-center font-medium w-24">
                      Enabled
                    </th>
                    <th className="px-2 py-2 text-right font-medium w-32">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {slides.map((s, idx) => (
                    <tr
                      key={s.id}
                      className="border-b last:border-b-0 hover:bg-muted/30"
                    >
                      <td className="px-2 py-2">
                        <div className="flex items-center gap-1">
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            className="h-7 w-7"
                            disabled={idx === 0}
                            onClick={() => moveSlide(idx, -1)}
                            title="Move up"
                          >
                            <ArrowUp className="h-3 w-3" />
                          </Button>
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            className="h-7 w-7"
                            disabled={idx === slides.length - 1}
                            onClick={() => moveSlide(idx, 1)}
                            title="Move down"
                          >
                            <ArrowDown className="h-3 w-3" />
                          </Button>
                        </div>
                      </td>
                      <td className="px-2 py-2">
                        <div className="h-12 w-16 rounded bg-muted overflow-hidden flex items-center justify-center">
                          {s.imageUrl ? (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img
                              src={s.imageUrl}
                              alt=""
                              className="h-full w-full object-cover"
                            />
                          ) : (
                            <span className="text-[10px] text-muted-foreground italic">
                              No image
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="px-2 py-2">
                        <div className="font-medium truncate">
                          {s.title || (
                            <span className="text-muted-foreground italic">
                              Untitled
                            </span>
                          )}
                        </div>
                        <div className="text-xs text-muted-foreground font-mono truncate">
                          {s.link || "(no link)"}
                        </div>
                      </td>
                      <td className="px-2 py-2 text-center">
                        {s.isEnabled ? (
                          <Badge
                            variant="default"
                            className="text-[10px] gap-1"
                          >
                            <Eye className="h-3 w-3" />
                            Yes
                          </Badge>
                        ) : (
                          <Badge
                            variant="secondary"
                            className="text-[10px] gap-1"
                          >
                            <EyeOff className="h-3 w-3" />
                            No
                          </Badge>
                        )}
                      </td>
                      <td className="px-2 py-2 text-right">
                        <div className="flex items-center justify-end gap-1">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-7 w-7"
                            onClick={() => setEditingSlide(s)}
                            title="Edit"
                          >
                            <Pencil className="h-3 w-3" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-7 w-7 text-destructive hover:text-destructive"
                            onClick={() => setDeletingSlide(s)}
                            title="Remove"
                          >
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>

      <SlideEditDialog
        sliderId={sliderId}
        slide={editingSlide}
        nextOrder={slides.length}
        onClose={() => setEditingSlide(null)}
      />

      <AlertDialog
        open={!!deletingSlide}
        onOpenChange={(o) => !o && setDeletingSlide(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Remove slide?</AlertDialogTitle>
            <AlertDialogDescription>
              {deletingSlide && (
                <>
                  Remove{" "}
                  <span className="font-semibold text-foreground">
                    &ldquo;{deletingSlide.title || "Untitled"}&rdquo;
                  </span>{" "}
                  from this slider? Soft-delete — recoverable from the DB if
                  needed.
                </>
              )}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              onClick={() =>
                deletingSlide &&
                removeSlide({ variables: { id: deletingSlide.id } })
              }
              disabled={removingSlide}
            >
              {removingSlide && (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              )}
              Remove
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

// ===========================================================================
// Slide Edit Dialog — handles both add (slide === "new") and edit
// ===========================================================================

interface SlideEditDialogProps {
  sliderId: string;
  slide: SlideItem | "new" | null;
  nextOrder: number;
  onClose: () => void;
}

function SlideEditDialog({
  sliderId,
  slide,
  nextOrder,
  onClose,
}: SlideEditDialogProps) {
  const isOpen = slide !== null;
  const isNew = slide === "new";
  const editing = !isNew && slide ? slide : null;

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [link, setLink] = useState("");
  const [ctaLabel, setCtaLabel] = useState("");
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [tabletImageUrl, setTabletImageUrl] = useState<string | null>(null);
  const [mobileImageUrl, setMobileImageUrl] = useState<string | null>(null);
  const [isEnabled, setIsEnabled] = useState(true);

  // Reset state on open
  useEffect(() => {
    if (!isOpen) return;
    if (editing) {
      setTitle(editing.title ?? "");
      setDescription(editing.description ?? "");
      setLink(editing.link ?? "");
      setCtaLabel(editing.ctaLabel ?? "");
      setImageUrl(editing.imageUrl ?? null);
      setTabletImageUrl(editing.tabletImageUrl ?? null);
      setMobileImageUrl(editing.mobileImageUrl ?? null);
      setIsEnabled(editing.isEnabled);
    } else {
      setTitle("");
      setDescription("");
      setLink("");
      setCtaLabel("");
      setImageUrl(null);
      setTabletImageUrl(null);
      setMobileImageUrl(null);
      setIsEnabled(true);
    }
  }, [isOpen, editing]);

  const [addSlide, { loading: adding }] = useMutation<AddSlideItemData>(
    ADD_SLIDE_ITEM,
    {
      refetchQueries: [
        { query: GET_ADMIN_SLIDER, variables: { id: sliderId } },
      ],
      onCompleted: () => {
        toast.success("Slide added");
        onClose();
      },
      onError: (err) => toast.error(`Add failed: ${err.message}`),
    },
  );

  const [updateSlide, { loading: updating }] =
    useMutation<UpdateSlideItemData>(UPDATE_SLIDE_ITEM, {
      refetchQueries: [
        { query: GET_ADMIN_SLIDER, variables: { id: sliderId } },
      ],
      onCompleted: () => {
        toast.success("Slide updated");
        onClose();
      },
      onError: (err) => toast.error(`Update failed: ${err.message}`),
    });

  async function save() {
    const payload = {
      title: title || undefined,
      description: description || undefined,
      link: link || undefined,
      ctaLabel: ctaLabel || undefined,
      imageUrl: imageUrl || undefined,
      tabletImageUrl: tabletImageUrl || undefined,
      mobileImageUrl: mobileImageUrl || undefined,
      isEnabled,
    };
    if (editing) {
      await updateSlide({
        variables: {
          updateSlideItemInput: { id: editing.id, ...payload },
        },
      });
    } else {
      await addSlide({
        variables: {
          addSlideItemInput: {
            sliderId,
            order: nextOrder,
            ...payload,
          },
        },
      });
    }
  }

  const saving = adding || updating;

  return (
    <Dialog open={isOpen} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {editing ? `Edit slide` : "Add slide"}
          </DialogTitle>
          <DialogDescription>
            Upload responsive images (desktop / tablet / mobile). Mobile falls
            back to tablet, tablet falls back to desktop.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div>
            <Label htmlFor="slide-title" className="text-xs">
              Title
            </Label>
            <Input
              id="slide-title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="The New Standard of Living"
            />
          </div>

          <div>
            <Label htmlFor="slide-desc" className="text-xs">
              Description
            </Label>
            <textarea
              id="slide-desc"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              className="w-full rounded-md border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-ring resize-y"
              placeholder="Subtext shown under the title"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="slide-link" className="text-xs">
                Link
              </Label>
              <Input
                id="slide-link"
                value={link}
                onChange={(e) => setLink(e.target.value)}
                placeholder="/products or https://..."
              />
            </div>
            <div>
              <Label htmlFor="slide-cta" className="text-xs">
                CTA label
              </Label>
              <Input
                id="slide-cta"
                value={ctaLabel}
                onChange={(e) => setCtaLabel(e.target.value)}
                placeholder="Shop Now"
              />
            </div>
          </div>

          <div className="space-y-3">
            <Label className="text-xs">Images (responsive)</Label>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <div>
                <p className="text-xs font-medium mb-1">
                  Desktop <span className="text-muted-foreground">≥ 1200px</span>
                </p>
                <ImageUploader
                  purpose="BANNER"
                  initialUrl={imageUrl}
                  onUploaded={(img) => setImageUrl(img.url)}
                  onClear={() => setImageUrl(null)}
                  aspectClass="aspect-[16/9] h-32"
                />
              </div>
              <div>
                <p className="text-xs font-medium mb-1">
                  Tablet{" "}
                  <span className="text-muted-foreground">768–1199px</span>
                </p>
                <ImageUploader
                  purpose="BANNER"
                  initialUrl={tabletImageUrl}
                  onUploaded={(img) => setTabletImageUrl(img.url)}
                  onClear={() => setTabletImageUrl(null)}
                  aspectClass="aspect-[4/3] h-32"
                />
                <p className="text-[10px] text-muted-foreground mt-1">
                  Falls back to desktop if empty.
                </p>
              </div>
              <div>
                <p className="text-xs font-medium mb-1">
                  Mobile{" "}
                  <span className="text-muted-foreground">&lt; 768px</span>
                </p>
                <ImageUploader
                  purpose="BANNER"
                  initialUrl={mobileImageUrl}
                  onUploaded={(img) => setMobileImageUrl(img.url)}
                  onClear={() => setMobileImageUrl(null)}
                  aspectClass="aspect-[3/4] h-32"
                />
                <p className="text-[10px] text-muted-foreground mt-1">
                  Falls back to tablet → desktop.
                </p>
              </div>
            </div>
          </div>

          <label className="flex items-center gap-2 text-sm cursor-pointer">
            <input
              type="checkbox"
              className="h-4 w-4"
              checked={isEnabled}
              onChange={(e) => setIsEnabled(e.target.checked)}
            />
            Enabled — show this slide on the public site
          </label>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            <X className="mr-2 h-4 w-4" />
            Cancel
          </Button>
          <Button onClick={save} disabled={saving}>
            {saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            <Check className="mr-2 h-4 w-4" />
            {editing ? "Save changes" : "Add slide"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
