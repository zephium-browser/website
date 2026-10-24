import Link from "next/link";
import { Keys, Note, Path } from "../doc-parts";
import type { Doc } from "./types";

export const askZephium: Doc = {
  lede: (
    <>
      Ask Zephium is the assistant in your sidebar. It reads the page in front of you, answers with sources
      you can click, opens the tabs worth opening, does small things on the page when you ask, restyles a
      site, and hands bigger jobs to Work. It uses the model you choose and only runs when you ask.
    </>
  ),
  sections: [
    {
      id: "open",
      title: "Open it",
      body: (
        <>
          <p>
            Press <Keys keys="⌘ E" /> on macOS or <Keys keys="Ctrl E" /> on Windows. You can also choose{" "}
            <strong>Zephium AI</strong> from the tools at the foot of the sidebar, or right-click a tab and
            choose <strong>Ask Zephium</strong>.
          </p>
          <p>
            The panel opens beside your tabs with a greeting for the page you are on, and a few things to
            try: <strong>Summarize</strong>, <strong>Key points</strong>, <strong>Key numbers</strong>,{" "}
            <strong>What&apos;s the catch?</strong>, <strong>Explain it simply</strong>,{" "}
            <strong>List the steps</strong> and <strong>Compare the options</strong>. Or type into{" "}
            <strong>Ask Zephium…</strong>.
          </p>
          <Note kind="tip" title="It needs a model">
            <p>
              Ask Zephium runs on a model: Zephium AI, your own key, or one on your computer. If none is
              chosen, it says so and links to <Path steps={["Settings", "Models"]} />. See{" "}
              <Link href="/docs/models">Models and keys</Link>.
            </p>
          </Note>
        </>
      ),
    },
    {
      id: "ask",
      title: "Ask about a page",
      body: (
        <>
          <p>
            There is one conversation per space, and it follows you from tab to tab. The page in front is
            attached to the question as a chip, not locked to the conversation, so you can keep asking
            as you move on.
          </p>
          <p>
            The <strong>Add</strong> button in the box where you type has the options:
          </p>
          <ul>
            <li>
              <strong>Attach this page</strong>, if you removed it, and <strong>Attach another tab</strong>{" "}
              to bring a second page into the question, such as to compare two.
            </li>
            <li>
              <strong>Pick an element</strong> lets you click one part of the page to ask about. Press{" "}
              <kbd>Esc</kbd> to stop picking.
            </li>
            <li>
              Select text on the page and it is attached as <strong>Selection</strong>. Use it when a
              page is too large to read in one go.
            </li>
          </ul>
          <p>Remove anything attached with the cross on its chip.</p>
          <p>
            Answers stream in as you read. Numbered marks in them are sources: choose one and Zephium
            scrolls to that passage on the page and marks it with a highlight under the quote for a
            moment. If the page has changed since the reply, it tells you it could not find the passage.
          </p>
        </>
      ),
    },
    {
      id: "open-tabs",
      title: "Open what is worth it",
      body: (
        <>
          <p>
            Ask for the best listings, the sources, or the links that matter, and Zephium shows them as
            numbered cards. Point at a card and its place on the page lights up; press it and the page
            comes forward. <kbd>Cmd</kbd>-click (<kbd>Ctrl</kbd>-click on Windows) opens that item&apos;s own
            page in a new tab.
          </p>
          <p>
            You can also ask it to open them for you. Zephium opens up to eight tabs at a time, in the
            background, never in front of what you are doing, and says how many it opened. It only opens
            addresses that came from a page it read in this conversation, or that you wrote.
          </p>
        </>
      ),
    },
    {
      id: "steps",
      title: "Let it do small things on the page",
      body: (
        <>
          <p>
            Zephium can take light steps on the page in front of you when you ask: pressing a button,
            filling in a field, scrolling to a part. While it works, a glow runs along the edges of the
            tab and the panel lists each step.
          </p>
          <ul>
            <li>
              <strong>It asks before anything that matters.</strong> A step that sends something, spends
              money, deletes or cancels something, saves a change or edits a document stops on a card
              that says what it would do on that site, headed <strong>Needs your approval</strong>.
              Press the button named after the control, or choose <strong>Not now</strong>.
            </li>
            <li>
              <strong>It stays out of passwords.</strong> It does not type into password, card or
              one-time-code fields.
            </li>
            <li>
              <strong>You can take over.</strong> If you click, type or scroll on the page while it works,
              it steps back and says so. <strong>Continue</strong> makes it read the page again first.
              <strong> Stop</strong> works at any time.
            </li>
          </ul>
          <p>
            It can also go to another page and carry on there. It only goes to a link it read on a page,
            an address you wrote, a tab you have open, or a search on your own search engine, so an
            address it invents never opens.
          </p>
          <p>
            A page that insists on a real person&apos;s click will not respond to a step. Zephium then
            reports that the step did not work instead of pretending it did.
          </p>
        </>
      ),
    },
    {
      id: "styles",
      title: "Restyle a site",
      body: (
        <>
          <p>
            Ask it to <strong>Redesign this page</strong>, <strong>Make it darker</strong> or{" "}
            <strong>Make it easier to read</strong>, or describe your own change. Zephium proposes a
            style and shows it on the page. Nothing stays until you choose <strong>Apply</strong>;{" "}
            <strong>Discard</strong> drops it.
          </p>
          <ul>
            <li>A style applies only to that site, and Zephium says which.</li>
            <li>
              A style is only a change of looks, written as CSS. It cannot add text, run scripts or load
              anything.
            </li>
            <li>
              Turn a style off or on, or remove it, from the card or from{" "}
              <strong>Page styles of this site</strong> in the panel&apos;s menu. Each site holds a limited
              number of styles; Zephium tells you when one is full.
            </li>
          </ul>
        </>
      ),
    },
    {
      id: "handoff",
      title: "Hand a bigger job to Work",
      body: (
        <>
          <p>
            When a request is more than a question, Zephium offers to continue it in Work. It shows a card
            with a title, a summary and what it brings along: the conversation so far and the tabs
            involved. Nothing starts until you choose <strong>Continue in Work</strong>, and Work still asks
            before it changes files or runs anything. See{" "}
            <Link href="/docs/work">Work and agents</Link>.
          </p>
        </>
      ),
    },
    {
      id: "conversations",
      title: "Your conversations",
      body: (
        <>
          <p>
            Start a fresh thread with <strong>New conversation</strong>. Earlier ones are under{" "}
            <strong>History</strong> in the panel, where you can reopen or delete them. Zephium keeps up
            to 200 per profile on your device. They are cleared with your browsing data and are never
            kept from private windows.
          </p>
        </>
      ),
    },
    {
      id: "models-cost",
      title: "Models and cost",
      body: (
        <>
          <p>
            Pick the model from the chip in the panel; it is the same chip Work uses. Each reply shows
            what it cost: the model and its credits for Zephium AI, an estimate in dollars on your own
            key, or &ldquo;on this device&rdquo; for a local model.
          </p>
          <p>
            If you run out of included credits, Zephium says so and offers <strong>Buy credits</strong>.
            With a missing or refused key, it offers <strong>Open models</strong>.
          </p>
        </>
      ),
    },
    {
      id: "limits",
      title: "Where it will not go",
      body: (
        <>
          <ul>
            <li>
              <strong>Private windows.</strong> It is off while you browse privately, so nothing about
              your pages leaves the window.
            </li>
            <li>
              <strong>Sensitive sites.</strong> Banks, payments, health and government pages are never
              read, whatever you ask.
            </li>
            <li>
              <strong>Pages that are not pages.</strong> A PDF, a file or a built-in page is not read.
            </li>
            <li>
              <strong>When AI is off.</strong> Turn it on in{" "}
              <Path steps={["Settings", "Features"]} /> to talk with Zephium.
            </li>
          </ul>
          <Note kind="careful">
            <p>
              Reading the pages you have open is the newest part of Ask Zephium, and it has been tried
              most on macOS. If Zephium cannot read pages on your system, it says so in the panel; page
              styles you already made still apply.
            </p>
          </Note>
        </>
      ),
    },
  ],
};
