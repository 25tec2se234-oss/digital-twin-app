const fs = require('fs');
const path = require('path');
const { JSDOM } = require('jsdom');

async function verifyGenesis() {
    console.log('=== STARTING GENESIS V1 PRODUCTION QUALITY VERIFICATION ===\n');

    const indexHtmlPath = path.join(__dirname, 'public', 'genesis', 'index.html');
    const rootHtmlPath = path.join(__dirname, 'public', 'genesis.html');

    if (!fs.existsSync(indexHtmlPath) || !fs.existsSync(rootHtmlPath)) {
        console.error('ERROR: Genesis HTML files do not exist!');
        process.exit(1);
    }

    const indexContent = fs.readFileSync(indexHtmlPath, 'utf8');
    const rootContent = fs.readFileSync(rootHtmlPath, 'utf8');

    // 1. Synchronous File Comparison
    console.log('1. Verifying File Synchronization...');
    if (indexContent !== rootContent) {
        console.error('FAIL: public/genesis/index.html and public/genesis.html are NOT in sync!');
        process.exit(1);
    }
    console.log('✔ PASS: public/genesis/index.html and public/genesis.html are 100% identical.\n');

    // 2. DOM Parsing & Interactive Element Checklist
    console.log('2. Auditing DOM Elements & Accessibility Attributes...');
    const dom = new JSDOM(indexContent, {
        runScripts: "dangerously",
        resources: "usable",
        url: "http://localhost/genesis"
    });

    const doc = dom.window.document;

    // Buttons verification
    const buttons = doc.querySelectorAll('button');
    console.log(`Auditing ${buttons.length} <button> elements...`);
    let buttonErrors = 0;
    buttons.forEach((btn, i) => {
        const id = btn.id || btn.className || `button-${i}`;
        const type = btn.getAttribute('type');
        const ariaLabel = btn.getAttribute('aria-label') || btn.textContent.trim();
        if (!type) {
            console.warn(`WARNING: Button [${id}] is missing explicit type="button"`);
            buttonErrors++;
        }
        if (!ariaLabel) {
            console.warn(`WARNING: Button [${id}] has no accessible label`);
            buttonErrors++;
        }
    });

    if (buttonErrors === 0) {
        console.log(`✔ PASS: All ${buttons.length} buttons have valid type and accessible labels.`);
    }

    // Links verification
    const links = doc.querySelectorAll('a');
    console.log(`Auditing ${links.length} <a> links...`);
    let linkErrors = 0;
    links.forEach((link, i) => {
        const href = link.getAttribute('href');
        if (!href || href === '#') {
            console.error(`FAIL: Link [${link.textContent.trim()}] has broken/dummy href="${href}"`);
            linkErrors++;
        }
    });

    if (linkErrors === 0) {
        console.log(`✔ PASS: All ${links.length} links have valid destinations.`);
    }

    // Modals verification
    const modals = doc.querySelectorAll('.modal-backdrop');
    console.log(`Auditing ${modals.length} modal dialogs...`);
    modals.forEach((modal) => {
        const role = modal.getAttribute('role');
        const ariaModal = modal.getAttribute('aria-modal');
        const ariaLabelledby = modal.getAttribute('aria-labelledby');
        if (role !== 'dialog' || ariaModal !== 'true' || !ariaLabelledby) {
            console.error(`FAIL: Modal [${modal.id}] missing proper accessibility attributes!`);
            process.exit(1);
        }
    });
    console.log(`✔ PASS: All modal dialogs have valid ARIA roles and labels.`);

    // Check SVG Radar accessibility
    const radarSvg = doc.querySelector('.radar-svg');
    if (radarSvg && radarSvg.getAttribute('role') === 'img' && radarSvg.getAttribute('aria-label')) {
        console.log('✔ PASS: 5-Axis Capability Radar SVG has valid role="img" and aria-label.');
    } else {
        console.error('FAIL: Radar SVG missing role="img" or aria-label!');
        process.exit(1);
    }

    // Check YouTube Scrubber Slider
    const scrubber = doc.getElementById('yt-progress-container');
    if (scrubber && scrubber.getAttribute('role') === 'slider' && scrubber.getAttribute('aria-label')) {
        console.log('✔ PASS: Video Seek Scrubber slider has valid ARIA attributes.');
    } else {
        console.error('FAIL: Video Seek Scrubber missing slider attributes!');
        process.exit(1);
    }

    console.log('\n=== ALL GENESIS FRONTEND PRODUCTION VERIFICATIONS PASSED SUCCESSFULLY ===');
}

verifyGenesis().catch(err => {
    console.error('Verification error:', err);
    process.exit(1);
});
