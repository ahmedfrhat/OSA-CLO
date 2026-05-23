"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { usePathname } from "next/navigation";
import { useLanguage } from "@/context/LanguageContext";
import { useCart } from "@/context/CartContext";

export default function Header() {
  const pathname = usePathname();
  const { t, lang, setLang, isRTL } = useLanguage();
  const { count, setIsOpen } = useCart();
  const [menuOpen, setMenuOpen] = useState(false);

  if (pathname?.startsWith("/admin")) return null;

  const NAV_LINKS = [
    { label: t("nav.shop"),        href: "/" },
    { label: t("nav.collections"), href: "/#collections" },
    { label: t("storefront.footer.track"), href: "/track" },
  ];

  return (
    <header
      className="w-full bg-[#FAF9F6] border-b border-[#E8E8E5] sticky top-0 z-50"
      dir={isRTL ? "rtl" : "ltr"}
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-10 h-[72px] flex items-center justify-between">

        {/* ── Logo ── */}
        <Link href="/" className="flex items-center shrink-0 group">
          <Image
            src="/aso-logo.png"
            alt="ASO CLO"
            width={160}
            height={0}
            style={{ height: "auto" }}
            priority
            className="transition-opacity duration-300 group-hover:opacity-70"
          />
        </Link>

        {/* ── Desktop Navigation ── */}
        <nav className="hidden md:flex items-center gap-8">
          {NAV_LINKS.map(({ label, href }) => (
            <Link
              key={href}
              href={href}
              className="text-[#1A1A1A] text-[13px] font-medium tracking-[0.12em] uppercase
                         relative after:absolute after:bottom-[-2px] after:left-0 after:w-0
                         after:h-[1px] after:bg-[#1A1A1A] after:transition-all after:duration-300
                         hover:after:w-full transition-colors duration-200"
            >
              {label}
            </Link>
          ))}
        </nav>

        {/* ── Right Controls ── */}
        <div className="flex items-center gap-5">

          {/* Language Toggle — connected to LanguageContext */}
          <button
            onClick={() => setLang(lang === "en" ? "ar" : "en")}
            className="flex items-center gap-1 text-[#1A1A1A] text-[11px] font-semibold
                       tracking-[0.15em] uppercase border border-[#1A1A1A]/20 rounded-full
                       px-3 py-1.5 hover:bg-[#1A1A1A] hover:text-[#FAF9F6]
                       transition-all duration-250 select-none"
            aria-label="Toggle language"
          >
            <span className={lang === "en" ? "opacity-100" : "opacity-40"}>EN</span>
            <span className="opacity-30 mx-0.5">|</span>
            <span className={lang === "ar" ? "opacity-100" : "opacity-40"}>AR</span>
          </button>

          {/* Cart Button — opens drawer */}
          <button
            onClick={() => setIsOpen(true)}
            className="relative flex items-center justify-center w-9 h-9 rounded-full
                       hover:bg-[#1A1A1A]/6 transition-colors duration-200"
            aria-label="Shopping cart"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#1A1A1A" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
              <line x1="3" y1="6" x2="21" y2="6" />
              <path d="M16 10a4 4 0 0 1-8 0" />
            </svg>
            {count > 0 && (
              <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-[#1A1A1A]
                               text-[#FAF9F6] text-[9px] font-bold rounded-full
                               flex items-center justify-center">
                {count}
              </span>
            )}
          </button>

          {/* Mobile Hamburger */}
          <button
            className="md:hidden flex flex-col gap-[5px] w-6 cursor-pointer"
            onClick={() => setMenuOpen((prev) => !prev)}
            aria-label="Toggle menu"
            aria-expanded={menuOpen}
          >
            <span className={`block h-[1.5px] bg-[#1A1A1A] transition-all duration-300 origin-center ${menuOpen ? "rotate-45 translate-y-[6.5px]" : ""}`} />
            <span className={`block h-[1.5px] bg-[#1A1A1A] transition-all duration-300 ${menuOpen ? "opacity-0 scale-x-0" : ""}`} />
            <span className={`block h-[1.5px] bg-[#1A1A1A] transition-all duration-300 origin-center ${menuOpen ? "-rotate-45 -translate-y-[6.5px]" : ""}`} />
          </button>
        </div>
      </div>

      {/* ── Mobile Menu Drawer ── */}
      <div className={`md:hidden overflow-hidden transition-all duration-400 ease-in-out ${menuOpen ? "max-h-64 border-t border-[#E8E8E5]" : "max-h-0"}`}>
        <nav className="flex flex-col px-6 py-4 gap-4 bg-[#FAF9F6]">
          {NAV_LINKS.map(({ label, href }) => (
            <Link
              key={href}
              href={href}
              onClick={() => setMenuOpen(false)}
              className="text-[#1A1A1A] text-[13px] font-medium tracking-[0.12em]
                         uppercase py-2 border-b border-[#E8E8E5]/60 last:border-0
                         hover:opacity-60 transition-opacity duration-200"
            >
              {label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}
