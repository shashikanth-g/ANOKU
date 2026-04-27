"use client";

import { useEffect, useState } from "react";
import { Download } from "lucide-react";
import { Button } from "./common/Button";

export function PWAHandler() {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [isInstallable, setIsInstallable] = useState(false);

  useEffect(() => {
    // Register Service Worker
    if ("serviceWorker" in navigator) {
      window.addEventListener("load", () => {
        navigator.serviceWorker.register("/sw.js").then(
          (registration) => {
            console.log("SW registered: ", registration);
          },
          (registrationError) => {
            console.log("SW registration failed: ", registrationError);
          }
        );
      });
    }

    // Handle Install Prompt
    const handleBeforeInstallPrompt = (e: any) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setIsInstallable(true);
    };

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);

    return () => {
      window.removeEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
    };
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;

    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    
    if (outcome === "accepted") {
      setDeferredPrompt(null);
      setIsInstallable(false);
    }
  };

  if (!isInstallable) return null;

  return (
    <div className="fixed bottom-20 left-4 right-4 md:left-auto md:right-8 md:bottom-8 z-[60] animate-in slide-in-from-bottom-10 duration-500">
      <div className="bg-[var(--color-card)] border border-[var(--color-primary)]/20 shadow-2xl rounded-2xl p-4 flex items-center justify-between gap-4 max-w-sm ml-auto">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-[var(--color-primary)] flex items-center justify-center text-white font-bold shrink-0">
            A
          </div>
          <div>
            <p className="text-sm font-bold">Install ANOKU</p>
            <p className="text-[10px] text-[var(--color-text-secondary)]">Experience it as a native app</p>
          </div>
        </div>
        <Button size="sm" onClick={handleInstallClick} className="rounded-xl h-9 px-4 text-xs">
          <Download className="w-3.5 h-3.5 mr-2" />
          Install
        </Button>
      </div>
    </div>
  );
}
