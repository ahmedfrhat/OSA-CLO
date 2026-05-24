const fs = require('fs');
const path = require('path');

// 1. Read and parse translations.ts
const transPath = path.join(__dirname, 'src', 'i18n', 'translations.ts');
const transContent = fs.readFileSync(transPath, 'utf8');

// We will extract the en and ar blocks using simple parsing or regex
function extractKeysAndValues(content, lang) {
  const startRegex = new RegExp(`${lang}:\\s*\\{`);
  const match = content.match(startRegex);
  if (!match) {
    console.error(`Could not find ${lang} block in translations.ts`);
    return null;
  }
  
  const startIdx = match.index + match[0].length;
  // Let's count braces to find the end of the object
  let braceCount = 1;
  let endIdx = startIdx;
  while (braceCount > 0 && endIdx < content.length) {
    if (content[endIdx] === '{') braceCount++;
    if (content[endIdx] === '}') braceCount--;
    endIdx++;
  }
  
  const block = content.slice(startIdx, endIdx - 1);
  // Parse lines to get keys
  const lines = block.split('\n');
  const dict = {};
  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('//')) continue;
    
    // Format: "key": "value" or key: "value"
    // Let's use a regex to match either quoted or unquoted keys
    const match = trimmed.match(/^(?:"([^"]+)"|'([^']+)'|([a-zA-Z0-9_.-]+))\s*:\s*["'`](.*?)["'`]\s*,?\s*$/);
    if (match) {
      const key = match[1] || match[2] || match[3];
      const val = match[4];
      dict[key] = val;
    }
  }
  return dict;
}

const enDict = extractKeysAndValues(transContent, 'en');
const arDict = extractKeysAndValues(transContent, 'ar');

if (!enDict || !arDict) {
  console.error("Failed to parse translations.ts dictionaries");
  process.exit(1);
}

const enKeys = Object.keys(enDict);
const arKeys = Object.keys(arDict);

console.log(`Parsed translations.ts: ${enKeys.length} English keys, ${arKeys.length} Arabic keys`);

// 2. Parity Check
const missingInAr = enKeys.filter(k => !(k in arDict));
const missingInEn = arKeys.filter(k => !(k in enDict));

if (missingInAr.length > 0) {
  console.warn(`\n[WARNING] Keys in English but missing in Arabic (${missingInAr.length}):`);
  missingInAr.forEach(k => console.warn(`  - ${k}`));
} else {
  console.log("\n[SUCCESS] No keys missing in Arabic dictionary.");
}

if (missingInEn.length > 0) {
  console.warn(`\n[WARNING] Keys in Arabic but missing in English (${missingInEn.length}):`);
  missingInEn.forEach(k => console.warn(`  - ${k}`));
} else {
  console.log("[SUCCESS] No keys missing in English dictionary.");
}

// 3. Scan codebase for t(...) usages
const srcDir = path.join(__dirname, 'src');
const codeKeys = new Set();
const fileKeyMap = {}; // file -> set of keys

function scanCode(dir) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const full = path.join(dir, file);
    if (fs.statSync(full).isDirectory()) {
      if (file !== 'node_modules' && file !== '.next') {
        scanCode(full);
      }
    } else if (file.endsWith('.tsx') || file.endsWith('.ts')) {
      // Exclude translation files themselves
      if (full.includes('i18n')) continue;
      
      const content = fs.readFileSync(full, 'utf8');
      
      // Match t('key') or t("key") or t(`key`)
      // Using word boundary \bt\b to avoid matching select('...')
      const tRegex = /\bt\(\s*(['"`])(.*?)\1\s*(?:,|\))/g;
      let match;
      while ((match = tRegex.exec(content)) !== null) {
        const key = match[2];
        // Skip empty or dynamic-looking keys like `${...}`
        if (!key) continue;
        
        codeKeys.add(key);
        if (!fileKeyMap[full]) fileKeyMap[full] = new Set();
        fileKeyMap[full].add(key);
      }
    }
  }
}

scanCode(srcDir);

console.log(`\nFound ${codeKeys.size} distinct translation keys used in the codebase.`);

// 4. Validate used keys against translations.ts
const missingInTrans = [];
const dynamicKeys = [];

for (const key of codeKeys) {
  // If it's a dynamic key containing ${...}
  if (key.includes('${')) {
    dynamicKeys.push(key);
    continue;
  }
  
  if (!(key in enDict) || !(key in arDict)) {
    missingInTrans.push(key);
  }
}

console.log(`\n--- KEYS USED IN CODE BUT MISSING IN TRANSLATIONS.TS ---`);
if (missingInTrans.length === 0) {
  console.log("[SUCCESS] All static t() keys are fully translated!");
} else {
  missingInTrans.forEach(k => {
    const files = Object.keys(fileKeyMap).filter(f => fileKeyMap[f].has(k)).map(f => path.basename(f));
    console.log(`  - ${k} (used in: ${files.join(', ')})`);
  });
}

console.log(`\n--- DYNAMIC KEYS IN CODE ---`);
if (dynamicKeys.length === 0) {
  console.log("No dynamic keys found.");
} else {
  dynamicKeys.forEach(k => {
    const files = Object.keys(fileKeyMap).filter(f => fileKeyMap[f].has(k)).map(f => path.basename(f));
    console.log(`  - ${k} (used in: ${files.join(', ')})`);
  });
}
