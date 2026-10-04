"use client";

import {
  Add01Icon,
  ArrowDown01Icon,
  ArrowLeft01Icon,
  ArrowRight01Icon,
  Briefcase02Icon,
  CheckListIcon,
  Globe02Icon,
  Mic01Icon,
  NoteIcon,
  ReloadIcon,
  Search01Icon,
  SidebarLeftIcon,
  ToolCaseIcon,
  TouchInteraction01Icon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon, type IconSvgElement } from "@hugeicons/react";
import { useEffect, useRef, useState, type CSSProperties, type ReactNode } from "react";
import { Mark, type MarkId } from "@/components/browser/marks";
import { Island, type IslandPart, type IslandState } from "@/components/island/island";
import { Canvas } from "@/components/work/canvas";
import { trip } from "@/lib/demo-trip";
import { PAGE, PAGE_COMPACT, type Flags, type IslandLine } from "./film";
import { StudioPage } from "./studio-page";
import { FlightFinderPage, GitHubPage, LinearPage, NotionPage, StaybookPage } from "./tab-pages";
import styles from "./product-window.module.css";

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

type Tab = { id: string; mark: MarkId; title: string; host: string; page: () => ReactNode };

/** Other people's sites, open in Zephium, each titled the way its own tab would be. */
const TABS: Tab[] = [
  { id: "studio", mark: "elevenlabs", title: "Starship: The Launch · ElevenLabs", host: "elevenlabs.io", page: () => <StudioPage /> },
  { id: "linear", mark: "linear", title: "Active issues · Linear", host: "linear.app", page: () => <LinearPage /> },
  { id: "notion", mark: "notion", title: "Shot list | Notion", host: "notion.so", page: () => <NotionPage /> },
  { id: "github", mark: "github", title: "zephium-browser/Zephium · GitHub", host: "github.com", page: () => <GitHubPage /> },
  { id: "stays", mark: "staybook", title: "Stays in SoMa · Staybook", host: trip.stays.site, page: () => <StaybookPage /> },
  { id: "flights", mark: "flightfinder", title: "London to San Francisco · FlightFinder", host: trip.flights.site, page: () => <FlightFinderPage /> },
];

const DOCK: MarkId[] = ["slack", "telegram", "notion"];

function Icon({ icon, className }: { icon: IconSvgElement; className?: string }) {
  return <HugeiconsIcon icon={icon} className={className} strokeWidth={1.6} aria-hidden />;
}

/**
 * Zephium's window, measured from the product at 1196 x 700 design pixels.
 * In Browse it is a working browser: tabs switch, the sidebar folds into the
 * rail, New tab opens the launcher. When the run begins the switch flips, the
 * sidebar folds, and the page becomes the canvas with the island above it.
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
  const [spins, setSpins] = useState(0);

  const tab = TABS.find((entry) => entry.id === (current ?? (compact ? "notion" : "studio"))) ?? TABS[0];
  const folded = foldedByHand ?? compact;
  const narrow = !working && !folded;

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

  // The launcher closes on Escape (and is hidden while the window works).
  useEffect(() => {
    if (!launcher) return;
    const close = (event: KeyboardEvent) => {
      if (event.key === "Escape") setLauncher(false);
    };
    window.addEventListener("keydown", close);
    return () => window.removeEventListener("keydown", close);
  }, [launcher]);

  const page = compact ? PAGE_COMPACT : PAGE;
  const windowStyle = { "--pw": narrow ? page.narrow : page.wide } as CSSProperties;
  const line = flags.line ? LINE[flags.line] : null;

  const choose = (id: string) => {
    setCurrent(id);
    setLauncher(false);
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
            <button type="button" className={styles.tool} aria-label="Back" tabIndex={-1}>
              <Icon icon={ArrowLeft01Icon} />
            </button>
            <button type="button" className={styles.tool} aria-label="Forward" tabIndex={-1}>
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
          <div className={styles.address}>{tab.host}</div>
          <button type="button" className={`${styles.row} ${styles.quiet}`} onClick={() => setLauncher(true)}>
            <Icon icon={Add01Icon} className={styles.glyph} />
            New tab
          </button>
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
                  <Mark id={entry.mark} size="calc(var(--u) * 16)" />
                  <span className={styles.label}>{entry.title}</span>
                </button>
              </li>
            ))}
          </ul>
          <div className={styles.dock}>
            <span className={styles.shelf}>
              <Icon icon={ToolCaseIcon} />
            </span>
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
          <i className={styles.railRule} />
          {TABS.map((entry) => (
            <button
              key={entry.id}
              type="button"
              className={styles.railSite}
              data-current={(!working && entry.id === tab.id) || undefined}
              aria-label={entry.title}
              onClick={() => choose(entry.id)}
            >
              <Mark id={entry.mark} size="calc(var(--u) * 17)" />
            </button>
          ))}
          <button type="button" className={styles.railButton} aria-label="New tab" onClick={() => setLauncher(true)}>
            <Icon icon={Add01Icon} className={styles.railIcon} />
          </button>
          <span className={styles.railDock}>
            {DOCK.map((mark) => (
              <span key={mark}>
                <Mark id={mark} size="calc(var(--u) * 17)" />
              </span>
            ))}
          </span>
        </div>
      </aside>

      <div className={styles.page}>
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

          <div className={styles.composer} data-typing={flags.typing || undefined}>
            <span className={styles.tools}>
              <Icon icon={TouchInteraction01Icon} />
              <Icon icon={NoteIcon} />
              <Icon icon={CheckListIcon} />
              <Icon icon={Add01Icon} />
            </span>
            <span className={styles.input}>
              <span className={styles.placeholder}>What do you want to do?</span>
              <span className={styles.typed} aria-hidden="true">
                {WORDS.map((word, index) => (
                  <span key={`${word}-${index}`} style={{ "--at": 0.42 + (index / WORDS.length) * 0.5 } as CSSProperties}>
                    {word}{" "}
                  </span>
                ))}
              </span>
            </span>
            <Icon icon={Mic01Icon} className={styles.mic} />
          </div>
        </div>
      </div>
    </div>
  );
}
