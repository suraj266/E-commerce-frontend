/**
 * =============================================================================
 * Admin Branding Settings — /admin/settings/branding
 * =============================================================================
 *
 * Manages the global platform brand identity (logo + name) stored as
 * SiteSetting rows (`platform_logo_url`, `platform_name`, GENERAL group).
 *
 * The logo is uploaded via the shared ImageUploader (presign → upload →
 * confirm); on success we persist the resulting canonical URL into the
 * `platform_logo_url` setting. This same value is consumed by the storefront
 * header, admin sidebar/login, every transactional email, and invoice PDFs.
 *
 * NOTE: the logo URL must be absolute + publicly reachable for emails to
 * render it (email clients cannot load localhost or data URIs).
 * =============================================================================
 */

"use client";

import { useState, useEffect, useCallback } from "react";
import { useQuery, useMutation } from "@apollo/client/react";
import { ImagePlus, Save, Loader2, Check } from "lucide-react";
import { toast } from "sonner";

import { GET_SITE_SETTINGS, UPDATE_SITE_SETTING } from "@/lib/graphql/settings";
import { ImageUploader } from "@/components/media/image-uploader";
import { SmartImage } from "@/components/media/smart-image";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useSetPageTitle } from "@/components/shell/page-title-context";

const LOGO_KEY = "platform_logo_url";
const NAME_KEY = "platform_name";
const HEIGHT_KEY = "platform_logo_height";
const DEFAULT_BRAND_NAME = "Ecommerce";
const DEFAULT_LOGO_HEIGHT = 32;
const MIN_LOGO_HEIGHT = 16;
const MAX_LOGO_HEIGHT = 96;

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

export default function BrandingSettingsPage() {
  useSetPageTitle("Branding");

  const { data, loading, refetch } = useQuery<{ siteSettings: SiteSetting[] }>(
    GET_SITE_SETTINGS,
    {
      variables: { group: "GENERAL" },
      fetchPolicy: "cache-and-network",
    },
  );

  const [updateSetting] = useMutation(UPDATE_SITE_SETTING);

  const settings = data?.siteSettings ?? [];
  const logoSetting = settings.find((s) => s.key === LOGO_KEY);
  const nameSetting = settings.find((s) => s.key === NAME_KEY);
  const heightSetting = settings.find((s) => s.key === HEIGHT_KEY);

  const logoUrl = logoSetting?.value?.trim() || "";
  const brandName = nameSetting?.value?.trim() || DEFAULT_BRAND_NAME;

  // Local editable copies (logo image saves immediately on upload).
  const [localName, setLocalName] = useState<string>("");
  const [localHeight, setLocalHeight] = useState<number>(DEFAULT_LOGO_HEIGHT);
  const [savingKey, setSavingKey] = useState<string | null>(null);
  const [savedKey, setSavedKey] = useState<string | null>(null);

  useEffect(() => {
    if (nameSetting) setLocalName(nameSetting.value);
  }, [nameSetting]);

  useEffect(() => {
    if (heightSetting) {
      const n = Number(heightSetting.value);
      setLocalHeight(Number.isFinite(n) ? n : DEFAULT_LOGO_HEIGHT);
    }
  }, [heightSetting]);

  // Clamp the preview height so the slider/number input can't blow out the box.
  const previewHeight = Math.min(
    MAX_LOGO_HEIGHT,
    Math.max(MIN_LOGO_HEIGHT, localHeight || DEFAULT_LOGO_HEIGHT),
  );

  const handleSave = useCallback(
    async (key: string, value: string) => {
      setSavingKey(key);
      setSavedKey(null);
      try {
        await updateSetting({ variables: { input: { key, value } } });
        toast.success("Branding updated");
        setSavedKey(key);
        await refetch();
        setTimeout(() => setSavedKey(null), 2000);
      } catch (err: unknown) {
        const message =
          err instanceof Error ? err.message : "Failed to update branding";
        toast.error(message);
      } finally {
        setSavingKey(null);
      }
    },
    [updateSetting, refetch],
  );

  const settingsMissing = !loading && !logoSetting && !nameSetting;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight flex items-center gap-2">
          <ImagePlus className="h-6 w-6 text-primary" />
          Branding
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          Your logo and brand name. Shown in the storefront header, the admin
          panel, every transactional email, and on tax invoices.
        </p>
      </div>

      {loading && (
        <div className="space-y-4">
          {Array.from({ length: 2 }).map((_, i) => (
            <div
              key={i}
              className="h-40 w-full animate-pulse rounded-lg bg-muted"
            />
          ))}
        </div>
      )}

      {settingsMissing && (
        <div className="flex h-40 items-center justify-center rounded-lg border bg-card text-center text-muted-foreground">
          Branding settings not found. Run the settings seed
          (`pnpm seed:settings`) to populate defaults.
        </div>
      )}

      {!loading && !settingsMissing && (
        <div className="space-y-6">
          {/* ---- Logo ---- */}
          <div className="rounded-lg border bg-card shadow-sm p-5 space-y-4">
            <div className="space-y-1">
              <Label className="text-sm font-semibold">Platform Logo</Label>
              <p className="text-xs text-muted-foreground max-w-lg leading-relaxed">
                Upload a logo (JPEG, PNG or WebP, up to 5 MB). A wide wordmark
                works best. Must be a publicly-reachable URL so it renders in
                emails. Leave empty to show the brand name as text.
              </p>
            </div>

            <div className="flex flex-col gap-5 sm:flex-row sm:items-start">
              <ImageUploader
                purpose="LOGO"
                ownerType="GENERIC"
                initialUrl={logoUrl || null}
                onUploaded={(img) => handleSave(LOGO_KEY, img.url)}
                onClear={() => handleSave(LOGO_KEY, "")}
                aspectClass="aspect-[3/1] h-24"
                className="w-full max-w-sm"
              />

              {/* WYSIWYG preview — how it renders in the navbar (object-contain). */}
              <div className="space-y-2">
                <span className="text-xs font-medium text-muted-foreground">
                  Header preview
                </span>
                <div className="flex min-h-[3rem] items-center rounded-md border bg-background px-4 py-2">
                  {logoUrl ? (
                    <SmartImage
                      src={logoUrl}
                      alt={brandName}
                      purpose="LOGO"
                      height={previewHeight}
                      className="w-auto object-contain"
                      style={{ height: previewHeight, width: "auto" }}
                    />
                  ) : (
                    <span className="text-sm text-muted-foreground">
                      No logo set — “{brandName}” text is shown instead.
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* ---- Logo size ---- */}
            {heightSetting && (
              <div className="space-y-2 border-t pt-4">
                <div className="flex items-center justify-between">
                  <Label className="text-sm font-semibold">Logo Size</Label>
                  <span className="text-xs text-muted-foreground">
                    Height in the storefront header, admin panel &amp; login.
                    Width scales automatically.
                  </span>
                </div>
                <div className="flex items-center gap-3 max-w-md">
                  <input
                    type="range"
                    min={MIN_LOGO_HEIGHT}
                    max={MAX_LOGO_HEIGHT}
                    step={1}
                    value={previewHeight}
                    onChange={(e) => setLocalHeight(Number(e.target.value))}
                    className="flex-1 accent-primary"
                    aria-label="Logo height"
                  />
                  <Input
                    type="number"
                    min={MIN_LOGO_HEIGHT}
                    max={MAX_LOGO_HEIGHT}
                    value={localHeight}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                      setLocalHeight(Number(e.target.value))
                    }
                    className="w-20"
                  />
                  <span className="text-xs text-muted-foreground">px</span>
                  <Button
                    size="sm"
                    onClick={() =>
                      handleSave(HEIGHT_KEY, String(previewHeight))
                    }
                    disabled={
                      savingKey === HEIGHT_KEY ||
                      String(previewHeight) === heightSetting.value
                    }
                  >
                    {savingKey === HEIGHT_KEY ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : savedKey === HEIGHT_KEY ? (
                      <Check className="h-4 w-4" />
                    ) : (
                      <Save className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              </div>
            )}
          </div>

          {/* ---- Brand name ---- */}
          {nameSetting && (
            <div className="rounded-lg border bg-card shadow-sm p-5 space-y-3">
              <div className="space-y-1">
                <Label className="text-sm font-semibold">
                  {nameSetting.label}
                </Label>
                {nameSetting.description && (
                  <p className="text-xs text-muted-foreground max-w-lg leading-relaxed">
                    {nameSetting.description}
                  </p>
                )}
              </div>
              <div className="flex items-center gap-2 max-w-md">
                <Input
                  value={localName}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    setLocalName(e.target.value)
                  }
                  placeholder={DEFAULT_BRAND_NAME}
                  className="flex-1"
                />
                <Button
                  size="sm"
                  onClick={() => handleSave(NAME_KEY, localName)}
                  disabled={
                    savingKey === NAME_KEY || localName === nameSetting.value
                  }
                >
                  {savingKey === NAME_KEY ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : savedKey === NAME_KEY ? (
                    <Check className="h-4 w-4" />
                  ) : (
                    <Save className="h-4 w-4" />
                  )}
                </Button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
