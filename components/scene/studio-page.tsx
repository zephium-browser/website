import {
  Add01Icon,
  CheckmarkCircle02Icon,
  ArrowUp02Icon,
  ClosedCaptionIcon,
  FolderLibraryIcon,
  MusicNote03Icon,
  PlayIcon,
  Redo02Icon,
  Search01Icon,
  TextFontIcon,
  Undo02Icon,
  Upload04Icon,
  VoiceIcon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon, type IconSvgElement } from "@hugeicons/react";
import type { CSSProperties } from "react";
import { siElevenlabs } from "simple-icons";
import styles from "./studio-page.module.css";

/*
 * ElevenLabs Studio with a film being cut, drawn in HTML: the frame in the
 * middle, the library on the left, the studio's own agent on the right, and a
 * quiet timeline below. A likeness of their app, with made-up content, so the
 * window opens on someone else's site the way a browser does.
 */

function Icon({ icon, className }: { icon: IconSvgElement; className?: string }) {
  return <HugeiconsIcon icon={icon} className={className} strokeWidth={1.7} aria-hidden />;
}

/** A waveform as bars, the same every render. */
function wave(count: number, seed: number, floor = 0.15) {
  let state = seed;
  const random = () => {
    state = (state * 16807) % 2147483647;
    return state / 2147483647;
  };
  let d = "";
  for (let i = 0; i < count; i++) {
    const swell = 0.55 + 0.45 * Math.sin((i / count) * Math.PI * 3 + seed);
    const height = Math.max(floor, Math.min(1, random() * swell + 0.1));
    const top = (1 - height) * 10;
    d += `M${i * 2 + 0.5} ${top.toFixed(2)}V${(20 - top).toFixed(2)}`;
  }
  return d;
}

function Wave({ bars, seed, className }: { bars: number; seed: number; className?: string }) {
  return (
    <svg className={className} viewBox={`0 0 ${bars * 2} 20`} preserveAspectRatio="none" aria-hidden="true">
      <path d={wave(bars, seed)} />
    </svg>
  );
}

const LIBRARY = [
  { name: "Narration · Episode 1", meta: "2:48", kind: "voice" as const, seed: 11 },
  { name: "Music · Ascent", meta: "3:15", kind: "music" as const, seed: 23 },
  { name: "Countdown", meta: "0:12", kind: "voice" as const, seed: 37 },
  { name: "Title card", meta: "Text", kind: "title" as const, seed: 0 },
];

const RULER = ["0:00", "0:30", "1:00", "1:30", "2:00", "2:30", "3:00"];

/** Narration clips on the timeline, as start and length in percent. */
const NARRATION = [
  [4, 15],
  [22, 19],
  [45, 12],
  [61, 21],
];

export function StudioPage() {
  return (
    <div className={styles.studio}>
      <header className={styles.bar}>
        <span className={styles.crumbs}>
          <span className={styles.brand}>
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path d={siElevenlabs.path} />
            </svg>
            ElevenLabs
          </span>
          <i className={styles.divider} />
          <span className={styles.path}>
            Studio <span>/</span>
          </span>
          <b>Starship: The Launch</b>
        </span>
        <span className={styles.actions}>
          <span className={styles.ratio}>16:9</span>
          <span className={styles.ghost}>Share</span>
          <span className={styles.lit}>Export</span>
          <span className={styles.avatar} />
        </span>
      </header>

      <nav className={styles.tools}>
        <span data-on>
          <Icon icon={FolderLibraryIcon} className={styles.i16} />
          Library
        </span>
        <span>
          <Icon icon={TextFontIcon} className={styles.i16} />
          Script
        </span>
        <span>
          <Icon icon={VoiceIcon} className={styles.i16} />
          Voices
        </span>
        <span>
          <Icon icon={ClosedCaptionIcon} className={styles.i16} />
          Captions
        </span>
      </nav>

      <section className={styles.library}>
        <header>
          <b>Library</b>
          <span className={styles.icons}>
            <Icon icon={Upload04Icon} className={styles.i14} />
            <span className={styles.create}>
              Create <Icon icon={Add01Icon} className={styles.i12} />
            </span>
          </span>
        </header>
        <div className={styles.segment}>
          <span data-on>Project</span>
          <span>Workspace</span>
        </div>
        <div className={styles.search}>
          <Icon icon={Search01Icon} className={styles.i12} />
          Search
        </div>
        <ul>
          {LIBRARY.map((item) => (
            <li key={item.name}>
              <span className={styles.thumb} data-kind={item.kind}>
                {item.kind === "title" ? (
                  <b>Aa</b>
                ) : item.kind === "music" ? (
                  <Icon icon={MusicNote03Icon} className={styles.i14} />
                ) : (
                  <Wave bars={18} seed={item.seed} className={styles.miniWave} />
                )}
              </span>
              <span className={styles.itemText}>
                <b>{item.name}</b>
                <small>{item.meta}</small>
              </span>
            </li>
          ))}
        </ul>
      </section>

      <main className={styles.stage}>
        <div className={styles.frame}>
          <picture className={styles.shot}>
            <source type="image/webp" srcSet="/shots/starship-840.webp 840w, /shots/starship-1678.webp 1678w" sizes="50vw" />
            <img src="/shots/starship-1678.webp" alt="" width={1678} height={937} decoding="async" fetchPriority="high" />
          </picture>
        </div>
        <div className={styles.transport}>
          <span className={styles.time}>
            0:42 <span>/ 3:15</span>
          </span>
          <span className={styles.undo}>
            <Icon icon={Undo02Icon} className={styles.i14} />
            <Icon icon={Redo02Icon} className={styles.i14} />
          </span>
          <span className={styles.play}>
            <Icon icon={PlayIcon} className={styles.i12} />
          </span>
          <span className={styles.zoom}>
            <i />
          </span>
        </div>
      </main>

      <aside className={styles.chat}>
        <header>
          <span data-on>Chat</span>
          <span>Comment</span>
        </header>
        <div className={styles.thread}>
          <p className={styles.mine}>Tighten the opening to eight seconds and bring the music under the narration.</p>
          <div className={styles.reply}>
            <span className={styles.spark} />
            <p>Done. The opening now cuts at 0:08, and the music sits under the voice.</p>
            <ul className={styles.edits}>
              <li>
                <Icon icon={CheckmarkCircle02Icon} className={styles.i12} />
                Trimmed the opening to 0:08
              </li>
              <li>
                <Icon icon={CheckmarkCircle02Icon} className={styles.i12} />
                Music down 6 dB under A1
              </li>
            </ul>
            <small>2 edits · Undo</small>
          </div>
        </div>
        <div className={styles.ask}>
          <span>Describe what you want to create</span>
          <span className={styles.send}>
            <Icon icon={ArrowUp02Icon} className={styles.i12} />
          </span>
        </div>
      </aside>

      <section className={styles.timeline}>
        <div className={styles.ruler}>
          {RULER.map((mark) => (
            <span key={mark}>{mark}</span>
          ))}
        </div>
        <div className={styles.track}>
          <small>V1</small>
          <span className={styles.lane}>
            <span className={styles.video} style={{ left: "2%", width: "84%" } as CSSProperties}>
              Starship · launch
            </span>
          </span>
        </div>
        <div className={styles.track}>
          <small>A1</small>
          <span className={styles.lane}>
            {NARRATION.map(([start, length], index) => (
              <span key={start} className={styles.voice} style={{ left: `${start}%`, width: `${length}%` }}>
                <Wave bars={40} seed={50 + index * 7} className={styles.clipWave} />
              </span>
            ))}
          </span>
        </div>
        <div className={styles.track}>
          <small>A2</small>
          <span className={styles.lane}>
            <span className={styles.music} style={{ left: "6%", width: "86%" }}>
              <Wave bars={120} seed={91} className={styles.clipWave} />
            </span>
          </span>
        </div>
        <i className={styles.playhead} />
      </section>
    </div>
  );
}
