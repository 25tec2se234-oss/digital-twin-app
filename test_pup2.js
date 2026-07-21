const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch({ headless: "new" });
  const page = await browser.newPage();
  page.on('console', msg => console.log('PAGE LOG:', msg.text()));
  page.on('pageerror', error => console.log('PAGE ERROR:', error.message));
  
  await page.goto('file:///C:/Users/Kumar%20Kartikey/.vscode%20DTwin/public/index.html', { waitUntil: 'networkidle0' });
  
  // Wait a bit just in case
  await new Promise(r => setTimeout(r, 1000));

  const gridHtml = await page.$eval('#career-grid', el => el.innerHTML).catch(e => e.message);
  const gridStyle = await page.$eval('#career-grid', el => el.style.display).catch(e => e.message);
  console.log('GRID HTML LENGTH:', gridHtml.length);
  console.log('GRID DISPLAY:', gridStyle);
  await browser.close();
})();
