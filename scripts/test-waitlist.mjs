// Browser contract tests against an existing static export. All API traffic is
// intercepted; no email is delivered. Build with the same environment first:
//   disabled (default)  NEXT_PUBLIC_LINUX_WAITLIST_ENABLED=false, no origin
//   mocked staging      ENABLED=true and the staging origin
//   unsubscribe only    ENABLED=false with an origin set
import assert from "node:assert/strict";
import { spawn, spawnSync } from "node:child_process";
import { access, readFile } from "node:fs/promises";
import { chromium } from "playwright-core";

const enabled = process.env.NEXT_PUBLIC_LINUX_WAITLIST_ENABLED === "true";
const api = process.env.NEXT_PUBLIC_LINUX_WAITLIST_API_ORIGIN;
const unsubscribeEnabled = ["https://api.zephium.app", "https://staging-api.zephium.app"].includes(api);
const email = "linux-notification-test@example.invalid";
const token = "synthetic-private-waitlist-token";
const memory = "zephium:linux-waitlist";
const externalBase = process.env.WAITLIST_TEST_BASE_URL;
const server = externalBase ? null : spawn(process.execPath, ["scripts/serve.mjs"], {
  env: { ...process.env, PORT: "0" }, stdio: ["ignore", "pipe", "inherit"],
});
const base = externalBase ?? await new Promise((resolve, reject) => {
  server.stdout.once("data", (data) => resolve(data.toString().trim()));
  server.once("error", reject);
  server.once("exit", (code) => reject(new Error(`Static server exited: ${code}`)));
});
let browser;
let passed = 0;
const problems = [];
const executablePath = process.env.CHROMIUM_PATH ?? (process.platform === "darwin"
  ? "/Applications/Brave Browser.app/Contents/MacOS/Brave Browser" : undefined);

async function test(name, run) {
  await run();
  passed++;
  console.log(`ok ${name}`);
}

const accepted = () => ({ status: 202, json: { accepted: true } });

/** A fresh browser context with every request intercepted and every privacy rule watched. */
async function fixture(handler = accepted, { linux = false, blockStorage = false } = {}) {
  const context = await browser.newContext(linux ? { userAgent: "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 Chrome/130 Safari/537.36" } : {});
  const calls = [];
  const requests = [];
  const logs = [];
  let firstRequest;
  const firstCall = new Promise((resolve) => { firstRequest = resolve; });
  await context.addInitScript(({ linux, blockStorage }) => {
    if (linux) Object.defineProperty(navigator, "userAgentData", { value: { platform: "Linux" } });
    if (blockStorage) {
      Object.defineProperty(window, "localStorage", { get() { throw new DOMException("blocked", "SecurityError"); } });
    }
    // Inspect request policy without recording request bodies in the page.
    const original = window.fetch;
    window.__waitlistPolicies = [];
    window.fetch = (input, init) => {
      const url = typeof input === "string" ? input : input instanceof URL ? input.href : input.url;
      if (url.includes("/v1/waitlists/linux")) {
        window.__waitlistPolicies.push({
          credentials: init?.credentials, cache: init?.cache,
          redirect: init?.redirect, referrerPolicy: init?.referrerPolicy,
          timeout: init?.signal instanceof AbortSignal,
        });
      }
      return original(input, init);
    };
  }, { linux, blockStorage });
  await context.route("**/*", async (route) => {
    const request = route.request();
    requests.push({ url: request.url(), body: request.postData() ?? "", headers: request.headers() });
    if (/^https:\/\/(?:staging-)?api\.zephium\.app\//.test(request.url())) {
      calls.push(request);
      firstRequest();
      assert.equal(new URL(request.url()).origin, api, "Only the build-time API origin may be used");
      assert.equal(request.method(), "POST");
      const headers = await request.allHeaders();
      assert.equal(headers["content-type"], "application/json");
      assert.equal(headers.authorization, undefined);
      assert.equal(headers.cookie, undefined);
      assert.equal(headers.referer, undefined);
      const reply = await handler(request);
      if (reply.abort) return route.abort("failed");
      return route.fulfill({
        status: reply.status,
        headers: { "content-type": "application/json", "access-control-allow-origin": "*", "access-control-expose-headers": "Retry-After", ...reply.headers },
        body: reply.raw ?? JSON.stringify(reply.json),
      });
    }
    // Never contact analytics, providers, GitHub or any other external service.
    if (new URL(request.url()).origin !== base) return route.abort();
    return route.continue();
  });
  const page = await context.newPage();
  page.on("console", (message) => logs.push(message.text()));
  page.on("pageerror", () => problems.push("Unexpected browser page error"));
  async function clean() {
    for (const request of requests) {
      assert(!request.url.includes(token) && !request.url.includes(email), "Private data in request URL");
      const privateBody = request.body.includes(token) || request.body.includes(email);
      assert(!privateBody || request.url.startsWith(`${api}/v1/waitlists/linux`), "Private data left the API contract");
      assert(!JSON.stringify(request.headers).includes(token), "Token in request headers");
    }
    assert(!logs.some((message) => message.includes(token) || message.includes(email)), "Private data in browser logs");
    if (!blockStorage) {
      // Only the joined flag may be kept, and never the address.
      const stored = await page.evaluate(() => JSON.stringify({ ...localStorage, ...sessionStorage }));
      assert(!stored.includes(email) && !stored.includes(token), "Private data in storage");
      assert(stored === "{}" || Object.keys(JSON.parse(stored)).join() === memory, "Unexpected storage keys");
    }
    assert(!await page.evaluate((secret) => JSON.stringify(history.state).includes(secret), token), "Token in history state");
    assert.equal((await context.cookies()).length, 0);
    assert(!await page.locator("body").innerText().then((text) => text.includes(token)), "Token rendered in page");
    for (const policy of await page.evaluate(() => window.__waitlistPolicies)) {
      assert.deepEqual(policy, { credentials: "omit", cache: "no-store", redirect: "error", referrerPolicy: "no-referrer", timeout: true });
    }
    await context.close();
  }
  return { page, calls, requests, context, clean, firstCall };
}

/** Opens the download page and waits until React owns the form, so Enter is not a native submit. */
async function openDownload(page, hash = "") {
  await page.goto(`${base}/download${hash}`);
  await page.waitForFunction(() => {
    const form = document.querySelector("#linux form");
    return !form || Object.keys(form).some((key) => key.startsWith("__reactProps"));
  });
}

const field = (page) => page.getByLabel("Email address", { exact: true });
const notify = (page) => page.getByRole("button", { name: /Notify me|Try again in/ });

async function signup(page, address = email) {
  await openDownload(page);
  await field(page).fill(address);
  await field(page).press("Enter");
}

const thanks = (page) => page.getByRole("heading", { name: "You're on the list." });
const status = (page, pattern) => page.locator('[role="status"]').filter({ hasText: pattern }).waitFor();

async function openLink(page, fragment = `#token=${token}`, path = "/linux/unsubscribe") {
  const response = await page.goto(`${base}${path}${fragment}`);
  await page.waitForFunction(() => !location.hash && !location.search);
  assert.equal(response.status(), 200);
  assert.equal(response.headers()["referrer-policy"], "no-referrer");
  assert.equal(response.headers()["cache-control"], "no-store");
  assert.match(response.headers()["x-robots-tag"], /noindex/);
  assert(!response.headers()["content-security-policy"].includes("analytics"));
  assert.equal(await page.locator('meta[name="referrer"]').getAttribute("content"), "no-referrer");
  assert.match(await page.locator('meta[name="robots"]').getAttribute("content"), /noindex/);
}

const unsubscribeButton = (page) => page.getByRole("button", { name: /^(Unsubscribe|Try again in)/ });

try {
  await test("invalid enable flags and non-allowlisted API origins fail configuration", async () => {
    for (const [flag, origin, expected] of [
      ["true", "", 1], ["true", "https://untrusted.example.invalid", 1],
      ["true", "https://api.zephium.app/", 1], ["yes", "https://api.zephium.app", 1],
      ["true", "https://api.zephium.app", 0], ["false", "", 0],
    ]) {
      const result = spawnSync(process.execPath, ["-e", "require('next/dist/server/config').default('phase-production-build', process.cwd()).catch(() => process.exit(1))"], {
        env: { ...process.env, NEXT_PUBLIC_LINUX_WAITLIST_ENABLED: flag, NEXT_PUBLIC_LINUX_WAITLIST_API_ORIGIN: origin },
        stdio: "ignore",
      });
      assert.equal(result.status, expected);
    }
  });
  browser = await chromium.launch({ executablePath, headless: true });

  await test("the unsubscribe page has no analytics and is not in the sitemap; the old confirm page is gone", async () => {
    const html = await readFile("out/linux/unsubscribe.html", "utf8");
    assert(!html.includes("analytics.example.invalid") && !html.includes("data-website-id"));
    assert(!(await readFile("out/sitemap.xml", "utf8")).includes("/linux/"));
    await assert.rejects(access("out/linux/confirm.html"));
    const response = await fetch(`${base}/linux/confirm`);
    assert.equal(response.status, 404);
  });

  await test("direct load, reload and aliases of the unsubscribe page have private headers and no external requests", async () => {
    for (const path of ["/linux/unsubscribe", "/linux/unsubscribe/", "/linux/unsubscribe.html"]) {
      const f = await fixture();
      await openLink(f.page, `#token=${token}`, path);
      if (unsubscribeEnabled) await unsubscribeButton(f.page).waitFor();
      assert.equal(f.calls.length, 0, "Following a link must never change membership");
      await f.page.reload();
      await f.page.getByText(unsubscribeEnabled ? /Open the link from your email/ : /not available right now/).waitFor();
      assert.equal(await f.page.getByRole("button").count(), 0);
      assert(f.requests.every((request) => new URL(request.url).origin === base));
      await f.clean();
    }
  });

  await test("the download menu opens from the keyboard, moves with arrows and closes with Escape", async () => {
    const f = await fixture();
    await f.page.setViewportSize({ width: 1280, height: 900 });
    await f.page.goto(`${base}/download`);
    const toggle = f.page.getByRole("button", { name: "More download options" }).first();
    await toggle.waitFor();
    assert.equal(await toggle.getAttribute("aria-expanded"), "false");
    assert.equal(await f.page.getByRole("link", { name: /^Download/ }).first().getAttribute("href"), "/download?start=1");
    await toggle.focus();
    await f.page.keyboard.press("Enter");
    assert.equal(await toggle.getAttribute("aria-expanded"), "true");
    const items = f.page.getByRole("menuitem");
    assert.equal(await items.count(), 5);
    assert.equal(await items.nth(0).evaluate((node) => node === document.activeElement), true);
    assert.equal(await items.nth(0).getAttribute("href"), "/download?start=macos");
    assert.equal(await items.nth(1).getAttribute("href"), "/download?start=windows");
    assert.equal(await items.nth(2).getAttribute("href"), "/download#linux");
    assert.equal(await items.nth(4).getAttribute("href"), "/changelog");
    await f.page.keyboard.press("End");
    assert.equal(await items.nth(4).evaluate((node) => node === document.activeElement), true);
    await f.page.keyboard.press("ArrowDown");
    assert.equal(await items.nth(0).evaluate((node) => node === document.activeElement), true);
    await f.page.keyboard.press("Escape");
    assert.equal(await toggle.getAttribute("aria-expanded"), "false");
    assert.equal(await toggle.evaluate((node) => node === document.activeElement), true);
    await toggle.click();
    await f.page.mouse.click(20, 500);
    assert.equal(await toggle.getAttribute("aria-expanded"), "false");
    await f.clean();
  });

  if (!enabled) {
    await test("disabled signup shows an intentional page: no form, no outage text, follow links", async () => {
      for (const linux of [false, true]) {
        const f = await fixture(accepted, { linux });
        await openDownload(f.page);
        await f.page.getByRole("heading", { name: "Zephium for Linux is on the way." }).waitFor();
        await f.page.getByText("News of the release goes out on Discord and X.").waitFor();
        assert.equal(await field(f.page).count(), 0);
        assert.equal(await f.page.getByRole("button", { name: "Notify me" }).count(), 0);
        assert.equal(await f.page.getByText(/temporarily unavailable/i).count(), 0);
        const links = f.page.locator("#linux a");
        assert.deepEqual(
          await links.evaluateAll((nodes) => nodes.filter((node) => node.textContent.trim()).map((node) => node.textContent.trim())),
          linux
            ? ["Watch the repo on GitHub", "Join the Discord", "Follow on X", "Download for Mac", "Download for Windows"]
            : ["Watch the repo on GitHub", "Join the Discord", "Follow on X"],
        );
        assert.equal(await f.page.locator("#linux-notification").count(), 1);
        assert.equal(f.calls.length, 0);
        await f.clean();
      }
    });
    if (unsubscribeEnabled) {
      await test("closing signup preserves explicit unsubscribe for existing members", async () => {
        const f = await fixture(() => ({ status: 200, json: { unsubscribed: true } }));
        await openLink(f.page, `#action=unsubscribe&token=${token}`);
        await unsubscribeButton(f.page).click();
        await status(f.page, /been unsubscribed/);
        assert.equal(f.calls.length, 1);
        assert.equal(new URL(f.calls[0].url()).pathname, "/v1/waitlists/linux/unsubscribe");
        await f.clean();
      });
    } else {
      await test("without an API origin the unsubscribe page offers no button", async () => {
        const f = await fixture();
        await openLink(f.page, `#action=unsubscribe&token=${token}`);
        assert.equal(await f.page.getByRole("button").count(), 0);
        assert.equal(f.calls.length, 0);
        await f.clean();
      });
    }
  } else {
    await test("success: pending state, no double submit, calm thank-you with focus and follow links", async () => {
      let release;
      const hold = new Promise((resolve) => { release = resolve; });
      const f = await fixture(async () => { await hold; return accepted(); });
      await openDownload(f.page);
      await field(f.page).fill(email);
      await field(f.page).press("Enter");
      await f.page.locator("#linux form[aria-busy=true]").waitFor();
      assert.equal(await notify(f.page).isDisabled(), true);
      assert.equal(await f.page.locator("#linux form button svg").count(), 1, "A spinner shows while pending");
      await f.page.locator("#linux form").evaluate((form) => {
        form.dispatchEvent(new Event("submit", { bubbles: true, cancelable: true }));
        form.dispatchEvent(new Event("submit", { bubbles: true, cancelable: true }));
      });
      await f.firstCall;
      assert.equal(f.calls.length, 1);
      assert.deepEqual(f.calls[0].postDataJSON(), { email, website: "" });
      release();
      await thanks(f.page).waitFor();
      await f.page.getByText("We'll send one email when Zephium for Linux is ready.").waitFor();
      assert.equal(await thanks(f.page).evaluate((node) => node === document.activeElement), true, "Focus moves to the result");
      assert.equal(await field(f.page).count(), 0, "The form is replaced in place");
      assert.equal(await f.page.getByText("While you wait").count(), 1);
      assert.equal(await f.page.getByRole("link", { name: "Watch the repo on GitHub" }).getAttribute("href"), "https://github.com/zephium-browser/Zephium");
      assert.equal(await f.page.getByRole("link", { name: "Join the Discord" }).count(), 1);
      assert.equal(await f.page.getByRole("link", { name: "Follow on X" }).count(), 1);
      assert(!await f.page.locator("#linux").innerText().then((text) => /confirm|check your email|date/i.test(text)));
      const stored = JSON.parse(await f.page.evaluate((key) => localStorage.getItem(key), memory));
      assert.equal(stored.joined, true);
      assert.deepEqual(Object.keys(stored).sort(), ["at", "joined"]);
      await f.clean();
    });

    await test("a duplicate address gets the same 202 and the same thank-you", async () => {
      const f = await fixture(accepted);
      await signup(f.page);
      await thanks(f.page).waitFor();
      await f.page.getByRole("button", { name: "Use another address" }).click();
      await field(f.page).fill(email);
      await field(f.page).press("Enter");
      await thanks(f.page).waitFor();
      assert.equal(f.calls.length, 2);
      await f.clean();
    });

    await test("a return visit shows the thank-you, and Use another address brings the form back", async () => {
      const f = await fixture();
      await signup(f.page);
      await thanks(f.page).waitFor();
      await f.page.reload();
      await thanks(f.page).waitFor();
      assert.equal(f.calls.length, 1, "A return visit must not send anything");
      assert.equal(await thanks(f.page).evaluate((node) => node === document.activeElement), false, "No focus grab on return");
      await f.page.getByRole("button", { name: "Use another address" }).click();
      await field(f.page).waitFor();
      assert.equal(await field(f.page).evaluate((node) => node === document.activeElement), true);
      assert.equal(await f.page.evaluate((key) => localStorage.getItem(key), memory), null);
      await f.clean();
    });

    await test("blocked storage never breaks signup", async () => {
      const f = await fixture(accepted, { blockStorage: true });
      await signup(f.page);
      await thanks(f.page).waitFor();
      await f.clean();
    });

    await test("native email validation shows one inline message and sends nothing", async () => {
      const f = await fixture();
      await openDownload(f.page);
      await notify(f.page).click();
      await status(f.page, /Enter a valid email address/);
      assert.equal(await field(f.page).getAttribute("aria-invalid"), "true");
      await field(f.page).fill("invalid-email");
      await notify(f.page).click();
      assert.equal(await field(f.page).getAttribute("aria-invalid"), "true");
      assert.match(await field(f.page).getAttribute("aria-describedby"), /\S+ \S+/);
      assert.equal(f.calls.length, 0);
      await f.clean();
    });

    await test("a 400 from the API says to check the address, without success", async () => {
      const f = await fixture(() => ({ status: 400, json: { error: { code: "invalid_request" }, request_id: null } }));
      await signup(f.page);
      await status(f.page, /Enter a valid email address/);
      assert.equal(await thanks(f.page).count(), 0);
      assert.equal(await notify(f.page).isEnabled(), true);
      await f.clean();
    });

    await test("429 shows a compact countdown on the button, then allows a manual retry", async () => {
      const f = await fixture(() => ({ status: 429, json: { error: { code: "rate_limited", retry_after: 42 }, request_id: null }, headers: { "Retry-After": "42" } }));
      await f.page.clock.install();
      await signup(f.page);
      await status(f.page, /Too many attempts/);
      const button = f.page.getByRole("button", { name: /Try again in/ });
      assert.equal((await button.innerText()).trim(), "Try again in 42s");
      assert.equal(await button.isDisabled(), true);
      await f.page.clock.fastForward(10000);
      assert.match((await button.innerText()).trim(), /^Try again in 3[123]s$/);
      await f.page.clock.fastForward(33000);
      assert.equal(await f.page.getByRole("button", { name: "Notify me" }).isEnabled(), true);
      assert.equal(f.calls.length, 1, "Cooldown expiry must not automatically retry");
      await f.clean();
    });

    await test("the longer of the Retry-After header and body is honoured", async () => {
      const f = await fixture(() => ({ status: 429, json: { error: { code: "rate_limited", retry_after: 30 } }, headers: { "Retry-After": "90" } }));
      await signup(f.page);
      await status(f.page, /Too many attempts/);
      assert.equal((await f.page.getByRole("button", { name: /Try again in/ }).innerText()).trim(), "Try again in 1m 30s");
      await f.clean();
    });

    for (const [name, reply] of [
      ["a response the browser cannot read (CORS-blocked or network failure)", { abort: true }],
      ["accepted:false", { status: 202, json: { accepted: false } }],
      ["a body that is not JSON", { status: 202, raw: "not-json" }],
      ["a server error", { status: 500, json: { error: { code: "unexpected" } } }],
      ["a 403 origin_denied", { status: 403, json: { error: { code: "origin_denied" } } }],
      ["a 404", { status: 404, json: { error: { code: "not_found" } } }],
      ["a 408", { status: 408, json: { error: { code: "request_timeout" } } }],
    ]) {
      await test(`${name} is an unknown outcome, never success`, async () => {
        const f = await fixture(() => reply);
        await signup(f.page);
        await status(f.page, /We couldn't confirm that\. Please try again in a moment\./);
        assert.equal(await thanks(f.page).count(), 0);
        assert.equal(await notify(f.page).isEnabled(), true);
        assert.equal(f.calls.length, 1);
        assert.equal(await f.page.evaluate((key) => localStorage.getItem(key), memory), null);
        await f.clean();
      });
    }

    await test("a 15-second timeout is an unknown outcome and needs a manual retry", async () => {
      let release;
      const hold = new Promise((resolve) => { release = resolve; });
      const f = await fixture(async () => { await hold; return accepted(); });
      // Native AbortSignal.timeout uses browser active time rather than JS fake timers.
      await signup(f.page);
      await status(f.page, /We couldn't confirm that/);
      assert.equal(f.calls.length, 1);
      release();
      await f.clean();
    });

    await test("honeypot is hidden, skipped by keyboard/autofill, capped at 200 characters and sent without changing generic success", async () => {
      const f = await fixture();
      await openDownload(f.page);
      const trap = f.page.locator('#linux input[name="website"]');
      assert.equal(await trap.isVisible(), false);
      assert.equal(await trap.getAttribute("tabindex"), "-1");
      assert.equal(await trap.getAttribute("autocomplete"), "off");
      assert.equal(await trap.getAttribute("maxlength"), "200");
      assert.equal(await trap.locator("..").getAttribute("aria-hidden"), "true");
      await trap.evaluate((node) => {
        Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, "value").set.call(node, "bot.example.invalid");
        node.dispatchEvent(new Event("input", { bubbles: true }));
      });
      await field(f.page).fill(email);
      await field(f.page).press("Enter");
      await thanks(f.page).waitFor();
      assert.deepEqual(f.calls[0].postDataJSON(), { email, website: "bot.example.invalid" });
      await f.clean();
    });

    await test("existing API cookies are omitted from waitlist requests", async () => {
      const f = await fixture();
      await f.context.addCookies([{ name: "customer_session", value: "synthetic-cookie", url: api, secure: true }]);
      await signup(f.page);
      await thanks(f.page).waitFor();
      assert.equal(f.calls.length, 1);
      await f.context.clearCookies();
      await f.clean();
    });

    await test("a Linux visitor gets the waitlist as the lead of the page, with Mac and Windows beneath", async () => {
      const f = await fixture(accepted, { linux: true });
      await openDownload(f.page);
      const lead = f.page.locator("#linux");
      await lead.getByRole("heading", { name: "Zephium for Linux is coming." }).waitFor();
      assert.equal(await f.page.locator("#linux").count(), 1, "One Linux section only");
      assert.equal(await lead.evaluate((node) => node.previousElementSibling === null), true);
      assert.equal(await lead.locator("#linux-notification").count(), 1);
      assert.equal(await lead.getByRole("link", { name: "Download for Mac" }).count(), 1);
      assert.equal(await lead.getByRole("link", { name: "Download for Windows" }).count(), 1);
      await f.clean();
    });

    await test("other visitors get a Linux section with both anchors", async () => {
      const f = await fixture();
      await openDownload(f.page, "#linux-notification");
      assert.equal(await f.page.locator("#linux").count(), 1);
      assert.equal(await f.page.locator("#linux #linux-notification").count(), 1);
      await f.clean();
    });
  }

  if (enabled || unsubscribeEnabled) {
    await test("unsubscribe only runs on explicit click and handles repeat clicks", async () => {
      let release;
      const hold = new Promise((resolve) => { release = resolve; });
      const f = await fixture(async () => { await hold; return { status: 200, json: { unsubscribed: true } }; });
      await openLink(f.page, `#action=unsubscribe&token=${token}`);
      const button = unsubscribeButton(f.page);
      await button.waitFor();
      assert.equal(f.calls.length, 0);
      await button.evaluate((node) => { node.click(); node.click(); });
      await f.firstCall;
      assert.equal(f.calls.length, 1);
      assert.equal(new URL(f.calls[0].url()).pathname, "/v1/waitlists/linux/unsubscribe");
      assert.deepEqual(f.calls[0].postDataJSON(), { token });
      release();
      await status(f.page, /been unsubscribed/);
      assert.equal(await f.page.getByRole("button").count(), 0);
      await f.clean();
    });

    await test("unsubscribing also forgets this browser's joined note", async () => {
      const f = await fixture(() => ({ status: 200, json: { unsubscribed: true } }));
      await f.page.goto(`${base}/robots.txt`);
      await f.page.evaluate((key) => localStorage.setItem(key, JSON.stringify({ joined: true, at: Date.now() })), memory);
      await openLink(f.page);
      await unsubscribeButton(f.page).click();
      await status(f.page, /been unsubscribed/);
      assert.equal(await f.page.evaluate((key) => localStorage.getItem(key), memory), null);
      await f.clean();
    });

    await test("an invalid proof offers signing up again without exposing the token", async () => {
      const f = await fixture(() => ({ status: 400, json: { error: { code: "invalid_or_expired_token" } } }));
      await openLink(f.page);
      await unsubscribeButton(f.page).click();
      await status(f.page, /invalid or has expired/);
      assert.equal(await f.page.getByRole("button").count(), 0);
      assert.equal(await f.page.getByRole("link", { name: "Back to downloads" }).getAttribute("href"), "/download#linux");
      await f.clean();
    });

    await test("unsubscribe honours Retry-After and an unreadable response is not success", async () => {
      const f = await fixture(() => ({ status: 429, json: { error: { code: "rate_limited", retry_after: 130 } }, headers: { "Retry-After": new Date(Date.now() + 90000).toUTCString() } }));
      await f.page.clock.install();
      await openLink(f.page);
      await unsubscribeButton(f.page).click();
      await status(f.page, /Too many attempts/);
      await f.page.clock.fastForward(121000);
      assert.equal(await f.page.getByRole("button").isDisabled(), true);
      await f.page.clock.fastForward(11000);
      assert.equal(await f.page.getByRole("button", { name: "Unsubscribe" }).isEnabled(), true);
      assert.equal(f.calls.length, 1);
      await f.clean();
      const g = await fixture(() => ({ abort: true }));
      await openLink(g.page);
      await unsubscribeButton(g.page).click();
      await status(g.page, /We couldn't confirm that/);
      assert.equal(await g.page.getByText(/been unsubscribed/).count(), 0);
      await g.clean();
    });

    await test("missing, duplicate, unsupported and malformed fragments never offer an action", async () => {
      for (const fragment of ["", "#", "#token=", "#action=unsubscribe", "#token=a&token=b", "#token=a&action=unsubscribe&action=unsubscribe", "#token=a&action=confirm", "#token=a&action=delete", "#token=a&action=", "#token=a&other=b", "#token=%ZZ", "#token=%00", "#token=%E0%A4", `#token=${"a".repeat(1600)}`, "?token=unsupported-query-input"]) {
        const f = await fixture();
        await openLink(f.page, fragment);
        await f.page.getByText(/This link is not valid|Open the link from your email/).waitFor();
        assert.equal(await f.page.getByRole("button").count(), 0);
        assert.equal(f.calls.length, 0);
        await f.clean();
      }
    });

    await test("with JavaScript off the unsubscribe page sends nothing", async () => {
      const context = await browser.newContext({ javaScriptEnabled: false });
      const page = await context.newPage();
      await page.goto(`${base}/linux/unsubscribe#token=${token}`);
      assert.equal(await page.getByRole("button").count(), 0);
      await page.getByText(/Turn on JavaScript/).waitFor();
      await context.close();
    });
  }

  await test("mobile and desktop layouts fit the viewport", async () => {
    const f = await fixture();
    for (const width of [375, 1440]) {
      await f.page.setViewportSize({ width, height: 900 });
      await openDownload(f.page, "#linux");
      await f.page.locator("#linux").scrollIntoViewIfNeeded();
      assert(await f.page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), `/download overflows at ${width}px`);
      if (process.env.WAITLIST_SCREENSHOTS) await f.page.screenshot({ path: `${process.env.WAITLIST_SCREENSHOTS}/linux-download-${width}.png` });
      await openLink(f.page);
      assert(await f.page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), `unsubscribe overflows at ${width}px`);
      if (process.env.WAITLIST_SCREENSHOTS) await f.page.screenshot({ path: `${process.env.WAITLIST_SCREENSHOTS}/linux-unsubscribe-${width}.png` });
    }
    await f.clean();
  });
  assert.deepEqual(problems, []);
  console.log(`${passed} waitlist browser tests passed (${enabled ? "enabled, mocked API" : unsubscribeEnabled ? "signup closed, unsubscribe enabled" : "disabled"}).`);
} finally {
  await browser?.close();
  server?.kill();
}
