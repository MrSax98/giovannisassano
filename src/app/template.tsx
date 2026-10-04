"use client";

import { motion } from "motion/react";
import { usePrefersReducedMotion } from "@/animations/hooks";
import { easeOut } from "@/animations/motion";

/**
 * Page transition. A template re-mounts on every navigation, so each route
 * fades in. Opacity only: a transform here would break position: fixed
 * descendants such as the project preview plate.
 */
export default function Template({ children }: { children: React.ReactNode }) {
  const reduced = usePrefersReducedMotion();
  return (
    <motion.div
      initial={reduced ? false : { opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6, ease: easeOut }}
    >
      {children}
    </motion.div>
  );
}
