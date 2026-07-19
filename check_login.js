const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  
  await page.setViewport({ width: 1280, height: 800 });

  try {
    await page.goto('http://localhost:3000/index.html', { waitUntil: 'networkidle2', timeout: 30000 });
    
    // Trigger login
    await page.evaluate(() => {
        if(typeof showPage === 'function') {
            showPage('page-auth');
        } else {
            const pageAuth = document.getElementById('page-auth');
            if(pageAuth) {
                pageAuth.classList.add('active');
            }
        }
    });

    // Wait a bit for the iframe to load
    await new Promise(r => setTimeout(r, 2000));

    await page.screenshot({ path: 'screenshot_fixed_login.png' });
    console.log('Screenshot saved to screenshot_fixed_login.png');

  } catch (error) {
    console.error('Error during puppeteer execution:', error);
  } finally {
    await browser.close();
  }
})();
