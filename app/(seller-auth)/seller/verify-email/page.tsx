/**
 * Email Verification Page — /seller/verify-email?token=...
 *
 * Reads the token from the query string and calls the verify endpoint.
 * On success, prompts the user to log in.
 */

"use client";

import { Suspense, useEffect, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Loader2, CheckCircle2, XCircle } from "lucide-react";

import { authApi } from "@/lib/api/auth.api";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";

export default function VerifyEmailPage() {
  return (
    <Suspense fallback={null}>
      <VerifyEmailPageInner />
    </Suspense>
  );
}

function VerifyEmailPageInner() {
  const search = useSearchParams();
  const token = search.get("token");

  const [state, setState] = useState<
    | { kind: "loading" }
    | { kind: "success"; email: string }
    | { kind: "error"; message: string }
  >({ kind: "loading" });

  useEffect(() => {
    if (!token) {
      setState({ kind: "error", message: "Missing verification token in URL." });
      return;
    }
    let cancelled = false;
    authApi
      .verifyEmail(token)
      .then((res) => {
        if (!cancelled) setState({ kind: "success", email: res.email });
      })
      .catch((err) => {
        if (!cancelled) {
          const msg = err instanceof Error ? err.message : "Verification failed";
          setState({ kind: "error", message: msg });
        }
      });
    return () => {
      cancelled = true;
    };
  }, [token]);

  return (
    <Card className="shadow-lg">
      <CardHeader className="text-center space-y-3">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
          {state.kind === "loading" && (
            <Loader2 className="h-6 w-6 text-primary animate-spin" />
          )}
          {state.kind === "success" && (
            <CheckCircle2 className="h-6 w-6 text-primary" />
          )}
          {state.kind === "error" && (
            <XCircle className="h-6 w-6 text-destructive" />
          )}
        </div>
        <CardTitle className="text-2xl">
          {state.kind === "loading" && "Verifying..."}
          {state.kind === "success" && "Email Verified"}
          {state.kind === "error" && "Verification Failed"}
        </CardTitle>
        <CardDescription>
          {state.kind === "loading" && "Please wait while we confirm your email."}
          {state.kind === "success" && (
            <>
              <span className="font-semibold text-foreground">{state.email}</span>{" "}
              is now active. You can sign in to your seller portal.
            </>
          )}
          {state.kind === "error" && state.message}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        {state.kind === "success" && (
          <Button asChild className="w-full">
            <Link href="/seller/login">Sign in</Link>
          </Button>
        )}
        {state.kind === "error" && (
          <Button asChild variant="outline" className="w-full">
            <Link href="/seller/register">Back to registration</Link>
          </Button>
        )}
      </CardContent>
    </Card>
  );
}
