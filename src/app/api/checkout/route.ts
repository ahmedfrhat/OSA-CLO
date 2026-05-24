import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

// ── Server-side validation helpers ────────────────────────────────────────────
function isValidEgyptianPhone(phone: string): boolean {
  const clean = phone.replace(/[\s\-()]/g, "");
  return /^(010|011|012|015)\d{8}$/.test(clean);
}

function isLettersOnly(name: string): boolean {
  // Arabic + English letters + spaces/hyphens/apostrophes only — no digits
  return /^[\u0600-\u06FF\u0750-\u077Fa-zA-Z\s''\-]+$/.test(name.trim());
}

interface CheckoutItem {
  productId: string;
  partnerId: string;
  size: string;
  quantity: number;
  price: number; // client-reported; we re-verify from DB
}

// ── POST /api/checkout ────────────────────────────────────────────────────────
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      customer_name,
      customer_phone,
      customer_address,
      notes,
      payment_type,  // "full" | "deposit"
      discount_amount,
      discount_code,
      items,
    } = body as {
      customer_name: string;
      customer_phone: string;
      customer_address: string;
      notes?: string;
      payment_type: "full" | "deposit";
      discount_amount?: number;
      discount_code?: string;
      items: CheckoutItem[];
    };

    // ── Server-side validation ──────────────────────────────────────────────
    if (!customer_name?.trim())
      return NextResponse.json({ error: "الاسم الكامل مطلوب" }, { status: 400 });
    if (!isLettersOnly(customer_name))
      return NextResponse.json({ error: "الاسم يجب أن يحتوي على حروف فقط (بدون أرقام)" }, { status: 400 });
    if (!isValidEgyptianPhone(customer_phone ?? ""))
      return NextResponse.json({ error: "رقم الهاتف غير صالح — يجب أن يبدأ بـ 010/011/012/015 ويتكون من 11 رقم" }, { status: 400 });
    if (!customer_address?.trim() || customer_address.trim().length < 10)
      return NextResponse.json({ error: "العنوان مطلوب (10 أحرف على الأقل)" }, { status: 400 });
    if (!items?.length)
      return NextResponse.json({ error: "السلة فارغة" }, { status: 400 });

    // ── Verify prices + availability from DB (security: never trust client prices) ──
    const productIds = Array.from(new Set(items.map((i) => i.productId)));
    const { data: dbProducts } = await supabase
      .from("products")
      .select("id, selling_price, partner_id, stock_quantity, in_stock, is_available, name_en")
      .in("id", productIds);

    if (!dbProducts?.length)
      return NextResponse.json({ error: "المنتجات غير موجودة" }, { status: 404 });

    const priceMap = Object.fromEntries(
      dbProducts.map((p) => [p.id, p])
    );

    // Validate each item
    for (const item of items) {
      const dbP = priceMap[item.productId];
      if (!dbP || !dbP.in_stock || !dbP.is_available)
        return NextResponse.json({ error: `المنتج غير متاح: ${dbP?.name_en ?? item.productId}` }, { status: 409 });
    }

    // ── Group items by partner_id ────────────────────────────────────────────
    const byPartner: Record<string, CheckoutItem[]> = {};
    for (const item of items) {
      const p = priceMap[item.productId];
      const pid = p?.partner_id ?? item.partnerId;
      if (!byPartner[pid]) byPartner[pid] = [];
      byPartner[pid].push(item);
    }

    const orderIds: string[] = [];

    for (const [partnerId, partnerItems] of Object.entries(byPartner)) {
      // Use server-verified prices
      const total_amount = partnerItems.reduce((s, i) => {
        return s + (priceMap[i.productId]?.selling_price ?? 0) * i.quantity;
      }, 0);

      const paid_amount =
        payment_type === "deposit"
          ? Math.round(total_amount * 0.5)
          : total_amount;

      // Build note with payment type info
      const paymentNote = payment_type === "deposit"
        ? `[50% DEPOSIT — Remaining: EGP ${total_amount - paid_amount}]`
        : "[FULL PAYMENT]";
      const combinedNotes = [paymentNote, notes?.trim()].filter(Boolean).join(" | ");

      // Build order payload — notes column is optional (may not exist in all schemas)
      const orderPayload: Record<string, unknown> = {
          partner_id:       partnerId,
          customer_name:    customer_name.trim(),
          customer_phone:   customer_phone.trim().replace(/[\s\-()]/g, ""),
          customer_address: customer_address.trim(),
          source:           "storefront",
          status:           "pending",
          total_amount,
          paid_amount,
      };
      if (combinedNotes) orderPayload.notes = combinedNotes;

      const { data: order, error: orderError } = await supabase
        .from("orders")
        .insert([orderPayload])
        .select()
        .single();
      
      // If notes column doesn't exist, retry without it
      if (orderError?.message?.includes("notes")) {
        delete orderPayload.notes;
        const { data: order2, error: orderError2 } = await supabase
          .from("orders")
          .insert([orderPayload])
          .select()
          .single();
        if (orderError2) {
          console.error("Order insert error:", orderError2);
          return NextResponse.json({ error: orderError2.message }, { status: 500 });
        }
        const orderItems2 = partnerItems.map((item) => ({
          order_id:   order2.id,
          product_id: item.productId,
          size:       item.size || null,
          quantity:   item.quantity,
          unit_price: priceMap[item.productId]?.selling_price ?? 0,
          cost_price: 0,
        }));
        const { error: itemsError2 } = await supabase.from("order_items").insert(orderItems2);
        if (itemsError2) return NextResponse.json({ error: itemsError2.message }, { status: 500 });
        orderIds.push(order2.id);
        continue;
      }

      if (orderError) {
        console.error("Order insert error:", orderError);
        return NextResponse.json({ error: orderError.message }, { status: 500 });
      }

      const orderItems = partnerItems.map((item) => ({
        order_id:   order.id,
        product_id: item.productId,
        size:       item.size || null,
        quantity:   item.quantity,
        unit_price: priceMap[item.productId]?.selling_price ?? 0,
        cost_price: 0, // not exposed publicly
      }));

      const { error: itemsError } = await supabase.from("order_items").insert(orderItems);
      if (itemsError) return NextResponse.json({ error: itemsError.message }, { status: 500 });

      orderIds.push(order.id);
    }

    return NextResponse.json({ success: true, orderIds }, { status: 201 });

  } catch (err) {
    console.error("Checkout error:", err);
    return NextResponse.json({ error: "حدث خطأ في السيرفر" }, { status: 500 });
  }
}
