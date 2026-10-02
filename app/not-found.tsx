import type { Metadata } from "next";
import Link from "next/link";
import { ZephiumLogo } from "@/components/brand";

export const metadata: Metadata = {
  title: "Page not found",
  robots: { index: false },
};

export default function NotFound() {
  return (
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
  );
}
