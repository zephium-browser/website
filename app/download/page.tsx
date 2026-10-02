import type { Metadata } from "next";
import {
  AndroidIcon,
  AppleIcon,
  ArrowUpRight01Icon,
  ComputerTerminal01Icon,
  Download04Icon,
  SmartPhone01Icon,
  WindowsNewIcon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon, type IconSvgElement } from "@hugeicons/react";
import { PreferredPlatform } from "@/components/preferred-platform";
import { PageShell } from "@/components/prose";
import { downloadUrl, platforms, site, type PlatformId } from "@/lib/site";
import styles from "./download.module.css";

export const metadata: Metadata = {
  title: "Download",
  description: `Download ${site.name} for macOS and Windows. Free and open source under ${site.license}, ${site.downloadSize}.`,
  alternates: { canonical: "/download" },
};

const icons: Record<PlatformId, IconSvgElement> = {
  macos: AppleIcon,
  windows: WindowsNewIcon,
  linux: ComputerTerminal01Icon,
  ios: SmartPhone01Icon,
  android: AndroidIcon,
};

export default function DownloadPage() {
  const available = platforms.filter((platform) => platform.status === "available");
  const soon = platforms.filter((platform) => platform.status === "soon");

  return (
    <PageShell
      title={`Download ${site.name}.`}
      lede={`Free and open source, ${site.downloadSize}. No telemetry.`}
    >
      <PreferredPlatform className={styles.platforms}>
        {available.map((platform) => (
          <a key={platform.id} href={downloadUrl(platform)} data-platform={platform.id} className={styles.card}>
            <HugeiconsIcon icon={icons[platform.id]} size={34} strokeWidth={1.4} className={styles.os} aria-hidden />
            <span className={styles.name}>{platform.name}</span>
            <span className={styles.requirement}>{platform.requirement}</span>
            <span className={styles.action}>
              <HugeiconsIcon icon={Download04Icon} size={17} strokeWidth={1.8} aria-hidden />
              Download for {platform.name}
            </span>
          </a>
        ))}
      </PreferredPlatform>

      <a href={site.releases} className={styles.releases}>
        All releases on GitHub
        <HugeiconsIcon icon={ArrowUpRight01Icon} size={15} strokeWidth={1.8} aria-hidden />
      </a>

      <div className={styles.soon}>
        <h2>Coming soon</h2>
        <ul>
          {soon.map((platform) => (
            <li key={platform.id}>
              <HugeiconsIcon icon={icons[platform.id]} size={20} strokeWidth={1.5} aria-hidden />
              {platform.name}
            </li>
          ))}
        </ul>
      </div>
    </PageShell>
  );
}
