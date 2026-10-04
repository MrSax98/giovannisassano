"use client";

import { motion } from "motion/react";
import { usePrefersReducedMotion } from "@/animations/hooks";
import { easeOut, inViewOnce } from "@/animations/motion";

type Props = {
  text: string;
  className?: string;
  as?: "h1" | "h2" | "h3" | "p" | "span";
  delay?: number;
  /** Words to set in italic, matched exactly. */
  italic?: string[];
  /** Animate on mount instead of on scroll (used above the fold). */
  immediate?: boolean;
  id?: string;
};

/**
 * Word-by-word masked reveal. Screen readers get the sentence once from a
 * visually hidden copy; the animated words are hidden from the accessibility tree.
 */
export function SplitText({ text, className, as = "h2", delay = 0, italic = [], immediate = false, id }: Props) {
  const reduced = usePrefersReducedMotion();
  const Tag = as;
  const words = text.split(" ");

  if (reduced) {
    return (
      <Tag id={id} className={className}>
        {words.map((w, i) => (
          <span key={i} className={italic.includes(w) ? "italic" : undefined}>
            {w}
            {i < words.length - 1 ? " " : ""}
          </span>
        ))}
      </Tag>
    );
  }

  const trigger = immediate ? { animate: "show" } : { whileInView: "show", viewport: inViewOnce };

  return (
    <Tag id={id} className={className}>
      <span className="sr-only">{text}</span>
      <motion.span
        aria-hidden
        initial="hidden"
        {...trigger}
        variants={{ hidden: {}, show: { transition: { staggerChildren: 0.045, delayChildren: delay } } }}
      >
        {words.map((w, i) => (
          <span key={i}>
            <span className="inline-block overflow-hidden pr-[0.04em] pb-[0.1em] align-top leading-[inherit]">
              <motion.span
                className={`inline-block ${italic.includes(w) ? "italic" : ""}`}
                variants={{
                  hidden: { y: "110%", rotate: 2 },
                  show: { y: "0%", rotate: 0, transition: { duration: 1, ease: easeOut } },
                }}
              >
                {w}
              </motion.span>
            </span>
            {i < words.length - 1 ? " " : ""}
          </span>
        ))}
      </motion.span>
    </Tag>
  );
}
