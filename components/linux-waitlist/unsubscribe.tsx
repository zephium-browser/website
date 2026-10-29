"use client";

import { useEffect, useRef, useState } from "react";
import {
  forgetJoined,
  leaveWaitlist,
  parseUnsubscribeLink,
  unsubscribeEnabled,
  type UnsubscribeLink,
} from "@/lib/linux-waitlist";
import { formatWait, useCountdown } from "./use-countdown";
import styles from "./waitlist.module.css";

type Stage = "ready" | "done" | "bad-link" | "unknown" | "limited";

/**
 * The page the launch email links to. The private token comes from the
 * address fragment, is removed from the address before anything else happens,
 * and lives only in memory. Nothing is sent until the button is pressed.
 */
export function LinuxUnsubscribe() {
  const read = useRef(false);
  const inFlight = useRef(false);
  const note = useRef<HTMLParagraphElement>(null);
  const [link, setLink] = useState<UnsubscribeLink | null>(null);
  const [stage, setStage] = useState<Stage>("ready");
  const [pending, setPending] = useState(false);
  const { seconds, start } = useCountdown();

  useEffect(() => {
    if (read.current) return;
    read.current = true;
    const fragment = window.location.hash;
    // Scrub first. Queries go too: this page accepts a secret only in the fragment.
    window.history.replaceState(window.history.state, "", window.location.pathname);
    // The link is read once, including under Strict Mode's second run.
    setLink(parseUnsubscribeLink(fragment));
  }, []);

  useEffect(() => {
    if (stage !== "ready") note.current?.focus();
  }, [stage]);

  async function unsubscribe() {
    if (link?.kind !== "ready" || inFlight.current || seconds > 0) return;
    inFlight.current = true;
    setPending(true);
    const outcome = await leaveWaitlist(link.token);
    inFlight.current = false;
    setPending(false);
    if (outcome.kind === "accepted") {
      forgetJoined();
      setLink({ kind: "missing" });
      setStage("done");
    } else if (outcome.kind === "rejected") {
      setLink({ kind: "missing" });
      setStage("bad-link");
    } else if (outcome.kind === "limited") {
      start(outcome.seconds);
      setStage("limited");
    } else {
      setStage("unknown");
    }
  }

  const ready = unsubscribeEnabled && link?.kind === "ready";
  let text = "Opening your link.";
  if (stage === "done") text = "You've been unsubscribed. We won't send the Linux email to this address.";
  else if (stage === "bad-link") text = "This link is invalid or has expired. You can sign up again on the download page.";
  else if (stage === "limited") text = "Too many attempts. Please wait a moment.";
  else if (stage === "unknown") text = "We couldn't confirm that. Please try again in a moment.";
  else if (!unsubscribeEnabled) text = "Unsubscribing is not available right now. Please reopen your email link later.";
  else if (link?.kind === "ready") text = "Stop the Linux release email for this address.";
  else if (link?.kind === "invalid") text = "This link is not valid. Open the whole link from your email again.";
  else if (link?.kind === "missing") text = "Open the link from your email to continue. Reloading this page removes its private token.";

  return (
    <div className={styles.page}>
      <p
        ref={note}
        tabIndex={-1}
        role="status"
        aria-live="polite"
        className={stage === "ready" ? undefined : styles.note}
      >
        {text}
      </p>
      {ready ? (
        <button type="button" onClick={unsubscribe} disabled={pending || seconds > 0} className={styles.button}>
          {pending ? (
            <svg className={styles.spinner} viewBox="0 0 20 20" aria-hidden="true">
              <circle cx="10" cy="10" r="7.5" pathLength="100" />
            </svg>
          ) : null}
          {seconds > 0 ? `Try again in ${formatWait(seconds)}` : "Unsubscribe"}
        </button>
      ) : null}
      <a href="/download#linux" className={styles.link}>
        Back to downloads
      </a>
      <noscript>
        <p>Turn on JavaScript, then open your email link again to unsubscribe.</p>
      </noscript>
    </div>
  );
}
