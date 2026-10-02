import type { Metadata } from "next";
import { PageShell, Prose } from "@/components/prose";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Privacy",
  description: `How ${site.name} and ${new URL(site.url).host} handle your data: no telemetry, your data on your device, and models you choose.`,
  alternates: { canonical: "/privacy" },
};

export default function PrivacyPage() {
  const host = new URL(site.url).host;
  return (
    <PageShell
      title="Privacy"
      lede={`The short version: the browser collects nothing about how you browse, your data stays on your device, and this website counts page views without knowing who you are.`}
    >
      <Prose updated="October 2, 2026">
        <p>
          This policy covers the {site.name} browser and the website at {host}. {site.name} is open
          source, so every statement about the browser below can be checked against{" "}
          <a href={site.repo}>its source code</a>.
        </p>

        <h2>The browser collects nothing</h2>
        <p>
          {site.name} has no telemetry, no usage analytics and no crash reporting that sends data on
          its own. We do not receive your browsing history, your searches or anything you do in the
          browser. You never need an account to browse.
        </p>

        <h2>Your data stays on your device</h2>
        <p>
          History, open tabs, tasks, notes and activity are stored locally, on your computer, in
          the profile they belong to. Profiles are kept apart from one another. You can delete any
          of this data at any time from within the browser or by removing your profile.
        </p>

        <h2>Models and keys</h2>
        <p>
          Work features use a model you choose. With your own API key for OpenAI, Anthropic or
          Gemini, requests go directly from your device to that provider and your key is kept in
          your system keychain. With a model running locally, nothing leaves your device.
        </p>
        <p>
          If you choose {site.name}&apos;s own AI service, the requests you send to it, and the
          pages and notes they include, pass through our servers to be answered. Using it may need
          an account. This section will describe exactly what is kept, and for how long, when the
          service opens.
        </p>
        <p>
          Before anything is sent to a model, {site.name} shows you which pages and notes are
          included and why. What the provider does with that data is governed by your agreement
          with them, so review their terms for the provider you use.
        </p>

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
          advertising. We measure aggregate page views with a self-hosted, cookieless instance of
          Umami: it counts visits, pages and referrers without storing personal data and without
          following you across other sites.
        </p>
        <p>
          The site runs on our own server. Like any web server, it keeps short-lived access logs,
          including IP addresses, for security and to keep the service running. These logs are
          deleted after a short period and are never sold or shared.
        </p>

        <h2>Children</h2>
        <p>
          {site.name} is not directed at children, and because we collect no personal data, we hold
          none about anyone, children included.
        </p>

        <h2>Changes</h2>
        <p>
          If this policy changes, we will update this page and its effective date. Because the
          browser is open source, any change to what it does is also visible in its public history.
        </p>

        <h2>Contact</h2>
        <p>
          Questions about privacy go to <a href={`mailto:${site.contact}`}>{site.contact}</a>.
        </p>
      </Prose>
    </PageShell>
  );
}
