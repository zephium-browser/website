import type { CSSProperties } from "react";
import { site } from "@/lib/site";
import { ModelWheel } from "./model-wheel";
import styles from "./privacy.module.css";

/**
 * Whose browser it is. AI is a choice of model, any of them or none, shown
 * as the picker itself, beside the few things that hold whatever is chosen.
 */
export function Privacy() {
  return (
    <section id="privacy" className={`container-page ${styles.section}`} aria-labelledby="privacy-title">
      <div className={styles.head}>
        <h2 id="privacy-title" data-reveal>
          Any model.
          <br />
          Or none.
        </h2>
        <p data-reveal style={{ "--delay": "0.08s" } as CSSProperties}>
          Zephium is a complete browser without AI. When you want it, choose whose it is: ours, your
          own key, or a model on your own computer.
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
