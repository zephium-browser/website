import type { CSSProperties } from "react";
import { FilmPoster } from "@/components/film";
import { hasFilm } from "@/lib/site";
import styles from "./film.module.css";

/** The launch film, right after the opening: four minutes of the whole idea. */
export function Film() {
  if (!hasFilm()) return null;
  return (
    <section id="film" className={`container-page ${styles.section}`} aria-labelledby="film-title">
      <header className={styles.head}>
        <h2 id="film-title" data-reveal>
          Four minutes with Zephium.
        </h2>
        <p data-reveal style={{ "--delay": "0.08s" } as CSSProperties}>
          The launch film: the browser, Work, and what your agents do with both.
        </p>
      </header>
      <div className={styles.poster} data-reveal="fade">
        <FilmPoster minutes="4:20" />
      </div>
    </section>
  );
}
