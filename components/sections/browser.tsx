import type { CSSProperties, ReactNode } from "react";
import { Activity, Blocker, Extensions, Notes, Tasks } from "./browser-cards";
import styles from "./browser.module.css";

/**
 * A feature card: a piece of the product above one line about it. Panels sit
 * on a desk, a piece of the sky they float over, the way the product's
 * material floats over a wallpaper.
 */
function Card({
  title,
  children,
  visual,
  desk,
  className,
  delay = 0,
}: {
  title: string;
  children: ReactNode;
  visual: ReactNode;
  desk?: string;
  className?: string;
  delay?: number;
}) {
  return (
    <article
      className={`${styles.card} ${className ?? ""}`}
      data-reveal="fade"
      style={{ "--delay": `${delay}s` } as CSSProperties}
    >
      <div className={styles.visual} data-desk={desk ? true : undefined} style={desk ? ({ "--at": desk } as CSSProperties) : undefined}>
        {visual}
      </div>
      <div className={styles.foot}>
        <p className={styles.line}>
          <b>{title}</b> {children}
        </p>
      </div>
    </article>
  );
}

/** The browser on its own, before any agent is involved. */
export function Browser() {
  return (
    <section id="browser" className={`container-page ${styles.section}`} aria-labelledby="browser-title">
      <header className={styles.head}>
        <h2 id="browser-title" data-reveal>
          First, a great browser.
        </h2>
        <p data-reveal style={{ "--delay": "0.08s" } as CSSProperties}>
          Fast, private and fully featured, with everything you need already inside.
        </p>
      </header>

      <div className={styles.grid}>
        <Card className={styles.seven} title="Ads and trackers, gone." visual={<Blocker />} desk="12% 80%">
          A native blocker turns them away at the network, before a page can load them.
        </Card>

        <Card className={styles.five} title="Your extensions come along." visual={<Extensions />} desk="92% 30%" delay={0.08}>
          The ones you rely on, straight from the Chrome Web Store.
        </Card>

        {/* The launcher gets the whole row: what it is on the left, the real thing on the right. */}
        <article className={`${styles.card} ${styles.wide} ${styles.split}`} data-reveal="fade">
          <div className={styles.splitText}>
            <h3>Everything, one shortcut away.</h3>
            <p>Tabs, tasks, notes, history and downloads, from anywhere on your desktop.</p>
            <span className={styles.keys} aria-label="Command, Shift, Space">
              <kbd>⌘</kbd>
              <kbd>⇧</kbd>
              <kbd>Space</kbd>
            </span>
          </div>
          <div className={styles.launcher}>
            <picture>
              <source
                type="image/webp"
                srcSet="/shots/launcher-800.webp 800w, /shots/launcher-1553.webp 1553w"
                sizes="(min-width: 1240px) 760px, (min-width: 900px) 62vw, 92vw"
              />
              <img
                src="/shots/launcher-1553.webp"
                alt="Zephium's launcher, listing open tabs with tasks, notes, history and downloads beside them."
                width={1553}
                height={769}
                loading="lazy"
                decoding="async"
              />
            </picture>
          </div>
        </article>

      </div>
    </section>
  );
}

/** Tasks, notes and activity: the day kept beside the page, where agents can use it too. */
export function Everyday() {
  return (
    <section id="everyday" className={`container-page ${styles.section} ${styles.later}`} aria-labelledby="everyday-title">
      <header className={styles.head}>
        <h2 id="everyday-title" data-reveal>
          Your day, beside the page.
        </h2>
        <p data-reveal style={{ "--delay": "0.08s" } as CSSProperties}>
          Tasks, notes and activity live in the sidebar, and your agents can use them whenever
          you let them.
        </p>
      </header>

      <div className={styles.grid}>
        <Card className={styles.four} title="Tasks in your own words." visual={<Tasks />} desk="0% 100%">
          Write it the way you would say it, and it lands on the right day.
        </Card>

        <Card className={styles.four} title="Notes beside the page." visual={<Notes />} desk="50% 100%" delay={0.08}>
          Markdown files you own, with code that stays code.
        </Card>

        <Card className={styles.four} title="See where the day went." visual={<Activity />} desk="100% 100%" delay={0.16}>
          Time by site, and focus that keeps distractions shut.
        </Card>
      </div>
    </section>
  );
}
