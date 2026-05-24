with open('src/app/admin/dashboard/page.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

# Make the queries dynamic based on whether it's super admin
new_queries = '''
  const isSuperAdmin = session.partnerId === "admin" || session.partnerName.toLowerCase() === "admin";

  // ── Fetch Partner's Products ────────────────────────────────────────────
  let productsQuery = supabase
    .from("products")
    .select("*")
    .order("created_at", { ascending: false });

  if (!isSuperAdmin) {
    productsQuery = productsQuery.eq("partner_id", dbPartnerId);
  }

  const { data: products } = await productsQuery;

  // ── Fetch Partner's Orders + Items ──────────────────────────────────────
  let ordersQuery = supabase
    .from("orders")
    .select(
      
      id, partner_id, customer_name, customer_phone, customer_address,
      source, status, notes, total_amount, paid_amount, activity_log,
      created_at, updated_at,
      order_items (
        id, product_id, quantity, size, unit_price, cost_price
      )
    
    )
    .order("created_at", { ascending: false });

  if (!isSuperAdmin) {
    ordersQuery = ordersQuery.eq("partner_id", dbPartnerId);
  }

  const { data: orders } = await ordersQuery;
'''

import re

# Match the blocks to replace
content = re.sub(
    r'  // ── Fetch Partner\'s Products ──.*?\.order\("created_at", \{ ascending: false \}\);',
    new_queries,
    content,
    flags=re.DOTALL
)

with open('src/app/admin/dashboard/page.tsx', 'w', encoding='utf-8') as f:
    f.write(content)

print("page.tsx updated with Super Admin bypass.")
