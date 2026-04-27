import { useEffect, useState } from "react";
import { Bell, Search } from "lucide-react";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Badge } from "@/components/ui/badge";
import { api } from "@/lib/api";
import type { Notification } from "@/lib/types";
import { cn } from "@/lib/utils";

export function Topbar() {
  const [notifications, setNotifications] = useState<Notification[]>([]);

  useEffect(() => {
    api.getNotifications().then(setNotifications).catch(() => {});
  }, []);

  const unread = notifications.filter((n) => !n.read).length;

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center gap-3 border-b border-border bg-background/80 px-4 backdrop-blur-md sm:px-6">
      <SidebarTrigger className="text-muted-foreground hover:text-foreground" />
      <div className="hidden md:flex flex-1 max-w-md items-center">
        <div className="relative w-full">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search orders, customers, drivers…"
            className="pl-9 h-10 bg-muted/40 border-transparent focus-visible:bg-background focus-visible:border-border"
          />
        </div>
      </div>
      <div className="flex-1 md:hidden" />
      <div className="flex items-center gap-2">
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="ghost" size="icon" className="relative">
              <Bell className="h-5 w-5" />
              {unread > 0 && (
                <span className="absolute top-1.5 right-1.5 flex h-2 w-2">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-brand-blue opacity-75" />
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-brand-blue" />
                </span>
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent align="end" className="w-80 p-0">
            <div className="flex items-center justify-between border-b px-4 py-3">
              <h3 className="font-semibold text-sm">Notifications</h3>
              {unread > 0 && <Badge variant="secondary" className="text-[10px]">{unread} new</Badge>}
            </div>
            <div className="max-h-80 overflow-y-auto">
              {notifications.length === 0 && (
                <p className="p-6 text-center text-sm text-muted-foreground">No notifications.</p>
              )}
              {notifications.map((n) => (
                <div key={n.id} className={cn("border-b last:border-0 p-3 hover:bg-muted/40 transition-colors", !n.read && "bg-brand-blue/5")}>
                  <div className="flex items-start justify-between gap-2">
                    <p className="text-sm font-medium">{n.title}</p>
                    {!n.read && <span className="mt-1 h-2 w-2 rounded-full bg-brand-blue shrink-0" />}
                  </div>
                  <p className="mt-0.5 text-xs text-muted-foreground">{n.message}</p>
                  <p className="mt-1 text-[10px] text-muted-foreground/70">{n.createdAt}</p>
                </div>
              ))}
            </div>
          </PopoverContent>
        </Popover>
      </div>
    </header>
  );
}
