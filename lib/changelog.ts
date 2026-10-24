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
];

/** The anchor for a release, e.g. "v1-0-0-beta-1". */
export const releaseAnchor = (version: string) => `v${version.replace(/\./g, "-")}`;
