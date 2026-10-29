import type { Metadata } from "next";
import { ZephiumLogo } from "@/components/brand";
import { LinuxEmailAction } from "@/components/linux-waitlist/email-action";

// Outside (site): no page analytics, replay, navigation scripts or external assets.
export const metadata: Metadata = {
  title: { absolute: "Linux notification · Zephium" },
  robots: { index: false, follow: false },
  referrer: "no-referrer",
  alternates: { canonical: null },
};

export default function LinuxConfirmPage() {
  return (
    <main id="main" className="container-page flex min-h-svh flex-col items-center justify-center py-16">
      <ZephiumLogo size={56} />
      <h1 className="mt-8 text-center text-headline font-semibold">Linux release notification</h1>
      <LinuxEmailAction />
      <nav aria-label="Legal" className="mt-12 flex gap-6 text-[13px] text-muted">
        <a href="/privacy">Privacy policy</a>
        <a href="/support">Support</a>
      </nav>
    </main>
  );
}
