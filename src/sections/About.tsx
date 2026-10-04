import { facts } from "@/content/profile";
import { SectionHeader } from "@/components/SectionHeader";
import { Reveal, RevealGroup, RevealItem } from "@/components/Reveal";

export function About() {
  return (
    <section id="about" aria-labelledby="about-title" className="shell section-y">
      <SectionHeader
        id="about"
        n="01"
        label="About"
        title="From machines that must not fail to models that admit they might."
        italic={["admit"]}
      />

      <div className="grid-editorial gap-y-14">
        <div className="col-span-4 md:col-span-6 lg:col-span-6 lg:col-start-4">
          <Reveal className="prose-editorial text-ink text-[clamp(1.08rem,1.25vw,1.3rem)] leading-[1.62]">
            <p>
              <span aria-hidden className="text-signal float-left mt-1 mr-3 font-serif text-[4.6em] leading-[0.78]">
                I
              </span>
              <span className="sr-only">I </span>started with machines that had to be right the first time: automation
              systems for oil and gas plants in Val d&apos;Agri, where a wrong bit does not open a ticket, it stops a
              plant. Then I went in the opposite direction, toward the most abstract thing I could find, and wrote my
              mathematics thesis on Bell&apos;s theorem, the exact point where probability stops being a measure of
              ignorance and becomes a property of nature.
            </p>
            <p>
              Today I work in between. At Deloitte Next Hub I design retrieval systems for language models and move data
              platforms to the cloud. In the evenings I study statistical sciences at Sapienza, because the models I put
              into production deserve someone who knows where they break.
            </p>
            <p>
              I grew up at 788 metres in Marsico Nuovo, in Basilicata, spent most of my twenties moving across Europe,
              and have lived in Bari for about a year. I read more philosophy than is strictly useful, and{" "}
              <a className="link-ink" href="https://diariodiunosmarrito.substack.com/" target="_blank" rel="noopener">
                write about it
              </a>
              , in Italian.
            </p>
          </Reveal>
        </div>

        <aside aria-label="In brief" className="col-span-4 md:col-span-8 lg:col-span-3 lg:col-start-10">
          <RevealGroup as="ul" className="border-rule border-t" step={0.05}>
            {facts.map((f, i) => (
              <RevealItem as="li" key={i} className="border-rule grid grid-cols-[5.5rem_1fr] gap-3 border-b py-3">
                <span className="label pt-[0.2em]">{f.k}</span>
                <span className="text-ink-2 text-[0.88rem] leading-snug">{f.v}</span>
              </RevealItem>
            ))}
          </RevealGroup>
        </aside>
      </div>
    </section>
  );
}
