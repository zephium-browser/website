"use client";

import {
  ArrowDown01Icon,
  ArrowRight02Icon,
  ArrowUp02Icon,
  NoteAddIcon,
  StopIcon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { useEffect, useId, useLayoutEffect, useRef, useState } from "react";
import { Character, type CharacterKind, type Mood } from "@/components/work/character";
import { Orb } from "./orb";
import { Shimmer } from "./shimmer";
import styles from "./island.module.css";

/**
 * What the run is doing, as the island shows it. The first five are a run at
 * work: the orb turns and the words shimmer. The rest are the lead's face.
 */
export type IslandState =
  | "thinking"
  | "searching"
  | "reading"
  | "comparing"
  | "working"
  | "waiting"
  | "done"
  | "stopped"
  | "rest";

/** The product's own words for each state, for a line with nothing more to say. */
export const ISLAND_WORDS: Record<IslandState, string> = {
  thinking: "Thinking",
  searching: "Searching",
  reading: "Reading",
  comparing: "Comparing",
  working: "Using the page",
  waiting: "Waiting for you",
  done: "Done",
  stopped: "Stopped",
  rest: "Ready",
};

export type IslandPanel = "agents" | "next" | "question";

export type IslandPart = {
  title: string;
  /** What it is doing now, said under its name. */
  now?: string;
  helper?: Exclude<CharacterKind, "lead">;
};

export type IslandQuestion = { prompt: string; options: readonly string[]; answer?: string };

const LIVE: ReadonlySet<IslandState> = new Set<IslandState>([
  "thinking",
  "searching",
  "reading",
  "comparing",
  "working",
]);

const FACE: Record<IslandState, Mood> = {
  thinking: "thinking",
  searching: "searching",
  reading: "reading",
  comparing: "thinking",
  working: "working",
  waiting: "waiting",
  done: "done",
  stopped: "stopped",
  rest: "rest",
};

const HELPER_MOOD: Record<Exclude<CharacterKind, "lead">, Mood> = {
  browser: "reading",
  research: "searching",
  computer: "working",
  connection: "working",
};

/**
 * The run's line at the top of the canvas, ported from the product's
 * AgentLine.svelte: one capsule that says what the run is doing, and grows
 * down into its list (the agents at work, what to do next, or a question)
 * and folds back into the line, the way the island at the top of a phone does.
 *
 * It is presentational: the panel opens from its own controls, or from
 * `panel` when the page drives it. Every length is in design pixels (`--u`).
 */
export function Island({
  state,
  text,
  action,
  actionStyle,
  stoppable = true,
  parts = [],
  next = [],
  writeup = false,
  question,
  panel: driven,
  onPanelChange,
  onAction,
  className,
}: {
  state: IslandState;
  /** The line itself: two or three words while it works, one quiet sentence once it stops. */
  text?: string;
  /** The one action at the end of the line, e.g. "Next", "Answer", "Review", "Approve". */
  action?: string;
  /** `disclosure` opens the next rows (Next); `lit` is a call to act. Next is a disclosure. */
  actionStyle?: "lit" | "disclosure";
  /** A run at work offers Stop at the line's end. */
  stoppable?: boolean;
  /** The parts at work, listed when the avatar opens the capsule. */
  parts?: readonly IslandPart[];
  /** Follow-ups the run offers, listed under Next. */
  next?: readonly string[];
  /** Offer to write the result up as a note, under Next. */
  writeup?: boolean;
  /** A question the run is asking; Answer opens it. */
  question?: IslandQuestion;
  /** Drives the panel from outside; `null` keeps it closed, `undefined` leaves it to the island. */
  panel?: IslandPanel | null;
  onPanelChange?: (panel: IslandPanel | null) => void;
  /** A lit action was pressed. */
  onAction?: () => void;
  className?: string;
}) {
  const id = useId();
  const live = LIVE.has(state);
  const words = text ?? ISLAND_WORDS[state];
  const settled = !live && !question;
  const nextRows = next.length > 0 || writeup;
  const style = actionStyle ?? (action === "Next" ? "disclosure" : "lit");

  /* What the person opened the capsule for. */
  const [want, setWant] = useState<IslandPanel | null>(null);
  const wanted = driven === undefined ? want : driven;
  /* Agents close once the run stops. */
  const panel =
    wanted === "agents"
      ? live
        ? "agents"
        : null
      : wanted && question
        ? "question"
        : wanted === "next" && nextRows
          ? "next"
          : null;
  const expanded = panel !== null;
  const open = (next: IslandPanel | null) => {
    if (driven === undefined) setWant(next);
    onPanelChange?.(next);
  };

  /* What the capsule holds while it closes, so it shrinks around its rows, not around nothing. */
  const [held, setHeld] = useState(panel);
  if (panel && panel !== held) setHeld(panel);

  /* The line is one line; when it is clipped its words open the whole of it. */
  const host = useRef<HTMLElement>(null);
  const measured = useRef<HTMLSpanElement>(null);
  const [clipped, setClipped] = useState(false);
  const [whole, setWhole] = useState(false);
  const [said, setSaid] = useState(words);
  if (said !== words) {
    setSaid(words);
    setWhole(false);
  }

  useLayoutEffect(() => {
    const element = measured.current;
    if (!element || whole) return;
    const measure = () => setClipped(element.scrollWidth > element.clientWidth);
    const observer = new ResizeObserver(measure);
    observer.observe(element);
    return () => observer.disconnect();
  }, [words, whole, live, clipped]);

  /* A click away or Escape closes any panel. */
  useEffect(() => {
    if (!expanded) return;
    const away = (event: PointerEvent) => {
      if (event.target instanceof Node && !host.current?.contains(event.target)) open(null);
    };
    const escape = (event: KeyboardEvent) => {
      if (event.key === "Escape") open(null);
    };
    window.addEventListener("pointerdown", away);
    window.addEventListener("keydown", escape);
    return () => {
      window.removeEventListener("pointerdown", away);
      window.removeEventListener("keydown", escape);
    };
  });

  const line = (() => {
    if (clipped || whole)
      return (
        <button
          key={words}
          type="button"
          className={[styles.words, styles.more, whole && styles.whole].filter(Boolean).join(" ")}
          aria-expanded={whole}
          onClick={() => setWhole(!whole)}
        >
          <span ref={measured} className={styles.text}>
            {words}
          </span>
          <span className={styles.turn} aria-hidden="true">
            <HugeiconsIcon icon={ArrowDown01Icon} className={styles.icon12} />
          </span>
        </button>
      );
    return (
      <span key={words} className={styles.words}>
        <span ref={measured} className={styles.text}>
          {live ? <Shimmer text={words} /> : words}
        </span>
      </span>
    );
  })();

  return (
    <section
      ref={host}
      className={[styles.island, settled && styles.settled, className].filter(Boolean).join(" ")}
      aria-label="Agent line"
    >
      <div className={[styles.capsule, expanded && styles.open].filter(Boolean).join(" ")}>
        <div
          className={[styles.expand, expanded && styles.shown].filter(Boolean).join(" ")}
          aria-hidden={!expanded}
          inert={!expanded}
        >
          <div className={styles.expandInner}>
            {held === "agents" ? (
              <ul className={styles.rows} aria-label="Agents in this run">
                {parts.length ? (
                  parts.map((part) => {
                    const helper = part.helper ?? "research";
                    return (
                      <li key={part.title}>
                        <button type="button" className={styles.row} onClick={() => open(null)}>
                          <span className={styles.rowMark}>
                            <span className={styles.figure}>
                              <Character kind={helper} mood={HELPER_MOOD[helper]} size={22} />
                            </span>
                          </span>
                          <span className={styles.said}>
                            <span className={styles.who}>{part.title}</span>
                            {part.now && <span className={styles.doing}>{part.now}</span>}
                          </span>
                        </button>
                      </li>
                    );
                  })
                ) : (
                  <li className={styles.none}>No agents are working right now</li>
                )}
              </ul>
            ) : held === "next" ? (
              <ul className={styles.rows} aria-label="Next">
                {next.map((followup) => (
                  <li key={followup}>
                    <button type="button" className={styles.row} onClick={() => open(null)}>
                      <span>{followup}</span>
                      <HugeiconsIcon icon={ArrowRight02Icon} className={styles.icon13} />
                    </button>
                  </li>
                ))}
                {writeup && (
                  <>
                    {next.length > 0 && <li className={styles.rule} aria-hidden="true" />}
                    <li>
                      <button
                        type="button"
                        className={[styles.row, styles.writeup].join(" ")}
                        onClick={() => open(null)}
                      >
                        <HugeiconsIcon icon={NoteAddIcon} className={styles.icon14} />
                        <span>Write this up as a note</span>
                      </button>
                    </li>
                  </>
                )}
              </ul>
            ) : held === "question" && question ? (
              <form className={styles.form} onSubmit={(event) => event.preventDefault()}>
                <label htmlFor={`${id}-answer`}>{question.prompt}</label>
                <div className={styles.options}>
                  {question.options.map((option) => (
                    <button
                      key={option}
                      type="button"
                      className={styles.chip}
                      data-on={option === question.answer || undefined}
                    >
                      {option}
                    </button>
                  ))}
                </div>
                <div className={styles.answer}>
                  <input
                    id={`${id}-answer`}
                    placeholder="Your answer"
                    value={question.answer ?? ""}
                    readOnly
                  />
                  <button
                    type="submit"
                    className={styles.send}
                    aria-label="Send answer"
                    disabled={!question.answer?.trim()}
                  >
                    <HugeiconsIcon icon={ArrowUp02Icon} strokeWidth={2} className={styles.icon15} />
                  </button>
                </div>
              </form>
            ) : null}
          </div>
        </div>

        <div className={styles.line}>
          <button
            type="button"
            className={styles.avatar}
            aria-expanded={panel === "agents"}
            aria-label="Agents in this run"
            onClick={() => open(wanted === "agents" ? null : "agents")}
          >
            {live ? (
              <Orb size={20} label="Agent line" />
            ) : (
              <span className={styles.figure}>
                <Character kind="lead" mood={FACE[state]} size={22} label="Agent line" />
              </span>
            )}
          </button>
          <div className={styles.state}>{line}</div>
          <div className={styles.controls}>
            {question && !expanded ? (
              <button type="button" className={styles.action} onClick={() => open("question")}>
                {action ?? "Answer"}
              </button>
            ) : action && style === "disclosure" && nextRows ? (
              <button
                type="button"
                className={[styles.action, styles.disclosure].join(" ")}
                aria-expanded={panel === "next"}
                onClick={() => open(wanted === "next" ? null : "next")}
              >
                {action}
                <HugeiconsIcon icon={ArrowDown01Icon} className={styles.icon12} />
              </button>
            ) : action && !question ? (
              <button
                type="button"
                className={[styles.action, style === "disclosure" && styles.disclosure]
                  .filter(Boolean)
                  .join(" ")}
                onClick={onAction}
              >
                {action}
                {style === "disclosure" && (
                  <HugeiconsIcon icon={ArrowDown01Icon} className={styles.icon12} />
                )}
              </button>
            ) : null}
            {live && stoppable && (
              <button type="button" className={styles.quiet} aria-label="Stop" title="Stop">
                <HugeiconsIcon icon={StopIcon} className={styles.icon14} />
              </button>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
