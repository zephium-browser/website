// Public, build-time configuration. Never infer a destination from the browser.
const configuredOrigin = process.env.NEXT_PUBLIC_LINUX_WAITLIST_API_ORIGIN;
export const waitlistApiOrigin =
  configuredOrigin === "https://api.zephium.app" ||
  configuredOrigin === "https://staging-api.zephium.app"
    ? configuredOrigin
    : null;

export const linuxWaitlistEnabled =
  process.env.NEXT_PUBLIC_LINUX_WAITLIST_ENABLED === "true" && waitlistApiOrigin !== null;
// Closing signup later must not prevent existing members from opting out.
export const linuxWaitlistActionsEnabled = waitlistApiOrigin !== null;

export type WaitlistAction = "confirm" | "unsubscribe";
export type EmailLink =
  | { kind: "ready"; action: WaitlistAction; token: string }
  | { kind: "missing" | "invalid" };

/** Called only after the address has been scrubbed. The token stays in memory. */
export function parseEmailLink(fragment: string, mode: "legacy" | "unsubscribe" = "legacy"): EmailLink {
  if (!fragment || fragment === "#") return { kind: "missing" };
  if (fragment.length > 1500 || /%(?![\da-f]{2})/i.test(fragment)) return { kind: "invalid" };
  const params = new URLSearchParams(fragment.slice(1));
  if (
    [...params.keys()].some((key) => key !== "token" && key !== "action") ||
    params.getAll("token").length !== 1 ||
    params.getAll("action").length > 1
  ) return { kind: "invalid" };
  const token = params.get("token");
  const action = params.get("action") ?? (mode === "legacy" ? "confirm" : "unsubscribe");
  if (
    !token || token.length > 1024 || /[\s\u0000-\u001f\u007f\ufffd]/u.test(token) ||
    (action !== "confirm" && action !== "unsubscribe") ||
    (mode === "unsubscribe" && action !== "unsubscribe") ||
    JSON.stringify({ token }).length > 1900
  ) return { kind: "invalid" };
  return { kind: "ready", action, token };
}

export type WaitlistResult = {
  ok: boolean;
  message: string;
  cooldown: number;
  unavailable?: boolean;
  invalidInput?: boolean;
  invalidLink?: boolean;
};

const unknownOutcome: WaitlistResult = {
  ok: false,
  message: "We couldn’t verify the outcome of your request. Wait a moment, then try again manually.",
  cooldown: 60,
};

function retrySeconds(response: Response, body: unknown): number {
  const header = response.headers.get("Retry-After");
  const error = body && typeof body === "object" && "error" in body ? body.error : null;
  const seconds = error && typeof error === "object" && "retry_after" in error ? error.retry_after : null;
  const values = [typeof seconds === "number" ? seconds : 0];
  if (header) {
    values.push(/^\d+$/.test(header) ? Number(header) : (Date.parse(header) - Date.now()) / 1000);
  }
  return Math.ceil(Math.max(0, ...values.filter((value) => Number.isFinite(value) && value > 0)));
}

/** No retries, logs, credentials, analytics or provider calls. */
export async function postWaitlist(
  action: "signup" | WaitlistAction,
  value: string,
  website = "",
): Promise<WaitlistResult> {
  if (!waitlistApiOrigin || (action === "signup" && !linuxWaitlistEnabled)) {
    return { ok: false, message: "Linux notifications are temporarily unavailable. Please check back later.", cooldown: 0, unavailable: true };
  }
  try {
    const response = await fetch(`${waitlistApiOrigin}/v1/waitlists/linux${action === "signup" ? "" : `/${action}`}`, {
      method: "POST",
      credentials: "omit",
      cache: "no-store",
      redirect: "error",
      referrerPolicy: "no-referrer",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(action === "signup" ? { email: value, website } : { token: value }),
      signal: AbortSignal.timeout(15000),
    });
    // A malformed response is an unknown outcome, never success.
    const body: unknown = await response.json().catch(() => null);
    const cooldown = retrySeconds(response, body);
    const expected = action === "signup" ? "accepted" : action === "confirm" ? "confirmed" : "unsubscribed";
    if (
      response.status === (action === "signup" ? 202 : 200) &&
      body && typeof body === "object" && expected in body && body[expected as keyof typeof body] === true
    ) {
      return {
        ok: true,
        message: action === "signup"
          ? "You're on the list. We'll email you when Linux is available."
          : action === "confirm"
            ? "Your Linux notification is confirmed. We’ll email you when Zephium for Linux is available."
            : "You’ve been unsubscribed from the Linux release notification.",
        cooldown: action === "signup" ? Math.max(60, cooldown) : 0,
      };
    }
    const error = body && typeof body === "object" && "error" in body ? body.error : null;
    const code = error && typeof error === "object" && "code" in error ? error.code : null;
    if (response.status === 400 && code === "invalid_or_expired_token") {
      return { ok: false, message: "This link is invalid or has expired. You can sign up again on the download page.", cooldown, invalidLink: true };
    }
    if (response.status === 400 && code === "invalid_request") {
      return { ok: false, message: action === "signup" ? "Check your email address and try again." : "This link is invalid. You can sign up again on the download page.", cooldown, invalidInput: true, invalidLink: action !== "signup" };
    }
    if (response.status === 403 || response.status === 404) {
      return { ok: false, message: "Linux notifications are temporarily unavailable. Please check back later.", cooldown, unavailable: true };
    }
    if (response.status === 413) {
      return { ok: false, message: "The input is too large. Please check it and try again.", cooldown, invalidInput: true };
    }
    if (response.status === 429) {
      return { ok: false, message: "Too many requests. Please wait before trying again.", cooldown: Math.max(60, cooldown) };
    }
    if (response.status === 503) {
      return { ok: false, message: "Linux notifications are temporarily unavailable. Please try again manually after the wait below.", cooldown: Math.max(60, cooldown) };
    }
    return { ...unknownOutcome, cooldown: Math.max(60, cooldown) };
  } catch {
    // Network errors and timeouts can happen after the server accepts a request.
    return unknownOutcome;
  }
}
