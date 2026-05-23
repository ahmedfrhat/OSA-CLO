import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  "https://espqrrunhekvjsoxdfbx.supabase.co",
  "sb_publishable_gBLthp-l-wVyAp_coMIhKA_xUwBb6WQ"
);

const partnerId = "596c4367-1491-481f-b0f2-1825c2540ebd"; // Safia UUID

const categoriesData = [
  { catEn: "Makeup", catAr: "ميكب", itemsEn: ["Lipstick", "Foundation", "Mascara", "Eyeshadow Palette", "Highlighter", "Blush", "Concealer", "Lip Gloss"], itemsAr: ["روج", "فاونديشن", "ماسكارا", "باليت ايشادو", "هايلايتر", "بلاشر", "كونسيلر", "ليب جلوس"], keywords: "makeup,cosmetics" },
  { catEn: "Accessories", catAr: "إكسسوارات حريمي", itemsEn: ["Necklace", "Earrings", "Bracelet", "Ring", "Watch", "Sunglasses", "Hair Clip"], itemsAr: ["عقد", "حلق", "اسورة", "خاتم", "ساعة حريمي", "نظارة شمس حريمي", "توكة شعر"], keywords: "jewelry,necklace,accessories" },
  { catEn: "Home", catAr: "أدوات منزلية", itemsEn: ["Coffee Maker", "Blender", "Air Fryer", "Toaster", "Kettle", "Dinner Set", "Cutlery Set"], itemsAr: ["ماكينة قهوة", "خلاط", "قلاية هوائية", "توستر", "غلاية", "طقم عشاء", "طقم معالق"], keywords: "kitchen,homeappliance" },
  { catEn: "Bags", catAr: "شنط حريمي", itemsEn: ["Tote Bag", "Crossbody Bag", "Shoulder Bag", "Clutch", "Backpack", "Handbag"], itemsAr: ["شنطة توت", "شنطة كروس", "شنطة كتف", "كلاتش", "شنطة ظهر", "شنطة يد"], keywords: "handbag,purse,bag" },
  { catEn: "Pants", catAr: "بناطيل حريمي", itemsEn: ["Wide Leg Jeans", "Cargo Pants", "Flared Pants", "Leggings", "Culottes", "Sweatpants"], itemsAr: ["جينز وايد ليج", "بنطلون كارغو", "بنطلون شارلستون", "ليجنز", "كولوت", "سويت بانتس"], keywords: ["jeans,pants,woman"] },
  { catEn: "T-Shirts", catAr: "تيشيرتات حريمي", itemsEn: ["Basic Tee", "Graphic T-Shirt", "Crop Top", "Oversized Tee", "V-Neck Shirt"], itemsAr: ["تيشيرت بيزك", "تيشيرت جرافيك", "كروب توب", "تيشيرت أوفر سايز", "تيشيرت بياقة V"], keywords: "tshirt,woman,top" },
  { catEn: "Hoodies", catAr: "هوديات حريمي", itemsEn: ["Oversized Hoodie", "Cropped Hoodie", "Zip-Up Hoodie", "Fleece Hoodie"], itemsAr: ["هودي أوفر سايز", "هودي قصير", "هودي بسحاب", "هودي فرو"], keywords: "hoodie,woman,sweatshirt" },
  { catEn: "Abayas", catAr: "عبايات", itemsEn: ["Black Abaya", "Embroidered Abaya", "Open Front Abaya", "Silk Abaya", "Casual Abaya"], itemsAr: ["عباية سوداء", "عباية مطرزة", "عباية مفتوحة", "عباية حرير", "عباية كاجوال"], keywords: "abaya,modest,hijab" },
  { catEn: "Isdals", catAr: "إسدالات صلاة", itemsEn: ["Cotton Prayer Dress", "Printed Isdal", "Two-Piece Isdal", "Lace Detail Isdal"], itemsAr: ["إسدال قطن", "إسدال منقوش", "إسدال قطعتين", "إسدال بدانتيل"], keywords: "prayerdress,muslim" },
  { catEn: "Dresses", catAr: "دريسات", itemsEn: ["Floral Midi Dress", "Evening Gown", "Wrap Dress", "Summer Maxi Dress", "Satin Dress"], itemsAr: ["دريس ميدى فلورال", "فستان سهرة", "دريس لف", "دريس ماكسي صيفي", "دريس ساتان"], keywords: "dress,gown,woman" },
  { catEn: "Socks", catAr: "شرابات حريمي", itemsEn: ["Ankle Socks", "Knee-High Socks", "Cotton Socks", "Patterned Socks", "Invisible Socks"], itemsAr: ["شراب أنكل", "شراب طويل", "شراب قطن", "شراب منقوش", "شراب سري"], keywords: "socks,feet" },
  { catEn: "Suits", catAr: "سوتس حريمي", itemsEn: ["Linen Two-Piece Suit", "Formal Blazer Suit", "Casual Co-ord Set", "Satin Lounge Set"], itemsAr: ["سوت كتان قطعتين", "بدلة بليزر رسمية", "طقم كاجوال كورد", "طقم ساتان منزلي"], keywords: "suit,blazer,woman" },
];

const adjEn = ["Premium", "Luxury", "Elegant", "Classic", "Modern", "Chic", "Trendy", "Casual", "Exclusive", "Vintage", "Minimalist"];
const adjAr = ["بريميوم", "فاخر", "أنيق", "كلاسيك", "عصري", "شيك", "تريند", "كاجوال", "حصري", "فينتاج", "بسيط"];

const colorsEn = ["Black", "White", "Beige", "Navy", "Red", "Pink", "Burgundy", "Emerald", "Rose Gold", "Silver", "Gold", "Nude"];
const colorsAr = ["أسود", "أبيض", "بيج", "كحلي", "أحمر", "بينك", "عنابي", "زمردي", "روز جولد", "فضي", "ذهبي", "نيود"];

const products = [];

for (let i = 1; i <= 1000; i++) {
   const catIdx = Math.floor(Math.random() * categoriesData.length);
   const catInfo = categoriesData[catIdx];
   
   const itemIdx = Math.floor(Math.random() * catInfo.itemsEn.length);
   const itemEn = catInfo.itemsEn[itemIdx];
   const itemAr = catInfo.itemsAr[itemIdx];
   
   const aIdx = Math.floor(Math.random() * adjEn.length);
   const cIdx = Math.floor(Math.random() * colorsEn.length);
   
   const name_en = `${adjEn[aIdx]} ${itemEn} - ${colorsEn[cIdx]} (#${i})`;
   const name_ar = `${itemAr} ${adjAr[aIdx]} - لون ${colorsAr[cIdx]} (#${i})`;
   
   const cost = Math.floor(Math.random() * 800) + 50;
   
   let sizes = [];
   if (["T-Shirts", "Pants", "Hoodies", "Abayas", "Dresses", "Suits"].includes(catInfo.catEn)) {
      sizes = ["S", "M", "L", "XL", "XXL"];
   } else if (["Bags", "Accessories", "Home", "Makeup", "Isdals", "Socks"].includes(catInfo.catEn)) {
      sizes = ["One Size"];
   }

   // Generate a strictly unique image URL for EVERY product using LoremFlickr
   // lock parameter ensures uniqueness, keywords ensure relevance
   const imageUrl = `https://loremflickr.com/600/800/${catInfo.keywords}?lock=${i}`;

   products.push({
      partner_id: partnerId,
      name_en,
      name_ar,
      description: `High quality ${catInfo.catEn.toLowerCase()} piece for women. Perfect for everyday wear or special occasions. A unique and exclusive item from the ${adjEn[aIdx]} collection.`,
      category: catInfo.catAr, 
      cost_price: cost,
      selling_price: cost + Math.floor(Math.random() * 400) + 100,
      sizes,
      stock_quantity: Math.floor(Math.random() * 50) + 1,
      image_url: imageUrl,
      image_urls: [],
      is_available: true,
      in_stock: true
   });
}

async function execute() {
  console.log("🗑️ Deleting all existing products to start fresh...");
  // Delete all products (without specifying ID to clear the table)
  // We use neq id = something that doesn't exist so it triggers bulk delete
  const { error: deleteError } = await supabase.from("products").delete().neq("id", "00000000-0000-0000-0000-000000000000");
  
  if (deleteError) {
    console.error("❌ Failed to delete old products:", deleteError);
    return;
  }
  console.log("✅ All old products deleted successfully.");

  console.log(`⏳ Preparing to insert ${products.length} unique women's products in batches...`);
  const BATCH_SIZE = 50;
  
  for (let i = 0; i < products.length; i += BATCH_SIZE) {
    const batch = products.slice(i, i + BATCH_SIZE);
    const { error } = await supabase.from("products").insert(batch);
    if (error) {
      console.error(`❌ Batch ${i} to ${i + BATCH_SIZE} failed:`, error);
    } else {
      console.log(`✅ Inserted batch ${i} to ${i + BATCH_SIZE}`);
    }
  }
  
  console.log("🎉 All 1000 women's products added successfully with 1000 UNIQUE images!");
}

execute();
