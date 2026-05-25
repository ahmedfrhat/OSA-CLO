"use client";

import { useTheme } from "next-themes";
import { useEffect, useState, useRef } from "react";

export default function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const btnRef = useRef<HTMLButtonElement>(null);

  useEffect(() => setMounted(true), []);
  if (!mounted) return <div className="w-9 h-9" />;

  const isDark = theme === "dark";

  function handleToggle() {
    const btn = btnRef.current;
    if (!btn) { setTheme(isDark ? "light" : "dark"); return; }

    const rect    = btn.getBoundingClientRect();
    const originX = rect.left + rect.width  / 2;
    const originY = rect.top  + rect.height / 2;

    const maxDist = Math.hypot(
      Math.max(originX, window.innerWidth  - originX),
      Math.max(originY, window.innerHeight - originY)
    );
    const diameter   = maxDist * 2 + 50;
    const nextTheme  = isDark ? "light" : "dark";
    const rippleColor = nextTheme === "dark" ? "#0A0A0A" : "#FAF9F6";

    const ripple = document.createElement("div");
    ripple.style.cssText = `
      position: fixed;
      z-index: 99990;
      border-radius: 50%;
      pointer-events: none;
      background: ${rippleColor};
      width:  ${diameter}px;
      height: ${diameter}px;
      left:  ${originX - diameter / 2}px;
      top:   ${originY - diameter / 2}px;
      transform: scale(0);
      transition: transform 0.65s cubic-bezier(0.22, 1, 0.36, 1);
    `;
    document.body.appendChild(ripple);

    requestAnimationFrame(() => {
      requestAnimationFrame(() => { ripple.style.transform = "scale(1)"; });
    });

    setTimeout(() => { setTheme(nextTheme); }, 320);

    setTimeout(() => {
      ripple.style.transition = "opacity 0.2s ease";
      ripple.style.opacity = "0";
      setTimeout(() => ripple.remove(), 200);
    }, 700);
  }

  return (
    <button
      ref={btnRef}
      onClick={handleToggle}
      aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
      className="
        relative w-9 h-9 rounded-sm
        flex items-center justify-center
        text-brand-black dark:text-offwhite
        hover:bg-brand-black/5 dark:hover:bg-offwhite/10
        active:scale-95
        transition-all duration-200
        focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-accent
      "
    >
      {/* Sun */}
      <svg
        className={`absolute w-5 h-5 transition-all duration-300 ${
          isDark ? "opacity-0 rotate-90 scale-50" : "opacity-100 rotate-0 scale-100"
        }`}
        xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
        stroke="currentColor" strokeWidth={1.5}
      >
        <circle cx="12" cy="12" r="4" />
        <path d="M12 2v2M12 20v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M2 12h2M20 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" />
      </svg>

      {/* Moon */}
      <svg
        className={`absolute w-5 h-5 transition-all duration-300 ${
          isDark ? "opacity-100 rotate-0 scale-100" : "opacity-0 -rotate-90 scale-50"
        }`}
        xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
        stroke="currentColor" strokeWidth={1.5}
      >
        <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
      </svg>
    </button>
  );
}
