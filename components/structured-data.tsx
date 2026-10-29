import { platforms, site } from "@/lib/site";

/** One block of structured data for search engines, escaped for a script tag. */
export function JsonLd({ data }: { data: object }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, "\\u003c") }}
    />
  );
}

const context = "https://schema.org";

/**
 * Where Zephium is elsewhere on the web. A link that does not exist yet is
 * left out, the way the footer leaves it out.
 */
const sameAs = [
  new URL(site.repo).origin + "/" + new URL(site.repo).pathname.split("/")[1],
  ...Object.values(site.social),
].filter((href, index, all) => Boolean(href) && all.indexOf(href) === index);

/**
 * What the home page tells search engines: the app, who makes it and the
 * site itself. The 404 and the pages around the app carry none of this.
 */
export function HomeStructuredData() {
  return (
    <>
      <JsonLd
        data={{
          "@context": context,
          "@type": "SoftwareApplication",
          name: site.name,
          description: site.description,
          url: site.url,
          applicationCategory: "BrowserApplication",
          operatingSystem: platforms
            .filter((platform) => platform.status === "available")
            .map((platform) => platform.name)
            .join(", "),
          offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
          license: `https://spdx.org/licenses/${site.license}.html`,
          codeRepository: site.repo,
        }}
      />
      <JsonLd
        data={{
          "@context": context,
          "@type": "Organization",
          name: site.name,
          url: site.url,
          logo: new URL("/brand/zephium-icon-512.png", site.url).toString(),
          sameAs,
        }}
      />
      <JsonLd
        data={{
          "@context": context,
          "@type": "WebSite",
          name: site.name,
          url: site.url,
        }}
      />
    </>
  );
}

/** Home, then Docs, then the topic: the trail a docs page sits on. */
export function DocsBreadcrumbs({ title, path }: { title: string; path: string }) {
  const trail = [
    { name: site.name, path: "/" },
    { name: "Docs", path: "/docs" },
    { name: title, path },
  ];
  return (
    <JsonLd
      data={{
        "@context": context,
        "@type": "BreadcrumbList",
        itemListElement: trail.map((item, index) => ({
          "@type": "ListItem",
          position: index + 1,
          name: item.name,
          item: new URL(item.path, site.url).toString(),
        })),
      }}
    />
  );
}
