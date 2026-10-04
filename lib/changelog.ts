/**
 * What changed in Zephium, release by release, newest first. The changelog
 * page renders this list; each release links to its GitHub release, where
 * the builds are.
 */
export type ReleaseSection = {
  title: string;
  items: string[];
};

export type Release = {
  version: string;
  /** The release date, as an ISO date (YYYY-MM-DD). */
  date: string;
  title: string;
  summary: string;
  sections: ReleaseSection[];
};

export const RELEASES: Release[] = [
  {
    version: "1.0.0-beta.1",
    date: "2026-10-04",
    title: "The first beta",
    summary:
      "Zephium's first public beta, for Apple silicon Macs and Windows. A fast, private browser with a canvas for your agents one switch away, free and open source under the Mozilla Public License.",
    sections: [
      {
        title: "Browse",
        items: [
          "A native network blocker turns away ads and trackers before a page can load them, using EasyList and EasyPrivacy, with a count for every site.",
          "Chrome extensions install straight from the Chrome Web Store, including 1Password, Bitwarden, Grammarly, Dark Reader, SponsorBlock and Notion Web Clipper.",
          "The launcher, on ⌘ ⇧ Space, reaches tabs, tasks, notes, history and downloads from anywhere on your desktop.",
          "Tasks you write the way you would say them, landing on the right day.",
          "Notes beside the page, as Markdown files you own, with code that stays code.",
          "Activity shows where the day went, and Focus keeps distractions shut.",
          "A welcome that imports what you already have and sets up the essentials.",
          "Profiles keep each one's site data apart.",
        ],
      },
      {
        title: "Work",
        items: [
          "One switch turns the browser into a canvas, where you describe an outcome in your own words.",
          "The island keeps one line on what the run is doing, and asks before it guesses.",
          "Helpers work in parallel on live pages, in plain sight.",
          "Agents read and edit the folders you grant, and ask before they change a thing.",
          "They write and explain code, and run commands.",
          "Connect your tools through MCP servers and the command lines you already use, like GitHub and Slack.",
          "Results stay on the canvas: tables, comparisons and plans, and tasks made from a plan.",
        ],
      },
      {
        title: "Privacy and models",
        items: [
          "No telemetry. Zephium collects nothing about how you browse.",
          "Local first: history, tasks, notes and activity live on your device, and you never need an account to browse.",
          "Use Zephium's own AI, your own keys for OpenAI, Anthropic or Gemini, or a model that runs locally.",
        ],
      },
      {
        title: "Platforms",
        items: [
          "Apple silicon Macs and Windows, about 30 MB to download.",
          "Built in Rust on the system's own engine, WKWebView on macOS and WebView2 on Windows. Not a fork of Chromium or Firefox.",
          "Intel Macs, Linux, iOS and Android are on the way.",
        ],
      },
    ],
  },
];

/** The anchor for a release, e.g. "v1-0-0-beta-1". */
export const releaseAnchor = (version: string) => `v${version.replace(/\./g, "-")}`;
