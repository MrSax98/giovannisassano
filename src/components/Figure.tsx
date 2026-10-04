import type { ReactNode } from "react";

/**
 * Every visualisation is a numbered figure with a real caption, the way a
 * paper would print it. The caption says what is drawn and why it is there.
 */
export function Figure({
  n,
  caption,
  children,
  className = "",
  captionClassName = "",
}: {
  n: number;
  caption: ReactNode;
  children: ReactNode;
  className?: string;
  captionClassName?: string;
}) {
  return (
    <figure className={className}>
      {children}
      <figcaption className={`text-ink-3 mt-4 max-w-[46rem] text-[0.86rem] leading-relaxed ${captionClassName}`}>
        <span className="text-ink-2 font-mono text-[0.72rem] tracking-[0.08em] uppercase">Fig. {n}.</span> {caption}
      </figcaption>
    </figure>
  );
}
