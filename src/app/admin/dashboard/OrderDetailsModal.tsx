"use client";

import { useState, useCallback, useEffect } from "react";
import { useLanguage } from "@/context/LanguageContext";

// ── Types ─────────────────────────────────────────────────────────────────────
interface ActivityEntry { status: string; by: string; at: string; }

interface OrderItem {
  id: string;
  product_id: string;
  quantity: number;
  size?: string;
  unit_price: number;
  cost_price: number;
  products?: { name_en: string; name_ar?: string; image_url?: string };
}

export interface FullOrder {
  id: string;
  partner_id: string;
  customer_name: string;
  customer_phone?: string;
  customer_address?: string;
  source?: string;
  status: string;
  notes?: string;
  total_amount: number;
  paid_amount?: number;
  activity_log?: string;
  created_at: string;
  updated_at?: string;
  order_items?: OrderItem[];
}

interface Props {
  orderId: string;
  partnerName: string;
  onClose: () => void;
  onStatusChange: (orderId: string, status: string) => void;
  onPaidAmountChange: (orderId: string, amount: number) => void;
}

const STATUSES = ["pending", "processing", "shipped", "closed"] as const;
type Status = typeof STATUSES[number];

const STATUS_LABELS: Record<Status, { en: string; ar: string; color: string }> = {
  pending:    { en: "Pending",    ar: "قيد الانتظار", color: "bg-yellow-50 text-yellow-700 border-yellow-200" },
  processing: { en: "Processing", ar: "جاري التجهيز",  color: "bg-blue-50 text-blue-700 border-blue-200"      },
  shipped:    { en: "Shipped",    ar: "تم الشحن",      color: "bg-purple-50 text-purple-700 border-purple-200" },
  closed:     { en: "Closed",     ar: "مغلق",          color: "bg-green-50 text-green-700 border-green-200"   },
};

function fmtDate(d: string) {
  return new Date(d).toLocaleString("en-GB", {
    day: "2-digit", month: "short", year: "numeric",
    hour: "2-digit", minute: "2-digit",
  });
}

export default function OrderDetailsModal({
  orderId, partnerName, onClose, onStatusChange, onPaidAmountChange,
}: Props) {
  const { lang, isRTL } = useLanguage();

  // ── All hooks at top level — NO conditional hook calls ───────────────────
  const [order, setOrder]               = useState<FullOrder | null>(null);
  const [loading, setLoading]           = useState(true);
  const [error, setError]               = useState("");
  const [updatingStatus, setUpdatingStatus] = useState(false);
  const [editingPaid, setEditingPaid]   = useState(false);
  const [paidInput, setPaidInput]       = useState("");
  const [showInvoice, setShowInvoice]   = useState(false);

  const loadOrder = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const res  = await fetch(`/api/admin/orders/${orderId}`);
      const data = await res.json();
      if (!res.ok) { setError(data.error || "Failed to load order"); return; }
      setOrder(data.order);
      setPaidInput(String(data.order.paid_amount ?? 0));
    } catch {
      setError("Network error");
    } finally {
      setLoading(false);
    }
  }, [orderId]);

  useEffect(() => { loadOrder(); }, [loadOrder]);

  // ── Handlers ─────────────────────────────────────────────────────────────
  async function handleStatusChange(newStatus: string) {
    if (!order || updatingStatus) return;
    setUpdatingStatus(true);
    const res  = await fetch(`/api/admin/orders/${orderId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: newStatus }),
    });
    const data = await res.json();
    if (res.ok) {
      setOrder(data.order);
      onStatusChange(orderId, newStatus);
    }
    setUpdatingStatus(false);
  }

  async function handlePaidSave() {
    if (!order) return;
    const amount = parseFloat(paidInput) || 0;
    const res  = await fetch(`/api/admin/orders/${orderId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ paid_amount: amount }),
    });
    const data = await res.json();
    if (res.ok) {
      setOrder(data.order);
      onPaidAmountChange(orderId, amount);
    }
    setEditingPaid(false);
  }

  // ── Derived values ────────────────────────────────────────────────────────
  let activityLog: ActivityEntry[] = [];
  try { activityLog = JSON.parse(order?.activity_log ?? "[]"); } catch { activityLog = []; }

  const total     = order?.total_amount ?? 0;
  const paid      = order?.paid_amount  ?? 0;
  const remaining = Math.max(0, total - paid);

  const sl = (s: string) =>
    STATUS_LABELS[s as Status]?.[lang === "ar" ? "ar" : "en"] ?? s;

  // ── Invoice view ──────────────────────────────────────────────────────────
  if (showInvoice && order) {
    return (
      <InvoiceView
        order={order}
        partnerName={partnerName}
        onClose={() => setShowInvoice(false)}
        lang={lang}
      />
    );
  }

  // ── Main modal ────────────────────────────────────────────────────────────
  return (
    /* Overlay */
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-end sm:items-center justify-center sm:p-4">
      {/* Sheet: full-screen on mobile, max-w dialog on desktop */}
      <div
        dir={isRTL ? "rtl" : "ltr"}
        className="bg-white w-full sm:max-w-2xl sm:max-h-[90vh] h-full sm:h-auto flex flex-col shadow-2xl animate-slide-up sm:animate-scale-in"
      >
        {/* ── Sticky Header ── */}
        <div className="flex items-center justify-between px-4 sm:px-6 py-4 border-b border-gray-100 shrink-0">
          <div>
            <p className="text-[10px] font-bold tracking-[0.15em] uppercase text-gray-400">
              {lang === "ar" ? "تفاصيل الطلب" : "Order Details"}
            </p>
            <h2 className="text-sm font-bold text-[#1A1A1A] font-mono mt-0.5">
              #{orderId.slice(0, 8).toUpperCase()}
            </h2>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowInvoice(true)}
              className="flex items-center gap-1.5 px-3 py-2 border border-gray-200 text-[10px] font-bold tracking-widest uppercase text-gray-500 hover:border-gray-400 hover:text-[#1A1A1A] transition-all"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/>
              </svg>
              {lang === "ar" ? "فاتورة" : "Invoice"}
            </button>
            <button onClick={onClose} className="w-9 h-9 flex items-center justify-center text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors text-lg">✕</button>
          </div>
        </div>

        {/* ── Scrollable Body ── */}
        <div className="flex-1 overflow-y-auto">
          {/* Loading */}
          {loading && (
            <div className="p-10 flex justify-center">
              <div className="w-6 h-6 border-2 border-gray-200 border-t-[#1A1A1A] rounded-full animate-spin" />
            </div>
          )}

          {/* Error */}
          {!loading && error && (
            <div className="p-6">
              <p className="text-red-500 text-sm">{error}</p>
            </div>
          )}

          {/* Body */}
          {!loading && !error && order && (
            <div className="p-4 sm:p-6 flex flex-col gap-5">

              {/* Status Workflow — large touch targets */}
              <div className="flex flex-col gap-2">
                <p className="label-style">{lang === "ar" ? "حالة الطلب" : "Order Status"}</p>
                <div className="grid grid-cols-2 sm:flex sm:flex-wrap gap-2">
                  {STATUSES.map((s) => (
                    <button
                      key={s}
                      disabled={updatingStatus}
                      onClick={() => handleStatusChange(s)}
                      className={`py-3 sm:py-1.5 sm:px-3 text-[11px] font-bold tracking-wide border transition-all duration-150 disabled:opacity-50
                        ${order.status === s
                          ? STATUS_LABELS[s].color
                          : "border-gray-200 text-gray-400 hover:border-gray-400"
                        }`}
                    >
                      {STATUS_LABELS[s][lang === "ar" ? "ar" : "en"]}
                    </button>
                  ))}
                </div>
              </div>

              {/* Customer Info */}
              <div className="grid grid-cols-2 gap-3 sm:gap-4">
                <InfoBlock label={lang === "ar" ? "اسم العميل" : "Customer"} value={order.customer_name} />
                <InfoBlock
                  label={lang === "ar" ? "الهاتف" : "Phone"}
                  value={order.customer_phone || "—"}
                  extra={order.customer_phone ? (
                    <a
                      href={`https://wa.me/${order.customer_phone.replace(/\D/g, "")}`}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1 mt-1 text-[10px] font-bold text-green-600 hover:text-green-700"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/>
                        <path d="M11.999 2C6.477 2 2 6.477 2 12c0 1.991.52 3.863 1.432 5.482L2 22l4.664-1.408A9.956 9.956 0 0 0 12 22c5.523 0 10-4.477 10-10S17.523 2 11.999 2z"/>
                      </svg>
                      WhatsApp
                    </a>
                  ) : null}
                />
                {order.customer_address && (
                  <InfoBlock label={lang === "ar" ? "العنوان" : "Address"} value={order.customer_address} />
                )}
                <InfoBlock label={lang === "ar" ? "المصدر" : "Source"} value={order.source?.toUpperCase() || "—"} />
                <InfoBlock label={lang === "ar" ? "تاريخ الطلب" : "Order Date"} value={fmtDate(order.created_at)} />
              </div>

              {/* Order Items */}
              {(order.order_items?.length ?? 0) > 0 && (
                <div className="flex flex-col gap-2">
                  <p className="label-style">{lang === "ar" ? "المنتجات" : "Items"}</p>
                  <div className="border border-gray-100 overflow-hidden">
                    <table className="w-full text-xs">
                      <thead>
                        <tr className="bg-gray-50 border-b border-gray-100">
                          <th className="text-left px-3 py-2 font-bold tracking-wide text-gray-400">{lang === "ar" ? "المنتج" : "Product"}</th>
                          <th className="text-left px-3 py-2 font-bold tracking-wide text-gray-400">{lang === "ar" ? "المقاس" : "Size"}</th>
                          <th className="text-center px-3 py-2 font-bold tracking-wide text-gray-400">{lang === "ar" ? "الكمية" : "Qty"}</th>
                          <th className="text-right px-3 py-2 font-bold tracking-wide text-gray-400">{lang === "ar" ? "السعر" : "Price"}</th>
                          <th className="text-right px-3 py-2 font-bold tracking-wide text-gray-400">{lang === "ar" ? "الإجمالي" : "Total"}</th>
                        </tr>
                      </thead>
                      <tbody>
                        {(order.order_items ?? []).map((item) => (
                          <tr key={item.id} className="border-b border-gray-50">
                            <td className="px-3 py-2.5">
                              <div className="flex items-center gap-2">
                                {item.products?.image_url && (
                                  // eslint-disable-next-line @next/next/no-img-element
                                  <img src={item.products.image_url} alt="" className="w-7 h-7 object-cover bg-gray-100 shrink-0" />
                                )}
                                <span className="font-semibold text-[#1A1A1A]">{item.products?.name_en ?? "—"}</span>
                              </div>
                            </td>
                            <td className="px-3 py-2.5 text-gray-500">{item.size || "—"}</td>
                            <td className="px-3 py-2.5 text-center font-mono font-semibold">{item.quantity}</td>
                            <td className="px-3 py-2.5 text-right font-mono">EGP {item.unit_price.toLocaleString("en-EG")}</td>
                            <td className="px-3 py-2.5 text-right font-mono font-bold">EGP {(item.unit_price * item.quantity).toLocaleString("en-EG")}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* Payment Tracking */}
              <div className={`p-4 border ${remaining > 0 ? "border-red-200 bg-red-50" : "border-green-200 bg-green-50"}`}>
                <div className="flex items-center justify-between mb-3">
                  <p className="text-[10px] font-bold tracking-[0.12em] uppercase text-gray-500">
                    {lang === "ar" ? "تتبع الدفع" : "Payment Tracking"}
                  </p>
                  {remaining > 0 && (
                    <span className="text-[10px] font-bold text-red-600 bg-red-100 px-2 py-0.5 border border-red-200">
                      {lang === "ar" ? "رصيد متبقي" : "Balance Due"}
                    </span>
                  )}
                </div>
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <p className="text-[10px] text-gray-400">{lang === "ar" ? "الإجمالي" : "Total"}</p>
                    <p className="text-sm font-bold text-[#1A1A1A]">EGP {total.toLocaleString("en-EG")}</p>
                  </div>
                  <div>
                    <p className="text-[10px] text-gray-400">{lang === "ar" ? "المدفوع" : "Paid"}</p>
                    {editingPaid ? (
                      <div className="flex items-center gap-1 mt-0.5">
                        <input
                          type="number" min="0" value={paidInput}
                          onChange={(e) => setPaidInput(e.target.value)}
                          className="w-20 border border-gray-300 px-1.5 py-0.5 text-xs font-mono"
                          autoFocus
                        />
                        <button onClick={handlePaidSave} className="text-[10px] font-bold text-green-600 hover:text-green-700">✓</button>
                        <button onClick={() => setEditingPaid(false)} className="text-[10px] text-gray-400 hover:text-gray-600">✕</button>
                      </div>
                    ) : (
                      <button onClick={() => setEditingPaid(true)} className="text-sm font-bold text-green-700 hover:underline">
                        EGP {paid.toLocaleString("en-EG")} ✏️
                      </button>
                    )}
                  </div>
                  <div>
                    <p className="text-[10px] text-gray-400">{lang === "ar" ? "المتبقي" : "Remaining"}</p>
                    <p className={`text-sm font-bold ${remaining > 0 ? "text-red-600" : "text-green-700"}`}>
                      EGP {remaining.toLocaleString("en-EG")}
                    </p>
                  </div>
                </div>
              </div>

              {/* Notes */}
              {order.notes && (
                <div className="bg-gray-50 px-4 py-3 border border-gray-100">
                  <p className="label-style mb-1">{lang === "ar" ? "ملاحظات" : "Notes"}</p>
                  <p className="text-xs text-gray-600">{order.notes}</p>
                </div>
              )}

              {/* Activity Log */}
              {activityLog.length > 0 && (
                <div className="flex flex-col gap-2">
                  <p className="label-style">{lang === "ar" ? "سجل الأنشطة" : "Activity Log"}</p>
                  <div className="flex flex-col gap-1.5">
                    {activityLog.map((entry, i) => (
                      <div key={i} className="flex items-start gap-2 text-[11px]">
                        <span className="w-1.5 h-1.5 rounded-full bg-gray-300 mt-1.5 shrink-0" />
                        <span className="text-gray-500">
                          {lang === "ar" ? "تغيير الحالة إلى" : "Status changed to"}{" "}
                          <strong className="text-[#1A1A1A]">{sl(entry.status)}</strong>
                          {" "}{lang === "ar" ? "بواسطة" : "by"}{" "}
                          <strong className="text-[#1A1A1A]">{entry.by}</strong>
                          {" — "}
                          <span className="text-gray-400">{fmtDate(entry.at)}</span>
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Bottom spacer for mobile sticky bar */}
              <div className="h-2" />
            </div>
          )}
        </div>

        {/* ── Sticky Bottom Action Bar (mobile) ── */}
        <div className="sm:hidden shrink-0 border-t border-gray-100 bg-white px-4 py-3 flex gap-3">
          <button
            onClick={() => setShowInvoice(true)}
            className="flex-1 py-3.5 border border-gray-200 text-[11px] font-bold tracking-widest uppercase text-gray-600 hover:border-gray-400 transition-all"
          >
            {lang === "ar" ? "📄 فاتورة" : "📄 Invoice"}
          </button>
          <button
            onClick={onClose}
            className="flex-1 py-3.5 bg-[#1A1A1A] text-white text-[11px] font-bold tracking-widest uppercase hover:bg-[#333] transition-colors"
          >
            {lang === "ar" ? "إغلاق" : "Close"}
          </button>
        </div>
      </div>
    </div>
  );
}


// ── Sub-Components ─────────────────────────────────────────────────────────────
function InfoBlock({ label, value, extra }: { label: string; value: string; extra?: React.ReactNode }) {
  return (
    <div>
      <p className="label-style">{label}</p>
      <p className="text-sm font-semibold text-[#1A1A1A] mt-0.5">{value}</p>
      {extra}
    </div>
  );
}

// ── Invoice View ──────────────────────────────────────────────────────────────
function InvoiceView({
  order, partnerName, onClose, lang,
}: { order: FullOrder; partnerName: string; onClose: () => void; lang: string }) {
  const total     = order.total_amount;
  const paid      = order.paid_amount ?? 0;
  const remaining = Math.max(0, total - paid);
  const isAr      = lang === "ar";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div dir={isAr ? "rtl" : "ltr"} className="bg-white w-full max-w-lg shadow-2xl">
        {/* Controls */}
        <div className="flex items-center justify-between px-6 py-3 border-b border-gray-100 print:hidden">
          <p className="text-xs font-bold tracking-widest uppercase text-gray-400">{isAr ? "فاتورة" : "Invoice"}</p>
          <div className="flex gap-2">
            <button onClick={() => window.print()} className="btn-dark text-[10px]">
              {isAr ? "طباعة" : "Print"}
            </button>
            <button onClick={onClose} className="px-3 py-1.5 border border-gray-200 text-xs text-gray-500 hover:bg-gray-50">
              {isAr ? "إغلاق" : "Close"}
            </button>
          </div>
        </div>

        <div className="p-8">
          {/* Brand */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-2xl font-black tracking-[-0.04em] text-[#1A1A1A]">ASO CLO.</h1>
              <p className="text-xs text-gray-400 tracking-widest uppercase">{partnerName}</p>
            </div>
            <div className="text-right">
              <p className="text-xs font-bold tracking-widest uppercase text-gray-400">{isAr ? "فاتورة" : "INVOICE"}</p>
              <p className="text-[11px] font-mono text-[#1A1A1A] mt-1">#{order.id.slice(0, 8).toUpperCase()}</p>
              <p className="text-[10px] text-gray-400 mt-0.5">{new Date(order.created_at).toLocaleDateString("en-GB")}</p>
            </div>
          </div>

          {/* Customer */}
          <div className="mb-6 p-4 bg-gray-50">
            <p className="text-[10px] font-bold tracking-widest uppercase text-gray-400 mb-2">{isAr ? "بيانات العميل" : "Bill To"}</p>
            <p className="text-sm font-semibold text-[#1A1A1A]">{order.customer_name}</p>
            {order.customer_phone   && <p className="text-xs text-gray-500">{order.customer_phone}</p>}
            {order.customer_address && <p className="text-xs text-gray-500">{order.customer_address}</p>}
          </div>

          {/* Items */}
          <table className="w-full text-xs mb-6">
            <thead>
              <tr className="border-b-2 border-[#1A1A1A]">
                <th className="text-left pb-2 font-bold tracking-wide">{isAr ? "المنتج" : "Item"}</th>
                <th className="text-center pb-2 font-bold tracking-wide">{isAr ? "الكمية" : "Qty"}</th>
                <th className="text-right pb-2 font-bold tracking-wide">{isAr ? "سعر الوحدة" : "Unit Price"}</th>
                <th className="text-right pb-2 font-bold tracking-wide">{isAr ? "الإجمالي" : "Total"}</th>
              </tr>
            </thead>
            <tbody>
              {(order.order_items ?? []).map((item) => (
                <tr key={item.id} className="border-b border-gray-100">
                  <td className="py-2">
                    {item.products?.name_en ?? "Product"}
                    {item.size && <span className="text-gray-400 ml-1">({item.size})</span>}
                  </td>
                  <td className="py-2 text-center font-mono">{item.quantity}</td>
                  <td className="py-2 text-right font-mono">EGP {item.unit_price.toLocaleString("en-EG")}</td>
                  <td className="py-2 text-right font-mono font-bold">EGP {(item.unit_price * item.quantity).toLocaleString("en-EG")}</td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Totals */}
          <div className="border-t-2 border-[#1A1A1A] pt-4 flex flex-col items-end gap-1.5">
            <div className="flex gap-8 text-xs">
              <span className="text-gray-500">{isAr ? "الإجمالي" : "Subtotal"}</span>
              <span className="font-mono font-bold">EGP {total.toLocaleString("en-EG")}</span>
            </div>
            <div className="flex gap-8 text-xs">
              <span className="text-green-600">{isAr ? "المدفوع" : "Paid"}</span>
              <span className="font-mono font-bold text-green-600">EGP {paid.toLocaleString("en-EG")}</span>
            </div>
            {remaining > 0 && (
              <div className="flex gap-8 text-sm font-extrabold border-t border-gray-200 pt-1.5 mt-0.5">
                <span className="text-red-600">{isAr ? "المتبقي" : "Balance Due"}</span>
                <span className="font-mono text-red-600">EGP {remaining.toLocaleString("en-EG")}</span>
              </div>
            )}
            {remaining === 0 && (
              <div className="text-[10px] font-bold text-green-600 tracking-widest uppercase mt-1">
                ✓ {isAr ? "مدفوع بالكامل" : "Paid in Full"}
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="mt-8 pt-4 border-t border-gray-100 text-center">
            <p className="text-[10px] text-gray-400 tracking-widest uppercase">ASO CLO. — Thank you for your order</p>
          </div>
        </div>
      </div>
    </div>
  );
}
