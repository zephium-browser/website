"use client";

import { useEffect, useRef, type CSSProperties } from "react";
import { orbKeyframes, orbStrip } from "./orb-strip";
import { watchStill } from "./still";
import styles from "./orb.module.css";

/**
 * The working indicator, ported from the product's Orb.svelte: an evenly
 * dotted sphere turning while a band of light rises through it. It is drawn
 * once into a strip of frames and stepped a whole frame at a time.
 *
 * `size` is in design pixels: the orb is `size` times `--u` across, and its
 * strip is drawn for that size, so it keeps the product's dot weights at any
 * scale. The strip is attached on the client, keeping it out of the HTML.
 */
export function Orb({ size = 20, label }: {
  size?: number;
  /** Said to assistive technology; without it the orb is decoration beside its words. */
  label?: string;
}) {
  const host = useRef<HTMLSpanElement>(null);
  const film = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const element = film.current;
    const watched = host.current;
    if (!element || !watched) return;
    const { frames, fps, mask } = orbStrip(size);
    element.style.inlineSize = `${frames * 100}%`;
    element.style.maskImage = mask;
    element.style.setProperty("-webkit-mask-image", mask);
    const run = element.animate(orbKeyframes(frames), {
      duration: (frames / fps) * 1000,
      iterations: Infinity,
      easing: "linear",
    });
    run.pause();
    const stop = watchStill(watched, (still) => {
      if (still) run.pause();
      else run.play();
    });
    return () => {
      stop();
      run.cancel();
    };
  }, [size]);

  return (
    <span
      ref={host}
      className={styles.orb}
      style={{ "--orb-size": size } as CSSProperties}
      role={label ? "img" : undefined}
      aria-label={label}
      aria-hidden={label ? undefined : true}
    >
      <span ref={film} className={styles.film} />
    </span>
  );
}
