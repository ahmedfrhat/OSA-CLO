"use client";

import { useState, useRef } from "react";

interface Props {
  onSuccess: () => void;
}

const TEMPLATE_CSV = `name_en,name_ar,category,cost_price,selling_price,stock_quantity,description
White Oversized Tee,تيشيرت أبيض,T-Shirts,120,250,20,Premium cotton oversized tee
Black Hoodie,هودي أسود,Hoodies,200,450,15,Heavy fleece hoodie`;

function downloadTemplate() {
  const blob = new Blob([TEMPLATE_CSV], { type: "text/csv;charset=utf-8" });
  const url  = URL.createObjectURL(blob);
  const a    = document.createElement("a");
  a.href     = url;
  a.download = "aso-products-template.csv";
  a.click();
  URL.revokeObjectURL(url);
}

interface ParsedProduct {
  name_en: string;
  name_ar?: string;
  category?: string;
  cost_price: number;
  selling_price: number;
  stock_quantity: number;
  description?: string;
}

function parseCSV(text: string): ParsedProduct[] {
  const lines   = text.trim().split("\n").filter(Boolean);
  if (lines.length < 2) return [];
  const headers = lines[0].split(",").map((h) => h.trim().toLowerCase());
  return lines.slice(1).map((line) => {
    const vals: Record<string, string> = {};
    line.split(",").forEach((v, i) => { vals[headers[i]] = v.trim().replace(/^"|"$/g, ""); });
    return {
      name_en:       vals["name_en"]        ?? "",
      name_ar:       vals["name_ar"]        ?? "",
      category:      vals["category"]       ?? "",
      cost_price:    Number(vals["cost_price"])    || 0,
      selling_price: Number(vals["selling_price"]) || 0,
      stock_quantity: Number(vals["stock_quantity"]) || 0,
      description:   vals["description"]    ?? "",
    };
  }).filter((p) => p.name_en && p.selling_price > 0);
}

export default function BulkImport({ onSuccess }: Props) {
  const [preview, setPreview]   = useState<ParsedProduct[]>([]);
  const [uploading, setUploading] = useState(false);
  const [result, setResult]     = useState<{ success: number; errors: string[] } | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      const text = ev.target?.result as string;
      setPreview(parseCSV(text));
      setResult(null);
    };
    reader.readAsText(file, "utf-8");
  }

  async function handleUpload() {
    if (!preview.length) return;
    setUploading(true);
    const errors: string[] = [];
    let success = 0;

    for (const product of preview) {
      const res = await fetch("/api/admin/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name_en:       product.name_en,
          name_ar:       product.name_ar || null,
          category:      product.category || null,
          cost_price:    product.cost_price,
          selling_price: product.selling_price,
          stock_quantity: product.stock_quantity,
          description:   product.description || null,
          in_stock:      product.stock_quantity > 0,
          is_available:  true,
          sizes:         [],
        }),
      });
      if (res.ok) { success++; }
      else {
        const d = await res.json();
        errors.push(`"${product.name_en}": ${d.error ?? "Unknown error"}`);
      }
    }

    setResult({ success, errors });
    setPreview([]);
    if (fileRef.current) fileRef.current.value = "";
    if (success > 0) onSuccess();
    setUploading(false);
  }

  return (
    <div className="flex flex-col gap-5">
      <div>
        <h2 className="text-base font-bold text-[#1A1A1A]">Bulk Product Import</h2>
        <p className="text-xs text-gray-400">Upload a CSV file to add multiple products at once</p>
      </div>

      {/* Step 1: Download template */}
      <div className="bg-white border border-gray-200 p-4 sm:p-6">
        <p className="text-[10px] font-bold tracking-widest uppercase text-gray-400 mb-3">Step 1 — Download Template</p>
        <button onClick={downloadTemplate}
          className="flex items-center gap-2 px-4 py-2.5 border border-gray-200 text-xs font-bold text-gray-600 hover:border-gray-400 transition-all">
          <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
          Download CSV Template
        </button>
        <p className="text-[10px] text-gray-400 mt-2">Fill in product data, then upload below</p>
      </div>

      {/* Step 2: Upload */}
      <div className="bg-white border border-gray-200 p-4 sm:p-6">
        <p className="text-[10px] font-bold tracking-widest uppercase text-gray-400 mb-3">Step 2 — Upload CSV</p>
        <label className="flex flex-col items-center justify-center border-2 border-dashed border-gray-200 p-8 cursor-pointer hover:border-gray-400 transition-all">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-gray-300 mb-2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>
          <p className="text-xs text-gray-400">Click to select CSV file</p>
          <input ref={fileRef} type="file" accept=".csv,text/csv" onChange={handleFile} className="hidden" />
        </label>
      </div>

      {/* Preview */}
      {preview.length > 0 && (
        <div className="bg-white border border-gray-200 overflow-x-auto">
          <div className="flex items-center justify-between p-4 border-b border-gray-100">
            <p className="text-xs font-bold text-[#1A1A1A]">{preview.length} products ready to import</p>
            <button onClick={handleUpload} disabled={uploading}
              className="btn-dark text-[11px] disabled:opacity-50 flex items-center gap-2">
              {uploading ? (
                <><span className="w-3 h-3 border border-white border-t-transparent rounded-full animate-spin" />Importing...</>
              ) : `Import ${preview.length} Products`}
            </button>
          </div>
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50">
                {["Name","Category","Cost","Selling","Stock"].map((h) => (
                  <th key={h} className="th-style">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {preview.map((p, i) => (
                <tr key={i} className="border-b border-gray-50">
                  <td className="px-4 py-2.5 font-semibold text-[#1A1A1A]">{p.name_en}</td>
                  <td className="px-4 py-2.5 text-gray-500">{p.category || "—"}</td>
                  <td className="px-4 py-2.5 font-mono">EGP {p.cost_price}</td>
                  <td className="px-4 py-2.5 font-mono font-bold">EGP {p.selling_price}</td>
                  <td className="px-4 py-2.5 font-mono">{p.stock_quantity}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Result */}
      {result && (
        <div className={`p-4 border ${result.errors.length === 0 ? "border-green-200 bg-green-50" : "border-yellow-200 bg-yellow-50"}`}>
          <p className="text-sm font-bold text-[#1A1A1A]">
            ✓ {result.success} products imported successfully!
          </p>
          {result.errors.length > 0 && (
            <div className="mt-2">
              <p className="text-xs font-bold text-red-600 mb-1">{result.errors.length} errors:</p>
              {result.errors.map((e, i) => (
                <p key={i} className="text-xs text-red-500">{e}</p>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
