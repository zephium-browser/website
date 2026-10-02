/* Ported from the product (frame/src/shared/ui/presence/orb.ts). */
/**
 * The working indicator: a dot sphere drawn once into a strip of frames and
 * shown one frame at a time, so a running indicator costs one composited
 * layer sliding by whole frames and never a paint.
 */

type Point = readonly [number, number, number];
type Dot = { x: number; y: number; r: number; a: number };
type Line = { x1: number; y1: number; x2: number; y2: number; a: number };
type Frame = { dots: Dot[]; lines: Line[] };

type OrbStrip = { frames: number; fps: number; mask: string };

const TAU = Math.PI * 2;
const rad = (degrees: number) => (degrees * Math.PI) / 180;

function rotateX([x, y, z]: Point, angle: number): Point {
  const c = Math.cos(angle);
  const s = Math.sin(angle);
  return [x, y * c - z * s, y * s + z * c];
}

function rotateY([x, y, z]: Point, angle: number): Point {
  const c = Math.cos(angle);
  const s = Math.sin(angle);
  return [x * c + z * s, y, -x * s + z * c];
}

function rotateZ([x, y, z]: Point, angle: number): Point {
  const c = Math.cos(angle);
  const s = Math.sin(angle);
  return [x * c - y * s, x * s + y * c, z];
}

/** Front dots are brighter and larger; the far side stays as a faint lattice. */
const depth = (z: number) => (z + 1) / 2;
const alphaAt = (z: number, back = 0.14) => back + (1 - back) * depth(z) ** 1.6;
const sizeAt = (z: number) => 0.62 + 0.38 * depth(z);

const PHI = (1 + Math.sqrt(5)) / 2;
const ICOSAHEDRON: Point[] = (
  [
    [-1, PHI, 0],
    [1, PHI, 0],
    [-1, -PHI, 0],
    [1, -PHI, 0],
    [0, -1, PHI],
    [0, 1, PHI],
    [0, -1, -PHI],
    [0, 1, -PHI],
    [PHI, 0, -1],
    [PHI, 0, 1],
    [-PHI, 0, -1],
    [-PHI, 0, 1],
  ] as Point[]
).map(normalise);

function normalise([x, y, z]: Point): Point {
  const length = Math.hypot(x, y, z);
  return [x / length, y / length, z / length];
}

/** The icosahedron turned so one vertex is the pole: it repeats every fifth of a turn. */
function poled(points: readonly Point[]): Point[] {
  const angle = Math.atan2(1, PHI);
  return points.map((point) => rotateZ(point, angle));
}

function edges(points: readonly Point[]): [number, number][] {
  const pairs: [number, number][] = [];
  for (let i = 0; i < points.length; i++)
    for (let j = i + 1; j < points.length; j++) {
      const [a, b] = [points[i]!, points[j]!];
      if (Math.hypot(a[0] - b[0], a[1] - b[1], a[2] - b[2]) < 1.1) pairs.push([i, j]);
    }
  return pairs;
}

/** An evenly dotted sphere: the icosahedron's faces split, pushed out to the sphere. */
function geodesic(divisions: number): Point[] {
  const base = poled(ICOSAHEDRON);
  const seen = new Map<string, Point>();
  const add = (point: Point) => {
    const unit = normalise(point);
    seen.set(unit.map((value) => value.toFixed(4)).join(","), unit);
  };
  const pairs = edges(base);
  const linked = new Set(pairs.map(([i, j]) => `${i}:${j}`));
  const joined = (i: number, j: number) => linked.has(`${Math.min(i, j)}:${Math.max(i, j)}`);
  for (let i = 0; i < base.length; i++)
    for (let j = i + 1; j < base.length; j++)
      for (let k = j + 1; k < base.length; k++) {
        if (!joined(i, j) || !joined(j, k) || !joined(i, k)) continue;
        const [a, b, c] = [base[i]!, base[j]!, base[k]!];
        for (let u = 0; u <= divisions; u++)
          for (let v = 0; v <= divisions - u; v++) {
            const w = divisions - u - v;
            add([
              (a[0] * u + b[0] * v + c[0] * w) / divisions,
              (a[1] * u + b[1] * v + c[1] * w) / divisions,
              (a[2] * u + b[2] * v + c[2] * w) / divisions,
            ]);
          }
      }
  return [...seen.values()];
}

type Spec = {
  frames: number;
  fps: number;
  draw: (
    t: number,
    size: number,
  ) => {
    points: { p: Point; scale?: number; alpha?: number }[];
    links?: [Point, Point][];
  };
};

/** Small indicators carry fewer, larger dots, so they read as a sphere and not as grain. */
const FINE = geodesic(3);
const COARSE = geodesic(2);

/** Turn about the vertical axis, then tip the axis toward the viewer and sideways. */
const view = (tilt: number, lean: number) => (p: Point, turn: number) =>
  rotateZ(rotateX(rotateY(p, turn), rad(tilt)), rad(lean));

/**
 * The one working indicator: an evenly dotted sphere turning a fifth of a turn
 * (it repeats every fifth), while a band of light rises through it from pole to
 * pole, lifting the dots it passes. Thought moving through a mind.
 */
const CORE: Spec = {
  frames: 30,
  fps: 20,
  draw: (t, size) => {
    const at = view(-20, -14);
    const band = 1.35 - 2.7 * t;
    return {
      points: (size < 16 ? COARSE : FINE).map((p) => {
        const q = at(p, (t * TAU) / 5);
        const near = Math.exp(-(((p[1] - band) / 0.34) ** 2));
        return {
          p: q,
          scale: 0.78 + 0.62 * near,
          alpha: Math.min(1, alphaAt(q[2], 0.16) * (0.58 + 0.9 * near)),
        };
      }),
    };
  },
};

function frame(spec: Spec, t: number, size: number): Frame {
  const { points, links = [] } = spec.draw(t, size);
  const radius = size * 0.42;
  const centre = size / 2;
  const dot =
    size < 16 ? Math.max(0.62, size * 0.034) : Math.max(0.55, size * (size < 28 ? 0.027 : 0.021));
  const place = (p: Point) => [centre + p[0] * radius, centre + p[1] * radius] as const;
  const dots = points
    .map(({ p, scale = 1, alpha }) => {
      const [x, y] = place(p);
      return { x, y, r: dot * scale * sizeAt(p[2]), a: alpha ?? alphaAt(p[2]), z: p[2] };
    })
    .sort((a, b) => a.z - b.z);
  const lines = links.map(([a, b]) => {
    const [x1, y1] = place(a);
    const [x2, y2] = place(b);
    return { x1, y1, x2, y2, a: 0.1 + 0.42 * depth((a[2] + b[2]) / 2) ** 2 };
  });
  return { dots, lines };
}

const n = (value: number) => Number(value.toFixed(2));

function svg(spec: Spec, size: number): string {
  const stroke = n(Math.max(0.4, size * 0.012));
  const parts: string[] = [];
  for (let i = 0; i < spec.frames; i++) {
    const { dots, lines } = frame(spec, i / spec.frames, size);
    parts.push(`<g transform='translate(${i * size} 0)'>`);
    for (const line of lines)
      parts.push(
        `<line x1='${n(line.x1)}' y1='${n(line.y1)}' x2='${n(line.x2)}' y2='${n(line.y2)}' stroke='white' stroke-width='${stroke}' stroke-opacity='${n(line.a)}'/>`,
      );
    for (const dot of dots)
      parts.push(
        `<circle cx='${n(dot.x)}' cy='${n(dot.y)}' r='${n(dot.r)}' fill-opacity='${n(Math.min(1, dot.a))}'/>`,
      );
    parts.push("</g>");
  }
  const width = size * spec.frames;
  return `<svg xmlns='http://www.w3.org/2000/svg' width='${width}' height='${size}' viewBox='0 0 ${width} ${size}' fill='white'>${parts.join("")}</svg>`;
}

const strips = new Map<number, OrbStrip>();

/** The strip at one size, drawn once per document and reused by every copy. */
export function orbStrip(size: number): OrbStrip {
  let strip = strips.get(size);
  if (!strip) {
    strip = {
      frames: CORE.frames,
      fps: CORE.fps,
      mask: `url("data:image/svg+xml,${encodeURIComponent(svg(CORE, size))}")`,
    };
    strips.set(size, strip);
  }
  return strip;
}

/**
 * Whole-frame holds: the strip jumps a frame at a time and never slides
 * between two. Steps are fractions of the strip's own width, so the orb can
 * be drawn at any scale.
 */
export function orbKeyframes(frames: number): Keyframe[] {
  const at = (i: number) => `translateX(${(-i * 100) / frames}%)`;
  const keys: Keyframe[] = [];
  for (let i = 0; i < frames; i++) {
    keys.push({ offset: i / frames, transform: at(i) });
    keys.push({ offset: Math.min(1, (i + 1) / frames - 1e-4), transform: at(i) });
  }
  keys.push({ offset: 1, transform: at(frames - 1) });
  return keys;
}
