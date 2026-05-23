import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  "https://espqrrunhekvjsoxdfbx.supabase.co",
  "sb_publishable_gBLthp-l-wVyAp_coMIhKA_xUwBb6WQ"
);

const partnerId = "596c4367-1491-481f-b0f2-1825c2540ebd"; // Safia UUID

const products = [
  // ── Hoodies ──
  {
    partner_id: partnerId,
    name_en: "ASO Essential Heavyweight Hoodie - Onyx",
    name_ar: "هودي أساسي قطن ثقيل - أونيكس أسود",
    description: "A premium 450gsm 100% cotton hoodie featuring a relaxed boxy fit, dropped shoulders, and a clean minimalist aesthetic.",
    category: "Hoodies",
    cost_price: 650,
    selling_price: 1250,
    sizes: ["S", "M", "L", "XL"],
    stock_quantity: 20,
    image_url: "https://images.unsplash.com/photo-1556821840-3a63f95609a7?q=80&w=600&auto=format&fit=crop",
    image_urls: [],
    is_available: true,
    in_stock: true
  },
  {
    partner_id: partnerId,
    name_en: "ASO Washed Vintage Zip-Up - Ash Grey",
    name_ar: "جاكيت هودي بسحاب غسيل فينتاج - رمادي",
    description: "Vintage washed zip-up hoodie with a double-slider zipper, heavy ribbing, and an oversized silhouette.",
    category: "Hoodies",
    cost_price: 700,
    selling_price: 1350,
    sizes: ["M", "L", "XL", "XXL"],
    stock_quantity: 15,
    image_url: "https://images.unsplash.com/photo-1509942774463-acf339cf87d5?q=80&w=600&auto=format&fit=crop",
    image_urls: [],
    is_available: true,
    in_stock: true
  },
  
  // ── T-Shirts ──
  {
    partner_id: partnerId,
    name_en: "ASO Signature Drop Shoulder Tee - Bone",
    name_ar: "تيشيرت دروب شولدر سيجنتشر - أبيض عظمي",
    description: "The ultimate everyday tee. Crafted from 280gsm thick cotton for a structured drape and premium feel.",
    category: "T-Shirts",
    cost_price: 250,
    selling_price: 550,
    sizes: ["S", "M", "L", "XL"],
    stock_quantity: 40,
    image_url: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?q=80&w=600&auto=format&fit=crop",
    image_urls: [],
    is_available: true,
    in_stock: true
  },
  {
    partner_id: partnerId,
    name_en: "ASO Distressed Graphic Tee - Faded Black",
    name_ar: "تيشيرت جرافيك ديستريسد - أسود باهت",
    description: "A washed black tee featuring subtle distressing on the collar and a minimal tonal logo print on the chest.",
    category: "T-Shirts",
    cost_price: 300,
    selling_price: 650,
    sizes: ["S", "M", "L", "XL"],
    stock_quantity: 25,
    image_url: "https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?q=80&w=600&auto=format&fit=crop",
    image_urls: [],
    is_available: true,
    in_stock: true
  },

  // ── Pants ──
  {
    partner_id: partnerId,
    name_en: "ASO Parachute Tech Cargos - Olive",
    name_ar: "بنطلون كارغو باراشوت - زيتوني",
    description: "Wide-leg tech parachute pants with adjustable toggle cuffs, deep cargo pockets, and a water-resistant finish.",
    category: "Pants",
    cost_price: 500,
    selling_price: 1100,
    sizes: ["M", "L", "XL"],
    stock_quantity: 12,
    image_url: "https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?q=80&w=600&auto=format&fit=crop",
    image_urls: [],
    is_available: true,
    in_stock: true
  },
  {
    partner_id: partnerId,
    name_en: "ASO Baggy Denim - Vintage Washed Blue",
    name_ar: "بنطلون جينز باجي - أزرق غسيل فينتاج",
    description: "Heavyweight 14oz denim with a relaxed baggy fit, slight distressing, and raw hems.",
    category: "Pants",
    cost_price: 650,
    selling_price: 1400,
    sizes: ["30", "32", "34", "36"],
    stock_quantity: 18,
    image_url: "https://images.unsplash.com/photo-1542272604-787c3835535d?q=80&w=600&auto=format&fit=crop",
    image_urls: [],
    is_available: true,
    in_stock: true
  },

  // ── Outerwear ──
  {
    partner_id: partnerId,
    name_en: "ASO Cropped Puffer Jacket - Matte Black",
    name_ar: "جاكيت بافر قصير - أسود مطفي",
    description: "A streetwear staple. High-neck cropped puffer jacket with excellent insulation and a sleek matte finish.",
    category: "Outerwear",
    cost_price: 1200,
    selling_price: 2200,
    sizes: ["S", "M", "L", "XL"],
    stock_quantity: 8,
    image_url: "https://images.unsplash.com/photo-1551028719-00167b16eac5?q=80&w=600&auto=format&fit=crop",
    image_urls: [],
    is_available: true,
    in_stock: true
  },
  {
    partner_id: partnerId,
    name_en: "ASO Varsity Bomber - Forest Green",
    name_ar: "جاكيت بومبر فارستي - أخضر غامق",
    description: "Classic wool blend bomber jacket with faux leather sleeves and intricate tonal embroidery.",
    category: "Outerwear",
    cost_price: 1500,
    selling_price: 2800,
    sizes: ["M", "L", "XL"],
    stock_quantity: 5,
    image_url: "https://images.unsplash.com/photo-1591047139829-d91aecb6caea?q=80&w=600&auto=format&fit=crop",
    image_urls: [],
    is_available: true,
    in_stock: true
  },

  // ── Accessories ──
  {
    partner_id: partnerId,
    name_en: "ASO Chunky Knit Beanie - Charcoal",
    name_ar: "آيس كاب تريكو - رمادي غامق",
    description: "A thick, warm ribbed knit beanie with a subtle metal logo plaque.",
    category: "Accessories",
    cost_price: 120,
    selling_price: 350,
    sizes: ["One Size"],
    stock_quantity: 50,
    image_url: "https://images.unsplash.com/photo-1576871337622-98d48d1cf531?q=80&w=600&auto=format&fit=crop",
    image_urls: [],
    is_available: true,
    in_stock: true
  },
  {
    partner_id: partnerId,
    name_en: "ASO Tactical Crossbody Bag - Black",
    name_ar: "شنطة كروس تكتيكية - أسود",
    description: "Water-repellent nylon crossbody bag with multiple zip compartments and an adjustable branded strap.",
    category: "Accessories",
    cost_price: 200,
    selling_price: 450,
    sizes: ["One Size"],
    stock_quantity: 30,
    image_url: "https://images.unsplash.com/photo-1590874103328-eac38a683ce7?q=80&w=600&auto=format&fit=crop",
    image_urls: [],
    is_available: true,
    in_stock: true
  }
];

async function seed() {
  console.log("Seeding database with professional sample products...");
  
  const { data, error } = await supabase
    .from("products")
    .insert(products);

  if (error) {
    console.error("❌ Seeding failed:", error);
  } else {
    console.log("✅ Successfully added 10 premium products!");
  }
}

seed();
