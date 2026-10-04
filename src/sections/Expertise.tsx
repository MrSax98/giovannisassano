import { stack } from "@/content/expertise";
import { SectionHeader } from "@/components/SectionHeader";
import { Figure } from "@/components/Figure";
import { SkillGraph } from "@/visualizations/SkillGraph";

export function Expertise() {
  return (
    <section id="expertise" aria-labelledby="expertise-title" className="section-y border-rule border-t">
      <div className="shell">
        <SectionHeader
          id="expertise"
          n="02"
          label="Expertise"
          title="A dependency graph, not a list of buzzwords."
          italic={["dependency"]}
          lede="Each field on the left is what makes the ones on the right work. Select a node to see what it is used for and where it leads."
        />
        <Figure
          n={2}
          caption="Expertise as a directed structure, from mathematics to engineering. Shapes mark the four families; edges mean “is used to do”."
        >
          <SkillGraph />
        </Figure>
      </div>

      <div
        className="border-rule mt-[clamp(4rem,8vw,8rem)] overflow-hidden border-y py-5"
        aria-label="Tools in daily use"
      >
        <div className="flex w-max animate-[marquee_48s_linear_infinite] gap-12 motion-reduce:animate-none">
          {[...stack, ...stack].map((t, i) => (
            <span
              key={i}
              aria-hidden={i >= stack.length}
              className="display text-ink-2 text-[clamp(1.6rem,3vw,2.6rem)] whitespace-nowrap"
            >
              {t}
              <span className="text-signal ml-12" aria-hidden>
                ∗
              </span>
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
