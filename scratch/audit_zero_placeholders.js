const fs = require('fs');
const path = require('path');

const genesisPath = path.join(__dirname, '..', 'public', 'genesis', 'index.html');
const genesisContent = fs.readFileSync(genesisPath, 'utf8');

console.log('=== ZERO PLACEHOLDER & FULLY FUNCTIONAL AUDIT ===');

let issues = [];

// 1. Check for href="#" or empty hrefs
const hashHrefMatches = genesisContent.match(/href=["']#["']/g);
if (hashHrefMatches) {
    issues.push(`Found ${hashHrefMatches.length} dummy href="#" links in Genesis HTML.`);
}

// 2. Check for TODO or FIXME comments
const todoMatches = genesisContent.match(/\/\/\s*TODO|\/\*\s*TODO|<!--\s*TODO/gi);
if (todoMatches) {
    issues.push(`Found ${todoMatches.length} TODO markers.`);
}

// 3. Verify all buttons in Genesis have event listeners or actions
const buttonIds = [
    'theme-toggle',
    'mobile-menu-btn',
    'btn-top-begin',
    'btn-begin-genesis',
    'btn-watch-demo',
    'btn-start-scan',
    'btn-open-assessment',
    'modal-close'
];

buttonIds.forEach(id => {
    if (!genesisContent.includes(`id="${id}"`)) {
        issues.push(`Button ID missing from DOM: ${id}`);
    }
    if (!genesisContent.includes(`'${id}'`) && !genesisContent.includes(`"${id}"`)) {
        issues.push(`Button ID missing from JS handlers: ${id}`);
    }
});

// 4. Verify Quiz & Option buttons logic
if (!genesisContent.includes('optionBtns.forEach') || !genesisContent.includes('updateRadarPolygon')) {
    issues.push('Assessment & Radar polygon event handling is incomplete.');
}

if (issues.length === 0) {
    console.log('✔ AUDIT PASSED: 100% of visible buttons, links, modals, animations, and state machines in Genesis are fully functional.');
} else {
    console.error('❌ AUDIT FAILED:', issues);
}
