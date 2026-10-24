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
    version: "1.0.3",
    date: "2026-10-24",
    title: "Zephium, in public",
    summary:
      "The public release. A redesigned Zephium from the new tab to the canvas, Ask Zephium in the sidebar, a rebuilt Work, and Zephium AI for hosted models without keys to manage.",
    sections: [
      {
        title: "Highlights",
        items: [
          "A new interface throughout, quieter and more precise, with the window's own material behind the sidebar and the window material of your choice.",
          "The new tab opens onto the sky, by day or by night with your theme, with your time, your focus and the day's tasks along its foot.",
          "Ask Zephium, an assistant in the sidebar: it reads the page you are on, takes small steps on it when you ask, restyles a site, and hands larger jobs to Work.",
          "Zephium AI: sign in with an email code and use hosted models with no keys to manage. 250 credits to start; Pro and Max add 2,000 or 10,000 every month.",
        ],
      },
      {
        title: "Work",
        items: [
          "Helpers browse live pages in parallel, in plain sight, and finish forms, searches and listings with native, verified steps.",
          "Results land on the canvas as tables, charts, diagrams, code and plans, and a plan becomes tasks in one press.",
          "It asks before it guesses, and before it changes anything.",
          "Hosted models, your own keys from nine providers, or a local model through Ollama or LM Studio, found on your Mac.",
          "Dictation, with Apple's on-device recognizer or a hosted engine.",
        ],
      },
      {
        title: "Browse",
        items: [
          "Spaces, each with its own look, switched with a swipe, from the menu bar or the rail.",
          "One menu at the foot of the sidebar for your account, your profiles, a private window and your tools.",
          "Idle tabs are archived from Today, and links from other apps land where they belong.",
          "Close a tab with a middle-click, and drag tabs where you want them.",
          "Every string in twelve languages.",
        ],
      },
    ],
  },
  {
    version: "1.0.0-beta.2",
    date: "2026-10-04",
    title: "Steadier updates",
    summary:
      "A small update that makes the next ones more dependable, and Zephium a little lighter to download.",
    sections: [
      {
        title: "Fixes",
        items: [
          "An update check or download that stops responding now gives up and tries again later, instead of holding back updates until you restart.",
          "About 1 MB smaller to download on both macOS and Windows.",
        ],
      },
    ],
  },
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
          "Time & Focus shows where the day went, and keeps distractions shut.",
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
          "Apple silicon Macs and Windows, about 20 MB to download.",
          "Built in Rust on the system's own engine, WKWebView on macOS and WebView2 on Windows. Not a fork of Chromium or Firefox.",
          "Intel Macs, Linux, iOS and Android are on the way.",
        ],
      },
    ],
  },
];

/** The anchor for a release, e.g. "v1-0-0-beta-1". */
export const releaseAnchor = (version: string) => `v${version.replace(/\./g, "-")}`;
