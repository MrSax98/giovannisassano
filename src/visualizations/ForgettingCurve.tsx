"use client";

import { motion } from "motion/react";
import { usePrefersReducedMotion } from "@/animations/hooks";
import { toPath } from "@/lib/math";
import { easeInOut } from "@/animations/motion";

/**
 * Fig. 4 · Retention under spaced repetition.
 * Memory decays as R(t) = exp(−t / S). Each review resets R to 1 and
 * multiplies the stability S, so the next decay is slower. Reviews fall on
 * days 1, 3, 7, 14 and 30: the schedule actually used for exams.
 */
const W = 400;
const H = 160;
const DAYS = 40;
const x = (d: number) => 24 + (d / DAYS) * (W - 40);
const y = (r: number) => 16 + (1 - r) * (H - 44);

function curve(reviews: number[]) {
  const pts: [number, number][] = [];
  let S = 1.4;
  let last = 0;
  let next = 0;
  for (let t = 0; t <= DAYS; t += 0.1) {
    const day = Math.round(t * 10) / 10;
    if (next < reviews.length && day >= reviews[next]!) {
      pts.push([x(day), y(Math.exp(-(day - last) / S))]);
      last = reviews[next]!;
      S *= 2.3;
      next++;
    }
    pts.push([x(day), y(Math.exp(-(day - last) / S))]);
  }
  return pts;
}

export function ForgettingCurve({ schedule }: { schedule: number[] }) {
  const reduced = usePrefersReducedMotion();
  const spaced = toPath(curve(schedule));
  const none = toPath(curve([]));
  const v = (delay: number) =>
    reduced
      ? undefined
      : {
          hidden: { pathLength: 0, opacity: 0 },
          show: { pathLength: 1, opacity: 1, transition: { duration: 2.2, ease: easeInOut, delay } },
        };

  return (
    <motion.svg
      viewBox={`0 0 ${W} ${H}`}
      className="w-full"
      initial="hidden"
      whileInView="show"
      viewport={{ once: true }}
      role="img"
      aria-label="Retention over 40 days: without reviews it falls to near zero within a week; with reviews on days 1, 3, 7, 14 and 30 it stays high and decays more slowly after each review."
    >
      <g stroke="var(--rule)" strokeWidth={1}>
        <line x1={24} y1={y(0)} x2={W - 16} y2={y(0)} />
        <line x1={24} y1={y(1)} x2={W - 16} y2={y(1)} strokeDasharray="2 4" />
      </g>
      {schedule.map((d) => (
        <g key={d}>
          <line x1={x(d)} x2={x(d)} y1={y(1) - 4} y2={y(0)} stroke="var(--rule)" strokeDasharray="1 3" />
          <text x={x(d)} y={H - 10} textAnchor="middle" className="fill-[var(--ink-3)] font-mono text-[9px]">
            {d}
          </text>
        </g>
      ))}
      <text x={W - 16} y={H - 10} textAnchor="end" className="fill-[var(--ink-3)] font-mono text-[9px]">
        days
      </text>
      <motion.path
        d={none}
        fill="none"
        stroke="var(--ink-3)"
        strokeWidth={1}
        strokeDasharray="3 3"
        variants={
          reduced
            ? undefined
            : { hidden: { opacity: 0 }, show: { opacity: 1, transition: { duration: 1, delay: 0.2 } } }
        }
      />
      <motion.path d={spaced} fill="none" stroke="var(--signal)" strokeWidth={1.6} variants={v(0.3)} />
      <text x={x(4.2)} y={y(0.06)} className="fill-[var(--ink-3)] font-mono text-[9px]">
        no review
      </text>
      <text x={x(31)} y={y(0.9)} className="fill-[var(--signal)] font-mono text-[9px]">
        spaced
      </text>
    </motion.svg>
  );
}
