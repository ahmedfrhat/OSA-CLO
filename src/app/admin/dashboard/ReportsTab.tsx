"use client";

import { useState } from "react";

interface Product {
  id: string;
  name_en: string;
  cost_price: number;
  selling_price: number;
}

interface OrderItem {
  product_id: string;
  quantity: number;
  unit_price: number;
  cost_price: number;
}

interface Order {
  id: string;
  customer_name: string;
  customer_phone?: string;
  customer_address?: string;
  source?: string;
  status: string;
  total_amount: number;
  paid_amount?: number;
  created_at: string;
  order_items?: OrderItem[];
}

interface Props {
  orders: Order[];
  products: Product[];
}

function buildWeeklyRows(orders: Order[]) {
  const now    = new Date();
  const cutoff = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
  return orders.filter((o) => new Date(o.created_at) >= cutoff);
}

function buildMonthlyRows(orders: Order[]) {
  const now    = new Date();
  const cutoff = new Date(now.getFullYear(), now.getMonth(), 1);
  return orders.filter((o) => new Date(o.created_at) >= cutoff);
}

function downloadCSV(orders: Order[], label: string) {
  const headers = ["ID","Customer","Phone","Address","Source","Status","Total","Paid","Remaining","Items","Date"];
  const rows = orders.map((o) => {
    const paid      = o.paid_amount ?? 0;
    const remaining = Math.max(0, o.total_amount - paid);
    const items     = o.order_items?.reduce((s, i) => s + i.quantity, 0) ?? 0;
    return [
      o.id.slice(0, 8),
      `"${o.customer_name}"`,
      o.customer_phone ?? "",
      `"${o.customer_address ?? ""}"`,
      o.source ?? "",
      o.status,
      o.total_amount,
      paid,
      remaining,
      items,
      new Date(o.created_at).toLocaleDateString("en-GB"),
    ].join(",");
  });
  const csv  = [headers.join(","), ...rows].join("\n");
  const blob = new Blob(["\ufeff" + csv], { type: "text/csv;charset=utf-8" });
  const url  = URL.createObjectURL(blob);
  const a    = document.createElement("a");
  a.href     = url;
  a.download = `aso-report-${label}-${new Date().toISOString().slice(0, 10)}.csv`;
  a.click();
  URL.revokeObjectURL(url);
}

function downloadProductCSV(products: Product[]) {
  const headers = ["ID","Name","Cost Price","Selling Price","Profit"];
  const rows = products.map((p) => [
    p.id.slice(0, 8),
    `"${p.name_en}"`,
    p.cost_price,
    p.selling_price,
    p.selling_price - p.cost_price,
  ].join(","));
  const csv  = [headers.join(","), ...rows].join("\n");
  const blob = new Blob(["\ufeff" + csv], { type: "text/csv;charset=utf-8" });
  const url  = URL.createObjectURL(blob);
  const a    = document.createElement("a");
  a.href     = url;
  a.download = `aso-products-${new Date().toISOString().slice(0, 10)}.csv`;
  a.click();
  URL.revokeObjectURL(url);
}

function Stat({ label, value, sub }: { label: string; value: string; sub?: string }) {
  return (
    <div className="bg-white border border-gray-200 p-4">
      <p className="text-[9px] font-bold tracking-widest uppercase text-gray-400">{label}</p>
      <p className="text-lg font-bold text-[#1A1A1A] mt-1">{value}</p>
      {sub && <p className="text-[10px] text-gray-400 mt-0.5">{sub}</p>}
    </div>
  );
}

export default function ReportsTab({ orders, products }: Props) {
  const [period, setPeriod] = useState<"week" | "month" | "all">("week");

  const periodOrders = period === "week"
    ? buildWeeklyRows(orders)
    : period === "month"
    ? buildMonthlyRows(orders)
    : orders;

  const allItems   = periodOrders.flatMap((o) => o.order_items ?? []);
  const revenue    = allItems.reduce((s, i) => s + i.unit_price * i.quantity, 0);
  const cost       = allItems.reduce((s, i) => s + i.cost_price * i.quantity, 0);
  const profit     = revenue - cost;
  const margin     = revenue > 0 ? ((profit / revenue) * 100).toFixed(1) : "0.0";
  const outstanding = periodOrders.reduce((s, o) => s + Math.max(0, o.total_amount - (o.paid_amount ?? 0)), 0);
  const units      = allItems.reduce((s, i) => s + i.quantity, 0);

  // Top product by revenue
  const productRevMap: Record<string, number> = {};
  allItems.forEach((i) => {
    productRevMap[i.product_id] = (productRevMap[i.product_id] ?? 0) + i.unit_price * i.quantity;
  });
  const topProductId  = Object.entries(productRevMap).sort((a, b) => b[1] - a[1])[0]?.[0];
  const topProduct    = products.find((p) => p.id === topProductId);

  return (
    <div className="flex flex-col gap-5">
      <div>
        <h2 className="text-base font-bold text-[#1A1A1A]">Reports & Analytics</h2>
        <p className="text-xs text-gray-400">Download business reports in CSV format</p>
      </div>

      {/* Period selector */}
      <div className="flex gap-2">
        {(["week","month","all"] as const).map((p) => (
          <button key={p} onClick={() => setPeriod(p)}
            className={`px-4 py-2 text-[10px] font-bold tracking-widest uppercase border transition-all
              ${period === p ? "bg-[#1A1A1A] text-white border-[#1A1A1A]" : "border-gray-200 text-gray-400 hover:border-gray-400"}`}>
            {p === "week" ? "This Week" : p === "month" ? "This Month" : "All Time"}
          </button>
        ))}
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        <Stat label="Orders"     value={String(periodOrders.length)} />
        <Stat label="Revenue"    value={`EGP ${revenue.toLocaleString("en-EG")}`} />
        <Stat label="Net Profit" value={`EGP ${profit.toLocaleString("en-EG")}`} sub={`${margin}% margin`} />
        <Stat label="Units Sold" value={String(units)} />
        <Stat label="Outstanding" value={`EGP ${outstanding.toLocaleString("en-EG")}`} />
        <Stat label="Top Product" value={topProduct?.name_en ?? "—"} sub={topProduct ? `EGP ${Math.round(productRevMap[topProductId!] ?? 0).toLocaleString("en-EG")}` : ""} />
      </div>

      {/* Download buttons */}
      <div className="flex flex-col gap-3">
        <p className="text-[10px] font-bold tracking-[0.15em] uppercase text-gray-400">Download Reports</p>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <button
            onClick={() => downloadCSV(buildWeeklyRows(orders), "weekly")}
            className="flex items-center gap-3 bg-white border border-gray-200 p-4 hover:border-gray-400 transition-all text-left group"
          >
            <span className="text-2xl">📊</span>
            <div>
              <p className="text-xs font-bold text-[#1A1A1A]">Weekly Report</p>
              <p className="text-[10px] text-gray-400">Last 7 days orders</p>
            </div>
          </button>

          <button
            onClick={() => downloadCSV(buildMonthlyRows(orders), "monthly")}
            className="flex items-center gap-3 bg-white border border-gray-200 p-4 hover:border-gray-400 transition-all text-left group"
          >
            <span className="text-2xl">📅</span>
            <div>
              <p className="text-xs font-bold text-[#1A1A1A]">Monthly Report</p>
              <p className="text-[10px] text-gray-400">Current month orders</p>
            </div>
          </button>

          <button
            onClick={() => downloadCSV(orders, "all-time")}
            className="flex items-center gap-3 bg-white border border-gray-200 p-4 hover:border-gray-400 transition-all text-left group"
          >
            <span className="text-2xl">📁</span>
            <div>
              <p className="text-xs font-bold text-[#1A1A1A]">Full Export</p>
              <p className="text-[10px] text-gray-400">All orders ever</p>
            </div>
          </button>

          <button
            onClick={() => downloadProductCSV(products)}
            className="flex items-center gap-3 bg-white border border-gray-200 p-4 hover:border-gray-400 transition-all text-left group"
          >
            <span className="text-2xl">🛍️</span>
            <div>
              <p className="text-xs font-bold text-[#1A1A1A]">Products Export</p>
              <p className="text-[10px] text-gray-400">All products with pricing</p>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
}
