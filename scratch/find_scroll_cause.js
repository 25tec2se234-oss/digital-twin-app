const puppeteer = require('puppeteer');

(async () => {
    try {
        const browser = await puppeteer.launch({ 
            headless: true, 
            args: ['--no-sandbox'] 
        });
        const page = await browser.newPage();
        
        await page.setViewport({ width: 375, height: 667, isMobile: true, hasTouch: true });
        
        await page.goto('http://localhost:3001', { waitUntil: 'networkidle0' });
        await new Promise(r => setTimeout(r, 2000));

        const info = await page.evaluate(() => {
            const footer = document.querySelector('footer');
            if (!footer) return 'No footer found';
            
            const footerBottom = footer.getBoundingClientRect().bottom + window.scrollY;
            const bodyHeight = document.body.scrollHeight;
            const htmlHeight = document.documentElement.scrollHeight;
            
            const elementsBelow = [];
            document.querySelectorAll('body *').forEach(el => {
                const style = window.getComputedStyle(el);
                if (style.display !== 'none' && style.position !== 'fixed') {
                    const rect = el.getBoundingClientRect();
                    const elBottom = rect.bottom + window.scrollY;
                    if (elBottom > footerBottom && rect.height > 0) {
                        elementsBelow.push({
                            tag: el.tagName,
                            id: el.id,
                            className: el.className,
                            bottom: elBottom,
                            display: style.display,
                            position: style.position,
                            height: rect.height,
                            text: el.innerText ? el.innerText.substring(0, 20) : ''
                        });
                    }
                }
            });
            
            return {
                footerBottom,
                bodyHeight,
                htmlHeight,
                elementsBelow
            };
        });
        
        console.log('Scroll Info:', JSON.stringify(info, null, 2));

        await browser.close();
        process.exit(0);
    } catch (e) {
        console.error(e);
        process.exit(1);
    }
})();
