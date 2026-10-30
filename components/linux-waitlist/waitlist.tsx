"use client";

import Link from "next/link";
import { useEffect, useId, useRef, useState, useSyncExternalStore, type ComponentProps, type FormEvent } from "react";
import {
  forgetJoined,
  honeypotLimit,
  joinWaitlist,
  linuxWaitlistEnabled,
  readJoined,
  rememberJoined,
  subscribeJoined,
} from "@/lib/linux-waitlist";
import { siLinux } from "simple-icons";
import { site } from "@/lib/site";
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
 * The API answers the live site alone, so a local or preview copy adds why
 * an attempt could not go through, rather than leaving it vague.
 */
const OFF_SITE = ` Sign-ups only go through on ${new URL(site.url).host}.`;
const offSite = () => window.location.origin !== site.url;

/** "panel" is centred and stands alone on the download page; "bar" is one slim row, for the end of the home page. */
type Variant = "panel" | "bar";

/**
 * Zephium for Linux, as the page needs it: the signup while it is open, a
 * calm thank-you once someone has joined (remembered in this browser, never
 * the address), and where the news will go when signup is closed. The caller
 * supplies the surface around it and the id its heading gets; a bar sits one
 * heading level lower, because it lives inside another section.
 */
export function LinuxWaitlist({ headingId, variant = "panel" }: { headingId: string; variant?: Variant }) {
  const remembered = useSyncExternalStore(subscribeJoined, readJoined, () => false);
  // Storage can be refused (private windows); a visitor who just joined still sees it worked.
  const [justJoined, setJustJoined] = useState(false);
  const [refocus, setRefocus] = useState<"thanks" | "email" | null>(null);

  if (!linuxWaitlistEnabled) {
    return (
      <div className={rootClass(variant)}>
        <div className={styles.copy}>
          <Heading variant={variant} id={headingId}>
            Zephium for Linux is on the way.
          </Heading>
          <p>News of the release goes out on Discord and X.</p>
        </div>
        <div className={styles.action}>
          <CommunityLinks />
        </div>
      </div>
    );
  }

  if (remembered || justJoined) {
    return (
      <Thanks
        headingId={headingId}
        variant={variant}
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
      variant={variant}
      focusEmail={refocus === "email"}
      onJoined={() => {
        setRefocus("thanks");
        setJustJoined(true);
        rememberJoined();
      }}
    />
  );
}

const rootClass = (variant: Variant) => (variant === "bar" ? `${styles.root} ${styles.bar}` : styles.root);

/** The heading, with the Linux mark beside it. */
function Heading({ variant, id, children, ...rest }: { variant: Variant; id: string } & ComponentProps<"h2">) {
  const Tag = variant === "bar" ? "h3" : "h2";
  return (
    <Tag id={id} {...rest}>
      <svg viewBox="0 0 24 24" aria-hidden="true" className={styles.tux}>
        <path d={siLinux.path} />
      </svg>
      {children}
    </Tag>
  );
}

/** The email field and its button in one row, and everything that can go wrong with them. */
function Signup({
  headingId,
  variant,
  focusEmail,
  onJoined,
}: {
  headingId: string;
  variant: Variant;
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
    <div className={rootClass(variant)}>
      <div className={styles.copy}>
        <Heading variant={variant} id={headingId}>
          Zephium for Linux is coming.
        </Heading>
        <p>Get one email when it&apos;s available.</p>
      </div>
      <div className={styles.action}>
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
            {problem === "unknown" && offSite() ? OFF_SITE : null}
          </p>
        </form>
        <p id={quietId} className={styles.quiet}>
          One release notification, not a newsletter, and no account. <Link href="/privacy">Privacy</Link>
        </p>
        <noscript>
          <p className={styles.note}>Turn on JavaScript to ask for the Linux notification.</p>
        </noscript>
      </div>
    </div>
  );
}

/** Joined. A check draws in, then ways to follow along until the email arrives. */
function Thanks({
  headingId,
  variant,
  focusHeading,
  onAnother,
}: {
  headingId: string;
  variant: Variant;
  focusHeading: boolean;
  onAnother: () => void;
}) {
  const heading = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    // Moves the reader to the result of what they just did, not on a return visit.
    if (focusHeading) heading.current?.focus({ preventScroll: true });
  }, [focusHeading]);

  return (
    <div className={rootClass(variant)}>
      <div className={`${styles.copy} ${styles.thanks}`}>
        <span className={styles.check} aria-hidden="true">
          <svg viewBox="0 0 48 48">
            <circle cx="24" cy="24" r="22" pathLength="1" />
            <path d="M15 25.5 21.5 32 33.5 17.5" pathLength="1" />
          </svg>
        </span>
        <Heading variant={variant} id={headingId} ref={heading} tabIndex={-1}>
          You&apos;re on the list.
        </Heading>
        <p>We&apos;ll send one email when Zephium for Linux is ready.</p>
      </div>
      <div className={styles.action}>
        {/* The bar sits under the places to follow along, so it does not list them again. */}
        {variant === "panel" ? (
          <div className={styles.wait}>
            <h3>While you wait</h3>
            <CommunityLinks />
          </div>
        ) : null}
        <button type="button" onClick={onAnother} className={styles.again}>
          Use another address
        </button>
      </div>
    </div>
  );
}
