"use client";

import {
  Bookmark02Icon,
  Briefcase01Icon,
  BubbleChatIcon,
  CheckListIcon,
  Download01Icon,
  HistoryIcon,
  Home01Icon,
  HourglassIcon,
  IncognitoIcon,
  Note01Icon,
  Settings02Icon,
  UserIcon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon, type IconSvgElement } from "@hugeicons/react";
import type { CSSProperties } from "react";
import styles from "./profile-stack.module.css";

type Row = { icon: IconSvgElement; label: string; keys: string };

/** The stack's rows (features/dock/dock-tools.ts), with their keys the macOS way. */
const GROUPS: Row[][] = [
  [
    { icon: BubbleChatIcon, label: "Ask Zephium", keys: "⌘E" },
    { icon: Note01Icon, label: "Notes", keys: "⇧⌘E" },
    { icon: CheckListIcon, label: "Tasks", keys: "⇧⌘K" },
    { icon: HourglassIcon, label: "Time", keys: "⇧⌘U" },
  ],
  [
    { icon: HistoryIcon, label: "History", keys: "⌘Y" },
    { icon: Download01Icon, label: "Downloads", keys: "⇧⌘J" },
    { icon: Bookmark02Icon, label: "Bookmarks", keys: "⇧⌘B" },
  ],
  [{ icon: Settings02Icon, label: "Settings", keys: "⌘," }],
];

const COUNT = GROUPS.flat().length;

/** Each row's place in the settling order: the row nearest the avatar first. */
const STEP = new Map(GROUPS.flat().map((row, index) => [row.label, COUNT - 1 - index]));

/**
 * The profile's stack (features/dock/ToolShelf.svelte): the foot of the
 * column is you, and pressing it opens what belongs to you, rising out of
 * the avatar nearest rows first, the way a stack opens from the Dock. Its
 * head switches between you, your other profiles and a private window.
 */
export function ProfileStack({ open, onClose }: { open: boolean; onClose: () => void }) {
  return (
    <div className={styles.stack} data-open={open || undefined} inert={!open} role="menu" aria-label="Your profile">
      <div className={styles.head} style={{ "--step": COUNT + 1 } as CSSProperties}>
        <span className={styles.me}>
          <HugeiconsIcon icon={UserIcon} strokeWidth={1.8} aria-hidden />
        </span>
        <b>Crynta</b>
        <span className={styles.others}>
          <span className={styles.avatar} data-tone="pink" title="Home">
            <HugeiconsIcon icon={Home01Icon} strokeWidth={1.8} aria-hidden />
          </span>
          <span className={styles.avatar} data-tone="blue" title="Work">
            <HugeiconsIcon icon={Briefcase01Icon} strokeWidth={1.8} aria-hidden />
          </span>
          <i />
          <span className={styles.private} title="New private window">
            <HugeiconsIcon icon={IncognitoIcon} strokeWidth={1.7} aria-hidden />
          </span>
        </span>
      </div>
      {GROUPS.map((group, index) => (
        <div key={index} className={styles.group}>
          {group.map((row) => (
            <button
              key={row.label}
              type="button"
              role="menuitem"
              className={styles.row}
              style={{ "--step": STEP.get(row.label) } as CSSProperties}
              onClick={onClose}
            >
              <HugeiconsIcon icon={row.icon} strokeWidth={1.6} aria-hidden />
              <span>{row.label}</span>
              <kbd>{row.keys}</kbd>
            </button>
          ))}
        </div>
      ))}
    </div>
  );
}
