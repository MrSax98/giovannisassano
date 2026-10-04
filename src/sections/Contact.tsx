"use client";

import { useState } from "react";
import { profile } from "@/content/profile";
import { SplitText } from "@/components/SplitText";
import { Magnetic } from "@/components/Magnetic";
import { Reveal } from "@/components/Reveal";

export function Contact() {
  const [copied, setCopied] = useState(false);
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(profile.email);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      window.location.href = `mailto:${profile.email}`;
    }
  };

  const links = [
    { label: "LinkedIn", href: profile.links.linkedin },
    { label: "Substack", href: profile.links.substack },
    ...(profile.links.github ? [{ label: "GitHub", href: profile.links.github }] : []),
  ];

  return (
    <section id="contact" aria-labelledby="contact-title" className="shell section-y border-rule border-t">
      <p className="label flex items-center gap-3">
        <span className="text-signal">§ 07</span>
        <span className="h-px w-8 bg-[var(--rule-strong)]" aria-hidden />
        <span>Contact</span>
      </p>

      <SplitText
        as="h2"
        id="contact-title"
        text="Write to me."
        italic={["me."]}
        className="display mt-10 text-[clamp(4rem,15vw,15rem)] leading-[0.85]"
      />

      <div className="grid-editorial mt-14 gap-y-10">
        <Reveal className="col-span-4 md:col-span-5 lg:col-span-6">
          <p className="text-ink-2 max-w-[30rem] text-[1.1rem]">
            Questions about stochastic models, retrieval systems or Pavese are equally welcome. I answer within a few
            days, faster if the subject line contains an interesting equation.
          </p>
        </Reveal>

        <Reveal className="col-span-4 md:col-span-8 lg:col-span-6" delay={0.1}>
          <div className="flex flex-wrap items-center gap-3">
            <Magnetic strength={0.2}>
              <a
                href={`mailto:${profile.email}`}
                data-cursor="Mail"
                className="group bg-ink text-paper hover:bg-signal inline-flex h-14 items-center gap-3 rounded-full px-7 transition-colors"
              >
                <span className="font-mono text-[clamp(0.78rem,1.5vw,0.95rem)]">{profile.email}</span>
                <span aria-hidden className="transition-transform duration-500 group-hover:-rotate-45">
                  →
                </span>
              </a>
            </Magnetic>
            <button
              type="button"
              onClick={copy}
              className="hover:border-ink h-14 rounded-full border border-[var(--rule-strong)] px-5 text-[0.88rem] transition-colors"
            >
              <span aria-live="polite">{copied ? "Copied" : "Copy address"}</span>
            </button>
          </div>

          <ul className="mt-10 flex flex-wrap gap-x-8 gap-y-3">
            {links.map((l) => (
              <li key={l.label}>
                <a href={l.href} target="_blank" rel="noopener me" className="link-ink text-[1.05rem]">
                  {l.label}
                </a>
              </li>
            ))}
            <li className="text-ink-3">{profile.location}</li>
          </ul>
        </Reveal>
      </div>
    </section>
  );
}
