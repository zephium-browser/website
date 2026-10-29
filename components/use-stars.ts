"use client";

import { useEffect, useState } from "react";

/**
 * The star count: the one read when the site was built, then the one the
 * server keeps fresh (/stars.json, deploy/stars.sh), from our own origin.
 */
export function useStars(built: number) {
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
