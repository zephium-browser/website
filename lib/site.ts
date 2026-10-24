/**
 * Facts about Zephium that more than one page states. Anything a visitor can
 * check (a link, a platform, a license) lives here so it cannot drift between
 * the hero, the download page and the structured data search engines read.
 */
const backendRepo = "https://github.com/zephium-browser/backend";

export const site = {
  name: "Zephium",
  url: "https://zephium.app",
  title: "Zephium — a browser and work environment for you and your agents",
  tagline: "A browser and work environment, reimagined for you and your agents.",
  description:
    "Zephium is a fast, private, open-source browser built in Rust, with Work: a canvas where you and your agents browse, compare and plan in the open, and keep the results.",
  repo: "https://github.com/zephium-browser/Zephium",
  releases: "https://github.com/zephium-browser/Zephium/releases",
  /** This website's own source; it is open source too. */
  websiteRepo: "https://github.com/zephium-browser/website",
  /** The browser and this website. The backend has its own license, below. */
  license: "MPL-2.0",
  /** The backend behind Zephium AI: public, self-hostable, a separate repository. */
  backendRepo,
  backendReadme: `${backendRepo}#readme`,
  backendSelfHosting: `${backendRepo}/blob/main/docs/self-hosting.md`,
  commercialLicensing: `${backendRepo}/blob/main/COMMERCIAL-LICENSING.md`,
  backendLicense: "AGPL-3.0-only",
  /** Approximate app size (macOS is the larger), as the site states it. */
  appSize: "about 40 MB",
  /**
   * The launch film on YouTube, by its video ID. Empty until it is published;
   * every place that offers the film stays hidden until then. It plays from
   * youtube-nocookie.com, and only once someone presses play.
   */
  film: { youtube: "", title: "Introducing Zephium" },
  /** The person who makes Zephium. */
  author: { name: "Crynta", url: "https://github.com/crynta" },
  /** Community links. An empty one is left out of the footer until it exists. */
  social: {
    github: "https://github.com/crynta",
    x: "https://x.com/CryntaDev",
    discord: "https://discord.gg/tyveTUyEp7",
    youtube: "https://www.youtube.com/@crynta",
  },
  /** Where to write, by topic. */
  contact: {
    /** Account, billing and privacy questions; the general support address. */
    support: "support@zephium.app",
    /** Vulnerability reports. */
    security: "security@zephium.app",
    /** General questions and press. */
    info: "info@zephium.app",
  },
  /**
   * Who runs the service today. Privacy and terms name them once, in a plain
   * sentence. This becomes the company when it is formed.
   */
  operator: { name: "Hayk Injighulyan", location: "Armenia" },
} as const;

export type PlatformId = "macos" | "windows" | "linux" | "ios" | "android";

export type Platform = {
  id: PlatformId;
  name: string;
  status: "available" | "soon";
  /**
   * The release asset this platform downloads. Release workflows must keep
   * these names stable so `releases/latest/download/<asset>` always resolves.
   */
  asset?: string;
  requirement?: string;
};

export const platforms: readonly Platform[] = [
  {
    id: "macos",
    name: "macOS",
    status: "available",
    asset: "Zephium-macOS-arm64.dmg",
    requirement: "macOS Sonoma or later, Apple silicon",
  },
  {
    id: "windows",
    name: "Windows",
    status: "available",
    asset: "Zephium-Windows-x64-setup.exe",
    requirement: "Windows 10 or later",
  },
  { id: "linux", name: "Linux", status: "soon" },
  { id: "ios", name: "iOS", status: "soon" },
  { id: "android", name: "Android", status: "soon" },
];

export const downloadUrl = (platform: Platform) =>
  platform.asset ? `${site.releases}/latest/download/${platform.asset}` : site.releases;

/** Platform ids the download page accepts in `?start=`, besides `1`. */
const startable = new Set<string>(platforms.filter((item) => item.status === "available").map((item) => item.id));

/**
 * The download page. With `start`, it begins the download on arrival, for the
 * visitor's own desktop or for the platform named. `plan` only changes one line
 * of next steps on the page; nothing about the plan leaves the browser.
 */
export const downloadPath = (options: { platform?: PlatformId; plan?: string } = {}) => {
  const query = new URLSearchParams({ start: options.platform && startable.has(options.platform) ? options.platform : "1" });
  if (options.plan && options.plan !== "free") query.set("plan", options.plan);
  return `/download?${query}`;
};

/** Whether the launch film is out, so the places that offer it show. */
export const hasFilm = () => Boolean(site.film.youtube);
