"use client";

import { motion, useMotionValue, useSpring } from "motion/react";
import { useEffect, useState } from "react";
import { useFinePointer, usePrefersReducedMotion } from "@/animations/hooks";

/**
 * A hairline ring that trails the system cursor (which stays visible: we
 * add, we never replace). It grows over interactive elements and shows a
 * short verb when an element declares data-cursor="Open" etc.
 */
export function Cursor() {
  const fine = useFinePointer();
  const reduced = usePrefersReducedMotion();
  const x = useMotionValue(-100);
  const y = useMotionValue(-100);
  const sx = useSpring(x, { stiffness: 500, damping: 40, mass: 0.4 });
  const sy = useSpring(y, { stiffness: 500, damping: 40, mass: 0.4 });
  const [hover, setHover] = useState<string | null>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (!fine || reduced) return;
    const move = (e: PointerEvent) => {
      x.set(e.clientX);
      y.set(e.clientY);
      setVisible(true);
      const t = (e.target as HTMLElement | null)?.closest<HTMLElement>("a, button, [data-cursor]");
      setHover(t ? (t.dataset.cursor ?? "") : null);
    };
    const leave = () => setVisible(false);
    window.addEventListener("pointermove", move, { passive: true });
    document.documentElement.addEventListener("pointerleave", leave);
    return () => {
      window.removeEventListener("pointermove", move);
      document.documentElement.removeEventListener("pointerleave", leave);
    };
  }, [fine, reduced, x, y]);

  if (!fine || reduced) return null;

  const size = hover === null ? 28 : hover ? 76 : 44;
  return (
    <motion.div
      aria-hidden
      className="cursor-ring border-ink/50 pointer-events-none fixed top-0 left-0 z-[80] grid place-items-center rounded-full border bg-[color-mix(in_srgb,var(--paper)_35%,transparent)] backdrop-blur-[1px]"
      style={{ x: sx, y: sy, translateX: "-50%", translateY: "-50%" }}
      animate={{ width: size, height: size, opacity: visible ? 1 : 0 }}
      transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
    >
      {hover ? <span className="label !text-ink !text-[0.6rem]">{hover}</span> : null}
    </motion.div>
  );
}
