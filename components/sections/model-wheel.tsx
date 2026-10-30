"use client";

import {
  useEffect,
  useRef,
  useState,
  useSyncExternalStore,
  type CSSProperties,
  type KeyboardEvent,
  type PointerEvent,
  type ReactNode,
} from "react";
import styles from "./model-wheel.module.css";

type Choice = { name: string; detail: ReactNode };

const key = (company: string) => (
  <>
    <strong>Your own key.</strong> Kept in your system keychain and sent only to {company}.
  </>
);

const local = (
  <>
    <strong>On your computer.</strong> The model runs here, so your prompts never leave it.
  </>
);

/** Every way Zephium can think, in the order Settings lists them, and the way it can't. */
const CHOICES: Choice[] = [
  {
    name: "Zephium AI",
    detail: (
      <>
        <strong>Ours, if you like.</strong> No keys to manage, and nothing you send is kept.
      </>
    ),
  },
  { name: "Claude", detail: key("Anthropic") },
  { name: "GPT", detail: key("OpenAI") },
  { name: "Gemini", detail: key("Google") },
  { name: "Grok", detail: key("xAI") },
  { name: "Mistral", detail: key("Mistral") },
  { name: "DeepSeek", detail: key("DeepSeek") },
  { name: "OpenRouter", detail: key("OpenRouter") },
  { name: "Ollama", detail: local },
  { name: "LM Studio", detail: local },
  {
    name: "Off",
    detail: (
      <>
        <strong>Off.</strong> No model runs, your keys stay saved, and everything else is right where
        it was.
      </>
    ),
  },
];

const COUNT = CHOICES.length;
const OFF = COUNT - 1;

/** Where the wheel stops while it turns by itself, and how long it rests there. */
const STOPS = [0, 1, 3, 8, OFF];
const rest = (name: number) => (name === OFF ? 4200 : name === 0 ? 2600 : 1700);

/** A longer turn takes a little longer, the way a real wheel coasts. */
const spinFor = (distance: number) => Math.min(1500, 420 + Math.abs(distance) * 90);

/** The names go round three times, so the wheel can roll on past Off and settle back into the middle lap. */
const LAPS = [0, 1, 2];
const nameAt = (at: number) => ((Math.round(at) % COUNT) + COUNT) % COUNT;

/** How far a flick carries on after the pointer lets go, in milliseconds of its last speed. */
const COAST = 260;

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

type Drag = { id: number; y: number; from: number; moved: boolean; trail: { t: number; y: number }[] };

/**
 * The model picker as a wheel of names that goes all the way round, Off
 * leading back to Zephium AI. While it is on screen it rolls by itself and
 * rests on a few of them. It can be dragged and flicked like the system's
 * own, clicked, turned with the arrow keys, or, once it has been touched,
 * scrolled. Resting on Off, the other names fade away and Off stands alone.
 */
export function ModelWheel() {
  const [at, setAt] = useState(COUNT);
  const [spin, setSpin] = useState(0);
  const [taken, setTaken] = useState(false);
  const [held, setHeld] = useState(false);
  const [dragging, setDragging] = useState(false);
  const [visible, setVisible] = useState(false);
  const still = useReducedMotion();
  const root = useRef<HTMLDivElement>(null);
  const wheel = useRef<HTMLDivElement>(null);
  const items = useRef<(HTMLButtonElement | null)[]>([]);
  const drag = useRef<Drag | null>(null);
  const swallowClick = useRef(false);
  const engaged = useRef(false);
  const atRef = useRef(at);
  const name = nameAt(at);
  const playing = visible && !taken && !held && !still;
  const off = name === OFF && !dragging;

  useEffect(() => {
    atRef.current = at;
  }, [at]);

  useEffect(() => {
    const element = root.current;
    if (!element) return;
    const watch = new IntersectionObserver(([entry]) => setVisible(Boolean(entry?.isIntersecting)), {
      rootMargin: "0px 0px -20% 0px",
    });
    watch.observe(element);
    return () => watch.disconnect();
  }, []);

  // Once a turn has carried it out of the middle lap, step back into it unseen.
  useEffect(() => {
    if (dragging || (at >= COUNT && at < COUNT * 2)) return;
    const timer = window.setTimeout(() => {
      setSpin(0);
      setAt(COUNT + nameAt(at));
    }, spin + 40);
    return () => window.clearTimeout(timer);
  }, [at, spin, dragging]);

  useEffect(() => {
    if (!playing) return;
    const next = STOPS[(STOPS.indexOf(name) + 1) % STOPS.length] ?? 0;
    const ahead = (next - name + COUNT) % COUNT || COUNT;
    const timer = window.setTimeout(() => {
      setSpin(spinFor(ahead));
      setAt((value) => value + ahead);
    }, spin + rest(name));
    return () => window.clearTimeout(timer);
  }, [playing, name, spin]);

  // Scrolling turns the wheel only once it has been touched and while the pointer is on it, so the page never gets stuck.
  useEffect(() => {
    const element = wheel.current;
    if (!element) return;
    let settle = 0;
    const onWheel = (event: WheelEvent) => {
      if (!engaged.current) return;
      event.preventDefault();
      const delta = event.deltaMode === 1 ? event.deltaY * 16 : event.deltaY;
      const next = atRef.current + delta / (rowHeight() * 1.4);
      atRef.current = next;
      setSpin(0);
      setAt(next);
      window.clearTimeout(settle);
      settle = window.setTimeout(() => {
        setSpin(320);
        setAt(Math.round(atRef.current));
      }, 120);
    };
    element.addEventListener("wheel", onWheel, { passive: false });
    return () => {
      window.clearTimeout(settle);
      element.removeEventListener("wheel", onWheel);
    };
  }, []);

  function rowHeight() {
    return parseFloat(getComputedStyle(root.current ?? document.body).getPropertyValue("--row")) || 64;
  }

  /** Where the drum is right now, partway through a turn included. */
  function liveAt() {
    const value = wheel.current ? parseFloat(getComputedStyle(wheel.current).getPropertyValue("--at")) : NaN;
    return Number.isFinite(value) ? value : atRef.current;
  }

  function choose(next: number, focus = false) {
    setTaken(true);
    setSpin(spinFor(next - at));
    setAt(next);
    if (focus) items.current[COUNT + nameAt(next)]?.focus({ preventScroll: true });
  }

  function onPointerDown(event: PointerEvent<HTMLDivElement>) {
    if (event.button !== 0) return;
    engaged.current = true;
    drag.current = { id: event.pointerId, y: event.clientY, from: 0, moved: false, trail: [] };
  }

  function onPointerMove(event: PointerEvent<HTMLDivElement>) {
    const current = drag.current;
    if (!current || current.id !== event.pointerId) return;
    if (!current.moved) {
      if (Math.abs(event.clientY - current.y) < 5) return;
      current.moved = true;
      current.y = event.clientY;
      current.from = liveAt();
      event.currentTarget.setPointerCapture(event.pointerId);
      setTaken(true);
      setDragging(true);
      setSpin(0);
    }
    current.trail = [...current.trail.filter((point) => event.timeStamp - point.t < 100), { t: event.timeStamp, y: event.clientY }];
    const next = current.from - (event.clientY - current.y) / rowHeight();
    atRef.current = next;
    setAt(next);
  }

  function onPointerUp(event: PointerEvent<HTMLDivElement>) {
    const current = drag.current;
    if (!current || current.id !== event.pointerId) return;
    drag.current = null;
    if (!current.moved) return;
    swallowClick.current = true;
    const first = current.trail[0];
    const last = current.trail[current.trail.length - 1];
    const speed = first && last && last.t > first.t ? (last.y - first.y) / (last.t - first.t) : 0;
    const target = Math.round(atRef.current - (speed * COAST) / rowHeight());
    setDragging(false);
    setSpin(spinFor(target - atRef.current));
    setAt(target);
  }

  function onKeyDown(event: KeyboardEvent) {
    const moves: Record<string, number> = {
      ArrowDown: at + 1,
      ArrowRight: at + 1,
      ArrowUp: at - 1,
      ArrowLeft: at - 1,
      Home: at - name,
      End: at - name + OFF,
    };
    const next = moves[event.key];
    if (next === undefined) return;
    event.preventDefault();
    choose(next, true);
  }

  const choice = CHOICES[name] ?? CHOICES[0]!;

  return (
    <div ref={root} className={styles.root} data-off={off || undefined}>
      <div
        ref={wheel}
        className={styles.wheel}
        data-dragging={dragging || undefined}
        style={{ "--at": at, "--spin": `${still ? 0 : spin}ms` } as CSSProperties}
        onPointerEnter={(event) => event.pointerType === "mouse" && setHeld(true)}
        onPointerLeave={() => {
          setHeld(false);
          engaged.current = false;
        }}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={onPointerUp}
        onClickCapture={(event) => {
          if (!swallowClick.current) return;
          swallowClick.current = false;
          event.stopPropagation();
        }}
      >
        <span className={styles.band} aria-hidden="true" />
        <div className={styles.drum} role="radiogroup" aria-label="AI" onKeyDown={onKeyDown}>
          {LAPS.flatMap((lap) =>
            CHOICES.map((item, i) => {
              const index = lap * COUNT + i;
              // The middle lap is the real control; the laps either side are only the rest of the wheel.
              const real = lap === 1;
              return (
                <button
                  key={index}
                  ref={(element) => {
                    items.current[index] = element;
                  }}
                  type="button"
                  role={real ? "radio" : undefined}
                  aria-checked={real ? i === name : undefined}
                  aria-hidden={real ? undefined : true}
                  tabIndex={real && i === name ? 0 : -1}
                  className={styles.item}
                  style={{ "--i": index } as CSSProperties}
                  onClick={() => choose(index)}
                >
                  {item.name}
                </button>
              );
            }),
          )}
        </div>
      </div>

      <p key={name} className={styles.detail} aria-live={taken ? "polite" : "off"}>
        {choice.detail}
      </p>
    </div>
  );
}
