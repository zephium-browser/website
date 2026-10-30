import type { CSSProperties, ReactNode } from "react";
import { site } from "@/lib/site";
import { AiSwitch } from "./ai-switch";
import styles from "./privacy.module.css";

/** The promises under the switch, each a claim the product keeps (README, "Private by default"). */
const FACTS: { title: string; body: ReactNode }[] = [
  {
    title: "No telemetry.",
    body: "Nothing about how you browse is collected or sent.",
  },
  {
    title: "Any model, or none.",
    body: "Zephium AI, your own keys, or local models through Ollama and LM Studio.",
  },
  {
    title: "No account to browse.",
    body: "Until you sign in, Zephium never contacts our servers.",
  },
  {
    title: "Open to read.",
    body: (
      <>
        Every line is <a href={site.repo}>on GitHub</a>, under MPL-2.0.
      </>
    ),
  },
];

/**
 * Whose browser it is. AI is one switch, shown working on Zephium's own
 * tools, and under it the few promises that hold whichever way it is set.
 */
export function Privacy() {
  return (
    <section id="privacy" className={`container-page ${styles.section}`} aria-labelledby="privacy-title">
      <div className={styles.top}>
        <h2 id="privacy-title" data-reveal>
          AI, only when you ask.
        </h2>
        <p data-reveal style={{ "--delay": "0.08s" } as CSSProperties}>
          Zephium is a complete browser on its own. Switch AI off and nothing else changes.
        </p>
      </div>

      <div className={styles.switch} data-reveal="fade" style={{ "--delay": "0.12s" } as CSSProperties}>
        <AiSwitch />
      </div>

      <ul className={styles.facts}>
        {FACTS.map((fact, index) => (
          <li key={fact.title} data-reveal style={{ "--delay": `${index * 0.06}s` } as CSSProperties}>
            <strong>{fact.title}</strong> {fact.body}
          </li>
        ))}
      </ul>
    </section>
  );
}
