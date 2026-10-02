"use client";

import { useEffect } from "react";

/**
 * Marks [data-reveal] elements as shown the first time they come into view.
 * Whatever is already on screen is shown before the page opts in, so nothing
 * flickers; a page without this script simply shows everything.
 */
export function Reveals() {
  useEffect(() => {
    const root = document.documentElement;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const show = (element: Element) => element.setAttribute("data-shown", "");
    const watch = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          show(entry.target);
          watch.unobserve(entry.target);
        }
      },
      { rootMargin: "0px 0px -12% 0px" },
    );

    const adopt = (scope: ParentNode) => {
      for (const element of scope.querySelectorAll("[data-reveal]:not([data-shown])")) {
        const box = element.getBoundingClientRect();
        if (box.top < window.innerHeight * 0.88 && box.bottom > 0) show(element);
        else watch.observe(element);
      }
    };

    adopt(document);
    root.setAttribute("data-reveals", "");

    // Pages navigated to later bring their own.
    let frame = 0;
    const added = new MutationObserver(() => {
      if (frame) return;
      frame = requestAnimationFrame(() => {
        frame = 0;
        adopt(document);
      });
    });
    added.observe(document.body, { childList: true, subtree: true });

    return () => {
      cancelAnimationFrame(frame);
      watch.disconnect();
      added.disconnect();
      root.removeAttribute("data-reveals");
    };
  }, []);

  return null;
}
