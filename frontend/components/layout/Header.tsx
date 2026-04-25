"use client";

import * as React from "react";
import Link from "next/link";
import { Bell, Search, User, Menu, ShoppingBag, HelpCircle } from "lucide-react";
import { Button } from "@/components/common/Button";
import { Input } from "@/components/common/Input";

import { ThemeToggle } from "@/components/common/ThemeToggle";

import { usePathname, useRouter } from "next/navigation";
import { BackButton } from "@/components/common/BackButton";
import { useSearchStore } from "@/store/searchStore";
import { useCartStore } from "@/store/cartStore";

export function Header() {
  const pathname = usePathname();
  const isHome = pathname === "/";
  const router = useRouter();
  const { query, setQuery } = useSearchStore();
  const cartItems = useCartStore((state) => state.items);

  return (
    <header className="sticky top-0 z-40 w-full glass border-b border-[var(--color-border)]">
      <div className="container mx-auto flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-2">
          {!isHome && <BackButton />}
          <Link href="/" className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg bg-[var(--color-primary)] flex items-center justify-center shadow-lg shadow-[var(--color-primary)]/20">
              <span className="text-white font-bold text-xl leading-none">A</span>
            </div>
            <span className="hidden sm:inline-block font-bold text-xl tracking-tight text-[var(--color-primary)]">
              ANOKU
            </span>
          </Link>
        </div>

        <div className="hidden md:flex flex-1 items-center justify-center max-w-md px-6">
          <div className="relative w-full">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--color-text-secondary)]" />
            <Input
              type="search"
              placeholder="Search items, categories, brands..."
              className="w-full pl-9 h-12 bg-black/5 dark:bg-white/5 border-transparent focus-visible:bg-transparent"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !isHome) {
                  router.push("/");
                }
              }}
            />
          </div>
        </div>

        <div className="flex items-center gap-1 sm:gap-4">
          <div className="hidden sm:block">
            <ThemeToggle />
          </div>
          <Link href="/help">
            <Button variant="ghost" size="icon" className="hidden sm:flex text-[var(--color-text-secondary)] hover:text-[var(--color-primary)] h-12 w-12">
              <HelpCircle className="h-5 w-5" />
              <span className="sr-only">Help</span>
            </Button>
          </Link>
          <Link href="/cart">
            <Button variant="ghost" size="icon" className="relative h-12 w-12">
              <ShoppingBag className="h-5 w-5" />
              {cartItems.length > 0 && (
                <span className="absolute top-2 right-2 h-4 w-4 flex items-center justify-center rounded-full bg-[var(--color-primary)] text-[10px] text-white font-bold animate-in zoom-in">
                  {cartItems.length}
                </span>
              )}
              <span className="sr-only">Cart</span>
            </Button>
          </Link>
          <Button variant="ghost" size="icon" className="relative h-12 w-12">
            <Bell className="h-5 w-5" />
            <span className="absolute top-2 right-2 h-2 w-2 rounded-full bg-[var(--color-error)] border-2 border-[var(--color-background)]"></span>
            <span className="sr-only">Notifications</span>
          </Button>
          <Link href="/profile">
            <Button variant="ghost" size="icon" className="hidden sm:flex rounded-full bg-[var(--color-accent)]/10 text-[var(--color-accent)] hover:bg-[var(--color-accent)]/20 h-12 w-12">
              <User className="h-5 w-5" />
              <span className="sr-only">Profile</span>
            </Button>
          </Link>
          <Link href="/owner/upload">
            <Button className="hidden sm:flex h-12 rounded-full px-6 text-sm font-semibold">
              List Item
            </Button>
          </Link>
        </div>
      </div>
    </header>
  );
}
