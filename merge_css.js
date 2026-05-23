const fs = require('fs');
const oldPath = 'C:\\Users\\ELSAFA\\.gemini\\antigravity\\scratch\\osha-store\\src\\app\\globals.css';
const newPath = 'C:\\Users\\ELSAFA\\Downloads\\OSA-CLO-complete-implementation\\OSA-CLO-files\\src\\app\\globals.css';

const oldContent = fs.readFileSync(oldPath, 'utf8');
const newContent = fs.readFileSync(newPath, 'utf8');

fs.writeFileSync(oldPath, oldContent + "\n\n/* --- MERGED FROM NEW --- */\n\n" + newContent);
