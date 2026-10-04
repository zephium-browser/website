import type { Metadata } from "next";
import { ArrowUpRight01Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { siDiscord, siGithub, siYoutube } from "simple-icons";
import { PageShell, Prose } from "@/components/prose";
import { site } from "@/lib/site";
import styles from "./about.module.css";

export const metadata: Metadata = {
  title: "About",
  description: `${site.name} is made by ${site.author.name}, a solo engineer, in the open: a fast, private browser in Rust, with a canvas where agents work in plain sight.`,
  alternates: { canonical: "/about" },
};

/** The places to follow along; one without an address yet is left out. */
const FOLLOW = [
  { label: "YouTube", note: "@crynta", href: site.social.youtube, path: siYoutube.path },
  { label: "Discord", note: "The community", href: site.social.discord, path: siDiscord.path },
  { label: "GitHub", note: new URL(site.social.github).pathname.slice(1), href: site.social.github, path: siGithub.path },
].filter((item) => item.href);

export default function AboutPage() {
  return (
    <PageShell
      title="About"
      lede={`${site.name} is made by ${site.author.name}, a solo engineer, in the open.`}
    >
      <Prose>
        <h2>Why {site.name}</h2>
        <p>
          {site.name} starts with a browser you would choose on its own: fast, private and quiet,
          with your extensions and everything else already inside. One switch away is Work, a
          canvas where agents open real pages in plain sight, compare and build, and leave you
          something to keep.
        </p>

        <h2>How it is built</h2>
        <p>
          {site.name} is not a fork of Chromium or Firefox. The browser is written from scratch in
          Rust, and pages render in the engine your system already ships and keeps up to date:
          WKWebView on macOS and WebView2 on Windows. That is why the app is{" "}
          {site.appSize}, and why it starts in an instant.
        </p>

        <h2>Open source</h2>
        <p>
          The browser is open source under the Mozilla Public License, and so is this website.
          Read the code, file an issue or send a change: the browser lives at{" "}
          <a href={site.repo}>{new URL(site.repo).pathname.slice(1)}</a>, the website at{" "}
          <a href={site.websiteRepo}>{new URL(site.websiteRepo).pathname.slice(1)}</a>.
        </p>

        <h2>Follow along</h2>
        <p>New releases, what is being built next, and the people using it.</p>
      </Prose>

      <ul className={styles.follow}>
        {FOLLOW.map((item) => (
          <li key={item.label}>
            <a href={item.href} className={styles.link}>
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <path d={item.path} />
              </svg>
              <span>
                <b>{item.label}</b>
                <small>{item.note}</small>
              </span>
              <HugeiconsIcon icon={ArrowUpRight01Icon} size={16} strokeWidth={1.8} aria-hidden className={styles.arrow} />
            </a>
          </li>
        ))}
      </ul>
    </PageShell>
  );
}
