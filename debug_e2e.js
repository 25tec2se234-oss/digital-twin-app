const http = require('http');
const puppeteer = require('puppeteer');
const app = require('./src/app');

async function debugModal() {
    const PORT = 3099;
    const server = http.createServer(app);
    await new Promise((r) => server.listen(PORT, r));

    const browser = await puppeteer.launch({ headless: "new" });
    const page = await browser.newPage();

    page.on('console', msg => console.log('PAGE LOG:', msg.text()));
    page.on('pageerror', err => console.error('PAGE ERROR:', err));

    await page.goto(`http://localhost:${PORT}/genesis`, { waitUntil: 'networkidle0' });

    const btnExists = await page.evaluate(() => !!document.getElementById('btn-watch-demo'));
    console.log('watchDemoBtn exists in DOM:', btnExists);

    const modalExists = await page.evaluate(() => !!document.getElementById('demo-modal'));
    console.log('demoModal exists in DOM:', modalExists);

    await page.evaluate(() => {
        const btn = document.getElementById('btn-watch-demo');
        btn.click();
    });

    const isModalOpen = await page.evaluate(() => document.getElementById('demo-modal').classList.contains('open'));
    console.log('Is Modal Open after click:', isModalOpen);

    await browser.close();
    server.close();
}

debugModal();
