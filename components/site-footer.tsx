import Link from "next/link";
import { AppleIcon, WindowsNewIcon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon, type IconSvgElement } from "@hugeicons/react";
import type { CSSProperties } from "react";
import { siDiscord, siGithub, siX, siYoutube } from "simple-icons";
import { ZephiumLockup } from "@/components/brand";
import { FooterMark } from "@/components/footer-mark";
import { PreferredPlatform } from "@/components/preferred-platform";
import { downloadUrl, platforms, site, type PlatformId } from "@/lib/site";
import styles from "./site-footer.module.css";

const columns = [
  {
    title: "Product",
    links: [
      { href: "/workflows", label: "Workflows" },
      { href: "/changelog", label: "Changelog" },
      { href: "/#faq", label: "FAQ" },
    ],
  },
  {
    title: "Resources",
    links: [
      { href: "/docs", label: "Docs" },
      { href: "/about", label: "About" },
      { href: site.repo, label: "Source code" },
      { href: site.websiteRepo, label: "Website source" },
      { href: `${site.repo}/issues`, label: "Report an issue" },
    ],
  },
  {
    title: "Legal",
    links: [
      { href: "/privacy", label: "Privacy" },
      { href: "/terms", label: "Terms" },
      { href: `${site.repo}/blob/main/LICENSE`, label: "License" },
    ],
  },
];

const social = [
  { label: "GitHub", href: site.social.github, path: siGithub.path },
  { label: "X", href: site.social.x, path: siX.path },
  { label: "Discord", href: site.social.discord, path: siDiscord.path },
  { label: "YouTube", href: site.social.youtube, path: siYoutube.path },
].filter((item) => item.href);

const ICONS: Partial<Record<PlatformId, IconSvgElement>> = {
  macos: AppleIcon,
  windows: WindowsNewIcon,
};
const LABELS: Partial<Record<PlatformId, string>> = {
  macos: "Download for Mac",
  windows: "Download for Windows",
};

const available = platforms.filter((platform) => platform.status === "available");
const soon = platforms.filter((platform) => platform.status === "soon").map((platform) => platform.name);

/**
 * The end of every page: the last word and the downloads themselves, set
 * straight on the ground above the wordmark, then the links.
 */
export function SiteFooter() {
  return (
    <footer className={styles.footer}>
      <section className={`container-page ${styles.cta}`} aria-labelledby="cta-title">
        <h2 id="cta-title" data-reveal>
          Rebuilt for you.
          <span> Ready for your agents.</span>
        </h2>
        <div className={styles.get} data-reveal style={{ "--delay": "0.08s" } as CSSProperties}>
          <PreferredPlatform className={styles.downloads}>
            {available.map((platform) => {
              const icon = ICONS[platform.id];
              return (
                <a key={platform.id} href={downloadUrl(platform)} data-platform={platform.id}>
                  {icon ? <HugeiconsIcon icon={icon} size={17} strokeWidth={1.8} aria-hidden /> : null}
                  {LABELS[platform.id] ?? `Download for ${platform.name}`}
                </a>
              );
            })}
          </PreferredPlatform>
          <p className={styles.note}>
            Free and open source, {site.downloadSize}.{" "}
            <span>
              {soon.slice(0, -1).join(", ")} and {soon.at(-1)} are on the way.
            </span>
          </p>
        </div>
      </section>

      <FooterMark />

      <div className={`container-page ${styles.top}`}>
        <div className={styles.brand}>
          <ZephiumLockup />
          <p>{site.tagline}</p>
          <ul className={styles.social}>
            {social.map((item) => (
              <li key={item.label}>
                <a href={item.href} aria-label={item.label}>
                  <svg viewBox="0 0 24 24" aria-hidden="true">
                    <path d={item.path} />
                  </svg>
                </a>
              </li>
            ))}
          </ul>
        </div>
        {columns.map((column) => (
          <nav key={column.title} aria-label={column.title} className={styles.column}>
            <h2>{column.title}</h2>
            <ul>
              {column.links.map((link) => (
                <li key={link.label}>
                  {link.href.startsWith("/") ? (
                    <Link href={link.href}>{link.label}</Link>
                  ) : (
                    <a href={link.href}>{link.label}</a>
                  )}
                </li>
              ))}
            </ul>
          </nav>
        ))}
      </div>

      <div className={`container-page ${styles.base}`}>
        <p>
          © {new Date().getFullYear()} {site.name}. Open source under {site.license}.
        </p>
        <p>
          Made by <a href={site.author.url}>{site.author.name}</a>
        </p>
      </div>
    </footer>
  );
}
