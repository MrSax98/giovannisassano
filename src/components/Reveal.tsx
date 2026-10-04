"use client";

import { motion } from "motion/react";
import { usePrefersReducedMotion } from "@/animations/hooks";
import type { ReactNode } from "react";
import { inViewOnce, rise, stagger } from "@/animations/motion";

type Props = {
  children: ReactNode;
  className?: string;
  as?: "div" | "section" | "ul" | "ol" | "li" | "p" | "figure" | "article";
  delay?: number;
};

/** Fades and lifts its content into view once. Reduced motion: static. */
export function Reveal({ children, className, as = "div", delay = 0 }: Props) {
  const reduced = usePrefersReducedMotion();
  const M = motion[as];
  if (reduced) return <M className={className}>{children}</M>;
  return (
    <M
      className={className}
      initial="hidden"
      whileInView="show"
      viewport={inViewOnce}
      variants={{
        hidden: { opacity: 0, y: 24 },
        show: { opacity: 1, y: 0, transition: { duration: 0.9, ease: [0.22, 1, 0.36, 1], delay } },
      }}
    >
      {children}
    </M>
  );
}

/** Parent that staggers its <RevealItem> children. */
export function RevealGroup({ children, className, as = "div", step = 0.07 }: Props & { step?: number }) {
  const reduced = usePrefersReducedMotion();
  const M = motion[as];
  if (reduced) return <M className={className}>{children}</M>;
  return (
    <M className={className} initial="hidden" whileInView="show" viewport={inViewOnce} variants={stagger(step)}>
      {children}
    </M>
  );
}

export function RevealItem({ children, className, as = "div" }: Props) {
  const M = motion[as];
  return (
    <M className={className} variants={rise}>
      {children}
    </M>
  );
}
