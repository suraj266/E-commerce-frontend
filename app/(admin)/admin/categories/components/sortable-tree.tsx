"use client";

import { useState } from "react";
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
import { GripVertical, Pencil, Trash2, Loader2 } from "lucide-react";

import { Category } from "@/types/category.types";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// ---------------------------------------------------------------------------
// Sortable Item Component (Row)
// ---------------------------------------------------------------------------
interface SortableCategoryItemProps {
  category: Category;
  parentName: string;
  onEdit: (cat: Category) => void;
  onDelete: (cat: Category) => void;
  onStatusChange: (cat: Category, isActive: boolean) => Promise<void> | void;
}

function SortableCategoryItem({
  category,
  parentName,
  onEdit,
  onDelete,
  onStatusChange,
}: SortableCategoryItemProps) {
  const [statusSaving, setStatusSaving] = useState(false);

  async function handleStatusChange(value: string) {
    const next = value === "active";
    if (next === category.isActive) return;
    try {
      setStatusSaving(true);
      await onStatusChange(category, next);
    } finally {
      setStatusSaving(false);
    }
  }

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: category.id });

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
      className={`flex items-center gap-4 p-3 mb-2 bg-card border rounded-lg shadow-sm ${
        isDragging ? "ring-2 ring-primary" : ""
      }`}
    >
      <div
        {...attributes}
        {...listeners}
        className="cursor-grab hover:text-primary text-muted-foreground mr-2"
      >
        <GripVertical className="h-5 w-5" />
      </div>

      <div className="flex-1 min-w-0">
        <div className="font-semibold">{category.name}</div>
        <div className="text-xs text-muted-foreground font-mono truncate">
          {category.slug}
        </div>
      </div>

      <div className="hidden lg:block w-32 text-sm text-muted-foreground truncate">
        {category.parentId ? parentName : <span className="italic">Root</span>}
      </div>

      <div className="hidden sm:block w-16 text-sm text-muted-foreground text-center">
        {category.displayOrder}
      </div>

      <div className="w-28 flex justify-center">
        <Select
          value={category.isActive ? "active" : "inactive"}
          onValueChange={handleStatusChange}
          disabled={statusSaving}
        >
          <SelectTrigger
            className={`h-8 w-full text-xs font-medium ${
              category.isActive
                ? "bg-primary text-primary-foreground border-primary"
                : "bg-muted text-muted-foreground"
            }`}
          >
            {statusSaving ? (
              <span className="flex items-center gap-1">
                <Loader2 className="h-3 w-3 animate-spin" />
                Saving...
              </span>
            ) : (
              <SelectValue />
            )}
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="active">Active</SelectItem>
            <SelectItem value="inactive">Inactive</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="flex items-center gap-1">
        <Button variant="ghost" size="icon" onClick={() => onEdit(category)}>
          <Pencil className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className="text-destructive hover:text-destructive"
          onClick={() => onDelete(category)}
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Main List Component
// ---------------------------------------------------------------------------
interface CategorySortableListProps {
  items: Category[];
  categoryMap: Record<string, string>;
  onEdit: (cat: Category) => void;
  onDelete: (cat: Category) => void;
  onReorder: (newItems: Category[]) => void;
  onStatusChange: (cat: Category, isActive: boolean) => Promise<void> | void;
}

export function CategorySortableList({
  items,
  categoryMap,
  onEdit,
  onDelete,
  onReorder,
  onStatusChange,
}: CategorySortableListProps) {
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      const oldIndex = items.findIndex((item) => item.id === active.id);
      const newIndex = items.findIndex((item) => item.id === over.id);

      const reorderedItems = arrayMove(items, oldIndex, newIndex);

      // Flat list, so displayOrder is just the new array index.
      const updatedItems = reorderedItems.map((item, index) => ({
        ...item,
        displayOrder: index,
      }));

      onReorder(updatedItems);
    }
  };

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragEnd={handleDragEnd}
    >
      <SortableContext
        items={items.map((i) => i.id)}
        strategy={verticalListSortingStrategy}
      >
        <div className="flex flex-col gap-1 rounded-md p-1">
          {items.map((category) => (
            <SortableCategoryItem
              key={category.id}
              category={category}
              parentName={
                category.parentId ? categoryMap[category.parentId] ?? "Unknown" : "Root"
              }
              onEdit={onEdit}
              onDelete={onDelete}
              onStatusChange={onStatusChange}
            />
          ))}
        </div>
      </SortableContext>
    </DndContext>
  );
}
