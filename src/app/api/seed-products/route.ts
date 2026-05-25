import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase-admin";

export const dynamic = "force-dynamic";
export const maxDuration = 60;

// Premium streetwear partner ID (ASO CLO)
const PARTNER_ID = "596c4367-1491-481f-b0f2-1825c2540ebd";

// STRICT: Only verified flatlay/folded/rack/isolated images. NO human models.
const premiumImages = [
  "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=800&q=80", // T-shirt flat
  "https://images.unsplash.com/photo-1556821840-3a63f95609a7?auto=format&fit=crop&w=800&q=80", // Hoodie folded
  "https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?auto=format&fit=crop&w=800&q=80", // Shirt on hanger
  "https://images.unsplash.com/photo-1604176354204-9268737828e4?auto=format&fit=crop&w=800&q=80", // Jeans folded
  "https://images.unsplash.com/photo-1584916201218-f4242ceb4809?auto=format&fit=crop&w=800&q=80", // Bag isolated
  "https://images.unsplash.com/photo-1618354691373-d851c5c3a990?auto=format&fit=crop&w=800&q=80", // Black t-shirt flat
  "https://images.unsplash.com/photo-1544441893-675973e31985?auto=format&fit=crop&w=800&q=80", // Clothing rack
  "https://images.unsplash.com/photo-1574180566232-aaad1b5b8450?auto=format&fit=crop&w=800&q=80", // Accessories/Wallet
  "https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b?auto=format&fit=crop&w=800&q=80", // Bag flatlay
];

// Map categories -> indices into premiumImages so each category gets the most relevant flatlay
const categoryImageMap: Record<string, number[]> = {
  "T-Shirts": [0, 5],
  Hoodies: [1],
  Pants: [3],
  Outerwear: [2, 6],
  Accessories: [4, 7, 8],
  Footwear: [6, 4],
};

const categories = [
  "Hoodies",
  "T-Shirts",
  "Pants",
  "Outerwear",
  "Accessories",
  "Footwear",
];

const adjectivesEn = [
  "Premium",
  "Essential",
  "Oversized",
  "Boxy",
  "Vintage",
  "Heavyweight",
  "Lightweight",
  "Tech",
  "Utility",
  "Classic",
  "Signature",
  "Distressed",
  "Washed",
  "Cropped",
  "Relaxed",
];
const adjectivesAr = [
  "بريميوم",
  "أساسي",
  "أوفر سايز",
  "بوكسي",
  "فينتاج",
  "ثقيل",
  "خفيف",
  "تيك",
  "عملي",
  "كلاسيك",
  "سيجنتشر",
  "ديستريسد",
  "مغسول",
  "كروب",
  "ريلاكسد",
];

const colorsEn = [
  "Onyx",
  "Bone",
  "Ash Grey",
  "Washed Black",
  "Olive",
  "Navy",
  "Crimson",
  "Mocha",
  "Sand",
  "Midnight",
  "Cream",
  "Charcoal",
];
const colorsAr = [
  "أونيكس",
  "أبيض عظمي",
  "رمادي",
  "أسود باهت",
  "زيتوني",
  "كحلي",
  "أحمر داكن",
  "موكا",
  "رملي",
  "أزرق ليلي",
  "كريمي",
  "فحمي",
];

function pick<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function imageForCategory(category: string): string {
  const indices = categoryImageMap[category] ?? [0, 1, 2, 3, 4, 5, 6, 7, 8];
  const idx = pick(indices);
  return premiumImages[idx];
}

function buildProduct(i: number) {
  const category = pick(categories);

  const adjIdx = Math.floor(Math.random() * adjectivesEn.length);
  const colorIdx = Math.floor(Math.random() * colorsEn.length);

  const adjEn = adjectivesEn[adjIdx];
  const adjAr = adjectivesAr[adjIdx];
  const colorEn = colorsEn[colorIdx];
  const colorAr = colorsAr[colorIdx];

  let itemBaseEn = "";
  let itemBaseAr = "";
  let sizes: string[] = ["S", "M", "L", "XL"];

  switch (category) {
    case "Hoodies":
      itemBaseEn = "Hoodie";
      itemBaseAr = "هودي";
      break;
    case "T-Shirts":
      itemBaseEn = "Tee";
      itemBaseAr = "تيشيرت";
      break;
    case "Pants":
      itemBaseEn = "Cargo Pants";
      itemBaseAr = "بنطلون كارغو";
      sizes = ["30", "32", "34", "36", "38"];
      break;
    case "Outerwear":
      itemBaseEn = "Jacket";
      itemBaseAr = "جاكيت";
      break;
    case "Accessories":
      itemBaseEn = "Bag";
      itemBaseAr = "شنطة";
      sizes = ["One Size"];
      break;
    case "Footwear":
      itemBaseEn = "Sneakers";
      itemBaseAr = "حذاء رياضي";
      sizes = ["40", "41", "42", "43", "44", "45"];
      break;
  }

  const name_en = `ASO ${adjEn} ${itemBaseEn} - ${colorEn} (Gen-${i})`;
  const name_ar = `${itemBaseAr} ${adjAr} - ${colorAr} (جيل-${i})`;
  const description = `Premium ${adjEn.toLowerCase()} ${category.toLowerCase()} piece crafted for everyday wear. Modern silhouette in ${colorEn}. Exclusive ASO CLO drop.`;

  const cost_price = Math.floor(Math.random() * 500) + 150;
  const selling_price = cost_price * 2 + Math.floor(Math.random() * 200);

  const image_url = imageForCategory(category);

  return {
    partner_id: PARTNER_ID,
    name_en,
    name_ar,
    description,
    category,
    cost_price,
    selling_price,
    sizes,
    stock_quantity: Math.floor(Math.random() * 50) + 5,
    image_url,
    image_urls: [] as string[],
    is_available: true,
    in_stock: true,
  };
}

async function seed() {
  const total = 500;
  const products = Array.from({ length: total }, (_, i) => buildProduct(i + 1));

  const BATCH_SIZE = 50;
  let inserted = 0;
  const errors: Array<{ batchStart: number; message: string }> = [];

  for (let i = 0; i < products.length; i += BATCH_SIZE) {
    const batch = products.slice(i, i + BATCH_SIZE);
    const { error } = await supabaseAdmin.from("products").insert(batch);
    if (error) {
      errors.push({ batchStart: i, message: error.message });
    } else {
      inserted += batch.length;
    }
  }

  return { total, inserted, errors };
}

/**
 * SEEDING DISABLED - Database was successfully seeded on 2026-05-25.
 * The code below is commented out to prevent accidental re-seeding in production.
 * To re-enable, uncomment the POST and GET handlers.
 */

export async function POST() {
  return NextResponse.json(
    {
      success: false,
      error: "Seeding is disabled. Database was already seeded successfully.",
    },
    { status: 403 }
  );
}

export async function GET() {
  return NextResponse.json(
    {
      success: false,
      error: "Seeding is disabled. Database was already seeded successfully.",
    },
    { status: 403 }
  );
}

/*
// ORIGINAL SEEDING HANDLERS - COMMENTED OUT FOR PRODUCTION SAFETY
export async function POST() {
  try {
    const result = await seed();
    return NextResponse.json({
      success: result.errors.length === 0,
      message: `Inserted ${result.inserted} of ${result.total} products`,
      ...result,
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}

export async function GET() {
  // Convenience: allow seeding via GET in dev so it can be hit from the browser.
  return POST();
}
*/
