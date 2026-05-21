"use client";

import { useEffect, useState } from "react";

interface BeforeInstallPromptEvent extends Event {
  prompt(): Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

export default function PWAInstall() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [show, setShow] = useState(false);

  useEffect(() => {
    // Register service worker
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker.register("/sw.js").catch(() => {});
    }

    // Check if already dismissed
    if (localStorage.getItem("pwa-dismissed")) return;
    // Don't show if already installed
    if (window.matchMedia("(display-mode: standalone)").matches) return;

    const handler = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      // Slight delay so it doesn't pop immediately
      setTimeout(() => setShow(true), 3000);
    };

    window.addEventListener("beforeinstallprompt", handler);
    return () => window.removeEventListener("beforeinstallprompt", handler);
  }, []);

  async function handleInstall() {
    if (!deferredPrompt) return;
    await deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === "accepted") setShow(false);
    setDeferredPrompt(null);
  }

  function handleDismiss() {
    setShow(false);
    localStorage.setItem("pwa-dismissed", "1");
  }

  if (!show) return null;

  return (
    <div className="fixed bottom-[4.5rem] sm:bottom-4 left-4 right-4 z-30 animate-slide-up">
      <div className="bg-[#1A1A1A] text-white flex items-center gap-3 px-4 py-3 shadow-2xl">
        <span className="text-xl shrink-0">📱</span>
        <div className="flex-1 min-w-0">
          <p className="text-xs font-bold leading-tight">أضف ASO CLO للشاشة الرئيسية</p>
          <p className="text-[10px] text-white/60 mt-0.5">وصول سريع زي app حقيقي</p>
        </div>
        <div className="flex gap-2 shrink-0">
          <button
            onClick={handleInstall}
            className="px-3 py-1.5 bg-white text-[#1A1A1A] text-[10px] font-black tracking-wide"
          >
            تثبيت
          </button>
          <button
            onClick={handleDismiss}
            className="text-white/50 hover:text-white text-lg leading-none px-1"
          >
            ✕
          </button>
        </div>
      </div>
    </div>
  );
}
