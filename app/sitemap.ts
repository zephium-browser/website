import type { MetadataRoute } from "next";
import { RELEASES } from "@/lib/changelog";
import { docPath, pages as docPages } from "@/lib/docs";
import { site } from "@/lib/site";

export const dynamic = "force-static";

/**
 * When each page's words last changed. Set by hand, per page, when its words
 * change: a date that moves on every build tells a crawler nothing. The
 * changelog follows its newest release; the policies follow their effective
 * date.
 */
const edited = "2026-10-29";

export default function sitemap(): MetadataRoute.Sitemap {
  const pages = [
    { path: "/", priority: 1, modified: edited },
    { path: "/pricing", priority: 0.8, modified: edited },
    { path: "/download", priority: 0.8, modified: edited },
    { path: "/workflows", priority: 0.7, modified: edited },
    { path: "/changelog", priority: 0.6, modified: RELEASES[0].date },
    { path: "/docs", priority: 0.6, modified: edited },
    ...docPages.map((topic) => ({ path: docPath(topic.slug), priority: 0.5, modified: edited })),
    { path: "/about", priority: 0.5, modified: edited },
    { path: "/support", priority: 0.5, modified: edited },
    { path: "/privacy", priority: 0.3, modified: "2026-10-19" },
    { path: "/terms", priority: 0.3, modified: "2026-10-19" },
  ];
  return pages.map(({ path, priority, modified }) => ({
    url: new URL(path, site.url).toString(),
    lastModified: modified,
    priority,
  }));
}
