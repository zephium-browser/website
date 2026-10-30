"use client";

import { useEffect, useId, useRef, useState } from "react";
import { useInView } from "@/components/motion/use-in-view";
import styles from "./privacy.module.css";

/**
 * What the browser has, from the docs and the changelog. The AI parts are
 * marked: they are what the AI switch takes away. Keep this list to things
 * that ship today.
 */
const FEATURES: { name: string; ai?: true }[] = [
  { name: "Ad and tracker blocker" },
  { name: "Ask Zephium", ai: true },
  { name: "Chrome extensions" },
  { name: "Spaces" },
  { name: "Split View" },
  { name: "Work", ai: true },
  { name: "Tasks" },
  { name: "Notes" },
  { name: "Time and focus" },
  { name: "Agents", ai: true },
  { name: "Profiles" },
  { name: "Essentials" },
  { name: "The launcher" },
  { name: "Dictation", ai: true },
  { name: "Themes" },
  { name: "Compact mode" },
  { name: "Private windows" },
  { name: "Restyle any site", ai: true },
  { name: "Zoom per site" },
  { name: "Downloads that resume" },
  { name: "Local models", ai: true },
  { name: "Import from ten browsers" },
  { name: "Site settings" },
  { name: "Your own API keys", ai: true },
  { name: "Proxy" },
  { name: "A new tab of your own" },
];

/**
 * The AI switch, as Settings › Features has it, over everything Zephium
 * does. Switched off, the AI parts are struck out and the rest stays: the
 * point is how little goes. It flips once by itself the first time it is
 * seen, unless the visitor has touched it or prefers less motion.
 */
export function Inventory() {
  const [ai, setAi] = useState(true);
  const ref = useRef<HTMLDivElement>(null);
  const touched = useRef(false);
  const seen = useInView(ref, "0px 0px -35% 0px");
  const ids = useId();

  useEffect(() => {
    if (!seen || touched.current || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const off = window.setTimeout(() => touched.current || setAi(false), 1200);
    const on = window.setTimeout(() => touched.current || setAi(true), 4400);
    return () => {
      window.clearTimeout(off);
      window.clearTimeout(on);
    };
  }, [seen]);

  return (
    <div
      ref={ref}
      className={styles.plate}
      data-ai={ai ? "on" : "off"}
      data-reveal="fade"
      onPointerDown={() => (touched.current = true)}
    >
      <div className={styles.setting}>
        <span className={styles.label}>
          <b id={`${ids}-name`}>Zephium AI</b>
          <span id={`${ids}-note`}>Models, agents and dictation.</span>
        </span>
        <button
          type="button"
          role="switch"
          aria-checked={ai}
          aria-labelledby={`${ids}-name`}
          aria-describedby={`${ids}-note`}
          className={styles.switch}
          onClick={() => {
            touched.current = true;
            setAi((on) => !on);
          }}
        >
          <span className={styles.knob} />
        </button>
      </div>

      <ul className={styles.wall} aria-label="What Zephium does">
        {FEATURES.map((feature) => (
          <li
            key={feature.name}
            data-ai={feature.ai || undefined}
            aria-hidden={(feature.ai && !ai) || undefined}
          >
            {feature.name}
          </li>
        ))}
      </ul>

      <p className={styles.caption} role="status">
        <span data-on={ai || undefined}>AI is on. Ask, Work and agents, whenever you call on them.</span>
        <span data-on={!ai || undefined}>AI is off. The browser is all still here, and nothing is deleted.</span>
      </p>
    </div>
  );
}
