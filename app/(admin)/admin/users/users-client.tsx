"use client";

/**
 * Admin Users console (Phase 3 Wave 4) — platform (staff/admin) accounts,
 * server-paginated. Search / status / role filters run on the backend
 * (adminUsers, user:read). Editing changes account status + role (updateUser,
 * user:update); the role name comes from the query's `role` relation.
 * Storefront shoppers have a dedicated view under /admin/customers.
 */

import { useEffect, useMemo, useState } from "react";
import { useQuery, useMutation } from "@apollo/client/react";
import { toast } from "sonner";
import { Loader2, Pencil, ShieldCheck, UserCog } from "lucide-react";

import {
  GET_ADMIN_USERS_PAGINATED,
  UPDATE_ADMIN_USER,
  ADMIN_USER_STATUSES,
  ADMIN_USER_STATUS_LABEL,
  type AdminUserRow,
  type AdminUsersPaginatedData,
  type UpdateAdminUserData,
  type AdminUserStatus,
} from "@/lib/graphql/admin-users";
import {
  GET_ADMIN_ROLES,
  type AdminRolesData,
} from "@/lib/graphql/admin-roles";
import { dateTime } from "@/lib/utils/admin-format";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useSetPageTitle } from "@/components/shell/page-title-context";
import {
  TableEmpty,
  TablePagination,
  TableSkeleton,
  TableToolbar,
  usePagination,
} from "@/components/ui/data-table";

const COL_COUNT = 6;
const PAGE_SIZE_OPTIONS = [25, 50, 100] as const;

const STATUS_VARIANT: Record<
  AdminUserStatus,
  "default" | "secondary" | "destructive" | "outline"
> = {
  active: "default",
  inactive: "outline",
  suspended: "secondary",
  banned: "destructive",
};

export default function UsersClient() {
  useSetPageTitle("Users");

  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | AdminUserStatus>(
    "all",
  );
  const [roleFilter, setRoleFilter] = useState<string>("all");

  const [editing, setEditing] = useState<AdminUserRow | null>(null);
  const [editStatus, setEditStatus] = useState<AdminUserStatus>("active");
  const [editRoleId, setEditRoleId] = useState<string>("");

  const [serverTotal, setServerTotal] = useState(0);
  const pg = usePagination({ totalRows: serverTotal, defaultPageSize: 25 });

  useEffect(() => {
    const t = setTimeout(() => setDebouncedSearch(search.trim()), 300);
    return () => clearTimeout(t);
  }, [search]);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    pg.resetPage();
  }, [debouncedSearch, statusFilter, roleFilter, pg.pageSize]);

  const vars = useMemo(
    () => ({
      page: pg.page,
      pageSize: pg.pageSize,
      search: debouncedSearch || undefined,
      status: statusFilter === "all" ? undefined : statusFilter,
      roleId: roleFilter === "all" ? undefined : roleFilter,
    }),
    [pg.page, pg.pageSize, debouncedSearch, statusFilter, roleFilter],
  );

  const { data, loading, error } = useQuery<AdminUsersPaginatedData>(
    GET_ADMIN_USERS_PAGINATED,
    { variables: vars, fetchPolicy: "cache-and-network" },
  );
  const { data: rolesData } = useQuery<AdminRolesData>(GET_ADMIN_ROLES);

  useEffect(() => {
    if (error) toast.error(`Failed to load users: ${error.message}`);
  }, [error]);

  useEffect(() => {
    const c = data?.adminUsers?.totalCount;
    if (typeof c === "number" && c !== serverTotal) setServerTotal(c);
  }, [data?.adminUsers?.totalCount, serverTotal]);

  const [updateUser, { loading: saving }] = useMutation<UpdateAdminUserData>(
    UPDATE_ADMIN_USER,
    {
      refetchQueries: [
        { query: GET_ADMIN_USERS_PAGINATED, variables: vars },
      ],
      onCompleted: () => {
        toast.success("User updated");
        setEditing(null);
      },
      onError: (e) => toast.error(`Update failed: ${e.message}`),
    },
  );

  const roles = rolesData?.roles ?? [];
  const users = data?.adminUsers?.items ?? [];

  const roleNameById = useMemo(() => {
    const m = new Map<string, string>();
    for (const r of roles) m.set(r.id, r.name);
    return m;
  }, [roles]);

  const openEdit = (u: AdminUserRow) => {
    setEditStatus((u.status as AdminUserStatus) ?? "active");
    setEditRoleId(u.roleId ?? "");
    setEditing(u);
  };

  const save = () => {
    if (!editing) return;
    updateUser({
      variables: {
        updateUserInput: {
          id: editing.id,
          status: editStatus,
          ...(editRoleId ? { roleId: editRoleId } : {}),
        },
      },
    });
  };

  const activeFilterCount =
    (debouncedSearch ? 1 : 0) +
    (statusFilter !== "all" ? 1 : 0) +
    (roleFilter !== "all" ? 1 : 0);

  const resetFilters = () => {
    setSearch("");
    setStatusFilter("all");
    setRoleFilter("all");
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-bold tracking-tight flex items-center gap-2">
          <UserCog className="h-6 w-6 text-primary" />
          Users
        </h1>
        <p className="text-sm text-muted-foreground">
          All platform accounts and the role that governs their permissions.
          Change account status or reassign a role. (Storefront shoppers also
          have a dedicated view under Customers.)
        </p>
      </div>

      <TableToolbar
        search={search}
        onSearchChange={setSearch}
        searchPlaceholder="Search name, email, phone…"
        activeFilterCount={activeFilterCount}
        onReset={resetFilters}
        primaryFilters={
          <div className="flex flex-col gap-2 sm:flex-row sm:flex-wrap">
            <Select
              value={statusFilter}
              onValueChange={(v) =>
                setStatusFilter(v as "all" | AdminUserStatus)
              }
            >
              <SelectTrigger className="w-full sm:w-44">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All statuses</SelectItem>
                {ADMIN_USER_STATUSES.map((s) => (
                  <SelectItem key={s} value={s}>
                    {ADMIN_USER_STATUS_LABEL[s]}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={roleFilter} onValueChange={setRoleFilter}>
              <SelectTrigger className="w-full sm:w-44">
                <SelectValue placeholder="All roles" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All roles</SelectItem>
                {roles.map((r) => (
                  <SelectItem key={r.id} value={r.id}>
                    {r.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        }
      />

      <div className="rounded-lg border bg-card shadow-sm overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/40 hover:bg-muted/40">
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Role</TableHead>
              <TableHead className="text-center">Status</TableHead>
              <TableHead className="hidden lg:table-cell">Last login</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading && users.length === 0 ? (
              <TableSkeleton colSpan={COL_COUNT} />
            ) : users.length === 0 ? (
              <TableEmpty
                colSpan={COL_COUNT}
                icon={UserCog}
                hasFilters={activeFilterCount > 0}
                onClearFilters={resetFilters}
              >
                No users found.
              </TableEmpty>
            ) : (
              users.map((u) => {
                const status = (u.status ?? "active") as AdminUserStatus;
                const roleName =
                  u.role?.name ??
                  (u.roleId ? roleNameById.get(u.roleId) : undefined);
                return (
                  <TableRow key={u.id}>
                    <TableCell>
                      <button
                        onClick={() => openEdit(u)}
                        className="text-left font-medium hover:underline"
                      >
                        {u.name ?? "—"}
                      </button>
                    </TableCell>
                    <TableCell>
                      <div>{u.email}</div>
                      <div className="text-[10px] text-muted-foreground">
                        {u.emailVerifiedAt ? "Verified" : "Unverified"}
                      </div>
                    </TableCell>
                    <TableCell>
                      {roleName ? (
                        <Badge variant="outline" className="text-[10px] gap-1">
                          <ShieldCheck className="h-3 w-3" />
                          {roleName}
                        </Badge>
                      ) : (
                        <span className="text-xs text-muted-foreground">
                          No role
                        </span>
                      )}
                    </TableCell>
                    <TableCell className="text-center">
                      <Badge
                        variant={STATUS_VARIANT[status] ?? "outline"}
                        className="text-[10px]"
                      >
                        {ADMIN_USER_STATUS_LABEL[status] ?? status}
                      </Badge>
                    </TableCell>
                    <TableCell className="hidden lg:table-cell text-xs text-muted-foreground">
                      {u.lastLoginAt ? dateTime(u.lastLoginAt) : "Never"}
                    </TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => openEdit(u)}
                        title="Edit"
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </div>

      <TablePagination
        page={pg.safePage}
        pageSize={pg.pageSize}
        totalRows={serverTotal}
        totalPages={pg.totalPages}
        onPageChange={pg.setPage}
        onPageSizeChange={(n) => {
          pg.setPageSize(n);
          pg.resetPage();
        }}
        pageSizeOptions={PAGE_SIZE_OPTIONS}
      />

      {/* Edit sheet */}
      <Sheet open={!!editing} onOpenChange={(o) => !o && setEditing(null)}>
        <SheetContent className="sm:max-w-md w-full overflow-y-auto">
          <SheetHeader>
            <SheetTitle>Edit user</SheetTitle>
            <SheetDescription>{editing?.email}</SheetDescription>
          </SheetHeader>

          {editing && (
            <div className="px-4 pb-4 space-y-5">
              <div className="rounded-md bg-muted/40 p-3 text-xs space-y-1">
                <div>
                  <span className="text-muted-foreground">Name: </span>
                  <span className="font-medium">{editing.name ?? "—"}</span>
                </div>
                <div>
                  <span className="text-muted-foreground">Joined: </span>
                  <span>{dateTime(editing.createdAt)}</span>
                </div>
              </div>

              <div className="space-y-1.5">
                <Label>Account status</Label>
                <Select
                  value={editStatus}
                  onValueChange={(v) => setEditStatus(v as AdminUserStatus)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {ADMIN_USER_STATUSES.map((s) => (
                      <SelectItem key={s} value={s}>
                        {ADMIN_USER_STATUS_LABEL[s]}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <p className="text-xs text-muted-foreground">
                  Suspended / banned users cannot log in.
                </p>
              </div>

              <div className="space-y-1.5">
                <Label>Role</Label>
                <Select value={editRoleId} onValueChange={setEditRoleId}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a role" />
                  </SelectTrigger>
                  <SelectContent>
                    {roles.map((r) => (
                      <SelectItem key={r.id} value={r.id}>
                        {r.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <p className="text-xs text-muted-foreground">
                  The role determines which admin pages and actions this user
                  can access.
                </p>
              </div>

              <SheetFooter>
                <Button variant="outline" onClick={() => setEditing(null)}>
                  Cancel
                </Button>
                <Button onClick={save} disabled={saving}>
                  {saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Save changes
                </Button>
              </SheetFooter>
            </div>
          )}
        </SheetContent>
      </Sheet>
    </div>
  );
}
