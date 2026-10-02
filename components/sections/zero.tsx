"use client";

import { useRef } from "react";
import { useInView } from "@/components/motion/use-in-view";
import styles from "./privacy.module.css";

const DIGITS = [7, 3, 9, 1, 6, 4, 8, 2, 5, 0];

/** A large numeral that rolls through a few digits and settles on zero. */
export function Zero() {
  const ref = useRef<HTMLSpanElement>(null);
  const seen = useInView(ref, "0px 0px -25% 0px");
  return (
    <span ref={ref} className={styles.zero} data-seen={seen || undefined} aria-label="0">
      <span className={styles.reel} aria-hidden="true">
        {DIGITS.map((digit, index) => (
          <span key={index}>{digit}</span>
        ))}
      </span>
    </span>
  );
}
