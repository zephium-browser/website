import type { Metadata } from "next";
import Link from "next/link";
import { ArrowUpRight01Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { PageShell } from "@/components/prose";
import { FaqList, type Question } from "@/components/sections/faq";
import { site } from "@/lib/site";
import { Plans } from "./plans";
import styles from "./pricing.module.css";

export const metadata: Metadata = {
  title: "Pricing",
  description: `${site.name} is free and open source, with 250 Zephium AI credits to start. Pro is $20 a month with 2,000 credits; Max is $100 a month with 10,000.`,
  alternates: { canonical: "/pricing" },
};

/** How usage works, said once and plainly. */
const USAGE = [
  {
    title: "Free starts you with 250 credits",
    body: "They arrive when you sign up, for fast, everyday models. They are yours once and do not renew.",
  },
  {
    title: "Pro and Max renew every month",
    body: "2,000 or 10,000 credits, fresh each month, on yearly plans too.",
  },
  {
    title: "No surprise charges",
    body: "Nothing is charged automatically when usage runs out. Add a top-up if you are on Pro or Max, use your own key or a local model, or wait for your renewal.",
  },
  {
    title: "Top-ups",
    body: "Pro and Max subscribers can add usage in the app. Top-ups expire 12 months after purchase and do not change which models you can use.",
  },
  {
    title: "Your own keys",
    body: "They bill through your provider account, not through Zephium.",
  },
  {
    title: "Demand and changes",
    body: "Free usage can be paused for a while when demand is high. Models and limits can change, and availability is not guaranteed.",
  },
];

const QUESTIONS: Question[] = [
  {
    q: "Can I use Zephium without paying?",
    a: "Yes, fully. The browser, Work and agents are free and open source, with your own API keys or a local model. Signing up for Zephium AI also gives you 250 free credits.",
  },
  {
    q: "Where do I subscribe?",
    a: "In the app, under Settings → Account. Sign in, then choose your plan. This website has no checkout.",
  },
  {
    q: "Can I cancel?",
    a: "Any time, from Settings → Account. Your plan stays active until the end of the period you paid for.",
  },
  {
    q: "Do you offer refunds?",
    a: "Payments are non-refundable, except where required by law.",
    more: { href: "/terms", label: "Read the terms" },
  },
  {
    q: "Who handles payment?",
    a: "Polar, as the merchant of record. Receipts and invoices come from Polar.",
  },
  {
    q: "Do I need an account to browse?",
    a: "No. An account is only for Zephium AI.",
  },
];

export default function PricingPage() {
  return (
    <PageShell
      title={
        <>
          Everything, free.
          <br />
          <span className="text-quiet">More AI when you want it.</span>
        </>
      }
      lede={`The browser, Work and agents cost nothing, with your own keys or a local model. A plan adds Zephium AI credits for frontier models, with no keys to manage.`}
    >
      <div className={styles.page}>
        <Plans />

        <section aria-labelledby="usage-title" className={styles.block}>
          <h2 id="usage-title">How Zephium AI usage works</h2>
          <dl className={styles.usage}>
            {USAGE.map((item) => (
              <div key={item.title}>
                <dt>{item.title}</dt>
                <dd>{item.body}</dd>
              </div>
            ))}
          </dl>
        </section>

        <section aria-labelledby="faq-title" className={styles.block}>
          <h2 id="faq-title">Questions</h2>
          <FaqList items={QUESTIONS} />
        </section>

        <section aria-labelledby="self-title" className={styles.band}>
          <div>
            <h2 id="self-title">Run it yourself.</h2>
            <p>
              Everything is open source. The browser and this website are under the {site.license}; the
              backend behind Zephium AI is under the {site.backendLicense}, and you can host it
              yourself. A Cloud subscription is not a commercial license or a support contract.
            </p>
          </div>
          <ul>
            <li>
              <a href={site.backendRepo}>
                Backend source
                <HugeiconsIcon icon={ArrowUpRight01Icon} size={15} strokeWidth={1.8} aria-hidden />
              </a>
            </li>
            <li>
              <a href={site.backendSelfHosting}>
                Self-hosting guide
                <HugeiconsIcon icon={ArrowUpRight01Icon} size={15} strokeWidth={1.8} aria-hidden />
              </a>
            </li>
            <li>
              <a href={site.commercialLicensing}>
                Commercial licensing
                <HugeiconsIcon icon={ArrowUpRight01Icon} size={15} strokeWidth={1.8} aria-hidden />
              </a>
            </li>
          </ul>
        </section>

        <nav aria-label="Legal and help" className={styles.legal}>
          <Link href="/terms">Terms</Link>
          <Link href="/privacy">Privacy</Link>
          <Link href="/support">Support</Link>
        </nav>
      </div>
    </PageShell>
  );
}
