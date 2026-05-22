"use client";

import { useEffect, useState, useCallback } from "react";
import { createContext, useContext } from "react";

// ── Types ─────────────────────────────────────────────────────────────────────
type ToastType = "success" | "error" | "info" | "warning";

interface Toast {
  id: string;
  message: string;
  type: ToastType;
}

interface ToastContextType {
  toast: (message: string, type?: ToastType) => void;
  success: (message: string) => void;
  error:   (message: string) => void;
  info:    (message: string) => void;
  warning: (message: string) => void;
}

// ── Context ───────────────────────────────────────────────────────────────────
const ToastContext = createContext<ToastContextType | null>(null);

const ICONS: Record<ToastType, string> = {
  success: "✓",
  error:   "✕",
  info:    "ℹ",
  warning: "⚠",
};

const COLORS: Record<ToastType, string> = {
  success: "bg-[#1A1A1A] text-white border-[#1A1A1A]",
  error:   "bg-red-600 text-white border-red-600",
  info:    "bg-blue-600 text-white border-blue-600",
  warning: "bg-orange-500 text-white border-orange-500",
};

// ── Provider ──────────────────────────────────────────────────────────────────
export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const remove = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const toast = useCallback((message: string, type: ToastType = "success") => {
    const id = `${Date.now()}-${Math.random()}`;
    setToasts((prev) => [...prev.slice(-4), { id, message, type }]); // max 5
    setTimeout(() => remove(id), 3200);
  }, [remove]);

  const success = useCallback((m: string) => toast(m, "success"), [toast]);
  const error   = useCallback((m: string) => toast(m, "error"),   [toast]);
  const info    = useCallback((m: string) => toast(m, "info"),     [toast]);
  const warning = useCallback((m: string) => toast(m, "warning"), [toast]);

  return (
    <ToastContext.Provider value={{ toast, success, error, info, warning }}>
      {children}

      {/* ── Toast Container ── */}
      <div
        aria-live="polite"
        aria-label="Notifications"
        className="fixed bottom-6 right-4 z-[200] flex flex-col gap-2 items-end pointer-events-none"
        style={{ maxWidth: "calc(100vw - 2rem)" }}
      >
        {toasts.map((t) => (
          <ToastItem key={t.id} toast={t} onClose={() => remove(t.id)} />
        ))}
      </div>
    </ToastContext.Provider>
  );
}

// ── Toast Item ────────────────────────────────────────────────────────────────
function ToastItem({ toast: t, onClose }: { toast: Toast; onClose: () => void }) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    // Trigger enter animation
    const raf = requestAnimationFrame(() => setVisible(true));
    return () => cancelAnimationFrame(raf);
  }, []);

  return (
    <div
      className={`pointer-events-auto flex items-center gap-3 px-4 py-3 shadow-lg border
        text-sm font-medium tracking-wide max-w-xs transition-all duration-300
        ${COLORS[t.type]}
        ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}
      style={{ willChange: "transform, opacity" }}
    >
      {/* Icon */}
      <span className="w-5 h-5 flex items-center justify-center shrink-0 font-black text-xs">
        {ICONS[t.type]}
      </span>

      {/* Message */}
      <span className="text-xs leading-snug flex-1">{t.message}</span>

      {/* Close */}
      <button
        onClick={onClose}
        className="opacity-60 hover:opacity-100 ml-1 text-xs shrink-0 transition-opacity"
        aria-label="Dismiss"
      >✕</button>
    </div>
  );
}

// ── Hook ──────────────────────────────────────────────────────────────────────
export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error("useToast must be used within <ToastProvider>");
  return ctx;
}
