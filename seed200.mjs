import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  "https://espqrrunhekvjsoxdfbx.supabase.co",
  "sb_publishable_gBLthp-l-wVyAp_coMIhKA_xUwBb6WQ"
);

const partnerId = "596c4367-1491-481f-b0f2-1825c2540ebd"; // Safia UUID

const categories = ["Hoodies", "T-Shirts", "Pants", "Outerwear", "Accessories", "Footwear"];

const imageMaps = {
  "Hoodies": [
    "https://images.unsplash.com/photo-1556821840-3a63f95609a7?q=80&w=600&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1509942774463-acf339cf87d5?q=80&w=600&auto=format&fit=crop"
  ],
  "T-Shirts": [
    "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?q=80&w=600&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?q=80&w=600&auto=format&fit=crop"
  ],
  "Pants": [
    "https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?q=80&w=600&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1542272604-787c3835535d?q=80&w=600&auto=format&fit=crop"
  ],
  "Outerwear": [
    "https://images.unsplash.com/photo-1551028719-00167b16eac5?q=80&w=600&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1591047139829-d91aecb6caea?q=80&w=600&auto=format&fit=crop"
  ],
  "Accessories": [
    "https://images.unsplash.com/photo-1576871337622-98d48d1cf531?q=80&w=600&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1590874103328-eac38a683ce7?q=80&w=600&auto=format&fit=crop"
  ],
  "Footwear": [
    "https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=600&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?q=80&w=600&auto=format&fit=crop"
  ]
};

const adjectivesEn = ["Premium", "Essential", "Oversized", "Boxy", "Vintage", "Heavyweight", "Lightweight", "Tech", "Utility", "Classic", "Signature", "Distressed"];
const adjectivesAr = ["بريميوم", "أساسي", "أوفر سايز", "بوكسي", "فينتاج", "ثقيل", "خفيف", "تيك", "عملي", "كلاسيك", "سيجنتشر", "ديستريسد"];

const colorsEn = ["Onyx", "Bone", "Ash Grey", "Washed Black", "Olive", "Navy", "Crimson", "Mocha", "Sand", "Midnight"];
const colorsAr = ["أونيكس", "أبيض عظمي", "رمادي", "أسود باهت", "زيتوني", "كحلي", "أحمر داكن", "موكا", "رملي", "أزرق ليلي"];

function getRandom(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

const products = [];

for (let i = 1; i <= 200; i++) {
  const category = getRandom(categories);
  
  const adjIdx = Math.floor(Math.random() * adjectivesEn.length);
  const colorIdx = Math.floor(Math.random() * colorsEn.length);
  
  const adjEn = adjectivesEn[adjIdx];
  const adjAr = adjectivesAr[adjIdx];
  const colorEn = colorsEn[colorIdx];
  const colorAr = colorsAr[colorIdx];
  
  let itemBaseEn = "";
  let itemBaseAr = "";
  let sizes = ["S", "M", "L", "XL"];
  
  if (category === "Hoodies") { itemBaseEn = "Hoodie"; itemBaseAr = "هودي"; }
  if (category === "T-Shirts") { itemBaseEn = "Tee"; itemBaseAr = "تيشيرت"; }
  if (category === "Pants") { itemBaseEn = "Cargo Pants"; itemBaseAr = "بنطلون كارغو"; sizes = ["30", "32", "34", "36"]; }
  if (category === "Outerwear") { itemBaseEn = "Jacket"; itemBaseAr = "جاكيت"; }
  if (category === "Accessories") { itemBaseEn = "Bag"; itemBaseAr = "شنطة"; sizes = ["One Size"]; }
  if (category === "Footwear") { itemBaseEn = "Sneakers"; itemBaseAr = "حذاء رياضي"; sizes = ["40", "41", "42", "43", "44", "45"]; }

  const name_en = `ASO ${adjEn} ${itemBaseEn} - ${colorEn} (Gen-${i})`;
  const name_ar = `${itemBaseAr} ${adjAr} - ${colorAr} (Gen-${i})`;
  const description = `This is a high-quality ${category.toLowerCase()} item crafted for everyday wear. Features a ${adjEn.toLowerCase()} build and modern fit. Exclusive ASO CLO drop.`;
  
  const cost_price = Math.floor(Math.random() * 500) + 150;
  const selling_price = cost_price * 2 + Math.floor(Math.random() * 200);
  
  products.push({
    partner_id: partnerId,
    name_en,
    name_ar,
    description,
    category,
    cost_price,
    selling_price,
    sizes,
    stock_quantity: Math.floor(Math.random() * 50) + 5,
    image_url: getRandom(imageMaps[category]),
    image_urls: [],
    is_available: true,
    in_stock: true
  });
}

async function seedBatched() {
  console.log(`Prepared ${products.length} products. Inserting in batches...`);
  const BATCH_SIZE = 50; // Insert 50 at a time to prevent payload limits
  
  for (let i = 0; i < products.length; i += BATCH_SIZE) {
    const batch = products.slice(i, i + BATCH_SIZE);
    const { error } = await supabase.from("products").insert(batch);
    if (error) {
      console.error(`❌ Batch ${i} to ${i + BATCH_SIZE} failed:`, error);
    } else {
      console.log(`✅ Inserted batch ${i} to ${i + BATCH_SIZE}`);
    }
  }
  console.log("🎉 All 200 products added successfully!");
}

seedBatched();
