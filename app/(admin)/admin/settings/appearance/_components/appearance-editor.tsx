"use client";

/**
 * Appearance editor — the actual interactive form.
 *
 * State model:
 *   - `values` is the working copy of the theme (controlled by every field).
 *   - `initialTheme` is the persisted baseline used by Reset (revert local
 *     edits) and the dirty-check.
 *   - A useEffect mirrors `values` onto the live admin shell by injecting a
 *     transient <style> tag built from buildThemeCss(values). The tag
 *     duplicates the SSR selectors, so light/dark resolution still flows
 *     through the wrapper's `.dark` class. On unmount the tag is removed
 *     and the SSR rules take over again.
 */

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { useMutation } from "@apollo/client/react";
import { toast } from "sonner";
import { Loader2, Palette, RotateCcw, Save } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  RESET_ADMIN_THEME,
  UPDATE_ADMIN_THEME,
} from "@/lib/graphql/admin-theme";
import { buildThemeCss } from "@/lib/theme/build-theme-css";
import { parseOklch } from "@/lib/theme/oklch-utils";
import { THEME_PRESETS } from "@/lib/theme/theme-presets";
import {
  type AdminTheme,
  type ResetAdminThemeData,
  type UpdateAdminThemeData,
} from "@/types/admin-theme.types";

import { ColorField } from "./color-field";

interface AppearanceEditorProps {
  initialTheme: AdminTheme;
}

const FONT_OPTIONS = [
  { value: "inter", label: "Inter (sans-serif)" },
  { value: "jetbrains", label: "JetBrains Mono" },
  { value: "system", label: "System default" },
];

/**
 * ID for the transient <style> tag we inject while the editor is open. We
 * use a separate tag (not inline style on the wrapper) so that BOTH the
 * `[data-admin-theme]` and `[data-admin-theme].dark` rules can be expressed —
 * inline styles can't be class-conditional, so writing them directly would
 * clobber the dark mode in favor of light values.
 */
const PREVIEW_STYLE_ID = "admin-theme-vars-preview";

export function AppearanceEditor({ initialTheme }: AppearanceEditorProps) {
  const router = useRouter();
  const [values, setValues] = useState<AdminTheme>(initialTheme);

  const isDirty = useMemo(
    () => !sameTheme(values, initialTheme),
    [values, initialTheme],
  );

  // ---- Live preview: mirror values onto the admin shell while editing ----
  // We inject a <style> tag with the SAME selectors as the SSR theme block
  // ([data-admin-theme] and [data-admin-theme].dark). Because it appears
  // later in <head>, it wins on equal specificity — which means light values
  // apply in light mode, dark values apply in dark mode, and toggling the
  // dark class re-resolves cleanly. No inline styles, no specificity wars.
  useEffect(() => {
    let styleEl = document.getElementById(
      PREVIEW_STYLE_ID,
    ) as HTMLStyleElement | null;
    if (!styleEl) {
      styleEl = document.createElement("style");
      styleEl.id = PREVIEW_STYLE_ID;
      document.head.appendChild(styleEl);
    }
    styleEl.textContent = buildThemeCss(values);

    return () => {
      styleEl?.remove();
    };
  }, [values]);

  // ---- Mutations ----
  const [updateTheme, { loading: saving }] =
    useMutation<UpdateAdminThemeData>(UPDATE_ADMIN_THEME);
  const [resetTheme, { loading: resetting }] =
    useMutation<ResetAdminThemeData>(RESET_ADMIN_THEME);

  function setField<K extends keyof AdminTheme>(key: K, value: AdminTheme[K]) {
    setValues((prev) => ({ ...prev, [key]: value }));
  }

  function applyPreset(presetId: string) {
    const preset = THEME_PRESETS.find((p) => p.id === presetId);
    if (!preset) return;
    setValues((prev) => ({ ...prev, ...preset.values }));
    toast.success(`Applied "${preset.name}" preset`);
  }

  function revertLocal() {
    setValues(initialTheme);
    toast.info("Reverted to last saved theme");
  }

  // Validate that every color field parses, before allowing save.
  const validationError = useMemo(() => validate(values), [values]);

  async function handleSave() {
    if (validationError) {
      toast.error(validationError);
      return;
    }
    try {
      await updateTheme({
        variables: {
          updateAdminThemeInput: {
            primaryLight: values.primaryLight,
            primaryDark: values.primaryDark,
            accentLight: values.accentLight,
            accentDark: values.accentDark,
            sidebarLight: values.sidebarLight,
            sidebarDark: values.sidebarDark,
            destructiveLight: values.destructiveLight,
            destructiveDark: values.destructiveDark,
            radius: values.radius,
            fontFamily: values.fontFamily ?? "inter",
          },
        },
      });
      toast.success("Theme saved");
      // SSR refresh — pulls the new values into the layout's <style> block
      router.refresh();
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Save failed";
      toast.error(msg);
    }
  }

  async function handleReset() {
    if (
      !window.confirm(
        "Reset the admin theme to the platform defaults? This affects everyone.",
      )
    )
      return;
    try {
      const res = await resetTheme();
      const next = res.data?.resetAdminTheme;
      if (next) setValues(next);
      toast.success("Reset to defaults");
      router.refresh();
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Reset failed";
      toast.error(msg);
    }
  }

  return (
    <div className="space-y-6">
      {/* Page header */}
      <div className="flex items-start justify-between gap-3 flex-wrap">
        <div>
          <h1 className="text-2xl font-bold tracking-tight flex items-center gap-2">
            <Palette className="h-6 w-6 text-primary" />
            Appearance
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Customize the look of the admin panel. Changes save globally for
            every admin.
          </p>
        </div>
      </div>

      {/* Editor — full width. Live preview happens directly on the
          surrounding admin shell via the injected <style> tag, so a
          dedicated preview pane would be redundant. */}
      <div className="space-y-6">
          {/* Presets */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Presets</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-3">
                {THEME_PRESETS.map((p) => (
                  <button
                    key={p.id}
                    type="button"
                    onClick={() => applyPreset(p.id)}
                    className="group flex items-center gap-2 rounded-lg border bg-card px-3 py-2 text-sm transition hover:border-foreground/40 hover:shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  >
                    <span
                      className="h-5 w-5 rounded-full border shadow-sm"
                      style={{ backgroundColor: p.swatch }}
                      aria-hidden
                    />
                    <span className="font-medium">{p.name}</span>
                  </button>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Color groups */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Brand color</CardTitle>
              <p className="text-xs text-muted-foreground">
                Drives buttons, active sidebar item, and other primary
                accents.
              </p>
            </CardHeader>
            <CardContent className="grid gap-6 sm:grid-cols-2">
              <ColorField
                label="Light mode"
                value={values.primaryLight}
                onChange={(v) => setField("primaryLight", v)}
              />
              <ColorField
                label="Dark mode"
                value={values.primaryDark}
                onChange={(v) => setField("primaryDark", v)}
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">Accent</CardTitle>
              <p className="text-xs text-muted-foreground">
                Used for hover surfaces and secondary highlights.
              </p>
            </CardHeader>
            <CardContent className="grid gap-6 sm:grid-cols-2">
              <ColorField
                label="Light mode"
                value={values.accentLight}
                onChange={(v) => setField("accentLight", v)}
              />
              <ColorField
                label="Dark mode"
                value={values.accentDark}
                onChange={(v) => setField("accentDark", v)}
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">Sidebar</CardTitle>
              <p className="text-xs text-muted-foreground">
                Background of the left navigation rail.
              </p>
            </CardHeader>
            <CardContent className="grid gap-6 sm:grid-cols-2">
              <ColorField
                label="Light mode"
                value={values.sidebarLight}
                onChange={(v) => setField("sidebarLight", v)}
              />
              <ColorField
                label="Dark mode"
                value={values.sidebarDark}
                onChange={(v) => setField("sidebarDark", v)}
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">Destructive</CardTitle>
              <p className="text-xs text-muted-foreground">
                Delete buttons and danger callouts. Conventionally red — change
                with care.
              </p>
            </CardHeader>
            <CardContent className="grid gap-6 sm:grid-cols-2">
              <ColorField
                label="Light mode"
                value={values.destructiveLight}
                onChange={(v) => setField("destructiveLight", v)}
              />
              <ColorField
                label="Dark mode"
                value={values.destructiveDark}
                onChange={(v) => setField("destructiveDark", v)}
              />
            </CardContent>
          </Card>

          {/* Radius + font */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Shape & typography</CardTitle>
            </CardHeader>
            <CardContent className="space-y-5">
              <div className="space-y-2">
                <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                  Corner radius
                </label>
                <div className="flex items-center gap-3">
                  <input
                    type="range"
                    min={0}
                    max={1.5}
                    step={0.0625}
                    value={parseFloat(values.radius)}
                    onChange={(e) =>
                      setField("radius", `${e.target.value}rem`)
                    }
                    className="flex-1 accent-primary"
                  />
                  <Input
                    value={values.radius}
                    onChange={(e) => setField("radius", e.target.value)}
                    className="w-24 font-mono text-xs"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                  Font family
                </label>
                <Select
                  value={values.fontFamily ?? "inter"}
                  onValueChange={(v) => setField("fontFamily", v)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {FONT_OPTIONS.map((f) => (
                      <SelectItem key={f.value} value={f.value}>
                        {f.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Danger zone — reset to defaults */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Reset</CardTitle>
              <p className="text-xs text-muted-foreground">
                Discard all customizations and go back to platform defaults.
              </p>
            </CardHeader>
            <CardContent>
              <Button
                type="button"
                variant="outline"
                onClick={handleReset}
                disabled={resetting}
              >
                {resetting ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <RotateCcw className="mr-2 h-4 w-4" />
                )}
                Reset to defaults
              </Button>
            </CardContent>
          </Card>
      </div>

      {/* Sticky action bar — sticky (not fixed) so it lives inside <main>
          and never overlaps the sidebar. Negative horizontal margins make
          it visually span edge-to-edge of the main content area, undoing
          the page padding. */}
      <div className="sticky bottom-0 z-30 -mx-4 md:-mx-6 border-t bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/70">
        <div className="flex items-center justify-between gap-3 px-4 md:px-6 py-3">
          <div className="text-xs text-muted-foreground">
            {validationError ? (
              <span className="text-destructive">{validationError}</span>
            ) : isDirty ? (
              "You have unsaved changes"
            ) : (
              "All changes saved"
            )}
          </div>
          <div className="flex items-center gap-2">
            <Button
              type="button"
              variant="ghost"
              onClick={revertLocal}
              disabled={!isDirty || saving}
            >
              Discard
            </Button>
            <Button
              type="button"
              onClick={handleSave}
              disabled={!isDirty || !!validationError || saving}
            >
              {saving ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Save className="mr-2 h-4 w-4" />
              )}
              Save changes
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function sameTheme(a: AdminTheme, b: AdminTheme): boolean {
  const keys: (keyof AdminTheme)[] = [
    "primaryLight",
    "primaryDark",
    "accentLight",
    "accentDark",
    "sidebarLight",
    "sidebarDark",
    "destructiveLight",
    "destructiveDark",
    "radius",
    "fontFamily",
  ];
  return keys.every((k) => (a[k] ?? "") === (b[k] ?? ""));
}

const COLOR_FIELDS: (keyof AdminTheme)[] = [
  "primaryLight",
  "primaryDark",
  "accentLight",
  "accentDark",
  "sidebarLight",
  "sidebarDark",
  "destructiveLight",
  "destructiveDark",
];

function validate(values: AdminTheme): string | null {
  for (const k of COLOR_FIELDS) {
    const v = values[k] as string;
    if (!parseOklch(v)) return `${k} is not a valid OKLCH color`;
  }
  if (!/^[\d.]+(rem|px)$/i.test(values.radius)) {
    return 'radius must be a CSS length like "0.625rem"';
  }
  return null;
}

