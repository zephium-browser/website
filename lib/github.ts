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

async function readStars(): Promise<number> {
  const path = new URL(site.repo).pathname;
  try {
    // A token, when the build has one, lifts the anonymous limit altogether.
    const token = process.env.GITHUB_TOKEN;
    const response = await fetch(`https://api.github.com/repos${path}`, {
      headers: {
        Accept: "application/vnd.github+json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      next: { revalidate: 3600 },
      signal: AbortSignal.timeout(8000),
    });
    if (!response.ok) return 0;
    const data = (await response.json()) as { stargazers_count?: number };
    return data.stargazers_count ?? 0;
  } catch {
    return 0;
  }
}

/** A count as a star button shows it: 980, 1.2k, 12k. */
export function formatStars(count: number) {
  if (count < 1000) return String(count);
  const thousands = count / 1000;
  return `${thousands < 10 ? thousands.toFixed(1).replace(/\.0$/, "") : Math.round(thousands)}k`;
}
