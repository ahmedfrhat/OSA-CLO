import { createClient } from "@supabase/supabase-js";
const supabase = createClient("https://espqrrunhekvjsoxdfbx.supabase.co", "sb_secret_JlI0cukTaOrkBLMoJvi7gQ_f0-gAxju");

async function checkLatestProduct() {
  const { data, error } = await supabase.from("products").select("id, name_en, image_url").order("created_at", { ascending: false }).limit(1);
  console.log("Latest product:", data);
  if (error) console.error("Error:", error);
}
checkLatestProduct();
