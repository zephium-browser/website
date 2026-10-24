import { ArrowRight01Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import type { CSSProperties } from "react";
import { site } from "@/lib/site";
import { Zero } from "./zero";
import styles from "./privacy.module.css";

const POINTS = [
  {
    title: "Kept on your device.",
    body: "History, tabs, tasks, notes and activity live in your profile, on your computer. No telemetry, no usage analytics.",
  },
  {
    title: "Your model, your call.",
    body: "Your own key goes straight from your device to OpenAI, Anthropic or Gemini. A local model never leaves it.",
  },
  {
    title: "An account only for Zephium AI.",
    body: "Sign in with an email code, no password. Prompts pass through to the model, and our servers never store them.",
  },
];

/** Privacy, said with one number and three plain promises. */
export function Privacy() {
  return (
    <section id="privacy" className={`container-page ${styles.section}`} aria-labelledby="privacy-title">
      <header className={styles.head}>
        <h2 id="privacy-title" data-reveal>
          Private by design.
        </h2>
        <p data-reveal style={{ "--delay": "0.08s" } as CSSProperties}>
          You stay in control of your data, your models and your agents.
        </p>
      </header>

      <figure className={styles.figure} data-reveal="fade">
        <Zero />
        <figcaption>
          <b>Zero telemetry.</b>
          <span>
            How you browse never leaves your device. Until you sign in, Zephium doesn&apos;t contact
            our servers at all.
          </span>
        </figcaption>
      </figure>

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
