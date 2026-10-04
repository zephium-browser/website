import {
  Add01Icon,
  ArrowDown01Icon,
  CheckmarkCircle02Icon,
  CircleIcon,
  File01Icon,
  Folder01Icon,
  GitBranchIcon,
  GitForkIcon,
  Home01Icon,
  InboxIcon,
  LayerIcon,
  Loading03Icon,
  Menu01Icon,
  Search01Icon,
  StarIcon,
  Target02Icon,
  UserCircleIcon,
  ViewIcon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon, type IconSvgElement } from "@hugeicons/react";
import { siGithub } from "simple-icons";
import { Mark } from "@/components/browser/marks";
import { trip } from "@/lib/demo-trip";
import styles from "./tab-pages.module.css";

/*
 * The pages behind the sidebar's tabs, drawn in HTML so they reflow to any
 * window. Each wears its own site's chrome, so the window plainly shows other
 * people's sites opened in Zephium: a team's issues in Linear, a shot list in
 * Notion, the repository on GitHub, and the two made-up booking sites of the
 * Work demo. Likenesses with made-up content, enough to make it feel lived in.
 */

function Icon({ icon, className }: { icon: IconSvgElement; className?: string }) {
  return <HugeiconsIcon icon={icon} className={className} strokeWidth={1.7} aria-hidden />;
}

/* Linear */

const ISSUES = [
  {
    group: "In Progress",
    tone: "progress",
    rows: [
      { id: "ZEP-412", title: "Island keeps one line while helpers report", label: "Work", dot: "#8b7cf6" },
      { id: "ZEP-398", title: "Count blocked requests per site in the shield", label: "Blocker", dot: "#eb5757" },
      { id: "ZEP-405", title: "Launcher opens recent downloads", label: "Browse", dot: "#4ea7fc" },
    ],
  },
  {
    group: "Todo",
    tone: "todo",
    rows: [
      { id: "ZEP-417", title: "Canvas: snap notes to the grid while dragging", label: "Work", dot: "#8b7cf6" },
      { id: "ZEP-409", title: "Mica material on Windows 11 sidebars", label: "Windows", dot: "#4cb782" },
      { id: "ZEP-401", title: "Import bookmarks and passwords on first run", label: "Browse", dot: "#4ea7fc" },
      { id: "ZEP-386", title: "Focus: weekly summary of time per site", label: "Time & Focus", dot: "#f2994a" },
    ],
  },
  {
    group: "Done",
    tone: "done",
    rows: [
      { id: "ZEP-377", title: "Helpers show the page they are reading", label: "Work", dot: "#8b7cf6" },
      { id: "ZEP-371", title: "Restore tabs after an update", label: "Browse", dot: "#4ea7fc" },
    ],
  },
] as const;

export function LinearPage() {
  return (
    <div className={styles.linear}>
      <aside className={styles.linearSide}>
        <div className={styles.workspace}>
          {/* eslint-disable-next-line @next/next/no-img-element -- a 16px SVG mark needs no optimiser. */}
          <img src="/marks/linear.svg" alt="" width={16} height={16} />
          <b>Linear</b>
          <Icon icon={ArrowDown01Icon} />
          <span className={styles.compose}>
            <Icon icon={Add01Icon} />
          </span>
        </div>
        <nav className={styles.linearNav}>
          <span>
            <Icon icon={InboxIcon} />
            Inbox
          </span>
          <span>
            <Icon icon={Target02Icon} />
            My issues
          </span>
          <small>Workspace</small>
          <span>
            <Icon icon={LayerIcon} />
            Projects
          </span>
          <span>
            <Icon icon={ViewIcon} />
            Views
          </span>
          <small>Your teams</small>
          <span>
            <i className={styles.team}>Z</i>
            Zephium
          </span>
          <span className={styles.sub} data-on>
            Issues
          </span>
          <span className={styles.sub}>Cycles</span>
          <span className={styles.sub}>Projects</span>
        </nav>
      </aside>

      <div className={styles.linearMain}>
        <header className={styles.linearBar}>
          <span className={styles.crumbs}>
            {/* eslint-disable-next-line @next/next/no-img-element -- a 16px SVG mark needs no optimiser. */}
            <img src="/marks/linear.svg" alt="" width={16} height={16} className={styles.narrowMark} />
            <b>Zephium</b>
            <span>›</span>
            Active issues
          </span>
          <span className={styles.linearViews}>
            <span data-on>All issues</span>
            <span>Active</span>
            <span>Backlog</span>
          </span>
        </header>
        <div className={styles.linearList}>
          {ISSUES.map((section) => (
            <section key={section.group}>
              <h4 data-tone={section.tone}>
                {section.tone === "done" ? (
                  <Icon icon={CheckmarkCircle02Icon} />
                ) : section.tone === "progress" ? (
                  <Icon icon={Loading03Icon} />
                ) : (
                  <Icon icon={CircleIcon} />
                )}
                {section.group}
                <small>{section.rows.length}</small>
              </h4>
              {section.rows.map((row) => (
                <div key={row.id} className={styles.issue}>
                  <span className={styles.priority}>
                    <i />
                    <i />
                    <i />
                  </span>
                  <span className={styles.issueId}>{row.id}</span>
                  <span className={styles.issueTitle}>{row.title}</span>
                  <span className={styles.labelChip}>
                    <i style={{ background: row.dot }} />
                    {row.label}
                  </span>
                  <span className={styles.assignee} />
                </div>
              ))}
            </section>
          ))}
        </div>
      </div>
    </div>
  );
}

/* Notion */

const SHOTS = [
  { done: true, text: "Wide on the pad at first light" },
  { done: true, text: "Countdown, voice only" },
  { done: true, text: "Ignition in slow motion" },
  { done: false, text: "Up through the cloud deck" },
  { done: false, text: "Title card over the curve of the Earth" },
];

export function NotionPage() {
  return (
    <div className={styles.notion}>
      <aside className={styles.notionSide}>
        <div className={styles.notionSpace}>
          {/* eslint-disable-next-line @next/next/no-img-element -- a 16px SVG mark needs no optimiser. */}
          <img src="/marks/notion.svg" alt="" width={16} height={16} />
          <b>Maya&apos;s Notion</b>
        </div>
        <nav className={styles.notionNav}>
          <span>
            <Icon icon={Search01Icon} />
            Search
          </span>
          <span>
            <Icon icon={Home01Icon} />
            Home
          </span>
          <span>
            <Icon icon={InboxIcon} />
            Inbox
          </span>
          <small>Private</small>
          <span>
            <em>🚀</em>
            Starship film
          </span>
          <span className={styles.sub} data-on>
            <em>🎬</em>
            Shot list
          </span>
          <span className={styles.sub}>
            <em>📝</em>
            Narration script
          </span>
          <span className={styles.sub}>
            <em>🎵</em>
            Music cues
          </span>
          <span>
            <em>📚</em>
            Reading list
          </span>
        </nav>
      </aside>

      <div className={styles.notionMain}>
        <header className={styles.notionBar}>
          <span className={styles.notionCrumbs}>
            {/* eslint-disable-next-line @next/next/no-img-element -- a 16px SVG mark needs no optimiser. */}
            <img src="/marks/notion.svg" alt="" width={16} height={16} className={styles.narrowMark} />
            <em>🚀</em> Starship film <span>/</span> <em>🎬</em> Shot list
          </span>
          <span className={styles.notionActions}>
            <span>Share</span>
            <Icon icon={StarIcon} />
          </span>
        </header>
        <div className={styles.notionCover} />
        <article className={styles.notionDoc}>
          <span className={styles.pageIcon}>🎬</span>
          <h3>Shot list</h3>
          <dl className={styles.props}>
            <dt>Status</dt>
            <dd>
              <span className={styles.pill}>In edit</span>
            </dd>
            <dt>Runtime</dt>
            <dd>3:15</dd>
            <dt>Cut in</dt>
            <dd>ElevenLabs Studio</dd>
          </dl>
          <h4>Brief</h4>
          <p>
            Three minutes, from first light on the pad to the stage clearing the clouds. The
            narration carries the opening, and the music only rises after ignition.
          </p>
          <h4>Shots</h4>
          <ul className={styles.checks}>
            {SHOTS.map((item) => (
              <li key={item.text} data-done={item.done || undefined}>
                <i />
                {item.text}
              </li>
            ))}
          </ul>
        </article>
      </div>
    </div>
  );
}

/* GitHub */

const FILES = [
  { folder: true, name: "crates", note: "Native network blocker, per-site counts", when: "2 days ago" },
  { folder: true, name: "desktop", note: "Signed builds for macOS and Windows", when: "4 days ago" },
  { folder: true, name: "docs", note: "Security model and architecture", when: "last week" },
  { folder: true, name: "frame", note: "Island: one line, many helpers", when: "yesterday" },
  { folder: false, name: "Cargo.toml", note: "Pin wry and the WebView floors", when: "3 days ago" },
  { folder: false, name: "LICENSE", note: "MPL-2.0", when: "last month" },
  { folder: false, name: "README.md", note: "Describe the engine floors", when: "last week" },
];

export function GitHubPage() {
  return (
    <div className={styles.github}>
      <header className={styles.ghBar}>
        <span className={styles.ghMenu}>
          <Icon icon={Menu01Icon} />
        </span>
        <svg className={styles.octocat} viewBox="0 0 24 24" aria-hidden="true">
          <path d={siGithub.path} />
        </svg>
        <span className={styles.ghContext}>
          zephium-browser <span>/</span> <b>zephium</b>
        </span>
        <span className={styles.ghSearch}>
          <Icon icon={Search01Icon} />
          Type <kbd>/</kbd> to search
        </span>
        <span className={styles.ghAvatar} />
      </header>
      <nav className={styles.repoTabs}>
        <span data-on>Code</span>
        <span>
          Issues <i>24</i>
        </span>
        <span>
          Pull requests <i>6</i>
        </span>
        <span>Actions</span>
        <span>Releases</span>
      </nav>
      <div className={styles.repoHead}>
        <span className={styles.repoName}>
          <span className={styles.ghAvatar} />
          <b>zephium</b>
          <small>Public</small>
        </span>
        <span className={styles.repoActions}>
          <span>
            <Icon icon={ViewIcon} />
            Watch
          </span>
          <span>
            <Icon icon={GitForkIcon} />
            Fork
          </span>
          <span>
            <Icon icon={StarIcon} />
            Star
          </span>
        </span>
      </div>
      <div className={styles.repoBody}>
        <div className={styles.repoMain}>
          <div className={styles.branch}>
            <Icon icon={GitBranchIcon} />
            main
            <Icon icon={ArrowDown01Icon} />
          </div>
          <div className={styles.files}>
            <div className={styles.commit}>
              <span className={styles.ghAvatar} />
              <b>Merge branch &apos;fix/windows-runtime&apos;</b>
              <span>4 hours ago</span>
            </div>
            {FILES.map((file) => (
              <div key={file.name} className={styles.file}>
                <Icon icon={file.folder ? Folder01Icon : File01Icon} />
                <b>{file.name}</b>
                <span>{file.note}</span>
                <span>{file.when}</span>
              </div>
            ))}
          </div>
        </div>
        <aside className={styles.about}>
          <h4>About</h4>
          <p>A browser-native work environment, rebuilt for you and your agents.</p>
          <span className={styles.link}>zephium.app</span>
          <ul>
            <li>
              <Icon icon={File01Icon} />
              MPL-2.0 license
            </li>
            <li>
              <Icon icon={ViewIcon} />
              Activity
            </li>
            <li>
              <Icon icon={GitForkIcon} />
              Rust, TypeScript
            </li>
          </ul>
        </aside>
      </div>
    </div>
  );
}

/* Staybook, the made-up stays site of the demo */

/** The three stays of the demo, then three more made from the same photos, turned around. */
const MORE = [
  { name: "Top-floor loft by Yerba Buena", area: "Entire loft · Yerba Buena", price: "$3,950" },
  { name: "Bright flat near the Embarcadero", area: "Entire apartment · Embarcadero", price: "$2,720" },
  { name: "Corner studio over South Park", area: "Entire studio · South Park", price: "$3,380" },
];
const STAYS = [
  ...trip.stays.options.map((stay) => ({ ...stay, turned: false })),
  ...trip.stays.options.map((stay, index) => ({ ...stay, ...MORE[index], turned: true })),
];

export function StaybookPage() {
  return (
    <div className={styles.staybook}>
      <header className={styles.sbBar}>
        <span className={styles.sbLogo}>
          <Mark id="staybook" size="calc(var(--u) * 24)" />
          staybook
        </span>
        <span className={styles.sbSearch}>
          <span>
            <small>Where</small>
            SoMa, San Francisco
          </span>
          <span>
            <small>Dates</small>
            Mar 2 – 16
          </span>
          <span>
            <small>Guests</small>1 guest
          </span>
          <i>
            <Icon icon={Search01Icon} />
          </i>
        </span>
        <span className={styles.sbUser}>
          <Icon icon={Menu01Icon} />
          <Icon icon={UserCircleIcon} />
        </span>
      </header>
      <div className={styles.sbFilters}>
        {["Workspace", "Entire place", "Wi‑Fi 100+ Mbps", "Self check-in", "Washer", "Price"].map((filter, index) => (
          <span key={filter} data-on={index === 0 || undefined}>
            {filter}
          </span>
        ))}
      </div>
      <div className={styles.sbBody}>
        <div className={styles.sbResults}>
          <p>6 stays near SoMa with a workspace</p>
          <div className={styles.sbGrid}>
            {STAYS.map((stay) => (
              <article key={stay.name} className={styles.sbCard}>
                <span
                  className={styles.sbPhoto}
                  style={{ backgroundImage: `url(${stay.image})` }}
                  data-turned={stay.turned || undefined}
                />
                <b>{stay.name}</b>
                <span>{stay.area}</span>
                <span>
                  <b>{stay.price}</b> total · ★ {stay.rating}
                </span>
              </article>
            ))}
          </div>
        </div>
        <div className={styles.sbMap}>
          <svg viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">
            <path className={styles.sbWater} d="M100 0 L100 46 C88 40 80 30 76 18 C73 9 70 4 70 0 Z" />
            <path d="M0 30 L100 22 M0 62 L100 70 M28 0 L36 100 M70 0 L62 100 M0 90 L100 40 M12 0 L50 100" />
          </svg>
          {[
            { left: "34%", top: "40%", price: "$3,120", on: true },
            { left: "64%", top: "62%", price: "$2,860" },
            { left: "18%", top: "26%", price: "$2,540" },
            { left: "52%", top: "28%", price: "$3,380" },
            { left: "26%", top: "70%", price: "$2,720" },
          ].map((pin) => (
            <span key={pin.price} className={styles.sbPin} style={{ left: pin.left, top: pin.top }} data-on={pin.on || undefined}>
              {pin.price}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

/* FlightFinder, the made-up flights site of the demo */

const CODES: Record<string, string> = { KLM: "KL", United: "UA", "British Airways": "BA", "Virgin Atlantic": "VS" };

export function FlightFinderPage() {
  const flights = trip.flights.options;
  return (
    <div className={styles.flightfinder}>
      <header className={styles.ffBar}>
        <span className={styles.ffLogo}>
          <Mark id="flightfinder" size="calc(var(--u) * 24)" />
          flightfinder
        </span>
        <nav>
          <span data-on>Flights</span>
          <span>Stays</span>
          <span>Cars</span>
        </nav>
        <Icon icon={UserCircleIcon} className={styles.ffUser} />
      </header>
      <div className={styles.ffSearch}>
        <span>
          <small>From</small>
          London (LHR)
        </span>
        <span>
          <small>To</small>
          San Francisco (SFO)
        </span>
        <span>
          <small>Depart</small>
          Mon, Mar 2
        </span>
        <span>
          <small>Return</small>
          Mon, Mar 16
        </span>
        <span>
          <small>Travellers</small>1 adult, Economy
        </span>
        <b>Search</b>
      </div>
      <div className={styles.ffBody}>
        <aside className={styles.ffFilters}>
          <h4>Stops</h4>
          <label data-on>
            <i />
            Nonstop <small>£634</small>
          </label>
          <label data-on>
            <i />1 stop <small>£512</small>
          </label>
          <h4>Airlines</h4>
          {flights.map((flight) => (
            <label key={flight.airline} data-on>
              <i />
              {flight.airline}
            </label>
          ))}
          <h4>Departure</h4>
          <span className={styles.ffRange}>
            <i />
          </span>
          <small className={styles.ffRangeText}>06:00 – 15:00</small>
        </aside>
        <div className={styles.ffResults}>
          <div className={styles.ffSort}>
            <span data-on>
              <b>Best</b>
              £634 · 11h 05m
            </span>
            <span>
              <b>Cheapest</b>
              £512 · 14h 35m
            </span>
            <span>
              <b>Fastest</b>
              £742 · 10h 55m
            </span>
          </div>
          {[flights[1], flights[0], flights[2], flights[3]].map((flight) => (
            <div key={flight.airline} className={styles.ffFlight} data-on={flight.airline === "United" || undefined}>
              <i className={styles.ffCode}>{CODES[flight.airline]}</i>
              <span className={styles.ffTimes}>
                <b>
                  {flight.depart} – {flight.arrive}
                </b>
                <span>{flight.airline}</span>
              </span>
              <span className={styles.ffLeg}>
                <b>{flight.duration}</b>
                <span>
                  {flight.from} – {flight.to}
                </span>
              </span>
              <span className={styles.ffStops}>{flight.stops}</span>
              <span className={styles.ffFare}>
                <b>{flight.price}</b>
                <span>return</span>
              </span>
              <span className={styles.ffSelect}>Select</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
