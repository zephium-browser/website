// Opt-in live integration check. The new static export is served only inside
// an isolated browser at the approved website origin. The staging API is NOT
// intercepted or proxied: Chromium supplies Origin and enforces real CORS/TLS.
// This does not deploy or change the public website, and sends one submission.
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { extname, resolve, sep } from "node:path";
import { chromium } from "playwright-core";

const api = "https://staging-api.zephium.app";
const web = "https://zephium.app";
const endpoint = `${api}/v1/waitlists/linux`;
const email = process.env.WAITLIST_TEST_EMAIL;
assert(process.env.RUN_STAGING_WAITLIST_TEST === "true", "Set RUN_STAGING_WAITLIST_TEST=true only after operator approval.");
assert(email?.trim(), "An operator-approved WAITLIST_TEST_EMAIL is required.");
assert(process.env.NEXT_PUBLIC_LINUX_WAITLIST_ENABLED === "true" && process.env.NEXT_PUBLIC_LINUX_WAITLIST_API_ORIGIN === api, "Build the enabled staging export and pass the same environment to this test.");
const root = resolve("out");
const types = { ".html": "text/html", ".js": "application/javascript", ".css": "text/css", ".woff2": "font/woff2", ".png": "image/png", ".ico": "image/x-icon", ".svg": "image/svg+xml", ".json": "application/json", ".txt": "text/plain" };
const source = await readFile(resolve(root, "download.html"), "utf8");
assert(!source.includes("data-website-id"), "Build without analytics for live qualification.");
const browser = await chromium.launch({
  executablePath: process.env.CHROMIUM_PATH ?? (process.platform === "darwin" ? "/Applications/Brave Browser.app/Contents/MacOS/Brave Browser" : undefined),
  headless: true,
});
try {
  const context = await browser.newContext();
  const requests = [];
  const logs = [];
  const failures = [];
  // Only static website assets are replaced. No route matches the live endpoint.
  await context.route(`${web}/**`, async (route) => {
    const url = new URL(route.request().url());
    const path = resolve(root, `.${decodeURIComponent(url.pathname)}`);
    if (!path.startsWith(`${root}${sep}`)) return route.abort();
    let data;
    let file;
    for (const candidate of [path, `${path}.html`]) {
      try { data = await readFile(candidate); file = candidate; break; } catch { /* Try the clean URL's HTML. */ }
    }
    if (!data) return route.fulfill({ status: 404, body: "Not found" });
    return route.fulfill({
      status: 200,
      headers: {
        "content-type": types[extname(file)] ?? "application/octet-stream",
        "cache-control": "no-store",
        "content-security-policy": `default-src 'self'; script-src 'self' 'unsafe-inline'; connect-src 'self' ${api}; style-src 'self' 'unsafe-inline'; img-src 'self' data:; font-src 'self' data:; object-src 'none'; base-uri 'self'; form-action 'self'; frame-ancestors 'none'`,
      },
      body: data,
    });
  });
  await context.route((url) => url.origin !== web && url.href !== endpoint, (route) => route.abort());
  const page = await context.newPage();
  page.on("console", (message) => logs.push(message.text()));
  page.on("pageerror", () => failures.push("Browser page error"));
  page.on("request", (request) => { if (request.url() === endpoint && request.method() === "POST") requests.push(request); });
  await page.goto(`${web}/download`, { waitUntil: "domcontentloaded" });
  assert.equal(requests.length, 0, "No signup on load");
  await page.waitForFunction(() => Object.keys(document.querySelector("#linux form") ?? {}).some((key) => key.startsWith("__reactProps")));
  await page.getByLabel("Email address", { exact: true }).fill(email.trim());
  const responsePromise = page.waitForResponse((response) => response.url() === endpoint && response.request().method() === "POST", { timeout: 20000 });
  await page.getByLabel("Email address", { exact: true }).press("Enter");
  const response = await responsePromise;
  const headers = await response.request().allHeaders();
  assert.equal(headers.origin, web, "Use Chromium's approved Origin");
  assert(!headers.cookie && !headers.authorization && !headers.referer, "No customer credentials or referrer");
  assert(JSON.stringify(response.request().postDataJSON()) === JSON.stringify({ email: email.trim(), website: "" }), "Unexpected signup body");
  assert.equal(response.headers()["access-control-allow-origin"], web, "Live CORS must allow the exact website origin");
  const thanks = page.getByRole("heading", { name: "You're on the list." });
  const unsure = page.getByText("We couldn't confirm that. Please try again in a moment.");
  if (response.status() === 429) {
    await page.getByRole("button", { name: /Try again in/ }).waitFor();
    console.log("Staging returned 429; the website shows its countdown. No automatic retry was made.");
    process.exitCode = 1;
  } else {
    assert.equal(response.status(), 202, "Expected staging acceptance");
    assert((await response.json()).accepted === true, "Expected accepted:true");
    await thanks.waitFor();
    assert.equal(await thanks.evaluate((node) => node === document.activeElement), true);
    assert.equal(await unsure.count(), 0);
    console.log("Staging browser check passed: one accepted submission, exact Origin/CORS, cookie-free request, single-step thank-you.");
  }
  assert.equal(requests.length, 1, "Exactly one explicit signup");
  assert(!logs.some((message) => message.includes(email)), "Email appeared in browser logs");
  // Only the joined flag may be kept in the browser, never the address.
  const stored = await page.evaluate(() => JSON.stringify({ ...localStorage, ...sessionStorage }));
  assert(!stored.includes(email), "Email kept in browser storage");
  assert.equal((await context.cookies()).length, 0);
  assert.deepEqual(failures, []);
} finally {
  await browser.close();
}
