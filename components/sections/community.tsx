import { ArrowUpRight01Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import type { CSSProperties } from "react";
import { siDiscord, siGithub, siProducthunt, siX, siYoutube } from "simple-icons";
import { FilmPoster } from "@/components/film";
import { LinuxWaitlist } from "@/components/linux-waitlist/waitlist";
import { getContributors, getStars } from "@/lib/github";
import { getFaces } from "@/lib/contributors";
import { hasFilm, site } from "@/lib/site";
import { RepoStats } from "./community-stats";
import styles from "./community.module.css";

const PLACES = [
  {
    id: "github",
    name: "GitHub",
    note: "Every line of the source",
    href: site.social.github,
    path: siGithub.path,
  },
  {
    id: "discord",
    name: "Discord",
    note: "Talk with the community",
    href: site.social.discord,
    path: siDiscord.path,
  },
  {
    id: "x",
    name: "X",
    note: "Updates as they ship",
    href: site.social.x,
    path: siX.path,
  },
  {
    id: "youtube",
    name: "YouTube",
    note: "Zephium in motion",
    href: site.social.youtube,
    path: siYoutube.path,
  },
  {
    id: "producthunt",
    name: "Product Hunt",
    note: "Help Zephium grow",
    href: site.social.producthunt,
    path: siProducthunt.path,
  },
].filter((place) => place.href);

/**
 * The launch film, near the end of the page, as a screen in a dark room: the
 * poster in the middle and its own light spilling softly around it.
 */
export function Film() {
  if (!hasFilm()) return null;
  return (
    <section id="film" className={`container-page ${styles.film}`} aria-labelledby="film-title">
      <header className={styles.filmHead}>
        <h2 id="film-title" data-reveal>
          See it in motion.
        </h2>
        <p data-reveal style={{ "--delay": "0.08s" } as CSSProperties}>
          The launch film: the browser, Work, and what your agents do with both.
        </p>
      </header>
      <div className={styles.screen} data-reveal="fade">
        <picture className={styles.spill}>
          <source type="image/avif" srcSet="/film/poster-1280.avif" />
          <img src="/film/poster-1280.jpg" alt="" loading="lazy" decoding="async" />
        </picture>
        <FilmPoster minutes="4:20" />
      </div>
    </section>
  );
}

/**
 * The people around Zephium, under the night sky that closes the page: the
 * faces of everyone who has sent a change, the places to find them, and the
 * Linux release email for whoever is waiting on it.
 */
export async function Community() {
  const [stars, contributors, faces] = await Promise.all([getStars(), getContributors(), getFaces()]);
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
      <div className={`container-page ${styles.grid}`}>
        <div className={styles.intro}>
          <h2 id="community-title" data-reveal>
            Built in the open.
          </h2>
          <p data-reveal style={{ "--delay": "0.08s" } as CSSProperties}>
            Zephium is made in public, with the people who use it. Read the code, send a fix, or
            come and say hello.
          </p>
          {faces.length ? (
            <div className={styles.people} data-reveal style={{ "--delay": "0.14s" } as CSSProperties}>
              <ul className={styles.faces} aria-label="People who have sent changes">
                {faces.map((face, index) => (
                  <li key={face.login} style={{ "--i": index } as CSSProperties}>
                    <a href={face.url} title={`@${face.login}`} aria-label={`@${face.login} on GitHub`}>
                      {/* eslint-disable-next-line @next/next/no-img-element -- a data URL made at build time */}
                      <img src={face.avatar} alt="" width={40} height={40} />
                    </a>
                  </li>
                ))}
              </ul>
              <RepoStats stars={stars} contributors={contributors} />
            </div>
          ) : null}
        </div>

        <ul className={styles.places}>
          {PLACES.map((place, index) => (
            <li key={place.id} data-reveal style={{ "--delay": `${index * 0.05}s` } as CSSProperties}>
              <a href={place.href} className={styles.place}>
                <svg viewBox="0 0 24 24" aria-hidden="true">
                  <path d={place.path} />
                </svg>
                <b>{place.name}</b>
                <span>{place.note}</span>
                <HugeiconsIcon icon={ArrowUpRight01Icon} size={18} strokeWidth={1.6} className={styles.go} aria-hidden />
              </a>
            </li>
          ))}
        </ul>
      </div>

      <div className="container-page">
        <div id="linux" className={styles.linux} data-reveal>
          <LinuxWaitlist headingId="community-linux-title" variant="bar" />
        </div>
      </div>
    </section>
  );
}
