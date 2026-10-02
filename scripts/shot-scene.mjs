// Captures the opening scene at rest in each chapter of its film.
// usage: node scripts/shot-scene.mjs <url> <outPrefix> [width] [height]
// The resting points mirror components/scene/film.ts (SCROLL and restAt).
import { chromium } from "playwright-core";

const [url, prefix, width = "1440", height = "900"] = process.argv.slice(2);
const SCROLL = { intro: 0.85, rest: 0.4, chapter: 0.8, moving: 0.7 };
const restAt = (chapter) =>
  chapter <= 0
    ? SCROLL.intro + SCROLL.rest * 0.5
    : SCROLL.intro + SCROLL.rest + (chapter - 1) * SCROLL.chapter + SCROLL.chapter * (SCROLL.moving + 0.1);

const browser = await chromium.launch({
  executablePath: process.env.CHROMIUM_PATH ?? "/Applications/Brave Browser.app/Contents/MacOS/Brave Browser",
  headless: false,
  args: ["--window-position=-3000,0", "--hide-scrollbars"],
});
const page = await browser.newPage({ viewport: { width: Number(width), height: Number(height) } });
page.on("pageerror", (error) => console.log(`[pageerror] ${error.message}`));
await page.goto(url, { waitUntil: "networkidle" });
const vh = Number(height);
const stops = [["hero", 0], ["rising", 0.4], ...Array.from({ length: 8 }, (_, i) => [`ch${i}`, restAt(i)]), ["exit", 7.6]];
for (const [name, at] of stops) {
  await page.evaluate((top) => window.scrollTo({ top, behavior: "instant" }), Math.round(at * vh));
  await page.waitForTimeout(name === "hero" ? 2500 : 2200);
  await page.screenshot({ path: `${prefix}-${name}.png` });
}
console.log("done");
await browser.close();
