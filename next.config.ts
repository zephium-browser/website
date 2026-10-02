import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // The site is fully static and served from our own host; see README.
  output: "export",
  // A static host has no image optimizer. Images are prepared at their
  // display sizes before they are committed.
  images: { unoptimized: true },
  reactStrictMode: true,
  poweredByHeader: false,
};

export default nextConfig;
