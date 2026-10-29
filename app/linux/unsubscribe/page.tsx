import type { Metadata } from "next";
import { ZephiumLogo } from "@/components/brand";
import { LinuxUnsubscribe } from "@/components/linux-waitlist/unsubscribe";

// The email link's secret must never reach the site's analytics layout, so this
// page lives outside (site): no page counting, navigation scripts or external assets.
export const metadata: Metadata = {
  title: { absolute: "Unsubscribe from Linux notifications · Zephium" },
  robots: { index: false, follow: false },
  referrer: "no-referrer",
  alternates: { canonical: null },
};

export default function LinuxUnsubscribePage() {
  return (
    <main id="main" className="container-page flex min-h-svh flex-col items-center justify-center py-16">
      <ZephiumLogo size={56} />
      <h1 className="mt-8 text-center text-headline font-semibold">Unsubscribe from Linux notifications</h1>
      <LinuxUnsubscribe />
      <nav aria-label="Legal" className="mt-12 flex gap-6 text-[13px] text-muted">
        <a href="/privacy">Privacy policy</a>
        <a href="/support">Support</a>
      </nav>
    </main>
  );
}
