"use client";
// src/components/ProductCard.tsx
// Features: 1 (hover zoom), 4 (micro-interactions), 8 (RTL), 9 (mobile)

import Image from "next/image";
import { useState } from "react";
import { useLang } from "@/context/LanguageContext";

export interface Product {
  id: string;
  name_en: string;
  name_ar?: string;
  price: number;
  original_price?: number;
  image_url?: string;
  image_urls?: string[];
  category?: string;
  is_new?: boolean;
  in_stock?: boolean;
}

interface Props {
  product: Product;
  onAddToCart?: (product: Product) => void;
  onClick?: (product: Product) => void;
}

export default function ProductCard({ product, onAddToCart, onClick }: Props) {
  const { lang, isRTL, t } = useLang();
  const [imgLoaded, setImgLoaded] = useState(false);
  const [hovered, setHovered] = useState(false);

  const name = lang === "ar" && product.name_ar ? product.name_ar : product.name_en;
  const isOutOfStock = product.in_stock === false;
  const discount =
    product.original_price && product.original_price > product.price
      ? Math.round(((product.original_price - product.price) / product.original_price) * 100)
      : null;

  // Use second image on hover if available
  const primaryImg = product.image_url || product.image_urls?.[0];
  const hoverImg = product.image_urls?.[1];
  const displayImg = hovered && hoverImg ? hoverImg : primaryImg;

  return (
    <article
      dir={isRTL ? "rtl" : "ltr"}
      className={`
        group relative flex flex-col
        bg-white dark:bg-brand-gray
        border border-brand-border dark:border-brand-border/20
        rounded-sm overflow-hidden
        card-hover
        cursor-pointer
        ${isOutOfStock ? "opacity-70" : ""}
      `}
      onClick={() => onClick?.(product)}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* ── Image Wrapper — Feature 1: Hover Zoom ── */}
      <div className="relative aspect-[3/4] overflow-hidden bg-brand-border/10">
        {primaryImg ? (
          <>
            {/* Skeleton */}
            {!imgLoaded && (
              <div className="absolute inset-0 bg-brand-border/20 animate-pulse" />
            )}
            {/* Image — scale-110 on group hover */}
            <Image
              src={displayImg || primaryImg}
              alt={name}
              fill
              sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
              className={`
                object-cover
                transition-transform duration-500 ease-out
                group-hover:scale-110
                ${imgLoaded ? "opacity-100" : "opacity-0"}
              `}
              onLoad={() => setImgLoaded(true)}
            />
          </>
        ) : (
          /* Placeholder */
          <div className="absolute inset-0 flex items-center justify-center bg-brand-border/10">
            <svg className="w-12 h-12 text-brand-border" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <rect x="3" y="3" width="18" height="18" rx="2" />
              <circle cx="8.5" cy="8.5" r="1.5" />
              <path d="m21 15-5-5L5 21" />
            </svg>
          </div>
        )}

        {/* Badges */}
        <div className={`absolute top-2 flex flex-col gap-1 ${isRTL ? "right-2" : "left-2"}`}>
          {product.is_new && (
            <span className="px-2 py-0.5 text-[10px] font-bold tracking-wider bg-brand-accent text-brand-black">
              {t("prod_new")}
            </span>
          )}
          {discount && (
            <span className="px-2 py-0.5 text-[10px] font-bold tracking-wider bg-red-500 text-white">
              -{discount}%
            </span>
          )}
          {isOutOfStock && (
            <span className="px-2 py-0.5 text-[10px] font-bold tracking-wider bg-brand-gray/80 text-white dark:bg-offwhite/80 dark:text-brand-black">
              {t("prod_sold_out")}
            </span>
          )}
        </div>

        {/* Quick Add — appears on hover */}
        {!isOutOfStock && onAddToCart && (
          <div className={`
            absolute bottom-0 left-0 right-0
            translate-y-full group-hover:translate-y-0
            transition-transform duration-300 ease-out
          `}>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onAddToCart(product);
              }}
              className="
                w-full py-3 text-xs font-bold tracking-widest uppercase
                bg-brand-black/90 dark:bg-offwhite/90
                text-offwhite dark:text-brand-black
                backdrop-blur-sm
                hover:bg-brand-accent hover:text-brand-black
                active:scale-95
                transition-all duration-200
                ripple-container
              "
            >
              {t("prod_add_to_cart")}
            </button>
          </div>
        )}
      </div>

      {/* ── Product Info ── */}
      <div className="flex-1 p-3 flex flex-col gap-1.5">
        {/* Category label */}
        {product.category && (
          <p className="text-[10px] font-semibold tracking-widest uppercase text-brand-muted">
            {product.category}
          </p>
        )}

        {/* Name */}
        <h3 className="text-sm font-semibold leading-tight text-brand-black dark:text-offwhite line-clamp-2">
          {name}
        </h3>

        {/* Price */}
        <div className={`flex items-center gap-2 mt-auto pt-1 ${isRTL ? "flex-row-reverse justify-end" : "flex-row"}`}>
          <span className="text-sm font-bold text-brand-black dark:text-offwhite">
            {product.price.toLocaleString()} {lang === "ar" ? "ج.م" : "EGP"}
          </span>
          {product.original_price && product.original_price > product.price && (
            <span className="text-xs text-brand-muted line-through">
              {product.original_price.toLocaleString()}
            </span>
          )}
        </div>
      </div>
    </article>
  );
}
