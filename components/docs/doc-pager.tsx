import Link from "next/link";
import { ArrowLeft01Icon, ArrowRight01Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { docPath, neighbours } from "@/lib/docs";
import styles from "./docs.module.css";

/** Previous and next, in reading order, at the foot of a page. */
export function DocPager({ slug }: { slug: string }) {
  const { previous, next } = neighbours(slug);
  if (!previous && !next) return null;
  return (
    <nav aria-label="More documentation" className={styles.pager}>
      {previous ? (
        <Link href={docPath(previous.slug)} rel="prev" className={styles.pagerLink} data-side="previous">
          <HugeiconsIcon icon={ArrowLeft01Icon} size={18} strokeWidth={1.8} aria-hidden />
          <span>
            <small>Previous</small>
            <strong>{previous.title}</strong>
          </span>
        </Link>
      ) : (
        <span />
      )}
      {next ? (
        <Link href={docPath(next.slug)} rel="next" className={styles.pagerLink} data-side="next">
          <span>
            <small>Next</small>
            <strong>{next.title}</strong>
          </span>
          <HugeiconsIcon icon={ArrowRight01Icon} size={18} strokeWidth={1.8} aria-hidden />
        </Link>
      ) : (
        <span />
      )}
    </nav>
  );
}
