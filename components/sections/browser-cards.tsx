"use client";

import {
  Calendar03Icon,
  Link01Icon,
  MoreHorizontalIcon,
  PinIcon,
  Shield01Icon,
  Target02Icon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { useEffect, useRef, useState, type CSSProperties, type RefObject } from "react";
import { si1password, siBitwarden, siDarkreader, siGrammarly, siNotion } from "simple-icons";
import { Mark, type MarkId } from "@/components/browser/marks";
import { useInView } from "@/components/motion/use-in-view";
import styles from "./browser-cards.module.css";

const still = () => window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/** Seen far enough into the screen that what plays is noticed. */
const WELL_IN = "0px 0px -30% 0px";

/** Whether an element is on screen right now (unlike useInView, it turns back off). */
function useOnScreen(ref: RefObject<Element | null>) {
  const [on, setOn] = useState(false);
  useEffect(() => {
    const element = ref.current;
    if (!element) return;
    const watch = new IntersectionObserver(([entry]) => setOn(Boolean(entry?.isIntersecting)));
    watch.observe(element);
    return () => watch.disconnect();
  }, [ref]);
  return on;
}

const TRACKERS = [
  "securepubads.g.doubleclick.net",
  "www.googletagmanager.com",
  "connect.facebook.net",
  "static.hotjar.com",
  "cdn.taboola.com",
  "pixel.quantserve.com",
  "sb.scorecardresearch.com",
  "ads.pubmatic.com",
  "c.amazon-adsystem.com",
  "bat.bing.com",
  "cdn.segment.com",
  "widgets.outbrain.com",
  "analytics.tiktok.com",
  "js.adsrvr.org",
];

/**
 * The shield over a news site. The count climbs as the page loads, then
 * keeps ticking while the page is in view, because pages keep asking. The
 * switch is real: turn it off and the requests go through.
 */
export function Blocker() {
  const ref = useRef<HTMLDivElement>(null);
  const seen = useInView(ref, WELL_IN);
  const onScreen = useOnScreen(ref);
  const [on, setOn] = useState(true);
  const [count, setCount] = useState(0);
  const counted = useRef(0);

  // The first rush: up to 38 as the page loads.
  useEffect(() => {
    if (!seen) return;
    let frame = 0;
    const start = performance.now();
    const climb = (now: number) => {
      const t = still() ? 1 : Math.min(1, (now - start) / 1500);
      const value = Math.round(38 * (1 - Math.pow(1 - t, 4)));
      counted.current = value;
      setCount(value);
      if (t < 1) frame = requestAnimationFrame(climb);
    };
    frame = requestAnimationFrame(climb);
    return () => cancelAnimationFrame(frame);
  }, [seen]);

  // Then one at a time, while it is on screen and switched on.
  useEffect(() => {
    if (!seen || !onScreen || !on || still()) return;
    let timer = 0;
    const next = () => {
      timer = window.setTimeout(() => {
        if (counted.current >= 38) {
          counted.current += 1;
          setCount(counted.current);
        }
        next();
      }, 1400 + Math.random() * 2200);
    };
    next();
    return () => window.clearTimeout(timer);
  }, [seen, onScreen, on]);

  // The newest requests turned away, latest first.
  const latest = Array.from({ length: 5 }, (_, index) => {
    const at = Math.max(0, count - 38) + 4 - index;
    return { host: TRACKERS[at % TRACKERS.length], key: at };
  });

  return (
    <div ref={ref} className={`${styles.panel} ${styles.blocker}`} data-seen={seen || undefined} data-off={!on || undefined}>
      <div className={styles.shieldHead}>
        <span className={styles.shieldIcon}>
          <HugeiconsIcon icon={Shield01Icon} size={16} strokeWidth={1.8} aria-hidden />
        </span>
        <span className={styles.site}>
          <b>theverge.com</b>
          <small>{on ? "Blocking ads and trackers" : "Paused on this site"}</small>
        </span>
        <button
          type="button"
          role="switch"
          aria-checked={on}
          aria-label="Block ads and trackers on this site"
          className={styles.switch}
          data-on={on || undefined}
          onClick={() => setOn((value) => !value)}
        />
      </div>
      <div className={styles.count}>
        <b>{count}</b>
        <span>blocked on this page</span>
      </div>
      <ul className={styles.hosts} aria-hidden="true">
        {latest.map((item, index) => (
          <li key={item.key} style={{ "--n": index } as CSSProperties}>
            <span>{item.host}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

type Extension = { name: string; tile: string; icon: { path: string } | string; fill?: string };

const EXTENSIONS: Extension[] = [
  { name: "1Password", tile: `#${si1password.hex}`, icon: si1password },
  { name: "Bitwarden", tile: `#${siBitwarden.hex}`, icon: siBitwarden },
  { name: "Grammarly", tile: `#${siGrammarly.hex}`, icon: siGrammarly },
  { name: "Dark Reader", tile: "#1d2a33", icon: siDarkreader },
  { name: "SponsorBlock", tile: "#ffffff", icon: "/extensions/sponsorblock.webp" },
  { name: "Notion Web Clipper", tile: "#ffffff", icon: siNotion, fill: "#000000" },
];

/** The extensions shelf. Each one switches on in turn, then they are yours to flip. */
export function Extensions() {
  const ref = useRef<HTMLUListElement>(null);
  const seen = useInView(ref, WELL_IN);
  const [on, setOn] = useState<boolean[]>(() => EXTENSIONS.map(() => false));

  useEffect(() => {
    if (!seen) return;
    const timers = EXTENSIONS.map((_, index) =>
      window.setTimeout(
        () => setOn((list) => list.map((value, n) => (n === index ? true : value))),
        still() ? 0 : 500 + index * 220,
      ),
    );
    return () => timers.forEach((timer) => window.clearTimeout(timer));
  }, [seen]);

  return (
    <ul ref={ref} className={`${styles.panel} ${styles.extensions}`}>
      {EXTENSIONS.map((extension, index) => (
        <li key={extension.name}>
          <span className={styles.extIcon} style={{ background: extension.tile }}>
            {typeof extension.icon === "string" ? (
              // eslint-disable-next-line @next/next/no-img-element -- a 96px icon needs no optimiser.
              <img src={extension.icon} alt="" width={96} height={96} />
            ) : (
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <path d={extension.icon.path} fill={extension.fill ?? "#fff"} />
              </svg>
            )}
          </span>
          <span className={styles.extName}>{extension.name}</span>
          <button
            type="button"
            role="switch"
            aria-checked={on[index]}
            aria-label={extension.name}
            className={styles.switch}
            data-on={on[index] || undefined}
            onClick={() => setOn((list) => list.map((value, n) => (n === index ? !value : value)))}
          />
        </li>
      ))}
    </ul>
  );
}

type Task = { id: string; title: string; done: boolean; due?: string; meta?: { text: string; link?: boolean } };

const TASKS: Task[] = [
  { id: "film", title: "Record the launch film", done: true },
  { id: "review", title: "Reply to the design review", done: false, meta: { text: "2:30 PM" } },
  { id: "flights", title: "Book flights to San Francisco", done: false, meta: { text: "flightfinder.com", link: true } },
];

const WRITTEN = "Ship the beta Friday 10am";

/**
 * Tasks, written the way you would say them. One is typed, its date is
 * understood, and it joins the list; every task can be checked off.
 */
export function Tasks() {
  const ref = useRef<HTMLDivElement>(null);
  const seen = useInView(ref, WELL_IN);
  const [phase, setPhase] = useState<"idle" | "typing" | "parsed" | "added">("idle");
  const [tasks, setTasks] = useState(TASKS);

  useEffect(() => {
    if (!seen) return;
    const add = () => {
      setPhase("added");
      setTasks((list) => [{ id: "beta", title: "Ship the beta", done: false, due: "Fri, 10:00" }, ...list]);
    };
    const timers = still()
      ? [window.setTimeout(add, 0)]
      : [
          window.setTimeout(() => setPhase("typing"), 400),
          window.setTimeout(() => setPhase("parsed"), 2300),
          window.setTimeout(add, 3600),
        ];
    return () => timers.forEach((timer) => window.clearTimeout(timer));
  }, [seen]);

  const open = tasks.filter((task) => !task.done).length;

  return (
    <div ref={ref} className={`${styles.panel} ${styles.tasks}`} data-phase={phase}>
      <header>
        <b>Today</b>
        <small>{open === 1 ? "1 open" : `${open} open`}</small>
      </header>
      <div className={styles.compose}>
        {phase === "typing" || phase === "parsed" ? (
          <span className={styles.typing}>{WRITTEN}</span>
        ) : (
          <span className={styles.placeholder}>Add a task</span>
        )}
        <span className={styles.parsed} data-on={phase === "parsed" || undefined}>
          <HugeiconsIcon icon={Calendar03Icon} size={12} strokeWidth={1.8} aria-hidden />
          Fri, 10:00
        </span>
      </div>
      <ul>
        {tasks.map((task) => (
          <li key={task.id} data-done={task.done || undefined} data-new={task.id === "beta" || undefined}>
            <button
              type="button"
              role="checkbox"
              aria-checked={task.done}
              aria-label={task.title}
              onClick={() =>
                setTasks((list) => list.map((entry) => (entry.id === task.id ? { ...entry, done: !entry.done } : entry)))
              }
            >
              <i />
            </button>
            <span>
              {task.title}
              {task.due ? (
                <small>
                  <HugeiconsIcon icon={Calendar03Icon} size={11} strokeWidth={1.8} aria-hidden />
                  {task.due}
                </small>
              ) : task.meta ? (
                <small>
                  {task.meta.link ? <HugeiconsIcon icon={Link01Icon} size={11} strokeWidth={1.8} aria-hidden /> : null}
                  {task.meta.text}
                </small>
              ) : null}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}

/** A note beside the page, written while reading the React docs. */
export function Notes() {
  return (
    <div className={`${styles.panel} ${styles.notes}`}>
      <header>
        <b>React notes</b>
        <span className={styles.noteTools} aria-hidden="true">
          <HugeiconsIcon icon={PinIcon} size={14} strokeWidth={1.7} />
          <HugeiconsIcon icon={MoreHorizontalIcon} size={14} strokeWidth={1.7} />
        </span>
      </header>
      <p>Actions run async work in a transition and keep track of pending and errors for you.</p>
      <pre aria-label="TypeScript code">
        <code>
          <span className={styles.kw}>const</span>
          {" [error, save, pending] =\n  "}
          <span className={styles.fn}>useActionState</span>
          {"(update, "}
          <span className={styles.kw}>null</span>
          {");\n\n<"}
          <span className={styles.ty}>form</span>
          {" action={save}>"}
        </code>
      </pre>
      <ul>
        <li>
          <code>use()</code> reads a promise while rendering
        </li>
        <li>
          <code>ref</code> is a plain prop now
        </li>
      </ul>
    </div>
  );
}

const DAYS = {
  today: {
    total: "4h 52m",
    bars: [0.1, 0.45, 0.8, 0.95, 0.7, 0.3, 0.55, 0.9, 1, 0.75, 0.45, 0.2],
    focus: [7, 9],
    sites: [
      { mark: "linear" as MarkId, name: "linear.app", time: "1h 24m", share: 1 },
      { mark: "github" as MarkId, name: "github.com", time: "58m", share: 0.69 },
      { mark: "notion" as MarkId, name: "notion.so", time: "41m", share: 0.49 },
    ],
  },
  week: {
    total: "27h 10m",
    bars: [0.7, 0.85, 0.6, 1, 0.75, 0.25, 0.15],
    focus: [3, 3],
    sites: [
      { mark: "github" as MarkId, name: "github.com", time: "7h 05m", share: 1 },
      { mark: "linear" as MarkId, name: "linear.app", time: "5h 40m", share: 0.8 },
      { mark: "notion" as MarkId, name: "notion.so", time: "3h 12m", share: 0.45 },
    ],
  },
};

/** Where the day went, or the week, and the focus that is keeping it on track. */
export function TimeAndFocus() {
  const ref = useRef<HTMLDivElement>(null);
  const seen = useInView(ref, WELL_IN);
  const [range, setRange] = useState<keyof typeof DAYS>("today");
  const data = DAYS[range];
  return (
    <div ref={ref} className={`${styles.panel} ${styles.activity}`} data-seen={seen || undefined}>
      <header>
        <b>Time &amp; Focus</b>
        <span className={styles.range} role="group" aria-label="Range">
          {(["today", "week"] as const).map((key) => (
            <button key={key} type="button" aria-pressed={range === key} onClick={() => setRange(key)}>
              {key === "today" ? "Today" : "Week"}
            </button>
          ))}
        </span>
      </header>
      <div className={styles.total}>
        <b>{data.total}</b>
        <span>on the web</span>
      </div>
      <div className={styles.hours} aria-hidden="true">
        {data.bars.map((value, index) => (
          <i
            key={`${range}-${index}`}
            style={{ "--h": value, "--n": index } as CSSProperties}
            data-focus={(index >= data.focus[0] && index <= data.focus[1]) || undefined}
          />
        ))}
      </div>
      <div className={styles.focus}>
        <HugeiconsIcon icon={Target02Icon} size={14} strokeWidth={1.8} aria-hidden />
        <span>
          Focus <small>38 min left · distractions blocked</small>
        </span>
      </div>
      <ul className={styles.sites}>
        {data.sites.map((site) => (
          <li key={site.name}>
            <Mark id={site.mark} size="16px" />
            <span>
              <span>
                <b>{site.name}</b>
                <small>{site.time}</small>
              </span>
              <i style={{ "--w": site.share } as CSSProperties} />
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}
