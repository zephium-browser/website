import { siAirbnb, siDuckduckgo, siElevenlabs, siTelegram, siYcombinator } from "simple-icons";

/**
 * Site marks as the browser's sidebar and dock show them. Full-colour marks
 * are the product's own SVGs (served from /marks); the rest are single-colour
 * Simple Icons paths. They only ever name the site a tab is showing.
 */
const files = {
  slack: "/marks/slack.svg",
  notion: "/marks/notion.svg",
  linear: "/marks/linear.svg",
  github: "/marks/github-dark.svg",
  youtube: "/marks/youtube.svg",
  figma: "/marks/figma.svg",
  spotify: "/marks/spotify.svg",
  gmail: "/marks/gmail.svg",
  calendar: "/marks/google-calendar.svg",
  chatgpt: "/marks/chatgpt-dark.svg",
  claude: "/marks/claude.svg",
} as const;

const glyphs = {
  airbnb: { path: siAirbnb.path, color: "#ff5a5f", tile: null },
  duckduckgo: { path: siDuckduckgo.path, color: "#de5833", tile: null },
  telegram: { path: siTelegram.path, color: "#29a9eb", tile: null },
  ycombinator: { path: siYcombinator.path, color: "#ffffff", tile: "#f26625" },
  elevenlabs: { path: siElevenlabs.path, color: "#000000", tile: "#ffffff" },
} as const;

/**
 * The made-up sites of the demo have marks of their own: a roof for the stays
 * site, a paper plane for the flights site. Drawn on a 24 unit grid, in white
 * on the site's colour.
 */
const drawn = {
  staybook: {
    tile: "#e8505b",
    glyph: (
      <path
        d="M5.5 11.6 12 6l6.5 5.6M7.8 10v7.6h8.4V10M10.6 17.6v-3.4h2.8v3.4"
        fill="none"
        stroke="#fff"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    ),
  },
  flightfinder: {
    tile: "#1f6fe5",
    glyph: (
      <>
        <path d="M4.8 11.1 18.9 5.1l-5.6 13.8-2.4-5.5-6.1-2.3Z" fill="#fff" stroke="#fff" strokeWidth="1.4" strokeLinejoin="round" />
        <path d="m10.9 13.4 4.4-4.6" stroke="#1f6fe5" strokeWidth="1.3" strokeLinecap="round" />
      </>
    ),
  },
} as const;

export type MarkId = keyof typeof files | keyof typeof glyphs | keyof typeof drawn;

export function Mark({ id, size, className }: { id: MarkId; size: string; className?: string }) {
  if (id in files) {
    return (
      // eslint-disable-next-line @next/next/no-img-element -- a 16px SVG mark needs no optimiser.
      <img
        src={files[id as keyof typeof files]}
        alt=""
        width={16}
        height={16}
        className={className}
        style={{ width: size, height: size, flex: "none", objectFit: "contain" }}
      />
    );
  }
  if (id in drawn) {
    const mark = drawn[id as keyof typeof drawn];
    return (
      <span
        aria-hidden="true"
        className={className}
        style={{
          display: "inline-grid",
          placeItems: "center",
          flex: "none",
          width: size,
          height: size,
          borderRadius: `calc(${size} * 0.26)`,
          background: mark.tile,
        }}
      >
        <svg viewBox="0 0 24 24" style={{ width: "100%", height: "100%" }}>
          {mark.glyph}
        </svg>
      </span>
    );
  }
  const glyph = glyphs[id as keyof typeof glyphs];
  return (
    <span
      aria-hidden="true"
      className={className}
      style={{
        display: "inline-grid",
        placeItems: "center",
        flex: "none",
        width: size,
        height: size,
        borderRadius: `calc(${size} * 0.22)`,
        background: glyph.tile ?? "transparent",
      }}
    >
      <svg viewBox="0 0 24 24" style={{ width: glyph.tile ? "70%" : "100%", height: glyph.tile ? "70%" : "100%" }}>
        <path d={glyph.path} fill={glyph.color} />
      </svg>
    </span>
  );
}
