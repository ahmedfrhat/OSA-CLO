"use client";

import { useEffect, useRef } from "react";

// ── Parallax hook — Desktop only (pointer: fine) ───────────────────────────
export function useParallax(strength = 0.3) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // تشتغل بس على desktop
    if (window.matchMedia("(pointer: coarse)").matches) return;

    const el = ref.current;
    if (!el) return;

    let ticking = false;

    function onScroll() {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        if (!el) return;
        const rect   = el.getBoundingClientRect();
        const center = window.innerHeight / 2;
        const offset = (rect.top + rect.height / 2 - center) * strength;
        // translateY بسالب عشان يتحرك للفوق لما تنزل
        el.style.transform = `translateY(${-offset}px)`;
        el.style.willChange = "transform";
        ticking = false;
      });
    }

    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll(); // initial call

    return () => window.removeEventListener("scroll", onScroll);
  }, [strength]);

  return ref;
}
