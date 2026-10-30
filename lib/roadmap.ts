/**
 * What Zephium is building next, grouped by area. The roadmap page renders
 * this list. Change a status here and the page follows. No item carries a
 * date: nothing here is promised for a day, only for the order we care about.
 */
export type RoadmapStatus = "In progress" | "Planned";

export type RoadmapItem = {
  title: string;
  /** One plain sentence on what the item means, and no more. */
  body: string;
  status: RoadmapStatus;
  /** Where the title leads, when there is a page that helps today. */
  href?: string;
};

export type RoadmapGroup = {
  title: string;
  items: RoadmapItem[];
};

export const ROADMAP: RoadmapGroup[] = [
  {
    title: "Everywhere you are",
    items: [
      {
        title: "Linux",
        body: "Zephium on the Linux desktop.",
        status: "In progress",
        href: "/download#linux",
      },
      {
        title: "Intel Macs",
        body: "Zephium for Macs with an Intel processor, beside Apple silicon.",
        status: "Planned",
      },
      {
        title: "iOS",
        body: "A Zephium app for iPhone.",
        status: "Planned",
      },
      {
        title: "Android",
        body: "A Zephium app for Android phones.",
        status: "Planned",
      },
    ],
  },
  {
    title: "Sync and account",
    items: [
      {
        title: "Cloud sync",
        body: "Free sync across your devices. Browsing will still never need an account.",
        status: "In progress",
      },
      {
        title: "Cloud handoff",
        body: "Pick up what you were doing on another device.",
        status: "Planned",
      },
    ],
  },
  {
    title: "Browsing",
    items: [
      {
        title: "A better ad blocker",
        body: "Stronger blocking, including the ads on YouTube.",
        status: "Planned",
      },
      {
        title: "More extension support",
        body: "More of the extensions people rely on, working fully.",
        status: "Planned",
      },
      {
        title: "Our own password manager",
        body: "Passwords saved and filled by Zephium itself.",
        status: "Planned",
      },
      {
        title: "More performance work",
        body: "A browser that keeps getting faster and lighter.",
        status: "Planned",
      },
    ],
  },
  {
    title: "Make it yours",
    items: [
      {
        title: "A full customization layer",
        body: "Deeper control over how Zephium looks and behaves.",
        status: "Planned",
      },
      {
        title: "Themes and setups",
        body: "Save the way you have set Zephium up, and switch between setups.",
        status: "Planned",
      },
      {
        title: "A community marketplace",
        body: "Share your themes and setups, and use the ones other people made.",
        status: "Planned",
      },
    ],
  },
  {
    title: "Work and agents",
    items: [
      {
        title: "More MCP servers and CLIs",
        body: "More tools for Work to connect to, and deeper support for the ones it already uses.",
        status: "Planned",
      },
      {
        title: "Team collaboration",
        body: "Work with other people on the same canvas.",
        status: "Planned",
      },
    ],
  },
];
