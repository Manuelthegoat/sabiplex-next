"use client";

import { useCallback, useEffect, useState } from "react";
import axios from "axios";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Bell, CheckCheck } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

type NotificationItem = {
  id: string;
  actorName: string;
  actorAvatarUrl: string | null;
  type: string;
  message: string;
  href: string;
  readAt: string | null;
  createdAt: string;
};

function relativeTime(value: string) {
  const minutes = Math.floor((Date.now() - new Date(value).getTime()) / 60000);
  if (minutes < 1) return "now";
  if (minutes < 60) return `${minutes}m`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h`;
  const days = Math.floor(hours / 24);
  return days < 7 ? `${days}d` : new Date(value).toLocaleDateString();
}

export function NotificationBell() {
  const router = useRouter();
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [open, setOpen] = useState(false);

  const loadNotifications = useCallback(async () => {
    try {
      const { data } = await axios.get("/api/notifications");
      setNotifications(data.notifications);
      setUnreadCount(data.unreadCount);
    } catch {
      // Keep the navigation usable if notification loading is temporarily unavailable.
    }
  }, []);

  useEffect(() => {
    loadNotifications();
    const timer = window.setInterval(loadNotifications, 15000);
    window.addEventListener("focus", loadNotifications);
    return () => {
      window.clearInterval(timer);
      window.removeEventListener("focus", loadNotifications);
    };
  }, [loadNotifications]);

  const markRead = async (notification: NotificationItem) => {
    if (notification.readAt) return;
    setNotifications((items) => items.map((item) => item.id === notification.id ? { ...item, readAt: new Date().toISOString() } : item));
    setUnreadCount((count) => Math.max(0, count - 1));
    try {
      await axios.patch("/api/notifications", { notificationId: notification.id });
    } catch {
      loadNotifications();
    }
  };

  const markAllRead = async () => {
    if (!unreadCount) return;
    setNotifications((items) => items.map((item) => ({ ...item, readAt: item.readAt || new Date().toISOString() })));
    setUnreadCount(0);
    try {
      await axios.patch("/api/notifications", { all: true });
    } catch {
      loadNotifications();
    }
  };

  return (
    <DropdownMenu open={open} onOpenChange={(isOpen) => { setOpen(isOpen); if (isOpen) loadNotifications(); }}>
      <DropdownMenuTrigger asChild>
        <button type="button" aria-label={unreadCount ? `${unreadCount} unread notifications` : "Notifications"} className="relative grid h-9 w-9 place-items-center rounded-md text-slate-600 transition hover:bg-slate-100 hover:text-slate-950">
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && <span className="absolute -right-1 -top-1 grid h-[18px] min-w-[18px] place-items-center rounded-full bg-rose-600 px-1 text-[10px] font-bold leading-none text-white ring-2 ring-white shadow-sm" aria-live="polite">{unreadCount > 9 ? "9+" : unreadCount}</span>}
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-[min(24rem,calc(100vw-1rem))] p-0">
        <div className="flex items-center justify-between px-4 py-3"><DropdownMenuLabel className="p-0 text-base">Notifications</DropdownMenuLabel>{unreadCount > 0 && <button type="button" onClick={markAllRead} className="inline-flex items-center gap-1 text-xs font-semibold text-slate-500 hover:text-slate-950"><CheckCheck className="h-3.5 w-3.5" />Mark all read</button>}</div>
        <DropdownMenuSeparator className="m-0" />
        <div className="max-h-[min(28rem,70vh)] overflow-y-auto p-1">
          {notifications.map((notification) => <Link key={notification.id} href={notification.href} onClick={(event) => { event.preventDefault(); void markRead(notification).finally(() => { setOpen(false); router.push(notification.href); }); }} className={`flex gap-3 rounded-md p-3 outline-none transition hover:bg-slate-100 focus:bg-slate-100 ${notification.readAt ? "" : "bg-slate-50"}`}>
            {notification.actorAvatarUrl ? <img src={notification.actorAvatarUrl} alt="" className="h-9 w-9 shrink-0 rounded-full object-cover" /> : <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-neutral-100 text-sm font-bold text-neutral-800">{notification.actorName.slice(0, 1).toUpperCase()}</span>}
            <span className="min-w-0 flex-1"><span className="block text-sm leading-5 text-slate-800"><strong>{notification.actorName}</strong> {notification.message}</span><time className="mt-1 block text-xs text-slate-500" dateTime={notification.createdAt}>{relativeTime(notification.createdAt)}</time></span>
            {!notification.readAt && <span className="mt-2 h-2 w-2 shrink-0 rounded-full bg-neutral-900" aria-label="Unread" />}
          </Link>)}
          {!notifications.length && <p className="px-4 py-10 text-center text-sm text-slate-500">You’re all caught up.</p>}
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
