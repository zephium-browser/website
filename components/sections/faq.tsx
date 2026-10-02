import { Add01Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import type { CSSProperties } from "react";
import { site } from "@/lib/site";
import styles from "./faq.module.css";

export const QUESTIONS = [
  {
    q: "Is Zephium built on Chromium?",
    a: "No. Zephium is written in Rust and draws pages with the engine your system already has: WKWebView on macOS and WebView2 on Windows. The interface, the blocker, the agents and the storage are all its own.",
  },
  {
    q: "Do I need AI to use it?",
    a: "No. Zephium is a complete browser with Work switched off. When you want agents, use Zephium's own AI, bring your own key for OpenAI, Anthropic or Gemini, or run a model locally.",
  },
  {
    q: "Which extensions work?",
    a: "The major Chrome extensions, such as 1Password, Bitwarden, Grammarly, Dark Reader, SponsorBlock and Notion Web Clipper, installed from the Chrome Web Store.",
  },
  {
    q: "What leaves my device?",
    a: "Nothing about how you browse. There is no telemetry, your data is stored on your device, and you never need an account to browse. When an agent works, you see on the canvas which pages and notes it sends to the model you chose.",
  },
  {
    q: "Can agents act without me?",
    a: "Agents work in pages you can see, and you can stop a run at any time. They ask before they change your files, and you decide which folders they can reach.",
  },
  {
    q: "Is it free?",
    a: `Yes. Zephium is free and open source under the ${site.license === "MPL-2.0" ? "Mozilla Public License 2.0" : site.license}. With your own keys, you pay only your model provider.`,
  },
  {
    q: "When are Linux, iOS and Android coming?",
    a: "Linux is next, and the mobile apps follow. Star the repository on GitHub to hear when they land.",
  },
];

/** Short answers to the questions people ask first. */
export function Faq() {
  return (
    <section id="faq" className={`container-page ${styles.section}`} aria-labelledby="faq-title">
      <h2 id="faq-title" data-reveal>
        Questions, answered.
      </h2>
      <div className={styles.list}>
        {QUESTIONS.map((item, index) => (
          <details key={item.q} data-reveal style={{ "--delay": `${index * 0.04}s` } as CSSProperties}>
            <summary>
              {item.q}
              <HugeiconsIcon icon={Add01Icon} size={18} strokeWidth={1.7} aria-hidden />
            </summary>
            <p>{item.a}</p>
          </details>
        ))}
      </div>
    </section>
  );
}
