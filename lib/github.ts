import { site } from "@/lib/site";

/**
 * The repository's stars, read while the site is built, so visitors'
 * browsers never call GitHub. Every page's layout asks, so the answer is
 * shared: one request per build worker, and through Next's data cache one per
 * hour per build machine. GitHub allows an address 60 anonymous reads an
 * hour, and asking once per page used to run out and leave some pages at
 * zero. Zero still means GitHub could not be reached; the nav then shows no
 * number rather than a wrong one.
 */
let stars: Promise<number> | null = null;

export function getStars(): Promise<number> {
  stars ??= readStars();
  return stars;
}

/** One read of the repository's API; null when GitHub could not be reached. */
async function readRepo(suffix = ""): Promise<unknown> {
  const path = new URL(site.repo).pathname;
  try {
    // A token, when the build has one, lifts the anonymous limit altogether.
    const token = process.env.GITHUB_TOKEN;
    const response = await fetch(`https://api.github.com/repos${path}${suffix}`, {
      headers: {
        Accept: "application/vnd.github+json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      next: { revalidate: 3600 },
      signal: AbortSignal.timeout(8000),
    });
    return response.ok ? await response.json() : null;
  } catch {
    return null;
  }
}

async function readStars(): Promise<number> {
  const data = (await readRepo()) as { stargazers_count?: number } | null;
  return data?.stargazers_count ?? 0;
}

/**
 * The people who have contributed code, read at build time and shared like the
 * stars. Bots are left out. Zero means the number is unknown, so a page shows
 * none rather than a wrong one.
 */
let contributors: Promise<number> | null = null;

export function getContributors(): Promise<number> {
  contributors ??= readContributors();
  return contributors;
}

async function readContributors(): Promise<number> {
  const data = await readRepo("/contributors?per_page=100&anon=0");
  if (!Array.isArray(data)) return 0;
  return data.filter((who: { type?: string; login?: string }) => who.type !== "Bot" && !who.login?.endsWith("[bot]"))
    .length;
}

/** A count as a star button shows it: 980, 1.2k, 12k. */
export function formatStars(count: number) {
  if (count < 1000) return String(count);
  const thousands = count / 1000;
  return `${thousands < 10 ? thousands.toFixed(1).replace(/\.0$/, "") : Math.round(thousands)}k`;
}
