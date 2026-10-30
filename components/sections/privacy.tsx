import { ArrowRight01Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import type { CSSProperties } from "react";
import { site } from "@/lib/site";
import { Inventory } from "./privacy-inventory";
import styles from "./privacy.module.css";

const PROMISES = [
  {
    title: "Nothing leaves without you.",
    body: "No telemetry and no usage analytics. History, tabs, Work and notes live in your profile, on your computer.",
  },
  {
    title: "Any model, or none.",
    body: "Your own key goes straight to OpenAI, Anthropic or Gemini, and a local model never leaves your device. Zephium AI passes prompts through and never stores them.",
  },
  {
    title: "An account if you want one.",
    body: "Browsing never asks for one. An account brings Zephium AI today, and free sync across your devices soon.",
  },
];

/**
 * Whose browser it is. The switch from the product's own settings, and what
 * is left when AI is off, which is nearly everything; then the promises
 * behind it, said once and plainly.
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

      <Inventory />

      <ul className={styles.promises}>
        {PROMISES.map((promise, index) => (
          <li key={promise.title} data-reveal style={{ "--delay": `${index * 0.06}s` } as CSSProperties}>
            <b>{promise.title}</b>
            <p>{promise.body}</p>
          </li>
        ))}
        <li data-reveal style={{ "--delay": "0.18s" } as CSSProperties}>
          <b>Open to read.</b>
          <p>
            The browser is open source, under the Mozilla Public License.{" "}
            <a href={site.repo}>
              Read the source
              <HugeiconsIcon icon={ArrowRight01Icon} size={14} strokeWidth={2} aria-hidden />
            </a>
          </p>
        </li>
      </ul>
    </section>
  );
}
