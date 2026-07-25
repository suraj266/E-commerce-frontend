"use client";

/**
 * /newsletter/confirm — newsletter double opt-in confirmation.
 *
 * The "confirm your subscription" email links here with a `?token=`. On mount
 * we call the public `confirmNewsletter` mutation (PENDING -> ACTIVE) and show
 * the outcome:
 *   - success  → subscription activated
 *   - expired  → token invalid / already used / expired (mutation returned false)
 *   - error    → network / server failure (mutation threw)
 *   - missing  → no token in the URL
 *
 * `useSearchParams` is client-only and must sit under a <Suspense> boundary in
 * this Next version (see the /verify-email page for the same pattern).
 */

import { Suspense, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useMutation } from "@apollo/client/react";
import { CheckCircle2, Loader2, MailX, XCircle } from "lucide-react";

import { CONFIRM_NEWSLETTER } from "@/lib/graphql/newsletter";
import { Button } from "@/components/ui/button";

type ConfirmNewsletterData = { confirmNewsletter: boolean };
type Status = "confirming" | "success" | "expired" | "error" | "missing";

export default function NewsletterConfirmPage() {
  return (
    <Suspense
      fallback={
        <ConfirmShell>
          <PendingBlock />
        </ConfirmShell>
      }
    >
      <NewsletterConfirmInner />
    </Suspense>
  );
}

function NewsletterConfirmInner() {
  const params = useSearchParams();
  const token = params.get("token");

  const [status, setStatus] = useState<Status>(
    token ? "confirming" : "missing",
  );
  const [message, setMessage] = useState<string | null>(null);
  const [confirm] = useMutation<ConfirmNewsletterData>(CONFIRM_NEWSLETTER);

  // Guard against React's double-invoked effects (dev / strict mode) firing
  // the one-shot confirmation mutation twice.
  const ran = useRef(false);

  useEffect(() => {
    if (!token) {
      setStatus("missing");
      return;
    }
    if (ran.current) return;
    ran.current = true;

    void (async () => {
      try {
        const res = await confirm({ variables: { token } });
        setStatus(res.data?.confirmNewsletter ? "success" : "expired");
      } catch (err) {
        setStatus("error");
        setMessage(
          err instanceof Error
            ? err.message
            : "Something went wrong while confirming your subscription.",
        );
      }
    })();
  }, [token, confirm]);

  return (
    <ConfirmShell>
      {status === "confirming" && <PendingBlock />}
      {status === "success" && <SuccessBlock />}
      {status === "expired" && <ExpiredBlock />}
      {status === "missing" && <MissingBlock />}
      {status === "error" && <ErrorBlock message={message} />}
    </ConfirmShell>
  );
}

/* -------------------------------------------------------------------------- */

function ConfirmShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="mx-auto flex min-h-[60vh] w-full max-w-md flex-col items-center justify-center px-4 py-16">
      <div className="w-full rounded-xl bg-card p-8 text-center ring-1 ring-foreground/10">
        {children}
      </div>
    </div>
  );
}

function PendingBlock() {
  return (
    <div className="space-y-4">
      <Loader2 className="mx-auto h-10 w-10 animate-spin text-brand" />
      <div>
        <h1 className="font-heading text-xl font-semibold">
          Confirming your subscription
        </h1>
        <p className="mt-1.5 text-sm text-muted-foreground">
          Hang tight while we activate your newsletter subscription.
        </p>
      </div>
    </div>
  );
}

function SuccessBlock() {
  return (
    <div className="space-y-5">
      <CheckCircle2 className="mx-auto h-12 w-12 text-cta" />
      <div>
        <h1 className="font-heading text-xl font-semibold">
          You&apos;re subscribed!
        </h1>
        <p className="mt-1.5 text-sm text-muted-foreground">
          Your email is confirmed. You&apos;ll now receive our latest drops,
          offers, and stories.
        </p>
      </div>
      <Button asChild variant="brand" size="xl" className="w-full">
        <Link href="/shop">Start shopping</Link>
      </Button>
    </div>
  );
}

function ExpiredBlock() {
  return (
    <div className="space-y-5">
      <MailX className="mx-auto h-12 w-12 text-feature" />
      <div>
        <h1 className="font-heading text-xl font-semibold">
          This link has expired
        </h1>
        <p className="mt-1.5 text-sm text-muted-foreground">
          This confirmation link is invalid or has already been used. Head back
          to the store and subscribe again to get a fresh link.
        </p>
      </div>
      <Button asChild variant="outline" size="xl" className="w-full">
        <Link href="/">Back to store</Link>
      </Button>
    </div>
  );
}

function MissingBlock() {
  return (
    <div className="space-y-5">
      <XCircle className="mx-auto h-12 w-12 text-muted-foreground" />
      <div>
        <h1 className="font-heading text-xl font-semibold">
          Nothing to confirm
        </h1>
        <p className="mt-1.5 text-sm text-muted-foreground">
          This page needs a confirmation link from your email. Open the
          &ldquo;confirm your subscription&rdquo; email and tap the button
          inside.
        </p>
      </div>
      <Button asChild variant="outline" size="xl" className="w-full">
        <Link href="/">Back to store</Link>
      </Button>
    </div>
  );
}

function ErrorBlock({ message }: { message: string | null }) {
  return (
    <div className="space-y-5">
      <XCircle className="mx-auto h-12 w-12 text-sale" />
      <div>
        <h1 className="font-heading text-xl font-semibold">
          Couldn&apos;t confirm your subscription
        </h1>
        <p className="mt-1.5 text-sm text-muted-foreground">
          {message ??
            "Something went wrong. Please try the link again in a moment."}
        </p>
      </div>
      <Button asChild variant="outline" size="xl" className="w-full">
        <Link href="/">Back to store</Link>
      </Button>
    </div>
  );
}
