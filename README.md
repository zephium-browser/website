# zephium.app

The website for [Zephium](https://github.com/zephium-browser/Zephium), the
browser-native work environment. It is a fully static Next.js site: every page
is rendered at build time and served as plain files. Like the browser, it is
open source under the MPL-2.0.

## Develop

Requires Node 20.9+ and pnpm.

```sh
pnpm install
pnpm dev          # http://localhost:3000
pnpm check        # lint + typecheck
pnpm build        # static export into out/
pnpm start        # serve out/ the way production does
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
app/                  pages: home, workflows, changelog, about, download, docs, privacy, terms
components/scene/     the opening: sky, headline, and the Zephium window that plays the film
components/sections/  the home page sections after it
components/work/      the Work canvas the film runs on
components/island/    the island, the run's one line of status
lib/site.ts           facts more than one page states: links, platforms, size, license
lib/changelog.ts      release notes, newest first
deploy/, Dockerfile   the production container
```

## How the site is built

- **Static export.** `output: "export"` in `next.config.ts`. Nothing runs on a
  server at request time. Facts that change (releases, platforms) live in
  `lib/` and the site is rebuilt when they change. The GitHub star count is
  read once, at build time.
- **The opening scene** (`components/scene`) is one pinned section: the sky
  (`clouds.tsx`, three cloud layers painted once by a shader, then only moved:
  the far and near layers drift as seamless tiles on the compositor, and all
  of them lean with the pointer), the headline, and one Zephium window.
  Scrolling plays the Work run as a film (`film.ts`): scroll sets where the
  film should be, and a spring with a speed limit follows it, so flicks glide
  and no chapter is skipped. Every continuous change is driven by one CSS
  variable (`--p`); the page only re-renders when a discrete state flips.
  Phones get a portrait window with its own camera framing.
- **The window** is HTML and CSS measured from the product (1196 x 700 design
  pixels, `--u` is one design pixel), using the product's tokens, its agent
  characters and its icons ([Hugeicons](https://hugeicons.com), free set). The
  other sites shown in it are simplified likenesses with made-up content.
- **No tracking.** No cookies and no third-party scripts. Page views are
  counted by a self-hosted, cookieless Umami, only when it is configured.

## Releases and downloads

Download buttons link to `releases/latest/download/<asset>` on GitHub. The asset
names in `lib/site.ts` must match the release workflow's artifact names exactly,
and stay stable across releases.

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

Leave all three empty to run without analytics. Build variables must be marked
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

[MPL-2.0](LICENSE), the same license as the browser. The Zephium name and mark
identify the project; please don't use them to imply endorsement.
