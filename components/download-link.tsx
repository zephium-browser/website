"use client";

import type { ReactNode } from "react";
import { useDesktop } from "@/components/preferred-platform";
import { downloadUrl, platforms, site } from "@/lib/site";

/**
 * Downloads the build for the visitor's desktop straight away. Elsewhere, and
 * before the page is in a browser, it opens the latest release on GitHub,
 * which lists every build.
 */
export function DownloadLink({
  className,
  children,
  onClick,
}: {
  className?: string;
  children: ReactNode;
  onClick?: () => void;
}) {
  const desktop = useDesktop();
  const platform = platforms.find((item) => item.id === desktop);
  return (
    <a href={platform ? downloadUrl(platform) : `${site.releases}/latest`} className={className} onClick={onClick}>
      {children}
    </a>
  );
}
