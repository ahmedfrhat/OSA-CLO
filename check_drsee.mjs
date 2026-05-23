import { createClient } from "@supabase/supabase-js";
const supabase = createClient("https://espqrrunhekvjsoxdfbx.supabase.co", "sb_publishable_gBLthp-l-wVyAp_coMIhKA_xUwBb6WQ");

async function checkDrsee() {
  const { data, error } = await supabase.from("products").select("id, name_en, image_url").eq("id", "75796b7b-cc28-4be2-9a41-91bdcfffaaef");
  console.log(data, error);
}
checkDrsee();
