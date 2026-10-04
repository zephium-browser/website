import type { CSSProperties } from "react";
import { siApple, siRust } from "simple-icons";
import { site } from "@/lib/site";
import styles from "./engine.module.css";

/** The Windows mark, drawn as four panes. */
function WindowsMark() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M2 4.5 10 3.4v7.8H2zM11 3.3 22 2v9.2H11zM2 12.6h8v7.9l-8-1.1zM11 12.6h11V22l-11-1.5z" />
    </svg>
  );
}

const FIGURES = [
  { value: site.appSize.replace("about ", ""), label: "installed" },
  { value: "Instant", label: "to start" },
  { value: "Lighter", label: "on memory" },
  { value: "Longer", label: "on battery" },
];

/** How Zephium is made, in one short breath. */
export function Engine() {
  return (
    <section className={`container-page ${styles.engine}`} aria-labelledby="engine-title">
      <div className={styles.top}>
        <h2 id="engine-title" data-reveal>
          Native, all the way through.
        </h2>
        <p data-reveal style={{ "--delay": "0.08s" } as CSSProperties}>
          Zephium is not a fork of Chromium or Firefox. We built the browser ourselves, in Rust,
          and pages render in the engine your system already ships and keeps up to date. A
          browser of our own, with no second copy of a browser engine to download and hold in
          memory.
        </p>
      </div>

      <ul className={styles.stack}>
        <li data-reveal>
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path d={siRust.path} />
          </svg>
          <b>Rust</b>
          <span>A native core, fast and memory safe.</span>
        </li>
        <li data-reveal style={{ "--delay": "0.06s" } as CSSProperties}>
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path d={siApple.path} />
          </svg>
          <b>WKWebView</b>
          <span>The engine of Safari, on macOS.</span>
        </li>
        <li data-reveal style={{ "--delay": "0.12s" } as CSSProperties}>
          <WindowsMark />
          <b>WebView2</b>
          <span>The system&apos;s own engine, on Windows.</span>
        </li>
      </ul>

      <dl className={styles.figures}>
        {FIGURES.map((figure, index) => (
          <div key={figure.label} data-reveal style={{ "--delay": `${index * 0.06}s` } as CSSProperties}>
            <dt>{figure.value}</dt>
            <dd>{figure.label}</dd>
          </div>
        ))}
      </dl>
    </section>
  );
}
