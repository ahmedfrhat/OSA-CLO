import { redirect } from "next/navigation";
import { getSession } from "@/lib/session";
import { supabase } from "@/lib/supabase";
import DashboardShell from "./DashboardShell";

export const dynamic = "force-dynamic"; // always fetch fresh data

export default async function DashboardPage() {
  // ── Auth Guard ──────────────────────────────────────────────────────────
  const session = getSession();
  if (!session) redirect("/admin/login");

  // ── Fetch Partner's Products ────────────────────────────────────────────
  const { data: products } = await supabase
    .from("products")
    .select("*")
    .eq("partner_id", session.partnerId)
    .order("created_at", { ascending: false });

  // ── Fetch Partner's Orders + Items ──────────────────────────────────────
  const { data: orders } = await supabase
    .from("orders")
    .select(
      `
      id, partner_id, customer_name, customer_phone, customer_address,
      source, status, notes, total_amount, paid_amount, activity_log,
      created_at, updated_at,
      order_items (
        id, product_id, quantity, size, unit_price, cost_price
      )
    `
    )
    .eq("partner_id", session.partnerId)
    .order("created_at", { ascending: false });

  return (
    <DashboardShell
      session={session}
      products={products ?? []}
      orders={orders ?? []}
    />
  );
}
