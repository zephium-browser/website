"use client";

import { useState, type FormEvent } from "react";
import { linuxWaitlistEnabled } from "@/lib/linux-waitlist";
import { useWaitlistRequest } from "./use-waitlist-request";
import styles from "./waitlist.module.css";

export function LinuxWaitlistSignup() {
  const [email, setEmail] = useState("");
  const [website, setWebsite] = useState("");
  const { submit, pending, remaining, result, messageRef } = useWaitlistRequest();

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    if (!form.reportValidity() || !email.trim() || result?.unavailable) return;
    const next = await submit("signup", email.trim(), website);
    if (next?.ok) setEmail("");
  }

  return (
    <section id="linux-notification" aria-labelledby="linux-title" className={styles.panel}>
      <h2 id="linux-title">Zephium for Linux is coming.</h2>
      <p className={styles.intro}>Get one email when it&apos;s available.</p>
      {linuxWaitlistEnabled ? (
        <form onSubmit={onSubmit} aria-busy={pending} className={styles.form}>
          <div hidden aria-hidden="true">
            <label htmlFor="linux-website">Leave this field empty</label>
            <input
              id="linux-website"
              name="website"
              type="text"
              tabIndex={-1}
              autoComplete="off"
              maxLength={254}
              value={website}
              onChange={(event) => setWebsite(event.target.value)}
            />
          </div>
          <label htmlFor="linux-email">Email address</label>
          <div className={styles.fields}>
            <input
              id="linux-email"
              type="email"
              autoComplete="email"
              autoCapitalize="none"
              spellCheck={false}
              required
              maxLength={254}
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              disabled={pending || result?.unavailable}
              aria-invalid={result?.invalidInput || undefined}
              aria-describedby={`linux-privacy${result ? " linux-result" : ""}`}
              className={styles.input}
            />
            <button type="submit" disabled={pending || remaining > 0 || result?.unavailable} className={styles.button}>
              {pending ? "Sending…" : "Notify me"}
            </button>
          </div>
        </form>
      ) : <p className={styles.message}>Linux notifications are temporarily unavailable. Please check back later.</p>}
      <p id="linux-privacy" className={styles.privacy}>
        By submitting, you ask for one Linux release notification, not a general newsletter.
        No account or subscription is created.{" "}
        <a href="/privacy">Privacy policy</a>.
      </p>
      <div role="status" aria-live="polite" aria-atomic="true">
        {result ? <p id="linux-result" ref={messageRef} tabIndex={-1} className={styles.message}>{result.message}</p> : null}
      </div>
      {remaining > 0 ? <p className={styles.cooldown}>You can submit again in {remaining} seconds.</p> : null}
      {linuxWaitlistEnabled ? <noscript><p className={styles.message}>Enable JavaScript to request a Linux notification.</p></noscript> : null}
    </section>
  );
}
