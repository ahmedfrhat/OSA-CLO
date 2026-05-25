"use client";

import { useState } from "react";
import { useLanguage } from "@/context/LanguageContext";

// ── Size recommendation logic ─────────────────────────────────────────────────
// Categories:
//   "oversized" / "boxy"  → go up 1 size for the oversized look
//   "slim" / "regular"    → standard sizing

interface SizeResult {
  size: string;
  note_en: string;
  note_ar: string;
}

type FitType = "oversized" | "regular";

function recommendSize(
  heightCm: number,
  weightKg: number,
  fit: FitType
): SizeResult {
  // Base size from BMI + height
  const bmi = weightKg / (heightCm / 100) ** 2;

  let base: "XS" | "S" | "M" | "L" | "XL" | "XXL";

  if (heightCm < 160) {
    base = weightKg < 55 ? "XS" : weightKg < 70 ? "S" : weightKg < 85 ? "M" : "L";
  } else if (heightCm < 170) {
    base = weightKg < 60 ? "S" : weightKg < 75 ? "M" : weightKg < 90 ? "L" : "XL";
  } else if (heightCm < 180) {
    base = weightKg < 65 ? "S" : weightKg < 80 ? "M" : weightKg < 95 ? "L" : weightKg < 110 ? "XL" : "XXL";
  } else if (heightCm < 190) {
    base = weightKg < 70 ? "M" : weightKg < 90 ? "L" : weightKg < 110 ? "XL" : "XXL";
  } else {
    base = weightKg < 80 ? "L" : weightKg < 100 ? "XL" : "XXL";
  }

  // For oversized fit → go up one size
  const sizeOrder: Array<"XS" | "S" | "M" | "L" | "XL" | "XXL"> = ["XS", "S", "M", "L", "XL", "XXL"];
  const idx = sizeOrder.indexOf(base);

  let final: string;
  let note_en: string;
  let note_ar: string;

  if (fit === "oversized") {
    final = sizeOrder[Math.min(idx + 1, sizeOrder.length - 1)];
    note_en = `Go ${final} for the perfect oversized/boxy drape. Your base size is ${base}.`;
    note_ar = `اختار ${final} عشان تطلع الـ Oversized قَعدة مظبوطة. مقاسك الأساسي هو ${base}.`;
  } else {
    final = base;
    note_en = `${final} is your ideal fit for regular/slim cuts.`;
    note_ar = `${final} هو مقاسك المثالي للقصة العادية أو الـ Slim.`;
  }

  // BMI tip
  if (bmi > 27) {
    note_en += " We recommend sizing up one more if you prefer more room.";
    note_ar += " ننصح بالأكبر خطوة لو بتحب فضاء أكتر.";
  }

  return { size: final, note_en, note_ar };
}

// ── Component ─────────────────────────────────────────────────────────────────
interface SmartSizeGuideProps {
  category?: string | null;
  availableSizes?: string[] | null;
  onSizeSelect?: (size: string) => void;
}

export default function SmartSizeGuide({
  category,
  availableSizes,
  onSizeSelect,
}: SmartSizeGuideProps) {
  const { lang, isRTL } = useLanguage();
  const ar = lang === "ar";

  const [open,     setOpen]     = useState(false);
  const [height,   setHeight]   = useState("");
  const [weight,   setWeight]   = useState("");
  const [fit,      setFit]      = useState<FitType>("oversized");
  const [result,   setResult]   = useState<SizeResult | null>(null);
  const [error,    setError]    = useState("");

  // Detect oversized categories
  const isOversized = /boxy|oversized|hoodie|sweatshirt|cargo|jacket/i.test(
    category ?? ""
  );

  function handleCalculate() {
    const h = parseFloat(height);
    const w = parseFloat(weight);

    if (!h || !w || h < 140 || h > 220 || w < 40 || w > 200) {
      setError(
        ar
          ? "ادخل طول بين 140-220 سم ووزن بين 40-200 كجم"
          : "Enter height (140-220 cm) and weight (40-200 kg)"
      );
      return;
    }

    setError("");
    const res = recommendSize(h, w, fit);

    // If product has specific sizes, check if recommended is available
    if (availableSizes && availableSizes.length > 0 && !availableSizes.includes(res.size)) {
      // Find closest available
      const order = ["XS", "S", "M", "L", "XL", "XXL"];
      const idx = order.indexOf(res.size);
      let closest = res.size;
      for (let delta = 1; delta <= 3; delta++) {
        if (idx - delta >= 0 && availableSizes.includes(order[idx - delta])) {
          closest = order[idx - delta];
          break;
        }
        if (idx + delta < order.length && availableSizes.includes(order[idx + delta])) {
          closest = order[idx + delta];
          break;
        }
      }
      res.size = closest;
      res.note_en = res.note_en.replace(/\b(XS|S|M|L|XL|XXL)\b/, closest);
      res.note_ar = res.note_ar.replace(/\b(XS|S|M|L|XL|XXL)\b/, closest);
    }

    setResult(res);
  }

  function handleApply() {
    if (result && onSizeSelect) {
      onSizeSelect(result.size);
      setOpen(false);
    }
  }

  return (
    <div dir={isRTL ? "rtl" : "ltr"}>
      {/* Trigger */}
      <button
        onClick={() => setOpen((v) => !v)}
        className="text-[10px] font-bold tracking-[0.12em] uppercase text-gray-500 dark:text-gray-400 underline underline-offset-2 hover:text-brand-black dark:hover:text-offwhite transition-colors flex items-center gap-1"
      >
        📏 {ar ? "مش عارف مقاسك؟ جرب دليل المقاسات الذكي" : "Not sure of your size? Try Smart Size Guide"}
      </button>

      {/* Drawer */}
      {open && (
        <div className="mt-3 bg-white dark:bg-brand-gray border border-gray-200 dark:border-brand-border/30 p-5 flex flex-col gap-4 animate-fade-in">
          <p className="text-[10px] font-black tracking-[0.2em] uppercase text-brand-black dark:text-offwhite">
            {ar ? "دليل المقاسات الذكي" : "Smart Size Guide"}
          </p>

          {/* Inputs */}
          <div className="grid grid-cols-2 gap-3">
            <div className="flex flex-col gap-1.5">
              <label className="text-[9px] font-bold tracking-widest uppercase text-gray-500 dark:text-gray-400">
                {ar ? "الطول (سم)" : "Height (cm)"}
              </label>
              <input
                type="number"
                value={height}
                onChange={(e) => setHeight(e.target.value)}
                placeholder={ar ? "مثال: 175" : "e.g. 175"}
                className="border border-gray-200 dark:border-brand-border/30 bg-transparent px-3 py-2 text-sm text-brand-black dark:text-offwhite placeholder-gray-400 focus:outline-none focus:border-brand-black dark:focus:border-offwhite"
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-[9px] font-bold tracking-widest uppercase text-gray-500 dark:text-gray-400">
                {ar ? "الوزن (كجم)" : "Weight (kg)"}
              </label>
              <input
                type="number"
                value={weight}
                onChange={(e) => setWeight(e.target.value)}
                placeholder={ar ? "مثال: 75" : "e.g. 75"}
                className="border border-gray-200 dark:border-brand-border/30 bg-transparent px-3 py-2 text-sm text-brand-black dark:text-offwhite placeholder-gray-400 focus:outline-none focus:border-brand-black dark:focus:border-offwhite"
              />
            </div>
          </div>

          {/* Fit type */}
          <div className="flex flex-col gap-1.5">
            <label className="text-[9px] font-bold tracking-widest uppercase text-gray-500 dark:text-gray-400">
              {ar ? "نوع القصة" : "Fit Type"}
            </label>
            <div className="flex gap-2">
              {(["oversized", "regular"] as FitType[]).map((f) => (
                <button
                  key={f}
                  onClick={() => setFit(f)}
                  className={`flex-1 py-2 text-[10px] font-bold tracking-wider uppercase border transition-all ${
                    fit === f
                      ? "bg-brand-black dark:bg-offwhite text-white dark:text-brand-black border-brand-black dark:border-offwhite"
                      : "border-gray-200 dark:border-brand-border/30 text-gray-500 dark:text-gray-400 hover:border-gray-400"
                  }`}
                >
                  {f === "oversized"
                    ? ar ? "أوفرسايز / بوكسي" : "Oversized / Boxy"
                    : ar ? "عادي / سليم" : "Regular / Slim"}
                </button>
              ))}
            </div>
            {isOversized && fit !== "oversized" && (
              <p className="text-[9px] text-orange-500 font-bold">
                {ar
                  ? "💡 المنتج ده Boxy Fit — ننصح تختار Oversized"
                  : "💡 This product is Boxy Fit — we recommend Oversized"}
              </p>
            )}
          </div>

          {error && <p className="text-xs text-red-500 font-bold">{error}</p>}

          <button
            onClick={handleCalculate}
            className="w-full py-3 bg-brand-black dark:bg-offwhite text-white dark:text-brand-black text-[11px] font-black tracking-[0.15em] uppercase hover:bg-[#333] dark:hover:bg-gray-200 transition-colors"
          >
            {ar ? "احسب المقاس المناسب" : "Find My Size"}
          </button>

          {/* Result */}
          {result && (
            <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 p-4 flex flex-col gap-3">
              <div className="flex items-center justify-between">
                <p className="text-[10px] font-bold tracking-widest uppercase text-green-700 dark:text-green-400">
                  {ar ? "المقاس الموصى به" : "Recommended Size"}
                </p>
                <span className="text-2xl font-black text-green-700 dark:text-green-400">
                  {result.size}
                </span>
              </div>
              <p className="text-xs text-green-700 dark:text-green-400 leading-relaxed">
                {ar ? result.note_ar : result.note_en}
              </p>
              {onSizeSelect && (
                <button
                  onClick={handleApply}
                  className="w-full py-2.5 bg-green-600 text-white text-[11px] font-black tracking-[0.12em] uppercase hover:bg-green-700 transition-colors"
                >
                  {ar ? `اختار مقاس ${result.size}` : `Select Size ${result.size}`}
                </button>
              )}
            </div>
          )}

          <p className="text-[9px] text-gray-400 dark:text-gray-500 text-center">
            {ar
              ? "* التوصيات بناءً على قياساتك المُدخلة. الفِت النهائي قد يختلف حسب الموديل."
              : "* Recommendations based on your measurements. Final fit may vary per model."}
          </p>
        </div>
      )}
    </div>
  );
}
