import Link from "next/link";
import { site } from "@/lib/site";
import { H3, Note, Path, Table } from "../doc-parts";
import type { Doc } from "./types";

export const privacy: Doc = {
  lede: (
    <>
      Zephium is built so that you do not have to trust it blindly. It is open source, it collects nothing
      about how you browse, and your data lives on your device. This page says what that means in practice,
      and where the guarantees stop.
    </>
  ),
  sections: [
    {
      id: "short",
      title: "The short version",
      body: (
        <>
          <ul>
            <li>
              <strong>No telemetry.</strong> Zephium does not collect or send anything about how you browse.
            </li>
            <li>
              <strong>No account needed.</strong> History, tasks, notes, memory and time live on your
              device. An account is only for Zephium AI, and until you sign in, Zephium does not contact our
              servers.
            </li>
            <li>
              <strong>Zephium AI keeps no content.</strong> Requests pass through to the model that answers
              them. We count usage for your plan, never store prompts, answers or pages, and never see your
              card.
            </li>
            <li>
              <strong>Private windows keep nothing</strong> once they close.
            </li>
          </ul>
          <p>
            The full policy is on the <Link href="/privacy">privacy page</Link>. This page is the practical
            version.
          </p>
        </>
      ),
    },
    {
      id: "data",
      title: "Where your data lives",
      body: (
        <>
          <p>
            History, open tabs, bookmarks, tasks, notes, Work, memory and time are stored on your computer,
            in the profile they belong to. Each profile keeps its own website data and its own history,
            session and icons, apart from every other profile. Notes are plain Markdown files in a folder
            you own. Time is counted on this device only.
          </p>
          <p>
            You can remove any of it. <strong>Clear…</strong> in History, or{" "}
            <Path steps={["Settings", "Privacy & security"]} />, clears browsing history for a time range.
            Deleting a profile removes everything in it from the device.
          </p>
          <H3 id="contacts">What Zephium connects to</H3>
          <p>Zephium talks to these, and to nothing about how you browse:</p>
          <Table
            caption="Connections Zephium makes"
            head={["When", "Who it talks to", "What it is for"]}
            rows={[
              ["You open a website", "That website", "The page itself. Sites see what any site sees in any browser, such as your IP address."],
              ["You search", "Your search engine", "The search. With search suggestions on, partial searches go there too."],
              ["Regularly, in the background", "GitHub", "Checking for and downloading updates."],
              ["Every day or so", "easylist.to", "Fresh ad and tracker filter lists. A copy ships with the app."],
              ["You install an extension", "Google", "The extension package and its updates, directly from the Chrome Web Store."],
              ["You use Zephium AI", "Zephium's servers, then the model provider", "Your request and the answer. Not stored by us."],
              ["You use your own key", "That provider only", "Your request and the answer, directly."],
            ]}
          />
          <p>
            With a model on your computer, nothing leaves it.
          </p>
        </>
      ),
    },
    {
      id: "blocker",
      title: "Ads and trackers",
      body: (
        <>
          <p>
            The blocker is built into Zephium and on by default for every profile. It is native, written in
            Rust on Brave&apos;s open-source adblock engine, and uses the EasyList and EasyPrivacy filter
            lists. It stops requests before a page can make them, so there is nothing to install and
            nothing sitting inside the page. Blocking decisions happen on your device, and the pages you
            visit are not reported to anyone.
          </p>
          <ul>
            <li>
              <strong>See it work.</strong> The New Tab page counts what was blocked today.
            </li>
            <li>
              <strong>Pause it on one site.</strong> Open the sidebar menu and turn off{" "}
              <strong>Block Ads and Trackers</strong> for that site, then reload the page.
            </li>
            <li>
              <strong>Hide something it missed.</strong> Choose <strong>Hide Elements…</strong>, click the
              part of the page you do not want, and Zephium keeps it hidden.
            </li>
            <li>
              <strong>Turn it off or refresh the lists.</strong> Both are in{" "}
              <Path steps={["Settings", "Privacy & security"]} />, under Ad &amp; tracker protection.
            </li>
          </ul>
          <Note kind="careful" title="What it does not do">
            <p>
              The blocker works on network requests and on hiding page elements. It does not rewrite
              scripts, and it does not claim to match uBlock Origin or Safari&apos;s blockers rule for
              rule. A request a page has already made cannot be blocked after the fact.
            </p>
          </Note>
        </>
      ),
    },
    {
      id: "models",
      title: "Models and agents",
      body: (
        <>
          <p>
            Using AI sends words to a model, so Zephium is careful about what, to whom, and when.
          </p>
          <ul>
            <li>
              <strong>You choose where it goes.</strong> To Zephium AI, to a provider with your key, or to a
              model on your own computer. Your keys are kept in your system&apos;s credential store and each
              is sent only to its own provider.
            </li>
            <li>
              <strong>Agents show their sources.</strong> When an agent works, you see on the canvas which
              pages and notes it uses. It asks once before using your history, notes, open tabs or a folder,
              says what it would see, and keeps to those for that work.
            </li>
            <li>
              <strong>Sensitive sites need your say-so.</strong> Banks, payments and health sites are never
              used without asking, and Ask Zephium never reads banks, payments, health or government pages.
            </li>
            <li>
              <strong>Pictures of pages are your choice.</strong> Work sends a picture of a page to your model
              only when its text is not enough, and asks first on sites where you are signed in. You can turn
              it off.
            </li>
            <li>
              <strong>Memory keeps no secrets.</strong> It never keeps passwords, keys or card numbers, and
              you can read, edit and forget everything it remembers.
            </li>
            <li>
              <strong>Private windows are off limits.</strong> Neither Ask Zephium nor Work runs in them.
            </li>
          </ul>
          <p>
            What a provider does with what it receives is governed by your agreement with them. With Zephium
            AI, our servers do not store prompts, answers, page content, images or audio; how long the model
            provider keeps what it receives depends on that provider&apos;s own terms. See the{" "}
            <Link href="/privacy">privacy policy</Link> and <Link href="/docs/work#permissions">what agents
            may do</Link>.
          </p>
        </>
      ),
    },
    {
      id: "sites",
      title: "How sites are kept in their place",
      body: (
        <>
          <p>
            Zephium draws pages with the web engine your system already has: WebKit on macOS, the engine
            Safari uses, and WebView2 on Windows. Each tab is an ordinary web view with no access to
            Zephium&apos;s own interface or its native commands. The part of Zephium that holds your tabs,
            storage, blocker, extensions and agents is separate, and written in Rust.
          </p>
          <ul>
            <li>
              A site that asks to use your camera or microphone asks you first, and an indicator shows while
              either is in use, with a button to stop it.
            </li>
            <li>
              Pop-ups are blocked, and a page that wants to open a link in another app asks first.
            </li>
            <li>
              A site whose identity Zephium cannot confirm is not opened, and a page without an encrypted
              connection is marked in the address field.
            </li>
            <li>
              Passkeys can be switched on in <Path steps={["Settings", "Privacy & security"]} />.
            </li>
          </ul>
          <p>
            Extensions are installed from the original package, with a review of the access they ask for.
            An update cannot widen that access without asking you. See{" "}
            <Link href="/docs/extensions">Extensions</Link>.
          </p>
        </>
      ),
    },
    {
      id: "updates",
      title: "Updates and downloads",
      body: (
        <>
          <p>
            Zephium updates itself from GitHub Releases. Updates are signed, and Zephium checks the
            signature before it installs. When your system has security updates waiting, or Windows needs to
            update WebView2, Zephium tells you, because the web engine is part of your protection.
          </p>
          <p>
            Windows builds are not code-signed yet, so SmartScreen may warn you the first time. See{" "}
            <Link href="/docs/getting-started#install">Getting started</Link>.
          </p>
        </>
      ),
    },
    {
      id: "limits",
      title: "Where the guarantees stop",
      body: (
        <>
          <p>We would rather say this plainly than leave you to find it.</p>
          <ul>
            <li>
              Zephium relies on the engine your system provides, so it has that engine&apos;s protections and
              its limits. It does not claim the full site isolation that Chromium has on every platform.
            </li>
            <li>
              Zephium does not encrypt your profile on its own. Your computer&apos;s account and disk
              encryption protect it.
            </li>
            <li>
              Zephium does not include its own phishing or malware scanning, and does not promise to catch
              every harmful download.
            </li>
            <li>
              It is in beta. If something is not right, please open an issue.
            </li>
          </ul>
        </>
      ),
    },
    {
      id: "open",
      title: "Open source, and reporting a problem",
      body: (
        <>
          <p>
            Zephium is open source under the {site.license}, so every claim here can be checked against{" "}
            <a href={site.repo}>its source code</a>. The backend behind Zephium AI is a separate repository
            under the {site.backendLicense}.
          </p>
          <p>
            If you find a vulnerability, please report it privately and not in a public issue: write to{" "}
            <a href={`mailto:${site.contact.security}`}>{site.contact.security}</a>, or use the security
            tab of <a href={`${site.repo}/security`}>the repository</a>.
          </p>
        </>
      ),
    },
  ],
};
