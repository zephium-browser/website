"use client";

import Link from "next/link";
import {
  AppleIcon,
  ArrowDown01Icon,
  ArrowUpRight01Icon,
  Download04Icon,
  WindowsNewIcon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon, type IconSvgElement } from "@hugeicons/react";
import { useCallback, useEffect, useId, useLayoutEffect, useRef, useState, type KeyboardEvent } from "react";
import { siLinux } from "simple-icons";
import { useDesktop } from "@/components/preferred-platform";
import { downloadPath, platforms, site, type PlatformId } from "@/lib/site";
import styles from "./download-menu.module.css";

const ICONS: Partial<Record<PlatformId, IconSvgElement>> = {
  macos: AppleIcon,
  windows: WindowsNewIcon,
};

const available = platforms.filter((platform) => platform.status === "available");
const linux = platforms.find((platform) => platform.id === "linux");

/** "Apple silicon" or "Windows 10 or later": the last clause of the requirement, then the file type. */
const detail = (platform: (typeof available)[number]) =>
  `${platform.requirement?.split(", ").at(-1)} · .${platform.asset?.split(".").at(-1)}`;

/** The edge the page keeps clear when the menu would otherwise leave the screen. */
const EDGE = 12;

/**
 * The Download button with a way to choose. The main part goes to the
 * download page for the visitor's own desktop and works without JavaScript;
 * the chevron opens the other builds, the Linux notification and the release
 * pages. `variant` sizes it for the bar or for the opening.
 */
export function DownloadMenu({ variant }: { variant: "nav" | "hero" }) {
  const desktop = useDesktop();
  const [open, setOpen] = useState(false);
  const root = useRef<HTMLDivElement>(null);
  const toggle = useRef<HTMLButtonElement>(null);
  const menu = useRef<HTMLDivElement>(null);
  const [left, setLeft] = useState<number | null>(null);
  const [up, setUp] = useState(false);
  const id = useId();

  const items = useCallback(() => Array.from(menu.current?.querySelectorAll<HTMLElement>("[role=menuitem]") ?? []), []);

  const close = useCallback((returnFocus: boolean) => {
    setOpen(false);
    if (returnFocus) toggle.current?.focus();
  }, []);

  /**
   * Keeps the menu on screen. The page can put the button anywhere along a
   * narrow row, and in the opening it can sit low on a short screen, where the
   * menu opens upward instead: scrolling to reach it would move the opening on.
   */
  const place = useCallback(() => {
    const box = root.current?.getBoundingClientRect();
    const width = menu.current?.offsetWidth;
    const height = menu.current?.offsetHeight;
    if (!box || !width || !height) return;
    const below = window.innerHeight - box.bottom - EDGE - 8;
    setUp(below < height && box.top - EDGE - 8 >= height);
    const wanted = variant === "hero" ? box.left + box.width / 2 - width / 2 : box.right - width;
    const kept = Math.min(Math.max(wanted, EDGE), window.innerWidth - EDGE - width);
    setLeft(kept - box.left);
  }, [variant]);

  useLayoutEffect(() => {
    if (!open) return;
    place();
    items()[0]?.focus();
  }, [open, place, items]);

  useEffect(() => {
    if (!open) return;
    const outside = (event: PointerEvent) => {
      if (!root.current?.contains(event.target as Node)) setOpen(false);
    };
    document.addEventListener("pointerdown", outside);
    window.addEventListener("resize", place);
    return () => {
      document.removeEventListener("pointerdown", outside);
      window.removeEventListener("resize", place);
    };
  }, [open, place]);

  function onToggleKey(event: KeyboardEvent<HTMLButtonElement>) {
    if (event.key === "ArrowDown" || event.key === "ArrowUp") {
      event.preventDefault();
      setOpen(true);
    }
  }

  function onMenuKey(event: KeyboardEvent<HTMLDivElement>) {
    const list = items();
    const at = list.indexOf(document.activeElement as HTMLElement);
    const go = (index: number) => {
      event.preventDefault();
      list[(index + list.length) % list.length]?.focus();
    };
    if (event.key === "ArrowDown") go(at + 1);
    else if (event.key === "ArrowUp") go(at - 1);
    else if (event.key === "Home") go(0);
    else if (event.key === "End") go(list.length - 1);
    else if (event.key === "Escape") {
      event.preventDefault();
      close(true);
    } else if (event.key === "Tab") setOpen(false);
  }

  return (
    <div
      ref={root}
      className={styles.root}
      data-variant={variant}
      data-menu-open={open || undefined}
      data-up={up || undefined}
      onBlur={(event) => {
        if (!root.current?.contains(event.relatedTarget as Node | null) && event.relatedTarget) setOpen(false);
      }}
    >
      <Link href={downloadPath()} className={styles.main}>
        {desktop ? (
          <HugeiconsIcon
            icon={desktop === "macos" ? AppleIcon : WindowsNewIcon}
            size={variant === "hero" ? 17 : 15}
            strokeWidth={1.8}
            aria-hidden
          />
        ) : null}
        <span>
          Download
          {desktop ? <span className={styles.for}> for {desktop === "macos" ? "Mac" : "Windows"}</span> : null}
        </span>
      </Link>
      <button
        ref={toggle}
        type="button"
        className={styles.toggle}
        aria-label="More download options"
        aria-haspopup="menu"
        aria-expanded={open}
        aria-controls={id}
        onClick={() => setOpen((value) => !value)}
        onKeyDown={onToggleKey}
      >
        <HugeiconsIcon icon={ArrowDown01Icon} size={15} strokeWidth={2} aria-hidden />
      </button>

      <div
        ref={menu}
        id={id}
        role="menu"
        aria-label="Download options"
        className={styles.menu}
        style={left === null ? undefined : { left, right: "auto" }}
        inert={!open}
        onKeyDown={onMenuKey}
      >
        {available.map((platform) => (
          <Link
            key={platform.id}
            href={downloadPath({ platform: platform.id })}
            role="menuitem"
            tabIndex={-1}
            className={styles.item}
            onClick={() => setOpen(false)}
          >
            <HugeiconsIcon icon={ICONS[platform.id] ?? Download04Icon} size={20} strokeWidth={1.7} aria-hidden />
            <span className={styles.text}>
              <span className={styles.name}>{platform.name}</span>
              <span className={styles.detail}>{detail(platform)}</span>
            </span>
          </Link>
        ))}
        {linux ? (
          <Link href="/download#linux" role="menuitem" tabIndex={-1} className={styles.item} onClick={() => setOpen(false)}>
            <svg viewBox="0 0 24 24" className={styles.mark} aria-hidden="true">
              <path d={siLinux.path} />
            </svg>
            <span className={styles.text}>
              <span className={styles.name}>{linux.name}</span>
              <span className={styles.detail}>Coming soon</span>
            </span>
            <span className={styles.notify}>Notify me</span>
          </Link>
        ) : null}
        <hr className={styles.rule} />
        <a href={site.releases} role="menuitem" tabIndex={-1} className={styles.plain} onClick={() => setOpen(false)}>
          All builds on GitHub
          <HugeiconsIcon icon={ArrowUpRight01Icon} size={15} strokeWidth={1.8} aria-hidden />
        </a>
        <Link href="/changelog" role="menuitem" tabIndex={-1} className={styles.plain} onClick={() => setOpen(false)}>
          Release notes
        </Link>
      </div>
    </div>
  );
}
