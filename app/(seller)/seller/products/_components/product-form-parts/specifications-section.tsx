import { Layers, Plus, Trash2, X } from "lucide-react";

import { Specifications } from "@/types/product.types";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

export function SpecificationsSection({
  specs,
  onChange,
}: {
  specs: Specifications;
  onChange: (s: Specifications) => void;
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Layers className="h-5 w-5" />
          Specifications
        </CardTitle>
      </CardHeader>
      <CardContent>
        <SpecificationsEditor specs={specs} onChange={onChange} />
      </CardContent>
    </Card>
  );
}

// ===========================================================================
// Specifications editor — dynamic groups + items
// ===========================================================================
function SpecificationsEditor({
  specs,
  onChange,
}: {
  specs: Specifications;
  onChange: (s: Specifications) => void;
}) {
  function addGroup() {
    onChange([
      ...specs,
      {
        name: `Group ${specs.length + 1}`,
        order: specs.length,
        items: [],
      },
    ]);
  }

  function updateGroup(idx: number, patch: Partial<Specifications[number]>) {
    const next = [...specs];
    next[idx] = { ...next[idx], ...patch };
    onChange(next);
  }

  function removeGroup(idx: number) {
    onChange(specs.filter((_, i) => i !== idx).map((g, i) => ({ ...g, order: i })));
  }

  function addItem(groupIdx: number) {
    const next = [...specs];
    next[groupIdx] = {
      ...next[groupIdx],
      items: [
        ...next[groupIdx].items,
        { label: "", value: "", order: next[groupIdx].items.length },
      ],
    };
    onChange(next);
  }

  function updateItem(
    groupIdx: number,
    itemIdx: number,
    patch: { label?: string; value?: string },
  ) {
    const next = [...specs];
    const items = [...next[groupIdx].items];
    items[itemIdx] = { ...items[itemIdx], ...patch };
    next[groupIdx] = { ...next[groupIdx], items };
    onChange(next);
  }

  function removeItem(groupIdx: number, itemIdx: number) {
    const next = [...specs];
    next[groupIdx] = {
      ...next[groupIdx],
      items: next[groupIdx].items
        .filter((_, i) => i !== itemIdx)
        .map((it, i) => ({ ...it, order: i })),
    };
    onChange(next);
  }

  return (
    <div className="space-y-4">
      {specs.length === 0 && (
        <p className="text-sm text-muted-foreground italic text-center py-4">
          No specs yet. Click &quot;Add group&quot; to start (e.g. General,
          Display, Battery).
        </p>
      )}

      {specs.map((group, gi) => (
        <div key={gi} className="border rounded-md p-3 space-y-3 bg-muted/30">
          <div className="flex items-center gap-2">
            <Input
              placeholder="Group name (e.g. Display)"
              value={group.name}
              onChange={(e) => updateGroup(gi, { name: e.target.value })}
              className="font-semibold"
            />
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="text-destructive hover:text-destructive"
              onClick={() => removeGroup(gi)}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>

          <div className="space-y-2 pl-2 border-l-2 border-border">
            {group.items.map((item, ii) => (
              <div key={ii} className="flex items-center gap-2">
                <Input
                  placeholder="Label (e.g. Display Size)"
                  value={item.label}
                  onChange={(e) => updateItem(gi, ii, { label: e.target.value })}
                  className="flex-1"
                />
                <span className="text-muted-foreground">:</span>
                <Input
                  placeholder='Value (e.g. "6.1 inch OLED")'
                  value={item.value}
                  onChange={(e) => updateItem(gi, ii, { value: e.target.value })}
                  className="flex-1"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={() => removeItem(gi, ii)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ))}
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => addItem(gi)}
            >
              <Plus className="mr-1 h-3 w-3" />
              Add item
            </Button>
          </div>
        </div>
      ))}

      <Button type="button" variant="outline" onClick={addGroup}>
        <Plus className="mr-2 h-4 w-4" />
        Add group
      </Button>
    </div>
  );
}
