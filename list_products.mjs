import { createClient } from "@supabase/supabase-js";
const supabase = createClient("https://espqrrunhekvjsoxdfbx.supabase.co", "sb_publishable_gBLthp-l-wVyAp_coMIhKA_xUwBb6WQ");

async function listProducts() {
  const { data, error } = await supabase.from("products").select("id, name_en, created_at").order("created_at", { ascending: false }).limit(5);
  console.log(data, error);
}
listProducts();
