import { createClient } from "@supabase/supabase-js";
import https from "https";

const supabase = createClient(
  "https://espqrrunhekvjsoxdfbx.supabase.co",
  "sb_publishable_gBLthp-l-wVyAp_coMIhKA_xUwBb6WQ"
);

// Fallback guaranteed valid image for each category (I have verified these are alive)
const fallbackImages = {
  "ميكب": "https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=600&auto=format&fit=crop&q=80",
  "إكسسوارات حريمي": "https://images.unsplash.com/photo-1515562141207-7a8efbc88b72?w=600&auto=format&fit=crop&q=80",
  "أدوات منزلية": "https://images.unsplash.com/photo-1556910103-1c02745aae4d?w=600&auto=format&fit=crop&q=80",
  "شنط حريمي": "https://images.unsplash.com/photo-1584916201218-f4242ceb4809?w=600&auto=format&fit=crop&q=80",
  "عبايات": "https://images.unsplash.com/photo-1515347619362-e64e9a0ce616?w=600&auto=format&fit=crop&q=80",
  "إسدالات صلاة": "https://images.unsplash.com/photo-1515347619362-e64e9a0ce616?w=600&auto=format&fit=crop&q=80",
  "دريسات": "https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=600&auto=format&fit=crop&q=80"
};

// Check if URL is valid
function checkImage(url) {
  return new Promise((resolve) => {
    https.get(url, (res) => {
      // 200 OK or 3xx Redirect is fine. Unsplash usually gives 200.
      if (res.statusCode >= 200 && res.statusCode < 400) {
        resolve(true);
      } else {
        resolve(false);
      }
    }).on('error', () => resolve(false));
  });
}

async function fixImages() {
  console.log("Fetching all remaining products...");
  const { data: products, error } = await supabase.from("products").select("id, category, image_url");
  if (error) {
    console.error("Fetch error:", error);
    return;
  }
  
  console.log(`Checking ${products.length} products for broken images...`);
  
  let fixedCount = 0;
  
  // To avoid hammering Unsplash, we cache valid/invalid results per URL
  const urlStatus = {};
  
  for (const product of products) {
    let isValid = urlStatus[product.image_url];
    
    if (isValid === undefined) {
      isValid = await checkImage(product.image_url);
      urlStatus[product.image_url] = isValid;
      if (!isValid) console.log(`❌ Broken image found: ${product.image_url}`);
    }
    
    if (!isValid) {
      const fallback = fallbackImages[product.category] || fallbackImages["دريسات"];
      await supabase.from("products").update({ image_url: fallback }).eq("id", product.id);
      fixedCount++;
    }
  }
  
  console.log(`✅ Fixed ${fixedCount} broken images.`);
}

fixImages();
