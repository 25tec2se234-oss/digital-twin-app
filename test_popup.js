const puppeteer = require('puppeteer');

(async () => {
    try {
        console.log("Launching browser...");
        const browser = await puppeteer.launch({ args: ['--no-sandbox', '--disable-setuid-sandbox'] });
        const page = await browser.newPage();
        await page.setViewport({ width: 1280, height: 800 });
        
        console.log("Navigating to localhost...");
        await page.goto('http://localhost:3000', { waitUntil: 'networkidle0' });
        
        console.log("Triggering payment modal directly via DOM...");
        await page.evaluate(() => {
            const rzpModal = document.getElementById('rzp-payment-modal');
            if (rzpModal) rzpModal.style.display = 'flex';
            
            const c6m = document.getElementById('rzp-container-6m');
            if (c6m) c6m.style.display = 'block';
        });
        
        await new Promise(r => setTimeout(r, 2000));
        
        console.log("Taking screenshot of modal...");
        await page.screenshot({ path: 'modal_debug_1.png' });
        
        console.log("Checking if checkboxes are enabled...");
        const areCheckboxesEnabled = await page.evaluate(() => {
            const cb = document.querySelector('.consent-cb');
            return cb && !cb.disabled;
        });
        console.log("Checkboxes enabled initially:", areCheckboxesEnabled);
        
        console.log("Trying to accept terms...");
        await page.evaluate(() => {
            // Force scroll to bottom
            const termsBox = document.getElementById('termsBox');
            if(termsBox) {
                termsBox.scrollTop = termsBox.scrollHeight;
                termsBox.dispatchEvent(new Event('scroll'));
            }
        });
        
        await new Promise(r => setTimeout(r, 1000));
        
        const areCheckboxesEnabledAfter = await page.evaluate(() => {
            const cb = document.querySelector('.consent-cb');
            return cb && !cb.disabled;
        });
        console.log("Checkboxes enabled after scroll:", areCheckboxesEnabledAfter);
        
        await page.screenshot({ path: 'modal_debug_2_scrolled.png' });
        
        await page.evaluate(() => {
            const checkboxes = document.querySelectorAll('.consent-cb');
            checkboxes.forEach(cb => {
                cb.checked = true;
                cb.dispatchEvent(new Event('change'));
            });
            const unlockBtn = document.getElementById('unlockPayBtn');
            if(unlockBtn) {
                unlockBtn.click();
            }
        });
        
        await new Promise(r => setTimeout(r, 2000));
        await page.screenshot({ path: 'modal_debug_3_unlocked.png' });
        
        await browser.close();
        console.log("Done testing.");
    } catch (e) {
        console.error("Test failed:", e);
    }
})();
