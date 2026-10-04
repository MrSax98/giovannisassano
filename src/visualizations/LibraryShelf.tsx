"use client";

import { motion } from "motion/react";
import { usePrefersReducedMotion } from "@/animations/hooks";
import { useMemo, useState } from "react";
import { library } from "@/content/beyond";
import { mulberry32 } from "@/lib/random";
import { easeOut } from "@/animations/motion";

const SPINE = 7;
const GAP = 1.4;
const SHELF_GAP = 12;
const H = 86;

/**
 * Fig. 5 · The library as a unit chart: one mark per book, grouped by shelf.
 * Heights are random (books are), the counts are not.
 */
export function LibraryShelf() {
  const reduced = usePrefersReducedMotion();
  const [active, setActive] = useState<number | null>(null);

  const { books, width, shelfSpans } = useMemo(() => {
    const rand = mulberry32(109);
    const books: { x: number; h: number; shelf: number; tilt: number }[] = [];
    const shelfSpans: { x0: number; x1: number }[] = [];
    let x = 0;
    library.shelves.forEach((s, si) => {
      const x0 = x;
      for (let i = 0; i < s.count; i++) {
        const tilt = rand() < 0.04 && i === s.count - 1 ? -8 : 0;
        books.push({ x, h: 46 + rand() * 34, shelf: si, tilt });
        x += SPINE + GAP;
      }
      shelfSpans.push({ x0, x1: x - GAP });
      x += SHELF_GAP;
    });
    return { books, width: x - SHELF_GAP, shelfSpans };
  }, []);

  return (
    <div>
      <motion.svg
        viewBox={`-2 0 ${width + 4} ${H + 4}`}
        className="w-full"
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, margin: "0px 0px -10% 0px" }}
        aria-hidden
      >
        {books.map((b, i) => {
          const lit = active === null || active === b.shelf;
          return (
            <motion.rect
              key={i}
              x={b.x}
              y={H - b.h}
              width={SPINE}
              height={b.h}
              rx={0.6}
              fill={active === b.shelf ? "var(--signal)" : "var(--ink)"}
              opacity={lit ? (active === null ? 0.82 : 1) : 0.18}
              style={{ transformBox: "fill-box", transformOrigin: "50% 100%", rotate: b.tilt }}
              className="transition-[fill,opacity] duration-300"
              onPointerEnter={() => setActive(b.shelf)}
              onPointerLeave={() => setActive(null)}
              variants={
                reduced
                  ? undefined
                  : {
                      hidden: { scaleY: 0 },
                      show: { scaleY: 1, transition: { duration: 0.8, ease: easeOut, delay: i * 0.008 } },
                    }
              }
            />
          );
        })}
        <line
          x1={-2}
          x2={width + 2}
          y1={H + 0.5}
          y2={H + 0.5}
          stroke="var(--ink)"
          strokeWidth={1}
          vectorEffect="non-scaling-stroke"
        />
        {active !== null && shelfSpans[active] && (
          <line
            x1={shelfSpans[active].x0}
            x2={shelfSpans[active].x1}
            y1={H + 3}
            y2={H + 3}
            stroke="var(--signal)"
            strokeWidth={2}
            vectorEffect="non-scaling-stroke"
          />
        )}
      </motion.svg>

      <ul
        className="mt-6 grid grid-cols-2 gap-x-6 sm:grid-cols-3 lg:grid-cols-5"
        aria-label={`${library.total} volumes by shelf`}
      >
        {library.shelves.map((s, i) => (
          <li key={s.label}>
            <button
              type="button"
              onPointerEnter={() => setActive(i)}
              onPointerLeave={() => setActive(null)}
              onFocus={() => setActive(i)}
              onBlur={() => setActive(null)}
              className={`border-rule flex w-full items-baseline justify-between gap-3 border-b py-2 text-left text-[0.85rem] transition-colors ${
                active === i ? "text-signal" : "text-ink-2"
              }`}
            >
              <span>{s.label}</span>
              <span className="font-mono tabular-nums">{s.count}</span>
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
