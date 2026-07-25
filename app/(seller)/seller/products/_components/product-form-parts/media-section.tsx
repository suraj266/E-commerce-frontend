import { useEffect, useRef } from "react";
import { useMutation } from "@apollo/client/react";
import { toast } from "sonner";
import { GripVertical, Image as ImageIcon, Star, StarOff, Trash2 } from "lucide-react";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  useSortable,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

import {
  ADD_MY_PRODUCT_IMAGE,
  REMOVE_MY_PRODUCT_IMAGE,
  REORDER_MY_PRODUCT_IMAGES,
  UPDATE_MY_PRODUCT_IMAGE,
} from "@/lib/graphql/products";
import {
  AddMyProductImageData,
  Product,
  ProductImage,
  RemoveMyProductImageData,
  ReorderMyProductImagesData,
  UpdateMyProductImageData,
} from "@/types/product.types";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ImageUploader } from "@/components/media/image-uploader";

/**
 * Media — edit mode shows the reorderable/deletable image gallery (needs a
 * productId for the backend mutations); create mode shows a "save first" hint
 * because images are uploaded on the next screen.
 */
export function MediaSection({
  isEdit,
  product,
  images,
  onImagesChange,
}: {
  isEdit: boolean;
  product?: Product;
  images: ProductImage[];
  onImagesChange: (imgs: ProductImage[]) => void;
}) {
  if (isEdit && product) {
    return (
      <ImagesCard
        product={product}
        images={images}
        onImagesChange={onImagesChange}
      />
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <ImageIcon className="h-5 w-5" />
          Media
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground">
          Save the product first, then upload images on the next screen.
        </p>
      </CardContent>
    </Card>
  );
}

// ===========================================================================
// Images card — only in edit mode (need productId for backend mutation)
// ===========================================================================
function ImagesCard({
  product,
  images,
  onImagesChange,
}: {
  product: Product;
  images: ProductImage[];
  onImagesChange: (imgs: ProductImage[]) => void;
}) {
  const [addImage] = useMutation<AddMyProductImageData>(ADD_MY_PRODUCT_IMAGE);
  const [updateImage] = useMutation<UpdateMyProductImageData>(
    UPDATE_MY_PRODUCT_IMAGE,
  );
  const [removeImage] = useMutation<RemoveMyProductImageData>(
    REMOVE_MY_PRODUCT_IMAGE,
  );
  const [reorderImages] = useMutation<ReorderMyProductImagesData>(
    REORDER_MY_PRODUCT_IMAGES,
  );

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }),
  );

  // Mirror images into a ref so multi-upload's stale closure can still see
  // the latest count between sequential uploads.
  const imagesRef = useRef(images);
  useEffect(() => {
    imagesRef.current = images;
  }, [images]);

  async function handleNewImage(imageUrl: string) {
    try {
      const current = imagesRef.current;
      const res = await addImage({
        variables: {
          addProductImageInput: {
            productId: product.id,
            imageUrl,
            isPrimary: current.length === 0,
          },
        },
      });
      const created = res.data?.addMyProductImage;
      if (created) {
        const next =
          current.length === 0
            ? [created]
            : [...current.map((i) => ({ ...i, isPrimary: false })), created];
        const sorted = next.sort((a, b) => a.displayOrder - b.displayOrder);
        imagesRef.current = sorted;
        onImagesChange(sorted);
      }
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Add failed";
      toast.error(msg);
    }
  }

  async function handleRemove(imageId: string) {
    try {
      await removeImage({ variables: { id: imageId } });
      onImagesChange(images.filter((i) => i.id !== imageId));
      toast.success("Image removed");
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Remove failed";
      toast.error(msg);
    }
  }

  async function handleSetPrimary(imageId: string) {
    try {
      await updateImage({
        variables: {
          updateProductImageInput: { id: imageId, isPrimary: true },
        },
      });
      onImagesChange(images.map((i) => ({ ...i, isPrimary: i.id === imageId })));
      toast.success("Primary image updated");
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Update failed";
      toast.error(msg);
    }
  }

  async function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    if (!over || active.id === over.id) return;
    const oldIndex = images.findIndex((i) => i.id === active.id);
    const newIndex = images.findIndex((i) => i.id === over.id);
    const reordered = arrayMove(images, oldIndex, newIndex);
    onImagesChange(reordered.map((i, idx) => ({ ...i, displayOrder: idx })));

    try {
      await reorderImages({
        variables: {
          reorderProductImagesInput: {
            productId: product.id,
            imageIds: reordered.map((i) => i.id),
          },
        },
      });
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Reorder failed";
      toast.error(msg);
      onImagesChange(images); // revert on error
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <ImageIcon className="h-5 w-5" />
          Media ({images.length}/8)
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {images.length < 8 && (
          <ImageUploader
            purpose="PRODUCT_GALLERY"
            ownerType="PRODUCT"
            ownerId={product.id}
            multiple
            maxFiles={8 - images.length}
            onUploaded={(img) => handleNewImage(img.url)}
            aspectClass="aspect-square h-32"
          />
        )}

        {images.length === 0 ? (
          <p className="text-sm text-muted-foreground italic text-center py-4">
            Upload at least 1 image before publishing.
          </p>
        ) : (
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
          >
            <SortableContext
              items={images.map((i) => i.id)}
              strategy={verticalListSortingStrategy}
            >
              <div className="space-y-2">
                {images.map((img) => (
                  <SortableImageRow
                    key={img.id}
                    image={img}
                    onSetPrimary={() => handleSetPrimary(img.id)}
                    onRemove={() => handleRemove(img.id)}
                  />
                ))}
              </div>
            </SortableContext>
          </DndContext>
        )}
      </CardContent>
    </Card>
  );
}

function SortableImageRow({
  image,
  onSetPrimary,
  onRemove,
}: {
  image: ProductImage;
  onSetPrimary: () => void;
  onRemove: () => void;
}) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } =
    useSortable({ id: image.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 10 : 1,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`flex items-center gap-3 p-2 bg-card border rounded-md ${
        isDragging ? "ring-2 ring-primary" : ""
      }`}
    >
      <div
        {...attributes}
        {...listeners}
        className="cursor-grab text-muted-foreground hover:text-foreground"
      >
        <GripVertical className="h-4 w-4" />
      </div>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={image.imageUrl}
        alt={image.altText ?? ""}
        className="h-14 w-14 rounded-md object-cover"
      />
      <div className="flex-1 text-xs text-muted-foreground truncate">
        {image.altText ?? "(no alt text)"}
      </div>
      <Button
        type="button"
        variant="ghost"
        size="icon"
        onClick={onSetPrimary}
        title={image.isPrimary ? "Already primary" : "Set as primary"}
        disabled={image.isPrimary}
      >
        {image.isPrimary ? (
          <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
        ) : (
          <StarOff className="h-4 w-4 text-muted-foreground" />
        )}
      </Button>
      <Button
        type="button"
        variant="ghost"
        size="icon"
        className="text-destructive hover:text-destructive"
        onClick={onRemove}
      >
        <Trash2 className="h-4 w-4" />
      </Button>
    </div>
  );
}
