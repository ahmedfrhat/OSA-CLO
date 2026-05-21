import type { Metadata } from "next";
import { supabase } from "@/lib/supabase";
import StorefrontClient from "@/components/storefront/StorefrontClient";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "ASO CLO — The New Standard in Streetwear",
  description: "Minimalist streetwear crafted for those who define the culture — not follow it. Shop the latest drop from ASO CLO.",
  openGraph: {
    title: "ASO CLO — The New Standard",
    description: "Minimalist Egyptian streetwear. Shop the latest drop.",
    siteName: "ASO CLO",
    type: "website",
  },
};

export default async function StorefrontPage() {
  // Fetch all available products
  const { data: products } = await supabase
    .from("products")
    .select("id, partner_id, name_en, name_ar, description, category, selling_price, sizes, stock_quantity, image_url, is_available, in_stock")
    .eq("is_available", true)
    .eq("in_stock", true)
    .order("created_at", { ascending: false });

  // Extract unique categories
  const categories = Array.from(
    new Set(
      (products ?? [])
        .map((p) => p.category)
        .filter((c): c is string => Boolean(c))
    )
  );

  return (
    <>
      {/* ── Hero ── */}
      <section className="bg-[#FAF9F6] border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-16 sm:py-24">
          <div className="max-w-2xl">
            <p className="text-[10px] font-bold tracking-[0.3em] uppercase text-gray-400 mb-4">
              SS 2025 — DROP 01
            </p>
            <h1 className="text-5xl sm:text-7xl font-black tracking-[-0.04em] leading-none text-[#1A1A1A] mb-6">
              THE<br/>NEW<br/>STANDARD.
            </h1>
            <p className="text-sm text-gray-500 leading-relaxed max-w-md">
              Minimalist streetwear crafted for those who define the culture — not follow it.
            </p>
          </div>
        </div>
      </section>

      {/* ── Client-side: Search + Categories + Grid ── */}
      <StorefrontClient products={products ?? []} categories={categories} />
    </>
  );
}
