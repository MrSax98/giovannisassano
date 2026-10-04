import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getProject, projects } from "@/content/projects";
import { profile, siteUrl } from "@/content/profile";
import { ProjectGlyph } from "@/visualizations/ProjectGlyph";
import { SplitText } from "@/components/SplitText";
import { Reveal, RevealGroup, RevealItem } from "@/components/Reveal";

type Params = { slug: string };

export const dynamicParams = false;

export function generateStaticParams(): Params[] {
  return projects.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  const { slug } = await params;
  const p = getProject(slug);
  if (!p) return {};
  return {
    title: p.title,
    description: p.summary,
    alternates: { canonical: `/projects/${p.slug}/` },
    openGraph: {
      type: "article",
      title: p.title,
      description: p.summary,
      url: `${siteUrl}/projects/${p.slug}/`,
      images: [{ url: "/og.png", width: 1200, height: 630 }],
    },
  };
}

export default async function ProjectPage({ params }: { params: Promise<Params> }) {
  const { slug } = await params;
  const p = getProject(slug);
  if (!p) notFound();
  const i = projects.indexOf(p);
  const next = projects[(i + 1) % projects.length]!;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "CreativeWork",
    name: p.title,
    description: p.summary,
    author: { "@type": "Person", name: profile.name, url: siteUrl },
    keywords: p.stack.join(", "),
    url: `${siteUrl}/projects/${p.slug}/`,
  };

  return (
    <article className="shell pt-32 pb-[var(--section-y)]">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <nav aria-label="Breadcrumb" className="label mb-14">
        <Link href="/#projects" className="link-ink">
          Projects
        </Link>
        <span className="mx-2">/</span>
        <span className="text-ink-2">{String(i + 1).padStart(2, "0")}</span>
      </nav>

      <header className="grid-editorial gap-y-8">
        <div className="col-span-4 md:col-span-8 lg:col-span-8">
          <p className="label mb-6">
            {p.context} · {p.kicker} · {p.year}
          </p>
          <SplitText as="h1" immediate text={p.title} className="display text-[clamp(2.8rem,7vw,7rem)] text-balance" />
          <Reveal delay={0.4}>
            <p className="text-ink-2 mt-8 max-w-[40rem] font-serif text-[clamp(1.3rem,2vw,1.8rem)] leading-snug">
              {p.summary}
            </p>
          </Reveal>
        </div>
      </header>

      <Reveal className="border-rule mt-16 border-y py-8 md:py-12" delay={0.2}>
        <ProjectGlyph kind={p.glyph} seedKey={p.slug} className="mx-auto h-[min(48vw,420px)] w-full max-w-[760px]" />
        {p.formula && (
          <p className="text-ink-2 mt-6 text-center font-mono text-[clamp(0.8rem,1.4vw,1rem)]">{p.formula}</p>
        )}
      </Reveal>

      <div className="grid-editorial mt-20 gap-y-14">
        <section className="col-span-4 md:col-span-8 lg:col-span-5" aria-labelledby="problem">
          <h2 id="problem" className="label mb-4">
            Problem
          </h2>
          <Reveal>
            <p className="text-[1.15rem] leading-relaxed">{p.problem}</p>
          </Reveal>
        </section>

        <section className="col-span-4 md:col-span-8 lg:col-span-6 lg:col-start-7" aria-labelledby="approach">
          <h2 id="approach" className="label mb-4">
            Approach
          </h2>
          <RevealGroup as="ol" className="border-rule border-t">
            {p.approach.map((a, k) => (
              <RevealItem as="li" key={k} className="border-rule grid grid-cols-[2.5rem_1fr] border-b py-4">
                <span className="text-signal font-mono text-[0.8rem]">{String(k + 1).padStart(2, "0")}</span>
                <span className="text-ink-2">{a}</span>
              </RevealItem>
            ))}
          </RevealGroup>
        </section>

        <section className="col-span-4 md:col-span-4 lg:col-span-5" aria-labelledby="stack">
          <h2 id="stack" className="label mb-4">
            Tools
          </h2>
          <ul className="flex flex-wrap gap-2">
            {p.stack.map((t) => (
              <li key={t} className="border-rule text-ink-2 rounded-full border px-3 py-1 font-mono text-[0.75rem]">
                {t}
              </li>
            ))}
          </ul>
        </section>

        {(p.outcome || p.links?.length) && (
          <section className="col-span-4 md:col-span-4 lg:col-span-6 lg:col-start-7" aria-labelledby="outcome">
            <h2 id="outcome" className="label mb-4">
              Outcome
            </h2>
            {p.outcome && <p className="text-ink-2">{p.outcome}</p>}
            {p.links && (
              <ul className="mt-4 flex gap-6">
                {p.links.map((l) => (
                  <li key={l.href}>
                    <a href={l.href} className="link-ink" target="_blank" rel="noopener">
                      {l.label}
                    </a>
                  </li>
                ))}
              </ul>
            )}
          </section>
        )}
      </div>

      <Link
        href={`/projects/${next.slug}/`}
        data-cursor="Next"
        className="group border-ink mt-[var(--section-y)] block border-t pt-8"
      >
        <span className="label">Next project</span>
        <span className="display group-hover:text-signal mt-4 block text-[clamp(2.2rem,5vw,5rem)] transition-colors">
          {next.title} <span className="inline-block transition-transform group-hover:translate-x-2">→</span>
        </span>
      </Link>
    </article>
  );
}
