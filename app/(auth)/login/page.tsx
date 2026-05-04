"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { authApi } from "@/lib/api/auth.api";
import { useAuthStore } from "@/store/auth.store";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";

// 1. Zod Validation Schema
const loginSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email." }),
  password: z.string().min(6, { message: "Password must be at least 6 characters." }),
});

export default function LoginPage() {
  const router = useRouter();
  const setAuth = useAuthStore((state) => state.setAuth);
  const [serverError, setServerError] = useState<string | null>(null);

  // 2. React Hook Form instantiation
  // NOTE: zodResolver type mismatch with Zod v4 - using explicit cast
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const form = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema as any) as any,
    defaultValues: {
      email: "",
      password: "",
    },
  });

  // 3. Form Submit Handler
  async function onSubmit(values: z.infer<typeof loginSchema>) {
    setServerError(null);
    try {
      const response = await authApi.login({ email: values.email, password: values.password });
      console.log("response");
      console.log(response);

      // Zustand Memory Store me token & user set kiya
      setAuth(response.accessToken, response.user);
      // Role based routing (Object ko access kiya `.name` lagakar)
      const roleName = response.user.role?.name;

      if (roleName === 'superAdmin' || roleName === 'admin') {
        router.push('/admin/dashboard');
      } else if (roleName === 'seller') {
        router.push('/seller/dashboard');
      } else {
        router.push('/account'); // Normal customer
      }

    } catch (error: any) {
      setServerError(error.message || "Failed to login");
    }
  }

  return (
    <Card className="shadow-lg border-zinc-200 dark:border-zinc-800">
      <CardHeader className="space-y-1 text-center">
        <CardTitle className="text-2xl font-bold tracking-tight">Welcome back</CardTitle>
        <CardDescription className="text-zinc-500">
          Enter your email to sign in to your account
        </CardDescription>
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
                    <Input placeholder="admin@ecommerce.com" {...field} />
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

            <Button
              type="submit"
              className="w-full"
              disabled={form.formState.isSubmitting}
            >
              {form.formState.isSubmitting ? "Signing in..." : "Sign in"}
            </Button>
          </form>
        </Form>
      </CardContent>

      <CardFooter className="flex flex-wrap items-center justify-between gap-2 text-sm text-zinc-500">
        <a href="#" className="hover:text-primary underline underline-offset-4">Forgot password?</a>
        <div className="text-right">
          Don't have an account? <span className="text-zinc-400 cursor-not-allowed">Contact support</span>
        </div>
      </CardFooter>
    </Card>
  );
}
