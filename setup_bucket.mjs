import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  "https://espqrrunhekvjsoxdfbx.supabase.co",
  "sb_secret_JlI0cukTaOrkBLMoJvi7gQ_f0-gAxju" // The Service Role Secret
);

async function setupBucket() {
  console.log("⏳ Setting up 'product-images' bucket...");
  
  const { data, error } = await supabase.storage.createBucket("product-images", {
    public: true,
    allowedMimeTypes: ["image/jpeg", "image/png", "image/webp", "image/avif", "image/jpg"],
    fileSizeLimit: 10485760 // 10MB
  });

  if (error) {
    if (error.message.includes("Duplicate") || error.message.includes("already exists")) {
      console.log("Bucket already exists. Updating it to be public...");
      const { error: updateError } = await supabase.storage.updateBucket("product-images", {
        public: true,
        allowedMimeTypes: ["image/jpeg", "image/png", "image/webp", "image/avif", "image/jpg"],
        fileSizeLimit: 10485760
      });
      if (updateError) {
        console.error("❌ Failed to update bucket:", updateError.message);
      } else {
        console.log("✅ Bucket updated to PUBLIC successfully!");
      }
    } else {
      console.error("❌ Failed to create bucket:", error.message);
    }
  } else {
    console.log("✅ Bucket 'product-images' created and made PUBLIC successfully!");
  }
}

setupBucket();
