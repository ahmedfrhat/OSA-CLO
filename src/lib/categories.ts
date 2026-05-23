// src/lib/categories.ts
// Feature 2: Restructured category hierarchy

export interface SubCategory {
  key: string;
  label_en: string;
  label_ar: string;
}

export interface CategoryGroup {
  key: string;
  label_en: string;
  label_ar: string;
  icon: string;
  subcategories: SubCategory[];
}

export const CATEGORY_GROUPS: CategoryGroup[] = [
  {
    key: "clothing",
    label_en: "Clothing",
    label_ar: "الملابس",
    icon: "👗",
    subcategories: [
      { key: "abayas",   label_en: "Abayas",   label_ar: "عبايات" },
      { key: "isdals",   label_en: "Isdals",   label_ar: "إسدال" },
      { key: "dresses",  label_en: "Dresses",  label_ar: "فساتين" },
      { key: "tshirts",  label_en: "T-Shirts", label_ar: "تيشيرتات" },
      { key: "pants",    label_en: "Pants",    label_ar: "بناطيل" },
    ],
  },
  {
    key: "footwear",
    label_en: "Footwear",
    label_ar: "الأحذية",
    icon: "👟",
    subcategories: [
      { key: "sneakers",  label_en: "Sneakers",  label_ar: "سنيكرز" },
      { key: "heels",     label_en: "Heels",     label_ar: "كعب عالي" },
      { key: "slippers",  label_en: "Slippers",  label_ar: "شبشب" },
    ],
  },
  {
    key: "bags_accessories",
    label_en: "Bags & Accessories",
    label_ar: "الشنط والإكسسوار",
    icon: "👜",
    subcategories: [
      { key: "girls_bags",   label_en: "Girls' Bags",  label_ar: "شنط بنات" },
      { key: "accessories",  label_en: "Accessories",  label_ar: "إكسسوار" },
    ],
  },
  {
    key: "beauty_home",
    label_en: "Beauty & Home",
    label_ar: "الجمال والمنزل",
    icon: "💄",
    subcategories: [
      { key: "makeup",           label_en: "Makeup",           label_ar: "مكياج" },
      { key: "home_appliances",  label_en: "Home Appliances",  label_ar: "أجهزة منزلية" },
    ],
  },
];

// Flat list of all subcategory keys (useful for filtering)
export const ALL_SUBCATEGORY_KEYS = CATEGORY_GROUPS.flatMap((g) =>
  g.subcategories.map((s) => s.key)
);

// Helper: get label for a subcategory key
export function getSubcategoryLabel(key: string, lang: "en" | "ar"): string {
  for (const group of CATEGORY_GROUPS) {
    const sub = group.subcategories.find((s) => s.key === key);
    if (sub) return lang === "ar" ? sub.label_ar : sub.label_en;
    if (group.key === key) return lang === "ar" ? group.label_ar : group.label_en;
  }
  return key;
}
