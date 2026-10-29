import type { Metadata } from "next";
import { PageShell, Prose } from "@/components/prose";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Privacy",
  description: `How ${site.name} and ${new URL(site.url).host} handle your data: local browsing data, optional accounts, models you choose, and the optional Linux release notification.`,
  alternates: { canonical: "/privacy" },
};

export default function PrivacyPage() {
  const host = new URL(site.url).host;
  return (
    <PageShell
      title="Privacy"
      lede={`The short version: the browser collects nothing about how you browse, your data stays on your device, an account is optional, and this website counts page views without knowing who you are.`}
    >
      <Prose updated="October 29, 2026">
        <p>
          This policy covers the {site.name} browser and the website at {host}. {site.name} is open
          source, so every statement about the browser below can be checked against{" "}
          <a href={site.repo}>its source code</a>.
        </p>

        <h2>The browser collects nothing</h2>
        <p>
          {site.name} has no telemetry, no usage analytics and no crash reporting that sends data on
          its own. We do not receive your browsing history, your searches or anything you do in the
          browser. You never need an account to browse, to use your own API key or to run a model
          on your computer, and until you sign in, the browser does not contact {site.name}&apos;s
          servers at all.
        </p>

        <h2>Your data stays on your device</h2>
        <p>
          History, open tabs, tasks, notes and activity are stored locally, on your computer, in
          the profile they belong to. Profiles are kept apart from one another. You can delete any
          of this data at any time from within the browser or by removing your profile.
        </p>

        <h2>Models and keys</h2>
        <p>
          Work features use a model you choose. With your own API key for a provider such as
          OpenAI, Anthropic, Google, xAI, Mistral or DeepSeek, requests go directly from your device
          to that provider and your key is kept in your system keychain. With a model running
          locally, nothing leaves your device.
        </p>
        <p>
          Before anything is sent to a model, {site.name} shows you which pages and notes are
          included and why. What the provider does with that data is governed by your agreement
          with them, so review their terms for the provider you use.
        </p>

        <h2>Your account</h2>
        <p>
          An account is optional and is only needed for Zephium AI, our hosted models. Until you
          sign in, the browser does not contact our servers at all.
        </p>
        <p>If you create an account, we keep:</p>
        <ul>
          <li>your email address, to send you sign-in codes. There is no password;</li>
          <li>
            the devices and sessions signed in to your account, each named only by the app version
            and operating system, such as &ldquo;{site.name} 1.0 &middot; macOS&rdquo;, so you can
            see them and sign them out;
          </li>
          <li>your plan and billing status, as Polar reports it;</li>
          <li>
            usage records, without any content: which model was used, how many tokens, what it
            cost and when;
          </li>
          <li>
            the security and abuse-prevention records needed to run the service, such as rate
            limits.
          </li>
        </ul>
        <p>
          The sign-in token stays in your system keychain on your device. You can sign out any
          device, and delete your account, from Settings &rarr; Account.
        </p>

        <h2>Zephium AI</h2>
        <p>
          When you use Zephium AI, your prompts and the pages, files and audio they include, such
          as voice input for transcription, pass through our servers to the model provider that
          answers them, such as OpenAI or Anthropic, and the answer comes back the same way.
        </p>
        <p>
          Our servers do not store prompts, answers, page content, images or audio. How long the
          model provider keeps what it receives depends on that provider&apos;s settings and its
          agreements with us, and is governed by its own terms and privacy policy.
        </p>
        <p>
          We do not yet state fixed retention periods for the account and usage records above.
          When we set them, this page will say how long each is kept.
        </p>

        <h2>Deleting your account</h2>
        <p>
          You can delete your account in Settings &rarr; Account. Deleting it signs out your
          devices and removes your account data. Some records are kept, and these are the ones:
        </p>
        <ul>
          <li>
            To stop repeated sign-up allowances, we keep a keyed (hashed) record derived from your
            email address. It is not your email address, and it contains no browsing content.
          </li>
          <li>
            Billing and tax records are kept for as long as Polar and the law require.
          </li>
          <li>Aggregate cost records, which contain no content, are kept.</li>
        </ul>
        <p>
          Deletion finishes in the background, and some records may take time to clear from
          systems and backups. If you have a question about your data, write to{" "}
          <a href={`mailto:${site.contact.support}`}>{site.contact.support}</a>.
        </p>

        <h2>Payments</h2>
        <p>
          Paid plans are sold by <a href="https://polar.sh">Polar</a>, which acts as the merchant
          of record: it runs checkout, holds your payment details, and issues invoices and receipts
          under its own privacy policy. We never see or store your card. Polar tells us which plan
          you bought and whether it is active.
        </p>

        <h2>Linux release notification</h2>
        <p>
          Submitting the Linux notification form asks us to use your email address for one
          email when Zephium for Linux is available. There is no confirmation step or email at
          signup. This is a separate, optional opt-in, not a general newsletter. It creates no
          Zephium account or subscription and does not sign you up for other marketing emails.
        </p>
        <p>
          We store your normalized email address, signup time and consent version until you
          unsubscribe or we deliberately clean up the release list. Signup does not verify
          ownership of your mailbox. The Linux release email will include an unsubscribe link.
          This notification is managed independently of Zephium accounts. You can also contact
          <a href={`mailto:${site.contact.support}`}> {site.contact.support}</a> about your data.
        </p>
        <p>
          We use bounded abuse-prevention records with keyed identifiers rather than raw IP
          addresses in the waitlist. Your email address and private email-link tokens are never
          sent to website analytics. Unsubscribe and legacy confirmation pages load no analytics
          or error replay. Existing confirmation links from the previous flow remain compatible
          until they expire; legacy unconfirmed addresses are not automatically enrolled.
        </p>

        <h2>Who helps us run it</h2>
        <p>
          {site.name} is currently operated by {site.operator.name}, an individual based in{" "}
          {site.operator.location}.
        </p>
        <p>These companies process data for us:</p>
        <ul>
          <li>
            <a href="https://polar.sh">Polar</a>, the merchant of record, for payments;
          </li>
          <li>
            <a href="https://resend.com">Resend</a>, for sign-in emails and Linux notification
            emails. It receives the recipient email address and the email content, including
            the sign-in code or the confirmation and unsubscribe links as applicable;
          </li>
          <li>
            <a href="https://www.hetzner.com">Hetzner</a>, where our servers run;
          </li>
          <li>
            <a href="https://www.cloudflare.com">Cloudflare</a>, for DNS on our domains. The
            website is served through Cloudflare&apos;s proxy, which processes visitors&apos; IP
            addresses and request details. Zephium AI traffic is not routed through Cloudflare&apos;s
            proxy today;
          </li>
          <li>
            the model providers that answer Zephium AI requests, such as OpenAI and Anthropic.
          </li>
        </ul>

        <h2>Blocking ads and trackers</h2>
        <p>
          The built-in blocker uses the EasyList and EasyPrivacy filter lists. A copy ships with
          the browser and updates are downloaded from their publishers. Blocking decisions happen
          on your device; the pages you visit are not reported to anyone.
        </p>

        <h2>Downloads and updates</h2>
        <p>
          Installers and updates are served from GitHub Releases. When you download a build or the
          browser checks for an update, GitHub receives your IP address and the usual request
          details, under <a href="https://docs.github.com/site-policy/privacy-policies/github-general-privacy-statement">GitHub&apos;s privacy statement</a>.
        </p>

        <h2>Websites you visit</h2>
        <p>
          Sites you open in {site.name} can see what any site sees in any browser, such as your IP
          address. Their handling of your data is covered by their own policies.
        </p>

        <h2>This website</h2>
        <p>
          {host} is a static website. It sets no cookies and uses no third-party trackers or
          advertising. We count page views with a self-hosted, cookieless instance of Umami: it
          counts visits, pages and referrers without storing personal data and without following
          you across other sites. It does not record query strings. The page that checkout and the
          billing portal return to and the Linux confirmation and unsubscribe page load no
          analytics or error replay at all.
        </p>
        <p>
          This is separate from the browser, which has no telemetry. Visiting this website tells
          us nothing about how you use {site.name}.
        </p>
        <p>
          Like any web server, ours keeps short-lived access logs, including IP addresses, for
          security and to keep the service running. These logs are deleted after a short period
          and are never sold or shared.
        </p>

        <h2>Children</h2>
        <p>
          {site.name} is not directed at young children. You must be at least 13 to create an
          account. The browser collects no personal data, and an account holds only what is listed above.
        </p>

        <h2>Changes</h2>
        <p>
          If this policy changes, we will update this page and its effective date. Because the
          browser is open source, any change to what it does is also visible in its public history.
        </p>

        <h2>Contact</h2>
        <p>
          Questions about privacy go to{" "}
          <a href={`mailto:${site.contact.support}`}>{site.contact.support}</a>.
        </p>
      </Prose>
    </PageShell>
  );
}
