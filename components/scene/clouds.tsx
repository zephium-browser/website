"use client";

import { useEffect, useRef } from "react";
import styles from "./clouds.module.css";

/*
 * The sky: Zephium's own picture (the new tab's day sky, before it is baked),
 * kept alive by one shader. The clouds breathe on a slow current; they lean
 * with the pointer by their depth (bright, low cloud is near, the open blue
 * is far); and the pointer's wake stirs them, the way a hand moves air,
 * before the air settles. The sky arrives the way the product's sky meets a
 * page: through its halftone, each cloud a field of dots that grows until it
 * is whole, the bright cloud first. When the opening ends it leaves the same
 * way, from the bottom up, into the night of the page below.
 *
 * Nothing is drawn while the sky is out of sight or fully gone. Where WebGL
 * is missing, the picture is shown plainly.
 */

const VERT = `
attribute vec2 a_pos;
void main() {
  gl_Position = vec4(a_pos, 0.0, 1.0);
}
`;

/** Steps of the pointer's wake the shader remembers. */
const WAKE = 10;

const FRAG = `
precision highp float;

uniform sampler2D u_img;
uniform vec2 u_res;
uniform vec2 u_img_size;
uniform float u_dpr;
uniform float u_time;
uniform vec2 u_lean;
uniform vec4 u_wake[${WAKE}];
uniform float u_develop;
uniform float u_exit;
uniform float u_dither;
uniform vec3 u_ground;

const mat2 R = mat2(0.8, 0.6, -0.6, 0.8);

float hash(vec2 p) {
  return fract(sin(dot(p, vec2(41.31, 289.17))) * 26737.367);
}

float noise(vec2 p) {
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
  for (int i = 0; i < 3; i++) {
    sum += amp * noise(p);
    p = R * p * 2.07 + 11.3;
    amp *= 0.5;
  }
  return sum;
}

// The screen (0..1, y down) onto the picture, covering it, a little larger
// than the screen so leaning never shows an edge. The bank stays low.
vec2 cover(vec2 s) {
  float a = u_res.x / u_res.y;
  float A = u_img_size.x / u_img_size.y;
  vec2 ratio = vec2(min(a / A, 1.0), min(A / a, 1.0));
  vec2 anchor = vec2(0.5, 0.66);
  return (s - anchor) * ratio / 1.07 + anchor;
}

// How much a colour is cloud rather than sky: bright and unsaturated.
float cloudOf(vec3 c) {
  float lum = dot(c, vec3(0.299, 0.587, 0.114));
  float sat = max(c.r, max(c.g, c.b)) - min(c.r, min(c.g, c.b));
  return smoothstep(0.55, 0.92, lum) * (1.0 - smoothstep(0.12, 0.42, sat));
}

vec3 sky(vec2 s) {
  vec2 uv = cover(s);
  // Near is low and cloudy; the open blue is far.
  float depth = mix(0.22, 1.0, cloudOf(texture2D(u_img, uv).rgb)) * mix(0.55, 1.0, s.y);

  // The pointer's wake: each recent step pushes the air it passed through.
  float a = u_res.x / u_res.y;
  vec2 push = vec2(0.0);
  for (int i = 0; i < ${WAKE}; i++) {
    vec4 w = u_wake[i];
    vec2 d = (s - w.xy) * vec2(a, 1.0);
    push += w.zw * exp(-dot(d, d) * 26.0);
  }

  float t = u_time;
  vec2 q = uv * vec2(3.2, 5.0);
  vec2 current = vec2(fbm(q + vec2(t * 0.022, 0.0)), fbm(q + vec2(7.3, -t * 0.018))) - 0.5;

  uv += current * 0.011 * depth;
  uv.x += sin(t * 0.045) * 0.004 * depth;
  uv -= u_lean * vec2(0.014, 0.009) * depth;
  uv -= push * 0.055 * depth;
  vec3 c = texture2D(u_img, uv).rgb;

  // A breath of light on the cloud the pointer passes through.
  return c + cloudOf(c) * min(length(push), 0.3) * 0.35;
}

// How much of the sky a halftone cell keeps, 0..1. Arriving, the bright
// cloud comes first and the blue after; leaving, the sky goes from the
// bottom up, the cloud holding on longest. Every cell is whole when the sky
// has arrived and nothing has left, and gone when it has, so the screen can
// be switched off at either end without a single dot changing.
float coverage(vec2 centre, float lum) {
  vec2 cell = floor(centre / (7.0 * u_dpr));
  float grain = hash(cell) * 0.35 + noise(cell * 0.09) * 0.45;
  float arrive = clamp(u_develop * 2.35 - grain - (1.0 - lum) * 0.5, 0.0, 1.0);
  float rise = 1.0 - centre.y / u_res.y + (lum - 0.6) * 0.18 + (grain - 0.4) * 0.12;
  float front = u_exit * 2.0 - 0.6;
  return min(arrive, smoothstep(front, front + 0.38, rise));
}

void main() {
  vec2 frag = vec2(gl_FragCoord.x, u_res.y - gl_FragCoord.y);
  vec3 col = sky(frag / u_res);

  if (u_dither > 0.5) {
    // The product's screen: a dot per cell, its radius from the sky's tone
    // at the cell, overlapping its neighbours as it grows to solid.
    float size = 7.0 * u_dpr;
    vec2 cell = floor(frag / size);
    float shown = 0.0;
    for (int y = -1; y <= 1; y++) {
      for (int x = -1; x <= 1; x++) {
        vec2 centre = (cell + vec2(float(x), float(y)) + 0.5) * size;
        vec3 tone = texture2D(u_img, cover(centre / u_res)).rgb;
        float lum = dot(tone, vec3(0.299, 0.587, 0.114));
        float r = size * 0.74 * sqrt(coverage(centre, lum));
        shown = max(shown, clamp(r - length(frag - centre) + 0.5, 0.0, 1.0));
      }
    }
    col = mix(u_ground, col, shown);
  }

  // A whisper of grain, so the gradients never band.
  col += (hash(frag + fract(u_time) * 61.0) - 0.5) * (2.0 / 255.0);
  gl_FragColor = vec4(col, 1.0);
}
`;

/** The page the sky dissolves into (--color-ground). */
const GROUND = [9 / 255, 9 / 255, 11 / 255];

/** Seconds the sky takes to arrive. */
const ARRIVAL = 1.9;

/** How long a step of the pointer's wake lasts, in seconds. */
const WAKE_LIFE = 1.4;

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

function picture(src: string) {
  return new Promise<HTMLImageElement>((resolve, reject) => {
    const image = new Image();
    image.decoding = "async";
    image.onload = () => resolve(image);
    image.onerror = reject;
    image.src = src;
  });
}

const easeOut = (t: number) => 1 - Math.pow(1 - Math.min(1, Math.max(0, t)), 3);

export function Clouds({ className }: { className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const root = ref.current;
    const canvas = canvasRef.current;
    // The scene writes its progress (--exit) on the stage; the sky reads it there.
    const stage = root?.parentElement;
    if (!root || !canvas || !stage) return;
    const flat = () => {
      root.dataset.flat = "";
    };

    const gl = canvas.getContext("webgl", { alpha: false, antialias: false, powerPreference: "low-power" });
    const vert = gl && compile(gl, gl.VERTEX_SHADER, VERT);
    const frag = gl && compile(gl, gl.FRAGMENT_SHADER, FRAG);
    const program = gl?.createProgram();
    if (!gl || !vert || !frag || !program) return flat();
    gl.attachShader(program, vert);
    gl.attachShader(program, frag);
    gl.bindAttribLocation(program, 0, "a_pos");
    gl.linkProgram(program);
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) return flat();
    gl.useProgram(program);

    const buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
    gl.enableVertexAttribArray(0);
    gl.vertexAttribPointer(0, 2, gl.FLOAT, false, 0, 0);

    const at = (name: string) => gl.getUniformLocation(program, name);
    const u = {
      res: at("u_res"),
      size: at("u_img_size"),
      dpr: at("u_dpr"),
      time: at("u_time"),
      lean: at("u_lean"),
      wake: at("u_wake"),
      develop: at("u_develop"),
      exit: at("u_exit"),
      dither: at("u_dither"),
    };
    gl.uniform3fv(at("u_ground"), GROUND);
    gl.uniform1i(at("u_img"), 0);

    const still = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const fine = window.matchMedia("(pointer: fine)").matches;
    const narrow = window.innerWidth < 900;

    // Soft shapes need few pixels: at most one and a half per CSS pixel, and
    // fewer if the device cannot keep up.
    let ratio = Math.min(window.devicePixelRatio || 1, 1.5) * (narrow ? 0.85 : 1);
    const size = () => {
      const box = root.getBoundingClientRect();
      const width = Math.max(1, Math.round(box.width * ratio));
      const height = Math.max(1, Math.round(box.height * ratio));
      if (canvas.width !== width || canvas.height !== height) {
        canvas.width = width;
        canvas.height = height;
      }
      gl.viewport(0, 0, width, height);
      gl.uniform2f(u.res, width, height);
      gl.uniform1f(u.dpr, ratio);
    };

    let ready = false;
    let alive = true;
    let visible = true;
    let born = 0;
    let frame = 0;
    let last = 0;
    let frames = 0;
    let slow = 0;
    let tick = 0;
    let drawnExit = -1;

    const aim = { x: 0, y: 0 };
    const lean = { x: 0, y: 0 };
    // The wake: recent steps of the pointer, as position and velocity.
    const wake = new Float32Array(WAKE * 4);
    const pace = new Float32Array(WAKE * 2);
    const ages = new Float32Array(WAKE).fill(WAKE_LIFE);
    let next = 0;
    let pointer: { x: number; y: number; t: number } | null = null;

    const readExit = () => Number.parseFloat(stage.style.getPropertyValue("--exit")) || 0;

    const draw = (time: number) => {
      frame = 0;
      if (!alive || !ready) return;
      const dt = last ? Math.min(0.05, (time - last) / 1000) : 1 / 60;
      last = time;
      if (!born) born = time;
      const age = (time - born) / 1000;

      lean.x += (aim.x - lean.x) * (1 - Math.exp(-dt * 2.4));
      lean.y += (aim.y - lean.y) * (1 - Math.exp(-dt * 2.4));
      let stirring = false;
      for (let i = 0; i < WAKE; i++) {
        ages[i] += dt;
        const life = Math.max(0, 1 - ages[i] / WAKE_LIFE);
        const fade = life * life * (3 - 2 * life);
        wake[i * 4 + 2] = pace[i * 2] * fade;
        wake[i * 4 + 3] = pace[i * 2 + 1] * fade;
        if (life > 0) stirring = true;
      }

      const exit = readExit();
      const develop = still ? 1 : easeOut(age / ARRIVAL);
      const settling = Math.abs(aim.x - lean.x) + Math.abs(aim.y - lean.y) > 0.001;
      const gone = exit > 0.999;
      // While nothing but the slow current moves, every other frame is
      // enough; the pointer, the scroll and the arrival get every frame.
      const busy = develop < 1 || stirring || settling || Math.abs(exit - drawnExit) > 0.0005;
      tick += 1;
      if (!busy && tick % 2 === 1) {
        if (visible && !still && !gone) frame = requestAnimationFrame(draw);
        return;
      }
      gl.uniform1f(u.time, still ? 0 : age + 40);
      gl.uniform2f(u.lean, lean.x, lean.y);
      gl.uniform4fv(u.wake, wake);
      gl.uniform1f(u.develop, develop);
      gl.uniform1f(u.exit, exit);
      gl.uniform1f(u.dither, develop < 1 || exit > 0.001 ? 1 : 0);
      gl.drawArrays(gl.TRIANGLES, 0, 3);
      drawnExit = exit;

      // If frames run long, draw fewer pixels; the clouds are soft anyway.
      frames += 1;
      if (dt > (busy ? 1 / 40 : 1 / 20)) slow += 1;
      if (frames === 90) {
        if (slow > 30 && ratio > 0.6) {
          ratio = Math.max(0.6, ratio * 0.75);
          size();
        }
        frames = 0;
        slow = 0;
      }

      const moving = !still && !gone;
      if (visible && (moving || develop < 1 || ((stirring || settling) && !gone))) {
        frame = requestAnimationFrame(draw);
      }
    };
    const wakeUp = () => {
      if (!frame && visible && ready && alive) {
        last = 0;
        frame = requestAnimationFrame(draw);
      }
    };

    // Once the sky is gone (or with reduced motion) it redraws only when the
    // scene moves it.
    const onScroll = () => {
      if (Math.abs(readExit() - drawnExit) > 0.0005) wakeUp();
    };

    const move = (event: PointerEvent) => {
      const box = root.getBoundingClientRect();
      const x = (event.clientX - box.left) / box.width;
      const y = (event.clientY - box.top) / box.height;
      aim.x = x * 2 - 1;
      aim.y = y * 2 - 1;
      const now = event.timeStamp;
      if (pointer && now > pointer.t) {
        const dt = Math.max(0.008, (now - pointer.t) / 1000);
        // A step is kept once the pointer has moved a little, so the wake is
        // spread along its path rather than heaped where it rests.
        const prev = (next + WAKE - 1) % WAKE;
        const dx = x - wake[prev * 4];
        const dy = y - wake[prev * 4 + 1];
        if (dx * dx + dy * dy > 0.0004 || ages[prev] > 0.12) {
          wake[next * 4] = x;
          wake[next * 4 + 1] = y;
          pace[next * 2] = Math.max(-2.5, Math.min(2.5, (x - pointer.x) / dt)) * 0.12;
          pace[next * 2 + 1] = Math.max(-2.5, Math.min(2.5, (y - pointer.y) / dt)) * 0.12;
          ages[next] = 0;
          next = (next + 1) % WAKE;
        }
      }
      pointer = { x, y, t: now };
      wakeUp();
    };

    // Resizing clears the canvas, so the sky is drawn again at once, in the
    // same frame, rather than showing a blank one.
    const resize = new ResizeObserver(() => {
      size();
      if (!ready) return;
      cancelAnimationFrame(frame);
      frame = 0;
      draw(performance.now());
    });
    const sight = new IntersectionObserver(([entry]) => {
      visible = Boolean(entry?.isIntersecting) && !document.hidden;
      wakeUp();
    });
    const onVisibility = () => {
      visible = !document.hidden && root.getBoundingClientRect().bottom > 0;
      wakeUp();
    };

    const texture = gl.createTexture();
    const source = narrow ? "/sky/day-900" : "/sky/day-1672";
    picture(`${source}.avif`)
      .catch(() => picture(`${source}.jpg`))
      .then((image) => {
        if (!alive) return;
        gl.activeTexture(gl.TEXTURE0);
        gl.bindTexture(gl.TEXTURE_2D, texture);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, image);
        gl.uniform2f(u.size, image.naturalWidth, image.naturalHeight);
        size();
        ready = true;
        stage.dataset.sky = "live";
        wakeUp();
      })
      .catch(flat);

    resize.observe(root);
    sight.observe(root);
    document.addEventListener("visibilitychange", onVisibility);
    window.addEventListener("scroll", onScroll, { passive: true });
    if (fine && !still) window.addEventListener("pointermove", move, { passive: true });

    return () => {
      alive = false;
      cancelAnimationFrame(frame);
      resize.disconnect();
      sight.disconnect();
      document.removeEventListener("visibilitychange", onVisibility);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("pointermove", move);
      gl.deleteTexture(texture);
      gl.deleteBuffer(buffer);
      gl.deleteProgram(program);
      gl.deleteShader(vert);
      gl.deleteShader(frag);
      delete stage.dataset.sky;
    };
  }, []);

  return (
    <div ref={ref} className={`${styles.sky} ${className ?? ""}`} aria-hidden="true">
      <canvas ref={canvasRef} className={styles.canvas} />
    </div>
  );
}
