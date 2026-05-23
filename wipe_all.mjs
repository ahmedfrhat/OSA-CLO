import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  "https://espqrrunhekvjsoxdfbx.supabase.co",
  "sb_publishable_gBLthp-l-wVyAp_coMIhKA_xUwBb6WQ"
);

async function wipeDatabase() {
  console.log("🗑️ Wiping all products from the database immediately...");
  
  const { error } = await supabase
    .from("products")
    .delete()
    .neq("id", "00000000-0000-0000-0000-000000000000");

  if (error) {
    console.error("❌ Failed to wipe database:", error);
  } else {
    console.log("✅ Wiped all products successfully.");
  }
}

wipeDatabase();
