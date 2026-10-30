"use client";

import {
  useEffect,
  useRef,
  useState,
  useSyncExternalStore,
  type CSSProperties,
  type KeyboardEvent,
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
        <strong>Off.</strong> No model runs, your keys stay saved, and the browser is all here.
      </>
    ),
  },
];

const COUNT = CHOICES.length;
const OFF = COUNT - 1;

/** Where the wheel stops while it turns by itself, and how long it rests there. */
const STOPS = [0, 1, 3, 8, OFF];
const rest = (name: number) => (name === OFF ? 3600 : name === 0 ? 2600 : 1700);

/** A longer turn takes a little longer, the way a real wheel coasts. */
const spinFor = (distance: number) => Math.min(1500, 420 + Math.abs(distance) * 90);

/** The names go round three times, so the wheel can roll on past Off and settle back into the middle lap. */
const LAPS = [0, 1, 2];
const nameAt = (at: number) => ((at % COUNT) + COUNT) % COUNT;

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

/**
 * The model picker as a wheel of names that goes all the way round, Off
 * leading back to Zephium AI. While it is on screen it rolls by itself and
 * rests on a few of them; pointing at it holds it, and choosing a name, by
 * click or with the arrow keys, takes it over.
 */
export function ModelWheel() {
  const [at, setAt] = useState(COUNT);
  const [spin, setSpin] = useState(0);
  const [taken, setTaken] = useState(false);
  const [held, setHeld] = useState(false);
  const [visible, setVisible] = useState(false);
  const still = useReducedMotion();
  const root = useRef<HTMLDivElement>(null);
  const items = useRef<(HTMLButtonElement | null)[]>([]);
  const name = nameAt(at);
  const playing = visible && !taken && !held && !still;

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
    if (at >= COUNT && at < COUNT * 2) return;
    const timer = window.setTimeout(() => {
      setSpin(0);
      setAt(COUNT + nameAt(at));
    }, spin + 40);
    return () => window.clearTimeout(timer);
  }, [at, spin]);

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

  function choose(next: number, focus = false) {
    setTaken(true);
    setSpin(spinFor(next - at));
    setAt(next);
    if (focus) items.current[COUNT + nameAt(next)]?.focus({ preventScroll: true });
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
    <div ref={root} className={styles.root}>
      <div
        className={styles.wheel}
        style={{ "--at": at, "--spin": `${still ? 0 : spin}ms` } as CSSProperties}
        onPointerEnter={(event) => event.pointerType === "mouse" && setHeld(true)}
        onPointerLeave={() => setHeld(false)}
      >
        <span className={styles.band} aria-hidden="true" />
        <div className={styles.drum} role="radiogroup" aria-label="Model" onKeyDown={onKeyDown}>
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
