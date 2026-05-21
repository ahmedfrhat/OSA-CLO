"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";

// ── Premium ASO CLO Logo Loader ───────────────────────────────────────────────
// Shows a branded loader between page navigations.
// Uses a pure CSS SVG line-draw animation + dot bounce — no external dependencies.

export default function PageTransitionLoader() {
  const pathname         = usePathname();
  const [visible, setVisible] = useState(false);
  const [hiding,  setHiding]  = useState(false);
  const timerRef             = useRef<NodeJS.Timeout | null>(null);
  const prevPath             = useRef(pathname);

  useEffect(() => {
    // Show loader when pathname changes
    if (pathname !== prevPath.current) {
      prevPath.current = pathname;

      // Clear any pending timers
      if (timerRef.current) clearTimeout(timerRef.current);

      setHiding(false);
      setVisible(true);

      // Start hiding after content likely loaded (700ms feels premium)
      timerRef.current = setTimeout(() => {
        setHiding(true);
        timerRef.current = setTimeout(() => {
          setVisible(false);
          setHiding(false);
        }, 400); // matches fade-out duration
      }, 700);
    }

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [pathname]);

  if (!visible) return null;

  return (
    <div className={`aso-loader-overlay${hiding ? " hiding" : ""}`} aria-live="polite" aria-label="Loading">
      {/* ── ASO CLO Logo Mark ── */}
      <div className="flex flex-col items-center gap-6">
        {/* Minimalist SVG "A" logo mark with line-draw animation */}
        <svg
          width="56"
          height="56"
          viewBox="0 0 56 56"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          aria-hidden="true"
        >
          {/* Outer square */}
          <rect
            x="3" y="3" width="50" height="50"
            stroke="#1A1A1A"
            strokeWidth="2"
            fill="none"
            className="aso-logo-line"
            style={{ animationDelay: "0s" }}
          />
          {/* Inner "A" shape — left diagonal */}
          <line
            x1="14" y1="42"
            x2="28" y2="14"
            stroke="#1A1A1A"
            strokeWidth="2.5"
            strokeLinecap="round"
            className="aso-logo-line"
            style={{ animationDelay: "0.15s" }}
          />
          {/* Inner "A" shape — right diagonal */}
          <line
            x1="28" y1="14"
            x2="42" y2="42"
            stroke="#1A1A1A"
            strokeWidth="2.5"
            strokeLinecap="round"
            className="aso-logo-line"
            style={{ animationDelay: "0.3s" }}
          />
          {/* Cross bar */}
          <line
            x1="19" y1="32"
            x2="37" y2="32"
            stroke="#1A1A1A"
            strokeWidth="2"
            strokeLinecap="round"
            className="aso-logo-line"
            style={{ animationDelay: "0.5s" }}
          />
        </svg>

        {/* Brand name */}
        <p
          className="text-[10px] font-black tracking-[0.35em] uppercase text-[#1A1A1A] aso-logo-text"
          style={{ animationDelay: "0.5s" }}
        >
          ASO CLO
        </p>

        {/* Dot loader */}
        <div className="dot-loader" aria-hidden="true">
          <span />
          <span />
          <span />
        </div>
      </div>
    </div>
  );
}
