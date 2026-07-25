import Link from "next/link";
import { ShieldAlert } from "lucide-react";
import { Button } from "@/components/ui/button";

/**
 * NoAccess — the "you don't have permission" panel rendered by the server-side
 * <PermissionGate> when the caller lacks a route's required permission. Plain
 * (server-renderable) component; the message stays deliberately generic.
 */
export function NoAccess({
  required,
}: {
  /** The slugs one of which the page needs — surfaced to help an admin. */
  required?: readonly string[];
}) {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4 text-center">
      <div className="flex h-16 w-16 items-center justify-center rounded-full bg-destructive/10">
        <ShieldAlert className="h-8 w-8 text-destructive" />
      </div>
      <div className="space-y-1">
        <h1 className="text-xl font-semibold tracking-tight">
          You don&apos;t have access to this page
        </h1>
        <p className="max-w-md text-sm text-muted-foreground">
          Your role is missing the permission needed to view this section. Ask a
          super-admin to grant it from Roles &amp; Permissions.
        </p>
        {required && required.length > 0 && (
          <p className="pt-1 text-xs text-muted-foreground">
            Requires one of:{" "}
            <span className="font-mono">{required.join(", ")}</span>
          </p>
        )}
      </div>
      <Button asChild variant="outline">
        <Link href="/admin/dashboard">Back to dashboard</Link>
      </Button>
    </div>
  );
}
