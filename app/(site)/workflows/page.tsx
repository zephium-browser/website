import type { Metadata } from "next";
import { pageMetadata } from "@/lib/metadata";
import Link from "next/link";
import {
  Airplane01Icon,
  BarChartIcon,
  Briefcase01Icon,
  ChartLineData02Icon,
  CheckListIcon,
  ComputerTerminal01Icon,
  Folder02Icon,
  GitPullRequestIcon,
  Globe02Icon,
  Link01Icon,
  MessageMultiple01Icon,
  NoteIcon,
  PencilEdit02Icon,
  Plug02Icon,
  Table02Icon,
  UserGroupIcon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon, type IconSvgElement } from "@hugeicons/react";
import type { CSSProperties } from "react";
import { Orb } from "@/components/island/orb";
import { PageShell } from "@/components/prose";
import { site } from "@/lib/site";
import styles from "./workflows.module.css";

export const metadata: Metadata = pageMetadata({
  title: "Workflows",
  description: `Eight ways people use Work in ${site.name}, from planning a trip and choosing what to buy to research, a job search, support and code. One request, agents on live pages in plain sight, and results that stay on the canvas.`,
  path: "/workflows",
});

type Workflow = {
  id: string;
  who: string;
  title: string;
  body: string;
  request: string;
  steps: { icon: IconSvgElement; text: string }[];
  keep: string;
  /** Where on the sky the panel sits. */
  at: string;
};

const WORKFLOWS: Workflow[] = [
  {
    id: "travel",
    who: "Travel",
    title: "A whole trip from one request.",
    body: "Helpers check flights and stays on several sites at once. You get a plan, day by day, and a task for each booking.",
    request: "Plan two weeks in San Francisco for a founder trip in March, flying from London. Stay near SoMa and keep it under $6k.",
    steps: [
      { icon: Airplane01Icon, text: "Helpers compare flights and stays on different sites, each on its own live page." },
      { icon: Table02Icon, text: "Prices land in one table, with the total set against your budget." },
      { icon: CheckListIcon, text: "The itinerary comes back day by day, and one press turns the bookings into tasks." },
    ],
    keep: "An itinerary, a comparison of stays and a task for every booking.",
    at: "0% 20%",
  },
  {
    id: "buying",
    who: "Buying",
    title: "Weigh three options, then decide.",
    body: "Helpers read each product page at the same time. The differences end up in a table and a chart, not in a dozen open tabs.",
    request: "Compare three 27-inch 4K monitors under $600 for programming, and tell me which one to buy.",
    steps: [
      { icon: Globe02Icon, text: "Helpers open each product page and its reviews, in plain sight." },
      { icon: Table02Icon, text: "Price, size, ports and the complaints that repeat go into one table." },
      { icon: BarChartIcon, text: "A chart shows where they differ, and a recommendation says which and why." },
    ],
    keep: "A comparison table, a chart and a recommendation with its sources.",
    at: "100% 70%",
  },
  {
    id: "research",
    who: "Research",
    title: "Read widely, keep what matters.",
    body: "For students and analysts: many pages read at once, and findings that stay with their sources.",
    request: "Find recent studies on remote work and productivity, summarise what they found and chart where they disagree.",
    steps: [
      { icon: Globe02Icon, text: "Helpers read papers and articles, each one a live page." },
      { icon: ChartLineData02Icon, text: "Findings go into a table, with a chart of where they differ." },
      { icon: Link01Icon, text: "Every finding keeps a link to the page it came from." },
    ],
    keep: "A summary, a chart and a reading list.",
    at: "100% 100%",
  },
  {
    id: "jobs",
    who: "Job search",
    title: "Apply with a CV that fits each job.",
    body: "Grant the folder that holds your CV. It reads the postings and proposes changes, and nothing is saved until you approve.",
    request: "Read these three job postings, tailor my CV in the Applications folder for each, and keep track of where I apply.",
    steps: [
      { icon: Briefcase01Icon, text: "Helpers read each posting and pick out what it asks for." },
      { icon: Folder02Icon, text: "Reads your CV in the folder you granted and proposes a tailored copy for each posting." },
      { icon: CheckListIcon, text: "Every application becomes a task, with a day to follow up." },
    ],
    keep: "A tailored CV for each posting and a task for every application.",
    at: "40% 100%",
  },
  {
    id: "founders",
    who: "Founders",
    title: "Research a market in an afternoon.",
    body: "Send helpers after every source at once, and watch each one work on the real page.",
    request: "Compare pricing for the five leading tools in our space and tell me where we should sit.",
    steps: [
      { icon: UserGroupIcon, text: "Helpers open each pricing page in parallel, in plain sight." },
      { icon: Table02Icon, text: "Every plan lands in one table, side by side." },
      { icon: PencilEdit02Icon, text: "A recommendation, written beside the sources it read." },
    ],
    keep: "A comparison table and a plan, saved on the canvas.",
    at: "92% 30%",
  },
  {
    id: "marketing",
    who: "Marketing",
    title: "From launch notes to launch day.",
    body: "Point it at your notes and the tabs that matter. It drafts in your voice and shares only when you say so.",
    request: "Read our launch notes and last month's posts, then draft the announcement and three social posts.",
    steps: [
      { icon: NoteIcon, text: "Reads your notes and the tabs you choose to share." },
      { icon: PencilEdit02Icon, text: "Drafts the announcement and the posts beside their sources." },
      { icon: Plug02Icon, text: "Shares the drafts in Slack for review, through MCP, when you approve." },
    ],
    keep: "Drafts, sources and the tasks to publish them.",
    at: "0% 100%",
  },
  {
    id: "support",
    who: "Support",
    title: "Triage the queue before standup.",
    body: "Connect GitHub and Slack through MCP. It reads what came in and sorts it, and drafts replies you approve before anything is sent.",
    request: "Check our status page and the new GitHub issues, group them by cause, and draft a reply for each in Slack.",
    steps: [
      { icon: Globe02Icon, text: "Reads the status page, and the new issues on GitHub through MCP." },
      { icon: Table02Icon, text: "Issues are sorted into a table by cause and by how urgent they are." },
      { icon: MessageMultiple01Icon, text: "Replies are drafted for Slack, and sent only when you approve them." },
    ],
    keep: "A triage table and drafted replies, ready to send.",
    at: "60% 0%",
  },
  {
    id: "developers",
    who: "Developers",
    title: "Understand the code, then change it.",
    body: "Grant a folder and ask in plain words. The agent reads before it writes, and asks before it changes a file.",
    request: "Read the payments folder, explain how refunds work, then add a test for partial refunds and run it.",
    steps: [
      { icon: Folder02Icon, text: "Reads the folder you granted and maps the code on the canvas." },
      { icon: ComputerTerminal01Icon, text: "Writes the test, asks before saving it, and runs it." },
      { icon: GitPullRequestIcon, text: "Opens a pull request through the GitHub CLI you already use." },
    ],
    keep: "A map of the system, the new test and a pull request.",
    at: "8% 90%",
  },
];

/** How different people put Work to use, each from one request. */
export default function WorkflowsPage() {
  return (
    <PageShell
      title="Workflows"
      lede="One request, in your own words. Agents open real pages, work in plain sight and leave you something to keep. Here is how that looks for eight kinds of work."
    >
      <nav aria-label="Workflows" className={styles.jump}>
        <ul>
          {WORKFLOWS.map((workflow) => (
            <li key={workflow.id}>
              <a href={`#${workflow.id}`}>{workflow.who}</a>
            </li>
          ))}
        </ul>
      </nav>

      <div className={styles.list}>
        {WORKFLOWS.map((workflow, index) => (
          <article
            key={workflow.id}
            id={workflow.id}
            className={styles.workflow}
            data-flip={index % 2 === 1 || undefined}
            aria-labelledby={`${workflow.id}-title`}
          >
            <div className={styles.text} data-reveal>
              <p className={styles.who}>{workflow.who}</p>
              <h2 id={`${workflow.id}-title`}>{workflow.title}</h2>
              <p className={styles.body}>{workflow.body}</p>
              <p className={styles.keep}>
                <b>You keep</b> {workflow.keep}
              </p>
            </div>

            <div
              className={styles.desk}
              data-reveal="fade"
              style={{ "--at": workflow.at, "--delay": "0.08s" } as CSSProperties}
            >
              <div className={styles.panel}>
                <div className={styles.request}>
                  <span className={styles.orb}>
                    <Orb size={20} />
                  </span>
                  <p>{workflow.request}</p>
                </div>
                <ol className={styles.steps}>
                  {workflow.steps.map((step) => (
                    <li key={step.text}>
                      <span className={styles.icon}>
                        <HugeiconsIcon icon={step.icon} size={15} strokeWidth={1.7} aria-hidden />
                      </span>
                      {step.text}
                    </li>
                  ))}
                </ol>
              </div>
            </div>
          </article>
        ))}
      </div>

      <aside className={styles.close} data-reveal>
        <h2>Bring your own work.</h2>
        <p>
          Every workflow runs on the model you choose: {site.name}&apos;s own AI, your keys for OpenAI,
          Anthropic or Gemini, or a model on your machine.
        </p>
        <div className={styles.actions}>
          <Link href="/docs" className={styles.secondary}>
            Read the docs
          </Link>
        </div>
      </aside>
    </PageShell>
  );
}
