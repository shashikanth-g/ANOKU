"use client";

import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useAuthStore } from "@/store/authStore";

interface AuthGuardProps {
  children: React.ReactNode;
}

// Routes that require authentication
const PROTECTED_ROUTES = [
  "/bookings",
  "/owner/upload",
  "/admin",
  "/profile",
  "/cart",
  "/track"
];

export function AuthGuard({ children }: AuthGuardProps) {
  const { user, isAuthenticated } = useAuthStore();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const isProtectedRoute = PROTECTED_ROUTES.some(route => pathname.startsWith(route));
    
    if (isProtectedRoute && !isAuthenticated) {
      console.log("AuthGuard: Redirecting to login from", pathname);
      router.push(`/login?redirect=${encodeURIComponent(pathname)}`);
    }
  }, [isAuthenticated, pathname, router]);

  return <>{children}</>;
}
