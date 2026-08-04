const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '..', 'public', 'genesis', 'index.html');
const content = fs.readFileSync(filePath, 'utf8');

console.log('--- VERIFYING GENESIS™ HTML & JS INTEGRITY ---');

// Check key DOM IDs
const requiredIds = [
    'hero-heading',
    'btn-begin-genesis',
    'btn-watch-demo',
    'theme-toggle',
    'demo-modal',
    'modal-close',
    'genesis-scanner',
    'btn-start-scan',
    'scan-ring-bar',
    'scan-percent-text',
    'scan-status-text',
    'twin-result-card',
    'res-twin-id',
    'res-archetype',
    'res-confidence',
    'dot-1', 'dot-2', 'dot-3', 'dot-4', 'dot-5', 'dot-6', 'dot-7'
];

let missingIds = [];
requiredIds.forEach(id => {
    if (!content.includes(`id="${id}"`)) {
        missingIds.push(id);
    }
});

if (missingIds.length > 0) {
    console.error('❌ Missing IDs:', missingIds);
} else {
    console.log('✔ All 21 required interactive DOM IDs verified.');
}

// Check SEO & Meta
const checks = [
    { name: 'Title Tag', test: content.includes('<title>Genesis™') },
    { name: 'Meta Description', test: content.includes('name="description"') },
    { name: 'Canonical URL', test: content.includes('rel="canonical" href="https://digitaltwinvrs.com/genesis"') },
    { name: 'OpenGraph Tags', test: content.includes('property="og:title"') },
    { name: 'Twitter Card Tags', test: content.includes('name="twitter:card"') },
    { name: 'JSON-LD Schema', test: content.includes('application/ld+json') },
    { name: 'WCAG ARIA Labels', test: content.includes('aria-label') && content.includes('aria-live') },
    { name: 'Theme Toggle Support', test: content.includes('dtv_theme') }
];

checks.forEach(c => {
    if (c.test) {
        console.log(`✔ ${c.name}: Verified.`);
    } else {
        console.error(`❌ ${c.name}: Missing!`);
    }
});

console.log('--- VERIFICATION COMPLETE ---');
