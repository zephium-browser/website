import type { Metadata } from "next";
import Link from "next/link";
import { ArrowUpRight01Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { PageShell } from "@/components/prose";
import { pageMetadata } from "@/lib/metadata";
import { ROADMAP, type RoadmapItem } from "@/lib/roadmap";
import { site } from "@/lib/site";
import styles from "./roadmap.module.css";

export const metadata: Metadata = pageMetadata({
  title: "Roadmap",
  description: `What ${site.name} is building next, in the open: more platforms, sync, a better blocker, ways to make the browser yours, and more for Work.`,
  path: "/roadmap",
});

/** One item: its name, what it means, and where it stands. */
function Item({ item }: { item: RoadmapItem }) {
  return (
    <li className={styles.item}>
      <div className={styles.text}>
        <h3>
          {item.href ? (
            <Link href={item.href}>
              {item.title}
              <HugeiconsIcon icon={ArrowUpRight01Icon} size={15} strokeWidth={1.8} aria-hidden />
            </Link>
          ) : (
            item.title
          )}
        </h3>
        <p>{item.body}</p>
      </div>
      <p className={styles.status} data-live={item.status === "In progress" || undefined}>
        {item.status}
      </p>
    </li>
  );
}

export default function RoadmapPage() {
  return (
    <PageShell
      title="Roadmap"
      lede="What we are building next, in the open. Tell us what matters."
    >
      <div className={styles.groups}>
        {ROADMAP.map((group, index) => (
          <section
            key={group.title}
            className={styles.group}
            aria-labelledby={`roadmap-${index}`}
            data-reveal
          >
            <h2 id={`roadmap-${index}`}>{group.title}</h2>
            <ul>
              {group.items.map((item) => (
                <Item key={item.title} item={item} />
              ))}
            </ul>
          </section>
        ))}
      </div>

      <section className={styles.close} aria-labelledby="roadmap-more" data-reveal>
        <h2 id="roadmap-more">And much, much more.</h2>
        <p>Something missing, or something you want sooner? Tell us.</p>
        <div className={styles.actions}>
          <a href={site.social.discord} className={styles.secondary}>
            Join the Discord
            <HugeiconsIcon icon={ArrowUpRight01Icon} size={15} strokeWidth={1.8} aria-hidden />
          </a>
          <a href={`${site.repo}/discussions`} className={styles.secondary}>
            GitHub Discussions
            <HugeiconsIcon icon={ArrowUpRight01Icon} size={15} strokeWidth={1.8} aria-hidden />
          </a>
        </div>
      </section>
    </PageShell>
  );
}

