/*
 * The Work run as a film. Its clock is `p`, from 0 to 7: one unit per
 * chapter, and each whole number is a chapter at rest. Everything continuous
 * (the camera, pieces arriving, lines drawing, words typing) is a function of
 * `p`; the few things that switch (the mode, the island's words, a mood) are
 * read from it as flags, so the page re-renders only when one of them flips.
 */

export const CHAPTERS = ["browse", "work", "ask", "clarify", "spawn", "results", "plan", "tasks"] as const;
export type Chapter = (typeof CHAPTERS)[number];
export const LAST = CHAPTERS.length - 1;

/** Screens of scroll: the rise, a rest in Browse, each chapter, the exit. */
export const SCROLL = { intro: 0.85, rest: 0.4, chapter: 0.8, exit: 0.9 } as const;

/** The share of a chapter's scroll spent moving; the rest holds the picture. */
const MOVING = 0.7;

/** Fastest the film plays, in chapters per second, however hard the flick. */
export const MAX_RATE = 2.2;

export type Camera = { x: number; y: number; zoom: number };

/** Where the camera rests in each chapter: a world point and a zoom. */
const CAMERA: Record<Chapter, Camera> = {
  browse: { x: 470, y: 640, zoom: 0.92 },
  work: { x: 470, y: 640, zoom: 0.92 },
  ask: { x: 430, y: 560, zoom: 0.92 },
  clarify: { x: 440, y: 680, zoom: 0.86 },
  spawn: { x: 780, y: 610, zoom: 0.62 },
  results: { x: 1720, y: 625, zoom: 0.56 },
  plan: { x: 2800, y: 520, zoom: 0.7 },
  tasks: { x: 3240, y: 520, zoom: 0.7 },
};

/** On a phone the window is portrait, so the camera frames one thing at a time. */
const CAMERA_COMPACT: Record<Chapter, Camera> = {
  browse: { x: 470, y: 640, zoom: 0.75 },
  work: { x: 470, y: 640, zoom: 0.75 },
  ask: { x: 467, y: 540, zoom: 0.76 },
  clarify: { x: 467, y: 700, zoom: 0.76 },
  spawn: { x: 1130, y: 553, zoom: 0.52 },
  results: { x: 2000, y: 370, zoom: 0.42 },
  plan: { x: 2800, y: 470, zoom: 0.62 },
  tasks: { x: 2800, y: 470, zoom: 0.62 },
};

/** The page area the camera looks through, in design pixels. */
export const PAGE = { wide: 1116, narrow: 934, tall: 684 };
export const PAGE_COMPACT = { wide: 380, narrow: 198, tall: 690 };

const clamp = (value: number, low = 0, high = 1) => Math.min(high, Math.max(low, value));
const ease = (t: number) => t * t * (3 - 2 * t);

/** The film's clock for a scroll position, in screens from the scene's top. */
export function clockAt(screens: number) {
  const run = screens - SCROLL.intro - SCROLL.rest;
  if (run <= 0) return 0;
  const index = Math.floor(run / SCROLL.chapter);
  const within = (run - index * SCROLL.chapter) / SCROLL.chapter;
  return Math.min(LAST, index + clamp(within / MOVING));
}

/** The scroll position, in screens from the scene's top, where a chapter rests. */
export function restAt(chapter: number) {
  if (chapter <= 0) return SCROLL.intro + SCROLL.rest * 0.5;
  return SCROLL.intro + SCROLL.rest + (chapter - 1) * SCROLL.chapter + SCROLL.chapter * (MOVING + 0.1);
}

/** The scene's full height, in screens. */
export const SCENE_SCREENS = SCROLL.intro + SCROLL.rest + LAST * SCROLL.chapter + SCROLL.exit + 1;

/** Where the camera is at a moment, eased between chapters. */
export function cameraAt(p: number, compact: boolean): Camera {
  const table = compact ? CAMERA_COMPACT : CAMERA;
  const from = Math.min(LAST, Math.floor(p));
  const to = Math.min(LAST, from + 1);
  const t = ease(clamp((p - from - 0.05) / 0.8));
  const a = table[CHAPTERS[from]];
  const b = table[CHAPTERS[to]];
  return { x: a.x + (b.x - a.x) * t, y: a.y + (b.y - a.y) * t, zoom: a.zoom + (b.zoom - a.zoom) * t };
}

export type IslandLine = "thinking" | "asking" | "searching" | "comparing" | "writing" | "done";

/** The discrete state of the film at a moment. */
export function flagsAt(p: number) {
  const line: IslandLine | null =
    p >= 6.1
      ? "done"
      : p >= 5.05
        ? "writing"
        : p >= 4.05
          ? "comparing"
          : p >= 3.05
            ? "searching"
            : p >= 2.1
              ? "asking"
              : p >= 1.15
                ? "thinking"
                : null;
  return {
    /** The switch has flipped to Work. */
    work: p >= 0.15,
    /** The composer holds the request being written. */
    typing: p >= 0.4 && p < 1.15,
    line,
    /** The helpers are reading their pages. */
    reading: p >= 3.3 && p < 4.15,
    found: p >= 4.15,
    planned: p >= 5.3,
    tasks: p >= 6.15,
    /** The chapter the captions and steps speak for. */
    chapter: Math.min(LAST, Math.floor(p + 0.6)),
  };
}

export type Flags = ReturnType<typeof flagsAt>;

export const sameFlags = (a: Flags, b: Flags) =>
  a.work === b.work &&
  a.typing === b.typing &&
  a.line === b.line &&
  a.reading === b.reading &&
  a.found === b.found &&
  a.planned === b.planned &&
  a.tasks === b.tasks &&
  a.chapter === b.chapter;
