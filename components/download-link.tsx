import Link from "next/link";
import type { ReactNode } from "react";
import { downloadPath, type PlatformId } from "@/lib/site";

/**
 * Takes the visitor to the download page, which starts the download for their
 * desktop as it opens. Without JavaScript the link still reaches the page,
 * which offers a direct link to each build. Pass `platform` to start a
 * specific build, and `plan` to carry the chosen plan onto the page.
 */
export function DownloadLink({
  className,
  children,
  onClick,
  platform,
  plan,
}: {
  className?: string;
  children: ReactNode;
  onClick?: () => void;
  platform?: PlatformId;
  plan?: string;
}) {
  return (
    <Link href={downloadPath({ platform, plan })} className={className} onClick={onClick}>
      {children}
    </Link>
  );
}
