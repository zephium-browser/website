"use client";

import { useEffect, useRef, useState } from "react";
import { linuxWaitlistActionsEnabled, parseEmailLink, type EmailLink } from "@/lib/linux-waitlist";
import { useWaitlistRequest } from "@/components/linux-waitlist/use-waitlist-request";
import styles from "@/components/linux-waitlist/waitlist.module.css";

export function LinuxEmailAction({ mode = "legacy" }: { mode?: "legacy" | "unsubscribe" }) {
  const read = useRef(false);
  const [link, setLink] = useState<EmailLink | null>(null);
  const { submit, pending, remaining, result, messageRef } = useWaitlistRequest();

  useEffect(() => {
    if (read.current) return;
    read.current = true;
    const fragment = window.location.hash;
    // Scrub before parsing, rendering or issuing any request. Keep the path and
    // discard queries too: this page accepts secrets only from the fragment.
    window.history.replaceState(window.history.state, "", window.location.pathname);
    // Consume the email link once, including in Strict Mode.
    setLink(parseEmailLink(fragment, mode));
  }, [mode]);

  async function act() {
    if (link?.kind !== "ready" || result?.ok || result?.unavailable || result?.invalidLink) return;
    const next = await submit(link.action, link.token);
    if (next?.ok || next?.invalidLink) setLink({ kind: "missing" });
  }

  let description = "Opening your email link…";
  if (!linuxWaitlistActionsEnabled) {
    description = "Linux notifications are temporarily unavailable. Please check back later and reopen your email link.";
  } else if (link?.kind === "ready") {
    description = link.action === "unsubscribe"
      ? "Stop the Linux release notification for this email address."
      : "Confirm that you want one email when Zephium for Linux is available. No account or subscription is created.";
  } else if (link?.kind === "invalid") {
    description = "This email link is invalid. Reopen the complete link from your email, or sign up again on the download page.";
  } else if (link?.kind === "missing") {
    description = "Reopen the link in your email to continue. Refreshing this page removes the link’s private token.";
  }

  return (
    <div className={styles.confirmation}>
      {!result?.ok && !result?.invalidLink ? <p className={styles.intro}>{description}</p> : null}
      {linuxWaitlistActionsEnabled && link?.kind === "ready" && !result?.unavailable && !result?.invalidLink ? (
        <>
          <button type="button" onClick={act} disabled={pending || remaining > 0} className={styles.button}>
            {pending ? "Sending…" : link.action === "unsubscribe" ? "Unsubscribe" : "Confirm Linux notification"}
          </button>
          {link.action === "confirm" ? <p className={styles.privacy}>This confirmation link expires 24 hours after it was sent.</p> : null}
        </>
      ) : null}
      <div role="status" aria-live="polite" aria-atomic="true">
        {result ? <p ref={messageRef} tabIndex={-1} className={styles.message}>{result.message}</p> : null}
      </div>
      {remaining > 0 ? <p className={styles.cooldown}>You can try again in {remaining} seconds.</p> : null}
      <a href="/download#linux-notification" className={styles.link}>Back to downloads{result?.invalidLink ? " to sign up again" : ""}</a>
      <noscript><p className={styles.message}>Enable JavaScript, then reopen your email link to confirm or unsubscribe.</p></noscript>
    </div>
  );
}
