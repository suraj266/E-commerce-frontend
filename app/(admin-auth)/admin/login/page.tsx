/**
 * Admin login page. Route: /admin/login
 *
 * Lives inside the `(admin-auth)` route group, which does NOT have the
 * AuthProxy guard — unauthenticated admins need to reach this page. It carries
 * a ReverseAuthProxy instead, redirecting already-logged-in admins to
 * /admin/dashboard.
 */

"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@/lib/forms/zod-resolver";
import { authApi } from "@/lib/api/auth.api";
import { useAuthStore } from "@/store/auth.store";
import { useSiteSettings } from "@/lib/context/site-settings-context";
import { SmartImage } from "@/components/media/smart-image";
import { Shield } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

// ---------------------------------------------------------------------------
// Validation Schema
// ---------------------------------------------------------------------------

const adminLoginSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email." }),
  password: z
    .string()
    .min(6, { message: "Password must be at least 6 characters." }),
});

// ===========================================================================
// Component: AdminLoginPage
// ===========================================================================

export default function AdminLoginPage() {
  const router = useRouter();
  const setAuth = useAuthStore((state) => state.setAuth);
  const [serverError, setServerError] = useState<string | null>(null);

  // NOTE: zodResolver type mismatch with Zod v4 - using explicit cast
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const form = useForm<z.infer<typeof adminLoginSchema>>({
    resolver: zodResolver(adminLoginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  // ---------------------------------------------------------------------------
  // Form Submit Handler
  // ---------------------------------------------------------------------------

  async function onSubmit(values: z.infer<typeof adminLoginSchema>) {
    setServerError(null);
    try {
      // Admin-only login surface. Backend rejects non-admin credentials
      // (customer / seller) with a generic "Invalid credentials" error so
      // the admin portal can't be probed for role-bound accounts.
      const response = await authApi.login({
        email: values.email,
        password: values.password,
        accountType: "admin",
      });

      setAuth(response.accessToken, response.user);
      router.push("/admin/dashboard");
    } catch (error: any) {
      setServerError(error.message || "Invalid credentials. Please try again.");
    }
  }

  // ---------------------------------------------------------------------------
  // Render
  // ---------------------------------------------------------------------------

  const { logoUrl, brandName, logoHeight } = useSiteSettings();

  return (
    <Card className="shadow-lg border-zinc-200 dark:border-zinc-800">
      <CardHeader className="space-y-3 text-center">
        {/* Brand logo, falling back to the admin shield badge */}
        {logoUrl ? (
          <SmartImage
            src={logoUrl}
            alt={brandName}
            purpose="LOGO"
            height={logoHeight}
            className="mx-auto w-auto object-contain"
            style={{ height: logoHeight, width: "auto" }}
          />
        ) : (
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
            <Shield className="h-6 w-6 text-primary" />
          </div>
        )}
        <div className="space-y-1">
          <CardTitle className="text-2xl font-bold tracking-tight">
            Admin Portal
          </CardTitle>
          <CardDescription className="text-zinc-500">
            Sign in to access the platform administration panel
          </CardDescription>
        </div>
      </CardHeader>

      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input placeholder="admin@example.com" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input
                      type="password"
                      placeholder="••••••••"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {serverError && (
              <div className="p-3 rounded-md bg-red-50 text-red-600 text-sm font-medium">
                {serverError}
              </div>
            )}

            <Button
              type="submit"
              className="w-full"
              disabled={form.formState.isSubmitting}
            >
              {form.formState.isSubmitting
                ? "Authenticating..."
                : "Sign in to Admin"}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
