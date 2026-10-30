"use client";

import {
  AiMagicIcon,
  ArrowDown01Icon,
  ArrowRight01Icon,
  Briefcase01Icon,
  LockIcon,
  Note01Icon,
  PaintBoardIcon,
  PuzzleIcon,
  Settings02Icon,
  Shield01Icon,
  Tick02Icon,
  UserCircleIcon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { useEffect, useId, useRef, useState, useSyncExternalStore, type CSSProperties, type ReactNode } from "react";
import { siAnthropic, siGooglegemini, siLmstudio, siOllama } from "simple-icons";
import { ZephiumLogo } from "@/components/brand";
import { useInView } from "@/components/motion/use-in-view";
import { site } from "@/lib/site";
import styles from "./principles.module.css";

type Principle = { id: string; title: string; body: ReactNode; visual: (active: boolean) => ReactNode };

const PRINCIPLES: Principle[] = [
  {
    id: "ai",
    title: "AI only when you want it.",
    body: "One switch in Settings takes models, agents and dictation away. What is left is a complete browser, and nothing is deleted.",
    visual: (active) => <Features active={active} />,
  },
  {
    id: "local",
    title: "Nothing about your browsing leaves.",
    body: "No telemetry and no usage analytics. History, tabs, Work and notes stay in your profile, on your computer.",
    visual: (active) => <Network active={active} />,
  },
  {
    id: "models",
    title: "Any model, or none.",
    body: "Your own key goes straight to OpenAI, Anthropic or Gemini, and Ollama or LM Studio never leave your computer. Zephium AI passes prompts through and keeps none.",
    visual: (active) => <Models active={active} />,
  },
  {
    id: "account",
    title: "An account when it adds something.",
    body: "Browsing never asks for one. Signing in brings Zephium AI today, and free sync across your devices soon.",
    visual: () => <Account />,
  },
  {
    id: "open",
    title: "Open to read.",
    body: (
      <>
        The browser is open source under the Mozilla Public License, down to the blocker and the
        storage.{" "}
        <a href={site.repo}>
          Read the source
          <HugeiconsIcon icon={ArrowRight01Icon} size={14} strokeWidth={2} aria-hidden />
        </a>
      </>
    ),
    visual: () => <Code />,
  },
];

const WIDE = "(min-width: 960px)";

/** A media query's answer, kept current; `fallback` is what the server assumes. */
function useMedia(query: string, fallback: boolean) {
  return useSyncExternalStore(
    (change) => {
      const list = window.matchMedia(query);
      list.addEventListener("change", change);
      return () => list.removeEventListener("change", change);
    },
    () => window.matchMedia(query).matches,
    () => fallback,
  );
}

/**
 * What Zephium stands on, one principle at a time. On a wide screen the list
 * sits beside one stage and moves on by itself while it is in view, a thin
 * line filling under the open one; choosing one stops that. On a phone each
 * principle is followed by its own picture.
 */
export function Principles() {
  const [open, setOpen] = useState(0);
  const [chosen, setChosen] = useState(false);
  const [paused, setPaused] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const seen = useInView(ref, "0px 0px -30% 0px");
  const wide = useMedia(WIDE, true);
  const ids = useId();
  const still = useMedia("(prefers-reduced-motion: reduce)", false);
  const running = wide && seen && !chosen && !still;

  return (
    <div
      ref={ref}
      className={styles.principles}
      data-running={running || undefined}
      data-paused={paused || undefined}
      onPointerEnter={() => setPaused(true)}
      onPointerLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)}
      onBlur={() => setPaused(false)}
    >
      <ol className={styles.list}>
        {PRINCIPLES.map((principle, index) => {
          const isOpen = !wide || index === open;
          return (
            <li key={principle.id} data-open={isOpen || undefined} data-reveal style={{ "--delay": `${index * 0.05}s` } as CSSProperties}>
              <span className={styles.rule} aria-hidden="true">
                {running && index === open ? (
                  <span
                    key={`${open}`}
                    className={styles.progress}
                    onAnimationEnd={() => setOpen((open + 1) % PRINCIPLES.length)}
                  />
                ) : null}
              </span>
              <h3>
                <button
                  type="button"
                  id={`${ids}-${principle.id}`}
                  aria-expanded={isOpen}
                  aria-controls={`${ids}-${principle.id}-body`}
                  disabled={!wide}
                  onClick={() => {
                    setOpen(index);
                    setChosen(true);
                  }}
                >
                  {principle.title}
                </button>
              </h3>
              <div id={`${ids}-${principle.id}-body`} className={styles.body} role="region" aria-labelledby={`${ids}-${principle.id}`}>
                <div>
                  <p>{principle.body}</p>
                </div>
              </div>
              <div className={styles.visual} data-shown={isOpen || undefined} aria-hidden="true">
                {principle.visual(isOpen && seen)}
              </div>
            </li>
          );
        })}
      </ol>
    </div>
  );
}

/* ---------- The pictures. Each is drawn, not a screenshot, and hidden from assistive tech. ---------- */

/** A window's frame: the lights and a title. */
function Frame({ title, children, className }: { title?: string; children: ReactNode; className?: string }) {
  return (
    <div className={`${styles.window} ${className ?? ""}`}>
      <div className={styles.bar}>
        <span className={styles.lights}>
          <i />
          <i />
          <i />
        </span>
        {title ? <span className={styles.title}>{title}</span> : null}
      </div>
      {children}
    </div>
  );
}

const SECTIONS = [
  { name: "General", icon: Settings02Icon },
  { name: "Appearance", icon: PaintBoardIcon },
  { name: "Features", icon: AiMagicIcon },
  { name: "Privacy & security", icon: LockIcon },
  { name: "Account", icon: UserCircleIcon },
];

function SettingsSide({ current }: { current: string }) {
  return (
    <nav className={styles.side}>
      {SECTIONS.map((section) => (
        <span key={section.name} data-current={section.name === current || undefined}>
          <HugeiconsIcon icon={section.icon} size={15} strokeWidth={1.6} />
          {section.name}
        </span>
      ))}
    </nav>
  );
}

function Switch({ on, disabled }: { on: boolean; disabled?: boolean }) {
  return <span className={styles.switch} data-on={on || undefined} data-disabled={disabled || undefined} />;
}

const STAYS = [
  { name: "Blocker", icon: Shield01Icon },
  { name: "Extensions", icon: PuzzleIcon },
  { name: "Notes", icon: Note01Icon },
];

/** Settings › Features. When it comes up, AI goes off, Work with it, and back on. */
function Features({ active }: { active: boolean }) {
  const [ai, setAi] = useState(true);
  useEffect(() => {
    if (!active || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const off = window.setTimeout(() => setAi(false), 1300);
    const on = window.setTimeout(() => setAi(true), 4600);
    return () => {
      window.clearTimeout(off);
      window.clearTimeout(on);
      setAi(true);
    };
  }, [active]);
  return (
    <Frame title="Settings" className={styles.settings}>
      <div className={styles.split}>
        <SettingsSide current="Features" />
        <div className={styles.pane}>
          <b className={styles.paneTitle}>Features</b>
          <div className={styles.group}>
            <div className={styles.row}>
              <HugeiconsIcon icon={AiMagicIcon} size={16} strokeWidth={1.6} />
              <span>
                <b>AI</b>
                <small>Models, agents and dictation</small>
              </span>
              <Switch on={ai} />
            </div>
            <div className={styles.row} data-dim={!ai || undefined}>
              <HugeiconsIcon icon={Briefcase01Icon} size={16} strokeWidth={1.6} />
              <span>
                <b>Work</b>
                <small>{ai ? "The canvas where agents work" : "Needs AI"}</small>
              </span>
              <Switch on={ai} disabled={!ai} />
            </div>
          </div>
          <p className={styles.stays}>
            <span>{ai ? "Always here" : "Still all here"}</span>
            {STAYS.map((item) => (
              <span key={item.name} className={styles.chip}>
                <HugeiconsIcon icon={item.icon} size={13} strokeWidth={1.7} />
                {item.name}
              </span>
            ))}
          </p>
          <small className={styles.foot} data-on={!ai || undefined}>
            Your keys and conversations are kept. Nothing is deleted.
          </small>
        </div>
      </div>
    </Frame>
  );
}

const REQUESTS = [
  { kind: "document", host: "theverge.com", size: "142 KB" },
  { kind: "style", host: "theverge.com", size: "38 KB" },
  { kind: "image", host: "cdn.vox-cdn.com", size: "212 KB" },
  { kind: "font", host: "cdn.vox-cdn.com", size: "64 KB" },
  { kind: "tracker", host: "securepubads.g.doubleclick.net", blocked: true },
  { kind: "script", host: "theverge.com", size: "91 KB" },
  { kind: "tracker", host: "static.hotjar.com", blocked: true },
  { kind: "image", host: "cdn.vox-cdn.com", size: "88 KB" },
];

/** Every connection while a page loads: the site's own, the blocked, and none to Zephium. */
function Network({ active }: { active: boolean }) {
  return (
    <Frame title="theverge.com" className={styles.network}>
      <div className={styles.requests} data-play={active || undefined}>
        {REQUESTS.map((request, index) => (
          <div key={index} className={styles.request} data-blocked={request.blocked || undefined} style={{ "--i": index } as CSSProperties}>
            <span>{request.kind}</span>
            <span>{request.host}</span>
            <span>{request.blocked ? "Blocked" : request.size}</span>
          </div>
        ))}
      </div>
      <div className={styles.zero}>
        <ZephiumLogo size={22} />
        <span>
          <b>To Zephium</b>
          <small>No telemetry, no analytics, nothing about this page</small>
        </span>
        <b className={styles.count}>0</b>
      </div>
    </Frame>
  );
}

type Model = { name: string; note: string; mark?: string; path?: string };

const MODELS: { group: string; rows: Model[] }[] = [
  { group: "Zephium AI", rows: [{ name: "Zephium AI", note: "Passes through, never stored", mark: "/brand/zephium-mark-64.png" }] },
  {
    group: "Your keys",
    rows: [
      { name: "OpenAI", note: "Straight to OpenAI", mark: "/marks/chatgpt-dark.svg" },
      { name: "Anthropic", note: "Straight to Anthropic", path: siAnthropic.path },
      { name: "Gemini", note: "Straight to Google", path: siGooglegemini.path },
    ],
  },
  {
    group: "On this computer",
    rows: [
      { name: "Ollama", note: "Never leaves it", path: siOllama.path },
      { name: "LM Studio", note: "Never leaves it", path: siLmstudio.path },
    ],
  },
];

/** Every row, numbered in menu order, so the picked one can be named by its place. */
const NUMBERED = MODELS.map((group, at) => ({
  ...group,
  rows: group.rows.map((row, index) => ({
    ...row,
    index: MODELS.slice(0, at).reduce((count, earlier) => count + earlier.rows.length, 0) + index,
  })),
}));

/** The model menu, as Ask and Work open it, with where each choice sends a prompt. */
function Models({ active }: { active: boolean }) {
  const [pick, setPick] = useState(1);
  useEffect(() => {
    if (!active || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const order = [1, 4, 0, 2];
    let step = 0;
    const timer = window.setInterval(() => setPick(order[++step % order.length] ?? 1), 1500);
    return () => window.clearInterval(timer);
  }, [active]);
  return (
    <div className={styles.models}>
      <div className={styles.menu}>
        {NUMBERED.map((group) => (
          <div key={group.group} className={styles.menuGroup}>
            <small>{group.group}</small>
            {group.rows.map((row) => {
              return (
                <div key={row.name} className={styles.option} data-picked={row.index === pick || undefined}>
                  <span className={styles.logo}>
                    {row.path ? (
                      <svg viewBox="0 0 24 24">
                        <path d={row.path} />
                      </svg>
                    ) : (
                      // eslint-disable-next-line @next/next/no-img-element -- a small static mark
                      <img src={row.mark} alt="" width={16} height={16} />
                    )}
                  </span>
                  <b>{row.name}</b>
                  <small>{row.note}</small>
                  <HugeiconsIcon icon={Tick02Icon} size={14} strokeWidth={2} className={styles.tick} />
                </div>
              );
            })}
          </div>
        ))}
      </div>
      <div className={styles.composer}>
        <span>Ask about this page</span>
        <span className={styles.chipModel}>
          {MODELS.flatMap((group) => group.rows)[pick]?.name}
          <HugeiconsIcon icon={ArrowDown01Icon} size={12} strokeWidth={2} />
        </span>
      </div>
    </div>
  );
}

/** Settings › Account, signed out, with everything still working. */
function Account() {
  return (
    <Frame title="Settings" className={styles.settings}>
      <div className={styles.split}>
        <SettingsSide current="Account" />
        <div className={styles.pane}>
          <b className={styles.paneTitle}>Account</b>
          <div className={styles.who}>
            <span className={styles.avatar}>
              <HugeiconsIcon icon={UserCircleIcon} size={22} strokeWidth={1.4} />
            </span>
            <span>
              <b>Not signed in</b>
              <small>Everything on this computer works as it is.</small>
            </span>
          </div>
          <div className={styles.group}>
            <div className={styles.row}>
              <span>
                <b>Browsing</b>
                <small>No account needed, ever</small>
              </span>
              <HugeiconsIcon icon={Tick02Icon} size={16} strokeWidth={2} className={styles.ok} />
            </div>
            <div className={styles.row}>
              <span>
                <b>Zephium AI</b>
                <small>Sign in with an email code</small>
              </span>
              <span className={styles.button}>Sign in</span>
            </div>
            <div className={styles.row}>
              <span>
                <b>Sync across devices</b>
                <small>Free, with your account</small>
              </span>
              <span className={styles.soon}>Soon</span>
            </div>
          </div>
        </div>
      </div>
    </Frame>
  );
}

/** The first lines of the blocker's crate, as they are in the repository. */
const LINES: { text: string; kind?: "comment" | "attr" | "key" }[] = [
  { text: "//! Bounded, deterministic compilation of untrusted adblock lists.", kind: "comment" },
  { text: "//!", kind: "comment" },
  { text: "//! This crate deliberately owns no network updater and exposes no adblock", kind: "comment" },
  { text: "//! resources. In particular, scriptlets and redirect resources are rejected", kind: "comment" },
  { text: "//! before either native artifact is built.", kind: "comment" },
  { text: "" },
  { text: "#![deny(unsafe_code)]", kind: "attr" },
  { text: "#![deny(missing_docs)]", kind: "attr" },
  { text: "" },
  { text: "use sha2::{Digest, Sha256};", kind: "key" },
  { text: "" },
  { text: "mod cache;", kind: "key" },
  { text: "mod compiler;", kind: "key" },
  { text: "mod cosmetics;", kind: "key" },
];

function Code() {
  return (
    <Frame title="crates/zephium-blocker/src/lib.rs" className={styles.code}>
      <pre>
        {LINES.map((line, index) => (
          <span key={index} className={styles.line} data-kind={line.kind}>
            <i>{index + 1}</i>
            {line.kind === "key" ? <Keyword text={line.text} /> : line.text}
          </span>
        ))}
      </pre>
      <div className={styles.license}>
        <span>Rust</span>
        <span>MPL-2.0</span>
        <span>github.com/zephium-browser/Zephium</span>
      </div>
    </Frame>
  );
}

function Keyword({ text }: { text: string }) {
  const [word, ...rest] = text.split(" ");
  return (
    <>
      <em>{word}</em> {rest.join(" ")}
    </>
  );
}
