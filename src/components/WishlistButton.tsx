"use client";

import { useWishlist } from "@/context/WishlistContext";
import { useLanguage } from "@/context/LanguageContext";

interface WishlistButtonProps {
  product: {
    id: string;
    name_en: string;
    name_ar?: string | null;
    selling_price: number;
    image_url?: string | null;
    category?: string | null;
  };
  size?: "sm" | "md";
  showLabel?: boolean;
}

export default function WishlistButton({
  product,
  size = "md",
  showLabel = false,
}: WishlistButtonProps) {
  const { addItem, removeItem, isWishlisted } = useWishlist();
  const { lang } = useLanguage();
  const ar = lang === "ar";

  const wishlisted = isWishlisted(product.id);

  function toggle() {
    if (wishlisted) {
      removeItem(product.id);
    } else {
      addItem({
        productId:  product.id,
        nameEn:     product.name_en,
        nameAr:     product.name_ar ?? undefined,
        price:      product.selling_price,
        imageUrl:   product.image_url ?? undefined,
        category:   product.category ?? undefined,
      });
    }
  }

  const iconSize = size === "sm" ? "16" : "20";

  return (
    <button
      onClick={(e) => { e.preventDefault(); toggle(); }}
      aria-label={wishlisted ? (ar ? "إزالة من المفضلة" : "Remove from wishlist") : (ar ? "أضف للمفضلة" : "Add to wishlist")}
      title={wishlisted ? (ar ? "إزالة من المفضلة" : "Remove from wishlist") : (ar ? "أضف للمفضلة" : "Add to wishlist")}
      className={`flex items-center gap-1.5 transition-all ${
        wishlisted
          ? "text-red-500 hover:text-red-700"
          : "text-gray-400 hover:text-red-400"
      }`}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width={iconSize}
        height={iconSize}
        viewBox="0 0 24 24"
        fill={wishlisted ? "currentColor" : "none"}
        stroke="currentColor"
        strokeWidth="2"
        className="transition-all"
      >
        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
      </svg>
      {showLabel && (
        <span className="text-[10px] font-bold tracking-wider uppercase">
          {wishlisted
            ? (ar ? "في المفضلة" : "Wishlisted")
            : (ar ? "أضف للمفضلة" : "Wishlist")}
        </span>
      )}
    </button>
  );
}
