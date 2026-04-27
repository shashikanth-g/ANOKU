"use client";

import * as React from "react";
import { Bell, CheckCircle2, Clock } from "lucide-react";
import { getNotifications, markNotificationAsRead } from "@/lib/notifications";
import { Button } from "./common/Button";
import { formatDistanceToNow } from "date-fns";

export function NotificationBell() {
  const [notifications, setNotifications] = React.useState<any[]>([]);
  const [isOpen, setIsOpen] = React.useState(false);
  const dropdownRef = React.useRef<HTMLDivElement>(null);

  const fetchNotifications = React.useCallback(async () => {
    try {
      const data = await getNotifications();
      setNotifications(data);
    } catch (err) {
      console.error("Failed to fetch notifications:", err);
    }
  }, []);

  React.useEffect(() => {
    fetchNotifications();
    const interval = setInterval(fetchNotifications, 30000);
    return () => clearInterval(interval);
  }, [fetchNotifications]);

  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const unreadCount = notifications.filter(n => !n.is_read).length;

  const handleMarkAsRead = async (id: string) => {
    try {
      await markNotificationAsRead(id);
      setNotifications(notifications.map(n => 
        n.id === id ? { ...n, is_read: true } : n
      ));
    } catch (err) {
      console.error("Failed to mark as read:", err);
    }
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <Button 
        variant="ghost" 
        size="icon" 
        className="relative h-12 w-12"
        onClick={() => setIsOpen(!isOpen)}
      >
        <Bell className="h-5 w-5" />
        {unreadCount > 0 && (
          <span className="absolute top-2.5 right-2.5 h-4 w-4 flex items-center justify-center rounded-full bg-[var(--color-primary)] text-[10px] text-white font-bold animate-in zoom-in">
            {unreadCount}
          </span>
        )}
        <span className="sr-only">Notifications</span>
      </Button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 bg-[var(--color-card)] border border-[var(--color-border)] rounded-2xl shadow-2xl z-50 overflow-hidden animate-in fade-in slide-in-from-top-2">
          <div className="p-4 border-b border-[var(--color-border)] bg-black/5 dark:bg-white/5 flex items-center justify-between">
            <h3 className="font-bold">Notifications</h3>
            {unreadCount > 0 && (
              <span className="text-[10px] bg-[var(--color-primary)]/10 text-[var(--color-primary)] px-2 py-0.5 rounded-full font-bold">
                {unreadCount} New
              </span>
            )}
          </div>
          
          <div className="max-h-[400px] overflow-y-auto">
            {notifications.length === 0 ? (
              <div className="p-10 text-center space-y-2">
                <Bell className="w-8 h-8 text-[var(--color-text-secondary)] mx-auto opacity-20" />
                <p className="text-sm text-[var(--color-text-secondary)]">No notifications yet</p>
              </div>
            ) : (
              <div className="divide-y divide-[var(--color-border)]/50">
                {notifications.map((n) => (
                  <div 
                    key={n.id} 
                    className={`p-4 transition-colors hover:bg-black/5 dark:hover:bg-white/5 cursor-pointer ${!n.is_read ? 'bg-[var(--color-primary)]/5' : ''}`}
                    onClick={() => handleMarkAsRead(n.id)}
                  >
                    <div className="flex gap-3">
                      <div className={`mt-1 h-2 w-2 rounded-full shrink-0 ${!n.is_read ? 'bg-[var(--color-primary)]' : 'bg-transparent'}`} />
                      <div className="space-y-1 flex-1">
                        <p className={`text-sm leading-snug ${!n.is_read ? 'font-semibold text-[var(--color-text-primary)]' : 'text-[var(--color-text-secondary)]'}`}>
                          {n.message}
                        </p>
                        <div className="flex items-center gap-2 text-[10px] text-[var(--color-text-secondary)]">
                          <Clock className="w-3 h-3" />
                          {formatDistanceToNow(new Date(n.created_at), { addSuffix: true })}
                        </div>
                      </div>
                      {n.is_read && <CheckCircle2 className="w-4 h-4 text-[var(--color-success)] shrink-0" />}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
          
          {notifications.length > 0 && (
            <div className="p-3 bg-black/5 dark:bg-white/5 border-t border-[var(--color-border)] text-center">
              <button 
                className="text-xs font-bold text-[var(--color-primary)] hover:underline"
                onClick={() => setIsOpen(false)}
              >
                View all notifications
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
