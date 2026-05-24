const fs = require('fs');
const path = require('path');

const srcDir = path.join(__dirname, 'src');

function scanFile(filePath) {
  const content = fs.readFileSync(filePath, 'utf8');
  const lines = content.split('\n');
  const results = [];
  
  // 1. Check for JSX text (text outside of tags, not inside braces)
  // Let's look for lines containing alphabetic characters between > and <
  // e.g. >Hello World< or > Hello <
  lines.forEach((line, index) => {
    const trimmed = line.trim();
    if (trimmed.startsWith('//') || trimmed.startsWith('*') || trimmed.startsWith('/*')) return;
    
    // Check JSX text
    // Matches > followed by text containing letters, followed by <
    // Exclude cases with curly braces, JSX tags, etc.
    const jsxTextMatch = line.match(/>\s*([A-Za-z]+(?:\s+[A-Za-z0-9&!?,.:'-]+)*)\s*</);
    if (jsxTextMatch) {
      const text = jsxTextMatch[1].trim();
      // Ignore common non-word values like single chars, numbers, icons, or classNames
      if (text.length > 1 && !/^[0-9]+$/.test(text) && text !== 'EGP' && text !== 'EGP ' && text !== 'EGP' && text !== 'x') {
        results.push({ lineNum: index + 1, type: 'JSX Text', text, line: trimmed });
      }
    }
    
    // 2. Check for hardcoded string attributes like placeholder="..." or label="..."
    // Matches attributes with literal strings: attribute="English Text"
    // Exclude className, key, id, href, src, type, rel, target, dir, lang, method, action, value
    const attrMatch = line.match(/\b(placeholder|label|title|subtitle|heading|text|buttonText|description|error|success|msg)\s*=\s*(["'])(.*?)\2/);
    if (attrMatch) {
      const attr = attrMatch[1];
      const val = attrMatch[3];
      // If it doesn't look like an empty string or a system-like identifier
      if (val && val.length > 0 && /[A-Za-z]/.test(val) && !val.includes('{') && !val.includes('t(')) {
        results.push({ lineNum: index + 1, type: `Attribute (${attr})`, text: val, line: trimmed });
      }
    }
  });
  
  return results;
}

function walk(dir, allResults = {}) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const full = path.join(dir, file);
    if (fs.statSync(full).isDirectory()) {
      if (file !== 'node_modules' && file !== '.next') {
        walk(full, allResults);
      }
    } else if (file.endsWith('.tsx')) {
      const res = scanFile(full);
      if (res.length > 0) {
        allResults[full] = res;
      }
    }
  }
  return allResults;
}

const audit = walk(srcDir);
console.log("=== HARDCODED STRING AUDIT RESULTS ===");
let total = 0;
for (const [file, items] of Object.entries(audit)) {
  console.log(`\nFile: ${path.relative(__dirname, file)}`);
  items.forEach(item => {
    console.log(`  Line ${item.lineNum}: [${item.type}] "${item.text}"`);
    console.log(`    Code: ${item.line}`);
    total++;
  });
}
console.log(`\nTotal potential hardcoded strings: ${total}`);
