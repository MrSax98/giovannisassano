"use client";

import { useSyncExternalStore } from "react";
import { now } from "@/content/now";
import { SectionHeader } from "@/components/SectionHeader";
import { RevealGroup, RevealItem } from "@/components/Reveal";

const HALF_LIFE_DAYS = 90;

/**
 * A "now" list with an honest expiry: its truth decays with a half-life of
 * three months, computed in the visitor's browser from the update date.
 */
function Freshness() {
  // Age in whole days, read on the client only (the static HTML has no "today").
  const age = useSyncExternalStore(
    () => () => {},
    () => Math.max(0, Math.floor((Date.now() - new Date(`${now.updated}T12:00:00`).getTime()) / 86_400_000)),
    () => null,
  );
  const truth = age === null ? 1 : Math.pow(0.5, age / HALF_LIFE_DAYS);
  const date = new Date(`${now.updated}T12:00:00`).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
  return (
    <div className="border-ink border-t pt-5">
      <p className="label">Last updated</p>
      <p className="display mt-2 text-[2rem]">
        <time dateTime={now.updated}>{date}</time>
      </p>
      <div className="mt-6" aria-hidden>
        <div className="h-px w-full bg-[var(--rule)]">
          <div className="bg-signal h-px transition-[width] duration-1000" style={{ width: `${truth * 100}%` }} />
        </div>
      </div>
      <p className="text-ink-3 mt-3 text-[0.85rem]">
        Half-life of about three months. {age === null ? "" : `Estimated still true: ${(truth * 100).toFixed(0)}%.`}
      </p>
    </div>
  );
}

export function Now() {
  return (
    <section id="now" aria-labelledby="now-title" className="shell section-y border-rule border-t">
      <SectionHeader
        id="now"
        n="05"
        label="Now"
        title="What has my attention this season."
        italic={["this", "season."]}
      />
      <div className="grid-editorial gap-y-12">
        <div className="col-span-4 md:col-span-8 lg:col-span-3">
          <div className="lg:sticky lg:top-28">
            <Freshness />
          </div>
        </div>
        <RevealGroup as="ol" className="col-span-4 md:col-span-8 lg:col-span-8 lg:col-start-5">
          {now.items.map((item) => (
            <RevealItem
              as="li"
              key={item.what}
              className="border-rule first:border-t-ink grid grid-cols-1 gap-2 border-b py-7 first:border-t md:grid-cols-[10rem_1fr] md:gap-8"
            >
              <span className="label pt-2">{item.verb}</span>
              <span>
                <span className="display block text-[clamp(1.6rem,2.8vw,2.6rem)] leading-[1.05]">{item.what}</span>
                {item.note && <span className="text-ink-2 mt-2 block text-[0.92rem]">{item.note}</span>}
              </span>
            </RevealItem>
          ))}
        </RevealGroup>
      </div>
    </section>
  );
}
