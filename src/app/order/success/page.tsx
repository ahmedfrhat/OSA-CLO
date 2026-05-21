"use client";

import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { Suspense } from "react";
import { useLanguage } from "@/context/LanguageContext";

const WA_NUMBER = "201038856486";

function SuccessContent() {
  const { t, isRTL } = useLanguage();
  const params = useSearchParams();
  const raw    = params.get("ids") ?? "";
  const ids    = raw.split(",").filter(Boolean);

  return (
    <div dir={isRTL ? "rtl" : "ltr"} className="min-h-screen bg-[#FAF9F6] flex items-center justify-center px-4 py-12">
      <div className="max-w-md w-full text-center">

        {/* Brand */}
        <Link href="/" className="text-xs font-black tracking-[0.2em] text-[#1A1A1A] uppercase block mb-8">ASO CLO.</Link>

        {/* Success Icon */}
        <div className="w-20 h-20 bg-[#1A1A1A] rounded-full flex items-center justify-center mx-auto mb-6">
          <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="20 6 9 17 4 12"/>
          </svg>
        </div>

        <h1 className="text-2xl font-black tracking-[-0.02em] text-[#1A1A1A] mb-3">
          {t("storefront.success.title")}
        </h1>
        <p className="text-sm text-gray-500 leading-relaxed mb-8">
          {t("storefront.success.subtitle")}
        </p>

        {/* Order IDs */}
        <div className="bg-white border border-gray-200 p-5 mb-6 text-left">
          <p className="text-[10px] font-bold tracking-[0.12em] uppercase text-gray-400 mb-3">
            {ids.length === 1 ? t("storefront.success.orderId") : t("storefront.success.multipleOrders")}
          </p>
          {ids.map((id) => (
            <div key={id} className="flex items-center justify-between py-2 border-b border-gray-50 last:border-0">
              <code className="text-xs font-mono font-bold text-[#1A1A1A] tracking-wide">
                {id.toUpperCase()}
              </code>
              <Link
                href={`/track?id=${id}`}
                className="text-[10px] font-bold text-gray-400 hover:text-[#1A1A1A] underline underline-offset-2 transition-colors"
              >
                Track →
              </Link>
            </div>
          ))}
        </div>

        {/* CTAs */}
        <div className="flex flex-col gap-3">
          <a
            href={`https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(`مرحباً، طلبي: ${ids.join(", ")}`)}`}
            target="_blank" rel="noreferrer"
            className="w-full py-4 bg-[#25D366] text-white text-xs font-black tracking-[0.15em] uppercase flex items-center justify-center gap-2 hover:bg-[#1EBE57] transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/>
              <path d="M12 2C6.477 2 2 6.477 2 12c0 1.991.52 3.863 1.432 5.482L2 22l4.664-1.408A9.956 9.956 0 0 0 12 22c5.523 0 10-4.477 10-10S17.523 2 12 2z"/>
            </svg>
            {t("storefront.success.whatsapp")}
          </a>

          {ids[0] && (
            <Link
              href={`/track?id=${ids[0]}`}
              className="w-full py-3 border border-[#1A1A1A] text-[#1A1A1A] text-xs font-bold tracking-widest uppercase hover:bg-[#1A1A1A] hover:text-white transition-all flex items-center justify-center"
            >
              {t("storefront.success.trackOrder")}
            </Link>
          )}

          <Link
            href="/"
            className="text-xs text-gray-400 hover:text-[#1A1A1A] py-2 transition-colors"
          >
            {t("storefront.success.continueShopping")}
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function SuccessPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#FAF9F6] flex items-center justify-center"><div className="w-8 h-8 border-2 border-gray-200 border-t-[#1A1A1A] rounded-full animate-spin"/></div>}>
      <SuccessContent />
    </Suspense>
  );
}
