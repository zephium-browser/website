import type { CSSProperties } from "react";
import { site } from "@/lib/site";
import { ModelWheel } from "./model-wheel";
import styles from "./privacy.module.css";

/**
 * Whose browser it is. Every part answers to the user, AI most of all: any
 * model or none, shown as the picker itself, beside the principles that hold
 * either way.
 */
export function Privacy() {
  return (
    <section id="privacy" className={`container-page ${styles.section}`} aria-labelledby="privacy-title">
      <div className={styles.head}>
        <h2 id="privacy-title" data-reveal>
          Yours to shape.
          <br />
          AI only if you want it.
        </h2>
        <p data-reveal style={{ "--delay": "0.08s" } as CSSProperties}>
          Pick any model, or turn AI off entirely, and you still have a complete, private browser.
          Work, Notes, Tasks and focus can each go too, and turning one off deletes nothing.
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
