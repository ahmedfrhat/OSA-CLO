"use client";
// src/components/LangToggle.tsx
// Feature 8: Arabic/English toggle

import { useLang } from "@/context/LanguageContext";

export default function LangToggle() {
  const { lang, toggleLang } = useLang();

  return (
    <button
      onClick={toggleLang}
      aria-label={lang === "en" ? "Switch to Arabic" : "Switch to English"}
      className="
        px-3 py-1.5 text-xs font-semibold tracking-widest uppercase
        border border-current rounded-sm
        text-brand-black dark:text-offwhite
        hover:bg-brand-black hover:text-offwhite
        dark:hover:bg-offwhite dark:hover:text-brand-black
        active:scale-95
        transition-all duration-200
        focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-accent
        min-w-[52px]
      "
    >
      {lang === "en" ? "AR" : "EN"}
    </button>
  );
}
