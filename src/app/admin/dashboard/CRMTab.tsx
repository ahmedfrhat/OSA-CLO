"use client";

import { useMemo, useState } from "react";
import { useLanguage } from "@/context/LanguageContext";

interface Order {
  id: string;
  customer_name: string;
  customer_phone?: string;
  total_amount: number;
  created_at: string;
  status: string;
}

interface CustomerRecord {
  name: string;
  phone: string;
  orderCount: number;
  totalSpent: number;
  lastOrder: string;
  orders: Order[];
}

interface Props {
  orders: Order[];
}

export default function CRMTab({ orders }: Props) {
  const { t } = useLanguage();
  const [search, setSearch] = useState("");
  const [expanded, setExpanded] = useState<string | null>(null);

  const customers = useMemo<CustomerRecord[]>(() => {
    const map = new Map<string, CustomerRecord>();
    orders.forEach((o) => {
      const key = (o.customer_phone || o.customer_name).trim();
      if (!map.has(key)) {
        map.set(key, {
          name:       o.customer_name,
          phone:      o.customer_phone ?? "",
          orderCount: 0,
          totalSpent: 0,
          lastOrder:  o.created_at,
          orders:     [],
        });
      }
      const rec = map.get(key)!;
      rec.orderCount += 1;
      rec.totalSpent += o.total_amount;
      if (o.created_at > rec.lastOrder) rec.lastOrder = o.created_at;
      rec.orders.push(o);
    });
    return Array.from(map.values()).sort((a, b) => b.totalSpent - a.totalSpent);
  }, [orders]);

  const filtered = useMemo(() => {
    if (!search.trim()) return customers;
    const q = search.toLowerCase();
    return customers.filter(
      (c) => c.name.toLowerCase().includes(q) || c.phone.includes(q)
    );
  }, [customers, search]);

  const totalRevenue  = customers.reduce((s, c) => s + c.totalSpent, 0);
  const repeatBuyers  = customers.filter((c) => c.orderCount > 1).length;

  return (
    <div className="flex flex-col gap-5">
      <div>
        <h2 className="text-base font-bold text-[#1A1A1A] dark:text-offwhite">{t("admin.crm.title")}</h2>
        <p className="text-xs text-gray-400">{customers.length} {t("admin.crm.uniqueCustomers")}</p>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        <div className="bg-white dark:bg-brand-gray border border-gray-200 dark:border-brand-border/20 p-4">
          <p className="text-[9px] font-bold tracking-widest uppercase text-gray-400">{t("admin.crm.totalCustomers")}</p>
          <p className="text-xl font-bold text-[#1A1A1A] dark:text-offwhite mt-1">{customers.length}</p>
        </div>
        <div className="bg-white dark:bg-brand-gray border border-gray-200 dark:border-brand-border/20 p-4">
          <p className="text-[9px] font-bold tracking-widest uppercase text-gray-400">{t("admin.crm.repeatBuyers")}</p>
          <p className="text-xl font-bold text-green-700 dark:text-green-400 mt-1">{repeatBuyers}</p>
        </div>
        <div className="bg-white dark:bg-brand-gray border border-gray-200 dark:border-brand-border/20 p-4 col-span-2 sm:col-span-1">
          <p className="text-[9px] font-bold tracking-widest uppercase text-gray-400">{t("admin.crm.totalRevenue")}</p>
          <p className="text-lg font-bold text-[#1A1A1A] dark:text-offwhite mt-1">EGP {totalRevenue.toLocaleString("en-EG")}</p>
        </div>
      </div>

      {/* Search */}
      <input
        type="search"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder={t("admin.crm.search")}
        className="input-style"
      />

      {/* Customers list */}
      {filtered.length === 0 ? (
        <div className="bg-white dark:bg-brand-gray border border-dashed border-gray-200 dark:border-brand-border/20 py-12 text-center">
          <p className="text-sm font-semibold text-gray-300">{t("admin.crm.noCustomers")}</p>
        </div>
      ) : (
        <div className="flex flex-col gap-2">
          {filtered.map((c) => {
            const key       = c.phone || c.name;
            const isExpanded = expanded === key;
            const avgOrder   = c.totalSpent / c.orderCount;
            return (
              <div key={key} className="bg-white dark:bg-brand-gray border border-gray-200 dark:border-brand-border/20">
                {/* Customer row */}
                <button
                  onClick={() => setExpanded(isExpanded ? null : key)}
                  className="w-full p-4 text-left flex items-center gap-4 hover:bg-gray-50 dark:bg-brand-black transition-colors"
                >
                  {/* Avatar */}
                  <div className="w-10 h-10 bg-[#1A1A1A] text-white flex items-center justify-center font-black text-sm shrink-0">
                    {c.name.slice(0, 2).toUpperCase()}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-bold text-[#1A1A1A] dark:text-offwhite truncate">{c.name}</p>
                      {c.orderCount > 1 && (
                        <span className="text-[9px] font-bold bg-blue-50 text-blue-600 border border-blue-200 px-1.5 py-0.5 shrink-0">
                          {t("common.repeatCustomer")}
                        </span>
                      )}
                    </div>
                    {c.phone && (
                      <p className="text-[10px] text-gray-400 font-mono">{c.phone}</p>
                    )}
                  </div>
                  <div className="text-right shrink-0 rtl:text-left">
                    <p className="text-sm font-bold text-[#1A1A1A] dark:text-offwhite">EGP {c.totalSpent.toLocaleString("en-EG")}</p>
                    <p className="text-[10px] text-gray-400">{c.orderCount} {t("admin.crm.orders")}</p>
                  </div>
                  <span className={`text-gray-400 transition-transform duration-200 ${isExpanded ? "rotate-180" : ""}`}>▾</span>
                </button>

                {/* Expanded detail */}
                {isExpanded && (
                  <div className="border-t border-gray-100 p-4 bg-gray-50 dark:bg-brand-black">
                    <div className="grid grid-cols-3 gap-3 mb-4">
                      <div>
                        <p className="text-[9px] text-gray-400 uppercase font-bold">{t("admin.crm.orders")}</p>
                        <p className="text-sm font-bold text-[#1A1A1A] dark:text-offwhite">{c.orderCount}</p>
                      </div>
                      <div>
                        <p className="text-[9px] text-gray-400 uppercase font-bold">{t("admin.crm.avgOrder")}</p>
                        <p className="text-sm font-bold text-[#1A1A1A] dark:text-offwhite">EGP {Math.round(avgOrder).toLocaleString("en-EG")}</p>
                      </div>
                      <div>
                        <p className="text-[9px] text-gray-400 uppercase font-bold">{t("admin.crm.lastOrder")}</p>
                        <p className="text-sm font-bold text-[#1A1A1A] dark:text-offwhite">{new Date(c.lastOrder).toLocaleDateString("en-GB")}</p>
                      </div>
                    </div>

                    {/* Order history */}
                    <div className="flex flex-col gap-1.5">
                      {c.orders.sort((a, b) => b.created_at.localeCompare(a.created_at)).map((o) => (
                        <div key={o.id} className="flex items-center justify-between bg-white dark:bg-brand-gray border border-gray-100 px-3 py-2">
                          <div>
                            <p className="text-[10px] font-mono text-gray-400">#{o.id.slice(0, 8).toUpperCase()}</p>
                            <p className="text-[11px] font-semibold text-[#1A1A1A] dark:text-offwhite">{new Date(o.created_at).toLocaleDateString("en-GB")}</p>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className={`text-[9px] font-bold px-2 py-0.5 border ${
                              o.status === "closed"     ? "border-green-200 text-green-700 bg-green-50" :
                              o.status === "shipped"    ? "border-purple-200 text-purple-700 bg-purple-50" :
                              o.status === "processing" ? "border-blue-200 text-blue-700 bg-blue-50" :
                              "border-yellow-200 text-yellow-700 bg-yellow-50"
                            }`}>{o.status}</span>
                            <p className="text-xs font-mono font-bold text-[#1A1A1A] dark:text-offwhite">EGP {o.total_amount.toLocaleString("en-EG")}</p>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* WhatsApp button */}
                    {c.phone && (
                      <a
                        href={`https://wa.me/${c.phone.replace(/\D/g, "")}`}
                        target="_blank"
                        rel="noreferrer"
                        className="mt-3 flex items-center justify-center gap-2 w-full py-3 bg-green-500 text-white text-[11px] font-bold tracking-wide hover:bg-green-600 transition-colors"
                      >
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/><path d="M12 2C6.477 2 2 6.477 2 12c0 1.991.52 3.863 1.432 5.482L2 22l4.664-1.408A9.956 9.956 0 0 0 12 22c5.523 0 10-4.477 10-10S17.523 2 12 2z"/></svg>
                        {t("admin.crm.whatsapp")}
                      </a>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
