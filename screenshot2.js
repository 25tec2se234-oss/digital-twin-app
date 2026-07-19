const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  
  await page.setViewport({ width: 1280, height: 800 });

  try {
    await page.goto('http://localhost:5173', { waitUntil: 'networkidle0', timeout: 15000 });
  } catch (e) {
    console.log("Could not load localhost:5173:", e.message);
  }

  await page.screenshot({ path: 'screenshot_original.png' });
  
  const rootHtml = await page.evaluate(() => {
    return document.querySelector('#root').outerHTML;
  });
  
  const fs = require('fs');
  fs.writeFileSync('root_html.txt', rootHtml);
  
  console.log("Saved root_html.txt");

  await browser.close();
})();
