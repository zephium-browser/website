/**
 * The Linux release notification: one email when Zephium for Linux is ready.
 * The destination is fixed when the site is built and never read from the
 * browser. Nothing here logs, retries or sends an address anywhere else.
 */
const origins = ["https://api.zephium.app", "https://staging-api.zephium.app"];
const configured = process.env.NEXT_PUBLIC_LINUX_WAITLIST_API_ORIGIN;

export const waitlistApiOrigin = configured && origins.includes(configured) ? configured : null;

/** Signup stays off in production until the API there is switched on. */
export const linuxWaitlistEnabled =
  process.env.NEXT_PUBLIC_LINUX_WAITLIST_ENABLED === "true" && waitlistApiOrigin !== null;

/** Turning signup off must never stop someone from unsubscribing. */
export const unsubscribeEnabled = waitlistApiOrigin !== null;

/** The longest the hidden trap field may be, as the API allows. */
export const honeypotLimit = 200;

/** What the API said, reduced to what the page can act on. */
export type Outcome =
  | { kind: "accepted" }
  | { kind: "rejected" }
  | { kind: "limited"; seconds: number }
  | { kind: "unknown" };

/** The wait the API asks for, from its header and its body, whichever is longer. */
function waitSeconds(response: Response, body: unknown): number {
  const error = body && typeof body === "object" && "error" in body ? body.error : null;
  const fromBody = error && typeof error === "object" && "retry_after" in error ? error.retry_after : 0;
  const header = response.headers.get("Retry-After");
  const fromHeader = header ? (/^\d+$/.test(header) ? Number(header) : (Date.parse(header) - Date.now()) / 1000) : 0;
  const seconds = [fromBody, fromHeader].filter((value): value is number => typeof value === "number" && Number.isFinite(value));
  return Math.ceil(Math.max(0, ...seconds));
}

/**
 * One request, no retries. A response that cannot be read (including one the
 * browser blocks) is an unknown outcome, never a success.
 */
async function send(path: string, payload: object, accepted: string, status: number): Promise<Outcome> {
  if (!waitlistApiOrigin) return { kind: "unknown" };
  try {
    const response = await fetch(`${waitlistApiOrigin}/v1/waitlists/linux${path}`, {
      method: "POST",
      credentials: "omit",
      cache: "no-store",
      redirect: "error",
      referrerPolicy: "no-referrer",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
      signal: AbortSignal.timeout(15000),
    });
    const body: unknown = await response.json().catch(() => null);
    if (
      response.status === status &&
      body && typeof body === "object" && accepted in body && body[accepted as keyof typeof body] === true
    ) return { kind: "accepted" };
    const seconds = waitSeconds(response, body);
    if (response.status === 429 || (response.status === 503 && seconds > 0)) {
      return { kind: "limited", seconds: Math.max(5, seconds || 60) };
    }
    if (response.status === 400 || response.status === 413) return { kind: "rejected" };
    return { kind: "unknown" };
  } catch {
    // A timeout can happen after the server accepted the request.
    return { kind: "unknown" };
  }
}

/** Asks for the one release email. `website` is the hidden trap field. */
export function joinWaitlist(email: string, website: string): Promise<Outcome> {
  if (!linuxWaitlistEnabled) return Promise.resolve({ kind: "unknown" });
  return send("", { email, website }, "accepted", 202);
}

/** Stops the release email for the address the private link belongs to. */
export function leaveWaitlist(token: string): Promise<Outcome> {
  return send("/unsubscribe", { token }, "unsubscribed", 200);
}

/** The unsubscribe link keeps its token in the fragment, scrubbed before this runs. */
export type UnsubscribeLink = { kind: "ready"; token: string } | { kind: "missing" | "invalid" };

/** Reads `#token=...` (optionally with `action=unsubscribe`) and nothing else. */
export function parseUnsubscribeLink(fragment: string): UnsubscribeLink {
  if (!fragment || fragment === "#") return { kind: "missing" };
  if (fragment.length > 1500 || /%(?![\da-f]{2})/i.test(fragment)) return { kind: "invalid" };
  const params = new URLSearchParams(fragment.slice(1));
  const action = params.get("action");
  const token = params.get("token");
  if (
    [...params.keys()].some((key) => key !== "token" && key !== "action") ||
    params.getAll("token").length !== 1 ||
    params.getAll("action").length > 1 ||
    (action !== null && action !== "unsubscribe") ||
    !token || token.length > 1024 || /[\s\u0000-\u001f\u007f�]/u.test(token) ||
    JSON.stringify({ token }).length > 1900
  ) return { kind: "invalid" };
  return { kind: "ready", token };
}

const memory = "zephium:linux-waitlist";
const memoryEvent = "zephium:linux-waitlist-change";

/**
 * Whether this browser already joined. Only a flag and a time are kept, never
 * the address, so a return visit can say thanks instead of asking again.
 */
export function readJoined(): boolean {
  try {
    const value: unknown = JSON.parse(window.localStorage.getItem(memory) ?? "null");
    return Boolean(value && typeof value === "object" && "joined" in value && value.joined === true);
  } catch {
    return false;
  }
}

function announce() {
  window.dispatchEvent(new Event(memoryEvent));
}

export function rememberJoined() {
  try {
    window.localStorage.setItem(memory, JSON.stringify({ joined: true, at: Date.now() }));
  } catch {
    // Private windows may refuse storage; the page still shows its own success.
  }
  announce();
}

export function forgetJoined() {
  try {
    window.localStorage.removeItem(memory);
  } catch {
    // Nothing to remove.
  }
  announce();
}

/** For useSyncExternalStore: tells the page when the flag changes, here or in another tab. */
export function subscribeJoined(change: () => void) {
  const onStorage = (event: StorageEvent) => {
    if (event.key === null || event.key === memory) change();
  };
  window.addEventListener(memoryEvent, change);
  window.addEventListener("storage", onStorage);
  return () => {
    window.removeEventListener(memoryEvent, change);
    window.removeEventListener("storage", onStorage);
  };
}
