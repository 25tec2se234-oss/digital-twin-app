const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();
  
  page.on('console', msg => console.log('BROWSER CONSOLE:', msg.text()));
  page.on('pageerror', err => console.log('BROWSER ERROR:', err.message));
  
  await page.goto('http://localhost:3001', { waitUntil: 'networkidle0' });
  
  const careersLength = await page.evaluate(() => typeof CAREERS !== 'undefined' ? CAREERS.length : 'undefined');
  console.log('CAREERS length on load:', careersLength);
  
  let gridHTML = await page.evaluate(() => document.getElementById('career-grid') ? document.getElementById('career-grid').innerHTML.length : 'no grid');
  console.log('Grid HTML length on load:', gridHTML);
  
  console.log('Clicking Technology button...');
  await page.evaluate(() => {
    const btns = Array.from(document.querySelectorAll('.df'));
    const techBtn = btns.find(b => b.textContent.includes('Technology'));
    if (techBtn) {
        techBtn.click();
    } else {
        console.log('Tech button not found');
    }
  });
  
  await new Promise(r => setTimeout(r, 1000));
  
  gridHTML = await page.evaluate(() => document.getElementById('career-grid') ? document.getElementById('career-grid').innerHTML : 'no grid');
  console.log('Grid HTML after click length:', gridHTML.length);
  if (gridHTML.includes('No careers found')) {
      console.log('NO CAREERS FOUND TEXT IS PRESENT');
      
      const debugInfo = await page.evaluate(() => {
          return {
              currentCategory: typeof currentCategory !== 'undefined' ? currentCategory : 'undefined',
              currentSearchQuery: typeof currentSearchQuery !== 'undefined' ? currentSearchQuery : 'undefined',
              filteredListLength: typeof currentFilteredList !== 'undefined' ? currentFilteredList.length : 'undefined',
          };
      });
      console.log('Debug info:', debugInfo);
  }
  
  await browser.close();
})();
