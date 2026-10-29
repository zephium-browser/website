import { site } from "@/lib/site";

export type Contributor = {
  /** The GitHub handle, without the @. */
  login: string;
  url: string;
};

/**
 * The people who have sent changes to the browser's repository, read from
 * GitHub while the site is built, so visitors' browsers never call it. The
 * maker is left out (the About page names them itself), and so are bots.
 * If GitHub cannot be reached the list is empty and the page simply shows no
 * names; a wrong list would be worse than none.
 */
let contributors: Promise<Contributor[]> | null = null;

export function getContributors(): Promise<Contributor[]> {
  contributors ??= readContributors();
  return contributors;
}

async function readContributors(): Promise<Contributor[]> {
  const path = new URL(site.repo).pathname;
  try {
    const token = process.env.GITHUB_TOKEN;
    const response = await fetch(`https://api.github.com/repos${path}/contributors?per_page=100`, {
      headers: {
        Accept: "application/vnd.github+json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      next: { revalidate: 3600 },
      signal: AbortSignal.timeout(8000),
    });
    if (!response.ok) return [];
    const data = (await response.json()) as { login?: string; type?: string }[];
    if (!Array.isArray(data)) return [];
    const maker = new URL(site.author.url).pathname.slice(1).toLowerCase();
    return data
      .filter((person) => person.login && person.type === "User" && person.login.toLowerCase() !== maker)
      .map((person) => ({
        login: person.login as string,
        url: `https://github.com/${person.login}`,
      }));
  } catch {
    return [];
  }
}
