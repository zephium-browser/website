import { ArrowUpRight01Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import type { CSSProperties } from "react";
import { siDiscord, siGithub, siProducthunt, siX, siYoutube } from "simple-icons";
import { getContributors, getStars } from "@/lib/github";
import { site } from "@/lib/site";
import { RepoStats } from "./community-stats";
import styles from "./community.module.css";

const PLACES = [
  {
    id: "github",
    name: "GitHub",
    href: site.repo,
    path: siGithub.path,
    title: "Star the repo",
    body: "Read the code, follow what changes and send a fix.",
  },
  {
    id: "discord",
    name: "Discord",
    href: site.social.discord,
    path: siDiscord.path,
    title: "Join the Discord",
    body: "Talk with the maker, report bugs and see what is next.",
  },
  {
    id: "x",
    name: "X",
    href: site.social.x,
    path: siX.path,
    title: "Follow for releases",
    body: "New versions and small updates from @CryntaDev.",
  },
  {
    id: "youtube",
    name: "YouTube",
    href: site.social.youtube,
    path: siYoutube.path,
    title: "Watch on YouTube",
    body: "The launch film and the build videos.",
  },
  {
    id: "producthunt",
    name: "Product Hunt",
    href: site.social.producthunt,
    path: siProducthunt.path,
    title: "Follow on Product Hunt",
    body: "Follow along there and tell others what you think.",
  },
].filter((place) => place.href);

/**
 * Where the people around Zephium are: the repository first, with its real
 * numbers, then the places to talk, watch and follow. Each card is one link.
 */
export async function Community() {
  const [stars, contributors] = await Promise.all([getStars(), getContributors()]);
  return (
    <section id="community" className={`container-page ${styles.section}`} aria-labelledby="community-title">
      <header className={styles.head}>
        <h2 id="community-title" data-reveal>
          Built in the open.
        </h2>
        <p data-reveal style={{ "--delay": "0.08s" } as CSSProperties}>
          Zephium is made in public with the people who use it. Come say hello.
        </p>
      </header>

      <ul className={styles.grid}>
        {PLACES.map((place, index) => (
          <li
            key={place.id}
            className={place.id === "github" ? styles.lead : undefined}
            data-reveal
            style={{ "--delay": `${(index % 3) * 0.06}s` } as CSSProperties}
          >
            <a href={place.href} className={styles.card}>
              <svg viewBox="0 0 24 24" aria-hidden="true" className={styles.mark}>
                <path d={place.path} />
              </svg>
              <span className={styles.text}>
                <span className={styles.name}>{place.name}</span>
                <b>{place.title}</b>
                <span className={styles.body}>{place.body}</span>
                {place.id === "github" ? <RepoStats stars={stars} contributors={contributors} /> : null}
              </span>
              <HugeiconsIcon icon={ArrowUpRight01Icon} size={18} strokeWidth={1.6} className={styles.go} aria-hidden />
            </a>
          </li>
        ))}
      </ul>
    </section>
  );
}
