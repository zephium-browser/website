"use client";

import { useEffect, useRef, useState } from "react";
import { watchStill } from "./still";
import styles from "./shimmer.module.css";

/**
 * Words at work, ported from the product's Shimmer.svelte: a band of light
 * passes along them. The band is a masked window sliding one way while its
 * bright copy of the words slides back, so the light moves and the words stay
 * put, by transform alone.
 */
export function Shimmer({ text, running = true }: { text: string; running?: boolean }) {
  const host = useRef<HTMLSpanElement>(null);
  const [still, setStill] = useState(true);

  useEffect(() => {
    const element = host.current;
    if (!element || !running) return;
    return watchStill(element, setStill);
  }, [running]);

  const className = [styles.shimmer, running && styles.running].filter(Boolean).join(" ");

  return (
    <span ref={host} className={className} data-still={running && still ? "" : undefined}>
      <span className={styles.words}>{text}</span>
      {running && (
        <span className={styles.band} aria-hidden="true">
          <span className={styles.lit}>{text}</span>
        </span>
      )}
    </span>
  );
}
