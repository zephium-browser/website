import type { Metadata } from "next";
import Link from "next/link";
import { ArrowUpRight01Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import type { CSSProperties } from "react";
import { PageShell } from "@/components/prose";
import { RELEASES, releaseAnchor } from "@/lib/changelog";
import { site } from "@/lib/site";
import styles from "./changelog.module.css";

export const metadata: Metadata = {
  title: "Changelog",
  description: `What is new in ${site.name}, release by release.`,
  alternates: { canonical: "/changelog" },
};

const formatDate = (date: string) =>
  new Date(`${date}T12:00:00Z`).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
    timeZone: "UTC",
  });

export default function ChangelogPage() {
  return (
    <PageShell title="Changelog" lede={`New in ${site.name}, release by release.`}>
      <ol className={styles.releases}>
        {RELEASES.map((release, index) => (
          <li
            key={release.version}
            id={releaseAnchor(release.version)}
            className={styles.release}
            data-reveal
            style={{ "--delay": `${Math.min(index, 3) * 0.06}s` } as CSSProperties}
          >
            <header className={styles.meta}>
              <a href={`#${releaseAnchor(release.version)}`} className={styles.version}>
                {release.version}
              </a>
              <time dateTime={release.date}>{formatDate(release.date)}</time>
              {index === 0 ? <span className={styles.latest}>Latest</span> : null}
            </header>

            <div className={styles.body}>
              <h2>{release.title}</h2>
              <p className={styles.summary}>{release.summary}</p>

              {release.sections.map((section) => (
                <section key={section.title} className={styles.section}>
                  <h3>{section.title}</h3>
                  <ul>
                    {section.items.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                </section>
              ))}

              <div className={styles.links}>
                {index === 0 ? (
                  <Link href="/download" className={styles.primary}>
                    Download {release.version}
                  </Link>
                ) : null}
                <a href={`${site.releases}/tag/v${release.version}`} className={styles.secondary}>
                  Release on GitHub
                  <HugeiconsIcon icon={ArrowUpRight01Icon} size={15} strokeWidth={1.8} aria-hidden />
                </a>
              </div>
            </div>
          </li>
        ))}
      </ol>
    </PageShell>
  );
}
