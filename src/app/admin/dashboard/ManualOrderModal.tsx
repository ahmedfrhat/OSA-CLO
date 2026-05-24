"use client";

import { useState } from "react";
import { useLanguage } from "@/context/LanguageContext";

interface Product {
  id: string;
  name_en: string;
  selling_price: number;
  sizes?: string[] | null;
}

interface OrderItemRow {
  product_id: string;
  size: string;
  quantity: number;
}

interface Props {
  products: Product[];
  onSuccess: () => void;
  onClose: () => void;
}

const SOURCE_KEYS = ["facebook", "whatsapp", "instagram", "walk_in", "manual"] as const;

export default function ManualOrderModal({ products, onSuccess, onClose }: Props) {
  const { t, isRTL } = useLanguage();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [items, setItems] = useState<OrderItemRow[]>([{ product_id: "", size: "", quantity: 1 }]);
  const [form, setForm] = useState({
    customer_name:    "",
    customer_phone:   "",
    customer_address: "",
    source:           "whatsapp",
    paid_amount:      "",
    notes:            "",
  });

  function setField(field: string, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  function setItem(index: number, field: keyof OrderItemRow, value: string | number) {
    setItems((prev) => {
      const updated = [...prev];
      updated[index] = { ...updated[index], [field]: value };
      return updated;
    });
  }

  const orderTotal = items.reduce((sum, item) => {
    const p = products.find((x) => x.id === item.product_id);
    return sum + (p?.selling_price ?? 0) * item.quantity;
  }, 0);

  const paidNum     = parseFloat(form.paid_amount) || 0;
  const remaining   = Math.max(0, orderTotal - paidNum);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    const validItems = items.filter((i) => i.product_id && i.quantity > 0);
    if (!validItems.length) { setError(t("admin.manualOrder.error.noItems")); return; }

    setLoading(true);
    try {
      const res = await fetch("/api/admin/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customer_name:    form.customer_name,
          customer_phone:   form.customer_phone,
          customer_address: form.customer_address,
          source:           form.source,
          paid_amount:      paidNum,
          notes:            form.notes,
          items:            validItems,
        }),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.error || t("admin.manualOrder.error.required")); setLoading(false); return; }
      onSuccess();
    } catch {
      setError(t("admin.manualOrder.error.network"));
      setLoading(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div dir={isRTL ? "rtl" : "ltr"} className="bg-white dark:bg-gray-900 w-full max-w-xl max-h-[90vh] overflow-y-auto shadow-2xl">

        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 dark:border-gray-800">
          <div>
            <h2 className="text-sm font-bold tracking-[0.08em] uppercase text-[#1A1A1A] dark:text-gray-100">{t("admin.manualOrder.title")}</h2>
            <p className="text-xs text-gray-400 mt-0.5">{t("admin.manualOrder.subtitle")}</p>
          </div>
          <button onClick={onClose} className="w-8 h-8 flex items-center justify-center text-gray-400 dark:text-gray-500 hover:text-gray-700 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">✕</button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 flex flex-col gap-5">

          {/* Customer Info */}
          <div className="flex flex-col gap-3">
            <h3 className="label-style">{t("admin.manualOrder.customerInfo")}</h3>
            <div className="grid grid-cols-2 gap-3">
              <div className="flex flex-col gap-1.5">
                <label className="label-style">{t("admin.manualOrder.customerName")}</label>
                <input type="text" required value={form.customer_name} onChange={(e) => setField("customer_name", e.target.value)} placeholder={t("admin.manualOrder.namePlaceholder")} className="input-style" />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="label-style">{t("admin.manualOrder.customerPhone")}</label>
                <input type="tel" value={form.customer_phone} onChange={(e) => setField("customer_phone", e.target.value)} placeholder={t("admin.manualOrder.phonePlaceholder")} className="input-style" />
              </div>
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="label-style">{t("admin.manualOrder.customerAddress")}</label>
              <input type="text" value={form.customer_address} onChange={(e) => setField("customer_address", e.target.value)} placeholder={t("admin.manualOrder.addressPlaceholder")} className="input-style" />
            </div>
          </div>

          {/* Source */}
          <div className="flex flex-col gap-1.5">
            <label className="label-style">{t("admin.manualOrder.source")}</label>
            <div className="flex gap-2 flex-wrap">
              {SOURCE_KEYS.map((key) => (
                <button key={key} type="button" onClick={() => setField("source", key)}
                  className={`px-3 py-1.5 text-[11px] font-semibold tracking-wide border transition-all
                    ${form.source === key 
                      ? "bg-[#1A1A1A] text-white border-[#1A1A1A] dark:bg-offwhite dark:text-brand-black dark:border-offwhite" 
                      : "bg-white dark:bg-gray-800 text-gray-500 dark:text-gray-400 border-gray-200 dark:border-gray-700 hover:border-gray-400 dark:hover:border-gray-500"}`}>
                  {t(`admin.manualOrder.sources.${key}`)}
                </button>
              ))}
            </div>
          </div>

          {/* Order Items */}
          <div className="flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <h3 className="label-style">{t("admin.manualOrder.orderItems")}</h3>
              <button type="button" onClick={() => setItems((p) => [...p, { product_id: "", size: "", quantity: 1 }])}
                className="text-[11px] font-semibold text-[#1A1A1A] dark:text-offwhite underline underline-offset-2 hover:text-gray-500">
                {t("admin.manualOrder.addItem")}
              </button>
            </div>
            {items.map((item, i) => {
              const sel = products.find((p) => p.id === item.product_id);
              return (
                <div key={i} className="grid grid-cols-[1fr_auto_auto_auto] gap-2 items-end">
                  <div className="flex flex-col gap-1">
                    {i === 0 && <span className="label-style">{t("admin.manualOrder.headers.product")}</span>}
                    <select required value={item.product_id} onChange={(e) => setItem(i, "product_id", e.target.value)} className="input-style text-xs">
                      <option value="">{t("admin.manualOrder.selectProduct")}</option>
                      {products.map((p) => <option key={p.id} value={p.id}>{p.name_en} — EGP {p.selling_price}</option>)}
                    </select>
                  </div>
                  <div className="flex flex-col gap-1 w-24">
                    {i === 0 && <span className="label-style">{t("admin.manualOrder.headers.size")}</span>}
                    {sel?.sizes?.length
                      ? <select value={item.size} onChange={(e) => setItem(i, "size", e.target.value)} className="input-style text-xs">
                          <option value="">—</option>
                          {sel.sizes.map((s) => <option key={s} value={s}>{s}</option>)}
                        </select>
                      : <input type="text" value={item.size} onChange={(e) => setItem(i, "size", e.target.value)} placeholder="M" className="input-style text-xs" />
                    }
                  </div>
                  <div className="flex flex-col gap-1 w-16">
                    {i === 0 && <span className="label-style">{t("admin.manualOrder.headers.qty")}</span>}
                    <input type="number" min="1" value={item.quantity} onChange={(e) => setItem(i, "quantity", parseInt(e.target.value) || 1)} className="input-style text-center text-xs" />
                  </div>
                  <div className={i === 0 ? "flex flex-col gap-1" : ""}>
                    {i === 0 && <span className="label-style invisible">x</span>}
                    <button type="button" disabled={items.length === 1} onClick={() => setItems((p) => p.filter((_, j) => j !== i))}
                      className="w-8 h-9 flex items-center justify-center text-gray-300 hover:text-red-500 disabled:opacity-20 transition-colors">
                      <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14H6L5 6"/><path d="M10 11v6M14 11v6"/></svg>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Payment Section */}
          <div className="border border-gray-100 dark:border-gray-800 p-4 flex flex-col gap-3">
            <h3 className="label-style">{t("admin.manualOrder.payment")}</h3>
            <div className="grid grid-cols-2 gap-3">
              <div className="flex flex-col gap-1.5">
                <label className="label-style">{t("admin.manualOrder.orderTotal")}</label>
                <div className="input-style bg-gray-50 dark:bg-gray-800 font-mono font-bold text-[#1A1A1A] dark:text-offwhite">
                  EGP {orderTotal.toLocaleString("en-EG")}
                </div>
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="label-style">{t("admin.manualOrder.paidAmount")}</label>
                <input type="number" min="0" value={form.paid_amount}
                  onChange={(e) => setField("paid_amount", e.target.value)}
                  placeholder="0" className="input-style font-mono" />
              </div>
            </div>
            {orderTotal > 0 && (
              <div className={`flex items-center justify-between px-3 py-2 border ${remaining > 0 ? "bg-red-50 dark:bg-red-950/30 border-red-200 dark:border-red-900/50" : "bg-green-50 dark:bg-green-950/30 border-green-200 dark:border-green-900/50"}`}>
                <span className="text-[11px] font-semibold text-gray-500 dark:text-gray-400">{t("admin.manualOrder.remaining")}</span>
                <span className={`text-sm font-bold ${remaining > 0 ? "text-red-600 dark:text-red-400" : "text-green-700 dark:text-green-400"}`}>
                  EGP {remaining.toLocaleString("en-EG")}
                </span>
              </div>
            )}
          </div>

          {/* Notes */}
          <div className="flex flex-col gap-1.5">
            <label className="label-style">{t("admin.manualOrder.notes")}</label>
            <textarea value={form.notes} onChange={(e) => setField("notes", e.target.value)} placeholder={t("admin.manualOrder.notesPlaceholder")} rows={2} className="input-style resize-none text-xs" />
          </div>

          {error && <div className="bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-900/50 px-4 py-3"><p className="text-red-600 dark:text-red-400 text-xs font-medium">{error}</p></div>}

          <div className="flex gap-3 pt-2 border-t border-gray-100 dark:border-gray-800">
            <button type="button" onClick={onClose} className="flex-1 py-3 border border-gray-200 dark:border-gray-700 text-gray-500 dark:text-gray-400 text-xs font-semibold tracking-widest uppercase hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
              {t("common.cancel")}
            </button>
            <button type="submit" disabled={loading} className="flex-1 py-3 bg-[#1A1A1A] dark:bg-offwhite text-white dark:text-brand-black text-xs font-bold tracking-widest uppercase hover:bg-[#333] dark:hover:bg-gray-200 disabled:opacity-40 transition-colors">
              {loading ? t("admin.manualOrder.submitting") : t("admin.manualOrder.submitBtn")}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
