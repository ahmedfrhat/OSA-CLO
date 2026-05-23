import { createClient } from "@supabase/supabase-js";
const supabase = createClient("https://espqrrunhekvjsoxdfbx.supabase.co", "sb_publishable_gBLthp-l-wVyAp_coMIhKA_xUwBb6WQ");

async function checkProduct() {
  const { data, error } = await supabase.from("products").select("*").eq("id", "fa1fe57b-0f62-4111-bdaa-13bc614718ee");
  console.log(data, error);
}
checkProduct();
