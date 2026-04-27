"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Home, Search, PlusCircle, Calendar, User } from "lucide-react";

const navLinks = [
  { name: "Home", href: "/", icon: Home },
  { name: "Explore", href: "/browse", icon: Search },
  { name: "List", href: "/owner/upload", icon: PlusCircle, isMain: true },
  { name: "Bookings", href: "/bookings", icon: Calendar },
  { name: "Profile", href: "/profile", icon: User },
];

export function Navigation() {
  const pathname = usePathname();

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 glass border-t border-[var(--color-border)] pb-safe pt-2 px-6">
      <div className="flex items-center justify-between h-14">
        {navLinks.map((link) => {
          const Icon = link.icon;
          const isActive = pathname?.startsWith(link.href);
          
          if (link.isMain) {
            return (
              <Link
                key={link.name}
                href={link.href}
                className="flex flex-col items-center justify-center -mt-6 group"
              >
                <div className="h-14 w-14 rounded-full bg-[var(--color-primary)] text-white shadow-lg shadow-[var(--color-primary)]/40 flex items-center justify-center transition-transform duration-300 group-hover:scale-110 active:scale-95">
                  <Icon className="h-7 w-7" />
                </div>
                <span className="text-[10px] font-medium mt-1 text-[var(--color-text-secondary)]">
                  {link.name}
                </span>
              </Link>
            );
          }

          return (
            <Link
              key={link.name}
              href={link.href}
              className={cn(
                "flex flex-col items-center justify-center gap-1 min-w-[3.5rem] transition-colors",
                isActive
                  ? "text-[var(--color-primary)]"
                  : "text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)]"
              )}
            >
              <Icon className={cn("h-6 w-6 transition-transform", isActive && "scale-110")} />
              <span className="text-[10px] font-medium">{link.name}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
