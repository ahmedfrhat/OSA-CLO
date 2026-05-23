"use client";
// src/components/LoadingSpinner.tsx
// Feature 5: Custom brand loading spinner using ASO CLO logo

import Image from "next/image";

interface Props {
  size?: "sm" | "md" | "lg" | "fullscreen";
  text?: string;
}

export default function LoadingSpinner({ size = "md", text }: Props) {
  const sizes = {
    sm: { wrapper: "w-8 h-8", logo: 24, orbit: "w-8 h-8" },
    md: { wrapper: "w-14 h-14", logo: 40, orbit: "w-14 h-14" },
    lg: { wrapper: "w-20 h-20", logo: 56, orbit: "w-20 h-20" },
    fullscreen: { wrapper: "w-20 h-20", logo: 56, orbit: "w-20 h-20" },
  };

  const s = sizes[size];

  const spinner = (
    <div className="flex flex-col items-center gap-4">
      {/* Orbit ring + logo */}
      <div className={`relative ${s.wrapper} flex items-center justify-center`}>
        {/* Rotating orbit ring */}
        <div
          className={`absolute ${s.orbit} rounded-full border border-brand-accent/30`}
          style={{ animation: "spin 2s linear infinite" }}
        />
        {/* Accent arc (top 90°) */}
        <div
          className={`absolute ${s.orbit} rounded-full`}
          style={{
            border: "1px solid transparent",
            borderTopColor: "#C8FF00",
            animation: "spin 1.4s cubic-bezier(0.4,0,0.6,1) infinite",
          }}
        />

        {/* Logo (pulsing) */}
        <div className="logo-spinner relative z-10">
          <Image
            src="/aso-logo.png"
            alt="ASO CLO"
            width={s.logo}
            height={s.logo}
            className="object-contain dark:invert-0 invert"
            priority
          />
        </div>
      </div>

      {/* Optional text */}
      {text && (
        <p className="text-xs tracking-widest uppercase text-brand-muted animate-pulse">
          {text}
        </p>
      )}
    </div>
  );

  if (size === "fullscreen") {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-offwhite dark:bg-brand-black">
        {spinner}
      </div>
    );
  }

  return spinner;
}

/* ── Page-level loading wrapper ──────────────────────────── */
export function PageLoader({ text = "Loading..." }: { text?: string }) {
  return (
    <div className="min-h-[60vh] flex items-center justify-center">
      <LoadingSpinner size="lg" text={text} />
    </div>
  );
}
