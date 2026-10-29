import type { Metadata } from "next";
import Link from "next/link";
import { ZephiumLogo } from "@/components/brand";
import { SiteFooter } from "@/components/site-footer";
import { SiteNav } from "@/components/site-nav";
import { getStars } from "@/lib/github";
import { pageMetadata } from "@/lib/metadata";

const base = pageMetadata({
  title: "Page not found",
  description: "There is nothing at this address. The page may have moved, or the link was mistyped.",
  path: "/",
});

/** A missing page has no address of its own to claim, so no canonical or share URL. */
export const metadata: Metadata = {
  ...base,
  alternates: { canonical: null },
  openGraph: { ...base.openGraph, url: undefined },
  robots: { index: false },
};

/** Sits outside the site layout, so it brings its own navigation and footer. */
export default async function NotFound() {
  const stars = await getStars();
  return (
    <>
      <SiteNav stars={stars} />
      <main id="main">
        <section className="container-page flex min-h-[80svh] flex-col items-center justify-center pt-[var(--nav-height)] text-center">
          <ZephiumLogo size={56} />
          <h1 className="mt-8 text-headline font-semibold">Nothing at this address.</h1>
          <p className="mt-4 max-w-md text-lede text-muted">
            The page may have moved, or the link was mistyped.
          </p>
          <Link
            href="/"
            className="mt-10 inline-flex h-11 items-center rounded-capsule bg-lit px-5 text-[15px] font-medium text-on-lit transition-colors hover:bg-white"
          >
            Back to Zephium
          </Link>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
