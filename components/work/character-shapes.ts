/**
 * Ported from the product (frame/src/shared/ui/presence/shapes.ts): the
 * agents' silhouettes, as masks over one lit body: one family, a shape per kind.
 */
export type CharacterKind = "lead" | "browser" | "research" | "computer" | "connection";

/** The lead's own figure, one of a small family, kept for the life of a work. */
export type LeadLook = "orb" | "drop" | "prism" | "gem" | "egg" | "pearl";

const LOOKS: readonly LeadLook[] = ["orb", "drop", "prism", "gem", "egg", "pearl"];

/** The lead's look for a work: the same every time the work opens, seeded by its id. */
export function leadLook(seed: string): LeadLook {
  let hash = 2166136261;
  for (let i = 0; i < seed.length; i++) hash = Math.imul(hash ^ seed.charCodeAt(i), 16777619);
  return LOOKS[(hash >>> 0) % LOOKS.length]!;
}

const n = (value: number) => Number(value.toFixed(2));

function squircle(power: number, rx: number, ry: number): string {
  const points: string[] = [];
  for (let i = 0; i < 72; i++) {
    const t = (i / 72) * Math.PI * 2;
    const c = Math.cos(t);
    const s = Math.sin(t);
    const x = 50 + rx * Math.sign(c) * Math.abs(c) ** (2 / power);
    const y = 50 + ry * Math.sign(s) * Math.abs(s) ** (2 / power);
    points.push(`${n(x)} ${n(y)}`);
  }
  return `<path d='M${points.join("L")}Z'/>`;
}

function roundedPolygon(
  sides: number,
  radius: number,
  squash: number,
  soften: number,
  turn = 0,
  cy = 50,
): string {
  const corners = Array.from({ length: sides }, (_, i) => {
    const t = (i / sides) * Math.PI * 2 + turn;
    return [50 + radius * Math.cos(t), cy + radius * squash * Math.sin(t)] as const;
  });
  const toward = (a: readonly [number, number], b: readonly [number, number]) =>
    `${n(a[0] + (b[0] - a[0]) * soften)} ${n(a[1] + (b[1] - a[1]) * soften)}`;
  let path = "";
  corners.forEach((corner, i) => {
    const previous = corners[(i + sides - 1) % sides]!;
    const next = corners[(i + 1) % sides]!;
    path += `${i ? "L" : "M"}${toward(corner, previous)}Q${n(corner[0])} ${n(corner[1])} ${toward(corner, next)}`;
  });
  return `<path d='${path}Z'/>`;
}

const clover = [
  [50, 29],
  [71, 50],
  [50, 71],
  [29, 50],
]
  .map(([x, y]) => `<circle cx='${x}' cy='${y}' r='25'/>`)
  .concat("<circle cx='50' cy='50' r='30'/>")
  .join("");

const UP = -Math.PI / 2;

const SHAPES: Record<Exclude<CharacterKind, "lead"> | LeadLook, string> = {
  browser: squircle(4.4, 45, 45),
  research: roundedPolygon(6, 49, 0.9, 0.3),
  computer: "<rect x='3' y='15' width='94' height='70' rx='35'/>",
  connection: clover,
  orb: "<circle cx='50' cy='50' r='47'/>",
  pearl: "<circle cx='50' cy='50' r='47'/>",
  drop: "<path d='M50 3C62 20 91 40 91 62A41 38 0 0 1 9 62C9 40 38 20 50 3Z'/>",
  prism: roundedPolygon(3, 58, 1, 0.36, UP, 60),
  gem: roundedPolygon(4, 52, 0.94, 0.3, UP),
  egg: "<path d='M50 3C76 3 92 36 92 60C92 84 73 97 50 97C27 97 8 84 8 60C8 36 24 3 50 3Z'/>",
};

const masks = new Map<string, string>();

/** A figure's silhouette as a mask image. */
export function characterMask(kind: CharacterKind, look: LeadLook): string {
  const key = kind === "lead" ? look : kind;
  let mask = masks.get(key);
  if (!mask) {
    const svg = `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100' fill='white'>${SHAPES[key]}</svg>`;
    mask = `url("data:image/svg+xml,${encodeURIComponent(svg)}")`;
    masks.set(key, mask);
  }
  return mask;
}
