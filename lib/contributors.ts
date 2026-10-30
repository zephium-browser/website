import { site } from "@/lib/site";

export type Contributor = {
  /** The GitHub handle, without the @. */
  login: string;
  url: string;
};

/** A contributor with their GitHub picture, inlined so the page loads nothing from GitHub. */
export type Face = Contributor & { avatar: string };

type Person = { login: string; avatar: string };

/**
 * The people who have sent changes to the browser's repository, read from
 * GitHub while the site is built, so visitors' browsers never call it. Bots
 * are left out. If GitHub cannot be reached the list is empty and pages
 * simply show no names; a wrong list would be worse than none.
 */
let people: Promise<Person[]> | null = null;

function getPeople(): Promise<Person[]> {
  people ??= readPeople();
  return people;
}

async function readPeople(): Promise<Person[]> {
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
    const data = (await response.json()) as { login?: string; type?: string; avatar_url?: string }[];
    if (!Array.isArray(data)) return [];
    return data
      .filter((person) => person.login && person.type === "User")
      .map((person) => ({ login: person.login as string, avatar: person.avatar_url ?? "" }));
  } catch {
    return [];
  }
}

const maker = () => new URL(site.author.url).pathname.slice(1).toLowerCase();
const profile = (login: string) => `https://github.com/${login}`;

/** Everyone but the maker, whom the About page names itself. */
export async function getContributors(): Promise<Contributor[]> {
  return (await getPeople())
    .filter((person) => person.login.toLowerCase() !== maker())
    .map((person) => ({ login: person.login, url: profile(person.login) }));
}

/**
 * Everyone, the maker first, each with a small picture as a data URL (the
 * site's CSP serves images only from itself). A picture that cannot be read
 * leaves that person out of the row rather than showing a blank.
 */
export async function getFaces(limit = 12): Promise<Face[]> {
  const everyone = [...(await getPeople())].sort(
    (a, b) => Number(b.login.toLowerCase() === maker()) - Number(a.login.toLowerCase() === maker()),
  );
  const faces = await Promise.all(
    everyone.slice(0, limit).map(async (person) => {
      const avatar = await inline(person.avatar);
      return avatar ? { login: person.login, url: profile(person.login), avatar } : null;
    }),
  );
  return faces.filter((face) => face !== null);
}

async function inline(src: string): Promise<string | null> {
  if (!src.startsWith("https://avatars.githubusercontent.com/")) return null;
  try {
    const url = new URL(src);
    url.searchParams.set("s", "80");
    const response = await fetch(url, { next: { revalidate: 86400 }, signal: AbortSignal.timeout(8000) });
    const type = response.headers.get("content-type") ?? "";
    if (!response.ok || !type.startsWith("image/")) return null;
    const bytes = Buffer.from(await response.arrayBuffer());
    return `data:${type};base64,${bytes.toString("base64")}`;
  } catch {
    return null;
  }
}
