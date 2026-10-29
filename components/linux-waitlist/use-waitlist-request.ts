"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { postWaitlist, type WaitlistAction, type WaitlistResult } from "@/lib/linux-waitlist";

export function useWaitlistRequest() {
  const inFlight = useRef(false);
  const deadline = useRef(0);
  const [pending, setPending] = useState(false);
  const [remaining, setRemaining] = useState(0);
  const [result, setResult] = useState<WaitlistResult | null>(null);
  const messageRef = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    if (!remaining) return;
    const timer = window.setInterval(() => {
      setRemaining(Math.max(0, Math.ceil((deadline.current - Date.now()) / 1000)));
    }, 1000);
    return () => window.clearInterval(timer);
  }, [remaining]);

  useEffect(() => {
    if (result) messageRef.current?.focus();
  }, [result]);

  const submit = useCallback(async (action: "signup" | WaitlistAction, value: string, website = "") => {
    if (inFlight.current || Date.now() < deadline.current) return;
    inFlight.current = true;
    setPending(true);
    setResult(null);
    const next = await postWaitlist(action, value, website);
    deadline.current = Date.now() + next.cooldown * 1000;
    setRemaining(next.cooldown);
    setResult(next);
    setPending(false);
    inFlight.current = false;
    return next;
  }, []);

  return { submit, pending, remaining, result, messageRef };
}
