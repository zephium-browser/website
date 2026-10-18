import type { Metadata } from "next";
import Link from "next/link";
import { ZephiumLogo } from "@/components/brand";
import { DownloadLink } from "@/components/download-link";

/**
 * Not for search, never linked, and no referrer sent onward. The root
 * layout's canonical link is cleared so this page does not claim to be "/".
 */
export const metadata: Metadata = {
  title: { absolute: "Return to Zephium" },
  robots: { index: false, follow: false },
  referrer: "no-referrer",
  alternates: { canonical: null },
};

/**
 * Where checkout and the billing portal send people back to. It reads nothing
 * from the address and says nothing about a payment: Zephium confirms
 * purchases on its own. It sits outside the site layout, so it loads no
 * analytics.
 */
export default function BillingReturn() {
  return (
    <main
      id="main"
      className="container-page flex min-h-svh flex-col items-center justify-center py-16 text-center"
    >
      <ZephiumLogo size={56} />
      <h1 className="mt-8 text-headline font-semibold">Return to Zephium</h1>
      <p className="mt-4 max-w-md text-lede text-muted">
        You can close this tab and return to Zephium.
      </p>
      <p className="mt-3 max-w-md text-[15px] text-muted">
        If you made a purchase, Zephium will update your plan or balance after payment is confirmed.
      </p>
      <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
        <Link
          href="/"
          className="inline-flex h-11 items-center rounded-capsule bg-lit px-5 text-[15px] font-medium text-on-lit transition-colors hover:bg-white"
        >
          Home
        </Link>
        <DownloadLink className="inline-flex h-11 items-center rounded-capsule border border-line-strong px-5 text-[15px] font-medium transition-colors hover:bg-surface">
          Download
        </DownloadLink>
      </div>
      <nav aria-label="Legal" className="mt-12 flex gap-6 text-[13px] text-muted">
        <Link href="/privacy" className="transition-colors hover:text-text">
          Privacy
        </Link>
        <Link href="/terms" className="transition-colors hover:text-text">
          Terms
        </Link>
      </nav>
    </main>
  );
}
