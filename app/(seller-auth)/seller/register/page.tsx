/**
 * Seller Registration Page — /seller/register
 *
 * Step 0 of the onboarding flow: create User account with seller role.
 * After successful registration, the seller must verify their email before
 * they can log in. In dev mode, the API returns the verification URL so we
 * show a click-through link directly on this page.
 */

"use client";

import { useState } from "react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@/lib/forms/zod-resolver";
import { Store, CheckCircle2 } from "lucide-react";

import { authApi } from "@/lib/api/auth.api";
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

const PHONE_REGEX = /^(\+?91)?[6-9][0-9]{9}$/;

const registerSchema = z
  .object({
    name: z.string().min(2, "Name must be at least 2 characters"),
    email: z.string().email("Invalid email"),
    phone: z
      .string()
      .regex(PHONE_REGEX, "Enter a valid India phone (10 digits, optional +91)"),
    password: z.string().min(8, "Password must be at least 8 characters"),
    confirmPassword: z.string(),
  })
  .refine((d) => d.password === d.confirmPassword, {
    path: ["confirmPassword"],
    message: "Passwords do not match",
  });

type RegisterValues = z.infer<typeof registerSchema>;

export default function SellerRegisterPage() {
  const [serverError, setServerError] = useState<string | null>(null);
  const [success, setSuccess] = useState<{
    email: string;
    verificationUrl?: string;
  } | null>(null);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const form = useForm<RegisterValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      password: "",
      confirmPassword: "",
    },
  });

  async function onSubmit(values: RegisterValues) {
    setServerError(null);
    try {
      const response = await authApi.registerSeller({
        name: values.name,
        email: values.email,
        phone: values.phone,
        password: values.password,
      });
      setSuccess({
        email: values.email,
        verificationUrl: response.verificationUrl,
      });
    } catch (err) {
      const msg =
        err instanceof Error ? err.message : "Registration failed";
      setServerError(msg);
    }
  }

  if (success) {
    return (
      <Card className="shadow-lg">
        <CardHeader className="text-center space-y-3">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
            <CheckCircle2 className="h-6 w-6 text-primary" />
          </div>
          <CardTitle className="text-2xl">Check your email</CardTitle>
          <CardDescription>
            We&apos;ve sent a verification link to{" "}
            <span className="font-semibold text-foreground">
              {success.email}
            </span>
            . Click the link to activate your seller account.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          {success.verificationUrl && (
            <div className="rounded-md border border-yellow-300 bg-yellow-50 p-3 text-xs">
              <div className="font-semibold text-yellow-900 mb-1">
                Dev mode — direct verification link:
              </div>
              <Link
                href={success.verificationUrl.replace(
                  /^https?:\/\/[^/]+/,
                  "",
                )}
                className="text-primary underline break-all"
              >
                {success.verificationUrl}
              </Link>
            </div>
          )}
          <Link
            href="/seller/login"
            className="text-sm text-primary hover:underline block text-center"
          >
            Back to login
          </Link>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="shadow-lg">
      <CardHeader className="space-y-3 text-center">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
          <Store className="h-6 w-6 text-primary" />
        </div>
        <div className="space-y-1">
          <CardTitle className="text-2xl font-bold tracking-tight">
            Become a Seller
          </CardTitle>
          <CardDescription>
            Create your seller account. Email verification is required before
            login.
          </CardDescription>
        </div>
      </CardHeader>

      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Full Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Suraj Ojha" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input
                      type="email"
                      placeholder="you@business.com"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="phone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Phone</FormLabel>
                  <FormControl>
                    <Input placeholder="9876543210" {...field} />
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

            <FormField
              control={form.control}
              name="confirmPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Confirm Password</FormLabel>
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

            <Button
              type="submit"
              className="w-full"
              disabled={form.formState.isSubmitting}
            >
              {form.formState.isSubmitting
                ? "Creating account..."
                : "Create Seller Account"}
            </Button>

            <div className="text-sm text-center text-muted-foreground">
              Already have an account?{" "}
              <Link
                href="/seller/login"
                className="text-primary hover:underline"
              >
                Sign in
              </Link>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
