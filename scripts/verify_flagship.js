const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '..', 'public', 'blog', 'the-future-is-not-something-we-wait-for-its-something-we-build', 'index.html');
const html = fs.readFileSync(filePath, 'utf8');

const titleMatch = html.match(/<title>([^<]+)<\/title>/);
const canonicalMatch = html.match(/<link\s+rel=["']canonical["']\s+href=["']([^"']+)["']/i);
const ogUrlMatch = html.match(/<meta\s+property=["']og:url["']\s+content=["']([^"']+)["']/i);
const h1Match = html.match(/<h1[^>]*>([\s\S]*?)<\/h1>/i);

const schemaMatches = html.match(/<script\s+type=["']application\/ld\+json["']>([\s\S]*?)<\/script>/gi) || [];
let schemasValid = true;
const parsedSchemas = [];

schemaMatches.forEach((s, i) => {
    try {
        const raw = s.replace(/<script[^>]*>/i, '').replace(/<\/script>/i, '');
        const parsed = JSON.parse(raw);
        parsedSchemas.push(parsed);
    } catch (e) {
        schemasValid = false;
        console.error(`Schema error at ${i}:`, e.message);
    }
});

// Count substantive words
const startIdx = html.indexOf('id="article-content"');
const endIdx = html.indexOf('class="social-share"');
let wordCount = 0;
if (startIdx !== -1 && endIdx !== -1) {
    const rawContent = html.substring(startIdx, endIdx);
    const text = rawContent.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
    wordCount = text.split(/\s+/).filter(w => w.length > 0).length;
}

// Internal links verification
const linkMatches = [...html.matchAll(/href=["'](\/[^"'#?]+)["']/g)].map(m => m[1]);
const uniqueInternalLinks = [...new Set(linkMatches)];

console.log('=== VERIFICATION RESULTS ===');
console.log('Title:', titleMatch ? titleMatch[1] : 'FAIL');
console.log('Canonical:', canonicalMatch ? canonicalMatch[1] : 'FAIL');
console.log('OG URL:', ogUrlMatch ? ogUrlMatch[1] : 'FAIL');
console.log('H1:', h1Match ? h1Match[1].replace(/\s+/g, ' ').trim() : 'FAIL');
console.log('Substantive Word Count in blog-content:', wordCount);
console.log('JSON-LD Schemas Valid:', schemasValid, `(${schemaMatches.length} blocks)`);
console.log('Unique Internal Link Targets:', uniqueInternalLinks);
