import type { Metadata, Viewport } from "next";
import { GeistMono } from "geist/font/mono";
import { GeistSans } from "geist/font/sans";
import { SiteFooter } from "@/components/site-footer";
import { Reveals } from "@/components/reveals";
import { SiteNav } from "@/components/site-nav";
import { getStars } from "@/lib/github";
import { platforms, site } from "@/lib/site";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: { default: site.title, template: `%s · ${site.name}` },
  description: site.description,
  applicationName: site.name,
  keywords: [
    "browser",
    "AI browser",
    "agentic browser",
    "open source browser",
    "Rust browser",
    "ad blocker",
    "privacy",
    "AI agents",
    "work environment",
  ],
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    siteName: site.name,
    title: site.title,
    description: site.description,
    url: "/",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: site.title,
    description: site.description,
  },
  formatDetection: { telephone: false, email: false, address: false },
};

export const viewport: Viewport = {
  themeColor: "#09090b",
  colorScheme: "dark",
};

const jsonLd = {
  "@context": "https://schema.org",
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
};

/**
 * Page views, counted by our own Umami: cookieless, on our own server, and
 * only on zephium.app. Off unless both values are set when the site is built.
 */
const analytics = {
  src: process.env.NEXT_PUBLIC_UMAMI_SRC,
  id: process.env.NEXT_PUBLIC_UMAMI_ID,
};

export default async function RootLayout({ children }: LayoutProps<"/">) {
  const stars = await getStars();
  return (
    <html lang="en" className={`${GeistSans.variable} ${GeistMono.variable}`}>
      <body>
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-[100] focus:rounded-control focus:bg-lit focus:px-4 focus:py-2 focus:text-on-lit"
        >
          Skip to content
        </a>
        <SiteNav stars={stars} />
        <main id="main">{children}</main>
        <SiteFooter />
        <Reveals />
        {analytics.src && analytics.id ? (
          <script
            defer
            src={analytics.src}
            data-website-id={analytics.id}
            data-domains={new URL(site.url).host}
            data-do-not-track="true"
          />
        ) : null}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c"),
          }}
        />
      </body>
    </html>
  );
}
