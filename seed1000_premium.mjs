import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  "https://espqrrunhekvjsoxdfbx.supabase.co",
  "sb_publishable_gBLthp-l-wVyAp_coMIhKA_xUwBb6WQ"
);

const partnerId = "596c4367-1491-481f-b0f2-1825c2540ebd"; // Safia UUID

const categoryImages = {
  "Makeup": [
    "https://images.unsplash.com/photo-1596462502278-27bfdc403348?q=80&w=600&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1512496015851-a90fb38ba796?q=80&w=600&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1522337660859-02fbefca4702?q=80&w=600&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1631214500115-598fc2cb8d2d?q=80&w=600&auto=format&fit=crop"
  ],
  "Accessories": [
    "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?q=80&w=600&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1599643478524-fb66f7f6f584?q=80&w=600&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1511499767150-a48a237f0083?q=80&w=600&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1611591437281-460bfbe1220a?q=80&w=600&auto=format&fit=crop"
  ],
  "Home": [
    "https://images.unsplash.com/photo-1584269600464-37b1b58a9fe7?q=80&w=600&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1588661642878-5aee09ed0308?q=80&w=600&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1556910103-1c02745aae4d?q=80&w=600&auto=format&fit=crop"
  ],
  "Bags": [
    "https://images.unsplash.com/photo-1584916201218-f4242ceb4809?q=80&w=600&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1590874103328-eac38a683ce7?q=80&w=600&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1591561954557-26941169b49e?q=80&w=600&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?q=80&w=600&auto=format&fit=crop"
  ],
  "Pants": [
    "https://images.unsplash.com/photo-1542272604-787c3835535d?q=80&w=600&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1584370848010-d7fe6bc767ec?q=80&w=600&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1541099649105-f69ad21f3246?q=80&w=600&auto=format&fit=crop"
  ],
  "T-Shirts": [
    "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?q=80&w=600&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1503342394128-c104d54dba01?q=80&w=600&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1529374255404-311a2a4f1fd9?q=80&w=600&auto=format&fit=crop"
  ],
  "Hoodies": [
    "https://images.unsplash.com/photo-1556821840-3a63f95609a7?q=80&w=600&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?q=80&w=600&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1509942774463-acf339cf87d5?q=80&w=600&auto=format&fit=crop"
  ],
  "Abayas": [
    "https://images.unsplash.com/photo-1515347619362-e64e9a0ce616?q=80&w=600&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1583391733959-8d774787a2fc?q=80&w=600&auto=format&fit=crop"
  ],
  "Isdals": [
    "https://images.unsplash.com/photo-1583391733959-8d774787a2fc?q=80&w=600&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1515347619362-e64e9a0ce616?q=80&w=600&auto=format&fit=crop"
  ],
  "Dresses": [
    "https://images.unsplash.com/photo-1618932260643-bee461f0d3a7?q=80&w=600&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1595777457583-95e059d581b8?q=80&w=600&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1566150905458-1bf1fc113f0d?q=80&w=600&auto=format&fit=crop"
  ],
  "Socks": [
    "https://images.unsplash.com/photo-1582966772680-860e372bb558?q=80&w=600&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1587760636306-749e75ebed7c?q=80&w=600&auto=format&fit=crop"
  ],
  "Suits": [
    "https://images.unsplash.com/photo-1605763240000-7e93b172d754?q=80&w=600&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1594938298596-af09cc8ea8b9?q=80&w=600&auto=format&fit=crop"
  ]
};

const categoriesData = [
  { catEn: "Makeup", catAr: "ميكب", itemsEn: ["Lipstick", "Foundation", "Mascara", "Eyeshadow Palette", "Highlighter", "Blush", "Concealer", "Lip Gloss"], itemsAr: ["روج", "فاونديشن", "ماسكارا", "باليت ايشادو", "هايلايتر", "بلاشر", "كونسيلر", "ليب جلوس"] },
  { catEn: "Accessories", catAr: "إكسسوارات حريمي", itemsEn: ["Necklace", "Earrings", "Bracelet", "Ring", "Watch", "Sunglasses", "Hair Clip"], itemsAr: ["عقد", "حلق", "اسورة", "خاتم", "ساعة حريمي", "نظارة شمس حريمي", "توكة شعر"] },
  { catEn: "Home", catAr: "أدوات منزلية", itemsEn: ["Coffee Maker", "Blender", "Air Fryer", "Toaster", "Kettle", "Dinner Set", "Cutlery Set"], itemsAr: ["ماكينة قهوة", "خلاط", "قلاية هوائية", "توستر", "غلاية", "طقم عشاء", "طقم معالق"] },
  { catEn: "Bags", catAr: "شنط حريمي", itemsEn: ["Tote Bag", "Crossbody Bag", "Shoulder Bag", "Clutch", "Backpack", "Handbag"], itemsAr: ["شنطة توت", "شنطة كروس", "شنطة كتف", "كلاتش", "شنطة ظهر", "شنطة يد"] },
  { catEn: "Pants", catAr: "بناطيل حريمي", itemsEn: ["Wide Leg Jeans", "Cargo Pants", "Flared Pants", "Leggings", "Culottes", "Sweatpants"], itemsAr: ["جينز وايد ليج", "بنطلون كارغو", "بنطلون شارلستون", "ليجنز", "كولوت", "سويت بانتس"] },
  { catEn: "T-Shirts", catAr: "تيشيرتات حريمي", itemsEn: ["Basic Tee", "Graphic T-Shirt", "Crop Top", "Oversized Tee", "V-Neck Shirt"], itemsAr: ["تيشيرت بيزك", "تيشيرت جرافيك", "كروب توب", "تيشيرت أوفر سايز", "تيشيرت بياقة V"] },
  { catEn: "Hoodies", catAr: "هوديات حريمي", itemsEn: ["Oversized Hoodie", "Cropped Hoodie", "Zip-Up Hoodie", "Fleece Hoodie"], itemsAr: ["هودي أوفر سايز", "هودي قصير", "هودي بسحاب", "هودي فرو"] },
  { catEn: "Abayas", catAr: "عبايات", itemsEn: ["Black Abaya", "Embroidered Abaya", "Open Front Abaya", "Silk Abaya", "Casual Abaya"], itemsAr: ["عباية سوداء", "عباية مطرزة", "عباية مفتوحة", "عباية حرير", "عباية كاجوال"] },
  { catEn: "Isdals", catAr: "إسدالات صلاة", itemsEn: ["Cotton Prayer Dress", "Printed Isdal", "Two-Piece Isdal", "Lace Detail Isdal"], itemsAr: ["إسدال قطن", "إسدال منقوش", "إسدال قطعتين", "إسدال بدانتيل"] },
  { catEn: "Dresses", catAr: "دريسات", itemsEn: ["Floral Midi Dress", "Evening Gown", "Wrap Dress", "Summer Maxi Dress", "Satin Dress"], itemsAr: ["دريس ميدى فلورال", "فستان سهرة", "دريس لف", "دريس ماكسي صيفي", "دريس ساتان"] },
  { catEn: "Socks", catAr: "شرابات حريمي", itemsEn: ["Ankle Socks", "Knee-High Socks", "Cotton Socks", "Patterned Socks", "Invisible Socks"], itemsAr: ["شراب أنكل", "شراب طويل", "شراب قطن", "شراب منقوش", "شراب سري"] },
  { catEn: "Suits", catAr: "سوتس حريمي", itemsEn: ["Linen Two-Piece Suit", "Formal Blazer Suit", "Casual Co-ord Set", "Satin Lounge Set"], itemsAr: ["سوت كتان قطعتين", "بدلة بليزر رسمية", "طقم كاجوال كورد", "طقم ساتان منزلي"] },
];

const adjEn = ["Premium", "Luxury", "Elegant", "Classic", "Modern", "Chic", "Trendy", "Casual", "Exclusive", "Vintage", "Minimalist"];
const adjAr = ["بريميوم", "فاخر", "أنيق", "كلاسيك", "عصري", "شيك", "تريند", "كاجوال", "حصري", "فينتاج", "بسيط"];

const colorsEn = ["Black", "White", "Beige", "Navy", "Red", "Pink", "Burgundy", "Emerald", "Rose Gold", "Silver", "Gold", "Nude"];
const colorsAr = ["أسود", "أبيض", "بيج", "كحلي", "أحمر", "بينك", "عنابي", "زمردي", "روز جولد", "فضي", "ذهبي", "نيود"];

function getRandom(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

const products = [];

for (let i = 1; i <= 1000; i++) {
   const catInfo = getRandom(categoriesData);
   const imageOptions = categoryImages[catInfo.catEn];
   const imageUrl = getRandom(imageOptions);
   
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

   products.push({
      partner_id: partnerId,
      name_en,
      name_ar,
      description: `Premium ${catInfo.catEn.toLowerCase()} collection piece for women. Crafted with care for an elegant look. A unique item from our ${adjEn[aIdx]} series.`,
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
  console.log(`⏳ Preparing to insert ${products.length} PREMIUM women's products in batches...`);
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
  
  console.log("🎉 All 1000 PREMIUM women's products added successfully!");
}

execute();
