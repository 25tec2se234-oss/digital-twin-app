const puppeteer = require('puppeteer');

(async () => {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    
    await page.setViewport({ width: 1280, height: 720 });
    
    console.log('Navigating to http://localhost:8080/futureverse');
    try {
        await page.goto('http://localhost:8080/futureverse', { waitUntil: 'networkidle0' });
        console.log('Page loaded');
        
        // Wait 3 seconds to let any initialization finish
        await new Promise(r => setTimeout(r, 3000));
        
        await page.screenshot({ path: 'public/futureverse/puppeteer_screenshot.png' });
        console.log('Screenshot saved to public/futureverse/puppeteer_screenshot.png');
        
    } catch (e) {
        console.log('Navigation error:', e);
    }
    
    await browser.close();
})();
