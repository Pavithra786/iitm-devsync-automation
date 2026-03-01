const { chromium } = require('playwright');

const SEEDS = [33, 34, 35, 36, 37, 38, 39, 40, 41, 42];

async function scrapeTable(page, seed) {
  const url = `https://tds-playwright-grader.vercel.app/table?seed=${seed}`;
  await page.goto(url, { waitUntil: 'networkidle' });

  const numbers = await page.evaluate(() => {
    const cells = document.querySelectorAll('table td, table th');
    const nums = [];
    cells.forEach(cell => {
      const text = cell.innerText.trim();
      const num = parseFloat(text);
      if (!isNaN(num)) nums.push(num);
    });
    return nums;
  });

  const seedSum = numbers.reduce((a, b) => a + b, 0);
  console.log(`Seed ${seed}: found ${numbers.length} numbers, sum = ${seedSum}`);
  return seedSum;
}

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();

  let grandTotal = 0;
  for (const seed of SEEDS) {
    const sum = await scrapeTable(page, seed);
    grandTotal += sum;
  }

  await browser.close();
  console.log(`\n=============================`);
  console.log(`GRAND TOTAL: ${grandTotal}`);
  console.log(`=============================`);
})();
