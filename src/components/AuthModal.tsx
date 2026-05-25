"use client";

import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { useLanguage } from "@/context/LanguageContext";

export default function AuthModal() {
  const { showAuthModal, closeAuth, login, customer, logout } = useAuth();
  const { lang } = useLanguage();
  const ar = lang === "ar";

  const [phone, setPhone]   = useState("");
  const [name, setName]     = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError]   = useState("");
  const [done, setDone]     = useState(false);

  if (!showAuthModal) return null;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!phone.trim()) return;
    setLoading(true);
    setError("");
    try {
      await login(phone.trim(), name.trim() || undefined);
      setDone(true);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    }
    setLoading(false);
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" dir={ar ? "rtl" : "ltr"}>
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={closeAuth} />

      <div className="relative w-full max-w-sm bg-white dark:bg-brand-gray border border-gray-200 dark:border-white/10 shadow-2xl animate-scale-in">

        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100 dark:border-white/10">
          <h2 className="text-sm font-black tracking-[-0.02em] text-brand-black dark:text-offwhite">
            {ar ? "حساب العميل" : "Customer Account"}
          </h2>
          <button onClick={closeAuth} className="w-7 h-7 flex items-center justify-center text-gray-400 hover:text-brand-black dark:hover:text-offwhite text-lg">✕</button>
        </div>

        <div className="p-5">
          {done ? (
            <div className="text-center py-4">
              <p className="text-2xl mb-2">✅</p>
              <p className="text-sm font-bold text-brand-black dark:text-offwhite">
                {ar ? "أهلاً بيك!" : "Welcome!"}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                {ar ? "الـ Wishlist بتاعتك اتحفظت" : "Your wishlist is now saved"}
              </p>
              <button onClick={closeAuth} className="mt-4 w-full py-3 bg-brand-black dark:bg-offwhite text-white dark:text-brand-black text-[11px] font-black tracking-widest uppercase hover:bg-[#333] transition-all">
                {ar ? "متابعة" : "Continue"}
              </button>
            </div>
          ) : customer ? (
            <div className="text-center py-2">
              <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">{ar ? "مسجل دخول بـ" : "Logged in as"}</p>
              <p className="text-sm font-bold text-brand-black dark:text-offwhite">{customer.phone}</p>
              <button onClick={() => { logout(); closeAuth(); }}
                className="mt-4 w-full py-2.5 border border-gray-200 dark:border-white/10 text-xs font-bold text-gray-500 dark:text-gray-400 hover:border-red-300 hover:text-red-500 transition-all">
                {ar ? "تسجيل خروج" : "Log Out"}
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed">
                {ar
                  ? "سجل برقم تليفونك عشان الـ Wishlist بتاعتك تتحفظ وتوصلك تنبيهات الخصومات والمخزون."
                  : "Save your wishlist and get alerts for price drops & low stock."}
              </p>

              <div>
                <label className="label-style block mb-1.5">{ar ? "رقم التليفون" : "Phone Number"}</label>
                <input
                  type="tel" value={phone} onChange={e => setPhone(e.target.value)}
                  placeholder="010XXXXXXXX" dir="ltr"
                  className="input-style font-mono"
                />
              </div>

              <div>
                <label className="label-style block mb-1.5">{ar ? "الاسم (اختياري)" : "Name (optional)"}</label>
                <input
                  type="text" value={name} onChange={e => setName(e.target.value)}
                  placeholder={ar ? "اسمك هنا" : "Your name"}
                  className="input-style"
                />
              </div>

              {error && <p className="text-xs text-red-500">{error}</p>}

              <button type="submit" disabled={loading || !phone.trim()}
                className="w-full py-3 bg-brand-black dark:bg-offwhite text-white dark:text-brand-black text-[11px] font-black tracking-[0.15em] uppercase disabled:opacity-40 hover:bg-[#333] dark:hover:bg-gray-200 transition-all active:scale-[0.98]">
                {loading ? "..." : ar ? "دخول / تسجيل" : "Login / Register"}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
