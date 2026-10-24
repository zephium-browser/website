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
  "Set up a status page for Zephium: compare Uptime Kuma, Gatus and OpenStatus, then build the one that fits.";

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
              type="image/avif"
              srcSet="/shots/work-run-1280.avif 1280w, /shots/work-run-2560.avif 2560w"
              sizes="(min-width: 1360px) 1280px, 94vw"
            />
            <img
              src="/shots/work-run-1280.jpg"
              srcSet="/shots/work-run-1280.jpg 1280w, /shots/work-run-2560.jpg 2560w"
              sizes="(min-width: 1360px) 1280px, 94vw"
              alt="A whole Work run in Zephium: the request and its context, three helpers reading Uptime Kuma, Gatus and OpenStatus on their own sites, a local helper checking the endpoints, the status page it built, then the answer, a comparison table and charts, a diagram of how it fits, the config and four tasks."
              width={2560}
              height={1440}
              loading="lazy"
              decoding="async"
            />
          </picture>
        </div>
        <figcaption className="container-page" data-reveal>
          One request, the whole run. Helpers read three projects on their own sites, a local helper
          checked the endpoints, and the agent built the pick, weighed all three and left the config
          and the tasks.
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
