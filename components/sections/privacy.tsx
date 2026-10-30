import type { CSSProperties } from "react";
import { Principles } from "./principles";
import styles from "./privacy.module.css";

/**
 * Whose browser it is: AI that can be switched off, nothing sent about how
 * you browse, any model or none, an account only when it adds something, and
 * source anyone can read. One principle at a time, each with its picture.
 */
export function Privacy() {
  return (
    <section id="privacy" className={`container-page ${styles.section}`} aria-labelledby="privacy-title">
      <div className={styles.top}>
        <h2 id="privacy-title" data-reveal>
          A browser that answers to you.
        </h2>
        <p data-reveal style={{ "--delay": "0.08s" } as CSSProperties}>
          Zephium is complete on its own. AI is there when you call on it and gone when you switch
          it off, and what you do stays on your device.
        </p>
      </div>

      <Principles />
    </section>
  );
}
