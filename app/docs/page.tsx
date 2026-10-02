import type { Metadata } from "next";
import { ArrowUpRight01Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { PageShell } from "@/components/prose";
import { site } from "@/lib/site";
import styles from "./docs.module.css";

export const metadata: Metadata = {
  title: "Docs",
  description: `Documentation for ${site.name}: getting started, browsing, Work and agents, models and keys, extensions, privacy and building from source.`,
  alternates: { canonical: "/docs" },
};

const TOPICS: { title: string; body: string; href?: string }[] = [
  { title: "Getting started", body: "Install, import your bookmarks and passwords, and set up your first profile." },
  { title: "Browse", body: "Tabs, the launcher, the blocker, and the shortcuts that make it fast." },
  { title: "Work and agents", body: "The canvas, helpers, approvals, and how a run goes from request to result." },
  { title: "Models and keys", body: "Connect OpenAI, Anthropic or Gemini with your own keys, or run a local model." },
  { title: "Extensions", body: "Install Chrome extensions from the Chrome Web Store and manage them." },
  { title: "Privacy and security", body: "What stays on your device, what leaves it, and how sites are kept apart." },
  {
    title: "Building from source",
    body: "Toolchains, the development loop and the checks the project runs.",
    href: `${site.repo}#readme`,
  },
];

export default function DocsPage() {
  return (
    <PageShell title="Docs" lede="The documentation is being written. Here is what it will cover.">
      <ul className={styles.grid}>
        {TOPICS.map((topic) => (
          <li key={topic.title}>
            {topic.href ? (
              <a href={topic.href} className={styles.topic} data-live>
                <span className={styles.name}>
                  {topic.title}
                  <HugeiconsIcon icon={ArrowUpRight01Icon} size={16} strokeWidth={1.8} aria-hidden />
                </span>
                <span className={styles.body}>{topic.body}</span>
              </a>
            ) : (
              <div className={styles.topic}>
                <span className={styles.name}>
                  {topic.title}
                  <small>Soon</small>
                </span>
                <span className={styles.body}>{topic.body}</span>
              </div>
            )}
          </li>
        ))}
      </ul>
    </PageShell>
  );
}
