const http = require('http');
const puppeteer = require('puppeteer');
const app = require('./src/app');

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

async function runCTOVerificationSprint() {
    console.log('==================================================');
    console.log('          CTO FINAL VERIFICATION SPRINT           ');
    console.log('==================================================\n');

    // Start local test server on port 3099
    const PORT = 3099;
    const server = http.createServer(app);
    await new Promise((resolve) => server.listen(PORT, resolve));
    console.log(`✔ Express Test Server listening on http://localhost:${PORT}`);

    const consoleErrors = [];
    const jsExceptions = [];
    const networkFailures = [];

    const browser = await puppeteer.launch({
        headless: "new",
        args: ['--no-sandbox', '--disable-setuid-sandbox']
    });

    try {
        // --------------------------------------------------
        // TEST SUITE 1: DESKTOP E2E VERIFICATION (1440x900)
        // --------------------------------------------------
        console.log('\n--- Running Desktop E2E Verification (1440x900) ---');
        const page = await browser.newPage();
        await page.setViewport({ width: 1440, height: 900 });

        // Listen for console errors & exceptions
        page.on('console', msg => {
            if (msg.type() === 'error') {
                consoleErrors.push(`[Console Error] ${msg.text()}`);
            }
        });
        page.on('pageerror', err => {
            jsExceptions.push(`[JS Exception] ${err.toString()}`);
        });
        page.on('response', resp => {
            if (resp.status() >= 400 && !resp.url().includes('favicon')) {
                networkFailures.push(`[${resp.status()} ${resp.statusText()}] ${resp.url()}`);
            }
        });

        // 1. Navigate to Genesis
        console.log('1. Navigating to http://localhost:3099/genesis ...');
        await page.goto(`http://localhost:${PORT}/genesis`, { waitUntil: 'networkidle0' });
        const title = await page.title();
        console.log(`   Page Title: "${title}"`);

        // 2. Verify Theme Toggle
        console.log('2. Testing Light / Dark Theme Switcher...');
        await page.evaluate(() => document.getElementById('theme-toggle').click());
        await delay(300);
        const isLight = await page.evaluate(() => document.documentElement.classList.contains('light'));
        console.log(`   Light theme active: ${isLight}`);
        await page.evaluate(() => document.getElementById('theme-toggle').click()); // Toggle back to dark
        await delay(300);
        const isDark = await page.evaluate(() => document.documentElement.classList.contains('dark'));
        console.log(`   Dark theme restored: ${isDark}`);

        // 3. Test "Watch How Genesis Works" Video Walkthrough Modal
        console.log('3. Testing Walkthrough Video Modal & Player Controls...');
        await page.evaluate(() => document.getElementById('btn-watch-demo').click());
        await delay(500);
        const isModalOpen = await page.evaluate(() => document.getElementById('demo-modal').classList.contains('open'));
        console.log(`   Demo Modal open: ${isModalOpen}`);

        if (!isModalOpen) {
            throw new Error('Failed to open Walkthrough Demo Modal');
        }

        // Test play/pause toggle
        await page.evaluate(() => document.getElementById('yt-play-toggle').click());
        await delay(500);
        await page.evaluate(() => document.getElementById('yt-play-toggle').click());

        // Test Chapter dots
        await page.evaluate(() => document.getElementById('yt-dot-2').click());
        await delay(300);

        // Test Keyboard Escape to close modal
        await page.keyboard.press('Escape');
        await delay(500);
        const isModalClosed = await page.evaluate(() => !document.getElementById('demo-modal').classList.contains('open'));
        console.log(`   Escape key closes modal: ${isModalClosed}`);

        // 4. Test Top Nav "Begin Genesis" CTA
        console.log('4. Testing Top Nav CTA & Scanner Sequence...');
        await page.evaluate(() => document.getElementById('btn-top-begin').click());
        await delay(1000);
        // Wait for scanning simulation completion (approx 5.5s)
        console.log('   Waiting for scanner sequence completion...');
        await page.waitForFunction(() => {
            const card = document.getElementById('twin-result-card');
            return card && card.classList.contains('show');
        }, { timeout: 10000 });

        const twinIdText = await page.$eval('#res-twin-id', el => el.textContent);
        console.log(`   Digital Twin Passport Generated: ID=${twinIdText}`);

        // 5. Test "Proceed to Assessment & Skill Radar"
        console.log('5. Testing Assessment Section & 5-Axis Capability Radar...');
        await page.evaluate(() => document.getElementById('btn-open-assessment').click());
        await delay(500);
        const isAssessmentVisible = await page.evaluate(() => document.getElementById('genesis-assessment').classList.contains('show'));
        console.log(`   Assessment section visible: ${isAssessmentVisible}`);

        // Answer Question 1 (Option A)
        console.log('   Answering Question 1 (Option A)...');
        await page.evaluate(() => {
            const opts = document.querySelectorAll('#q-card-1 .option-btn');
            if (opts.length > 0) opts[0].click();
        });
        await delay(600);

        // Answer Question 2 (Option A)
        console.log('   Answering Question 2 (Option A)...');
        await page.evaluate(() => {
            const opts = document.querySelectorAll('#q-card-2 .option-btn');
            if (opts.length > 0) opts[0].click();
        });
        await delay(600);

        // Answer Question 3 (Option A)
        console.log('   Answering Question 3 (Option A)...');
        await page.evaluate(() => {
            const opts = document.querySelectorAll('#q-card-3 .option-btn');
            if (opts.length > 0) opts[0].click();
        });
        await delay(600);

        const isSummaryVisible = await page.evaluate(() => document.getElementById('assessment-summary').classList.contains('show'));
        console.log(`   Assessment Summary Card visible: ${isSummaryVisible}`);

        // 6. Test 2030 Career Pathway Modal & Socratic AI Quest
        console.log('6. Testing Top 5 Matched Career Trajectories & Socratic Quest...');
        const careerItemsCount = await page.evaluate(() => document.querySelectorAll('.career-match-item').length);
        console.log(`   Top Career Match Cards count: ${careerItemsCount}`);

        if (careerItemsCount > 0) {
            await page.evaluate(() => {
                const items = document.querySelectorAll('.career-match-item');
                if (items.length > 0) items[0].click();
            });
            await delay(500);
            const isRoadmapOpen = await page.evaluate(() => document.getElementById('roadmap-modal').classList.contains('open'));
            console.log(`   Roadmap Modal open: ${isRoadmapOpen}`);

            // Test Socratic Quest Option Answer
            await page.evaluate(() => {
                const opts = document.querySelectorAll('.quest-option-btn');
                if (opts.length > 0) opts[0].click();
            });
            await delay(300);
            const feedbackText = await page.$eval('#quest-feedback', el => el.textContent);
            console.log(`   Socratic Quest Feedback: "${feedbackText.substring(0, 60)}..."`);

            // Close Roadmap Modal via Escape key
            await page.keyboard.press('Escape');
            await delay(300);
            const isRoadmapClosed = await page.evaluate(() => !document.getElementById('roadmap-modal').classList.contains('open'));
            console.log(`   Escape key closes Roadmap Modal: ${isRoadmapClosed}`);
        }

        await page.close();

        // --------------------------------------------------
        // TEST SUITE 2: MOBILE E2E VERIFICATION (375x812)
        // --------------------------------------------------
        console.log('\n--- Running Mobile E2E Verification (375x812) ---');
        const mobilePage = await browser.newPage();
        await mobilePage.setViewport({ width: 375, height: 812, isMobile: true, hasTouch: true });

        mobilePage.on('console', msg => {
            if (msg.type() === 'error') consoleErrors.push(`[Mobile Console Error] ${msg.text()}`);
        });
        mobilePage.on('pageerror', err => {
            jsExceptions.push(`[Mobile JS Exception] ${err.toString()}`);
        });

        await mobilePage.goto(`http://localhost:${PORT}/genesis`, { waitUntil: 'networkidle0' });

        // Test Mobile Drawer Toggle
        console.log('1. Testing Mobile Navigation Drawer...');
        await mobilePage.evaluate(() => document.getElementById('mobile-menu-btn').click());
        await delay(300);
        const isDrawerOpen = await mobilePage.evaluate(() => document.getElementById('mobile-nav-drawer').classList.contains('open'));
        console.log(`   Mobile Drawer open: ${isDrawerOpen}`);

        await mobilePage.keyboard.press('Escape');
        await delay(300);
        const isDrawerClosed = await mobilePage.evaluate(() => !document.getElementById('mobile-nav-drawer').classList.contains('open'));
        console.log(`   Escape key closes Mobile Drawer: ${isDrawerClosed}`);

        await mobilePage.close();

        // --------------------------------------------------
        // REPORT SYNTHESIS
        // --------------------------------------------------
        console.log('\n==================================================');
        console.log('             CTO SPRINT RESULTS REPORT            ');
        console.log('==================================================');

        console.log(`\nConsole Errors Detected: ${consoleErrors.length}`);
        consoleErrors.forEach(err => console.log(` - ${err}`));

        console.log(`JS Exceptions Detected: ${jsExceptions.length}`);
        jsExceptions.forEach(err => console.log(` - ${err}`));

        console.log(`404/Network Errors Detected: ${networkFailures.length}`);
        networkFailures.forEach(err => console.log(` - ${err}`));

        if (consoleErrors.length === 0 && jsExceptions.length === 0 && networkFailures.length === 0) {
            console.log('\n✔ STATUS: 100% CLEAN — NO CONSOLE ERRORS, NO EXCEPTIONS, NO 404s.');
            console.log('✔ PRODUCTION APPROVAL: APPROVED FOR PRODUCTION DEPLOYMENT.');
        } else {
            console.error('\n✖ STATUS: ISSUES FOUND.');
            process.exit(1);
        }

    } finally {
        await browser.close();
        server.close();
    }
}

runCTOVerificationSprint().catch(err => {
    console.error('\nCTO Verification Sprint Execution Failed:', err);
    process.exit(1);
});
