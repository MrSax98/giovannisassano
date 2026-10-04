import type { Shelf } from "@/types/content";

/**
 * Snapshot of the personal library catalogue kept in Notion
 * ("Biblioteca · Taccuino critico"), October 2026. Update the counts by hand
 * or wire the Notion API into scripts/ if you want it automatic.
 */
export const library: { total: number; shelves: Shelf[] } = {
  total: 109,
  shelves: [
    { label: "Fiction", count: 21 },
    { label: "Philosophy & wisdom", count: 16 },
    { label: "Physics & cosmos", count: 16 },
    { label: "Biography & innovation", count: 14 },
    { label: "Method & growth", count: 11 },
    { label: "Society & power", count: 9 },
    { label: "Mathematics", count: 6 },
    { label: "Mind & psyche", count: 6 },
    { label: "Classics & epics", count: 6 },
    { label: "The warrior's way", count: 4 },
  ],
};

export const favourites = [
  { author: "Marcus Aurelius", work: "Meditations" },
  { author: "Seneca", work: "Letters to Lucilius" },
  { author: "Cesare Pavese", work: "Il mestiere di vivere" },
  { author: "Friedrich Nietzsche", work: "Human, All Too Human" },
  { author: "Dino Buzzati", work: "Il deserto dei Tartari" },
  { author: "Michel de Montaigne", work: "Essays" },
  { author: "Haruki Murakami", work: "Novels and stories" },
  { author: "Kurt Vonnegut", work: "The Sirens of Titan" },
];

export const notes = [
  {
    title: "Altitude",
    body: "Born at 788 metres in Marsico Nuovo, in the Lucanian Apennines. Mountains remain where I go to think slowly.",
    figure: "788 m",
  },
  {
    title: "Movement",
    body: "Most of my twenties were spent moving across Europe. Bari has been home for about a year, which by my standards is a long time.",
    figure: "~1 yr",
  },
  {
    title: "Service",
    body: "Rotaract Club Val d'Agri: president in 2018–19, treasurer today, Paul Harris Fellow. Also a blood donor, which is the simplest form of service I know.",
    figure: "PHF",
  },
  {
    title: "Sound",
    body: "Ten years playing Italian folk music, 2008 to 2018. It taught me more about rhythm and repetition than any course on time series.",
    figure: "10 yrs",
  },
];
