"use client";

import { useState, useMemo, useEffect, useCallback, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { useLanguage } from "@/context/LanguageContext";
import { useCart } from "@/context/CartContext";
import { useToast } from "@/context/ToastContext";
import { supabase } from "@/lib/supabase";

// ── Types ─────────────────────────────────────────────────────────────────────
export interface StorefrontProduct {
  id: string;
  partner_id: string;
  name_en: string;
  name_ar?: string | null;
  description?: string | null;
  category?: string | null;
  selling_price: number;
  sizes?: string[] | null;
  stock_quantity: number;
  image_url?: string | null;
  image_urls?: string[] | null;
  is_available?: boolean;
  in_stock?: boolean;
}

interface Props {
  products: StorefrontProduct[];
  categories: string[];
}

const WA_NUMBER = "201038856486";

// ── Helpers ───────────────────────────────────────────────────────────────────
/** Add a cache-busting timestamp to Supabase image URLs so updates show immediately */
function bustImageCache(url: string | null | undefined): string | undefined {
  if (!url) return undefined;
  // Only bust Supabase storage URLs — not Unsplash or other CDNs
  if (url.includes("supabase.co/storage")) {
    const separator = url.includes("?") ? "&" : "?";
    return `${url}${separator}v=${Math.floor(Date.now() / 60000)}`; // rotates every minute
  }
  return url;
}

// ── Main Client Component ─────────────────────────────────────────────────────
export default function StorefrontClient({ products: initialProducts, categories: initialCategories }: Props) {
  const { t, lang, isRTL } = useLanguage();
  const { addItem }        = useCart();
  const { success, info }  = useToast();

  const [products,  setProducts]  = useState<StorefrontProduct[]>(initialProducts);
  const [search,    setSearch]    = useState("");
  const [category,  setCategory]  = useState("all");
  const [mounted,   setMounted]   = useState(false);
  const channelRef = useRef<ReturnType<typeof supabase.channel> | null>(null);

  useEffect(() => { setMounted(true); }, []);

  // ── Supabase Realtime Subscription ─────────────────────────────────────────
  useEffect(() => {
    // Subscribe to all changes on the products table
    const channel = supabase
      .channel("storefront-products-realtime")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "products" },
        (payload) => {
          const { eventType, new: newRecord, old: oldRecord } = payload;

          setProducts((prev) => {
            switch (eventType) {
              case "INSERT": {
                const inserted = newRecord as StorefrontProduct;
                // Only show if available and in stock
                if (!inserted.is_available || !inserted.in_stock) return prev;
                // Avoid duplicates
                if (prev.some((p) => p.id === inserted.id)) return prev;
                return [inserted, ...prev];
              }

              case "UPDATE": {
                const updated = newRecord as StorefrontProduct;
                // If product is no longer available/in-stock, remove from list
                if (!updated.is_available || !updated.in_stock) {
                  return prev.filter((p) => p.id !== updated.id);
                }
                // Otherwise update in place
                return prev.map((p) => (p.id === updated.id ? { ...p, ...updated } : p));
              }

              case "DELETE": {
                const deleted = oldRecord as { id: string };
                return prev.filter((p) => p.id !== deleted.id);
              }

              default:
                return prev;
            }
          });
        }
      )
      .subscribe();

    channelRef.current = channel;

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  // Derived categories (recalculated when products update via realtime)
  const categories = useMemo(() => {
    return Array.from(
      new Set(products.map((p) => p.category).filter((c): c is string => Boolean(c)))
    );
  }, [products]);

  const filtered = useMemo(() => {
    const q = search.toLowerCase().trim();
    return products.filter((p) => {
      if (!p.is_available || !p.in_stock) return false;
      const matchQ = !q ||
        p.name_en.toLowerCase().includes(q) ||
        (p.name_ar?.includes(search) ?? false) ||
        (p.category?.toLowerCase().includes(q) ?? false);
      const matchC = category === "all" || p.category === category;
      return matchQ && matchC;
    });
  }, [products, search, category]);

  const handleShare = useCallback(async (p: StorefrontProduct) => {
    const url  = `${window.location.origin}/product/${p.id}`;
    const name = lang === "ar" && p.name_ar ? p.name_ar : p.name_en;
    if (typeof navigator !== "undefined" && "share" in navigator) {
      try { await navigator.share({ title: name, url }); return; } catch { /* user cancelled */ }
    }
    await navigator.clipboard.writeText(url);
    info(t("storefront.products.linkCopied"));
  }, [lang, t, info]);

  // Skeleton loading
  if (!mounted) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i}>
              <div className="aspect-[3/4] skeleton mb-3" />
              <div className="h-3.5 skeleton mb-2 w-3/4 rounded" />
              <div className="h-3.5 skeleton w-1/2 rounded" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div dir={isRTL ? "rtl" : "ltr"}>
      {/* ── Sticky Search + Category Bar ── */}
      <div className="sticky top-14 z-30 bg-white/95 backdrop-blur-md border-b border-gray-100 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex flex-col sm:flex-row gap-3">

          {/* Search */}
          <div className="relative flex-1">
            <svg className={`absolute top-1/2 -translate-y-1/2 ${isRTL ? "right-3" : "left-3"} w-4 h-4 text-gray-400`}
              xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <circle cx="11" cy="11" r="8" strokeWidth="2"/><path d="m21 21-4.35-4.35" strokeWidth="2" strokeLinecap="round"/>
            </svg>
            <input
              type="search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder={t("storefront.search.placeholder")}
              className={`w-full border border-gray-200 ${isRTL ? "pr-9 pl-4" : "pl-9 pr-4"} py-2.5 text-xs focus:outline-none focus:border-[#1A1A1A] transition-colors`}
            />
            {search && (
              <button
                onClick={() => setSearch("")}
                className={`absolute top-1/2 -translate-y-1/2 ${isRTL ? "left-3" : "right-3"} text-gray-300 hover:text-gray-600`}
              >✕</button>
            )}
          </div>

          {/* Category Tabs */}
          <div className="flex gap-1 overflow-x-auto scrollbar-hide pb-0.5">
            {["all", ...categories].map((cat) => (
              <button
                key={cat}
                onClick={() => setCategory(cat)}
                className={`shrink-0 px-4 py-2 text-[10px] font-bold tracking-[0.1em] uppercase border whitespace-nowrap transition-all
                  ${category === cat
                    ? "bg-[#1A1A1A] text-white border-[#1A1A1A]"
                    : "border-gray-200 text-gray-500 hover:border-gray-400"
                  }`}
              >
                {cat === "all" ? t("storefront.categories.all") : cat}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ── Product Grid ── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        {filtered.length === 0 ? (
          <div className="py-24 text-center">
            <p className="text-2xl mb-3">🔍</p>
            <p className="text-sm font-semibold text-gray-400">{t("storefront.search.noResults")}</p>
            {search && (
              <button onClick={() => setSearch("")}
                className="mt-4 text-xs text-gray-400 underline hover:text-[#1A1A1A]">
                {t("storefront.search.clear")}
              </button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
            {filtered.map((p, idx) => (
              <div key={`${p.id}-${p.image_url ?? "no-img"}`} className="product-grid-item" style={{ animationDelay: `${Math.min(idx * 40, 320)}ms` }}>
                <ProductCard
                  product={p}
                  lang={lang}
                  isRTL={isRTL}
                  t={t}
                  onShare={handleShare}
                  onAdd={(item) => { addItem(item); success("✓ " + (lang === "ar" && p.name_ar ? p.name_ar : p.name_en) + " — added to cart"); }}
                />
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ── Footer ── */}
      <footer className="border-t border-gray-100 bg-white mt-8">
        <div className="max-w-7xl mx-auto px-6 py-10 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs font-black tracking-[0.2em] text-[#1A1A1A]">ASO CLO.</p>
          <div className="flex gap-6">
            <Link href="/track" className="text-xs text-gray-400 hover:text-[#1A1A1A] transition-colors">
              {t("storefront.footer.track")}
            </Link>
            <a href={`https://wa.me/${WA_NUMBER}`} target="_blank" rel="noreferrer"
              className="text-xs text-gray-400 hover:text-green-600 transition-colors">
              WhatsApp
            </a>
          </div>
          <p className="text-[10px] text-gray-300">{t("storefront.footer.copyright")}</p>
        </div>
      </footer>
    </div>
  );
}

// ── Product Card ──────────────────────────────────────────────────────────────
function ProductCard({
  product, lang, isRTL, t, onShare, onAdd,
}: {
  product: StorefrontProduct;
  lang: string;
  isRTL: boolean;
  t: (k: string) => string;
  onShare: (p: StorefrontProduct) => void;
  onAdd: (item: import("@/context/CartContext").CartItem) => void;
}) {
  const displayName = lang === "ar" && product.name_ar ? product.name_ar : product.name_en;
  const isLowStock  = product.stock_quantity > 0 && product.stock_quantity < 5;
  const hasSizes    = (product.sizes?.length ?? 0) > 0;
  // Cache-busted image URL — ensures newly uploaded images show immediately
  const imageSrc    = bustImageCache(product.image_url);

  function quickAdd() {
    if (hasSizes) return;
    onAdd({
      productId: product.id,
      partnerId: product.partner_id,
      nameEn:    product.name_en,
      nameAr:    product.name_ar ?? undefined,
      price:     product.selling_price,
      imageUrl:  product.image_url ?? undefined,
      size:      "",
      quantity:  1,
    });
  }

  return (
    <div className="group flex flex-col" dir={isRTL ? "rtl" : "ltr"}>
      {/* Image */}
      <Link href={`/product/${product.id}`} className="block relative overflow-hidden bg-gray-100 aspect-[3/4]">
        {imageSrc ? (
          <Image
            src={imageSrc}
            alt={displayName}
            fill
            sizes="(max-width:640px) 50vw, (max-width:1024px) 33vw, 25vw"
            className="object-cover group-hover:scale-[1.04] transition-transform duration-500"
            unoptimized={imageSrc.includes("supabase.co")} // skip next/image optimization for Supabase CDN URLs
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
            <span className="text-2xl font-black text-gray-300">{displayName.slice(0, 2).toUpperCase()}</span>
          </div>
        )}

        {/* Badges */}
        <div className={`absolute top-2 ${isRTL ? "right-2" : "left-2"} flex flex-col gap-1`}>
          {isLowStock && (
            <span className="bg-orange-500 text-white text-[9px] font-bold px-2 py-0.5 tracking-wide">
              {t("storefront.products.onlyLeft").replace("{{n}}", String(product.stock_quantity))}
            </span>
          )}
          {hasSizes && (
            <span className="bg-[#1A1A1A] text-white text-[9px] font-bold px-2 py-0.5 tracking-wide">
              {t("storefront.products.preorderBadge")}
            </span>
          )}
        </div>

        {/* Share Button */}
        <button
          onClick={(e) => { e.preventDefault(); e.stopPropagation(); onShare(product); }}
          className={`absolute top-2 ${isRTL ? "left-2" : "right-2"} w-7 h-7 bg-white/90 backdrop-blur flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-white shadow-sm`}
          title={t("storefront.products.share")}
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/>
            <line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/>
          </svg>
        </button>
      </Link>

      {/* Info */}
      <div className="pt-3 flex-1 flex flex-col gap-1.5">
        <Link href={`/product/${product.id}`} className="hover:underline underline-offset-2">
          <h3 className="text-xs font-bold text-[#1A1A1A] leading-tight line-clamp-2">{displayName}</h3>
        </Link>

        {product.category && (
          <p className="text-[10px] text-gray-400 uppercase tracking-wide">{product.category}</p>
        )}

        <div className="flex items-center justify-between mt-auto pt-1">
          <p className="text-sm font-black text-[#1A1A1A] font-mono tracking-tight">
            EGP {product.selling_price.toLocaleString("en-EG")}
          </p>

          {hasSizes ? (
            <Link href={`/product/${product.id}`}
              className="text-[10px] font-bold tracking-wide border border-[#1A1A1A] text-[#1A1A1A] px-3 py-1.5 hover:bg-[#1A1A1A] hover:text-white transition-all">
              {t("storefront.products.selectSize")}
            </Link>
          ) : (
            <button onClick={quickAdd}
              className="text-[10px] font-bold tracking-wide border border-[#1A1A1A] text-[#1A1A1A] px-3 py-1.5 hover:bg-[#1A1A1A] hover:text-white transition-all">
              {t("storefront.products.addToCart")}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
