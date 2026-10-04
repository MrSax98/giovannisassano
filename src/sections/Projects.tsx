"use client";

import Link from "next/link";
import { AnimatePresence, motion, useMotionValue, useSpring } from "motion/react";
import { useState } from "react";
import { projects } from "@/content/projects";
import { SectionHeader } from "@/components/SectionHeader";
import { RevealGroup, RevealItem } from "@/components/Reveal";
import { ProjectGlyph } from "@/visualizations/ProjectGlyph";
import { useFinePointer, usePrefersReducedMotion } from "@/animations/hooks";
import { easeOut } from "@/animations/motion";
import githubRepos from "@/content/github.json";

type Repo = {
  name: string;
  description: string | null;
  url: string;
  language: string | null;
  stars: number;
  updated: string;
};

/**
 * Projects as an index, the way a journal lists its articles. On desktop the
 * row under the pointer projects its signature plot into a floating plate.
 */
export function Projects() {
  const fine = useFinePointer();
  const reduced = usePrefersReducedMotion();
  const [hovered, setHovered] = useState<number | null>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const sx = useSpring(x, { stiffness: 260, damping: 30 });
  const sy = useSpring(y, { stiffness: 260, damping: 30 });
  const preview = fine && !reduced;
  const repos = githubRepos as Repo[];

  return (
    <section id="projects" aria-labelledby="projects-title" className="shell section-y border-rule border-t">
      <SectionHeader
        id="projects"
        n="03"
        label="Projects"
        title="Selected work, each with its own equation."
        italic={["equation."]}
        lede="Work, research and study. Every entry states the problem before the tools, and none of them claims a result it cannot show."
      />

      <div
        className="relative"
        onPointerMove={(e) => {
          if (!preview) return;
          // Keep the plate on screen: flip to the left of the pointer near the edge.
          const flip = e.clientX > window.innerWidth - 360;
          x.set(flip ? e.clientX - 348 : e.clientX + 24);
          y.set(e.clientY);
        }}
        onPointerLeave={() => setHovered(null)}
      >
        <RevealGroup as="ol" className="border-ink border-t" step={0.08}>
          {projects.map((p, i) => (
            <RevealItem as="li" key={p.slug} className="border-rule border-b">
              <Link
                href={`/projects/${p.slug}/`}
                data-cursor="Open"
                onPointerEnter={() => setHovered(i)}
                onFocus={() => setHovered(i)}
                onBlur={() => setHovered(null)}
                className="group grid-editorial items-baseline gap-y-3 py-7 md:py-9"
              >
                <span className="label col-span-4 tabular-nums md:col-span-1">{String(i + 1).padStart(2, "0")}</span>
                <span className="col-span-4 md:col-span-5 lg:col-span-6">
                  <span className="display group-hover:text-signal group-focus-visible:text-signal block text-[clamp(1.75rem,3.6vw,3.4rem)] leading-[1.02] transition-[transform,color] duration-500 ease-[var(--ease-out)] group-hover:translate-x-3">
                    {p.title}
                  </span>
                  <span className="text-ink-2 mt-3 block max-w-[36rem] text-[0.95rem]">{p.summary}</span>
                </span>
                <span className="col-span-2 md:col-span-1 lg:col-span-2">
                  <span className="label block">{p.context}</span>
                  <span className="text-ink-3 mt-1 block text-[0.85rem]">{p.kicker}</span>
                </span>
                <span className="col-span-2 flex items-baseline justify-end gap-4 md:col-span-1 lg:col-span-3">
                  <span className="text-ink-3 font-mono text-[0.8rem] tabular-nums">{p.year}</span>
                  <span
                    aria-hidden
                    className="inline-block text-xl transition-transform duration-500 ease-[var(--ease-out)] group-hover:translate-x-1 group-hover:-rotate-45"
                  >
                    →
                  </span>
                </span>
                {/* Mobile and tablet: the plot sits inline. */}
                <span className="col-span-4 md:col-span-8 lg:hidden">
                  <ProjectGlyph kind={p.glyph} seedKey={p.slug} className="mt-2 h-28 w-full max-w-[22rem]" />
                </span>
              </Link>
            </RevealItem>
          ))}
        </RevealGroup>

        <AnimatePresence>
          {preview && hovered !== null && (
            <motion.div
              key="plate"
              aria-hidden
              className="border-rule bg-paper pointer-events-none fixed top-0 left-0 z-30 hidden w-[300px] -translate-y-1/2 border p-4 shadow-[0_30px_60px_-30px_rgb(0_0_0_/_0.35)] lg:block"
              style={{ x: sx, y: sy }}
              initial={{ opacity: 0, scale: 0.92, rotate: -2 }}
              animate={{ opacity: 1, scale: 1, rotate: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.35, ease: easeOut }}
            >
              <ProjectGlyph
                key={projects[hovered]!.slug}
                kind={projects[hovered]!.glyph}
                seedKey={projects[hovered]!.slug}
                className="h-[170px] w-full"
              />
              {projects[hovered]!.formula && (
                <p className="border-rule text-ink-2 mt-3 border-t pt-3 text-center font-mono text-[0.72rem]">
                  {projects[hovered]!.formula}
                </p>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {repos.length > 0 && (
        <div className="mt-20">
          <p className="label mb-5">Public repositories · synced from GitHub at build time</p>
          <ul className="border-rule grid gap-px border bg-[var(--rule)] md:grid-cols-2 lg:grid-cols-3">
            {repos.map((r) => (
              <li key={r.url} className="bg-paper">
                <a href={r.url} target="_blank" rel="noopener" className="group block h-full p-6">
                  <span className="group-hover:text-signal font-mono text-[0.9rem]">{r.name}</span>
                  {r.description && <span className="text-ink-2 mt-2 block text-[0.9rem]">{r.description}</span>}
                  <span className="label mt-4 block">
                    {[r.language, r.stars ? `★ ${r.stars}` : null].filter(Boolean).join(" · ")}
                  </span>
                </a>
              </li>
            ))}
          </ul>
        </div>
      )}
    </section>
  );
}
