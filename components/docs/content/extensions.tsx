import Link from "next/link";
import { Note, Path, Steps, Table } from "../doc-parts";
import type { Doc } from "./types";

export const extensions: Doc = {
  lede: (
    <>
      Zephium installs Chrome extensions straight from the Chrome Web Store. Support is growing and covers a
      part of what Chrome extensions can do, so this page says what to expect before you rely on one.
    </>
  ),
  sections: [
    {
      id: "install",
      title: "Install an extension",
      body: (
        <>
          <Steps>
            <li>
              Open the extension&apos;s page in the <strong>Chrome Web Store</strong>. The extension manager
              has a <strong>Chrome Web Store</strong> button that takes you there.
            </li>
            <li>
              Choose <strong>Add to Zephium</strong> in the sidebar.
            </li>
            <li>
              Read the review. It lists the access the extension asks for, and any limits it will have in
              Zephium.
            </li>
            <li>
              Choose <strong>Add</strong>. Zephium downloads the original package directly from Google and
              installs it for your current profile.
            </li>
          </Steps>
          <p>
            You can also drop a <code>.crx</code> or <code>.zip</code> file on the browser, or choose{" "}
            <strong>Install from file</strong> in the extension manager to pick a <strong>Package file…</strong>{" "}
            or an <strong>Unpacked folder…</strong>. Extensions installed from a file are not updated
            automatically.
          </p>
          <Note kind="tip" title="Skip the ad blocker">
            <p>
              Zephium already blocks ads and trackers, so you do not need an ad-blocking extension. See{" "}
              <Link href="/docs/privacy#blocker">Privacy and security</Link>.
            </p>
          </Note>
        </>
      ),
    },
    {
      id: "works-well",
      title: "Extensions that work well",
      body: (
        <>
          <p>
            The extension manager lists extensions that work well in Zephium, with a{" "}
            <strong>Get</strong> button on each. They include:
          </p>
          <Table
            caption="Extensions listed as working well"
            head={["For", "Extensions"]}
            rows={[
              ["Passwords", "1Password, Bitwarden, LastPass"],
              ["Writing and language", "Grammarly, DeepL, Google Dictionary"],
              ["Browsing", "Dark Reader, Vimium, Stylus"],
              ["Video", "SponsorBlock, Return YouTube Dislike, Enhancer for YouTube, Video Speed Controller"],
              ["Saving and research", "Raindrop.io, Notion Web Clipper, Evernote Web Clipper, Zotero Connector"],
              ["For developers", "Refined GitHub, Octotree, Wappalyzer"],
            ]}
          />
          <p>
            Dark Reader, Vimium, 1Password and JSON Formatter have been tested most closely, on macOS. Other
            extensions can use the same supported capabilities, but have not all been tried. Windows is
            qualified separately. If an extension does not work, tell us on{" "}
            <Link href="/support">the support page</Link>.
          </p>
        </>
      ),
    },
    {
      id: "limits",
      title: "What to expect",
      body: (
        <>
          <p>
            Installing an extension does not promise that every feature works on your system.
          </p>
          <ul>
            <li>
              When an extension needs an optional API or optional site access that Zephium does not support,
              installation goes ahead and the review lists it as unavailable. You cannot turn it on later.
              If a <em>required</em> API is unsupported, the extension does not install.
            </li>
            <li>
              Messages from websites and other extensions to an extension may be restricted to the
              extension itself.
            </li>
            <li>
              Zephium runs up to twelve extensions at once, across up to three active profiles.
            </li>
            <li>Extensions are not available in private windows.</li>
          </ul>
        </>
      ),
    },
    {
      id: "manage",
      title: "Manage extensions",
      body: (
        <>
          <p>
            Open the manager with <strong>Manage Extensions…</strong> in the sidebar menu, or from{" "}
            <Path steps={["Settings", "Extensions"]} />. For each extension you can:
          </p>
          <ul>
            <li>turn it on or off, or <strong>Remove</strong> it together with its data;</li>
            <li>
              change <strong>Site access</strong>: on all the sites it asks for, only when you click it, or
              on specific sites you list;
            </li>
            <li>open its <strong>Options</strong>;</li>
            <li>
              choose <strong>Check for updates</strong>. Zephium also checks in the background.
            </li>
          </ul>
          <p>
            An update that asks for new required access needs your approval first. It cannot widen its
            permissions on its own. If an extension shows <strong>Not active</strong>, its entry says what
            went wrong. <strong>Retry activation</strong> helps when the problem can pass. A message about
            capacity means another extension must be turned off first, and a message about restarting means
            retrying will not help until you restart Zephium.
          </p>
        </>
      ),
    },
    {
      id: "1password",
      title: "Connect 1Password",
      body: (
        <>
          <p>To share your accounts and unlocking with the 1Password desktop app:</p>
          <Steps>
            <li>Install the 1Password extension in Zephium, as above, and the 1Password desktop app. Open and unlock the desktop app.</li>
            <li>
              In 1Password, open <Path steps={["Settings", "Browser"]} />, turn on{" "}
              <strong>Connect with 1Password in the browser</strong>, and choose{" "}
              <strong>Add Browser</strong> under additional browsers.
            </li>
            <li>Select the Zephium application you actually use.</li>
            <li>
              Return to Zephium and reopen the extension. If it still shows a loading indicator, quit and
              reopen Zephium fully.
            </li>
          </Steps>
          <p>
            Follow 1Password&apos;s own{" "}
            <a href="https://support.1password.com/additional-browsers/">additional-browser instructions</a>{" "}
            for the details on your system. Features such as HTTP authentication autofill, idle detection and
            extension-managed downloads are not available. Browser passkeys depend on your system.
          </p>
        </>
      ),
    },
  ],
};
