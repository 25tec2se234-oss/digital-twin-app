const puppeteer = require('puppeteer');
const fs = require('fs');

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
            if (typeof showToast === 'function') {
                showToast('S', 'Logged in successfully!');
            }
        });
        
        await new Promise(r => setTimeout(r, 500));

        await page.screenshot({ path: 'scratch/toast_mobile_test.png' });

        const info = await page.evaluate(() => {
            const toast = document.getElementById('toast');
            const tmsg = document.getElementById('tmsg');
            const tic = document.getElementById('tic');
            if (!toast) return 'No toast';
            return {
                toastClass: toast.className,
                toastStyle: window.getComputedStyle(toast).display,
                toastWidth: toast.offsetWidth,
                toastHeight: toast.offsetHeight,
                toastColor: window.getComputedStyle(toast).color,
                tmsgWidth: tmsg ? tmsg.offsetWidth : null,
                tmsgText: tmsg ? tmsg.textContent : null,
                tmsgColor: tmsg ? window.getComputedStyle(tmsg).color : null,
                tmsgDisplay: tmsg ? window.getComputedStyle(tmsg).display : null,
                ticDisplay: tic ? window.getComputedStyle(tic).display : null,
            };
        });
        console.log('Toast info:', info);

        await browser.close();
    } catch (e) {
        console.error(e);
    }
})();
