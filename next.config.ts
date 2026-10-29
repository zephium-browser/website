import type { NextConfig } from "next";

const waitlistEnabled = process.env.NEXT_PUBLIC_LINUX_WAITLIST_ENABLED;
const waitlistOrigin = process.env.NEXT_PUBLIC_LINUX_WAITLIST_API_ORIGIN;
if (waitlistEnabled && waitlistEnabled !== "true" && waitlistEnabled !== "false") {
  throw new Error("NEXT_PUBLIC_LINUX_WAITLIST_ENABLED must be true or false.");
}
if (waitlistOrigin && !["https://api.zephium.app", "https://staging-api.zephium.app"].includes(waitlistOrigin)) {
  throw new Error("NEXT_PUBLIC_LINUX_WAITLIST_API_ORIGIN must be the exact production or staging API origin.");
}
if (waitlistEnabled === "true" && !waitlistOrigin) {
  throw new Error("Enabling Linux notifications requires an explicit NEXT_PUBLIC_LINUX_WAITLIST_API_ORIGIN.");
}

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
