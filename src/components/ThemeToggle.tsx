"use client";

import { useTheme } from "@/animations/hooks";

/**
 * Two-state toggle that starts from the OS preference. The choice is a
 * per-visitor convenience stored in localStorage (wrapped: storage can throw).
 */
export function ThemeToggle({ className = "" }: { className?: string }) {
  const mode = useTheme();

  const toggle = () => {
    const next = mode === "dark" ? "light" : "dark";
    document.documentElement.dataset.theme = next;
    try {
      localStorage.setItem("theme", next);
    } catch {
      /* private mode: the toggle still works for this page view */
    }
  };

  return (
    <button
      type="button"
      onClick={toggle}
      className={`group relative grid size-9 place-items-center rounded-full ${className}`}
      aria-label={mode === "dark" ? "Switch to light theme" : "Switch to dark theme"}
      title="Toggle theme"
    >
      {/* A half-filled disc: the moon phase of a two-state system. */}
      <svg
        viewBox="0 0 20 20"
        className="size-[18px] transition-transform duration-700 ease-[var(--ease-out)] group-hover:rotate-180"
        aria-hidden
      >
        <circle cx="10" cy="10" r="8" fill="none" stroke="currentColor" strokeWidth="1.2" />
        <path d="M10 2a8 8 0 0 1 0 16z" fill="currentColor" />
      </svg>
    </button>
  );
}
