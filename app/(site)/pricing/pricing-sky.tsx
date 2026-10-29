"use client";

import { useEffect } from "react";
import styles from "./pricing.module.css";

/**
 * The day sky behind the top of the pricing page: a plain picture, no WebGL,
 * the small file on phones and the larger one elsewhere. While the page rests
 * at the top the navigation sits on it as it does on the home page, clear
 * with white text (the root's data-sky, as the scene sets it). A few pixels
 * down the bar takes its own material back, so it never lies over the plans.
 */
export function PricingSky() {
  useEffect(() => {
    const root = document.documentElement;
    const read = () => root.toggleAttribute("data-sky", window.scrollY < 24);
    read();
    window.addEventListener("scroll", read, { passive: true });
    return () => {
      window.removeEventListener("scroll", read);
      root.removeAttribute("data-sky");
    };
  }, []);

  return (
    <picture className={styles.sky}>
      <source media="(max-width: 899px)" type="image/avif" srcSet="/sky/day-900.avif" />
      <source media="(max-width: 899px)" type="image/jpeg" srcSet="/sky/day-900.jpg" />
      <source type="image/avif" srcSet="/sky/day-1672.avif" />
      <img src="/sky/day-1672.jpg" width={1672} height={942} alt="" fetchPriority="high" decoding="async" />
    </picture>
  );
}
