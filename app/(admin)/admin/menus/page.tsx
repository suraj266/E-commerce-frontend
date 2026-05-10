/**
 * =============================================================================
 * Admin Menus — /admin/menus
 * =============================================================================
 *
 * One menu per location. Lists all 7 known locations with item-count and
 * an active toggle. Click "Edit" to open the per-location tree editor.
 *
 * No "Add new" button — locations are a fixed enum. New locations require
 * a backend enum addition + seed (intentional safety so URLs stay stable).
 * =============================================================================
 */

"use client";

import { useEffect } from "react";
import Link from "next/link";
import { useQuery, useMutation } from "@apollo/client/react";
import { toast } from "sonner";
import { ListTree, Pencil } from "lucide-react";

import {
  GET_ADMIN_MENUS,
  SET_MENU_ACTIVE,
} from "@/lib/graphql/menus";
import {
  GetAdminMenusData,
  MENU_LOCATION_HINT,
  MENU_LOCATION_LABEL,
  MENU_LOCATIONS,
  MenuLocation,
  parseMenuItems,
  SetMenuActiveData,
} from "@/types/menu.types";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { StatusToggle } from "@/components/ui/status-toggle";
import { useSetPageTitle } from "@/components/shell/page-title-context";

export default function AdminMenusPage() {
  useSetPageTitle("Menus");

  const { data, loading, error, refetch } = useQuery<GetAdminMenusData>(
    GET_ADMIN_MENUS,
    { fetchPolicy: "cache-and-network" },
  );

  useEffect(() => {
    if (error) toast.error(`Failed to load menus: ${error.message}`);
  }, [error]);

  const [setActive, { loading: toggling }] = useMutation<SetMenuActiveData>(
    SET_MENU_ACTIVE,
    {
      refetchQueries: [{ query: GET_ADMIN_MENUS }],
      onCompleted: (res) => {
        toast.success(
          `${MENU_LOCATION_LABEL[res.setMenuActive.location as MenuLocation]} → ${
            res.setMenuActive.isActive ? "active" : "inactive"
          }`,
        );
      },
      onError: (err) => toast.error(`Toggle failed: ${err.message}`),
    },
  );

  // Map by location for quick lookup; iterate via MENU_LOCATIONS so the
  // table order is fixed regardless of insertion order in the DB.
  const byLocation = new Map((data?.adminMenus ?? []).map((m) => [m.location, m]));

  function countItems(json: string): { total: number; topLevel: number } {
    const items = parseMenuItems(json);
    const visit = (arr: typeof items): number =>
      arr.reduce((acc, n) => acc + 1 + visit(n.children ?? []), 0);
    return { total: visit(items), topLevel: items.length };
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight flex items-center gap-2">
          <ListTree className="h-6 w-6 text-primary" />
          Menus
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          Manage navigation for the storefront header, footer, and social
          row. One menu per location.
        </p>
      </div>

      <div className="rounded-lg border bg-card shadow-sm overflow-hidden">
        {loading && !data && (
          <div className="space-y-3 p-4">
            {Array.from({ length: 7 }).map((_, i) => (
              <div
                key={i}
                className="h-14 w-full animate-pulse rounded-lg bg-muted"
              />
            ))}
          </div>
        )}

        {data && (
          <table className="w-full text-sm">
            <thead className="text-xs uppercase text-muted-foreground border-b">
              <tr>
                <th className="px-4 py-3 text-left font-medium">Location</th>
                <th className="px-3 py-3 text-center font-medium hidden sm:table-cell">
                  Items
                </th>
                <th className="px-3 py-3 text-center font-medium">Status</th>
                <th className="px-3 py-3 text-right font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {MENU_LOCATIONS.map((loc) => {
                const menu = byLocation.get(loc);
                const counts = menu
                  ? countItems(menu.items)
                  : { total: 0, topLevel: 0 };
                return (
                  <tr
                    key={loc}
                    className="border-b last:border-b-0 hover:bg-muted/30 transition-colors"
                  >
                    <td className="px-4 py-3">
                      <div className="font-medium">
                        {MENU_LOCATION_LABEL[loc]}
                      </div>
                      <div className="text-xs text-muted-foreground line-clamp-1">
                        {MENU_LOCATION_HINT[loc]}
                      </div>
                    </td>
                    <td className="px-3 py-3 text-center font-mono text-xs hidden sm:table-cell">
                      {menu ? (
                        <>
                          <span className="font-semibold">
                            {counts.topLevel}
                          </span>
                          <span className="text-muted-foreground">
                            {" "}
                            ({counts.total} total)
                          </span>
                        </>
                      ) : (
                        <span className="text-muted-foreground">—</span>
                      )}
                    </td>
                    <td className="px-3 py-3">
                      {menu ? (
                        <div className="flex justify-center">
                          <StatusToggle
                            checked={menu.isActive}
                            loading={toggling}
                            disabled={toggling}
                            onChange={(next) =>
                              setActive({
                                variables: {
                                  location: loc,
                                  isActive: next,
                                },
                              })
                            }
                          />
                        </div>
                      ) : (
                        <div className="flex justify-center">
                          <Badge variant="outline" className="text-[10px]">
                            Not created
                          </Badge>
                        </div>
                      )}
                    </td>
                    <td className="px-3 py-3 text-right">
                      <Button asChild variant="outline" size="sm">
                        <Link href={`/admin/menus/${loc}`}>
                          <Pencil className="mr-1 h-3 w-3" />
                          Edit
                        </Link>
                      </Button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>

      <p className="text-xs text-muted-foreground">
        Don&apos;t see a location you need? Locations are a fixed enum — ask
        the dev team to add a new <code>MenuLocation</code> value and run the
        seeder.
      </p>
      {/* Hidden refetch button for keyboard users — no UI but available */}
      <button onClick={() => refetch()} className="sr-only">
        Refetch menus
      </button>
    </div>
  );
}
