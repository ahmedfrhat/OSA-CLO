"use client";

import { useState, useEffect } from "react";
import { useLanguage } from "@/context/LanguageContext";

interface DiscountCode {
  id: string;
  code: string;
  type: "percent" | "fixed";
  value: number;
  min_order: number;
  max_uses: number | null;
  uses_count: number;
  expires_at: string | null;
  is_active: boolean;
  created_at: string;
}

const EMPTY_FORM = {
  code: "",
  type: "percent" as "percent" | "fixed",
  value: "",
  min_order: "",
  max_uses: "",
  expires_at: "",
};

export default function DiscountsTab() {
  const { t } = useLanguage();
  const [discounts, setDiscounts] = useState<DiscountCode[]>([]);
  const [loading, setLoading]     = useState(true);
  const [form, setForm]           = useState(EMPTY_FORM);
  const [saving, setSaving]       = useState(false);
  const [error, setError]         = useState("");
  const [success, setSuccess]     = useState("");
  const [deletingId, setDeletingId] = useState<string | null>(null);

  async function load() {
    setLoading(true);
    const res = await fetch("/api/admin/discounts");
    if (res.ok) {
      const data = await res.json();
      setDiscounts(data.discounts ?? []);
    }
    setLoading(false);
  }

  useEffect(() => { load(); }, []);

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError("");
    setSuccess("");

    const res = await fetch("/api/admin/discounts", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        code:      form.code,
        type:      form.type,
        value:     Number(form.value),
        min_order: form.min_order ? Number(form.min_order) : 0,
        max_uses:  form.max_uses  ? Number(form.max_uses)  : null,
        expires_at: form.expires_at || null,
      }),
    });

    const data = await res.json();
    if (!res.ok) { setError(data.error || "Failed to create code"); }
    else {
      setSuccess(`✓ Code "${data.discount.code}" created!`);
      setDiscounts((prev) => [data.discount, ...prev]);
      setForm(EMPTY_FORM);
    }
    setSaving(false);
  }

  async function handleDelete(id: string, code: string) {
    if (!window.confirm(`Delete code "${code}"?`)) return;
    setDeletingId(id);
    await fetch(`/api/admin/discounts?id=${id}`, { method: "DELETE" });
    setDiscounts((prev) => prev.filter((d) => d.id !== id));
    setDeletingId(null);
  }

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h2 className="text-base font-bold text-[#1A1A1A]">{t("admin.discounts.title")}</h2>
        <p className="text-xs text-gray-400">{discounts.length} {t("admin.discounts.activeCodes")}</p>
      </div>

      {/* ── Create Form ── */}
      <form onSubmit={handleCreate} className="bg-white border border-gray-200 p-4 sm:p-6">
        <p className="text-[10px] font-bold tracking-[0.15em] uppercase text-gray-400 mb-4">{t("admin.discounts.create")}</p>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-3">
          {/* Code */}
          <div className="col-span-2 sm:col-span-1">
            <label className="label-style">{t("admin.discounts.code")}</label>
            <input
              required
              value={form.code}
              onChange={(e) => setForm((f) => ({ ...f, code: e.target.value.toUpperCase() }))}
              placeholder="SUMMER20"
              className="input-style mt-1 font-mono tracking-widest"
            />
          </div>

          {/* Type */}
          <div>
            <label className="label-style">{t("admin.discounts.type")}</label>
            <select value={form.type} onChange={(e) => setForm((f) => ({ ...f, type: e.target.value as "percent" | "fixed" }))}
              className="input-style mt-1">
              <option value="percent">{t("admin.discounts.percent")}</option>
              <option value="fixed">{t("admin.discounts.fixed")}</option>
            </select>
          </div>

          {/* Value */}
          <div>
            <label className="label-style">{form.type === "percent" ? t("admin.discounts.valuePercent") : t("admin.discounts.valueFixed")}</label>
            <input
              required type="number" min="1" max={form.type === "percent" ? 100 : undefined}
              value={form.value}
              onChange={(e) => setForm((f) => ({ ...f, value: e.target.value }))}
              placeholder={form.type === "percent" ? "20" : "50"}
              className="input-style mt-1"
            />
          </div>

          {/* Min order */}
          <div>
            <label className="label-style">{t("admin.discounts.minOrder")}</label>
            <input type="number" min="0" value={form.min_order}
              onChange={(e) => setForm((f) => ({ ...f, min_order: e.target.value }))}
              placeholder="0"
              className="input-style mt-1"
            />
          </div>

          {/* Max uses */}
          <div>
            <label className="label-style">{t("admin.discounts.maxUses")}</label>
            <input type="number" min="1" value={form.max_uses}
              onChange={(e) => setForm((f) => ({ ...f, max_uses: e.target.value }))}
              placeholder={t("admin.discounts.unlimited")}
              className="input-style mt-1"
            />
          </div>

          {/* Expires at */}
          <div>
            <label className="label-style">{t("admin.discounts.expiresAt")}</label>
            <input type="datetime-local" value={form.expires_at}
              onChange={(e) => setForm((f) => ({ ...f, expires_at: e.target.value }))}
              className="input-style mt-1"
            />
          </div>
        </div>

        {error   && <p className="text-xs text-red-500 mb-2">{error}</p>}
        {success && <p className="text-xs text-green-600 mb-2">{success}</p>}

        <button type="submit" disabled={saving} className="btn-dark text-[11px] disabled:opacity-50">
          {saving ? t("admin.discounts.creating") : t("admin.discounts.createBtn")}
        </button>
      </form>

      {/* ── Codes List ── */}
      {loading ? (
        <div className="flex justify-center py-10">
          <div className="w-5 h-5 border-2 border-gray-200 border-t-[#1A1A1A] rounded-full animate-spin" />
        </div>
      ) : discounts.length === 0 ? (
        <div className="bg-white border border-dashed border-gray-200 py-12 text-center">
          <p className="text-sm font-semibold text-gray-300">{t("admin.discounts.noCodes")}</p>
        </div>
      ) : (
        <>
          {/* Desktop table */}
          <div className="hidden sm:block bg-white border border-gray-200 overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100">
                  <th className="th-style">{t("admin.discounts.code")}</th>
                  <th className="th-style">{t("admin.discounts.type")}</th>
                  <th className="th-style">{form.type === "percent" ? t("admin.discounts.valuePercent") : t("admin.discounts.valueFixed")}</th>
                  <th className="th-style">{t("admin.discounts.minOrder")}</th>
                  <th className="th-style">{t("admin.discounts.maxUses")}</th>
                  <th className="th-style">{t("admin.discounts.expiresAt")}</th>
                  <th className="th-style">{t("admin.dashboard.orders.table.status")}</th>
                  <th className="th-style">{t("admin.discounts.delete")}</th>
                </tr>
              </thead>
              <tbody>
                {discounts.map((d) => {
                  const expired = d.expires_at && new Date(d.expires_at) < new Date();
                  const maxed   = d.max_uses !== null && d.uses_count >= d.max_uses;
                  const isValid = d.is_active && !expired && !maxed;
                  return (
                    <tr key={d.id} className="border-b border-gray-50 hover:bg-gray-50">
                      <td className="px-4 py-3 font-mono font-bold text-xs tracking-widest text-[#1A1A1A]">{d.code}</td>
                      <td className="px-4 py-3 text-xs text-gray-500">{d.type}</td>
                      <td className="px-4 py-3 text-xs font-bold">
                        {d.type === "percent" ? `${d.value}%` : `EGP ${d.value}`}
                      </td>
                      <td className="px-4 py-3 text-xs text-gray-500">
                        {d.min_order > 0 ? `EGP ${d.min_order}` : "—"}
                      </td>
                      <td className="px-4 py-3 text-xs font-mono">
                        {d.uses_count}{d.max_uses !== null ? ` / ${d.max_uses}` : " / ∞"}
                      </td>
                      <td className="px-4 py-3 text-xs text-gray-400">
                        {d.expires_at ? new Date(d.expires_at).toLocaleDateString("en-GB") : "—"}
                      </td>
                      <td className="px-4 py-3">
                        <span className={`text-[10px] font-bold px-2 py-0.5 border ${isValid ? "border-green-200 text-green-700 bg-green-50" : "border-red-200 text-red-600 bg-red-50"}`}>
                          {isValid ? t("admin.discounts.statusActive") : expired ? t("admin.discounts.statusExpired") : maxed ? t("admin.discounts.statusMaxUsed") : t("admin.discounts.statusInactive")}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <button onClick={() => handleDelete(d.id, d.code)} disabled={deletingId === d.id}
                          className="text-[10px] font-bold text-gray-400 hover:text-red-500 transition-colors disabled:opacity-40">
                          {t("admin.discounts.delete")}
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Mobile cards */}
          <div className="sm:hidden flex flex-col gap-2">
            {discounts.map((d) => {
              const expired = d.expires_at && new Date(d.expires_at) < new Date();
              const maxed   = d.max_uses !== null && d.uses_count >= d.max_uses;
              const isValid = d.is_active && !expired && !maxed;
              return (
                <div key={d.id} className="bg-white border border-gray-200 p-4">
                  <div className="flex items-center justify-between mb-2">
                    <p className="font-mono font-black text-sm tracking-widest text-[#1A1A1A]">{d.code}</p>
                    <span className={`text-[10px] font-bold px-2 py-0.5 border ${isValid ? "border-green-200 text-green-700 bg-green-50" : "border-red-200 text-red-600 bg-red-50"}`}>
                      {isValid ? t("admin.discounts.statusActive") : expired ? t("admin.discounts.statusExpired") : t("admin.discounts.statusInactive")}
                    </span>
                  </div>
                  <div className="grid grid-cols-3 gap-2 text-xs mb-3">
                    <div>
                      <p className="text-[9px] text-gray-400">{t("admin.discounts.valueFixed")}</p>
                      <p className="font-bold">{d.type === "percent" ? `${d.value}%` : `EGP ${d.value}`}</p>
                    </div>
                    <div>
                      <p className="text-[9px] text-gray-400">{t("admin.discounts.maxUses")}</p>
                      <p className="font-mono">{d.uses_count}{d.max_uses !== null ? `/${d.max_uses}` : "/∞"}</p>
                    </div>
                    <div>
                      <p className="text-[9px] text-gray-400">{t("admin.discounts.expiresAt")}</p>
                      <p>{d.expires_at ? new Date(d.expires_at).toLocaleDateString("en-GB") : "—"}</p>
                    </div>
                  </div>
                  <button onClick={() => handleDelete(d.id, d.code)} disabled={deletingId === d.id}
                    className="text-[10px] font-bold text-red-400 hover:text-red-600 transition-colors">
                    {t("admin.discounts.delete")}
                  </button>
                </div>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
}
