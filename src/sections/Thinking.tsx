import { inquiries, method, writing } from "@/content/thinking";
import { SectionHeader } from "@/components/SectionHeader";
import { Figure } from "@/components/Figure";
import { Reveal, RevealGroup, RevealItem } from "@/components/Reveal";
import { GradientDescent } from "@/visualizations/GradientDescent";
import { ForgettingCurve } from "@/visualizations/ForgettingCurve";

export function Thinking() {
  return (
    <section id="thinking" aria-labelledby="thinking-title" className="shell section-y border-rule border-t">
      <SectionHeader
        id="thinking"
        n="04"
        label="Research & thinking"
        title="Open questions, and one you can play with."
        italic={["play"]}
        lede="What I study when nobody is paying for it. Optimisation comes first because it sits under almost everything else on this page."
      />

      <Figure
        n={3}
        caption="Gradient descent on a landscape with two minima and a saddle. The red contours mark the deepest basin. Where you start decides which minimum you reach: a small lesson in initialisation."
      >
        <GradientDescent />
      </Figure>

      <RevealGroup
        as="ul"
        className="border-rule mt-[clamp(5rem,10vw,10rem)] grid gap-px border bg-[var(--rule)] md:grid-cols-2 lg:grid-cols-3"
      >
        {inquiries.map((q) => (
          <RevealItem
            as="li"
            key={q.title}
            className="group bg-paper hover:bg-paper-2 p-7 transition-colors duration-500 md:p-9"
          >
            <p
              className="text-ink-3 group-hover:text-signal font-mono text-[1.15rem] transition-colors duration-500"
              aria-hidden
            >
              {q.symbol}
            </p>
            <h3 className="display mt-10 text-[clamp(1.6rem,2.2vw,2.2rem)]">{q.title}</h3>
            <p className="text-ink-2 mt-3 text-[0.95rem]">{q.body}</p>
          </RevealItem>
        ))}
      </RevealGroup>

      <div className="grid-editorial mt-[clamp(5rem,10vw,10rem)] gap-y-10">
        <Reveal className="col-span-4 md:col-span-8 lg:col-span-5">
          <p className="label">Method</p>
          <h3 className="display mt-4 text-[clamp(2rem,3.6vw,3.4rem)]">{method.title}</h3>
          <div className="prose-editorial text-ink-2 mt-6">
            {method.body.map((p) => (
              <p key={p.slice(0, 20)}>{p}</p>
            ))}
          </div>
        </Reveal>
        <div className="col-span-4 md:col-span-8 lg:col-span-6 lg:col-start-7">
          <Figure
            n={4}
            caption="Retention modelled as R(t) = exp(−t/S). Every review resets it and multiplies the stability S. Dashed: the same material, never reviewed."
          >
            <ForgettingCurve schedule={method.schedule} />
          </Figure>
        </div>
      </div>

      <div className="mt-[clamp(5rem,10vw,10rem)]">
        <p className="label mb-6">Writing</p>
        <ul className="border-ink border-t">
          {writing.map((w) => (
            <li key={w.href} className="border-rule border-b">
              <a
                href={w.href}
                target="_blank"
                rel="noopener"
                data-cursor="Read"
                className="group grid-editorial items-baseline gap-y-2 py-6"
              >
                <span className="col-span-4 md:col-span-4 lg:col-span-5">
                  <span className="display group-hover:text-signal text-[clamp(1.6rem,2.6vw,2.4rem)] transition-colors">
                    {w.title}
                  </span>
                </span>
                <span className="text-ink-2 col-span-4 text-[0.92rem] md:col-span-3 lg:col-span-5">{w.blurb}</span>
                <span className="label col-span-4 flex justify-between md:col-span-1 lg:col-span-2 lg:justify-end lg:gap-4">
                  <span>
                    {w.venue} · {w.lang.toUpperCase()}
                  </span>
                  <span aria-hidden className="transition-transform group-hover:-rotate-45">
                    ↗
                  </span>
                </span>
              </a>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
