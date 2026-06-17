/**
 * Admin → Collections — curated/automatic product groupings.
 *
 * MANUAL collections hand-pick products; SMART collections use a rule
 * (shared RuleBuilder) that auto-selects matching products at query time.
 */

"use client";

import { useMemo, useState } from "react";
import { useMutation, useQuery } from "@apollo/client/react";
import { toast } from "sonner";
import { Loader2, Plus, Trash2, Sparkles, Hand } from "lucide-react";

import {
  CREATE_COLLECTION,
  GET_ADMIN_COLLECTIONS,
  REMOVE_COLLECTION,
  UPDATE_COLLECTION,
} from "@/lib/graphql/collections";
import { GET_PUBLIC_PRODUCTS } from "@/lib/graphql/products";
import type {
  Collection,
  CollectionStatus,
  CollectionType,
  CreateCollectionData,
  GetAdminCollectionsData,
  UpdateCollectionData,
} from "@/types/collection.types";
import type { Product } from "@/types/product.types";
import type { RuleSet } from "@/lib/constants/catalog-rules";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { RuleBuilder } from "@/components/catalog/rule-builder";
import { useSetPageTitle } from "@/components/shell/page-title-context";

const DEFAULT_RULE: RuleSet = {
  match: "ALL",
  conditions: [{ field: "ageDays", op: "lte", value: 30 }],
};

interface FormState {
  id?: string;
  name: string;
  slug: string;
  description: string;
  bannerUrl: string;
  type: CollectionType;
  status: CollectionStatus;
  isFeatured: boolean;
  displayOrder: number;
  rule: RuleSet;
  productIds: string[];
}

const BLANK: FormState = {
  name: "",
  slug: "",
  description: "",
  bannerUrl: "",
  type: "MANUAL",
  status: "ACTIVE",
  isFeatured: false,
  displayOrder: 0,
  rule: DEFAULT_RULE,
  productIds: [],
};

export default function AdminCollectionsPage() {
  useSetPageTitle("Collections");

  const { data, loading, refetch } = useQuery<GetAdminCollectionsData>(
    GET_ADMIN_COLLECTIONS,
    { fetchPolicy: "cache-and-network" },
  );
  const collections = useMemo(() => data?.adminCollections ?? [], [data]);

  // Active products for the MANUAL picker.
  const { data: productsData } = useQuery<{ publicProducts: Product[] }>(
    GET_PUBLIC_PRODUCTS,
    { variables: { limit: 100 }, fetchPolicy: "cache-first" },
  );
  const products = productsData?.publicProducts ?? [];

  const [createCollection] = useMutation<CreateCollectionData>(CREATE_COLLECTION);
  const [updateCollection] = useMutation<UpdateCollectionData>(UPDATE_COLLECTION);
  const [removeCollection] = useMutation(REMOVE_COLLECTION);

  const [open, setOpen] = useState(false);
  const [form, setForm] = useState<FormState>(BLANK);
  const [saving, setSaving] = useState(false);
  const [productSearch, setProductSearch] = useState("");

  function openCreate() {
    setForm(BLANK);
    setProductSearch("");
    setOpen(true);
  }
  function openEdit(c: Collection) {
    setForm({
      id: c.id,
      name: c.name,
      slug: c.slug,
      description: c.description ?? "",
      bannerUrl: c.bannerUrl ?? "",
      type: c.type,
      status: c.status,
      isFeatured: c.isFeatured,
      displayOrder: c.displayOrder,
      rule: c.rule ? (JSON.parse(c.rule) as RuleSet) : DEFAULT_RULE,
      productIds: c.productIds ?? [],
    });
    setProductSearch("");
    setOpen(true);
  }

  async function save() {
    setSaving(true);
    try {
      const ruleStr = form.type === "SMART" ? JSON.stringify(form.rule) : undefined;
      const productIds = form.type === "MANUAL" ? form.productIds : undefined;
      const base = {
        name: form.name,
        slug: form.slug || undefined,
        description: form.description || undefined,
        bannerUrl: form.bannerUrl || undefined,
        type: form.type,
        rule: ruleStr,
        productIds,
        status: form.status,
        isFeatured: form.isFeatured,
        displayOrder: form.displayOrder,
      };
      if (form.id) {
        await updateCollection({
          variables: { updateCollectionInput: { id: form.id, ...base } },
        });
      } else {
        await createCollection({
          variables: { createCollectionInput: base },
        });
      }
      toast.success("Collection saved.");
      setOpen(false);
      await refetch();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Save failed.");
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(c: Collection) {
    if (!confirm(`Delete collection "${c.name}"?`)) return;
    try {
      await removeCollection({ variables: { id: c.id } });
      toast.success("Collection deleted.");
      await refetch();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Delete failed.");
    }
  }

  const filteredProducts = products.filter((p) =>
    p.name.toLowerCase().includes(productSearch.toLowerCase()),
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Collections</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Curated (manual) or automatic (smart, rule-based) product groupings
            with their own storefront page.
          </p>
        </div>
        <Button onClick={openCreate}>
          <Plus className="mr-1.5 h-4 w-4" />
          New collection
        </Button>
      </div>

      <div className="rounded-lg border bg-card overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-muted/40 text-left text-xs uppercase tracking-wide text-muted-foreground">
            <tr>
              <th className="px-4 py-3">Name</th>
              <th className="px-4 py-3">Slug</th>
              <th className="px-4 py-3">Type</th>
              <th className="px-4 py-3">Featured</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading && collections.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-4 py-8 text-center text-muted-foreground">
                  <Loader2 className="mx-auto h-5 w-5 animate-spin" />
                </td>
              </tr>
            ) : collections.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-4 py-8 text-center text-muted-foreground">
                  No collections yet. Run <code>pnpm seed:collections</code> or create one.
                </td>
              </tr>
            ) : (
              collections.map((c) => (
                <tr key={c.id} className="border-t">
                  <td className="px-4 py-3 font-medium">{c.name}</td>
                  <td className="px-4 py-3 font-mono text-xs">
                    <a
                      href={`/collections/${c.slug}`}
                      target="_blank"
                      rel="noreferrer"
                      className="hover:underline text-primary"
                    >
                      /{c.slug}
                    </a>
                  </td>
                  <td className="px-4 py-3">
                    <Badge variant={c.type === "SMART" ? "default" : "outline"} className="gap-1 text-[10px]">
                      {c.type === "SMART" ? <Sparkles className="h-3 w-3" /> : <Hand className="h-3 w-3" />}
                      {c.type}
                    </Badge>
                  </td>
                  <td className="px-4 py-3">{c.isFeatured ? "Yes" : "—"}</td>
                  <td className="px-4 py-3">
                    <Badge variant={c.status === "ACTIVE" ? "default" : "outline"} className="text-[10px]">
                      {c.status}
                    </Badge>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <Button variant="ghost" size="sm" onClick={() => openEdit(c)}>
                      Edit
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDelete(c)}
                      className="text-destructive"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Create / edit dialog */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{form.id ? "Edit collection" : "New collection"}</DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <Field label="Name">
                <Input
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                />
              </Field>
              <Field label="Slug (optional)">
                <Input
                  value={form.slug}
                  placeholder="auto from name"
                  onChange={(e) => setForm({ ...form, slug: e.target.value })}
                />
              </Field>
            </div>

            <Field label="Description">
              <Textarea
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                className="h-16"
              />
            </Field>

            <Field label="Banner image URL (optional)">
              <Input
                value={form.bannerUrl}
                onChange={(e) => setForm({ ...form, bannerUrl: e.target.value })}
              />
            </Field>

            <div className="grid grid-cols-3 gap-3">
              <Field label="Type">
                <Select
                  value={form.type}
                  onValueChange={(t) => setForm({ ...form, type: t as CollectionType })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="MANUAL">Manual (pick products)</SelectItem>
                    <SelectItem value="SMART">Smart (rule-based)</SelectItem>
                  </SelectContent>
                </Select>
              </Field>
              <Field label="Status">
                <Select
                  value={form.status}
                  onValueChange={(s) => setForm({ ...form, status: s as CollectionStatus })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ACTIVE">Active</SelectItem>
                    <SelectItem value="INACTIVE">Inactive</SelectItem>
                  </SelectContent>
                </Select>
              </Field>
              <Field label="Display order">
                <Input
                  type="number"
                  value={form.displayOrder}
                  onChange={(e) => setForm({ ...form, displayOrder: Number(e.target.value) })}
                />
              </Field>
            </div>

            <div className="flex items-center gap-2">
              <Switch
                checked={form.isFeatured}
                onCheckedChange={(v) => setForm({ ...form, isFeatured: v })}
              />
              <span className="text-sm">Featured (eligible for home/nav slots)</span>
            </div>

            {form.type === "SMART" ? (
              <Field label="Rule">
                <RuleBuilder
                  value={form.rule}
                  onChange={(rule) => setForm({ ...form, rule })}
                />
              </Field>
            ) : (
              <Field label={`Products (${form.productIds.length} selected)`}>
                <Input
                  placeholder="Search products…"
                  value={productSearch}
                  onChange={(e) => setProductSearch(e.target.value)}
                  className="mb-2"
                />
                <div className="max-h-52 overflow-y-auto rounded-md border divide-y">
                  {filteredProducts.length === 0 ? (
                    <p className="p-3 text-xs text-muted-foreground">No products.</p>
                  ) : (
                    filteredProducts.map((p) => {
                      const checked = form.productIds.includes(p.id);
                      return (
                        <label
                          key={p.id}
                          className="flex items-center gap-2 px-3 py-2 text-sm cursor-pointer hover:bg-muted/40"
                        >
                          <input
                            type="checkbox"
                            checked={checked}
                            onChange={() =>
                              setForm({
                                ...form,
                                productIds: checked
                                  ? form.productIds.filter((id) => id !== p.id)
                                  : [...form.productIds, p.id],
                              })
                            }
                          />
                          {p.name}
                        </label>
                      );
                    })
                  )}
                </div>
              </Field>
            )}
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button onClick={save} disabled={saving}>
              {saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Save
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="space-y-1.5">
      <label className="text-xs font-medium text-muted-foreground">{label}</label>
      {children}
    </div>
  );
}
