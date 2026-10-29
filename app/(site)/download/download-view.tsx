"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import {
  AppleIcon,
  ArrowUpRight01Icon,
  Download04Icon,
  Tick02Icon,
  WindowsNewIcon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon, type IconSvgElement } from "@hugeicons/react";
import { useEffect, useRef, useState, type CSSProperties } from "react";
import { detectPlatform, usePlatform } from "@/components/preferred-platform";
import { LinuxWaitlistSignup } from "@/components/linux-waitlist/signup";
import { plans } from "@/lib/pricing";
import { downloadUrl, platforms, site, type Platform, type PlatformId } from "@/lib/site";
import styles from "./download.module.css";

const ICONS: Partial<Record<PlatformId, IconSvgElement>> = {
  macos: AppleIcon,
  windows: WindowsNewIcon,
};

/** Install steps, kept to what is true on both systems. */
const STEPS: Partial<Record<PlatformId, string[]>> = {
  macos: ["Open the downloaded .dmg.", "Drag Zephium to Applications.", "Open Zephium."],
  windows: ["Run the downloaded setup .exe.", "Follow the installer.", "Open Zephium."],
};

const available = platforms.filter((platform) => platform.status === "available");
const soon = platforms.filter((platform) => platform.status === "soon");

const label = (platform: Platform) => (platform.id === "macos" ? "Mac" : platform.name);

/** Reads the address, then hands what it found to the page. */
export function DownloadExperience() {
  const params = useSearchParams();
  return <DownloadView start={params.get("start")} plan={params.get("plan")} />;
}

/**
 * The page. `start` is the flag the Download buttons add: `1` for the
 * visitor's own desktop, or a platform id for that build. It is acted on
 * once and taken out of the address, so a reload, a shared link or a crawler
 * never starts a download. `plan` only changes one line of what to do next.
 */
export function DownloadView({ start, plan }: { start: string | null; plan: string | null }) {
  const detected = usePlatform();
  const [started, setStarted] = useState<PlatformId | null>(null);
  const attempted = useRef(false);

  useEffect(() => {
    if (!start || attempted.current) return;
    attempted.current = true;

    // Take the flag out first, so nothing below can run twice from the address.
    const url = new URL(window.location.href);
    url.searchParams.delete("start");
    window.history.replaceState(null, "", url);

    const wanted = start === "1" ? detectPlatform() : start;
    const target = available.find((platform) => platform.id === wanted);
    if (!target) return;
    // Recording that the download began is the only state this effect sets.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setStarted(target.id);
    // The asset is served as an attachment, so the page stays where it is.
    window.location.assign(downloadUrl(target));
  }, [start]);

  const chosen = plans.find((item) => item.id === plan && item.id !== "free");
  const startedPlatform = available.find((platform) => platform.id === started);
  const own = available.find((platform) => platform.id === detected);
  const elsewhere = detected ? platforms.find((platform) => platform.id === detected && platform.status === "soon") : null;
  const ordered = own ? [own, ...available.filter((platform) => platform !== own)] : available;

  return (
    <div className={styles.page}>
      <section className={styles.status} aria-labelledby="status-title" data-reveal>
        <div role="status">
          {startedPlatform ? (
            <>
              <span className={styles.check} aria-hidden>
                <HugeiconsIcon icon={Tick02Icon} size={20} strokeWidth={2} />
              </span>
              <h2 id="status-title">Your download has started</h2>
              <p>
                Zephium for {startedPlatform.name} is on its way. If nothing happens, check your browser&apos;s
                downloads, or{" "}
                <a href={downloadUrl(startedPlatform)} className={styles.again}>
                  download again
                </a>
                .
              </p>
            </>
          ) : own ? (
            <>
              <h2 id="status-title">Download Zephium for {label(own)}</h2>
              <p>{own.requirement}.</p>
              <a href={downloadUrl(own)} className={styles.primary} data-preferred>
                <HugeiconsIcon icon={ICONS[own.id] ?? Download04Icon} size={18} strokeWidth={1.8} aria-hidden />
                Download for {label(own)}
              </a>
            </>
          ) : (
            <>
              <h2 id="status-title">
                {elsewhere ? `Zephium for ${elsewhere.name} is on the way` : "Download Zephium"}
              </h2>
              <p>
                {elsewhere
                  ? "For now it is available for macOS and Windows."
                  : "Available for macOS and Windows."}
              </p>
              <div className={styles.buttons}>
                {available.map((platform, index) => (
                  <a
                    key={platform.id}
                    href={downloadUrl(platform)}
                    className={index === 0 ? styles.primary : styles.secondary}
                  >
                    <HugeiconsIcon icon={ICONS[platform.id] ?? Download04Icon} size={18} strokeWidth={1.8} aria-hidden />
                    Download for {label(platform)}
                  </a>
                ))}
              </div>
            </>
          )}
        </div>
      </section>

      <section aria-labelledby="install-title" className={styles.block} data-reveal>
        <h2 id="install-title">Install</h2>
        <ul className={styles.platforms}>
          {ordered.map((platform) => (
            <li
              key={platform.id}
              className={styles.platform}
              data-preferred={platform.id === own?.id || undefined}
            >
              <header>
                <HugeiconsIcon icon={ICONS[platform.id] ?? Download04Icon} size={20} strokeWidth={1.7} aria-hidden />
                <h3>{platform.name}</h3>
              </header>
              <p className={styles.requirement}>{platform.requirement}</p>
              <ol>
                {STEPS[platform.id]?.map((step) => (
                  <li key={step}>{step}</li>
                ))}
              </ol>
              <a href={downloadUrl(platform)} className={styles.file}>
                <HugeiconsIcon icon={Download04Icon} size={16} strokeWidth={1.8} aria-hidden />
                {platform.asset}
              </a>
            </li>
          ))}
        </ul>
        <p className={styles.soon}>
          {soon.slice(0, -1).map((platform) => platform.name).join(", ")} and {soon.at(-1)?.name} are on the
          way.
        </p>
      </section>

      <section aria-labelledby="next-title" className={styles.block} data-reveal style={{ "--delay": "0.06s" } as CSSProperties}>
        <h2 id="next-title">Next</h2>
        <div className={styles.next}>
          <div>
            <h3>Use Zephium AI</h3>
            <p>
              {chosen
                ? `Open Settings → Account, sign in and choose ${chosen.name}.`
                : "Open Settings → Account, sign in and choose your plan."}{" "}
              Signing in is optional, and you never need an account to browse.
            </p>
            <Link href="/pricing" className={styles.more}>
              See plans
            </Link>
          </div>
          <div>
            <h3>Bring your own</h3>
            <p>
              Add your own API key or run a model on your computer, without an account. You pay only
              your provider, or nothing at all.
            </p>
          </div>
        </div>
      </section>

      <LinuxWaitlistSignup />

      <ul className={styles.links}>
        <li>
          <Link href="/changelog">Release notes</Link>
        </li>
        <li>
          <a href={site.releases}>
            All builds on GitHub
            <HugeiconsIcon icon={ArrowUpRight01Icon} size={14} strokeWidth={1.8} aria-hidden />
          </a>
        </li>
        <li>
          <span>Free and open source</span>
        </li>
        <li>
          <span>{site.appSize} app size</span>
        </li>
      </ul>
    </div>
  );
}
