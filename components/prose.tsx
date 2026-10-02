import type { ReactNode } from "react";
import styles from "./prose.module.css";

/**
 * The frame every secondary page shares: room below the fixed navigation, a
 * large title and an optional line under it.
 */
export function PageShell({
  title,
  lede,
  children,
}: {
  title: ReactNode;
  lede?: ReactNode;
  children: ReactNode;
}) {
  return (
    <section className={`container-page ${styles.shell}`}>
      <header className={styles.head}>
        <h1 className={styles.title}>{title}</h1>
        {lede ? <p className={styles.lede}>{lede}</p> : null}
      </header>
      {children}
    </section>
  );
}

/** Long-form text: policies and terms, set for reading. */
export function Prose({ children, updated }: { children: ReactNode; updated?: string }) {
  return (
    <article className={styles.prose}>
      {updated ? <p className={styles.updated}>Effective {updated}</p> : null}
      {children}
    </article>
  );
}
