"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { ChevronLeft } from "lucide-react";
import { Button } from "@/components/common/Button";

export function BackButton() {
  const router = useRouter();
  
  return (
    <Button 
      variant="ghost" 
      size="icon" 
      onClick={() => router.back()}
      className="fixed top-20 left-4 z-40 rounded-full glass shadow-lg border border-[var(--color-border)] md:top-24 md:left-8 hover:scale-110 active:scale-95 transition-all"
    >
      <ChevronLeft className="h-6 w-6 text-[var(--color-primary)]" />
      <span className="sr-only">Go back</span>
    </Button>
  );
}
