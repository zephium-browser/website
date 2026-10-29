"use client";

import { ArrowRight01Icon, GithubIcon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { Fragment, useCallback, useEffect, useRef, useState, useSyncExternalStore, type CSSProperties } from "react";
import { DownloadLink } from "@/components/download-link";
import { DownloadMenu } from "@/components/download-menu";
import { site } from "@/lib/site";
import { Clouds } from "./clouds";
import {
  CHAPTERS,
  MAX_RATE,
  SCENE_SCREENS,
  SCROLL,
  cameraAt,
  clockAt,
  flagsAt,
  restAt,
  sameFlags,
} from "./film";
import { ProductWindow } from "./product-window";
import styles from "./scene.module.css";

const COMPACT = "(max-width: 720px)";

const TITLE = "A browser and work environment, reimagined for you and your agents.";
/** The last word of the first clause; the light in the title changes after it. */
const COMMA = TITLE.split(" ").findIndex((word) => word.endsWith(","));

/** One line of story per chapter, under the window. */
const CAPTIONS = [
  "Your browser, as it should be.",
  "One switch, and it is ready for work.",
  "Ask in your own words.",
  "It asks before it guesses.",
  "Helpers work on live sites, in plain sight.",
  "Every finding, side by side.",
  "Keep the plan, not the transcript.",
  "Then turn it into tasks.",
];

/** Whether the screen is narrow enough for the portrait window. */
function useCompact() {
  return useSyncExternalStore(
    (change) => {
      const query = window.matchMedia(COMPACT);
      query.addEventListener("change", change);
      return () => query.removeEventListener("change", change);
    },
    () => window.matchMedia(COMPACT).matches,
    () => false,
  );
}

/**
 * The opening of the site: the sky, the promise, and one browser that rises,
 * switches to Work and runs a task from request to plan.
 *
 * The page scrolls natively and nothing is held or snapped. Scroll sets where
 * the film should be; the film follows on a spring, so a flick glides instead
 * of jumping, and never plays faster than MAX_RATE, so a hard flick still shows
 * every chapter. Each chapter ends in a short hold, where the picture rests
 * while the page moves on.
 */
export function Scene() {
  const sectionRef = useRef<HTMLElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const compact = useCompact();
  const [flags, setFlags] = useState(() => flagsAt(0));

  useEffect(() => {
    const section = sectionRef.current;
    const stage = stageRef.current;
    if (!section || !stage) return;
    const still = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    // Each value is written only to the pieces that read it, and only when it
    // changed. Set on the stage, a value would be inherited by every element
    // of the browser window and restyle all of them on each frame.
    const intros = stage.querySelectorAll<HTMLElement>("[data-intro]");
    const exits = stage.querySelectorAll<HTMLElement>("[data-exit]");
    const clock = stage.querySelector<HTMLElement>("[data-clock]");
    const lens = stage.querySelector<HTMLElement>("[data-camera]");
    const written = new Map<string, string>();
    const put = (key: string, value: string, targets: Iterable<HTMLElement | null>) => {
      if (written.get(key) === value) return;
      written.set(key, value);
      for (const target of targets) target?.style.setProperty(key, value);
    };

    // Where scroll says the film should be, and where it is.
    const goal = { p: 0, intro: 0, exit: 0 };
    const now = { p: -1, intro: 0, exit: 0 };
    let shown = flagsAt(0);
    let settled = "";
    let frame = 0;
    let last = 0;

    const write = () => {
      const camera = cameraAt(now.p, compact);
      put("--p", now.p.toFixed(4), [clock]);
      put("--intro", now.intro.toFixed(4), intros);
      put("--exit", now.exit.toFixed(4), exits);
      put("--cx", `${(-camera.x * camera.zoom).toFixed(2)}px`, [lens]);
      put("--cy", `${(-camera.y * camera.zoom).toFixed(2)}px`, [lens]);
      put("--zoom", camera.zoom.toFixed(4), [lens]);
      const ready = now.intro > 0.98 ? "true" : "false";
      if (ready !== settled) {
        settled = ready;
        stage.dataset.settled = settled;
      }
      const next = flagsAt(now.p);
      if (!sameFlags(next, shown)) {
        shown = next;
        setFlags(next);
      }
    };

    const tick = (time: number) => {
      const dt = last ? Math.min(0.05, (time - last) / 1000) : 1 / 60;
      last = time;
      if (still || now.p < 0) {
        Object.assign(now, goal);
      } else {
        // A critically damped follow, capped in speed for the film.
        const step = (goal.p - now.p) * (1 - Math.exp(-dt * 7));
        const cap = MAX_RATE * dt;
        now.p += Math.max(-cap, Math.min(cap, step));
        now.intro += (goal.intro - now.intro) * (1 - Math.exp(-dt * 9));
        now.exit += (goal.exit - now.exit) * (1 - Math.exp(-dt * 9));
      }
      const moving =
        Math.abs(goal.p - now.p) > 0.0005 ||
        Math.abs(goal.intro - now.intro) > 0.0005 ||
        Math.abs(goal.exit - now.exit) > 0.0005;
      if (!moving) {
        Object.assign(now, goal);
        last = 0;
      }
      write();
      frame = moving ? requestAnimationFrame(tick) : 0;
    };

    // The navigation sits on the sky without a material of its own, and takes
    // one on as the clouds sink and night falls.
    let sky: boolean | null = null;
    let screen = stage.clientHeight || window.innerHeight;
    const read = () => {
      const screens = Math.max(0, -section.getBoundingClientRect().top) / screen;
      goal.intro = Math.min(1, screens / SCROLL.intro);
      goal.p = clockAt(screens);
      const exitFrom = SCENE_SCREENS - 1 - SCROLL.exit;
      goal.exit = Math.min(1, Math.max(0, (screens - exitFrom) / SCROLL.exit));
      const onSky = goal.exit < 0.3;
      if (onSky !== sky) {
        sky = onSky;
        document.documentElement.toggleAttribute("data-sky", onSky);
      }
      if (!frame) frame = requestAnimationFrame(tick);
    };

    // On a phone the address bar growing and shrinking resizes the window by
    // height alone; the stage is sized in small-viewport units and does not
    // move, so only a change of width is worth reading again.
    let wide = window.innerWidth;
    const resize = () => {
      if (window.innerWidth === wide) return;
      wide = window.innerWidth;
      screen = stage.clientHeight || window.innerHeight;
      read();
    };

    // Looping animations (the canvas's pulses, the helpers' breathing) rest
    // while the stage is out of sight, so the page below pays for none of them.
    const sight = new IntersectionObserver(([entry]) => {
      stage.toggleAttribute("data-paused", !entry?.isIntersecting);
    });
    sight.observe(stage);

    read();
    window.addEventListener("scroll", read, { passive: true });
    window.addEventListener("resize", resize);
    return () => {
      sight.disconnect();
      cancelAnimationFrame(frame);
      document.documentElement.removeAttribute("data-sky");
      window.removeEventListener("scroll", read);
      window.removeEventListener("resize", resize);
    };
  }, [compact]);

  /** Scrolls the page to where a chapter rests. */
  const go = useCallback((chapter: number) => {
    const section = sectionRef.current;
    const stage = stageRef.current;
    if (!section || !stage) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    window.scrollTo({
      top: section.offsetTop + stage.clientHeight * restAt(chapter),
      behavior: reduce ? "auto" : "smooth",
    });
  }, []);

  const onMode = useCallback((mode: "browse" | "work") => go(mode === "work" ? 1 : 0), [go]);

  return (
    <section
      ref={sectionRef}
      className={styles.scene}
      style={{ "--screens": SCENE_SCREENS } as CSSProperties}
      aria-labelledby="hero-title"
    >
      <div ref={stageRef} className={styles.stage}>
        <Clouds className={styles.sky} />

        <div className={styles.copy} data-intro>
          <DownloadLink className={styles.chip}>
            Available now for Mac and Windows
            <HugeiconsIcon icon={ArrowRight01Icon} size={13} strokeWidth={2} aria-hidden />
          </DownloadLink>
          <h1 id="hero-title" className={styles.title} aria-label={TITLE}>
            {TITLE.split(" ").map((word, index) => (
              <Fragment key={`${word}-${index}`}>
                <span
                  className={styles.word}
                  style={{ "--i": index } as CSSProperties}
                  data-line={index <= COMMA ? 1 : 2}
                  aria-hidden="true"
                >
                  {word}{" "}
                </span>
                {word.endsWith(",") ? <br className={styles.break} /> : null}
              </Fragment>
            ))}
          </h1>
          <p className={styles.lede}>Fast, private and fully featured. Free and open source.</p>
          <div className={styles.actions}>
            <DownloadMenu variant="hero" />
            <a href={site.repo} className={styles.secondary}>
              <HugeiconsIcon icon={GithubIcon} size={17} strokeWidth={1.7} aria-hidden />
              Star on GitHub
            </a>
          </div>
        </div>

        <div className={styles.frame} data-intro>
          <a href="#browser" className={styles.skip}>
            Skip the demo
          </a>
          <ProductWindow flags={flags} compact={compact} onMode={onMode} />
        </div>

        <div className={styles.under} data-intro>
          <p className={styles.caption} aria-live="polite">
            {CAPTIONS.map((text, index) => (
              <span key={text} data-on={index === flags.chapter || undefined}>
                {text}
              </span>
            ))}
          </p>
          <nav className={styles.steps} aria-label="Chapters of the demo">
            {CHAPTERS.map((chapter, index) => (
              <button
                key={chapter}
                type="button"
                data-on={index === flags.chapter || undefined}
                data-past={index < flags.chapter || undefined}
                aria-label={`Chapter ${index + 1} of ${CHAPTERS.length}`}
                aria-current={index === flags.chapter ? "step" : undefined}
                onClick={() => go(index)}
              />
            ))}
          </nav>
        </div>

        <span className={styles.hint} aria-hidden="true" data-intro>
          Scroll
          <i />
        </span>

        <span className={styles.dusk} aria-hidden="true" data-exit />
      </div>
    </section>
  );
}
