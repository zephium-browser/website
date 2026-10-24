import Link from "next/link";
import { Keys, Path, ShortcutTables, Steps } from "../doc-parts";
import type { Doc } from "./types";

export const shortcuts: Doc = {
  lede: (
    <>
      These are the default shortcuts on macOS and Windows. Where macOS uses <kbd>⌘</kbd>, Windows uses{" "}
      <kbd>Ctrl</kbd>, with a few differences that the tables show. Every shortcut can be changed.
    </>
  ),
  sections: [
    {
      id: "defaults",
      title: "Default shortcuts",
      body: (
        <>
          <p>
            The keys are shown as caps: <Keys keys="⌘ ⇧ T" /> means holding Command and Shift and pressing T.
            On macOS, <kbd>⌃</kbd> is Control, <kbd>⌥</kbd> is Option and <kbd>⇧</kbd> is Shift.
          </p>
          <ShortcutTables />
        </>
      ),
    },
    {
      id: "change",
      title: "Change a shortcut",
      body: (
        <>
          <Steps>
            <li>
              Open <Path steps={["Settings", "Keyboard & accessibility"]} />. You can reach it from the Help
              menu with <strong>Keyboard Shortcuts</strong> too.
            </li>
            <li>Choose the shortcut next to the command you want to change.</li>
            <li>
              Press the new keys. <kbd>Esc</kbd> cancels, and <kbd>Delete</kbd> clears the shortcut.
            </li>
            <li>
              If another command already uses it, Zephium says which, and offers <strong>Use here</strong> to
              take it over.
            </li>
          </Steps>
          <p>
            A shortcut has to include Command or Control (on Windows, Ctrl, and not Ctrl+Alt with a letter or
            number, which many keyboard layouts use to type characters). Shortcuts that belong to the system
            cannot be used. <strong>Reset</strong> returns one command to its default, and{" "}
            <strong>Restore default shortcuts</strong> returns every one.
          </p>
          <p>
            The launcher has its own recorder in the same place, so that it can work from any app. See{" "}
            <Link href="/docs/browse#launcher">the launcher</Link>.
          </p>
        </>
      ),
    },
  ],
};
