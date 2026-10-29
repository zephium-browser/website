import { ArrowRight01Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import type { CSSProperties } from "react";
import { site } from "@/lib/site";
import { PrivacyFeatures } from "./privacy-features";
import styles from "./privacy.module.css";

const POINTS = [
  {
    title: "On your device.",
    body: "History, tabs, Work and notes stay in your profile, on your computer. There is no telemetry and no usage analytics.",
  },
  {
    title: "Your model, your call.",
    body: "Your own key goes straight from your device to OpenAI, Anthropic or Gemini, and a local model never leaves it. Zephium AI prompts pass through to the model and are never stored.",
  },
  {
    title: "An account when you want one.",
    body: "It is optional. Today it brings Zephium AI, and free sync across your devices is coming. Browsing never needs one.",
  },
];

/**
 * A browser first, and yours to shape: the Features switches with the window
 * they change, then three plain promises about where things live.
 */
export function Privacy() {
  return (
    <section id="privacy" className={`container-page ${styles.section}`} aria-labelledby="privacy-title">
      <header className={styles.head}>
        <h2 id="privacy-title" data-reveal>
          Yours, with or without AI.
        </h2>
        <p data-reveal style={{ "--delay": "0.08s" } as CSSProperties}>
          Zephium is a complete browser on its own. Add AI and Work when you want them, and take
          them away whenever you like.
        </p>
      </header>

      <PrivacyFeatures />

      <ul className={styles.points}>
        {POINTS.map((point, index) => (
          <li key={point.title} data-reveal style={{ "--delay": `${index * 0.08}s` } as CSSProperties}>
            <b>{point.title}</b>
            <p>{point.body}</p>
          </li>
        ))}
      </ul>

      <p className={styles.source} data-reveal>
        The browser is open source under the Mozilla Public License.{" "}
        <a href={site.repo}>
          Read the source
          <HugeiconsIcon icon={ArrowRight01Icon} size={14} strokeWidth={2} aria-hidden />
        </a>
      </p>
    </section>
  );
}
