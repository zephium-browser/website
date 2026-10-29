"use client";

import Link from "next/link";
import { useEffect, useId, useRef, useState, useSyncExternalStore, type FormEvent } from "react";
import {
  forgetJoined,
  honeypotLimit,
  joinWaitlist,
  linuxWaitlistEnabled,
  readJoined,
  rememberJoined,
  subscribeJoined,
} from "@/lib/linux-waitlist";
import { CommunityLinks } from "./community-links";
import { formatWait, useCountdown } from "./use-countdown";
import styles from "./waitlist.module.css";

type Problem = "invalid" | "limited" | "unknown";

const MESSAGES: Record<Problem, string> = {
  invalid: "Enter a valid email address.",
  limited: "Too many attempts. Please wait a moment.",
  unknown: "We couldn't confirm that. Please try again in a moment.",
};

/**
 * Zephium for Linux, as the page needs it: the signup while it is open, a
 * calm thank-you once someone has joined (remembered in this browser, never
 * the address), and a plain "follow along" when signup is closed. The caller
 * supplies the panel around it and the id its heading gets.
 */
export function LinuxWaitlist({ headingId }: { headingId: string }) {
  const remembered = useSyncExternalStore(subscribeJoined, readJoined, () => false);
  // Storage can be refused (private windows); a visitor who just joined still sees it worked.
  const [justJoined, setJustJoined] = useState(false);
  const [refocus, setRefocus] = useState<"thanks" | "email" | null>(null);

  if (!linuxWaitlistEnabled) {
    return (
      <div className={styles.root}>
        <h2 id={headingId}>Zephium for Linux is coming.</h2>
        <p>Follow along and you&apos;ll hear the moment it lands.</p>
        <CommunityLinks />
      </div>
    );
  }

  if (remembered || justJoined) {
    return (
      <Thanks
        headingId={headingId}
        focusHeading={refocus === "thanks"}
        onAnother={() => {
          forgetJoined();
          setJustJoined(false);
          setRefocus("email");
        }}
      />
    );
  }

  return (
    <Signup
      headingId={headingId}
      focusEmail={refocus === "email"}
      onJoined={() => {
        setRefocus("thanks");
        setJustJoined(true);
        rememberJoined();
      }}
    />
  );
}

/** The email field and its button in one row, and everything that can go wrong with them. */
function Signup({
  headingId,
  focusEmail,
  onJoined,
}: {
  headingId: string;
  focusEmail: boolean;
  onJoined: () => void;
}) {
  const [email, setEmail] = useState("");
  const [website, setWebsite] = useState("");
  const [problem, setProblem] = useState<Problem | null>(null);
  const [pending, setPending] = useState(false);
  const inFlight = useRef(false);
  const input = useRef<HTMLInputElement>(null);
  const { seconds, start } = useCountdown();
  const ids = useId();
  const quietId = `${ids}-quiet`;
  const noteId = `${ids}-note`;

  useEffect(() => {
    if (focusEmail) input.current?.focus();
  }, [focusEmail]);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (inFlight.current || seconds > 0) return;
    const field = input.current;
    const value = email.trim();
    if (!field || !value || !field.checkValidity()) {
      setProblem("invalid");
      field?.focus();
      return;
    }
    inFlight.current = true;
    setPending(true);
    setProblem(null);
    const outcome = await joinWaitlist(value, website);
    inFlight.current = false;
    setPending(false);
    if (outcome.kind === "accepted") return onJoined();
    if (outcome.kind === "limited") start(outcome.seconds);
    setProblem(outcome.kind === "rejected" ? "invalid" : outcome.kind);
  }

  return (
    <div className={styles.root}>
      <h2 id={headingId}>Zephium for Linux is coming.</h2>
      <p>Get one email when it&apos;s available.</p>
      <form onSubmit={submit} noValidate aria-busy={pending} className={styles.form}>
        <div hidden aria-hidden="true">
          <label htmlFor={`${ids}-website`}>Leave this field empty</label>
          <input
            id={`${ids}-website`}
            name="website"
            type="text"
            tabIndex={-1}
            autoComplete="off"
            maxLength={honeypotLimit}
            value={website}
            onChange={(event) => setWebsite(event.target.value)}
          />
        </div>
        <div className={styles.row} data-invalid={problem === "invalid" || undefined}>
          <label htmlFor={`${ids}-email`} className={styles.label}>
            Email address
          </label>
          <input
            ref={input}
            id={`${ids}-email`}
            type="email"
            name="email"
            placeholder="Email address"
            autoComplete="email"
            autoCapitalize="none"
            spellCheck={false}
            maxLength={254}
            required
            readOnly={pending}
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            aria-invalid={problem === "invalid" || undefined}
            aria-describedby={problem ? `${quietId} ${noteId}` : quietId}
            className={styles.input}
          />
          <button type="submit" disabled={pending || seconds > 0} className={styles.button}>
            {pending ? (
              <svg className={styles.spinner} viewBox="0 0 20 20" aria-hidden="true">
                <circle cx="10" cy="10" r="7.5" pathLength="100" />
              </svg>
            ) : null}
            {seconds > 0 ? `Try again in ${formatWait(seconds)}` : "Notify me"}
          </button>
        </div>
        <p id={noteId} role="status" aria-live="polite" className={styles.note}>
          {problem ? MESSAGES[problem] : null}
        </p>
      </form>
      <p id={quietId} className={styles.quiet}>
        One release notification, not a newsletter, and no account. <Link href="/privacy">Privacy</Link>
      </p>
      <noscript>
        <p className={styles.note}>Turn on JavaScript to ask for the Linux notification.</p>
      </noscript>
    </div>
  );
}

/** Joined. A check draws in, then ways to follow along until the email arrives. */
function Thanks({
  headingId,
  focusHeading,
  onAnother,
}: {
  headingId: string;
  focusHeading: boolean;
  onAnother: () => void;
}) {
  const heading = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    // Moves the reader to the result of what they just did, not on a return visit.
    if (focusHeading) heading.current?.focus({ preventScroll: true });
  }, [focusHeading]);

  return (
    <div className={styles.root}>
      <span className={styles.check} aria-hidden="true">
        <svg viewBox="0 0 48 48">
          <circle cx="24" cy="24" r="22" pathLength="1" />
          <path d="M15 25.5 21.5 32 33.5 17.5" pathLength="1" />
        </svg>
      </span>
      <h2 id={headingId} ref={heading} tabIndex={-1}>
        You&apos;re on the list.
      </h2>
      <p>We&apos;ll send one email when Zephium for Linux is ready.</p>
      <div className={styles.wait}>
        <h3>While you wait</h3>
        <CommunityLinks />
      </div>
      <button type="button" onClick={onAnother} className={styles.again}>
        Use another address
      </button>
    </div>
  );
}
