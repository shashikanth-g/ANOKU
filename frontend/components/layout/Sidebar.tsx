"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Home, Shirt, Calendar, PieChart, Settings } from "lucide-react";

const sidebarLinks = [
  { name: "Browse", href: "/", icon: Home },
  { name: "My Items", href: "/owner/items", icon: Shirt },
  { name: "Bookings", href: "/bookings", icon: Calendar },
  { name: "Earnings", href: "/owner/earnings", icon: PieChart },
  { name: "Settings", href: "/profile", icon: Settings },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="hidden md:flex flex-col w-64 h-[calc(100vh-4rem)] sticky top-16 border-r border-[var(--color-border)] glass bg-background/50 py-6 px-4">
      <nav className="flex-1 space-y-2">
        {sidebarLinks.map((link) => {
          const Icon = link.icon;
          const isActive = pathname?.startsWith(link.href);
          
          return (
            <Link
              key={link.name}
              href={link.href}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200",
                isActive
                  ? "bg-[var(--color-primary)] text-white shadow-md shadow-[var(--color-primary)]/20"
                  : "text-[var(--color-text-secondary)] hover:bg-[var(--color-text-secondary)]/10 hover:text-[var(--color-text-primary)]"
              )}
            >
              <Icon className="h-5 w-5" />
              {link.name}
            </Link>
          );
        })}
      </nav>
      
      <div className="mt-auto pt-6 border-t border-[var(--color-border)]">
        <div className="rounded-xl bg-gradient-to-br from-[var(--color-primary)] to-[#085050] p-4 text-white shadow-lg">
          <h4 className="font-semibold text-sm mb-1">Upgrade to Pro</h4>
          <p className="text-xs text-white/80 mb-3">Get 0% commission on your first 5 rentals.</p>
          <button className="w-full rounded-md bg-white text-[var(--color-primary)] py-1.5 text-xs font-bold transition-transform hover:scale-105">
            Learn More
          </button>
        </div>
      </div>
    </aside>
  );
}
