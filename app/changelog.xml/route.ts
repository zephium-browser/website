import { RELEASES, changelogFeedPath, releaseAnchor, type Release } from "@/lib/changelog";
import { site } from "@/lib/site";

export const dynamic = "force-static";

const escape = (text: string) =>
  text.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

/** RSS wants RFC 822 dates; releases are dated to the day, so noon UTC. */
const rfc822 = (date: string) => new Date(`${date}T12:00:00Z`).toUTCString();

const link = (path: string) => new URL(path, site.url).toString();

/** A release as HTML: its summary, then each section as a list. */
function body(release: Release) {
  const sections = release.sections
    .map(
      (section) =>
        `<h3>${escape(section.title)}</h3><ul>${section.items.map((item) => `<li>${escape(item)}</li>`).join("")}</ul>`,
    )
    .join("");
  return `<p>${escape(release.summary)}</p>${sections}`;
}

/** The changelog as an RSS 2.0 feed, written at build from the same list the page reads. */
export function GET() {
  const items = RELEASES.map((release) => {
    const url = `${link("/changelog")}#${releaseAnchor(release.version)}`;
    return `    <item>
      <title>${escape(`${site.name} ${release.version}: ${release.title}`)}</title>
      <link>${url}</link>
      <guid isPermaLink="true">${url}</guid>
      <pubDate>${rfc822(release.date)}</pubDate>
      <description>${escape(release.summary)}</description>
      <content:encoded><![CDATA[${body(release).replace(/\]\]>/g, "]]]]><![CDATA[>")}]]></content:encoded>
    </item>`;
  }).join("\n");

  const feed = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom" xmlns:content="http://purl.org/rss/1.0/modules/content/">
  <channel>
    <title>${escape(`${site.name} changelog`)}</title>
    <link>${link("/changelog")}</link>
    <description>${escape(`What is new in ${site.name}, release by release.`)}</description>
    <language>en-us</language>
    <lastBuildDate>${rfc822(RELEASES[0].date)}</lastBuildDate>
    <atom:link href="${link(changelogFeedPath)}" rel="self" type="application/rss+xml" />
${items}
  </channel>
</rss>
`;

  return new Response(feed, {
    headers: { "Content-Type": "application/rss+xml; charset=utf-8" },
  });
}
