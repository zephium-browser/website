import type { CSSProperties } from "react";
import { site } from "@/lib/site";
import { ModelWheel } from "./model-wheel";
import styles from "./privacy.module.css";

/**
 * Whose browser it is. AI is the user's to choose, any of it or none of it,
 * shown as the picker itself, beside the principles that hold either way.
 */
export function Privacy() {
  return (
    <section id="privacy" className={`container-page ${styles.section}`} aria-labelledby="privacy-title">
      <div className={styles.head}>
        <h2 id="privacy-title" data-reveal>
          Any AI you like.
          <br />
          Or none at all.
        </h2>
        <p data-reveal style={{ "--delay": "0.08s" } as CSSProperties}>
          Zephium is a whole browser on its own. Bring in AI the way you like it: ours, your own key,
          or a model on your computer. Or leave it off, and nothing else changes.
        </p>
      </div>

      <div className={styles.wheel} data-reveal="fade" style={{ "--delay": "0.12s" } as CSSProperties}>
        <ModelWheel />
      </div>

      <dl className={styles.facts} data-reveal style={{ "--delay": "0.16s" } as CSSProperties}>
        <div>
          <dt>No telemetry</dt>
          <dd>Nothing about how you browse is collected.</dd>
        </div>
        <div>
          <dt>No account to browse</dt>
          <dd>Until you sign in, Zephium never contacts our servers.</dd>
        </div>
        <div>
          <dt>Open source</dt>
          <dd>
            Every line is <a href={site.repo}>on GitHub</a>, under MPL-2.0.
          </dd>
        </div>
      </dl>
    </section>
  );
}
