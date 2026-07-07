const puppeteer = require('puppeteer');

(async () => {
    try {
        const browser = await puppeteer.launch({ 
            headless: true, 
            args: ['--no-sandbox'] 
        });
        const page = await browser.newPage();
        
        await page.setViewport({ width: 375, height: 667, isMobile: true, hasTouch: true });
        await page.goto('http://localhost:3000', { waitUntil: 'networkidle0' });

        await page.evaluate(() => {
            const hbg = document.querySelector('.hbg');
            if (hbg) hbg.click();
        });
        await new Promise(r => setTimeout(r, 500));

        await page.evaluate(() => {
            const signinBtn = document.getElementById('mob-signin');
            if (signinBtn) signinBtn.click();
        });
        await new Promise(r => setTimeout(r, 1000));

        const info = await page.evaluate(() => {
            const footer = document.querySelector('footer, .ft');
            const authPage = document.getElementById('page-auth');
            
            return {
                footerExists: !!footer,
                footerDisplay: footer ? window.getComputedStyle(footer).display : null,
                footerRect: footer ? footer.getBoundingClientRect() : null,
                authRect: authPage ? authPage.getBoundingClientRect() : null,
                scrollY: window.scrollY
            };
        });
        console.log('Layout info:', info);

        await browser.close();
    } catch (e) {
        console.error(e);
    }
})();
