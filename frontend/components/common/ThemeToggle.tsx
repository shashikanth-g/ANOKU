"use client";

import { useState, useEffect } from "react";
import { Moon, Sun } from "lucide-react";
import { Button } from "@/components/common/Button";

export function ThemeToggle() {
  const [mounted, setMounted] = useState(false);
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    setMounted(true);
    const current = document.documentElement.classList.contains("dark");
    setIsDark(current);
  }, []);

  if (!mounted) {
    return (
      <Button variant="ghost" size="icon" className="rounded-full hover:bg-[var(--color-primary)]/10 invisible">
        <Moon className="h-5 w-5 text-[var(--color-primary)]" />
        <span className="sr-only">Toggle theme</span>
      </Button>
    );
  }

  const toggleTheme = () => {
    const root = document.documentElement;

    if (root.classList.contains("dark")) {
      root.classList.remove("dark");
      localStorage.setItem("theme", "light");
      setIsDark(false);
    } else {
      root.classList.add("dark");
      localStorage.setItem("theme", "dark");
      setIsDark(true);
    }
  };

  return (
    <Button variant="ghost" size="icon" onClick={toggleTheme} className="rounded-full hover:bg-[var(--color-primary)]/10">
      {isDark ? <Sun className="h-5 w-5 text-[var(--color-accent)]" /> : <Moon className="h-5 w-5 text-[var(--color-primary)]" />}
      <span className="sr-only">Toggle theme</span>
    </Button>
  );
}
