import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  "https://espqrrunhekvjsoxdfbx.supabase.co",
  "sb_publishable_gBLthp-l-wVyAp_coMIhKA_xUwBb6WQ"
);

async function execute() {
  console.log("🗑️ Deleting all existing products to remove the bad images...");
  const { error } = await supabase.from("products").delete().neq("id", "00000000-0000-0000-0000-000000000000");
  if (error) {
    console.error("❌ Failed:", error);
  } else {
    console.log("✅ Deleted all products successfully.");
  }
}

execute();
