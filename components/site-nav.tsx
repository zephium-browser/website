"use client";

import Link from "next/link";
import { Cancel01Icon, Menu01Icon, StarIcon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { useEffect, useRef, useState } from "react";
import { ZephiumLockup } from "@/components/brand";
import { formatStars } from "@/lib/github";
import { site } from "@/lib/site";
import styles from "./site-nav.module.css";

const links = [
  { href: "/docs", label: "Docs" },
  { href: "/workflows", label: "Workflows" },
  { href: "/changelog", label: "Changelog" },
  { href: "/about", label: "About" },
];

/**
 * The bar across the top. Over the sky it has no material at all; over the
 * page it becomes a thin layer of vibrancy with a hairline under it.
 */
export function SiteNav({ stars = 0 }: { stars?: number }) {
  const ref = useRef<HTMLElement>(null);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!open) return;
    const close = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", close);
    return () => window.removeEventListener("keydown", close);
  }, [open]);

  return (
    <header ref={ref} className={styles.nav} data-open={open || undefined}>
      <div className={styles.bar}>
        <Link href="/" aria-label="Zephium home" className={styles.home} onClick={() => setOpen(false)}>
          <ZephiumLockup />
        </Link>

        <nav aria-label="Primary" className={styles.links}>
          {links.map((link) => (
            <Link key={link.href} href={link.href} className={styles.link}>
              {link.label}
            </Link>
          ))}
        </nav>

        <div className={styles.actions}>
          <a href={site.repo} className={styles.star} aria-label={`Star Zephium on GitHub, ${stars} stars`}>
            <HugeiconsIcon icon={StarIcon} size={15} strokeWidth={1.8} aria-hidden />
            <span className={styles.count}>{formatStars(stars)}</span>
          </a>
          <Link href="/download" className={styles.download}>
            Download
          </Link>
          <button
            type="button"
            className={styles.menu}
            aria-expanded={open}
            aria-controls="site-menu"
            aria-label={open ? "Close menu" : "Open menu"}
            onClick={() => setOpen((value) => !value)}
          >
            <HugeiconsIcon icon={open ? Cancel01Icon : Menu01Icon} size={18} strokeWidth={1.7} aria-hidden />
          </button>
        </div>
      </div>

      <nav id="site-menu" aria-label="Menu" className={styles.sheet} inert={!open}>
        {[...links, { href: "/download", label: "Download" }].map((link) => (
          <Link key={link.href} href={link.href} onClick={() => setOpen(false)}>
            {link.label}
          </Link>
        ))}
        <a href={site.repo} onClick={() => setOpen(false)}>
          GitHub
        </a>
      </nav>
    </header>
  );
}
