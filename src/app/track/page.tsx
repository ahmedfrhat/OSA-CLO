"use client";

import { useState } from "react";
import Link from "next/link";
import { useLanguage } from "@/context/LanguageContext";

type OrderStatus = "pending" | "processing" | "shipped" | "closed";

const STEPS: OrderStatus[] = ["pending", "processing", "shipped", "closed"];

interface TrackResult {
  id: string;
  status: OrderStatus;
  customer: string;
  total: number;
  paid: number;
  remaining: number;
  created_at: string;
}

export default function TrackPage() {
  const { t, isRTL } = useLanguage();
  const [orderId,  setOrderId]  = useState("");
  const [result,   setResult]   = useState<TrackResult | null>(null);
  const [loading,  setLoading]  = useState(false);
  const [error,    setError]    = useState("");

  async function handleTrack(e: React.FormEvent) {
    e.preventDefault();
    if (!orderId.trim()) return;
    setLoading(true); setError(""); setResult(null);
    try {
      const res  = await fetch(`/api/track/${orderId.trim()}`);
      const data = await res.json();
      if (!res.ok) { setError(t("storefront.track.notFound")); }
      else          { setResult(data); }
    } catch {
      setError(t("storefront.track.error"));
    } finally {
      setLoading(false);
    }
  }

  const stepIndex = result ? STEPS.indexOf(result.status) : -1;

  return (
    <div dir={isRTL ? "rtl" : "ltr"} className="min-h-screen bg-offwhite dark:bg-brand-black">
      <div className="max-w-xl mx-auto px-4 py-12">

        {/* Header */}
        <div className="text-center mb-10">
          <Link href="/" className="text-xs font-black tracking-[0.2em] text-brand-black dark:text-offwhite uppercase">ASO CLO.</Link>
          <h1 className="text-2xl font-black tracking-[-0.02em] text-brand-black dark:text-offwhite mt-4">{t("storefront.track.title")}</h1>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">{t("storefront.track.subtitle")}</p>
        </div>

        {/* Search */}
        <form onSubmit={handleTrack} className="flex gap-2 mb-8">
          <input
            type="text"
            value={orderId}
            onChange={(e) => setOrderId(e.target.value)}
            placeholder={t("storefront.track.placeholder")}
            className="flex-1 border border-gray-200 px-4 py-3 text-xs font-mono focus:outline-none focus:border-brand-black dark:border-offwhite transition-colors"
          />
          <button
            type="submit"
            disabled={loading || !orderId.trim()}
            className="px-6 py-3 bg-brand-black dark:bg-offwhite text-white text-xs font-bold tracking-widest uppercase hover:bg-[#333] disabled:opacity-40 transition-colors"
          >
            {loading ? "..." : t("storefront.track.search")}
          </button>
        </form>

        {/* Error */}
        {error && (
          <div className="bg-red-50 border border-red-200 px-4 py-3 mb-6">
            <p className="text-xs text-red-600">{error}</p>
          </div>
        )}

        {/* Result */}
        {result && (
          <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-brand-border/10 overflow-hidden">

            {/* Status Header */}
            <div className="bg-brand-black dark:bg-offwhite px-6 py-4">
              <p className="text-[10px] font-bold tracking-[0.15em] uppercase text-white/50 dark:text-brand-black/60">Order #{result.id.slice(0, 8).toUpperCase()}</p>
              <p className="text-sm font-bold text-white dark:text-brand-black mt-1">{t(`storefront.track.status.${result.status}`)}</p>
              <p className="text-[10px] text-white/40 dark:text-brand-black/50 mt-0.5">{t("storefront.track.orderFor")}: {result.customer}</p>
            </div>

            {/* Progress Bar */}
            <div className="px-6 py-6">
              <div className="relative">
                {/* Track line */}
                <div className="absolute top-4 left-4 right-4 h-0.5 bg-gray-200 dark:bg-gray-700" />
                <div
                  className="absolute top-4 left-4 h-0.5 bg-brand-black dark:bg-offwhite transition-all duration-700"
                  style={{ width: `${(stepIndex / (STEPS.length - 1)) * 100}%` }}
                />

                {/* Steps */}
                <div className="relative flex justify-between">
                  {STEPS.map((step, i) => {
                    const done    = i <= stepIndex;
                    const current = i === stepIndex;
                    return (
                      <div key={step} className="flex flex-col items-center gap-2" style={{ width: "25%" }}>
                        <div
                          className={`w-8 h-8 rounded-full border-2 flex items-center justify-center z-10 transition-all duration-300
                            ${done
                              ? "bg-brand-black dark:bg-offwhite border-brand-black dark:border-offwhite"
                              : "bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600"
                            }
                            ${current ? "ring-2 ring-[#1A1A1A] ring-offset-2" : ""}`}
                        >
                          {done && (
                            <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round">
                              <polyline points="20 6 9 17 4 12"/>
                            </svg>
                          )}
                        </div>
                        <p className={`text-[9px] font-bold text-center leading-tight
                          ${done ? "text-brand-black dark:text-offwhite" : "text-gray-300"}`}>
                          {t(`storefront.track.steps.${step}`)}
                        </p>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Financial Summary */}
            <div className="border-t border-gray-100 dark:border-gray-800 px-6 py-4 grid grid-cols-3 gap-4">
              <div>
                <p className="text-[9px] font-bold uppercase tracking-wide text-gray-500 dark:text-gray-400">{t("storefront.track.orderTotal")}</p>
                <p className="text-sm font-black font-mono text-brand-black dark:text-offwhite">EGP {result.total.toLocaleString("en-EG")}</p>
              </div>
              <div>
                <p className="text-[9px] font-bold uppercase tracking-wide text-gray-500 dark:text-gray-400">{t("storefront.track.paid")}</p>
                <p className="text-sm font-bold font-mono text-green-700 dark:text-green-500">EGP {result.paid.toLocaleString("en-EG")}</p>
              </div>
              <div>
                <p className="text-[9px] font-bold uppercase tracking-wide text-gray-500 dark:text-gray-400">{t("storefront.track.remaining")}</p>
                <p className={`text-sm font-bold font-mono ${result.remaining > 0 ? "text-red-600" : "text-green-700"}`}>
                  {result.remaining > 0 ? `EGP ${result.remaining.toLocaleString("en-EG")}` : "✓ Paid"}
                </p>
              </div>
            </div>

            {/* Date */}
            <div className="border-t border-gray-100 dark:border-gray-800 px-6 py-3">
              <p className="text-[10px] text-gray-500 dark:text-gray-400">
                {t("storefront.track.orderDate")}: {new Date(result.created_at).toLocaleDateString("en-GB", { day: "2-digit", month: "long", year: "numeric" })}
              </p>
            </div>
          </div>
        )}

        {/* Back */}
        <div className="mt-8 text-center">
          <Link href="/" className="text-xs text-gray-400 hover:text-brand-black dark:text-offwhite transition-colors">
            ← Back to Store
          </Link>
        </div>
      </div>
    </div>
  );
}
