import type { Metadata } from "next";
import Link from "next/link";
import { ArrowUpRight01Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { siDiscord, siGithub, siProducthunt, siX, siYoutube } from "simple-icons";
import { PageShell, Prose } from "@/components/prose";
import { releaseAnchor } from "@/lib/changelog";
import { getContributors } from "@/lib/contributors";
import { pageMetadata } from "@/lib/metadata";
import { site } from "@/lib/site";
import styles from "./about.module.css";

export const metadata: Metadata = pageMetadata({
  title: "About",
  description: `${site.name} is made in the open by ${site.author.name}, a software engineer, with fixes from the people who use it: a fast, private browser in Rust, with a canvas where agents work in plain sight.`,
  path: "/about",
});

/** Links that may not exist yet are read as optional, and left out until they do. */
const social: Partial<Record<string, string>> = site.social;

const handle = (url: string) => new URL(url).pathname.slice(1);

/** The places to follow along; one without an address yet is left out. */
const FOLLOW = [
  { label: "YouTube", note: "Films and builds", href: social.youtube, path: siYoutube.path },
  { label: "Discord", note: "The community", href: social.discord, path: siDiscord.path },
  { label: "GitHub", note: "zephium-browser", href: social.github, path: siGithub.path },
  { label: "X", note: `${site.author.name}, the maker`, href: social.x, path: siX.path },
  { label: "Product Hunt", note: "Launches", href: social.producthunt, path: siProducthunt.path },
].filter((item): item is typeof item & { href: string } => Boolean(item.href));

/** The releases so far, as plainly as they happened. */
const TIMELINE = [
  { version: "1.0.0-beta.1", date: "4 October 2026", text: "The first public beta." },
  { version: "1.0.3", date: "24 October 2026", text: "The public release." },
  { version: "1.0.4", date: "28 October 2026", text: "Fixes from the first launch week, many of them sent by contributors." },
];

export default async function AboutPage() {
  const contributors = await getContributors();
  return (
    <PageShell
      title="About"
      lede={`${site.name} is made in the open by ${site.author.name}, with help from the people who use it.`}
    >
      <Prose>
        <h2>Who makes {site.name}</h2>
        <p>
          {site.name} is made by <a href={site.author.url}>{site.author.name}</a>, a software and AI
          engineer who has written code every day for more than five years, most of it in the open. It
          began as a browser worth choosing on its own: fast, private and quiet, with your
          extensions and everything else already inside. One switch away is Work, a canvas where
          agents open real pages in plain sight, compare and build, and leave you something to keep.
        </p>

        <h2>What we believe</h2>
        <ul>
          <li>
            <strong>A browser first, and a native one.</strong> It is written in Rust on the engine
            your system already ships, WKWebView on macOS and WebView2 on Windows, and it is not a
            fork of Chromium or Firefox. That is why the app is {site.appSize}.
          </li>
          <li>
            <strong>Private by default.</strong> No telemetry. History, tasks and notes stay on your
            device, and you never need an account to browse.
          </li>
          <li>
            <strong>Open source all the way down.</strong> The browser and this website are under
            the Mozilla Public License 2.0, and the backend behind Zephium AI is under the
            AGPL-3.0-only, so you can run it yourself.
          </li>
          <li>
            <strong>Built with the people who use it.</strong> Reports and fixes from users go into
            the next release, and the changelog says whose they were.
          </li>
        </ul>
        <p>
          The browser lives at <a href={site.repo}>{handle(site.repo)}</a>, the website at{" "}
          <a href={site.websiteRepo}>{handle(site.websiteRepo)}</a>, the backend at{" "}
          <a href={site.backendRepo}>{handle(site.backendRepo)}</a>. The backend has a{" "}
          <a href={site.backendSelfHosting}>guide to self-hosting</a>, and if you need other terms
          than the AGPL, there is <a href={site.commercialLicensing}>commercial licensing</a>.
        </p>

        <h2>So far</h2>
        <ul>
          {TIMELINE.map((entry) => (
            <li key={entry.version}>
              {entry.date}:{" "}
              <Link href={`/changelog#${releaseAnchor(entry.version)}`}>{entry.version}</Link>.{" "}
              {entry.text}
            </li>
          ))}
        </ul>

        <h2>The people</h2>
        <p>
          <a href={site.author.url}>{site.author.name}</a> makes {site.name}.
          {contributors.length > 0
            ? " These people have sent changes to the browser:"
            : " Anyone can send a change, and the people who do are listed on the browser's repository."}
        </p>
        {contributors.length > 0 ? (
          <ul className={styles.people}>
            {contributors.map((person) => (
              <li key={person.login}>
                <a href={person.url}>@{person.login}</a>
              </li>
            ))}
          </ul>
        ) : null}
        <p>
          Want to be on this list? Start with the{" "}
          <a href={`${site.repo}/issues`}>open issues</a>.
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

      <p className={styles.contact}>
        Questions and press: <a href={`mailto:${site.contact.info}`}>{site.contact.info}</a>. Security
        reports: <a href={`mailto:${site.contact.security}`}>{site.contact.security}</a>. For help with
        your account, see <Link href="/support">Support</Link>.
      </p>
    </PageShell>
  );
}
