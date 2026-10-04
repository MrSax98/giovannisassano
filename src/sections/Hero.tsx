"use client";

import { motion, useScroll, useTransform } from "motion/react";
import { usePrefersReducedMotion } from "@/animations/hooks";
import { useRef } from "react";
import { profile } from "@/content/profile";
import { Magnetic } from "@/components/Magnetic";
import { RandomWalkField, type WalkLayout } from "@/visualizations/RandomWalkField";

/** Desktop: the field lives to the right of the text. Smaller screens: its own band. */
function heroLayout(w: number, h: number): WalkLayout {
  if (w >= 1024) {
    // Align the field with the content shell so ultrawide screens keep proportions.
    const cw = Math.min(w, 1760);
    const ox = (w - cw) / 2;
    const histW = Math.min(0.11 * cw, 220);
    const x1 = ox + cw - histW - Math.max(56, 0.05 * cw);
    return {
      w,
      h,
      x0: ox + Math.max(0.47 * cw, 540),
      x1,
      histX: x1 + 12,
      histW,
      y0: 0.5 * h,
      top: 0.2 * h,
      bottom: 0.8 * h,
    };
  }
  const histW = 0.2 * w;
  const x1 = w - histW - 24;
  return { w, h, x0: 16, x1, histX: x1 + 8, histW, y0: 0.5 * h, top: 0.12 * h, bottom: 0.84 * h };
}

export function Hero() {
  const section = useRef<HTMLElement>(null);
  const readout = useRef<HTMLSpanElement>(null);
  const reduced = usePrefersReducedMotion();
  const { scrollYProgress } = useScroll({ target: section, offset: ["start start", "end start"] });
  // Parallax: text drifts up faster than the field, giving depth on exit.
  const textY = useTransform(scrollYProgress, [0, 1], ["0%", reduced ? "0%" : "-18%"]);
  const fieldOpacity = useTransform(scrollYProgress, [0, 0.8], [1, reduced ? 1 : 0.15]);

  /** CSS entrance with a staggered delay (see .enter in globals.css). */
  const fade = (d: number) => ({ style: { ["--d" as string]: `${d}s` } as React.CSSProperties });
  const words = ["Giovanni", "Sassano"];

  return (
    <section
      ref={section}
      aria-labelledby="hero-title"
      className="relative flex min-h-[100svh] flex-col pt-24 lg:min-h-[max(100svh,720px)] lg:pt-0"
    >
      <motion.div
        style={{ opacity: fieldOpacity }}
        className="relative order-2 h-[52svh] min-h-[320px] lg:absolute lg:inset-0 lg:order-none lg:h-auto"
      >
        <RandomWalkField layout={heroLayout} readoutRef={readout} pointerTarget={section} />
      </motion.div>

      <motion.div
        style={{ y: textY }}
        className="shell relative z-10 order-1 flex flex-1 flex-col justify-center lg:order-none"
      >
        <div className="max-w-[min(44rem,46vw)] max-lg:max-w-none">
          <p
            className="enter label mb-8 flex flex-wrap gap-x-3 gap-y-1"
            style={{ ["--d" as string]: "0s" } as React.CSSProperties}
          >
            <span>Mathematician</span>
            <span aria-hidden>·</span>
            <span>Statistician</span>
            <span aria-hidden>·</span>
            <span className="text-ink">AI &amp; Data Engineer</span>
          </p>

          <h1 id="hero-title" className="sr-only">
            {profile.name}
          </h1>
          <p aria-hidden className="display text-[clamp(3.6rem,10.5vw,10.5rem)] leading-[0.86]">
            {words.map((w, i) => (
              <span key={w}>
                <span className="inline-block overflow-hidden pr-[0.04em] pb-[0.1em] align-top">
                  <span
                    className={`word-rise ${i === 1 ? "italic" : ""}`}
                    style={{ ["--d" as string]: `${0.1 + i * 0.08}s` } as React.CSSProperties}
                  >
                    {w}
                  </span>
                </span>{" "}
              </span>
            ))}
          </p>

          <p
            className="enter text-ink mt-8 max-w-[34rem] font-serif text-[clamp(1.35rem,2.2vw,2rem)] leading-[1.18]"
            style={{ ["--d" as string]: "0.4s" } as React.CSSProperties}
          >
            Most of what I build starts as a probability distribution and ends as a running service.
          </p>

          <p
            className="enter text-ink-2 mt-6 max-w-[32rem]"
            style={{ ["--d" as string]: "0.5s" } as React.CSSProperties}
          >
            AI &amp; Data Engineer at {profile.employer.name} {profile.employer.unit} in Bari. MSc candidate in
            Statistical Sciences at Sapienza. Mathematician by training, reader by habit.
          </p>

          <div
            className="enter mt-10 flex flex-wrap items-center gap-3"
            style={{ ["--d" as string]: "0.6s" } as React.CSSProperties}
          >
            <Magnetic>
              <a
                href="#projects"
                data-cursor="Read"
                className="group bg-ink text-paper hover:bg-signal inline-flex h-12 items-center gap-3 rounded-full px-6 text-[0.92rem] transition-colors"
              >
                Selected work
                <span aria-hidden className="transition-transform duration-500 group-hover:translate-y-0.5">
                  ↓
                </span>
              </a>
            </Magnetic>
            <Magnetic>
              <a
                href="#contact"
                className="hover:border-ink inline-flex h-12 items-center rounded-full border border-[var(--rule-strong)] px-6 text-[0.92rem] transition-colors"
              >
                Write to me
              </a>
            </Magnetic>
          </div>
        </div>
      </motion.div>

      <div
        style={fade(0.9).style}
        className="enter shell relative z-10 order-3 pt-4 pb-8 lg:absolute lg:right-0 lg:bottom-0 lg:w-auto lg:max-w-[52%] lg:pb-10"
      >
        <p className="text-ink-3 text-[0.82rem] leading-relaxed">
          <span className="text-ink-2 font-mono text-[0.7rem] tracking-[0.08em] uppercase">Fig. 1.</span> Random walks
          with independent Gaussian steps. Their endpoints pile up into the normal density the central limit theorem
          predicts (<span className="text-signal">red</span>). Move the pointer up or down to change the drift μ and
          watch the estimate follow.
        </p>
        <p className="text-ink-2 mt-2 font-mono text-[0.72rem] tabular-nums" aria-live="off">
          <span ref={readout}>drift μ +0.00 · estimate +0.00 · sd 0.00 · n 0</span>
        </p>
      </div>
    </section>
  );
}
