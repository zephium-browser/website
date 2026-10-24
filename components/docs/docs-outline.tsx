"use client";

import { useEffect, useState } from "react";
import styles from "./docs.module.css";

type Heading = { id: string; title: string };

/**
 * The sections of the page, beside it on a wide screen, with the one being
 * read marked. Without a script they are still plain links.
 */
export function DocsOutline({ headings }: { headings: Heading[] }) {
  const [active, setActive] = useState<string | undefined>(undefined);

  useEffect(() => {
    const targets = headings
      .map((heading) => document.getElementById(heading.id))
      .filter((element): element is HTMLElement => element !== null);
    if (targets.length === 0) return;

    // A heading counts as read once it crosses a line just under the bar.
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) setActive(entry.target.id);
        }
      },
      { rootMargin: "-96px 0px -65% 0px", threshold: 0 },
    );
    targets.forEach((target) => observer.observe(target));
    return () => observer.disconnect();
  }, [headings]);

  return (
    <nav aria-label="On this page" className={styles.outline}>
      <p className={styles.navHeading}>On this page</p>
      <ul>
        {headings.map((heading) => (
          <li key={heading.id}>
            <a href={`#${heading.id}`} aria-current={active === heading.id ? "location" : undefined}>
              {heading.title}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
