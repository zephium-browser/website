"use client";

import { AiMagicIcon, Briefcase02Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon, type IconSvgElement } from "@hugeicons/react";
import { useEffect, useRef, useState } from "react";
import { useInView } from "@/components/motion/use-in-view";
import { PrivacyWindow } from "./privacy-window";
import styles from "./privacy-features.module.css";

/** What the caption says for each state of the two switches. */
const CAPTIONS = {
  full: "Agents, Work and Ask, when you want them.",
  noWork: "Work is gone. Ask and your models stay.",
  off: "Still a complete browser. Nothing deleted, your keys kept.",
} as const;

/** A switch as macOS draws it: a pill with a round thumb, a real button for the keyboard and a screen reader. */
function Switch({
  checked,
  disabled,
  labelledBy,
  describedBy,
  onChange,
}: {
  checked: boolean;
  disabled?: boolean;
  labelledBy: string;
  describedBy: string;
  onChange: () => void;
}) {
  return (
    <button
      type="button"
      role="switch"
      className={styles.switch}
      aria-checked={checked}
      aria-disabled={disabled || undefined}
      aria-labelledby={labelledBy}
      aria-describedby={describedBy}
      onClick={() => {
        if (!disabled) onChange();
      }}
    >
      <span className={styles.knob} />
    </button>
  );
}

function Row({
  id,
  icon,
  title,
  note,
  checked,
  disabled,
  onChange,
}: {
  id: string;
  icon: IconSvgElement;
  title: string;
  note: string;
  checked: boolean;
  disabled?: boolean;
  onChange: () => void;
}) {
  return (
    <li className={styles.row} data-disabled={disabled || undefined}>
      <span className={styles.glyph}>
        <HugeiconsIcon icon={icon} strokeWidth={1.6} aria-hidden />
      </span>
      <span className={styles.text}>
        <b id={`${id}-title`}>{title}</b>
        <small id={`${id}-note`}>{note}</small>
      </span>
      <Switch
        checked={checked}
        disabled={disabled}
        labelledBy={`${id}-title`}
        describedBy={`${id}-note`}
        onChange={onChange}
      />
    </li>
  );
}

/**
 * The product's Settings, Features pane, with its two switches, beside a small
 * drawing of the window that answers them. Turning AI off takes Work off with
 * it and disables it, as the product does; turning Work off takes Work alone.
 * Work remembers its own choice, so AI coming back brings it back too. Once,
 * when it is first seen, the switches flip by themselves (AI off, then on) so
 * a visitor who never touches them still gets the idea; a touch stops that,
 * and so does a preference for reduced motion.
 */
export function PrivacyFeatures() {
  const stage = useRef<HTMLDivElement>(null);
  const seen = useInView(stage, "0px 0px -35% 0px");
  const touched = useRef(false);
  const [ai, setAi] = useState(true);
  const [workChoice, setWorkChoice] = useState(true);
  const work = ai && workChoice;
  const state = !ai ? "off" : work ? "full" : "noWork";

  useEffect(() => {
    if (!seen || touched.current) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const flip = (value: boolean) => () => {
      if (!touched.current) setAi(value);
    };
    const timers = [window.setTimeout(flip(false), 1100), window.setTimeout(flip(true), 3900)];
    return () => timers.forEach(window.clearTimeout);
  }, [seen]);

  return (
    <figure className={styles.figure}>
      <div ref={stage} className={styles.desk} data-reveal="fade">
        <section className={styles.panel} aria-label="Settings, Features">
          <div className={styles.toolbar} aria-hidden="true">
            <i />
            <i />
            <i />
          </div>
          <h3>Features</h3>
          <p>Choose what Zephium includes.</p>
          <ul className={styles.group}>
            <Row
              id="feature-ai"
              icon={AiMagicIcon}
              title="AI"
              note="Models, agents and dictation."
              checked={ai}
              onChange={() => {
                touched.current = true;
                setAi(!ai);
              }}
            />
            <Row
              id="feature-work"
              icon={Briefcase02Icon}
              title="Work"
              note={ai ? "Agents that browse and build." : "Needs AI."}
              checked={work}
              disabled={!ai}
              onChange={() => {
                touched.current = true;
                setWorkChoice(!workChoice);
              }}
            />
          </ul>
          <p className={styles.footnote}>Turning AI off turns Work off with it.</p>
        </section>

        <PrivacyWindow ai={ai} work={work} />
      </div>

      <figcaption className={styles.caption}>
        {/* The three lines sit in one cell, unseen, so the caption never changes height. */}
        <span className={styles.sizer} aria-hidden="true">
          {Object.values(CAPTIONS).map((text) => (
            <span key={text}>{text}</span>
          ))}
        </span>
        <span key={state} className={styles.line} role="status">
          {CAPTIONS[state]}
        </span>
      </figcaption>
    </figure>
  );
}
