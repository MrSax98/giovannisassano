import type { Transition, Variants } from "motion/react";

/**
 * Animation language. Three verbs only:
 *  - rise:   content enters from slightly below (reading direction)
 *  - draw:   lines and paths are traced, as if plotted
 *  - settle: values ease into place with a long, decelerating tail
 * One easing curve everywhere keeps the motion coherent.
 */
export const easeOut = [0.22, 1, 0.36, 1] as const;
export const easeInOut = [0.65, 0, 0.35, 1] as const;

export const settle: Transition = { duration: 0.9, ease: easeOut };

export const rise: Variants = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: settle },
};

export const stagger = (step = 0.06, delay = 0): Variants => ({
  hidden: {},
  show: { transition: { staggerChildren: step, delayChildren: delay } },
});

export const draw: Variants = {
  hidden: { pathLength: 0, opacity: 0 },
  show: { pathLength: 1, opacity: 1, transition: { duration: 1.6, ease: easeInOut } },
};

/** Viewport options shared by every reveal. */
export const inViewOnce = { once: true, margin: "0px 0px -12% 0px" } as const;
