"use client";

import {
  BubbleChatIcon,
  CheckListIcon,
  HourglassIcon,
  IncognitoIcon,
  Mic01Icon,
  Note01Icon,
  PuzzleIcon,
  RoboticIcon,
  ShieldBanIcon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon, type IconSvgElement } from "@hugeicons/react";
import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import styles from "./ai-switch.module.css";

type Tool = { icon: IconSvgElement; label: string };

/** What the AI switch takes with it (frame's feature_ai_leaves_*). */
const AI: Tool[] = [
  { icon: BubbleChatIcon, label: "Ask" },
  { icon: RoboticIcon, label: "Agents" },
  { icon: Mic01Icon, label: "Dictation" },
];

/** What stays, whatever the switch says. */
const BROWSER: Tool[] = [
  { icon: ShieldBanIcon, label: "Blocker" },
  { icon: PuzzleIcon, label: "Extensions" },
  { icon: Note01Icon, label: "Notes" },
  { icon: CheckListIcon, label: "Tasks" },
  { icon: HourglassIcon, label: "Time" },
  { icon: IncognitoIcon, label: "Private" },
];

/** How long each state holds while the dock plays by itself. */
const HOLD = { on: 2600, off: 3800 };

function useReducedMotion() {
  return useSyncExternalStore(
    (change) => {
      const list = window.matchMedia("(prefers-reduced-motion: reduce)");
      list.addEventListener("change", change);
      return () => list.removeEventListener("change", change);
    },
    () => window.matchMedia("(prefers-reduced-motion: reduce)").matches,
    () => true,
  );
}

function Tile({ tool }: { tool: Tool }) {
  return (
    <li className={styles.tool}>
      <span className={styles.tile}>
        <HugeiconsIcon icon={tool.icon} strokeWidth={1.6} aria-hidden />
      </span>
      <span className={styles.label}>{tool.label}</span>
    </li>
  );
}

/**
 * Zephium's tools in one row, led by the AI switch. While it is on screen it
 * flips by itself, so the AI tools leave and come back and the rest never
 * move; pointing at it holds it still, and flipping it yourself takes over.
 */
export function AiSwitch() {
  const [on, setOn] = useState(true);
  const [taken, setTaken] = useState(false);
  const [held, setHeld] = useState(false);
  const [visible, setVisible] = useState(false);
  const still = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const playing = visible && !taken && !held && !still;

  useEffect(() => {
    const element = ref.current;
    if (!element) return;
    const watch = new IntersectionObserver(([entry]) => setVisible(Boolean(entry?.isIntersecting)), {
      rootMargin: "0px 0px -25% 0px",
    });
    watch.observe(element);
    return () => watch.disconnect();
  }, []);

  useEffect(() => {
    if (!playing) return;
    const timer = window.setTimeout(() => setOn((value) => !value), on ? HOLD.on : HOLD.off);
    return () => window.clearTimeout(timer);
  }, [playing, on]);

  return (
    <div ref={ref} className={styles.stage} data-on={on || undefined}>
      <div
        className={styles.dock}
        onPointerEnter={() => setHeld(true)}
        onPointerLeave={() => setHeld(false)}
      >
        <button
          type="button"
          role="switch"
          aria-checked={on}
          className={styles.toggle}
          onClick={() => {
            setTaken(true);
            setOn((value) => !value);
          }}
        >
          <span className={styles.tile}>
            <span className={styles.switch} />
          </span>
          <span className={styles.label}>AI</span>
        </button>

        <span className={styles.rule} aria-hidden="true" />

        <div className={styles.fold} aria-hidden={!on}>
          <ul className={styles.ai} aria-label="With AI">
            {AI.map((tool) => (
              <Tile key={tool.label} tool={tool} />
            ))}
            <li className={styles.rule} aria-hidden="true" />
          </ul>
        </div>

        <ul className={styles.tools} aria-label="Always">
          {BROWSER.map((tool) => (
            <Tile key={tool.label} tool={tool} />
          ))}
        </ul>
      </div>

      <p className={styles.caption} aria-live="polite">
        {on ? (
          <>
            <strong>AI on.</strong> Ask, agents and dictation, with the model you choose.
          </>
        ) : (
          <>
            <strong>AI off.</strong> No model runs, your keys stay saved, and the browser is all here.
          </>
        )}
      </p>
    </div>
  );
}
