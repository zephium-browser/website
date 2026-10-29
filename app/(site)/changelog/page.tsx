import type { Metadata } from "next";
import { ArrowDown01Icon, ArrowUpRight01Icon, RssIcon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import type { CSSProperties } from "react";
import { DownloadLink } from "@/components/download-link";
import { PageShell } from "@/components/prose";
import {
  RELEASES,
  changelogFeedPath,
  releaseAnchor,
  type Release,
  type ReleaseSection,
} from "@/lib/changelog";
import { pageMetadata } from "@/lib/metadata";
import { site } from "@/lib/site";
import styles from "./changelog.module.css";

export const metadata: Metadata = pageMetadata({
  title: "Changelog",
  description: `What is new in ${site.name}, release by release: the features, fixes and changes in every version since the first public beta, with the builds on GitHub.`,
  path: "/changelog",
});

const WORDS = ["no", "one", "two", "three", "four", "five", "six", "seven", "eight", "nine"];

/** A quiet thank-you to the people outside the project whose changes are in a release. */
function Thanks({ release }: { release: Release }) {
  const { thanks = [], firstContributions = [] } = release;
  if (thanks.length === 0) return null;
  const names = thanks.map((handle) => (
    <a key={handle} href={`https://github.com/${handle}`}>
      @{handle}
    </a>
  ));
  const first = firstContributions.length;
  return (
    <p className={styles.thanks}>
      Thanks to{" "}
      {names.map((name, index) => (
        <span key={thanks[index]}>
          {index > 0 ? (index === names.length - 1 ? " and " : ", ") : null}
          {name}
        </span>
      ))}
      {first > 1
        ? `, and welcome to the ${WORDS[first] ?? first} of you who contributed for the first time.`
        : first === 1
          ? ", and welcome to a first-time contributor."
          : "."}
    </p>
  );
}

/** One group of changes under its heading. */
function Group({ section }: { section: ReleaseSection }) {
  return (
    <section className={styles.section}>
      <h3>{section.title}</h3>
      <ul>
        {section.items.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
    </section>
  );
}

/**
 * What a release shows up front and what waits behind "All changes". The
 * Highlights group is always shown. A release with no Highlights, and a
 * single group, shows that group; one with several keeps them all behind the
 * disclosure, so the page still scans.
 */
function split({ sections }: Release) {
  const shown = sections.filter((section) => section.title === "Highlights");
  if (shown.length === 0 && sections.length === 1) return { shown: sections, rest: [] };
  return { shown, rest: sections.filter((section) => !shown.includes(section)) };
}

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
      <p className={styles.feed}>
        <a href={changelogFeedPath}>
          <HugeiconsIcon icon={RssIcon} size={15} strokeWidth={1.8} aria-hidden />
          RSS feed
        </a>
      </p>
      <ol className={styles.releases}>
        {RELEASES.map((release, index) => {
          const { shown, rest } = split(release);
          return (
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

                {shown.map((section) => (
                  <Group key={section.title} section={section} />
                ))}

                {rest.length > 0 ? (
                  <details className={styles.all} open={index === 0}>
                    <summary>
                      All changes ({rest.reduce((total, section) => total + section.items.length, 0)})
                      <HugeiconsIcon icon={ArrowDown01Icon} size={16} strokeWidth={1.8} aria-hidden />
                    </summary>
                    {rest.map((section) => (
                      <Group key={section.title} section={section} />
                    ))}
                  </details>
                ) : null}

                <Thanks release={release} />

                <div className={styles.links}>
                  {index === 0 ? (
                    <DownloadLink className={styles.primary}>Download {release.version}</DownloadLink>
                  ) : null}
                  <a href={`${site.releases}/tag/v${release.version}`} className={styles.secondary}>
                    Release on GitHub
                    <HugeiconsIcon icon={ArrowUpRight01Icon} size={15} strokeWidth={1.8} aria-hidden />
                  </a>
                </div>
              </div>
            </li>
          );
        })}
      </ol>
    </PageShell>
  );
}
