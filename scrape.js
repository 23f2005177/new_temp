const { chromium } = require('playwright');

async function scrapeTables() {
  const browser = await chromium.launch({ headless: true });
  const totalSum = { sum: 0 };
  
  const urls = [
    'https://sanand0.github.io/tdsdata/js_table/?seed=23',
    'https://sanand0.github.io/tdsdata/js_table/?seed=24',
    'https://sanand0.github.io/tdsdata/js_table/?seed=25',
    'https://sanand0.github.io/tdsdata/js_table/?seed=26',
    'https://sanand0.github.io/tdsdata/js_table/?seed=27',
    'https://sanand0.github.io/tdsdata/js_table/?seed=28',
    'https://sanand0.github.io/tdsdata/js_table/?seed=29',
    'https://sanand0.github.io/tdsdata/js_table/?seed=30',
    'https://sanand0.github.io/tdsdata/js_table/?seed=31',
    'https://sanand0.github.io/tdsdata/js_table/?seed=32'
  ];

  for (const url of urls) {
    const page = await browser.newPage();
    await page.goto(url, { waitUntil: 'networkidle' }); // Wait for dynamic tables
    
    // Find all table cells, extract numbers
    const numbers = await page.evaluate(() => {
      const nums = [];
      document.querySelectorAll('table td, table th').forEach(cell => {
        const text = cell.textContent.trim();
        const num = parseFloat(text);
        if (!isNaN(num)) nums.push(num);
      });
      return nums;
    });
    
    const pageSum = numbers.reduce((a, b) => a + b, 0);
    totalSum.sum += pageSum;
    
    console.log(`Seed ${url.match(/seed=(\d+)/)[1]} sum: ${pageSum.toFixed(2)}`);
    await page.close();
  }
  
  await browser.close();
  console.log(`\n🎯 GRAND TOTAL SUM OF ALL TABLES: ${totalSum.sum.toFixed(2)}`);
  return totalSum.sum;
}

scrapeTables();
