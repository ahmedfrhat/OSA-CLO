import fs from 'fs';
import path from 'path';

const filesToUpdate = [
  'src/components/ProductCard.tsx',
  'src/components/CategoryFilter.tsx',
  'src/components/FuzzySearch.tsx',
  'src/components/storefront/CartDrawer.tsx',
  'src/components/storefront/StorefrontClient.tsx',
  'src/app/checkout/page.tsx',
  'src/app/product/[id]/ProductDetailClient.tsx',
  'src/app/admin/dashboard/DashboardShell.tsx',
  'src/app/admin/dashboard/CRMTab.tsx',
  'src/app/admin/dashboard/ReportsTab.tsx',
  'src/app/admin/dashboard/OrderDetailsModal.tsx'
];

function processFile(filePath) {
  const fullPath = path.resolve(filePath);
  if (!fs.existsSync(fullPath)) {
    console.log(`Skipping ${filePath}, not found.`);
    return;
  }
  
  let content = fs.readFileSync(fullPath, 'utf8');

  // Replace colors that don't have a dark mode equivalent
  // using regex negative lookahead to ensure there's no dark: prefix already,
  // or that we're replacing the whole className correctly.
  
  // bg-white -> bg-white dark:bg-brand-black (or dark:bg-brand-gray if it's a card)
  // Let's just use dark:bg-brand-black for standard bg-white, and dark:bg-brand-gray for cards if it makes sense.
  // Since we don't want to break things, generic dark:bg-brand-gray is safer for most UI elements to contrast with brand-black.
  content = content.replace(/\bbg-white(?![ \t]+dark:bg-)/g, 'bg-white dark:bg-brand-gray');
  
  // text-black -> text-brand-black dark:text-offwhite
  content = content.replace(/\btext-black(?![ \t]+dark:text-)/g, 'text-black dark:text-offwhite');
  
  content = content.replace(/\btext-brand-black(?![ \t]+dark:text-)/g, 'text-brand-black dark:text-offwhite');

  // bg-gray-50 -> bg-gray-50 dark:bg-brand-black
  content = content.replace(/\bbg-gray-50(?![ \t]+dark:bg-)/g, 'bg-gray-50 dark:bg-brand-black');
  
  // bg-gray-100 -> bg-gray-100 dark:bg-brand-black/50
  content = content.replace(/\bbg-gray-100(?![ \t]+dark:bg-)/g, 'bg-gray-100 dark:bg-brand-black');
  
  // text-gray-500 -> text-gray-500 dark:text-gray-400
  content = content.replace(/\btext-gray-500(?![ \t]+dark:text-)/g, 'text-gray-500 dark:text-gray-400');
  
  // border-gray-200 -> border-gray-200 dark:border-brand-border/20
  content = content.replace(/\bborder-gray-200(?![ \t]+dark:border-)/g, 'border-gray-200 dark:border-brand-border/20');
  
  fs.writeFileSync(fullPath, content, 'utf8');
  console.log(`Updated ${filePath}`);
}

filesToUpdate.forEach(processFile);
