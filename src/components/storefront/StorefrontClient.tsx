"use client";

import { useState, useMemo, useEffect, useCallback, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { useLanguage } from "@/context/LanguageContext";
import { useCart } from "@/context/CartContext";
import { useToast } from "@/context/ToastContext";
import { supabase } from "@/lib/supabase";
import FuzzySearch from "@/components/FuzzySearch";
import CategoryFilter from "@/components/CategoryFilter";
import Fuse from "fuse.js";

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
/** Return image URL as-is — each upload already gets a unique timestamped filename.
 *  We only need to bust cache when an image is replaced (URL changes automatically). */
function bustImageCache(url: string | null | undefined): string | undefined {
  if (!url) return undefined;
  return url;
}

// ── Main Client Component ─────────────────────────────────────────────────────
export default function StorefrontClient({ products: initialProducts }: Props) {
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



  const filtered = useMemo(() => {
    let result = products.filter(p => p.is_available && p.in_stock);

    // Category filter
    if (category !== "all") {
      result = result.filter((p) => p.category === category);
    }

    // Fuzzy search filter
    if (search.trim().length >= 2) {
      const fuse = new Fuse(result, {
        keys: ["name_en", "name_ar", "description", "category"],
        threshold: 0.4,
        minMatchCharLength: 2,
      });
      result = fuse.search(search).map((r) => r.item);
    } else if (search.trim().length > 0) {
      const q = search.toLowerCase().trim();
      result = result.filter(p => 
        p.name_en.toLowerCase().includes(q) || 
        (p.name_ar?.includes(q) ?? false)
      );
    }

    return result;
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
      {/* ── Search + Filter bar ── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-6 pb-2">
        <div className={`flex flex-col sm:flex-row gap-4 mb-4 ${isRTL ? "sm:flex-row-reverse" : ""}`}>
          {/* Feature 3: Fuzzy Search */}
          <div className="flex-1">
            <FuzzySearch
              products={products}
              onResultClick={(p) => setSearch(p.name_en)}
              placeholder_en="Search products..."
              placeholder_ar="ابحث عن المنتجات..."
            />
          </div>
        </div>

        {/* Feature 2: Category filter */}
        <div className="mb-4">
          <CategoryFilter
            activeCategory={category}
            onSelect={(cat) => {
              setCategory(cat);
              setSearch("");
            }}
          />
        </div>
        
        {/* Results count */}
        <p className="text-xs text-brand-muted mb-2 tracking-wider">
          {filtered.length} {lang === "ar" ? "منتج" : "products"}
          {category !== "all" && ` — ${category}`}
        </p>
      </div>

      {/* ── Product Grid ── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        {filtered.length === 0 ? (
          <div className="py-24 text-center">
            <p className="text-2xl mb-3">🔍</p>
            <p className="text-sm font-semibold text-gray-400">{t("storefront.search.noResults")}</p>
            {search && (
              <button onClick={() => setSearch("")}
                className="mt-4 text-xs text-gray-400 underline hover:text-brand-black dark:hover:text-offwhite">
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
      <footer className="border-t border-brand-border dark:border-brand-border/20 bg-white dark:bg-brand-black mt-8">
        <div className="max-w-7xl mx-auto px-6 py-10 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs font-black tracking-[0.2em] text-brand-black dark:text-offwhite">ASO CLO.</p>
          <div className="flex gap-6">
            <Link href="/track" className="text-xs text-gray-400 dark:text-gray-500 hover:text-brand-black dark:hover:text-offwhite dark:hover:text-offwhite transition-colors">
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
      <Link href={`/product/${product.id}`} className="block relative overflow-hidden bg-gray-100 dark:bg-brand-gray aspect-[3/4]">
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
          <div className="absolute inset-0 flex items-center justify-center bg-gray-100 dark:bg-brand-gray">
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
            <span className="bg-brand-black dark:bg-offwhite text-white dark:text-brand-black text-[9px] font-bold px-2 py-0.5 tracking-wide">
              {t("storefront.products.preorderBadge")}
            </span>
          )}
        </div>

        {/* Share Button */}
        <button
          onClick={(e) => { e.preventDefault(); e.stopPropagation(); onShare(product); }}
          className={`absolute top-2 ${isRTL ? "left-2" : "right-2"} w-7 h-7 bg-white/90 dark:bg-brand-gray/90 backdrop-blur flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-white shadow-sm`}
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
          <h3 className="text-xs font-bold text-brand-black dark:text-offwhite leading-tight line-clamp-2">{displayName}</h3>
        </Link>

        {product.category && (
          <p className="text-[10px] text-gray-400 uppercase tracking-wide">{product.category}</p>
        )}

        <div className="flex items-center justify-between mt-auto pt-1">
          <p className="text-sm font-black text-brand-black dark:text-offwhite font-mono tracking-tight">
            EGP {product.selling_price.toLocaleString("en-EG")}
          </p>

          {hasSizes ? (
            <Link href={`/product/${product.id}`}
              className="text-[10px] font-bold tracking-wide border border-brand-black dark:border-offwhite text-brand-black dark:text-offwhite px-3 py-1.5 hover:bg-brand-black dark:hover:bg-offwhite hover:text-white dark:hover:text-brand-black transition-all">
              {t("storefront.products.selectSize")}
            </Link>
          ) : (
            <button onClick={quickAdd}
              className="text-[10px] font-bold tracking-wide border border-brand-black dark:border-offwhite text-brand-black dark:text-offwhite px-3 py-1.5 hover:bg-brand-black dark:hover:bg-offwhite hover:text-white dark:hover:text-brand-black transition-all">
              {t("storefront.products.addToCart")}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
