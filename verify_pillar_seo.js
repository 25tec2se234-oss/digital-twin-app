const fs = require('fs');
const path = require('path');
const { JSDOM } = require('jsdom');

const filePath = path.join(__dirname, 'public', 'career-guidance-after-12th', 'index.html');
if (!fs.existsSync(filePath)) {
    console.error(`❌ File not found: ${filePath}`);
    process.exit(1);
}

const html = fs.readFileSync(filePath, 'utf8');
const dom = new JSDOM(html);
const doc = dom.window.document;

console.log('===================================================');
console.log('🔍 SEO & TECHNICAL AUDIT VERIFICATION FOR PILLAR PAGE');
console.log('===================================================');

let score = 100;
const deductions = [];

// 1. Meta Title
const title = doc.querySelector('title')?.textContent.trim();
if (!title) {
    score -= 10;
    deductions.push('Missing <title> tag');
} else {
    console.log(`✅ Title: "${title}" (${title.length} chars)`);
    if (!title.includes('Career Guidance After 12th')) {
        score -= 5;
        deductions.push('Title missing target primary keyword');
    }
}

// 2. Meta Description
const metaDesc = doc.querySelector('meta[name="description"]')?.getAttribute('content');
if (!metaDesc) {
    score -= 10;
    deductions.push('Missing meta description');
} else {
    console.log(`✅ Meta Description: "${metaDesc}" (${metaDesc.length} chars)`);
}

// 3. Canonical URL
const canonical = doc.querySelector('link[rel="canonical"]')?.getAttribute('href');
if (!canonical || !canonical.includes('/career-guidance-after-12th')) {
    score -= 5;
    deductions.push('Invalid or missing canonical URL');
} else {
    console.log(`✅ Canonical URL: ${canonical}`);
}

// 4. Open Graph & Twitter Cards
const ogTitle = doc.querySelector('meta[property="og:title"]')?.getAttribute('content');
const twitterCard = doc.querySelector('meta[name="twitter:card"]')?.getAttribute('content');
if (!ogTitle || !twitterCard) {
    score -= 5;
    deductions.push('Missing OpenGraph or Twitter Card tags');
} else {
    console.log(`✅ OpenGraph Title & Twitter Card present`);
}

// 5. H1 Tag (Single H1)
const h1s = doc.querySelectorAll('h1');
if (h1s.length !== 1) {
    score -= 10;
    deductions.push(`Found ${h1s.length} <h1> tags (Must have exactly 1)`);
} else {
    console.log(`✅ Single H1 Tag: "${h1s[0].textContent.trim()}"`);
}

// 6. JSON-LD Schemas & FAQ Count
const schemaScript = doc.querySelector('script[type="application/ld+json"]');
let faqCount = 0;
if (!schemaScript) {
    score -= 15;
    deductions.push('Missing JSON-LD structured data');
} else {
    try {
        const schemas = JSON.parse(schemaScript.textContent);
        const faqSchema = schemas.find(s => s['@type'] === 'FAQPage');
        if (faqSchema && faqSchema.mainEntity) {
            faqCount = faqSchema.mainEntity.length;
            console.log(`✅ JSON-LD FAQ Schema present with ${faqCount} QAs`);
            if (faqCount < 20) {
                score -= 10;
                deductions.push(`FAQ Schema has ${faqCount} questions (Minimum 20 required)`);
            }
        } else {
            score -= 10;
            deductions.push('Missing FAQPage schema in JSON-LD');
        }
    } catch (e) {
        score -= 15;
        deductions.push('Invalid JSON-LD syntax: ' + e.message);
    }
}

// 7. Image Alt Tags
const imgs = Array.from(doc.querySelectorAll('img'));
const missingAlt = imgs.filter(i => !i.hasAttribute('alt') || !i.getAttribute('alt').trim());
if (missingAlt.length > 0) {
    score -= 5;
    deductions.push(`${missingAlt.length} images missing alt attributes`);
} else {
    console.log(`✅ All ${imgs.length} images have valid alt attributes`);
}

// 8. 21 Career Categories Count Check
const careerCards = doc.querySelectorAll('.career-card');
console.log(`✅ Found ${careerCards.length} Career Category Cards (21 expected)`);
if (careerCards.length < 21) {
    score -= 10;
    deductions.push(`Only found ${careerCards.length} career cards out of 21 required`);
}

// 9. 6 Stream Cards Count Check
const streamCards = doc.querySelectorAll('.stream-card');
console.log(`✅ Found ${streamCards.length} Stream Breakdown Cards (6 expected)`);
if (streamCards.length < 6) {
    score -= 5;
    deductions.push(`Only found ${streamCards.length} stream cards out of 6 required`);
}

// 10. Table of Contents & Comparison Table
const toc = doc.querySelector('.toc-wrapper');
const comparisonTable = doc.querySelector('.comparison-table');
if (!toc || !comparisonTable) {
    score -= 5;
    deductions.push('Missing Table of Contents or Comparison Table');
} else {
    console.log(`✅ Table of Contents & Comparison Table present`);
}

console.log('---------------------------------------------------');
console.log(`🏆 OVERALL SEO & QUALITY SCORE: ${score}/100`);
if (deductions.length > 0) {
    console.log('Deductions:');
    deductions.forEach(d => console.log(` - ❌ ${d}`));
}
console.log('---------------------------------------------------');

if (score >= 95) {
    console.log('✨ PASSED ALL ENTERPRISE PRODUCTION REQUIREMENTS!');
    process.exit(0);
} else {
    console.error('⚠️ Score below 95 threshold.');
    process.exit(1);
}
