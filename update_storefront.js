const fs = require('fs');

let clientCode = fs.readFileSync('C:\\Users\\ELSAFA\\.gemini\\antigravity\\scratch\\osha-store\\src\\components\\storefront\\StorefrontClient.tsx', 'utf8');

// 1. Add imports
clientCode = clientCode.replace(
  `import { supabase } from "@/lib/supabase";`,
  `import { supabase } from "@/lib/supabase";
import FuzzySearch from "@/components/FuzzySearch";
import CategoryFilter from "@/components/CategoryFilter";
import Fuse from "fuse.js";`
);

// 2. Replace useMemo logic for filtering
// Wait, FuzzySearch component doesn't actually FILTER the list, it just returns search results when the user types, and when they click one, it updates the query. 
// Let's use the logic from the new page.tsx.
clientCode = clientCode.replace(
  `  const filtered = useMemo(() => {
    const q = search.toLowerCase().trim();
    return products.filter((p) => {
      if (!p.is_available || !p.in_stock) return false;
      const matchQ = !q ||
        p.name_en.toLowerCase().includes(q) ||
        (p.name_ar?.includes(search) ?? false) ||
        (p.category?.toLowerCase().includes(q) ?? false);
      const matchC = category === "all" || p.category === category;
      return matchQ && matchC;
    });
  }, [products, search, category]);`,
  `  const filtered = useMemo(() => {
    let result = products.filter(p => p.is_available && p.in_stock);

    // Category filter
    if (category !== "all") {
      result = result.filter((p) => p.category === category);
    }

    // Fuzzy search filter
    if (search.trim().length >= 2) {
      const fuse = new Fuse(result, {
        keys: ["name_en", "name_ar", "description", "category"],
        threshold: 0.4,
        minMatchCharLength: 2,
      });
      result = fuse.search(search).map((r) => r.item);
    } else if (search.trim().length > 0) {
      const q = search.toLowerCase().trim();
      result = result.filter(p => 
        p.name_en.toLowerCase().includes(q) || 
        (p.name_ar?.includes(q) ?? false)
      );
    }

    return result;
  }, [products, search, category]);`
);

// 3. Replace the UI for search and categories
clientCode = clientCode.replace(
  `      {/* ── Sticky Search + Category Bar ── */}
      <div className="sticky top-14 z-30 bg-white/95 backdrop-blur-md border-b border-gray-100 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex flex-col sm:flex-row gap-3">

          {/* Search */}
          <div className="relative flex-1">
            <svg className={\`absolute top-1/2 -translate-y-1/2 \${isRTL ? "right-3" : "left-3"} w-4 h-4 text-gray-400\`}
              xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <circle cx="11" cy="11" r="8" strokeWidth="2"/><path d="m21 21-4.35-4.35" strokeWidth="2" strokeLinecap="round"/>
            </svg>
            <input
              type="search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder={t("storefront.search.placeholder")}
              className={\`w-full border border-gray-200 \${isRTL ? "pr-9 pl-4" : "pl-9 pr-4"} py-2.5 text-xs focus:outline-none focus:border-[#1A1A1A] transition-colors\`}
            />
            {search && (
              <button
                onClick={() => setSearch("")}
                className={\`absolute top-1/2 -translate-y-1/2 \${isRTL ? "left-3" : "right-3"} text-gray-300 hover:text-gray-600\`}
              >✕</button>
            )}
          </div>

          {/* Category Tabs */}
          <div className="flex gap-1 overflow-x-auto scrollbar-hide pb-0.5">
            {["all", ...categories].map((cat) => (
              <button
                key={cat}
                onClick={() => setCategory(cat)}
                className={\`shrink-0 px-4 py-2 text-[10px] font-bold tracking-[0.1em] uppercase border whitespace-nowrap transition-all
                  \${category === cat
                    ? "bg-[#1A1A1A] text-white border-[#1A1A1A]"
                    : "border-gray-200 text-gray-500 hover:border-gray-400"
                  }\`}
              >
                {cat === "all" ? t("storefront.categories.all") : cat}
              </button>
            ))}
          </div>
        </div>
      </div>`,
  `      {/* ── Search + Filter bar ── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-6 pb-2">
        <div className={\`flex flex-col sm:flex-row gap-4 mb-4 \${isRTL ? "sm:flex-row-reverse" : ""}\`}>
          {/* Feature 3: Fuzzy Search */}
          <div className="flex-1">
            <FuzzySearch
              products={products}
              onResultClick={(p) => setSearch(p.name_en)}
              placeholder_en="Search products..."
              placeholder_ar="ابحث عن المنتجات..."
            />
          </div>
        </div>

        {/* Feature 2: Category filter */}
        <div className="mb-4">
          <CategoryFilter
            activeCategory={category}
            onSelect={(cat) => {
              setCategory(cat);
              setSearch("");
            }}
          />
        </div>
        
        {/* Results count */}
        <p className="text-xs text-brand-muted mb-2 tracking-wider">
          {filtered.length} {lang === "ar" ? "منتج" : "products"}
          {category !== "all" && \` — \${category}\`}
        </p>
      </div>`
);

fs.writeFileSync('C:\\Users\\ELSAFA\\.gemini\\antigravity\\scratch\\osha-store\\src\\components\\storefront\\StorefrontClient.tsx', clientCode);
