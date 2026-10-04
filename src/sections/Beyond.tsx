import { favourites, library, notes } from "@/content/beyond";
import { profile } from "@/content/profile";
import { SectionHeader } from "@/components/SectionHeader";
import { Figure } from "@/components/Figure";
import { Reveal, RevealGroup, RevealItem } from "@/components/Reveal";
import { LibraryShelf } from "@/visualizations/LibraryShelf";

export function Beyond() {
  return (
    <section id="beyond" aria-labelledby="beyond-title" className="section-y border-rule bg-paper-2 border-t">
      <div className="shell">
        <SectionHeader
          id="beyond"
          n="06"
          label="Beyond data"
          title="A library is an involuntary self-portrait."
          italic={["involuntary"]}
          lede="Seneca next to Feynman, Murakami next to a manual of algebra. Not disorder: evidence that thinking does not respect shelf labels."
        />

        <Figure
          n={5}
          caption={`${library.total} volumes in ten shelves, one mark per book. Fiction leads, but philosophy and physics are tied for second, which explains a great deal.`}
        >
          <LibraryShelf />
        </Figure>

        <div className="grid-editorial mt-[clamp(5rem,9vw,9rem)] gap-y-12">
          <Reveal className="col-span-4 md:col-span-8 lg:col-span-4">
            <p className="label">Returned to most often</p>
            <ul className="border-ink mt-5 border-t">
              {favourites.map((f) => (
                <li key={f.author} className="border-rule flex items-baseline justify-between gap-4 border-b py-3">
                  <span className="display text-[1.45rem] leading-tight">{f.author}</span>
                  <span className="text-ink-3 text-right text-[0.85rem] italic">{f.work}</span>
                </li>
              ))}
            </ul>
            <p className="text-ink-2 mt-6 text-[0.92rem]">
              Essays and diaries over treatises; aphorisms over systems. I write my own in Italian on{" "}
              <a href={profile.links.substack} target="_blank" rel="noopener" className="link-ink">
                Diario di uno smarrito
              </a>
              .
            </p>
          </Reveal>

          <RevealGroup
            as="ul"
            className="border-rule col-span-4 grid gap-px self-start border bg-[var(--rule)] sm:grid-cols-2 md:col-span-8 lg:col-span-7 lg:col-start-6"
          >
            {notes.map((n) => (
              <RevealItem as="li" key={n.title} className="bg-paper-2 flex flex-col p-7">
                <span className="display text-signal text-[clamp(2.6rem,4vw,3.8rem)] leading-none">{n.figure}</span>
                <span className="label mt-6">{n.title}</span>
                <span className="text-ink-2 mt-2 text-[0.95rem]">{n.body}</span>
              </RevealItem>
            ))}
          </RevealGroup>
        </div>
      </div>
    </section>
  );
}
