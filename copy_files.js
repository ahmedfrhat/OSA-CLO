const fs = require('fs');
const path = require('path');

function copyRecursiveSync(src, dest) {
  const exists = fs.existsSync(src);
  const stats = exists && fs.statSync(src);
  const isDirectory = exists && stats.isDirectory();
  if (isDirectory) {
    if (!fs.existsSync(dest)) fs.mkdirSync(dest, { recursive: true });
    fs.readdirSync(src).forEach(function(childItemName) {
      copyRecursiveSync(path.join(src, childItemName), path.join(dest, childItemName));
    });
  } else {
    // Only copy if it exists and doesn't end with page.tsx, layout.tsx, Navbar.tsx, globals.css, supabase.ts 
    // Wait, the user explicitly said "REPLACE ProductCard.tsx and categories.ts" and "DO NOT BLINDLY OVERWRITE CORE FILES".
    // Let's just copy everything EXCEPT the core files that I need to merge manually.
    const filename = path.basename(src);
    const ignoreFiles = ['page.tsx', 'layout.tsx', 'Navbar.tsx', 'globals.css', 'supabase.ts'];
    
    // Exception: admin/popup/page.tsx is a new file, we should copy it.
    if (ignoreFiles.includes(filename) && !src.includes('popup')) {
      console.log('Skipping core file to merge manually: ' + filename);
    } else {
      fs.copyFileSync(src, dest);
      console.log('Copied: ' + src + ' -> ' + dest);
    }
  }
}

const source = 'C:\\Users\\ELSAFA\\Downloads\\OSA-CLO-complete-implementation\\OSA-CLO-files\\src';
const destination = 'C:\\Users\\ELSAFA\\.gemini\\antigravity\\scratch\\osha-store\\src';

copyRecursiveSync(source, destination);
