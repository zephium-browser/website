import Link from "next/link";
import { H3, Keys, Note, Path, Steps, Table } from "../doc-parts";
import type { Doc } from "./types";

export const work: Doc = {
  lede: (
    <>
      Work turns the browser into a canvas. You describe an outcome in your own words, helpers browse live
      pages in plain sight, and what they find is laid out where you can read it, check it and keep it.
      Anything that posts, merges or changes something waits for your OK.
    </>
  ),
  sections: [
    {
      id: "overview",
      title: "What Work is",
      body: (
        <>
          <p>
            Your work already happens in the browser, where your tabs, logins and history are. Work brings
            agents there instead of asking you to move somewhere else, and lets you watch them do it. Each
            request becomes a <strong>work</strong>: a canvas with your words, the helpers doing the
            reading, and the result.
          </p>
          <p>
            Switch with <strong>Browse</strong> and <strong>Work</strong> at the top of the sidebar. In
            Work the sidebar folds into its rail, and the canvas takes the window.
          </p>
          <p>Work needs three things:</p>
          <ul>
            <li>
              <strong>A model.</strong> Zephium AI, your own key, or a model on your computer. See{" "}
              <Link href="/docs/models">Models and keys</Link>.
            </li>
            <li>
              <strong>A regular profile.</strong> Work is not available in private windows.
            </li>
            <li>
              <strong>AI switched on.</strong> It is on by default. You can turn Work, or AI as a whole,
              off in <Path steps={["Settings", "Features"]} />; the browser stays complete, and nothing
              you set up is deleted.
            </li>
          </ul>
        </>
      ),
    },
    {
      id: "start",
      title: "Start a work",
      body: (
        <>
          <p>
            A new work opens on <strong>What should we get done?</strong> Type into the bar, or start
            from a workflow. Workflows are grouped by what you do, for Developer, Designer, Marketing,
            Manager, Student, Office and Founder, and each one asks for just what it needs.
          </p>
          <Table
            caption="Some of the workflows"
            head={["Workflow", "What you get"]}
            rows={[
              ["Plan my day", "Your calendar, mail, Slack and tasks as one timed plan"],
              ["Weekly status", "Shipped, in progress and blocked, ready to post"],
              ["Explain code", "How a file, a function or a flow works, drawn as it runs"],
              ["Review a change", "Real problems, exact fixes, and the review comment drafted"],
              ["Fix a failing test", "Finds the cause, fixes it, and shows the tests passing"],
              ["Competitor landscape", "Who you are up against, and how each one pitches and prices"],
              ["Campaign plan", "Dated steps on the right channels, with the launch posts drafted"],
              ["Learning path", "Free university courses, books and lectures, week by week"],
              ["Meeting prep", "Who is coming, your history with them, and what to raise"],
            ]}
          />
          <p>
            You do not need a workflow. Describe what you want: plan a trip, compare vendors, design a
            system, fix a bug. Press <kbd>Return</kbd> to begin, or add what matters first.
          </p>
          <ul>
            <li>
              <strong>Choose the model</strong> from the chip in the bar. Its effort control trades speed
              for depth, from <strong>Low</strong> to <strong>Max</strong>.
            </li>
            <li>
              <strong>Dictate</strong> with the microphone or <Keys keys="⌘ ⇧ D" /> (
              <Keys keys="Ctrl Shift D" />). Your words land in the bar for you to check before sending.
            </li>
            <li>
              <strong>Add context</strong> with the attach button: tabs, notes, files, links and folders.
              See <a href="#canvas">The canvas</a>.
            </li>
          </ul>
        </>
      ),
    },
    {
      id: "run",
      title: "How a run goes",
      body: (
        <>
          <p>A run reads from left to right across the canvas.</p>
          <Steps>
            <li>
              <strong>It starts from what you have.</strong> Your words sit on the canvas with the things
              they drew on beside them: your memory, a skill it loaded, notes, history, open tabs, files.
              You see each one as it is used.
            </li>
            <li>
              <strong>Helpers work in parallel, in the open.</strong> For a trip, one helper looks for
              places to stay while another checks visas and a third compares flights. Each browses live
              pages you can watch in small windows, and each is named by what it is doing: searching,
              reading, using the page, checking, comparing, writing.
            </li>
            <li>
              <strong>Results gather on the right.</strong> As helpers finish, what they produced joins the
              answer. Sources are listed under it, including the pages that would not open.
            </li>
          </Steps>
          <p>
            Any source opens in a pane beside the canvas, without leaving Work. Press <kbd>Esc</kbd> to
            close the pane, or <Keys keys="⌘ ⇧ Return" /> (<Keys keys="Ctrl Shift Enter" />) to open it in
            Browse. <strong>Agents in this run</strong> lists who is doing what right now.
          </p>
        </>
      ),
    },
    {
      id: "steer",
      title: "Steer, stop and help",
      body: (
        <>
          <ul>
            <li>
              <strong>Stop</strong> ends the run at any time.
            </li>
            <li>
              <strong>Steer</strong> hands the agent something new at its next move. Type into{" "}
              <strong>Add to this…</strong> while it works.
            </li>
            <li>
              <strong>Answer</strong> when it asks. A question waits in the open with{" "}
              <strong>Waiting for your answer</strong> until you reply, and you can answer in your own
              words.
            </li>
            <li>
              <strong>Follow up</strong> with <strong>Message the agent…</strong> once it has finished.
            </li>
          </ul>
          <H3 id="help">When a page needs a person</H3>
          <p>
            Some pages need you: a sign-in, a check that wants to know you are a person, a permission only
            you can give, or a choice only you should make. Work stops on that page, says why, and opens it
            for you in a pane marked <strong>Help the agent</strong>. Do what the page needs, then choose{" "}
            <strong>I&apos;m done, continue</strong>. If you would rather not, choose{" "}
            <strong>Skip this page</strong> and the agent goes on without it. If you need longer, choose{" "}
            <strong>Keep waiting</strong>. It waits up to 90 seconds more.
          </p>
        </>
      ),
    },
    {
      id: "results",
      title: "Results",
      body: (
        <>
          <p>
            Results stay on the canvas, not in a chat scroll. Depending on the request, they are an
            answer, a table, a chart, a comparison, a plan, a list, a diagram, code, a change to a file, a
            document, a draft, a page, a note or a whole folder or project.
          </p>
          <ul>
            <li>
              <strong>Ask about this</strong> starts a follow-up about one result, with that result as
              context.
            </li>
            <li>
              <strong>Make tasks</strong> turns each step of a plan into a task for you, linked back to the
              work. They appear in Tasks.
            </li>
            <li>
              <strong>Save as note</strong> keeps anything worth keeping as a note.
            </li>
            <li>
              Tables can be sorted and copied as CSV; comparisons can be set side by side; code and answers
              have a copy button.
            </li>
          </ul>
          <p>
            Comparisons mark how well each claim is supported: <strong>Supported</strong>,{" "}
            <strong>Inferred</strong>, <strong>Unverified</strong> or <strong>Contradicted</strong>. Open any
            source to check.
          </p>
        </>
      ),
    },
    {
      id: "canvas",
      title: "The canvas",
      body: (
        <>
          <p>
            The canvas is yours as well as the agents&apos;. Scroll to pan, pinch to zoom, press{" "}
            <kbd>0</kbd> to fit everything and <kbd>1</kbd> for actual size.
          </p>
          <ul>
            <li>
              <strong>Add to canvas</strong> brings in open tabs, notes, images and PDFs, links, and
              folders. Adding a tab keeps its identity; it does not share the page with a model.
            </li>
            <li>
              <strong>Note</strong> drops a coloured sticky note. <strong>Blocks</strong> adds a note, a
              checklist, a table or a calendar to fill in yourself.
            </li>
            <li>
              Select objects and choose <strong>Ask</strong> to use them as context. Work shows how many
              are selected, whether they are private, and how much will leave your device. Choose{" "}
              <strong>Arrange</strong> to tidy them into a grid, a row or a stack.
            </li>
          </ul>
          <H3 id="works">Your works</H3>
          <p>
            The name at the top left of the canvas opens your works. Search them, start a{" "}
            <strong>New work</strong>, rename one, or archive it with <strong>Archive Work</strong> and bring
            it back with <strong>Restore</strong>. A work that grows full asks you to start a new one.
          </p>
        </>
      ),
    },
    {
      id: "permissions",
      title: "What agents may do",
      body: (
        <>
          <p>
            Agents start with little and ask for more. The rule of thumb: reading is cheap, changing
            things waits for you.
          </p>
          <Table
            caption="What Work asks about"
            head={["It wants to", "What happens"]}
            rows={[
              [
                "Use your history, notes or open tabs",
                "It asks once for this work, and says what it would see: titles and addresses for history and tabs, titles and short passages for notes.",
              ],
              [
                "Read a folder",
                "You grant the folder, for this work. Its files are read, and nothing is changed without asking. A change appears as a proposal and is written only after you approve it.",
              ],
              [
                "Run a command",
                "Commands that only look at a project may run without asking. Others show the command and why it needs permission, and wait. You can allow commands that change files in one folder for the rest of the work.",
              ],
              [
                "Work in a site as you",
                "Per site you choose Always, Ask or Never. Banks, payments and health sites are never used without asking.",
              ],
              [
                "Send, post, merge, delete or save",
                "It prepares a draft or a plan and waits for you to approve it exactly as written.",
              ],
              [
                "Look at a page as a picture",
                "When the text is not enough, Work can send a picture of the page to your model. On sites where you are signed in, it asks first.",
              ],
              [
                "Use a connected tool",
                "It asks once before using a tool on your computer or a server, and any call that changes something asks you first.",
              ],
            ]}
          />
          <Note kind="careful" title="About commands">
            <p>
              Commands can reach anything your account can. Approving them only decides when Zephium asks,
              not what a command is able to do, so read what you approve.
            </p>
          </Note>
          <p>
            <strong>Site access.</strong> In <Path steps={["Settings", "Site access"]} /> you see every site
            where you answered Always or Never, and can change or forget any of them. <em>Always</em> means
            the agent works in your signed-in session without asking. <em>Never</em> means it reads only the
            site&apos;s public pages, in a private session. Sites not listed are asked about once per run.
          </p>
          <p>
            <strong>Pictures of pages.</strong> <Path steps={["Settings", "Work"]} /> has{" "}
            <strong>Let Work look at pages</strong> and the list of sites Work may look at. It also holds{" "}
            <strong>Work&apos;s website data</strong>, which is kept apart from your own browsing data and
            can be cleared there.
          </p>
        </>
      ),
    },
    {
      id: "skills",
      title: "Skills, memory and connections",
      body: (
        <>
          <H3 id="skills-list">Skills</H3>
          <p>
            A skill is a short set of instructions the agent loads when a request fits. Zephium ships with
            25, including trip planning, research, compare and choose, plan my day, fix a bug and weekly
            status. In <Path steps={["Settings", "Skills"]} /> you can read them, <strong>Duplicate</strong>{" "}
            one to start your own, <strong>Customize</strong> one to replace it with your version, or make a{" "}
            <strong>New skill</strong>: a name, one line on when to use it, and the instructions. Yours live
            in your profile, and replace a built-in of the same name.
          </p>
          <H3 id="memory">Memory</H3>
          <p>
            Work remembers what is worth keeping: that you prefer aisle seats, who Anna is, what a project
            is. <Path steps={["Settings", "Memory"]} /> lists every memory with where it came from. Edit,
            add or forget any of them, or forget everything. It never keeps passwords, keys or card
            numbers. A run also shows what it remembered, with an <strong>Undo</strong>.
          </p>
          <H3 id="connections">Connections</H3>
          <p>
            <Path steps={["Settings", "Connections"]} /> is where Work reaches past the browser.
          </p>
          <ul>
            <li>
              <strong>On this computer:</strong> the GitHub CLI and Git, and Claude Code and Codex, which
              take on larger coding jobs for Work. Each shows whether it is installed and signed in.
            </li>
            <li>
              <strong>Servers:</strong> MCP servers give Work more tools, such as Linear, Notion, Sentry,
              Stripe and Figma. Choose <strong>Add…</strong> and either give an address or the command that
              starts one on your computer, and sign in. Tokens are kept in secure storage on your device,
              and a call that changes something asks you first.
            </li>
          </ul>
        </>
      ),
    },
    {
      id: "off",
      title: "Turning Work off",
      body: (
        <p>
          Open <Path steps={["Settings", "Features"]} />. Turning off <strong>Work</strong> removes the
          switch and the canvas; turning off <strong>AI</strong> also stops every model, the agents and
          dictation. Work that is running stops. Nothing is deleted, and your keys stay saved. Turn them
          back on and everything is where you left it.
        </p>
      ),
    },
  ],
};
