"use client";

/**
 * Admin Settings hub — /admin/settings
 *
 * Landing page for all admin/store settings. These sections used to live as a
 * "Settings" group in the main sidebar; they were moved here to declutter the
 * nav and are now reached from the profile-dropdown "Settings" item. The section
 * list is the shared `settingsSections` config so the hub, the command palette
 * and any future sub-nav never drift apart.
 */

import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useSetPageTitle } from "@/components/shell/page-title-context";
import { settingsSections } from "@/config/admin.nav";

export default function AdminSettingsPage() {
  useSetPageTitle("Settings");

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Settings</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Configure your store and the admin panel. Pick a section to get
          started.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {settingsSections.map((section) => {
          const Icon = section.icon;
          return (
            <Link
              key={section.href}
              href={section.href}
              className="group rounded-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              <Card className="h-full transition hover:border-primary/40 hover:shadow-sm">
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                      <Icon className="h-5 w-5" />
                    </span>
                    <CardTitle className="flex flex-1 items-center justify-between text-base">
                      {section.title}
                      <ArrowRight className="h-4 w-4 text-muted-foreground opacity-0 transition group-hover:translate-x-0.5 group-hover:opacity-100" />
                    </CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    {section.description}
                  </p>
                </CardContent>
              </Card>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
