import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";

export const dynamic = "force-dynamic";

const SEED_SECRET = process.env.SEED_SECRET ?? "osa-seed-2025";

const PARTNER_IDS = [
  "596c4367-1491-481f-b0f2-1825c2540ebd",
  "2a304931-2230-4960-9e44-b19ed5e0178b",
  "652f4263-d4e3-4bf6-a5c4-778e8a08c710",
];

const IMGS = [
  "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1556821840-3a63f95609a7?auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1604176354204-9268737828e4?auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1584916201218-f4242ceb4809?auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1618354691373-d851c5c3a990?auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1544441893-675973e31985?auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1574180566232-aaad1b5b8450?auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b?auto=format&fit=crop&w=800&q=80",
];

function img() { return IMGS[Math.floor(Math.random() * IMGS.length)]; }
function partner() { return PARTNER_IDS[Math.floor(Math.random() * PARTNER_IDS.length)]; }
function price(min: number, max: number) { return Math.round((Math.random() * (max - min) + min) / 50) * 50; }
function stock() { return Math.floor(Math.random() * 80) + 10; }
function row(name_en: string, name_ar: string, desc: string, category: string, sizes: string[], min: number, max: number) {
  const i1 = img(), i2 = img(), i3 = img();
  return { partner_id: partner(), name_en, name_ar, description: desc, category, sizes, selling_price: price(min, max), stock_quantity: stock(), in_stock: true, image_url: i1, image_urls: [i1, i2, i3] };
}

const PRODUCTS = [
  // ── ABAYAS (35) ────────────────────────────────────────────────────────────
  row("Midnight Crepe Open Abaya",          "عباية كريب ميدنايت مفتوحة",           "Flowing open-front abaya in premium midnight black double crepe. Clean lines, no embellishment.",                           "abayas", ["S","M","L","XL","XXL"], 380, 550),
  row("Ivory Pearl-Button Closed Abaya",    "عباية مغلقة بأزرار لؤلؤ آيفوري",      "Structured closed abaya in ivory crepe with pearl-button front placket and modest flare.",                               "abayas", ["S","M","L","XL"],       420, 600),
  row("Butterfly Sleeve Chiffon Abaya",     "عباية شيفون كم فراشة",                "Ultra-wide butterfly sleeves in two-layer chiffon. Elegant for occasions.",                                               "abayas", ["S","M","L","XL","XXL"], 460, 680),
  row("Belted Kimono Abaya — Sage",         "عباية كيمونو مربوطة سيج",             "Kimono-cut abaya in sage linen-blend with removable self-tie belt.",                                                     "abayas", ["S","M","L","XL"],       500, 720),
  row("Hand-Embroidered Cuff Abaya",        "عباية كف مطرز يدوي",                  "Flowing black abaya with hand-embroidered geometric cuffs in gold thread.",                                              "abayas", ["S","M","L","XL","XXL"], 680, 980),
  row("Front-Slit Navy Abaya",              "عباية نيفي بفتحة أمامية",             "Deep navy crepe abaya with long front slit and subtle A-line silhouette.",                                               "abayas", ["S","M","L","XL"],       400, 580),
  row("Pleated Body Dusty Rose Abaya",      "عباية بليتد روز داستي",               "Vertical knife-pleats throughout the body in dusty rose nida fabric.",                                                  "abayas", ["S","M","L","XL"],       520, 760),
  row("Sporty Stripe Abaya — Black/White",  "عباية سبورتي مخططة أسود وأبيض",       "Athletic-inspired cut with contrast side stripe. Modern streetwear twist on the classic abaya.",                         "abayas", ["S","M","L","XL","XXL"], 440, 640),
  row("Ombre Grey-to-Black Abaya",          "عباية أومبري من الرمادي للأسود",       "Gradient dip-dye effect blending seamlessly from charcoal to jet black.",                                               "abayas", ["S","M","L","XL"],       600, 880),
  row("Satin Trim Open Abaya",              "عباية مفتوحة بتريم ساتان",            "Matte crepe abaya with polished satin piping on edges and cuffs.",                                                      "abayas", ["S","M","L","XL","XXL"], 500, 740),
  row("Double-Layer Lace Insert Abaya",     "عباية بإدخال دانتيل ثنائي الطبقة",    "Opaque underlayer with sheer lace outer panels on the sleeves.",                                                         "abayas", ["S","M","L","XL"],       580, 860),
  row("Cocoon-Cut Charcoal Abaya",          "عباية كوكون جاري",                    "Relaxed cocoon silhouette in charcoal, ideal for modest everyday dressing.",                                             "abayas", ["S","M","L","XL","XXL"], 420, 620),
  row("Minimal White Occasion Abaya",       "عباية مناسبات أبيض مينيمال",          "Crisp white with clean seam detailing. Elevates any formal look.",                                                      "abayas", ["S","M","L","XL"],       550, 820),
  row("Taupe Wrap-Front Abaya",             "عباية فرونت راب توب",                 "Elegant wrap-front closure in warm taupe crepe. Flattering for all body types.",                                         "abayas", ["S","M","L","XL","XXL"], 480, 700),
  row("Ruffle Cuff Black Abaya",            "عباية كف رافل أسود",                  "Classic closed abaya with cascading ruffle cuffs — perfect for weddings.",                                               "abayas", ["S","M","L","XL"],       540, 780),
  row("Jersey Everyday Open Abaya",         "عباية يومي مفتوحة جيرسي",             "Soft stretch-jersey open abaya for all-day comfort.",                                                                    "abayas", ["S","M","L","XL","XXL"], 320, 480),
  row("Velvet Panel Evening Abaya",         "عباية سهرة بانيل مخمل",               "Black crepe abaya with velvet inset panels on the chest and sleeves.",                                                  "abayas", ["S","M","L","XL"],       750, 1100),
  row("Scallop Hem Open Abaya",             "عباية مفتوحة هيم سكالوب",             "Delicate scallop-cut hem in midnight navy chiffon.",                                                                    "abayas", ["S","M","L","XL","XXL"], 460, 680),
  row("Oversized Maxi Abaya — Mink",        "عباية ماكسي أوفرسايزد مينك",          "Ultra-relaxed silhouette in soft mink-grey nida.",                                                                      "abayas", ["S","M","L","XL"],       400, 580),
  row("Structured Shoulder Abaya",          "عباية بأكتاف منظمة",                  "Power-shoulder cut for a fashion-forward modest look.",                                                                  "abayas", ["S","M","L","XL","XXL"], 620, 920),
  row("Embossed Velvet Abaya — Burgundy",   "عباية مخمل مضغوط بورجوندي",           "All-over embossed velvet in deep burgundy.",                                                                            "abayas", ["S","M","L","XL"],       820, 1200),
  row("Cape Sleeve Abaya — Champagne",      "عباية كيب سليف شامبين",               "Dramatic cape-style sleeves in champagne chiffon over satin lining.",                                                  "abayas", ["S","M","L","XL","XXL"], 700, 1050),
  row("Minimalist Side-Pocket Abaya",       "عباية مينيمال بجيوب جانبية",          "Clean-cut black abaya with hidden side pockets — practicality meets modesty.",                                          "abayas", ["S","M","L","XL"],       380, 560),
  row("Sequin-Trim Occasion Abaya",         "عباية مناسبات بتريم سيكوين",          "Simple silhouette elevated by tonal sequin trim on hem and cuffs.",                                                    "abayas", ["S","M","L","XL","XXL"], 850, 1250),
  row("Relaxed Linen Abaya — Stone",        "عباية لينن ريلاكسد ستون",             "Breathable 100% linen in warm stone — perfect for summer.",                                                             "abayas", ["S","M","L","XL"],       450, 660),
  row("Zip-Cuff Sport Abaya — Black",       "عباية سبورت كف زيب أسود",             "Performance-fabric abaya with zip cuffs and moisture-wicking lining.",                                                 "abayas", ["S","M","L","XL","XXL"], 520, 760),
  row("Tuxedo-Front Abaya — Black",         "عباية فرونت تاكسيدو أسود",            "Sharp lapel detailing gives a tuxedo effect on a classic abaya cut.",                                                  "abayas", ["S","M","L","XL"],       640, 940),
  row("Chiffon Layered Modest Abaya",       "عباية شيفون متعددة الطبقات",          "Three sheer chiffon layers over full-coverage satin lining.",                                                           "abayas", ["S","M","L","XL","XXL"], 600, 880),
  row("Patterned Jacquard Abaya — Gold",    "عباية جاكار ذهبي",                    "Woven jacquard fabric with subtle gold pattern — luxurious modest wear.",                                               "abayas", ["S","M","L","XL"],       920, 1350),
  row("Casual Knit-Panel Abaya",            "عباية بانيل نيت كاجوال",              "Hybrid abaya blending woven body with ribbed knit sleeves.",                                                            "abayas", ["S","M","L","XL","XXL"], 480, 700),
  row("Wide-Sleeve Open Abaya — Ecru",      "عباية مفتوحة كم واسع إيكرو",          "Statement wide sleeves in off-white ecru for a clean, minimal aesthetic.",                                             "abayas", ["S","M","L","XL"],       440, 640),
  row("Draped Asymmetric Abaya",            "عباية أسيمتريك دريبد",                "Asymmetric draped front creates a sculptural silhouette.",                                                              "abayas", ["S","M","L","XL","XXL"], 680, 1000),
  row("Button-Through Casual Abaya",        "عباية كاجوال بأزرار كاملة",           "Full-length button-through in soft cotton-blend — easy and modern.",                                                    "abayas", ["S","M","L","XL"],       360, 520),
  row("Organza Occasion Abaya — Blush",     "عباية مناسبات أورجانزا بلاش",         "Sheer organza overlay in blush over fitted inner lining.",                                                              "abayas", ["S","M","L","XL","XXL"], 780, 1150),
  row("Monochrome Piping Abaya — Black",    "عباية مونوكروم بيبينج أسود",          "Tonal black with contrast stitched piping detailing throughout.",                                                       "abayas", ["S","M","L","XL"],       460, 680),

  // ── ISDALS (20) ────────────────────────────────────────────────────────────
  row("Classic Nida Isdal — Black",         "إسدال نيدا كلاسيك أسود",              "Two-layer isdal in opaque black nida. Everyday essential.",                                                              "isdals", ["One Size"], 200, 300),
  row("Chiffon Isdal — Charcoal",           "إسدال شيفون جاري",                    "Sheer chiffon isdal over matching satin inner. Lightweight and elegant.",                                               "isdals", ["One Size"], 280, 420),
  row("Floral Print Isdal — Navy",          "إسدال مطبوع ورود نيفي",               "Delicate floral print on navy chiffon — adds personality to modest outfits.",                                           "isdals", ["One Size"], 300, 460),
  row("Shimmer Gold-Woven Isdal",           "إسدال بخيوط ذهبية شيمر",             "Subtle gold lurex threads woven into soft chiffon.",                                                                    "isdals", ["One Size"], 450, 680),
  row("Lace-Hem Ivory Isdal",              "إسدال آيفوري بهيم دانتيل",            "Ivory satin-backed isdal with intricate lace scallop hem.",                                                            "isdals", ["One Size"], 360, 540),
  row("Velvet Isdal — Burgundy",            "إسدال مخمل بورجوندي",                 "Crushed velvet isdal in deep burgundy for evening occasions.",                                                          "isdals", ["One Size"], 420, 640),
  row("Micro-Pleated Isdal — Blush",        "إسدال مايكرو بليتد بلاش",             "Permanently micro-pleated chiffon in blush pink — elegant movement.",                                                  "isdals", ["One Size"], 340, 500),
  row("Embroidered Border Isdal — White",   "إسدال حدود مطرزة أبيض",               "White nida isdal with delicate embroidered border along the hem.",                                                     "isdals", ["One Size"], 420, 640),
  row("Two-Tone Isdal — Black & Navy",      "إسدال ثنائي اللون أسود ونيفي",        "Gradient two-tone isdal blending black and deep navy.",                                                                 "isdals", ["One Size"], 300, 460),
  row("Stretch Jersey Isdal — Black",       "إسدال جيرسي ستريتش أسود",             "Soft stretch-jersey isdal for comfortable everyday wear.",                                                              "isdals", ["One Size"], 180, 280),
  row("Organza Occasion Isdal — Champagne","إسدال أورجانزا مناسبات شامبين",        "Luxe champagne organza isdal for formal occasions.",                                                                    "isdals", ["One Size"], 500, 750),
  row("Printed Isdal — Geometric Black",    "إسدال مطبوع جيومتريك أسود",           "Subtle geometric print on sheer black chiffon.",                                                                        "isdals", ["One Size"], 280, 420),
  row("Satin-Back Isdal — Slate Grey",      "إسدال بطانة ساتان رمادي سليت",        "Satin-lined isdal in slate grey chiffon.",                                                                              "isdals", ["One Size"], 320, 480),
  row("Pearl-Edge Isdal — Nude",            "إسدال حافة لؤلؤ نود",                 "Nude-toned isdal with tiny pearl trim along edges.",                                                                    "isdals", ["One Size"], 380, 580),
  row("Ombre Isdal — Lavender to White",    "إسدال أومبري لافندر لأبيض",           "Soft gradient from lavender to white in sheer chiffon.",                                                               "isdals", ["One Size"], 380, 580),
  row("Sequin Scattered Isdal — Black",     "إسدال بترتر متناثر أسود",             "Scattered micro-sequins on sheer black for subtle shimmer.",                                                            "isdals", ["One Size"], 460, 700),
  row("Linen Isdal — Natural",              "إسدال لينن ناتورال",                  "100% linen isdal in natural undyed tone — minimal and breathable.",                                                    "isdals", ["One Size"], 280, 420),
  row("Pintuck Detail Isdal — White",       "إسدال بينتاك وايت",                   "Delicate pintuck details along the front panel.",                                                                       "isdals", ["One Size"], 340, 520),
  row("Maxi Isdal — Forest Green",          "إسدال ماكسي أخضر غابات",              "Deep forest green in a generous floor-sweeping length.",                                                               "isdals", ["One Size"], 360, 540),
  row("Crinkle Chiffon Isdal — Rose Gold",  "إسدال شيفون كرينكل روز جولد",         "Permanently crinkled chiffon in rose gold tones.",                                                                     "isdals", ["One Size"], 400, 600),

  // ── DRESSES (40) ───────────────────────────────────────────────────────────
  row("Linen Maxi Dress — Warm Sand",       "فستان ماكسي لينن رملي",               "100% linen maxi with side slit and relaxed silhouette.",                                                                "dresses", ["XS","S","M","L","XL"],  550, 820),
  row("Bias-Cut Satin Slip — Black",        "فستان ساتان بياس كت أسود",            "Classic bias-cut slip dress in premium satin with thin straps.",                                                        "dresses", ["XS","S","M","L"],      480, 720),
  row("Smocked Broderie Midi",              "فستان بروديري ميدي سموكد",             "Broderie anglaise with elasticated smocked bodice.",                                                                    "dresses", ["XS","S","M","L","XL"],  620, 920),
  row("Oversized Shirt Dress — Khaki",      "فستان شيرت أوفرسايزد كاكي",           "Relaxed oversized shirt dress in washed cotton khaki.",                                                                 "dresses", ["XS","S","M","L","XL"],  500, 760),
  row("Ribbed Knit Midi — Ivory",           "فستان نيت ريبد ميدي آيفوري",          "Fitted ribbed knit midi in ivory.",                                                                                     "dresses", ["XS","S","M","L"],      580, 860),
  row("Tiered Maxi — Terracotta",           "فستان ماكسي تيرد تراكوتا",            "Three-tiered full maxi in terracotta linen.",                                                                           "dresses", ["XS","S","M","L","XL"],  640, 960),
  row("Knife-Pleat Midi — Dusty Blush",     "فستان ميدي بليتد داستي بلاش",         "Knife-pleated midi skirt silhouette in muted blush.",                                                                   "dresses", ["XS","S","M","L","XL"],  600, 900),
  row("Denim Raw-Hem Mini",                 "فستان ميني جينز خام الهيم",            "Raw-hem denim mini with patch pockets and relaxed fit.",                                                                "dresses", ["XS","S","M","L"],      480, 720),
  row("Corset-Bodice Maxi — Cream",         "فستان ماكسي كورست كريم",              "Boned corset bodice with a flowing A-line maxi skirt.",                                                                 "dresses", ["XS","S","M","L"],      780, 1150),
  row("Gingham Smock Mini",                 "فستان ميني سموك جينجام",               "Classic gingham check smocked mini — playful and feminine.",                                                            "dresses", ["XS","S","M"],         400, 600),
  row("Double-Breasted Blazer Dress",       "فستان بليزر دبل بريستد",              "Power blazer dress in cream suiting fabric.",                                                                           "dresses", ["XS","S","M","L","XL"],  820, 1200),
  row("Halter Neck Draped Maxi",            "فستان ماكسي هالتر نيك دريبد",          "Draped halter-neck maxi in deep jewel green.",                                                                         "dresses", ["XS","S","M","L"],      640, 960),
  row("Off-Shoulder Ruched Mini — Black",   "فستان ميني رتشد أوف شولدر أسود",      "Ruched off-shoulder mini in stretch jersey.",                                                                           "dresses", ["XS","S","M","L"],      480, 720),
  row("Asymmetric Draped Midi",             "فستان ميدي دريبد أسيمتريك",           "One-shoulder asymmetric draped midi in ivory crepe.",                                                                  "dresses", ["XS","S","M","L","XL"],  680, 1020),
  row("Balloon-Sleeve Jacquard Midi",       "فستان ميدي جاكار بالون سليف",         "Statement balloon sleeves in floral jacquard.",                                                                         "dresses", ["XS","S","M","L","XL"],  750, 1100),
  row("Ruffle-Hem Sage Midi",               "فستان ميدي سيج بهيم رافل",            "Tiered ruffle hem midi in dusty sage.",                                                                                 "dresses", ["XS","S","M","L","XL"],  560, 840),
  row("Crochet Open-Weave Maxi",            "فستان ماكسي كروشيه أوبن ويف",         "Artisan crochet open-weave over full-length lining.",                                                                  "dresses", ["S","M","L","XL"],      720, 1080),
  row("Printed Wrap Mini — Tropical",       "فستان ميني راب مطبوع تروبيكال",       "Vibrant tropical print wrap mini with adjustable tie.",                                                                 "dresses", ["XS","S","M","L"],      460, 700),
  row("Co-Ord Shirt & Wide-Leg Set",        "طقم شيرت وبنطلون وايد ليج كو-أورد",   "Matching oversized shirt and wide-leg trousers in linen.",                                                              "dresses", ["S","M","L","XL"],      900, 1350),
  row("Velvet Midi Dress — Midnight",       "فستان ميدي مخمل ميدنايت",             "Figure-hugging velvet midi in midnight navy.",                                                                          "dresses", ["XS","S","M","L"],      680, 1020),
  row("Lace-Insert Slip Dress — Blush",     "فستان سليب بإدخال دانتيل بلاش",       "Satin slip with delicate lace insert panels.",                                                                          "dresses", ["XS","S","M","L"],      520, 780),
  row("Square-Neck Bodycon — Black",        "فستان بودي كون سكوير نيك أسود",       "Square neckline bodycon in thick ponte.",                                                                               "dresses", ["XS","S","M","L","XL"],  480, 720),
  row("Shirred Maxi — Cobalt Blue",         "فستان ماكسي شيرد كوبالت",             "All-over shirring in vibrant cobalt blue.",                                                                             "dresses", ["XS","S","M","L","XL"],  580, 860),
  row("High-Low Hem Midi — White",          "فستان ميدي هاي لو أبيض",              "Asymmetric high-low hem in crisp white cotton.",                                                                        "dresses", ["XS","S","M","L"],      520, 780),
  row("Puff-Shoulder Midi — Lilac",         "فستان ميدي بوف شولدر ليلك",           "Puff-shoulder statement midi in lilac organza.",                                                                        "dresses", ["XS","S","M","L"],      640, 960),
  row("Wrap Maxi — Warm Print",             "فستان ماكسي راب برينت دافئ",          "Floral wrap maxi in warm earth-tone print.",                                                                            "dresses", ["S","M","L","XL"],      600, 900),
  row("Strapless Bandeau Maxi — Black",     "فستان ماكسي باندو أسود",              "Sleek strapless bandeau maxi in scuba fabric.",                                                                         "dresses", ["XS","S","M","L"],      680, 1020),
  row("Poplin Shirt Dress — Sky Blue",      "فستان شيرت بوبلين سكاي بلو",          "Crisp cotton poplin shirt dress in sky blue.",                                                                          "dresses", ["XS","S","M","L","XL"],  460, 700),
  row("Sequin Mini Dress — Champagne",      "فستان ميني سيكوين شامبين",            "All-over sequin mini for nights out.",                                                                                  "dresses", ["XS","S","M","L"],      780, 1150),
  row("Cut-Out Waist Midi — Camel",         "فستان ميدي كات آوت وايست كاميل",      "Elegant cut-out waist detail in camel crepe.",                                                                         "dresses", ["XS","S","M","L"],      620, 940),
  row("Seersucker Midi — Sage",             "فستان ميدي سيرساكر سيج",              "Textured seersucker in dusty sage.",                                                                                    "dresses", ["XS","S","M","L","XL"],  500, 760),
  row("Feather-Trim Maxi — Black",          "فستان ماكسي تريم ريش أسود",           "Dramatic feather hem trim on flowing black maxi.",                                                                      "dresses", ["XS","S","M","L"],      920, 1380),
  row("Tank Maxi Dress — Stone",            "فستان ماكسي تانك ستون",               "Minimalist jersey tank maxi in warm stone.",                                                                            "dresses", ["XS","S","M","L","XL"],  380, 560),
  row("Open-Back Midi — Ivory",             "فستان ميدي أوبن باك آيفوري",          "Elegant open-back midi in ivory satin.",                                                                               "dresses", ["XS","S","M","L"],      700, 1050),
  row("Leather-Look Mini — Black",          "فستان ميني ليذر لوك أسود",            "Faux-leather mini with zip front detail.",                                                                              "dresses", ["XS","S","M","L"],      550, 820),
  row("Kaftan Maxi Dress — Emerald",        "فستان كافتان ماكسي زمردي",            "Relaxed kaftan silhouette in rich emerald.",                                                                            "dresses", ["S","M","L","XL"],      650, 980),
  row("Tie-Front Midi — Yellow",            "فستان ميدي تاي فرونت أصفر",           "Sunny yellow midi with knotted tie front.",                                                                             "dresses", ["XS","S","M","L","XL"],  480, 720),
  row("Floral Burnout Velvet Midi",         "فستان ميدي مخمل بيرناوت ورود",        "Semi-sheer burnout velvet in floral pattern.",                                                                          "dresses", ["XS","S","M","L"],      780, 1150),
  row("Crepe Shift Dress — Chocolate",      "فستان شيفت كريب شوكولاتة",            "Clean shift silhouette in rich chocolate crepe.",                                                                       "dresses", ["XS","S","M","L","XL"],  520, 780),
  row("Pintuck Maxi — Dusty Rose",          "فستان ماكسي بينتاك داستي روز",        "Delicate pintuck detailing throughout in dusty rose.",                                                                  "dresses", ["XS","S","M","L","XL"],  600, 900),

  // ── T-SHIRTS & HOODIES (45) ────────────────────────────────────────────────
  row("Heavyweight Boxy Tee — Jet Black",   "تيشيرت بوكسي هيفي وايت أسود",        "260 GSM preshrunk cotton boxy tee. True drop-shoulder silhouette.",                                                     "tshirts", ["XS","S","M","L","XL","XXL"], 200, 320),
  row("Essential White Tee — 200GSM",       "تيشيرت أبيض أساسي 200 جي إس إم",     "200 GSM ringspun cotton, true to size. A wardrobe essential.",                                                          "tshirts", ["XS","S","M","L","XL"],      160, 260),
  row("Oversized Logo Tee — Ecru",          "تيشيرت لوجو أوفرسايزد إيكرو",        "Giant chest logo on ecru heavyweight cotton.",                                                                          "tshirts", ["S","M","L","XL","XXL"],      240, 380),
  row("Washed Black Vintage Tee",           "تيشيرت فينتاج أسود ووشد",             "Acid-washed black with authentic vintage feel.",                                                                        "tshirts", ["XS","S","M","L"],           190, 300),
  row("Drop-Shoulder Striped Tee",          "تيشيرت مخطط درب شولدر",               "Wide stripe pattern with drop shoulder cut.",                                                                           "tshirts", ["S","M","L","XL"],           220, 360),
  row("Mock-Neck Premium Tee — Black",      "تيشيرت موك نيك بريميم أسود",          "Fitted mock-neck in 240 GSM black cotton.",                                                                             "tshirts", ["XS","S","M","L","XL"],      230, 360),
  row("Embroidered Script Tee — White",     "تيشيرت سكريبت مطرز أبيض",            "Tonal embroidered script logo on premium white cotton.",                                                               "tshirts", ["S","M","L","XL"],           280, 440),
  row("Vintage Wash Tee — Sage",            "تيشيرت فينتاج واش سيج",               "Garment-dyed sage green with faded finish.",                                                                            "tshirts", ["XS","S","M","L","XL"],      210, 340),
  row("Cropped Boxy Tee — Cream",           "تيشيرت بوكسي كروبد كريم",             "Cropped boxy in cream — pairs with high-waist everything.",                                                            "tshirts", ["XS","S","M"],               200, 320),
  row("Rib Knit Tee — Olive",               "تيشيرت ريب نيت أوليف",                "Ribbed knit structure in earthy olive.",                                                                                "tshirts", ["XS","S","M","L"],           210, 330),
  row("Split-Hem Long Tee — Charcoal",      "تيشيرت طويل سبليت هيم جاري",          "Extended length with side splits in charcoal.",                                                                         "tshirts", ["S","M","L","XL"],           220, 350),
  row("Paint-Splash Graphic Tee",           "تيشيرت جرافيك بينت سبلاش",            "Artistic paint-splash graphic on 240 GSM white.",                                                                      "tshirts", ["S","M","L","XL"],           260, 420),
  row("Baseball Raglan Tee — B&W",          "تيشيرت راجلان بيسبول أبيض وأسود",     "Contrast raglan sleeves in classic black and white.",                                                                  "tshirts", ["XS","S","M","L","XL"],      230, 360),
  row("Slub Cotton Tee — Sand",             "تيشيرت سلاب كوتون رملي",              "Textured slub cotton weave in warm sand.",                                                                              "tshirts", ["S","M","L","XL","XXL"],      200, 320),
  row("Thermal Waffle Tee — Ecru",          "تيشيرت ثيرمال وافل إيكرو",            "Long-sleeve waffle-knit thermal in off-white ecru.",                                                                   "tshirts", ["S","M","L","XL"],           280, 440),
  row("Tie-Dye Oversized Tee — Pastel",     "تيشيرت أوفرسايزد تاي داي باستيل",     "Hand tie-dye in soft pastel colourway on heavyweight cotton.",                                                         "tshirts", ["S","M","L","XL"],           270, 420),
  row("Distressed Graphic Tee — Black",     "تيشيرت جرافيك ديسترسد أسود",          "Distressed print effect on 260 GSM black.",                                                                             "tshirts", ["S","M","L","XL"],           250, 400),
  row("Burnout Velvet Tee — Burgundy",      "تيشيرت بيرناوت مخمل بورجوندي",        "Semi-sheer burnout velvet in deep burgundy.",                                                                           "tshirts", ["XS","S","M","L"],           300, 480),
  row("Racing Stripe Tee — Black",          "تيشيرت ريسينج سترايب أسود",           "Contrast white racing stripe across the chest.",                                                                        "tshirts", ["S","M","L","XL"],           240, 380),
  row("Long-Line Tee — Slate Grey",         "تيشيرت لونج لاين سليت جري",           "Extended hem in slate grey — pairs with shorts or jeans.",                                                             "tshirts", ["S","M","L","XL"],           220, 350),
  row("Pocket Tee — Washed Navy",           "تيشيرت جيب نيفي ووشد",                "Washed navy with vintage chest pocket.",                                                                                "tshirts", ["S","M","L","XL","XXL"],      180, 280),
  row("Quarter-Zip Mock Neck Tee",          "تيشيرت كوارتر زيب موك نيك",           "Quarter-zip closure in premium cotton jersey.",                                                                         "tshirts", ["S","M","L","XL","XXL"],      290, 460),
  row("Boxy Polo Tee — White",              "تيشيرت بولو بوكسي أبيض",              "Oversized polo with ribbed collar in clean white.",                                                                     "tshirts", ["S","M","L","XL"],           290, 460),
  row("Classic V-Neck Tee — Black",         "تيشيرت في-نيك كلاسيك أسود",           "Clean V-neck in 200 GSM black cotton.",                                                                                "tshirts", ["XS","S","M","L","XL"],      170, 270),
  row("Scoop Neck Tee — Lavender",          "تيشيرت سكووب نيك لافندر",             "Wide scoop neck in soft lavender cotton.",                                                                              "tshirts", ["XS","S","M","L"],           190, 300),
  row("Essential Pullover Hoodie — Black",   "هودي بولوفر أساسي أسود",             "500 GSM fleece-lined pullover. The heavyweight standard.",                                                              "tshirts", ["S","M","L","XL","XXL"],      500, 780),
  row("Boxy Zip Hoodie — Charcoal",          "هودي بوكسي زيب جاري",                "Full-zip boxy cut in charcoal fleece.",                                                                                 "tshirts", ["S","M","L","XL"],           540, 820),
  row("Washed Crewneck Sweatshirt",          "سويتشيرت كرو نيك ووشد",              "Acid-wash crewneck with dropped shoulders.",                                                                            "tshirts", ["S","M","L","XL","XXL"],      420, 640),
  row("Oversized Hoodie — Ecru",             "هودي أوفرسايزد إيكرو",               "Extremely oversized premium hoodie in ecru.",                                                                           "tshirts", ["XS","S","M","L","XL"],      580, 880),
  row("Vintage Crewneck — Warm Brown",       "سويتشيرت فينتاج بني دافئ",           "Vintage-washed crewneck in warm brown fleece.",                                                                         "tshirts", ["S","M","L","XL"],           440, 680),
  row("Embroidered Chest Hoodie — Black",    "هودي صدر مطرز أسود",                 "Tonal chest embroidery on 480 GSM black hoodie.",                                                                       "tshirts", ["S","M","L","XL","XXL"],      650, 980),
  row("Half-Zip Brushed Sweatshirt",         "سويتشيرت هاف زيب برشد",              "Cosy half-zip in brushed fleece.",                                                                                      "tshirts", ["S","M","L","XL"],           500, 760),
  row("Graphic Print Hoodie — Distressed",   "هودي جرافيك برينت ديسترسد",          "All-over distressed print on 460 GSM hoodie.",                                                                         "tshirts", ["S","M","L","XL"],           580, 880),
  row("Heavyweight Crewneck — Sand",         "سويتشيرت هيفي وايت رملي",            "600 GSM heavyweight crewneck in sand.",                                                                                 "tshirts", ["S","M","L","XL","XXL"],      620, 940),
  row("Drop-Hem Hoodie — Slate",             "هودي درب هيم سليت",                  "Extended drop-hem silhouette in slate fleece.",                                                                         "tshirts", ["S","M","L","XL"],           540, 820),
  row("Logo-Tape Zip Hoodie",               "هودي لوجو تيب زيب",                   "Woven logo tape detail on full-zip hoodie.",                                                                            "tshirts", ["S","M","L","XL","XXL"],      600, 900),
  row("Dyed Fleece Crewneck — Olive",        "سويتشيرت فليس مصبوغ أوليف",          "Garment-dyed fleece crewneck in earthy olive.",                                                                         "tshirts", ["S","M","L","XL"],           480, 740),
  row("Ribbed Cuff Hoodie — White",          "هودي كف ريبد أبيض",                  "Clean white hoodie with double-ribbed cuffs.",                                                                         "tshirts", ["S","M","L","XL","XXL"],      520, 800),
  row("Side-Zip Pocket Hoodie — Black",      "هودي جيوب سايد زيب أسود",            "Side zip pockets on relaxed boxy black hoodie.",                                                                       "tshirts", ["S","M","L","XL"],           560, 860),
  row("Washed Sage Crewneck",                "سويتشيرت كرو نيك سيج ووشد",          "Garment-dyed sage green fleece crewneck.",                                                                              "tshirts", ["XS","S","M","L","XL"],      440, 680),
  row("Reflective Print Hoodie — Black",     "هودي برينت ريفليكتيف أسود",           "Reflective logo print on heavyweight black hoodie.",                                                                   "tshirts", ["S","M","L","XL","XXL"],      680, 1020),
  row("Premium Zip Hoodie — Navy",           "هودي زيب بريميم نيفي",               "Premium fleece full-zip in classic navy.",                                                                              "tshirts", ["S","M","L","XL"],           580, 880),
  row("Bleached Hoodie — Denim Wash",        "هودي بليشد دينيم واش",               "Denim-style bleach wash on grey hoodie.",                                                                               "tshirts", ["S","M","L","XL","XXL"],      540, 820),
  row("Split-Hem Crewneck — Stone",          "سويتشيرت كرو نيك سبليت هيم ستون",    "Extended split-hem crewneck in warm stone.",                                                                            "tshirts", ["S","M","L","XL"],           480, 740),

  // ── PANTS (30) ─────────────────────────────────────────────────────────────
  row("Wide-Leg Linen Trousers — Camel",    "بنطلون وايد ليج لينن كاميل",          "High-waist wide-leg trousers in 100% linen camel.",                                                                     "pants", ["XS","S","M","L","XL"],  480, 720),
  row("Cargo Pants — Washed Olive",         "بنطلون كارجو أوليف ووشد",             "Relaxed cargo pants with 6 pockets in washed olive.",                                                                  "pants", ["S","M","L","XL","XXL"], 520, 800),
  row("Raw-Hem Straight Jeans",             "جينز ستريت لاين خام الهيم",           "Japanese raw selvedge denim in straight cut.",                                                                          "pants", ["XS","S","M","L","XL"],  620, 950),
  row("Track Pants — Black",                "تراك بانتس أسود",                     "Relaxed track pants with double side stripe.",                                                                          "pants", ["S","M","L","XL","XXL"], 380, 560),
  row("Crisp White Linen Trousers",         "بنطلون لينن أبيض ناصع",               "Tailored white linen trousers — perfect for summer.",                                                                  "pants", ["XS","S","M","L","XL"],  420, 640),
  row("Premium Marl Joggers",               "جوجر بانتس مارل بريميم",              "480 GSM marl fleece joggers with ribbed cuffs.",                                                                        "pants", ["S","M","L","XL","XXL"], 360, 540),
  row("Slim-Fit Tailored Trousers — Navy",  "بنطلون تيلورد سليم فيت نيفي",         "Slim-cut suiting trousers in navy.",                                                                                   "pants", ["XS","S","M","L","XL"],  560, 840),
  row("Nylon Parachute Pants",              "بنطلون باراشوت نايلون",               "Wide-leg nylon parachute pants with elastic waist and cuffs.",                                                         "pants", ["S","M","L","XL"],       480, 720),
  row("Bleached Denim Shorts",              "شورت جينز بليشد",                     "Raw-hem denim shorts in beach-bleach finish.",                                                                          "pants", ["XS","S","M","L"],       320, 480),
  row("Cream High-Waist Pleated Shorts",    "شورت بليتد هاي وايست كريم",           "Tailored knife-pleat shorts in cream.",                                                                                "pants", ["XS","S","M","L","XL"],  360, 540),
  row("Matte Black Biker Shorts",           "شورت بايكر مات أسود",                 "High-waist compression biker shorts in matte black.",                                                                  "pants", ["XS","S","M","L"],       280, 420),
  row("Green Tartan Wide-Leg Trousers",     "بنطلون وايد ليج تارتان أخضر",         "Forest green tartan plaid wide-leg trousers.",                                                                         "pants", ["XS","S","M","L","XL"],  550, 820),
  row("Satin Slip Trousers — Champagne",    "بنطلون ساتان سليب شامبين",            "Fluid satin trousers in champagne.",                                                                                   "pants", ["XS","S","M","L"],       480, 720),
  row("Denim Wide-Leg — Light Wash",        "جينز وايد ليج لايت واش",              "Light-wash wide-leg denim.",                                                                                           "pants", ["XS","S","M","L","XL"],  520, 780),
  row("Linen-Blend Palazzo Pants",          "بنطلون بالاتزو لينن بليند",            "Ultra-wide palazzo in linen-viscose blend.",                                                                           "pants", ["XS","S","M","L","XL"],  440, 660),
  row("Velvet Flared Trousers — Midnight",  "بنطلون فلير مخمل ميدنايت",            "70s-inspired velvet flare in midnight navy.",                                                                           "pants", ["XS","S","M","L"],       600, 900),
  row("Chino Joggers — Stone",              "جوجر شينو ستون",                      "Tapered chino-style jogger in warm stone.",                                                                             "pants", ["S","M","L","XL","XXL"], 380, 580),
  row("Leather-Look Skinny Pants",          "بنطلون سكيني ليذر لوك",               "Faux-leather skinny trousers with side zip.",                                                                          "pants", ["XS","S","M","L"],       520, 780),
  row("Pintuck Wide Trousers — Ivory",      "بنطلون وايد بينتاك آيفوري",           "Tailored ivory trousers with pintuck detailing.",                                                                      "pants", ["XS","S","M","L","XL"],  540, 820),
  row("Knit Ribbed Flare Pants — Black",    "بنطلون فلير ريب نيت أسود",            "Stretch ribbed knit flare — comfortable and stylish.",                                                                  "pants", ["XS","S","M","L"],       460, 700),
  row("Paper-Bag Waist Trousers — Camel",   "بنطلون باير باج وايست كاميل",         "Paper-bag waist with self-tie belt in camel.",                                                                         "pants", ["XS","S","M","L","XL"],  480, 720),
  row("Cuffed Cargo Shorts — Khaki",        "شورت كارجو كافد كاكي",                "Cuffed hem cargo shorts in stone khaki.",                                                                               "pants", ["S","M","L","XL"],       320, 480),
  row("Striped Trousers — Black & White",   "بنطلون مخطط أسود وأبيض",              "Bold vertical stripe trousers in black and white.",                                                                    "pants", ["XS","S","M","L","XL"],  500, 760),
  row("Denim Barrel-Leg Jeans",             "جينز باريل ليج",                      "On-trend barrel-leg silhouette in mid-blue denim.",                                                                    "pants", ["XS","S","M","L","XL"],  580, 880),
  row("Organza Overlay Trousers",           "بنطلون أورجانزا أوفرلاي",             "Wide-leg trousers with sheer organza overlay.",                                                                        "pants", ["XS","S","M","L"],       640, 960),
  row("Performance Dry-Fit Leggings",       "ليجنز دراي فيت بيرفورمنس",            "High-waist 4-way stretch leggings for sport and athleisure.",                                                          "pants", ["XS","S","M","L"],       280, 420),
  row("Velour Tracksuit Pants — Dusty Pink","بنطلون تراكسوت فيلور داستي بينك",     "Soft velour tracksuit pants in dusty pink.",                                                                           "pants", ["S","M","L","XL"],       380, 580),
  row("Structured Mom Jeans — Dark Wash",   "جينز موم ستركتشرد داك واش",           "High-rise structured mom jeans in dark wash.",                                                                         "pants", ["XS","S","M","L","XL"],  540, 820),
  row("Plisse Flare Trousers — Champagne",  "بنطلون بليسيه فلير شامبين",           "Permanently pleated plisse in champagne.",                                                                              "pants", ["XS","S","M","L"],       560, 840),
  row("Knit Maxi Skirt — Charcoal",         "تنورة ماكسي نيت جاري",               "Ribbed knit maxi skirt in charcoal.",                                                                                  "pants", ["XS","S","M","L","XL"],  420, 640),

  // ── SNEAKERS (30) ──────────────────────────────────────────────────────────
  row("Minimalist Leather Low-Top",         "سنيكر جلد مينيمال لو توب",            "Full-grain leather upper, cupsole, clean white.",                                                                       "sneakers", ["36","37","38","39","40","41","42"], 900, 1380),
  row("Classic White Canvas Hi-Top",        "سنيكر كانفاس كلاسيك هاي توب أبيض",   "Heritage canvas hi-top in clean white.",                                                                               "sneakers", ["36","37","38","39","40","41","42","43"], 480, 720),
  row("Chunky Platform Sneaker — Black",    "سنيكر بلاتفورم شانكي أسود",           "Track-sole platform with layered sole unit.",                                                                           "sneakers", ["36","37","38","39","40","41"], 720, 1100),
  row("90s Retro Runner — Cream",           "سنيكر ريترو 90s كريم",                "90s dad silhouette in cream with contrast panels.",                                                                    "sneakers", ["36","37","38","39","40","41","42"], 780, 1180),
  row("Slip-On Canvas — Off White",         "سنيكر كانفاس سليب أون أوف وايت",     "Elastic gore slip-on in off-white canvas.",                                                                             "sneakers", ["36","37","38","39","40","41"], 380, 580),
  row("High-Top Canvas — Crimson Red",      "سنيكر هاي توب كانفاس أحمر",           "Classic high-top in bold crimson.",                                                                                    "sneakers", ["36","37","38","39","40","41","42"], 520, 780),
  row("Premium Suede Low-Top — Caramel",    "سنيكر سويد لو توب كراميل بريميم",     "Nubuck suede upper in warm caramel.",                                                                                  "sneakers", ["36","37","38","39","40","41"], 720, 1080),
  row("Engineered Knit Runner — Charcoal",  "سنيكر ران نيت جاري",                  "Seamless knit upper in charcoal with padded collar.",                                                                  "sneakers", ["36","37","38","39","40","41","42"], 800, 1200),
  row("Court Sneaker — Clay White",         "سنيكر كورت كلاي وايت",               "Tennis-court inspiration with heritage detailing.",                                                                    "sneakers", ["36","37","38","39","40","41","42"], 580, 880),
  row("Skate Low — Black/White",            "سنيكر سكيت لو أسود/أبيض",             "Vulcanised cupsole skate-style low-top.",                                                                               "sneakers", ["36","37","38","39","40","41","42","43"], 480, 720),
  row("Leather Platform Lug-Sole",          "سنيكر بلاتفورم لاج سول جلد",          "Premium leather upper on exaggerated lug-sole platform.",                                                             "sneakers", ["36","37","38","39","40","41"], 980, 1480),
  row("Velcro Strap Sneaker — White",       "سنيكر سترابات فيلكرو أبيض",           "Retro velcro strap sneaker in white.",                                                                                 "sneakers", ["36","37","38","39","40","41"], 480, 720),
  row("Monochrome Sneaker — All Black",     "سنيكر مونوكروم أول بلاك",             "All-black monochrome sneaker — upper, lace, sole.",                                                                    "sneakers", ["36","37","38","39","40","41","42"], 580, 880),
  row("Gum-Sole Canvas — Navy",             "سنيكر كانفاس جام سول نيفي",           "Navy canvas low-top with natural gum rubber outsole.",                                                                 "sneakers", ["36","37","38","39","40","41","42"], 420, 640),
  row("Neoprene Sock Sneaker — Black",      "سنيكر سوك نيوبرين أسود",              "Stretch neoprene sock construction for sleek fit.",                                                                    "sneakers", ["36","37","38","39","40","41"], 680, 1020),
  row("Mesh Runner — White/Grey",           "سنيكر رانر ميش وايت/جري",             "Lightweight mesh runner with gradient sole.",                                                                           "sneakers", ["36","37","38","39","40","41","42"], 580, 880),
  row("Stacked-Sole Dad Sneaker — Beige",   "سنيكر داد ستاكد سول بيج",             "Maximalist stacked sole with beige multi-panel upper.",                                                               "sneakers", ["36","37","38","39","40","41","42","43"], 820, 1240),
  row("Satin Lo-Top — Champagne",           "سنيكر لو توب ساتان شامبين",           "Luxe satin upper on minimalist low-top.",                                                                              "sneakers", ["36","37","38","39","40","41"], 680, 1020),
  row("Collaboration-Style Sneaker — Multi","سنيكر كولاب ستايل ملتي",              "Multi-coloured panel upper in collab-drop style.",                                                                     "sneakers", ["36","37","38","39","40","41","42"], 880, 1320),
  row("Trail Sneaker — Khaki",              "سنيكر ترايل كاكي",                    "Hybrid trail sneaker in khaki with textured outsole.",                                                                 "sneakers", ["36","37","38","39","40","41","42"], 680, 1020),
  row("Metallic Sneaker — Silver",          "سنيكر ميتاليك سيلفر",                 "Mirror-finish metallic silver for statement styling.",                                                                  "sneakers", ["36","37","38","39","40","41"], 720, 1080),
  row("Low-Top Sneaker — Olive",            "سنيكر لو توب أوليف",                  "Earthy olive suede low-top.",                                                                                          "sneakers", ["36","37","38","39","40","41","42"], 600, 900),
  row("Perforated Leather Sneaker — White", "سنيكر جلد مثقب أبيض",                "Perforated leather upper for breathability.",                                                                          "sneakers", ["36","37","38","39","40","41"], 820, 1240),
  row("Nylon Tech Sneaker — Black",         "سنيكر تك نايلون أسود",                "Technical nylon upper with reflective details.",                                                                        "sneakers", ["36","37","38","39","40","41","42"], 720, 1080),
  row("Canvas Espadrille Sneaker — Tan",    "سنيكر إسبادريل كانفاس تان",           "Espadrille-style jute sole on canvas upper.",                                                                          "sneakers", ["36","37","38","39","40","41"], 420, 640),
  row("High-Top Leather Boot Sneaker",      "سنيكر هاي توب بوت جلد",              "Mid-height leather sneaker-boot hybrid.",                                                                               "sneakers", ["36","37","38","39","40","41"], 920, 1380),
  row("Clean Court Sneaker — Cream",        "سنيكر كلين كورت كريم",                "Ultra-clean court silhouette in cream leather.",                                                                        "sneakers", ["36","37","38","39","40","41","42"], 680, 1020),
  row("Eco Canvas Sneaker — Natural",       "سنيكر إيكو كانفاس ناتورال",           "Organic cotton canvas with natural rubber sole.",                                                                       "sneakers", ["36","37","38","39","40","41"], 420, 640),
  row("Running Sneaker — Volt/Black",       "سنيكر رانينج فولت/أسود",              "Volt yellow and black performance-inspired runner.",                                                                   "sneakers", ["36","37","38","39","40","41","42"], 680, 1020),
  row("Glitter Hi-Top — Silver",            "سنيكر جليتر هاي توب سيلفر",           "Glitter-coated hi-top for maximum statement.",                                                                          "sneakers", ["36","37","38","39","40","41"], 580, 880),

  // ── HEELS (20) ─────────────────────────────────────────────────────────────
  row("Block-Heel Leather Mule — Camel",    "كعب بلوك جلد ميول كاميل",            "Open-toe block-heel mule in tan leather.",                                                                              "heels", ["36","37","38","39","40"], 500, 760),
  row("Stiletto Pump — Patent Black",       "كعب ستيليتو ببيتنت أسود",             "Classic 10 cm stiletto in glossy patent black.",                                                                       "heels", ["36","37","38","39","40"], 650, 980),
  row("Kitten-Heel Slingback — Nude",       "كعب كيتن سلينجباك نود",               "Elegant 5 cm kitten heel in nude suede.",                                                                               "heels", ["36","37","38","39","40"], 540, 820),
  row("Platform Mary Jane — White",         "ماري جين بلاتفورم أبيض",              "Chunky 6 cm platform Mary Jane in white.",                                                                              "heels", ["36","37","38","39","40"], 600, 920),
  row("Multi-Strap Sandal Heel — Tan",      "كعب صندل سترابي تان",                 "Delicate strapping on 8 cm heel in tan leather.",                                                                      "heels", ["36","37","38","39","40"], 580, 880),
  row("Pointed-Toe Pump — Beige",           "كعب ببامب مؤشر بيج",                  "Pointed toe pump with 9 cm stiletto.",                                                                                 "heels", ["36","37","38","39","40"], 620, 940),
  row("Sculptural Heel Mule — Black",       "كعب سكالبتشرال ميول أسود",            "Square toe mule on architectural sculptural heel.",                                                                    "heels", ["36","37","38","39","40"], 780, 1180),
  row("Ankle-Strap Heeled Sandal — Gold",   "كعب صندل أنكل ستراب ذهبي",           "Metallic gold ankle-strap sandal on 7 cm heel.",                                                                       "heels", ["36","37","38","39","40"], 560, 840),
  row("Clear PVC Heeled Mule",              "كعب ميول PVC شفاف",                   "Transparent PVC upper on a clear lucite block heel.",                                                                  "heels", ["36","37","38","39","40"], 520, 780),
  row("Padded Sock Heel Boot — Black",      "كعب بوت سوك بادد أسود",              "Stretchy padded sock ankle boot on 9 cm heel.",                                                                         "heels", ["36","37","38","39","40"], 780, 1180),
  row("Twist-Knot Toe Sandal Heel",         "كعب صندل تويست نوت",                  "Knotted toe detail on 8 cm strappy heel.",                                                                             "heels", ["36","37","38","39","40"], 600, 900),
  row("Low-Kitten Mule — Cream",            "كعب لو كيتن ميول كريم",               "Barely-there 4 cm kitten mule in cream.",                                                                              "heels", ["36","37","38","39","40"], 480, 720),
  row("Glitter Platform Heel — Silver",     "كعب بلاتفورم جليتر سيلفر",            "Glitter-covered platform and heel in silver.",                                                                         "heels", ["36","37","38","39","40"], 620, 940),
  row("Square-Toe Block Heel — Brown",      "كعب بلوك سكوير تو بني",               "Square toe block heel in cognac brown.",                                                                               "heels", ["36","37","38","39","40"], 560, 840),
  row("Strappy Barely-There Heel",          "كعب سترابي بيرلي ذير",                "Ultra-minimal strapping on 10 cm stiletto.",                                                                           "heels", ["36","37","38","39","40"], 580, 880),
  row("Patent Slingback — Red",             "كعب سلينجباك ببيتنت أحمر",            "Vivid red patent slingback on 8 cm heel.",                                                                             "heels", ["36","37","38","39","40"], 640, 960),
  row("Velvet Heel — Emerald",              "كعب مخمل زمردي",                       "Jewel emerald velvet pump on 9 cm heel.",                                                                              "heels", ["36","37","38","39","40"], 720, 1080),
  row("Minimalist Sandal Heel — Ivory",     "كعب صندل مينيمال آيفوري",             "Single-strap minimalist sandal on clean ivory.",                                                                       "heels", ["36","37","38","39","40"], 500, 760),
  row("Mule with Feather Trim — Black",     "كعب ميول فيذر تريم أسود",             "Fluffy feather trim on the toe of a black mule.",                                                                     "heels", ["36","37","38","39","40"], 780, 1180),
  row("Lug-Sole Chunky Heel Boot",          "كعب بوت شانكي لاج سول",               "Chunky heel ankle boot with lug outsole.",                                                                             "heels", ["36","37","38","39","40"], 820, 1240),

  // ── SLIPPERS (15) ──────────────────────────────────────────────────────────
  row("Faux-Fur Fluffy Slide — Blush",      "شبشب فلافي فوكس فير بلاش",            "Cloud-like faux fur slide in blush pink.",                                                                              "slippers", ["36","37","38","39","40"],      190, 290),
  row("Minimalist Leather Slider — Black",  "شبشب جلد مينيمال أسود",               "Full-grain leather slider with padded insole.",                                                                         "slippers", ["36","37","38","39","40","41"], 240, 380),
  row("Croc-Embossed Mule — Beige",         "ميول إمبوسد كروك بيج",                "Crocodile-embossed leather mule in warm beige.",                                                                        "slippers", ["36","37","38","39","40"],      280, 440),
  row("Velvet Backless Mule — Emerald",     "ميول مخمل باكليس زمردي",              "Plush velvet backless mule in jewel emerald.",                                                                          "slippers", ["36","37","38","39","40"],      320, 500),
  row("Platform EVA Clog — White",          "كلوج بلاتفورم EVA أبيض",              "Chunky EVA platform clog in white.",                                                                                   "slippers", ["36","37","38","39","40","41"], 360, 560),
  row("Fluffy Mule — Coffee Brown",         "ميول فلافي بني كوفي",                  "Faux-fur mule in rich coffee brown.",                                                                                  "slippers", ["36","37","38","39","40"],      200, 320),
  row("Cork-Sole Sandal Slipper — Tan",     "صندل شبشب كورك تان",                   "Cork footbed sandal in tan leather straps.",                                                                           "slippers", ["36","37","38","39","40","41"], 260, 400),
  row("Quilted Leather Mule — Ivory",       "ميول جلد كيلتد آيفوري",               "Quilted leather mule in ivory — luxe lounge look.",                                                                    "slippers", ["36","37","38","39","40"],      380, 580),
  row("Clear Kitten Heel Mule — Crystal",   "ميول كيتن هيل كريستال",               "Transparent PVC kitten-heel mule.",                                                                                    "slippers", ["36","37","38","39","40"],      300, 480),
  row("Pom-Pom Slide — White",              "شبشب بوم بوم وايت",                    "Fluffy pom-pom embellished slide in white.",                                                                           "slippers", ["36","37","38","39","40"],      200, 320),
  row("Memory Foam Loafer Slipper — Grey",  "شبشب لوفر ميموري فوم جري",             "Plush memory foam loafer slipper in grey.",                                                                            "slippers", ["36","37","38","39","40","41"], 220, 360),
  row("Woven Raffia Flat Sandal",           "صندل رافيا منسوجة فلات",               "Hand-woven raffia flat sandal — summer essential.",                                                                    "slippers", ["36","37","38","39","40"],      280, 440),
  row("Suede Backless Mule — Dusty Rose",   "ميول سويد باكليس داستي روز",          "Suede backless mule in dusty rose.",                                                                                   "slippers", ["36","37","38","39","40"],      320, 500),
  row("Metallic Flat Slide — Gold",         "شبشب فلات ميتاليك ذهبي",              "Metallic gold flat slide for a chic finish.",                                                                          "slippers", ["36","37","38","39","40"],      240, 380),
  row("Terry Towelling Slide — Sage",       "شبشب تيري ساج",                        "Soft terry towelling slide in sage green.",                                                                             "slippers", ["36","37","38","39","40"],      160, 260),

  // ── GIRLS' BAGS (35) ───────────────────────────────────────────────────────
  row("Mini Chain Crossbody — Black",       "حقيبة كروس بودي ميني تشين أسود",       "Compact quilted leather crossbody with gold chain strap.",                                                             "girls_bags", ["One Size"], 420, 640),
  row("Large Canvas Tote — Natural",        "توت باج كانفاس لارج ناتورال",          "Heavyweight canvas tote with leather base and handles.",                                                               "girls_bags", ["One Size"], 350, 540),
  row("Gold Metallic Clutch",               "كلتش ميتاليك ذهبي",                    "Pleated metallic gold evening clutch.",                                                                                "girls_bags", ["One Size"], 460, 700),
  row("Leather Bucket Bag — Tan",           "باكيت باج جلد تان",                    "Drawstring bucket bag in full-grain tan leather.",                                                                     "girls_bags", ["One Size"], 620, 940),
  row("Saddle Bag — Cognac",                "سادل باج كونياك",                       "Equestrian-inspired saddle bag in cognac leather.",                                                                    "girls_bags", ["One Size"], 680, 1020),
  row("Clear PVC with Leather Trim",        "حقيبة PVC شفافة بتريم جلد",            "Transparent PVC bag with leather trim — fashion-forward.",                                                             "girls_bags", ["One Size"], 300, 460),
  row("Handwoven Straw Tote — Natural",     "توت باج ستراو منسوجة ناتورال",         "Artisan-woven natural straw tote.",                                                                                    "girls_bags", ["One Size"], 380, 580),
  row("Quilted Caviar Mini — Beige",        "حقيبة كيلتد كافيار ميني بيج",          "Diamond-quilt caviar leather mini bag.",                                                                               "girls_bags", ["One Size"], 850, 1280),
  row("Slouchy Hobo — Camel",               "هوبو باج سلاوشي كاميل",                "Soft slouchy hobo in camel butter leather.",                                                                           "girls_bags", ["One Size"], 640, 960),
  row("Nylon Belt Bag — Olive",             "بيلت باج نايلون أوليف",                "Utility belt bag in water-resistant olive nylon.",                                                                     "girls_bags", ["One Size"], 340, 520),
  row("Structured Top-Handle — Ivory",      "توب هاندل ستركتشرد آيفوري",            "Stiff-structured top-handle bag in ivory leather.",                                                                   "girls_bags", ["One Size"], 720, 1100),
  row("Half-Moon Bag — Brown",              "هاف مون باج بني",                       "Half-moon silhouette in pebbled brown leather.",                                                                      "girls_bags", ["One Size"], 780, 1180),
  row("Oversized Shopper — Black",          "شوبر أوفرسايزد أسود",                  "Roomy faux-leather shopper in jet black.",                                                                             "girls_bags", ["One Size"], 380, 580),
  row("Flap Shoulder Bag — Taupe",          "شولدر باج فلاب توب",                   "Flap-closure shoulder bag in warm taupe.",                                                                             "girls_bags", ["One Size"], 680, 1020),
  row("Hand-Crochet Bag — Ivory",           "حقيبة كروشيه يدوي آيفوري",            "Hand-crocheted natural cotton bag.",                                                                                   "girls_bags", ["One Size"], 460, 700),
  row("Mini Faux-Leather Backpack",         "ميني باكباك فوكس ليذر",               "Compact faux-leather backpack with zip pockets.",                                                                      "girls_bags", ["One Size"], 520, 780),
  row("Bamboo-Handle Raffia Bag",           "حقيبة رافيا هاندل بامبو",              "Rattan raffia bag with bamboo handle.",                                                                               "girls_bags", ["One Size"], 580, 880),
  row("Micro Mini Bag — Silver",            "مايكرو ميني باج سيلفر",               "Ultra-micro metallic silver statement bag.",                                                                           "girls_bags", ["One Size"], 380, 580),
  row("Boho Fringe Crossbody — Brown",      "كروس بودي بوهو فرينج بني",             "Suede crossbody with long fringe detailing.",                                                                          "girls_bags", ["One Size"], 540, 820),
  row("Neoprene Tote — Black",              "توت باج نيوبرين أسود",                 "Structured neoprene tote — sleek and modern.",                                                                         "girls_bags", ["One Size"], 440, 680),
  row("Vintage Camera Bag — Cognac",        "باج كاميرا فينتاج كونياك",             "Small structured camera-style bag in cognac.",                                                                         "girls_bags", ["One Size"], 560, 840),
  row("Woven Leather Crossbody — Beige",    "كروس بودي جلد منسوج بيج",             "Woven leather crossbody with adjustable strap.",                                                                       "girls_bags", ["One Size"], 640, 980),
  row("Drawstring Pouch — Cream Satin",     "باوتش درو سترينج ساتان كريم",          "Satin drawstring pouch bag.",                                                                                          "girls_bags", ["One Size"], 280, 440),
  row("Patchwork Denim Bag",                "حقيبة باتشوورك جينز",                  "Patchwork denim panels in a structured bag.",                                                                          "girls_bags", ["One Size"], 420, 640),
  row("Shell-Shape Clutch — Pearl White",   "كلتش شيل شيب بيرل وايت",             "Pearl-white shell-shaped evening clutch.",                                                                              "girls_bags", ["One Size"], 460, 700),
  row("Maxi Tote — Washed Canvas",          "توت باج ماكسي كانفاس ووشد",           "Oversized washed canvas tote — beach or city.",                                                                        "girls_bags", ["One Size"], 320, 480),
  row("Chain Detail Hobo — Black",          "هوبو باج تشين ديتيل أسود",             "Slouchy hobo with chain link detailing.",                                                                              "girls_bags", ["One Size"], 580, 880),
  row("Suede Flap Mini — Dusty Mauve",      "فلاب ميني سويد داستي مووف",            "Mini flap bag in dusty mauve suede.",                                                                                  "girls_bags", ["One Size"], 640, 960),
  row("Wicker Basket Bag — Natural",        "باج ويكر ناتورال",                      "Hand-woven wicker basket bag — summer icon.",                                                                          "girls_bags", ["One Size"], 360, 560),
  row("Leather Doctor Bag — Black",         "حقيبة دكتور جلد أسود",                "Structured double-handle doctor bag in black.",                                                                        "girls_bags", ["One Size"], 820, 1240),
  row("Embellished Evening Clutch — Gold",  "كلتش سهرة مزخرف ذهبي",               "Jewel-embellished gold-tone evening clutch.",                                                                          "girls_bags", ["One Size"], 680, 1040),
  row("Nylon Packable Backpack — Black",    "باكباك باكيبل نايلون أسود",            "Lightweight packable nylon backpack.",                                                                                  "girls_bags", ["One Size"], 380, 580),
  row("Leather Zip-Around Wallet-Bag",      "والت باج جلد زيب أراوند",              "Zip-around wallet-crossbody hybrid in leather.",                                                                       "girls_bags", ["One Size"], 480, 720),
  row("Ostrich-Effect Mini Bag — Ivory",    "ميني باج أوستريتش إفيكت آيفوري",      "Ostrich-embossed faux leather in ivory.",                                                                              "girls_bags", ["One Size"], 520, 800),
  row("Glossy Patent Shoulder Bag — Red",   "شولدر باج باتنت جلوسي أحمر",          "High-gloss patent shoulder bag in vivid red.",                                                                         "girls_bags", ["One Size"], 580, 880),

  // ── ACCESSORIES (20) ───────────────────────────────────────────────────────
  row("100% Silk Square Scarf — Black",     "سكارف حرير سكوير 100% أسود",           "Pure silk square scarf in black — wear it 10 ways.",                                                                  "accessories", ["One Size"], 320, 480),
  row("Gold Beaded Layered Necklace",       "نيكليس خرز مطلي ذهبي متعدد الطبقات",  "Multi-strand beaded necklace in gold tone.",                                                                          "accessories", ["One Size"], 160, 260),
  row("Large Silver Hoop Earrings",         "حلق هوب كبير فضي",                     "Polished silver hoops — classic and oversized.",                                                                      "accessories", ["One Size"], 140, 220),
  row("Leather Belt — Black/Gold Buckle",   "حزام جلد أسود بإبزيم ذهبي",           "Full-grain leather belt with sculptural gold buckle.",                                                                 "accessories", ["S","M","L"],  240, 380),
  row("Ribbed Knit Beanie — Charcoal",      "بيني نيت ريبد جاري",                   "100% merino wool ribbed beanie in charcoal.",                                                                         "accessories", ["One Size"], 200, 320),
  row("Oversized Square Sunglasses",        "نظارة شمسية أوفرسايزد سكوير",          "UV400 oversized square frames in tortoiseshell.",                                                                     "accessories", ["One Size"], 360, 560),
  row("Resin Hair Claw Clip Set",           "سيت كلو كليب ريزن",                    "Set of 4 oversized resin hair claws in neutral tones.",                                                              "accessories", ["One Size"], 140, 220),
  row("Satin Scrunchie Set — Pastels",      "سيت سكرانشي ساتان باستيل",             "6-pack satin scrunchies in pastel palette.",                                                                          "accessories", ["One Size"], 90,  160),
  row("Unstructured Canvas Cap — Black",    "كاب كانفاس أنستركتشرد أسود",           "Six-panel unstructured canvas cap in black.",                                                                         "accessories", ["One Size"], 200, 320),
  row("Reversible Bucket Hat — Camo",       "باكيت هات ريفيرسيبل كامو",             "Reversible bucket hat — camo one side, solid the other.",                                                            "accessories", ["One Size"], 220, 360),
  row("Gold Stackable Ring Set",            "سيت خواتم ستاكيبل ذهبية",              "Set of 6 delicate gold stacking rings.",                                                                              "accessories", ["One Size"], 180, 280),
  row("Pearl Embellished Headband",         "هيدباند لؤلؤ مزخرف",                   "Velvet headband with scattered pearl beading.",                                                                        "accessories", ["One Size"], 180, 280),
  row("Printed Floral Silk Scarf",          "سكارف حرير مطبوع ورود",                "Vivid floral print on pure silk square.",                                                                             "accessories", ["One Size"], 300, 460),
  row("Wide-Brim Straw Hat",                "هات ستراو وايد بريم",                  "Packable wide-brim straw hat with ribbon trim.",                                                                      "accessories", ["One Size"], 260, 400),
  row("Velvet Choker — Black & Gold",       "شوكر مخمل أسود وذهبي",                 "Black velvet choker with gold baroque charm.",                                                                        "accessories", ["One Size"], 120, 200),
  row("Tortoiseshell Oversized Sunglasses", "نظارة تورتويز أوفرسايزد",              "XL tortoiseshell frames with UV protection.",                                                                         "accessories", ["One Size"], 380, 580),
  row("Boho Beaded Anklet Set",             "سيت خلخال بيدد بوهو",                  "Set of 3 stackable boho anklets in earth tones.",                                                                    "accessories", ["One Size"], 100, 180),
  row("Logo-Buckle Leather Belt — Brown",   "حزام جلد بإبزيم لوجو بني",            "Brown leather belt with polished logo buckle.",                                                                        "accessories", ["S","M","L"],  260, 400),
  row("Quilted Chain Belt — Black",         "حزام تشين كيلتد أسود",                 "Quilted faux-leather belt with chain links.",                                                                          "accessories", ["S","M","L"],  220, 340),
  row("Layered Coin Necklace — Gold",       "نيكليس كوين متعدد الطبقات ذهبي",       "Layered coin disc necklace in 18k gold-plated brass.",                                                               "accessories", ["One Size"], 200, 320),

  // ── MAKEUP (10) ────────────────────────────────────────────────────────────
  row("12-Shade Nude Eyeshadow Palette",    "باليت ظلال عيون 12 درجة نودز",         "Curated 12-shade nude palette — mattes and shimmers.",                                                                "makeup", ["One Size"], 380, 580),
  row("Long-Wear Matte Lip — Classic Red",  "أحمر شفاه مات لونج وير أحمر",         "Transfer-proof matte lipstick in classic red.",                                                                       "makeup", ["One Size"], 130, 220),
  row("Mega-Volume Mascara — Black",        "ماسكارا فوليوم ماكسيمام أسود",         "Fiber-infused mascara for max volume.",                                                                               "makeup", ["One Size"], 160, 260),
  row("Rose-Gold Pressed Highlighter",      "هايلايتر مضغوط روز جولد",              "Blinding rose-gold highlighter — buildable.",                                                                         "makeup", ["One Size"], 220, 360),
  row("4-Pan Peachy Blush Palette",         "باليت بلاش 4 درجات بيتشي",             "Warm peachy blush palette — sheer to buildable.",                                                                    "makeup", ["One Size"], 340, 540),
  row("Buildable Foundation Stick — Medium","فاونديشن ستيك بيلدبل ميديوم",          "Medium-coverage stick foundation, blurs pores.",                                                                      "makeup", ["One Size"], 300, 480),
  row("Translucent Setting Powder",         "بودرة تثبيت ترانسلوسنت",               "Finely-milled setting powder — no-flash finish.",                                                                    "makeup", ["One Size"], 240, 380),
  row("Contour & Highlight Duo Kit",        "كيت كونتور وهايلايت ثنائي",            "Dual-pan contour and highlight powder kit.",                                                                          "makeup", ["One Size"], 320, 500),
  row("High-Shine Clear Lip Gloss",         "جلوس شفاه شفاف هاي شاين",              "Non-sticky plumping gloss in clear.",                                                                                 "makeup", ["One Size"], 90,  160),
  row("Ultra-Fine Brow Pencil — Brunette",  "قلم حواجب أولترا فاين برونيت",         "Hair-stroke precision brow pencil with spoolie.",                                                                     "makeup", ["One Size"], 110, 190),
];

export async function POST(req: NextRequest) {
  const secret = req.headers.get("x-seed-secret");
  if (secret !== SEED_SECRET) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    // Step 1: Delete ALL existing products for all partners
    const { error: deleteError } = await supabaseAdmin
      .from("products")
      .delete()
      .in("partner_id", PARTNER_IDS);

    if (deleteError) {
      return NextResponse.json({ error: `Delete failed: ${deleteError.message}` }, { status: 500 });
    }

    // Step 2: Insert 300 products in 6 batches of 50
    const BATCH = 50;
    const batches: object[][] = [];
    for (let i = 0; i < PRODUCTS.length; i += BATCH) {
      batches.push(PRODUCTS.slice(i, i + BATCH));
    }

    const results = await Promise.all(
      batches.map(async (batch, idx) => {
        const { error } = await supabaseAdmin.from("products").insert(batch);
        if (error) throw new Error(`Batch ${idx + 1} failed: ${error.message}`);
        return { batch: idx + 1, count: batch.length };
      })
    );

    return NextResponse.json({
      success: true,
      message: `✅ Cleared old products → inserted ${PRODUCTS.length} premium products across 6 batches.`,
      breakdown: {
        abayas: 35, isdals: 20, dresses: 40, tshirts_hoodies: 45,
        pants: 30, sneakers: 30, heels: 20, slippers: 15,
        girls_bags: 35, accessories: 20, makeup: 10, total: 300,
      },
      batches: results,
    });

  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json({ success: false, error: msg }, { status: 500 });
  }
}

export function GET() {
  return NextResponse.json(
    { info: "POST with header 'x-seed-secret: osa-seed-2025' to reset and seed 300 premium products." },
    { status: 405 }
  );
}
