const puppeteer = require('puppeteer');

(async () => {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    
    page.on('console', msg => console.log('PAGE LOG:', msg.text()));
    page.on('pageerror', error => console.log('PAGE ERROR:', error.message));
    page.on('response', response => {
        if (!response.ok()) {
            console.log('FAILED REQUEST:', response.url(), response.status());
        }
    });

    console.log('Navigating to http://localhost:8080/futureverse');
    try {
        await page.goto('http://localhost:8080/futureverse', { waitUntil: 'networkidle0' });
        console.log('Page loaded');
    } catch (e) {
        console.log('Navigation error:', e);
    }
    
    await browser.close();
})();
