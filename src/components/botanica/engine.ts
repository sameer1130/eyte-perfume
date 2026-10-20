/**
 * One shared breeze for every animated scene on the page.
 *
 * A single requestAnimationFrame loop drives all subscribers so that plants
 * and particles sway together, as if the same gust were travelling across the
 * screen. Scroll velocity and pointer movement feed "gusts" that briefly
 * strengthen the wind.
 */

export type Frame = {
  /** Seconds since the engine started. */
  t: number;
  dt: number;
  /** 0 when calm, up to ~2 during a strong gust. */
  gust: number;
  /** Direction of the latest gust: 1 = left→right, -1 = right→left. */
  dir: 1 | -1;
  reduced: boolean;
};

type Subscriber = (frame: Frame) => void;

const subscribers = new Set<Subscriber>();
let raf = 0;
let last = 0;
let time = 0;
let gust = 0;
let gustTarget = 0;
let dir: 1 | -1 = 1;
let reduced = false;
let listening = false;
let lastPointer: { x: number; t: number } | null = null;

/**
 * Coherent wind field. `x` is a normalised horizontal position (0–1) so a
 * gust visibly travels across the screen rather than hitting everything at
 * once. Returns roughly -1…1.
 */
export function windAt(t: number, x: number): number {
  return (
    0.55 * Math.sin(0.85 * t - 2.4 * x) +
    0.3 * Math.sin(1.63 * t + 1.3 - 3.7 * x) +
    0.15 * Math.sin(2.9 * t + 0.7 - 1.1 * x)
  );
}

function tick(now: number) {
  const dt = last ? Math.min(0.05, (now - last) / 1000) : 1 / 60;
  last = now;
  time += dt;
  gustTarget *= Math.exp(-dt * 1.4);
  gust += (gustTarget - gust) * Math.min(1, dt * 2.5);
  const frame: Frame = { t: time, dt, gust: reduced ? 0 : gust, dir, reduced };
  subscribers.forEach((fn) => fn(frame));
  raf = requestAnimationFrame(tick);
}

function onPointerMove(e: PointerEvent) {
  const now = performance.now();
  if (lastPointer) {
    const dx = e.clientX - lastPointer.x;
    const dts = Math.max(1, now - lastPointer.t);
    const speed = Math.abs(dx) / dts; // px per ms
    if (speed > 0.6) gustBy(Math.min(0.06, speed * 0.02), dx > 0 ? 1 : -1);
  }
  lastPointer = { x: e.clientX, t: now };
}

function listen() {
  if (listening || typeof window === "undefined") return;
  listening = true;
  const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
  reduced = mq.matches;
  mq.addEventListener("change", (e) => (reduced = e.matches));
  window.addEventListener("pointermove", onPointerMove, { passive: true });
}

export function subscribe(fn: Subscriber): () => void {
  listen();
  subscribers.add(fn);
  if (subscribers.size === 1) {
    last = 0;
    raf = requestAnimationFrame(tick);
  }
  return () => {
    subscribers.delete(fn);
    if (subscribers.size === 0) cancelAnimationFrame(raf);
  };
}

/** Strengthen the breeze for a moment. */
export function gustBy(amount: number, direction?: 1 | -1) {
  gustTarget = Math.min(2, gustTarget + amount);
  if (direction) dir = direction;
}

export function isReducedMotion() {
  return reduced;
}
