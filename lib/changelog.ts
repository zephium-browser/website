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
  /**
   * GitHub handles of the people outside the project whose changes are in
   * this release. The page thanks them at the end of the entry.
   */
  thanks?: string[];
  /** Those in `thanks` who contributed for the first time in this release. */
  firstContributions?: string[];
};

export const RELEASES: Release[] = [
  {
    version: "1.0.4",
    date: "2026-10-28",
    title: "Shaped by the first week",
    summary:
      "Four days after launch: a sidebar that hides, a new tab you can make your own, the everyday things a browser needs, Windows brought closer to the Mac, and fixes sent in by people who use Zephium.",
    sections: [
      {
        title: "Highlights",
        items: [
          "The sidebar hides. Press its toggle, then move to the left edge of the window to bring it back over the page.",
          "Make the new tab yours: keep the sky or choose a picture from your computer, dim it, and show or hide the wordmark, the tracker, your focus and your tasks. One press resets it.",
          "On a new tab, the window's glass takes on the light of the sky.",
          "Zephium opens on a new tab. A startup choice you made yourself stays as it was.",
          "Windows wears Mica Alt, with a frame that follows your theme. Windows 10 uses acrylic.",
        ],
      },
      {
        title: "Browse",
        items: [
          "A page that cannot open, or whose tab crashed, says why and offers Retry or Reload, including tabs restored at launch.",
          "Recently Closed brings a tab back to its own space. Back and Forward list a tab's history, and View Source and Save Page As are in the menu.",
          "Closing the last tab opens a new one.",
          "Downloads pause and resume, and risky files ask before they are kept.",
          "Sites that ask for a username and password through the browser get a sign-in card, and a refused certificate says what is wrong.",
          "One site panel at the end of the address field: the connection, blocking, permissions, zoom, hidden elements, extensions and clearing this site's data. Site Settings lists every site's permissions.",
          "Zoom is remembered for each site. Tabs show their sound and mute from the icon, and the tab that is playing has a player in the sidebar.",
          "A manual HTTP(S) or SOCKS5 proxy.",
          "Bookmarks appear in the address bar's suggestions, and bookmarks and history export to a file.",
          "Import from Helium, Dia, Vivaldi, Opera, Opera GX, Comet, Chromium, Floorp, LibreWolf and Waterfox. Chrome bookmarks kept under a signed-in account come across too.",
          "Essentials belong to each space.",
        ],
      },
      {
        title: "Windows",
        items: [
          "Save Image As and Save Link As work again.",
          "Switching tabs or opening a new tab no longer closes the browser.",
          "Passwords and forms save and fill, and Chrome's keyboard shortcuts work: F5, F11, F12, Alt with the arrows, and the rest.",
          "A page that stops responding offers Wait or Reload.",
          "The launcher no longer freezes the window the first time, an extension's toolbar no longer holds it up, and fullscreen on a maximized window ends cleanly.",
          "If Zephium cannot start, it says why in plain words and shows where the log is.",
          "A SmartScreen switch in Settings under Privacy, and a link to Windows' own diagnostic data settings.",
        ],
      },
      {
        title: "macOS",
        items: [
          "Pages that open in a new tab after a redirect, like adding another Google account, load instead of staying blank.",
          "The in-field menus of extensions such as Bitwarden show up on sites.",
          "The launcher takes typing the moment it opens.",
          "Printing no longer changes the Mac's page setup, and the window controls line up with the sidebar's header.",
        ],
      },
      {
        title: "Work and Ask Zephium",
        items: [
          "A free Groq key that runs into its limit now says so, and what to do, instead of failing without a reason. Qwen 3.8 27B is available on Groq.",
          "A helper no longer gets stuck when a model sends empty fields along with its request.",
          "Runs on a model on your own device or network cost nothing.",
          "What Ask Zephium writes can be selected and copied.",
        ],
      },
      {
        title: "Security and privacy",
        items: [
          "Extensions are kept apart by profile: one cannot replace another's, and deleting a profile removes its extensions.",
          "A saved provider key is only ever sent to the address it was saved for.",
          "Ask Zephium asks before it searches, and shows the exact query and where it goes. Allowing history no longer shares your open tabs.",
          "Windows updates are bound to their version and platform, so an older installer can never be offered as a newer one.",
          "Clear browsing data covers cookies, site data and the cache, and can clear a single site.",
          "Notes are not overwritten by a quick edit made outside Zephium, and deleting a profile waits for its notes, so deleted notes cannot come back.",
          "Safari's files are not read until you choose to import.",
        ],
      },
    ],
    thanks: ["mydd7", "kd100100", "nduongg04", "ErnieBernie10"],
    firstContributions: ["kd100100", "nduongg04", "ErnieBernie10"],
  },
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
    thanks: ["drunkardleo-10", "mydd7"],
    firstContributions: ["drunkardleo-10", "mydd7"],
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
    title: "The first public beta",
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

/** Where the feed of these releases is served. */
export const changelogFeedPath = "/changelog.xml";

/** The anchor for a release, e.g. "v1-0-0-beta-1". */
export const releaseAnchor = (version: string) => `v${version.replace(/\./g, "-")}`;
