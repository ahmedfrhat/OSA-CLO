const fs = require('fs');
const path = require('path');

// Helper to flatten nested objects
function flatten(obj, prefix = '', res = {}) {
  for (const [key, value] of Object.entries(obj)) {
    const fullKey = prefix ? `${prefix}.${key}` : key;
    if (value && typeof value === 'object' && !Array.isArray(value)) {
      flatten(value, fullKey, res);
    } else {
      res[fullKey] = value;
    }
  }
  return res;
}

// 1. Read existing translations.ts to preserve existing flat keys
const transPath = path.join(__dirname, 'src', 'i18n', 'translations.ts');
let existingEn = {};
let existingAr = {};

if (fs.existsSync(transPath)) {
  const transContent = fs.readFileSync(transPath, 'utf8');
  
  function extractKeysAndValues(content, lang) {
    const startRegex = new RegExp(`${lang}:\\s*\\{`);
    const match = content.match(startRegex);
    if (!match) return {};
    
    const startIdx = match.index + match[0].length;
    let braceCount = 1;
    let endIdx = startIdx;
    while (braceCount > 0 && endIdx < content.length) {
      if (content[endIdx] === '{') braceCount++;
      if (content[endIdx] === '}') braceCount--;
      endIdx++;
    }
    
    const block = content.slice(startIdx, endIdx - 1);
    const lines = block.split('\n');
    const dict = {};
    for (const line of lines) {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith('//')) continue;
      
      const match = trimmed.match(/^(?:"([^"]+)"|'([^']+)'|([a-zA-Z0-9_.-]+))\s*:\s*["'`](.*?)["'`]\s*,?\s*$/);
      if (match) {
        const key = match[1] || match[2] || match[3];
        const val = match[4];
        dict[key] = val;
      }
    }
    return dict;
  }
  
  existingEn = extractKeysAndValues(transContent, 'en');
  existingAr = extractKeysAndValues(transContent, 'ar');
  console.log(`Extracted from existing translations.ts: ${Object.keys(existingEn).length} English keys, ${Object.keys(existingAr).length} Arabic keys`);
}

// 2. Read and flatten en.json and ar.json
const enJsonPath = path.join(__dirname, 'src', 'i18n', 'en.json');
const arJsonPath = path.join(__dirname, 'src', 'i18n', 'ar.json');

const enJson = JSON.parse(fs.readFileSync(enJsonPath, 'utf8'));
const arJson = JSON.parse(fs.readFileSync(arJsonPath, 'utf8'));

const flatEn = flatten(enJson);
const flatAr = flatten(arJson);

console.log(`Flattened JSONs: ${Object.keys(flatEn).length} English keys, ${Object.keys(flatAr).length} Arabic keys`);

// 3. Merge them (JSON flattens override or merge with existing flat keys)
const finalEn = { ...existingEn, ...flatEn };
const finalAr = { ...existingAr, ...flatAr };

// 4. Parity check & sync missing keys
const allKeys = new Set([...Object.keys(finalEn), ...Object.keys(finalAr)]);
console.log(`Total unique merged keys: ${allKeys.size}`);

const sortedKeys = Array.from(allKeys).sort();

// Let's build the new translations.ts file content
let newContent = `// src/i18n/translations.ts
// Automatically generated and stabilized localization dictionary.

export type Lang = "en" | "ar";

export const translations = {
  en: {\n`;

sortedKeys.forEach(key => {
  const val = finalEn[key] || finalAr[key] || "";
  // Escape backslashes, double quotes, and newlines properly for TS literal strings
  const escapedVal = val
    .replace(/\\/g, '\\\\')
    .replace(/"/g, '\\"')
    .replace(/\n/g, '\\n')
    .replace(/\r/g, '\\r');
  newContent += `    "${key}": "${escapedVal}",\n`;
});

newContent += `  },\n\n  ar: {\n`;

sortedKeys.forEach(key => {
  const val = finalAr[key] || finalEn[key] || "";
  // Escape backslashes, double quotes, and newlines properly for TS literal strings
  const escapedVal = val
    .replace(/\\/g, '\\\\')
    .replace(/"/g, '\\"')
    .replace(/\n/g, '\\n')
    .replace(/\r/g, '\\r');
  newContent += `    "${key}": "${escapedVal}",\n`;
});

newContent += `  },\n} as const;\n\nexport type TranslationKey = keyof typeof translations.en;\n`;

fs.writeFileSync(transPath, newContent, 'utf8');
console.log(`Successfully generated translations.ts with ${sortedKeys.length} keys.`);
