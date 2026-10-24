"use client";

import { useRef, type CSSProperties } from "react";
import { useInView } from "@/components/motion/use-in-view";
import styles from "./privacy.module.css";

/** A sentence set very large, its words lit one after another as it comes into view. */
export function Statement({ text }: { text: string }) {
  const ref = useRef<HTMLParagraphElement>(null);
  const seen = useInView(ref, "0px 0px -30% 0px");
  return (
    <p ref={ref} className={styles.statement} data-seen={seen || undefined} aria-label={text}>
      {text.split(" ").map((word, index) => (
        <span key={index} style={{ "--i": index } as CSSProperties} aria-hidden="true">
          {word}{" "}
        </span>
      ))}
    </p>
  );
}
