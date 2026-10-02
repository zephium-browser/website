"use client";

import { useEffect, useRef, type CSSProperties } from "react";
import styles from "./clouds.module.css";

/*
 * The sky. Clouds are drawn once, by a shader, into three layers (far, middle,
 * near), and from then on only moved, never redrawn. The far and near layers
 * are painted as tiles that repeat seamlessly, so they can drift sideways for
 * ever on the compositor; the middle clouds frame the words and only sway.
 * Moving the pointer leans the layers by their depth, in quiet parallax. The
 * sky's gradient and the sun are plain CSS behind them.
 *
 * The cloud shader descends from one made for Aceternity UI: each cloud is an
 * envelope (a dome over a flat base) filled with domain-warped billow noise,
 * shaded by a second density sample toward the sun.
 */

const VERT = `
attribute vec2 a_pos;
varying vec2 v_uv;
void main() {
  v_uv = a_pos * 0.5 + 0.5;
  gl_Position = vec4(a_pos, 0.0, 1.0);
}
`;

const FRAG = `
precision highp float;
varying vec2 v_uv;

uniform vec2 u_res;
uniform float u_layer;
// The tile's width in the shader's units, and whether the layer repeats.
uniform float u_period;
uniform float u_wrap;
uniform vec3 u_cloud;
uniform vec3 u_skyTop;
uniform vec3 u_skyBottom;

const mat2 R = mat2(0.80, 0.60, -0.60, 0.80);
const float T = 37.0;

float hash(vec2 p) {
  return fract(sin(dot(p, vec2(41.31, 289.17))) * 26737.367);
}

float vnoise(vec2 p) {
  vec2 i = floor(p);
  vec2 f = fract(p);
  f = f * f * (3.0 - 2.0 * f);
  return mix(
    mix(hash(i), hash(i + vec2(1.0, 0.0)), f.x),
    mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), f.x),
    f.y
  );
}

float fbm(vec2 p) {
  float sum = 0.0;
  float amp = 0.5;
  for (int i = 0; i < 5; i++) {
    sum += amp * vnoise(p);
    p = R * p * 2.03 + 19.19;
    amp *= 0.5;
  }
  return sum;
}

float billow(vec2 p) {
  float sum = 0.0;
  float amp = 0.5;
  for (int i = 0; i < 6; i++) {
    sum += amp * (1.0 - abs(2.0 * vnoise(p) - 1.0));
    p = R * p * 2.11 + 13.37;
    amp *= 0.5;
  }
  return sum;
}

float density(vec2 p, vec2 c, vec2 r, float seed) {
  vec2 q = p - c;
  float ry = q.y > 0.0 ? r.y : r.y * 0.42;
  float env = 1.0 - length(vec2(q.x / r.x, q.y / ry));
  if (env < -0.35) return 0.0;
  vec2 dp = q * (2.4 / r.x) + seed;
  dp += 0.6 * vec2(fbm(dp * 1.4 + T * 0.04), fbm(dp * 1.4 + 7.7 - T * 0.03));
  return env + (billow(dp * 1.6) - 0.62) * 0.62;
}

// Lays one cloud over what is already there, premultiplied. On a repeating
// layer the cloud is measured from its nearest copy, so it wraps the seam.
vec4 cloud(vec4 under, vec2 p, vec2 c, vec2 r, float seed, float dist) {
  if (u_wrap > 0.5) p.x = c.x + mod(p.x - c.x + u_period * 0.5, u_period) - u_period * 0.5;
  float d = density(p, c, r, seed);
  if (d < 0.02) return under;
  float up = density(p + vec2(0.0, r.y * 0.55), c, r, seed);
  float shade = clamp((up - d) * 1.1 + d * 0.55, 0.0, 1.0);

  vec3 sky = mix(u_skyBottom, u_skyTop, v_uv.y);
  vec3 lit = u_cloud * vec3(1.04, 1.03, 1.0);
  vec3 dark = mix(u_cloud * vec3(0.6, 0.64, 0.72), sky, 0.36);
  vec3 col = mix(lit, dark, shade * 0.85);

  float rim = smoothstep(0.02, 0.14, d) * (1.0 - smoothstep(0.14, 0.40, d));
  float sunward = clamp(0.5 + (p.x - c.x) * 0.9 + (p.y - c.y) * 1.4, 0.0, 1.0);
  col += rim * mix(0.05, 0.14, sunward) * vec3(1.0, 0.97, 0.9);
  col = mix(col, sky, dist * 0.35);

  float a = smoothstep(0.02, 0.38, d) * mix(1.0, 0.8, dist);
  return vec4(col * a, a) + under * (1.0 - a);
}

void main() {
  float aspect = u_res.x / u_res.y;
  vec2 p = vec2(v_uv.x * aspect, v_uv.y);
  float w = aspect;
  vec4 c = vec4(0.0);

  if (u_layer < 0.5) {
    // Far: thin cirrus high up, and two small clouds.
    float band = smoothstep(0.55, 0.8, v_uv.y) * (1.0 - smoothstep(0.92, 1.0, v_uv.y));
    // Blended with itself one tile over, so the streaks repeat without a seam.
    float fade = p.x / u_period;
    float streak = mix(fbm(vec2(p.x * 1.6, p.y * 12.0)), fbm(vec2((p.x - u_period) * 1.6, p.y * 12.0)), fade);
    float wisp = smoothstep(0.52, 0.8, streak) * band * 0.3;
    c = vec4(u_cloud * wisp, wisp);
    c = cloud(c, p, vec2(w * 0.16, 0.82), vec2(0.20, 0.09), 43.7, 1.0);
    c = cloud(c, p, vec2(w * 0.74, 0.86), vec2(0.24, 0.10), 71.3, 0.9);
  } else if (u_layer < 1.5) {
    // Middle: one on each side, framing the words.
    c = cloud(c, p, vec2(w * 0.04, 0.56), vec2(0.34, 0.15), 17.3, 0.55);
    c = cloud(c, p, vec2(w * 0.97, 0.62), vec2(0.30, 0.14), 29.9, 0.45);
  } else {
    // Near: large and low, the bank the window rises out of.
    c = cloud(c, p, vec2(w * 0.08, 0.2), vec2(0.56, 0.24), 91.1, 0.1);
    c = cloud(c, p, vec2(w * 0.9, 0.16), vec2(0.6, 0.25), 57.2, 0.0);
    c = cloud(c, p, vec2(w * 0.52, -0.02), vec2(0.5, 0.17), 12.9, 0.2);
  }

  gl_FragColor = c;
}
`;

const SKY_TOP = [0x38 / 255, 0x76 / 255, 0xba / 255];
const SKY_BOTTOM = [0x8c / 255, 0xbf / 255, 0xe8 / 255];
const CLOUD = [0xfb / 255, 0xf8 / 255, 0xf2 / 255];

/** How far, in CSS pixels, each layer leans at the pointer's furthest reach. */
const DEPTH = [10, 22, 40];

/** How fast the repeating layers drift, in CSS pixels a second. */
const DRIFT = [12, 0, 27];

/** Paint resolution per layer, as a share of the screen's: far clouds are softest. */
const SHARPNESS = [0.32, 0.45, 0.5];

/** Which layers repeat and drift; the middle one frames the words. */
const WRAPS = [true, false, true];

function compile(gl: WebGLRenderingContext, type: number, source: string) {
  const shader = gl.createShader(type);
  if (!shader) return null;
  gl.shaderSource(shader, source);
  gl.compileShader(shader);
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    gl.deleteShader(shader);
    return null;
  }
  return shader;
}

type Layer = { tiles: HTMLCanvasElement[]; width: number; height: number; wrap: boolean };

/** Draws each layer into its canvases. Returns false without WebGL. */
function paint(layers: Layer[]) {
  const width = Math.max(...layers.map((layer) => layer.width));
  const height = Math.max(...layers.map((layer) => layer.height));
  const surface = document.createElement("canvas");
  surface.width = width;
  surface.height = height;
  const gl = surface.getContext("webgl", { alpha: true, premultipliedAlpha: true, antialias: false });
  if (!gl) return false;

  const vert = compile(gl, gl.VERTEX_SHADER, VERT);
  const frag = compile(gl, gl.FRAGMENT_SHADER, FRAG);
  const program = gl.createProgram();
  if (!vert || !frag || !program) return false;
  gl.attachShader(program, vert);
  gl.attachShader(program, frag);
  gl.bindAttribLocation(program, 0, "a_pos");
  gl.linkProgram(program);
  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) return false;
  gl.useProgram(program);

  const buffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
  gl.enableVertexAttribArray(0);
  gl.vertexAttribPointer(0, 2, gl.FLOAT, false, 0, 0);

  gl.uniform3fv(gl.getUniformLocation(program, "u_cloud"), CLOUD);
  gl.uniform3fv(gl.getUniformLocation(program, "u_skyTop"), SKY_TOP);
  gl.uniform3fv(gl.getUniformLocation(program, "u_skyBottom"), SKY_BOTTOM);
  const res = gl.getUniformLocation(program, "u_res");
  const index = gl.getUniformLocation(program, "u_layer");
  const period = gl.getUniformLocation(program, "u_period");
  const wrap = gl.getUniformLocation(program, "u_wrap");

  layers.forEach((layer, n) => {
    // Drawn in the bottom-left corner of the surface, where GL starts.
    gl.viewport(0, 0, layer.width, layer.height);
    gl.clearColor(0, 0, 0, 0);
    gl.clear(gl.COLOR_BUFFER_BIT);
    gl.uniform2f(res, layer.width, layer.height);
    gl.uniform1f(index, n);
    gl.uniform1f(period, layer.width / layer.height);
    gl.uniform1f(wrap, layer.wrap ? 1 : 0);
    gl.drawArrays(gl.TRIANGLES, 0, 3);
    for (const tile of layer.tiles) {
      tile.width = layer.width;
      tile.height = layer.height;
      const context = tile.getContext("2d");
      context?.clearRect(0, 0, layer.width, layer.height);
      context?.drawImage(surface, 0, height - layer.height, layer.width, layer.height, 0, 0, layer.width, layer.height);
    }
  });

  gl.deleteBuffer(buffer);
  gl.deleteProgram(program);
  gl.deleteShader(vert);
  gl.deleteShader(frag);
  gl.getExtension("WEBGL_lose_context")?.loseContext();
  return true;
}

export function Clouds({ className }: { className?: string }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = ref.current;
    if (!root) return;
    const tracks = [...root.querySelectorAll<HTMLElement>("[data-track]")];

    // Paint at a resolution that suits soft shapes, and again only when the
    // width really changes (a phone's toolbar resizing the height does not).
    // A repeating tile is at least as wide as its layer, and wide enough that
    // the largest cloud fits inside it once.
    let painted = 0;
    const draw = () => {
      const box = root.getBoundingClientRect();
      if (!box.width || Math.abs(box.width - painted) < 24) return;
      painted = box.width;
      const ratio = Math.min(window.devicePixelRatio || 1, 2) * (box.width < 900 ? 0.8 : 1);
      const layerWidth = box.width * 1.08;
      const layerHeight = box.height * 1.08;
      const tileWidth = Math.ceil(Math.max(layerWidth, layerHeight * 1.9));
      const layers = tracks.map((track, n) => {
        const wrap = WRAPS[n] ?? false;
        const cssWidth = wrap ? tileWidth : layerWidth;
        track.style.setProperty("--tile", `${cssWidth}px`);
        track.style.setProperty("--drift", `${Math.round(tileWidth / (DRIFT[n] || 1))}s`);
        const scale = ratio * (SHARPNESS[n] ?? 0.45);
        return {
          tiles: [...track.querySelectorAll("canvas")],
          width: Math.round(cssWidth * scale),
          height: Math.round(layerHeight * scale),
          wrap,
        };
      });
      if (paint(layers)) root.dataset.painted = "";
    };
    let timer = 0;
    const resize = new ResizeObserver(() => {
      window.clearTimeout(timer);
      timer = window.setTimeout(draw, painted ? 250 : 0);
    });
    resize.observe(root);

    // The drift stops while the sky is out of sight.
    const sight = new IntersectionObserver(([entry]) => {
      root.toggleAttribute("data-away", !entry?.isIntersecting);
    });
    sight.observe(root);

    // Parallax, eased, and only while the pointer is moving.
    const fine = window.matchMedia("(pointer: fine)").matches;
    const still = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const aim = { x: 0, y: 0 };
    const now = { x: 0, y: 0 };
    let frame = 0;
    const step = () => {
      now.x += (aim.x - now.x) * 0.06;
      now.y += (aim.y - now.y) * 0.06;
      root.style.setProperty("--mx", now.x.toFixed(4));
      root.style.setProperty("--my", now.y.toFixed(4));
      frame = Math.abs(aim.x - now.x) + Math.abs(aim.y - now.y) > 0.0005 ? requestAnimationFrame(step) : 0;
    };
    const move = (event: PointerEvent) => {
      aim.x = (event.clientX / window.innerWidth) * 2 - 1;
      aim.y = (event.clientY / window.innerHeight) * 2 - 1;
      if (!frame) frame = requestAnimationFrame(step);
    };
    if (fine && !still) window.addEventListener("pointermove", move, { passive: true });

    return () => {
      window.clearTimeout(timer);
      cancelAnimationFrame(frame);
      resize.disconnect();
      sight.disconnect();
      window.removeEventListener("pointermove", move);
    };
  }, []);

  return (
    <div ref={ref} className={`${styles.sky} ${className ?? ""}`} aria-hidden="true">
      {DEPTH.map((depth, index) => (
        <div key={depth} className={styles.layer} style={{ "--depth": depth, "--index": index } as CSSProperties}>
          <div className={styles.track} data-track data-wrap={WRAPS[index] || undefined}>
            <canvas />
            {WRAPS[index] ? <canvas /> : null}
          </div>
        </div>
      ))}
    </div>
  );
}
