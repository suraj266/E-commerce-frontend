/**
 * =============================================================================
 * Admin General Settings — /admin/settings/general
 * =============================================================================
 *
 * Dynamic settings page that renders form controls based on the `valueType`
 * of each SiteSetting row. Fetches settings grouped by "GENERAL" and
 * provides inline save per-setting.
 * =============================================================================
 */

"use client";

import { useState, useEffect, useCallback } from "react";
import { useQuery, useMutation } from "@apollo/client/react";
import { Settings, Save, Loader2, Check } from "lucide-react";
import { toast } from "sonner";

import { GET_SITE_SETTINGS, UPDATE_SITE_SETTING } from "@/lib/graphql/settings";

import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useSetPageTitle } from "@/components/shell/page-title-context";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------
interface SiteSetting {
  id: string;
  key: string;
  value: string;
  group: string;
  label: string;
  description: string | null;
  valueType: "BOOLEAN" | "STRING" | "NUMBER" | "JSON";
  updatedAt: string;
}

// ===========================================================================
export default function GeneralSettingsPage() {
  useSetPageTitle("General Settings");

  // ---- Data ----
  const { data, loading, refetch } = useQuery<{
    siteSettings: SiteSetting[];
  }>(GET_SITE_SETTINGS, {
    variables: { group: "GENERAL" },
    fetchPolicy: "cache-and-network",
  });

  const [updateSetting] = useMutation(UPDATE_SITE_SETTING);

  // Local state for form values — keyed by setting key
  const [localValues, setLocalValues] = useState<Record<string, string>>({});
  const [saving, setSaving] = useState<Record<string, boolean>>({});
  const [saved, setSaved] = useState<Record<string, boolean>>({});

  const settings = data?.siteSettings ?? [];

  // Sync server data → local state
  useEffect(() => {
    if (settings.length > 0) {
      const map: Record<string, string> = {};
      for (const s of settings) {
        map[s.key] = s.value;
      }
      setLocalValues((prev) => {
        const merged = { ...prev };
        for (const s of settings) {
          if (!(s.key in merged)) {
            merged[s.key] = s.value;
          }
        }
        return merged;
      });
    }
  }, [settings]);

  // ---- Save handler ----
  const handleSave = useCallback(
    async (key: string, value: string) => {
      setSaving((p) => ({ ...p, [key]: true }));
      setSaved((p) => ({ ...p, [key]: false }));
      try {
        await updateSetting({ variables: { input: { key, value } } });
        toast.success(`Setting "${key}" updated`);
        setSaved((p) => ({ ...p, [key]: true }));
        refetch();
        setTimeout(() => setSaved((p) => ({ ...p, [key]: false })), 2000);
      } catch (err: unknown) {
        const message =
          err instanceof Error ? err.message : "Failed to update setting";
        toast.error(message);
      } finally {
        setSaving((p) => ({ ...p, [key]: false }));
      }
    },
    [updateSetting, refetch],
  );

  // ---- Toggle handler (BOOLEAN settings auto-save) ----
  const handleToggle = useCallback(
    (key: string, checked: boolean) => {
      const newVal = checked ? "true" : "false";
      setLocalValues((p) => ({ ...p, [key]: newVal }));
      handleSave(key, newVal);
    },
    [handleSave],
  );

  // ---- Render a setting based on its valueType ----
  const renderSettingControl = (setting: SiteSetting) => {
    const currentVal = localValues[setting.key] ?? setting.value;
    const isSaving = saving[setting.key] ?? false;
    const isSaved = saved[setting.key] ?? false;

    switch (setting.valueType) {
      case "BOOLEAN":
        return (
          <div className="flex items-center gap-3">
            <Switch
              checked={currentVal === "true"}
              onCheckedChange={(val: boolean) =>
                handleToggle(setting.key, val)
              }
              disabled={isSaving}
            />
            <span className="text-sm text-muted-foreground">
              {currentVal === "true" ? "Enabled" : "Disabled"}
            </span>
            {isSaving && (
              <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
            )}
            {isSaved && (
              <Check className="h-4 w-4 text-green-500" />
            )}
          </div>
        );

      case "STRING":
      case "NUMBER":
        return (
          <div className="flex items-center gap-2 max-w-md">
            <Input
              type={setting.valueType === "NUMBER" ? "number" : "text"}
              value={currentVal}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setLocalValues((p) => ({ ...p, [setting.key]: e.target.value }))
              }
              className="flex-1"
            />
            <Button
              size="sm"
              onClick={() => handleSave(setting.key, currentVal)}
              disabled={isSaving || currentVal === setting.value}
            >
              {isSaving ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : isSaved ? (
                <Check className="h-4 w-4" />
              ) : (
                <Save className="h-4 w-4" />
              )}
            </Button>
          </div>
        );

      case "JSON":
        return (
          <div className="flex items-center gap-2 max-w-lg">
            <Input
              value={currentVal}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setLocalValues((p) => ({ ...p, [setting.key]: e.target.value }))
              }
              className="flex-1 font-mono text-xs"
            />
            <Button
              size="sm"
              onClick={() => handleSave(setting.key, currentVal)}
              disabled={isSaving || currentVal === setting.value}
            >
              {isSaving ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Save className="h-4 w-4" />
              )}
            </Button>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight flex items-center gap-2">
          <Settings className="h-6 w-6 text-primary" />
          General Settings
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          Configure global storefront preferences.
        </p>
      </div>

      {/* Loading skeleton */}
      {loading && (
        <div className="space-y-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <div
              key={i}
              className="h-20 w-full animate-pulse rounded-lg bg-muted"
            />
          ))}
        </div>
      )}

      {/* Empty state */}
      {!loading && settings.length === 0 && (
        <div className="flex h-40 items-center justify-center rounded-lg border bg-card text-muted-foreground">
          No settings found. Run the settings seed to populate defaults.
        </div>
      )}

      {/* Settings list */}
      {!loading && settings.length > 0 && (
        <div className="rounded-lg border bg-card shadow-sm divide-y">
          {settings.map((setting) => (
            <div
              key={setting.id}
              className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 px-5 py-4"
            >
              {/* Left: label + description */}
              <div className="space-y-1 flex-1">
                <Label className="text-sm font-semibold">{setting.label}</Label>
                {setting.description && (
                  <p className="text-xs text-muted-foreground max-w-md leading-relaxed">
                    {setting.description}
                  </p>
                )}
              </div>

              {/* Right: control */}
              <div className="shrink-0">{renderSettingControl(setting)}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
