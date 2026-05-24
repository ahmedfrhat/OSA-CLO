const fs = require('fs');
const path = require('path');

const keys = new Set();
const colors = new Set();

function walk(dir) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const full = path.join(dir, file);
    if (fs.statSync(full).isDirectory()) {
      walk(full);
    } else if (full.endsWith('.tsx') || full.endsWith('.ts')) {
      const content = fs.readFileSync(full, 'utf8');
      const matches = [...content.matchAll(/t\(['"`](.*?)['"`]\)/g)];
      for (const match of matches) {
        keys.add(match[1]);
      }
      
      const bgMatches = [...content.matchAll(/bg-[a-zA-Z0-9-]+/g)];
      for (const bg of bgMatches) {
        colors.add(bg[0]);
      }
      const textMatches = [...content.matchAll(/text-[a-zA-Z0-9-]+/g)];
      for (const txt of textMatches) {
        colors.add(txt[0]);
      }
    }
  }
}
walk(path.join(__dirname, 'src'));

console.log("=== TRANSLATION KEYS ===");
console.log([...keys].sort().join('\n'));
console.log("\n=== COLORS ===");
console.log([...colors].sort().join('\n'));
