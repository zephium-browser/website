import { ArrowUpRight01Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import type { CSSProperties } from "react";
import { siDiscord, siGithub, siProducthunt, siX, siYoutube } from "simple-icons";
import { FilmPoster } from "@/components/film";
import { LinuxWaitlist } from "@/components/linux-waitlist/waitlist";
import { getContributors, getStars } from "@/lib/github";
import { hasFilm, site } from "@/lib/site";
import { RepoStats } from "./community-stats";
import styles from "./community.module.css";

const PLACES = [
  {
    id: "github",
    href: site.repo,
    path: siGithub.path,
    title: "Star Zephium on GitHub",
    body: "The browser, this website and the backend, all open source.",
  },
  {
    id: "discord",
    href: site.social.discord,
    path: siDiscord.path,
    title: "Join the community",
    body: "Ask questions, report bugs, and talk with the people who make and use Zephium.",
  },
  {
    id: "x",
    href: site.social.x,
    path: siX.path,
    title: `Follow ${site.author.name} on X`,
    body: "The person who makes Zephium, building it in public.",
  },
  {
    id: "youtube",
    href: site.social.youtube,
    path: siYoutube.path,
    title: "Watch on YouTube",
    body: "The launch film, and videos of Zephium being built.",
  },
  {
    id: "producthunt",
    href: site.social.producthunt,
    path: siProducthunt.path,
    title: "Zephium on Product Hunt",
    body: "Each launch, the day it goes live.",
  },
].filter((place) => place.href);

/**
 * The end of the home page, on the night sky from the product's new tab: the
 * launch film in the middle, then where the people around Zephium are, as
 * panes of glass over the sky, and where to hear about Linux. The repository
 * leads, with its real numbers. Each card is one link.
 */
export async function Community() {
  const [stars, contributors] = await Promise.all([getStars(), getContributors()]);
  return (
    <section id="community" className={styles.section} aria-labelledby="community-title">
      <picture className={styles.sky}>
        <source type="image/avif" srcSet="/sky/night-1200.avif 1200w, /sky/night-2200.avif 2200w" sizes="100vw" />
        <img
          src="/sky/night-1200.jpg"
          srcSet="/sky/night-1200.jpg 1200w, /sky/night-2200.jpg 2200w"
          sizes="100vw"
          alt=""
          loading="lazy"
          decoding="async"
        />
      </picture>
      <div className="container-page">
        <header className={styles.head}>
          <h2 id="community-title" data-reveal>
            Built in the open.
          </h2>
          <p data-reveal style={{ "--delay": "0.08s" } as CSSProperties}>
            Zephium is made in public, with the people who use it.
            {hasFilm() ? " Watch the launch film, then come and say hello." : null}
          </p>
        </header>

        {hasFilm() ? (
          <div id="film" className={styles.poster} data-reveal="fade">
            <FilmPoster minutes="4:20" />
          </div>
        ) : null}

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
                  <b>{place.title}</b>
                  <span className={styles.body}>{place.body}</span>
                  {place.id === "github" ? <RepoStats stars={stars} contributors={contributors} /> : null}
                </span>
                <HugeiconsIcon icon={ArrowUpRight01Icon} size={18} strokeWidth={1.6} className={styles.go} aria-hidden />
              </a>
            </li>
          ))}
        </ul>

        <div className={styles.linux} data-reveal>
          <LinuxWaitlist variant="bar" headingId="linux-bar-title" />
        </div>
      </div>
    </section>
  );
}
