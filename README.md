# zephium.app

The website for [Zephium](https://github.com/zephium-browser/Zephium), the
browser-native work environment. It is a fully static Next.js site: every page
is rendered at build time and served as plain files. Like the browser, it is
open source under the MPL-2.0. The backend behind Zephium AI is a separate
repository under the AGPL-3.0-only.

## Develop

Requires Node 20.9+ and pnpm.

```sh
pnpm install
pnpm dev          # http://localhost:3000
pnpm check        # lint + typecheck
pnpm build        # static export into out/
pnpm start        # serve out/ the way production does
pnpm test:waitlist # Chromium contract tests against out/, all API requests mocked
```

Visual changes are reviewed in a real Chromium (set `CHROMIUM_PATH` to any
Chromium browser; Brave on macOS is the default):

```sh
node scripts/shot-scene.mjs <url> <prefix> [width] [height]   # every chapter of the opening film
node scripts/shot-pages.mjs <url> <prefix> [width] [height]   # the page after it, screen by screen
```

Served images are made from the originals in `media/` with `scripts/images.sh`
(ImageMagick and cwebp). To replace a screenshot, replace its original there
and run the script.

## Layout

```
app/(site)/           pages with the nav, footer and page-view counting: home, pricing, download, support, workflows, changelog, about, docs, privacy, terms
app/billing/return/   where checkout and the billing portal send people back to; no analytics
app/linux/confirm/    explicit Linux notification confirmation/removal; no analytics or replay
app/linux/unsubscribe/ launch-email removal link; no analytics or replay
public/.well-known/   security.txt (RFC 9116), served as text/plain by nginx
components/scene/     the opening: sky, headline, and the Zephium window that plays the film
components/sections/  the home page sections after it
components/docs/      the documentation pages; their topics and order are lib/docs.ts
components/film.tsx   the launch film: the poster, the button and the player (site.film)
components/work/      the Work canvas the film runs on
components/island/    the island, the run's one line of status
lib/site.ts           facts more than one page states: links, contacts, platforms, size, licenses
lib/pricing.ts        the plans and their prices; the website sells nothing, purchases happen in the app
lib/changelog.ts      release notes, newest first
deploy/, Dockerfile   the production container
```

## How the site is built

- **Static export.** `output: "export"` in `next.config.ts`. Nothing runs on a
  server at request time. Facts that change (releases, platforms) live in
  `lib/` and the site is rebuilt when they change. The GitHub star count is
  read once, at build time.
- **The opening scene** (`components/scene`) is one pinned section: the sky
  (`clouds.tsx`: the new tab's own day picture, kept alive by one shader; the
  clouds breathe, lean with the pointer by their depth and stir in its wake,
  and the sky arrives and leaves through the product's halftone), the
  headline, and one Zephium window. Scrolling plays the Work run as a film
  (`film.ts`): scroll sets where the film should be, and a spring with a speed
  limit follows it, so flicks glide and no chapter is skipped. Every continuous
  change is driven by one CSS variable (`--p`); the page only re-renders when a
  discrete state flips. Phones get a portrait window with its own camera
  framing.
- **The window** is HTML and CSS measured from the product (1196 x 700 design
  pixels, `--u` is one design pixel), using the product's tokens, its agent
  characters and its icons ([Hugeicons](https://hugeicons.com), free set). The
  other sites shown in it are simplified likenesses with made-up content.
- **No tracking.** No cookies and no third-party scripts. Page views are
  counted by a self-hosted, cookieless Umami, only when it is configured.
  Query strings are never recorded. `/billing/return`, `/linux/confirm` and `/linux/unsubscribe` load
  no analytics or replay: their HTML has no script for it, and nginx sends
  them a CSP without the Umami origin.

## Releases and downloads

Every Download button goes to `/download?start=1`. The page starts the
download for the visitor's desktop (or the platform named, as in
`?start=windows`), then removes the flag from the address, so a reload, a shared
link or a crawler never starts one. Without the flag, or without JavaScript, it
lists a direct link for each build. The downloads are
`releases/latest/download/<asset>` on GitHub; the asset names in `lib/site.ts`
must match the release workflow's artifact names exactly, and stay stable across
releases.

The pricing page links to the same page with `plan=` to tailor one line of next
steps. Nothing on the website sells anything or links to Polar. The optional
Linux release notification calls only the public waitlist API.

## Linux release notification

Disabled by default. The download page shows availability copy until explicitly
enabled at build time. Submitting the email form requests one Linux release
notification immediately: no confirmation step, immediate email, account or
subscription. The optional hidden `website` field is a bot trap; legitimate
submissions send an empty string. Success is generic, including duplicates and
suppressed submissions, and does not prove mailbox ownership or list membership.

The enable flag controls signup only. Once an API origin is configured, email-link
actions remain available even if signup is closed, so members can still opt out.
`/linux/unsubscribe` is ready for the future launch email. `/linux/confirm` remains
compatible with legacy confirmation and removal links; new signups never use it.
Both static pages sit outside the analytics layout, with no external assets,
indexing, referrer or caching. They read a token only from the email fragment,
remove the fragment immediately, and send only after an explicit button click.
A reload requires reopening the email link. Tokens and addresses are never
persisted or logged by the website. GET requests never change membership.

| Build variable | Default | Allowed value |
| --- | --- | --- |
| `NEXT_PUBLIC_LINUX_WAITLIST_ENABLED` | `false` | `true` only after operator qualification |
| `NEXT_PUBLIC_LINUX_WAITLIST_API_ORIGIN` | empty | exactly `https://api.zephium.app` or `https://staging-api.zephium.app` |

An enabled build requires an explicit origin; invalid settings fail the build.
No secret, account integration, provider SDK or website API server is needed.
Docker uses the same API-origin build argument for the browser and nginx's
`connect-src`. Do not override the resulting `LINUX_WAITLIST_API_ORIGIN` runtime
value. Build-time changes require a new image; restart alone cannot enable it.

Run the disabled build and tests first (`pnpm build && pnpm test:waitlist`).
For an enabled **mock-only** qualification build, set these variables for both
the build and test commands:

```sh
export NEXT_PUBLIC_LINUX_WAITLIST_ENABLED=true
export NEXT_PUBLIC_LINUX_WAITLIST_API_ORIGIN=https://staging-api.zephium.app
pnpm build
pnpm test:waitlist
```

The test script uses Brave on macOS (`CHROMIUM_PATH` overrides it). On Linux,
install Chromium with `pnpm exec playwright-core install --with-deps chromium`.
CI checks enabled, disabled and signup-closed variants against nginx and uploads only the disabled
export. Tests exercise success, errors, the honeypot, unknown outcomes/timeouts,
cooldowns, explicit clicks, duplicates, malformed links, direct loads/reloads,
privacy and layouts. These mocked tests never reach the real API or send mail.
`pnpm start` must receive the same
API-origin environment as the build so its preview CSP matches nginx.

Before enabling a public form, the backend operator must confirm the target
environment is deployed and enabled, its exact HTTPS website origin is allowed,
and staging's signup allowlist includes the test address. Preview origins
require explicit backend approval; do not test against a real API from localhost.
Qualify single-step signup and duplicate/rate-limit handling against staging.
The operator must verify `subscribed` reporting (not legacy `confirmed` counts)
and independently qualify per-membership unsubscribe/re-subscribe behavior.
There is no signup email to deliver or confirm. Do not send a campaign during
testing. Production stays disabled until the operator confirms it is enabled.

For the currently approved origin `https://zephium.app`, the opt-in live check
loads this export at that origin only inside an isolated Chromium browser;
it does not deploy or change the public website. Only static website assets
are supplied locally. The staging API is not intercepted or proxied, and the
browser supplies Origin and enforces actual CORS and TLS. Build without analytics
and pass the enabled staging environment above, then run:

```sh
RUN_STAGING_WAITLIST_TEST=true WAITLIST_TEST_EMAIL='<operator-approved-address>' pnpm test:waitlist:staging
```

This sends one explicit staging submission. Use only an approved address;
an existing test member exercises duplicate acceptance. A 429 fails qualification
with a cooldown notice and no automatic retry. It does not prove published
nginx/Cloudflare behavior or inspect private admin membership. Rebuild without
the enable flag after qualification to leave the public export disabled.

## Deploy

The site is a static export served by nginx in one container (`Dockerfile`,
config in `deploy/`). It runs on Coolify behind Cloudflare.

**Coolify:** new resource from this repository, build pack *Dockerfile*, port
80, health check path `/healthz`, domain `https://zephium.app` (and
`https://www.zephium.app`, redirected to it).

Environment:

| Variable | When | Value |
| --- | --- | --- |
| `NEXT_PUBLIC_UMAMI_SRC` | build | `https://<umami host>/script.js` |
| `NEXT_PUBLIC_UMAMI_ID` | build | the website ID from Umami |
| `UMAMI_ORIGIN` | runtime | `https://<umami host>`, allowed by the CSP |
| `GITHUB_TOKEN` | build | optional; a fine-grained token with no permissions, so reading the star count is never rate limited |
| `NEXT_PUBLIC_LINUX_WAITLIST_ENABLED` | build | `false` until qualified; see above |
| `NEXT_PUBLIC_LINUX_WAITLIST_API_ORIGIN` | build | exact production or staging API origin; see above |

Leave the three analytics values empty to run without analytics. Build variables must be marked
as build-time in Coolify.

**Cloudflare:** proxied DNS records for `@` and `www`, SSL mode *Full
(strict)*, Always Use HTTPS on. HTML is sent with `max-age=0`, hashed files
under `/_next/static/` as immutable, images for a day, so Cloudflare's default
caching is right without extra rules.

**Star count:** read from GitHub while the site builds. Redeploy after the
repository goes public, and on any schedule you like, to refresh it.

**Releases:** add an entry at the top of `lib/changelog.ts` for each release.

## Contributing

Issues and pull requests are welcome. Run `pnpm check` and `pnpm build` before
opening one; CI runs both.

## License

[MPL-2.0](LICENSE), the same license as the browser. The backend behind Zephium
AI is a separate repository under the
[AGPL-3.0-only](https://github.com/zephium-browser/backend). The Zephium name and
mark identify the project; please don't use them to imply endorsement.
