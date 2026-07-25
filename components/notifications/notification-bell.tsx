"use client";

/**
 * NotificationBell — shared header bell used across the storefront, seller,
 * and admin portals.
 *
 *   - Unread badge on the bell icon (polled count).
 *   - Dropdown with the recent notifications, per-item read state, and a
 *     "Mark all read" action.
 *   - Opening the panel loads/refetches the list (see useNotifications).
 *
 * GUARDS:
 *   - Renders nothing when the viewer is signed out (the hook skips every
 *     query and `isAuthed` is false).
 *   - Shows a friendly empty state when there are zero notifications.
 *
 * Styling sticks to shared design tokens (bg-popover, muted-foreground,
 * destructive, brand, accent) so it themes correctly under both the storefront
 * Evolve/NeoDark palette and the [data-admin-theme] admin/seller palette.
 */

import { useState } from "react";
import { Bell, Check, CheckCheck } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import type { Notification } from "@/types/notification.types";
import { useNotifications } from "./use-notifications";

function timeAgo(iso: string): string {
  const then = new Date(iso).getTime();
  if (Number.isNaN(then)) return "";
  const sec = Math.round((Date.now() - then) / 1000);
  if (sec < 45) return "just now";
  const min = Math.round(sec / 60);
  if (min < 60) return `${min}m ago`;
  const hr = Math.round(min / 60);
  if (hr < 24) return `${hr}h ago`;
  const day = Math.round(hr / 24);
  if (day < 7) return `${day}d ago`;
  const wk = Math.round(day / 7);
  if (wk < 5) return `${wk}w ago`;
  return new Date(then).toLocaleDateString();
}

function NotificationRow({
  n,
  onMarkRead,
}: {
  n: Notification;
  onMarkRead: (id: string) => void;
}) {
  return (
    <button
      type="button"
      onClick={() => {
        if (!n.read) onMarkRead(n.id);
      }}
      className={cn(
        "flex w-full items-start gap-2.5 px-3 py-2.5 text-left transition-colors hover:bg-accent focus-visible:bg-accent focus-visible:outline-none",
        !n.read && "bg-accent/40",
      )}
    >
      {/* Unread indicator — a spacer keeps read rows aligned. */}
      <span className="mt-1.5 flex h-2 w-2 shrink-0 items-center justify-center">
        {!n.read && (
          <span
            aria-hidden="true"
            className="h-2 w-2 rounded-full bg-brand"
          />
        )}
      </span>

      <span className="min-w-0 flex-1">
        <span className="flex items-baseline justify-between gap-2">
          <span
            className={cn(
              "truncate text-sm",
              n.read ? "font-normal text-foreground/70" : "font-medium text-foreground",
            )}
          >
            {n.title}
          </span>
          <span className="shrink-0 text-[11px] text-muted-foreground">
            {timeAgo(n.createdAt)}
          </span>
        </span>
        {n.body && (
          <span className="mt-0.5 line-clamp-2 block text-xs text-muted-foreground">
            {n.body}
          </span>
        )}
      </span>
    </button>
  );
}

export function NotificationBell() {
  const [open, setOpen] = useState(false);
  const {
    isAuthed,
    unreadCount,
    notifications,
    listLoading,
    markingAll,
    markRead,
    markAll,
  } = useNotifications(open);

  // Hidden entirely for signed-out visitors (e.g. anonymous storefront).
  if (!isAuthed) return null;

  const hasUnread = unreadCount > 0;

  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="relative h-9 w-9"
          aria-label={
            hasUnread
              ? `Notifications, ${unreadCount} unread`
              : "Notifications"
          }
        >
          <Bell className="h-5 w-5" />
          {hasUnread && (
            <span
              key={unreadCount}
              aria-hidden="true"
              className="absolute -top-0.5 -right-0.5 flex h-[18px] min-w-[18px] items-center justify-center rounded-full bg-destructive px-1 text-[10px] font-bold text-white"
            >
              {unreadCount > 9 ? "9+" : unreadCount}
            </span>
          )}
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent
        align="end"
        sideOffset={8}
        className="w-[min(22rem,calc(100vw-2rem))] p-0"
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b px-3 py-2">
          <span className="text-sm font-semibold">Notifications</span>
          {hasUnread && (
            <Button
              variant="ghost"
              size="sm"
              className="h-7 gap-1 px-2 text-xs text-muted-foreground hover:text-foreground"
              onClick={() => void markAll()}
              disabled={markingAll}
            >
              <CheckCheck className="h-3.5 w-3.5" />
              Mark all read
            </Button>
          )}
        </div>

        {/* Body */}
        <div className="max-h-[24rem] overflow-y-auto">
          {listLoading ? (
            <div className="space-y-3 p-3">
              {[0, 1, 2].map((i) => (
                <div key={i} className="flex gap-2.5">
                  <Skeleton className="mt-1 h-2 w-2 rounded-full" />
                  <div className="flex-1 space-y-1.5">
                    <Skeleton className="h-3.5 w-2/3" />
                    <Skeleton className="h-3 w-full" />
                  </div>
                </div>
              ))}
            </div>
          ) : notifications.length === 0 ? (
            <div className="flex flex-col items-center gap-2 px-6 py-10 text-center">
              <span className="flex h-10 w-10 items-center justify-center rounded-full bg-muted">
                <Check className="h-5 w-5 text-muted-foreground" />
              </span>
              <p className="text-sm font-medium">You&apos;re all caught up</p>
              <p className="text-xs text-muted-foreground">
                New notifications will show up here.
              </p>
            </div>
          ) : (
            <ul className="divide-y divide-border/60">
              {notifications.map((n) => (
                <li key={n.id}>
                  <NotificationRow n={n} onMarkRead={markRead} />
                </li>
              ))}
            </ul>
          )}
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
