"use client";

import { useEffect, useState, type RefObject } from "react";

/**
 * Whether an element has come into view. It stays true once seen, so what it
 * starts (a count, a sequence) plays once and is not undone by scrolling back.
 */
export function useInView(ref: RefObject<Element | null>, margin = "0px 0px -20% 0px") {
  const [seen, setSeen] = useState(false);
  useEffect(() => {
    const element = ref.current;
    if (!element || seen) return;
    const watch = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) setSeen(true);
      },
      { rootMargin: margin },
    );
    watch.observe(element);
    return () => watch.disconnect();
  }, [ref, margin, seen]);
  return seen;
}
