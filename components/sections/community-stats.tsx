"use client";

import { useStars } from "@/components/use-stars";
import { formatStars } from "@/lib/github";
import styles from "./community.module.css";

/**
 * The repository's numbers on its card: the stars, kept fresh the way the
 * navigation keeps them, and the contributors read at build time. A number
 * that could not be read is left out, never shown as zero.
 */
export function RepoStats({ stars, contributors }: { stars: number; contributors: number }) {
  const count = useStars(stars);
  const parts = [
    count > 0 ? `${formatStars(count)} ${count === 1 ? "star" : "stars"}` : null,
    contributors > 0 ? `${contributors} ${contributors === 1 ? "contributor" : "contributors"}` : null,
  ].filter(Boolean);
  if (!parts.length) return null;
  return <span className={styles.stat}>{parts.join(" · ")}</span>;
}
