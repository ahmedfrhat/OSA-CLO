"use client";

import { useState } from "react";
import { useLanguage } from "@/context/LanguageContext";

// ── Size recommendation engine ────────────────────────────────────────────────
type FitType = "boxy" | "slim" | "regular" | "oversized" | "dress" | "abaya";
type SizeResult = { size: string; confidence: "perfect" | "good" | "ok"; note_en: string; note_ar: string };

function recommendSize(height: number, weight: number, fit: FitType): SizeResult {
  // BMI-like body index (simplified)
  const bmi = weight / ((height / 100) ** 2);

  // Base size from height + weight combo
  let base = 0; // 0=XS, 1=S, 2=M, 3=L, 4=XL, 5=XXL

  if (height < 158) base = 0;
  else if (height < 163) base = 1;
  else if (height < 168) base = 2;
  else if (height < 174) base = 2;
  else if (height < 180) base = 3;
  else if (height < 186) base = 4;
  else base = 5;

  // Adjust for weight/body shape
  if (bmi > 30) base = Math.min(base + 2, 5);
  else if (bmi > 26) base = Math.min(base + 1, 5);
  else if (bmi < 18) base = Math.max(base - 1, 0);

  // Adjust for fit type
  let adjusted = base;
  if (fit === "boxy" || fit === "oversized") adjusted = Math.max(base - 1, 0); // go down to get oversized look
  if (fit === "slim") adjusted = base; // true to size
  if (fit === "dress" || fit === "abaya") adjusted = base; // true to size for dresses

  const sizes = ["XS", "S", "M", "L", "XL", "XXL"];
  const size = sizes[adjusted];

  // Confidence
  const diff = Math.abs(adjusted - base);
  const confidence: SizeResult["confidence"] = diff === 0 ? "perfect" : diff === 1 ? "good" : "ok";

  // Notes per fit
  const notes: Record<FitType, { en: string; ar: string }> = {
    boxy:     { en: `${size} gives you the perfect boxy silhouette — relaxed shoulders, clean drop.`,     ar: `${size} هيديك الشكل البوكسي المظبوط — كتف مريح وشكل كلين.` },
    oversized:{ en: `${size} will hit that oversized sweet spot without looking too baggy.`,              ar: `${size} هيطلعلك أوفرسايزد صح من غير ما تبان فضفاضة أوي.` },
    slim:     { en: `${size} is your true size — clean fit that follows your shape.`,                    ar: `${size} هو مقاسك الصح — فيت كلين ماشي مع جسمك.` },
    regular:  { en: `${size} gives you a comfortable regular fit — not too tight, not too loose.`,       ar: `${size} هيديك الفيت العادي المريح — مش ضيق ومش فضفاض.` },
    dress:    { en: `${size} is recommended — check the length guide below for your height.`,           ar: `${size} هو المقاس المناسب — اتفرج على دليل الطول اللي تحت.` },
    abaya:    { en: `${size} fits your height. Our abayas run slightly long — ideal for modest coverage.`, ar: `${size} مناسب لطولك. العبايات بتاعتنا طولها كبير شوية — مناسب للتغطية الكاملة.` },
  };

  return { size, confidence, note_en: notes[fit].en, note_ar: notes[fit].ar };
}

function getFitType(category?: string | null): FitType {
  const c = (category ?? "").toLowerCase();
  if (c.includes("abaya") || c.includes("عباية")) return "abaya";
  if (c.includes("dress") || c.includes("فستان")) return "dress";
  if (c.includes("tshirt") || c.includes("hoodie") || c.includes("sweat")) return "boxy";
  return "regular";
}

// ── Component ─────────────────────────────────────────────────────────────────
interface SizeGuideProps {
  category?: string | null;
  sizes?: string[] | null;
  onSelectSize?: (size: string) => void;
}

export default function SizeGuide({ category, sizes, onSelectSize }: SizeGuideProps) {
  const { lang } = useLanguage();
  const ar = lang === "ar";

  const [open, setOpen] = useState(false);
  const [height, setHeight] = useState("");
  const [weight, setWeight] = useState("");
  const [fit, setFit] = useState<FitType>(getFitType(category));
  const [result, setResult] = useState<SizeResult | null>(null);
  const [step, setStep] = useState<"input" | "result">("input");

  const fitOptions: { value: FitType; label_en: string; label_ar: string; icon: string }[] = [
    { value: "boxy",      label_en: "Boxy / Boxy Fit",     label_ar: "بوكسي فيت",        icon: "📦" },
    { value: "oversized", label_en: "Oversized",            label_ar: "أوفرسايزد",         icon: "🧥" },
    { value: "regular",   label_en: "Regular Fit",          label_ar: "ريجولار فيت",       icon: "👕" },
    { value: "slim",      label_en: "Slim / Fitted",        label_ar: "سليم / فيتيد",      icon: "✨" },
    { value: "dress",     label_en: "Dress / Skirt",        label_ar: "فستان / تنورة",     icon: "👗" },
    { value: "abaya",     label_en: "Abaya / Isdal",        label_ar: "عباية / إسدال",     icon: "🕌" },
  ];

  const confidenceColors = {
    perfect: "text-green-600 dark:text-green-400",
    good:    "text-blue-600 dark:text-blue-400",
    ok:      "text-orange-500 dark:text-orange-400",
  };
  const confidenceLabel = {
    perfect: { en: "Perfect Match ✓",    ar: "مقاسك المثالي ✓" },
    good:    { en: "Good Fit ✓",         ar: "مقاس كويس ✓" },
    ok:      { en: "Should Work",        ar: "المفروض يمشي" },
  };

  function calculate() {
    const h = parseFloat(height);
    const w = parseFloat(weight);
    if (!h || !w || h < 140 || h > 220 || w < 30 || w > 200) return;
    const r = recommendSize(h, w, fit);
    setResult(r);
    setStep("result");
  }

  function reset() { setStep("input"); setResult(null); }

  if (!open) {
    return (
      <button
        onClick={() => setOpen(true)}
        className="inline-flex items-center gap-1.5 text-[10px] font-bold tracking-[0.1em] uppercase text-brand-muted dark:text-gray-400 hover:text-brand-black dark:hover:text-offwhite border-b border-dashed border-current transition-colors"
      >
        📏 {ar ? "دليل المقاسات الذكي" : "Smart Size Guide"}
      </button>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4" dir={ar ? "rtl" : "ltr"}>
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => { setOpen(false); reset(); }} />

      {/* Modal */}
      <div className="relative w-full max-w-md bg-white dark:bg-brand-gray border border-gray-200 dark:border-white/10 shadow-2xl animate-scale-in">

        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100 dark:border-white/10">
          <div>
            <h2 className="text-sm font-black tracking-[-0.02em] text-brand-black dark:text-offwhite">
              📏 {ar ? "دليل المقاسات الذكي" : "Smart Size Guide"}
            </h2>
            <p className="text-[10px] text-gray-400 mt-0.5">
              {ar ? "ادخل قياساتك وهنقولك مقاسك" : "Enter your measurements for a perfect fit"}
            </p>
          </div>
          <button onClick={() => { setOpen(false); reset(); }} className="w-7 h-7 flex items-center justify-center text-gray-400 hover:text-brand-black dark:hover:text-offwhite text-lg">✕</button>
        </div>

        <div className="p-5">
          {step === "input" ? (
            <div className="flex flex-col gap-4">
              {/* Height + Weight */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="label-style block mb-1.5">{ar ? "الطول (سم)" : "Height (cm)"}</label>
                  <input
                    type="number" value={height} onChange={e => setHeight(e.target.value)}
                    placeholder={ar ? "مثال: 170" : "e.g. 170"}
                    min={140} max={220}
                    className="input-style text-center font-mono text-base"
                  />
                </div>
                <div>
                  <label className="label-style block mb-1.5">{ar ? "الوزن (كجم)" : "Weight (kg)"}</label>
                  <input
                    type="number" value={weight} onChange={e => setWeight(e.target.value)}
                    placeholder={ar ? "مثال: 70" : "e.g. 70"}
                    min={30} max={200}
                    className="input-style text-center font-mono text-base"
                  />
                </div>
              </div>

              {/* Fit Type */}
              <div>
                <label className="label-style block mb-2">{ar ? "نوع الفيت" : "Fit Type"}</label>
                <div className="grid grid-cols-2 gap-2">
                  {fitOptions.map(f => (
                    <button key={f.value} onClick={() => setFit(f.value)}
                      className={`flex items-center gap-2 px-3 py-2.5 border text-xs font-bold transition-all text-left
                        ${fit === f.value
                          ? "bg-brand-black dark:bg-offwhite text-white dark:text-brand-black border-brand-black dark:border-offwhite"
                          : "border-gray-200 dark:border-white/10 text-gray-600 dark:text-gray-300 hover:border-gray-400"}`}>
                      <span className="text-base">{f.icon}</span>
                      <span>{ar ? f.label_ar : f.label_en}</span>
                    </button>
                  ))}
                </div>
              </div>

              <button
                onClick={calculate}
                disabled={!height || !weight}
                className="w-full py-3.5 bg-brand-black dark:bg-offwhite text-white dark:text-brand-black text-[11px] font-black tracking-[0.15em] uppercase disabled:opacity-40 transition-all hover:bg-[#333] dark:hover:bg-gray-200 active:scale-[0.98]"
              >
                {ar ? "🔍 احسب مقاسي" : "🔍 Find My Size"}
              </button>
            </div>
          ) : (
            result && (
              <div className="flex flex-col gap-4 animate-slide-up">
                {/* Result */}
                <div className="text-center py-6 border border-gray-100 dark:border-white/10 bg-gray-50 dark:bg-white/5">
                  <p className="text-[10px] font-bold tracking-[0.15em] uppercase text-gray-400 mb-2">
                    {ar ? "مقاسك المقترح" : "Your Recommended Size"}
                  </p>
                  <p className="text-6xl font-black text-brand-black dark:text-offwhite tracking-tight mb-2">
                    {result.size}
                  </p>
                  <p className={`text-[11px] font-bold tracking-wide ${confidenceColors[result.confidence]}`}>
                    {ar ? confidenceLabel[result.confidence].ar : confidenceLabel[result.confidence].en}
                  </p>
                </div>

                {/* Note */}
                <p className="text-xs text-gray-600 dark:text-gray-300 leading-relaxed text-center">
                  {ar ? result.note_ar : result.note_en}
                </p>

                {/* Select size button */}
                {sizes?.includes(result.size) && onSelectSize && (
                  <button
                    onClick={() => { onSelectSize(result.size); setOpen(false); reset(); }}
                    className="w-full py-3 bg-brand-accent text-brand-black text-[11px] font-black tracking-[0.12em] uppercase hover:bg-brand-accent/80 transition-all active:scale-[0.98]"
                  >
                    ✓ {ar ? `اختار ${result.size}` : `Select ${result.size}`}
                  </button>
                )}

                {!sizes?.includes(result.size) && sizes?.length && (
                  <div className="border border-orange-200 dark:border-orange-900 bg-orange-50 dark:bg-orange-950/30 px-3 py-2.5 text-xs text-orange-700 dark:text-orange-400 text-center">
                    {ar
                      ? `المقاس ${result.size} مش متاح دلوقتي — جرب ${sizes[0]} كأقرب مقاس.`
                      : `Size ${result.size} isn't available — try ${sizes[0]} as the closest option.`}
                  </div>
                )}

                {/* Available sizes */}
                {sizes && sizes.length > 0 && (
                  <div>
                    <p className="label-style mb-2">{ar ? "المقاسات المتاحة" : "Available Sizes"}</p>
                    <div className="flex gap-2 flex-wrap">
                      {sizes.map(s => (
                        <button key={s} onClick={() => { onSelectSize?.(s); setOpen(false); reset(); }}
                          className={`min-w-[44px] h-9 px-3 text-sm font-bold border transition-all
                            ${s === result.size
                              ? "bg-brand-black dark:bg-offwhite text-white dark:text-brand-black border-brand-black"
                              : "border-gray-200 dark:border-white/15 text-gray-600 dark:text-gray-300 hover:border-brand-black"}`}>
                          {s}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                <button onClick={reset} className="text-xs text-gray-400 hover:text-brand-black dark:hover:text-offwhite transition-colors text-center underline underline-offset-2">
                  {ar ? "← أعد الحساب" : "← Recalculate"}
                </button>
              </div>
            )
          )}
        </div>
      </div>
    </div>
  );
}
