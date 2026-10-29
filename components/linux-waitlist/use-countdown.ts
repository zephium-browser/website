"use client";

import { useCallback, useEffect, useRef, useState } from "react";

/**
 * Counts whole seconds down to zero, from the clock rather than from ticks,
 * so a background tab that wakes late shows the right number.
 */
export function useCountdown() {
  const until = useRef(0);
  const [seconds, setSeconds] = useState(0);

  useEffect(() => {
    if (!seconds) return;
    const timer = window.setInterval(() => {
      setSeconds(Math.max(0, Math.ceil((until.current - Date.now()) / 1000)));
    }, 500);
    return () => window.clearInterval(timer);
  }, [seconds]);

  const start = useCallback((wait: number) => {
    until.current = Date.now() + wait * 1000;
    setSeconds(wait);
  }, []);

  return { seconds, start };
}

/** "42s", or "1m 05s" once it is a minute or more. */
export function formatWait(seconds: number) {
  return seconds < 60 ? `${seconds}s` : `${Math.floor(seconds / 60)}m ${String(seconds % 60).padStart(2, "0")}s`;
}
