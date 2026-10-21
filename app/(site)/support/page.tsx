import type { Metadata } from "next";
import Link from "next/link";
import { ArrowUpRight01Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import type { ReactNode } from "react";
import { PageShell } from "@/components/prose";
import { site } from "@/lib/site";
import styles from "./support.module.css";

export const metadata: Metadata = {
  title: "Support",
  description: `Get help with ${site.name}: your account and billing, privacy, bugs, security reports and the community.`,
  alternates: { canonical: "/support" },
};

const mail = (address: string) => <a href={`mailto:${address}`}>{address}</a>;

const TOPICS: { title: string; body: ReactNode; links?: ReactNode }[] = [
  {
    title: "Account and billing",
    body: (
      <>
        Sign in and manage your plan in Settings &rarr; Account. Receipts, invoices, payment
        methods and cancellation are in the billing portal (run by Polar), which opens from the
        same place.
      </>
    ),
    links: <>Still stuck? {mail(site.contact.support)}</>,
  },
  {
    title: "Privacy and deleting your account",
    body: <>You can delete your account in Settings &rarr; Account. What we keep, and why, is in the privacy policy.</>,
    links: (
      <>
        <Link href="/privacy">Privacy</Link> or {mail(site.contact.support)}
      </>
    ),
  },
  {
    title: "Bugs and feature requests",
    body: <>Open an issue on GitHub. It helps to say your version and system.</>,
    links: (
      <a href={`${site.repo}/issues`}>
        Browser issues
        <HugeiconsIcon icon={ArrowUpRight01Icon} size={14} strokeWidth={1.8} aria-hidden />
      </a>
    ),
  },
  {
    title: "Security",
    body: <>Found a vulnerability? Please write to us privately, not in a public issue.</>,
    links: mail(site.contact.security),
  },
  {
    title: "Community",
    body: <>Ask questions, share workflows and talk to the people building and using Zephium.</>,
    links: (
      <a href={site.social.discord}>
        Join the Discord
        <HugeiconsIcon icon={ArrowUpRight01Icon} size={14} strokeWidth={1.8} aria-hidden />
      </a>
    ),
  },
  {
    title: "Everything else",
    body: <>General questions and press.</>,
    links: mail(site.contact.info),
  },
];

export default function SupportPage() {
  return (
    <PageShell title="Support" lede="Help is a short message away. Start with the right place.">
      <ul className={styles.grid} data-reveal>
        {TOPICS.map((topic) => (
          <li key={topic.title}>
            <section className={styles.topic}>
              <h2>{topic.title}</h2>
              <p>{topic.body}</p>
              {topic.links ? <p className={styles.links}>{topic.links}</p> : null}
            </section>
          </li>
        ))}
      </ul>
    </PageShell>
  );
}
