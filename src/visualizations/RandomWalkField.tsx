"use client";

import { useEffect, useRef } from "react";
import { cssVar, deviceBudget } from "@/animations/hooks";
import { gaussian, mulberry32 } from "@/lib/random";
import { EwMoments, normalPdf } from "@/lib/math";

/**
 * Fig. 1 · The central limit theorem, live.
 *
 * Walkers start at t = 0 and take independent Gaussian steps. When they reach
 * t = T their final position lands in a histogram, which converges to the
 * normal density predicted by theory (drawn in the signal colour). The pointer
 * sets the drift μ: move it up or down and the whole distribution follows,
 * with the empirical histogram lagging the theory as any estimator would.
 *
 * Rendering: three layers on two canvases.
 *  - ghost:   finished paths accumulate at very low alpha and slowly fade,
 *             producing the fan chart of the process;
 *  - live:    current paths, redrawn from their (decimated) history;
 *  - overlay: histogram, theoretical density, axes. Cleared every frame.
 */

type Walker = { x: number; y: number; pts: number[]; accent: boolean; tick: number };

type Layout = {
  w: number;
  h: number;
  x0: number;
  x1: number;
  histX: number;
  histW: number;
  y0: number;
  top: number;
  bottom: number;
};

const STEPS = 240; // steps from t = 0 to t = T
const DECIMATE = 3; // store one history point every n steps
const BIN = 5; // histogram bin height in CSS px

export function RandomWalkField({
  layout: layoutFn,
  readoutRef,
  pointerTarget,
}: {
  /** Maps the canvas size to the drawing layout (lets the hero choose per breakpoint). */
  layout: (w: number, h: number) => Layout;
  /** Optional element whose text is replaced with live estimates. */
  readoutRef?: React.RefObject<HTMLElement | null>;
  /** Element that listens for pointer movement (defaults to the canvas box). */
  pointerTarget?: React.RefObject<HTMLElement | null>;
}) {
  const boxRef = useRef<HTMLDivElement>(null);
  const ghostRef = useRef<HTMLCanvasElement>(null);
  const liveRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const box = boxRef.current;
    const ghostC = ghostRef.current;
    const liveC = liveRef.current;
    if (!box || !ghostC || !liveC) return;
    const ghost = ghostC.getContext("2d");
    const live = liveC.getContext("2d");
    if (!ghost || !live) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const rand = mulberry32(20260909);
    const randn = gaussian(rand);

    let L: Layout = layoutFn(1, 1);
    let dpr = 1;
    let walkers: Walker[] = [];
    let bins = new Float32Array(1);
    let sigma = 1; // per-step volatility (px)
    let mu = 0; // per-step drift (px)
    let muTarget = 0;
    let landed = 0;
    const moments = new EwMoments(0.003);
    let colors = readColors();
    let raf = 0;
    let running = false;
    let frame = 0;

    function readColors() {
      return {
        ink: cssVar("--ink"),
        ink3: cssVar("--ink-3"),
        rule: cssVar("--rule-strong"),
        signal: cssVar("--signal"),
      };
    }

    function count() {
      const base = L.w < 768 ? 70 : 170;
      return Math.max(36, Math.round(base * deviceBudget() * (L.w < 768 ? 2 : 1)));
    }

    function spawn(w: Walker, scatter = false) {
      w.x = L.x0;
      w.y = L.y0;
      w.pts = [L.x0, L.y0];
      w.tick = 0;
      if (scatter) {
        // Pre-advance so the field starts populated instead of as one front.
        const k = Math.floor(rand() * STEPS);
        for (let i = 0; i < k; i++) step(w, false);
      }
    }

    function step(w: Walker, record = true) {
      const dx = (L.x1 - L.x0) / STEPS;
      w.x += dx;
      w.y += mu + sigma * randn();
      w.tick++;
      if (w.tick % DECIMATE === 0) w.pts.push(w.x, w.y);
      if (w.x >= L.x1 - 1e-6) {
        land(w, record);
        spawn(w);
      }
    }

    function land(w: Walker, record: boolean) {
      const i = Math.floor((w.y - L.top) / BIN);
      if (i >= 0 && i < bins.length) bins[i] = (bins[i] ?? 0) + 1;
      landed++;
      const sdT = sigma * Math.sqrt(STEPS);
      moments.push((L.y0 - w.y) / sdT); // standardised, upward = positive
      if (record) drawGhost(w);
    }

    function drawGhost(w: Walker) {
      ghost!.beginPath();
      const p = w.pts;
      ghost!.moveTo(p[0]!, p[1]!);
      for (let i = 2; i < p.length; i += 2) ghost!.lineTo(p[i]!, p[i + 1]!);
      ghost!.lineTo(w.x, w.y);
      ghost!.strokeStyle = w.accent ? colors.signal : colors.ink;
      ghost!.globalAlpha = w.accent ? 0.09 : 0.035;
      ghost!.lineWidth = 0.8;
      ghost!.stroke();
      ghost!.globalAlpha = 1;
    }

    function resize() {
      const r = box!.getBoundingClientRect();
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      for (const c of [ghostC!, liveC!]) {
        c.width = Math.max(1, Math.round(r.width * dpr));
        c.height = Math.max(1, Math.round(r.height * dpr));
      }
      ghost!.setTransform(dpr, 0, 0, dpr, 0, 0);
      live!.setTransform(dpr, 0, 0, dpr, 0, 0);
      ghost!.lineJoin = live!.lineJoin = "round";
      L = layoutFn(r.width, r.height);
      sigma = (0.13 * (L.bottom - L.top)) / Math.sqrt(STEPS);
      bins = new Float32Array(Math.ceil((L.bottom - L.top) / BIN));
      walkers = Array.from({ length: count() }, (_, i) => {
        const w: Walker = { x: 0, y: 0, pts: [], accent: i % 13 === 0, tick: 0 };
        spawn(w, true);
        return w;
      });
      if (reduced) renderStatic();
    }

    function drawOverlay() {
      const c = live!;
      const sdT = sigma * Math.sqrt(STEPS);
      const meanT = L.y0 + mu * STEPS;
      const peak = 1 / (sdT * Math.sqrt(2 * Math.PI));
      const scale = (L.histW * 0.92) / peak;
      let total = 0;
      for (let i = 0; i < bins.length; i++) total += bins[i]!;

      // axes: t = 0 and t = T
      c.strokeStyle = colors.rule;
      c.lineWidth = 1;
      c.globalAlpha = 0.6;
      c.beginPath();
      c.moveTo(L.x0 + 0.5, L.top);
      c.lineTo(L.x0 + 0.5, L.bottom);
      c.stroke();
      c.setLineDash([2, 4]);
      c.beginPath();
      c.moveTo(L.x1 + 0.5, L.top);
      c.lineTo(L.x1 + 0.5, L.bottom);
      c.stroke();
      c.setLineDash([]);
      c.globalAlpha = 1;

      // histogram (empirical)
      if (total > 0) {
        c.fillStyle = colors.ink;
        c.globalAlpha = 0.55;
        for (let i = 0; i < bins.length; i++) {
          const v = bins[i]!;
          if (v <= 0) continue;
          const len = (v / total / BIN) * scale;
          c.fillRect(L.histX, L.top + i * BIN + 0.5, Math.min(len, L.histW * 1.15), BIN - 1.5);
        }
        c.globalAlpha = 1;
      }

      // density (theory)
      c.strokeStyle = colors.signal;
      c.lineWidth = 1.4;
      c.beginPath();
      for (let y = L.top; y <= L.bottom; y += 2) {
        const x = L.histX + normalPdf(y, meanT, sdT) * scale;
        if (y === L.top) c.moveTo(x, y);
        else c.lineTo(x, y);
      }
      c.stroke();

      // labels
      c.font = `500 10px ${getComputedStyle(document.body).getPropertyValue("--font-jetbrains") || "monospace"}, monospace`;
      c.fillStyle = colors.ink3;
      c.textBaseline = "top";
      c.fillText("t = 0", L.x0 + 6, L.bottom + 8);
      c.fillText("t = T", L.x1 + 6, L.bottom + 8);
      c.fillText("p(x_T)", L.histX, L.top - 16);
    }

    function drawLive() {
      const c = live!;
      c.clearRect(0, 0, L.w, L.h);
      c.lineWidth = 0.9;
      for (const w of walkers) {
        const p = w.pts;
        c.beginPath();
        c.moveTo(p[0]!, p[1]!);
        for (let i = 2; i < p.length; i += 2) c.lineTo(p[i]!, p[i + 1]!);
        c.lineTo(w.x, w.y);
        c.strokeStyle = w.accent ? colors.signal : colors.ink;
        c.globalAlpha = w.accent ? 0.75 : 0.16;
        c.stroke();
        // head
        c.globalAlpha = w.accent ? 1 : 0.5;
        c.fillStyle = w.accent ? colors.signal : colors.ink;
        c.fillRect(w.x - 1, w.y - 1, 2, 2);
      }
      c.globalAlpha = 1;
      drawOverlay();
    }

    function updateReadout() {
      const el = readoutRef?.current;
      if (!el) return;
      const sdT = sigma * Math.sqrt(STEPS);
      const muT = -(mu * STEPS) / sdT;
      el.textContent = `drift μ ${fmt(muT)} · estimate ${fmt(moments.mean)} · sd ${moments.sd.toFixed(2)} · n ${landed.toLocaleString("en-GB")}`;
    }

    function tick() {
      frame++;
      mu += (muTarget - mu) * 0.04;
      for (const w of walkers) step(w);
      // forget old samples slowly so the histogram can follow a new drift
      for (let i = 0; i < bins.length; i++) bins[i]! *= 0.9965;
      if (frame % 40 === 0) {
        ghost!.globalCompositeOperation = "destination-out";
        ghost!.fillStyle = "rgba(0,0,0,0.06)";
        ghost!.fillRect(0, 0, L.w, L.h);
        ghost!.globalCompositeOperation = "source-over";
      }
      drawLive();
      if (frame % 10 === 0) updateReadout();
      raf = requestAnimationFrame(tick);
    }

    function renderStatic() {
      // Reduced motion: compute a mature state once and paint it, no loop.
      ghost!.clearRect(0, 0, L.w, L.h);
      for (let k = 0; k < STEPS * 4; k++) for (const w of walkers) step(w, k > STEPS * 3);
      drawLive();
      updateReadout();
    }

    function start() {
      if (running || reduced) return;
      running = true;
      raf = requestAnimationFrame(tick);
    }
    function stop() {
      running = false;
      cancelAnimationFrame(raf);
    }

    // pointer → drift
    const target = pointerTarget?.current ?? box;
    const onMove = (e: PointerEvent) => {
      const r = box.getBoundingClientRect();
      const y = e.clientY - r.top;
      const offset = Math.max(-1, Math.min(1, (y - L.y0) / ((L.bottom - L.top) / 2)));
      muTarget = (offset * 0.32 * (L.bottom - L.top)) / STEPS;
    };
    const onLeave = () => (muTarget = 0);
    target.addEventListener("pointermove", onMove, { passive: true });
    target.addEventListener("pointerleave", onLeave);

    const ro = new ResizeObserver(() => resize());
    ro.observe(box);
    resize();

    const io = new IntersectionObserver(([e]) => (e?.isIntersecting && !document.hidden ? start() : stop()));
    // Start simulating only once the browser is idle, so the first paint and
    // the text of the hero are never competing with the particle system.
    const idle = window.requestIdleCallback ?? ((cb: () => void) => window.setTimeout(cb, 300));
    const idleId = idle(() => io.observe(box), { timeout: 1200 });
    const onVis = () => (document.hidden ? stop() : start());
    document.addEventListener("visibilitychange", onVis);

    const mo = new MutationObserver(() => {
      colors = readColors();
      ghost.clearRect(0, 0, L.w, L.h);
      if (reduced) renderStatic();
    });
    mo.observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });
    const mq = window.matchMedia("(prefers-color-scheme: dark)");
    const onScheme = () => {
      colors = readColors();
      ghost.clearRect(0, 0, L.w, L.h);
    };
    mq.addEventListener("change", onScheme);

    return () => {
      stop();
      (window.cancelIdleCallback ?? window.clearTimeout)(idleId as number);
      ro.disconnect();
      io.disconnect();
      mo.disconnect();
      mq.removeEventListener("change", onScheme);
      document.removeEventListener("visibilitychange", onVis);
      target.removeEventListener("pointermove", onMove);
      target.removeEventListener("pointerleave", onLeave);
    };
  }, [layoutFn, readoutRef, pointerTarget]);

  return (
    <div ref={boxRef} className="absolute inset-0" aria-hidden>
      <canvas ref={ghostRef} className="absolute inset-0 size-full" />
      <canvas ref={liveRef} className="absolute inset-0 size-full" />
    </div>
  );
}

const fmt = (v: number) => (v >= 0 ? "+" : "−") + Math.abs(v).toFixed(2);

export type { Layout as WalkLayout };
