"use client";

/**
 * Roles & Permissions matrix (P3-06) — grant/revoke individual permissions per
 * role. Rows are permissions (grouped by module), columns are roles; each cell
 * is a checkbox wired to the assignPermission / revokePermission mutations added
 * to the role backend this wave.
 *
 * Each mutation returns the affected role re-hydrated with its full permission
 * set, so Apollo's normalized cache updates the toggled column with no refetch.
 */

import { useEffect, useMemo, useState } from "react";
import { useQuery, useMutation } from "@apollo/client/react";
import { toast } from "sonner";
import { Loader2, ShieldCheck } from "lucide-react";

import {
  GET_ADMIN_ROLES,
  GET_ADMIN_PERMISSIONS_CATALOG,
  ASSIGN_PERMISSION,
  REVOKE_PERMISSION,
  type AdminRole,
  type AdminPermission,
  type AdminRolesData,
  type AdminPermissionsCatalogData,
  type AssignPermissionData,
  type RevokePermissionData,
} from "@/lib/graphql/admin-roles";

import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useSetPageTitle } from "@/components/shell/page-title-context";

function cellKey(roleId: string, permissionId: string) {
  return `${roleId}:${permissionId}`;
}

export default function RolesClient() {
  useSetPageTitle("Roles & Permissions");

  const [search, setSearch] = useState("");
  const [pending, setPending] = useState<Set<string>>(new Set());

  const {
    data: rolesData,
    loading: rolesLoading,
    error: rolesError,
  } = useQuery<AdminRolesData>(GET_ADMIN_ROLES, {
    fetchPolicy: "cache-and-network",
  });
  const {
    data: catalogData,
    loading: catalogLoading,
    error: catalogError,
  } = useQuery<AdminPermissionsCatalogData>(GET_ADMIN_PERMISSIONS_CATALOG, {
    fetchPolicy: "cache-and-network",
  });

  useEffect(() => {
    const e = rolesError || catalogError;
    if (e) toast.error(`Failed to load matrix: ${e.message}`);
  }, [rolesError, catalogError]);

  const [assignPermission] = useMutation<AssignPermissionData>(
    ASSIGN_PERMISSION,
    { onError: (e) => toast.error(`Grant failed: ${e.message}`) },
  );
  const [revokePermission] = useMutation<RevokePermissionData>(
    REVOKE_PERMISSION,
    { onError: (e) => toast.error(`Revoke failed: ${e.message}`) },
  );

  const roles: AdminRole[] = rolesData?.roles ?? [];
  const catalog: AdminPermission[] = catalogData?.permissions ?? [];

  // roleId → Set<permissionId> currently held.
  const heldByRole = useMemo(() => {
    const map = new Map<string, Set<string>>();
    for (const role of roles) {
      map.set(
        role.id,
        new Set((role.permissions ?? []).map((p) => p.id)),
      );
    }
    return map;
  }, [roles]);

  // Group the catalog by module, honoring the search filter.
  const grouped = useMemo(() => {
    const q = search.trim().toLowerCase();
    const byModule = new Map<string, AdminPermission[]>();
    for (const perm of catalog) {
      if (
        q &&
        !perm.slug.toLowerCase().includes(q) &&
        !(perm.description ?? "").toLowerCase().includes(q)
      ) {
        continue;
      }
      const list = byModule.get(perm.module) ?? [];
      list.push(perm);
      byModule.set(perm.module, list);
    }
    return Array.from(byModule.entries()).sort((a, b) =>
      a[0].localeCompare(b[0]),
    );
  }, [catalog, search]);

  async function toggle(role: AdminRole, perm: AdminPermission, held: boolean) {
    const key = cellKey(role.id, perm.id);
    if (pending.has(key)) return;
    setPending((s) => new Set(s).add(key));
    try {
      if (held) {
        await revokePermission({
          variables: { roleId: role.id, permissionId: perm.id },
        });
      } else {
        await assignPermission({
          variables: { roleId: role.id, permissionId: perm.id },
        });
      }
    } finally {
      setPending((s) => {
        const next = new Set(s);
        next.delete(key);
        return next;
      });
    }
  }

  const loading = rolesLoading || catalogLoading;
  const visibleCount = grouped.reduce((sum, [, list]) => sum + list.length, 0);

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-bold tracking-tight flex items-center gap-2">
          <ShieldCheck className="h-6 w-6 text-primary" />
          Roles &amp; Permissions
        </h1>
        <p className="text-sm text-muted-foreground">
          Toggle a checkbox to grant or revoke a permission for a role. Changes
          apply immediately and take effect on the user&apos;s next request.
        </p>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <Input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Filter permissions (e.g. refund, payout:run)…"
          className="sm:max-w-xs"
        />
        <div className="text-xs text-muted-foreground">
          {roles.length} role{roles.length === 1 ? "" : "s"} · {visibleCount}{" "}
          permission{visibleCount === 1 ? "" : "s"} shown
        </div>
      </div>

      <div className="rounded-lg border bg-card shadow-sm overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/40 hover:bg-muted/40">
              <TableHead className="min-w-[16rem] sticky left-0 bg-muted/40 z-10">
                Permission
              </TableHead>
              {roles.map((r) => (
                <TableHead key={r.id} className="text-center min-w-[7rem]">
                  <div className="font-medium">{r.name}</div>
                  {r.isDefault && (
                    <Badge variant="outline" className="mt-0.5 text-[9px]">
                      default
                    </Badge>
                  )}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading && catalog.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={roles.length + 1}
                  className="py-10 text-center"
                >
                  <Loader2 className="mx-auto h-6 w-6 animate-spin text-muted-foreground" />
                </TableCell>
              </TableRow>
            ) : visibleCount === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={roles.length + 1}
                  className="py-10 text-center text-sm text-muted-foreground"
                >
                  No permissions match &ldquo;{search}&rdquo;.
                </TableCell>
              </TableRow>
            ) : (
              grouped.map(([module, perms]) => (
                <ModuleGroup
                  key={module}
                  module={module}
                  perms={perms}
                  roles={roles}
                  heldByRole={heldByRole}
                  pending={pending}
                  onToggle={toggle}
                />
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}

function ModuleGroup({
  module,
  perms,
  roles,
  heldByRole,
  pending,
  onToggle,
}: {
  module: string;
  perms: AdminPermission[];
  roles: AdminRole[];
  heldByRole: Map<string, Set<string>>;
  pending: Set<string>;
  onToggle: (role: AdminRole, perm: AdminPermission, held: boolean) => void;
}) {
  return (
    <>
      <TableRow className="hover:bg-transparent">
        <TableCell
          colSpan={roles.length + 1}
          className="bg-muted/20 py-1.5 text-[11px] font-semibold uppercase tracking-wide text-muted-foreground sticky left-0"
        >
          {module}
        </TableCell>
      </TableRow>
      {perms.map((perm) => (
        <TableRow key={perm.id}>
          <TableCell className="sticky left-0 bg-card z-[1]">
            <div className="font-mono text-xs">{perm.slug}</div>
            {perm.description && (
              <div className="text-[11px] text-muted-foreground max-w-[22rem]">
                {perm.description}
              </div>
            )}
          </TableCell>
          {roles.map((role) => {
            const held = heldByRole.get(role.id)?.has(perm.id) ?? false;
            const key = cellKey(role.id, perm.id);
            const isPending = pending.has(key);
            return (
              <TableCell key={role.id} className="text-center">
                {isPending ? (
                  <Loader2 className="mx-auto h-4 w-4 animate-spin text-muted-foreground" />
                ) : (
                  <input
                    type="checkbox"
                    className="h-4 w-4 rounded border-input cursor-pointer accent-primary"
                    checked={held}
                    onChange={() => onToggle(role, perm, held)}
                    aria-label={`${perm.slug} for ${role.name}`}
                  />
                )}
              </TableCell>
            );
          })}
        </TableRow>
      ))}
    </>
  );
}
