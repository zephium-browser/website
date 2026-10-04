"use client";

import { useEffect, useRef, useSyncExternalStore, type ReactNode } from "react";
import type { PlatformId } from "@/lib/site";

/** The visitor's platform, as far as the browser will say. */
export function detectPlatform(): PlatformId | null {
  const data = (navigator as Navigator & { userAgentData?: { platform?: string } }).userAgentData;
  const source = (data?.platform || navigator.userAgent).toLowerCase();
  if (/iphone|ipad|ipod/.test(source)) return "ios";
  if (/android/.test(source)) return "android";
  if (/mac/.test(source)) return "macos";
  if (/win/.test(source)) return "windows";
  if (/linux|x11/.test(source)) return "linux";
  return null;
}

const noSubscription = () => () => {};

/** The visitor's desktop platform, once the page is in a browser. */
export function useDesktop(): "macos" | "windows" | null {
  return useSyncExternalStore(
    noSubscription,
    () => {
      const platform = detectPlatform();
      return platform === "macos" || platform === "windows" ? platform : null;
    },
    () => null,
  );
}

/**
 * Marks the child for the visitor's platform with `data-preferred`, which
 * the page styles first. The static page lists every platform in a fixed
 * order, so it is complete before (and without) this running.
 */
export function PreferredPlatform({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const platform = detectPlatform();
    const match = platform && ref.current?.querySelector(`[data-platform="${platform}"]`);
    match?.setAttribute("data-preferred", "");
  }, []);

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
}
