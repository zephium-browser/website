import type { Metadata } from "next";
import { Suspense } from "react";
import { PageShell } from "@/components/prose";
import { site } from "@/lib/site";
import { DownloadExperience, DownloadView } from "./download-view";

export const metadata: Metadata = {
  title: "Download",
  description: `Download ${site.name} for macOS or Windows. Free and open source, ${site.appSize} installed.`,
  alternates: { canonical: "/download" },
};

/**
 * Where every Download button lands. The download starts here, not on the
 * page that was clicked, so there is one place to say what happens next. The
 * part that reads the address sits in a Suspense boundary, as a static export
 * needs; its fallback is the same page without the address, which lists a
 * direct link for each build and works without JavaScript.
 */
export default function DownloadPage() {
  return (
    <PageShell title="Download" lede={`Free and open source, ${site.appSize} installed.`}>
      <Suspense fallback={<DownloadView start={null} plan={null} />}>
        <DownloadExperience />
      </Suspense>
    </PageShell>
  );
}
