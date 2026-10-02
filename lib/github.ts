import { site } from "@/lib/site";

/**
 * The repository's stars, read once while the site is built, so visitors'
 * browsers never call GitHub. Zero while the repository is private or GitHub
 * cannot be reached; a deploy after it goes public picks up the real count.
 */
export async function getStars(): Promise<number> {
  const path = new URL(site.repo).pathname;
  try {
    const response = await fetch(`https://api.github.com/repos${path}`, {
      headers: { Accept: "application/vnd.github+json" },
      signal: AbortSignal.timeout(5000),
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
