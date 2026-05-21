"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useCart, type CartItem } from "@/context/CartContext";
import { useLanguage } from "@/context/LanguageContext";

const WA_NUMBER = "201038856486";

// ── Validation helpers ────────────────────────────────────────────────────────
function isValidPhone(phone: string) {
  return /^(010|011|012|015)\d{8}$/.test(phone.replace(/[\s\-()]/g, ""));
}
function isLettersOnly(name: string) {
  return /^[\u0600-\u06FF\u0750-\u077Fa-zA-Z\s''\-]+$/.test(name.trim());
}

type PayType = "full" | "deposit";

interface FormErrors {
  name?: string;
  phone?: string;
  address?: string;
  terms?: string;
  server?: string;
}

export default function CheckoutPage() {
  const router = useRouter();
  const { t, lang, isRTL } = useLanguage();
  const { items, total, clearCart, isHydrated } = useCart();

  const [name,    setName]    = useState("");
  const [phone,   setPhone]   = useState("");
  const [address, setAddress] = useState("");
  const [notes,   setNotes]   = useState("");
  const [payType, setPayType] = useState<PayType>("full");
  const [terms,   setTerms]   = useState(false);
  const [errors,  setErrors]  = useState<FormErrors>({});
  const [loading, setLoading] = useState(false);

  // Discount
  const [discountCode,    setDiscountCode]    = useState("");
  const [discountAmount,  setDiscountAmount]  = useState(0);
  const [discountLabel,   setDiscountLabel]   = useState("");
  const [discountLoading, setDiscountLoading] = useState(false);
  const [discountError,   setDiscountError]   = useState("");

  const discountedTotal = Math.max(0, total - discountAmount);

  async function applyDiscount() {
    if (!discountCode.trim()) return;
    setDiscountLoading(true);
    setDiscountError("");
    try {
      const res  = await fetch("/api/discount/validate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code: discountCode.trim(), order_total: total }),
      });
      const data = await res.json();
      if (!res.ok) { setDiscountError(data.error || "Invalid code"); setDiscountAmount(0); setDiscountLabel(""); }
      else {
        setDiscountAmount(data.discount);
        setDiscountLabel(data.type === "percent" ? `${data.value}% OFF` : `EGP ${data.value} OFF`);
      }
    } catch { setDiscountError("Network error"); }
    setDiscountLoading(false);
  }

  // Redirect to home if cart is empty
  useEffect(() => {
    if (isHydrated && items.length === 0) router.push("/");
  }, [isHydrated, items.length, router]);

  const paidNow   = payType === "deposit" ? Math.round(discountedTotal * 0.5) : discountedTotal;
  const remaining = discountedTotal - paidNow;

  const fmtP = (n: number) => `EGP ${n.toLocaleString("en-EG")}`;

  // Client-side validation
  function validate(): FormErrors {
    const e: FormErrors = {};
    if (!name.trim())               e.name    = t("storefront.checkout.errors.nameRequired");
    else if (!isLettersOnly(name))  e.name    = t("storefront.checkout.errors.nameInvalid");
    if (!phone.trim())              e.phone   = t("storefront.checkout.errors.phoneRequired");
    else if (!isValidPhone(phone))  e.phone   = t("storefront.checkout.errors.phoneInvalid");
    if (!address.trim())            e.address = t("storefront.checkout.errors.addressRequired");
    else if (address.trim().length < 10) e.address = t("storefront.checkout.errors.addressTooShort");
    if (!terms)                     e.terms   = t("storefront.checkout.errors.termsRequired");
    return e;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setErrors({});
    setLoading(true);

    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customer_name:    name.trim(),
          customer_phone:   phone.trim(),
          customer_address: address.trim(),
          notes:            notes.trim() || undefined,
          payment_type:     payType,
          discount_amount:  discountAmount,
          discount_code:    discountCode.trim() || undefined,
          items: items.map((i) => ({
            productId: i.productId,
            partnerId: i.partnerId,
            size:      i.size,
            quantity:  i.quantity,
            price:     i.price,
          })),
        }),
      });

      const data = await res.json();
      if (!res.ok) { setErrors({ server: data.error }); setLoading(false); return; }

      clearCart();
      const ids = (data.orderIds as string[]).join(",");
      router.push(`/order/success?ids=${ids}`);

    } catch {
      setErrors({ server: t("storefront.checkout.errors.serverError") });
      setLoading(false);
    }
  }

  return (
    <div dir={isRTL ? "rtl" : "ltr"} className="min-h-screen bg-[#FAF9F6]">
      <div className="max-w-3xl mx-auto px-4 py-8">

        {/* Back */}
        <button onClick={() => router.back()} className="text-xs text-gray-400 hover:text-[#1A1A1A] mb-6 flex items-center gap-1 transition-colors">
          ← {t("storefront.product.back")}
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_340px] gap-8">

          {/* ── Form ─────────────────────────────────────────────────────── */}
          <form onSubmit={handleSubmit} className="flex flex-col gap-5">
            <div>
              <h1 className="text-xl font-black tracking-[-0.02em] text-[#1A1A1A]">
                {t("storefront.checkout.title")}
              </h1>
              <p className="text-xs text-gray-400 mt-1">{t("storefront.checkout.subtitle")}</p>
            </div>

            {/* Name */}
            <Field label={t("storefront.checkout.customerName")} error={errors.name}>
              <input
                type="text"
                value={name}
                onChange={(e) => { setName(e.target.value); setErrors((p) => ({ ...p, name: undefined })); }}
                placeholder={t("storefront.checkout.namePlaceholder")}
                className={`input-style ${errors.name ? "border-red-400 bg-red-50" : ""}`}
              />
            </Field>

            {/* Phone */}
            <Field label={t("storefront.checkout.phone")} error={errors.phone}>
              <input
                type="tel"
                value={phone}
                onChange={(e) => { setPhone(e.target.value); setErrors((p) => ({ ...p, phone: undefined })); }}
                placeholder={t("storefront.checkout.phonePlaceholder")}
                className={`input-style font-mono ${errors.phone ? "border-red-400 bg-red-50" : ""}`}
                dir="ltr"
              />
            </Field>

            {/* Address */}
            <Field label={t("storefront.checkout.address")} error={errors.address}>
              <textarea
                value={address}
                onChange={(e) => { setAddress(e.target.value); setErrors((p) => ({ ...p, address: undefined })); }}
                placeholder={t("storefront.checkout.addressPlaceholder")}
                rows={2}
                className={`input-style resize-none ${errors.address ? "border-red-400 bg-red-50" : ""}`}
              />
              <p className="text-[10px] text-gray-400 mt-1">{address.trim().length}/10 min</p>
            </Field>

            {/* Notes */}
            <Field label={t("storefront.checkout.notes")}>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder={t("storefront.checkout.notesPlaceholder")}
                rows={2}
                className="input-style resize-none text-xs"
              />
            </Field>

            {/* Payment Method */}
            <div className="flex flex-col gap-2">
              <label className="label-style">{t("storefront.checkout.payment")}</label>

              {/* Vodafone Cash badge */}
              <div className="flex items-center gap-2 px-4 py-3 border border-gray-200 bg-gray-50">
                <span className="text-lg">📱</span>
                <div>
                  <p className="text-xs font-bold text-[#1A1A1A]">{t("storefront.checkout.vodafoneCash")}</p>
                  <p className="text-[10px] text-gray-400">Only accepted payment method</p>
                </div>
                <span className="ml-auto text-[10px] font-bold text-green-600 border border-green-200 bg-green-50 px-2 py-0.5">Active</span>
              </div>

              {/* Full vs Deposit toggle */}
              <div className="grid grid-cols-2 gap-2 mt-1">
                <button type="button" onClick={() => setPayType("full")}
                  className={`py-3 text-[11px] font-bold tracking-wide border transition-all
                    ${payType === "full" ? "bg-[#1A1A1A] text-white border-[#1A1A1A]" : "border-gray-200 text-gray-500 hover:border-gray-400"}`}>
                  {t("storefront.checkout.payFull")}
                </button>
                <button type="button" onClick={() => setPayType("deposit")}
                  className={`py-3 text-[11px] font-bold tracking-wide border transition-all
                    ${payType === "deposit" ? "bg-[#1A1A1A] text-white border-[#1A1A1A]" : "border-gray-200 text-gray-500 hover:border-gray-400"}`}>
                  {t("storefront.checkout.payDeposit")}
                </button>
              </div>

              {/* Deposit breakdown */}
              {payType === "deposit" && (
                <div className="grid grid-cols-3 gap-2 border border-blue-200 bg-blue-50 p-3">
                  <FinLine label={t("storefront.checkout.total")}   value={fmtP(total)}     />
                  <FinLine label={t("storefront.checkout.paidNow")} value={fmtP(paidNow)}   highlight />
                  <FinLine label={t("storefront.checkout.remaining")} value={fmtP(remaining)} warning />
                </div>
              )}
            </div>

            {/* Terms */}
            <label className={`flex items-start gap-3 cursor-pointer group ${errors.terms ? "text-red-600" : ""}`}>
              <input
                type="checkbox"
                checked={terms}
                onChange={(e) => { setTerms(e.target.checked); setErrors((p) => ({ ...p, terms: undefined })); }}
                className="mt-0.5 w-4 h-4 accent-[#1A1A1A]"
              />
              <span className="text-xs text-gray-600 leading-relaxed group-hover:text-[#1A1A1A] transition-colors">
                {t("storefront.checkout.terms")}
              </span>
            </label>
            {errors.terms && <p className="text-xs text-red-600 -mt-3">{errors.terms}</p>}

            {/* Discount Code */}
            <div className="flex flex-col gap-2">
              <label className="label-style">Discount Code (اختياري)</label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={discountCode}
                  onChange={(e) => { setDiscountCode(e.target.value.toUpperCase()); setDiscountAmount(0); setDiscountLabel(""); setDiscountError(""); }}
                  onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), applyDiscount())}
                  placeholder="SUMMER20"
                  className="input-style flex-1 font-mono tracking-widest text-sm"
                />
                <button type="button" onClick={applyDiscount} disabled={discountLoading || !discountCode.trim()}
                  className="px-4 py-2 border border-gray-300 text-xs font-bold text-gray-600 hover:border-gray-500 disabled:opacity-40 transition-all shrink-0">
                  {discountLoading ? "..." : "Apply"}
                </button>
              </div>
              {discountError  && <p className="text-xs text-red-500">{discountError}</p>}
              {discountLabel  && <p className="text-xs text-green-600 font-bold">✓ {discountLabel} applied!</p>}
            </div>

            {/* Server error */}
            {errors.server && (
              <div className="bg-red-50 border border-red-200 px-4 py-3">
                <p className="text-xs text-red-600 font-medium">{errors.server}</p>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#1A1A1A] text-white py-4 text-xs font-black tracking-[0.15em] uppercase hover:bg-[#333] disabled:opacity-40 transition-colors"
            >
              {loading ? t("storefront.checkout.submitting") : t("storefront.checkout.submit")}
            </button>

            {/* WhatsApp support */}
            <a
              href={`https://wa.me/${WA_NUMBER}?text=Hi, I need help with my order.`}
              target="_blank" rel="noreferrer"
              className="text-center text-[10px] text-gray-400 hover:text-green-600 transition-colors"
            >
              💬 Need help? Chat on WhatsApp
            </a>
          </form>

          {/* ── Order Summary ─────────────────────────────────────────────── */}
          <OrderSummary items={items} total={total} discountAmount={discountAmount} discountLabel={discountLabel} paidNow={paidNow} payType={payType} lang={lang} />
        </div>
      </div>
    </div>
  );
}

// ── Sub-components ────────────────────────────────────────────────────────────
function Field({ label, error, children }: { label: string; error?: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="label-style">{label}</label>
      {children}
      {error && <p className="text-xs text-red-600">{error}</p>}
    </div>
  );
}

function FinLine({ label, value, highlight, warning }: { label: string; value: string; highlight?: boolean; warning?: boolean }) {
  return (
    <div className="text-center">
      <p className="text-[9px] font-bold tracking-wide uppercase text-gray-500 mb-0.5">{label}</p>
      <p className={`text-sm font-black font-mono ${highlight ? "text-blue-700" : warning ? "text-orange-600" : "text-[#1A1A1A]"}`}>{value}</p>
    </div>
  );
}


function OrderSummary({ items, total, discountAmount = 0, discountLabel, paidNow, payType, lang }: {
  items: CartItem[];
  total: number;
  discountAmount?: number;
  discountLabel?: string;
  paidNow: number;
  payType: PayType;
  lang: string;
}) {
  const fmtP          = (n: number) => `EGP ${n.toLocaleString("en-EG")}`;
  const finalTotal     = Math.max(0, total - discountAmount);
  return (
    <div className="bg-white border border-gray-200 p-5 h-fit sticky top-20">
      <h2 className="text-[10px] font-bold tracking-[0.15em] uppercase text-gray-400 mb-4">Order Summary</h2>
      <ul className="space-y-3 mb-4">
        {items.map((item) => (
          <li key={`${item.nameEn}-${item.size}`} className="flex items-center gap-3">
            <div className="w-10 h-12 bg-gray-100 shrink-0 overflow-hidden">
              {item.imageUrl
                // eslint-disable-next-line @next/next/no-img-element
                ? <img src={item.imageUrl} alt={item.nameEn} className="w-full h-full object-cover" />
                : <div className="w-full h-full flex items-center justify-center text-[8px] font-bold text-gray-300">{item.nameEn.slice(0,2)}</div>
              }
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-semibold text-[#1A1A1A] truncate">{lang === "ar" && item.nameAr ? item.nameAr : item.nameEn}</p>
              {item.size && <p className="text-[9px] text-gray-400">Size: {item.size}</p>}
              <p className="text-[10px] text-gray-500">× {item.quantity}</p>
            </div>
            <p className="text-xs font-mono font-bold text-[#1A1A1A] shrink-0">{fmtP(item.price * item.quantity)}</p>
          </li>
        ))}
      </ul>
      <div className="border-t border-gray-100 pt-4 space-y-2">
        <div className="flex justify-between text-xs">
          <span className="text-gray-500">Subtotal</span>
          <span className="font-mono font-bold text-[#1A1A1A]">{fmtP(total)}</span>
        </div>
        {discountAmount > 0 && discountLabel && (
          <div className="flex justify-between text-xs">
            <span className="text-green-600 font-bold">🎟 {discountLabel}</span>
            <span className="font-mono font-bold text-green-600">−{fmtP(discountAmount)}</span>
          </div>
        )}
        <div className="flex justify-between text-xs border-t border-gray-100 pt-2 mt-1">
          <span className="font-bold text-[#1A1A1A]">Total</span>
          <span className="font-mono font-black text-[#1A1A1A]">{fmtP(finalTotal)}</span>
        </div>
        {payType === "deposit" && (
          <>
            <div className="flex justify-between text-xs">
              <span className="text-blue-600">Due Now (50%)</span>
              <span className="font-mono font-bold text-blue-700">{fmtP(paidNow)}</span>
            </div>
            <div className="flex justify-between text-xs">
              <span className="text-orange-600">On Delivery</span>
              <span className="font-mono font-bold text-orange-600">{fmtP(finalTotal - paidNow)}</span>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
