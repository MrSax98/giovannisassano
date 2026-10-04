"use client";

import { useEffect, useRef, useState, useSyncExternalStore } from "react";

/** Subscribes to a media query without effects-that-set-state. */
function useMedia(query: string, serverValue = false) {
  return useSyncExternalStore(
    (cb) => {
      const mq = window.matchMedia(query);
      mq.addEventListener("change", cb);
      return () => mq.removeEventListener("change", cb);
    },
    () => window.matchMedia(query).matches,
    () => serverValue,
  );
}

/** True when the user asked the OS for less motion. False during SSR. */
export const usePrefersReducedMotion = () => useMedia("(prefers-reduced-motion: reduce)");

/** True on devices with a precise pointer that can hover (mouse, trackpad). */
export const useFinePointer = () => useMedia("(hover: hover) and (pointer: fine)");

/** Current effective theme: explicit data-theme wins over the OS setting. */
export function useTheme(): "light" | "dark" | null {
  return useSyncExternalStore(
    (cb) => {
      const mq = window.matchMedia("(prefers-color-scheme: dark)");
      mq.addEventListener("change", cb);
      const mo = new MutationObserver(cb);
      mo.observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });
      return () => {
        mq.removeEventListener("change", cb);
        mo.disconnect();
      };
    },
    () => {
      const t = document.documentElement.dataset.theme;
      if (t === "light" || t === "dark") return t;
      return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
    },
    () => null,
  );
}

/**
 * Tracks whether an element is on screen. Canvas loops use it to stop
 * computing when nobody can see them.
 */
export function useOnScreen<T extends Element>(rootMargin = "100px") {
  const ref = useRef<T>(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(([entry]) => setVisible(Boolean(entry?.isIntersecting)), { rootMargin });
    io.observe(el);
    return () => io.disconnect();
  }, [rootMargin]);
  return [ref, visible] as const;
}

/**
 * A rough device budget so lower-end phones get fewer particles.
 * Returns a multiplier in (0, 1].
 */
export function deviceBudget() {
  if (typeof window === "undefined") return 1;
  const cores = navigator.hardwareConcurrency ?? 4;
  const small = window.innerWidth < 768;
  let b = 1;
  if (small) b *= 0.5;
  if (cores <= 4) b *= 0.7;
  return b;
}

/** Reads a CSS custom property from :root, e.g. cssVar("--ink"). */
export function cssVar(name: string) {
  if (typeof window === "undefined") return "#000";
  return getComputedStyle(document.documentElement).getPropertyValue(name).trim() || "#000";
}
