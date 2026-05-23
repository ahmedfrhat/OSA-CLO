// src/i18n/translations.ts
// Feature 8: Full Arabic/English translations

export type Lang = "en" | "ar";

export const translations = {
  en: {
    // Navigation
    nav_shop: "Shop",
    nav_collections: "Collections",
    nav_track: "Track Order",
    nav_admin: "Admin",
    nav_cart: "Cart",

    // Hero
    hero_season: "SS 2025 — DROP 01",
    hero_title: "THE NEW STANDARD.",
    hero_subtitle: "Minimalist streetwear crafted for those who define the culture — not follow it.",
    hero_cta: "Shop the Drop",
    hero_explore: "Explore Collections",

    // Categories — Feature 2: Restructured
    cat_all: "All",
    cat_clothing: "Clothing",
    cat_abayas: "Abayas",
    cat_isdals: "Isdals",
    cat_dresses: "Dresses",
    cat_tshirts: "T-Shirts",
    cat_pants: "Pants",
    cat_footwear: "Footwear",
    cat_sneakers: "Sneakers",
    cat_heels: "Heels",
    cat_slippers: "Slippers",
    cat_bags_accessories: "Bags & Accessories",
    cat_girls_bags: "Girls' Bags",
    cat_accessories: "Accessories",
    cat_beauty_home: "Beauty & Home",
    cat_makeup: "Makeup",
    cat_home_appliances: "Home Appliances",

    // Products
    prod_new: "NEW",
    prod_add_to_cart: "Add to Cart",
    prod_sold_out: "Sold Out",
    prod_size: "Size",
    prod_color: "Color",
    prod_quantity: "Quantity",
    prod_buy_now: "Buy Now",
    prod_description: "Description",
    prod_reviews: "Reviews",

    // Search
    search_placeholder: "Search products...",
    search_results: "results for",
    search_no_results: "No results found for",
    search_try: "Try a different search term",

    // Cart
    cart_title: "Your Cart",
    cart_empty: "Your cart is empty",
    cart_subtotal: "Subtotal",
    cart_checkout: "Checkout",
    cart_continue: "Continue Shopping",
    cart_remove: "Remove",
    cart_items: "items",

    // Checkout
    checkout_title: "Checkout",
    checkout_name: "Full Name",
    checkout_phone: "Phone Number",
    checkout_address: "Delivery Address",
    checkout_city: "City",
    checkout_notes: "Order Notes (optional)",
    checkout_submit: "Place Order",
    checkout_success: "Order placed successfully!",
    checkout_discount: "Discount Code",
    checkout_apply: "Apply",

    // Track Order
    track_title: "Track Your Order",
    track_placeholder: "Enter your order ID",
    track_btn: "Track",
    track_status: "Order Status",
    track_not_found: "Order not found",

    // Admin
    admin_dashboard: "Admin Dashboard",
    admin_products: "Products",
    admin_orders: "Orders",
    admin_settings: "Settings",
    admin_popup: "Promotional Popup",
    admin_add_product: "Add Product",
    admin_edit: "Edit",
    admin_delete: "Delete",
    admin_save: "Save Changes",
    admin_cancel: "Cancel",
    admin_logout: "Logout",
    admin_popup_title: "Popup Title",
    admin_popup_message: "Popup Message",
    admin_popup_enabled: "Enable Popup",
    admin_popup_disabled: "Disable Popup",
    admin_popup_preview: "Preview",

    // Misc
    loading: "Loading...",
    error_generic: "Something went wrong. Please try again.",
    footer_rights: "All rights reserved.",
    theme_toggle: "Toggle theme",
    lang_toggle: "عربي",
  },

  ar: {
    // Navigation
    nav_shop: "تسوق",
    nav_collections: "المجموعات",
    nav_track: "تتبع الطلب",
    nav_admin: "الإدارة",
    nav_cart: "السلة",

    // Hero
    hero_season: "صيف ٢٠٢٥ — الإصدار الأول",
    hero_title: "المعيار الجديد.",
    hero_subtitle: "ملابس ستريت وير مميزة صُنعت لمن يصنع الثقافة — لا لمن يتبعها.",
    hero_cta: "تسوق الإصدار",
    hero_explore: "استكشف المجموعات",

    // Categories
    cat_all: "الكل",
    cat_clothing: "الملابس",
    cat_abayas: "عبايات",
    cat_isdals: "إسدال",
    cat_dresses: "فساتين",
    cat_tshirts: "تيشيرتات",
    cat_pants: "بناطيل",
    cat_footwear: "الأحذية",
    cat_sneakers: "سنيكرز",
    cat_heels: "كعب عالي",
    cat_slippers: "شبشب",
    cat_bags_accessories: "الشنط والإكسسوار",
    cat_girls_bags: "شنط بنات",
    cat_accessories: "إكسسوار",
    cat_beauty_home: "الجمال والمنزل",
    cat_makeup: "مكياج",
    cat_home_appliances: "أجهزة منزلية",

    // Products
    prod_new: "جديد",
    prod_add_to_cart: "أضف للسلة",
    prod_sold_out: "نفذت الكمية",
    prod_size: "المقاس",
    prod_color: "اللون",
    prod_quantity: "الكمية",
    prod_buy_now: "اشتري الآن",
    prod_description: "الوصف",
    prod_reviews: "التقييمات",

    // Search
    search_placeholder: "ابحث عن منتجات...",
    search_results: "نتائج لـ",
    search_no_results: "لا توجد نتائج لـ",
    search_try: "جرّب كلمة بحث مختلفة",

    // Cart
    cart_title: "سلتك",
    cart_empty: "سلتك فارغة",
    cart_subtotal: "المجموع",
    cart_checkout: "إتمام الشراء",
    cart_continue: "متابعة التسوق",
    cart_remove: "حذف",
    cart_items: "منتجات",

    // Checkout
    checkout_title: "إتمام الطلب",
    checkout_name: "الاسم كامل",
    checkout_phone: "رقم الهاتف",
    checkout_address: "عنوان التوصيل",
    checkout_city: "المدينة",
    checkout_notes: "ملاحظات الطلب (اختياري)",
    checkout_submit: "تأكيد الطلب",
    checkout_success: "تم تأكيد طلبك بنجاح!",
    checkout_discount: "كود الخصم",
    checkout_apply: "تطبيق",

    // Track Order
    track_title: "تتبع طلبك",
    track_placeholder: "أدخل رقم الطلب",
    track_btn: "تتبع",
    track_status: "حالة الطلب",
    track_not_found: "الطلب غير موجود",

    // Admin
    admin_dashboard: "لوحة التحكم",
    admin_products: "المنتجات",
    admin_orders: "الطلبات",
    admin_settings: "الإعدادات",
    admin_popup: "البوب أب الترويجي",
    admin_add_product: "إضافة منتج",
    admin_edit: "تعديل",
    admin_delete: "حذف",
    admin_save: "حفظ التغييرات",
    admin_cancel: "إلغاء",
    admin_logout: "تسجيل الخروج",
    admin_popup_title: "عنوان البوب أب",
    admin_popup_message: "رسالة البوب أب",
    admin_popup_enabled: "تفعيل البوب أب",
    admin_popup_disabled: "إيقاف البوب أب",
    admin_popup_preview: "معاينة",

    // Misc
    loading: "جاري التحميل...",
    error_generic: "حدث خطأ. يرجى المحاولة مرة أخرى.",
    footer_rights: "جميع الحقوق محفوظة.",
    theme_toggle: "تغيير المظهر",
    lang_toggle: "English",
  },
} as const;

export type TranslationKey = string;
