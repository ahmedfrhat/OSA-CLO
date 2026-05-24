with open('src/app/admin/dashboard/AddProductModal.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

# 1. Update Props
content = content.replace(
    "  product?: ProductForModal; // if provided → Edit mode\n  onSuccess: () => void;",
    "  product?: ProductForModal; // if provided → Edit mode\n  partnerName: string;\n  onSuccess: () => void;"
)

# 2. Update Component Signature
content = content.replace(
    "export default function ProductModal({ product, onSuccess, onClose }: Props) {",
    "export default function ProductModal({ product, partnerName, onSuccess, onClose }: Props) {"
)

# 3. Add dynamic categories logic
dynamic_cats = '''  const isEdit = !!product;

  let allowedCategories = [
    "T-Shirts", "Hoodies", "Pants", "Shorts", "Outerwear",
    "Accessories", "Shoes", "Abayas", "Dresses", "Shirts",
    "Skirts", "Suits", "Loungewear", "Lingerie", "Bags",
    "Makeup", "Home Appliances", "Other"
  ];

  if (partnerName === "Safia" || partnerName === "صافيه") {
    allowedCategories = ["Abayas", "Dresses", "T-Shirts", "Pants", "Shirts", "Skirts", "Suits"];
  } else if (partnerName === "Omaima" || partnerName === "Omayma" || partnerName === "اميمه") {
    allowedCategories = ["Shoes", "Loungewear", "Lingerie"];
  } else if (partnerName === "Aisha" || partnerName === "عائشه") {
    allowedCategories = ["Bags", "Accessories"];
  }
'''
content = content.replace("  const isEdit = !!product;", dynamic_cats)

# 4. Use allowedCategories instead of CATEGORIES
content = content.replace(
    "{CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}",
    "{allowedCategories.map((c) => <option key={c} value={c}>{c}</option>)}"
)

with open('src/app/admin/dashboard/AddProductModal.tsx', 'w', encoding='utf-8') as f:
    f.write(content)

print("AddProductModal updated successfully.")
