import { site } from "@/lib/site";

/**
 * The documentation, as a list of topics. The index, the navigation on every
 * page, the previous and next links and the sitemap all read from here. A
 * topic with an `href` leads away from the site (building from source lives
 * in the repository); the rest are pages under /docs, whose words are in
 * `components/docs/content`.
 */
export type DocTopic = {
  slug: string;
  title: string;
  /** One or two sentences: the card on the index, the page's description. */
  summary: string;
  /** Where an outside topic lives. */
  href?: string;
};

export const topics: readonly DocTopic[] = [
  {
    slug: "getting-started",
    title: "Getting started",
    summary: "Install Zephium, bring your bookmarks and history along, and choose how you want to work.",
  },
  {
    slug: "browse",
    title: "Browse",
    summary: "The sidebar, spaces and profiles, the launcher, the blocker, and the notes, tasks and time beside your tabs.",
  },
  {
    slug: "ask-zephium",
    title: "Ask Zephium",
    summary: "The assistant in the sidebar: ask about the page in front of you, open what is worth it, restyle a site.",
  },
  {
    slug: "work",
    title: "Work and agents",
    summary: "The canvas, helpers that browse in the open, what they may do, and how a run goes from request to result.",
  },
  {
    slug: "models",
    title: "Models and keys",
    summary: "Zephium AI, accounts and credits, your own OpenAI, Anthropic or Gemini keys, and models on your computer.",
  },
  {
    slug: "extensions",
    title: "Extensions",
    summary: "Install Chrome extensions from the Chrome Web Store, manage what they can reach, and know what to expect.",
  },
  {
    slug: "privacy",
    title: "Privacy and security",
    summary: "What stays on your device, what leaves it, how the blocker works, and how far each guarantee goes.",
  },
  {
    slug: "shortcuts",
    title: "Keyboard shortcuts",
    summary: "Every default shortcut on macOS and Windows, and how to change any of them.",
  },
  {
    slug: "source",
    title: "Building from source",
    summary: "Toolchains, the development loop and how to open a pull request. It lives in the repository.",
    href: `${site.repo}#build-from-source`,
  },
];

/** The topics that are pages on this site, in reading order. */
export const pages = topics.filter((topic) => !topic.href);

export const docPath = (slug: string) => `/docs/${slug}`;

export const topicBySlug = (slug: string) => pages.find((topic) => topic.slug === slug);

/** The pages around one, for the links at the foot of it. */
export function neighbours(slug: string) {
  const at = pages.findIndex((topic) => topic.slug === slug);
  return {
    previous: at > 0 ? pages[at - 1] : undefined,
    next: at >= 0 && at < pages.length - 1 ? pages[at + 1] : undefined,
  };
}
