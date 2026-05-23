import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  "https://espqrrunhekvjsoxdfbx.supabase.co",
  "sb_publishable_gBLthp-l-wVyAp_coMIhKA_xUwBb6WQ"
);

async function cleanUp() {
  console.log("🗑️ Deleting categories that might be considered men's / unisex (T-shirts, Hoodies, Pants, Suits, Socks)...");
  
  const categoriesToDelete = ["تيشيرتات حريمي", "هوديات حريمي", "بناطيل حريمي", "سوتس حريمي", "شرابات حريمي"];
  
  const { error } = await supabase
    .from("products")
    .delete()
    .in("category", categoriesToDelete);

  if (error) {
    console.error("❌ Failed to delete:", error);
  } else {
    console.log("✅ Successfully deleted unisex/youth categories!");
  }
}

cleanUp();
