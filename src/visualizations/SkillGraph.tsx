"use client";

import { AnimatePresence, motion } from "motion/react";
import { usePrefersReducedMotion } from "@/animations/hooks";
import { useMemo, useState } from "react";
import { clusters, edges, nodes } from "@/content/expertise";
import type { ExpertiseNode } from "@/types/content";
import { easeInOut, easeOut, inViewOnce } from "@/animations/motion";

const W = 100;
const H = 62;

function Shape({ n, active, dim }: { n: ExpertiseNode; active: boolean; dim: boolean }) {
  const s = active ? 1.5 : 1.1;
  const common = {
    className: "transition-[fill,opacity,stroke] duration-300",
    fill: active ? "var(--signal)" : "var(--paper)",
    stroke: active ? "var(--signal)" : "var(--ink)",
    strokeWidth: 1.2,
    vectorEffect: "non-scaling-stroke" as const,
    opacity: dim ? 0.3 : 1,
  };
  const shape = clusters[n.cluster].shape;
  if (shape === "circle") return <circle cx={n.x} cy={n.y} r={s} {...common} />;
  if (shape === "square")
    return <rect x={n.x - s * 0.9} y={n.y - s * 0.9} width={s * 1.8} height={s * 1.8} {...common} />;
  if (shape === "diamond")
    return (
      <path
        d={`M${n.x} ${n.y - s * 1.25}L${n.x + s * 1.25} ${n.y}L${n.x} ${n.y + s * 1.25}L${n.x - s * 1.25} ${n.y}Z`}
        {...common}
      />
    );
  return (
    <path
      d={`M${n.x} ${n.y - s * 1.3}L${n.x + s * 1.2} ${n.y + s * 0.9}L${n.x - s * 1.2} ${n.y + s * 0.9}Z`}
      {...common}
    />
  );
}

/**
 * Fig. 2 · Expertise as a graph. Edges read "is used to do". Selecting a node
 * lights its neighbourhood and sends small pulses outward along its edges:
 * the dependency structure is the point, not the individual labels.
 */
export function SkillGraph() {
  const reduced = usePrefersReducedMotion();
  const [selected, setSelected] = useState<string>("probability");
  const byId = useMemo(() => Object.fromEntries(nodes.map((n) => [n.id, n])), []);
  const neighbours = useMemo(() => {
    const set = new Set<string>([selected]);
    for (const [a, b] of edges) {
      if (a === selected) set.add(b);
      if (b === selected) set.add(a);
    }
    return set;
  }, [selected]);
  const current = byId[selected]!;

  return (
    <div className="grid-editorial gap-y-10">
      <div className="col-span-4 md:col-span-8 lg:col-span-8">
        <motion.div
          className="relative w-full"
          style={{ aspectRatio: `${W + 4} / ${H + 8}` }}
          initial="hidden"
          whileInView="show"
          viewport={inViewOnce}
        >
          <svg viewBox={`-2 -4 ${W + 4} ${H + 8}`} className="absolute inset-0 size-full overflow-visible" aria-hidden>
            {/* faint coordinate grid: this is a plot, not an illustration */}
            <g stroke="var(--rule)" strokeWidth={1} vectorEffect="non-scaling-stroke">
              {Array.from({ length: 11 }, (_, i) => (
                <line
                  key={`v${i}`}
                  x1={i * 10}
                  y1={-2}
                  x2={i * 10}
                  y2={H + 2}
                  vectorEffect="non-scaling-stroke"
                  strokeDasharray="1 3"
                />
              ))}
            </g>
            {edges.map(([a, b], i) => {
              const A = byId[a]!;
              const B = byId[b]!;
              const lit = a === selected || b === selected;
              return (
                <motion.line
                  key={`${a}-${b}`}
                  x1={A.x}
                  y1={A.y}
                  x2={B.x}
                  y2={B.y}
                  stroke={lit ? "var(--signal)" : "var(--ink)"}
                  strokeOpacity={lit ? 0.9 : 0.22}
                  strokeWidth={lit ? 1.4 : 1}
                  vectorEffect="non-scaling-stroke"
                  variants={
                    reduced
                      ? undefined
                      : {
                          hidden: { opacity: 0 },
                          show: { opacity: 1, transition: { duration: 0.9, ease: easeInOut, delay: 0.2 + i * 0.05 } },
                        }
                  }
                />
              );
            })}
            {!reduced &&
              edges
                .filter(([a, b]) => a === selected || b === selected)
                .map(([a, b], k) => {
                  const from = byId[a === selected ? a : b]!;
                  const to = byId[a === selected ? b : a]!;
                  return (
                    <circle key={`p-${selected}-${a}-${b}`} r={0.4} fill="var(--signal)" opacity={0.9}>
                      <animateMotion
                        dur="2.2s"
                        begin={`${k * 0.35}s`}
                        repeatCount="indefinite"
                        path={`M${from.x} ${from.y}L${to.x} ${to.y}`}
                      />
                    </circle>
                  );
                })}
            {nodes.map((n) => (
              <Shape key={n.id} n={n} active={n.id === selected} dim={!neighbours.has(n.id)} />
            ))}
          </svg>

          {/* Labels are HTML (crisp at any size) and are the interactive targets. */}
          {nodes.map((n) => {
            const right = n.x < 88;
            const lit = neighbours.has(n.id);
            return (
              <button
                key={n.id}
                type="button"
                onPointerEnter={() => setSelected(n.id)}
                onFocus={() => setSelected(n.id)}
                onClick={() => setSelected(n.id)}
                aria-pressed={n.id === selected}
                aria-controls="skill-detail"
                tabIndex={-1}
                className={`absolute rounded-sm px-1.5 py-0.5 font-mono whitespace-nowrap ${n.id === selected ? "" : "max-md:hidden"} text-[clamp(0.56rem,0.95vw,0.78rem)] tracking-tight transition-[color,opacity] duration-300 ${
                  n.id === selected ? "text-signal" : lit ? "text-ink" : "text-ink-3 opacity-60"
                }`}
                style={{
                  left: `${((n.x + 2) / (W + 4)) * 100}%`,
                  top: `${((n.y + 4) / (H + 8)) * 100}%`,
                  transform: `translate(${right ? "0.7rem" : "calc(-100% - 0.7rem)"}, -50%)`,
                }}
              >
                {n.label}
              </button>
            );
          })}
        </motion.div>

        {/* The keyboard / touch path: one chip per node, always reachable. */}
        <ul className="mt-6 flex flex-wrap gap-2" aria-label="Areas of expertise">
          {nodes.map((n) => (
            <li key={n.id}>
              <button
                type="button"
                onClick={() => setSelected(n.id)}
                onFocus={() => setSelected(n.id)}
                aria-pressed={n.id === selected}
                aria-controls="skill-detail"
                className={`rounded-full border px-3 py-1 font-mono text-[0.72rem] transition-colors ${
                  n.id === selected
                    ? "border-signal text-signal"
                    : "border-rule text-ink-2 hover:border-ink hover:text-ink"
                }`}
              >
                {n.label}
              </button>
            </li>
          ))}
        </ul>

        <ul className="mt-5 flex flex-wrap gap-x-6 gap-y-2" aria-label="Legend">
          {Object.entries(clusters).map(([k, c]) => (
            <li key={k} className="label flex items-center gap-2">
              <svg viewBox="-2 -2 4 4" className="size-2.5" aria-hidden>
                {c.shape === "circle" && <circle r={1.6} fill="none" stroke="currentColor" strokeWidth={0.6} />}
                {c.shape === "square" && (
                  <rect
                    x={-1.4}
                    y={-1.4}
                    width={2.8}
                    height={2.8}
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={0.6}
                  />
                )}
                {c.shape === "diamond" && (
                  <path d="M0-1.8L1.8 0L0 1.8L-1.8 0Z" fill="none" stroke="currentColor" strokeWidth={0.6} />
                )}
                {c.shape === "triangle" && (
                  <path d="M0-1.8L1.6 1.3L-1.6 1.3Z" fill="none" stroke="currentColor" strokeWidth={0.6} />
                )}
              </svg>
              {c.label}
            </li>
          ))}
        </ul>
      </div>

      <div className="col-span-4 md:col-span-8 lg:col-span-4">
        <div
          id="skill-detail"
          aria-live="polite"
          className="border-ink min-h-[15rem] border-t pt-5 lg:sticky lg:top-28"
        >
          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={current.id}
              initial={reduced ? false : { opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={reduced ? undefined : { opacity: 0, y: -6 }}
              transition={{ duration: 0.35, ease: easeOut }}
            >
              <p className="label">{clusters[current.cluster].label}</p>
              <h3 className="display mt-3 text-[clamp(2rem,3.4vw,3.2rem)]">{current.label}</h3>
              <p className="text-ink-2 mt-4">{current.detail}</p>
              {current.tools && (
                <ul className="mt-5 flex flex-wrap gap-2" aria-label="Tools">
                  {current.tools.map((t) => (
                    <li
                      key={t}
                      className="border-rule text-ink-2 rounded-full border px-3 py-1 font-mono text-[0.72rem]"
                    >
                      {t}
                    </li>
                  ))}
                </ul>
              )}
              <p className="label mt-6">
                Connected to{" "}
                {[...neighbours]
                  .filter((id) => id !== current.id)
                  .map((id) => byId[id]!.label)
                  .join(", ")}
              </p>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
