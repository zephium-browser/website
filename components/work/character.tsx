"use client";

import { useEffect, useRef, useState, type CSSProperties } from "react";
import { characterMask, type CharacterKind, type LeadLook } from "./character-shapes";
import styles from "./character.module.css";

export type { CharacterKind, LeadLook } from "./character-shapes";

export type Mood =
  "rest" | "thinking" | "reading" | "searching" | "working" | "waiting" | "done" | "stopped";

const LIVE: ReadonlySet<Mood> = new Set<Mood>([
  "thinking",
  "reading",
  "searching",
  "working",
  "waiting",
]);

const REDUCED = "(prefers-reduced-motion: reduce)";

/**
 * Calls `notify` whenever the element should stop or may move again: it is
 * still while off screen, while the page is hidden, and while motion is
 * reduced. A per-element port of the product's shared `watchStill`.
 */
function watchStill(element: Element, notify: (still: boolean) => void): () => void {
  let visible = true;
  const media = window.matchMedia(REDUCED);
  const tell = () => notify(!visible || document.visibilityState === "hidden" || media.matches);
  const observer = new IntersectionObserver((entries) => {
    for (const entry of entries) visible = entry.isIntersecting;
    tell();
  });
  observer.observe(element);
  document.addEventListener("visibilitychange", tell);
  media.addEventListener("change", tell);
  return () => {
    observer.disconnect();
    document.removeEventListener("visibilitychange", tell);
    media.removeEventListener("change", tell);
  };
}

/**
 * The product's agent avatar, ported from Character.svelte: one lit body
 * masked to its kind's silhouette, a dark visor, two lit eyes whose shape
 * tells the mood.
 */
export function Character({
  kind = "lead",
  mood = "rest",
  size = 20,
  label,
  grounded = false,
  look = "pearl",
}: {
  kind?: CharacterKind;
  mood?: Mood;
  size?: number;
  /** Said to assistive technology; without it the character is decoration beside its name. */
  label?: string;
  /** Standing on the canvas: a soft contact shadow under it. */
  grounded?: boolean;
  /** The lead's figure. */
  look?: LeadLook;
}) {
  const live = LIVE.has(mood);
  const mask = characterMask(kind, look);
  const host = useRef<HTMLSpanElement>(null);
  const [still, setStill] = useState(true);

  /* Expressions change behind a blink, never on arrival; a finish cheers only
     when seen happening. Derived while rendering from the previous mood. */
  const [before, setBefore] = useState(mood);
  const [turned, setTurned] = useState(false);
  const [cheer, setCheer] = useState(false);
  if (before !== mood) {
    setBefore(mood);
    setTurned(true);
    setCheer(mood === "done" && (cheer || LIVE.has(before)));
  }

  useEffect(() => {
    const element = host.current;
    if (!element || !live) return;
    return watchStill(element, setStill);
  }, [live]);

  const className = [
    styles.character,
    styles[kind],
    styles[mood],
    live && styles.live,
    grounded && styles.grounded,
    size >= 28 && styles.fine,
    turned && styles.turned,
    cheer && styles.cheer,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <span
      ref={host}
      className={className}
      data-look={kind === "lead" ? look : undefined}
      data-still={live && still ? "" : undefined}
      style={{ "--size": `${size}px` } as CSSProperties}
      role={label ? "img" : undefined}
      aria-label={label}
      aria-hidden={label ? undefined : true}
    >
      {grounded && <span className={styles.ground} />}
      <span className={styles.pose}>
        <span className={styles.figure}>
          <span className={styles.body} style={{ maskImage: mask, WebkitMaskImage: mask }} />
          <span className={styles.visor}>
            <span className={styles.face}>
              <span key={mood} className={styles.eyes}>
                <i className={styles.eye} />
                <i className={styles.eye} />
              </span>
            </span>
          </span>
        </span>
      </span>
    </span>
  );
}
