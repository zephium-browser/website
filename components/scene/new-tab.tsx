"use client";

import { CheckListIcon, Clock01Icon, Settings01Icon, Shield01Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon, type IconSvgElement } from "@hugeicons/react";
import { useEffect, useState, type ReactNode } from "react";
import { WORDMARK } from "@/lib/wordmark";
import styles from "./new-tab.module.css";

/**
 * Zephium's new tab, as the product draws it in the dark theme: the page is
 * a window onto the night sky, a picture that dissolves through its own
 * halftone into the page below the horizon. The name stands low in the open
 * sky with the visitor's own time and date under it; the day's figures sit
 * along the foot. The field hangs in the notch along the page's top edge,
 * which the window cuts (product-window.tsx), so it is not drawn here.
 * Measured from features/newtab (layout.ts, ground.ts) and tokens/sky.css.
 */

function Figure({ icon, name, value, children }: { icon: IconSvgElement; name: string; value: string; children?: ReactNode }) {
  return (
    <span className={styles.figure}>
      <HugeiconsIcon icon={icon} strokeWidth={1.6} aria-hidden />
      {name}
      <b>{value}</b>
      {children}
    </span>
  );
}

/** The visitor's time and date, as the new tab prints them; nothing until mounted. */
function useNow() {
  const [now, setNow] = useState<Date | null>(null);
  useEffect(() => {
    const tick = () => setNow(new Date());
    tick();
    const timer = window.setInterval(tick, 15_000);
    return () => window.clearInterval(timer);
  }, []);
  return now;
}

export function NewTab() {
  const now = useNow();
  const time = now?.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" }).split(" ");
  const date = now?.toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" });

  return (
    <div className={styles.page}>
      <picture className={styles.sky}>
        <source type="image/avif" srcSet="/sky/night-1200.avif 1200w, /sky/night-2200.avif 2200w" sizes="70vw" />
        <img src="/sky/night-1200.jpg" srcSet="/sky/night-1200.jpg 1200w, /sky/night-2200.jpg 2200w" sizes="70vw" alt="" decoding="async" />
      </picture>

      <svg className={styles.mark} viewBox={WORDMARK.viewBox} role="img" aria-label="Zephium">
        <path transform={WORDMARK.transform} d={WORDMARK.d} />
      </svg>

      <p className={styles.when} data-on={now ? true : undefined}>
        {time ? (
          <>
            <b>
              {time[0]}
              <small> {time[1]}</small>
            </b>
            <i aria-hidden="true" />
            {date}
          </>
        ) : null}
      </p>

      <span className={styles.settings} aria-hidden="true">
        <HugeiconsIcon icon={Settings01Icon} strokeWidth={1.6} />
      </span>

      <div className={styles.figures}>
        <Figure icon={Shield01Icon} name="Ads & trackers blocked" value="294" />
        <Figure icon={Clock01Icon} name="Focused" value="1h 12m">
          <span className={styles.meter} />
        </Figure>
        <Figure icon={CheckListIcon} name="Due today" value="2">
          <span className={styles.quiet}>Nothing overdue</span>
        </Figure>
      </div>
    </div>
  );
}
