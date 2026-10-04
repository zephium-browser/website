/**
 * Facts about Zephium that more than one page states. Anything a visitor can
 * check (a link, a platform, a license) lives here so it cannot drift between
 * the hero, the download page and the structured data search engines read.
 */
export const site = {
  name: "Zephium",
  url: "https://zephium.app",
  title: "Zephium — a browser-native work environment",
  tagline: "A browser-native work environment, rebuilt for you and your agents.",
  description:
    "Zephium is a fast, private, open-source browser built in Rust, with Work: a canvas where you and your agents browse, compare and plan in the open, and keep the results.",
  repo: "https://github.com/zephium-browser/Zephium",
  releases: "https://github.com/zephium-browser/Zephium/releases",
  /** This website's own source; it is open source too. */
  websiteRepo: "https://github.com/zephium-browser/website",
  license: "MPL-2.0",
  /** Approximate size of the download, as the site states it. */
  downloadSize: "about 30 MB",
  /** The person who makes Zephium. */
  author: { name: "Crynta", url: "https://github.com/crynta" },
  /** Community links. An empty one is left out of the footer until it exists. */
  social: {
    github: "https://github.com/crynta",
    x: "",
    discord: "https://discord.gg/tyveTUyEp7",
    youtube: "https://www.youtube.com/@crynta",
  },
  /** Contact for privacy and legal questions. */
  contact: "hello@zephium.app",
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
