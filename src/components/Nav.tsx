"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { sections } from "@/content/site";
import { easeOut } from "@/animations/motion";
import { ThemeToggle } from "./ThemeToggle";

/** Which section is under the reading line (40% from the top). */
function useActiveSection(enabled: boolean) {
  const [active, setActive] = useState<string | null>(null);
  useEffect(() => {
    if (!enabled) return;
    const els = sections.map((s) => document.getElementById(s.id)).filter((el): el is HTMLElement => Boolean(el));
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) if (e.isIntersecting) setActive(e.target.id);
      },
      { rootMargin: "-40% 0px -59% 0px" },
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, [enabled]);
  return active;
}

export function Nav() {
  const pathname = usePathname();
  const onHome = pathname === "/";
  const active = useActiveSection(onHome);
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const menuButton = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Close the mobile index with Escape and give focus back to its button.
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false);
        menuButton.current?.focus();
      }
    };
    document.documentElement.style.overflow = "hidden";
    window.addEventListener("keydown", onKey);
    return () => {
      document.documentElement.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const href = (id: string) => (onHome ? `#${id}` : `/#${id}`);

  return (
    <>
      <header
        className={`fixed inset-x-0 top-0 z-50 transition-[background-color,border-color,backdrop-filter] duration-500 ${
          scrolled && !open
            ? "border-rule border-b bg-[color-mix(in_srgb,var(--paper)_78%,transparent)] backdrop-blur-md"
            : "border-b border-transparent"
        }`}
      >
        <nav aria-label="Primary" className="shell flex h-16 items-center justify-between gap-6">
          <Link href="/" className="group flex items-baseline gap-3">
            <span className="display text-2xl leading-none" aria-hidden>
              G.S.
            </span>
            <span className="label group-hover:text-ink sr-only transition-colors sm:not-sr-only">
              Giovanni Sassano
            </span>
          </Link>

          <ul className="hidden items-center gap-1 lg:flex">
            {sections.map((s) => {
              const isActive = active === s.id;
              return (
                <li key={s.id}>
                  <a
                    href={href(s.id)}
                    aria-current={isActive ? "location" : undefined}
                    className={`relative flex items-baseline gap-1.5 rounded-full px-3 py-1.5 text-[0.82rem] transition-colors ${
                      isActive ? "text-ink" : "text-ink-3 hover:text-ink"
                    }`}
                  >
                    <span className="font-mono text-[0.62rem] tabular-nums opacity-70">{s.n}</span>
                    {s.label}
                    {isActive && (
                      <motion.span
                        layoutId="nav-dot"
                        className="bg-signal absolute -bottom-0.5 left-1/2 size-1 -translate-x-1/2 rounded-full"
                        transition={{ type: "spring", stiffness: 380, damping: 32 }}
                      />
                    )}
                  </a>
                </li>
              );
            })}
          </ul>

          <div className="flex items-center gap-2">
            <ThemeToggle />
            <button
              ref={menuButton}
              type="button"
              className="label border-rule text-ink flex h-9 items-center gap-2 rounded-full border px-4 lg:hidden"
              aria-expanded={open}
              aria-controls="mobile-index"
              onClick={() => setOpen((o) => !o)}
            >
              {open ? "Close" : "Index"}
            </button>
          </div>
        </nav>
      </header>

      <AnimatePresence>
        {open && (
          <motion.div
            id="mobile-index"
            role="dialog"
            aria-modal="true"
            aria-label="Site index"
            className="bg-paper fixed inset-0 z-40 flex flex-col pt-16 lg:hidden"
            initial={{ clipPath: "inset(0 0 100% 0)" }}
            animate={{ clipPath: "inset(0 0 0% 0)" }}
            exit={{ clipPath: "inset(0 0 100% 0)" }}
            transition={{ duration: 0.6, ease: easeOut }}
          >
            <ol className="shell flex flex-1 flex-col justify-center gap-1">
              {sections.map((s, i) => (
                <motion.li
                  key={s.id}
                  initial={{ opacity: 0, y: 28 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.12 + i * 0.045, duration: 0.6, ease: easeOut }}
                  className="border-rule border-b"
                >
                  <a
                    href={href(s.id)}
                    onClick={() => setOpen(false)}
                    className="flex items-baseline justify-between py-3"
                  >
                    <span className="display text-[clamp(2.4rem,11vw,4.5rem)]">{s.label}</span>
                    <span className="label tabular-nums">{s.n}</span>
                  </a>
                </motion.li>
              ))}
            </ol>
            <p className="shell label pb-8">Bari · 41.1° N, 16.9° E</p>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
