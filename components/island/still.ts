const REDUCED = "(prefers-reduced-motion: reduce)";

/**
 * Calls `notify` now and whenever the element should stop or may move again:
 * it is still while off screen, while the page is hidden, and while motion is
 * reduced. A per-element port of the product's shared `watchStill`.
 */
export function watchStill(element: Element, notify: (still: boolean) => void): () => void {
  let visible = true;
  const media = window.matchMedia(REDUCED);
  const tell = () => notify(!visible || document.visibilityState === "hidden" || media.matches);
  const observer = new IntersectionObserver((entries) => {
    for (const entry of entries) visible = entry.isIntersecting;
    tell();
  });
  observer.observe(element);
  document.addEventListener("visibilitychange", tell);
  media.addEventListener("change", tell);
  tell();
  return () => {
    observer.disconnect();
    document.removeEventListener("visibilitychange", tell);
    media.removeEventListener("change", tell);
  };
}
