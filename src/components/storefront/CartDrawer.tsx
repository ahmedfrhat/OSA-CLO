"use client";

import { useCart } from "@/context/CartContext";
import { useLanguage } from "@/context/LanguageContext";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import AnimatedNumber from "@/components/AnimatedNumber";

export default function CartDrawer() {
  const pathname = usePathname();
  const { items, isOpen, setIsOpen, removeItem, updateQty, total, count } = useCart();
  const { t, lang, isRTL } = useLanguage();

  if (pathname?.startsWith("/admin")) return null;
  if (!isOpen) return null;


  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm"
        onClick={() => setIsOpen(false)}
      />

      {/* Drawer */}
      <div
        dir={isRTL ? "rtl" : "ltr"}
        className={`fixed top-0 ${isRTL ? "left-0" : "right-0"} z-50 h-full w-full max-w-md bg-white dark:bg-brand-gray shadow-2xl flex flex-col
          ${isRTL ? "animate-slide-in-left" : "animate-slide-in-right"}`}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 dark:border-brand-border/10">
          <div>
            <h2 className="text-sm font-bold tracking-[0.1em] uppercase text-brand-black dark:text-offwhite">
              {t("storefront.cart.title")}
            </h2>
            {count > 0 && (
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                {count} {count === 1 ? t("storefront.cart.item") : t("storefront.cart.items")}
              </p>
            )}
          </div>
          <button
            onClick={() => setIsOpen(false)}
            className="w-8 h-8 flex items-center justify-center text-gray-500 dark:text-gray-400 hover:text-brand-black dark:hover:text-offwhite hover:bg-gray-100 dark:hover:bg-brand-black/50 transition-colors"
          >
            ✕
          </button>
        </div>

        {/* Items */}
        <div className="flex-1 overflow-y-auto">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full gap-4 px-6 py-12">
              <div className="w-16 h-16 bg-gray-100 dark:bg-brand-black rounded-full flex items-center justify-center text-2xl">🛍️</div>
              <p className="text-sm font-semibold text-gray-500 dark:text-gray-400">{t("storefront.cart.empty")}</p>
              <p className="text-xs text-gray-400 dark:text-gray-500 text-center">{t("storefront.cart.emptyDesc")}</p>
              <button
                onClick={() => setIsOpen(false)}
                className="mt-2 px-5 py-2.5 border border-gray-200 dark:border-brand-border/20 text-xs font-bold tracking-widest uppercase text-gray-500 dark:text-gray-400 hover:border-gray-400 hover:text-brand-black dark:hover:text-offwhite transition-all"
              >
                {t("storefront.cart.browse")}
              </button>
            </div>
          ) : (
            <ul className="divide-y divide-gray-50 dark:divide-brand-border/10 px-6">
              {items.map((item) => (
                <li key={`${item.productId}-${item.size}`} className="py-4 flex gap-3">
                  {/* Image */}
                  <div className="w-16 h-20 bg-gray-100 dark:bg-brand-black shrink-0 overflow-hidden">
                    {item.imageUrl ? (
                      <Image
                        src={item.imageUrl}
                        alt={item.nameEn}
                        width={64} height={80}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-[10px] font-bold text-gray-400 dark:text-gray-500">
                        {item.nameEn.slice(0, 2).toUpperCase()}
                      </div>
                    )}
                  </div>

                  {/* Details */}
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-bold text-brand-black dark:text-offwhite truncate">
                      {lang === "ar" && item.nameAr ? item.nameAr : item.nameEn}
                    </p>
                    {item.size && (
                      <p className="text-[10px] text-gray-500 dark:text-gray-400 mt-0.5 uppercase tracking-wide">
                        Size: {item.size}
                      </p>
                    )}
                    <p className="text-xs font-mono font-bold text-brand-black dark:text-offwhite mt-1">
                      EGP <AnimatedNumber value={item.price} duration={400} />
                    </p>

                    {/* Qty Controls */}
                    <div className="flex items-center gap-2 mt-2">
                      <button
                        onClick={() => updateQty(item.productId, item.size, item.quantity - 1)}
                        className="w-6 h-6 border border-gray-200 dark:border-brand-border/20 flex items-center justify-center text-gray-500 dark:text-gray-400 hover:border-gray-400 text-sm"
                      >−</button>
                      <span className="text-xs font-mono font-bold w-4 text-center">{item.quantity}</span>
                      <button
                        onClick={() => updateQty(item.productId, item.size, item.quantity + 1)}
                        className="w-6 h-6 border border-gray-200 dark:border-brand-border/20 flex items-center justify-center text-gray-500 dark:text-gray-400 hover:border-gray-400 text-sm"
                      >+</button>
                      <button
                        onClick={() => removeItem(item.productId, item.size)}
                        className="ml-auto text-[10px] text-gray-400 dark:text-gray-600 hover:text-red-500 transition-colors"
                      >
                        {t("storefront.cart.remove")}
                      </button>
                    </div>
                  </div>

                  {/* Line total */}
                  <div className="shrink-0 text-right">
                    <p className="text-xs font-mono font-bold text-brand-black dark:text-offwhite">
                      EGP <AnimatedNumber value={item.price * item.quantity} duration={500} />
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div className="border-t border-gray-100 dark:border-brand-border/10 px-6 py-5 space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold tracking-[0.1em] uppercase text-gray-500 dark:text-gray-400">
                {t("storefront.cart.total")}
              </span>
              <span className="text-base font-black text-brand-black dark:text-offwhite font-mono">
              <AnimatedNumber value={total} duration={500} prefix="EGP " />
              </span>
            </div>
            <CheckoutTrigger onClose={() => setIsOpen(false)} />
            <button
              onClick={() => setIsOpen(false)}
              className="w-full text-center text-xs text-gray-400 dark:text-gray-500 hover:text-brand-black dark:hover:text-offwhite py-1 transition-colors"
            >
              {t("storefront.cart.continueShopping")}
            </button>
          </div>
        )}
      </div>
    </>
  );
}

// Inline trigger to avoid circular imports
function CheckoutTrigger({ onClose }: { onClose: () => void }) {
  const { t } = useLanguage();
  return (
    <Link
      href="/checkout"
      onClick={onClose}
      className="w-full bg-brand-black dark:bg-offwhite text-white dark:text-brand-black py-4 text-xs font-bold tracking-[0.15em] uppercase flex items-center justify-center gap-2 hover:bg-[#333] dark:hover:bg-gray-100 transition-colors"
    >
      <span>🛒</span> {t("storefront.cart.checkout")}
    </Link>
  );
}
