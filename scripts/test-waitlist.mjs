// Browser contract tests against an existing static export. All API traffic is
// intercepted; no email is delivered. Build with the same environment first.
import assert from "node:assert/strict";
import { spawn, spawnSync } from "node:child_process";
import { readFile } from "node:fs/promises";
import { chromium } from "playwright-core";

const enabled = process.env.NEXT_PUBLIC_LINUX_WAITLIST_ENABLED === "true";
const api = process.env.NEXT_PUBLIC_LINUX_WAITLIST_API_ORIGIN;
const actionsEnabled = ["https://api.zephium.app", "https://staging-api.zephium.app"].includes(api);
const email = "linux-notification-test@example.invalid";
const token = "synthetic-private-waitlist-token";
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
  console.log(`✓ ${name}`);
}

async function fixture(handler = () => ({ status: 202, json: { accepted: true } })) {
  const context = await browser.newContext();
  const calls = [];
  const requests = [];
  const logs = [];
  let firstRequest;
  const firstCall = new Promise((resolve) => { firstRequest = resolve; });
  await context.addInitScript(() => {
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
  });
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
    assert.equal(await page.evaluate(() => JSON.stringify({ ...localStorage, ...sessionStorage })), "{}");
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

async function signup(page) {
  await page.goto(`${base}/download`);
  await page.getByLabel("Email address", { exact: true }).fill(email);
  await page.getByLabel("Email address", { exact: true }).press("Enter");
}

async function status(page, pattern) {
  await page.locator('[role="status"]').filter({ hasText: pattern }).waitFor();
}

async function openLink(page, fragment = `#token=${token}`, path = "/linux/confirm") {
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
  for (const action of ["confirm", "unsubscribe"]) {
    const html = await readFile(`out/linux/${action}.html`, "utf8");
    assert(!html.includes("analytics.example.invalid") && !html.includes("data-website-id"));
    assert(!(await readFile("out/sitemap.xml", "utf8")).includes(`/linux/${action}`));
  }

  await test("direct load, reload and aliases have private headers and no external requests", async () => {
    for (const path of ["/linux/confirm", "/linux/confirm/", "/linux/confirm.html", "/linux/unsubscribe", "/linux/unsubscribe/", "/linux/unsubscribe.html"]) {
      const f = await fixture();
      await openLink(f.page, `#token=${token}`, path);
      if (actionsEnabled) await f.page.getByRole("button", { name: path.includes("unsubscribe") ? "Unsubscribe" : "Confirm Linux notification", exact: true }).waitFor();
      assert.equal(f.calls.length, 0, "Following a link must never change membership");
      await f.page.reload();
      await f.page.getByText(actionsEnabled ? /Reopen the link in your email/ : /temporarily unavailable/).waitFor();
      assert.equal(await f.page.getByRole("button").count(), 0);
      assert(f.requests.every((request) => new URL(request.url).origin === base));
      await f.clean();
    }
  });

  if (!enabled) {
    await test("disabled signup exposes no signup action", async () => {
      const f = await fixture();
      await f.page.goto(`${base}/download`);
      await f.page.getByText("Zephium for Linux is coming.", { exact: true }).waitFor();
      assert.equal(await f.page.getByLabel("Email address", { exact: true }).count(), 0);
      assert.equal(await f.page.getByRole("button", { name: "Notify me" }).count(), 0);
      await openLink(f.page, `#action=unsubscribe&token=${token}`);
      if (!actionsEnabled) assert.equal(await f.page.getByRole("button").count(), 0);
      assert.equal(f.calls.length, 0);
      await f.clean();
    });
    if (actionsEnabled) {
      await test("closing signup preserves explicit unsubscribe for existing members", async () => {
        const f = await fixture(() => ({ status: 200, json: { unsubscribed: true } }));
        await openLink(f.page, `#action=unsubscribe&token=${token}`, "/linux/unsubscribe");
        await f.page.getByRole("button", { name: "Unsubscribe", exact: true }).click();
        await status(f.page, /been unsubscribed/);
        assert.equal(f.calls.length, 1);
        assert.equal(new URL(f.calls[0].url()).pathname, "/v1/waitlists/linux/unsubscribe");
        await f.clean();
      });
    }
  } else {
    await test("existing API cookies are omitted from waitlist requests", async () => {
      const f = await fixture();
      await f.context.addCookies([{ name: "customer_session", value: "synthetic-cookie", url: api, secure: true }]);
      await signup(f.page);
      await status(f.page, /You're on the list/);
      assert.equal(f.calls.length, 1);
      await f.context.clearCookies();
      await f.clean();
    });
    await test("202, keyboard submit, pending double submit, accessible success, cooldown and manual retry", async () => {
      let release;
      const hold = new Promise((resolve) => { release = resolve; });
      const f = await fixture(async () => { await hold; return { status: 202, json: { accepted: true } }; });
      await f.page.clock.install();
      await signup(f.page);
      await f.page.getByRole("button", { name: "Sending…" }).waitFor();
      await f.page.locator("#linux-notification form").evaluate((form) => {
        form.dispatchEvent(new Event("submit", { bubbles: true, cancelable: true }));
        form.dispatchEvent(new Event("submit", { bubbles: true, cancelable: true }));
      });
      await f.firstCall;
      assert.equal(f.calls.length, 1);
      assert.deepEqual(f.calls[0].postDataJSON(), { email, website: "" });
      release();
      await status(f.page, /You're on the list. We'll email you when Linux is available./);
      assert(!await f.page.locator("#linux-notification").innerText().then((text) => /confirm|24 hours|check your email/i.test(text)));
      assert.equal(await f.page.locator("#linux-result").evaluate((node) => node === document.activeElement), true);
      assert.equal(await f.page.getByRole("button", { name: "Notify me" }).isDisabled(), true);
      await f.page.clock.fastForward(61000);
      assert.equal(await f.page.getByRole("button", { name: "Notify me" }).isEnabled(), true);
      assert.equal(f.calls.length, 1, "Cooldown expiry must not automatically retry");
      await f.page.getByLabel("Email address", { exact: true }).fill(email);
      await f.page.getByRole("button", { name: "Notify me" }).click();
      await status(f.page, /You're on the list/);
      assert.equal(f.calls.length, 2);
      await f.clean();
    });

    const cases = [
      [400, "invalid_request", /Check your email address/, false],
      [403, "origin_denied", /temporarily unavailable/, true],
      [404, "not_found", /temporarily unavailable/, true],
      [408, "request_timeout", /couldn’t verify the outcome/, false],
      [413, "body_too_large", /input is too large/, false],
      [429, "rate_limited", /Too many requests/, false],
      [503, "email_unavailable", /temporarily unavailable/, false],
      [503, "server_busy", /temporarily unavailable/, false],
      [503, "unavailable", /temporarily unavailable/, false],
      [500, "unexpected", /couldn’t verify the outcome/, false],
    ];
    for (const [code, error, message, unavailable] of cases) {
      await test(`signup handles ${code} ${error} without success or automatic retry`, async () => {
        const f = await fixture(() => ({ status: code, json: { error: { code: error, retry_after: 90 }, request_id: null }, headers: { "Retry-After": "120" } }));
        await f.page.clock.install();
        await signup(f.page);
        await status(f.page, message);
        assert.equal(await f.page.locator("#linux-result").evaluate((node) => node === document.activeElement), true);
        assert.equal(await f.page.getByRole("button", { name: "Notify me" }).isDisabled(), true);
        await f.page.clock.fastForward(91000);
        assert.equal(await f.page.getByRole("button", { name: "Notify me" }).isDisabled(), true, "Honor the longer Retry-After header");
        await f.page.clock.fastForward(31000);
        assert.equal(await f.page.getByRole("button", { name: "Notify me" }).isDisabled(), unavailable);
        assert.equal(f.calls.length, 1);
        await f.clean();
      });
    }

    for (const reply of [{ abort: true }, { status: 202, json: { accepted: false } }, { status: 202, raw: "not-json" }]) {
      await test("network/malformed responses keep the outcome unknown", async () => {
        const f = await fixture(() => reply);
        await signup(f.page);
        await status(f.page, /couldn’t verify the outcome/);
        assert.equal(f.calls.length, 1);
        await f.clean();
      });
    }

    await test("15-second timeout has an unknown outcome and requires manual retry", async () => {
      let release;
      const hold = new Promise((resolve) => { release = resolve; });
      const f = await fixture(async () => { await hold; return { status: 202, json: { accepted: true } }; });
      // Native AbortSignal.timeout uses browser active time rather than JS fake timers.
      await signup(f.page);
      await status(f.page, /couldn’t verify the outcome/);
      assert.equal(f.calls.length, 1);
      release();
      await f.clean();
    });

    for (const [action, path] of [["confirm", "/linux/confirm"], ["unsubscribe", "/linux/confirm"], ["unsubscribe", "/linux/unsubscribe"]]) {
      await test(`${action} on ${path} only runs on explicit click and handles repeat clicks`, async () => {
        let release;
        const hold = new Promise((resolve) => { release = resolve; });
        const f = await fixture(async () => { await hold; return { status: 200, json: { [action === "confirm" ? "confirmed" : "unsubscribed"]: true } }; });
        await openLink(f.page, `#action=${action}&token=${token}`, path);
        const button = f.page.getByRole("button", { name: action === "confirm" ? "Confirm Linux notification" : "Unsubscribe", exact: true });
        await button.waitFor();
        assert.equal(f.calls.length, 0);
        await button.evaluate((node) => { node.click(); node.click(); });
        await f.page.getByRole("button", { name: "Sending…" }).waitFor();
        await f.firstCall;
        assert.equal(f.calls.length, 1);
        assert.equal(new URL(f.calls[0].url()).pathname, `/v1/waitlists/linux/${action}`);
        assert.deepEqual(f.calls[0].postDataJSON(), { token });
        release();
        await status(f.page, action === "confirm" ? /notification is confirmed/ : /been unsubscribed/);
        assert.equal(await f.page.getByRole("button").count(), 0);
        await f.clean();
      });
    }

    for (const path of ["/linux/confirm", "/linux/unsubscribe"]) {
      await test(`invalid proof on ${path} offers signup without exposing the token`, async () => {
        const f = await fixture(() => ({ status: 400, json: { error: { code: "invalid_or_expired_token" } } }));
        await openLink(f.page, `#token=${token}`, path);
        await f.page.getByRole("button", { name: path.includes("unsubscribe") ? "Unsubscribe" : "Confirm Linux notification", exact: true }).click();
        await status(f.page, /invalid or has expired/);
        assert.equal(await f.page.getByRole("button").count(), 0);
        assert.equal(await f.page.getByRole("link", { name: /sign up again/ }).getAttribute("href"), "/download#linux-notification");
        await f.clean();
      });
    }

    await test("honeypot is hidden, skipped by keyboard/autofill, and sent without changing generic success", async () => {
      const f = await fixture();
      await f.page.goto(`${base}/download`);
      const trap = f.page.locator("#linux-website");
      assert.equal(await trap.isVisible(), false);
      assert.equal(await trap.getAttribute("tabindex"), "-1");
      assert.equal(await trap.getAttribute("autocomplete"), "off");
      assert.equal(await trap.locator("..").getAttribute("aria-hidden"), "true");
      await trap.evaluate((node) => {
        Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, "value").set.call(node, "bot.example.invalid");
        node.dispatchEvent(new Event("input", { bubbles: true }));
      });
      await f.page.getByLabel("Email address", { exact: true }).fill(email);
      await f.page.getByLabel("Email address", { exact: true }).press("Enter");
      await status(f.page, /You're on the list/);
      assert.deepEqual(f.calls[0].postDataJSON(), { email, website: "bot.example.invalid" });
      await f.clean();
    });

    await test("unsubscribe page rejects confirmation actions", async () => {
      const f = await fixture();
      await openLink(f.page, `#action=confirm&token=${token}`, "/linux/unsubscribe");
      await f.page.getByText(/This email link is invalid/).waitFor();
      assert.equal(await f.page.getByRole("button").count(), 0);
      assert.equal(f.calls.length, 0);
      await f.clean();
    });

    await test("Retry-After HTTP date and body cooldown apply to unsubscribe too", async () => {
      const f = await fixture(() => ({ status: 429, json: { error: { code: "rate_limited", retry_after: 130 } }, headers: { "Retry-After": new Date(Date.now() + 90000).toUTCString() } }));
      await f.page.clock.install();
      await openLink(f.page, `#action=unsubscribe&token=${token}`, "/linux/unsubscribe");
      await f.page.getByRole("button", { name: "Unsubscribe", exact: true }).click();
      await status(f.page, /Too many requests/);
      await f.page.clock.fastForward(121000);
      assert.equal(await f.page.getByRole("button").isDisabled(), true);
      await f.page.clock.fastForward(11000);
      assert.equal(await f.page.getByRole("button").isEnabled(), true);
      assert.equal(f.calls.length, 1);
      await f.clean();
    });

    await test("missing, duplicate, unsupported and malformed fragments never offer an action", async () => {
      for (const fragment of ["", "#", "#token=", "#action=confirm", "#token=a&token=b", "#token=a&action=confirm&action=confirm", "#token=a&action=delete", "#token=a&action=", "#token=a&other=b", "#token=%ZZ", "#token=%00", "#token=%E0%A4", `#token=${"a".repeat(1600)}`, "?token=unsupported-query-input"]) {
        const f = await fixture();
        await openLink(f.page, fragment);
        await f.page.getByText(/This email link is invalid|Reopen the link in your email/).waitFor();
        assert.equal(await f.page.getByRole("button").count(), 0);
        assert.equal(f.calls.length, 0);
        await f.clean();
      }
    });

    await test("native email validation and no-JavaScript visits never send", async () => {
      const f = await fixture();
      await f.page.goto(`${base}/download`);
      await f.page.getByRole("button", { name: "Notify me" }).click();
      await f.page.getByLabel("Email address", { exact: true }).fill("invalid-email");
      await f.page.getByRole("button", { name: "Notify me" }).click();
      assert.equal(f.calls.length, 0);
      await f.clean();
      const context = await browser.newContext({ javaScriptEnabled: false });
      const page = await context.newPage();
      await page.goto(`${base}/linux/confirm#token=${token}`);
      assert.equal(await page.getByRole("button").count(), 0);
      await page.getByText(/Enable JavaScript, then reopen/).waitFor();
      await context.close();
    });
  }

  await test("mobile and desktop layouts fit the viewport", async () => {
    const f = await fixture();
    for (const width of [375, 1440]) {
      await f.page.setViewportSize({ width, height: 900 });
      await f.page.goto(`${base}/download#linux-notification`);
      await f.page.locator("#linux-notification").scrollIntoViewIfNeeded();
      assert(await f.page.evaluate(() => document.documentElement.scrollWidth <= innerWidth));
      if (process.env.WAITLIST_SCREENSHOTS) await f.page.screenshot({ path: `${process.env.WAITLIST_SCREENSHOTS}/linux-download-${width}.png` });
      await openLink(f.page);
      assert(await f.page.evaluate(() => document.documentElement.scrollWidth <= innerWidth));
      if (process.env.WAITLIST_SCREENSHOTS) await f.page.screenshot({ path: `${process.env.WAITLIST_SCREENSHOTS}/linux-confirm-${width}.png` });
      await openLink(f.page, `#action=unsubscribe&token=${token}`, "/linux/unsubscribe");
      assert(await f.page.evaluate(() => document.documentElement.scrollWidth <= innerWidth));
      if (process.env.WAITLIST_SCREENSHOTS) await f.page.screenshot({ path: `${process.env.WAITLIST_SCREENSHOTS}/linux-unsubscribe-${width}.png` });
    }
    await f.clean();
  });
  assert.deepEqual(problems, []);
  console.log(`${passed} waitlist browser tests passed (${enabled ? "enabled, mocked API" : actionsEnabled ? "signup closed, email actions enabled" : "disabled"}).`);
} finally {
  await browser?.close();
  server?.kill();
}
