/**
 * Seller Login Page — /seller/login
 *
 * After login, lands on /seller/dashboard. Login is blocked by backend if
 * email is unverified — in that case we show a "resend verification" link.
 */

"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@/lib/forms/zod-resolver";
import { Store, MailCheck } from "lucide-react";

import { authApi } from "@/lib/api/auth.api";
import { useAuthStore } from "@/store/auth.store";
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

const sellerLoginSchema = z.object({
  email: z.string().email("Please enter a valid email."),
  password: z.string().min(8, "Password must be at least 8 characters."),
});

export default function SellerLoginPage() {
  const router = useRouter();
  const setAuth = useAuthStore((s) => s.setAuth);
  const [serverError, setServerError] = useState<string | null>(null);
  const [unverifiedEmail, setUnverifiedEmail] = useState<string | null>(null);
  const [resendInfo, setResendInfo] = useState<string | null>(null);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const form = useForm<z.infer<typeof sellerLoginSchema>>({
    resolver: zodResolver(sellerLoginSchema),
    defaultValues: { email: "", password: "" },
  });

  async function onSubmit(values: z.infer<typeof sellerLoginSchema>) {
    setServerError(null);
    setUnverifiedEmail(null);
    setResendInfo(null);
    try {
      // Seller-only login surface. Backend rejects non-seller credentials
      // with a generic "Invalid credentials" error so role can't be
      // enumerated — customers / admins have their own login pages.
      const response = await authApi.login({
        email: values.email,
        password: values.password,
        accountType: "seller",
      });

      setAuth(response.accessToken, response.user);
      router.push("/seller/dashboard");
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Login failed";
      // Backend throws ForbiddenException with "Please verify your email..."
      if (/verify your email/i.test(msg)) {
        setUnverifiedEmail(values.email);
      } else {
        setServerError(msg);
      }
    }
  }

  async function handleResend() {
    if (!unverifiedEmail) return;
    try {
      const response = await authApi.resendVerification(unverifiedEmail);
      setResendInfo(response.verificationUrl ?? response.message);
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Resend failed";
      setServerError(msg);
    }
  }

  return (
    <Card className="shadow-lg">
      <CardHeader className="space-y-3 text-center">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
          <Store className="h-6 w-6 text-primary" />
        </div>
        <div className="space-y-1">
          <CardTitle className="text-2xl font-bold tracking-tight">
            Seller Portal
          </CardTitle>
          <CardDescription>
            Sign in to manage your store, products, orders, and payouts.
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
                    <Input placeholder="you@business.com" {...field} />
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
                    <Input type="password" placeholder="••••••••" {...field} />
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

            {unverifiedEmail && (
              <div className="p-3 rounded-md border border-yellow-300 bg-yellow-50 text-sm space-y-2">
                <div className="flex items-center gap-2 font-semibold text-yellow-900">
                  <MailCheck className="h-4 w-4" />
                  Email not verified
                </div>
                <p className="text-yellow-800">
                  Verify your email before logging in.
                </p>
                <Button
                  type="button"
                  size="sm"
                  variant="outline"
                  onClick={handleResend}
                >
                  Resend verification link
                </Button>
                {resendInfo && (
                  <div className="mt-2 text-xs">
                    {resendInfo.startsWith("http") ? (
                      <Link
                        href={resendInfo.replace(/^https?:\/\/[^/]+/, "")}
                        className="text-primary underline break-all"
                      >
                        {resendInfo}
                      </Link>
                    ) : (
                      <span className="text-yellow-900">{resendInfo}</span>
                    )}
                  </div>
                )}
              </div>
            )}

            <Button
              type="submit"
              className="w-full"
              disabled={form.formState.isSubmitting}
            >
              {form.formState.isSubmitting
                ? "Signing in..."
                : "Sign in to Seller Portal"}
            </Button>

            <div className="text-sm text-center text-muted-foreground">
              New seller?{" "}
              <Link
                href="/seller/register"
                className="text-primary hover:underline"
              >
                Create an account
              </Link>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
