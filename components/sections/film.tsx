import type { CSSProperties } from "react";
import { FilmPoster } from "@/components/film";
import { hasFilm } from "@/lib/site";
import styles from "./film.module.css";

/**
 * The launch film, near the end of the page: a quiet band of night sky with
 * the poster in the middle of it, so the page closes on the whole idea.
 */
export function Film() {
  if (!hasFilm()) return null;
  return (
    <section id="film" className={styles.section} aria-labelledby="film-title">
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
          <h2 id="film-title" data-reveal>
            See it in motion.
          </h2>
          <p data-reveal style={{ "--delay": "0.08s" } as CSSProperties}>
            The launch film: the browser, Work, and what your agents do with both.
          </p>
        </header>
        <div className={styles.poster} data-reveal="fade">
          <FilmPoster minutes="4:20" />
        </div>
      </div>
    </section>
  );
}
