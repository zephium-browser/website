import { Alert02Icon, BulbIcon, InformationCircleIcon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import type { ReactNode } from "react";
import { shortcutGroups, unboundCommands } from "@/lib/docs-shortcuts";
import styles from "./docs.module.css";

/** A sub-heading inside a section. It gets an anchor like the sections do. */
export function H3({ id, children }: { id: string; children: ReactNode }) {
  return (
    <h3 id={id} className={styles.h3}>
      <a href={`#${id}`} className={styles.headlink}>
        {children}
      </a>
    </h3>
  );
}

const callouts = {
  note: { icon: InformationCircleIcon, label: "Note" },
  tip: { icon: BulbIcon, label: "Tip" },
  careful: { icon: Alert02Icon, label: "Keep in mind" },
} as const;

/** A short aside, set apart from the steps around it. */
export function Note({
  kind = "note",
  title,
  children,
}: {
  kind?: keyof typeof callouts;
  title?: string;
  children: ReactNode;
}) {
  const { icon, label } = callouts[kind];
  return (
    <aside className={styles.note} data-kind={kind}>
      <HugeiconsIcon icon={icon} size={18} strokeWidth={1.7} aria-hidden className={styles.noteIcon} />
      <div>
        <div className={styles.noteTitle}>{title ?? label}</div>
        {children}
      </div>
    </aside>
  );
}

/** Numbered steps for a task. */
export function Steps({ children }: { children: ReactNode }) {
  return <ol className={styles.steps}>{children}</ol>;
}

/** Keys as caps: "⌘ ⇧ T" becomes three. */
export function Keys({ keys }: { keys: string }) {
  return (
    <span className={styles.keys}>
      {keys.split(" ").map((key, index) => (
        <kbd key={`${key}-${index}`}>{key}</kbd>
      ))}
    </span>
  );
}

/** A path through the settings: Settings › Models › Zephium AI. */
export function Path({ steps }: { steps: readonly string[] }) {
  return (
    <span className={styles.path}>
      {steps.map((step, index) => (
        <span key={step}>
          {index > 0 ? <span aria-hidden className={styles.pathSep}>{" › "}</span> : null}
          <strong>{step}</strong>
        </span>
      ))}
    </span>
  );
}

/** A block of code or a command, to copy as written. */
export function Code({ children, label }: { children: string; label?: string }) {
  return (
    <pre className={styles.code} aria-label={label} tabIndex={0}>
      <code>{children}</code>
    </pre>
  );
}

/** A plain table. It scrolls sideways on a narrow screen instead of squeezing. */
export function Table({
  caption,
  head,
  rows,
  wide = false,
}: {
  /** Keeps the columns from squeezing: the table scrolls sideways instead. */
  wide?: boolean;
  caption: string;
  head: readonly string[];
  rows: readonly (readonly ReactNode[])[];
}) {
  return (
    <div className={styles.tableWrap} role="region" aria-label={caption} tabIndex={0}>
      <table className={wide ? `${styles.table} ${styles.wide}` : styles.table}>
        <caption className="sr-only">{caption}</caption>
        <thead>
          <tr>
            {head.map((cell) => (
              <th key={cell} scope="col">
                {cell}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, index) => (
            <tr key={index}>
              {row.map((cell, column) =>
                column === 0 ? (
                  <th key={column} scope="row">
                    {cell}
                  </th>
                ) : (
                  <td key={column}>{cell}</td>
                ),
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

/** Every default shortcut, by group, on both systems. */
export function ShortcutTables() {
  return (
    <>
      {shortcutGroups.map((group) => (
        <div key={group.id} className={styles.shortcutGroup}>
          <H3 id={group.id}>{group.title}</H3>
          {group.note ? <p>{group.note}</p> : null}
          <Table
            caption={`${group.title}: default shortcuts`}
            head={["Command", "macOS", "Windows"]}
            rows={group.shortcuts.map((item) => [
              item.action,
              item.mac ? <Keys key="mac" keys={item.mac} /> : <span key="mac" className={styles.none}>None</span>,
              item.windows ? (
                <Keys key="windows" keys={item.windows} />
              ) : (
                <span key="windows" className={styles.none}>None</span>
              ),
            ])}
          />
        </div>
      ))}
      <p>Commands with no default shortcut until you give them one: {unboundCommands.join(", ")}.</p>
    </>
  );
}
