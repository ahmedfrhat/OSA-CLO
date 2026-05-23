import { createClient } from "@supabase/supabase-js";
const supabase = createClient("https://espqrrunhekvjsoxdfbx.supabase.co", "sb_publishable_gBLthp-l-wVyAp_coMIhKA_xUwBb6WQ");

async function listBuckets() {
  const { data, error } = await supabase.storage.listBuckets();
  if (error) console.error("Error:", error.message);
  else console.log("Buckets:", data.map(b => b.name));
}
listBuckets();
