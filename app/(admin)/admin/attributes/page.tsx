/**
 * Admin Attributes Page — /admin/attributes
 *
 * Two-level CRUD: attributes (Color, Size) + their values (Red, Blue, M, L).
 * UX pattern: list page with click-to-open Sheet that contains both edit
 * fields AND the values manager (drag-drop reorder + inline add).
 *
 * BOOLEAN attributes don't need a values list — the Sheet hides that section.
 */

"use client";

import { useEffect, useState } from "react";
import { useMutation, useQuery } from "@apollo/client/react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
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
  GripVertical,
  Hash,
  Layers,
  Loader2,
  Pencil,
  Plus,
  Search,
  Trash2,
  X,
} from "lucide-react";

import {
  CREATE_ATTRIBUTE,
  CREATE_ATTRIBUTE_VALUE,
  GET_ADMIN_ATTRIBUTES,
  REMOVE_ATTRIBUTE,
  REMOVE_ATTRIBUTE_VALUE,
  REORDER_ATTRIBUTE_VALUES,
  UPDATE_ATTRIBUTE,
  UPDATE_ATTRIBUTE_VALUE,
} from "@/lib/graphql/attributes";
import {
  ATTRIBUTE_TYPE_LABEL,
  ATTRIBUTE_TYPE_OPTIONS,
  AttributeType,
  CreateAttributeData,
  CreateAttributeValueData,
  GetAdminAttributesData,
  ProductAttribute,
  ProductAttributeValue,
  RemoveAttributeData,
  RemoveAttributeValueData,
  ReorderAttributeValuesData,
  UpdateAttributeData,
  UpdateAttributeValueData,
} from "@/types/attribute.types";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
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
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";

// ---------------------------------------------------------------------------
// Schemas
// ---------------------------------------------------------------------------
const attributeSchema = z.object({
  name: z.string().min(2, "At least 2 characters"),
  slug: z
    .string()
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "lowercase, digits, hyphens")
    .optional()
    .or(z.literal("")),
  description: z.string().max(500).optional(),
  type: z.enum(ATTRIBUTE_TYPE_OPTIONS),
  isVariantAttribute: z.boolean(),
});
type AttributeFormValues = z.infer<typeof attributeSchema>;

// ===========================================================================
export default function AdminAttributesPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [typeFilter, setTypeFilter] = useState<"all" | AttributeType>("all");
  const [sheetOpen, setSheetOpen] = useState(false);
  const [editing, setEditing] = useState<ProductAttribute | null>(null);
  const [deletingAttr, setDeletingAttr] = useState<ProductAttribute | null>(null);

  const { data, loading, error, refetch } = useQuery<GetAdminAttributesData>(
    GET_ADMIN_ATTRIBUTES,
    {
      variables: {
        type: typeFilter === "all" ? null : typeFilter,
      },
      fetchPolicy: "cache-and-network",
    },
  );

  useEffect(() => {
    if (error) toast.error(`Failed to load: ${error.message}`);
  }, [error]);

  const refetchVars = { type: typeFilter === "all" ? null : typeFilter };

  const [createAttribute, { loading: creating }] = useMutation<CreateAttributeData>(
    CREATE_ATTRIBUTE,
    {
      refetchQueries: [{ query: GET_ADMIN_ATTRIBUTES, variables: refetchVars }],
      onCompleted: (res) => {
        toast.success("Attribute created");
        // Open the freshly created attribute so admin can immediately add values
        setEditing(res.createAttribute);
      },
      onError: (err) => toast.error(`Create failed: ${err.message}`),
    },
  );

  const [updateAttribute, { loading: updating }] = useMutation<UpdateAttributeData>(
    UPDATE_ATTRIBUTE,
    {
      refetchQueries: [{ query: GET_ADMIN_ATTRIBUTES, variables: refetchVars }],
      onCompleted: (res) => {
        toast.success("Attribute updated");
        setEditing(res.updateAttribute);
      },
      onError: (err) => toast.error(`Update failed: ${err.message}`),
    },
  );

  const [removeAttribute, { loading: removingAttr }] =
    useMutation<RemoveAttributeData>(REMOVE_ATTRIBUTE, {
      refetchQueries: [{ query: GET_ADMIN_ATTRIBUTES, variables: refetchVars }],
      onCompleted: (res) => {
        toast.success(`"${res.removeAttribute.name}" deleted`);
        setDeletingAttr(null);
      },
      onError: (err) => toast.error(`Delete failed: ${err.message}`),
    });

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const form = useForm<AttributeFormValues>({
    resolver: zodResolver(attributeSchema as any) as any,
    defaultValues: {
      name: "",
      slug: "",
      description: "",
      type: "SELECT",
      isVariantAttribute: false,
    },
  });

  function openCreate() {
    setEditing(null);
    form.reset({
      name: "",
      slug: "",
      description: "",
      type: "SELECT",
      isVariantAttribute: false,
    });
    setSheetOpen(true);
  }

  function openEdit(attr: ProductAttribute) {
    setEditing(attr);
    form.reset({
      name: attr.name,
      slug: attr.slug,
      description: attr.description ?? "",
      type: attr.type as "SELECT" | "MULTISELECT" | "BOOLEAN",
      isVariantAttribute: attr.isVariantAttribute,
    });
    setSheetOpen(true);
  }

  function closeSheet() {
    setSheetOpen(false);
    setEditing(null);
  }

  async function onSubmit(values: AttributeFormValues) {
    const input = {
      name: values.name,
      slug: values.slug || undefined,
      description: values.description || undefined,
      type: values.type,
      isVariantAttribute: values.isVariantAttribute,
    };
    if (editing) {
      await updateAttribute({
        variables: { updateAttributeInput: { id: editing.id, ...input } },
      });
    } else {
      await createAttribute({ variables: { createAttributeInput: input } });
      // Immediately open the freshly created attribute for value management
      setSheetOpen(true);
    }
  }

  async function confirmDelete() {
    if (!deletingAttr) return;
    await removeAttribute({ variables: { id: deletingAttr.id } });
  }

  // Derived
  const all = data?.adminAttributes ?? [];
  const filtered = all.filter((a) => {
    const q = searchQuery.toLowerCase();
    if (!q) return true;
    return (
      a.name.toLowerCase().includes(q) ||
      a.slug.toLowerCase().includes(q) ||
      a.description?.toLowerCase().includes(q)
    );
  });

  const isSaving = creating || updating;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight flex items-center gap-2">
            <Layers className="h-6 w-6 text-primary" />
            Attributes
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Global registry for variant differentiation (Color, Size) and
            faceted filters. Sellers will pick from these when listing
            products.
          </p>
        </div>
        <Button onClick={openCreate} className="w-full sm:w-auto">
          <Plus className="mr-2 h-4 w-4" />
          Add Attribute
        </Button>
      </div>

      {/* Filters */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative w-full sm:max-w-xs">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search name, slug..."
            className="pl-9"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <Select
          value={typeFilter}
          onValueChange={(val) => setTypeFilter(val as "all" | AttributeType)}
        >
          <SelectTrigger className="w-full sm:w-44">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All types</SelectItem>
            {ATTRIBUTE_TYPE_OPTIONS.map((t) => (
              <SelectItem key={t} value={t}>
                {ATTRIBUTE_TYPE_LABEL[t]}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Table */}
      <div className="rounded-lg border bg-card p-2 shadow-sm min-h-[400px]">
        {loading && (
          <div className="space-y-3 p-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <div
                key={i}
                className="h-14 w-full animate-pulse rounded-lg bg-muted"
              />
            ))}
          </div>
        )}

        {!loading && filtered.length === 0 && (
          <div className="flex h-32 items-center justify-center text-muted-foreground">
            {searchQuery
              ? `No attributes found for "${searchQuery}"`
              : "No attributes yet. Click 'Add Attribute' to create one."}
          </div>
        )}

        {!loading && filtered.length > 0 && (
          <>
            <div className="flex items-center gap-4 px-3 py-2 mb-2 text-sm font-medium text-muted-foreground border-b uppercase pb-3">
              <div className="w-12 text-center">S.No</div>
              <div className="flex-1">Name</div>
              <div className="hidden md:block w-32">Type</div>
              <div className="hidden lg:block w-20 text-center">Variant?</div>
              <div className="w-20 text-center">Values</div>
              <div className="w-24 text-right">Actions</div>
            </div>

            <div className="flex flex-col gap-1 p-1">
              {filtered.map((attr, idx) => {
                const valuesCount = attr.values?.length ?? 0;
                return (
                  <div
                    key={attr.id}
                    className="flex items-center gap-4 p-3 mb-2 bg-card border rounded-lg shadow-sm hover:bg-muted/30 transition-colors"
                  >
                    <div className="w-12 text-center text-sm text-muted-foreground font-mono">
                      {idx + 1}
                    </div>
                    <div
                      className="flex-1 min-w-0 cursor-pointer"
                      onClick={() => openEdit(attr)}
                    >
                      <div className="font-semibold truncate">{attr.name}</div>
                      <div className="text-xs text-muted-foreground font-mono truncate">
                        {attr.slug}
                      </div>
                    </div>
                    <div className="hidden md:block w-32">
                      <Badge variant="secondary" className="text-xs">
                        {ATTRIBUTE_TYPE_LABEL[attr.type]}
                      </Badge>
                    </div>
                    <div className="hidden lg:block w-20 text-center text-sm">
                      {attr.isVariantAttribute ? (
                        <Badge variant="default" className="text-xs">
                          Variant
                        </Badge>
                      ) : (
                        <span className="text-muted-foreground">—</span>
                      )}
                    </div>
                    <div className="w-20 text-center text-sm text-muted-foreground font-mono">
                      {attr.type === "BOOLEAN" ? "—" : valuesCount}
                    </div>
                    <div className="w-24 flex items-center justify-end gap-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => openEdit(attr)}
                        title="Edit"
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="text-destructive hover:text-destructive"
                        onClick={() => setDeletingAttr(attr)}
                        title="Delete"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="border-t px-4 py-3 text-sm text-muted-foreground">
              Showing {filtered.length} of {all.length} attributes
            </div>
          </>
        )}
      </div>

      {/* ===================================================================
          CREATE / EDIT SHEET — includes values manager when editing existing
      =================================================================== */}
      <Sheet open={sheetOpen} onOpenChange={(open) => !open && closeSheet()}>
        <SheetContent className="sm:max-w-2xl w-full overflow-y-auto">
          <SheetHeader>
            <SheetTitle>
              {editing ? `Edit "${editing.name}"` : "Add Attribute"}
            </SheetTitle>
            <SheetDescription>
              {editing
                ? "Edit fields above. Manage values below (skipped for BOOLEAN)."
                : "Create the attribute first, then add values from the same panel."}
            </SheetDescription>
          </SheetHeader>

          <div className="px-6 pb-6 pt-4 space-y-6">
            {/* Attribute fields */}
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-4"
              >
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Name *</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g. Color" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="slug"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Slug</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="auto-generated-if-blank"
                          {...field}
                        />
                      </FormControl>
                      <FormDescription className="text-xs">
                        Used in filter URLs (?color=red).
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Description</FormLabel>
                      <FormControl>
                        <Input placeholder="Optional admin note" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="type"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Type *</FormLabel>
                        <Select
                          value={field.value}
                          onValueChange={field.onChange}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {ATTRIBUTE_TYPE_OPTIONS.map((t) => (
                              <SelectItem key={t} value={t}>
                                {ATTRIBUTE_TYPE_LABEL[t]}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormDescription className="text-xs">
                          BOOLEAN doesn&apos;t use a values list.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="isVariantAttribute"
                    render={({ field }) => (
                      <FormItem className="flex flex-col gap-2">
                        <FormLabel>Variant attribute</FormLabel>
                        <div className="flex items-center gap-2 h-9">
                          <FormControl>
                            <input
                              type="checkbox"
                              checked={field.value}
                              onChange={field.onChange}
                              className="h-4 w-4"
                            />
                          </FormControl>
                          <span className="text-sm text-muted-foreground">
                            Used to define variants (Phase B)
                          </span>
                        </div>
                      </FormItem>
                    )}
                  />
                </div>

                <div className="flex justify-end gap-2">
                  <Button type="button" variant="outline" onClick={closeSheet}>
                    Close
                  </Button>
                  <Button type="submit" disabled={isSaving}>
                    {isSaving && (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    )}
                    {editing ? "Save Changes" : "Create"}
                  </Button>
                </div>
              </form>
            </Form>

            {/* Values manager — only for existing attribute that supports values */}
            {editing && editing.type !== "BOOLEAN" && (
              <>
                <Separator />
                <ValuesManager
                  attribute={editing}
                  refetchVars={refetchVars}
                  onUpdated={refetch}
                />
              </>
            )}
          </div>
        </SheetContent>
      </Sheet>

      {/* ===================================================================
          DELETE DIALOG
      =================================================================== */}
      <AlertDialog
        open={!!deletingAttr}
        onOpenChange={(open) => !open && setDeletingAttr(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Attribute?</AlertDialogTitle>
            <AlertDialogDescription>
              Soft-delete{" "}
              <span className="font-semibold text-foreground">
                &ldquo;{deletingAttr?.name}&rdquo;
              </span>{" "}
              and all its values. Blocked if any variants currently use this
              attribute.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              onClick={confirmDelete}
              disabled={removingAttr}
            >
              {removingAttr && (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              )}
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

// ===========================================================================
// Values manager — drag-drop reorder + inline add + edit + delete
// ===========================================================================
interface ValuesManagerProps {
  attribute: ProductAttribute;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  refetchVars: any;
  onUpdated: () => void;
}

function ValuesManager({ attribute, onUpdated, refetchVars }: ValuesManagerProps) {
  const [newValue, setNewValue] = useState("");
  const [editingValue, setEditingValue] = useState<ProductAttributeValue | null>(
    null,
  );
  const [editText, setEditText] = useState("");

  const [createValue, { loading: addingValue }] =
    useMutation<CreateAttributeValueData>(CREATE_ATTRIBUTE_VALUE, {
      refetchQueries: [{ query: GET_ADMIN_ATTRIBUTES, variables: refetchVars }],
      onCompleted: () => {
        toast.success("Value added");
        setNewValue("");
        onUpdated();
      },
      onError: (err) => toast.error(`Add failed: ${err.message}`),
    });

  const [updateValue, { loading: savingValue }] =
    useMutation<UpdateAttributeValueData>(UPDATE_ATTRIBUTE_VALUE, {
      refetchQueries: [{ query: GET_ADMIN_ATTRIBUTES, variables: refetchVars }],
      onCompleted: () => {
        toast.success("Value updated");
        setEditingValue(null);
        onUpdated();
      },
      onError: (err) => toast.error(`Update failed: ${err.message}`),
    });

  const [removeValue, { loading: removingValue }] =
    useMutation<RemoveAttributeValueData>(REMOVE_ATTRIBUTE_VALUE, {
      refetchQueries: [{ query: GET_ADMIN_ATTRIBUTES, variables: refetchVars }],
      onCompleted: () => {
        toast.success("Value deleted");
        onUpdated();
      },
      onError: (err) => toast.error(`Delete failed: ${err.message}`),
    });

  const [reorderValues] = useMutation<ReorderAttributeValuesData>(
    REORDER_ATTRIBUTE_VALUES,
    {
      refetchQueries: [{ query: GET_ADMIN_ATTRIBUTES, variables: refetchVars }],
      onCompleted: () => onUpdated(),
      onError: (err) => toast.error(`Reorder failed: ${err.message}`),
    },
  );

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }),
  );

  async function handleAdd() {
    if (!newValue.trim()) return;
    await createValue({
      variables: {
        createAttributeValueInput: {
          attributeId: attribute.id,
          value: newValue.trim(),
        },
      },
    });
  }

  async function handleSaveEdit() {
    if (!editingValue) return;
    if (!editText.trim() || editText === editingValue.value) {
      setEditingValue(null);
      return;
    }
    await updateValue({
      variables: {
        updateAttributeValueInput: {
          id: editingValue.id,
          value: editText.trim(),
        },
      },
    });
  }

  async function handleDelete(value: ProductAttributeValue) {
    await removeValue({ variables: { id: value.id } });
  }

  async function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    if (!over || active.id === over.id) return;
    const values = attribute.values ?? [];
    const oldIndex = values.findIndex((v) => v.id === active.id);
    const newIndex = values.findIndex((v) => v.id === over.id);
    const reordered = arrayMove(values, oldIndex, newIndex);
    await reorderValues({
      variables: {
        reorderAttributeValuesInput: {
          attributeId: attribute.id,
          valueIds: reordered.map((v) => v.id),
        },
      },
    });
  }

  const values = attribute.values ?? [];

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        <Hash className="h-4 w-4 text-muted-foreground" />
        <h3 className="font-semibold">Values</h3>
        <span className="text-xs text-muted-foreground">
          ({values.length})
        </span>
      </div>

      {/* Add value */}
      <div className="flex gap-2">
        <Input
          placeholder="e.g. Red"
          value={newValue}
          onChange={(e) => setNewValue(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              handleAdd();
            }
          }}
        />
        <Button
          type="button"
          onClick={handleAdd}
          disabled={addingValue || !newValue.trim()}
        >
          {addingValue && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          <Plus className="mr-1 h-4 w-4" />
          Add
        </Button>
      </div>

      {/* List with drag-drop reorder */}
      {values.length === 0 ? (
        <div className="text-sm text-muted-foreground italic py-4 text-center">
          No values yet. Add the first one above.
        </div>
      ) : (
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          <SortableContext
            items={values.map((v) => v.id)}
            strategy={verticalListSortingStrategy}
          >
            <div className="space-y-1">
              {values.map((v) => (
                <SortableValueRow
                  key={v.id}
                  value={v}
                  isEditing={editingValue?.id === v.id}
                  editText={editText}
                  setEditText={setEditText}
                  onStartEdit={() => {
                    setEditingValue(v);
                    setEditText(v.value);
                  }}
                  onSaveEdit={handleSaveEdit}
                  onCancelEdit={() => setEditingValue(null)}
                  onDelete={() => handleDelete(v)}
                  saving={savingValue}
                  removing={removingValue}
                />
              ))}
            </div>
          </SortableContext>
        </DndContext>
      )}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Sortable value row
// ---------------------------------------------------------------------------
interface SortableValueRowProps {
  value: ProductAttributeValue;
  isEditing: boolean;
  editText: string;
  setEditText: (s: string) => void;
  onStartEdit: () => void;
  onSaveEdit: () => void;
  onCancelEdit: () => void;
  onDelete: () => void;
  saving: boolean;
  removing: boolean;
}

function SortableValueRow({
  value,
  isEditing,
  editText,
  setEditText,
  onStartEdit,
  onSaveEdit,
  onCancelEdit,
  onDelete,
  saving,
  removing,
}: SortableValueRowProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: value.id });

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
      className={`flex items-center gap-2 p-2 bg-card border rounded-md ${
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

      {isEditing ? (
        <>
          <Input
            value={editText}
            onChange={(e) => setEditText(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                onSaveEdit();
              } else if (e.key === "Escape") {
                onCancelEdit();
              }
            }}
            autoFocus
            className="h-8"
          />
          <Button
            type="button"
            size="sm"
            onClick={onSaveEdit}
            disabled={saving}
          >
            {saving && <Loader2 className="mr-1 h-3 w-3 animate-spin" />}
            Save
          </Button>
          <Button
            type="button"
            size="sm"
            variant="ghost"
            onClick={onCancelEdit}
          >
            <X className="h-4 w-4" />
          </Button>
        </>
      ) : (
        <>
          <div className="flex-1 min-w-0">
            <span className="font-medium">{value.value}</span>
            <span className="text-xs text-muted-foreground font-mono ml-2">
              ({value.slug})
            </span>
          </div>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={onStartEdit}
            className="h-7 w-7"
          >
            <Pencil className="h-3 w-3" />
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="h-7 w-7 text-destructive hover:text-destructive"
            onClick={onDelete}
            disabled={removing}
          >
            <Trash2 className="h-3 w-3" />
          </Button>
        </>
      )}
    </div>
  );
}
