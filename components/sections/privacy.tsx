import { ArrowRight01Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import type { CSSProperties } from "react";
import { site } from "@/lib/site";
import { Zero } from "./zero";
import styles from "./privacy.module.css";

const POINTS = [
  {
    title: "Local first.",
    body: "History, tasks, notes and activity live on your device. You never need an account to browse.",
  },
  {
    title: "Your choice of model.",
    body: "Zephium's own AI, your keys for OpenAI, Anthropic or Gemini, or a model on your machine.",
  },
  {
    title: "Nothing out of sight.",
    body: "Every page an agent opens and everything it sends is on the canvas, and you can stop it at any time.",
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
          bytes of telemetry, ever. <span>Zephium never reports how you browse.</span>
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
        Open source under the Mozilla Public License.{" "}
        <a href={site.repo}>
          Read the source
          <HugeiconsIcon icon={ArrowRight01Icon} size={14} strokeWidth={2} aria-hidden />
        </a>
      </p>
    </section>
  );
}
