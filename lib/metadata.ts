import { readFileSync } from "node:fs";
import { join } from "node:path";
import type { Metadata } from "next";
import { changelogFeedPath } from "@/lib/changelog";
import { site } from "@/lib/site";

/**
 * The card links share. The files in `app/` give every page this image, but a
 * page that sets its own `openGraph` replaces the whole object and loses it,
 * so each page names the image again. The words come from the files' own alt
 * text, so there is one place to change them.
 */
const shareAlt = (file: string) => {
  try {
    return readFileSync(join(process.cwd(), "app", file), "utf8").trim();
  } catch {
    return `${site.name}: ${site.tagline}`;
  }
};

const shareImage = (file: string, alt: string) => ({ url: `/${file}`, width: 1200, height: 630, alt });

/** Pages advertise the changelog feed, so a reader finds it from anywhere. */
export const feedAlternate = { "application/rss+xml": changelogFeedPath };

/**
 * What every page says about itself, in one place: its title and description,
 * its canonical address, and the same words and share image for Open Graph and
 * X. `title` is the page's own name; the site name is added by the title
 * template, and added here for the share cards, which do not get a template.
 */
export function pageMetadata({
  title,
  description,
  path,
  type = "website",
}: {
  title: string;
  description: string;
  path: string;
  type?: "website" | "article";
}): Metadata {
  const cardTitle = `${title} · ${site.name}`;
  return {
    title,
    description,
    alternates: { canonical: path, types: feedAlternate },
    openGraph: {
      type,
      siteName: site.name,
      title: cardTitle,
      description,
      url: path,
      locale: "en_US",
      images: [shareImage("opengraph-image.jpg", shareAlt("opengraph-image.alt.txt"))],
    },
    twitter: {
      card: "summary_large_image",
      title: cardTitle,
      description,
      images: [shareImage("twitter-image.jpg", shareAlt("twitter-image.alt.txt"))],
    },
  };
}
