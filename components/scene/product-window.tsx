"use client";

import {
  Add01Icon,
  ArrowDown01Icon,
  ArrowLeft01Icon,
  ArrowRight01Icon,
  ArrowUp02Icon,
  Briefcase02Icon,
  CheckListIcon,
  Globe02Icon,
  HandIcon,
  Layers01Icon,
  Mic01Icon,
  PlusSignIcon,
  ReloadIcon,
  Search01Icon,
  Settings05Icon,
  ShapeCollectionIcon,
  SidebarLeftIcon,
  UserIcon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon, type IconSvgElement } from "@hugeicons/react";
import dynamic from "next/dynamic";
import { useEffect, useRef, useState, type CSSProperties, type ReactNode } from "react";
import { Mark, type MarkId } from "@/components/browser/marks";
import { Island, type IslandPart, type IslandState } from "@/components/island/island";
import { Canvas } from "@/components/work/canvas";
import { trip } from "@/lib/demo-trip";
import { PAGE, PAGE_COMPACT, type Flags, type IslandLine } from "./film";
import { NewTab } from "./new-tab";
import { ProfileStack } from "./profile-stack";
import styles from "./product-window.module.css";

/*
 * The other sites are drawn on demand: the new tab is what the window opens
 * on, so their pages (and their pictures) load once the page is idle, or at
 * once if a tab is chosen first.
 */
const loadStudio = () => import("./studio-page");
const loadPages = () => import("./tab-pages");
const StudioPage = dynamic(() => loadStudio().then((m) => m.StudioPage));
const LinearPage = dynamic(() => loadPages().then((m) => m.LinearPage));
const NotionPage = dynamic(() => loadPages().then((m) => m.NotionPage));
const GitHubPage = dynamic(() => loadPages().then((m) => m.GitHubPage));
const StaybookPage = dynamic(() => loadPages().then((m) => m.StaybookPage));
const FlightFinderPage = dynamic(() => loadPages().then((m) => m.FlightFinderPage));

/** What the island says for each line of the film. */
const LINE: Record<IslandLine, { state: IslandState; text: string; action?: string }> = {
  thinking: { state: "thinking", text: "Thinking" },
  asking: { state: "waiting", text: "Two questions before I start" },
  searching: { state: "searching", text: "Two helpers on stays and flights" },
  comparing: { state: "comparing", text: "Comparing 3 stays and 4 flights" },
  writing: { state: "working", text: "Writing the plan" },
  done: { state: "done", text: "The plan is ready, with five tasks", action: "Next" },
};

/** The request, word by word, as the composer types it. */
const WORDS = trip.request.split(" ");

const PARTS: IslandPart[] = [
  { title: "Stays", now: `Reading ${trip.stays.site}`, helper: "browser" },
  { title: "Flights", now: `Comparing fares on ${trip.flights.site}`, helper: "browser" },
];

type Tab = { id: string; mark: MarkId | null; title: string; host: string; page: () => ReactNode };

const NEW_TAB = "newtab";

/** Other people's sites, open in Zephium, each titled the way its own tab would be; then a new tab. */
const TABS: Tab[] = [
  { id: "studio", mark: "elevenlabs", title: "Starship: The Launch · ElevenLabs", host: "elevenlabs.io", page: () => <StudioPage /> },
  { id: "linear", mark: "linear", title: "Active issues · Linear", host: "linear.app", page: () => <LinearPage /> },
  { id: "notion", mark: "notion", title: "Shot list | Notion", host: "notion.so", page: () => <NotionPage /> },
  { id: "github", mark: "github", title: "zephium-browser/Zephium · GitHub", host: "github.com", page: () => <GitHubPage /> },
  { id: "stays", mark: "staybook", title: "Stays in SoMa · Staybook", host: trip.stays.site, page: () => <StaybookPage /> },
  { id: "flights", mark: "flightfinder", title: "London to San Francisco · FlightFinder", host: trip.flights.site, page: () => <FlightFinderPage /> },
  { id: NEW_TAB, mark: null, title: "New Tab", host: "", page: () => <NewTab /> },
];

/** The kept sites at the foot of the column. */
const DOCK: MarkId[] = ["slack", "github", "linear"];

/** The composer's tools (bar/WorkBar.svelte), a rule after the first. */
const TOOLS: { icon: IconSvgElement; label: string }[] = [
  { icon: HandIcon, label: "Hand" },
  { icon: ShapeCollectionIcon, label: "Blocks" },
  { icon: CheckListIcon, label: "Tasks" },
  { icon: PlusSignIcon, label: "Add" },
];

function Icon({ icon, className }: { icon: IconSvgElement; className?: string }) {
  return <HugeiconsIcon icon={icon} className={className} strokeWidth={1.6} aria-hidden />;
}

function Favicon({ tab, size }: { tab: Tab; size: number }) {
  if (!tab.mark) return <Icon icon={Globe02Icon} className={styles.globe} />;
  return <Mark id={tab.mark} size={`calc(var(--u) * ${size})`} />;
}

/**
 * Zephium's window, measured from the product at 1196 x 700 design pixels.
 * In Browse it is a working browser: tabs switch, the sidebar folds into the
 * rail, the new tab is the night sky with your own time on it, and the
 * profile at the foot opens its stack. When the run begins the switch flips,
 * the sidebar folds, the page becomes the canvas with the island above it,
 * and the composer rises out of the window's edge into the canvas.
 */
export function ProductWindow({
  flags,
  compact = false,
  onMode,
}: {
  /** Where the film is: the mode, the island's line, what has happened. */
  flags: Flags;
  /** Portrait, for phones: 460 design pixels wide instead of 1196. */
  compact?: boolean;
  /** The person flipped the Browse / Work switch. */
  onMode?: (mode: "browse" | "work") => void;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const working = flags.work;
  const tasksMade = flags.tasks;
  const [current, setCurrent] = useState<string | null>(null);
  const [foldedByHand, setFolded] = useState<boolean | null>(null);
  const [launcher, setLauncher] = useState(false);
  const [stack, setStack] = useState(false);
  const [spins, setSpins] = useState(0);

  const tab = TABS.find((entry) => entry.id === (current ?? (compact ? "notion" : NEW_TAB))) ?? TABS[0];
  const folded = foldedByHand ?? compact;
  const narrow = !working && !folded;
  const newTab = tab.id === NEW_TAB && !working;

  // Fetch the other sites' pages while nothing else is happening.
  useEffect(() => {
    const idle = window.requestIdleCallback ?? ((run: () => void) => window.setTimeout(run, 2500));
    const cancel = window.cancelIdleCallback ?? window.clearTimeout;
    const handle = idle(() => {
      void loadStudio();
      void loadPages();
    });
    return () => cancel(handle);
  }, []);

  // One design pixel in screen pixels, for the unitless scales.
  useEffect(() => {
    const element = ref.current;
    if (!element) return;
    const watch = new ResizeObserver(([entry]) => {
      if (entry) element.style.setProperty("--k", String(entry.contentRect.width / (compact ? 460 : 1196)));
    });
    watch.observe(element);
    return () => watch.disconnect();
  }, [compact]);

  // The launcher and the stack close on Escape, and the stack on a press elsewhere.
  useEffect(() => {
    if (!launcher && !stack) return;
    const close = (event: KeyboardEvent) => {
      if (event.key !== "Escape") return;
      setLauncher(false);
      setStack(false);
    };
    const away = (event: PointerEvent) => {
      if (!(event.target as Element).closest(`.${styles.profile}`)) setStack(false);
    };
    window.addEventListener("keydown", close);
    window.addEventListener("pointerdown", away);
    return () => {
      window.removeEventListener("keydown", close);
      window.removeEventListener("pointerdown", away);
    };
  }, [launcher, stack]);

  const page = compact ? PAGE_COMPACT : PAGE;
  const windowStyle = { "--pw": narrow ? page.narrow : page.wide } as CSSProperties;
  const line = flags.line ? LINE[flags.line] : null;

  const choose = (id: string) => {
    setCurrent(id);
    setLauncher(false);
    setStack(false);
  };

  return (
    <div
      ref={ref}
      role="region"
      aria-label="Zephium, an interactive preview"
      className={styles.window}
      style={windowStyle}
      data-mode={working ? "work" : "browse"}
      data-folded={(!working && folded) || undefined}
      data-compact={compact || undefined}
      data-stack={stack || undefined}
    >
      <aside className={styles.side}>
        <div className={styles.toolbar}>
          <span className={styles.lights} aria-hidden="true">
            <i />
            <i />
            <i />
          </span>
          <span className={styles.browseTools}>
            <button
              type="button"
              className={styles.tool}
              aria-label={folded ? "Show the sidebar" : "Hide the sidebar"}
              aria-pressed={!folded}
              onClick={() => setFolded(!folded)}
            >
              <Icon icon={SidebarLeftIcon} />
            </button>
            <span className={styles.spacer} />
            <button type="button" className={styles.tool} data-off aria-label="Back" tabIndex={-1}>
              <Icon icon={ArrowLeft01Icon} />
            </button>
            <button type="button" className={styles.tool} data-off aria-label="Forward" tabIndex={-1}>
              <Icon icon={ArrowRight01Icon} />
            </button>
            <button
              type="button"
              className={styles.tool}
              aria-label="Reload"
              tabIndex={-1}
              onClick={() => setSpins((count) => count + 1)}
            >
              <span className={styles.reload} style={{ rotate: `${spins * 360}deg` }}>
                <Icon icon={ReloadIcon} />
              </span>
            </button>
          </span>
        </div>

        <div className={styles.browse} inert={working || folded}>
          <div className={styles.under}>
            <div className={styles.modes} role="group" aria-label="Mode">
              <span className={styles.thumb} />
              <button
                type="button"
                className={styles.mode}
                data-on={!working || undefined}
                aria-pressed={!working}
                onClick={() => onMode?.("browse")}
              >
                <Icon icon={Globe02Icon} />
                Browse
              </button>
              <button
                type="button"
                className={styles.mode}
                data-on={working || undefined}
                aria-pressed={working}
                onClick={() => onMode?.("work")}
              >
                <Icon icon={Briefcase02Icon} />
                Work
              </button>
            </div>
            <div className={styles.address} data-empty={!tab.host || undefined}>
              <span>{tab.host || "Enter an address"}</span>
              <Icon icon={Settings05Icon} className={styles.tray} />
            </div>
            <div className={styles.space}>
              <span className={styles.spaceName}>
                Home
                <Icon icon={ArrowDown01Icon} />
              </span>
              <button type="button" className={styles.tool} aria-label="New tab" onClick={() => choose(NEW_TAB)}>
                <Icon icon={Add01Icon} />
              </button>
            </div>
            <ul className={styles.tabs}>
              {TABS.map((entry) => (
                <li key={entry.id}>
                  <button
                    type="button"
                    className={styles.row}
                    data-current={entry.id === tab.id || undefined}
                    aria-current={entry.id === tab.id ? "page" : undefined}
                    onClick={() => choose(entry.id)}
                  >
                    <Favicon tab={entry} size={16} />
                    <span className={styles.label}>{entry.title}</span>
                  </button>
                </li>
              ))}
            </ul>
          </div>
          <div className={styles.dock}>
            <div className={styles.profile}>
              <ProfileStack open={stack} onClose={() => setStack(false)} />
              <button
                type="button"
                className={styles.case}
                aria-label="Your profile"
                aria-expanded={stack}
                onClick={() => setStack(!stack)}
              >
                <Icon icon={UserIcon} />
              </button>
            </div>
            <span className={styles.rule} />
            {DOCK.map((mark) => (
              <span key={mark} className={styles.site}>
                <Mark id={mark} size="calc(var(--u) * 18)" />
              </span>
            ))}
          </div>
        </div>

        <div className={styles.rail} inert={!working && !folded}>
          <span className={styles.railModes} role="group" aria-label="Mode">
            <button
              type="button"
              data-on={!working || undefined}
              aria-label="Browse"
              aria-pressed={!working}
              onClick={() => onMode?.("browse")}
            >
              <Icon icon={Globe02Icon} />
            </button>
            <button
              type="button"
              data-on={working || undefined}
              aria-label="Work"
              aria-pressed={working}
              onClick={() => onMode?.("work")}
            >
              <Icon icon={Briefcase02Icon} />
            </button>
          </span>
          <button
            type="button"
            className={`${styles.railButton} ${styles.unfold}`}
            aria-label="Show the sidebar"
            onClick={() => setFolded(false)}
          >
            <Icon icon={SidebarLeftIcon} className={styles.railIcon} />
          </button>
          <button type="button" className={styles.railButton} aria-label="Search" onClick={() => setLauncher(true)}>
            <Icon icon={Search01Icon} className={styles.railIcon} />
          </button>
          <span className={styles.railButton} aria-hidden="true">
            <Icon icon={Layers01Icon} className={styles.railIcon} />
          </span>
          {TABS.map((entry) => (
            <button
              key={entry.id}
              type="button"
              className={styles.railSite}
              data-current={(!working && entry.id === tab.id) || undefined}
              aria-label={entry.title}
              onClick={() => choose(entry.id)}
            >
              <Favicon tab={entry} size={17} />
            </button>
          ))}
          <button type="button" className={styles.railButton} aria-label="New tab" onClick={() => choose(NEW_TAB)}>
            <Icon icon={Add01Icon} className={styles.railIcon} />
          </button>
          <span className={styles.railDock}>
            {DOCK.map((mark) => (
              <span key={mark}>
                <Mark id={mark} size="calc(var(--u) * 17)" />
              </span>
            ))}
            <i />
            <span className={styles.railCase}>
              <Icon icon={UserIcon} />
            </span>
          </span>
        </div>
      </aside>

      <div className={styles.main}>
        <div className={styles.page} data-notch={newTab || undefined}>
          <div className={styles.web} inert={working}>
            <div key={tab.id} className={styles.tabPage}>
              {tab.page()}
            </div>

            <div className={styles.launcher} data-open={(launcher && !working) || undefined} onClick={() => setLauncher(false)}>
              <picture>
                <source type="image/webp" srcSet="/shots/launcher-800.webp 800w, /shots/launcher-1553.webp 1553w" sizes="50vw" />
                <img src="/shots/launcher-1553.webp" alt="" width={1553} height={769} decoding="async" loading="lazy" />
              </picture>
            </div>
          </div>

          <div className={styles.canvas} inert={!working}>
            <div className={styles.camera}>
              <Canvas flags={flags} />
            </div>
            <span className={styles.scrim} />
            <header className={styles.workTitle}>
              {trip.work}
              <Icon icon={ArrowDown01Icon} />
            </header>
            <span className={styles.zoom}>{flags.line && flags.line !== "thinking" ? "62%" : "92%"}</span>

            <div className={styles.island} data-on={line ? true : undefined}>
              {line ? (
                <Island
                  state={line.state}
                  text={line.text}
                  action={line.action}
                  parts={flags.line === "searching" || flags.line === "comparing" ? PARTS : []}
                  next={["Hold the SoMa loft", "Book the United flight"]}
                  writeup
                />
              ) : null}
            </div>

            <div className={styles.tasks} data-open={tasksMade || undefined}>
              <div className={styles.capsule}>
                <i style={{ transform: `scaleX(${tasksMade ? 1 : 0})` }} />
                <b>{tasksMade ? trip.tasks.length : 0}</b>
                <small>Tasks</small>
              </div>
              <ul className={styles.taskList}>
                {trip.tasks.map((task, index) => (
                  <li key={task} style={{ "--from": 6.3 + index * 0.1, "--to": 6.55 + index * 0.1 } as CSSProperties}>
                    <i />
                    <span>
                      {task}
                      <small>{trip.work}</small>
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* The new tab's field, hung in the notch on the window's glass. */}
        <div className={styles.notch} aria-hidden={!newTab}>
          <svg className={styles.lip} viewBox="0 0 668 51" preserveAspectRatio="none" aria-hidden="true">
            <defs>
              <linearGradient id="notch-lip" x1="0" y1="1" x2="0" y2="0">
                <stop offset="0" stopColor="rgb(176 196 238)" stopOpacity="0.3" />
                <stop offset="0.6" stopColor="rgb(176 196 238)" stopOpacity="0" />
              </linearGradient>
            </defs>
            <path d="M0 0A14 14 0 0 1 14 14V32A18 18 0 0 0 32 50H636A18 18 0 0 0 654 32V14A14 14 0 0 1 668 0" fill="none" stroke="url(#notch-lip)" vectorEffect="non-scaling-stroke" />
          </svg>
          <Icon icon={Search01Icon} />
          <span>Search or enter an address</span>
        </div>

        {/* The composer: one sheet fused to the canvas's foot, on the window's glass. */}
        <div className={styles.composer} data-typing={flags.typing || undefined} aria-hidden={!working}>
          <svg className={styles.edge} viewBox="0 0 660 44" preserveAspectRatio="none" aria-hidden="true">
            <defs>
              <linearGradient id="composer-edge" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0" stopColor="#fff" stopOpacity="0.16" />
                <stop offset="0.35" stopColor="#fff" stopOpacity="0.13" />
                <stop offset="1" stopColor="#fff" stopOpacity="0.02" />
              </linearGradient>
            </defs>
            <path d={EDGE} fill="none" stroke="url(#composer-edge)" vectorEffect="non-scaling-stroke" />
          </svg>
          <span className={styles.tools}>
            {TOOLS.map((tool, index) => (
              <span key={tool.label} className={styles.toolSlot}>
                <span className={styles.barTool} data-on={index === 0 || undefined} title={tool.label}>
                  <Icon icon={tool.icon} />
                </span>
                {index === 0 || index === TOOLS.length - 1 ? <i className={styles.barRule} /> : null}
              </span>
            ))}
          </span>
          <span className={styles.plus}>
            <Icon icon={PlusSignIcon} />
          </span>
          <span className={styles.input}>
            <span className={styles.placeholder}>What do you want to do?</span>
            <span className={styles.typed} aria-hidden="true">
              <span className={styles.line}>
                {WORDS.map((word, index) => (
                  <span key={`${word}-${index}`} style={{ "--at": 0.42 + (index / WORDS.length) * 0.5 } as CSSProperties}>
                    {index ? " " : ""}
                    {word}
                  </span>
                ))}
                <i className={styles.caret} />
              </span>
            </span>
          </span>
          <span className={styles.model}>
            <Mark id="chatgpt" size="calc(var(--u) * 15)" />
            GPT-6 Luna
            <span>·</span>
            <small>High</small>
          </span>
          <span className={styles.send}>
            <Icon icon={Mic01Icon} className={styles.mic} />
            <span className={styles.go}>
              <HugeiconsIcon icon={ArrowUp02Icon} strokeWidth={2.2} aria-hidden />
            </span>
          </span>
        </div>
      </div>
    </div>
  );
}

/**
 * The composer's outline (composer-hole.ts): walls flaring into the canvas's
 * foot on 20-pixel fillets, a 22-pixel radius over the top. In a 660 x 44 box.
 */
const EDGE = "M0 44C8.8 44 20 35.2 20 24V22A22 22 0 0 1 42 0H618A22 22 0 0 1 640 22V24C640 35.2 651.2 44 660 44";
