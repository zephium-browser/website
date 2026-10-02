// Captures the page after the opening scene, one screen at a time.
// usage: node scripts/shot-pages.mjs <url> <outPrefix> [width] [height] [step]
import { chromium } from "playwright-core";

const [url, prefix, width = "1440", height = "900", step = "0.9"] = process.argv.slice(2);
const browser = await chromium.launch({
  executablePath: process.env.CHROMIUM_PATH ?? "/Applications/Brave Browser.app/Contents/MacOS/Brave Browser",
  headless: false,
  args: ["--window-position=-3000,0", "--hide-scrollbars"],
});
const page = await browser.newPage({ viewport: { width: Number(width), height: Number(height) } });
page.on("pageerror", (error) => console.log(`[pageerror] ${error.message}`));
page.on("response", (response) => {
  if (response.status() >= 400) console.log(`[${response.status()}] ${response.url()}`);
});
await page.goto(url, { waitUntil: "networkidle" });
const [start, end] = await page.evaluate(() => {
  const sections = [...document.querySelectorAll("main > section")];
  return [sections[1].offsetTop, document.documentElement.scrollHeight - innerHeight];
});
let index = 0;
for (let y = start; y <= end + 1; y += Number(height) * Number(step)) {
  // Scroll in small steps so scroll-driven animations see real progress.
  await page.evaluate((top) => window.scrollTo({ top, behavior: "instant" }), Math.min(y, end));
  await page.waitForTimeout(1300);
  await page.screenshot({ path: `${prefix}-${String(index++).padStart(2, "0")}.png` });
}
console.log(`shots: ${index}`);
await browser.close();
