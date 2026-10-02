"use client";

import { useEffect, useRef } from "react";
import { WORDMARK } from "@/lib/wordmark";
import styles from "./site-footer.module.css";

/**
 * The wordmark, set across the page and cut by a hairline. Its letters are
 * barely lighter than the ground; a soft light finds their edges where the
 * pointer is, and rests in the middle when there is no pointer.
 */
export function FooterMark() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const mark = ref.current;
    const light = mark?.querySelector("svg:last-child");
    if (!mark || !light || !window.matchMedia("(pointer: fine)").matches) return;
    const zone = mark.closest("footer") ?? mark;
    // The light follows the pointer a little behind it, and stops when it arrives.
    const aim = { x: 0, y: 0 };
    const now = { x: Number.NaN, y: 0 };
    let frame = 0;
    const step = () => {
      now.x += (aim.x - now.x) * 0.16;
      now.y += (aim.y - now.y) * 0.16;
      mark.style.setProperty("--x", `${now.x.toFixed(1)}px`);
      mark.style.setProperty("--y", `${now.y.toFixed(1)}px`);
      frame = Math.abs(aim.x - now.x) + Math.abs(aim.y - now.y) > 0.5 ? requestAnimationFrame(step) : 0;
    };
    const move = (event: Event) => {
      const pointer = event as PointerEvent;
      const box = light.getBoundingClientRect();
      aim.x = pointer.clientX - box.left;
      aim.y = pointer.clientY - box.top;
      if (Number.isNaN(now.x)) {
        now.x = box.width / 2;
        now.y = box.height * 0.45;
      }
      if (!frame) frame = requestAnimationFrame(step);
    };
    zone.addEventListener("pointermove", move, { passive: true });
    return () => {
      cancelAnimationFrame(frame);
      zone.removeEventListener("pointermove", move);
    };
  }, []);

  return (
    <div ref={ref} className={styles.mark} aria-hidden="true">
      <svg viewBox={WORDMARK.viewBox} className={styles.letters}>
        <defs>
          <linearGradient id="wordmark-fill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#f4f4f6" stopOpacity="0.085" />
            <stop offset="1" stopColor="#f4f4f6" stopOpacity="0.025" />
          </linearGradient>
        </defs>
        <path transform={WORDMARK.transform} fill="url(#wordmark-fill)" d={WORDMARK.d} />
      </svg>
      <svg viewBox={WORDMARK.viewBox} className={styles.light}>
        <path
          transform={WORDMARK.transform}
          fill="rgb(244 244 246 / 0.07)"
          stroke="rgb(244 244 246 / 0.85)"
          strokeWidth="1.2"
          vectorEffect="non-scaling-stroke"
          d={WORDMARK.d}
        />
      </svg>
    </div>
  );
}
