import type { MetadataRoute } from "next";
import { site } from "@/lib/site";

export const dynamic = "force-static";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: site.name,
    short_name: site.name,
    description: site.description,
    start_url: "/",
    display: "browser",
    background_color: "#09090b",
    theme_color: "#09090b",
    icons: [
      { src: "/brand/zephium-icon-192.png", sizes: "192x192", type: "image/png" },
      { src: "/brand/zephium-icon-512.png", sizes: "512x512", type: "image/png" },
    ],
  };
}
