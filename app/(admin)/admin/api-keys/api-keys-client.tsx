"use client";

/**
 * API Keys console (Phase 3, Wave 4) — issue / list / revoke programmatic keys.
 *
 * Consumes ApiKeyResolver (apiKeys / createApiKey / revokeApiKey). The create
 * flow surfaces the plaintext secret EXACTLY ONCE in a copy dialog — it is never
 * stored server-side and can never be retrieved again. The list shows only the
 * public prefix, scopes, last-used, expiry, and status.
 */

import { useEffect, useMemo, useState } from "react";
import { useQuery, useMutation } from "@apollo/client/react";
import { toast } from "sonner";
import {
  KeyRound,
  Plus,
  Copy,
  Check,
  Ban,
  Loader2,
  ShieldAlert,
} from "lucide-react";

import {
  GET_API_KEYS,
  CREATE_API_KEY,
  REVOKE_API_KEY,
  type ApiKey,
  type ApiKeysData,
  type CreateApiKeyData,
  type RevokeApiKeyData,
} from "@/lib/graphql/admin-api-keys";
import { dateTime } from "@/lib/utils/admin-format";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useSetPageTitle } from "@/components/shell/page-title-context";
import { TableEmpty, TableSkeleton } from "@/components/ui/data-table";

const COL_COUNT = 6;

type KeyStatus = "active" | "revoked" | "expired";

function statusOf(k: ApiKey): KeyStatus {
  if (k.revokedAt) return "revoked";
  if (k.expiresAt && new Date(k.expiresAt).getTime() <= Date.now())
    return "expired";
  return "active";
}

const STATUS_VARIANT: Record<
  KeyStatus,
  "default" | "secondary" | "destructive" | "outline"
> = {
  active: "default",
  revoked: "destructive",
  expired: "outline",
};

const STATUS_LABEL: Record<KeyStatus, string> = {
  active: "Active",
  revoked: "Revoked",
  expired: "Expired",
};

export default function ApiKeysClient() {
  useSetPageTitle("API Keys");

  const [createOpen, setCreateOpen] = useState(false);
  const [revoking, setRevoking] = useState<ApiKey | null>(null);
  // The plaintext secret, held only in memory until the user dismisses it.
  const [minted, setMinted] = useState<{ secret: string; name: string } | null>(
    null,
  );

  const { data, loading, error, refetch } =
    useQuery<ApiKeysData>(GET_API_KEYS, {
      variables: { ownerUserId: null },
      fetchPolicy: "cache-and-network",
    });

  useEffect(() => {
    if (error) toast.error(`Failed to load API keys: ${error.message}`);
  }, [error]);

  const [revokeApiKey, { loading: revokeLoading }] =
    useMutation<RevokeApiKeyData>(REVOKE_API_KEY, {
      onCompleted: () => {
        toast.success("API key revoked");
        setRevoking(null);
        void refetch();
      },
      onError: (e) => toast.error(`Revoke failed: ${e.message}`),
    });

  const keys = data?.apiKeys ?? [];

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex flex-col gap-1">
          <h1 className="text-2xl font-bold tracking-tight flex items-center gap-2">
            <KeyRound className="h-6 w-6 text-primary" />
            API Keys
          </h1>
          <p className="text-sm text-muted-foreground">
            Programmatic access keys for integrations. The secret is shown only
            once, at creation — store it somewhere safe.
          </p>
        </div>
        <Button onClick={() => setCreateOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          New key
        </Button>
      </div>

      <div className="rounded-lg border bg-card shadow-sm overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/40 hover:bg-muted/40">
              <TableHead>Name</TableHead>
              <TableHead>Prefix</TableHead>
              <TableHead className="hidden md:table-cell">Scopes</TableHead>
              <TableHead className="hidden lg:table-cell">Last used</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading && keys.length === 0 ? (
              <TableSkeleton colSpan={COL_COUNT} />
            ) : keys.length === 0 ? (
              <TableEmpty colSpan={COL_COUNT} icon={KeyRound}>
                No API keys yet. Create one to grant programmatic access.
              </TableEmpty>
            ) : (
              keys.map((k) => {
                const status = statusOf(k);
                return (
                  <TableRow key={k.id}>
                    <TableCell className="font-medium">{k.name}</TableCell>
                    <TableCell className="font-mono text-xs text-muted-foreground whitespace-nowrap">
                      {k.keyPrefix}…
                    </TableCell>
                    <TableCell className="hidden md:table-cell">
                      {k.scopes.length === 0 ? (
                        <span className="text-xs text-muted-foreground">
                          none
                        </span>
                      ) : (
                        <div className="flex flex-wrap gap-1">
                          {k.scopes.map((s) => (
                            <Badge
                              key={s}
                              variant="secondary"
                              className="text-[10px] font-mono"
                            >
                              {s}
                            </Badge>
                          ))}
                        </div>
                      )}
                    </TableCell>
                    <TableCell className="hidden lg:table-cell text-xs text-muted-foreground whitespace-nowrap">
                      {k.lastUsedAt ? dateTime(k.lastUsedAt) : "never"}
                    </TableCell>
                    <TableCell>
                      <Badge variant={STATUS_VARIANT[status]}>
                        {STATUS_LABEL[status]}
                      </Badge>
                      {k.expiresAt && status !== "expired" && (
                        <div className="mt-0.5 text-[10px] text-muted-foreground">
                          expires {dateTime(k.expiresAt)}
                        </div>
                      )}
                    </TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="destructive"
                        size="sm"
                        disabled={status === "revoked"}
                        onClick={() => setRevoking(k)}
                      >
                        <Ban className="mr-2 h-4 w-4" />
                        Revoke
                      </Button>
                    </TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </div>

      <CreateKeyDialog
        open={createOpen}
        onOpenChange={setCreateOpen}
        onMinted={(secret, name) => {
          setMinted({ secret, name });
          void refetch();
        }}
      />

      <SecretRevealDialog
        minted={minted}
        onClose={() => setMinted(null)}
      />

      <AlertDialog
        open={!!revoking}
        onOpenChange={(o) => !o && setRevoking(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Revoke this API key?</AlertDialogTitle>
            <AlertDialogDescription>
              <span className="font-medium">{revoking?.name}</span> (
              <span className="font-mono">{revoking?.keyPrefix}…</span>) will
              stop working immediately for every integration using it. This
              cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={revokeLoading}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              disabled={revokeLoading}
              onClick={(e) => {
                e.preventDefault();
                if (revoking)
                  void revokeApiKey({ variables: { id: revoking.id } });
              }}
            >
              {revokeLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Revoke key
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

function CreateKeyDialog({
  open,
  onOpenChange,
  onMinted,
}: {
  open: boolean;
  onOpenChange: (o: boolean) => void;
  onMinted: (secret: string, name: string) => void;
}) {
  const [name, setName] = useState("");
  const [scopesText, setScopesText] = useState("");
  const [expiresAt, setExpiresAt] = useState("");

  const reset = () => {
    setName("");
    setScopesText("");
    setExpiresAt("");
  };

  const scopes = useMemo(
    () =>
      Array.from(
        new Set(
          scopesText
            .split(/[\s,]+/)
            .map((s) => s.trim())
            .filter(Boolean),
        ),
      ),
    [scopesText],
  );

  const [createApiKey, { loading }] = useMutation<CreateApiKeyData>(
    CREATE_API_KEY,
    {
      onCompleted: (res) => {
        const secret = res.createApiKey?.secret;
        const keyName = res.createApiKey?.apiKey?.name ?? name;
        onOpenChange(false);
        reset();
        if (secret) onMinted(secret, keyName);
      },
      onError: (e) => toast.error(`Create failed: ${e.message}`),
    },
  );

  const submit = () => {
    const trimmed = name.trim();
    if (!trimmed) {
      toast.error("A name is required.");
      return;
    }
    void createApiKey({
      variables: {
        input: {
          name: trimmed,
          scopes,
          // datetime-local yields a local ISO-ish string; append Z-free value —
          // the backend parses it as a Date. Empty => no expiry.
          expiresAt: expiresAt ? new Date(expiresAt).toISOString() : null,
        },
      },
    });
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(o) => {
        onOpenChange(o);
        if (!o) reset();
      }}
    >
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create API key</DialogTitle>
          <DialogDescription>
            The secret is generated server-side and shown to you only once.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="ak-name">Name</Label>
            <Input
              id="ak-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="CI deploy bot"
              onKeyDown={(e) => e.key === "Enter" && submit()}
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="ak-scopes">Scopes</Label>
            <Input
              id="ak-scopes"
              value={scopesText}
              onChange={(e) => setScopesText(e.target.value)}
              placeholder="orders:read products:write"
            />
            <p className="text-[11px] text-muted-foreground">
              Space- or comma-separated. Leave blank for no scopes.
            </p>
            {scopes.length > 0 && (
              <div className="flex flex-wrap gap-1 pt-1">
                {scopes.map((s) => (
                  <Badge
                    key={s}
                    variant="secondary"
                    className="text-[10px] font-mono"
                  >
                    {s}
                  </Badge>
                ))}
              </div>
            )}
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="ak-expiry">Expiry (optional)</Label>
            <Input
              id="ak-expiry"
              type="datetime-local"
              value={expiresAt}
              onChange={(e) => setExpiresAt(e.target.value)}
            />
          </div>
        </div>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={loading}
          >
            Cancel
          </Button>
          <Button onClick={submit} disabled={loading}>
            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Create key
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function SecretRevealDialog({
  minted,
  onClose,
}: {
  minted: { secret: string; name: string } | null;
  onClose: () => void;
}) {
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (minted) setCopied(false);
  }, [minted]);

  const copy = async () => {
    if (!minted) return;
    try {
      await navigator.clipboard.writeText(minted.secret);
      setCopied(true);
      toast.success("Secret copied to clipboard");
    } catch {
      toast.error("Copy failed — select and copy manually.");
    }
  };

  return (
    <Dialog open={!!minted} onOpenChange={(o) => !o && onClose()}>
      <DialogContent showCloseButton={false}>
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <ShieldAlert className="h-4 w-4 text-amber-600" />
            Copy your API key now
          </DialogTitle>
          <DialogDescription>
            This is the only time <span className="font-medium">
              {minted?.name}
            </span>
            &apos;s secret will be shown. It is not stored and cannot be
            retrieved again.
          </DialogDescription>
        </DialogHeader>

        <div className="flex items-center gap-2 rounded-md border bg-muted/40 p-2">
          <code className="flex-1 break-all font-mono text-xs">
            {minted?.secret}
          </code>
          <Button
            variant="outline"
            size="icon-sm"
            onClick={copy}
            aria-label="Copy secret"
          >
            {copied ? (
              <Check className="text-emerald-600" />
            ) : (
              <Copy />
            )}
          </Button>
        </div>

        <DialogFooter>
          <Button onClick={onClose}>I&apos;ve saved it</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
