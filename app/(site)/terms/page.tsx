import type { Metadata } from "next";
import { PageShell, Prose } from "@/components/prose";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Terms",
  description: `Terms of use for ${site.name} and its website. The software is free and open source under ${site.license}.`,
  alternates: { canonical: "/terms" },
};

export default function TermsPage() {
  const host = new URL(site.url).host;
  return (
    <PageShell title="Terms" lede="Plain terms for a free, open-source browser and its website.">
      <Prose updated="October 2, 2026">
        <p>
          These terms apply to the {site.name} software and to the website at {host}. By using
          either, you agree to them.
        </p>

        <h2>The software</h2>
        <p>
          {site.name} is free software, licensed under the{" "}
          <a href="https://www.mozilla.org/MPL/2.0/">Mozilla Public License 2.0</a>. The license
          governs how you may use, copy, change and share the source code; nothing in these terms
          limits the rights it gives you. The full license is in{" "}
          <a href={`${site.repo}/blob/main/LICENSE`}>the repository</a>.
        </p>

        <h2>No warranty</h2>
        <p>
          The software and this website are provided &ldquo;as is&rdquo;, without warranty of any
          kind, as described in sections 6 and 7 of the license. To the extent the law allows, the{" "}
          {site.name} contributors are not liable for any damages arising from their use.
        </p>

        <h2>Models and agents</h2>
        <p>
          When you bring your own keys, Work features connect to AI providers through accounts
          that belong to you. You are responsible for those accounts, for following their terms,
          and for any costs they charge. {site.name}&apos;s own AI service, when it opens, will
          come with terms of its own.
        </p>
        <p>
          Agents act on your instructions and ask before taking actions on your behalf. You are
          responsible for the instructions you give and the actions you approve, including what
          agents do on websites and in folders you grant them.
        </p>

        <h2>Websites and extensions</h2>
        <p>
          Sites you visit and extensions you install are provided by others, under their own
          terms. {site.name} does not control them and is not responsible for them.
        </p>

        <h2>Name and logo</h2>
        <p>
          The {site.name} name and logo identify the project. The MPL-2.0 does not grant rights to
          them. You may refer to {site.name} by name, but please do not use the name or logo in a
          way that suggests endorsement, or for a modified version you distribute.
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
          Continuing to use the website or a new release after a change means you accept the
          updated terms.
        </p>

        <h2>Contact</h2>
        <p>
          Questions about these terms go to <a href={`mailto:${site.contact}`}>{site.contact}</a>.
        </p>
      </Prose>
    </PageShell>
  );
}
