/**
 * =============================================================================
 * Admin Login Page
 * =============================================================================
 * 
 * Dedicated login page for Platform Administrators.
 * Route: /admin/login
 * 
 * WHY SEPARATE FROM CUSTOMER LOGIN?
 * - Each user type (Admin, Seller, Customer) has its own login page
 * - In the future, each will connect to separate database tables
 * - Keeps the UI, branding, and error handling specific to each role
 * - Prevents confusion (admin sees "Admin Portal", customer sees "Shop Login")
 * 
 * ROUTE GROUP:
 * This page lives inside `(admin-auth)` route group which does NOT have
 * the AuthProxy guard, because unauthenticated admins need to see this page.
 * Instead, it has a ReverseAuthProxy which redirects already-logged-in
 * admins to /admin/dashboard.
 * =============================================================================
 */

"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { authApi } from "@/lib/api/auth.api";
import { useAuthStore } from "@/store/auth.store";
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

  // React Hook Form with Zod validation
  // NOTE: zodResolver type mismatch with Zod v4 - using explicit cast
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const form = useForm<z.infer<typeof adminLoginSchema>>({
    resolver: zodResolver(adminLoginSchema as any) as any,
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

      // Store auth state in Zustand (memory-only, not localStorage)
      setAuth(response.accessToken, response.user);

      // Navigate to admin dashboard
      router.push("/admin/dashboard");
    } catch (error: any) {
      setServerError(error.message || "Invalid credentials. Please try again.");
    }
  }

  // ---------------------------------------------------------------------------
  // Render
  // ---------------------------------------------------------------------------

  return (
    <Card className="shadow-lg border-zinc-200 dark:border-zinc-800">
      <CardHeader className="space-y-3 text-center">
        {/* Admin Badge */}
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
          <Shield className="h-6 w-6 text-primary" />
        </div>
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
            {/* Email Field */}
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

            {/* Password Field */}
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

            {/* Server Error Message */}
            {serverError && (
              <div className="p-3 rounded-md bg-red-50 text-red-600 text-sm font-medium">
                {serverError}
              </div>
            )}

            {/* Submit Button */}
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
