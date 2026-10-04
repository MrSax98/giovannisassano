import { SplitText } from "./SplitText";
import { Reveal } from "./Reveal";

type Props = {
  n: string;
  label: string;
  title: string;
  italic?: string[];
  lede?: string;
  id: string;
};

/**
 * Section opener: a numbered index in the margin column, a display headline,
 * an optional lede. Mirrors the "§" numbering of a technical paper.
 */
export function SectionHeader({ n, label, title, italic, lede, id }: Props) {
  return (
    <header className="grid-editorial mb-[clamp(3rem,7vw,7rem)] gap-y-6">
      <div className="col-span-4 md:col-span-2 lg:col-span-3">
        <p className="label flex items-center gap-3">
          <span className="text-signal">§ {n}</span>
          <span className="h-px w-8 bg-[var(--rule-strong)]" aria-hidden />
          <span>{label}</span>
        </p>
      </div>
      <div className="col-span-4 md:col-span-6 lg:col-span-9">
        <SplitText
          as="h2"
          id={`${id}-title`}
          text={title}
          italic={italic}
          className="display text-[clamp(2.6rem,7.2vw,7.5rem)] text-balance"
        />
        {lede && (
          <Reveal delay={0.15}>
            <p id={`${id}-lede`} className="text-ink-2 mt-8 max-w-[38rem] text-[1.08em]">
              {lede}
            </p>
          </Reveal>
        )}
      </div>
    </header>
  );
}
