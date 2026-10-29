import Link from "next/link";
import { downloadPath, platforms, site } from "@/lib/site";
import { Keys, Note, Path, Steps, Table } from "../doc-parts";
import type { Doc } from "./types";

const macos = platforms.find((platform) => platform.id === "macos");
const windows = platforms.find((platform) => platform.id === "windows");

export const gettingStarted: Doc = {
  lede: (
    <>
      Zephium is a browser first. You can download it, open it and browse without an account, a key or
      a model. This page takes you from the installer to your first tab, and shows where the rest
      begins.
    </>
  ),
  sections: [
    {
      id: "install",
      title: "Install Zephium",
      body: (
        <>
          <p>
            Download the installer for your system from the <Link href={downloadPath()}>download page</Link>,
            or from the <a href={site.releases}>releases page</a> on GitHub.
          </p>
          <Table
            caption="Supported systems"
            head={["System", "Build", "Requires"]}
            rows={[
              [macos?.name, "Apple silicon", "macOS Sonoma 14 or later"],
              [windows?.name, "x64", "Windows 10 or 11"],
            ]}
          />
          <p>
            Intel Macs and Linux are not supported yet. They are next on the list, and the mobile apps
            follow.
          </p>
          <Steps>
            <li>
              <strong>On macOS</strong>, open the downloaded disk image and move Zephium to your
              Applications folder.
            </li>
            <li>
              <strong>On Windows</strong>, run <code>{windows?.asset}</code> and follow the installer.
            </li>
            <li>Open Zephium. The welcome flow starts on its own the first time.</li>
          </Steps>
          <Note kind="careful" title="Windows may warn you">
            <p>
              Windows builds are not code-signed yet, so SmartScreen can show &ldquo;Windows protected your
              PC&rdquo;. Choose <strong>More info</strong>, then <strong>Run anyway</strong>. Signing is on
              the way.
            </p>
          </Note>
        </>
      ),
    },
    {
      id: "welcome",
      title: "The welcome flow",
      body: (
        <>
          <p>
            The first launch walks you through a few short steps. Every one can be skipped with{" "}
            <strong>Skip</strong>, or all of them with <strong>Skip setup</strong>, and everything it
            sets up can be changed later in Settings.
          </p>
          <Steps>
            <li>
              <strong>Your name.</strong> Zephium uses it as your profile&apos;s display name.
            </li>
            <li>
              <strong>Import.</strong> Bring bookmarks and history from the browser you are leaving, and
              pick the search engine you know.
            </li>
            <li>
              <strong>Essentials.</strong> Choose the sites you use every day. They wait in your sidebar
              and load only when you open them.
            </li>
            <li>
              <strong>The launcher.</strong> A search that opens over any app, so you can find a tab, a
              page from your history or a note without switching windows.
            </li>
            <li>
              <strong>Work.</strong> A short look at the canvas where agents do the busywork.
            </li>
            <li>
              <strong>How Work thinks.</strong> Zephium AI, your own key, or a model on your computer.
              Skip it if you only want the browser.
            </li>
          </Steps>
          <p>Choose <strong>Start browsing</strong> on the last screen.</p>
        </>
      ),
    },
    {
      id: "import",
      title: "Bring your browsing with you",
      body: (
        <>
          <p>
            Zephium imports from Chrome, Safari, Arc, Zen, Firefox, Brave and Edge. It brings your
            bookmarks, your history from the last 180 days and the sites you keep as Essentials.
            Passwords are not imported. To carry them over, install your password manager&apos;s
            extension, such as 1Password or Bitwarden. See <Link href="/docs/extensions">Extensions</Link>.
          </p>
          <p>To import after the welcome flow:</p>
          <Steps>
            <li>
              Quit the browser you are importing from. It keeps its data locked while it is open.
            </li>
            <li>
              Open Settings with <Keys keys="⌘ ," /> on macOS or <Keys keys="Ctrl ," /> on Windows, and
              go to <Path steps={["General"]} />.
            </li>
            <li>
              Under <strong>Import browser data</strong>, pick the browser. If it has several profiles,
              pick one, choose what to bring, and start the import.
            </li>
          </Steps>
          <p>
            On macOS, a browser may need your permission first. If Zephium says so, allow it in System
            Settings and try again. Stopping an import keeps whatever was already brought over.
          </p>
        </>
      ),
    },
    {
      id: "default-browser",
      title: "Make Zephium your default browser",
      body: (
        <>
          <p>
            Open <Path steps={["Settings", "General"]} /> and choose <strong>Set as default</strong> in the card at the top.
            Links you open in other apps then open in Zephium. In the
            same place, <strong>Open Zephium at login</strong> starts it when you sign in to your
            computer, and <strong>On startup</strong> chooses between starting with a new tab, which is the
            default, continuing where you left off, and opening pages you pick.
          </p>
        </>
      ),
    },
    {
      id: "accounts",
      title: "Do I need an account?",
      body: (
        <>
          <p>
            No. The browser, Tasks, Notes, Time and the blocker need no account, and neither does Work
            with your own keys or a local model. Until you sign in, Zephium does not contact its own
            servers.
          </p>
          <p>
            An account is only for Zephium AI, our hosted models, and it is free to start. See{" "}
            <Link href="/docs/models#zephium-ai">Models and keys</Link> for plans and credits.
          </p>
        </>
      ),
    },
    {
      id: "updates",
      title: "Updates",
      body: (
        <p>
          Zephium downloads updates in the background and installs them when you choose{" "}
          <strong>Relaunch to update</strong>. To check right now, open{" "}
          <Path steps={["Settings", "About"]} /> and choose <strong>Check now</strong>. What changed in each
          release is in the <Link href="/changelog">changelog</Link>.
        </p>
      ),
    },
    {
      id: "next",
      title: "Where to go next",
      body: (
        <ul>
          <li>
            <Link href="/docs/browse">Browse</Link> covers the sidebar, spaces, the launcher and the tools
            beside your tabs.
          </li>
          <li>
            <Link href="/docs/ask-zephium">Ask Zephium</Link> is the assistant that reads the page in
            front of you.
          </li>
          <li>
            <Link href="/docs/work">Work and agents</Link> explains the canvas and what agents may do.
          </li>
          <li>
            <Link href="/docs/shortcuts">Keyboard shortcuts</Link> lists every default key.
          </li>
        </ul>
      ),
    },
  ],
};
