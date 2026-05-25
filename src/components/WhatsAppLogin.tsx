"use client";

import { useState, useRef, useEffect } from "react";
import { useLanguage } from "@/context/LanguageContext";

// ── Types ─────────────────────────────────────────────────────────────────────
export interface WACustomer {
  id: string;
  phone: string;
  name?: string;
}

interface WhatsAppLoginProps {
  onSuccess: (customer: WACustomer) => void;
  onClose:   () => void;
}

type Step = "phone" | "otp" | "success";

// ── Component ─────────────────────────────────────────────────────────────────
export default function WhatsAppLogin({ onSuccess, onClose }: WhatsAppLoginProps) {
  const { lang, isRTL } = useLanguage();
  const ar = lang === "ar";

  const [step,    setStep]    = useState<Step>("phone");
  const [phone,   setPhone]   = useState("");
  const [otp,     setOtp]     = useState(["", "", "", "", "", ""]);
  const [loading, setLoading] = useState(false);
  const [error,   setError]   = useState("");
  const [resendIn, setResendIn] = useState(0);

  const otpRefs = useRef<(HTMLInputElement | null)[]>([]);

  // Countdown timer for resend
  useEffect(() => {
    if (resendIn <= 0) return;
    const t = setTimeout(() => setResendIn((s) => s - 1), 1000);
    return () => clearTimeout(t);
  }, [resendIn]);

  // ── Send OTP ───────────────────────────────────────────────────────────────
  async function handleSend() {
    setError("");
    const clean = phone.replace(/[\s\-()]/g, "");
    if (!/^(010|011|012|015)\d{8}$/.test(clean)) {
      setError(ar ? "ادخل رقم مصري صحيح (010/011/012/015)" : "Enter a valid Egyptian mobile number");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/auth/whatsapp/send-otp", {
        method:  "POST",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify({ phone: clean }),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.error || "Error"); return; }
      setStep("otp");
      setResendIn(60);
      setTimeout(() => otpRefs.current[0]?.focus(), 100);
    } finally {
      setLoading(false);
    }
  }

  // ── OTP input handlers ─────────────────────────────────────────────────────
  function handleOtpChange(idx: number, val: string) {
    if (!/^\d*$/.test(val)) return;
    const next = [...otp];
    next[idx] = val.slice(-1);
    setOtp(next);
    if (val && idx < 5) otpRefs.current[idx + 1]?.focus();
  }

  function handleOtpKeyDown(idx: number, e: React.KeyboardEvent) {
    if (e.key === "Backspace" && !otp[idx] && idx > 0) {
      otpRefs.current[idx - 1]?.focus();
    }
  }

  function handleOtpPaste(e: React.ClipboardEvent) {
    const pasted = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6);
    if (pasted.length === 6) {
      setOtp(pasted.split(""));
      otpRefs.current[5]?.focus();
    }
  }

  // ── Verify OTP ─────────────────────────────────────────────────────────────
  async function handleVerify() {
    const code = otp.join("");
    if (code.length < 6) {
      setError(ar ? "ادخل الكود المكون من 6 أرقام" : "Enter the 6-digit code");
      return;
    }

    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/auth/whatsapp/verify-otp", {
        method:  "POST",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify({ phone: phone.replace(/[\s\-()]/g, ""), otp: code }),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.error || "Error"); return; }
      setStep("success");
      setTimeout(() => onSuccess(data.customer), 1200);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/40 backdrop-blur-sm p-4">
      <div
        dir={isRTL ? "rtl" : "ltr"}
        className="w-full max-w-sm bg-white dark:bg-brand-gray border border-gray-200 dark:border-brand-border/30 p-6 flex flex-col gap-5 relative animate-slide-up"
      >
        {/* Close */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 text-xl leading-none"
        >
          ×
        </button>

        {/* ── Step: Phone ── */}
        {step === "phone" && (
          <>
            <div className="flex flex-col gap-1">
              <div className="flex items-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="#25D366">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/>
                  <path d="M12 2C6.477 2 2 6.477 2 12c0 1.991.52 3.863 1.432 5.482L2 22l4.664-1.408A9.956 9.956 0 0 0 12 22c5.523 0 10-4.477 10-10S17.523 2 12 2z"/>
                </svg>
                <p className="text-sm font-black tracking-[-0.02em] text-brand-black dark:text-offwhite">
                  {ar ? "ادخل برقم واتساب" : "Sign in with WhatsApp"}
                </p>
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed">
                {ar
                  ? "هنبعتلك كود تفعيل على الواتساب بتاعك في ثواني"
                  : "We'll send you a quick verification code on WhatsApp"}
              </p>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-[9px] font-bold tracking-widest uppercase text-gray-500 dark:text-gray-400">
                {ar ? "رقم التليفون" : "Mobile Number"}
              </label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSend()}
                placeholder={ar ? "مثال: 01012345678" : "e.g. 01012345678"}
                autoFocus
                className="border border-gray-200 dark:border-brand-border/30 bg-transparent px-4 py-3 text-base text-brand-black dark:text-offwhite placeholder-gray-400 focus:outline-none focus:border-brand-black dark:focus:border-offwhite tracking-widest"
              />
            </div>

            {error && <p className="text-xs text-red-500 font-bold">{error}</p>}

            <button
              onClick={handleSend}
              disabled={loading}
              className="w-full py-3.5 bg-[#25D366] text-white text-[11px] font-black tracking-[0.15em] uppercase hover:bg-[#1EBE57] disabled:opacity-50 transition-colors flex items-center justify-center gap-2"
            >
              {loading
                ? (ar ? "جاري الإرسال..." : "Sending...")
                : (ar ? "ابعتلي الكود على الواتساب" : "Send WhatsApp Code")}
            </button>
          </>
        )}

        {/* ── Step: OTP ── */}
        {step === "otp" && (
          <>
            <div className="flex flex-col gap-1">
              <p className="text-sm font-black text-brand-black dark:text-offwhite">
                {ar ? "ادخل الكود" : "Enter the code"}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                {ar
                  ? `بعتنا كود على واتساب الرقم ${phone}`
                  : `We sent a code to WhatsApp on ${phone}`}
              </p>
            </div>

            {/* OTP boxes */}
            <div className="flex gap-2 justify-center" onPaste={handleOtpPaste} dir="ltr">
              {otp.map((digit, idx) => (
                <input
                  key={idx}
                  ref={(el) => { otpRefs.current[idx] = el; }}
                  type="text"
                  inputMode="numeric"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleOtpChange(idx, e.target.value)}
                  onKeyDown={(e) => handleOtpKeyDown(idx, e)}
                  className="w-11 h-12 text-center text-xl font-black border border-gray-200 dark:border-brand-border/30 bg-transparent text-brand-black dark:text-offwhite focus:outline-none focus:border-brand-black dark:focus:border-offwhite transition-colors"
                />
              ))}
            </div>

            {error && <p className="text-xs text-red-500 font-bold text-center">{error}</p>}

            <button
              onClick={handleVerify}
              disabled={loading || otp.join("").length < 6}
              className="w-full py-3.5 bg-brand-black dark:bg-offwhite text-white dark:text-brand-black text-[11px] font-black tracking-[0.15em] uppercase hover:bg-[#333] dark:hover:bg-gray-200 disabled:opacity-50 transition-colors"
            >
              {loading ? (ar ? "جاري التحقق..." : "Verifying...") : (ar ? "تحقق من الكود" : "Verify Code")}
            </button>

            <div className="flex items-center justify-between">
              <button
                onClick={() => { setStep("phone"); setOtp(["","","","","",""]); setError(""); }}
                className="text-[10px] text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 underline"
              >
                {ar ? "تغيير الرقم" : "Change number"}
              </button>

              {resendIn > 0 ? (
                <p className="text-[10px] text-gray-400">
                  {ar ? `إعادة الإرسال بعد ${resendIn}ث` : `Resend in ${resendIn}s`}
                </p>
              ) : (
                <button
                  onClick={handleSend}
                  disabled={loading}
                  className="text-[10px] text-[#25D366] font-bold hover:underline disabled:opacity-50"
                >
                  {ar ? "أعد إرسال الكود" : "Resend code"}
                </button>
              )}
            </div>
          </>
        )}

        {/* ── Step: Success ── */}
        {step === "success" && (
          <div className="flex flex-col items-center gap-3 py-4">
            <div className="w-14 h-14 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center text-2xl">
              ✓
            </div>
            <p className="text-sm font-black text-brand-black dark:text-offwhite">
              {ar ? "دخلت بنجاح! 🎉" : "Logged in successfully! 🎉"}
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400 text-center">
              {ar ? "بيتم تحميل بياناتك..." : "Loading your data..."}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
