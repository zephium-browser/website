import Link from "next/link";
import { ArrowDown01Icon, ArrowUpRight01Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { docPath, topics } from "@/lib/docs";
import { TopicIcon } from "./topic-icon";
import styles from "./docs.module.css";

function Links({ current }: { current: string }) {
  return (
    <ul className={styles.navList}>
      {topics.map((topic) => (
        <li key={topic.slug}>
          {topic.href ? (
            <a href={topic.href} className={styles.navLink}>
              <TopicIcon slug={topic.slug} size={16} />
              <span>{topic.title}</span>
              <HugeiconsIcon icon={ArrowUpRight01Icon} size={14} strokeWidth={1.8} aria-hidden className={styles.navOut} />
            </a>
          ) : (
            <Link
              href={docPath(topic.slug)}
              className={styles.navLink}
              aria-current={topic.slug === current ? "page" : undefined}
            >
              <TopicIcon slug={topic.slug} size={16} />
              <span>{topic.title}</span>
            </Link>
          )}
        </li>
      ))}
    </ul>
  );
}

/**
 * Every topic, as a column that stays in view beside the page on a wide
 * screen, and as a bar that opens under the navigation on a phone. It is
 * plain links and a details element: nothing here needs a script.
 */
export function DocsNav({ current }: { current: string }) {
  const here = topics.find((topic) => topic.slug === current);
  return (
    <>
      <nav aria-label="Documentation" className={styles.sideNav}>
        <p className={styles.navHeading}>
          <Link href="/docs">Documentation</Link>
        </p>
        <Links current={current} />
      </nav>
      <details key={current} className={styles.mobileNav}>
        <summary>
          <span className={styles.mobileLabel}>Docs</span>
          <span className={styles.mobileCurrent}>{here?.title ?? "All topics"}</span>
          <HugeiconsIcon icon={ArrowDown01Icon} size={16} strokeWidth={1.8} aria-hidden className={styles.mobileChevron} />
        </summary>
        <nav aria-label="Documentation topics">
          <Links current={current} />
        </nav>
      </details>
    </>
  );
}
