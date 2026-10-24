/**
 * Zephium's default shortcuts, as the product registers them
 * (crates/zephium-core/src/commands.rs), named the way its menus name them.
 * Keys are separated by spaces, one key per cap. `null` means the command
 * has no default on that system. Every one of them can be changed in
 * Settings, under Keyboard & accessibility.
 */
export type Shortcut = {
  action: string;
  mac: string | null;
  windows: string | null;
};

export type ShortcutGroup = {
  id: string;
  title: string;
  note?: string;
  shortcuts: Shortcut[];
};

const same = (action: string, keys: string, windowsKeys = keys): Shortcut => ({
  action,
  mac: keys,
  windows: windowsKeys,
});

export const shortcutGroups: ShortcutGroup[] = [
  {
    id: "tabs",
    title: "Tabs and windows",
    shortcuts: [
      same("New tab", "⌘ T", "Ctrl T"),
      same("Close tab", "⌘ W", "Ctrl W"),
      same("Reopen closed tab", "⌘ ⇧ T", "Ctrl Shift T"),
      same("New private window", "⌘ ⇧ N", "Ctrl Shift N"),
      same("Next tab", "⌃ Tab", "Ctrl Tab"),
      same("Previous tab", "⌃ ⇧ Tab", "Ctrl Shift Tab"),
      same("Select tab above", "⌘ ⌥ ↑", "Ctrl Alt ↑"),
      same("Select tab below", "⌘ ⌥ ↓", "Ctrl Alt ↓"),
      same("Select tab 1 to 8", "⌘ 1–8", "Ctrl 1–8"),
      same("Select last tab", "⌘ 9", "Ctrl 9"),
      same("Compact mode", "⌘ ⇧ S", "Ctrl Shift S"),
    ],
  },
  {
    id: "spaces",
    title: "Spaces",
    shortcuts: [
      same("Next space", "⌘ ⌥ →", "Ctrl Alt →"),
      same("Previous space", "⌘ ⌥ ←", "Ctrl Alt ←"),
      same("Switch to space 1 to 9", "⌃ 1–9", "Ctrl Shift 1–9"),
    ],
  },
  {
    id: "pages",
    title: "Pages and navigation",
    shortcuts: [
      same("Open location", "⌘ L", "Ctrl L"),
      same("Back", "⌘ [", "Ctrl ["),
      same("Forward", "⌘ ]", "Ctrl ]"),
      same("Reload page", "⌘ R", "Ctrl R"),
      same("Stop loading", "⌘ .", "Ctrl ."),
      same("Find on page", "⌘ F", "Ctrl F"),
      same("Find next", "⌘ G", "Ctrl G"),
      same("Find previous", "⌘ ⇧ G", "Ctrl Shift G"),
      same("Bookmark this page", "⌘ D", "Ctrl D"),
      same("Copy link", "⌘ ⇧ C", "Ctrl Shift C"),
      same("Zoom in", "⌘ =", "Ctrl ="),
      same("Zoom out", "⌘ -", "Ctrl -"),
      same("Actual size", "⌘ 0", "Ctrl 0"),
      same("Print", "⌘ P", "Ctrl P"),
      same("Developer Tools", "⌘ ⌥ I", "Ctrl Shift I"),
      same("Settings", "⌘ ,", "Ctrl ,"),
    ],
  },
  {
    id: "tools",
    title: "Tools beside your tabs",
    shortcuts: [
      same("Ask Zephium", "⌘ E", "Ctrl E"),
      same("Notes", "⌘ ⇧ E", "Ctrl Shift E"),
      { action: "New note", mac: "⌘ ⌥ N", windows: null },
      same("Tasks", "⌘ ⇧ K", "Ctrl Shift K"),
      same("Time", "⌘ ⇧ U", "Ctrl Shift F"),
      same("History", "⌘ Y", "Ctrl H"),
      same("Show all history", "⌘ ⇧ Y", "Ctrl Shift H"),
      same("Bookmarks", "⌘ ⇧ B", "Ctrl Shift O"),
      same("Downloads", "⌘ ⇧ J", "Ctrl J"),
      same("Launcher, from any app", "⌘ ⇧ Space", "Ctrl Shift Space"),
    ],
  },
  {
    id: "work",
    title: "Work",
    note: "The two pane keys are fixed to the pane and cannot be changed.",
    shortcuts: [
      same("Dictate in the Work bar", "⌘ ⇧ D", "Ctrl Shift D"),
      same("Close pane", "Esc"),
      same("Open pane in Browse", "⌘ ⇧ Return", "Ctrl Shift Enter"),
    ],
  },
];

/** Commands that exist, and have no shortcut until you give them one. */
export const unboundCommands = [
  "Split View…",
  "Show All Tasks",
  "Show All Notes",
  "Show Time",
  "Close Private Window",
  "Keyboard Shortcuts",
  "Appearance: System, Light and Dark",
] as const;
