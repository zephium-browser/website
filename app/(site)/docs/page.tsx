import type { Metadata } from "next";
import Link from "next/link";
import { ArrowUpRight01Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { TopicIcon } from "@/components/docs/topic-icon";
import { PageShell } from "@/components/prose";
import { docPath, topics } from "@/lib/docs";
import { site } from "@/lib/site";
import styles from "./docs.module.css";

export const metadata: Metadata = {
  title: "Docs",
  description: `Documentation for ${site.name}: getting started, browsing, the Zephium assistant, Work and agents, models and keys, extensions, privacy and security, and keyboard shortcuts.`,
  alternates: { canonical: "/docs" },
};

export default function DocsPage() {
  return (
    <PageShell
      title="Docs"
      lede="How to use Zephium: the browser, the assistant, Work and your agents, and the models behind them. Short pages, written for doing."
    >
      <ul className={styles.grid}>
        {topics.map((topic) => {
          const inside = (
            <>
              <span className={styles.mark}>
                <TopicIcon slug={topic.slug} />
              </span>
              <span className={styles.name}>
                {topic.title}
                <HugeiconsIcon
                  icon={ArrowUpRight01Icon}
                  size={16}
                  strokeWidth={1.8}
                  aria-hidden
                  data-out={topic.href ? "" : undefined}
                />
              </span>
              <span className={styles.body}>{topic.summary}</span>
            </>
          );
          return (
            <li key={topic.slug}>
              {topic.href ? (
                <a href={topic.href} className={styles.topic}>
                  {inside}
                </a>
              ) : (
                <Link href={docPath(topic.slug)} className={styles.topic}>
                  {inside}
                </Link>
              )}
            </li>
          );
        })}
      </ul>
      <p className={styles.help}>
        Not here? Ask on <a href={site.social.discord}>Discord</a>, open an{" "}
        <a href={`${site.repo}/issues`}>issue</a>, or see <Link href="/support">support</Link>.
      </p>
    </PageShell>
  );
}
