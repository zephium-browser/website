import Link from "next/link";
import { site } from "@/lib/site";
import { DocPager } from "./doc-pager";
import { DocsNav } from "./docs-nav";
import { DocsOutline } from "./docs-outline";
import type { Doc } from "./content/types";
import styles from "./docs.module.css";

/**
 * One page of the documentation: the topics beside it, the page itself, and
 * the outline of its sections.
 */
export function DocPage({
  slug,
  title,
  doc,
}: {
  slug: string;
  title: string;
  doc: Doc;
}) {
  const headings = doc.sections.map(({ id, title: heading }) => ({ id, title: heading }));
  return (
    <div className={`container-page ${styles.layout}`}>
      <DocsNav current={slug} />
      <article className={styles.article}>
        <header className={styles.head}>
          <p className={styles.eyebrow}>
            <Link href="/docs">Docs</Link>
          </p>
          <h1>{title}</h1>
          <p className={styles.lede}>{doc.lede}</p>
        </header>
        <div className={styles.body}>
          {doc.sections.map((section) => (
            <section key={section.id} className={styles.section} aria-labelledby={section.id}>
              <h2 id={section.id}>
                <a href={`#${section.id}`} className={styles.headlink}>
                  {section.title}
                </a>
              </h2>
              {section.body}
            </section>
          ))}
        </div>
        <DocPager slug={slug} />
        <p className={styles.feedback}>
          Something wrong or missing on this page? Tell us on{" "}
          <a href={`${site.websiteRepo}/issues`}>GitHub</a> or in the{" "}
          <a href={site.social.discord}>Discord</a>, or write to{" "}
          <a href={`mailto:${site.contact.support}`}>{site.contact.support}</a>.
        </p>
      </article>
      <DocsOutline headings={headings} />
    </div>
  );
}
