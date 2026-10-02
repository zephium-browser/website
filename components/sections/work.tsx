import {
  ComputerTerminal01Icon,
  Folder02Icon,
  Globe02Icon,
  Key01Icon,
  Layers02Icon,
  Plug02Icon,
  Table02Icon,
  UserGroupIcon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon, type IconSvgElement } from "@hugeicons/react";
import type { CSSProperties } from "react";
import { BringBoard } from "./bring";
import { RequestLine } from "./request-line";
import styles from "./work.module.css";

const REQUEST =
  "Design the system architecture for an AI SaaS product, then compare AWS, Vercel, Hetzner and Cloudflare to host it.";

const ABILITIES: { icon: IconSvgElement; title: string; body: string }[] = [
  { icon: Globe02Icon, title: "Live pages.", body: "Helpers browse real sites, and you can watch every one." },
  { icon: UserGroupIcon, title: "Helpers in parallel.", body: "The lead splits the goal and sends a helper after each part." },
  { icon: Folder02Icon, title: "Your files.", body: "It reads and edits folders you grant, and asks before changing a thing." },
  { icon: ComputerTerminal01Icon, title: "Code and commands.", body: "It writes and explains code, runs commands and maps a system." },
  { icon: Plug02Icon, title: "Your tools.", body: "MCP servers and the command lines you already use, like GitHub and Slack." },
  { icon: Layers02Icon, title: "Your context.", body: "Tabs, history, tasks and notes, whenever you let it look." },
  { icon: Table02Icon, title: "Results that last.", body: "Tables, charts, comparisons and plans stay on the canvas." },
  { icon: Key01Icon, title: "Your models.", body: "Your own keys for OpenAI, Anthropic or Gemini, or a local model." },
];

/** Work: one real canvas, what an agent can reach, and what you can bring. */
export function Work() {
  return (
    <section id="work" className={styles.section} aria-labelledby="work-title">
      <div className="container-page">
        <header className={styles.head}>
          <h2 id="work-title" data-reveal>
            Work, on a canvas.
          </h2>
          <p data-reveal style={{ "--delay": "0.08s" } as CSSProperties}>
            Describe the outcome. Agents open real pages, compare and build, and leave you
            something to keep.
          </p>
        </header>
      </div>

      <figure className={styles.showcase}>
        <div className="container-page">
          <RequestLine text={REQUEST} />
        </div>
        <div className={styles.canvas} data-reveal="fade">
          <picture>
            <source
              type="image/webp"
              srcSet="/shots/architecture-1280.webp 1280w, /shots/architecture-2482.webp 2482w"
              sizes="(min-width: 1360px) 1280px, 94vw"
            />
            <img
              src="/shots/architecture-2482.webp"
              alt="A Work canvas with the request, its sources, a recommendation, a table comparing AWS, Vercel, Hetzner and Cloudflare, and a reference architecture for an AI product."
              width={2482}
              height={1574}
              loading="lazy"
              decoding="async"
            />
          </picture>
        </div>
        <figcaption className="container-page" data-reveal>
          One request. The agent drew the architecture, read four pricing pages and weighed the
          hosts in a table.
        </figcaption>
      </figure>

      <div className="container-page">
        <ul className={styles.abilities}>
          {ABILITIES.map((ability, index) => (
            <li key={ability.title} data-reveal style={{ "--delay": `${(index % 4) * 0.06}s` } as CSSProperties}>
              <HugeiconsIcon icon={ability.icon} size={22} strokeWidth={1.6} aria-hidden />
              <p>
                <b>{ability.title}</b> {ability.body}
              </p>
            </li>
          ))}
        </ul>

        <article className={styles.bring} data-reveal="fade">
          <BringBoard />
          <p className={styles.bringLine}>
            <b>Bring anything onto the canvas.</b> Tabs, files, folders, images and links, side by
            side. Connect your tools through MCP and the command line, and agents work with all of
            it.
          </p>
        </article>
      </div>
    </section>
  );
}
