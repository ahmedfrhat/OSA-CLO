const fs = require('fs');
const path = require('path');

const enPath = path.join(__dirname, 'src', 'i18n', 'en.json');
const arPath = path.join(__dirname, 'src', 'i18n', 'ar.json');

const en = JSON.parse(fs.readFileSync(enPath, 'utf8'));
const ar = JSON.parse(fs.readFileSync(arPath, 'utf8'));

// 1. Add storefront.checkout additions
const enCheckoutAdditions = {
  "shippingInfo": "Shipping Information",
  "governorate": "Governorate *",
  "selectGovernorate": "— Select Governorate —",
  "city": "City / Region *",
  "selectCity": "— Select City —",
  "detailedAddress": "Detailed Address * (Street, building, apartment)",
  "addressPlaceholder": "e.g., Al-Tahrir Street, building 12, apt 3",
  "shippingTo": "Will be shipped to:",
  "onlyPaymentMethod": "Only accepted payment method",
  "active": "Active",
  "discountOptional": "Discount Code (Optional)",
  "apply": "Apply",
  "applied": "applied!",
  "chatOnWhatsApp": "Need help? Chat on WhatsApp",
  "orderSummary": "Order Summary",
  "size": "Size",
  "subtotal": "Subtotal",
  "total": "Total",
  "dueNow": "Due Now (50%)",
  "onDelivery": "On Delivery"
};

const arCheckoutAdditions = {
  "shippingInfo": "بيانات الشحن",
  "governorate": "المحافظة *",
  "selectGovernorate": "— اختر المحافظة —",
  "city": "المدينة / المركز *",
  "selectCity": "— اختر المدينة —",
  "detailedAddress": "العنوان التفصيلي * (اسم الشارع، رقم المبنى، الدور)",
  "addressPlaceholder": "مثال: شارع التحرير، مبنى 12، شقة 3",
  "shippingTo": "سيتم الشحن إلى:",
  "onlyPaymentMethod": "طريقة الدفع الوحيدة المقبولة",
  "active": "نشط",
  "discountOptional": "كود الخصم (اختياري)",
  "apply": "تطبيق",
  "applied": "تم التطبيق!",
  "chatOnWhatsApp": "هل تحتاج لمساعدة؟ تواصل معنا عبر واتساب",
  "orderSummary": "ملخص الطلب",
  "size": "المقاس",
  "subtotal": "المجموع الفرعي",
  "total": "الإجمالي",
  "dueNow": "المدفوع الآن (٥٠٪)",
  "onDelivery": "عند الاستلام"
};

Object.assign(en.storefront.checkout, enCheckoutAdditions);
Object.assign(ar.storefront.checkout, arCheckoutAdditions);

// 2. Add storefront.checkout.errors additions
const enErrorAdditions = {
  "governorateRequired": "Governorate is required",
  "cityRequired": "City is required",
  "detailedAddressRequired": "Detailed address is required"
};

const arErrorAdditions = {
  "governorateRequired": "يرجى اختيار المحافظة",
  "cityRequired": "يرجى اختيار المدينة",
  "detailedAddressRequired": "يرجى كتابة العنوان بالتفصيل"
};

Object.assign(en.storefront.checkout.errors, enErrorAdditions);
Object.assign(ar.storefront.checkout.errors, arErrorAdditions);

// 3. Add storefront.product additions
en.storefront.product = en.storefront.product || {};
ar.storefront.product = ar.storefront.product || {};

const enProductAdditions = {
  "writeReview": "Write a Review",
  "yourName": "Your Name",
  "rating": "Rating",
  "greatQuality": "Great quality, fits perfectly...",
  "reviewNamePlaceholder": "Ahmed Mohamed",
  "reviewSuccess": "Thank you! Your review is pending approval.",
  "reviewError": "Please enter your name and select a rating.",
  "commentOptional": "Comment (Optional)",
  "submitReview": "Submit Review",
  "customerReviews": "Customer Reviews"
};

const arProductAdditions = {
  "writeReview": "اكتب تقييماً",
  "yourName": "اسمك",
  "rating": "التقييم",
  "greatQuality": "جودة رائعة، مقاس ممتاز...",
  "reviewNamePlaceholder": "أحمد محمد",
  "reviewSuccess": "شكراً! تقييمك قيد المراجعة.",
  "reviewError": "يرجى إدخال اسمك وتحديد التقييم.",
  "commentOptional": "التعليق (اختياري)",
  "submitReview": "إرسال التقييم",
  "customerReviews": "آراء العملاء"
};

Object.assign(en.storefront.product, enProductAdditions);
Object.assign(ar.storefront.product, arProductAdditions);

// 4. Add admin additions
en.admin.dashboard.orders.empty = en.admin.dashboard.orders.empty || {};
ar.admin.dashboard.orders.empty = ar.admin.dashboard.orders.empty || {};

en.admin.dashboard.orders.empty.closedTitle = "No closed orders yet";
ar.admin.dashboard.orders.empty.closedTitle = "لا توجد طلبات مغلقة بعد";

en.admin.dashboard.orders.generateWhatsApp = "Generate WhatsApp Status";
ar.admin.dashboard.orders.generateWhatsApp = "توليد حالة واتساب";

// 5. Write back JSON files
fs.writeFileSync(enPath, JSON.stringify(en, null, 2), 'utf8');
fs.writeFileSync(arPath, JSON.stringify(ar, null, 2), 'utf8');

console.log("Successfully added new custom keys to en.json and ar.json.");
