"use client";

import { motion } from "motion/react";
import { usePrefersReducedMotion } from "@/animations/hooks";
import { useMemo } from "react";
import type { GlyphKind } from "@/types/content";
import { gaussian, mulberry32, seedFrom } from "@/lib/random";
import { toPath } from "@/lib/math";
import { easeInOut } from "@/animations/motion";

const VW = 160;
const VH = 100;

type Mark = { d: string; tone: "ink" | "signal" | "faint"; dash?: boolean; width?: number };
type Dot = { x: number; y: number; r: number; tone: "ink" | "signal" | "faint"; hollow?: boolean };

/** Each project's "signature plot": a small, honest diagram of its core idea. */
function build(kind: GlyphKind, seed: number): { marks: Mark[]; dots: Dot[] } {
  const rand = mulberry32(seed);
  const randn = gaussian(rand);
  const marks: Mark[] = [];
  const dots: Dot[] = [];

  if (kind === "gbm") {
    // Geometric Brownian motion paths and the expected path E[S_t] = S_0 e^{μt}.
    const n = 90;
    const mu = 0.6;
    const sigma = 0.55;
    const dt = 1 / n;
    const yOf = (s: number) => 82 - (Math.log(s) + 0.9) * 34;
    for (let k = 0; k < 7; k++) {
      let s = 1;
      const pts: [number, number][] = [[10, yOf(s)]];
      for (let i = 1; i <= n; i++) {
        s *= Math.exp((mu - 0.5 * sigma * sigma) * dt + sigma * Math.sqrt(dt) * randn());
        pts.push([10 + (i / n) * 140, yOf(s)]);
      }
      marks.push({ d: toPath(pts), tone: k === 0 ? "signal" : "ink", width: k === 0 ? 1.4 : 0.8 });
    }
    const mean: [number, number][] = Array.from({ length: 30 }, (_, i) => [
      10 + (i / 29) * 140,
      yOf(Math.exp((mu * i) / 29)),
    ]);
    marks.push({ d: toPath(mean), tone: "faint", dash: true });
  }

  if (kind === "rl") {
    // Episode rewards (noisy) and their moving average climbing.
    const n = 140;
    const raw: [number, number][] = [];
    const ys: number[] = [];
    for (let i = 0; i < n; i++) {
      const t = i / (n - 1);
      const base = 1 / (1 + Math.exp(-9 * (t - 0.42)));
      const y = 86 - (base * 62 + randn() * 7 * (1 - 0.5 * t));
      ys.push(y);
      raw.push([10 + t * 140, y]);
    }
    marks.push({ d: toPath(raw), tone: "faint", width: 0.7 });
    const ma: [number, number][] = raw.map(([x], i) => {
      const w = ys.slice(Math.max(0, i - 10), i + 1);
      return [x, w.reduce((a, b) => a + b, 0) / w.length];
    });
    marks.push({ d: toPath(ma), tone: "signal", width: 1.5 });
    marks.push({ d: "M10 88L150 88", tone: "ink", width: 0.6 });
  }

  if (kind === "agents") {
    // Orchestrator routes to specialised agents; a reviewer closes the loop.
    const hub = { x: 34, y: 50 };
    const review = { x: 136, y: 50 };
    const agents = [
      { x: 86, y: 16 },
      { x: 92, y: 40 },
      { x: 88, y: 64 },
      { x: 82, y: 86 },
    ];
    for (const a of agents) {
      marks.push({ d: `M${hub.x} ${hub.y}L${a.x} ${a.y}`, tone: "ink", width: 0.8 });
      marks.push({ d: `M${a.x} ${a.y}L${review.x} ${review.y}`, tone: "faint", width: 0.8 });
      dots.push({ x: a.x, y: a.y, r: 3.2, tone: "ink", hollow: true });
    }
    marks.push({
      d: `M${review.x} ${review.y + 6}C ${review.x} 108, ${hub.x} 108, ${hub.x} ${hub.y + 7}`,
      tone: "signal",
      dash: true,
      width: 1,
    });
    dots.push({ x: hub.x, y: hub.y, r: 5.5, tone: "signal" });
    dots.push({ x: review.x, y: review.y, r: 4.2, tone: "ink" });
  }

  if (kind === "bell") {
    // Correlation E(θ) for the singlet: quantum −cos θ versus the best local model (linear).
    const xOf = (t: number) => 12 + (t / Math.PI) * 136;
    const yOf = (e: number) => 50 - e * 36;
    const q: [number, number][] = Array.from({ length: 80 }, (_, i) => {
      const t = (i / 79) * Math.PI;
      return [xOf(t), yOf(-Math.cos(t))];
    });
    marks.push({ d: `M${xOf(0)} ${yOf(-1)}L${xOf(Math.PI)} ${yOf(1)}`, tone: "ink", dash: true, width: 0.9 });
    marks.push({ d: toPath(q), tone: "signal", width: 1.5 });
    marks.push({ d: `M12 50L148 50M12 12L12 88`, tone: "faint", width: 0.6 });
    // the gap where Bell's inequality is violated
    dots.push({ x: xOf(Math.PI / 4), y: yOf(-Math.cos(Math.PI / 4)), r: 2.2, tone: "signal" });
    dots.push({ x: xOf((3 * Math.PI) / 4), y: yOf(-Math.cos((3 * Math.PI) / 4)), r: 2.2, tone: "signal" });
  }

  if (kind === "rag") {
    // Documents in an embedding space; a query retrieves its k nearest neighbours.
    const centers = [
      [44, 34],
      [110, 30],
      [92, 74],
      [36, 76],
    ];
    const pts: [number, number][] = [];
    for (let i = 0; i < 64; i++) {
      const c = centers[i % centers.length]!;
      pts.push([c[0]! + randn() * 11, c[1]! + randn() * 8]);
    }
    const q: [number, number] = [96, 58];
    const nearest = pts
      .map((p, i) => ({ i, d: Math.hypot(p[0] - q[0], p[1] - q[1]) }))
      .sort((a, b) => a.d - b.d)
      .slice(0, 5);
    const r = nearest[nearest.length - 1]!.d + 2;
    marks.push({
      d: `M${q[0] - r} ${q[1]}a${r} ${r} 0 1 0 ${2 * r} 0a${r} ${r} 0 1 0 ${-2 * r} 0`,
      tone: "faint",
      dash: true,
      width: 0.8,
    });
    for (const nb of nearest) {
      const p = pts[nb.i]!;
      marks.push({ d: `M${q[0]} ${q[1]}L${p[0]} ${p[1]}`, tone: "signal", width: 0.8 });
    }
    pts.forEach((p, i) =>
      dots.push({ x: p[0], y: p[1], r: 1.5, tone: nearest.some((n) => n.i === i) ? "ink" : "faint" }),
    );
    dots.push({ x: q[0], y: q[1], r: 3.4, tone: "signal" });
  }

  if (kind === "optim") {
    for (let k = 1; k <= 6; k++) {
      const rx = k * 11;
      const ry = k * 6;
      marks.push({
        d: `M${80 - rx} 50a${rx} ${ry} 0 1 0 ${2 * rx} 0a${rx} ${ry} 0 1 0 ${-2 * rx} 0`,
        tone: "faint",
        width: 0.6,
      });
    }
    const path: [number, number][] = [[20, 20]];
    let x = -60;
    let y = -30;
    for (let i = 0; i < 18; i++) {
      x -= 0.18 * x;
      y -= 1.7 * y * 0.6;
      path.push([80 + x, 50 + y]);
    }
    marks.push({ d: toPath(path), tone: "signal", width: 1.2 });
  }

  return { marks, dots };
}

const toneColor = { ink: "var(--ink)", signal: "var(--signal)", faint: "var(--ink-3)" } as const;

export function ProjectGlyph({
  kind,
  seedKey,
  className = "",
  play = true,
}: {
  kind: GlyphKind;
  seedKey: string;
  className?: string;
  /** When false the glyph is drawn statically (e.g. inside lists on mobile). */
  play?: boolean;
}) {
  const reduced = usePrefersReducedMotion();
  const { marks, dots } = useMemo(() => build(kind, seedFrom(seedKey)), [kind, seedKey]);
  const animate = play && !reduced;

  return (
    <motion.svg
      viewBox={`0 0 ${VW} ${VH}`}
      className={className}
      role="img"
      aria-hidden
      initial={animate ? "hidden" : false}
      whileInView="show"
      viewport={{ once: true }}
    >
      {marks.map((m, i) => (
        <motion.path
          key={i}
          d={m.d}
          fill="none"
          stroke={toneColor[m.tone]}
          strokeWidth={m.width ?? 1}
          strokeDasharray={m.dash ? "2 3" : undefined}
          strokeLinecap="round"
          strokeLinejoin="round"
          vectorEffect="non-scaling-stroke"
          opacity={m.tone === "faint" ? 0.7 : 1}
          variants={
            m.dash
              ? { hidden: { opacity: 0 }, show: { opacity: 0.8, transition: { delay: 0.6, duration: 0.8 } } }
              : {
                  hidden: { pathLength: 0, opacity: 0 },
                  show: { pathLength: 1, opacity: 1, transition: { duration: 1.4, ease: easeInOut, delay: i * 0.05 } },
                }
          }
        />
      ))}
      {dots.map((d, i) => (
        <motion.circle
          key={`d${i}`}
          cx={d.x}
          cy={d.y}
          r={d.r}
          fill={d.hollow ? "var(--paper)" : toneColor[d.tone]}
          stroke={toneColor[d.tone]}
          strokeWidth={d.hollow ? 1 : 0}
          vectorEffect="non-scaling-stroke"
          variants={{
            hidden: { scale: 0, opacity: 0 },
            show: { scale: 1, opacity: 1, transition: { delay: 0.4 + i * 0.012, duration: 0.5 } },
          }}
          style={{ transformBox: "fill-box", transformOrigin: "center" }}
        />
      ))}
    </motion.svg>
  );
}
