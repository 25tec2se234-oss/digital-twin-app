const fs = require('fs');
const path = require('path');
const { JSDOM } = require('jsdom');

const filePath = path.join(__dirname, '..', 'public', 'ai-career-roadmap', 'index.html');
const html = fs.readFileSync(filePath, 'utf8');

const dom = new JSDOM(html);
const document = dom.window.document;

console.log("=== VERIFYING AI CAREER ROADMAP PAGE ===");

// 1. Title & Meta
const title = document.querySelector('title').textContent;
console.log("Title:", title);
if (!title.includes("Ultimate AI Career Roadmap")) throw new Error("Title mismatch!");

// 2. Canonical
const canonical = document.querySelector('link[rel="canonical"]').getAttribute('href');
console.log("Canonical:", canonical);
if (canonical !== "https://digitaltwinvrs.com/ai-career-roadmap") throw new Error("Canonical URL mismatch!");

// 3. JSON-LD Schemas
const scripts = document.querySelectorAll('script[type="application/ld+json"]');
console.log("JSON-LD Script Blocks Found:", scripts.length);

let foundItemList = false;
let foundFAQ = false;

scripts.forEach(s => {
    const data = JSON.parse(s.textContent);
    if (Array.isArray(data)) {
        data.forEach(item => {
            if (item['@type'] === 'ItemList') foundItemList = true;
            if (item['@type'] === 'FAQPage') foundFAQ = true;
        });
    }
});

console.log("ItemList Schema Found:", foundItemList);
console.log("FAQPage Schema Found:", foundFAQ);

if (!foundItemList || !foundFAQ) throw new Error("Missing JSON-LD structured schemas!");

console.log("✅ AI Career Roadmap Validation Passed 100%!");
