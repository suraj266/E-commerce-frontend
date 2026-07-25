"use client";

/**
 * /newsletter/unsubscribe — one-click unsubscribe from a broadcast email (P3
 * Wave 4).
 *
 * Every broadcast email's unsubscribe link points here with a `?token=`. On
 * mount we call the public `unsubscribeFromNewsletter` mutation (flips the
 * subscription to UNSUBSCRIBED) and show the outcome. The mutation is idempotent
 * — a re-clicked link still reports success.
 *
 * `useSearchParams` is client-only and must sit under a <Suspense> boundary in
 * this Next version (same pattern as /newsletter/confirm).
 */

import { Suspense, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { gql } from "@apollo/client";
import { useMutation } from "@apollo/client/react";
import { CheckCircle2, Loader2, XCircle } from "lucide-react";

import { Button } from "@/components/ui/button";

const UNSUBSCRIBE_FROM_NEWSLETTER = gql`
  mutation UnsubscribeFromNewsletter($token: String!) {
    unsubscribeFromNewsletter(token: $token)
  }
`;

type UnsubscribeData = { unsubscribeFromNewsletter: boolean };
type Status = "working" | "success" | "invalid" | "error" | "missing";

export default function NewsletterUnsubscribePage() {
  return (
    <Suspense
      fallback={
        <Shell>
          <PendingBlock />
        </Shell>
      }
    >
      <UnsubscribeInner />
    </Suspense>
  );
}

function UnsubscribeInner() {
  const params = useSearchParams();
  const token = params.get("token");

  const [status, setStatus] = useState<Status>(token ? "working" : "missing");
  const [message, setMessage] = useState<string | null>(null);
  const [unsubscribe] = useMutation<UnsubscribeData>(
    UNSUBSCRIBE_FROM_NEWSLETTER,
  );

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
        const res = await unsubscribe({ variables: { token } });
        setStatus(res.data?.unsubscribeFromNewsletter ? "success" : "invalid");
      } catch (err) {
        setStatus("error");
        setMessage(
          err instanceof Error
            ? err.message
            : "Something went wrong while unsubscribing you.",
        );
      }
    })();
  }, [token, unsubscribe]);

  return (
    <Shell>
      {status === "working" && <PendingBlock />}
      {status === "success" && <SuccessBlock />}
      {status === "invalid" && <InvalidBlock />}
      {status === "missing" && <InvalidBlock />}
      {status === "error" && <ErrorBlock message={message} />}
    </Shell>
  );
}

/* -------------------------------------------------------------------------- */

function Shell({ children }: { children: React.ReactNode }) {
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
        <h1 className="font-heading text-xl font-semibold">Unsubscribing you</h1>
        <p className="mt-1.5 text-sm text-muted-foreground">
          One moment while we update your preferences.
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
          You&apos;ve been unsubscribed
        </h1>
        <p className="mt-1.5 text-sm text-muted-foreground">
          You won&apos;t receive any more marketing emails from us. You can
          re-subscribe any time from the store.
        </p>
      </div>
      <Button asChild variant="outline" size="xl" className="w-full">
        <Link href="/">Back to store</Link>
      </Button>
    </div>
  );
}

function InvalidBlock() {
  return (
    <div className="space-y-5">
      <XCircle className="mx-auto h-12 w-12 text-muted-foreground" />
      <div>
        <h1 className="font-heading text-xl font-semibold">
          This link isn&apos;t valid
        </h1>
        <p className="mt-1.5 text-sm text-muted-foreground">
          This unsubscribe link is missing or invalid. If you keep receiving
          emails you don&apos;t want, contact support and we&apos;ll sort it out.
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
          Couldn&apos;t unsubscribe you
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
