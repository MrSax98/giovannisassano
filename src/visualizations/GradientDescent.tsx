"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { cssVar, useOnScreen, usePrefersReducedMotion, useTheme } from "@/animations/hooks";
import { isoSegments } from "@/lib/math";

/**
 * Fig. 3 · Gradient descent on a two-basin landscape.
 *
 *   f(x, y) = (x² − 1)² + 0.3x + 2(y − 0.3 sin 2x)²
 *
 * Two minima, a saddle between them, and a curved valley: enough structure to
 * show that the learning rate decides between convergence, oscillation and
 * divergence, and that the starting point decides which minimum you find.
 */

const XR: [number, number] = [-2, 2];
const YR: [number, number] = [-1.45, 1.45];

const f = (x: number, y: number) => {
  const u = y - 0.3 * Math.sin(2 * x);
  return (x * x - 1) ** 2 + 0.3 * x + 2 * u * u;
};
const grad = (x: number, y: number): [number, number] => {
  const u = y - 0.3 * Math.sin(2 * x);
  return [4 * x * (x * x - 1) + 0.3 - 2.4 * Math.cos(2 * x) * u, 4 * u];
};

type Run = { pts: [number, number][]; v: [number, number]; status: "running" | "converged" | "diverged" | "budget" };

export function GradientDescent() {
  const [wrapRef, onScreen] = useOnScreen<HTMLDivElement>("0px");
  const baseRef = useRef<HTMLCanvasElement>(null);
  const pathRef = useRef<HTMLCanvasElement>(null);
  const runRef = useRef<Run | null>(null);
  const sizeRef = useRef({ w: 1, h: 1 });
  const interacted = useRef(false);
  const [eta, setEta] = useState(0.08);
  const [momentum, setMomentum] = useState(false);
  const [stats, setStats] = useState({ k: 0, fx: 0, g: 0, status: "idle" as Run["status"] | "idle" });
  const reduced = usePrefersReducedMotion();
  const theme = useTheme();

  const toPx = useCallback((x: number, y: number): [number, number] => {
    const { w, h } = sizeRef.current;
    return [((x - XR[0]) / (XR[1] - XR[0])) * w, (1 - (y - YR[0]) / (YR[1] - YR[0])) * h];
  }, []);
  const toWorld = useCallback((px: number, py: number): [number, number] => {
    const { w, h } = sizeRef.current;
    return [XR[0] + (px / w) * (XR[1] - XR[0]), YR[0] + (1 - py / h) * (YR[1] - YR[0])];
  }, []);

  // Contour map, redrawn on resize and theme change only.
  const drawBase = useCallback(() => {
    const c = baseRef.current;
    const p = pathRef.current;
    const wrap = wrapRef.current;
    if (!c || !p || !wrap) return;
    const r = wrap.getBoundingClientRect();
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    sizeRef.current = { w: r.width, h: r.height };
    for (const cv of [c, p]) {
      cv.width = Math.round(r.width * dpr);
      cv.height = Math.round(r.height * dpr);
      cv.getContext("2d")!.setTransform(dpr, 0, 0, dpr, 0, 0);
    }
    const ctx = c.getContext("2d")!;
    const cols = 140;
    const rows = Math.round((cols * r.height) / r.width);
    const field = new Float32Array(cols * rows);
    let lo = Infinity;
    let hi = -Infinity;
    for (let j = 0; j < rows; j++)
      for (let i = 0; i < cols; i++) {
        const x = XR[0] + (i / (cols - 1)) * (XR[1] - XR[0]);
        const y = YR[1] - (j / (rows - 1)) * (YR[1] - YR[0]);
        const v = f(x, y);
        field[j * cols + i] = v;
        lo = Math.min(lo, v);
        hi = Math.max(hi, v);
      }
    const ink = cssVar("--ink");
    const signal = cssVar("--signal");
    const sx = r.width / (cols - 1);
    const sy = r.height / (rows - 1);
    const levels = 18;
    for (let k = 1; k <= levels; k++) {
      const t = (k / levels) ** 2.2;
      const level = lo + t * (hi - lo) * 0.6;
      const segs = isoSegments(field, cols, rows, level);
      ctx.beginPath();
      for (let s = 0; s < segs.length; s += 4) {
        ctx.moveTo(segs[s]! * sx, segs[s + 1]! * sy);
        ctx.lineTo(segs[s + 2]! * sx, segs[s + 3]! * sy);
      }
      ctx.strokeStyle = k <= 2 ? signal : ink;
      ctx.globalAlpha = k <= 2 ? 0.6 : 0.1 + 0.25 * (1 - k / levels);
      ctx.lineWidth = 1;
      ctx.stroke();
    }
    ctx.globalAlpha = 1;
  }, [wrapRef]);

  const drawPath = useCallback(() => {
    const c = pathRef.current;
    const run = runRef.current;
    if (!c) return;
    const ctx = c.getContext("2d")!;
    const { w, h } = sizeRef.current;
    ctx.clearRect(0, 0, w, h);
    if (!run) return;
    const ink = cssVar("--ink");
    const signal = cssVar("--signal");
    ctx.lineWidth = 1.4;
    ctx.strokeStyle = ink;
    ctx.beginPath();
    run.pts.forEach(([x, y], i) => {
      const [px, py] = toPx(x, y);
      if (i === 0) ctx.moveTo(px, py);
      else ctx.lineTo(px, py);
    });
    ctx.stroke();
    run.pts.forEach(([x, y], i) => {
      const [px, py] = toPx(x, y);
      ctx.fillStyle = i === run.pts.length - 1 ? signal : ink;
      ctx.beginPath();
      ctx.arc(px, py, i === 0 ? 4 : i === run.pts.length - 1 ? 4.5 : 1.8, 0, Math.PI * 2);
      ctx.fill();
    });
    // start ring
    const [sx0, sy0] = toPx(...run.pts[0]!);
    ctx.strokeStyle = ink;
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.arc(sx0, sy0, 9, 0, Math.PI * 2);
    ctx.stroke();
  }, [toPx]);

  const stepRun = useCallback(() => {
    const run = runRef.current;
    if (!run || run.status !== "running") return;
    const [x, y] = run.pts[run.pts.length - 1]!;
    const [gx, gy] = grad(x, y);
    const beta = momentum ? 0.85 : 0;
    run.v = [beta * run.v[0] - eta * gx, beta * run.v[1] - eta * gy];
    const nx = x + run.v[0];
    const ny = y + run.v[1];
    run.pts.push([nx, ny]);
    const gnorm = Math.hypot(...grad(nx, ny));
    if (!Number.isFinite(nx) || Math.abs(nx) > 4 || Math.abs(ny) > 4) run.status = "diverged";
    else if (gnorm < 2e-3 && Math.hypot(...run.v) < 1e-3) run.status = "converged";
    else if (run.pts.length > 240) run.status = "budget";
    setStats({ k: run.pts.length - 1, fx: f(nx, ny), g: gnorm, status: run.status });
  }, [eta, momentum]);

  const startAt = useCallback(
    (x: number, y: number) => {
      runRef.current = { pts: [[x, y]], v: [0, 0], status: "running" };
      setStats({ k: 0, fx: f(x, y), g: Math.hypot(...grad(x, y)), status: "running" });
      if (reduced) {
        while (runRef.current.status === "running") stepRun();
      }
      drawPath();
    },
    [drawPath, reduced, stepRun],
  );

  const randomStart = useCallback(() => {
    const x = (Math.random() * 2 - 1) * 1.8;
    const y = (Math.random() * 2 - 1) * 1.25;
    startAt(x, y);
  }, [startAt]);

  // Size + contours
  useEffect(() => {
    const wrap = wrapRef.current;
    if (!wrap) return;
    const ro = new ResizeObserver(() => {
      drawBase();
      drawPath();
    });
    ro.observe(wrap);
    return () => ro.disconnect();
  }, [drawBase, drawPath, wrapRef, theme]);

  // Animation loop: ~16 steps per second, only while on screen.
  useEffect(() => {
    if (!onScreen) return;
    if (!runRef.current) randomStart();
    const id = window.setInterval(() => {
      stepRun();
      drawPath();
    }, 60);
    // Idle demo: until someone touches it, try a new start every few seconds.
    const demo = window.setInterval(() => {
      if (!interacted.current && runRef.current?.status !== "running") randomStart();
    }, 3200);
    return () => {
      window.clearInterval(id);
      window.clearInterval(demo);
    };
  }, [onScreen, stepRun, drawPath, randomStart]);

  const onPointer = (e: React.PointerEvent<HTMLCanvasElement>) => {
    interacted.current = true;
    const r = e.currentTarget.getBoundingClientRect();
    startAt(...toWorld(e.clientX - r.left, e.clientY - r.top));
  };

  const statusText = {
    idle: "Waiting",
    running: "Descending",
    converged: "Converged to a stationary point",
    diverged: "Diverged: the step is larger than the curvature allows",
    budget: "Stopped after 240 steps",
  }[stats.status];

  return (
    <div className="grid-editorial gap-y-8">
      <div className="col-span-4 md:col-span-8 lg:col-span-8">
        <div
          ref={wrapRef}
          className="border-rule relative aspect-[4/3] w-full border md:aspect-[16/10]"
          data-cursor="Drop"
        >
          <canvas ref={baseRef} className="absolute inset-0 size-full" aria-hidden />
          <canvas
            ref={pathRef}
            onPointerDown={onPointer}
            className="absolute inset-0 size-full cursor-crosshair touch-none"
            role="img"
            aria-label="Contour map of a function with two minima. The path shows gradient descent from the chosen starting point."
          />
          <span className="label pointer-events-none absolute top-3 left-3 normal-case">
            x ∈ [−2, 2] · y ∈ [−1.45, 1.45]
          </span>
        </div>
      </div>

      <div className="col-span-4 md:col-span-8 lg:col-span-4 lg:pl-4">
        <p className="text-ink-2 font-mono text-[0.85rem]">f(x, y) = (x² − 1)² + 0.3x + 2(y − 0.3 sin 2x)²</p>
        <p className="text-ink-2 mt-4">
          Click or tap the map to drop a starting point. Each step moves against the gradient, scaled by the learning
          rate η. Small η crawls, large η oscillates across the valley, too large and it leaves the map.
        </p>

        <div className="mt-8 space-y-6">
          <label className="block">
            <span className="label flex justify-between">
              <span>
                Learning rate <span className="normal-case">η</span>
              </span>
              <span className="text-ink tabular-nums">{eta.toFixed(3)}</span>
            </span>
            <input
              type="range"
              min={0.005}
              max={0.3}
              step={0.005}
              value={eta}
              onChange={(e) => {
                interacted.current = true;
                setEta(Number(e.target.value));
              }}
              className="mt-3 w-full accent-[var(--signal)]"
            />
          </label>

          <label className="flex cursor-pointer items-center gap-3">
            <input
              type="checkbox"
              checked={momentum}
              onChange={(e) => {
                interacted.current = true;
                setMomentum(e.target.checked);
              }}
              className="size-4 accent-[var(--signal)]"
            />
            <span className="text-[0.92rem]">Heavy-ball momentum (β = 0.85)</span>
          </label>

          <button
            type="button"
            onClick={() => {
              interacted.current = true;
              randomStart();
            }}
            className="hover:border-ink inline-flex h-10 items-center rounded-full border border-[var(--rule-strong)] px-5 text-[0.88rem] transition-colors"
          >
            Random start
          </button>
        </div>

        <dl className="border-rule mt-8 grid grid-cols-3 border-t pt-4 font-mono text-[0.8rem] tabular-nums">
          <div>
            <dt className="label normal-case">k</dt>
            <dd className="mt-1">{stats.k}</dd>
          </div>
          <div>
            <dt className="label normal-case">f(xₖ)</dt>
            <dd className="mt-1">{stats.fx.toFixed(3)}</dd>
          </div>
          <div>
            <dt className="label normal-case">‖∇f‖</dt>
            <dd className="mt-1">{stats.g < 1e3 ? stats.g.toFixed(3) : "∞"}</dd>
          </div>
        </dl>
        <p
          aria-live="polite"
          className={`mt-3 text-[0.85rem] ${stats.status === "diverged" ? "text-signal" : "text-ink-3"}`}
        >
          {statusText}
        </p>
      </div>
    </div>
  );
}
