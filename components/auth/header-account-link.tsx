"use client";

import Link from "next/link";
import { User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuthStore } from "@/store/auth.store";

/**
 * Account icon in the header. Routes to:
 *   - /account  when the customer is logged in (the layout redirects to
 *     /account/profile)
 *   - /login    when anonymous, with `?next=/account/profile` so they
 *     land back in their account after authenticating
 */
export function HeaderAccountLink() {
  // `user` is persisted; `accessToken` lives in memory only and flips to
  // null between page reload and boot rehydration. Using user here avoids
  // a "Sign in" flash on every reload.
  const user = useAuthStore((s) => s.user);
  const isAuthed = !!user;
  const href = isAuthed ? "/account" : "/login?next=/account/profile";
  return (
    <Button variant="ghost" size="icon" aria-label="Account" asChild>
      <Link href={href}>
        <User className="h-5 w-5" />
      </Link>
    </Button>
  );
}
