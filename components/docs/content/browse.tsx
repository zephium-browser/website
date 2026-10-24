import Link from "next/link";
import { Keys, Note, Path, Steps, H3 } from "../doc-parts";
import type { Doc } from "./types";

export const browse: Doc = {
  lede: (
    <>
      Browse is Zephium as a browser: tabs in a quiet sidebar, spaces for the parts of your life, a
      launcher that works from any app, and Tasks, Notes and Time one click away. Everything here works
      without an account and without AI.
    </>
  ),
  sections: [
    {
      id: "sidebar",
      title: "The sidebar",
      body: (
        <>
          <p>
            Tabs live in a sidebar on the left, not in a bar across the top. From the top down it holds
            back, forward and reload, the <strong>Browse</strong> and <strong>Work</strong> switch, the
            address field, your space, the list of tabs and, at the foot, your Essentials and the profile
            button.
          </p>
          <p>
            The address field shows only the site&apos;s name while you read. Click it, or press{" "}
            <Keys keys="⌘ L" /> (<Keys keys="Ctrl L" /> on Windows), to see the whole address and type a
            new one. Press <kbd>Return</kbd> to go, <kbd>Esc</kbd> to leave it.
          </p>
          <p>
            Drag the edge of the sidebar to resize it. Drag it narrow, or press <Keys keys="⌘ ⇧ S" />{" "}
            (<Keys keys="Ctrl Shift S" />), and it folds into a slim rail of icons. That is{" "}
            <strong>Compact mode</strong>. Work always uses the rail.
          </p>
          <H3 id="tabs">Working with tabs</H3>
          <p>Right-click a tab for its menu:</p>
          <ul>
            <li>
              <strong>Reload Tab</strong>, <strong>Duplicate Tab</strong>, <strong>Copy Link</strong> and{" "}
              <strong>Bookmark Tab</strong>.
            </li>
            <li>
              <strong>Add to Essentials</strong> and <strong>Move Tab to Space</strong>.
            </li>
            <li>
              <strong>Ask Zephium</strong> and <strong>Open in Split View</strong>.
            </li>
            <li>
              <strong>Close Tab</strong>, <strong>Close Other Tabs</strong> and{" "}
              <strong>Close Tabs Below</strong>.
            </li>
          </ul>
          <p>
            Closed a tab by mistake? <strong>Reopen Closed Tab</strong> brings it back with{" "}
            <Keys keys="⌘ ⇧ T" /> (<Keys keys="Ctrl Shift T" />).
          </p>
          <p>
            <Path steps={["Settings", "Tabs"]} /> sets where new tabs open, which tab you return to after
            closing one, whether opening a page you already have switches to it, whether a playing video
            keeps playing in a small window when you change tabs, where links from other apps open, and
            when tabs you stop using close on their own and stay in History.
          </p>
          <H3 id="sleep">Sleeping tabs</H3>
          <p>
            Tabs you have not used for a while go to sleep to free memory, and wake when you return to
            them. By default that is after 15 minutes. Tabs that play media or hold unsaved input never
            sleep. Change this in <Path steps={["Settings", "Performance"]} />, where you can also keep
            chosen sites awake.
          </p>
        </>
      ),
    },
    {
      id: "spaces-profiles",
      title: "Spaces and profiles",
      body: (
        <>
          <p>
            A <strong>space</strong> is a set of tabs for one part of your life: Work, Reading, a side
            project. Tabs you open stay with the space they were opened in. A <strong>profile</strong> is
            a whole separate browser: each one keeps its own sign-ins, history, tabs, extensions and Work.
            Your Zephium account, if you have one, is shared by all profiles.
          </p>
          <H3 id="spaces">Spaces</H3>
          <Steps>
            <li>
              Choose the space name at the top of the tab list, then <strong>New Space</strong>.
            </li>
            <li>
              Give it a name, an icon or an emoji, a color and, if you like, its own theme. The window
              wears the theme while you are in that space.
            </li>
            <li>
              Switch with the same menu, with <Keys keys="⌘ ⌥ →" /> and <Keys keys="⌘ ⌥ ←" />, or jump
              to one directly with <Keys keys="⌃ 1–9" />. On Windows the keys are{" "}
              <Keys keys="Ctrl Alt →" />, <Keys keys="Ctrl Alt ←" /> and <Keys keys="Ctrl Shift 1–9" />.
            </li>
          </Steps>
          <p>
            To change or remove a space, choose <strong>Edit Space</strong>. Deleting a space closes its
            tabs, and Zephium tells you how many before it does.
          </p>
          <H3 id="profiles">Profiles</H3>
          <p>
            Open the profile button at the foot of the sidebar and choose <strong>New Profile…</strong>.
            Give it a name and a picture, then <strong>Create Profile</strong>, or{" "}
            <strong>Create and Switch</strong> to move this window into it. Edit a profile from the same
            menu or in <Path steps={["Settings", "Profiles"]} />.
          </p>
          <p>
            Deleting a profile removes its history, cookies and site data, tabs, extensions and Work
            from this device for good. Your Zephium account is not affected. The default profile cannot
            be deleted, and to delete the one you are in, switch this window to another first.
          </p>
        </>
      ),
    },
    {
      id: "essentials",
      title: "Essentials",
      body: (
        <p>
          Essentials are the sites you open every day, kept at the foot of the sidebar. They load only
          when you open them. Drag a tab onto the row, or right-click it and choose{" "}
          <strong>Add to Essentials</strong>. To take one off, right-click it and choose{" "}
          <strong>Remove from Essentials</strong>.
        </p>
      ),
    },
    {
      id: "new-tab",
      title: "The New Tab page",
      body: (
        <>
          <p>
            A new tab opens on a search field and the Zephium wordmark. Under it are the time and date,
            and a row of cards that appear when they have something to say: <strong>Ads &amp; trackers
            blocked</strong> today, time <strong>Focused</strong> against your goal, and tasks{" "}
            <strong>Due today</strong>.
          </p>
          <p>
            Choose the gear in the corner, or open <Path steps={["Settings", "New Tab"]} />, to show a
            greeting, use your name in it, show or hide the clock, pick 12 or 24 hours, and count what is
            due on the Tasks shortcut.
          </p>
        </>
      ),
    },
    {
      id: "search",
      title: "Search",
      body: (
        <>
          <p>
            Search from the address field, the New Tab page or the launcher. The default engine is
            DuckDuckGo. In <Path steps={["Settings", "Search"]} /> you can choose Google, Bing or Brave,
            or add your own with a search address that contains the search-terms placeholder shown there.
          </p>
          <p>
            Type <code>!g</code> for Google, <code>!d</code> for DuckDuckGo, <code>!b</code> for Bing or{" "}
            <code>!br</code> for Brave to search one engine for a single query.
          </p>
          <p>
            <strong>Online search suggestions</strong> are off by default. Turning them on sends partial
            searches to your search engine so it can suggest the rest. Matches from your tabs, history
            and notes are found on your device and never sent anywhere.
          </p>
        </>
      ),
    },
    {
      id: "launcher",
      title: "The launcher",
      body: (
        <>
          <p>
            The launcher is a search that opens over any app. Press <Keys keys="⌘ ⇧ Space" /> on macOS
            or <Keys keys="Ctrl Shift Space" /> on Windows, wherever you are. It finds:
          </p>
          <ul>
            <li>open tabs, which you switch to with <kbd>Return</kbd>;</li>
            <li>pages from your history, and recent searches;</li>
            <li>notes, which it opens;</li>
            <li>commands, such as New private window, which it runs;</li>
            <li>answers to sums, which you can copy;</li>
            <li>anything else as a web search, or an address to open.</li>
          </ul>
          <p>
            Write a task the way you would say it, such as &ldquo;call Anna tomorrow at 3&rdquo;, and
            choose <strong>Add to Tasks</strong>. With nothing typed, the footer takes you straight to
            Tasks, Notes, History and Downloads. <Keys keys="⌘ K" /> opens more actions for the selected
            result, such as opening it in a background tab or copying its link.
          </p>
          <p>
            Change the shortcut in <Path steps={["Settings", "Keyboard & accessibility"]} />. On macOS you
            can also open it by tapping Command or Option twice, which needs Accessibility permission so
            Zephium can notice the taps while another app is in front.
          </p>
        </>
      ),
    },
    {
      id: "pages",
      title: "Pages, bookmarks, history and downloads",
      body: (
        <>
          <p>
            <strong>Find on page</strong> is <Keys keys="⌘ F" /> (<Keys keys="Ctrl F" />), with{" "}
            <strong>Find Next</strong> and <strong>Find Previous</strong> on <Keys keys="⌘ G" /> and{" "}
            <Keys keys="⌘ ⇧ G" />. Zoom with <Keys keys="⌘ =" />, <Keys keys="⌘ -" /> and{" "}
            <Keys keys="⌘ 0" /> for actual size.
          </p>
          <H3 id="split-view">Split view</H3>
          <p>
            To see two pages side by side, right-click a tab and choose <strong>Open in Split View</strong>,
            or use <strong>Split View…</strong> in the File menu.
          </p>
          <H3 id="bookmarks">Bookmarks</H3>
          <p>
            Press <Keys keys="⌘ D" /> to bookmark the page you are on. <strong>Bookmarks</strong> in the
            sidebar&apos;s tools lists them, with folders and search.
          </p>
          <H3 id="history">History</H3>
          <p>
            <strong>History</strong> lists the pages you visited, newest first, and you can search it.
            To clear it, choose <strong>Clear…</strong> there and pick the last hour, today, the last 7
            days or all history. You can also use <Path steps={["Settings", "Privacy & security"]} />.
            Private windows add nothing to history.
          </p>
          <H3 id="downloads">Downloads</H3>
          <p>
            <strong>Downloads</strong> shows what is coming in and what has arrived. From a finished
            download you can open the file or show it in its folder. If a download is interrupted, choose{" "}
            <strong>Retry Download</strong>: it can resume for up to five minutes while its tab stays
            open. Choose the folder, and whether to be asked where to save each file, in{" "}
            <Path steps={["Settings", "General"]} />. Windows asks you to confirm every save, and starts
            from the folder you chose.
          </p>
        </>
      ),
    },
    {
      id: "tools",
      title: "Notes, Tasks and Time",
      body: (
        <>
          <p>
            These three live beside your tabs. Open them from the profile button at the foot of the
            sidebar, from the menu bar, or with their shortcuts (see{" "}
            <Link href="/docs/shortcuts#tools">Keyboard shortcuts</Link>). Each can be turned off in{" "}
            <Path steps={["Settings", "Features"]} />. Turning one off hides it and deletes nothing.
          </p>
          <H3 id="notes">Notes</H3>
          <p>
            Each note is a Markdown file in a folder you own, so other apps can open it and edits made
            there show up in Zephium. Write beside the page, type <code>/</code> to choose a style, or
            choose <strong>New Note from Page</strong> to start from where you are. Pin the ones you
            return to. <strong>Show Notes Folder</strong> opens the folder in Finder or File Explorer.
          </p>
          <p>
            Deleted notes wait in <strong>Recently Deleted</strong> for 30 days. If a note changes in
            another app while you have it open, Zephium shows both and lets you choose{" "}
            <strong>Keep Mine</strong> or <strong>Use Other Version</strong>.
          </p>
          <H3 id="tasks">Tasks</H3>
          <p>
            Write a task the way you would say it, such as &ldquo;call Anna tomorrow at 3&rdquo;, and it
            lands on the right day. A task can have a list, a priority, a deadline, subtasks and a
            description, and the page you were on stays linked to it. Look at them as a{" "}
            <strong>List</strong> or a <strong>Board</strong> of To do, In progress, Blocked and Done.
            Tasks that agents make are marked <strong>Created by an agent</strong>. Deleted tasks can be
            restored from the trash.
          </p>
          <H3 id="time">Time and focus</H3>
          <p>
            <strong>Time</strong> shows where your day on the web goes, by hour, day and site, with Browse
            and Work counted apart. It is counted on this device only, and private windows keep no time.
          </p>
          <p>
            To focus, open Time and choose <strong>Start focus</strong>. Pick a length, and whether to
            repeat with breaks. The sites you chose to shut stay closed until the round ends, and a shut
            site offers <strong>Allow 5 minutes</strong> or <strong>End focus</strong> if you need it.
            Choose the sites and your daily goal in <Path steps={["Settings", "Time & focus"]} />.
          </p>
        </>
      ),
    },
    {
      id: "blocker",
      title: "Ads and trackers",
      body: (
        <p>
          The blocker is on by default and needs nothing from you. To pause it on one site, or hide a
          part of a page, open the sidebar&apos;s menu: <strong>Block Ads and Trackers</strong> turns it
          off or on for that site, and <strong>Hide Elements…</strong> lets you click anything you would
          rather not see. How it works, and its limits, are in{" "}
          <Link href="/docs/privacy#blocker">Privacy and security</Link>.
        </p>
      ),
    },
    {
      id: "appearance",
      title: "Appearance",
      body: (
        <>
          <p>
            <Path steps={["Settings", "Appearance"]} /> is where Zephium becomes yours. Choose{" "}
            <strong>System</strong>, <strong>Light</strong> or <strong>Dark</strong>; pick a theme or edit
            its colors, then copy it to share or import one someone gave you; set an accent color, the
            interface font and its size; and choose a sidebar that is <strong>Expanded</strong> or{" "}
            <strong>Compact</strong>, and a comfortable or compact density.
          </p>
          <p>
            <strong>Window material</strong> is what the window itself is made of. On macOS that is Liquid
            Glass (which needs macOS 26), Vibrancy or Solid. On Windows it is Acrylic, Mica or Solid. <strong>Automatic</strong>{" "}
            picks the best your system offers. <strong>Reduce motion</strong> keeps transitions subtle,
            and your system&apos;s own preference always takes priority.
          </p>
        </>
      ),
    },
    {
      id: "private",
      title: "Private windows",
      body: (
        <>
          <p>
            Press <Keys keys="⌘ ⇧ N" /> (<Keys keys="Ctrl Shift N" />) for a private window. Site data
            from it is discarded when it closes, and it adds nothing to history or Time. Zephium&apos;s
            assistant is off in private windows, and Work needs a regular profile, so nothing about the
            pages leaves the window.
          </p>
          <Note kind="careful">
            <p>
              A private window keeps nothing on your computer, but it does not hide you from the sites
              you visit, your network or your employer.
            </p>
          </Note>
        </>
      ),
    },
  ],
};
