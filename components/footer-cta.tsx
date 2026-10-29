"use client";

import { usePathname } from "next/navigation";
import type { ReactNode } from "react";
import styles from "./site-footer.module.css";

/**
 * The call to action that ends a page. It steps aside on the download page,
 * which already ends in its own downloads. Every page except the home page
 * carries its own space below its last line, so the block asks for none above
 * it there (`data-flush`); the home page's sections end flush and keep the
 * full room. The server renders the same markup for each page, so the choice
 * is made by address here rather than by each page remembering to ask.
 */
export function FooterCta({ children }: { children: ReactNode }) {
  const path = usePathname().replace(/\/$/, "") || "/";
  if (path === "/download") return null;
  return (
    <section
      className={`container-page ${styles.cta}`}
      aria-labelledby="cta-title"
      data-flush={path !== "/" || undefined}
    >
      {children}
    </section>
  );
}
