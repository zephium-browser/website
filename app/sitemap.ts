import type { MetadataRoute } from "next";
import { site } from "@/lib/site";

export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  const pages = [
    { path: "/", priority: 1 },
    { path: "/workflows", priority: 0.7 },
    { path: "/changelog", priority: 0.6 },
    { path: "/docs", priority: 0.6 },
    { path: "/about", priority: 0.5 },
    { path: "/privacy", priority: 0.3 },
    { path: "/terms", priority: 0.3 },
  ];
  return pages.map(({ path, priority }) => ({
    url: new URL(path, site.url).toString(),
    changeFrequency: "weekly",
    priority,
  }));
}
