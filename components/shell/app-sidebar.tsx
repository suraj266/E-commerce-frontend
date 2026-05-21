"use client";

/**
 * =============================================================================
 * App Sidebar — shared between admin and seller portals
 * =============================================================================
 *
 * Role-agnostic sidebar built on Shadcn primitives. Portal-specific bits
 * (brand label, nav config, post-logout destination) come in as props so a
 * thin wrapper per role (AdminSidebar / SellerSidebar) can pre-bind them.
 *
 * NOTE: This used to live at components/admin/admin-sidebar.tsx; the admin
 * version is now a thin wrapper around this so existing imports keep working.
 * =============================================================================
 */

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronUp, LogOut, Settings, User } from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuBadge,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { useAuthStore } from "@/store/auth.store";
import { authApi } from "@/lib/api/auth.api";
import { refreshAccessToken } from "@/lib/auth/refresh-manager";
import type { NavGroup } from "@/config/nav.types";

export interface AppSidebarBrand {
  /** Big label inside the sidebar header — e.g. "Ecommerce". */
  name: string;
  /** Sub-label below the name — e.g. "Admin Panel" or "Seller Portal". */
  subtitle: string;
  /** Two-letter initials in the brand square. */
  initials: string;
  /** Where the brand link routes to. */
  homeHref: string;
}

interface AppSidebarProps {
  brand: AppSidebarBrand;
  navigation: NavGroup[];
  /** Where to send the user after logout (e.g. `/admin/login`). */
  logoutRedirect: string;
}

export function AppSidebar({
  brand,
  navigation,
  logoutRedirect,
}: AppSidebarProps) {
  const pathname = usePathname();
  const user = useAuthStore((state) => state.user);
  const accessToken = useAuthStore((state) => state.accessToken);
  const clearAuth = useAuthStore((state) => state.logout);

  async function handleLogout() {
    try {
      // Fresh tabs and post-reload sessions don't have the accessToken in
      // memory yet (it's intentionally not persisted to localStorage). Pull
      // one from the refresh cookie before calling logout — otherwise the
      // backend never sees the request, the refreshToken cookie isn't
      // cleared, and ReverseAuthProxy bounces the user right back to the
      // dashboard on the post-logout redirect.
      const token = accessToken ?? (await refreshAccessToken());
      if (token) await authApi.logout(token);
    } catch (error) {
      // Even if backend logout fails, still clear locally.
      console.error("Logout API error (proceeding with local cleanup):", error);
    } finally {
      clearAuth();
      // Hard reload so all in-flight Apollo cache and Zustand state is dropped.
      window.location.href = logoutRedirect;
    }
  }

  return (
    <Sidebar collapsible="icon" variant="sidebar">
      {/* --- Brand --- */}
      <SidebarHeader className="border-b border-sidebar-border">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <Link href={brand.homeHref}>
                <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground font-bold text-sm">
                  {brand.initials}
                </div>
                <div className="flex flex-col gap-0.5 leading-none">
                  <span className="font-semibold">{brand.name}</span>
                  <span className="text-xs text-muted-foreground">
                    {brand.subtitle}
                  </span>
                </div>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      {/* --- Navigation --- */}
      <SidebarContent>
        {navigation.map((group: NavGroup) => (
          <SidebarGroup key={group.label}>
            <SidebarGroupLabel>{group.label}</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {group.items.map((item) => {
                  // startsWith so nested routes (e.g. /admin/products/[id])
                  // keep the parent active. Falls back to exact match for
                  // root group items.
                  const isActive =
                    pathname === item.href ||
                    pathname.startsWith(`${item.href}/`);

                  return (
                    <SidebarMenuItem key={item.href}>
                      <SidebarMenuButton
                        asChild
                        isActive={isActive}
                        tooltip={item.title}
                      >
                        <Link href={item.href}>
                          <item.icon className="size-4" />
                          <span>{item.title}</span>
                        </Link>
                      </SidebarMenuButton>

                      {item.badge !== undefined && (
                        <SidebarMenuBadge>
                          <Badge
                            variant="secondary"
                            className="h-5 min-w-5 rounded-full px-1.5 text-[10px] font-bold"
                          >
                            {item.badge}
                          </Badge>
                        </SidebarMenuBadge>
                      )}
                    </SidebarMenuItem>
                  );
                })}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
      </SidebarContent>

      {/* --- User profile + logout --- */}
      <SidebarFooter className="border-t border-sidebar-border">
        <SidebarMenu>
          <SidebarMenuItem>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <SidebarMenuButton
                  size="lg"
                  className="data-[state=open]:bg-sidebar-accent"
                >
                  <Avatar className="h-8 w-8">
                    <AvatarFallback className="bg-primary/10 text-primary text-xs font-bold">
                      {user?.name?.charAt(0)?.toUpperCase() || "U"}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex flex-col gap-0.5 leading-none text-left">
                    <span className="font-semibold text-sm truncate">
                      {user?.name || "User"}
                    </span>
                    <span className="text-xs text-muted-foreground truncate">
                      {user?.email || ""}
                    </span>
                  </div>
                  <ChevronUp className="ml-auto size-4" />
                </SidebarMenuButton>
              </DropdownMenuTrigger>

              <DropdownMenuContent
                side="top"
                align="start"
                className="w-[--radix-dropdown-menu-trigger-width] min-w-56"
              >
                <DropdownMenuItem>
                  <User className="mr-2 h-4 w-4" />
                  Profile
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Settings className="mr-2 h-4 w-4" />
                  Settings
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  className="text-red-600 focus:text-red-600 cursor-pointer"
                  onClick={handleLogout}
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
