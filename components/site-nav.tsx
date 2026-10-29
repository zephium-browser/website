"use client";

import Link from "next/link";
import { AppleIcon, Cancel01Icon, Menu01Icon, StarIcon, WindowsNewIcon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { useEffect, useRef, useState } from "react";
import { siDiscord, siGithub, siLinux, siProducthunt, siX, siYoutube } from "simple-icons";
import { ZephiumLockup } from "@/components/brand";
import { DownloadMenu } from "@/components/download-menu";
import { formatStars } from "@/lib/github";
import { downloadPath, site } from "@/lib/site";
import styles from "./site-nav.module.css";

const links = [
  { href: "/docs", label: "Docs" },
  { href: "/workflows", label: "Workflows" },
  { href: "/pricing", label: "Pricing" },
  { href: "/changelog", label: "Changelog" },
  { href: "/about", label: "About" },
];

/** Community links for the small-screen menu; one that is not set yet is left out. */
const community = [
  { label: "GitHub", href: site.repo, path: siGithub.path },
  { label: "X", href: site.social.x, path: siX.path },
  { label: "Discord", href: site.social.discord, path: siDiscord.path },
  { label: "YouTube", href: site.social.youtube, path: siYoutube.path },
  { label: "Product Hunt", href: site.social.producthunt, path: siProducthunt.path },
].filter((item) => item.href);

/**
 * The bar across the top. Over the sky it has no material at all; over the
 * page it becomes a thin layer of vibrancy with a hairline under it.
 */
/**
 * The star count: the one read when the site was built, then the one the
 * server keeps fresh (/stars.json, deploy/stars.sh), from our own origin.
 */
function useStars(built: number) {
  const [count, setCount] = useState(built);
  useEffect(() => {
    const controller = new AbortController();
    fetch("/stars.json", { signal: controller.signal })
      .then((response) => (response.ok ? response.json() : null))
      .then((data: { stars?: number } | null) => {
        if (data?.stars && data.stars > 0) setCount(data.stars);
      })
      .catch(() => {});
    return () => controller.abort();
  }, []);
  return count;
}

export function SiteNav({ stars = 0 }: { stars?: number }) {
  const count = useStars(stars);
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
          <a
            href={site.repo}
            className={styles.star}
            aria-label={count ? `Star Zephium on GitHub, ${count} stars` : "Star Zephium on GitHub"}
          >
            <HugeiconsIcon icon={StarIcon} size={15} strokeWidth={1.8} aria-hidden />
            <span className={styles.count}>{count ? formatStars(count) : "Star"}</span>
          </a>
          <DownloadMenu variant="nav" />
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
        {links.map((link) => (
          <Link key={link.href} href={link.href} onClick={() => setOpen(false)}>
            {link.label}
          </Link>
        ))}
        <Link href="/support" onClick={() => setOpen(false)}>
          Support
        </Link>
        <div className={styles.downloads}>
          <Link href={downloadPath({ platform: "macos" })} onClick={() => setOpen(false)}>
            <HugeiconsIcon icon={AppleIcon} size={18} strokeWidth={1.8} aria-hidden />
            Download for Mac
          </Link>
          <Link href={downloadPath({ platform: "windows" })} onClick={() => setOpen(false)}>
            <HugeiconsIcon icon={WindowsNewIcon} size={18} strokeWidth={1.8} aria-hidden />
            Download for Windows
          </Link>
          <Link href="/download#linux" onClick={() => setOpen(false)}>
            <svg viewBox="0 0 24 24" className={styles.mark} aria-hidden="true">
              <path d={siLinux.path} />
            </svg>
            Linux · Notify me
          </Link>
        </div>
        <ul className={styles.community}>
          {community.map((item) => (
            <li key={item.label}>
              <a href={item.href} aria-label={item.label}>
                <svg viewBox="0 0 24 24" aria-hidden="true">
                  <path d={item.path} />
                </svg>
              </a>
            </li>
          ))}
        </ul>
      </nav>
    </header>
  );
}
