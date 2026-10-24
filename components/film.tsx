"use client";

import { Cancel01Icon, PlayIcon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { useEffect, useRef, useState, type ReactNode } from "react";
import { hasFilm, site } from "@/lib/site";
import styles from "./film.module.css";

/*
 * The launch film. Anything can offer it (a button, the poster); one player
 * plays it, over the page. Nothing is loaded from YouTube until someone
 * presses play, and then only from youtube-nocookie.com. While the film has
 * no video yet, every way to it is left out.
 */

const OPEN = "zephium:film";

export function openFilm() {
  window.dispatchEvent(new Event(OPEN));
}

/** A button that plays the film; nothing while there is none. */
export function FilmButton({ className, children }: { className?: string; children: ReactNode }) {
  if (!hasFilm()) return null;
  return (
    <button type="button" className={className} onClick={openFilm}>
      {children}
    </button>
  );
}

/** The film as a picture to press: its poster, with play over it. */
export function FilmPoster({ minutes }: { minutes: string }) {
  if (!hasFilm()) return null;
  return (
    <button type="button" className={styles.poster} onClick={openFilm} aria-label={`Play the film, ${site.film.title}`}>
      <picture>
        <source
          type="image/avif"
          srcSet="/film/poster-1280.avif 1280w, /film/poster-2560.avif 2560w"
          sizes="(min-width: 1240px) 1200px, 94vw"
        />
        <img
          src="/film/poster-1280.jpg"
          srcSet="/film/poster-1280.jpg 1280w, /film/poster-2560.jpg 2560w"
          sizes="(min-width: 1240px) 1200px, 94vw"
          alt=""
          width={1280}
          height={720}
          loading="lazy"
          decoding="async"
        />
      </picture>
      <span className={styles.play} aria-hidden="true">
        <HugeiconsIcon icon={PlayIcon} size={26} strokeWidth={1.6} />
      </span>
      <span className={styles.meta} aria-hidden="true">
        <b>{site.film.title}</b>
        <span>{minutes}</span>
      </span>
    </button>
  );
}

/** The player. Mounted once; it opens when anything asks for the film. */
export function FilmPlayer() {
  const ref = useRef<HTMLDialogElement>(null);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!hasFilm()) return;
    const show = () => {
      ref.current?.showModal();
      setOpen(true);
    };
    window.addEventListener(OPEN, show);
    return () => window.removeEventListener(OPEN, show);
  }, []);

  if (!hasFilm()) return null;
  const close = () => ref.current?.close();
  const src = `https://www.youtube-nocookie.com/embed/${site.film.youtube}?autoplay=1&rel=0&playsinline=1&color=white`;

  return (
    <dialog
      ref={ref}
      className={styles.dialog}
      aria-label={site.film.title}
      onClose={() => setOpen(false)}
      onClick={(event) => {
        if (event.target === event.currentTarget) close();
      }}
    >
      <div className={styles.frame}>
        {open ? (
          <iframe
            src={src}
            title={site.film.title}
            allow="autoplay; encrypted-media; fullscreen; picture-in-picture"
            allowFullScreen
            referrerPolicy="strict-origin-when-cross-origin"
          />
        ) : null}
      </div>
      <button type="button" className={styles.close} onClick={close} aria-label="Close the film">
        <HugeiconsIcon icon={Cancel01Icon} size={18} strokeWidth={1.8} aria-hidden />
      </button>
    </dialog>
  );
}
