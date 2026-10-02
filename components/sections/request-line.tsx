"use client";

import { useEffect, useRef, useState } from "react";
import { Orb } from "@/components/island/orb";
import { useInView } from "@/components/motion/use-in-view";
import styles from "./work.module.css";

/** The request behind the canvas below, typed out once it comes into view. */
export function RequestLine({ text }: { text: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const seen = useInView(ref, "0px 0px -15% 0px");
  const [shown, setShown] = useState(0);

  useEffect(() => {
    if (!seen) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      const frame = requestAnimationFrame(() => setShown(text.length));
      return () => cancelAnimationFrame(frame);
    }
    let count = 0;
    const timer = window.setInterval(() => {
      count = Math.min(text.length, count + 2);
      setShown(count);
      if (count >= text.length) window.clearInterval(timer);
    }, 22);
    return () => window.clearInterval(timer);
  }, [seen, text]);

  const done = shown >= text.length;
  return (
    <div ref={ref} className={styles.request} data-done={done || undefined}>
      <span className={styles.orb}>
        <Orb size={22} />
      </span>
      <p aria-label={text}>
        <span aria-hidden="true">{text.slice(0, shown)}</span>
        <i className={styles.caret} aria-hidden="true" />
      </p>
    </div>
  );
}
