import {
  Add01Icon,
  AiMagicIcon,
  ArrowDown01Icon,
  ArrowLeft01Icon,
  ArrowRight01Icon,
  ArrowUp02Icon,
  Briefcase02Icon,
  Globe02Icon,
  Mic01Icon,
  ReloadIcon,
  Search01Icon,
  Settings05Icon,
  SidebarLeftIcon,
  UserIcon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon, type IconSvgElement } from "@hugeicons/react";
import type { ReactNode } from "react";
import { Mark, type MarkId } from "@/components/browser/marks";
import { WORDMARK } from "@/lib/wordmark";
import styles from "./privacy-window.module.css";

const TABS: { mark: MarkId; title: string }[] = [
  { mark: "notion", title: "Shot list | Notion" },
  { mark: "linear", title: "Active issues · Linear" },
  { mark: "github", title: "zephium-browser/Zephium" },
];

const DOCK: MarkId[] = ["slack", "github", "linear"];

function Icon({ icon, className }: { icon: IconSvgElement; className?: string }) {
  return <HugeiconsIcon icon={icon} className={className} strokeWidth={1.6} aria-hidden />;
}

/**
 * A part of the window that folds away: its row collapses to nothing and fades,
 * so what is left closes up the way the product's sidebar does.
 */
function Fold({ open, gap, children }: { open: boolean; gap: number; children: ReactNode }) {
  return (
    <div className={styles.fold} data-open={open || undefined}>
      <div className={styles.clip}>
        <div style={{ paddingTop: `calc(var(--u) * ${gap})` }}>{children}</div>
      </div>
    </div>
  );
}

/**
 * A light, static drawing of Zephium's window in the product's own glass:
 * traffic lights, the sidebar, tabs and a new tab on the night sky. What belongs
 * to AI (the Browse and Work switch, an agent in the tab list, the Ask field)
 * is drawn in folds so it can leave without the rest moving out of place. It
 * is decoration for the switches beside it, so it is hidden from assistive
 * technology; the caption under it says what it shows.
 */
export function PrivacyWindow({ ai, work }: { ai: boolean; work: boolean }) {
  return (
    <div className={styles.frame} aria-hidden="true">
      <div className={styles.window} data-ai={ai || undefined} data-work={work || undefined}>
        <aside className={styles.side}>
          <div className={styles.toolbar}>
            <span className={styles.lights}>
              <i />
              <i />
              <i />
            </span>
            <span className={styles.tools}>
              <Icon icon={SidebarLeftIcon} />
              <span className={styles.spacer} />
              <Icon icon={ArrowLeft01Icon} className={styles.faint} />
              <Icon icon={ArrowRight01Icon} className={styles.faint} />
              <Icon icon={ReloadIcon} />
            </span>
          </div>

          <div className={styles.column}>
            <div>
              <Fold open={work} gap={2}>
                <div className={styles.modes}>
                  <span className={styles.thumb} />
                  <span data-on>
                    <Icon icon={Globe02Icon} />
                    Browse
                  </span>
                  <span>
                    <Icon icon={Briefcase02Icon} />
                    Work
                  </span>
                </div>
              </Fold>
              <div className={styles.address}>
                <span>Enter an address</span>
                <Icon icon={Settings05Icon} className={styles.tray} />
              </div>
              <div className={styles.space}>
                <span className={styles.spaceName}>
                  Home
                  <Icon icon={ArrowDown01Icon} />
                </span>
                <Icon icon={Add01Icon} className={styles.add} />
              </div>
              <ul className={styles.tabs}>
                {TABS.map((tab) => (
                  <li key={tab.title} className={styles.row}>
                    <Mark id={tab.mark} size="calc(var(--u) * 15)" />
                    <span className={styles.label}>{tab.title}</span>
                  </li>
                ))}
                <li className={styles.row} data-current>
                  <Icon icon={Globe02Icon} className={styles.globe} />
                  <span className={styles.label}>New Tab</span>
                </li>
              </ul>
              <Fold open={ai} gap={3}>
                <div className={`${styles.row} ${styles.agent}`}>
                  <Icon icon={AiMagicIcon} className={styles.globe} />
                  <span className={styles.label}>SoMa trip</span>
                  <i className={styles.live} />
                </div>
              </Fold>
            </div>

            <div className={styles.dock}>
              <span className={styles.case}>
                <Icon icon={UserIcon} />
              </span>
              <span className={styles.rule} />
              {DOCK.map((mark) => (
                <span key={mark} className={styles.site}>
                  <Mark id={mark} size="calc(var(--u) * 16)" />
                </span>
              ))}
            </div>
          </div>
        </aside>

        <div className={styles.main}>
          <div className={styles.page}>
            <picture>
              <source type="image/avif" srcSet="/sky/night-1200.avif" />
              <img src="/sky/night-1200.jpg" alt="" width={1200} height={676} loading="lazy" decoding="async" />
            </picture>
            <svg className={styles.mark} viewBox={WORDMARK.viewBox} aria-hidden="true">
              <path transform={WORDMARK.transform} d={WORDMARK.d} />
            </svg>
            <div className={styles.search}>
              <Icon icon={Search01Icon} />
              Search or enter an address
            </div>
            <div className={styles.ask} data-on={ai || undefined}>
              <Icon icon={AiMagicIcon} className={styles.askIcon} />
              <span className={styles.askText}>Ask Zephium</span>
              <span className={styles.model}>
                <Mark id="chatgpt" size="calc(var(--u) * 13)" />
                GPT-6 Luna
              </span>
              <Icon icon={Mic01Icon} className={styles.mic} />
              <span className={styles.go}>
                <HugeiconsIcon icon={ArrowUp02Icon} strokeWidth={2.2} aria-hidden />
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
