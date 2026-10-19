import type { Metadata } from "next";
import { PageShell, Prose } from "@/components/prose";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Terms",
  description: `Terms of use for ${site.name}, Zephium AI and its website. The browser and website are open source under ${site.license}; the backend is under ${site.backendLicense}.`,
  alternates: { canonical: "/terms" },
};

export default function TermsPage() {
  const host = new URL(site.url).host;
  return (
    <PageShell title="Terms" lede="Plain terms for the browser, Zephium AI and this website.">
      <Prose updated="October 19, 2026">
        <p>
          These terms apply to the {site.name} software, to Zephium AI and its paid plans, and to
          the website at {host}. By using any of them, you agree to these terms.
        </p>

        <h2>Licenses</h2>
        <p>
          The {site.name} browser and this website are free software, licensed under the{" "}
          <a href="https://www.mozilla.org/MPL/2.0/">Mozilla Public License 2.0</a>. The backend
          behind Zephium AI is licensed under the AGPL-3.0-only and lives in{" "}
          <a href={site.backendRepo}>its own repository</a>. Third-party components keep their own
          licenses.
        </p>
        <p>
          A license governs how you may use, copy, change and share the source code it covers;
          nothing in these terms limits the rights it gives you. The browser&apos;s license is in{" "}
          <a href={`${site.repo}/blob/main/LICENSE`}>its repository</a>.
        </p>

        <h2>No warranty</h2>
        <p>
          The software and this website are provided &ldquo;as is&rdquo;, without warranty of any
          kind, as described in sections 6 and 7 of the Mozilla Public License. To the extent the
          law allows, the {site.name} contributors are not liable for any damages arising from
          their use.
        </p>

        <h2>Models and agents</h2>
        <p>
          When you bring your own keys, Work features connect to AI providers through accounts
          that belong to you. You are responsible for those accounts, for following their terms,
          and for any costs they charge.
        </p>
        <p>
          Agents act on your instructions and ask before taking actions on your behalf. You are
          responsible for the instructions you give and the actions you approve, including what
          agents do on websites and in folders you grant them.
        </p>

        <h2>Zephium AI and paid plans</h2>
        <p>
          <strong>Account.</strong> An account is optional and is only needed for Zephium AI. You
          are responsible for your account and for what happens in it. You must be old enough to
          form a binding contract where you live, and at least 16.
        </p>
        <p>
          <strong>Plans.</strong> Free includes a limited one-time Zephium AI allowance. Pro and
          Max are paid plans, billed monthly or yearly. Pro and Max subscribers can buy top-ups,
          which expire 12 months after purchase. Usage allowances renew monthly, also on yearly
          plans. Credits and allowances have no cash value, cannot be transferred, and are not
          refunded when they expire. There are no automatic overage charges: you are charged for
          more usage only when you buy a top-up.
        </p>
        <p>
          <strong>Payment.</strong> Payments are handled by <a href="https://polar.sh">Polar</a>,
          the merchant of record, under{" "}
          <a href="https://polar.sh/legal/checkout-buyer-terms">Polar&apos;s buyer terms</a>.
          Prices and taxes are shown at checkout. Subscriptions renew automatically until you
          cancel.
        </p>
        <p>
          <strong>Cancellation.</strong> You can cancel at any time in Settings &rarr; Account,
          which opens the billing portal. Your plan stays active until the end of the period you
          paid for.
        </p>
        <p>
          <strong>Refunds.</strong> Payments are non-refundable, except where required by law.
        </p>
        <p>
          <strong>Models and availability.</strong> Models, limits and features may change, and
          availability is not guaranteed. Free usage may be paused when demand is high.
        </p>
        <p>
          <strong>Acceptable use.</strong> Follow the law and the usage policies of the model
          providers whose models you use. Do not abuse the service, resell it, scrape it
          automatically, or try to get around its limits. We may suspend or close accounts that
          break these terms.
        </p>
        <p>
          <strong>Your content.</strong> You are responsible for what you send to Zephium AI. We do
          not claim ownership of your prompts or of the outputs you receive.
        </p>
        <p>
          <strong>Liability.</strong> To the extent the law allows, our total liability to you for
          claims about the paid service is limited to the amount you paid for it in the 12 months
          before the claim.
        </p>

        <h2>Commercial licensing</h2>
        <p>
          A Cloud subscription does not give you a commercial license, an exception to a source
          license, or a support agreement. If you need terms other than the AGPL-3.0-only for the
          backend, see <a href={site.commercialLicensing}>commercial licensing</a>.
        </p>

        <h2>Websites and extensions</h2>
        <p>
          Sites you visit and extensions you install are provided by others, under their own
          terms. {site.name} does not control them and is not responsible for them.
        </p>

        <h2>Name and logo</h2>
        <p>
          The {site.name} name and logo identify the project. The open-source licenses do not grant
          rights to them. You may refer to {site.name} by name, but please do not use the name or
          logo in a way that suggests endorsement, or for a modified version you distribute.
        </p>

        <h2>Other names and logos</h2>
        <p>
          This website shows other companies&apos; products, such as ElevenLabs, Linear, Notion
          and GitHub, open in {site.name} to illustrate how it is used. Their names and logos
          belong to their owners. The pages shown are simplified likenesses with made-up content,
          and showing them does not mean those companies endorse or are affiliated with{" "}
          {site.name}. Staybook and FlightFinder are fictional.
        </p>

        <h2>Changes</h2>
        <p>
          We may update these terms. When we do, we will change this page and its effective date.
          Continuing to use the website, Zephium AI or a new release after a change means you
          accept the updated terms.
        </p>

        <h2>Who runs {site.name}</h2>
        <p>
          {site.name} is currently operated by {site.operator.name}, an individual based in{" "}
          {site.operator.location}.
        </p>

        <h2>Contact</h2>
        <p>
          Questions about these terms go to{" "}
          <a href={`mailto:${site.contact.support}`}>{site.contact.support}</a>.
        </p>
      </Prose>
    </PageShell>
  );
}
